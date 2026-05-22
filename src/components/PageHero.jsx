import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PageHero({ title, subtitle, breadcrumbs = [], icon: Icon }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const renderMixedText = (text) => {
    if (typeof text !== 'string') return text;
    // Split by Arabic text blocks
    const parts = text.split(/([\u0600-\u06FF][\u0600-\u06FF\s]*[\u0600-\u06FF]|[\u0600-\u06FF]+)/g);
    return parts.map((part, i) => {
      if (/[\u0600-\u06FF]/.test(part)) {
        return <span key={i} className="font-kanz font-normal text-[1.1em] px-2">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div ref={heroRef} className="relative py-6 sm:py-10 overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-emerald-dark via-emerald-light/90 to-emerald-dark w-full h-[150%] -top-[25%]"
        style={{ y }}
      />

      {/* Islamic pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/5 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center justify-center flex-wrap gap-2 text-cream/50 text-sm mb-6">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight size={14} />
                {bc.href ? (
                  <Link href={bc.href} className="hover:text-gold transition-colors">{bc.label}</Link>
                ) : (
                  <span className="text-gold">{bc.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex flex-col items-center gap-4 max-w-4xl">
          <div className="flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-3xl sm:text-4xl md:text-6xl text-cream font-bold drop-shadow-lg"
            >
              {renderMixedText(title)}
            </motion.h1>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-cream/70 text-base sm:text-lg mt-2 px-10"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
