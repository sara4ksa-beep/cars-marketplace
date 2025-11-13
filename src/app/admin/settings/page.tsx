'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'موقع السيارات',
    siteDescription: 'أفضل موقع لبيع وشراء السيارات',
    emailNotifications: true,
    autoApproveCars: false,
    maintenanceMode: false,
  });

  useEffect(() => {
    fetchAdmin();
    // In a real app, you would fetch settings from an API
  }, []);

  const fetchAdmin = async () => {
    try {
      const response = await fetch('/api/admin/verify');
      const data = await response.json();
      if (data.success) {
        setAdmin(data.admin);
      }
    } catch (error) {
      console.error('Error fetching admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // In a real app, you would save settings to an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('حدث خطأ في الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">الإعدادات العامة</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الموقع
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الموقع
              </label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">إعدادات الإشعارات</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="mr-2 text-sm text-gray-700">
                تفعيل إشعارات البريد الإلكتروني
              </label>
            </div>
          </div>
        </div>

        {/* Car Approval Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">إعدادات الموافقة على السيارات</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="autoApproveCars"
                checked={settings.autoApproveCars}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="mr-2 text-sm text-gray-700">
                الموافقة التلقائية على السيارات
              </label>
            </div>
            <p className="text-xs text-gray-500">
              عند تفعيل هذا الخيار، سيتم الموافقة تلقائياً على جميع السيارات المضافة
            </p>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">إعدادات النظام</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="mr-2 text-sm text-gray-700">
                وضع الصيانة
              </label>
            </div>
            <p className="text-xs text-gray-500">
              عند تفعيل وضع الصيانة، لن يتمكن المستخدمون من الوصول إلى الموقع
            </p>
          </div>
        </div>

        {/* Admin Info */}
        {admin && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">معلومات المشرف</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">الاسم:</span>
                <span className="text-gray-900">{admin.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">البريد الإلكتروني:</span>
                <span className="text-gray-900">{admin.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">الدور:</span>
                <span className="text-gray-900">مشرف</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <i className="fas fa-save"></i>
              <span>حفظ الإعدادات</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}


