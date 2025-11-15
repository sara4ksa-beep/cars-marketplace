'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Link from "next/link";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
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
    
    // Basic validation
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to the redirect URL if provided, otherwise to home page
        const redirectTo = redirectUrl || '/';
        router.push(redirectTo);
      } else {
        setError(data.error || 'حدث خطأ في إنشاء الحساب');
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
      <div className="py-8 md:py-16 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 border border-blue-100 w-full max-w-md mx-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-2 text-center">إنشاء حساب جديد</h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6 text-center">انضم إلينا وابدأ رحلتك معنا</p>
          
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-blue-800 font-semibold text-sm sm:text-base">الاسم الكامل</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="input-modern" 
                placeholder="أدخل اسمك الكامل" 
              />
            </div>
            
            <div>
              <label className="block mb-2 text-blue-800 font-semibold text-sm sm:text-base">البريد الإلكتروني</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input-modern" 
                placeholder="example@email.com" 
              />
            </div>
            
            <div>
              <label className="block mb-2 text-blue-800 font-semibold text-sm sm:text-base">كلمة المرور</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="input-modern" 
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
              className="btn-primary w-full text-base sm:text-lg py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block ml-2"></div>
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus ml-2"></i>
                  إنشاء الحساب
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm sm:text-base">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

