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

    // جلب مزايدات المستخدم مع معلومات السيارة
    const bids = await prisma.bid.findMany({
      where: {
        userId: userId
      },
      include: {
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            year: true,
            imageUrl: true,
            images: true,
            auctionEndDate: true,
            currentBid: true,
            saleType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      bids 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}









