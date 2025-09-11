'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  contactName: string | null;
  contactPhone: string | null;
  contactLocation: string | null;
  contactEmail: string | null;
  isAvailable: boolean;
  createdAt: string;
}

const gulfCountries = [
  { code: '+966', name: 'السعودية', flag: '🇸🇦', placeholder: '5xxxxxxxx' },
  { code: '+971', name: 'الإمارات', flag: '🇦🇪', placeholder: '5xxxxxxxx' },
  { code: '+965', name: 'الكويت', flag: '🇰🇼', placeholder: '5xxxxxxxx' },
  { code: '+974', name: 'قطر', flag: '🇶🇦', placeholder: '5xxxxxxxx' },
  { code: '+973', name: 'البحرين', flag: '🇧🇭', placeholder: '3xxxxxxx' },
  { code: '+968', name: 'عُمان', flag: '🇴🇲', placeholder: '9xxxxxxx' }
];

export default function SellCarPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    carTitle: '',
    brand: '',
    year: '',
    price: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    color: '',
    description: '',
    contactName: '',
    countryCode: '+966',
    phoneNumber: '',
    email: '',
    location: '',
    images: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  // جلب السيارات من قاعدة البيانات
  useEffect(() => {
    if (activeTab === 'list') {
      setLoading(true);
      fetch('/api/cars')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCars(data.cars);
          } else {
            console.error('Error fetching cars:', data.error);
          }
        })
        .catch(error => {
          console.error('Error fetching cars:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Selected files:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));

    // Create preview URLs
    const newPreviewUrls = files.map(file => {
      try {
        return URL.createObjectURL(file);
      } catch (error) {
        console.error('Error creating preview URL:', error);
        return '';
      }
    });
    setPreviewImages(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // رفع الصور إلى Cloudinary أولاً
      let uploadedImages: string[] = [];
      
      console.log('Number of images to upload:', formData.images.length);
      
      if (formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          const image = formData.images[i];
          console.log(`Uploading image ${i + 1}/${formData.images.length} to Cloudinary:`, image.name, image.size, image.type);
          
          try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', image);
            
            console.log('Sending upload request to Cloudinary...');
            
            const uploadResponse = await fetch('/api/upload-cloudinary', {
              method: 'POST',
              body: formDataUpload,
            });
            
            console.log('Cloudinary upload response status:', uploadResponse.status);
            
            if (!uploadResponse.ok) {
              const errorText = await uploadResponse.text();
              console.error('Upload response not ok:', errorText);
              throw new Error(`HTTP ${uploadResponse.status}: ${errorText}`);
            }
            
            const uploadResult = await uploadResponse.json();
            console.log('Cloudinary upload result:', uploadResult);
            
            if (uploadResult.success) {
              uploadedImages.push(uploadResult.url);
              console.log('Image uploaded to Cloudinary successfully:', uploadResult.url);
            } else {
              console.error('Cloudinary upload failed:', uploadResult.error);
              alert(`فشل في رفع الصورة ${i + 1}: ${uploadResult.error}`);
              setIsSubmitting(false);
              return;
            }
          } catch (error: any) {
            console.error(`Error uploading image ${i + 1}:`, error);
            alert(`فشل في رفع الصورة ${i + 1}: ${error.message}`);
            setIsSubmitting(false);
            return;
          }
        }
      } else {
        console.log('No images to upload');
      }

      console.log('Final uploaded images from Cloudinary:', uploadedImages);

      // تجهيز البيانات للإرسال
      const payload = {
        name: formData.carTitle,
        brand: formData.brand,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        color: formData.color,
        description: formData.description,
        imageUrl: uploadedImages[0] || '', // استخدام أول صورة كصورة رئيسية
        images: uploadedImages, // جميع الصور المرفوعة
        contactName: formData.contactName,
        contactPhone: formData.countryCode + formData.phoneNumber, // دمج كود الدولة مع رقم الهاتف
        contactLocation: formData.location,
        contactEmail: formData.email,
      };

      console.log('Sending car data:', payload);

      const res = await fetch('/api/sell-car', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      setIsSubmitting(false);
      if (result.success) {
        alert('تم إرسال السيارة بنجاح! سيتم عرضها بعد موافقة المشرف.');
        router.push('/cars');
      } else {
        alert('حدث خطأ أثناء الإضافة: ' + result.error);
      }
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      setIsSubmitting(false);
      alert('حدث خطأ في الاتصال بالخادم: ' + error.message);
    }
  };

  const selectedCountry = gulfCountries.find(country => country.code === formData.countryCode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            بيع سيارتك معنا
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            املأ النموذج أدناه لعرض سيارتك على موقعنا والوصول إلى آلاف المشترين المحتملين
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      {/* تم حذف التبويب الثاني */}
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-2 mb-8">
            <div className="flex">
              <button
                onClick={() => setActiveTab('form')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 bg-blue-600 text-white`}
              >
                إضافة سيارة للبيع
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom pb-12">
        {/* تم حذف سكشن السيارات المعروضة للبيع */}
        {/* Form Section فقط */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Car Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  معلومات السيارة الأساسية
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان السيارة *
                    </label>
                    <input
                      type="text"
                      name="carTitle"
                      value={formData.carTitle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: تويوتا كامري 2020 ممتازة"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الماركة *
                    </label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">اختر الماركة</option>
                      {/* العلامات اليابانية */}
                      <option value="toyota">تويوتا</option>
                      <option value="honda">هوندا</option>
                      <option value="nissan">نيسان</option>
                      <option value="mazda">مازدا</option>
                      <option value="subaru">سوبارو</option>
                      <option value="suzuki">سوزوكي</option>
                      <option value="isuzu">إيسوزو</option>
                      <option value="mitsubishi">ميتسوبيشي</option>
                      <option value="lexus">لكزس</option>
                      <option value="infiniti">إنفينيتي</option>
                      <option value="acura">أكورا</option>
                      
                      {/* العلامات الألمانية */}
                      <option value="bmw">بي إم دبليو</option>
                      <option value="mercedes">مرسيدس</option>
                      <option value="audi">أودي</option>
                      <option value="volkswagen">فولكسفاغن</option>
                      <option value="porsche">بورش</option>
                      <option value="mini">ميني</option>
                      <option value="opel">أوبل</option>
                      
                      {/* العلامات الكورية */}
                      <option value="hyundai">هيونداي</option>
                      <option value="kia">كيا</option>
                      <option value="genesis">جينيسيس</option>
                      
                      {/* العلامات الأمريكية */}
                      <option value="ford">فورد</option>
                      <option value="chevrolet">شيفروليه</option>
                      <option value="cadillac">كاديلاك</option>
                      <option value="tesla">تسلا</option>
                      <option value="jeep">جيب</option>
                      <option value="gmc">جي إم سي</option>
                      <option value="buick">بيوك</option>
                      <option value="lincoln">لينكولن</option>
                      
                      {/* العلامات البريطانية */}
                      <option value="landrover">لاند روفر</option>
                      <option value="jaguar">جاكوار</option>
                      <option value="bentley">بنتلي</option>
                      <option value="rollsroyce">رولز رويس</option>
                      <option value="mini">ميني</option>
                      
                      {/* العلامات الإيطالية */}
                      <option value="ferrari">فيراري</option>
                      <option value="lamborghini">لامبورغيني</option>
                      <option value="maserati">مازيراتي</option>
                      <option value="fiat">فيات</option>
                      <option value="alfa">ألفا روميو</option>
                      
                      {/* العلامات الفرنسية */}
                      <option value="peugeot">بيجو</option>
                      <option value="renault">رينو</option>
                      <option value="citroen">ستروين</option>
                      
                      {/* العلامات الأوروبية الأخرى */}
                      <option value="volvo">فولفو</option>
                      <option value="saab">ساب</option>
                      <option value="skoda">سكودا</option>
                      <option value="seat">سيات</option>
                      
                      {/* العلامات الصينية */}
                      <option value="geely">جيلي</option>
                      <option value="chery">شيري</option>
                      <option value="byd">بي واي دي</option>
                      <option value="great wall">جريت وول</option>
                      <option value="mg">إم جي</option>
                      <option value="haval">هافال</option>
                      <option value="changan">تشانجان</option>
                      <option value="gac">جي إيه سي</option>
                      
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السنة *
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">اختر السنة</option>
                      {Array.from({ length: 25 }, (_, i) => 2025 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السعر (ريال) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المسافة المقطوعة (كم) *
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع الوقود *
                    </label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">اختر نوع الوقود</option>
                      <option value="gasoline">بنزين</option>
                      <option value="diesel">ديزل</option>
                      <option value="hybrid">هجين</option>
                      <option value="electric">كهربائي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ناقل الحركة *
                    </label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">اختر ناقل الحركة</option>
                      <option value="automatic">أوتوماتيك</option>
                      <option value="manual">يدوي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اللون *
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: اسود"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف السيارة *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اكتب وصفاً مفصلاً للسيارة، الحالة، المميزات، العيوب إن وجدت..."
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  معلومات التواصل
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="الاسم الكامل"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الجوال *
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={selectedCountry?.placeholder || '5xxxxxxxx'}
                          dir="ltr"
                        />
                      </div>
                      <div className="relative">
                        <select
                          name="countryCode"
                          value={formData.countryCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[140px]"
                        >
                          {gulfCountries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.code} {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      مثال: {formData.countryCode} {selectedCountry?.placeholder || '5xxxxxxxx'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المدينة *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: الرياض"
                    />
                  </div>
                </div>
              </div>

              {/* Images Upload */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  صور السيارة
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رفع صور السيارة (اختياري) - يمكنك رفع عدة صور
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                        <p className="text-gray-600">اضغط هنا لرفع الصور أو اسحبها إلى هنا</p>
                        <p className="text-sm text-gray-500">يمكنك رفع عدة صور في نفس الوقت - جميع الصور ستظهر في الإعلان</p>
                        <p className="text-xs text-blue-600 font-medium">✓ نظام الصور المتعددة مُفعّل</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">
                        الصور المرفوعة ({previewImages.length})
                      </h4>
                      <div className="text-sm text-green-600 font-medium">
                        <i className="fas fa-check-circle mr-1"></i>
                        جميع الصور ستظهر في الإعلان
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {previewImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    'إرسال طلب بيع السيارة'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 