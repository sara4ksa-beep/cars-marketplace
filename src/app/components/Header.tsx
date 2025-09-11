'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-blue-500 text-white shadow-lg">
      <div className="container-custom">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 space-x-reverse group">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-all duration-300">
              <i className="fas fa-car text-blue-600 text-2xl"></i>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
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
                className="px-4 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                {item.label}
            </Link>
            ))}
          </div>

          {/* Login Button & Mobile Menu */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link 
              href="/login" 
              className="hidden sm:flex items-center bg-white text-blue-500 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              تسجيل الدخول
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
          <div className="bg-blue-600 rounded-lg p-4 mt-2 space-y-2">
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
                className="block py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
            </Link>
            ))}
            <div className="pt-2 border-t border-blue-500">
              <Link 
                href="/login" 
                className="block py-2 px-4 mt-2 bg-white text-blue-500 rounded-lg font-semibold text-center hover:bg-blue-50 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
              تسجيل الدخول
            </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 