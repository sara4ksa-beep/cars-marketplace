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
      <section className="bg-white shadow-md py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <i className="fas fa-balance-scale text-blue-600 ml-2"></i>
              مقارنة السيارات
            </h1>
            <p className="text-gray-600 text-lg">قارن بين السيارات المختلفة لتتخذ القرار الأمثل</p>
            <div className="mt-4 text-sm text-gray-500">
              يمكنك مقارنة حتى 4 سيارات في نفس الوقت
            </div>
          </div>
        </div>
      </section>

      {/* Selected Cars for Comparison */}
      {selectedCars.length > 0 && (
        <section className="py-8 bg-blue-50 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
              السيارات المختارة للمقارنة ({selectedCars.length}/4)
            </h2>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {selectedCars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
                  <button
                    onClick={() => removeFromComparison(car.id)}
                    className="absolute top-2 left-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                  <div className="h-32 relative">
                    <Image
                      src={car.imageUrl || '/default-car.jpg'}
                      alt={car.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1 text-sm truncate">{car.name}</h3>
                    <p className="text-gray-600 text-xs mb-2">{getBrandName(car.brand)} • {car.year}</p>
                    <div className="text-green-600 font-bold text-sm">{car.price.toLocaleString()} ريال</div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedCars.length >= 2 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => document.getElementById('comparison-table')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">اختر السيارات للمقارنة</h2>
            <div className="max-w-md">
              <input
                type="text"
                placeholder="ابحث عن سيارة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد سيارات متاحة</h3>
              <p className="text-gray-600">جرب تغيير كلمات البحث</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {filteredCars.map((car) => {
                const isSelected = selectedCars.find(c => c.id === car.id);
                const canAdd = selectedCars.length < 4;

                return (
                  <div key={car.id} className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                    <div className="h-48 relative">
                      <Image
                        src={car.imageUrl || '/default-car.jpg'}
                        alt={car.name}
                        fill
                        className="object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          <i className="fas fa-check ml-1"></i>
                          مختارة
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{car.name}</h3>
                      <p className="text-gray-600 mb-2">{getBrandName(car.brand)} • {car.year}</p>
                      <div className="text-green-600 font-bold text-lg mb-4">{car.price.toLocaleString()} ريال</div>
                      
                      <div className="flex gap-2">
                        <a
                          href={`/cars/${car.id}`}
                          className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm"
                        >
                          التفاصيل
                        </a>
                        {isSelected ? (
                          <button
                            onClick={() => removeFromComparison(car.id)}
                            className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            <i className="fas fa-minus ml-1"></i>
                            إزالة
                          </button>
                        ) : (
                          <button
                            onClick={() => addToComparison(car)}
                            disabled={!canAdd}
                            className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm ${
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
        <section id="comparison-table" className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              <i className="fas fa-table text-blue-600 ml-2"></i>
              مقارنة تفصيلية
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-lg overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="p-4 text-right font-semibold">المواصفات</th>
                    {selectedCars.map((car) => (
                      <th key={car.id} className="p-4 text-center font-semibold min-w-[200px]">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">{car.name}</div>
                          <div className="text-xs opacity-90">{getBrandName(car.brand)} • {car.year}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* الصور */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">الصورة</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-4 text-center">
                        <div className="w-20 h-20 relative mx-auto rounded-lg overflow-hidden">
                          <Image
                            src={car.imageUrl || '/default-car.jpg'}
                            alt={car.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* السعر */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">السعر</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-4 text-center">
                        <div className="text-lg font-bold text-green-600">
                          {car.price.toLocaleString()} ريال
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* سنة الصنع */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">سنة الصنع</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-4 text-center font-medium">
                        {car.year}
                      </td>
                    ))}
                  </tr>

                  {/* المسافة المقطوعة */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">المسافة المقطوعة</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-4 text-center font-medium">
                        {car.mileage ? `${car.mileage.toLocaleString()} كم` : 'غير محدد'}
                      </td>
                    ))}
                  </tr>

                  {/* نوع الوقود */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">نوع الوقود</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-4 text-center font-medium">
                        {getFuelType(car.fuelType)}
                      </td>
                    ))}
                  </tr>

                  {/* ناقل الحركة */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">ناقل الحركة</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-4 text-center font-medium">
                        {getTransmission(car.transmission)}
                      </td>
                    ))}
                  </tr>

                  {/* اللون */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">اللون</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-4 text-center font-medium">
                        {car.color || 'غير محدد'}
                      </td>
                    ))}
                  </tr>

                  {/* الحالة */}
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">الحالة</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-4 text-center">
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          متاحة للبيع
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* الإجراءات */}
                  <tr>
                    <td className="p-4 font-semibold text-gray-700 bg-gray-50">الإجراءات</td>
                    {selectedCars.map((car) => (
                      <td key={car.id} className="p-4 text-center">
                        <div className="space-y-2">
                          <a
                            href={`/cars/${car.id}`}
                            className="block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            عرض التفاصيل
                          </a>
                          <button
                            onClick={() => removeFromComparison(car.id)}
                            className="block w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm"
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
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">نصائح للمقارنة</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-3xl mb-4">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">السعر</h3>
              <p className="text-gray-600 text-sm">قارن الأسعار واختر الأنسب لميزانيتك</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-green-600 text-3xl mb-4">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">المسافة المقطوعة</h3>
              <p className="text-gray-600 text-sm">كلما قلت المسافة كانت السيارة أفضل</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-purple-600 text-3xl mb-4">
                <i className="fas fa-gas-pump"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">نوع الوقود</h3>
              <p className="text-gray-600 text-sm">اختر نوع الوقود المناسب لاستخدامك</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-orange-600 text-3xl mb-4">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">سنة الصنع</h3>
              <p className="text-gray-600 text-sm">السيارات الأحدث تحتوي على تقنيات أفضل</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 