import React from "react";
import Header from "../components/Header";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />
      <div className="py-16">
      <div className="container-custom bg-white rounded-2xl shadow-xl p-8 sm:p-16 border border-blue-100 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">اتصل بنا</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          يسعدنا تواصلك معنا لأي استفسار أو اقتراح. فريقنا جاهز لخدمتك دائمًا!
        </p>
        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-blue-800 font-semibold">الاسم</label>
            <input type="text" className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none bg-blue-50" placeholder="اسمك الكامل" />
          </div>
          <div>
            <label className="block mb-2 text-blue-800 font-semibold">البريد الإلكتروني</label>
            <input type="email" className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none bg-blue-50" placeholder="example@email.com" />
          </div>
          <div>
            <label className="block mb-2 text-blue-800 font-semibold">رسالتك</label>
            <textarea className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none bg-blue-50 min-h-[120px]" placeholder="اكتب رسالتك هنا..."></textarea>
          </div>
          <button type="submit" className="btn-primary w-full text-lg">إرسال</button>
        </form>
        <div className="mt-10 border-t pt-8 text-center">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">معلومات التواصل</h2>
          <p className="text-gray-700 mb-1">📞 +966 50 123 4567</p>
          <p className="text-gray-700 mb-1">📧 info@carsite.com</p>
          <p className="text-gray-700">📍 الرياض، المملكة العربية السعودية</p>
        </div>
        </div>
      </div>
    </div>
  );
} 