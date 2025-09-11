import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('admin-session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مخول للوصول' 
      }, { status: 401 });
    }

    // فك تشفير الـ token البسيط
    try {
      const decoded = Buffer.from(sessionToken, 'base64').toString();
      const [adminId, timestamp] = decoded.split(':');
      
      // التحقق من انتهاء صلاحية الـ token (7 أيام)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 أيام بالميللي ثانية
      
      if (tokenAge > maxAge) {
        return NextResponse.json({ 
          success: false, 
          error: 'انتهت صلاحية الجلسة' 
        }, { status: 401 });
      }

      // التحقق من وجود المشرف في قاعدة البيانات
      const admin = await prisma.user.findFirst({
        where: { 
          id: parseInt(adminId),
          role: 'ADMIN'
        }
      });

      if (!admin) {
        return NextResponse.json({ 
          success: false, 
          error: 'مشرف غير موجود' 
        }, { status: 401 });
      }

      return NextResponse.json({ 
        success: true, 
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } catch {
      return NextResponse.json({ 
        success: false, 
        error: 'رمز الجلسة غير صالح' 
      }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 