'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        // Cache user in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        setUser(null);
        // Clear cache if not authenticated
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    // Check localStorage first for immediate display
    if (typeof window !== 'undefined') {
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          setUser(parsedUser);
        } catch (e) {
          // Invalid cache, clear it
          localStorage.removeItem('user');
        }
      }
    }
    // Then verify with server
    checkAuth();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };

    if (isAccountDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountDropdownOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Clear localStorage cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      setUser(null);
      setIsAccountDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear localStorage cache even on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      setUser(null);
      setIsAccountDropdownOpen(false);
      router.push('/');
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg sticky top-0 z-40 backdrop-blur-sm">
        <div className="container-custom">
          <nav className="flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 md:space-x-3 space-x-reverse group">
              <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="/newlogo1.png" 
                  alt="موقع السيارات المتميز" 
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden lg:flex items-center space-x-4 md:space-x-6 space-x-reverse">
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '/cars', label: 'السيارات' },
                { href: '/compare', label: 'مقارنة السيارات' },
                { href: '/sell-car', label: 'بيع سيارتك' },
                { href: '/contact', label: 'اتصل بنا' }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-300 text-sm md:text-base relative group hover:bg-white/10 hover:backdrop-blur-sm ${
                    pathname === item.href ? 'bg-white/10 backdrop-blur-sm' : ''
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-white rounded-full"></span>
                  )}
            </Link>
            ))}
          </div>

          {/* Login/Account Button & Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4 space-x-reverse">
            {!mounted ? (
              // Show login button during SSR to match server render
              <Link 
                href="/login" 
                className="hidden sm:flex items-center bg-white text-blue-600 px-4 md:px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 text-sm md:text-base shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-w-[120px] md:min-w-[140px] justify-center"
              >
                <i className="fas fa-sign-in-alt ml-1.5"></i>
                <span className="hidden md:inline">تسجيل الدخول</span>
                <span className="md:hidden">دخول</span>
              </Link>
            ) : user ? (
              <div className="hidden sm:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="flex items-center bg-white text-blue-600 px-4 md:px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 text-sm md:text-base shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-w-[120px] md:min-w-[140px] justify-center"
                >
                  <i className="fas fa-user-circle ml-1.5"></i>
                  <span className="hidden md:inline">{user.name}</span>
                  <span className="md:hidden">حسابي</span>
                  <i className={`fas fa-chevron-down mr-1.5 text-xs transition-transform duration-300 ${isAccountDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
                
                {/* Dropdown Menu */}
                {isAccountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 backdrop-blur-sm">
                    <div className="py-2">
                      <Link
                        href="/account"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <i className="fas fa-chart-line text-blue-600 w-5"></i>
                        <span className="font-medium">لوحة التحكم</span>
                      </Link>
                      <Link
                        href="/account?tab=cars"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <i className="fas fa-car text-blue-600 w-5"></i>
                        <span className="font-medium">سياراتي</span>
                      </Link>
                      <Link
                        href="/account?tab=bookings"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <i className="fas fa-calendar-check text-blue-600 w-5"></i>
                        <span className="font-medium">حجوزاتي</span>
                      </Link>
                      <Link
                        href="/account?tab=bids"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <i className="fas fa-gavel text-blue-600 w-5"></i>
                        <span className="font-medium">مزايداتي</span>
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <i className="fas fa-sign-out-alt w-5"></i>
                        <span className="font-medium">تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden sm:flex items-center bg-white text-blue-600 px-4 md:px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 text-sm md:text-base shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-w-[120px] md:min-w-[140px] justify-center"
              >
                <i className="fas fa-sign-in-alt ml-1.5"></i>
                <span className="hidden md:inline">تسجيل الدخول</span>
                <span className="md:hidden">دخول</span>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 touch-target"
              aria-label="فتح القائمة"
            >
              <div className={`w-6 h-6 flex flex-col justify-center space-y-1.5 transition-all duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}>
                <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </nav>
      </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar - Side Sliding */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/20">
            <h3 className="text-lg font-bold text-white flex items-center">
              <i className="fas fa-bars ml-2"></i>
              القائمة الرئيسية
            </h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95 touch-target"
              aria-label="إغلاق القائمة"
            >
              <i className="fas fa-times text-white text-lg"></i>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {[
                { href: '/', label: 'الرئيسية', icon: 'fas fa-home', color: 'from-blue-500 to-blue-600' },
                { href: '/cars', label: 'السيارات', icon: 'fas fa-car', color: 'from-green-500 to-green-600' },
                { href: '/compare', label: 'مقارنة السيارات', icon: 'fas fa-balance-scale', color: 'from-purple-500 to-purple-600' },
                { href: '/sell-car', label: 'بيع سيارتك', icon: 'fas fa-plus-circle', color: 'from-orange-500 to-orange-600' },
                { href: '/contact', label: 'اتصل بنا', icon: 'fas fa-phone', color: 'from-red-500 to-red-600' }
              ].map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center py-3.5 px-4 rounded-xl transition-all duration-300 font-bold text-sm md:text-base backdrop-blur-sm border ${
                    pathname === item.href 
                      ? 'bg-white/25 border-white/40 scale-105' 
                      : 'bg-white/10 hover:bg-white/20 border-white/20 hover:scale-105'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center ml-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <i className={`${item.icon} text-white text-base`}></i>
                  </div>
                  <span className="text-white group-hover:text-blue-100 transition-colors duration-300 flex-1">{item.label}</span>
                  <i className="fas fa-chevron-left text-white/60 group-hover:text-white/90 transition-colors duration-300"></i>
                </Link>
              ))}
            </div>
          </div>

          {/* Login/Account Section */}
          <div className="p-4 border-t border-white/20">
            {!mounted ? (
              // Show login button during SSR to match server render
              <Link 
                href="/login" 
                className="flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-white to-blue-50 text-blue-600 rounded-xl font-bold text-center hover:from-blue-50 hover:to-white hover:scale-105 active:scale-95 transition-all duration-300 text-sm md:text-base shadow-lg touch-target"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt ml-2"></i>
                تسجيل الدخول
              </Link>
            ) : user ? (
              <Link 
                href="/account" 
                className="flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-white to-blue-50 text-blue-600 rounded-xl font-bold text-center hover:from-blue-50 hover:to-white hover:scale-105 active:scale-95 transition-all duration-300 text-sm md:text-base shadow-lg touch-target"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-user-circle ml-2"></i>
                {user.name}
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-white to-blue-50 text-blue-600 rounded-xl font-bold text-center hover:from-blue-50 hover:to-white hover:scale-105 active:scale-95 transition-all duration-300 text-sm md:text-base shadow-lg touch-target"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt ml-2"></i>
                تسجيل الدخول
              </Link>
            )}
          </div>

          {/* Additional Info */}
          <div className="p-4 border-t border-blue-500/20">
            <div className="text-center">
              <p className="text-blue-100 text-xs">
                <i className="fas fa-info-circle ml-1"></i>
                موقع السيارات المتميز
              </p>
              <p className="text-blue-200 text-xs mt-1">أفضل تجربة لبيع وشراء السيارات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-around h-16">
          {[
            { href: '/', label: 'الرئيسية', icon: 'fas fa-home' },
            { href: '/cars', label: 'السيارات', icon: 'fas fa-car' },
            { href: '/sell-car', label: 'بيع سيارتك', icon: 'fas fa-plus-circle' },
            { href: (mounted && user) ? '/account' : '/login', label: (mounted && user) ? 'حسابي' : 'دخول', icon: (mounted && user) ? 'fas fa-user-circle' : 'fas fa-sign-in-alt' }
          ].map((item) => {
            const isActive = pathname === item.href || (item.href === '/cars' && pathname?.startsWith('/cars')) || (item.href === '/account' && pathname?.startsWith('/account'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 touch-target ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 scale-105' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <i className={`${item.icon} text-xl mb-1 transition-all duration-300 ${isActive ? 'text-blue-600 scale-110' : 'text-gray-600'}`}></i>
                <span className={`text-xs font-bold transition-all duration-300 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
} 