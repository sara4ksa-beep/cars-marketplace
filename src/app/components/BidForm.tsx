'use client';

import { useState } from 'react';

interface BidFormProps {
  carId: number;
  currentBid: number;
  bidIncrement: number;
  minBid: number;
  onBidPlaced?: () => void;
  userId?: number;
  className?: string;
}

export default function BidForm({
  carId,
  currentBid,
  bidIncrement,
  minBid,
  onBidPlaced,
  userId,
  className = '',
}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState(minBid);
  const [maxBid, setMaxBid] = useState('');
  const [isAutoBid, setIsAutoBid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    if (!userId) {
      setError('يجب تسجيل الدخول للمزايدة');
      setIsSubmitting(false);
      return;
    }

    if (bidAmount < minBid) {
      setError(`المزايدة يجب أن تكون على الأقل ${minBid.toLocaleString()} ريال`);
      setIsSubmitting(false);
      return;
    }

    if (isAutoBid && maxBid && parseFloat(maxBid) < bidAmount) {
      setError('الحد الأقصى للمزايدة يجب أن يكون أكبر من أو يساوي مبلغ المزايدة');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId,
          userId,
          amount: bidAmount,
          maxBid: isAutoBid && maxBid ? parseFloat(maxBid) : null,
          isAutoBid,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setBidAmount(minBid + bidIncrement);
        setMaxBid('');
        setIsAutoBid(false);
        if (onBidPlaced) {
          setTimeout(() => {
            onBidPlaced();
            setSuccess(false);
          }, 2000);
        }
      } else {
        setError(data.error || 'حدث خطأ أثناء وضع المزايدة');
      }
    } catch (err: any) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error('Error placing bid:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickBidAmounts = [
    minBid,
    minBid + bidIncrement,
    minBid + bidIncrement * 2,
    minBid + bidIncrement * 3,
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        <i className="fas fa-gavel ml-2"></i>
        وضع مزايدة
      </h3>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">المزايدة الحالية</span>
          <span className="text-xl font-bold text-blue-600">
            {currentBid.toLocaleString()} ريال
          </span>
        </div>
        <div className="text-xs text-gray-500">
          الحد الأدنى للمزايدة التالية: {minBid.toLocaleString()} ريال
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <i className="fas fa-exclamation-circle ml-2"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <i className="fas fa-check-circle ml-2"></i>
          تم وضع المزايدة بنجاح!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            مبلغ المزايدة (ريال) *
          </label>
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
            min={minBid}
            step={bidIncrement}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={minBid.toLocaleString()}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickBidAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setBidAmount(amount)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              {amount.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="checkbox"
            id="autoBid"
            checked={isAutoBid}
            onChange={(e) => setIsAutoBid(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="autoBid" className="text-sm text-gray-700">
            <i className="fas fa-robot ml-1"></i>
            مزايدة تلقائية (حد أقصى)
          </label>
        </div>

        {isAutoBid && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأقصى للمزايدة (ريال)
            </label>
            <input
              type="number"
              value={maxBid}
              onChange={(e) => setMaxBid(e.target.value)}
              min={bidAmount}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: 100000"
            />
            <p className="text-xs text-gray-500 mt-1">
              سيتم المزايدة تلقائياً حتى يصل إلى هذا الحد
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
              جاري المعالجة...
            </span>
          ) : (
            <>
              <i className="fas fa-gavel ml-2"></i>
              وضع مزايدة
            </>
          )}
        </button>
      </form>

      {!userId && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm text-center">
          <i className="fas fa-info-circle ml-2"></i>
          يجب تسجيل الدخول للمزايدة
        </div>
      )}
    </div>
  );
}

