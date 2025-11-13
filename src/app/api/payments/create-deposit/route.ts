import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyUserAuth } from '@/lib/userAuth';
import { createTapCharge } from '@/lib/tapPayment';
import { BidDepositStatus } from '@prisma/client';

const DEPOSIT_AMOUNT = 200; // SAR

// Check if test mode is enabled
const TEST_MODE = process.env.TEST_MODE === 'true' || process.env.NODE_ENV === 'development';

export async function POST(req: NextRequest) {
  try {
    const authResult = await verifyUserAuth(req);
    
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }

    const userId = authResult.user!.id;
    const { carId, testMode } = await req.json();
    
    // Allow test mode override via request
    const useTestMode = testMode === true || TEST_MODE;

    if (!carId) {
      return NextResponse.json({ 
        success: false, 
        error: 'carId is required' 
      }, { status: 400 });
    }

    // Get user details
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId.toString()) },
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Get car details
    const car = await prisma.car.findUnique({
      where: { id: parseInt(carId) },
    });

    if (!car) {
      return NextResponse.json({ 
        success: false, 
        error: 'Car not found' 
      }, { status: 404 });
    }

    // Check if deposit already exists
    const existingDeposit = await prisma.bidDeposit.findUnique({
      where: {
        userId_carId: {
          userId: parseInt(userId.toString()),
          carId: parseInt(carId),
        },
      },
    });

    if (existingDeposit && existingDeposit.status === BidDepositStatus.PAID) {
      return NextResponse.json({
        success: true,
        message: 'Deposit already paid',
        deposit: existingDeposit,
        charge: null,
      });
    }

    // Create or update deposit record
    const deposit = await prisma.bidDeposit.upsert({
      where: {
        userId_carId: {
          userId: parseInt(userId.toString()),
          carId: parseInt(carId),
        },
      },
      update: {
        status: BidDepositStatus.PENDING,
      },
      create: {
        userId: parseInt(userId.toString()),
        carId: parseInt(carId),
        amount: DEPOSIT_AMOUNT,
        status: BidDepositStatus.PENDING,
      },
    });

    // TEST MODE: Bypass payment and mark as paid immediately
    if (useTestMode) {
      console.log('🧪 TEST MODE: Bypassing payment, marking deposit as PAID');
      
      const testDeposit = await prisma.bidDeposit.update({
        where: { id: deposit.id },
        data: {
          status: BidDepositStatus.PAID,
          tapChargeId: 'test_charge_' + Date.now(),
          tapPaymentId: 'test_payment_' + Date.now(),
        },
      });

      return NextResponse.json({
        success: true,
        testMode: true,
        message: 'Test payment successful (no real payment processed)',
        deposit: {
          id: testDeposit.id,
          amount: testDeposit.amount,
          status: testDeposit.status,
        },
        charge: {
          id: testDeposit.tapChargeId,
          redirectUrl: `${req.nextUrl.origin}/auctions/${carId}?payment=success&test=true`,
          status: 'CAPTURED',
        },
      });
    }

    // Validate Tap configuration
    if (!process.env.TAP_SECRET_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tap payment gateway is not configured. Please set TAP_SECRET_KEY in environment variables.' 
      }, { status: 500 });
    }

    // Create Tap charge
    const returnUrl = `${req.nextUrl.origin}/auctions/${carId}?payment=success`;
    
    const phoneNumber = user.phone || '';
    // Tap expects country code as string without + sign
    const countryCode = '966';
    const number = phoneNumber.replace(/^\+966/, '').replace(/\D/g, '');

    // Build customer object
    const customer: any = {
      first_name: user.name || 'Customer',
      email: user.email,
    };

    // Add phone only if we have a valid number
    if (number && number.length >= 9) {
      customer.phone = {
        country_code: countryCode,
        number: number,
      };
    }

    // Build Tap charge request
    // For Tap Payments, we need to include a source for redirect-based payments
    // Using "src_all" allows customer to select payment method on Tap's page
    const chargeRequest: any = {
      amount: DEPOSIT_AMOUNT,
      currency: 'SAR',
      customer: customer,
      source: {
        id: 'src_all', // Allows customer to select payment method on Tap's payment page
      },
      redirect: {
        url: returnUrl,
      },
      description: `Bid Deposit for Car #${carId}`,
      metadata: {
        userId: userId.toString(),
        carId: carId.toString(),
        depositId: deposit.id.toString(),
        type: 'bid_deposit',
      },
    };

    // Add post URL for webhook (optional, webhooks can also be configured in dashboard)
    const webhookUrl = `${req.nextUrl.origin}/api/payments/tap-webhook`;
    if (webhookUrl.startsWith('http')) {
      chargeRequest.post = {
        url: webhookUrl,
      };
    }

    const tapCharge = await createTapCharge(chargeRequest);

    // Update deposit with Tap charge ID
    await prisma.bidDeposit.update({
      where: { id: deposit.id },
      data: {
        tapChargeId: tapCharge.id,
      },
    });

    // Extract payment redirect URL from Tap response
    // The checkout URL is in transaction.url (not redirect.url which is the return URL)
    const paymentRedirectUrl = 
      tapCharge.transaction?.url || 
      tapCharge.redirect?.url ||
      (tapCharge.transaction && typeof tapCharge.transaction === 'string' ? tapCharge.transaction : null);

    console.log('Tap charge response:', {
      id: tapCharge.id,
      status: tapCharge.status,
      redirect: tapCharge.redirect,
      transaction: tapCharge.transaction,
      extractedPaymentUrl: paymentRedirectUrl,
    });

    if (!paymentRedirectUrl) {
      console.error('No redirect URL in Tap response:', tapCharge);
      return NextResponse.json({ 
        success: false, 
        error: 'Tap payment gateway did not return a payment URL' 
      }, { status: 500 });
    }

    console.log('Returning payment URL to frontend:', paymentRedirectUrl);

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        status: deposit.status,
      },
      charge: {
        id: tapCharge.id,
        redirectUrl: paymentRedirectUrl,
        status: tapCharge.status,
      },
    });
  } catch (error: any) {
    console.error('Error creating deposit:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create deposit payment' 
    }, { status: 500 });
  }
}

