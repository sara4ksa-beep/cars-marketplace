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
    // Poll for updates every 2 seconds
    const interval = setInterval(fetchAuction, 2000);
    return () => clearInterval(interval);
  }, [auctionId]);

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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">جاري تحميل المزاد...</p>
          </div>
        </div>
      </div>
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
              onClick={() => router.push('/auctions')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              العودة إلى المزادات
            </button>
          </div>
        </div>
      </div>
    );
  }

  const minBid = (auction.currentBid || auction.price) + auction.bidIncrement;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <AuctionBadge saleType={SaleType.AUCTION} isActive={auction.isActiveAuction} />
            <button
              onClick={() => router.push('/auctions')}
              className="bg-white/20 hover:bg-white/30 px-5 py-2.5 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-md hover:shadow-lg touch-target"
            >
              <i className="fas fa-arrow-right ml-2"></i>
              العودة
            </button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{auction.name}</h1>
          <p className="text-lg text-orange-100 mb-6">
            {getBrandName(auction.brand)} • {auction.year}
          </p>

          {auction.isActiveAuction && auction.auctionEndDate && (
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/30 shadow-xl">
              <div className="text-center mb-4">
                <p className="text-sm text-orange-100 mb-3 font-semibold">الوقت المتبقي</p>
                <AuctionTimer endDate={auction.auctionEndDate} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-modern bg-white/20 backdrop-blur-md border-white/30 p-5 text-center">
              <p className="text-sm text-orange-100 mb-3 font-semibold">السعر الحالي</p>
              <p className="text-3xl font-bold text-white">
                {(auction.currentBid || auction.price).toLocaleString()} ريال
              </p>
            </div>
            <div className="card-modern bg-white/20 backdrop-blur-md border-white/30 p-5 text-center">
              <p className="text-sm text-orange-100 mb-3 font-semibold">عدد المزايدات</p>
              <p className="text-3xl font-bold text-white">{auction.bidCount}</p>
            </div>
            {auction.reservePrice && (
              <div className="card-modern bg-white/20 backdrop-blur-md border-white/30 p-5 text-center">
                <p className="text-sm text-orange-100 mb-3 font-semibold">السعر الأدنى</p>
                <p className="text-3xl font-bold text-white">
                  {auction.reservePrice.toLocaleString()} ريال
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Images */}
              <div className="card-modern overflow-hidden">
                <div className="card-image-wrapper">
                  <Image
                    src={auction.imageUrl || '/default-car.jpg'}
                    alt={auction.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
                {auction.images && auction.images.length > 1 && (
                  <div className="p-4 grid grid-cols-4 gap-3">
                    {auction.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="h-24 relative rounded-xl overflow-hidden group cursor-pointer hover:ring-2 ring-orange-500 transition-all">
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
                )}
              </div>

              {/* Car Details */}
              <div className="card-modern p-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">تفاصيل السيارة</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <p className="text-gray-600 text-sm mb-1 font-medium">الماركة</p>
                    <p className="font-bold text-gray-800">{getBrandName(auction.brand)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <p className="text-gray-600 text-sm mb-1 font-medium">سنة الصنع</p>
                    <p className="font-bold text-gray-800">{auction.year}</p>
                  </div>
                  {auction.mileage && (
                    <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600 text-sm mb-1 font-medium">المسافة المقطوعة</p>
                      <p className="font-bold text-gray-800">{auction.mileage.toLocaleString()} كم</p>
                    </div>
                  )}
                  {auction.fuelType && (
                    <div className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <p className="text-gray-600 text-sm mb-1 font-medium">نوع الوقود</p>
                      <p className="font-bold text-gray-800">{auction.fuelType}</p>
                    </div>
                  )}
                </div>
                {auction.description && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 text-sm mb-2 font-medium">الوصف</p>
                    <p className="text-gray-800 leading-relaxed">{auction.description}</p>
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
              ) : (
                <div className="card-modern p-8 text-center">
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
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

