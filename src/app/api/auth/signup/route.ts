import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' 
      }, { status: 400 });
    }

    // التحقق من وجود المستخدم
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'البريد الإلكتروني مستخدم بالفعل' 
      }, { status: 400 });
    }

    // إنشاء المستخدم الجديد
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // في التطبيق الحقيقي يجب استخدام bcrypt
        role: 'USER'
      }
    });

    // إنشاء session token
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // إنشاء response مع cookie
    const response = NextResponse.json({ 
      success: true, 
      message: 'تم إنشاء الحساب بنجاح',
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

