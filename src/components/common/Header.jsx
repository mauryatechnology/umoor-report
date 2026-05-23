'use client';

import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

const DEFAULT_HEADER = {
  logoUrl: '/bhplLogo.png',
  title: 'Dawoodi Bohra',
  subtitle: 'Jamat Bhopal',
};

export default function Header() {
  const { language, toggleLanguage, report } = useLanguage();

  // Read custom header settings from the report, fall back to defaults
  const headerSettings = report?.headerSettings || {};
  const logoUrl = headerSettings.logoUrl || DEFAULT_HEADER.logoUrl;
  const title = headerSettings.title || DEFAULT_HEADER.title;
  const subtitle = headerSettings.subtitle || DEFAULT_HEADER.subtitle;

  useEffect(() => {
    // Dynamically update the favicon to match the logo
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = logoUrl;
  }, [logoUrl]);

  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-emerald-dark text-gold shadow-md">
      <div className="flex items-center gap-3">
        <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
        <div className="hidden sm:block">
          <h1 className="text-sm font-heading font-bold text-white leading-tight">{title}</h1>
          <p className="text-xs text-gold font-medium">{subtitle}</p>
        </div>
      </div>

      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors border border-white/20"
      >
        <Globe size={16} />
        <span className="font-bold text-sm tracking-wide">
          {language === 'en' ? 'اردو' : 'English'}
        </span>
      </button>
    </header>
  );
}
