import React from "react";
import Header from "../components/Header";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />
      <div className="py-16 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-blue-100 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">تسجيل الدخول</h1>
        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-blue-800 font-semibold">البريد الإلكتروني</label>
            <input type="email" className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none bg-blue-50" placeholder="example@email.com" />
          </div>
          <div>
            <label className="block mb-2 text-blue-800 font-semibold">كلمة المرور</label>
            <input type="password" className="w-full px-4 py-3 border-2 border-blue-100 rounded-lg focus:border-blue-400 focus:outline-none bg-blue-50" placeholder="••••••••" />
          </div>
          <button type="submit" className="btn-primary w-full text-lg">دخول</button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className="text-blue-600 hover:underline">نسيت كلمة المرور؟</a>
        </div>
        </div>
      </div>
    </div>
  );
} 