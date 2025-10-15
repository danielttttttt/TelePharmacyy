import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom';
import PharmacyCard from '../components/PharmacyCard'
import Map from '../components/Map'
import { fetchPharmacies, calculateDistance, fetchPharmacyInventory } from '../utils/api'
import useTranslation from '../hooks/useTranslation'

const Pharmacies = () => {
  const [pharmacies, setPharmacies] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationError, setLocationError] = useState(null)
  const [searchParams] = useSearchParams();
  const [medicationId, setMedicationId] = useState(null);
  const [medicationName, setMedicationName] = useState('');
  const { t } = useTranslation()

  // Get medication ID and name from URL parameters
  useEffect(() => {
    const medId = searchParams.get('medication');
    const medName = searchParams.get('name');
    if (medId) {
      setMedicationId(medId);
      setMedicationName(decodeURIComponent(medName || ''));
    }
  }, [searchParams])

  // Get user's current location
  const getUserLocation = useCallback(() => {
    console.log('Getting user location...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User location obtained:', position);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          setLocationError(null)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationError('Unable to get your location. Showing default pharmacies.')
          // Set a default location if geolocation fails
          setUserLocation({ latitude: 9.0300, longitude: 38.7400 })
        }
      )
    } else {
      console.log('Geolocation not supported');
      setLocationError('Geolocation is not supported by your browser. Showing default pharmacies.')
      // Set a default location if geolocation is not supported
      setUserLocation({ latitude: 9.0300, longitude: 38.7400 })
    }
  }, [])

  // Fetch pharmacies based on user location
  const fetchNearbyPharmacies = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch pharmacies based on user location if available
      let fetchedPharmacies = []
      if (userLocation) {
        // Call API with user location - the API will return nearby pharmacies sorted by distance
        console.log('Fetching pharmacies with user location');
        fetchedPharmacies = await fetchPharmacies({
          lat: userLocation.latitude,
          lng: userLocation.longitude
        })
      }
      
      console.log('Fetched pharmacies:', fetchedPharmacies);
      
      // If we have a medication ID, fetch inventory for each pharmacy and filter
      if (medicationId) {
        console.log(`Filtering pharmacies for medication ID: ${medicationId}`);
        const pharmaciesWithMedication = [];
        const allPharmaciesWithInventoryStatus = [];
        
        // Fetch inventory for each pharmacy and check if it has the medication
        for (const pharmacy of fetchedPharmacies) {
          try {
            // Note: In a real app, we'd use the pharmacy's actual ID here
            // For the mock implementation, we'll simulate the inventory
            const inventory = await fetchPharmacyInventory(pharmacy.id);
            const hasMedication = inventory.some(med => med.id === parseInt(medicationId));
            
            // Add inventory to pharmacy object for display
            pharmacy.inventory = inventory;
            pharmacy.hasRequestedMedication = hasMedication;
            
            // Add to appropriate list based on whether it has the medication
            if (hasMedication) {
              pharmaciesWithMedication.push(pharmacy);
            }
            allPharmaciesWithInventoryStatus.push(pharmacy);
          } catch (error) {
            console.error(`Error fetching inventory for pharmacy ${pharmacy.id}:`, error);
            // Add the pharmacy but without inventory info
            pharmacy.inventory = [];
            pharmacy.hasRequestedMedication = false;
            allPharmaciesWithInventoryStatus.push(pharmacy);
          }
        }
        
        // Set pharmacies based on whether they have the medication or not
        // If some pharmacies have the medication, show only those
        // Otherwise, show all pharmacies but indicate which ones don't have it
        if (pharmaciesWithMedication.length > 0) {
          setPharmacies(pharmaciesWithMedication);
        } else {
          // If no pharmacies have the medication, show all pharmacies but with the status
          setPharmacies(allPharmaciesWithInventoryStatus);
        }
      } else {
        setPharmacies(fetchedPharmacies);
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error)
      setPharmacies([]) // Clear pharmacies on error
    } finally {
      setLoading(false)
    }
  }, [userLocation, medicationId])

  // Refresh pharmacies - new function to manually refresh
  const refreshPharmacies = useCallback(() => {
    console.log('Refreshing pharmacies...')
    getUserLocation()
  }, [getUserLocation])

  // Get user location on component mount
  useEffect(() => {
    getUserLocation()
  }, [getUserLocation])

  // Fetch pharmacies when user location changes
  useEffect(() => {
    if (userLocation) {
      fetchNearbyPharmacies()
    }
  }, [userLocation, fetchNearbyPharmacies])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  // Convert pharmacies to map markers
  const pharmacyMarkers = pharmacies.map(pharmacy => {
    // Determine if this pharmacy has the requested medication
    let hasMedication;
    if (medicationId) {
      hasMedication = pharmacy.hasRequestedMedication;
    }
    
    return {
      position: [pharmacy.latitude, pharmacy.longitude],
      popup: {
        title: pharmacy.name,
        address: pharmacy.address,
        rating: pharmacy.rating,
        phone: pharmacy.phone,
        distance: pharmacy.distance ? `${pharmacy.distance.toFixed(2)} km` : null
      },
      hasMedication: hasMedication
    };
  })

  // Calculate center point for map
  const mapCenter = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : (pharmacies.length > 0
      ? [pharmacies[0].latitude, pharmacies[0].longitude]
      : [9.03, 38.74]) // Default to Addis Ababa if no pharmacies

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {medicationId ? `${t('home.pharmaciesWith')} ${medicationName}` : t('home.nearbyPharmacies')}
          </h1>
          <button
            onClick={refreshPharmacies}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors text-sm flex items-center"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        {medicationId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-80 font-medium">
              {t('home.showingPharmaciesWith')} <span className="font-bold">{medicationName}</span>
            </p>
          </div>
        )}
        
        {locationError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p>{locationError}</p>
            <button
              onClick={refreshPharmacies}
              className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
            >
              Try Again
            </button>
          </div>
        )}
        
        <div className="mb-6">
          <input
            type="text"
            placeholder={t('search.placeholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div>
          {/* Map view */}
          <div className="h-96 mb-8">
            <Map center={mapCenter} markers={pharmacyMarkers} />
          </div>
          
          {/* List of pharmacies */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {userLocation ? t('home.nearbyPharmacies') : t('home.browsePharmacies')}
              {userLocation && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  {t('home.within10km')}
                </span>
              )}
            </h2>
            {pharmacies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">{t('home.noPharmaciesFound')}</p>
                <button
                  onClick={refreshPharmacies}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors mr-4"
                >
                  {t('home.tryAgain')}
                </button>
                <a
                  href="/pharmacies"
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors inline-block"
                >
                  {t('home.browseAllPharmacies')}
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pharmacies.map(pharmacy => (
                  <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Pharmacies