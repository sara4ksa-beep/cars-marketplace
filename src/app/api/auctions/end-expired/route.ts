import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { SaleType, CarStatus, BidDepositStatus } from '@prisma/client';
import axios from 'axios';

// This endpoint should be called by a cron job or scheduled task
// to automatically end expired auctions
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    // Simple auth check - in production, use proper authentication
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    
    // Find all active auctions that have ended
    const expiredAuctions = await prisma.car.findMany({
      where: {
        saleType: SaleType.AUCTION,
        status: CarStatus.APPROVED,
        isAvailable: true,
        auctionEndDate: {
          lte: now,
        },
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

    const results = [];

    for (const auction of expiredAuctions) {
      const highestBid = auction.bids[0];

      if (!highestBid) {
        // No bids, mark as unavailable
        await prisma.car.update({
          where: { id: auction.id },
          data: {
            isAvailable: false,
          },
        });
        results.push({
          auctionId: auction.id,
          status: 'ended_no_bids',
        });
        continue;
      }

      // Check if reserve price was met
      if (auction.reservePrice && highestBid.amount < auction.reservePrice) {
        // Reserve price not met
        await prisma.car.update({
          where: { id: auction.id },
          data: {
            isAvailable: false,
          },
        });
        results.push({
          auctionId: auction.id,
          status: 'ended_reserve_not_met',
          highestBid: highestBid.amount,
          reservePrice: auction.reservePrice,
        });
        continue;
      }

      // Reserve price met or no reserve price - select winner
      await prisma.car.update({
        where: { id: auction.id },
        data: {
          status: CarStatus.SOLD,
          isAvailable: false,
          currentBid: highestBid.amount,
        },
      });

      // Create booking for the winner (for compatibility)
      await prisma.booking.create({
        data: {
          carId: auction.id,
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
          carId: auction.id,
          totalPrice: highestBid.amount,
          status: 'CONFIRMED', // Auction winners get confirmed status
        },
      });

      // Handle deposits: apply winner's deposit, refund losers
      const allDeposits = await prisma.bidDeposit.findMany({
        where: {
          carId: auction.id,
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

      results.push({
        auctionId: auction.id,
        status: 'ended_winner_selected',
        winner: {
          userId: highestBid.user.id,
          userName: highestBid.user.name,
          winningBid: highestBid.amount,
        },
        deposits: {
          winnerApplied: winnerDeposit ? true : false,
          refundsProcessed: refundResults.filter(r => r.success).length,
          refundsFailed: refundResults.filter(r => !r.success).length,
          refundDetails: refundResults,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${expiredAuctions.length} expired auctions`,
      results,
    });
  } catch (error: any) {
    console.error('Error ending expired auctions:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}


