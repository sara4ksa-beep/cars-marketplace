'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';
import { TAP_PUBLISHABLE_KEY } from '@/lib/tapPayment';

interface Car {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  imageUrl: string | null;
  saleType: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.carId;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    checkAuth();
    fetchCar();
  }, [carId]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      if (data.success && data.user) {
        setUserId(data.user.id);
      } else {
        router.push(`/login?redirect=/checkout/${carId}`);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push(`/login?redirect=/checkout/${carId}`);
    }
  };

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/cars/${carId}`);
      const data = await response.json();

      if (data.success) {
        if (data.car.saleType !== 'DIRECT_SALE') {
          setError('هذه السيارة متاحة فقط من خلال المزاد');
          return;
        }
        setCar(data.car);
      } else {
        setError(data.error || 'لم يتم العثور على السيارة');
      }
    } catch (err: any) {
      setError('حدث خطأ في تحميل بيانات السيارة');
      console.error('Error fetching car:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!userId || !car) return;

    setCreatingOrder(true);
    setError(null);

    try {
      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId: car.id,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        setError(orderData.error || 'فشل إنشاء الطلب');
        setCreatingOrder(false);
        return;
      }

      // Create Tap payment charge
      const paymentResponse = await fetch('/api/payments/create-order-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderData.order.id,
          carId: car.id,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentData.success) {
        setError(paymentData.error || 'فشل إنشاء عملية الدفع');
        setCreatingOrder(false);
        return;
      }

      // Redirect to Tap payment
      if (paymentData.charge && paymentData.charge.transaction?.url) {
        window.location.href = paymentData.charge.transaction.url;
      } else {
        setError('لم يتم إنشاء رابط الدفع');
        setCreatingOrder(false);
      }
    } catch (err: any) {
      console.error('Error during checkout:', err);
      setError('حدث خطأ أثناء عملية الدفع');
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg font-medium">جاري تحميل بيانات الطلب...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !car) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-block bg-gradient-to-br from-red-100 to-orange-100 rounded-full p-8 mb-6">
              <i className="fas fa-exclamation-triangle text-6xl text-red-500"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">خطأ</h1>
            <p className="text-gray-600 mb-8 text-lg">{error}</p>
            <button
              onClick={() => router.push('/cars')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <i className="fas fa-arrow-right ml-2"></i>
              العودة إلى السيارات
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">إتمام الطلب</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">ملخص الطلب</h2>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={car.imageUrl || '/default-car.jpg'}
                      alt={car.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{car.name}</h3>
                    <p className="text-sm text-gray-600">{car.brand} • {car.year}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">السعر</span>
                    <span className="font-bold text-gray-900">{car.price.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-bold text-gray-900">الإجمالي</span>
                    <span className="text-lg font-bold text-blue-600">{car.price.toLocaleString()} ريال</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">الدفع</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">المبلغ الإجمالي</span>
                    <span className="text-2xl font-bold text-gray-900">{car.price.toLocaleString()} ريال</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={creatingOrder || !userId}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {creatingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card"></i>
                      إتمام الدفع
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  سيتم توجيهك إلى صفحة الدفع الآمنة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

