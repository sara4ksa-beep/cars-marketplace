import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyUserAuth } from '@/lib/userAuth';
import { createTapCharge } from '@/lib/tapPayment';
import { OrderStatus } from '@prisma/client';

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
    const { orderId, carId, testMode } = await req.json();
    
    // Allow test mode override via request
    const useTestMode = testMode === true || TEST_MODE;

    if (!orderId || !carId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID and Car ID are required' 
      }, { status: 400 });
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId.toString()) },
      include: {
        car: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 });
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 403 });
    }

    // Check order status
    if (order.status !== OrderStatus.PENDING) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order is not in pending status' 
      }, { status: 400 });
    }

    // TEST MODE: Bypass payment and mark order as confirmed
    if (useTestMode) {
      console.log('🧪 TEST MODE: Bypassing payment, marking order as CONFIRMED');
      
      const testOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CONFIRMED,
        },
      });

      return NextResponse.json({
        success: true,
        testMode: true,
        message: 'Test payment successful (no real payment processed)',
        order: testOrder,
        charge: {
          id: 'test_charge_' + Date.now(),
          redirectUrl: `${req.nextUrl.origin}/account/orders?payment=success&test=true`,
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
    const returnUrl = `${req.nextUrl.origin}/account/orders?payment=success`;
    
    const phoneNumber = order.user.phone || '';
    // Tap expects country code as string without + sign
    const countryCode = '966';
    const number = phoneNumber.replace(/^\+966/, '').replace(/\D/g, '');

    // Build customer object
    const customer: any = {
      first_name: order.user.name || 'Customer',
      email: order.user.email,
    };

    // Add phone only if we have a valid number
    if (number && number.length >= 9) {
      customer.phone = {
        country_code: countryCode,
        number: number,
      };
    }

    // Build Tap charge request
    const chargeRequest: any = {
      amount: order.totalPrice,
      currency: 'SAR',
      customer: customer,
      source: {
        id: 'src_all', // Allows customer to select payment method on Tap's payment page
      },
      redirect: {
        url: returnUrl,
      },
      description: `Order Payment for ${order.car.name}`,
      metadata: {
        userId: userId.toString(),
        carId: carId.toString(),
        orderId: order.id.toString(),
        type: 'order_payment',
      },
    };

    // Create charge with Tap
    const tapCharge = await createTapCharge(chargeRequest);

    // Update order with Tap charge ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        // Store charge ID in a metadata field if needed
        // For now, we'll track it via webhook
      },
    });

    // Extract payment redirect URL from Tap response
    const paymentRedirectUrl = 
      tapCharge.transaction?.url || 
      tapCharge.redirect?.url ||
      (tapCharge.transaction && typeof tapCharge.transaction === 'string' ? tapCharge.transaction : null);

    if (!paymentRedirectUrl) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get payment URL from Tap',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      charge: {
        ...tapCharge,
        redirectUrl: paymentRedirectUrl,
      },
      orderId: order.id,
    });
  } catch (error: any) {
    console.error('Error creating order payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create payment',
      },
      { status: 500 }
    );
  }
}

