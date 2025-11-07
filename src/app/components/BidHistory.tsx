'use client';

interface Bid {
  id: number;
  amount: number;
  isAutoBid: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

interface BidHistoryProps {
  bids: Bid[];
  className?: string;
}

export default function BidHistory({ bids, className = '' }: BidHistoryProps) {
  if (bids.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 text-4xl mb-4">
          <i className="fas fa-gavel"></i>
        </div>
        <p className="text-gray-600">لا توجد مزايدات بعد</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        <i className="fas fa-history ml-2"></i>
        تاريخ المزايدات ({bids.length})
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {bids.map((bid, index) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              index === 0
                ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-gray-800">
                  {bid.user.name}
                  {index === 0 && (
                    <span className="mr-2 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                      الأعلى
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(bid.createdAt).toLocaleString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
            <div className="text-left">
              <div className="font-bold text-lg text-orange-600">
                {bid.amount.toLocaleString()} ريال
              </div>
              {bid.isAutoBid && (
                <div className="text-xs text-blue-600">
                  <i className="fas fa-robot ml-1"></i>
                  مزايدة تلقائية
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

