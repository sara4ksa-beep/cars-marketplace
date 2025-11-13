import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyUserAuth } from '@/lib/userAuth';
import { createTapCharge } from '@/lib/tapPayment';
import { BidDepositStatus } from '@prisma/client';

const DEPOSIT_AMOUNT = 200; // SAR

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
    const { carId } = await req.json();

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

    // Create Tap charge
    const redirectUrl = `${req.nextUrl.origin}/auctions/${carId}?payment=success`;
    
    const phoneNumber = user.phone || '';
    const countryCode = phoneNumber.startsWith('+966') ? '+966' : '+966';
    const number = phoneNumber.replace(/^\+966/, '').replace(/\D/g, '');

    const tapCharge = await createTapCharge({
      amount: DEPOSIT_AMOUNT,
      currency: 'SAR',
      customer: {
        first_name: user.name,
        email: user.email,
        ...(number && {
          phone: {
            country_code: countryCode,
            number: number,
          },
        }),
      },
      redirect: {
        url: redirectUrl,
      },
      metadata: {
        userId: userId.toString(),
        carId: carId.toString(),
        depositId: deposit.id.toString(),
        type: 'bid_deposit',
      },
    });

    // Update deposit with Tap charge ID
    await prisma.bidDeposit.update({
      where: { id: deposit.id },
      data: {
        tapChargeId: tapCharge.id,
      },
    });

    return NextResponse.json({
      success: true,
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        status: deposit.status,
      },
      charge: {
        id: tapCharge.id,
        redirectUrl: tapCharge.redirect?.url || tapCharge.transaction?.url,
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

