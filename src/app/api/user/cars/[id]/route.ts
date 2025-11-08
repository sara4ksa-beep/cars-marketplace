import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { verifyUserAuth } from '@/lib/userAuth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyUserAuth(req);
    
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }

    const userId = authResult.user!.id;
    const carId = parseInt(params.id);

    // التحقق من أن السيارة مملوكة للمستخدم
    const car = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!car) {
      return NextResponse.json({ 
        success: false, 
        error: 'السيارة غير موجودة' 
      }, { status: 404 });
    }

    if (car.sellerId !== userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مخول لتعديل هذه السيارة' 
      }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      brand,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      color,
      description,
      imageUrl,
      images,
      contactName,
      contactPhone,
      contactLocation,
      contactEmail,
      saleType,
      reservePrice,
      bidIncrement,
      auctionStartDate,
      auctionEndDate,
    } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (brand !== undefined) updateData.brand = brand;
    if (year !== undefined) updateData.year = year;
    if (price !== undefined) updateData.price = price;
    if (mileage !== undefined) updateData.mileage = mileage;
    if (fuelType !== undefined) updateData.fuelType = fuelType;
    if (transmission !== undefined) updateData.transmission = transmission;
    if (color !== undefined) updateData.color = color;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (images !== undefined) updateData.images = images;
    if (contactName !== undefined) updateData.contactName = contactName;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (contactLocation !== undefined) updateData.contactLocation = contactLocation;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (saleType !== undefined) updateData.saleType = saleType;
    if (reservePrice !== undefined) updateData.reservePrice = reservePrice;
    if (bidIncrement !== undefined) updateData.bidIncrement = bidIncrement;
    if (auctionStartDate !== undefined) updateData.auctionStartDate = auctionStartDate ? new Date(auctionStartDate) : null;
    if (auctionEndDate !== undefined) updateData.auctionEndDate = auctionEndDate ? new Date(auctionEndDate) : null;

    // عند التعديل، نعيد الحالة إلى PENDING للمراجعة
    updateData.status = 'PENDING';

    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true,
      message: 'تم تحديث السيارة بنجاح',
      car: updatedCar
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyUserAuth(req);
    
    if (!authResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: authResult.error 
      }, { status: 401 });
    }

    const userId = authResult.user!.id;
    const carId = parseInt(params.id);

    // التحقق من أن السيارة مملوكة للمستخدم
    const car = await prisma.car.findUnique({
      where: { id: carId }
    });

    if (!car) {
      return NextResponse.json({ 
        success: false, 
        error: 'السيارة غير موجودة' 
      }, { status: 404 });
    }

    if (car.sellerId !== userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مخول لحذف هذه السيارة' 
      }, { status: 403 });
    }

    await prisma.car.delete({
      where: { id: carId },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'تم حذف السيارة بنجاح' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

