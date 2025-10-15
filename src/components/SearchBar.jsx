import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('home.searchPlaceholder')}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      {query && (
        <button 
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          aria-label={t('search.clear')}
        >
          ✕
        </button>
      )}
      <button 
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-md hover:bg-primary-dark transition-colors"
      >
        {t('search.button')}
      </button>
    </form>
  )
}

export default SearchBar;