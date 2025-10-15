import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import LanguageToggle from './LanguageToggle';
import SearchBar from './SearchBar';
import useTranslation from '../hooks/useTranslation';

const Header = () => {
  const { cartItemCount } = useContext(AppContext);
  const { hasRole, user } = useContext(AuthContext);
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main header content */}
        <div className="flex items-center justify-between py-4">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/src/assets/logo.svg" className="h-12 w-12" alt={`${t('header.home')} Logo`} />
              <span className="text-2xl font-bold text-gray-800">
                Tele-<span className="text-primary">Pharmacy</span>
              </span>
            </Link>
          </div>

          {/* Center section - Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className={`font-medium transition-colors duration-200 ${window.location.pathname === '/' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'}`}>
              {t('header.home')}
            </Link>
            <Link to="/search" className={`font-medium transition-colors duration-200 ${window.location.pathname === '/search' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'}`}>
              {t('header.search')}
            </Link>
            <Link to="/pharmacies" className={`font-medium transition-colors duration-200 ${window.location.pathname === '/pharmacies' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-primary'}`}>
              {t('home.nearbyPharmacies')}
            </Link>
          </nav>

          {/* Right section - Actions */}
          <div className="flex items-center space-x-6">
            {/* Search bar - visible on medium screens and up */}
            <div className="hidden md:block w-40 lg:w-64">
              <SearchBar />
            </div>

            {/* User actions */}
            <div className="flex items-center space-x-5">
              {hasRole && hasRole('pharmacy') ? (
                <>
                  <Link to="/pharmacy/dashboard" className="text-gray-600 hover:text-primary transition-colors duration-200" aria-label={t('header.dashboard')}>
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-1l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 01-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                      </svg>
                      <span className="text-xs mt-1 hidden lg:block">{t('header.dashboard')}</span>
                    </div>
                  </Link>
                  <Link to="/pharmacy/inventory" className="text-gray-600 hover:text-primary transition-colors duration-200" aria-label={t('header.inventory')}>
                    <div className="flex flex-col items-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                      <span className="text-xs mt-1 hidden lg:block">{t('header.inventory')}</span>
                    </div>
                  </Link>
                </>
              ) : (
                <Link to="/cart" className="relative text-gray-60 hover:text-primary transition-colors duration-200" aria-label={`${t('header.cart')}, ${cartItemCount} items`}>
                  <div className="flex flex-col items-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707 1.707 1.707H17m0 0a2 2 0 104 0 2 2 0-4 0zm-8 2a2 2 0 11-4 0 2 2 014 0z"></path>
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cartItemCount}
                      </span>
                    )}
                    <span className="text-xs mt-1 hidden lg:block">{t('header.cart')}</span>
                  </div>
                </Link>
              )}

              <Link to="/profile" className="text-gray-600 hover:text-primary transition-colors duration-200" aria-label={t('header.profile')}>
                <div className="flex flex-col items-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 0 11-8 0 4 4 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="text-xs mt-1 hidden lg:block">{user?.displayName || t('header.profile')}</span>
                </div>
              </Link>

              <div className="hidden md:block">
                <LanguageToggle />
              </div>

              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-600 focus:outline-none"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mb-3 px-4">
          <SearchBar />
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`font-medium py-2 ${window.location.pathname === '/' ? 'text-primary' : 'text-gray-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
              <Link 
                to="/search" 
                className={`font-medium py-2 ${window.location.pathname === '/search' ? 'text-primary' : 'text-gray-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.search')}
              </Link>
              <Link 
                to="/pharmacies" 
                className={`font-medium py-2 ${window.location.pathname === '/pharmacies' ? 'text-primary' : 'text-gray-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home.nearbyPharmacies')}
              </Link>
              
              {hasRole && hasRole('pharmacy') ? (
                <>
                  <Link 
                    to="/pharmacy/dashboard" 
                    className={`font-medium py-2 ${window.location.pathname === '/pharmacy/dashboard' ? 'text-primary' : 'text-gray-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.dashboard')}
                  </Link>
                  <Link 
                    to="/pharmacy/inventory" 
                    className={`font-medium py-2 ${window.location.pathname === '/pharmacy/inventory' ? 'text-primary' : 'text-gray-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('header.inventory')}
                  </Link>
                </>
              ) : (
                <Link 
                  to="/cart" 
                  className={`font-medium py-2 ${window.location.pathname === '/cart' ? 'text-primary' : 'text-gray-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('header.cart')} ({cartItemCount})
                </Link>
              )}
              
              <Link 
                to="/profile" 
                className={`font-medium py-2 ${window.location.pathname === '/profile' ? 'text-primary' : 'text-gray-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {user?.displayName || t('header.profile')}
              </Link>
              
              <div className="pt-2">
                <LanguageToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
 );
};

export default Header;