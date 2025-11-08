import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyAdminAuth } from '@/lib/auth';
import { CarStatus } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdminAuth(req);
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }

    const resolvedParams = await params;
    const car = await prisma.car.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        bids: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          },
          orderBy: {
            amount: 'desc',
          },
          take: 10,
        }
      }
    });

    if (!car) {
      return NextResponse.json({ 
        success: false, 
        error: 'Car not found' 
      }, { status: 404 });
    }

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
        contactName: car.contactName,
        contactPhone: car.contactPhone,
        contactLocation: car.contactLocation,
        contactEmail: car.contactEmail,
        status: car.status,
        isAvailable: car.isAvailable,
        featured: car.featured,
        saleType: car.saleType,
        reservePrice: car.reservePrice,
        currentBid: car.currentBid,
        bidIncrement: car.bidIncrement,
        auctionStartDate: car.auctionStartDate,
        auctionEndDate: car.auctionEndDate,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt,
        seller: car.seller,
        bids: car.bids,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAdminAuth(req);
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    const {
      name,
      brand,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      color,
      description,
      imageUrl,
      images,
      contactName,
      contactPhone,
      contactLocation,
      contactEmail,
      status,
      isAvailable,
      featured,
    } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (year !== undefined) updateData.year = year;
    if (price !== undefined) updateData.price = price;
    if (mileage !== undefined) updateData.mileage = mileage;
    if (fuelType !== undefined) updateData.fuelType = fuelType;
    if (transmission !== undefined) updateData.transmission = transmission;
    if (color !== undefined) updateData.color = color;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (images !== undefined) updateData.images = images;
    if (contactName !== undefined) updateData.contactName = contactName;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (contactLocation !== undefined) updateData.contactLocation = contactLocation;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (status !== undefined) updateData.status = status as CarStatus;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (featured !== undefined) updateData.featured = featured;

    const car = await prisma.car.update({
      where: { id: parseInt(resolvedParams.id) },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Car updated successfully',
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
        contactName: car.contactName,
        contactPhone: car.contactPhone,
        contactLocation: car.contactLocation,
        contactEmail: car.contactEmail,
        status: car.status,
        isAvailable: car.isAvailable,
        featured: car.featured,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

