import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { SaleType, CarStatus, BidDepositStatus } from '@prisma/client';
import axios from 'axios';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const carId = parseInt(resolvedParams.id);

    // Get the auction with all bids
    const auction = await prisma.car.findUnique({
      where: {
        id: carId,
        saleType: SaleType.AUCTION,
      },
      include: {
        bids: {
          orderBy: {
            amount: 'desc',
          },
          take: 1,
          include: {
            user: true,
          },
        },
      },
    });

    if (!auction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Auction not found',
        },
        { status: 404 }
      );
    }

    // Check if auction has ended
    const now = new Date();
    if (
      auction.auctionEndDate &&
      new Date(auction.auctionEndDate) > now
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Auction has not ended yet',
        },
        { status: 400 }
      );
    }

    // Get highest bid
    const highestBid = auction.bids[0];

    if (!highestBid) {
      // No bids, mark as available for direct sale or keep as auction
      await prisma.car.update({
        where: { id: carId },
        data: {
          isAvailable: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Auction ended with no bids',
        winner: null,
      });
    }

    // Check if reserve price was met
    if (auction.reservePrice && highestBid.amount < auction.reservePrice) {
      // Reserve price not met
      await prisma.car.update({
        where: { id: carId },
        data: {
          isAvailable: false,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Auction ended but reserve price not met',
        winner: null,
        highestBid: highestBid.amount,
        reservePrice: auction.reservePrice,
      });
    }

    // Reserve price met or no reserve price - select winner
    await prisma.car.update({
      where: { id: carId },
      data: {
        status: CarStatus.SOLD,
        isAvailable: false,
        currentBid: highestBid.amount,
      },
    });

    // Create booking for the winner (for compatibility)
    await prisma.booking.create({
      data: {
        carId: carId,
        carName: auction.name,
        carPrice: highestBid.amount,
        customerName: highestBid.user.name,
        customerEmail: highestBid.user.email || '',
        customerPhone: highestBid.user.phone || '',
        message: `Winner of auction for ${auction.name}`,
        status: 'PENDING',
      },
    });

    // Create Order for the winner
    await prisma.order.create({
      data: {
        userId: highestBid.user.id,
        carId: carId,
        totalPrice: highestBid.amount,
        status: 'CONFIRMED', // Auction winners get confirmed status
      },
    });

    // Handle deposits: apply winner's deposit, refund losers
    const allDeposits = await prisma.bidDeposit.findMany({
      where: {
        carId: carId,
        status: BidDepositStatus.PAID,
      },
    });

    const winnerDeposit = allDeposits.find(d => d.userId === highestBid.user.id);
    if (winnerDeposit) {
      // Apply winner's deposit to purchase
      await prisma.bidDeposit.update({
        where: { id: winnerDeposit.id },
        data: {
          status: BidDepositStatus.APPLIED_TO_PURCHASE,
        },
      });
    }

    // Refund losers' deposits
    const loserDeposits = allDeposits.filter(d => d.userId !== highestBid.user.id);
    const refundResults = [];

    for (const deposit of loserDeposits) {
      try {
        const refundResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/refund-deposit`,
          { depositId: deposit.id },
          {
            headers: {
              'Authorization': `Bearer ${process.env.CRON_SECRET}`,
              'Content-Type': 'application/json',
            },
          }
        );
        refundResults.push({
          depositId: deposit.id,
          userId: deposit.userId,
          success: refundResponse.data.success,
        });
      } catch (error: any) {
        console.error(`Failed to refund deposit ${deposit.id}:`, error.message);
        refundResults.push({
          depositId: deposit.id,
          userId: deposit.userId,
          success: false,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Auction ended successfully',
      winner: {
        userId: highestBid.user.id,
        userName: highestBid.user.name,
        userEmail: highestBid.user.email,
        winningBid: highestBid.amount,
      },
      deposits: {
        winnerApplied: winnerDeposit ? true : false,
        refundsProcessed: refundResults.filter(r => r.success).length,
        refundsFailed: refundResults.filter(r => !r.success).length,
        refundDetails: refundResults,
      },
    });
  } catch (error: any) {
    console.error('Error ending auction:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

