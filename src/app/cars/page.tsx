'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Image from 'next/image';

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
  isAvailable: boolean;
  createdAt: string;
  featured: boolean;
}

export default function CarsPage() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // دالة لتحويل العلامات التجارية إلى العربية
  const getBrandName = (brand: string) => {
    const brandMap: { [key: string]: string } = {
      toyota: 'تويوتا',
      honda: 'هوندا',
      nissan: 'نيسان',
      mazda: 'مازدا',
      subaru: 'سوبارو',
      suzuki: 'سوزوكي',
      isuzu: 'إيسوزو',
      mitsubishi: 'ميتسوبيشي',
      lexus: 'لكزس',
      infiniti: 'إنفينيتي',
      acura: 'أكورا',
      bmw: 'بي إم دبليو',
      mercedes: 'مرسيدس',
      audi: 'أودي',
      volkswagen: 'فولكسفاغن',
      porsche: 'بورش',
      mini: 'ميني',
      opel: 'أوبل',
      hyundai: 'هيونداي',
      kia: 'كيا',
      genesis: 'جينيسيس',
      ford: 'فورد',
      chevrolet: 'شيفروليه',
      cadillac: 'كاديلاك',
      tesla: 'تسلا',
      jeep: 'جيب',
      gmc: 'جي إم سي',
      buick: 'بيوك',
      lincoln: 'لينكولن',
      landrover: 'لاند روفر',
      jaguar: 'جاكوار',
      bentley: 'بنتلي',
      rollsroyce: 'رولز رويس',
      ferrari: 'فيراري',
      lamborghini: 'لامبورغيني',
      maserati: 'مازيراتي',
      fiat: 'فيات',
      alfa: 'ألفا روميو',
      peugeot: 'بيجو',
      renault: 'رينو',
      citroen: 'ستروين',
      volvo: 'فولفو',
      saab: 'ساب',
      skoda: 'سكودا',
      seat: 'سيات',
      geely: 'جيلي',
      chery: 'شيري',
      byd: 'بي واي دي',
      'great wall': 'جريت وول',
      mg: 'إم جي',
      haval: 'هافال',
      changan: 'تشانجان',
      gac: 'جي إيه سي'
    };
    return brandMap[brand] || 'علامة تجارية غير معروفة';
  };

  // جلب السيارات من قاعدة البيانات
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cars');
        const data = await response.json();
        if (data.success) {
          setCars(data.cars);
          console.log('Cars loaded:', data.cars.length);
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

  // استخراج السيارات المميزة
  const featuredCars = cars.filter(car => car.featured);

  // قائمة الماركات المتاحة
  const brands = [
    // العلامات اليابانية
    { id: 'toyota', name: 'تويوتا' },
    { id: 'honda', name: 'هوندا' },
    { id: 'nissan', name: 'نيسان' },
    { id: 'mazda', name: 'مازدا' },
    { id: 'subaru', name: 'سوبارو' },
    { id: 'suzuki', name: 'سوزوكي' },
    { id: 'isuzu', name: 'إيسوزو' },
    { id: 'mitsubishi', name: 'ميتسوبيشي' },
    { id: 'lexus', name: 'لكزس' },
    { id: 'infiniti', name: 'إنفينيتي' },
    { id: 'acura', name: 'أكورا' },
    
    // العلامات الألمانية
    { id: 'bmw', name: 'بي إم دبليو' },
    { id: 'mercedes', name: 'مرسيدس' },
    { id: 'audi', name: 'أودي' },
    { id: 'volkswagen', name: 'فولكسفاغن' },
    { id: 'porsche', name: 'بورش' },
    { id: 'mini', name: 'ميني' },
    { id: 'opel', name: 'أوبل' },
    
    // العلامات الكورية
    { id: 'hyundai', name: 'هيونداي' },
    { id: 'kia', name: 'كيا' },
    { id: 'genesis', name: 'جينيسيس' },
    
    // العلامات الأمريكية
    { id: 'ford', name: 'فورد' },
    { id: 'chevrolet', name: 'شيفروليه' },
    { id: 'cadillac', name: 'كاديلاك' },
    { id: 'tesla', name: 'تسلا' },
    { id: 'jeep', name: 'جيب' },
    { id: 'gmc', name: 'جي إم سي' },
    { id: 'buick', name: 'بيوك' },
    { id: 'lincoln', name: 'لينكولن' },
    
    // العلامات البريطانية
    { id: 'landrover', name: 'لاند روفر' },
    { id: 'jaguar', name: 'جاكوار' },
    { id: 'bentley', name: 'بنتلي' },
    { id: 'rollsroyce', name: 'رولز رويس' },
    
    // العلامات الإيطالية
    { id: 'ferrari', name: 'فيراري' },
    { id: 'lamborghini', name: 'لامبورغيني' },
    { id: 'maserati', name: 'مازيراتي' },
    { id: 'fiat', name: 'فيات' },
    { id: 'alfa', name: 'ألفا روميو' },
    
    // العلامات الفرنسية
    { id: 'peugeot', name: 'بيجو' },
    { id: 'renault', name: 'رينو' },
    { id: 'citroen', name: 'ستروين' },
    
    // العلامات الأوروبية الأخرى
    { id: 'volvo', name: 'فولفو' },
    { id: 'saab', name: 'ساب' },
    { id: 'skoda', name: 'سكودا' },
    { id: 'seat', name: 'سيات' },
    
    // العلامات الصينية
    { id: 'geely', name: 'جيلي' },
    { id: 'chery', name: 'شيري' },
    { id: 'byd', name: 'بي واي دي' },
    { id: 'great wall', name: 'جريت وول' },
    { id: 'mg', name: 'إم جي' },
    { id: 'haval', name: 'هافال' },
    { id: 'changan', name: 'تشانجان' },
    { id: 'gac', name: 'جي إيه سي' }
  ];

  const filteredCars = cars.filter(car => {
    const matchesBrand = selectedBrand === '' || car.brand === selectedBrand;
    const matchesSearch = searchTerm === '' || 
                         car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBrand && matchesSearch && car.isAvailable;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">جاري تحميل السيارات...</p>
            <p className="text-gray-500 text-sm mt-2">يرجى الانتظار</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Featured Cars Section */}
      {featuredCars.length > 0 && (
        <section className="py-4 sm:py-6 md:py-8 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <div className="container mx-auto px-4">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-800 mb-3 sm:mb-4 md:mb-6 text-center">السيارات المميزة</h2>
            <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-2 snap-x">
              {featuredCars.map((car) => (
                <a key={car.id} href={`/cars/${car.id}`} className="block min-w-[260px] sm:min-w-[280px] md:min-w-[320px] max-w-xs card-hover bg-white rounded-xl shadow-lg border border-blue-100 hover:border-blue-300 snap-center flex-shrink-0 flex flex-col cursor-pointer">
                  <div className="h-36 sm:h-40 relative rounded-t-xl overflow-hidden">
                    <Image
                      src={car.imageUrl || '/default-car.jpg'}
                      alt={car.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 260px, (max-width: 768px) 280px, 320px"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      مميز
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {getBrandName(car.brand)}
                      </span>
                      <span className="text-green-600 font-bold text-sm sm:text-lg">{car.price.toLocaleString()} ريال</span>
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-1 truncate">{car.name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 flex items-center">
                      <i className="fas fa-calendar text-gray-400 ml-1 text-xs"></i>
                      {car.year}
                    </p>
                    <div className="mt-auto">
                      <div className="btn-primary block w-full text-center text-xs sm:text-sm py-2">
                        <i className="fas fa-eye ml-1"></i>
                        عرض التفاصيل
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Simple Header */}
      <section className="bg-white shadow-md py-4 sm:py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">السيارات المتاحة</h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2">تصفح مجموعة واسعة من السيارات المتاحة للبيع</p>
            <p className="text-xs sm:text-sm md:text-base text-blue-600 font-medium">
              {filteredCars.length} {filteredCars.length === 1 ? 'سيارة' : filteredCars.length === 2 ? 'سيارتان' : filteredCars.length < 11 ? 'سيارات' : 'سيارة'} متاحة للبيع
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <input
                  type="text"
                  placeholder="ابحث عن سيارة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mobile-form-input"
                />
              </div>
              <div>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mobile-form-input"
                >
                  <option value="">كافة الماركات</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-4 sm:py-6 md:py-12">
        <div className="container mx-auto px-4">
          {filteredCars.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 text-4xl sm:text-6xl mb-4">
                  <i className="fas fa-car"></i>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  {cars.length === 0 ? 'لا توجد سيارات في قاعدة البيانات' :
                   searchTerm || selectedBrand !== '' ? 'لا توجد نتائج للبحث' : 'لا توجد سيارات متاحة'}
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  {searchTerm || selectedBrand !== '' 
                    ? 'جرب تغيير كلمات البحث أو اختيار ماركة أخرى' 
                    : 'جرب العودة لاحقاً أو أضف سيارتك للبيع'
                  }
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedBrand('');
                    }}
                    className="block w-full bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    <i className="fas fa-refresh ml-1"></i>
                    إظهار كافة السيارات
                  </button>
                  <a 
                    href="/sell-car" 
                    className="block w-full bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-colors text-center text-sm sm:text-base"
                  >
                    <i className="fas fa-plus ml-1"></i>
                    أضف سيارتك للبيع
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {filteredCars.map((car) => (
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
                    <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">{getBrandName(car.brand)} • {car.year}</p>
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
          )}
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-4 sm:py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Brand Section */}
            <div className="text-center sm:text-right sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 flex items-center justify-center sm:justify-start">
                <img 
                  src="/loc.png" 
                  alt="موقع السيارات المتميز" 
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">أفضل موقع لبيع وشراء السيارات في الشرق الأوسط</p>
              
              {/* Contact Info */}
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-center sm:justify-start">
                  <i className="fas fa-phone text-blue-500 ml-2 text-xs"></i>
                  <span>0551781111</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <i className="fas fa-envelope text-blue-500 ml-2 text-xs"></i>
                  <span>info@abrajsa.com</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="text-center sm:text-right">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">روابط سريعة</h4>
              <div className="space-y-1 sm:space-y-2">
                <a href="/cars" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">تصفح السيارات</a>
                <a href="/sell-car" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">بيع سيارتك</a>
                <a href="/compare" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">مقارنة السيارات</a>
                <a href="/contact" className="block text-gray-400 hover:text-white transition-colors text-xs sm:text-sm">اتصل بنا</a>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="text-center sm:text-right">
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">تابعنا على</h4>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 max-w-xs mx-auto sm:max-w-none">
                <a href="#" className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110">
                  <i className="fab fa-facebook-f text-white text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110">
                  <i className="fab fa-twitter text-white text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110">
                  <i className="fab fa-instagram text-white text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110">
                  <i className="fab fa-youtube text-white text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110">
                  <i className="fab fa-whatsapp text-white text-sm sm:text-lg group-hover:scale-110 transition-transform duration-300"></i>
                </a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-800 mt-4 sm:mt-6 pt-4 sm:pt-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">© 2024 موقع السيارات. جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 