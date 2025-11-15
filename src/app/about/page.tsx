'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">من نحن</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            موقع السيارات المتميز - وجهتك الأولى لبيع وشراء السيارات في الشرق الأوسط
          </p>
        </div>

        {/* Company Introduction */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-building text-blue-600 ml-3"></i>
            عن الشركة
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              نحن موقع متخصص في بيع وشراء السيارات في منطقة الشرق الأوسط، نسعى لتوفير أفضل تجربة 
              للمستخدمين من خلال منصة سهلة الاستخدام وآمنة. نقدم خدمات متنوعة تشمل البيع المباشر 
              والمزادات الحية للسيارات.
            </p>
            <p className="mb-4">
              تأسس موقعنا بهدف تسهيل عملية شراء وبيع السيارات، مع ضمان الشفافية والأمان في كل 
              معاملة. نحن ملتزمون بتقديم خدمة متميزة لعملائنا وبناء علاقات طويلة الأمد.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-8">
            <div className="flex items-center mb-4">
              <i className="fas fa-bullseye text-blue-600 text-3xl ml-3"></i>
              <h2 className="text-2xl font-bold text-gray-900">رؤيتنا</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              أن نكون المنصة الرائدة في بيع وشراء السيارات في منطقة الشرق الأوسط، 
              من خلال تقديم تجربة مستخدم استثنائية وخدمات مبتكرة تلبي احتياجات عملائنا.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-8">
            <div className="flex items-center mb-4">
              <i className="fas fa-rocket text-green-600 text-3xl ml-3"></i>
              <h2 className="text-2xl font-bold text-gray-900">مهمتنا</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              توفير منصة آمنة وموثوقة لبيع وشراء السيارات، مع ضمان الشفافية في المعاملات 
              وتقديم أفضل الخدمات لعملائنا من خلال فريق محترف وخدمة عملاء متميزة.
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-concierge-bell text-orange-600 ml-3"></i>
            خدماتنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4 text-center">
                <i className="fas fa-tag text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">البيع المباشر</h3>
              <p className="text-gray-700 text-center">
                بيع سيارتك بسهولة وأمان من خلال منصتنا مع ضمان أفضل الأسعار
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4 text-center">
                <i className="fas fa-gavel text-orange-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">المزادات</h3>
              <p className="text-gray-700 text-center">
                شارك في مزادات حية للسيارات واحصل على أفضل الصفقات
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl mb-4 text-center">
                <i className="fas fa-search text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">البحث المتقدم</h3>
              <p className="text-gray-700 text-center">
                ابحث عن السيارة المثالية باستخدام فلاتر متقدمة وذكية
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-heart text-red-600 ml-3"></i>
            قيمنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">
                <i className="fas fa-shield-alt text-blue-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">الأمان</h3>
              <p className="text-sm text-gray-600">معاملات آمنة ومحمية</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">
                <i className="fas fa-eye text-green-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">الشفافية</h3>
              <p className="text-sm text-gray-600">شفافية كاملة في المعاملات</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">
                <i className="fas fa-star text-yellow-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">الجودة</h3>
              <p className="text-sm text-gray-600">خدمة عالية الجودة</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">
                <i className="fas fa-headset text-purple-600"></i>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">الدعم</h3>
              <p className="text-sm text-gray-600">دعم فني متواصل</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <i className="fas fa-envelope ml-3"></i>
            تواصل معنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <i className="fas fa-phone text-2xl ml-3"></i>
              <div>
                <p className="font-semibold">الهاتف</p>
                <p>0551781111</p>
              </div>
            </div>
            <div className="flex items-center">
              <i className="fas fa-envelope text-2xl ml-3"></i>
              <div>
                <p className="font-semibold">البريد الإلكتروني</p>
                <p>info@abrajsa.com</p>
              </div>
            </div>
            <div className="flex items-center">
              <i className="fas fa-map-marker-alt text-2xl ml-3"></i>
              <div>
                <p className="font-semibold">العنوان</p>
                <p>الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-paper-plane ml-2"></i>
              إرسال رسالة
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

