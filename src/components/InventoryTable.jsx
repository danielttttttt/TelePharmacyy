import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import useTranslation from '../hooks/useTranslation';

const InventoryTable = ({ inventory, onAddToCart }) => {
 const { addToCart } = useContext(AppContext);
 const { t } = useTranslation();

  // Function to determine stock status color
  const getStockStatusColor = (stockStatus) => {
    switch (stockStatus) {
      case 'in_stock':
        return 'bg-green-500';
      case 'low_stock':
        return 'bg-yellow-500';
      case 'out_of_stock':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to determine stock status text
  const getStockStatusText = (stockStatus) => {
    switch (stockStatus) {
      case 'in_stock':
        return t('inventoryManager.inStock');
      case 'low_stock':
        return t('inventoryManager.lowStock');
      case 'out_of_stock':
        return t('inventoryManager.outOfStock');
      default:
        return t('inventoryManager.unknown');
    }
  };

  const handleAddToCart = (medication) => {
    addToCart(medication);
    if (onAddToCart) {
      onAddToCart(medication);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">{t('inventoryManager.medicationName')}</th>
            <th className="py-3 px-4 text-left">{t('inventoryManager.genericName')}</th>
            <th className="py-3 px-4 text-left">{t('inventoryManager.price')}</th>
            <th className="py-3 px-4 text-left">{t('inventoryManager.stockStatus')}</th>
            <th className="py-3 px-4 text-left">{t('inventoryManager.expiryDate')}</th>
            <th className="py-3 px-4 text-left">{t('inventoryManager.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((medication) => (
            <tr key={medication.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-80">{medication.name}</div>
              </td>
              <td className="py-3 px-4 text-gray-600">{medication.genericName}</td>
              <td className="py-3 px-4 font-medium text-primary">${medication.price.toFixed(2)}</td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${getStockStatusColor(medication.stockStatus)}`}></span>
                  <span>{getStockStatusText(medication.stockStatus)}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">{medication.expiryDate}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleAddToCart(medication)}
                  disabled={medication.stockStatus === 'out_of_stock'}
                  className={`px-4 py-2 rounded-md text-white ${
                    medication.stockStatus === 'out_of_stock'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark transition-colors'
                  }`}
                >
                  {t('inventoryManager.addToCart')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;