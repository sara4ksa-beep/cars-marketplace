import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyAdminAuth } from '@/lib/auth';
import { CarStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    // التحقق من صحة تسجيل دخول المشرف
    const authResult = await verifyAdminAuth(req);
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }
    const { carId, action } = await req.json();
    
    if (!carId || !action) {
      return NextResponse.json({ 
        success: false, 
        error: 'carId and action are required' 
      }, { status: 400 });
    }

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ 
        success: false, 
        error: 'action must be either "approve" or "reject"' 
      }, { status: 400 });
    }

    const status = action === 'approve' ? CarStatus.APPROVED : CarStatus.REJECTED;

    const car = await prisma.car.update({
      where: { id: parseInt(carId) },
      data: { status: status }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Car ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      car: {
        id: car.id,
        name: car.name,
        status: car.status
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 