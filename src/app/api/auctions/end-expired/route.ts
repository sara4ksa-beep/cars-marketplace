import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { SaleType, CarStatus } from '@prisma/client';

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

      // Create booking for the winner
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

      results.push({
        auctionId: auction.id,
        status: 'ended_winner_selected',
        winner: {
          userId: highestBid.user.id,
          userName: highestBid.user.name,
          winningBid: highestBid.amount,
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

