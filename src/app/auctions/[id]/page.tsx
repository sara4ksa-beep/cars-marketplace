'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';
import AuctionTimer from '../../components/AuctionTimer';
import BidForm from '../../components/BidForm';
import BidHistory from '../../components/BidHistory';
import AuctionBadge from '../../components/AuctionBadge';
import CarDetailSkeleton from '../../components/CarDetailSkeleton';
import { SaleType } from '@prisma/client';

interface Auction {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  currentBid: number | null;
  reservePrice: number | null;
  bidIncrement: number;
  auctionStartDate: string | null;
  auctionEndDate: string | null;
  imageUrl: string | null;
  images: string[];
  description: string | null;
  mileage: number | null;
  fuelType: string | null;
  transmission: string | null;
  color: string | null;
  isActiveAuction: boolean;
  hasStarted?: boolean;
  hasEnded?: boolean;
  bidCount: number;
  highestBidder: {
    id: number;
    name: string;
  } | null;
  recentBids: any[];
}

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id;
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchAuction();
    checkUserAuth();
    // Poll for updates every 2 seconds
    const interval = setInterval(fetchAuction, 2000);
    return () => clearInterval(interval);
  }, [auctionId]);

  useEffect(() => {
    // Check if payment was successful
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      // Remove query parameter and show success message
      window.history.replaceState({}, '', window.location.pathname);
      // The BidForm component will automatically refresh deposit status
    }
  }, []);

  const checkUserAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      if (data.success && data.user) {
        setUserId(data.user.id);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  };

  const fetchAuction = async () => {
    try {
      const response = await fetch(`/api/auctions/${auctionId}`);
      const data = await response.json();

      if (data.success) {
        setAuction(data.auction);
        setError(null);
      } else {
        setError(data.error || 'لم يتم العثور على المزاد');
      }
    } catch (err: any) {
      setError('حدث خطأ في تحميل بيانات المزاد');
      console.error('Error fetching auction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBidPlaced = () => {
    fetchAuction();
  };

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

  if (loading) {
    return (
      <>
        <Header />
        <CarDetailSkeleton />
      </>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">خطأ</h1>
            <p className="text-gray-600 mb-6">{error || 'لم يتم العثور على المزاد'}</p>
            <button
              onClick={() => router.push('/cars')}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <i className="fas fa-arrow-right ml-2"></i>
              العودة إلى قائمة السيارات
            </button>
          </div>
        </div>
      </div>
    );
  }

  const minBid = (auction.currentBid || auction.price) + auction.bidIncrement;
  const currentBidAmount = auction.currentBid || auction.price;
  const allImages = auction.images && auction.images.length > 0 ? auction.images : (auction.imageUrl ? [auction.imageUrl] : []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Car Details */}
      <section className="py-4 sm:py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-12">
              
              {/* Car Images */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Main Image - Better mobile sizing */}
                <div className="card-modern overflow-hidden">
                  <div 
                    className="card-image-wrapper cursor-pointer group"
                    onClick={() => setSelectedImageIndex(0)}
                  >
                    <Image 
                      src={auction.imageUrl || '/default-car.jpg'} 
                      alt={auction.name} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </div>
                
                {/* Additional Images - Better mobile grid */}
                {allImages.length > 1 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4">صور إضافية</h3>
                    <div className="image-gallery-mobile">
                      {allImages.slice(1).map((image, index) => (
                        <div 
                          key={index} 
                          className="h-20 sm:h-24 md:h-32 relative rounded-lg overflow-hidden group cursor-pointer mobile-image-container"
                          onClick={() => setSelectedImageIndex(index + 1)}
                        >
                          <Image 
                            src={image} 
                            alt={`${auction.name} ${index + 2}`} 
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
                {allImages.length > 1 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4">جميع الصور ({allImages.length})</h3>
                    <div className="image-gallery-mobile">
                      {allImages.map((image, index) => (
                        <div 
                          key={index} 
                          className="h-16 sm:h-20 md:h-24 relative rounded-lg overflow-hidden group cursor-pointer mobile-image-container"
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <Image 
                            src={image} 
                            alt={`${auction.name} ${index + 1}`} 
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
                
                {/* Auction Badge and Timer */}
                {auction.auctionEndDate && (
                  <div className="card-modern p-6 sm:p-8">
                    <div className="text-center mb-4">
                      <AuctionBadge saleType={SaleType.AUCTION} isActive={auction.isActiveAuction} />
                    </div>
                    <div className="text-center mb-6">
                      <p className="text-sm md:text-base text-gray-700 mb-4 flex items-center justify-center">
                        <i className="fas fa-clock ml-2 text-orange-600"></i>
                        {auction.isActiveAuction ? 'الوقت المتبقي للمزاد' : auction.hasEnded ? 'انتهى المزاد' : 'يبدأ المزاد خلال'}
                      </p>
                      <AuctionTimer 
                        endDate={auction.auctionEndDate} 
                        startDate={auction.auctionStartDate}
                      />
                    </div>
                    {auction.reservePrice && (
                      <div className="text-center mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-xs text-gray-600 mb-1">السعر الأدنى</p>
                        <p className="text-lg font-bold text-purple-600">
                          {auction.reservePrice.toLocaleString()} ريال
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Current Bid Section */}
                <div className="card-modern p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-3">
                      {currentBidAmount.toLocaleString()} ريال
                    </div>
                    <p className="text-gray-600 text-base sm:text-lg">السعر الحالي</p>
                    {auction.bidCount > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        <i className="fas fa-gavel ml-1"></i>
                        {auction.bidCount} مزايدة
                      </p>
                    )}
                  </div>
                  
                  {/* Bid Form or Status */}
                  <div className="text-center">
                    {auction.isActiveAuction ? (
                      <BidForm
                        carId={auction.id}
                        currentBid={currentBidAmount}
                        bidIncrement={auction.bidIncrement}
                        minBid={minBid}
                        onBidPlaced={handleBidPlaced}
                        userId={userId || undefined}
                      />
                    ) : auction.hasEnded ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-red-600 text-3xl mb-3">
                          <i className="fas fa-times-circle"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">انتهى المزاد</h3>
                        {auction.highestBidder && (
                          <div className="mt-3">
                            <p className="text-gray-700 font-semibold mb-1">الفائز</p>
                            <p className="text-green-700 font-bold text-lg">{auction.highestBidder.name}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-blue-600 text-3xl mb-3">
                          <i className="fas fa-hourglass-half"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">لم يبدأ المزاد بعد</h3>
                        <p className="text-gray-600 text-sm mb-3">سيبدأ المزاد قريباً</p>
                        {auction.auctionStartDate && (
                          <div className="mt-3">
                            <p className="text-gray-700 font-semibold mb-1 text-sm">تاريخ البدء</p>
                            <p className="text-blue-700 font-bold">
                              {new Date(auction.auctionStartDate).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Car Specifications */}
                <div className="card-modern p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">مواصفات السيارة</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                        <span className="text-gray-600 text-sm sm:text-base font-medium">الماركة</span>
                        <span className="font-bold text-sm sm:text-base text-gray-800">
                          {getBrandName(auction.brand)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                        <span className="text-gray-600 text-sm sm:text-base font-medium">سنة الصنع</span>
                        <span className="font-bold text-sm sm:text-base text-gray-800">{auction.year}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                        <span className="text-gray-600 text-sm sm:text-base font-medium">اللون</span>
                        <span className="font-bold text-sm sm:text-base text-gray-800">
                          {auction.color ? (
                            <span className="flex items-center">
                              <span className="w-4 h-4 rounded-full bg-gray-300 ml-2 border border-gray-400"></span>
                              {auction.color}
                            </span>
                          ) : (
                            'غير محدد'
                          )}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                        <span className="text-gray-600 text-sm sm:text-base font-medium">المسافة المقطوعة</span>
                        <span className="font-bold text-sm sm:text-base text-gray-800">
                          {auction.mileage ? (
                            <span className="flex items-center">
                              <i className="fas fa-tachometer-alt text-blue-500 ml-2 text-sm"></i>
                              {auction.mileage.toLocaleString()} كم
                            </span>
                          ) : (
                            'غير محدد'
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                        <span className="text-gray-600 text-sm sm:text-base font-medium">نوع الوقود</span>
                        <span className="font-bold text-sm sm:text-base text-gray-800">
                          {auction.fuelType === 'gasoline' ? 'بنزين' : 
                           auction.fuelType === 'diesel' ? 'ديزل' : 
                           auction.fuelType === 'hybrid' ? 'هجين' : 
                           auction.fuelType === 'electric' ? 'كهربائي' : 
                           auction.fuelType || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                        <span className="text-gray-600 text-sm sm:text-base font-medium">ناقل الحركة</span>
                        <span className="font-bold text-sm sm:text-base text-gray-800">
                          {auction.transmission === 'automatic' ? 'أوتوماتيك' : 
                           auction.transmission === 'manual' ? 'يدوي' : 
                           auction.transmission || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                        <span className="text-gray-600 text-sm sm:text-base font-medium">الحالة</span>
                        <span className={`badge-modern ${auction.isActiveAuction ? 'badge-success' : auction.hasEnded ? 'badge-error' : 'badge-warning'}`}>
                          {auction.isActiveAuction ? 'مزاد نشط' : auction.hasEnded ? 'انتهى المزاد' : 'لم يبدأ بعد'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Car Description */}
                <div className="card-modern p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-6">وصف السيارة</h3>
                  {auction.description ? (
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg md:text-xl">
                      {auction.description}
                    </p>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <div className="text-gray-400 text-4xl sm:text-5xl mb-4">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <p className="text-gray-600 text-base sm:text-lg">لا يوجد وصف متاح للسيارة</p>
                      <p className="text-gray-500 text-sm sm:text-base mt-2">سيتم إضافة الوصف قريباً</p>
                    </div>
                  )}
                </div>

                {/* Bid History */}
                {auction.recentBids && auction.recentBids.length > 0 && (
                  <BidHistory bids={auction.recentBids} />
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal for Mobile */}
      {selectedImageIndex !== null && auction && allImages.length > 0 && (
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
                src={allImages[selectedImageIndex] || auction.imageUrl || '/default-car.jpg'}
                alt={`${auction.name} ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            
            {/* Navigation arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : (prev || 0) - 1);
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-colors"
                >
                  <i className="fas fa-chevron-right text-lg sm:text-xl"></i>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : (prev || 0) + 1);
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 sm:p-3 transition-colors"
                >
                  <i className="fas fa-chevron-left text-lg sm:text-xl"></i>
                </button>
              </>
            )}
            
            {/* Image counter */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
              {selectedImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
