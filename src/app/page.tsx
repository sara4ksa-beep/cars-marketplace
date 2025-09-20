'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from './components/Header';

// نوع البيانات للسيارة
interface Car {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  color: string | null;
  description: string | null;
  imageUrl: string | null;
  images: string[];
  contactName: string | null;
  contactPhone: string | null;
  contactLocation: string | null;
  contactEmail: string | null;
  isAvailable: boolean;
  createdAt: string;
  featured: boolean;
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب السيارات من قاعدة البيانات
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cars');
        const data = await response.json();
        if (data.success) {
          setCars(data.cars);
        } else {
          console.error('Error fetching cars:', data.error);
          setCars([]);
        }
      } catch (error) {
        console.error('Error fetching cars:', error);
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // أخذ 8 سيارات فقط للعرض
  const displayedCars = cars.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] md:min-h-screen flex items-center overflow-hidden">
        {/* Car Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/mercc.jpg" 
            alt="Hero Car Background" 
            fill 
            className="object-cover w-full h-full"
            style={{ 
              objectPosition: 'center center'
            }}
            priority
            sizes="100vw"
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
        </div>
        
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 hero-background-blob bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 hero-background-blob-large bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hero-background-blob-xl bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        

        {/* Main Content */}
        <div className="container-custom relative z-10 text-white py-4 md:py-16">
          <div className="max-w-5xl mx-auto text-center space-y-3 md:space-y-6 lg:space-y-10 -mt-8 md:-mt-12 lg:-mt-16">
            
            {/* Welcome Text */}
            <div className="space-y-3 md:space-y-4 lg:space-y-6 animate-fade-in">
              
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white text-shadow-glow animate-slide-up px-2">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  اعثر على سيارة احلامك
                </span>
              </h1>
              
              <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto animate-slide-up-delayed font-medium px-4">
                <span className="hidden sm:inline">أفضل مجموعة سيارات فاخرة واقتصادية في الشرق الأوسط مع خدمة متميزة وضمان شامل</span>
                <span className="sm:hidden">أفضل السيارات في الشرق الأوسط</span>
              </p>
            </div>


            {/* Action Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row justify-center animate-fade-in-delayed gap-3 sm:gap-4 md:gap-6 px-4">
              <a href="/cars" className="hero-button bg-white text-blue-600 rounded-xl md:rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 py-4 sm:py-5 px-6 sm:px-8 text-sm sm:text-base md:text-lg">
                <i className="fas fa-car ml-2"></i>
                <span className="hidden sm:inline">تصفح السيارات</span>
                <span className="sm:hidden">السيارات</span>
              </a>
              
              <a href="/sell-car" className="hero-button bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl md:rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 py-4 sm:py-5 px-6 sm:px-8 text-sm sm:text-base md:text-lg">
                <i className="fas fa-plus-circle ml-2"></i>
                <span className="hidden sm:inline">بيع سيارتك</span>
                <span className="sm:hidden">بيع</span>
              </a>
              
            </div>
          </div>
        </div>
        

      </section>

      {/* Cars Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-800">
            السيارات
          </h2>
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl text-gray-300 mb-4">
                <i className="fas fa-car"></i>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-600 mb-2">جاري تحميل السيارات...</h3>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">يرجى الانتظار قليلاً</p>
            </div>
          ) : displayedCars.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {displayedCars.map((car) => (
                  <a key={car.id} href={`/cars/${car.id}`} className="block bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105 cursor-pointer">
                    <div className="h-32 sm:h-40 md:h-56 relative">
                      <Image
                        src={car.imageUrl || '/default-car.jpg'}
                        alt={car.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    </div>
                    <div className="p-2 sm:p-3 md:p-5">
                      <h3 className="text-xs sm:text-sm md:text-lg font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-2">{car.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">{car.brand === 'toyota' ? 'تويوتا' :
                       car.brand === 'honda' ? 'هوندا' :
                       car.brand === 'nissan' ? 'نيسان' :
                       car.brand === 'bmw' ? 'بي إم دبليو' :
                       car.brand === 'mercedes' ? 'مرسيدس' :
                       car.brand === 'audi' ? 'أودي' :
                       car.brand === 'lexus' ? 'لكزس' :
                       car.brand === 'hyundai' ? 'هيونداي' :
                       car.brand === 'kia' ? 'كيا' :
                       car.brand === 'ford' ? 'فورد' :
                       car.brand === 'chevrolet' ? 'شيفروليه' :
                       car.brand === 'tesla' ? 'تسلا' :
                       car.brand === 'landrover' ? 'لاند روفر' :
                       car.brand === 'cadillac' ? 'كاديلاك' :
                       car.brand === 'volkswagen' ? 'فولكسفاغن' :
                       car.brand === 'volvo' ? 'فولفو' :
                       car.brand === 'infiniti' ? 'إنفينيتي' :
                       car.brand === 'jaguar' ? 'جاكوار' :
                       car.brand === 'porsche' ? 'بورش' :
                       car.brand === 'maserati' ? 'مازيراتي' :
                       car.brand === 'ferrari' ? 'فيراري' :
                       car.brand === 'lamborghini' ? 'لامبورغيني' :
                       car.brand === 'bentley' ? 'بنتلي' :
                       car.brand === 'rollsroyce' ? 'رولز رويس' :
                       car.brand === 'jeep' ? 'جيب' :
                       car.brand === 'mitsubishi' ? 'ميتسوبيشي' :
                       car.brand === 'mazda' ? 'مازدا' :
                       car.brand === 'subaru' ? 'سوبارو' :
                       car.brand === 'suzuki' ? 'سوزوكي' :
                       car.brand === 'isuzu' ? 'إيسوزو' :
                       car.brand === 'gmc' ? 'جي إم سي' :
                       car.brand === 'buick' ? 'بيوك' :
                       car.brand === 'lincoln' ? 'لينكولن' :
                       car.brand === 'acura' ? 'أكورا' :
                       car.brand === 'genesis' ? 'جينيسيس' :
                       car.brand === 'mini' ? 'ميني' :
                       car.brand === 'fiat' ? 'فيات' :
                       car.brand === 'alfa' ? 'ألفا روميو' :
                       car.brand === 'peugeot' ? 'بيجو' :
                       car.brand === 'renault' ? 'رينو' :
                       car.brand === 'citroen' ? 'ستروين' :
                       car.brand === 'skoda' ? 'سكودا' :
                       car.brand === 'seat' ? 'سيات' :
                       car.brand === 'opel' ? 'أوبل' :
                       car.brand === 'saab' ? 'ساب' :
                       car.brand === 'dacia' ? 'داسيا' :
                       car.brand === 'lada' ? 'لادا' :
                       car.brand === 'geely' ? 'جيلي' :
                       car.brand === 'chery' ? 'شيري' :
                       car.brand === 'byd' ? 'بي واي دي' :
                       car.brand === 'great wall' ? 'جريت وول' :
                       car.brand === 'mg' ? 'إم جي' :
                       car.brand === 'haval' ? 'هافال' :
                       car.brand === 'changan' ? 'تشانجان' :
                       car.brand === 'dongfeng' ? 'دونغ فينغ' :
                       car.brand === 'gac' ? 'جي إيه سي' :
                       car.brand === 'lynk' ? 'لينك آند كو' :
                       car.brand === 'wuling' ? 'وولينغ' :
                       'علامة تجارية غير معروفة'} • {car.year}</p>
                      <div className="text-green-600 font-bold text-xs sm:text-sm md:text-lg mb-2 sm:mb-3">{car.price.toLocaleString()} ريال</div>
                      
                      <div className="flex justify-center">
                        <div className="w-full bg-blue-500 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg hover:bg-blue-600 transition-colors text-center text-xs sm:text-sm font-medium">
                          <i className="fas fa-eye ml-1"></i>
                          عرض التفاصيل
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              
              {/* عرض جميع السيارات */}
              <div className="text-center mt-12">
                <a href="/cars" className="btn-primary inline-block px-6 py-2 text-sm">
                  <i className="fas fa-arrow-left ml-2"></i>
                  عرض جميع السيارات
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">
                <i className="fas fa-car"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">لا توجد سيارات حالياً</h3>
              <p className="text-gray-500 mb-6">سيتم إضافة سيارات جديدة قريباً</p>
              <a href="/cars" className="btn-primary inline-block">
                تصفح جميع السيارات
              </a>
            </div>
          )}
        </div>
      </section>


      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12 text-gray-800">
            لماذا تختارنا؟
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center card-hover p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
              <div className="text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4 md:mb-6 text-blue-600">
                <i className="fas fa-trophy"></i>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">جودة عالية</h3>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">نقدم أفضل السيارات من أشهر الماركات العالمية مع ضمان الجودة</p>
            </div>
            <div className="text-center card-hover p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
              <div className="text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4 md:mb-6 text-green-600">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">أسعار تنافسية</h3>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base">أفضل الأسعار في السوق مع عروض وخصومات حصرية</p>
            </div>
            <div className="text-center card-hover p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl sm:col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl md:text-6xl mb-3 sm:mb-4 md:mb-6 text-purple-600">
                <i className="fas fa-tools"></i>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">خدمة ما بعد البيع</h3>
              <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base mb-4">خدمة عملاء متميزة وصيانة دورية لجميع السيارات</p>
              <a href="/contact" className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                <i className="fas fa-phone ml-1"></i>
                اتصل بنا الآن
              </a>
            </div>
          </div>
        </div>
      </section>




      {/* Footer */}
      <footer className="bg-gray-900 text-white section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">
                <i className="fas fa-car text-blue-600 ml-2"></i>
                <span className="hidden sm:inline">موقع السيارات المتميز</span>
                <span className="sm:hidden">موقع السيارات</span>
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
                <li><a href="/cars" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  السيارات الجديدة
                </a></li>
                <li><a href="/cars" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  السيارات المستعملة
                </a></li>
                <li><a href="/contact" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  خدمات التمويل
                </a></li>
                <li><a href="/contact" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  الصيانة
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">خدماتنا</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400">
                <li><a href="/contact" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  تقييم السيارات
                </a></li>
                <li><a href="/contact" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  تأمين السيارات
                </a></li>
                <li><a href="/contact" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  شحن السيارات
                </a></li>
                <li><a href="/contact" className="hover:text-white transition-colors flex items-center text-sm sm:text-base">
                  <i className="fas fa-angle-left mr-2 text-xs"></i>
                  استشارات مجانية
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">معلومات التواصل</h4>
              <div className="space-y-2 sm:space-y-3 text-gray-400">
                <div className="flex items-center">
                  <i className="fas fa-phone text-blue-500 mr-2 sm:mr-3 text-sm"></i>
                  <p className="text-sm sm:text-base">+966 50 123 4567</p>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope text-blue-500 mr-2 sm:mr-3 text-sm"></i>
                  <p className="text-sm sm:text-base">info@carsite.com</p>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-blue-500 mr-2 sm:mr-3 text-sm"></i>
                  <p className="text-sm sm:text-base">الرياض، المملكة العربية السعودية</p>
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
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">سياسة الخصوصية</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">الشروط والأحكام</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">اتفاقية الاستخدام</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
