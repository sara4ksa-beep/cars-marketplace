'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import AuctionCard from '../components/AuctionCard';
import { SaleType } from '@prisma/client';

interface Auction {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  currentBid: number | null;
  reservePrice: number | null;
  imageUrl: string | null;
  auctionEndDate: string | null;
  bidCount: number;
  isActiveAuction: boolean;
  featured: boolean;
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'ending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAuctions();
    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchAuctions, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/auctions?activeOnly=${filter === 'active'}`
      );
      const data = await response.json();
      if (data.success) {
        let filteredAuctions = data.auctions;

        // Apply filter
        if (filter === 'ending') {
          const now = new Date();
          filteredAuctions = filteredAuctions.filter((auction: Auction) => {
            if (!auction.auctionEndDate) return false;
            const endDate = new Date(auction.auctionEndDate);
            const timeRemaining = endDate.getTime() - now.getTime();
            return timeRemaining > 0 && timeRemaining < 3600000; // Less than 1 hour
          });
        }

        // Apply search
        if (searchTerm) {
          filteredAuctions = filteredAuctions.filter(
            (auction: Auction) =>
              auction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              auction.brand.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setAuctions(filteredAuctions);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <i className="fas fa-gavel ml-2"></i>
            المزادات الحية
          </h1>
          <p className="text-lg md:text-xl text-orange-100 max-w-2xl mx-auto">
            شارك في المزادات وكن الفائز بسيارة أحلامك
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => setFilter('all')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 touch-target ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 touch-target ${
                  filter === 'active'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                نشطة
              </button>
              <button
                onClick={() => setFilter('ending')}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 touch-target ${
                  filter === 'ending'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                تنتهي قريباً
              </button>
            </div>

            <div className="w-full md:w-64 relative">
              <i className="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="ابحث عن مزاد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pr-11"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Auctions Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المزادات...</p>
            </div>
          ) : auctions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">
                <i className="fas fa-gavel"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                لا توجد مزادات حالياً
              </h3>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all'
                  ? 'جرب تغيير البحث أو الفلتر'
                  : 'سيتم إضافة مزادات جديدة قريباً'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  عرض {auctions.length} من {auctions.length} مزاد
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {auctions.map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    id={auction.id}
                    name={auction.name}
                    brand={getBrandName(auction.brand)}
                    year={auction.year}
                    price={auction.price}
                    currentBid={auction.currentBid}
                    reservePrice={auction.reservePrice}
                    imageUrl={auction.imageUrl}
                    auctionEndDate={auction.auctionEndDate}
                    bidCount={auction.bidCount}
                    isActive={auction.isActiveAuction}
                    featured={auction.featured}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

