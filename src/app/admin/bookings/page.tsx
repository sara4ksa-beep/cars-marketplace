'use client';

import { useState, useEffect } from 'react';

interface Booking {
  id: number;
  carId: number;
  carName: string;
  carPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [filterStatus, page]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        status: filterStatus,
      });
      
      const response = await fetch(`/api/bookings?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      setActionLoading(bookingId);
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setBookings(prev => prev.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        ));
        alert(`تم تحديث حالة الطلب إلى ${getStatusText(newStatus)}`);
      } else {
        alert('حدث خطأ: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('حدث خطأ في التحديث');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'في انتظار المراجعة',
      'CONTACTED': 'تم التواصل',
      'APPROVED': 'موافق عليه',
      'REJECTED': 'مرفوض',
      'COMPLETED': 'مكتمل'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'PENDING': 'bg-orange-500',
      'CONTACTED': 'bg-blue-500',
      'APPROVED': 'bg-green-500',
      'REJECTED': 'bg-red-500',
      'COMPLETED': 'bg-purple-500'
    };
    return colorMap[status] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الطلبات</h1>
        
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="PENDING">في الانتظار</option>
            <option value="CONTACTED">تم التواصل</option>
            <option value="APPROVED">موافق عليه</option>
            <option value="REJECTED">مرفوض</option>
            <option value="COMPLETED">مكتمل</option>
          </select>
          
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <i className="fas fa-calendar-check text-blue-500 text-4xl mb-4"></i>
          <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد طلبات حجز</h3>
          <p className="text-gray-600">لم يتم إرسال أي طلبات حجز بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{booking.carName}</h3>
                  <p className="text-sm text-gray-600">طلب رقم: #{booking.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-white text-sm ${getStatusColor(booking.status)}`}>
                  {getStatusText(booking.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">العميل:</p>
                  <p className="text-sm font-medium text-gray-900">{booking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">الهاتف:</p>
                  <p className="text-sm font-medium text-gray-900">{booking.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني:</p>
                  <p className="text-sm font-medium text-gray-900">{booking.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">السعر:</p>
                  <p className="text-sm font-medium text-green-600">{booking.carPrice.toLocaleString()} ريال</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">تاريخ الإنشاء:</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(booking.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">آخر تحديث:</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(booking.updatedAt)}</p>
                </div>
              </div>
              
              {booking.message && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">الرسالة:</p>
                  <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">{booking.message}</p>
                </div>
              )}
              
              <div className="flex gap-2 flex-wrap">
                {booking.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'CONTACTED')}
                      disabled={actionLoading === booking.id}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
                    >
                      تم التواصل
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}
                      disabled={actionLoading === booking.id}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                    >
                      موافق عليه
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                      disabled={actionLoading === booking.id}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
                    >
                      رفض
                    </button>
                  </>
                )}
                
                {booking.status === 'CONTACTED' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'APPROVED')}
                      disabled={actionLoading === booking.id}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                    >
                      موافق عليه
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                      disabled={actionLoading === booking.id}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 text-sm"
                    >
                      مكتمل
                    </button>
                  </>
                )}

                {booking.status === 'APPROVED' && (
                  <button
                    onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                    disabled={actionLoading === booking.id}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 text-sm"
                  >
                    مكتمل
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            السابق
          </button>
          <span className="px-4 py-2 text-gray-700">
            صفحة {page} من {totalPages}
          </span>
          <button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}










