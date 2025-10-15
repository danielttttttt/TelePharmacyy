// src/utils/api.js
// Utility functions for API calls with Firebase Authentication
import { getIdToken } from '../firebase/auth';
import { auth } from '../firebase/firebase';

/**
  * Fetch medications with optional search query and featured filter
  * @param {string} query - Search query for medications
  * @param {boolean} featured - Whether to filter for featured medications only
  * @returns {Promise<Array>} - Promise resolving to array of medications
  */
 export const fetchMedications = async (query = '', featured = false) => {
   try {
     // In production, use mock data or external API directly
     if (process.env.NODE_ENV === 'production') {
       // Load mock medications data
       const medicationsResponse = await fetch('/mock-data/medications.json');
       let medications = await medicationsResponse.json();
       
       // Filter medications based on query if provided
       if (query) {
         medications = medications.filter(medication =>
           medication.name.toLowerCase().includes(query.toLowerCase()) ||
           medication.genericName.toLowerCase().includes(query.toLowerCase())
         );
       }
       
       // Filter for featured if requested
       if (featured) {
         medications = medications.filter(med => med.featured);
       }
       
       return medications;
     } else {
       // In development, use the local API server
       const queryParams = new URLSearchParams();
       if (query) queryParams.append('query', query);
       if (featured) queryParams.append('featured', 'true');
       
       const response = await fetch(`/api/medications?${queryParams.toString()}`)
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`)
       }
       return await response.json()
     }
   } catch (error) {
     console.error('Error fetching medications:', error)
     throw error
   }
 }

/**
 * Fetch pharmacies with optional search query and location
 * @param {Object} params - Search parameters
 * @param {string} params.query - Search query for pharmacies
 * @param {number} params.lat - Latitude for location-based search
 * @param {number} params.lng - Longitude for location-based search
 * @returns {Promise<Array>} - Promise resolving to array of pharmacies
*/
export const fetchPharmacies = async ({ query = '', lat = null, lng = null } = {}) => {
  try {
    // In production, use mock data
    if (process.env.NODE_ENV === 'production') {
      // Load mock pharmacies data
      const pharmaciesResponse = await fetch('/mock-data/pharmacies.json');
      let pharmacies = await pharmaciesResponse.json();
      
      // Filter pharmacies based on query if provided
      if (query) {
        pharmacies = pharmacies.filter(pharmacy =>
          pharmacy.name.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      // If coordinates are provided, calculate distance and filter by location
      if (lat !== null && lng !== null) {
        pharmacies = pharmacies.map(pharmacy => ({
          ...pharmacy,
          distance: calculateDistance(lat, lng, pharmacy.latitude, pharmacy.longitude)
        }))
        .filter(pharmacy => pharmacy.distance <= 10) // Only include pharmacies within 10km
        .sort((a, b) => a.distance - b.distance); // Sort by distance
      }
      
      return pharmacies;
    } else {
      // In development, use the local API server
      console.log('fetchPharmacies called with:', { query, lat, lng });
      
      // If we have coordinates, use Overpass API to get real pharmacy data
      if (lat !== null && lng !== null) {
        // Create bounding box around the user's location (approximately 10km radius)
        const bboxSize = 0.1; // Approximately 10km at equator
        const bbox = `${lat - bboxSize},${lng - bboxSize},${lat + bboxSize},${lng + bboxSize}`;
        
        console.log('Bounding box:', bbox);
        
        // Overpass API query for pharmacies
        const overpassQuery = `
          [out:json];
          (
            node["amenity"="pharmacy"](${bbox});
            way["amenity"="pharmacy"](${bbox});
            relation["amenity"="pharmacy"](${bbox});
          );
          out center;
        `;
        
        console.log('Overpass query:', overpassQuery);
        
        // Create a promise that rejects after a timeout
        const fetchWithTimeout = (url, options, timeout = 10000) => {
          return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
          ]);
        };
        
        // Attempt to fetch from Overpass API with retry mechanism
        let attempts = 0;
        const maxAttempts = 3;
        let response;
        let data;
        
        while (attempts < maxAttempts) {
          try {
            response = await fetchWithTimeout('https://overpass-api.de/api/interpreter', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: `data=${encodeURIComponent(overpassQuery)}`
            }, 100); // 10 second timeout
            
            console.log('Overpass API response status:', response.status);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            data = await response.json();
            break; // Success, exit the retry loop
          } catch (error) {
            attempts++;
            console.warn(`Attempt ${attempts} failed:`, error);
            if (attempts >= maxAttempts) {
              // If all attempts failed, throw a specific error for the UI to handle
              throw new Error('Unable to fetch pharmacy data. The service is currently unavailable. Please try again later.');
            }
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          }
        }
        
        console.log('Overpass API response data:', data);
        
        // Convert Overpass API response to our pharmacy format
        const pharmacies = data.elements.map(element => {
          // Get coordinates (for ways/relations, use center)
          const pharmacyLat = element.lat || element.center?.lat || 0;
          const pharmacyLng = element.lon || element.center?.lon || 0;
          
          // Get name from tags or use a default
          const name = element.tags?.name || element.tags?.['name:en'] || 'Unnamed Pharmacy';
          
          // Get address from tags or create a basic one
          const addressParts = [];
          
          if (element.tags?.['addr:housenumber']) addressParts.push(element.tags['addr:housenumber']);
          if (element.tags?.['addr:street']) addressParts.push(element.tags['addr:street']);
          if (element.tags?.['addr:city']) addressParts.push(element.tags['addr:city']);
          if (element.tags?.['addr:postcode']) addressParts.push(element.tags['addr:postcode']);
          
          const address = addressParts.length > 0
            ? addressParts.join(', ')
            : (element.tags?.name || 'Address not available');
          
          // Get phone from tags
          const phone = element.tags?.phone || element.tags?.['contact:phone'] || 'Phone not available';
          
          // Calculate distance from user's location
          const distance = calculateDistance(pharmacyLat, pharmacyLng, lat, lng);
          
          console.log('Processed pharmacy:', {
            id: element.id,
            name: name,
            address: address,
            phone: phone,
            latitude: pharmacyLat,
            longitude: pharmacyLng,
            rating: 4.0,
            distance: distance
          });
          
          return {
            id: element.id,
            name: name,
            address: address,
            phone: phone,
            latitude: pharmacyLat,
            longitude: pharmacyLng,
            rating: 4.0, // Default rating since Overpass doesn't provide this
            distance: distance,
            // For inventory, we'll need to simulate since Overpass doesn't have this data
            inventory: [] // Will be populated in PharmacyDetail component
          };
        });
        
        console.log('All processed pharmacies:', pharmacies);
        console.log('Pharmacies within 10km:', pharmacies.filter(pharmacy => pharmacy.distance <= 10));
        
        // Sort by distance and limit to pharmacies within 10km
        return pharmacies
          .filter(pharmacy => pharmacy.distance <= 10)
          .sort((a, b) => a.distance - b.distance);
      } else {
        // For search without location, we'll need to implement a different approach
        // For now, we'll return an empty array since we don't have a search API for pharmacies
        return [];
      }
    }
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    throw error;
  }
}

/**
* Calculate distance between two points using Haversine formula
* @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
* @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
* Fetch inventory for a specific pharmacy
 * @param {number} pharmacyId - ID of the pharmacy
 * @returns {Promise<Array>} - Promise resolving to array of medications
 */
export const fetchPharmacyInventory = async (pharmacyId) => {
  try {
    // Simulate inventory data since Overpass API doesn't provide this
    const sampleMedications = [
      { id: 1, name: "Paracetamol", genericName: "Acetaminophen", description: "Pain reliever and fever reducer", price: 5.9, expiryDate: "2025-12-31" },
      { id: 2, name: "Ibuprofen", genericName: "Ibuprofen", description: "Nonsteroidal anti-inflammatory drug", price: 7.49, expiryDate: "2025-11-30" },
      { id: 3, name: "Amoxicillin", genericName: "Amoxicillin", description: "Antibiotic used to treat bacterial infections", price: 12.99, expiryDate: "2025-10-15" },
      { id: 4, name: "Lisinopril", genericName: "Lisinopril", description: "ACE inhibitor used to treat high blood pressure", price: 15.99, expiryDate: "2026-01-20" },
      { id: 5, name: "Metformin", genericName: "Metformin", description: "Medication for type 2 diabetes", price: 8.99, expiryDate: "2025-09-30" },
      { id: 6, name: "Atorvastatin", genericName: "Atorvastatin", description: "Statin used to prevent cardiovascular disease", price: 18.99, expiryDate: "2025-08-31" },
      { id: 7, name: "Omeprazole", genericName: "Omeprazole", description: "Proton pump inhibitor used to treat gastric acid", price: 14.99, expiryDate: "2026-03-15" },
      { id: 8, name: "Levothyroxine", genericName: "Levothyroxine", description: "Thyroid hormone replacement", price: 11.99, expiryDate: "2026-02-28" }
    ];

    // Simulate inventory with random stock status
    const inventoryData = sampleMedications.map(med => {
      const stockStatuses = ['in_stock', 'low_stock', 'out_of_stock'];
      const randomStockStatus = stockStatuses[Math.floor(Math.random() * stockStatuses.length)];
      
      return {
        ...med,
        stockStatus: randomStockStatus
      };
    });

    return inventoryData;
  } catch (error) {
    console.error(`Error fetching inventory for pharmacy ${pharmacyId}:`, error)
    throw error
  }
}

/**
* Create a new order (requires Firebase Authentication)
* @param {Object} orderData - Order data
 * @param {Array} orderData.items - Array of items in the order
 * @returns {Promise<Object>} - Promise resolving to the created order
 */
export const createOrder = async (orderData) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      // In production, simulate order creation with mock response
      return {
        id: Math.floor(Math.random() * 10000) + 1000, // Generate a random order ID
        createdAt: new Date().toISOString(),
        status: 'confirmed',
        ...orderData
      };
    } else {
      // Get Firebase ID token for authentication
      const idToken = await getIdToken();
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(orderData),
      })
      
      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        } else if (response.status === 403) {
          throw new Error('Forbidden: You do not have permission to perform this action');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    }
  } catch (error) {
    console.error('Error creating order:', error);
    // Re-throw the error for the calling function to handle
    throw error;
  }
}

/**
 * Track an order by ID (requires Firebase Authentication)
 * @param {number} orderId - ID of the order to track
* @returns {Promise<Object>} - Promise resolving to the order details
 */
export const trackOrder = async (orderId) => {
  try {
    if (process.env.NODE_ENV === 'production' || !auth) {
      // In production or when Firebase is not configured, simulate order tracking with mock response
      const statuses = ['confirmed', 'preparing', 'shipped', 'in_transit', 'delivered'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        orderId: orderId,
        status: randomStatus,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        location: 'Local Distribution Center',
        updatedAt: new Date().toISOString()
      };
    } else {
      // Get Firebase ID token for authentication
      const idToken = await getIdToken();
      
      const response = await fetch(`/api/orders/${orderId}/track`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      })
      
      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in again');
        } else if (response.status === 403) {
          throw new Error('Forbidden: You do not have permission to perform this action');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    }
  } catch (error) {
    console.error(`Error tracking order ${orderId}:`, error);
    // Re-throw the error for the calling function to handle
    throw error;
  }
}