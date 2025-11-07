import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { SaleType } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const carId = parseInt(resolvedParams.id);

    if (isNaN(carId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid car ID',
        },
        { status: 400 }
      );
    }

    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: {
        bids: {
          orderBy: {
            amount: 'desc',
          },
          take: 10,
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
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

    const now = new Date();
    const isAuction = car.saleType === SaleType.AUCTION;
    const isActiveAuction =
      isAuction &&
      car.auctionStartDate &&
      car.auctionEndDate &&
      new Date(car.auctionStartDate) <= now &&
      new Date(car.auctionEndDate) > now;

    return NextResponse.json({
      success: true,
      car: {
        id: car.id,
        name: car.name,
        brand: car.brand,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        color: car.color,
        description: car.description,
        imageUrl: car.imageUrl,
        images: car.images,
        isAvailable: car.isAvailable,
        saleType: car.saleType,
        currentBid: car.currentBid,
        reservePrice: car.reservePrice,
        auctionStartDate: car.auctionStartDate,
        auctionEndDate: car.auctionEndDate,
        bidIncrement: car.bidIncrement,
        autoExtendMinutes: car.autoExtendMinutes,
        isActiveAuction,
        bidCount: car.bids.length,
        highestBidder: car.bids[0]?.user || null,
        recentBids: car.bids.slice(0, 5),
        createdAt: car.createdAt,
        // Contact information removed for customer privacy
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
} 