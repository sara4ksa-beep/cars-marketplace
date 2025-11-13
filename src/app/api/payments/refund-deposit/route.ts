import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyAdminAuth } from '@/lib/auth';
import { createTapRefund } from '@/lib/tapPayment';
import { BidDepositStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication (for manual refunds)
    // For automatic refunds from auction end, we can skip this check
    const authHeader = req.headers.get('authorization');
    const isAutomaticRefund = authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isAutomaticRefund) {
      const authResult = await verifyAdminAuth(req);
      if (!authResult.success) {
        return NextResponse.json({ 
          success: false, 
          error: authResult.error 
        }, { status: 401 });
      }
    }

    const { depositId } = await req.json();

    if (!depositId) {
      return NextResponse.json({ 
        success: false, 
        error: 'depositId is required' 
      }, { status: 400 });
    }

    // Get deposit
    const deposit = await prisma.bidDeposit.findUnique({
      where: { id: parseInt(depositId) },
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
          },
        },
      },
    });

    if (!deposit) {
      return NextResponse.json({ 
        success: false, 
        error: 'Deposit not found' 
      }, { status: 404 });
    }

    if (deposit.status !== BidDepositStatus.PAID) {
      return NextResponse.json({ 
        success: false, 
        error: 'Deposit is not paid, cannot refund' 
      }, { status: 400 });
    }

    if (!deposit.tapChargeId) {
      return NextResponse.json({ 
        success: false, 
        error: 'No Tap charge ID found for this deposit' 
      }, { status: 400 });
    }

    // Create refund via Tap
    const refund = await createTapRefund({
      charge_id: deposit.tapChargeId,
      amount: deposit.amount,
      currency: 'SAR',
      description: `Refund for bid deposit on ${deposit.car.name}`,
    });

    // Update deposit status
    await prisma.bidDeposit.update({
      where: { id: deposit.id },
      data: {
        status: BidDepositStatus.REFUNDED,
        refundId: refund.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Deposit refunded successfully',
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
      },
      deposit: {
        id: deposit.id,
        status: BidDepositStatus.REFUNDED,
      },
    });
  } catch (error: any) {
    console.error('Error refunding deposit:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to refund deposit' 
    }, { status: 500 });
  }
}

