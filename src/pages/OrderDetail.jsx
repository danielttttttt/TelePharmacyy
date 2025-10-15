import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

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
            response = await fetch(`/api/orders/${id}`);
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
          <div className="mt-6">
            <Link to="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Order Details</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Order #{order.id}</h2>
            <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <Link 
            to={`/track/${order.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Track Order
          </Link>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
          <ul className="divide-y divide-gray-200">
            {order.items && order.items.map((item) => (
              <li key={item.id} className="py-4 flex justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                  <p className="text-gray-500">{item.genericName}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">${item.price.toFixed(2)}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <span className="text-lg font-medium text-gray-900">
              ${order.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail