import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const carId = parseInt(resolvedParams.id);
    
    if (isNaN(carId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid car ID' 
      }, { status: 400 });
    }

    const car = await prisma.car.findUnique({
      where: { id: carId }
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
        isAvailable: car.isAvailable,
        createdAt: car.createdAt
        // Contact information removed for customer privacy
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 