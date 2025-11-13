'use client';

import Image from 'next/image';
import Link from 'next/link';
import AuctionBadge from './AuctionBadge';
import AuctionTimer from './AuctionTimer';
import { SaleType } from '@prisma/client';

interface AuctionCardProps {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  currentBid?: number | null;
  reservePrice?: number | null;
  imageUrl: string | null;
  auctionEndDate: Date | string | null;
  auctionStartDate?: Date | string | null;
  bidCount?: number;
  isActive?: boolean;
  featured?: boolean;
}

export default function AuctionCard({
  id,
  name,
  brand,
  year,
  price,
  currentBid,
  reservePrice,
  imageUrl,
  auctionEndDate,
  auctionStartDate,
  bidCount = 0,
  isActive = false,
  featured = false,
}: AuctionCardProps) {
  const displayPrice = currentBid || price;

  return (
    <Link
      href={`/auctions/${id}`}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-300 transform hover:-translate-y-2"
    >
      {featured && (
        <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl animate-pulse">
          <i className="fas fa-star ml-1.5"></i>
          مميز
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={imageUrl || '/default-car.jpg'}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge */}
        <div className="absolute top-4 left-4 z-10">
          <AuctionBadge saleType={SaleType.AUCTION} isActive={isActive} />
        </div>

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute bottom-4 right-4 z-10 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            نشط الآن
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors min-h-[3.5rem]">
          {name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex items-center">
          <i className="fas fa-car text-orange-500 ml-2"></i>
          {brand} • {year}
        </p>

        {/* Price Section */}
        <div className="mb-4 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 font-medium">السعر الحالي</span>
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {displayPrice.toLocaleString()}
            </span>
          </div>
          <div className="text-right text-xs text-gray-500">ريال</div>
          {reservePrice && (
            <div className="mt-2 pt-2 border-t border-orange-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 flex items-center">
                  <i className="fas fa-lock ml-1.5 text-orange-500"></i>
                  السعر الأدنى
                </span>
                <span className="font-bold text-orange-700">
                  {reservePrice.toLocaleString()} ريال
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        {auctionEndDate && (
          <div className="mb-4 p-3 bg-gradient-to-r from-orange-100 via-red-50 to-orange-100 rounded-xl border-2 border-orange-300">
            <div className="text-xs text-gray-700 font-semibold mb-2 text-center">
              <i className="fas fa-clock ml-1.5 text-orange-600"></i>
              {isActive ? 'الوقت المتبقي' : 'حالة المزاد'}
            </div>
            <AuctionTimer endDate={auctionEndDate} startDate={auctionStartDate} />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5">
              <i className="fas fa-gavel text-orange-600"></i>
              <span>{bidCount}</span>
            </div>
            <span className="text-gray-600 text-xs">
              {bidCount === 1 ? 'مزايدة' : bidCount === 2 ? 'مزايدتان' : 'مزايدات'}
            </span>
          </div>
          <div className="text-orange-600 font-bold text-sm flex items-center group-hover:text-orange-700 transition-colors">
            <span>عرض التفاصيل</span>
            <i className="fas fa-arrow-left mr-2 group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      </div>
    </Link>
  );
}

