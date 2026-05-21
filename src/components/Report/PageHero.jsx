'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useReportData, useLanguage } from '../../context/LanguageContext';

export default function PageHero({ title, subtitle, breadcrumbs = [] }) {
  const { uiDictionary } = useReportData();
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={heroRef} className="relative py-10 sm:py-30 overflow-hidden pt-24">
      <motion.div className="absolute inset-0 bg-gradient-to-br from-emerald-dark via-emerald-light/90 to-emerald-dark w-full h-[150%] -top-[25%]" style={{ y }} />
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>
      <div className={`absolute -top-20 w-60 h-60 rounded-full bg-gold/5 pointer-events-none ${isUrdu ? '-left-20' : '-right-20'}`} />
      <div className={`absolute -bottom-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none ${isUrdu ? '-right-16' : '-left-16'}`} />

      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        {breadcrumbs.length > 0 && (
          <nav className={`flex items-center justify-center flex-wrap gap-2 text-cream/50 mb-6 ${isUrdu ? 'font-kanz text-base' : 'text-sm'}`}>
            <Link to="/" className="hover:text-gold transition-colors">{isUrdu ? 'مرکزی صفحہ' : 'Home'}</Link>
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-2">
                {isUrdu ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                <span className="text-gold">{bc.label}</span>
              </span>
            ))}
          </nav>
        )}

        <div className="flex flex-col items-center gap-4 max-w-4xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className={`text-cream font-bold drop-shadow-lg ${isUrdu ? 'font-kanz text-4xl sm:text-5xl md:text-7xl' : 'font-heading text-3xl sm:text-4xl md:text-5xl'}`}>
            {title || uiDictionary.hero.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className={`text-cream/70 mt-2 px-10 ${isUrdu ? 'font-kanz text-lg sm:text-2xl' : 'text-base sm:text-lg'}`}>
            {subtitle || uiDictionary.hero.subtitle}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
