import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyAdminAuth } from '@/lib/auth';
import { CarStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(req);
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {
      status: CarStatus.APPROVED,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    switch (sortBy) {
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      case 'oldest':
        orderBy.createdAt = 'asc';
        break;
      case 'price-high':
        orderBy.price = 'desc';
        break;
      case 'price-low':
        orderBy.price = 'asc';
        break;
      case 'name':
        orderBy.name = 'asc';
        break;
      default:
        orderBy.createdAt = 'desc';
    }

    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.car.count({ where }),
    ]);

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
        contactName: car.contactName,
        contactPhone: car.contactPhone,
        contactLocation: car.contactLocation,
        contactEmail: car.contactEmail,
        status: car.status,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(req);
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const carId = searchParams.get('carId');

    if (!carId) {
      return NextResponse.json({ 
        success: false, 
        error: 'carId is required' 
      }, { status: 400 });
    }

    await prisma.car.delete({
      where: { id: parseInt(carId) },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Car deleted successfully' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

