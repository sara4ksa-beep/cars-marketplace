import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { SaleType, CarStatus } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const auction = await prisma.car.findUnique({
      where: {
        id: parseInt(resolvedParams.id),
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
    
    // Determine auction status
    let isActive = false;
    let hasStarted = false;
    let hasEnded = false;
    
    if (auction.auctionStartDate && auction.auctionEndDate) {
      const startDate = new Date(auction.auctionStartDate);
      const endDate = new Date(auction.auctionEndDate);
      
      hasStarted = startDate <= now;
      hasEnded = endDate <= now;
      isActive = hasStarted && !hasEnded;
    } else if (!auction.auctionEndDate) {
      // If endDate is not set, consider it as not started yet (pending setup)
      hasStarted = false;
      hasEnded = false;
      isActive = false;
    }

    return NextResponse.json({
      success: true,
      auction: {
        ...auction,
        currentBid: auction.currentBid || auction.price,
        highestBidder: highestBid?.user || null,
        bidCount: auction.bids.length,
        isActive,
        hasStarted,
        hasEnded,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
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
      where: { id: parseInt(resolvedParams.id) },
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

