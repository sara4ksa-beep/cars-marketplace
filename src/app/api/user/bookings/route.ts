import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyUserAuth } from '@/lib/userAuth';

export async function GET(req: NextRequest) {
  try {
    const authResult = await verifyUserAuth(req);
    
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }

    const userId = authResult.user!.id;

    // جلب طلبات الحجز للمستخدم
    const bookings = await prisma.booking.findMany({
      where: {
        customerEmail: authResult.user!.email
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      bookings 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

