'use client';

import { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const useReportData = () => {
  const { language, report } = useLanguage();
  // Return the data for the current language
  if (!report) return { reportsData: [], commonData: {}, TAGS_META: {}, uiDictionary: {} };
  return language === 'en' ? report.reportsDataEn : report.reportsDataUr;
};

export const LanguageProvider = ({ children, initialReport }) => {
  const [language, setLanguage] = useState('en');
  const [report, setReport] = useState(initialReport);

  const updateReport = (newReport) => setReport(newReport);

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
    <LanguageContext.Provider value={{ language, toggleLanguage, report, updateReport }}>
      {children}
    </LanguageContext.Provider>
  );
};
