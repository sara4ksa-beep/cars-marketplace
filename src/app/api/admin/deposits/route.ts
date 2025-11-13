import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyAdminAuth } from '@/lib/auth';
import { BidDepositStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(req);
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');

    const where: any = {};
    if (statusParam && statusParam !== 'all') {
      // Validate that the status is a valid BidDepositStatus
      const validStatuses: BidDepositStatus[] = ['PENDING', 'PAID', 'REFUNDED', 'APPLIED_TO_PURCHASE'];
      if (validStatuses.includes(statusParam as BidDepositStatus)) {
        where.status = statusParam as BidDepositStatus;
      }
    }

    const deposits = await prisma.bidDeposit.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ 
      success: true, 
      deposits: deposits.map(deposit => ({
        id: deposit.id,
        userId: deposit.userId,
        carId: deposit.carId,
        amount: deposit.amount,
        tapChargeId: deposit.tapChargeId,
        tapPaymentId: deposit.tapPaymentId,
        refundId: deposit.refundId,
        status: deposit.status,
        createdAt: deposit.createdAt,
        updatedAt: deposit.updatedAt,
        user: deposit.user,
        car: deposit.car,
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

