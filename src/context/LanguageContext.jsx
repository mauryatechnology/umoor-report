'use client';

import { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Safe defaults so missing DB fields never cause a TypeError
const DEFAULT_UI_DICTIONARY = {
  hero: {
    title: 'Umoor Overview Dashboard',
    subtitle: 'A unified view of achievements, improvements, and gallery highlights across all active Umoors and cities.',
    breadcrumb: 'Dashboard',
  },
  filters: {
    allUmoors: 'All Umoors',
    allCities: 'All Cities',
    showFilters: 'Show Filters',
    hideFilters: 'Hide Filters',
  },
  dataCard: {
    achievementsTitle: 'Achievements',
    improvementsTitle: 'Need to Improve',
    items: 'items',
    allTags: 'All Tags',
    emptyState: 'No {title} found for this selection.',
    summary: 'Summary',
    totalItems: 'Total Items:',
    citiesRepresented: 'Cities Represented:',
    activeTags: 'Active Tags:',
  },
  gallery: {
    title: 'Gallery Reel',
    emptyState: 'No images found.',
    summary: 'Gallery Summary',
    totalImages: 'Total Images:',
    displayMode: 'Display Mode:',
    autoSliding: 'Auto-Sliding Reel',
  },
  accordion: {
    downloadReport: 'Download Detailed Report',
  },
};

const DEFAULT_COMMON_DATA = {
  sliderImages: [],
  accordion: [
    {
      images: [],
      docUrl: '',
      heading: 'Major Issues Overview',
      content: 'Add your report details here.',
    },
  ],
};

export const useReportData = () => {
  const { language, report } = useLanguage();

  if (!report) {
    return {
      reportsData: [],
      commonData: DEFAULT_COMMON_DATA,
      TAGS_META: {},
      uiDictionary: DEFAULT_UI_DICTIONARY,
    };
  }

  // Safely pick the correct language block from the report document
  const langData = language === 'en' ? report.reportsDataEn : report.reportsDataUr;

  return {
    reportsData: langData?.reportsData ?? [],
    commonData: langData?.commonData ?? DEFAULT_COMMON_DATA,
    TAGS_META: langData?.TAGS_META ?? {},
    // Merge defaults so individual missing keys don't propagate as undefined
    uiDictionary: {
      ...DEFAULT_UI_DICTIONARY,
      ...(langData?.uiDictionary ?? {}),
      hero: {
        ...DEFAULT_UI_DICTIONARY.hero,
        ...(langData?.uiDictionary?.hero ?? {}),
      },
    },
  };
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
