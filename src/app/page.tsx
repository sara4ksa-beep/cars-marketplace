'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import CarSkeleton from './components/CarSkeleton';
import AuctionBadge from './components/AuctionBadge';
import { SaleType } from '@prisma/client';

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
  saleType?: 'DIRECT_SALE' | 'AUCTION';
  currentBid?: number | null;
  auctionEndDate?: string | null;
  isActiveAuction?: boolean;
  bidCount?: number;
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

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

  // عرض جميع السيارات (بما في ذلك المزادات)
  const displayedCars = cars;

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] md:min-h-screen flex items-center overflow-hidden">
        {/* Car Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/mercc.jpg" 
            alt="Hero Car Background" 
            fill 
            className="object-cover w-full h-full"
            style={{ 
              objectPosition: 'center center'
            }}
            priority
            sizes="100vw"
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
        

        {/* Main Content */}
        <div className="container-custom relative z-10 text-white py-4 md:py-16">
          <div className="max-w-5xl mx-auto text-center space-y-3 md:space-y-6 lg:space-y-10 -mt-8 md:-mt-12 lg:-mt-16">
            
            {/* Welcome Text */}
            <div className="space-y-3 md:space-y-4 lg:space-y-6 animate-fade-in">
              
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white text-shadow-glow animate-slide-up px-2">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  اعثر على سيارة احلامك
                </span>
              </h1>
              
              <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-4xl mx-auto animate-slide-up-delayed font-medium px-4">
                <span className="hidden sm:inline">أفضل مجموعة سيارات فاخرة واقتصادية في الشرق الأوسط مع خدمة متميزة وضمان شامل</span>
                <span className="sm:hidden">أفضل السيارات في الشرق الأوسط</span>
              </p>
            </div>


            {/* Action Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row justify-center animate-fade-in-delayed gap-3 sm:gap-4 md:gap-6 px-4">
              <a href="/cars" className="bg-white text-blue-600 rounded-xl md:rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 hover:-translate-y-1 py-4 sm:py-5 px-6 sm:px-8 text-sm sm:text-base md:text-lg touch-target">
                <i className="fas fa-car ml-2"></i>
                <span className="hidden sm:inline">تصفح السيارات</span>
                <span className="sm:hidden">السيارات</span>
              </a>
              <a href="/sell-car" className="bg-blue-600 text-white rounded-xl md:rounded-2xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 hover:-translate-y-1 py-4 sm:py-5 px-6 sm:px-8 text-sm sm:text-base md:text-lg touch-target">
                <i className="fas fa-plus-circle ml-2"></i>
                <span>أضف سيارتك</span>
              </a>
            </div>
          </div>
        </div>
        

      </section>

      {/* Cars Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {[...Array(8)].map((_, index) => (
                <CarSkeleton key={index} />
              ))}
            </div>
          ) : displayedCars.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                {displayedCars.map((car) => {
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
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">{car.name}</h3>
                        <div className={`font-bold text-base sm:text-lg md:text-xl mb-2 ${isAuction ? 'text-orange-600' : 'text-green-600'}`}>
                          {displayPrice.toLocaleString()} ريال
                        </div>
                        
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
      <Footer />
    </div>
  );
}
