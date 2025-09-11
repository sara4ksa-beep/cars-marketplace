'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from './components/Header';

// نوع البيانات للسيارة
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
  featured: boolean;
}

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const testimonials = [
    {
      name: "أحمد محمد",
      comment: "خدمة ممتازة وسيارات عالية الجودة. أنصح بشدة!",
      rating: 5,
      car: "مرسيدس C-Class"
    },
    {
      name: "سارة أحمد",
      comment: "تجربة رائعة من البداية للنهاية. فريق محترف جداً.",
      rating: 5,
      car: "بي إم دبليو X5"
    },
    {
      name: "محمد علي",
      comment: "أسعار منافسة وجودة عالية. سأتعامل معهم مرة أخرى.",
      rating: 4,
      car: "أودي A4"
    },
    {
      name: "فاطمة حسن",
      comment: "أفضل تجربة شراء سيارة في حياتي. خدمة لا تُنسى!",
      rating: 5,
      car: "لكزس ES"
    },
    {
      name: "علي محمود",
      comment: "أسعار معقولة وسيارات ممتازة. أنصح الجميع.",
      rating: 5,
      car: "تويوتا كامري"
    }
  ];

  // Auto-play testimonials
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5000); // Change every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

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

  // أخذ 8 سيارات فقط للعرض
  const displayedCars = cars.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Car Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/BMW-X5-2024-1.webp" 
            alt="Hero Car Background" 
            fill 
            className="object-cover object-center"
            priority
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
        </div>
        
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 hero-background-blob bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 hero-background-blob-large bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hero-background-blob-xl bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-20 opacity-30">
            <i className="fas fa-car text-white hero-floating-icon-large animate-float"></i>
          </div>
          <div className="absolute bottom-1/4 left-20 opacity-20">
            <i className="fas fa-road text-white hero-floating-icon animate-float-delayed"></i>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-custom relative z-10 text-white py-16">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            
            {/* Welcome Text */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block">
                <span className="hero-welcome-text bg-white/20 backdrop-blur-sm text-white font-medium rounded-full border border-white/30 shadow-lg">
                  <i className="fas fa-sparkles mr-2"></i>
                  مرحباً بكم في عالم السيارات المتميز
                </span>
              </div>
              
              <h1 className="hero-title font-bold leading-tight text-white text-shadow-glow animate-slide-up">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  اعثر على سيارة احلامك
                </span>
              </h1>
              
              <p className="hero-subtitle text-white/90 leading-relaxed max-w-4xl mx-auto animate-slide-up-delayed font-medium">
                أفضل مجموعة سيارات فاخرة واقتصادية في الشرق الأوسط مع خدمة متميزة وضمان شامل
              </p>
            </div>

            {/* Stats Cards */}
            <div className="hero-stats grid grid-cols-3 max-w-3xl mx-auto mb-6 animate-fade-in-delayed">
              <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/20 text-center">
                <div className="stat-number font-bold text-white">200+</div>
                <div className="stat-label text-white/80">سيارة متاحة</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/20 text-center">
                <div className="stat-number font-bold text-white">1000+</div>
                <div className="stat-label text-white/80">عميل راضي</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm p-3 rounded-2xl border border-white/20 text-center">
                <div className="stat-number font-bold text-white">24/7</div>
                <div className="stat-label text-white/80">خدمة دعم</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row justify-center animate-fade-in-delayed">
              <a href="/cars" className="hero-button bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1">
                تصفح السيارات
              </a>
              
              <a href="/sell-car" className="hero-button bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                بيع سيارتك
              </a>
              
              <button className="hero-button bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                احجز تجربة قيادة
              </button>
            </div>
          </div>
        </div>
        

      </section>

      {/* Cars Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            السيارات
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">
                <i className="fas fa-car"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">جاري تحميل السيارات...</h3>
              <p className="text-gray-500 mb-6">يرجى الانتظار قليلاً</p>
            </div>
          ) : displayedCars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {displayedCars.map((car) => (
                  <div key={car.id} className="card-hover bg-white rounded-xl overflow-hidden shadow-lg flex flex-col border border-blue-100 hover:border-blue-300">
                    <div className="h-48 w-full relative">
                      <Image src={car.imageUrl || "/default-car.jpg"} alt={car.name} fill className="object-cover" />
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        جديد
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {car.brand === 'toyota' ? 'تويوتا' :
                           car.brand === 'honda' ? 'هوندا' :
                           car.brand === 'nissan' ? 'نيسان' :
                           car.brand === 'bmw' ? 'بي إم دبليو' :
                           car.brand === 'mercedes' ? 'مرسيدس' :
                           car.brand === 'audi' ? 'أودي' :
                           car.brand === 'lexus' ? 'لكزس' :
                           car.brand === 'hyundai' ? 'هيونداي' :
                           car.brand === 'kia' ? 'كيا' :
                           car.brand === 'ford' ? 'فورد' :
                           car.brand === 'chevrolet' ? 'شيفروليه' :
                           car.brand === 'tesla' ? 'تسلا' :
                           car.brand === 'landrover' ? 'لاند روفر' :
                           car.brand === 'cadillac' ? 'كاديلاك' :
                           car.brand === 'volkswagen' ? 'فولكسفاغن' :
                           car.brand === 'volvo' ? 'فولفو' :
                           car.brand === 'infiniti' ? 'إنفينيتي' :
                           car.brand === 'jaguar' ? 'جاكوار' :
                           car.brand === 'porsche' ? 'بورش' :
                           car.brand === 'maserati' ? 'مازيراتي' :
                           car.brand === 'ferrari' ? 'فيراري' :
                           car.brand === 'lamborghini' ? 'لامبورغيني' :
                           car.brand === 'bentley' ? 'بنتلي' :
                           car.brand === 'rollsroyce' ? 'رولز رويس' :
                           car.brand === 'jeep' ? 'جيب' :
                           car.brand === 'mitsubishi' ? 'ميتسوبيشي' :
                           car.brand === 'mazda' ? 'مازدا' :
                           car.brand === 'subaru' ? 'سوبارو' :
                           car.brand === 'suzuki' ? 'سوزوكي' :
                           car.brand === 'isuzu' ? 'إيسوزو' :
                           car.brand === 'gmc' ? 'جي إم سي' :
                           car.brand === 'buick' ? 'بيوك' :
                           car.brand === 'lincoln' ? 'لينكولن' :
                           car.brand === 'acura' ? 'أكورا' :
                           car.brand === 'genesis' ? 'جينيسيس' :
                           car.brand === 'mini' ? 'ميني' :
                           car.brand === 'fiat' ? 'فيات' :
                           car.brand === 'alfa' ? 'ألفا روميو' :
                           car.brand === 'peugeot' ? 'بيجو' :
                           car.brand === 'renault' ? 'رينو' :
                           car.brand === 'citroen' ? 'ستروين' :
                           car.brand === 'skoda' ? 'سكودا' :
                           car.brand === 'seat' ? 'سيات' :
                           car.brand === 'opel' ? 'أوبل' :
                           car.brand === 'saab' ? 'ساب' :
                           car.brand === 'dacia' ? 'داسيا' :
                           car.brand === 'lada' ? 'لادا' :
                           car.brand === 'geely' ? 'جيلي' :
                           car.brand === 'chery' ? 'شيري' :
                           car.brand === 'byd' ? 'بي واي دي' :
                           car.brand === 'great wall' ? 'جريت وول' :
                           car.brand === 'mg' ? 'إم جي' :
                           car.brand === 'haval' ? 'هافال' :
                           car.brand === 'changan' ? 'تشانجان' :
                           car.brand === 'dongfeng' ? 'دونغ فينغ' :
                           car.brand === 'gac' ? 'جي إيه سي' :
                           car.brand === 'lynk' ? 'لينك آند كو' :
                           car.brand === 'wuling' ? 'وولينغ' :
                           'علامة تجارية غير معروفة'}
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {car.price.toLocaleString()} ريال
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{car.name}</h3>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center text-gray-600">
                          <i className="fas fa-calendar text-gray-400 ml-2"></i>
                          سنة: {car.year}
                        </li>
                        <li className="flex items-center text-gray-600">
                          <i className="fas fa-gas-pump text-gray-400 ml-2"></i>
                          نوع الوقود: {car.fuelType === 'gasoline' ? 'بنزين' : 
                           car.fuelType === 'diesel' ? 'ديزل' : 
                           car.fuelType === 'hybrid' ? 'هجين' : 
                           car.fuelType === 'electric' ? 'كهربائي' : car.fuelType || 'غير محدد'}
                        </li>
                        <li className="flex items-center text-gray-600">
                          <i className="fas fa-cog text-gray-400 ml-2"></i>
                          ناقل الحركة: {car.transmission === 'automatic' ? 'أوتوماتيك' : 
                           car.transmission === 'manual' ? 'يدوي' : car.transmission || 'غير محدد'}
                        </li>
                        <li className="flex items-center text-gray-600">
                          <i className="fas fa-tint text-gray-400 ml-2"></i>
                          اللون: {car.color || 'غير محدد'}
                        </li>
                      </ul>
                      <div className="flex gap-3 mt-auto">
                        <a href={`/cars/${car.id}`} className="btn-primary flex-1 text-sm">عرض التفاصيل</a>
                        <button className="btn-secondary text-sm">احجز الآن</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* عرض جميع السيارات */}
              <div className="text-center mt-12">
                <a href="/cars" className="btn-primary inline-block px-12 py-4 text-lg">
                  <i className="fas fa-arrow-left ml-2"></i>
                  عرض جميع السيارات
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">
                <i className="fas fa-car"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">لا توجد سيارات حالياً</h3>
              <p className="text-gray-500 mb-6">سيتم إضافة سيارات جديدة قريباً</p>
              <a href="/cars" className="btn-primary inline-block">
                تصفح جميع السيارات
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
            آراء عملائنا
          </h2>
            <p className="text-gray-600 text-lg">ماذا يقول عملاؤنا عنا</p>
          </div>
          
          {/* Desktop: Three Testimonials Grid */}
          <div className="hidden lg:block">
            <div className="relative max-w-6xl mx-auto">
              {/* Three Testimonials Display */}
              <div className="grid grid-cols-3 gap-8">
                {[0, 1, 2].map((offset) => {
                  const index = (currentTestimonial + offset) % testimonials.length;
                  const testimonial = testimonials[index];
                  return (
                    <div key={index} className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100 relative overflow-hidden transform transition-all duration-500 hover:scale-105">
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -translate-y-12 translate-x-12"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-50 rounded-full translate-y-8 -translate-x-8"></div>
                      
                      {/* Quote Icon */}
                      <div className="absolute top-6 right-6 text-blue-200 text-4xl">
                        <i className="fas fa-quote-right"></i>
                      </div>
                      
                      {/* Testimonial Content */}
                      <div className="relative z-10 text-center">
                        {/* Rating Stars */}
                        <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas fa-star text-xl mx-1 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                          ))}
                        </div>
                        
                        {/* Comment */}
                        <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
                          "{testimonial.comment}"
                        </p>
                        
                        {/* Customer Info */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="font-bold text-blue-800 text-lg mb-1">{testimonial.name}</div>
                          <div className="text-gray-500 text-sm">اشترى {testimonial.car}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <i className="fas fa-chevron-right text-blue-600 text-xl"></i>
              </button>
              
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <i className="fas fa-chevron-left text-blue-600 text-xl"></i>
              </button>
              
              {/* Auto-play Toggle */}
              <div className="absolute top-4 left-4">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isAutoPlaying 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                  }`}
                  title={isAutoPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل التلقائي'}
                >
                  <i className={`fas ${isAutoPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                </button>
              </div>
              
              {/* Testimonial Counter */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-600">
                {currentTestimonial + 1} / {testimonials.length}
              </div>
            </div>
          </div>
          
          {/* Mobile: Single Testimonial */}
          <div className="lg:hidden">
            <div className="relative max-w-4xl mx-auto">
              {/* Main Testimonial Display */}
              <div className="bg-white p-12 rounded-3xl shadow-2xl border border-blue-100 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full translate-y-12 -translate-x-12"></div>
                
                {/* Quote Icon */}
                <div className="absolute top-8 right-8 text-blue-200 text-6xl">
                  <i className="fas fa-quote-right"></i>
                </div>
                
                {/* Testimonial Content */}
                <div className="relative z-10 text-center">
                  {/* Rating Stars */}
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star text-3xl mx-1 ${i < testimonials[currentTestimonial].rating ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                    ))}
                  </div>
                  
                  {/* Comment */}
                  <p className="text-gray-700 text-xl md:text-2xl italic mb-8 leading-relaxed">
                    "{testimonials[currentTestimonial].comment}"
                  </p>
                  
                  {/* Customer Info */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="font-bold text-blue-800 text-xl mb-2">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-500 text-lg">اشترى {testimonials[currentTestimonial].car}</div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center mt-8 space-x-3 space-x-reverse">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-blue-600 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <i className="fas fa-chevron-right text-blue-600 text-xl"></i>
              </button>
              
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 border border-gray-200"
              >
                <i className="fas fa-chevron-left text-blue-600 text-xl"></i>
              </button>
              
              {/* Auto-play Toggle */}
              <div className="absolute top-4 left-4">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    isAutoPlaying 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                  }`}
                  title={isAutoPlaying ? 'إيقاف التشغيل التلقائي' : 'تشغيل التلقائي'}
                >
                  <i className={`fas ${isAutoPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                </button>
              </div>
              
              {/* Testimonial Counter */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-600">
                {currentTestimonial + 1} / {testimonials.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            لماذا تختارنا؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center card-hover p-8 rounded-2xl">
              <div className="text-6xl mb-6 text-blue-600">
                <i className="fas fa-trophy"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">جودة عالية</h3>
              <p className="text-gray-600 leading-relaxed">نقدم أفضل السيارات من أشهر الماركات العالمية مع ضمان الجودة</p>
            </div>
            <div className="text-center card-hover p-8 rounded-2xl">
              <div className="text-6xl mb-6 text-green-600">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">أسعار تنافسية</h3>
              <p className="text-gray-600 leading-relaxed">أفضل الأسعار في السوق مع عروض وخصومات حصرية</p>
            </div>
            <div className="text-center card-hover p-8 rounded-2xl">
              <div className="text-6xl mb-6 text-purple-600">
                <i className="fas fa-tools"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">خدمة ما بعد البيع</h3>
              <p className="text-gray-600 leading-relaxed">خدمة عملاء متميزة وصيانة دورية لجميع السيارات</p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="gradient-bg text-white section-padding">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">جاهز لشراء سيارتك المفضلة؟</h2>
          <p className="text-xl mb-8 opacity-90">
            تواصل معنا الآن واحصل على أفضل العروض والخصومات
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4">اتصل بنا الآن</button>
            <button className="btn-secondary text-lg px-8 py-4">احجز موعد</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <i className="fas fa-car text-blue-600 ml-2"></i>
                موقع السيارات المتميز
              </h3>
              <p className="text-gray-400 mb-6">
                أفضل موقع لبيع وشراء السيارات في الشرق الأوسط
              </p>
              
              {/* Social Media */}
              <div>
                <h4 className="text-lg font-semibold mb-6 text-center">تابعنا على</h4>
                <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                  <a href="#" className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <i className="fab fa-facebook-f text-white text-xl group-hover:scale-110 transition-transform duration-300"></i>
                  </a>
                  <a href="#" className="group bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <i className="fab fa-twitter text-white text-xl group-hover:scale-110 transition-transform duration-300"></i>
                  </a>
                  <a href="#" className="group bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <i className="fab fa-instagram text-white text-xl group-hover:scale-110 transition-transform duration-300"></i>
                  </a>
                  <a href="#" className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <i className="fab fa-youtube text-white text-xl group-hover:scale-110 transition-transform duration-300"></i>
                  </a>
                  <a href="#" className="group bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <i className="fab fa-linkedin-in text-white text-xl group-hover:scale-110 transition-transform duration-300"></i>
                  </a>
                  <a href="#" className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                    <i className="fab fa-whatsapp text-white text-xl group-hover:scale-110 transition-transform duration-300"></i>
                  </a>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">تواصل معنا على جميع المنصات</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-angle-left mr-2"></i>
                  السيارات الجديدة
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-angle-left mr-2"></i>
                  السيارات المستعملة
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-angle-left mr-2"></i>
                  خدمات التمويل
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-angle-left mr-2"></i>
                  الصيانة
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-angle-left mr-2"></i>
                  تقييم السيارات
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-angle-left mr-2"></i>
                  تأمين السيارات
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-angle-left mr-2"></i>
                  شحن السيارات
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center">
                  <i className="fas fa-angle-left mr-2"></i>
                  استشارات مجانية
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">معلومات التواصل</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center">
                  <i className="fas fa-phone text-blue-500 mr-3"></i>
                  <p>+966 50 123 4567</p>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope text-blue-500 mr-3"></i>
                  <p>info@carsite.com</p>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-blue-500 mr-3"></i>
                  <p>الرياض، المملكة العربية السعودية</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-right">
                © 2024 موقع السيارات المتميز. جميع الحقوق محفوظة
              </p>
              <div className="flex items-center space-x-6 space-x-reverse mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">الشروط والأحكام</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">اتفاقية الاستخدام</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
