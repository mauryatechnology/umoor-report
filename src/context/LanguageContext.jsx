import { createContext, useState, useEffect, useContext } from 'react';
import * as dataEn from '../data/reportsDataEn';
import * as dataUr from '../data/reportsDataUr';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const useReportData = () => {
  const { language } = useLanguage();
  return language === 'en' ? dataEn : dataUr;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (language === 'en') {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    } else {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ur';
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
