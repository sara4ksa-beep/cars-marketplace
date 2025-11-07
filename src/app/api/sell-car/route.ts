import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { CarStatus, SaleType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const carData: any = {
      name: data.name,
      brand: data.brand,
      year: data.year,
      price: data.price,
      mileage: data.mileage,
      fuelType: data.fuelType,
      transmission: data.transmission,
      color: data.color,
      description: data.description,
      imageUrl: data.imageUrl || data.images?.[0],
      images: data.images || [],
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactLocation: data.contactLocation,
      contactEmail: data.contactEmail,
      status: CarStatus.PENDING,
      saleType: data.saleType || SaleType.DIRECT_SALE,
    };

    // If it's an auction, add auction-specific fields
    if (data.saleType === SaleType.AUCTION) {
      carData.reservePrice = data.reservePrice || null;
      carData.bidIncrement = data.bidIncrement || 500;
      carData.autoExtendMinutes = data.autoExtendMinutes || 5;
      carData.auctionStartDate = data.auctionStartDate
        ? new Date(data.auctionStartDate)
        : new Date();
      carData.auctionEndDate = data.auctionEndDate
        ? new Date(data.auctionEndDate)
        : null;
      carData.currentBid = null;
    }

    const car = await prisma.car.create({
      data: carData,
    });

    return NextResponse.json({ success: true, car });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 