'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-500 text-white shadow-lg sticky top-0 z-40">
      <div className="container-custom">
        <nav className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 space-x-reverse group">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-lg md:rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-all duration-300">
              <i className="fas fa-car text-blue-600 text-lg md:text-2xl"></i>
            </div>
            {/* Logo text for mobile */}
            <span className="md:hidden text-sm font-bold">موقع السيارات</span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-6 md:space-x-8 space-x-reverse">
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
                className="px-3 md:px-4 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm md:text-base"
              >
                {item.label}
            </Link>
            ))}
          </div>

          {/* Login Button & Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4 space-x-reverse">
            <Link 
              href="/login" 
              className="hidden sm:flex items-center bg-white text-blue-500 px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 text-sm md:text-base"
            >
              <span className="hidden md:inline">تسجيل الدخول</span>
              <span className="md:hidden">دخول</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
              aria-label="فتح القائمة"
            >
              <div className="w-5 h-5 md:w-6 md:h-6 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 w-5 md:w-6 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`block h-0.5 w-5 md:w-6 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-5 md:w-6 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          <div className="bg-blue-600 rounded-lg p-3 md:p-4 mt-2 space-y-1 md:space-y-2">
            {[
              { href: '/', label: 'الرئيسية', icon: 'fas fa-home' },
              { href: '/cars', label: 'السيارات', icon: 'fas fa-car' },
              { href: '/compare', label: 'مقارنة السيارات', icon: 'fas fa-balance-scale' },
              { href: '/sell-car', label: 'بيع سيارتك', icon: 'fas fa-plus-circle' },
              { href: '/contact', label: 'اتصل بنا', icon: 'fas fa-phone' }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center py-2 md:py-3 px-3 md:px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-sm md:text-base mobile-nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className={`${item.icon} ml-2 text-sm md:text-base`}></i>
                {item.label}
            </Link>
            ))}
            <div className="pt-2 border-t border-blue-500">
              <Link 
                href="/login" 
                className="flex items-center justify-center py-2 md:py-3 px-3 md:px-4 mt-2 bg-white text-blue-500 rounded-lg font-semibold text-center hover:bg-blue-50 transition-all duration-300 text-sm md:text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-sign-in-alt ml-2"></i>
                تسجيل الدخول
            </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 