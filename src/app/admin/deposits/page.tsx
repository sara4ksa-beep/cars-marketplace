'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface BidDeposit {
  id: number;
  userId: number;
  carId: number;
  amount: number;
  tapChargeId: string | null;
  tapPaymentId: string | null;
  refundId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  car: {
    id: number;
    name: string;
    brand: string;
  };
}

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<BidDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDeposits();
  }, [filterStatus]);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      
      const response = await fetch(`/api/admin/deposits?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch (error) {
      console.error('Error fetching deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (depositId: number) => {
    if (!confirm('هل أنت متأكد من استرداد هذا التأكيد؟')) {
      return;
    }

    try {
      setActionLoading(depositId);
      const response = await fetch('/api/payments/refund-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ depositId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('تم استرداد التأكيد بنجاح');
        fetchDeposits();
      } else {
        alert('حدث خطأ: ' + data.error);
      }
    } catch (error) {
      console.error('Error refunding deposit:', error);
      alert('حدث خطأ في الاسترداد');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { text: string; color: string } } = {
      'PENDING': { text: 'في الانتظار', color: 'bg-yellow-500' },
      'PAID': { text: 'مدفوع', color: 'bg-green-500' },
      'REFUNDED': { text: 'مسترد', color: 'bg-blue-500' },
      'APPLIED_TO_PURCHASE': { text: 'مطبق على الشراء', color: 'bg-purple-500' },
    };
    
    const statusInfo = statusMap[status] || { text: status, color: 'bg-gray-500' };
    
    return (
      <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
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
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">إدارة تأكيدات المزايدة</h1>
        <p className="text-gray-600 mt-1">عرض وإدارة جميع تأكيدات المزايدة (200 ريال)</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">فلترة حسب الحالة:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">الكل</option>
            <option value="PENDING">في الانتظار</option>
            <option value="PAID">مدفوع</option>
            <option value="REFUNDED">مسترد</option>
            <option value="APPLIED_TO_PURCHASE">مطبق على الشراء</option>
          </select>
          
          <button
            onClick={fetchDeposits}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt ${loading ? 'animate-spin' : ''}`}></i>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل البيانات...</p>
            </div>
          </div>
        ) : deposits.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-wallet text-gray-400 text-4xl mb-4"></i>
            <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد تأكيدات</h3>
            <p className="text-gray-600">لم يتم العثور على أي تأكيدات</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السيارة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ الإنشاء
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      معرف الدفع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deposits.map((deposit) => (
                    <tr key={deposit.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{deposit.user.name}</div>
                        <div className="text-xs text-gray-500">{deposit.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{deposit.car.name}</div>
                        <div className="text-xs text-gray-500">{deposit.car.brand}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {deposit.amount.toLocaleString()} ريال
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(deposit.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{formatDate(deposit.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-500">
                          {deposit.tapChargeId ? (
                            <span title={deposit.tapChargeId}>
                              {deposit.tapChargeId.substring(0, 20)}...
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                        {deposit.refundId && (
                          <div className="text-xs text-blue-500 mt-1">
                            استرداد: {deposit.refundId.substring(0, 20)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {deposit.status === 'PAID' && (
                          <button
                            onClick={() => handleRefund(deposit.id)}
                            disabled={actionLoading === deposit.id}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded disabled:opacity-50"
                            title="استرداد"
                          >
                            {actionLoading === deposit.id ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-undo"></i>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => router.push(`/admin/cars/${deposit.carId}`)}
                          className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded"
                          title="عرض السيارة"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

