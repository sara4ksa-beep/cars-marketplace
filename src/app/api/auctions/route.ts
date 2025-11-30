import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { SaleType, CarStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    const featured = searchParams.get('featured') === 'true';

    const where: any = {
      saleType: SaleType.AUCTION,
      status: CarStatus.APPROVED,
      isAvailable: true,
    };

    if (activeOnly) {
      const now = new Date();
      where.auctionEndDate = {
        gt: now,
      };
      where.auctionStartDate = {
        lte: now,
      };
    }

    if (featured) {
      where.featured = true;
    }

    const auctions = await prisma.car.findMany({
      where,
      include: {
        bids: {
          orderBy: {
            amount: 'desc',
          },
          take: 1,
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        auctionEndDate: 'asc',
      },
    });

    const auctionsWithData = auctions.map((auction) => {
      const highestBid = auction.bids[0];
      return {
        id: auction.id,
        name: auction.name,
        brand: auction.brand,
        year: auction.year,
        price: auction.price,
        reservePrice: auction.reservePrice,
        currentBid: auction.currentBid || auction.price,
        bidIncrement: auction.bidIncrement,
        auctionStartDate: auction.auctionStartDate,
        auctionEndDate: auction.auctionEndDate,
        autoExtendMinutes: auction.autoExtendMinutes,
        imageUrl: auction.imageUrl,
        images: auction.images,
        featured: auction.featured,
        mileage: auction.mileage,
        fuelType: auction.fuelType,
        transmission: auction.transmission,
        color: auction.color,
        highestBidder: highestBid?.user || null,
        bidCount: auction.bids.length,
        createdAt: auction.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      auctions: auctionsWithData,
    });
  } catch (error: any) {
    console.error('Error fetching auctions:', error);
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
    const {
      carId,
      reservePrice,
      bidIncrement,
      auctionStartDate,
      auctionEndDate,
      autoExtendMinutes,
    } = body;

    // Validate dates
    const startDate = auctionStartDate ? new Date(auctionStartDate) : new Date();
    const endDate = new Date(auctionEndDate);

    if (endDate <= startDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Auction end date must be after start date',
        },
        { status: 400 }
      );
    }

    const auction = await prisma.car.update({
      where: { id: carId },
      data: {
        saleType: SaleType.AUCTION,
        reservePrice: reservePrice || null,
        bidIncrement: bidIncrement || 500,
        auctionStartDate: startDate,
        auctionEndDate: endDate,
        autoExtendMinutes: autoExtendMinutes || 5,
        currentBid: null,
      },
    });

    return NextResponse.json({
      success: true,
      auction,
    });
  } catch (error: any) {
    console.error('Error creating auction:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}








