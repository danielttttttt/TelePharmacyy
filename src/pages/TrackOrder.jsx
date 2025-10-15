import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Map from '../components/Map'

const TrackOrder = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [position, setPosition] = useState(null)
  const [route, setRoute] = useState([])

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch order details with retry mechanism
        let attempts = 0;
        const maxAttempts = 3;
        let response;
        let orderData;
        
        while (attempts < maxAttempts) {
          try {
            response = await fetch(`/api/orders/${id}/track`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            orderData = await response.json();
            break; // Success, exit the retry loop
          } catch (error) {
            attempts++;
            console.warn(`Attempt ${attempts} failed:`, error);
            if (attempts >= maxAttempts) {
              throw error; // Re-throw the error if all attempts failed
            }
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          }
        }
        
        setOrder(orderData)
        
        // Simulate initial position and route
        const initialPosition = [9.03, 38.74]
        setPosition(initialPosition)
        
        // Simulate a route (in a real app, this would come from the API)
        const simulatedRoute = [
          [9.03, 38.74],
          [9.025, 38.745],
          [9.02, 38.75],
          [9.015, 38.755],
          [9.01, 38.76]
        ]
        setRoute(simulatedRoute)
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchOrderDetails()
    }
  }, [id])

  // Simulate movement along the route
  useEffect(() => {
    if (!order || route.length === 0) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < route.length - 1) {
        currentIndex++
        setPosition(route[currentIndex])
      }
    }, 3000) // Update position every 3 seconds

    return () => clearInterval(interval)
  }, [order, route])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Order not found</h2>
          <p className="text-gray-600 mt-2">The requested order could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order #{order.id}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Order Status</h3>
                <p className="mt-1 text-primary font-medium capitalize">{order.status || 'processing'}</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Estimated Delivery</h3>
                <p className="mt-1 text-gray-600">30-45 minutes</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900">Tracking ID</h3>
                <p className="mt-1 text-gray-600">TRK-{Date.now()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Progress</h2>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                  <p className="text-sm text-gray-500">Your order has been confirmed</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Preparing</p>
                  <p className="text-sm text-gray-500">Your order is being prepared</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${order.status === 'delivered' ? 'bg-primary' : 'bg-gray-200'} flex items-center justify-center`}>
                  {order.status === 'delivered' ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Out for Delivery</p>
                  <p className="text-sm text-gray-500">Your order is on the way</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Delivery Address</h3>
                <p className="mt-1 text-gray-900">123 Main Street, Addis Ababa, Ethiopia</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Delivery Person</h3>
                <p className="mt-1 text-gray-900">Abebe Kebede</p>
                <p className="text-gray-600">+251 912 345 678</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Vehicle</h3>
                <p className="mt-1 text-gray-900">Motorcycle - Plate #AB 123 CD</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Live Tracking</h2>
        <Map
          center={position || [9.03, 38.74]}
          markers={[
            {
              position: position || [9.03, 38.74],
              popup: "Delivery person location"
            }
          ]}
          route={route}
        />
      </div>
    </div>
  )
}

export default TrackOrder