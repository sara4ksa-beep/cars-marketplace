'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/Header';
import AuctionTimer from '../../components/AuctionTimer';
import BidForm from '../../components/BidForm';
import BidHistory from '../../components/BidHistory';
import AuctionBadge from '../../components/AuctionBadge';
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

  const getBrandName = (brand: string) => {
    const brandMap: { [key: string]: string } = {
      toyota: 'تويوتا',
      honda: 'هوندا',
      nissan: 'نيسان',
      bmw: 'بي إم دبليو',
      mercedes: 'مرسيدس',
      audi: 'أودي',
    };
    return brandMap[brand] || brand;
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block relative mb-6">
              <div className="animate-spin rounded-full h-24 w-24 border-4 border-orange-200 border-t-orange-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-gavel text-orange-600 text-3xl"></i>
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium">جاري تحميل المزاد...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="min-h-screen relative">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-block bg-gradient-to-br from-red-100 to-orange-100 rounded-full p-8 mb-6">
              <i className="fas fa-exclamation-triangle text-6xl text-red-500"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">خطأ</h1>
            <p className="text-gray-600 mb-8 text-lg">{error || 'لم يتم العثور على المزاد'}</p>
            <button
              onClick={() => router.push('/cars')}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <i className="fas fa-arrow-right ml-2"></i>
              العودة إلى السيارات
            </button>
          </div>
        </div>
      </div>
    );
  }

  const minBid = (auction.currentBid || auction.price) + auction.bidIncrement;

  return (
    <div className="min-h-screen relative">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 md:py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <AuctionBadge saleType={SaleType.AUCTION} isActive={auction.isActiveAuction} />
            <button
              onClick={() => router.push('/cars')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-300 border border-white/30"
            >
              <i className="fas fa-arrow-right ml-2"></i>
              العودة للسيارات
            </button>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              {auction.name}
            </h1>
            <p className="text-sm md:text-xl text-blue-100 mb-6 md:mb-8 flex items-center justify-center">
              <i className="fas fa-car ml-3"></i>
              {getBrandName(auction.brand)} • {auction.year}
            </p>

            {auction.auctionEndDate && (
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border border-white/30">
                <div className="text-center">
                  <p className="text-sm md:text-base text-blue-100 mb-4 flex items-center justify-center">
                    <i className="fas fa-clock ml-2"></i>
                    {auction.isActiveAuction ? 'الوقت المتبقي للمزاد' : auction.hasEnded ? 'انتهى المزاد' : 'يبدأ المزاد خلال'}
                  </p>
                  <AuctionTimer 
                    endDate={auction.auctionEndDate} 
                    startDate={auction.auctionStartDate}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 md:p-6 text-center border border-white/30">
                <div className="mb-2 md:mb-3">
                  <i className="fas fa-tag text-2xl md:text-3xl text-blue-200"></i>
                </div>
                <p className="text-xs md:text-sm text-blue-100 mb-2 md:mb-3 font-semibold">السعر الحالي</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  {(auction.currentBid || auction.price).toLocaleString()}
                </p>
                <p className="text-xs md:text-sm text-blue-200 mt-1">ريال</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 md:p-6 text-center border border-white/30">
                <div className="mb-2 md:mb-3">
                  <i className="fas fa-gavel text-2xl md:text-3xl text-blue-200"></i>
                </div>
                <p className="text-xs md:text-sm text-blue-100 mb-2 md:mb-3 font-semibold">عدد المزايدات</p>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{auction.bidCount}</p>
                <p className="text-xs md:text-sm text-blue-200 mt-1">مزايدة</p>
              </div>
              {auction.reservePrice && (
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 md:p-6 text-center border border-white/30">
                  <div className="mb-2 md:mb-3">
                    <i className="fas fa-lock text-2xl md:text-3xl text-blue-200"></i>
                  </div>
                  <p className="text-xs md:text-sm text-blue-100 mb-2 md:mb-3 font-semibold">السعر الأدنى</p>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                    {auction.reservePrice.toLocaleString()}
                  </p>
                  <p className="text-xs md:text-sm text-blue-200 mt-1">ريال</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Images */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-80 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200">
                <Image
                  src={auction.imageUrl || '/default-car.jpg'}
                  alt={auction.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority
                />
                {auction.isActiveAuction && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    مزاد نشط
                  </div>
                )}
              </div>
              {auction.images && auction.images.length > 1 && (
                <div className="p-4 md:p-6 bg-gray-50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">صور إضافية</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {auction.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="h-24 md:h-32 relative rounded-xl overflow-hidden group cursor-pointer hover:ring-2 ring-orange-500 transition-all shadow-md hover:shadow-xl">
                        <Image
                          src={image}
                          alt={`${auction.name} ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 25vw, 16vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-info-circle text-orange-600 ml-3"></i>
                تفاصيل السيارة
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-300">
                  <p className="text-gray-600 text-sm mb-2 font-medium flex items-center">
                    <i className="fas fa-car text-orange-500 ml-2"></i>
                    الماركة
                  </p>
                  <p className="font-bold text-gray-800 text-lg">{getBrandName(auction.brand)}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                  <p className="text-gray-600 text-sm mb-2 font-medium flex items-center">
                    <i className="fas fa-calendar text-blue-500 ml-2"></i>
                    سنة الصنع
                  </p>
                  <p className="font-bold text-gray-800 text-lg">{auction.year}</p>
                </div>
                {auction.mileage && (
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                    <p className="text-gray-600 text-sm mb-2 font-medium flex items-center">
                      <i className="fas fa-tachometer-alt text-green-500 ml-2"></i>
                      المسافة المقطوعة
                    </p>
                    <p className="font-bold text-gray-800 text-lg">{auction.mileage.toLocaleString()} كم</p>
                  </div>
                )}
                {auction.fuelType && (
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
                    <p className="text-gray-600 text-sm mb-2 font-medium flex items-center">
                      <i className="fas fa-gas-pump text-purple-500 ml-2"></i>
                      نوع الوقود
                    </p>
                    <p className="font-bold text-gray-800 text-lg">{auction.fuelType}</p>
                  </div>
                )}
              </div>
              {auction.description && (
                <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-gray-700 text-sm mb-3 font-bold flex items-center">
                    <i className="fas fa-file-alt text-gray-500 ml-2"></i>
                    الوصف
                  </p>
                  <p className="text-gray-800 leading-relaxed text-base">{auction.description}</p>
                </div>
              )}
            </div>

            {/* Bid History */}
            <BidHistory bids={auction.recentBids || []} />
          </div>

          {/* Right Column - Bidding */}
          <div className="space-y-6">
              {auction.isActiveAuction ? (
                <BidForm
                  carId={auction.id}
                  currentBid={auction.currentBid || auction.price}
                  bidIncrement={auction.bidIncrement}
                  minBid={minBid}
                  onBidPlaced={handleBidPlaced}
                  userId={userId || undefined}
                />
              ) : auction.hasEnded ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <div className="text-red-600 text-5xl mb-6">
                    <i className="fas fa-times-circle"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">انتهى المزاد</h3>
                  {auction.highestBidder && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-gray-700 font-semibold mb-1">الفائز</p>
                      <p className="text-green-700 font-bold text-lg">{auction.highestBidder.name}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                  <div className="text-blue-600 text-5xl mb-6">
                    <i className="fas fa-hourglass-half"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">لم يبدأ المزاد بعد</h3>
                  <p className="text-gray-600 mb-4">سيبدأ المزاد قريباً</p>
                  {auction.auctionStartDate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-gray-700 font-semibold mb-1">تاريخ البدء</p>
                      <p className="text-blue-700 font-bold text-lg">
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
      </div>
    </div>
  );
}

