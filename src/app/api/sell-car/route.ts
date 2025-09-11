import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { CarStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const car = await prisma.car.create({
      data: {
        name: data.name,
        brand: data.brand,
        year: data.year,
        price: data.price,
        mileage: data.mileage,
        fuelType: data.fuelType,
        transmission: data.transmission,
        color: data.color,
        description: data.description,
        imageUrl: data.imageUrl || data.images?.[0], // الصورة الأولى كصورة رئيسية
        images: data.images || [], // جميع الصور المرفوعة
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactLocation: data.contactLocation,
        contactEmail: data.contactEmail,
        status: CarStatus.PENDING, // السيارة في انتظار موافقة المشرف
        // يمكنك إضافة sellerId إذا كان لديك مستخدمين
      },
    });
    return NextResponse.json({ success: true, car });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 