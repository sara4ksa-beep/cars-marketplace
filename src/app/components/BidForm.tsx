'use client';

import { useState, useEffect } from 'react';

interface BidFormProps {
  carId: number;
  currentBid: number;
  bidIncrement: number;
  minBid: number;
  onBidPlaced?: () => void;
  userId?: number;
  className?: string;
}

interface DepositStatus {
  hasDeposit: boolean;
  isGrandfathered: boolean;
  deposit: any;
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
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [depositStatus, setDepositStatus] = useState<DepositStatus | null>(null);
  const [checkingDeposit, setCheckingDeposit] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (userId) {
      checkDepositStatus();
    } else {
      setCheckingDeposit(false);
    }
  }, [userId, carId]);

  const checkDepositStatus = async () => {
    try {
      setCheckingDeposit(true);
      const response = await fetch(`/api/payments/check-deposit?carId=${carId}`);
      const data = await response.json();
      
      if (data.success) {
        setDepositStatus(data);
      } else {
        // If API returns error (e.g., user not authenticated), set default status
        setDepositStatus({
          hasDeposit: false,
          isGrandfathered: false,
          deposit: null,
        });
      }
    } catch (err) {
      console.error('Error checking deposit status:', err);
      // On error, set default status so UI can still render
      setDepositStatus({
        hasDeposit: false,
        isGrandfathered: false,
        deposit: null,
      });
    } finally {
      setCheckingDeposit(false);
    }
  };

  const handleCreateDeposit = async (e?: React.MouseEvent, testMode: boolean = false) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (!userId) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      setProcessingPayment(true);
      setError(null);
      
      console.log('Creating deposit for carId:', carId, testMode ? '(TEST MODE)' : '');
      
      const response = await fetch('/api/payments/create-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carId, testMode }),
      });

      const data = await response.json();
      console.log('Deposit creation response:', data);

      if (data.success) {
        if (data.testMode) {
          // Test mode: Just refresh the page to show updated deposit status
          console.log('🧪 Test mode: Payment bypassed, refreshing page...');
          setSuccess(true);
          // Refresh the page after a short delay to show the success message
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else if (data.charge?.redirectUrl) {
          // Real payment: Redirect to Tap payment page
          console.log('Redirecting to:', data.charge.redirectUrl);
          window.location.href = data.charge.redirectUrl;
        } else {
          // Success but no redirect URL (shouldn't happen)
          setSuccess(true);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        const errorMsg = data.error || 'فشل في إنشاء عملية الدفع';
        console.error('Deposit creation failed:', errorMsg, data);
        setError(errorMsg);
        setProcessingPayment(false);
      }
    } catch (err: any) {
      console.error('Error creating deposit:', err);
      setError('حدث خطأ في الاتصال بالخادم');
      setProcessingPayment(false);
    }
  };

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

    const bidValue = bidAmount === '' ? 0 : bidAmount;
    if (bidValue < minBid) {
      setError(`المزايدة يجب أن تكون على الأقل ${minBid.toLocaleString()} ريال`);
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
          amount: bidValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setBidAmount('');
        if (onBidPlaced) {
          setTimeout(() => {
            onBidPlaced();
            setSuccess(false);
          }, 2000);
        }
      } else {
        if (data.requiresDeposit) {
          setError(data.error || 'يجب دفع 200 ريال كتأكيد قبل المزايدة');
          // Refresh deposit status
          checkDepositStatus();
        } else {
          setError(data.error || 'حدث خطأ أثناء وضع المزايدة');
        }
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
    <div className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-12 h-12 rounded-xl flex items-center justify-center ml-3">
            <i className="fas fa-gavel"></i>
          </div>
          وضع مزايدة
        </h3>
        <p className="text-gray-600 text-sm">شارك في المزاد وكن الفائز</p>
      </div>

      <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-700 font-semibold flex items-center">
            <i className="fas fa-tag text-blue-600 ml-2"></i>
            المزايدة الحالية
          </span>
          <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {currentBid.toLocaleString()}
          </span>
        </div>
        <div className="text-right text-sm text-gray-500 mb-2">ريال</div>
        <div className="pt-3 border-t border-blue-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center">
              <i className="fas fa-info-circle text-blue-500 ml-1.5"></i>
              الحد الأدنى للمزايدة التالية
            </span>
            <span className="font-bold text-blue-700">{minBid.toLocaleString()} ريال</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 text-sm flex items-center shadow-md">
          <i className="fas fa-exclamation-circle ml-3 text-red-600 text-lg"></i>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-xl text-green-700 text-sm flex items-center shadow-md animate-pulse">
          <i className="fas fa-check-circle ml-3 text-green-600 text-lg"></i>
          <span className="font-bold">تم وضع المزايدة بنجاح!</span>
        </div>
      )}

      {/* Only show form if user is logged in and has deposit or is grandfathered */}
      {userId && !checkingDeposit && depositStatus && (depositStatus.hasDeposit || depositStatus.isGrandfathered) && (
        <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <i className="fas fa-money-bill-wave text-orange-500 ml-2"></i>
            مبلغ المزايدة (ريال) *
          </label>
          <input
            type="number"
            value={bidAmount === '' ? '' : bidAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setBidAmount('');
              } else {
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                  setBidAmount(numValue);
                }
              }
            }}
            min={minBid}
            step={bidIncrement}
            required
            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-lg font-bold bg-gray-50 focus:bg-white"
            placeholder={minBid.toLocaleString()}
          />
        </div>

        <div>
          <p className="text-xs text-gray-600 mb-3 font-medium">مبالغ سريعة</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickBidAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setBidAmount(amount)}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  bidAmount !== '' && bidAmount === amount
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-md'
                }`}
              >
                {amount.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white py-4 px-6 rounded-xl font-bold hover:from-orange-600 hover:via-red-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 text-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin ml-3"></div>
              جاري المعالجة...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <i className="fas fa-gavel ml-3 text-xl"></i>
              وضع مزايدة
            </span>
          )}
        </button>
      </form>
      )}

      {!userId && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl text-yellow-800 text-sm text-center shadow-md">
          <i className="fas fa-info-circle ml-2 text-yellow-600"></i>
          <span className="font-semibold">يجب تسجيل الدخول للمزايدة</span>
        </div>
      )}

      {userId && checkingDeposit && (
        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-xl text-blue-800 text-sm text-center">
          <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <span className="font-semibold">جاري التحقق من حالة التأكيد...</span>
        </div>
      )}

      {userId && !checkingDeposit && depositStatus && !depositStatus.hasDeposit && !depositStatus.isGrandfathered && (
        <div className="mt-6 p-6 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl shadow-lg">
          <div className="text-center mb-4">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-lock text-orange-600 text-2xl"></i>
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">يجب دفع 200 ريال كتأكيد للمزايدة</h4>
            <p className="text-gray-600 text-sm mb-4">
              يجب دفع 200 ريال كتأكيد للمزايدة على هذه السيارة. سيتم استرداد المبلغ إذا لم تربح المزاد، أو سيتم خصمه من سعر الشراء إذا ربحت.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              type="button"
              onClick={(e) => handleCreateDeposit(e, false)}
              disabled={processingPayment}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 text-lg"
            >
              {processingPayment ? (
                <span className="flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin ml-3"></div>
                  جاري المعالجة...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <i className="fas fa-credit-card ml-3 text-xl"></i>
                  دفع 200 ريال كتأكيد
                </span>
              )}
            </button>
            
            {/* Test Mode Button - Only show in development/localhost */}
            {(typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) && (
              <button
                type="button"
                onClick={(e) => handleCreateDeposit(e, true)}
                disabled={processingPayment}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm"
              >
                {processingPayment ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                    جاري المعالجة...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-flask ml-2"></i>
                    🧪 تجربة بدون دفع (Test Mode)
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {userId && !checkingDeposit && !depositStatus && (
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-yellow-800 text-sm text-center shadow-md">
          <i className="fas fa-exclamation-triangle ml-2 text-yellow-600"></i>
          <span className="font-semibold">حدث خطأ في التحقق من حالة التأكيد. يرجى المحاولة مرة أخرى.</span>
          <button
            onClick={checkDepositStatus}
            className="mt-3 block w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
    </div>
  );
}

