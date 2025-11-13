import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyTapWebhook, getTapCharge } from '@/lib/tapPayment';
import { BidDepositStatus, OrderStatus } from '@prisma/client';

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
      const orderId = metadata?.orderId;
      const type = metadata?.type;

      // Get charge details to verify
      const charge = await getTapCharge(id);
      
      if (charge.status !== 'CAPTURED') {
        return NextResponse.json({ success: false, error: 'Charge not captured' }, { status: 400 });
      }

      // Handle bid deposit payment
      if (type === 'bid_deposit' && depositId) {
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

      // Handle order payment
      if (type === 'order_payment' && orderId) {
        const order = await prisma.order.update({
          where: { id: parseInt(orderId) },
          data: {
            status: OrderStatus.CONFIRMED,
          },
        });

        // Mark car as sold
        await prisma.car.update({
          where: { id: order.carId },
          data: {
            status: 'SOLD',
            isAvailable: false,
          },
        });

        console.log(`Order ${orderId} confirmed for charge ${id}`);

        return NextResponse.json({
          success: true,
          message: 'Order payment confirmed',
          orderId: order.id,
        });
      }

      // If no type or ID specified, log and return success
      console.warn('Webhook received but no depositId or orderId in metadata');
      return NextResponse.json({
        success: true,
        message: 'Webhook received but no action taken',
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

