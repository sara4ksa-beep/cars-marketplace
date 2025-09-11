import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'البريد الإلكتروني وكلمة المرور مطلوبان' 
      }, { status: 400 });
    }

    // البحث عن المستخدم المشرف
    const admin = await prisma.user.findFirst({
      where: { 
        email: email,
        role: 'ADMIN'
      }
    });

    if (!admin) {
      return NextResponse.json({ 
        success: false, 
        error: 'بيانات المشرف غير صحيحة' 
      }, { status: 401 });
    }

    // فحص كلمة المرور (في التطبيق الحقيقي يجب استخدام bcrypt)
    if (admin.password !== password) {
      return NextResponse.json({ 
        success: false, 
        error: 'بيانات المشرف غير صحيحة' 
      }, { status: 401 });
    }

    // إنشاء session token بسيط (في التطبيق الحقيقي يجب استخدام JWT)
    const sessionToken = Buffer.from(`${admin.id}:${Date.now()}`).toString('base64');

    // إنشاء response مع cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'تم تسجيل الدخول بنجاح',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

    // تعيين cookie للـ session
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 أيام
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 