'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">اتصل بنا</h1>
            <p className="text-gray-600 mb-8 text-center">يسعدنا تواصلك معنا لأي استفسار أو اقتراح</p>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-green-800 font-semibold">تم إرسال رسالتك بنجاح!</p>
                <p className="text-sm text-green-700 mt-1">سنرد عليك في أقرب وقت ممكن</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-red-800 font-semibold">حدث خطأ</p>
                <p className="text-sm text-red-700 mt-1">يرجى المحاولة مرة أخرى</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرسالة <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="اكتب رسالتك هنا..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <img 
                  src="/newlogo1.png" 
                  alt="موقع السيارات المتميز" 
                  className="w-10 h-10 ml-2"
                />
                موقع السيارات
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                أفضل موقع لبيع وشراء السيارات في الشرق الأوسط
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/cars" className="hover:text-white transition-colors">السيارات</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">من نحن</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">اتصل بنا</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">بيع سيارة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">شراء سيارة</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تقييم السيارات</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">معلومات التواصل</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-phone text-blue-500 ml-2"></i>
                  <span>0551781111</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope text-blue-500 ml-2"></i>
                  <span>info@abrajsa.com</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-blue-500 ml-2"></i>
                  <span>الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm text-center sm:text-right">
                © 2025 موقع السيارات المتميز. جميع الحقوق محفوظة
              </p>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">سياسة الخصوصية</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">الشروط والأحكام</Link>
                <Link href="/usage-agreement" className="text-gray-400 hover:text-white transition-colors text-sm">اتفاقية الاستخدام</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
