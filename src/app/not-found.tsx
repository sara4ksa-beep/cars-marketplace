import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-block bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full p-8 mb-6">
              <i className="fas fa-exclamation-triangle text-6xl sm:text-8xl text-blue-600"></i>
            </div>
          </div>
          
          {/* Error Code */}
          <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            404
          </h1>
          
          {/* Error Message */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            الصفحة غير موجودة
          </h2>
          
          <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <i className="fas fa-home ml-2"></i>
              العودة إلى الصفحة الرئيسية
            </Link>
            
            <Link
              href="/cars"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <i className="fas fa-car ml-2"></i>
              تصفح السيارات
            </Link>
          </div>
          
          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-4">روابط مفيدة:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/about" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                من نحن
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                اتصل بنا
              </Link>
              <Link href="/sell-car" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                بيع سيارة
              </Link>
              <Link href="/compare" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                مقارنة السيارات
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

