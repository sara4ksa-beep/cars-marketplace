import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyAdminAuth } from '@/lib/auth';
import { CarStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    // التحقق من صحة تسجيل دخول المشرف
    const authResult = await verifyAdminAuth(req);
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }
    const pendingCars = await prisma.car.findMany({
      where: {
        status: CarStatus.PENDING
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      cars: pendingCars.map(car => ({
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
        createdAt: car.createdAt
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 