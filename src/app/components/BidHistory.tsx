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
      <div className={`bg-white rounded-2xl shadow-xl p-8 text-center ${className}`}>
        <div className="inline-block bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-6 mb-4">
          <i className="fas fa-gavel text-4xl text-gray-400"></i>
        </div>
        <p className="text-gray-600 font-medium text-lg">لا توجد مزايدات بعد</p>
        <p className="text-gray-500 text-sm mt-2">كن أول من يزايد على هذا المزاد</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 ${className}`}>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-12 h-12 rounded-xl flex items-center justify-center ml-3">
          <i className="fas fa-history"></i>
        </div>
        تاريخ المزايدات
        <span className="mr-3 text-orange-600">({bids.length})</span>
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {bids.map((bid, index) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
              index === 0
                ? 'bg-gradient-to-r from-orange-100 via-red-50 to-orange-100 border-2 border-orange-400 shadow-lg transform scale-105'
                : 'bg-gray-50 border border-gray-200 hover:shadow-md hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shadow-md ${
                  index === 0
                    ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                    : index === 1
                    ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                    : index === 2
                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {index === 0 ? (
                  <i className="fas fa-trophy"></i>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div>
                <div className="font-bold text-gray-800 text-base flex items-center">
                  {bid.user.name}
                  {index === 0 && (
                    <span className="mr-2 text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full font-bold shadow-md">
                      <i className="fas fa-crown ml-1"></i>
                      الأعلى
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center">
                  <i className="fas fa-clock ml-1.5"></i>
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
              <div className={`font-bold text-xl ${
                index === 0 ? 'text-orange-600' : 'text-gray-700'
              }`}>
                {bid.amount.toLocaleString()} ريال
              </div>
              {bid.isAutoBid && (
                <div className="text-xs text-blue-600 mt-1 flex items-center justify-end">
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

