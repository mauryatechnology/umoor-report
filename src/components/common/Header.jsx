'use client';

import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function Header() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-emerald-dark text-gold shadow-md">
      <div className="flex items-center gap-3">
        <img src="/bhplLogo.png" alt="Logo" className="h-10 w-auto object-contain" />
        <div className="hidden sm:block">
          <h1 className="text-sm font-heading font-bold text-white leading-tight">Dawoodi Bohra</h1>
          <p className="text-xs text-gold font-medium">Jamat Bhopal</p>
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
