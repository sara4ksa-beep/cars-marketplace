'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Car {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  color: string | null;
  description: string | null;
  imageUrl: string | null;
  images: string[];
  contactName: string | null;
  contactPhone: string | null;
  contactLocation: string | null;
  contactEmail: string | null;
  status: string;
  createdAt: string;
}

export default function PendingCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPendingCars();
  }, []);

  const fetchPendingCars = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pending-cars');
      const data = await response.json();
      
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.error('Error fetching pending cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (carId: number) => {
    try {
      setActionLoading(carId);
      const response = await fetch('/api/admin/approve-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId,
          action: 'approve',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCars(prev => prev.filter(car => car.id !== carId));
        alert('تم قبول السيارة بنجاح');
      } else {
        alert('حدث خطأ: ' + data.error);
      }
    } catch (error) {
      console.error('Error approving car:', error);
      alert('حدث خطأ في الموافقة على السيارة');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (carId: number) => {
    if (!confirm('هل أنت متأكد من رفض هذه السيارة؟')) {
      return;
    }

    try {
      setActionLoading(carId);
      const response = await fetch('/api/admin/approve-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId,
          action: 'reject',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCars(prev => prev.filter(car => car.id !== carId));
        alert('تم رفض السيارة بنجاح');
      } else {
        alert('حدث خطأ: ' + data.error);
      }
    } catch (error) {
      console.error('Error rejecting car:', error);
      alert('حدث خطأ في رفض السيارة');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">السيارات المعلقة</h1>
        <p className="text-gray-600 mt-1">مراجعة وموافقة أو رفض السيارات المعلقة</p>
      </div>

      {/* Cars List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : cars.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-check-circle text-green-400 text-4xl mb-4"></i>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد سيارات معلقة</h3>
            <p className="text-gray-600">جميع السيارات تمت مراجعتها</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {cars.map((car) => (
              <div key={car.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex gap-6">
                  {/* Car Image */}
                  <div className="flex-shrink-0">
                    {car.imageUrl ? (
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        <i className="fas fa-car text-gray-400 text-2xl"></i>
                      </div>
                    )}
                  </div>

                  {/* Car Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{car.name}</h3>
                        <p className="text-sm text-gray-600">{car.brand} • {car.year}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-bold text-green-600">
                          {car.price.toLocaleString()} ريال
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(car.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Car Specifications */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      {car.mileage && (
                        <div>
                          <span className="text-gray-500">المسافة المقطوعة:</span>
                          <span className="mr-2 font-medium">{car.mileage.toLocaleString()} كم</span>
                        </div>
                      )}
                      {car.fuelType && (
                        <div>
                          <span className="text-gray-500">نوع الوقود:</span>
                          <span className="mr-2 font-medium">{car.fuelType}</span>
                        </div>
                      )}
                      {car.transmission && (
                        <div>
                          <span className="text-gray-500">ناقل الحركة:</span>
                          <span className="mr-2 font-medium">{car.transmission}</span>
                        </div>
                      )}
                      {car.color && (
                        <div>
                          <span className="text-gray-500">اللون:</span>
                          <span className="mr-2 font-medium">{car.color}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {car.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{car.description}</p>
                    )}

                    {/* Contact Information */}
                    {(car.contactName || car.contactPhone || car.contactEmail) && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">معلومات الاتصال:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {car.contactName && (
                            <div>
                              <span className="text-gray-500">الاسم:</span>
                              <span className="mr-2 font-medium">{car.contactName}</span>
                            </div>
                          )}
                          {car.contactPhone && (
                            <div>
                              <span className="text-gray-500">الهاتف:</span>
                              <span className="mr-2 font-medium">{car.contactPhone}</span>
                            </div>
                          )}
                          {car.contactEmail && (
                            <div>
                              <span className="text-gray-500">البريد:</span>
                              <span className="mr-2 font-medium">{car.contactEmail}</span>
                            </div>
                          )}
                          {car.contactLocation && (
                            <div>
                              <span className="text-gray-500">الموقع:</span>
                              <span className="mr-2 font-medium">{car.contactLocation}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApprove(car.id)}
                        disabled={actionLoading === car.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === car.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>جاري المعالجة...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check"></i>
                            <span>قبول</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(car.id)}
                        disabled={actionLoading === car.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === car.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>جاري المعالجة...</span>
                          </>
                        ) : (
                          <>
                            <i className="fas fa-times"></i>
                            <span>رفض</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => router.push(`/admin/cars/${car.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <i className="fas fa-eye"></i>
                        <span>عرض التفاصيل</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

