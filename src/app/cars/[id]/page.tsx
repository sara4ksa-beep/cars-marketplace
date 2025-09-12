'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';

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
}

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.id;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${carId}`);
        const data = await response.json();
        
        if (data.success) {
          setCar(data.car);
        } else {
          setError('لم يتم العثور على السيارة');
        }
      } catch (error) {
        setError('حدث خطأ في تحميل بيانات السيارة');
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">جاري تحميل تفاصيل السيارة...</p>
            <p className="text-gray-500 text-sm mt-2">يرجى الانتظار</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">خطأ</h1>
            <p className="text-gray-600 mb-6">{error || 'لم يتم العثور على السيارة'}</p>
            <a 
              href="/cars" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة إلى قائمة السيارات
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-center">
              {car.name}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 text-center">
              {getBrandName(car.brand)} • {car.year}
            </p>
          </div>
        </div>
      </section>

      {/* Car Details */}
      <section className="py-4 sm:py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-12">
              
              {/* Car Images */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Main Image - Better mobile sizing */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mobile-image-container">
                  <div 
                    className="h-48 sm:h-64 md:h-96 relative cursor-pointer group"
                    onClick={() => setSelectedImageIndex(0)}
                  >
                    <Image 
                      src={car.imageUrl || '/default-car.jpg'} 
                      alt={car.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    {/* Click indicator for mobile */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2 sm:p-3">
                        <i className="fas fa-expand text-gray-700 text-lg sm:text-xl"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Images - Better mobile grid */}
                {car.images && car.images.length > 1 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4">صور إضافية</h3>
                    <div className="image-gallery-mobile">
                      {car.images.slice(1).map((image, index) => (
                        <div 
                          key={index} 
                          className="h-20 sm:h-24 md:h-32 relative rounded-lg overflow-hidden group cursor-pointer mobile-image-container"
                          onClick={() => setSelectedImageIndex(index + 1)}
                        >
                          <Image 
                            src={image} 
                            alt={`${car.name} ${index + 2}`} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 33vw, 25vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* All Images Gallery - Improved mobile layout */}
                {car.images && car.images.length > 1 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4">جميع الصور ({car.images.length})</h3>
                    <div className="image-gallery-mobile">
                      {car.images.map((image, index) => (
                        <div 
                          key={index} 
                          className="h-16 sm:h-20 md:h-24 relative rounded-lg overflow-hidden group cursor-pointer mobile-image-container"
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <Image 
                            src={image} 
                            alt={`${car.name} ${index + 1}`} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          />
                          {/* Image number indicator */}
                          <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1 sm:px-1.5 py-0.5 rounded-full">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Car Information */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                
                {/* Price Section */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-2">
                      {car.price.toLocaleString()} ريال
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">السعر المطلوب</p>
                  </div>
                  
                  <div className="text-center">
                    <button
                      onClick={() => router.push(`/booking/${carId}`)}
                      className="w-full bg-blue-600 text-white py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-xs sm:text-sm md:text-base"
                    >
                      <i className="fas fa-calendar-check ml-1 sm:ml-2"></i>
                      احجزها الآن
                    </button>
                  </div>
                </div>

                {/* Car Specifications */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">مواصفات السيارة</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">الماركة</span>
                        <span className="font-semibold text-sm sm:text-base">
                          {getBrandName(car.brand)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">سنة الصنع</span>
                        <span className="font-semibold text-sm sm:text-base">{car.year}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">اللون</span>
                        <span className="font-semibold text-sm sm:text-base">
                          {car.color ? (
                            <span className="flex items-center">
                              <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gray-300 ml-2"></span>
                              {car.color}
                            </span>
                          ) : (
                            'غير محدد'
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">المسافة المقطوعة</span>
                        <span className="font-semibold text-sm sm:text-base">
                          {car.mileage ? (
                            <span className="flex items-center">
                              <i className="fas fa-tachometer-alt text-blue-500 ml-1 sm:ml-2 text-xs sm:text-sm"></i>
                              {car.mileage.toLocaleString()} كم
                            </span>
                          ) : (
                            'غير محدد'
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">نوع الوقود</span>
                        <span className="font-semibold text-sm sm:text-base">
                          {car.fuelType === 'gasoline' ? 'بنزين' : 
                           car.fuelType === 'diesel' ? 'ديزل' : 
                           car.fuelType === 'hybrid' ? 'هجين' : 
                           car.fuelType === 'electric' ? 'كهربائي' : 
                           car.fuelType || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">ناقل الحركة</span>
                        <span className="font-semibold text-sm sm:text-base">
                          {car.transmission === 'automatic' ? 'أوتوماتيك' : 
                           car.transmission === 'manual' ? 'يدوي' : 
                           car.transmission || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                        <span className="text-gray-600 text-sm sm:text-base">الحالة</span>
                        <span className="font-semibold text-green-600 text-sm sm:text-base">متاحة للبيع</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Car Description */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">وصف السيارة</h3>
                  {car.description ? (
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
                      {car.description}
                    </p>
                  ) : (
                    <div className="text-center py-4 sm:py-6 md:py-8">
                      <div className="text-gray-400 text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base">لا يوجد وصف متاح للسيارة</p>
                      <p className="text-gray-500 text-xs sm:text-sm mt-2">سيتم إضافة الوصف قريباً</p>
                    </div>
                  )}
                </div>



              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal for Mobile */}
      {selectedImageIndex !== null && car && (
        <div 
          className="image-modal-mobile"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div className="image-modal-content">
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-colors"
            >
              <i className="fas fa-times text-lg sm:text-xl"></i>
            </button>
            
            <div className="relative h-80 sm:h-96 md:h-[70vh] w-full">
              <Image
                src={car.images[selectedImageIndex] || car.imageUrl || '/default-car.jpg'}
                alt={`${car.name} ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            
            {/* Navigation arrows */}
            {car.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(prev => prev === 0 ? car.images.length - 1 : (prev || 0) - 1);
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-colors"
                >
                  <i className="fas fa-chevron-right text-lg sm:text-xl"></i>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(prev => prev === car.images.length - 1 ? 0 : (prev || 0) + 1);
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-colors"
                >
                  <i className="fas fa-chevron-left text-lg sm:text-xl"></i>
                </button>
              </>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
              {selectedImageIndex + 1} / {car.images.length}
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 