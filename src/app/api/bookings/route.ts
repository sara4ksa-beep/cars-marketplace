import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { carId, carName, carPrice, name, email, phone, message } = body;

    // Validate required fields
    if (!carId || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'جميع الحقول المطلوبة يجب أن تكون مملوءة' },
        { status: 400 }
      );
    }

    // Create booking record
    const booking = await prisma.booking.create({
      data: {
        carId: parseInt(carId),
        carName,
        carPrice: parseInt(carPrice),
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        message: message || '',
        status: 'PENDING',
        createdAt: new Date(),
      },
    });

    // Send email notification (you can implement this with your preferred email service)
    try {
      await sendBookingNotification(booking);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلب الحجز بنجاح',
      bookingId: booking.id,
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في إرسال طلب الحجز' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';

    const skip = (page - 1) * limit;

    // Build where clause
    const where = status !== 'all' ? { status: status.toUpperCase() as any } : {};

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب طلبات الحجز' },
      { status: 500 }
    );
  }
}

// Email notification function (implement with your email service)
async function sendBookingNotification(booking: any) {
  // This is a placeholder - implement with your preferred email service
  // Examples: SendGrid, Nodemailer, AWS SES, etc.
  
  const emailContent = `
    طلب حجز جديد:
    
    السيارة: ${booking.carName}
    السعر: ${booking.carPrice.toLocaleString()} ريال
    العميل: ${booking.customerName}
    البريد الإلكتروني: ${booking.customerEmail}
    الهاتف: ${booking.customerPhone}
    الرسالة: ${booking.message || 'لا توجد رسالة'}
    التاريخ: ${booking.createdAt.toLocaleString('ar-SA')}
  `;

  console.log('Booking notification email:', emailContent);
  
  // TODO: Implement actual email sending
  // Example with Nodemailer:
  // await transporter.sendMail({
  //   from: 'noreply@carsite.com',
  //   to: 'admin@carsite.com',
  //   subject: 'طلب حجز جديد',
  //   text: emailContent,
  // });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, status } = body;

    // Validate required fields
    if (!bookingId || !status) {
      return NextResponse.json(
        { success: false, error: 'معرف الطلب والحالة مطلوبان' },
        { status: 400 }
      );
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(bookingId) },
      data: { 
        status,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح',
      booking: updatedBooking,
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث حالة الطلب' },
      { status: 500 }
    );
  }
}
