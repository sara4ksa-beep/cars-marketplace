'use client';

import { SaleType } from '@prisma/client';

interface AuctionBadgeProps {
  saleType: SaleType;
  isActive?: boolean;
  className?: string;
}

export default function AuctionBadge({
  saleType,
  isActive = false,
  className = '',
}: AuctionBadgeProps) {
  if (saleType === SaleType.AUCTION) {
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
          isActive
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse'
            : 'bg-orange-100 text-orange-700'
        } ${className}`}
      >
        <i className="fas fa-gavel ml-1"></i>
        {isActive ? 'مزاد نشط' : 'مزاد'}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 ${className}`}
    >
      <i className="fas fa-tag ml-1"></i>
      بيع مباشر
    </div>
  );
}


