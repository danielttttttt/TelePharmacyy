import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import useTranslation from '../../hooks/useTranslation';

const PharmacyDashboard = () => {
  const { user } = useContext(AppContext);
  const { t } = useTranslation();

  if (!user || user.role !== 'pharmacy') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pharmacyDashboard.accessDenied')}</h2>
          <p className="text-gray-600">{t('pharmacyDashboard.noPermission')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('pharmacyDashboard.title')}</h1>
        <div className="flex space-x-4">
          <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
            {t('pharmacyDashboard.manageInventory')}
          </button>
          <button className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-dark transition-colors">
            {t('pharmacyDashboard.viewOrders')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('pharmacyDashboard.totalOrders')}</p>
              <p className="text-2xl font-bold">42</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('pharmacyDashboard.pendingOrders')}</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('pharmacyDashboard.completedOrders')}</p>
              <p className="text-2xl font-bold">34</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('pharmacyDashboard.totalRevenue')}</p>
              <p className="text-2xl font-bold">$2,450.75</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('pharmacyDashboard.topMedications')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-900 mr-4">1.</span>
                <span className="font-medium">Paracetamol</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                120 {t('pharmacyDashboard.sold')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-900 mr-4">2.</span>
                <span className="font-medium">Ibuprofen</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                95 {t('pharmacyDashboard.sold')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-900 mr-4">3.</span>
                <span className="font-medium">Amoxicillin</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                78 {t('pharmacyDashboard.sold')}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('pharmacyDashboard.recentOrders')}</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Order #1001</h3>
                  <p className="text-gray-600 text-sm">John Doe</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$45.99</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {t('pharmacyDashboard.pending')}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500">3 {t('pharmacyDashboard.items')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PharmacyDashboard;