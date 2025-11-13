import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { CarStatus, SaleType } from '@prisma/client';
import { verifyUserAuth } from '@/lib/userAuth';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Check if user is logged in
    const authResult = await verifyUserAuth(req);
    const sellerId = authResult.success ? authResult.user!.id : null;

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
      sellerId: sellerId, // Link to user if logged in
    };

    // If it's an auction, add auction-specific fields
    if (data.saleType === SaleType.AUCTION) {
      // Validate required auction fields
      if (!data.auctionEndDate) {
        return NextResponse.json(
          { success: false, error: 'Auction end date is required' },
          { status: 400 }
        );
      }

      const startDate = data.auctionStartDate
        ? new Date(data.auctionStartDate)
        : new Date();
      const endDate = new Date(data.auctionEndDate);

      // Validate that end date is after start date
      if (endDate <= startDate) {
        return NextResponse.json(
          { success: false, error: 'Auction end date must be after start date' },
          { status: 400 }
        );
      }

      carData.reservePrice = data.reservePrice || null;
      carData.bidIncrement = data.bidIncrement || 500;
      carData.autoExtendMinutes = data.autoExtendMinutes || 5;
      carData.auctionStartDate = startDate;
      carData.auctionEndDate = endDate;
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