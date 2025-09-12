'use client';

import { useState } from 'react';

interface BookingFormProps {
  carId: number;
  carName: string;
  carPrice: number;
  onClose: () => void;
}

interface BookingData {
  carId: number;
  carName: string;
  carPrice: number;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function BookingForm({ carId, carName, carPrice, onClose }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingData>({
    carId,
    carName,
    carPrice,
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">احجزها الآن</h1>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-2"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{carName}</h2>
              <p className="text-blue-100 text-lg sm:text-xl">{carPrice.toLocaleString()} ريال</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {submitStatus === 'success' ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
                  <div className="text-green-500 text-6xl mb-6">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">تم إرسال طلبك بنجاح!</h3>
                  <p className="text-gray-600 text-lg mb-6">سيتم التواصل معك قريباً</p>
                  <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    العودة للصفحة الرئيسية
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-3">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-3">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      placeholder="example@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-3">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      placeholder="05xxxxxxxx"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-3">
                      رسالة (اختياري)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>

                  {/* Error Message */}
                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-lg">
                      <i className="fas fa-exclamation-circle ml-2"></i>
                      حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <i className="fas fa-spinner fa-spin ml-3"></i>
                          جاري الإرسال...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <i className="fas fa-paper-plane ml-3"></i>
                          أرسل طلبك
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
