'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Image from 'next/image';
import AuctionBadge from '../components/AuctionBadge';
import { SaleType } from '@prisma/client';

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
  saleType?: 'DIRECT_SALE' | 'AUCTION';
  currentBid?: number | null;
  auctionEndDate?: string | null;
  isActiveAuction?: boolean;
  bidCount?: number;
}

export default function CarsPage() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [saleTypeFilter, setSaleTypeFilter] = useState<'all' | 'DIRECT_SALE' | 'AUCTION'>('all');
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
        const url = saleTypeFilter !== 'all' 
          ? `/api/cars?saleType=${saleTypeFilter}`
          : '/api/cars';
        const response = await fetch(url);
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
  }, [saleTypeFilter]);

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
                <a key={car.id} href={`/cars/${car.id}`} className="block min-w-[260px] sm:min-w-[280px] md:min-w-[320px] max-w-xs card-modern snap-center flex-shrink-0 flex flex-col cursor-pointer group">
                  <div className="card-image-wrapper">
                    <Image
                      src={car.imageUrl || '/default-car.jpg'}
                      alt={car.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 260px, (max-width: 768px) 280px, 320px"
                    />
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      <i className="fas fa-star ml-1"></i>
                      مميز
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="badge-modern badge-primary">
                        {getBrandName(car.brand)}
                      </span>
                      <span className="text-green-600 font-bold text-base sm:text-lg">{car.price.toLocaleString()} ريال</span>
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-blue-600 transition-colors">{car.name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 flex items-center">
                      <i className="fas fa-calendar text-gray-400 ml-1.5 text-xs"></i>
                      {car.year}
                    </p>
                    <div className="mt-auto">
                      <div className="btn-primary block w-full text-center text-sm py-2.5">
                        <i className="fas fa-eye ml-1.5"></i>
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
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              <div className="relative">
                <i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="ابحث عن سيارة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-modern pr-11"
                />
              </div>
              <div>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="select-modern"
                >
                  <option value="">كافة الماركات</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={saleTypeFilter}
                  onChange={(e) => setSaleTypeFilter(e.target.value as any)}
                  className="select-modern"
                >
                  <option value="all">كل أنواع البيع</option>
                  <option value="DIRECT_SALE">بيع مباشر</option>
                  <option value="AUCTION">مزاد</option>
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
                <div className="space-y-3 sm:space-y-4">
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedBrand('');
                    }}
                    className="btn-primary w-full"
                  >
                    <i className="fas fa-refresh ml-1.5"></i>
                    إظهار كافة السيارات
                  </button>
                  <a 
                    href="/sell-car" 
                    className="block w-full bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3.5 rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 text-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 touch-target"
                  >
                    <i className="fas fa-plus ml-1.5"></i>
                    أضف سيارتك للبيع
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {filteredCars.map((car) => {
                const isAuction = car.saleType === 'AUCTION';
                const displayPrice = isAuction && car.currentBid ? car.currentBid : car.price;
                const href = isAuction ? `/auctions/${car.id}` : `/cars/${car.id}`;
                
                return (
                  <a key={car.id} href={href} className="card-modern group cursor-pointer relative">
                    {car.saleType && (
                      <div className="absolute top-3 left-3 z-10">
                        <AuctionBadge 
                          saleType={car.saleType as SaleType} 
                          isActive={car.isActiveAuction} 
                        />
                      </div>
                    )}
                    <div className="card-image-wrapper">
                      <Image
                        src={car.imageUrl || '/default-car.jpg'}
                        alt={car.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{car.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3">{getBrandName(car.brand)} • {car.year}</p>
                      <div className={`font-bold text-base sm:text-lg md:text-xl mb-3 ${isAuction ? 'text-orange-600' : 'text-green-600'}`}>
                        {displayPrice.toLocaleString()} ريال
                        {isAuction && car.currentBid && (
                          <span className="text-xs text-gray-500 mr-1 font-normal">(مزايدة)</span>
                        )}
                      </div>
                      {isAuction && car.bidCount !== undefined && car.bidCount > 0 && (
                        <div className="text-xs text-gray-500 mb-3 flex items-center">
                          <i className="fas fa-gavel ml-1.5"></i>
                          {car.bidCount} {car.bidCount === 1 ? 'مزايدة' : 'مزايدة'}
                        </div>
                      )}
                      
                      <div className="flex justify-center">
                        <div className={`w-full text-white py-2.5 px-4 rounded-xl transition-all duration-300 text-center text-sm font-semibold shadow-md group-hover:shadow-lg ${
                          isAuction 
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                        }`}>
                          <i className={`fas ${isAuction ? 'fa-gavel' : 'fa-eye'} ml-1.5`}></i>
                          {isAuction ? 'عرض المزاد' : 'عرض التفاصيل'}
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
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
                  src="/newlogo1.png" 
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