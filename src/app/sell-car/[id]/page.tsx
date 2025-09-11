import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "../../components/Header";

// Mock data for sold cars
const soldCars = [
  {
    id: "1",
    carTitle: "تويوتا كامري 2020 ممتازة",
    brand: "تويوتا",
    year: 2020,
    price: 85000,
    mileage: 45000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "أبيض",
    description: "سيارة ممتازة بحالة جيدة جداً، صيانة دورية، مكيف بارد، فرامل جديدة، إطارات جديدة، لا يوجد أي عيوب، سبب البيع السفر.",
    contactName: "أحمد محمد",
    phone: "0501234567",
    email: "ahmed@email.com",
    location: "الرياض",
    images: ["/camry.jpg", "/bmw.jpg", "/audi.jpg"],
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    carTitle: "بي إم دبليو X5 2019 فاخرة",
    brand: "بي إم دبليو",
    year: 2019,
    price: 180000,
    mileage: 65000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "أسود",
    description: "سيارة فاخرة بحالة ممتازة، جميع الخدمات في الوكالة، مكيف بارد، فرامل جديدة، إطارات جديدة، لا يوجد أي عيوب، سبب البيع التحديث.",
    contactName: "سارة أحمد",
    phone: "0509876543",
    email: "sara@email.com",
    location: "جدة",
    images: ["/BMW-X5-2024-1.webp", "/mercedes.jpg", "/lexus.jpg"],
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    carTitle: "هيونداي سوناتا 2021 اقتصادية",
    brand: "هيونداي",
    year: 2021,
    price: 65000,
    mileage: 35000,
    fuelType: "بنزين",
    transmission: "أوتوماتيك",
    color: "فضي",
    description: "سيارة اقتصادية بحالة جيدة جداً، صيانة دورية، مكيف بارد، فرامل جديدة، إطارات جديدة، لا يوجد أي عيوب، سبب البيع التحديث.",
    contactName: "محمد علي",
    phone: "0505555555",
    email: "mohammed@email.com",
    location: "الدمام",
    images: ["/sonata.webp", "/hyundai.jpg", "/kia.jpg"],
    createdAt: "2024-01-05"
  }
];

export default async function SoldCarDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = soldCars.find((c) => c.id === id);
  if (!car) return notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">الرئيسية</a>
            <span>&gt;</span>
            <a href="/sell-car" className="hover:text-blue-600">بيع سيارتك</a>
            <span>&gt;</span>
            <span className="text-gray-800">{car.carTitle}</span>
          </div>
        </div>
      </div>

      {/* Car Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Images */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96 relative">
                <Image src={car.images[0]} alt={car.carTitle} fill className="object-cover" />
              </div>
              
              {/* Additional Images */}
              {car.images.length > 1 && (
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {car.images.slice(1).map((image, index) => (
                      <div key={index} className="h-24 relative rounded-lg overflow-hidden">
                        <Image src={image} alt={`${car.carTitle} ${index + 2}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Car Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.carTitle}</h1>
              <p className="text-gray-600 mb-4">{car.description}</p>
              
              <div className="text-4xl font-bold text-green-600 mb-6">
                {car.price.toLocaleString()} ريال
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">الماركة</div>
                <div className="font-semibold">{car.brand}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">سنة الصنع</div>
                <div className="font-semibold">{car.year}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">المسافة المقطوعة</div>
                <div className="font-semibold">{car.mileage.toLocaleString()} كم</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">نوع الوقود</div>
                <div className="font-semibold">{car.fuelType}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">ناقل الحركة</div>
                <div className="font-semibold">{car.transmission}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">اللون</div>
                <div className="font-semibold">{car.color}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">تاريخ الإعلان</div>
                <div className="font-semibold">{new Date(car.createdAt).toLocaleDateString('ar-SA')}</div>
              </div>
            </div>

            {/* Seller Information */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">معلومات البائع</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">اسم البائع</div>
                    <div className="font-semibold text-gray-800">{car.contactName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">رقم الجوال</div>
                    <div className="font-semibold text-gray-800">{car.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">البريد الإلكتروني</div>
                    <div className="font-semibold text-gray-800">{car.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">الموقع</div>
                    <div className="font-semibold text-gray-800">{car.location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <i className="fas fa-phone ml-2"></i>
                اتصل بالبائع
              </button>
              <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <i className="fab fa-whatsapp ml-2"></i>
                واتساب
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">موقع السيارات</h3>
            <p className="text-gray-400 mb-8 text-lg">أفضل موقع لبيع وشراء السيارات</p>
            
            {/* Enhanced Social Media */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold mb-6">تابعنا على</h4>
              <div className="flex justify-center space-x-6 space-x-reverse flex-wrap gap-4">
                <a href="#" className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                  <i className="fab fa-facebook-f text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                  <i className="fab fa-twitter text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                  <i className="fab fa-instagram text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                  <i className="fab fa-youtube text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                </a>
                <a href="#" className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-2xl">
                  <i className="fab fa-whatsapp text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
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