import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyUserAuth } from '@/lib/userAuth';
import { BidDepositStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyUserAuth(req);
    
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }

    const userId = authResult.user!.id;
    const { searchParams } = new URL(req.url);
    const carId = searchParams.get('carId');

    if (!carId) {
      return NextResponse.json({ 
        success: false, 
        error: 'carId is required' 
      }, { status: 400 });
    }

    // Check if user has existing bids on this car (grandfathering)
    const existingBids = await prisma.bid.findFirst({
      where: {
        userId: parseInt(userId.toString()),
        carId: parseInt(carId),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // If user has existing bids, they don't need to pay deposit
    if (existingBids) {
      return NextResponse.json({
        success: true,
        hasDeposit: true,
        isGrandfathered: true,
        deposit: null,
      });
    }

    // Check for deposit
    const deposit = await prisma.bidDeposit.findUnique({
      where: {
        userId_carId: {
          userId: parseInt(userId.toString()),
          carId: parseInt(carId),
        },
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!deposit) {
      return NextResponse.json({
        success: true,
        hasDeposit: false,
        isGrandfathered: false,
        deposit: null,
      });
    }

    return NextResponse.json({
      success: true,
      hasDeposit: deposit.status === BidDepositStatus.PAID,
      isGrandfathered: false,
      deposit: {
        id: deposit.id,
        amount: deposit.amount,
        status: deposit.status,
        createdAt: deposit.createdAt,
        car: deposit.car,
      },
    });
  } catch (error: any) {
    console.error('Error checking deposit:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

