import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { SaleType, CarStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const carId = searchParams.get('carId');
    const userId = searchParams.get('userId');

    const where: any = {};
    if (carId) where.carId = parseInt(carId);
    if (userId) where.userId = parseInt(userId);

    const bids = await prisma.bid.findMany({
      where,
      include: {
        car: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      bids,
    });
  } catch (error: any) {
    console.error('Error fetching bids:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { carId, userId, amount, maxBid, isAutoBid } = body;

    // Validate required fields
    if (!carId || !userId || !amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: carId, userId, amount',
        },
        { status: 400 }
      );
    }

    // Get the car/auction
    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: {
        bids: {
          orderBy: {
            amount: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!car) {
      return NextResponse.json(
        {
          success: false,
          error: 'Car not found',
        },
        { status: 404 }
      );
    }

    if (car.saleType !== SaleType.AUCTION) {
      return NextResponse.json(
        {
          success: false,
          error: 'This car is not an auction',
        },
        { status: 400 }
      );
    }

    if (car.status !== CarStatus.APPROVED) {
      return NextResponse.json(
        {
          success: false,
          error: 'Auction is not active',
        },
        { status: 400 }
      );
    }

    // Check if auction is active
    const now = new Date();
    if (
      !car.auctionStartDate ||
      !car.auctionEndDate ||
      new Date(car.auctionStartDate) > now ||
      new Date(car.auctionEndDate) <= now
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Auction is not currently active',
        },
        { status: 400 }
      );
    }

    // Prevent seller from bidding on their own auction
    if (car.sellerId === userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'You cannot bid on your own auction',
        },
        { status: 400 }
      );
    }

    // Get current highest bid
    const currentHighestBid = car.bids[0];
    const currentBidAmount = car.currentBid || car.price;
    const minimumBid = currentBidAmount + car.bidIncrement;

    // Validate bid amount
    if (amount < minimumBid) {
      return NextResponse.json(
        {
          success: false,
          error: `Bid must be at least ${minimumBid.toLocaleString()} SAR (current bid + increment)`,
        },
        { status: 400 }
      );
    }

    // If maxBid is provided, validate it
    if (maxBid && maxBid < amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum bid must be greater than or equal to bid amount',
        },
        { status: 400 }
      );
    }

    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        carId,
        userId,
        amount,
        maxBid: maxBid || null,
        isAutoBid: isAutoBid || false,
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
    });

    // Update car's current bid
    await prisma.car.update({
      where: { id: carId },
      data: {
        currentBid: amount,
      },
    });

    // Check if we need to auto-extend the auction
    const timeUntilEnd =
      new Date(car.auctionEndDate).getTime() - now.getTime();
    const extendThreshold = car.autoExtendMinutes * 60 * 1000; // Convert to milliseconds

    if (timeUntilEnd <= extendThreshold) {
      // Extend the auction
      const newEndDate = new Date(now.getTime() + extendThreshold);
      await prisma.car.update({
        where: { id: carId },
        data: {
          auctionEndDate: newEndDate,
        },
      });
    }

    return NextResponse.json({
      success: true,
      bid,
      message: 'Bid placed successfully',
    });
  } catch (error: any) {
    console.error('Error placing bid:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

