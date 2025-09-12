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
        <section className="py-6 md:py-8 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-800 mb-4 md:mb-6 text-center">السيارات المميزة</h2>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 snap-x">
              {featuredCars.map((car) => (
                <div key={car.id} className="min-w-[280px] md:min-w-[320px] max-w-xs card-hover bg-white rounded-xl shadow-lg border border-blue-100 hover:border-blue-300 snap-center flex-shrink-0 flex flex-col">
                  <div className="h-40 relative rounded-t-xl overflow-hidden">
                    <Image
                      src={car.imageUrl || '/default-car.jpg'}
                      alt={car.name}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      مميز
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {getBrandName(car.brand)}
                      </span>
                      <span className="text-green-600 font-bold text-lg">{car.price.toLocaleString()} ريال</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{car.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                      <i className="fas fa-calendar text-gray-400 ml-1"></i>
                      {car.year}
                    </p>
                    <div className="mt-auto">
                      <a
                        href={`/cars/${car.id}`}
                        className="btn-primary block w-full text-center text-sm py-2"
                      >
                        عرض التفاصيل
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Simple Header */}
      <section className="bg-white shadow-md py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">السيارات المتاحة</h1>
            <p className="text-sm md:text-base text-gray-600 mb-2">تصفح مجموعة واسعة من السيارات المتاحة للبيع</p>
            <p className="text-sm md:text-base text-blue-600 font-medium">
              {filteredCars.length} {filteredCars.length === 1 ? 'سيارة' : filteredCars.length === 2 ? 'سيارتان' : filteredCars.length < 11 ? 'سيارات' : 'سيارة'} متاحة للبيع
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <input
                  type="text"
                  placeholder="ابحث عن سيارة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4">
          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 text-6xl mb-4">
                  <i className="fas fa-car"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {cars.length === 0 ? 'لا توجد سيارات في قاعدة البيانات' :
                   searchTerm || selectedBrand !== '' ? 'لا توجد نتائج للبحث' : 'لا توجد سيارات متاحة'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedBrand !== '' 
                    ? 'جرب تغيير كلمات البحث أو اختيار ماركة أخرى' 
                    : 'جرب العودة لاحقاً أو أضف سيارتك للبيع'
                  }
                </p>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedBrand('');
                    }}
                    className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    إظهار كافة السيارات
                  </button>
                  <a 
                    href="/sell-car" 
                    className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
                  >
                    أضف سيارتك للبيع
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 lg:gap-8">
              {filteredCars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-32 md:h-48">
                    <Image 
                      src={car.imageUrl || '/default-car.jpg'} 
                      alt={car.name} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      جديد
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs md:text-sm text-blue-600 font-medium">
                        {getBrandName(car.brand)}
                      </span>
                      <span className="text-sm md:text-xl font-bold text-green-600">
                        {car.price.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">
                      {car.name}
                    </h3>
                    
                    {/* Mobile: Essential info only */}
                    <div className="md:hidden text-xs text-gray-500 mb-3">
                      <div className="flex justify-between">
                        <span>{car.year}</span>
                        <span>{car.fuelType === 'gasoline' ? 'بنزين' : 
                         car.fuelType === 'diesel' ? 'ديزل' : 
                         car.fuelType === 'hybrid' ? 'هجين' : 
                         car.fuelType === 'electric' ? 'كهربائي' : car.fuelType || 'غير محدد'}</span>
                      </div>
                    </div>
                    
                    {/* Desktop: Show full details */}
                    <div className="hidden md:block text-sm text-gray-600 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <i className="fas fa-calendar text-gray-400 ml-2 text-sm"></i>
                          سنة: {car.year}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-gas-pump text-gray-400 ml-2 text-sm"></i>
                          نوع الوقود: {car.fuelType === 'gasoline' ? 'بنزين' : 
                           car.fuelType === 'diesel' ? 'ديزل' : 
                           car.fuelType === 'hybrid' ? 'هجين' : 
                           car.fuelType === 'electric' ? 'كهربائي' : car.fuelType || 'غير محدد'}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-cog text-gray-400 ml-2 text-sm"></i>
                          ناقل الحركة: {car.transmission === 'automatic' ? 'أوتوماتيك' : 
                           car.transmission === 'manual' ? 'يدوي' : car.transmission || 'غير محدد'}
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-tint text-gray-400 ml-2 text-sm"></i>
                          اللون: {car.color || 'غير محدد'}
                        </div>
                      </div>
                    </div>
                    <a href={`/cars/${car.id}`} className="block w-full bg-blue-600 text-white text-center py-2 px-3 rounded text-xs md:text-base font-medium hover:bg-blue-700 transition-colors">
                      عرض التفاصيل
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">موقع السيارات</h3>
            <p className="text-gray-400 mb-6 md:mb-8 text-base md:text-lg">أفضل موقع لبيع وشراء السيارات</p>
            
            {/* Enhanced Social Media */}
            <div className="mb-6 md:mb-8">
              <h4 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">تابعنا على</h4>
              <div className="flex justify-center space-x-4 md:space-x-6 space-x-reverse">
                <a href="#" className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                  <i className="fab fa-facebook-f text-white text-lg md:text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                  <i className="fab fa-twitter text-white text-lg md:text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                  <i className="fab fa-instagram text-white text-lg md:text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                  <i className="fab fa-youtube text-white text-lg md:text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                  <i className="fab fa-whatsapp text-white text-lg md:text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="text-gray-400 text-sm">
              <p>تواصل معنا: info@carsite.com | 966+ 50 123 4567</p>
              <p className="mt-2">© 2024 موقع السيارات. جميع الحقوق محفوظة</p>
          </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 