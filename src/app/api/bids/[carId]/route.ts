import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: { carId: string } }
) {
  try {
    const bids = await prisma.bid.findMany({
      where: {
        carId: parseInt(params.carId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        amount: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      bids,
    });
  } catch (error: any) {
    console.error('Error fetching bids:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

