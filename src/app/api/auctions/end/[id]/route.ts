import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { SaleType, CarStatus } from '@prisma/client';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const carId = parseInt(params.id);

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

    // Create order/booking for the winner
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

    return NextResponse.json({
      success: true,
      message: 'Auction ended successfully',
      winner: {
        userId: highestBid.user.id,
        userName: highestBid.user.name,
        userEmail: highestBid.user.email,
        winningBid: highestBid.amount,
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

