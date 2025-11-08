'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
  status: string;
  isAvailable: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = params.id as string;
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Car>>({});

  useEffect(() => {
    const edit = searchParams.get('edit');
    if (edit === 'true') {
      setIsEditMode(true);
    }
    fetchCar();
  }, [carId]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/cars/${carId}`);
      const data = await response.json();
      
      if (data.success) {
        setCar(data.car);
        setFormData(data.car);
      } else {
        alert('حدث خطأ: ' + data.error);
        router.push('/admin/cars');
      }
    } catch (error) {
      console.error('Error fetching car:', error);
      alert('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value === '' ? null : value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/cars/${carId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setCar(data.car);
        setIsEditMode(false);
        alert('تم حفظ التغييرات بنجاح');
      } else {
        alert('حدث خطأ: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating car:', error);
      alert('حدث خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (car) {
      setFormData(car);
      setIsEditMode(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">السيارة غير موجودة</p>
        <Link href="/admin/cars" className="text-blue-600 hover:underline mt-4 inline-block">
          العودة إلى قائمة السيارات
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/cars"
            className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded"
          >
            <i className="fas fa-arrow-right"></i>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'تعديل السيارة' : 'تفاصيل السيارة'}
          </h1>
        </div>
        
        {!isEditMode ? (
          <button
            onClick={() => setIsEditMode(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <i className="fas fa-edit"></i>
            <span>تعديل</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>حفظ</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">الصور</h2>
            {car.imageUrl && (
              <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={car.imageUrl}
                  alt={car.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {car.images && car.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {car.images.map((img, idx) => (
                  <div key={idx} className="relative w-full h-24 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`${car.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">المعلومات الأساسية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{car.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الماركة</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{car.brand}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السنة</label>
                {isEditMode ? (
                  <input
                    type="number"
                    name="year"
                    value={formData.year || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{car.year}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">السعر (ريال)</label>
                {isEditMode ? (
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-semibold text-green-600">{car.price.toLocaleString()} ريال</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">المسافة المقطوعة</label>
                {isEditMode ? (
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{car.mileage ? `${car.mileage.toLocaleString()} كم` : 'غير محدد'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع الوقود</label>
                {isEditMode ? (
                  <select
                    name="fuelType"
                    value={formData.fuelType || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر نوع الوقود</option>
                    <option value="بنزين">بنزين</option>
                    <option value="ديزل">ديزل</option>
                    <option value="كهربائي">كهربائي</option>
                    <option value="هجين">هجين</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{car.fuelType || 'غير محدد'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع ناقل الحركة</label>
                {isEditMode ? (
                  <select
                    name="transmission"
                    value={formData.transmission || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر نوع ناقل الحركة</option>
                    <option value="أوتوماتيك">أوتوماتيك</option>
                    <option value="يدوي">يدوي</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{car.transmission || 'غير محدد'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللون</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="color"
                    value={formData.color || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{car.color || 'غير محدد'}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              {isEditMode ? (
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{car.description || 'لا يوجد وصف'}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">معلومات الاتصال</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم جهة الاتصال</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{car.contactName || 'غير محدد'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الهاتف</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{car.contactPhone || 'غير محدد'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                {isEditMode ? (
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{car.contactEmail || 'غير محدد'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الموقع</label>
                {isEditMode ? (
                  <input
                    type="text"
                    name="contactLocation"
                    value={formData.contactLocation || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{car.contactLocation || 'غير محدد'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">الحالة والإعدادات</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                {isEditMode ? (
                  <select
                    name="status"
                    value={formData.status || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDING">في الانتظار</option>
                    <option value="APPROVED">معتمد</option>
                    <option value="REJECTED">مرفوض</option>
                    <option value="SOLD">مباع</option>
                  </select>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${
                    car.status === 'APPROVED' ? 'bg-green-500' :
                    car.status === 'PENDING' ? 'bg-orange-500' :
                    car.status === 'REJECTED' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}>
                    {car.status === 'APPROVED' ? 'معتمد' :
                     car.status === 'PENDING' ? 'في الانتظار' :
                     car.status === 'REJECTED' ? 'مرفوض' :
                     'مباع'}
                  </span>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={isEditMode ? (formData.isAvailable ?? true) : car.isAvailable}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="mr-2 text-sm text-gray-700">متاح للبيع</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={isEditMode ? (formData.featured ?? false) : car.featured}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="mr-2 text-sm text-gray-700">مميز</label>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">معلومات إضافية</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">تاريخ الإنشاء:</span>
                <span className="text-gray-900">{new Date(car.createdAt).toLocaleDateString('ar-SA')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">آخر تحديث:</span>
                <span className="text-gray-900">{new Date(car.updatedAt).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

