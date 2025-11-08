'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Image from 'next/image';
import Link from 'next/link';

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

interface Bid {
  id: number;
  carId: number;
  amount: number;
  maxBid: number | null;
  isAutoBid: boolean;
  createdAt: string;
  car: {
    id: number;
    name: string;
    brand: string;
    year: number;
    imageUrl: string | null;
    images: string[];
    auctionEndDate: string | null;
    currentBid: number | null;
    saleType: string;
  };
}

interface UserStats {
  totalCars: number;
  approvedCars: number;
  pendingCars: number;
  totalBookings: number;
  activeBids: number;
  totalBids: number;
}

export default function AccountPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalCars: 0,
    approvedCars: 0,
    pendingCars: 0,
    totalBookings: 0,
    activeBids: 0,
    totalBids: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cars' | 'bookings' | 'bids'>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // التحقق من تسجيل دخول المستخدم
  useEffect(() => {
    checkAuth();
  }, []);

  // Set active tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['dashboard', 'cars', 'bookings', 'bids'].includes(tab)) {
      setActiveTab(tab as 'dashboard' | 'cars' | 'bookings' | 'bids');
    }
  }, [searchParams]);

  // جلب البيانات
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // جلب السيارات
      const carsResponse = await fetch('/api/user/cars');
      const carsData = await carsResponse.json();
      
      // جلب الطلبات
      const bookingsResponse = await fetch('/api/user/bookings');
      const bookingsData = await bookingsResponse.json();

      // جلب المزايدات
      const bidsResponse = await fetch('/api/user/bids');
      const bidsData = await bidsResponse.json();

      if (carsData.success) {
        setCars(carsData.cars || []);
        const approvedCars = (carsData.cars || []).filter((c: Car) => c.status === 'APPROVED').length;
        const pendingCars = (carsData.cars || []).filter((c: Car) => c.status === 'PENDING').length;
        
        setStats(prev => ({
          ...prev,
          totalCars: (carsData.cars || []).length,
          approvedCars,
          pendingCars
        }));
      }

      if (bookingsData.success) {
        setBookings(bookingsData.bookings || []);
        setStats(prev => ({
          ...prev,
          totalBookings: (bookingsData.bookings || []).length
        }));
      }

      if (bidsData.success) {
        setBids(bidsData.bids || []);
        const activeBids = (bidsData.bids || []).filter((b: Bid) => {
          if (!b.car.auctionEndDate) return false;
          return new Date(b.car.auctionEndDate) > new Date();
        }).length;
        
        setStats(prev => ({
          ...prev,
          totalBids: (bidsData.bids || []).length,
          activeBids
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Clear localStorage cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear localStorage cache even on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      router.push('/');
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setEditFormData({
      name: car.name,
      brand: car.brand,
      year: car.year,
      price: car.price,
      mileage: car.mileage || '',
      fuelType: car.fuelType || '',
      transmission: car.transmission || '',
      color: car.color || '',
      description: car.description || '',
      contactName: car.contactName || '',
      contactPhone: car.contactPhone || '',
      contactLocation: car.contactLocation || '',
      contactEmail: car.contactEmail || '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCar) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/user/cars/${editingCar.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json();
      if (data.success) {
        setShowEditModal(false);
        setEditingCar(null);
        // Refresh cars list
        fetchData();
        alert('تم تحديث السيارة بنجاح. سيتم مراجعتها من قبل الإدارة.');
      } else {
        alert('حدث خطأ: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating car:', error);
      alert('حدث خطأ في تحديث السيارة');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (carId: number) => {
    setCarToDelete(carId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!carToDelete) return;

    try {
      const response = await fetch(`/api/user/cars/${carToDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setShowDeleteModal(false);
        setCarToDelete(null);
        // Refresh cars list
        fetchData();
        alert('تم حذف السيارة بنجاح');
      } else {
        alert('حدث خطأ: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('حدث خطأ في حذف السيارة');
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'في انتظار المراجعة',
      'APPROVED': 'معتمدة',
      'REJECTED': 'مرفوضة',
      'SOLD': 'مباعة',
      'CONTACTED': 'تم التواصل',
      'COMPLETED': 'مكتمل'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'PENDING': 'bg-orange-500',
      'APPROVED': 'bg-green-500',
      'REJECTED': 'bg-red-500',
      'SOLD': 'bg-purple-500',
      'CONTACTED': 'bg-blue-500',
      'COMPLETED': 'bg-green-600'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  // دوال البحث والتصفية
  const filteredCars = cars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || car.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.carName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredBids = bids.filter(bid => {
    const matchesSearch = bid.car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bid.car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من المصادقة...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="flex pt-16 md:pt-0">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white transition-all duration-300 fixed h-screen top-16 md:top-0 z-30`}>
          {/* Header */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-gray-800">حسابي</h1>
                  <p className="text-sm text-gray-600">مرحباً {user.name}</p>
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
              {!sidebarCollapsed && <span>سياراتي</span>}
              {!sidebarCollapsed && stats.pendingCars > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full mr-auto">
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
              {!sidebarCollapsed && <span>حجوزاتي</span>}
            </button>

            <button
              onClick={() => setActiveTab('bids')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === 'bids' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-gavel"></i>
              {!sidebarCollapsed && <span>مزايداتي</span>}
              {!sidebarCollapsed && stats.activeBids > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full mr-auto">
                  {stats.activeBids}
                </span>
              )}
            </button>
          </nav>

          {/* Logout */}
          <div className="p-4 mt-auto">
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
        <div className={`flex-1 p-6 transition-all duration-300 ${sidebarCollapsed ? 'mr-16' : 'mr-64'}`}>
          {/* Top Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">
                {activeTab === 'dashboard' && 'لوحة التحكم'}
                {activeTab === 'cars' && 'سياراتي'}
                {activeTab === 'bookings' && 'حجوزاتي'}
                {activeTab === 'bids' && 'مزايداتي'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              {(activeTab === 'cars' || activeTab === 'bookings' || activeTab === 'bids') && (
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
                          <p className="text-sm text-gray-600">إجمالي السيارات</p>
                          <p className="text-2xl font-bold text-gray-800">{stats.totalCars}</p>
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
                          <p className="text-sm text-gray-600">إجمالي الحجوزات</p>
                          <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                      <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <i className="fas fa-gavel text-orange-600 text-xl"></i>
                        </div>
                        <div className="mr-4">
                          <p className="text-sm text-gray-600">المزايدات النشطة</p>
                          <p className="text-2xl font-bold text-gray-800">{stats.activeBids}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">إجراءات سريعة</h3>
                      <div className="space-y-3">
                        <Link
                          href="/sell-car"
                          className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <i className="fas fa-plus-circle text-blue-600"></i>
                          <span className="text-blue-800">إضافة سيارة جديدة</span>
                        </Link>
                        <button
                          onClick={() => setActiveTab('cars')}
                          className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <i className="fas fa-car text-green-600"></i>
                          <span className="text-green-800">عرض سياراتي ({stats.totalCars})</span>
                        </button>
                        <Link
                          href="/cars"
                          className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                        >
                          <i className="fas fa-car text-orange-600"></i>
                          <span className="text-orange-800">استكشف السيارات</span>
                        </Link>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">النشاط الأخير</h3>
                      <div className="space-y-3">
                        {cars.slice(0, 3).map((car) => (
                          <div key={car.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <i className="fas fa-car text-blue-600"></i>
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
                        {cars.length === 0 && (
                          <p className="text-gray-500 text-center py-4">لا يوجد نشاط حديث</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cars Tab */}
              {activeTab === 'cars' && (
                <div>
                  {/* Filters */}
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          عرض {filteredCars.length} من {cars.length} سيارة
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
                          <option value="APPROVED">معتمدة</option>
                          <option value="REJECTED">مرفوضة</option>
                          <option value="SOLD">مباعة</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {filteredCars.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                      <i className="fas fa-car text-gray-400 text-4xl mb-4"></i>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد سيارات</h3>
                      <p className="text-gray-600 mb-4">لم تقم بإضافة أي سيارات بعد</p>
                      <Link href="/sell-car" className="btn-primary inline-block">
                        <i className="fas fa-plus ml-2"></i>
                        إضافة سيارة جديدة
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredCars.map((car) => (
                        <div key={car.id} className="bg-white rounded-lg shadow overflow-hidden">
                          <div className="h-48 relative">
                            <Image
                              src={car.imageUrl || car.images[0] || '/default-car.jpg'}
                              alt={car.name}
                              fill
                              className="object-cover"
                            />
                            <div className={`absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm ${getStatusColor(car.status)}`}>
                              {getStatusText(car.status)}
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{car.name}</h3>
                            <p className="text-gray-600 mb-4">{car.brand} • {car.year}</p>
                            <p className="text-xl font-bold text-green-600 mb-4">{car.price.toLocaleString()} ريال</p>
                            
                            <div className="flex gap-2">
                              <Link
                                href={`/cars/${car.id}`}
                                className="flex-1 text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                <i className="fas fa-eye ml-2"></i>
                                عرض
                              </Link>
                              <button
                                onClick={() => handleEdit(car)}
                                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                              >
                                <i className="fas fa-edit ml-2"></i>
                                تعديل
                              </button>
                              <button
                                onClick={() => handleDeleteClick(car.id)}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <i className="fas fa-trash ml-2"></i>
                                حذف
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
                  {/* Filters */}
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          عرض {filteredBookings.length} من {bookings.length} طلب
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
                      </div>
                    </div>
                  </div>
                  
                  {filteredBookings.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                      <i className="fas fa-calendar-check text-gray-400 text-4xl mb-4"></i>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد حجوزات</h3>
                      <p className="text-gray-600">لم تقم بحجز أي سيارات بعد</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-800">{booking.carName}</h3>
                            <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">السعر: {booking.carPrice.toLocaleString()} ريال</p>
                              <p className="text-sm text-gray-600">التاريخ: {new Date(booking.createdAt).toLocaleDateString('ar-SA')}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">رقم الطلب: #{booking.id}</p>
                            </div>
                          </div>
                          
                          {booking.message && (
                            <p className="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded-lg">{booking.message}</p>
                          )}
                          
                          <Link
                            href={`/cars/${booking.carId}`}
                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            <i className="fas fa-eye ml-2"></i>
                            عرض السيارة
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bids Tab */}
              {activeTab === 'bids' && (
                <div>
                  {filteredBids.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                      <i className="fas fa-gavel text-gray-400 text-4xl mb-4"></i>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد مزايدات</h3>
                      <p className="text-gray-600 mb-4">لم تقم بالمزايدة على أي سيارات بعد</p>
                      <Link href="/cars" className="btn-primary inline-block">
                        <i className="fas fa-car ml-2"></i>
                        استكشف السيارات
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBids.map((bid) => {
                        const isActive = bid.car.auctionEndDate && new Date(bid.car.auctionEndDate) > new Date();
                        return (
                          <div key={bid.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                                  <Image
                                    src={bid.car.imageUrl || bid.car.images[0] || '/default-car.jpg'}
                                    alt={bid.car.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-lg font-bold text-gray-800">{bid.car.name}</h3>
                                  <p className="text-gray-600">{bid.car.brand} • {bid.car.year}</p>
                                </div>
                              </div>
                              {isActive ? (
                                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                                  نشطة
                                </span>
                              ) : (
                                <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
                                  منتهية
                                </span>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">مبلغ المزايدة</p>
                                <p className="text-lg font-bold text-blue-600">{bid.amount.toLocaleString()} ريال</p>
                              </div>
                              {bid.maxBid && (
                                <div>
                                  <p className="text-sm text-gray-600">الحد الأقصى</p>
                                  <p className="text-lg font-bold text-purple-600">{bid.maxBid.toLocaleString()} ريال</p>
                                </div>
                              )}
                              <div>
                                <p className="text-sm text-gray-600">السعر الحالي</p>
                                <p className="text-lg font-bold text-green-600">{bid.car.currentBid?.toLocaleString() || bid.amount.toLocaleString()} ريال</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-500">
                                {new Date(bid.createdAt).toLocaleDateString('ar-SA')}
                              </p>
                              <Link
                                href={`/auctions/${bid.car.id}`}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                              >
                                <i className="fas fa-eye ml-2"></i>
                                عرض المزاد
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Car Modal */}
      {showEditModal && editingCar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">تعديل السيارة</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCar(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم السيارة</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العلامة التجارية</label>
                  <input
                    type="text"
                    value={editFormData.brand || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">السنة</label>
                  <input
                    type="number"
                    value={editFormData.year || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, year: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">السعر (ريال)</label>
                  <input
                    type="number"
                    value={editFormData.price || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المسافة المقطوعة</label>
                  <input
                    type="number"
                    value={editFormData.mileage || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, mileage: e.target.value ? parseFloat(e.target.value) : null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع الوقود</label>
                  <select
                    value={editFormData.fuelType || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, fuelType: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر نوع الوقود</option>
                    <option value="BENZINE">بنزين</option>
                    <option value="DIESEL">ديزل</option>
                    <option value="ELECTRIC">كهربائي</option>
                    <option value="HYBRID">هجين</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع ناقل الحركة</label>
                  <select
                    value={editFormData.transmission || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, transmission: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر نوع ناقل الحركة</option>
                    <option value="MANUAL">يدوي</option>
                    <option value="AUTOMATIC">أوتوماتيك</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اللون</label>
                  <input
                    type="text"
                    value={editFormData.color || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, color: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم جهة الاتصال</label>
                  <input
                    type="text"
                    value={editFormData.contactName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, contactName: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    type="text"
                    value={editFormData.contactPhone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, contactPhone: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={editFormData.contactEmail || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, contactEmail: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                  <input
                    type="text"
                    value={editFormData.contactLocation || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, contactLocation: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value || null })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCar(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">تأكيد الحذف</h2>
              <p className="text-gray-600 text-center mb-6">
                هل أنت متأكد من حذف هذه السيارة؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCarToDelete(null);
                  }}
                  className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

