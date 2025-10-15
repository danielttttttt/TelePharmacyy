import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart } = useContext(AppContext);
  const { t } = useTranslation();

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    updateCartQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 014 0z"></path>
          </svg>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{t('cart.empty')}</h2>
          <p className="mt-1 text-gray-500">{t('cart.startAdding')}</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('cart.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.id} className="p-6">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                          <p className="text-gray-500">{item.genericName}</p>
                        </div>
                        <p className="text-lg font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 bg-gray-200 rounded-l-md"
                            aria-label={t('cart.decreaseQuantity')}
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-y border-gray-200">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-3 py-1 bg-gray-200 rounded-r-md"
                            aria-label={t('cart.increaseQuantity')}
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          type="button"
                          className="font-medium text-primary hover:text-primary-dark"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          {t('cart.remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('cart.orderSummary')}</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.shipping')}</span>
                <span className="font-medium">$5.00</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.tax')}</span>
                <span className="font-medium">${(cartTotal * 0.15).toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-medium text-gray-900">{t('cart.total')}</span>
                <span className="text-lg font-medium text-gray-900">${(cartTotal + 5.00 + (cartTotal * 0.15)).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/checkout"
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('cart.proceedToCheckout')}
              </Link>
            </div>
            
            <div className="mt-4 text-center">
              <Link to="/" className="font-medium text-primary hover:text-primary-dark">
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart;
