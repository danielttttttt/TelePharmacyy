import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

const CheckoutForm = () => {
  const { cart, clearCart } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'mobile-money'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [trackingId, setTrackingId] = useState(null);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingCost = 5.00;
  const tax = cartTotal * 0.15;
  const total = cartTotal + shippingCost + tax;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call to place order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: cart,
          userId: 1, // Mock user ID
          total: total
        })
      });

      const orderData = await response.json();
      
      // Set order details
      setOrderId(orderData.id);
      setTrackingId(`TRK-${Date.now()}`);
      setOrderPlaced(true);
      
      // Clear cart
      clearCart();
      
      // In a real app, you would integrate with Telebirr / M-Birr SDKs here
      // For example:
      // if (formData.paymentMethod === 'mobile-money') {
      //   // Initialize Telebirr payment
      //   // telebirr.initiatePayment(orderData)
      // }
    } catch (error) {
      console.error('Error placing order:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-2xl font-medium text-gray-900 mt-4">{t('checkout.orderPlacedTitle')}</h3>
        <p className="mt-2 text-gray-600">
          {t('checkout.orderPlacedMessage')} <span className="font-medium">{orderId}</span> {t('checkout.andTrackingId')} <span className="font-medium">{trackingId}</span>.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {t('checkout.continueShopping')}
          </button>
          <button
            onClick={() => navigate(`/track/${orderId}`)}
            className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {t('checkout.trackOrder')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            {t('checkout.fullName')}
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="py-2 px-3 block w-full shadow-sm focus:ring-primary focus:border-primary border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {t('checkout.email')}
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="py-2 px-3 block w-full shadow-sm focus:ring-primary focus:border-primary border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            {t('checkout.phone')}
          </label>
          <div className="mt-1">
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="py-2 px-3 block w-full shadow-sm focus:ring-primary focus:border-primary border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            {t('checkout.address')}
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="py-2 px-3 block w-full shadow-sm focus:ring-primary focus:border-primary border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            {t('checkout.city')}
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="py-2 px-3 block w-full shadow-sm focus:ring-primary focus:border-primary border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('checkout.paymentMethod')}</h3>
        <fieldset>
          <legend className="sr-only">{t('checkout.paymentOptions')}</legend>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="mobile-money"
                name="paymentMethod"
                type="radio"
                value="mobile-money"
                checked={formData.paymentMethod === 'mobile-money'}
                onChange={handleChange}
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
              />
              <label htmlFor="mobile-money" className="ml-3 block text-sm font-medium text-gray-700">
                {t('checkout.mobileMoney')}
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="bank-transfer"
                name="paymentMethod"
                type="radio"
                value="bank-transfer"
                checked={formData.paymentMethod === 'bank-transfer'}
                onChange={handleChange}
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
              />
              <label htmlFor="bank-transfer" className="ml-3 block text-sm font-medium text-gray-700">
                {t('checkout.bankTransfer')}
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="cash-on-delivery"
                name="paymentMethod"
                type="radio"
                value="cash-on-delivery"
                checked={formData.paymentMethod === 'cash-on-delivery'}
                onChange={handleChange}
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
              />
              <label htmlFor="cash-on-delivery" className="ml-3 block text-sm font-medium text-gray-700">
                {t('checkout.cashOnDelivery')}
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between">
          <span className="text-gray-600">{t('checkout.subtotal')}</span>
          <span className="font-medium">${cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-gray-600">{t('checkout.shipping')}</span>
          <span className="font-medium">${shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-gray-600">{t('checkout.tax')}</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-lg font-medium text-gray-900">{t('checkout.total')}</span>
          <span className="text-lg font-medium text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-3 px-4 border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('checkout.processing')}
            </>
          ) : (
            t('checkout.placeOrder')
          )}
        </button>
      </div>

      {/* Integration Notes */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-md">
        <h4 className="text-sm font-medium text-yellow-800">{t('checkout.integrationNotes')}</h4>
        <p className="mt-1 text-sm text-yellow-700">
          {t('checkout.integrationNotesMessage')}
        </p>
        <ul className="mt-1 list-disc list-inside text-sm text-yellow-700">
          <li>{t('checkout.integrationStep1')}</li>
          <li>{t('checkout.integrationStep2')}</li>
          <li>{t('checkout.integrationStep3')}</li>
          <li>{t('checkout.integrationStep4')}</li>
        </ul>
      </div>
    </form>
  )
}

export default CheckoutForm;