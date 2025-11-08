'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Car {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  createdAt: string;
}

interface Booking {
  id: number;
  carId: number;
  carName: string;
  carPrice: number;
  customerName: string;
  status: string;
  createdAt: string;
}

interface AdminStats {
  totalCars: number;
  pendingCars: number;
  approvedCars: number;
  rejectedCars: number;
  totalValue: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
}

export default function AdminPage() {
  const [pendingCars, setPendingCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalCars: 0,
    pendingCars: 0,
    approvedCars: 0,
    rejectedCars: 0,
    totalValue: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // جلب السيارات المنتظرة
      const carsResponse = await fetch('/api/admin/pending-cars');
      const carsData = await carsResponse.json();
      
      // جلب السيارات المعتمدة
      const approvedCarsResponse = await fetch('/api/admin/cars?limit=1000');
      const approvedCarsData = await approvedCarsResponse.json();
      
      // جلب الطلبات
      const bookingsResponse = await fetch('/api/bookings?limit=1000');
      const bookingsData = await bookingsResponse.json();

      if (carsData.success) {
        setPendingCars(carsData.cars || []);
        const pendingCount = (carsData.cars || []).length;
        
        setStats(prev => ({
          ...prev,
          pendingCars: pendingCount,
        }));
      }

      if (approvedCarsData.success) {
        const approvedCars = approvedCarsData.cars || [];
        const totalValue = approvedCars.reduce((sum: number, car: Car) => sum + car.price, 0);
        
        setStats(prev => ({
          ...prev,
          totalCars: approvedCars.length,
          approvedCars: approvedCars.length,
          totalValue
        }));
      }

      if (bookingsData.success) {
        setBookings(bookingsData.bookings || []);
        const allBookings = bookingsData.bookings || [];
        const pendingBookings = allBookings.filter((b: Booking) => b.status === 'PENDING').length;
        const completedBookings = allBookings.filter((b: Booking) => b.status === 'COMPLETED').length;
        
        setStats(prev => ({
          ...prev,
          totalBookings: allBookings.length,
          pendingBookings,
          completedBookings
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <i className="fas fa-car text-blue-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">السيارات المنتظرة</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingCars}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">السيارات المعتمدة</p>
              <p className="text-2xl font-bold text-gray-800">{stats.approvedCars}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <i className="fas fa-calendar-check text-purple-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <i className="fas fa-dollar-sign text-orange-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">القيمة الإجمالية</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalValue.toLocaleString()} ريال</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">النشاط الأخير</h3>
          <div className="space-y-3">
            {pendingCars.slice(0, 5).map((car) => (
              <div key={car.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-car text-orange-600"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{car.name}</p>
                  <p className="text-xs text-gray-500">{car.brand} • {car.year}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(car.createdAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
            {pendingCars.length === 0 && (
              <p className="text-gray-500 text-center py-4">لا يوجد نشاط حديث</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">إجراءات سريعة</h3>
          <div className="space-y-3">
            <Link
              href="/admin/cars"
              className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <i className="fas fa-car text-blue-600"></i>
              <span className="text-blue-800">مراجعة السيارات ({stats.pendingCars})</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <i className="fas fa-calendar-check text-green-600"></i>
              <span className="text-green-800">مراجعة الطلبات ({stats.pendingBookings})</span>
            </Link>
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
              <span>تحديث البيانات</span>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">مؤشرات الأداء</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {stats.totalCars > 0 ? Math.round((stats.approvedCars / stats.totalCars) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-600">معدل الموافقة</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-600">معدل إكمال الطلبات</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {stats.totalValue > 0 ? (stats.totalValue / 1000000).toFixed(1) : 0}M
            </div>
            <p className="text-sm text-gray-600">القيمة بالمليون ريال</p>
          </div>
        </div>
      </div>
    </div>
  );
}
