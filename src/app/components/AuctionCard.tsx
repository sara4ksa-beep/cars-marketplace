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
  bidCount = 0,
  isActive = false,
  featured = false,
}: AuctionCardProps) {
  const displayPrice = currentBid || price;

  return (
    <Link
      href={`/auctions/${id}`}
      className="card-modern group cursor-pointer relative"
    >
      {featured && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
          <i className="fas fa-star ml-1"></i>
          مميز
        </div>
      )}

      <div className="card-image-wrapper">
        <Image
          src={imageUrl || '/default-car.jpg'}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-3 left-3">
          <AuctionBadge saleType={SaleType.AUCTION} isActive={isActive} />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3">
          {brand} • {year}
        </p>

        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">السعر الحالي</span>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
              {displayPrice.toLocaleString()} ريال
            </span>
          </div>
          {reservePrice && (
            <div className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded-lg inline-block">
              <i className="fas fa-lock ml-1"></i>
              السعر الأدنى: {reservePrice.toLocaleString()} ريال
            </div>
          )}
        </div>

        {isActive && auctionEndDate && (
          <div className="mb-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
            <AuctionTimer endDate={auctionEndDate} />
          </div>
        )}

        <div className="flex items-center justify-between text-xs sm:text-sm pt-3 border-t border-gray-200">
          <span className="text-gray-600 flex items-center">
            <i className="fas fa-gavel ml-1.5 text-orange-500"></i>
            {bidCount} {bidCount === 1 ? 'مزايدة' : 'مزايدة'}
          </span>
          <span className="text-blue-600 font-semibold group-hover:text-blue-700 transition-colors flex items-center">
            <i className="fas fa-eye ml-1.5"></i>
            عرض التفاصيل
          </span>
        </div>
      </div>
    </Link>
  );
}

