import React from 'react'
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

const PharmacyCard = ({ pharmacy }) => {
  const { t } = useTranslation();

  // Only show medication status if we're specifically looking for a medication
  // Otherwise, just show that the pharmacy exists (don't show stock status)
  const hasMedication = pharmacy.hasRequestedMedication !== undefined ? pharmacy.hasRequestedMedication : undefined;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-800">{pharmacy.name}</h3>
        <div className="flex flex-col items-end space-y-1">
          <div className="bg-primary text-white px-2 py-1 rounded-full text-sm">
            ★ {pharmacy.rating}
          </div>
          {hasMedication !== undefined && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${hasMedication ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {hasMedication ? t('inventoryManager.inStock') : t('inventoryManager.outOfStock')}
            </div>
          )}
        </div>
      </div>
      
      <p className="text-gray-600 mb-3">{pharmacy.address}</p>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          {pharmacy.distance ? (
            <span className="font-medium">{pharmacy.distance.toFixed(2)} km</span>
          ) : (
            <span className="font-medium">Distance not available</span>
          )} away
        </div>
        <Link
          to={`/pharmacy/${pharmacy.id}`}
          state={{ pharmacy: pharmacy }}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default PharmacyCard