import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { getUserFromRequest } from '@/lib/userAuth';
import { OrderStatus, CarStatus, SaleType } from '@prisma/client';

// GET - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {
      userId: user.id,
    };

    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true,
            imageUrl: true,
            saleType: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch orders',
      },
      { status: 500 }
    );
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { carId } = body;

    if (!carId) {
      return NextResponse.json(
        { success: false, error: 'Car ID is required' },
        { status: 400 }
      );
    }

    // Get car details
    const car = await prisma.car.findUnique({
      where: { id: parseInt(carId.toString()) },
    });

    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    // Check if car is available
    if (!car.isAvailable || car.status !== CarStatus.APPROVED) {
      return NextResponse.json(
        { success: false, error: 'Car is not available for purchase' },
        { status: 400 }
      );
    }

    // Check if car is direct sale (not auction)
    if (car.saleType !== SaleType.DIRECT_SALE) {
      return NextResponse.json(
        { success: false, error: 'This car is only available through auction' },
        { status: 400 }
      );
    }

    // Check if user already has a pending or confirmed order for this car
    const existingOrder = await prisma.order.findFirst({
      where: {
        carId: car.id,
        userId: user.id,
        status: {
          in: [OrderStatus.PENDING, OrderStatus.CONFIRMED],
        },
      },
    });

    if (existingOrder) {
      return NextResponse.json(
        { success: false, error: 'You already have an active order for this car' },
        { status: 400 }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        carId: car.id,
        totalPrice: car.price,
        status: OrderStatus.PENDING,
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true,
            imageUrl: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      order,
      message: 'Order created successfully',
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    );
  }
}

