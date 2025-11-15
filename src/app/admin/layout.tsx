'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [admin, setAdmin] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingCarsCount, setPendingCarsCount] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setAuthLoading(false);
      return;
    }
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    if (admin) {
      fetchCounts();
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

  const fetchCounts = async () => {
    try {
      const [carsRes, bookingsRes] = await Promise.all([
        fetch('/api/admin/pending-cars'),
        fetch('/api/bookings')
      ]);
      
      const carsData = await carsRes.json();
      const bookingsData = await bookingsRes.json();
      
      if (carsData.success) {
        setPendingCarsCount(carsData.cars?.length || 0);
      }
      
      if (bookingsData.success) {
        const pending = (bookingsData.bookings || []).filter((b: any) => b.status === 'PENDING').length;
        setPendingBookingsCount(pending);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
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

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(path);
  };

  // If on login page, render children without layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

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
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 flex flex-col h-screen sticky top-0`}>
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
          <nav className="p-4 space-y-2 flex-1">
            <Link
              href="/admin/dashboard"
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive('/admin/dashboard') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-chart-line"></i>
              {!sidebarCollapsed && <span>لوحة التحكم</span>}
            </Link>
            
            <Link
              href="/admin/pending-cars"
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive('/admin/pending-cars') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-clock"></i>
              {!sidebarCollapsed && <span>السيارات المعلقة</span>}
              {!sidebarCollapsed && pendingCarsCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-auto">
                  {pendingCarsCount}
                </span>
              )}
            </Link>
            
            <Link
              href="/admin/cars"
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive('/admin/cars') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-car"></i>
              {!sidebarCollapsed && <span>إدارة السيارات</span>}
            </Link>
            
            <Link
              href="/admin/bookings"
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive('/admin/bookings') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-calendar-check"></i>
              {!sidebarCollapsed && <span>إدارة الحجوزات</span>}
              {!sidebarCollapsed && pendingBookingsCount > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full mr-auto">
                  {pendingBookingsCount}
                </span>
              )}
            </Link>

            <Link
              href="/admin/orders"
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive('/admin/orders') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-shopping-cart"></i>
              {!sidebarCollapsed && <span>إدارة الطلبات</span>}
            </Link>

            <Link
              href="/admin/users"
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive('/admin/users') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-users"></i>
              {!sidebarCollapsed && <span>إدارة المستخدمين</span>}
            </Link>

            <Link
              href="/admin/deposits"
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive('/admin/deposits') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-wallet"></i>
              {!sidebarCollapsed && <span>تأكيدات المزايدة</span>}
            </Link>

            <Link
              href="/admin/settings"
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive('/admin/settings') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-cog"></i>
              {!sidebarCollapsed && <span>الإعدادات</span>}
            </Link>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
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
          {children}
        </div>
      </div>
    </div>
  );
}


