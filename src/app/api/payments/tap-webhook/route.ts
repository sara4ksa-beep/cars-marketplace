import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyTapWebhook, getTapCharge } from '@/lib/tapPayment';
import { BidDepositStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-tap-signature') || '';

    // Verify webhook signature
    if (!verifyTapWebhook(body, signature)) {
      return NextResponse.json(
        { success: false, error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(body);
    const { id, object, status, metadata } = payload;

    // Handle charge.succeeded event
    if (object === 'charge' && status === 'CAPTURED') {
      const depositId = metadata?.depositId;
      
      if (!depositId) {
        console.error('No depositId in webhook metadata');
        return NextResponse.json({ success: false, error: 'Missing depositId' }, { status: 400 });
      }

      // Get charge details to verify
      const charge = await getTapCharge(id);
      
      if (charge.status !== 'CAPTURED') {
        return NextResponse.json({ success: false, error: 'Charge not captured' }, { status: 400 });
      }

      // Update deposit status
      const deposit = await prisma.bidDeposit.update({
        where: { id: parseInt(depositId) },
        data: {
          status: BidDepositStatus.PAID,
          tapPaymentId: charge.id,
        },
      });

      console.log(`Deposit ${depositId} marked as PAID for charge ${id}`);

      return NextResponse.json({
        success: true,
        message: 'Deposit payment confirmed',
        depositId: deposit.id,
      });
    }

    // Handle charge.failed event
    if (object === 'charge' && (status === 'FAILED' || status === 'CANCELLED')) {
      const depositId = metadata?.depositId;
      
      if (depositId) {
        // Optionally update deposit status or leave as PENDING
        console.log(`Charge ${id} failed for deposit ${depositId}`);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment failed notification received',
      });
    }

    // Handle refund events
    if (object === 'refund' && status === 'CAPTURED') {
      const depositId = metadata?.depositId;
      
      if (depositId) {
        await prisma.bidDeposit.update({
          where: { id: parseInt(depositId) },
          data: {
            status: BidDepositStatus.REFUNDED,
            refundId: id,
          },
        });

        console.log(`Deposit ${depositId} refunded: ${id}`);
      }

      return NextResponse.json({
        success: true,
        message: 'Refund confirmed',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook received',
    });
  } catch (error: any) {
    console.error('Error processing Tap webhook:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

