'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Image from 'next/image';

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

interface Booking {
  id: number;
  carId: number;
  carName: string;
  carPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string | null;
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
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cars' | 'bookings'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const router = useRouter();

  // التحقق من تسجيل دخول المشرف
  useEffect(() => {
    checkAuth();
  }, []);

  // جلب البيانات
  useEffect(() => {
    if (admin) {
      fetchData();
    }
  }, [admin]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/verify');
      const data = await response.json();
      if (data.success) {
        setAdmin(data.admin);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // جلب السيارات
      const carsResponse = await fetch('/api/admin/pending-cars');
      const carsData = await carsResponse.json();
      
      // جلب الطلبات
      const bookingsResponse = await fetch('/api/bookings');
      const bookingsData = await bookingsResponse.json();

      if (carsData.success) {
        setPendingCars(carsData.cars || []);
        const totalValue = (carsData.cars || []).reduce((sum: number, car: Car) => sum + car.price, 0);
        
        setStats(prev => ({
          ...prev,
          totalCars: (carsData.cars || []).length,
          pendingCars: (carsData.cars || []).length,
          totalValue
        }));
      }

      if (bookingsData.success) {
        setBookings(bookingsData.bookings || []);
        const pendingBookings = (bookingsData.bookings || []).filter((b: Booking) => b.status === 'PENDING').length;
        const completedBookings = (bookingsData.bookings || []).filter((b: Booking) => b.status === 'COMPLETED').length;
        
        setStats(prev => ({
          ...prev,
          totalBookings: (bookingsData.bookings || []).length,
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


  const handleCarAction = async (carId: number, action: 'approve' | 'reject') => {
    try {
      setActionLoading(carId);
      const response = await fetch('/api/admin/approve-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carId, action }),
      });

      const data = await response.json();
      if (data.success) {
        setPendingCars(prev => prev.filter(car => car.id !== carId));
        setStats(prev => ({
          ...prev,
          pendingCars: prev.pendingCars - 1,
          approvedCars: action === 'approve' ? prev.approvedCars + 1 : prev.approvedCars,
          rejectedCars: action === 'reject' ? prev.rejectedCars + 1 : prev.rejectedCars,
        }));
        alert(action === 'approve' ? 'تم اعتماد السيارة بنجاح' : 'تم رفض السيارة');
      } else {
        alert('حدث خطأ: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating car status:', error);
      alert('حدث خطأ في التحديث');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBookingStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      setActionLoading(bookingId);
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        ));
        
        const pendingBookings = bookings.filter(b => b.id !== bookingId && b.status === 'PENDING').length + (newStatus === 'PENDING' ? 1 : 0);
        const completedBookings = bookings.filter(b => b.id !== bookingId && b.status === 'COMPLETED').length + (newStatus === 'COMPLETED' ? 1 : 0);
        
        setStats(prev => ({
          ...prev,
          pendingBookings,
          completedBookings
        }));
        
        alert(`تم تحديث حالة الطلب إلى ${getStatusText(newStatus)}`);
      } else {
        alert('حدث خطأ في تحديث حالة الطلب');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('حدث خطأ في التحديث');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'في انتظار المراجعة',
      'CONTACTED': 'تم التواصل',
      'APPROVED': 'موافق عليه',
      'REJECTED': 'مرفوض',
      'COMPLETED': 'مكتمل'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'PENDING': 'bg-orange-500',
      'CONTACTED': 'bg-blue-500',
      'APPROVED': 'bg-green-500',
      'REJECTED': 'bg-red-500',
      'COMPLETED': 'bg-purple-500'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/admin/login');
    }
  };

  // دوال البحث والتصفية
  const filteredCars = pendingCars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      default:
        return 0;
    }
  });


  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من المصادقة...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300`}>
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-gray-800">لوحة التحكم</h1>
                  <p className="text-sm text-gray-600">مرحباً {admin.name}</p>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-gray-600`}></i>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-chart-line"></i>
              {!sidebarCollapsed && <span>لوحة التحكم</span>}
            </button>
            
