import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ carId: string }> }
) {
  try {
    const resolvedParams = await params;
    const bids = await prisma.bid.findMany({
      where: {
        carId: parseInt(resolvedParams.carId),
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

