import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

const MedicationCard = ({ medication }) => {
  const { addToCart } = useContext(AppContext);
  const { t, language } = useTranslation();
  
  // Determine stock status color
 const getStockStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
 // Get stock status text based on language
 const getStockStatusText = (status) => {
    switch (status) {
      case 'in_stock': return t('inventoryManager.inStock');
      case 'low_stock': return t('inventoryManager.lowStock');
      case 'out_of_stock': return t('inventoryManager.outOfStock');
      default: return t('inventoryManager.stockStatus');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{medication.name}</h3>
          <div className="flex flex-col items-end space-y-1">
            {medication.featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                {t('medicationCard.featured')}
              </span>
            )}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(medication.stockStatus)}`}>
              {getStockStatusText(medication.stockStatus)}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-2">{medication.genericName}</p>
        <p className="text-gray-500 text-sm mb-4">{medication.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-primary">${medication.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">
            {t('medicationCard.expires')}: {new Date(medication.expiryDate).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {t('medicationCard.availableAt')} {medication.pharmaciesCount || 0} {t('medicationCard.pharmacies')}
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={() => addToCart(medication)}
              className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark transition-colors text-sm"
            >
              {t('inventoryManager.addToCart')}
            </button>
            <Link
              to={`/pharmacies?medication=${medication.id}&name=${encodeURIComponent(medication.name)}`}
              className="border border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-white transition-colors text-sm"
            >
              {t('medicationCard.findPharmacies')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicationCard;