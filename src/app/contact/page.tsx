import React from "react";
import Header from "../components/Header";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />
      <div className="py-8 md:py-16">
      <div className="container-custom bg-white rounded-2xl shadow-xl p-4 md:p-8 lg:p-16 border border-blue-100 max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold text-blue-700 mb-4 md:mb-6 text-center">اتصل بنا</h1>
        <p className="text-base md:text-lg text-gray-700 mb-6 md:mb-8 text-center">
          يسعدنا تواصلك معنا لأي استفسار أو اقتراح. فريقنا جاهز لخدمتك دائمًا!
        </p>
        <form className="space-y-4 md:space-y-6">
          <div>
            <label className="block mb-2 text-blue-800 font-semibold text-sm md:text-base">الاسم</label>
            <input type="text" className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none bg-blue-50" placeholder="اسمك الكامل" />
          </div>
          <div>
            <label className="block mb-2 text-blue-800 font-semibold text-sm md:text-base">البريد الإلكتروني</label>
            <input type="email" className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none bg-blue-50" placeholder="example@email.com" />
          </div>
          <div>
            <label className="block mb-2 text-blue-800 font-semibold text-sm md:text-base">رسالتك</label>
            <textarea className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none bg-blue-50 min-h-[100px] md:min-h-[120px]" placeholder="اكتب رسالتك هنا..."></textarea>
          </div>
          <button type="submit" className="btn-primary w-full text-sm md:text-lg py-2 md:py-3">إرسال</button>
        </form>
        <div className="mt-8 md:mt-10 border-t pt-6 md:pt-8 text-center">
          <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-3 md:mb-4">معلومات التواصل</h2>
          <p className="text-sm md:text-base text-gray-700 mb-2">📞 +966 50 123 4567</p>
          <p className="text-sm md:text-base text-gray-700 mb-2">📧 info@carsite.com</p>
          <p className="text-sm md:text-base text-gray-700">📍 الرياض، المملكة العربية السعودية</p>
        </div>
        </div>
      </div>
    </div>
  );
} 