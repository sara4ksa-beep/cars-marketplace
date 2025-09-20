'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-blue-500 text-white shadow-lg sticky top-0 z-40">
        <div className="container-custom">
          <nav className="flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 md:space-x-3 space-x-reverse group">
              <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <img 
                  src="/loc.png" 
                  alt="موقع السيارات المتميز" 
                  className="w-full h-full object-contain"
                />
              </div>
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
                  className="px-3 md:px-4 py-2 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 text-sm md:text-base"
                >
                  {item.label}
            </Link>
            ))}
          </div>

          {/* Login Button & Mobile Menu */}
          <div className="flex items-center space-x-2 md:space-x-4 space-x-reverse">
            <Link 
              href="/login" 
              className="hidden sm:flex items-center bg-white text-blue-500 px-4 md:px-6 py-2 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300 text-sm md:text-base"
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
                <span className="block h-0.5 w-5 md:w-6 bg-white"></span>
                <span className="block h-0.5 w-5 md:w-6 bg-white"></span>
                <span className="block h-0.5 w-5 md:w-6 bg-white"></span>
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
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-500/30">
            <h3 className="text-lg font-bold text-white flex items-center">
              <i className="fas fa-bars ml-2"></i>
              القائمة الرئيسية
            </h3>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
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
                  className="group flex items-center py-3 px-4 rounded-xl hover:scale-105 transition-all duration-300 font-bold text-sm md:text-base bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center ml-3 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${item.icon} text-white text-sm`}></i>
                  </div>
                  <span className="text-white group-hover:text-blue-100 transition-colors duration-300">{item.label}</span>
                  <i className="fas fa-chevron-left text-white/60 group-hover:text-white/80 transition-colors duration-300 mr-auto"></i>
                </Link>
              ))}
            </div>
          </div>

          {/* Login Section */}
          <div className="p-4 border-t border-blue-500/30">
            <Link 
              href="/login" 
              className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-white to-blue-50 text-blue-600 rounded-xl font-bold text-center hover:from-blue-50 hover:to-white hover:scale-105 transition-all duration-300 text-sm md:text-base shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-sign-in-alt ml-2"></i>
              تسجيل الدخول
            </Link>
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
    </>
  );
} 