import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 flex items-center">
              <img 
                src="/newlogo1.png" 
                alt="موقع السيارات المتميز" 
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
            </h3>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
              أفضل موقع لبيع وشراء السيارات في الشرق الأوسط
            </p>
            
            {/* Social Media */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-center sm:text-right">تابعنا على</h4>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
                <a href="#" className="group bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                  <i className="fab fa-facebook-f text-xl sm:text-2xl"></i>
                </a>
                <a href="#" className="group bg-black hover:bg-gray-800 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                  <i className="fab fa-x-twitter text-xl sm:text-2xl"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                  <i className="fab fa-instagram text-xl sm:text-2xl"></i>
                </a>
                <a href="#" className="group bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl">
                  <i className="fab fa-youtube text-xl sm:text-2xl"></i>
                </a>
              </div>
              <div className="mt-4 sm:mt-6 text-center sm:text-right">
                <p className="text-gray-400 text-xs sm:text-sm">تواصل معنا على جميع المنصات</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">روابط سريعة</h4>
            <ul className="space-y-1 sm:space-y-2 text-gray-400">
              <li>
                <Link href="/cars" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  السيارات
                </Link>
              </li>
              <li>
                <Link href="/sell-car" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  بيع سيارة
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">معلومات التواصل</h4>
            <div className="space-y-2 sm:space-y-3 text-gray-400">
              <div className="flex items-center">
                <i className="fas fa-phone text-blue-500 mr-2 sm:mr-3 text-sm"></i>
                <p className="text-sm sm:text-base">0551781111</p>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope text-blue-500 mr-2 sm:mr-3 text-sm"></i>
                <p className="text-sm sm:text-base">info@abrajsa.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-gray-400 text-center sm:text-right text-xs sm:text-sm">
              © 2025 موقع السيارات المتميز. جميع الحقوق محفوظة
            </p>
            <div className="flex items-center space-x-4 sm:space-x-6 space-x-reverse">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">سياسة الخصوصية</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">الشروط والأحكام</Link>
              <Link href="/usage-agreement" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">اتفاقية الاستخدام</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

