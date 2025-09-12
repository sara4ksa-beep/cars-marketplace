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
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [activeTab, setActiveTab] = useState<'cars' | 'bookings'>('cars');
  const router = useRouter();

  // التحقق من تسجيل دخول المشرف
  useEffect(() => {
    checkAuth();
  }, []);

  // جلب السيارات في انتظار الموافقة والطلبات
  useEffect(() => {
    if (admin) {
      fetchPendingCars();
      fetchBookings();
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

  const fetchPendingCars = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/pending-cars');
      const data = await response.json();
      if (data.success) {
        setPendingCars(data.cars);
        // حساب الإحصائيات
        const totalValue = data.cars.reduce((sum: number, car: Car) => sum + car.price, 0);
        setStats(prev => ({
          ...prev,
          totalCars: data.cars.length,
          pendingCars: data.cars.length,
          totalValue
        }));
      } else {
        if (data.error === 'غير مخول للوصول' || data.error === 'انتهت صلاحية الجلسة') {
          router.push('/admin/login');
        } else {
          console.error('Error fetching pending cars:', data.error);
        }
      }
    } catch (error) {
      console.error('Error fetching pending cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      if (data.success) {
        setBookings(data.bookings);
        const pendingBookings = data.bookings.filter((b: Booking) => b.status === 'PENDING').length;
        const completedBookings = data.bookings.filter((b: Booking) => b.status === 'COMPLETED').length;
        
        setStats(prev => ({
          ...prev,
          totalBookings: data.bookings.length,
          pendingBookings,
          completedBookings
        }));
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
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
        // إزالة السيارة من القائمة
        setPendingCars(prev => prev.filter(car => car.id !== carId));
        setSelectedCar(null);
        
        // تحديث الإحصائيات
        setStats(prev => ({
          ...prev,
          pendingCars: prev.pendingCars - 1,
          approvedCars: action === 'approve' ? prev.approvedCars + 1 : prev.approvedCars,
          rejectedCars: action === 'reject' ? prev.rejectedCars + 1 : prev.rejectedCars,
        }));
        
        // رسالة نجاح مع تصميم أفضل
        showSuccessMessage(action === 'approve' ? 'تم اعتماد السيارة بنجاح' : 'تم رفض السيارة');
      } else {
        if (data.error === 'غير مخول للوصول' || data.error === 'انتهت صلاحية الجلسة') {
          router.push('/admin/login');
        } else {
          showErrorMessage('حدث خطأ: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Error updating car status:', error);
      showErrorMessage('حدث خطأ في التحديث');
    } finally {
      setActionLoading(null);
    }
  };

  const showSuccessMessage = (message: string) => {
    // يمكن استبدال هذا بمكون toast أفضل
    alert(message);
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
        
        // Update stats
        const pendingBookings = bookings.filter(b => b.id !== bookingId && b.status === 'PENDING').length + (newStatus === 'PENDING' ? 1 : 0);
        const completedBookings = bookings.filter(b => b.id !== bookingId && b.status === 'COMPLETED').length + (newStatus === 'COMPLETED' ? 1 : 0);
        
        setStats(prev => ({
          ...prev,
          pendingBookings,
          completedBookings
        }));
        
        showSuccessMessage(`تم تحديث حالة الطلب إلى ${getStatusText(newStatus)}`);
      } else {
        showErrorMessage('حدث خطأ في تحديث حالة الطلب');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      showErrorMessage('حدث خطأ في التحديث');
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
      'PENDING': 'from-orange-500 to-yellow-500',
      'CONTACTED': 'from-blue-500 to-blue-600',
      'APPROVED': 'from-green-500 to-green-600',
      'REJECTED': 'from-red-500 to-red-600',
      'COMPLETED': 'from-purple-500 to-purple-600'
    };
    return colorMap[status] || 'from-gray-500 to-gray-600';
  };

  const showErrorMessage = (message: string) => {
    alert(message);
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-user-shield text-blue-600 text-3xl"></i>
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium">جاري التحقق من المصادقة...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-car text-blue-600 text-3xl"></i>
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Admin Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
                  <i className="fas fa-crown text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    لوحة تحكم المشرف
                  </h1>
                  <p className="text-gray-600 flex items-center gap-2">
                    <i className="fas fa-user-circle text-blue-500"></i>
                    مرحباً <span className="font-semibold">{admin.name}</span> 
                    <span className="text-gray-400">({admin.email})</span>
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <i className="fas fa-sign-out-alt"></i>
                تسجيل الخروج
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-2 mb-8 border border-white/20">
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={() => setActiveTab('cars')}
                className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === 'cars'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-car ml-2"></i>
                إدارة السيارات
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === 'bookings'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className="fas fa-calendar-check ml-2"></i>
                إدارة الطلبات
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">السيارات المنتظرة</p>
                  <p className="text-3xl font-bold">{stats.pendingCars}</p>
                </div>
                <div className="bg-blue-400/30 p-3 rounded-xl">
                  <i className="fas fa-clock text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">السيارات المعتمدة</p>
                  <p className="text-3xl font-bold">{stats.approvedCars}</p>
                </div>
                <div className="bg-green-400/30 p-3 rounded-xl">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">السيارات المرفوضة</p>
                  <p className="text-3xl font-bold">{stats.rejectedCars}</p>
                </div>
                <div className="bg-red-400/30 p-3 rounded-xl">
                  <i className="fas fa-times-circle text-2xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">إجمالي الطلبات</p>
                  <p className="text-3xl font-bold">{stats.totalBookings}</p>
                </div>
                <div className="bg-purple-400/30 p-3 rounded-xl">
                  <i className="fas fa-calendar-check text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Booking Stats */}
          {activeTab === 'bookings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">طلبات في الانتظار</p>
                    <p className="text-3xl font-bold">{stats.pendingBookings}</p>
                  </div>
                  <div className="bg-orange-400/30 p-3 rounded-xl">
                    <i className="fas fa-clock text-2xl"></i>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">طلبات مكتملة</p>
                    <p className="text-3xl font-bold">{stats.completedBookings}</p>
                  </div>
                  <div className="bg-green-400/30 p-3 rounded-xl">
                    <i className="fas fa-check-double text-2xl"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Content based on active tab */}
          {activeTab === 'cars' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="bg-gradient-to-r from-orange-400 to-red-400 p-3 rounded-2xl">
                  <i className="fas fa-hourglass-half text-white text-lg"></i>
                </div>
                السيارات في انتظار الموافقة
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                  {pendingCars.length}
                </span>
              </h2>
            </div>
            
            {pendingCars.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gradient-to-r from-green-400 to-blue-400 p-8 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <i className="fas fa-check-double text-white text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  عمل رائع! 🎉
                </h3>
                <p className="text-gray-600 text-lg">
                  لا توجد سيارات في انتظار الموافقة
                </p>
                <p className="text-gray-500 mt-2">
                  جميع السيارات المرسلة تم مراجعتها بنجاح
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {pendingCars.map((car) => (
                  <div key={car.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 overflow-hidden">
                                         {/* Car Image */}
                     <div className="relative h-48 overflow-hidden">
                       <Image
                         src={car.imageUrl || '/default-car.jpg'}
                         alt={car.name}
                         fill
                         className="object-cover transition-transform duration-300 hover:scale-110"
                       />
                       <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                         <i className="fas fa-clock mr-1"></i>
                         منتظر
                       </div>
                       <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                         <i className="fas fa-calendar mr-1"></i>
                         {new Date(car.createdAt).toLocaleDateString('ar-SA')}
                       </div>
                       {/* Image Count Badge */}
                       {car.images && car.images.length > 1 && (
                         <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold">
                           <i className="fas fa-images mr-1"></i>
                           {car.images.length}
                         </div>
                       )}
                     </div>
                     
                     {/* Additional Images Preview */}
                     {car.images && car.images.length > 1 && (
                       <div className="px-4 py-2 border-t">
                         <div className="flex gap-2 overflow-x-auto">
                           {car.images.slice(1, 4).map((image, index) => (
                             <div key={index} className="h-12 w-12 relative rounded-lg overflow-hidden flex-shrink-0">
                               <Image
                                 src={image}
                                 alt={`${car.name} ${index + 2}`}
                                 fill
                                 className="object-cover"
                               />
                             </div>
                           ))}
                           {car.images.length > 4 && (
                             <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">
                               +{car.images.length - 4}
                             </div>
                           )}
                         </div>
                       </div>
                     )}
                    
                    {/* Car Details */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-900 truncate">{car.name}</h3>
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {car.brand}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                          <div className="flex items-center gap-2 text-gray-600">
                            <i className="fas fa-money-bill-wave text-green-500"></i>
                            <span className="text-sm">السعر</span>
                          </div>
                          <span className="font-bold text-green-600 text-lg">
                            {car.price.toLocaleString()} ريال
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 p-3 rounded-xl">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                              <i className="fas fa-calendar text-blue-500"></i>
                              <span className="text-xs">السنة</span>
                            </div>
                            <span className="font-semibold">{car.year}</span>
                          </div>
                          
                          {car.mileage && (
                            <div className="bg-gray-50 p-3 rounded-xl">
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <i className="fas fa-tachometer-alt text-orange-500"></i>
                                <span className="text-xs">المسافة</span>
                              </div>
                              <span className="font-semibold">{car.mileage.toLocaleString()} كم</span>
                            </div>
                          )}
                          
                          {car.fuelType && (
                            <div className="bg-gray-50 p-3 rounded-xl">
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <i className="fas fa-gas-pump text-red-500"></i>
                                <span className="text-xs">الوقود</span>
                              </div>
                              <span className="font-semibold">{car.fuelType}</span>
                            </div>
                          )}
                          
                          {car.transmission && (
                            <div className="bg-gray-50 p-3 rounded-xl">
                              <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <i className="fas fa-cogs text-purple-500"></i>
                                <span className="text-xs">ناقل الحركة</span>
                              </div>
                              <span className="font-semibold">{car.transmission}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                                             {car.description && (
                         <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                           <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                             <i className="fas fa-info-circle text-blue-500"></i>
                             الوصف
                           </h4>
                           <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
                         </div>
                       )}
                       
                       {/* Contact Information */}
                       <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                         <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                           <i className="fas fa-address-book text-purple-500"></i>
                           معلومات التواصل
                         </h4>
                         <div className="grid grid-cols-1 gap-3 text-sm">
                           {car.contactName && (
                             <div className="flex items-center gap-2">
                               <i className="fas fa-user text-blue-500 w-4"></i>
                               <span className="text-gray-600">البائع:</span>
                               <span className="font-medium text-gray-800">{car.contactName}</span>
                             </div>
                           )}
                           {car.contactPhone && (
                             <div className="flex items-center gap-2">
                               <i className="fas fa-phone text-green-500 w-4"></i>
                               <span className="text-gray-600">الهاتف:</span>
                               <a href={`tel:${car.contactPhone}`} className="font-medium text-green-600 hover:underline">
                                 {car.contactPhone}
                               </a>
                             </div>
                           )}
                           {car.contactLocation && (
                             <div className="flex items-center gap-2">
                               <i className="fas fa-map-marker-alt text-red-500 w-4"></i>
                               <span className="text-gray-600">الموقع:</span>
                               <span className="font-medium text-gray-800">{car.contactLocation}</span>
                             </div>
                           )}
                           {car.contactEmail && (
                             <div className="flex items-center gap-2">
                               <i className="fas fa-envelope text-orange-500 w-4"></i>
                               <span className="text-gray-600">البريد:</span>
                               <a href={`mailto:${car.contactEmail}`} className="font-medium text-orange-600 hover:underline">
                                 {car.contactEmail}
                               </a>
                             </div>
                           )}
                         </div>
                       </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleCarAction(car.id, 'approve')}
                          disabled={actionLoading === car.id}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          {actionLoading === car.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <i className="fas fa-check"></i>
                              <span className="font-semibold">اعتماد</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleCarAction(car.id, 'reject')}
                          disabled={actionLoading === car.id}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          {actionLoading === car.id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <i className="fas fa-times"></i>
                              <span className="font-semibold">رفض</span>
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

          {/* Bookings Management Section */}
          {activeTab === 'bookings' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-3 rounded-2xl">
                    <i className="fas fa-calendar-check text-white text-lg"></i>
                  </div>
                  إدارة طلبات الحجز
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                    {bookings.length}
                  </span>
                </h2>
              </div>
              
              {bookings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-400 p-8 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <i className="fas fa-calendar-check text-white text-4xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    لا توجد طلبات حجز
                  </h3>
                  <p className="text-gray-600 text-lg">
                    لم يتم إرسال أي طلبات حجز بعد
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{booking.carName}</h3>
                              <span className={`bg-gradient-to-r ${getStatusColor(booking.status)} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                                {getStatusText(booking.status)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <i className="fas fa-money-bill-wave text-green-500"></i>
                                {booking.carPrice.toLocaleString()} ريال
                              </span>
                              <span className="flex items-center gap-1">
                                <i className="fas fa-calendar text-blue-500"></i>
                                {new Date(booking.createdAt).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                              <i className="fas fa-user text-blue-500"></i>
                              معلومات العميل
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 w-20">الاسم:</span>
                                <span className="font-medium">{booking.customerName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 w-20">الهاتف:</span>
                                <a href={`tel:${booking.customerPhone}`} className="font-medium text-blue-600 hover:underline">
                                  {booking.customerPhone}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600 w-20">البريد:</span>
                                <a href={`mailto:${booking.customerEmail}`} className="font-medium text-blue-600 hover:underline">
                                  {booking.customerEmail}
                                </a>
                              </div>
                            </div>
                          </div>

                          {booking.message && (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                <i className="fas fa-comment text-purple-500"></i>
                                الرسالة
                              </h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {booking.message}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {booking.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleBookingStatusUpdate(booking.id, 'CONTACTED')}
                                disabled={actionLoading === booking.id}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                              >
                                <i className="fas fa-phone"></i>
                                تم التواصل
                              </button>
                              <button
                                onClick={() => handleBookingStatusUpdate(booking.id, 'APPROVED')}
                                disabled={actionLoading === booking.id}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                              >
                                <i className="fas fa-check"></i>
                                موافق عليه
                              </button>
                              <button
                                onClick={() => handleBookingStatusUpdate(booking.id, 'REJECTED')}
                                disabled={actionLoading === booking.id}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                              >
                                <i className="fas fa-times"></i>
                                رفض
                              </button>
                            </>
                          )}
                          
                          {booking.status === 'CONTACTED' && (
                            <>
                              <button
                                onClick={() => handleBookingStatusUpdate(booking.id, 'APPROVED')}
                                disabled={actionLoading === booking.id}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                              >
                                <i className="fas fa-check"></i>
                                موافق عليه
                              </button>
                              <button
                                onClick={() => handleBookingStatusUpdate(booking.id, 'COMPLETED')}
                                disabled={actionLoading === booking.id}
                                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                              >
                                <i className="fas fa-check-double"></i>
                                مكتمل
                              </button>
                            </>
                          )}

                          {booking.status === 'APPROVED' && (
                            <button
                              onClick={() => handleBookingStatusUpdate(booking.id, 'COMPLETED')}
                              disabled={actionLoading === booking.id}
                              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                            >
                              <i className="fas fa-check-double"></i>
                              مكتمل
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <i className="fas fa-bolt"></i>
              إجراءات سريعة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 p-4 rounded-2xl flex items-center gap-3">
                <i className="fas fa-car text-2xl"></i>
                <div className="text-right">
                  <div className="font-semibold">عرض جميع السيارات</div>
                  <div className="text-sm text-white/70">إدارة السيارات المعتمدة</div>
                </div>
              </button>
              
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 p-4 rounded-2xl flex items-center gap-3">
                <i className="fas fa-chart-bar text-2xl"></i>
                <div className="text-right">
                  <div className="font-semibold">تقارير المبيعات</div>
                  <div className="text-sm text-white/70">إحصائيات وتقارير</div>
                </div>
              </button>
              
              <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 p-4 rounded-2xl flex items-center gap-3">
                <i className="fas fa-users text-2xl"></i>
                <div className="text-right">
                  <div className="font-semibold">إدارة المستخدمين</div>
                  <div className="text-sm text-white/70">البائعين والمشترين</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 