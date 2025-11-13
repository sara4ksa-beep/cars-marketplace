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
          take: 50, // Limit to top 50 bids for performance
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
      
      // Since auctions start immediately, if start date exists and end date is in the future, consider it started
      // Only check if start date is explicitly in the future (more than 1 hour) for manual scheduling
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      hasEnded = endDate <= now;
      
      // If start date is more than 1 hour in the future, it's scheduled for later
      if (startDate > oneHourFromNow) {
        hasStarted = false;
      } else {
        // Otherwise, consider it started (auctions start immediately)
        hasStarted = true;
      }
      
      isActive = hasStarted && !hasEnded;
    } else if (!auction.auctionEndDate) {
      // If endDate is not set, consider it as not started yet (pending setup)
      hasStarted = false;
      hasEnded = false;
      isActive = false;
    } else if (auction.auctionEndDate && !auction.auctionStartDate) {
      // If only end date is set, consider it started (for backwards compatibility)
      const endDate = new Date(auction.auctionEndDate);
      hasStarted = true;
      hasEnded = endDate <= now;
      isActive = !hasEnded;
    }

    // Format bids for frontend (include user info)
    const recentBids = auction.bids.map(bid => ({
      id: bid.id,
      amount: bid.amount,
      isAutoBid: bid.isAutoBid,
      createdAt: bid.createdAt.toISOString(),
      user: {
        id: bid.user.id,
        name: bid.user.name,
      },
    }));

    return NextResponse.json({
      success: true,
      auction: {
        ...auction,
        currentBid: auction.currentBid || auction.price,
        highestBidder: highestBid?.user || null,
        bidCount: auction.bids.length,
        recentBids: recentBids,
        isActiveAuction: isActive,
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

