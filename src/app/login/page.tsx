'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // إزالة رسالة الخطأ عند الكتابة
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to the redirect URL if provided, otherwise to account dashboard
        const redirectTo = redirectUrl || '/account';
        router.push(redirectTo);
      } else {
        setError(data.error || 'حدث خطأ في تسجيل الدخول');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="py-16 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-blue-100 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">تسجيل الدخول</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-blue-800 font-semibold">البريد الإلكتروني</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none bg-blue-50" 
              placeholder="example@email.com" 
            />
          </div>
          <div>
            <label className="block mb-2 text-blue-800 font-semibold">كلمة المرور</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none bg-blue-50" 
              placeholder="••••••••" 
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block ml-2"></div>
                جاري تسجيل الدخول...
              </>
            ) : (
              'دخول'
            )}
          </button>
        </form>
        <div className="mt-6 space-y-3 text-center">
          <a href="#" className="text-blue-600 hover:underline text-sm sm:text-base block">نسيت كلمة المرور؟</a>
          <p className="text-gray-600 text-sm sm:text-base">
            إذا لم يكن لديك حساب،{' '}
            <Link 
              href={redirectUrl ? `/signup?redirect=${encodeURIComponent(redirectUrl)}` : '/signup'} 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
            >
              أنشئ حساباً الآن
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
} 