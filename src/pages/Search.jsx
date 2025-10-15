import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import MedicationCard from '../components/MedicationCard';
import { fetchMedications } from '../utils/api';
import useTranslation from '../hooks/useTranslation';

const Search = () => {
  const { language } = useContext(AppContext);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const location = useLocation();

  // Get search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setSearchQuery(query);
    setDebouncedQuery(query);
  }, [location.search]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch medications based on search query
  useEffect(() => {
    if (debouncedQuery === '') {
      setMedications([]);
      return;
    }

    const loadMedications = async () => {
      setLoading(true);
      try {
        const data = await fetchMedications(debouncedQuery);
        setMedications(data);
      } catch (error) {
        console.error('Error fetching medications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMedications();
  }, [debouncedQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('search.title')}</h1>
      
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={t('search.clear')}
            >
              ✕
            </button>
          )}
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-md hover:bg-primary-dark transition-colors">
            {t('search.button')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : medications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medications.map(medication => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
        </div>
      ) : searchQuery ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">{t('search.noResults')}</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">{t('search.enterToSearch')}</p>
        </div>
      )}
    </div>
  )
}

export default Search;