            <button
              onClick={() => setActiveTab('cars')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === 'cars' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-car"></i>
              {!sidebarCollapsed && <span>إدارة السيارات</span>}
              {!sidebarCollapsed && stats.pendingCars > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-auto">
                  {stats.pendingCars}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === 'bookings' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-calendar-check"></i>
              {!sidebarCollapsed && <span>إدارة الطلبات</span>}
              {!sidebarCollapsed && stats.pendingBookings > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full mr-auto">
                  {stats.pendingBookings}
                </span>
              )}
            </button>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t mt-auto">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <i className="fas fa-sign-out-alt"></i>
              {!sidebarCollapsed && <span>تسجيل الخروج</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Top Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === 'dashboard' && 'لوحة التحكم'}
                {activeTab === 'cars' && 'إدارة السيارات'}
                {activeTab === 'bookings' && 'إدارة الطلبات'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              {(activeTab === 'cars' || activeTab === 'bookings') && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="البحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
              )}
              
              
              {/* Refresh Button */}
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
              >
                <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل البيانات...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div>
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
                        {pendingCars.slice(0, 3).map((car) => (
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
                        <button
                          onClick={() => setActiveTab('cars')}
                          className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <i className="fas fa-car text-blue-600"></i>
                          <span className="text-blue-800">مراجعة السيارات ({stats.pendingCars})</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <i className="fas fa-calendar-check text-green-600"></i>
                          <span className="text-green-800">مراجعة الطلبات ({stats.pendingBookings})</span>
                        </button>
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
              )}

              {/* Cars Tab */}
              {activeTab === 'cars' && (
                <div>
                  {/* Filters and Sort */}
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          عرض {sortedCars.length} من {pendingCars.length} سيارة
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="newest">الأحدث أولاً</option>
                          <option value="oldest">الأقدم أولاً</option>
                          <option value="price-high">الأعلى سعراً</option>
                          <option value="price-low">الأقل سعراً</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {sortedCars.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                      <i className="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد سيارات في انتظار الموافقة</h3>
                      <p className="text-gray-600">جميع السيارات تم مراجعتها بنجاح</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {sortedCars.map((car) => (
                        <div key={car.id} className="bg-white rounded-lg shadow overflow-hidden">
                          <div className="h-48 relative">
                            <Image
                              src={car.imageUrl || '/default-car.jpg'}
                              alt={car.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                              منتظر
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{car.name}</h3>
                            <p className="text-gray-600 mb-4">{car.brand} • {car.year}</p>
                            <p className="text-xl font-bold text-green-600 mb-4">{car.price.toLocaleString()} ريال</p>
                            
                            {car.description && (
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{car.description}</p>
                            )}
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCarAction(car.id, 'approve')}
                                disabled={actionLoading === car.id}
                                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {actionLoading === car.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <i className="fas fa-check"></i>
                                    <span>اعتماد</span>
                                  </>
                                )}
                              </button>
                              
                              <button
                                onClick={() => handleCarAction(car.id, 'reject')}
                                disabled={actionLoading === car.id}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {actionLoading === car.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <i className="fas fa-times"></i>
                                    <span>رفض</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div>
                  {/* Filters and Sort */}
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          عرض {sortedBookings.length} من {bookings.length} طلب
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">جميع الحالات</option>
                          <option value="PENDING">في الانتظار</option>
                          <option value="CONTACTED">تم التواصل</option>
                          <option value="APPROVED">موافق عليه</option>
                          <option value="REJECTED">مرفوض</option>
                          <option value="COMPLETED">مكتمل</option>
                        </select>
                        
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="newest">الأحدث أولاً</option>
                          <option value="oldest">الأقدم أولاً</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {sortedBookings.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                      <i className="fas fa-calendar-check text-blue-500 text-4xl mb-4"></i>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد طلبات حجز</h3>
                      <p className="text-gray-600">لم يتم إرسال أي طلبات حجز بعد</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800">{booking.carName}</h3>
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">العميل: {booking.customerName}</p>
                              <p className="text-sm text-gray-600">الهاتف: {booking.customerPhone}</p>
                              <p className="text-sm text-gray-600">البريد: {booking.customerEmail}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">السعر: {booking.carPrice.toLocaleString()} ريال</p>
                              <p className="text-sm text-gray-600">التاريخ: {new Date(booking.createdAt).toLocaleDateString('ar-SA')}</p>
                            </div>
                          </div>
                          
                          {booking.message && (
                            <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded-lg">{booking.message}</p>
                          )}
                          
                          <div className="flex gap-2">
                            {booking.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'CONTACTED')}
                                  disabled={actionLoading === booking.id}
                                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
                                >
                                  تم التواصل
                                </button>
                                <button
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'APPROVED')}
                                  disabled={actionLoading === booking.id}
                                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                                >
                                  موافق عليه
                                </button>
                                <button
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'REJECTED')}
                                  disabled={actionLoading === booking.id}
                                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
                                >
                                  رفض
                                </button>
                              </>
                            )}
                            
                            {booking.status === 'CONTACTED' && (
                              <>
                                <button
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'APPROVED')}
                                  disabled={actionLoading === booking.id}
                                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                                >
                                  موافق عليه
                                </button>
                                <button
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'COMPLETED')}
                                  disabled={actionLoading === booking.id}
                                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 text-sm"
                                >
                                  مكتمل
                                </button>
                              </>
                            )}

                            {booking.status === 'APPROVED' && (
                              <button
                                onClick={() => handleBookingStatusUpdate(booking.id, 'COMPLETED')}
                                disabled={actionLoading === booking.id}
                                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 text-sm"
                              >
                                مكتمل
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
