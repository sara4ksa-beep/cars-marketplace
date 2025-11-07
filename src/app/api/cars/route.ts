import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { CarStatus, SaleType } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const saleType = searchParams.get('saleType') as SaleType | null;

    const where: any = {
      status: CarStatus.APPROVED,
    };

    if (saleType) {
      where.saleType = saleType;
    }

    const cars = await prisma.car.findMany({
      where,
      include: {
        bids: {
          orderBy: {
            amount: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const now = new Date();

    return NextResponse.json({
      success: true,
      cars: cars.map((car) => {
        const isAuction = car.saleType === SaleType.AUCTION;
        const isActiveAuction =
          isAuction &&
          car.auctionStartDate &&
          car.auctionEndDate &&
          new Date(car.auctionStartDate) <= now &&
          new Date(car.auctionEndDate) > now;

        return {
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
          featured: car.featured,
          saleType: car.saleType,
          currentBid: car.currentBid,
          reservePrice: car.reservePrice,
          auctionStartDate: car.auctionStartDate,
          auctionEndDate: car.auctionEndDate,
          bidIncrement: car.bidIncrement,
          isActiveAuction,
          bidCount: car.bids.length,
          createdAt: car.createdAt,
          // Contact information removed for customer privacy
        };
      }),
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