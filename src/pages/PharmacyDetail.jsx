import React, { useState, useEffect, useContext } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import InventoryTable from '../components/InventoryTable'
import Map from '../components/Map'

const PharmacyDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const { addToCart } = useContext(AppContext)
  const [pharmacy, setPharmacy] = useState(null)
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const fetchPharmacyDetails = async () => {
      try {
        // Get pharmacy details from location state
        const pharmacyData = location.state?.pharmacy || null;
        setPharmacy(pharmacyData)

        // Generate simulated inventory data
        if (pharmacyData) {
          // Sample medications data (in a real app, this would come from a database)
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

          setInventory(inventoryData);
        }
      } catch (error) {
        console.error('Error fetching pharmacy details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPharmacyDetails()
    }
  }, [id, location.state])

 // Implement real-time updates with polling
  useEffect(() => {
    if (!id || !pharmacy) return

    // Poll for inventory updates every 10 seconds
    const interval = setInterval(() => {
      try {
        // Generate new simulated inventory data with random stock statuses
        const sampleMedications = [
          { id: 1, name: "Paracetamol", genericName: "Acetaminophen", description: "Pain reliever and fever reducer", price: 5.9, expiryDate: "2025-12-31" },
          { id: 2, name: "Ibuprofen", genericName: "Ibuprofen", description: "Nonsteroidal anti-inflammatory drug", price: 7.49, expiryDate: "2025-11-30" },
          { id: 3, name: "Amoxicillin", genericName: "Amoxicillin", description: "Antibiotic used to treat bacterial infections", price: 12.99, expiryDate: "2025-10-15" },
          { id: 4, name: "Lisinopril", genericName: "Lisinopril", description: "ACE inhibitor used to treat high blood pressure", price: 15.99, expiryDate: "2026-01-20" },
          { id: 5, name: "Metformin", genericName: "Metformin", description: "Medication for type 2 diabetes", price: 8.99, expiryDate: "2025-09-30" },
          { id: 6, name: "Atorvastatin", genericName: "Atorvastatin", description: "Statin used to prevent cardiovascular disease", price: 18.99, expiryDate: "2025-08-31" },
          { id: 7, name: "Omeprazole", genericName: "Omeprazole", description: "Proton pump inhibitor used to treat gastric acid", price: 14.99, expiryDate: "2026-03-15" },
          { id: 8, name: "Levothyroxine", genericName: "Levothyroxine", description: "Thyroid hormone replacement", price: 11.9, expiryDate: "2026-02-28" }
        ];

        // Simulate inventory with random stock status
        const updatedInventory = sampleMedications.map(med => {
          const stockStatuses = ['in_stock', 'low_stock', 'out_of_stock'];
          const randomStockStatus = stockStatuses[Math.floor(Math.random() * stockStatuses.length)];
          
          return {
            ...med,
            stockStatus: randomStockStatus
          };
        });

        setInventory(updatedInventory);
        
        // Show notification when inventory updates
        setNotification('Inventory updated!')
        setTimeout(() => setNotification(null), 3000)
      } catch (error) {
        console.error('Error updating inventory:', error)
      }
    }, 10000) // 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [id, pharmacy])

  const handleAddToCart = (medication) => {
    addToCart(medication)
    setNotification(`${medication.name} added to cart!`)
    setTimeout(() => setNotification(null), 3000)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!pharmacy) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Pharmacy not found</h2>
          <p className="text-gray-600 mt-2">The requested pharmacy could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}

      {/* Pharmacy Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{pharmacy.name}</h1>
            <p className="text-gray-600 mt-2">{pharmacy.address}</p>
          </div>
          <div className="bg-primary text-white px-3 py-1 rounded-full">
            ★ {pharmacy.rating}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 0 011.21-.502l4.493 1.498a1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span>{pharmacy.phone}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>{pharmacy.latitude}, {pharmacy.longitude}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Open 24/7</span>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pharmacy Location</h2>
        {pharmacy.latitude && pharmacy.longitude ? (
          <div className="relative h-80 rounded-lg overflow-hidden bg-gray-200">
            <Map
              center={[pharmacy.latitude, pharmacy.longitude]}
              markers={[
                {
                  position: [pharmacy.latitude, pharmacy.longitude],
                  popup: {
                    title: pharmacy.name,
                    address: pharmacy.address,
                    rating: pharmacy.rating,
                    phone: pharmacy.phone
                  }
                }
              ]}
            />
          </div>
        ) : (
          <div className="h-80 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Location data not available</p>
          </div>
        )}
        {pharmacy.latitude && pharmacy.longitude && (
          <div className="mt-4 text-center text-gray-600">
            <p>Exact location: {pharmacy.latitude.toFixed(6)}, {pharmacy.longitude.toFixed(6)}</p>
          </div>
        )}
      </div>

      {/* Inventory Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available Medications</h2>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        {inventory.length > 0 ? (
          <InventoryTable inventory={inventory} onAddToCart={handleAddToCart} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No medications currently available at this pharmacy.</p>
          </div>
        )}
      </div>

      {/* Open Orders Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Open Orders</h2>
        <div className="text-center py-12">
          <p className="text-gray-600">No open orders at this time.</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Hours of Operation</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>8:0 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>9:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>10:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Details</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 0 011.21-.502l4.493 1.498a1 0 01.684.949V19a2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>{pharmacy.phone}</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>info@{pharmacy.name.toLowerCase().replace(/\s+/g, '')}.com</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{pharmacy.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PharmacyDetail