import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { CarStatus } from '@prisma/client';

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      where: {
        status: CarStatus.APPROVED
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      cars: cars.map(car => ({
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
        createdAt: car.createdAt
        // Contact information removed for customer privacy
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 