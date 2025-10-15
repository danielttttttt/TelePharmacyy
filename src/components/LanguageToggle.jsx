import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const LanguageToggle = () => {
  const { language, toggleLanguage } = useContext(AppContext)

  return (
    <button 
      onClick={toggleLanguage}
      className="bg-white text-primary px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition-colors"
      aria-label={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
    >
      {language === 'en' ? 'አማ' : 'EN'}
    </button>
  )
}

export default LanguageToggle