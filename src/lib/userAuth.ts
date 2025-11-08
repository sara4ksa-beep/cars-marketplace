import { NextRequest } from 'next/server';
import { prisma } from '@/lib/database';

export async function verifyUserAuth(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('user-session')?.value;
    
    if (!sessionToken) {
      return { success: false, error: 'غير مخول للوصول' };
    }

    // فك تشفير الـ token البسيط
    try {
      const decoded = Buffer.from(sessionToken, 'base64').toString();
      const [userId, timestamp] = decoded.split(':');
      
      // التحقق من انتهاء صلاحية الـ token (7 أيام)
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 أيام بالميللي ثانية
      
      if (tokenAge > maxAge) {
        return { success: false, error: 'انتهت صلاحية الجلسة' };
      }

      // التحقق من وجود المستخدم في قاعدة البيانات
      const user = await prisma.user.findUnique({
        where: { 
          id: parseInt(userId)
        }
      });

      if (!user) {
        return { success: false, error: 'مستخدم غير موجود' };
      }

      return { 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch {
      return { success: false, error: 'رمز الجلسة غير صالح' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

