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

export default function ComparePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCars, setSelectedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  // إضافة سيارة للمقارنة
  const addToComparison = (car: Car) => {
    if (selectedCars.length < 4 && !selectedCars.find(c => c.id === car.id)) {
      setSelectedCars([...selectedCars, car]);
    }
  };

  // إزالة سيارة من المقارنة
  const removeFromComparison = (carId: number) => {
    setSelectedCars(selectedCars.filter(car => car.id !== carId));
  };

  // فلترة السيارات حسب البحث
  const filteredCars = cars.filter(car => {
    const matchesSearch = searchTerm === '' || 
                         car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && car.isAvailable;
  });

  // ترجمة البراند
  const getBrandName = (brand: string) => {
    const brandMap: { [key: string]: string } = {
      'toyota': 'تويوتا',
      'honda': 'هوندا',
      'nissan': 'نيسان',
      'bmw': 'بي إم دبليو',
      'mercedes': 'مرسيدس',
      'audi': 'أودي',
      'lexus': 'لكزس',
      'hyundai': 'هيونداي',
      'kia': 'كيا',
      'ford': 'فورد',
      'chevrolet': 'شيفروليه',
      'tesla': 'تسلا',
      'rangerover': 'رنج روفر',
      'cadillac': 'كاديلاك'
    };
    return brandMap[brand] || brand;
  };

  // ترجمة نوع الوقود
  const getFuelType = (fuelType: string | null) => {
    if (!fuelType) return 'غير محدد';
    const fuelMap: { [key: string]: string } = {
      'gasoline': 'بنزين',
      'diesel': 'ديزل',
      'hybrid': 'هجين',
      'electric': 'كهربائي'
    };
    return fuelMap[fuelType] || fuelType;
  };

  // ترجمة ناقل الحركة
  const getTransmission = (transmission: string | null) => {
    if (!transmission) return 'غير محدد';
    const transmissionMap: { [key: string]: string } = {
      'automatic': 'أوتوماتيك',
      'manual': 'يدوي'
    };
    return transmissionMap[transmission] || transmission;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">جاري تحميل السيارات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page Header */}
      <section className="bg-white shadow-md py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              <i className="fas fa-balance-scale text-blue-600 ml-2"></i>
              مقارنة السيارات
            </h1>
            <p className="text-gray-600 text-base md:text-lg">قارن بين السيارات المختلفة لتتخذ القرار الأمثل</p>
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500">
              يمكنك مقارنة حتى 4 سيارات في نفس الوقت
            </div>
          </div>
        </div>
      </section>

      {/* Selected Cars for Comparison */}
      {selectedCars.length > 0 && (
        <section className="py-6 md:py-8 bg-blue-50 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-4 md:mb-6 text-center">
              السيارات المختارة للمقارنة ({selectedCars.length}/4)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {selectedCars.map((car) => (
                <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden relative hover:shadow-xl transition-all duration-300">
                  <button
                    onClick={() => removeFromComparison(car.id)}
                    className="absolute top-3 left-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 shadow-lg"
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                  <div className="h-40 md:h-48 relative">
                    <Image
                      src={car.imageUrl || '/default-car.jpg'}
                      alt={car.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="font-bold text-gray-800 mb-2 text-sm md:text-base truncate">{car.name}</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-2">{getBrandName(car.brand)} • {car.year}</p>
                    <div className="text-green-600 font-bold text-sm md:text-base">{car.price.toLocaleString()} ريال</div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedCars.length >= 2 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => document.getElementById('comparison-table')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-arrow-down ml-2"></i>
                  عرض المقارنة التفصيلية
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Car Selection */}
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">اختر السيارات للمقارنة</h2>
            <div className="max-w-md mx-auto md:mx-0">
              <input
                type="text"
                placeholder="ابحث عن سيارة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>
          </div>

          {filteredCars.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="text-gray-400 text-4xl md:text-6xl mb-4">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">لا توجد سيارات متاحة</h3>
              <p className="text-gray-600 text-sm md:text-base">جرب تغيير كلمات البحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredCars.map((car) => {
                const isSelected = selectedCars.find(c => c.id === car.id);
                const canAdd = selectedCars.length < 4;

                return (
                  <div key={car.id} className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                    <div className="h-48 md:h-56 relative">
                      <Image
                        src={car.imageUrl || '/default-car.jpg'}
                        alt={car.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          <i className="fas fa-check ml-1"></i>
                          مختارة
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 line-clamp-2">{car.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{getBrandName(car.brand)} • {car.year}</p>
                      <div className="text-green-600 font-bold text-lg mb-4">{car.price.toLocaleString()} ريال</div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a
                          href={`/cars/${car.id}`}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                        >
                          التفاصيل
                        </a>
                        {isSelected ? (
                          <button
                            onClick={() => removeFromComparison(car.id)}
                            className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                          >
                            <i className="fas fa-minus ml-1"></i>
                            إزالة
                          </button>
                        ) : (
                          <button
                            onClick={() => addToComparison(car)}
                            disabled={!canAdd}
                            className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm font-medium ${
                              canAdd 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <i className="fas fa-plus ml-1"></i>
                            {canAdd ? 'إضافة' : 'ممتلئ'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      {selectedCars.length >= 2 && (
        <section id="comparison-table" className="py-6 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">
              <i className="fas fa-table text-blue-600 ml-2"></i>
              مقارنة تفصيلية
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden min-w-[600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="p-3 md:p-4 text-right font-semibold text-sm md:text-base">المواصفات</th>
                    {selectedCars.map((car) => (
                      <th key={car.id} className="p-3 md:p-4 text-center font-semibold min-w-[150px] md:min-w-[200px]">
                        <div className="space-y-1 md:space-y-2">
                          <div className="text-xs md:text-sm font-medium">{car.name}</div>
                          <div className="text-xs opacity-90">{getBrandName(car.brand)} • {car.year}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* الصور */}
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-semibold text-gray-700 bg-gray-50 text-sm md:text-base">الصورة</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3 md:p-4 text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 relative mx-auto rounded-lg overflow-hidden">
                          <Image
                            src={car.imageUrl || '/default-car.jpg'}
                            alt={car.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* السعر */}
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-semibold text-gray-700 bg-gray-50 text-sm md:text-base">السعر</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3 md:p-4 text-center">
                        <div className="text-sm md:text-lg font-bold text-green-600">
                          {car.price.toLocaleString()} ريال
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* سنة الصنع */}
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-semibold text-gray-700 bg-gray-50 text-sm md:text-base">سنة الصنع</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3 md:p-4 text-center font-medium text-sm md:text-base">
                        {car.year}
                      </td>
                    ))}
                  </tr>

                  {/* المسافة المقطوعة */}
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-semibold text-gray-700 bg-gray-50 text-sm md:text-base">المسافة المقطوعة</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3 md:p-4 text-center font-medium text-sm md:text-base">
                        {car.mileage ? `${car.mileage.toLocaleString()} كم` : 'غير محدد'}
                      </td>
                    ))}
                  </tr>

                  {/* نوع الوقود */}
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-semibold text-gray-700 bg-gray-50 text-sm md:text-base">نوع الوقود</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3 md:p-4 text-center font-medium text-sm md:text-base">
                        {getFuelType(car.fuelType)}
                      </td>
                    ))}
                  </tr>

                  {/* ناقل الحركة */}
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-semibold text-gray-700 bg-gray-50 text-sm md:text-base">ناقل الحركة</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3 md:p-4 text-center font-medium text-sm md:text-base">
                        {getTransmission(car.transmission)}
                      </td>
                    ))}
                  </tr>

                  {/* اللون */}
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-semibold text-gray-700 bg-gray-50 text-sm md:text-base">اللون</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3 md:p-4 text-center font-medium text-sm md:text-base">
                        {car.color || 'غير محدد'}
                      </td>
                    ))}
                  </tr>

                  {/* الحالة */}
                  <tr className="border-b border-gray-200">
                    <td className="p-3 md:p-4 font-semibold text-gray-700 bg-gray-50 text-sm md:text-base">الحالة</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3 md:p-4 text-center">
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs md:text-sm font-medium">
                          متاحة للبيع
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* الإجراءات */}
                  <tr>
                    <td className="p-3 md:p-4 font-semibold text-gray-700 bg-gray-50 text-sm md:text-base">الإجراءات</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-3 md:p-4 text-center">
                        <div className="space-y-2">
                          <a
                            href={`/cars/${car.id}`}
                            className="block bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm font-medium"
                          >
                            عرض التفاصيل
                          </a>
                          <button
                            onClick={() => removeFromComparison(car.id)}
                            className="block w-full bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-xs md:text-sm font-medium"
                          >
                            إزالة من المقارنة
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Tips Section */}
      <section className="py-6 md:py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">نصائح للمقارنة</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-blue-600 text-2xl md:text-3xl mb-3 md:mb-4">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-sm md:text-base">السعر</h3>
              <p className="text-gray-600 text-xs md:text-sm">قارن الأسعار واختر الأنسب لميزانيتك</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-green-600 text-2xl md:text-3xl mb-3 md:mb-4">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-sm md:text-base">المسافة المقطوعة</h3>
              <p className="text-gray-600 text-xs md:text-sm">كلما قلت المسافة كانت السيارة أفضل</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-purple-600 text-2xl md:text-3xl mb-3 md:mb-4">
                <i className="fas fa-gas-pump"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-sm md:text-base">نوع الوقود</h3>
              <p className="text-gray-600 text-xs md:text-sm">اختر نوع الوقود المناسب لاستخدامك</p>
            </div>
            
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="text-orange-600 text-2xl md:text-3xl mb-3 md:mb-4">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-sm md:text-base">سنة الصنع</h3>
              <p className="text-gray-600 text-xs md:text-sm">السيارات الأحدث تحتوي على تقنيات أفضل</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 