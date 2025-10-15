import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import enTranslations from '../i18n/en.json';
import amTranslations from '../i18n/am.json';

// Custom hook to handle translations
const useTranslation = () => {
  const { language } = useContext(AppContext);
  
  const t = (key) => {
    const keys = key.split('.');
    let translation = language === 'en' ? enTranslations : amTranslations;
    
    for (const k of keys) {
      translation = translation[k];
      if (!translation) return key;
    }
    
    return translation;
  };
  
  return { t, language };
};

export default useTranslation;