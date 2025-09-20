'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import BookingForm from '../../components/BookingForm';

interface Car {
  id: number;
  name: string;
  brand: string;
  year: number;
  price: number;
  imageUrl: string | null;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params.id;
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${carId}`);
        const data = await response.json();
        
        if (data.success) {
          setCar(data.car);
        } else {
          setError('لم يتم العثور على السيارة');
        }
      } catch (error) {
        setError('حدث خطأ في تحميل بيانات السيارة');
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarDetails();
    }
  }, [carId]);

  const handleClose = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">جاري تحميل تفاصيل السيارة...</p>
            <p className="text-gray-500 text-sm mt-2">يرجى الانتظار</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">خطأ</h1>
            <p className="text-gray-600 mb-6">{error || 'لم يتم العثور على السيارة'}</p>
            <button 
              onClick={() => router.back()}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BookingForm
        carId={car.id}
        carName={car.name}
        carPrice={car.price}
        onClose={handleClose}
      />
    </div>
  );
}




