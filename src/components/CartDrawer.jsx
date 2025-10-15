import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart } = useContext(AppContext);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { t } = useTranslation();

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    updateCartQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">{t('cart.title')}</h2>
                <button
                  type="button"
                  className="ml-3 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={onClose}
                >
                  <span className="sr-only">{t('cart.closePanel')}</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="mt-8">
                <div className="flow-root">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 014 0z"></path>
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">{t('cart.empty')}</h3>
                      <p className="mt-1 text-sm text-gray-500">{t('cart.startAdding')}</p>
                      <div className="mt-6">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          onClick={onClose}
                        >
                          {t('cart.continueShopping')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cart.map((item) => (
                        <li key={item.id} className="py-6 flex">
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{item.genericName}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                  className="px-2 py-1 bg-gray-200 rounded-l-md"
                                  aria-label={t('cart.decreaseQuantity')}
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 border-y border-gray-200">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="px-2 py-1 bg-gray-200 rounded-r-md"
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
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>{t('cart.subtotal')}</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">{t('cart.shippingInfo')}</p>
                <div className="mt-6">
                  <Link
                    to="/cart"
                    className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark"
                    onClick={onClose}
                  >
                    {t('cart.checkout')}
                  </Link>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>
                    {t('cart.or')}{' '}
                    <button
                      type="button"
                      className="text-primary font-medium hover:text-primary-dark"
                      onClick={onClose}
                    >
                      {t('cart.continueShopping')}<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer;