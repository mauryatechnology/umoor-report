'use client';

import { LanguageProvider } from '../../context/LanguageContext';
import ReportPageView from '../../components/Report/ReportPage';
import Header from '../../components/common/Header';

export default function ReportClientPage({ initialReport }) {
  return (
    <LanguageProvider initialReport={initialReport}>
      <Header />
      <ReportPageView />
    </LanguageProvider>
  );
}
