'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  const carId = params.id;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              {car.name}
            </h1>
            <p className="text-xl text-blue-100 text-center">
              {getBrandName(car.brand)} • {car.year}
            </p>
          </div>
        </div>
      </section>

      {/* Car Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Car Images */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="h-96 relative">
                    <Image 
                      src={car.imageUrl || '/default-car.jpg'} 
                      alt={car.name} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                
                {/* Additional Images */}
                {car.images && car.images.length > 1 && (
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">صور إضافية</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {car.images.slice(1).map((image, index) => (
                        <div key={index} className="h-32 relative rounded-lg overflow-hidden">
                          <Image 
                            src={image} 
                            alt={`${car.name} ${index + 2}`} 
                            fill 
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Show all images if more than 1 */}
                {car.images && car.images.length > 1 && (
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">جميع الصور ({car.images.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {car.images.map((image, index) => (
                        <div key={index} className="h-24 relative rounded-lg overflow-hidden">
                          <Image 
                            src={image} 
                            alt={`${car.name} ${index + 1}`} 
                            fill 
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 33vw, 20vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Car Information */}
              <div className="space-y-8">
                
                {/* Price Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {car.price.toLocaleString()} ريال
                    </div>
                    <p className="text-gray-600">السعر المطلوب</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="space-y-3">
                      <a 
                        href="tel:+966501234567"
                        className="block bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <i className="fas fa-phone ml-2"></i>
                        اتصل بفريق المبيعات
                      </a>
                      <a 
                        href="https://wa.me/966501234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        <i className="fab fa-whatsapp ml-2"></i>
                        واتساب فريق المبيعات
                      </a>
                    </div>
                  </div>
                </div>

                {/* Car Specifications */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">مواصفات السيارة</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">الماركة</span>
                        <span className="font-semibold">
                          {getBrandName(car.brand)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">سنة الصنع</span>
                        <span className="font-semibold">{car.year}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">اللون</span>
                        <span className="font-semibold">
                          {car.color ? (
                            <span className="flex items-center">
                              <span className="w-4 h-4 rounded-full bg-gray-300 ml-2"></span>
                              {car.color}
                            </span>
                          ) : (
                            'غير محدد'
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">المسافة المقطوعة</span>
                        <span className="font-semibold">
                          {car.mileage ? (
                            <span className="flex items-center">
                              <i className="fas fa-tachometer-alt text-blue-500 ml-2"></i>
                              {car.mileage.toLocaleString()} كم
                            </span>
                          ) : (
                            'غير محدد'
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">نوع الوقود</span>
                        <span className="font-semibold">
                          {car.fuelType === 'gasoline' ? 'بنزين' : 
                           car.fuelType === 'diesel' ? 'ديزل' : 
                           car.fuelType === 'hybrid' ? 'هجين' : 
                           car.fuelType === 'electric' ? 'كهربائي' : 
                           car.fuelType || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">ناقل الحركة</span>
                        <span className="font-semibold">
                          {car.transmission === 'automatic' ? 'أوتوماتيك' : 
                           car.transmission === 'manual' ? 'يدوي' : 
                           car.transmission || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="text-gray-600">الحالة</span>
                        <span className="font-semibold text-green-600">متاحة للبيع</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Car Description */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">وصف السيارة</h3>
                  {car.description ? (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {car.description}
                    </p>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-4">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <p className="text-gray-600">لا يوجد وصف متاح للسيارة</p>
                      <p className="text-gray-500 text-sm mt-2">سيتم إضافة الوصف قريباً</p>
                    </div>
                  )}
                </div>



              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 