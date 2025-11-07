import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { SaleType, CarStatus } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auction = await prisma.car.findUnique({
      where: {
        id: parseInt(params.id),
        saleType: SaleType.AUCTION,
      },
      include: {
        bids: {
          orderBy: {
            amount: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
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

    const highestBid = auction.bids[0];
    const now = new Date();
    const isActive =
      auction.auctionStartDate &&
      auction.auctionEndDate &&
      new Date(auction.auctionStartDate) <= now &&
      new Date(auction.auctionEndDate) > now;

    return NextResponse.json({
      success: true,
      auction: {
        ...auction,
        currentBid: auction.currentBid || auction.price,
        highestBidder: highestBid?.user || null,
        bidCount: auction.bids.length,
        isActive,
        timeRemaining: auction.auctionEndDate
          ? Math.max(0, new Date(auction.auctionEndDate).getTime() - now.getTime())
          : 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching auction:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { reservePrice, bidIncrement, auctionEndDate, autoExtendMinutes } =
      body;

    const updateData: any = {};

    if (reservePrice !== undefined) updateData.reservePrice = reservePrice;
    if (bidIncrement !== undefined) updateData.bidIncrement = bidIncrement;
    if (auctionEndDate) updateData.auctionEndDate = new Date(auctionEndDate);
    if (autoExtendMinutes !== undefined)
      updateData.autoExtendMinutes = autoExtendMinutes;

    const auction = await prisma.car.update({
      where: { id: parseInt(params.id) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      auction,
    });
  } catch (error: any) {
    console.error('Error updating auction:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

