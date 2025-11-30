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

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
      }, { status: 401 });
    }

    // فحص كلمة المرور (في التطبيق الحقيقي يجب استخدام bcrypt)
    if (user.password !== password) {
      return NextResponse.json({ 
        success: false, 
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' 
      }, { status: 401 });
    }

    // إنشاء session token
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // إنشاء response مع cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'تم تسجيل الدخول بنجاح',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    // تعيين cookie للـ session
    response.cookies.set('user-session', sessionToken, {
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








