'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Car {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  createdAt: string;
  saleType: string;
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

interface Order {
  id: number;
  userId: number;
  carId: number;
  status: string;
  totalPrice: number;
  createdAt: string;
  car: {
    name: string;
    brand: string;
  };
  user: {
    name: string;
  };
}

interface DashboardStats {
  totalCars: number;
  pendingCars: number;
  approvedCars: number;
  rejectedCars: number;
  totalValue: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  auctionCars: number;
  directSaleCars: number;
  activeAuctions: number;
}

export default function AdminDashboard() {
  const [pendingCars, setPendingCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    pendingCars: 0,
    approvedCars: 0,
    rejectedCars: 0,
    totalValue: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    auctionCars: 0,
    directSaleCars: 0,
    activeAuctions: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [carsRes, approvedCarsRes, bookingsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/pending-cars'),
        fetch('/api/admin/cars?limit=1000'),
        fetch('/api/bookings?limit=1000'),
        fetch('/api/admin/orders?limit=1000')
      ]);
      
      const carsData = await carsRes.json();
      const approvedCarsData = await approvedCarsRes.json();
      const bookingsData = await bookingsRes.json();
      const ordersData = await ordersRes.json();

      if (carsData.success) {
        setPendingCars(carsData.cars || []);
        setStats(prev => ({
          ...prev,
          pendingCars: (carsData.cars || []).length,
        }));
      }

      if (approvedCarsData.success) {
        const approvedCars = approvedCarsData.cars || [];
        const totalValue = approvedCars.reduce((sum: number, car: Car) => sum + car.price, 0);
        const auctionCars = approvedCars.filter((car: Car) => car.saleType === 'AUCTION').length;
        const directSaleCars = approvedCars.filter((car: Car) => car.saleType === 'DIRECT_SALE').length;
        
        setStats(prev => ({
          ...prev,
          totalCars: approvedCars.length,
          approvedCars: approvedCars.length,
          totalValue,
          auctionCars,
          directSaleCars,
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
          completedBookings,
        }));
      }

      if (ordersData.success) {
        setOrders(ordersData.orders || []);
        const allOrders = ordersData.orders || [];
        const pendingOrders = allOrders.filter((o: Order) => o.status === 'PENDING').length;
        const confirmedOrders = allOrders.filter((o: Order) => o.status === 'CONFIRMED').length;
        const completedOrders = allOrders.filter((o: Order) => o.status === 'COMPLETED').length;
        const cancelledOrders = allOrders.filter((o: Order) => o.status === 'CANCELLED').length;
        const totalRevenue = allOrders
          .filter((o: Order) => o.status === 'COMPLETED')
          .reduce((sum: number, o: Order) => sum + o.totalPrice, 0);
        
        setStats(prev => ({
          ...prev,
          totalOrders: allOrders.length,
          pendingOrders,
          confirmedOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue,
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم الرئيسية</h1>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
            تحديث
          </button>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">إجمالي السيارات</p>
              <p className="text-3xl font-bold">{stats.totalCars}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <i className="fas fa-car text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">الطلبات المعلقة</p>
              <p className="text-3xl font-bold">{stats.pendingBookings}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <i className="fas fa-calendar-check text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">إجمالي الطلبات</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <i className="fas fa-shopping-cart text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">إجمالي الإيرادات</p>
              <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-purple-100 text-xs mt-1">ريال</p>
            </div>
            <div className="bg-white/20 p-4 rounded-lg">
              <i className="fas fa-dollar-sign text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <i className="fas fa-clock text-yellow-600 text-xl"></i>
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
            <div className="p-3 bg-orange-100 rounded-lg">
              <i className="fas fa-gavel text-orange-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">سيارات المزادات</p>
              <p className="text-2xl font-bold text-gray-800">{stats.auctionCars}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <i className="fas fa-tag text-blue-600 text-xl"></i>
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">البيع المباشر</p>
              <p className="text-2xl font-bold text-gray-800">{stats.directSaleCars}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">طلبات معلقة</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</p>
            </div>
            <div className="text-yellow-600">
              <i className="fas fa-hourglass-half text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">طلبات مؤكدة</p>
              <p className="text-2xl font-bold text-gray-800">{stats.confirmedOrders}</p>
            </div>
            <div className="text-blue-600">
              <i className="fas fa-check text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">طلبات مكتملة</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completedOrders}</p>
            </div>
            <div className="text-green-600">
              <i className="fas fa-check-circle text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">طلبات ملغاة</p>
              <p className="text-2xl font-bold text-gray-800">{stats.cancelledOrders}</p>
            </div>
            <div className="text-red-600">
              <i className="fas fa-times-circle text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">الطلبات الأخيرة</h3>
            <Link
              href="/admin/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              عرض الكل
            </Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  order.status === 'COMPLETED' ? 'bg-green-100' :
                  order.status === 'CONFIRMED' ? 'bg-blue-100' :
                  order.status === 'CANCELLED' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  <i className={`fas ${
                    order.status === 'COMPLETED' ? 'fa-check-circle text-green-600' :
                    order.status === 'CONFIRMED' ? 'fa-check text-blue-600' :
                    order.status === 'CANCELLED' ? 'fa-times-circle text-red-600' :
                    'fa-hourglass-half text-yellow-600'
                  }`}></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{order.car.name}</p>
                  <p className="text-xs text-gray-500">{order.user.name} • {order.totalPrice.toLocaleString()} ريال</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-gray-500 text-center py-4">لا توجد طلبات</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">النشاط الأخير</h3>
            <Link
              href="/admin/pending-cars"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              عرض الكل
            </Link>
          </div>
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
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">مؤشرات الأداء</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-600">معدل إكمال الطلبات</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {stats.totalValue > 0 ? (stats.totalValue / 1000000).toFixed(1) : 0}M
            </div>
            <p className="text-sm text-gray-600">القيمة بالمليون ريال</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/admin/pending-cars"
            className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <i className="fas fa-car text-blue-600"></i>
            <span className="text-blue-800 font-medium">مراجعة السيارات ({stats.pendingCars})</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <i className="fas fa-calendar-check text-green-600"></i>
            <span className="text-green-800 font-medium">مراجعة الطلبات ({stats.pendingBookings})</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <i className="fas fa-shopping-cart text-purple-600"></i>
            <span className="text-purple-800 font-medium">إدارة الطلبات ({stats.pendingOrders})</span>
          </Link>
          <Link
            href="/admin/cars"
            className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <i className="fas fa-list text-orange-600"></i>
            <span className="text-orange-800 font-medium">جميع السيارات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

