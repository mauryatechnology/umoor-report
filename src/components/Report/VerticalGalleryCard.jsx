'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { useReportData, useLanguage } from '../../context/LanguageContext';

export default function VerticalGalleryCard({ images, summaryData }) {
  const { uiDictionary } = useReportData();
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  const containerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      if (containerRef.current) {
        const el = containerRef.current;
        const currentScroll = el.scrollTop;
        const maxScroll = el.scrollHeight - el.clientHeight;
        if (currentScroll >= maxScroll - 10) el.scrollTo({ top: 0, behavior: 'smooth' });
        else el.scrollBy({ top: el.clientHeight, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [images, isPaused]);

  const dragRef = useRef({ isDown: false, startY: 0, scrollTop: 0 });
  const handleMouseDown = (e) => {
    const el = e.currentTarget;
    dragRef.current.isDown = true;
    dragRef.current.startY = e.pageY - el.offsetTop;
    dragRef.current.scrollTop = el.scrollTop;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  };
  const handleMouseUpOrLeave = (e) => {
    dragRef.current.isDown = false;
    e.currentTarget.style.cursor = 'grab';
    e.currentTarget.style.removeProperty('user-select');
  };
  const handleMouseMove = (e) => {
    if (!dragRef.current.isDown) return;
    e.preventDefault();
    const el = e.currentTarget;
    const y = e.pageY - el.offsetTop;
    const walk = (y - dragRef.current.startY) * 1.5;
    el.scrollTop = dragRef.current.scrollTop - walk;
  };

  return (
    <div className="flex flex-col h-[550px] lg:h-full rounded-2xl border shadow-lg overflow-hidden border-charcoal/20 bg-charcoal">
      <div className="bg-charcoal text-gold px-6 py-4 flex items-center justify-between shrink-0 border-b border-white/10 shadow-sm z-10 relative">
        <div className="flex items-center gap-3">
          <ImageIcon size={22} className="opacity-90" />
          <h2 className={`font-bold tracking-wide ${isUrdu ? 'font-kanz text-xl' : 'font-heading text-lg'}`}>{uiDictionary.gallery.title}</h2>
        </div>
        <span className={`font-bold uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-full text-white ${isUrdu ? 'font-kanz text-[12px]' : 'text-[10px]'}`}>
          {images.length} {uiDictionary.dataCard.items}
        </span>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide cursor-grab relative bg-black/50" onMouseEnter={() => setIsPaused(true)} onMouseLeave={(e) => { setIsPaused(false); handleMouseUpOrLeave(e); }} onMouseDown={handleMouseDown} onMouseUp={handleMouseUpOrLeave} onMouseMove={handleMouseMove}>
        <AnimatePresence>
          {images.length > 0 ? images.map((img, idx) => (
            <div key={idx} className="h-full w-full shrink-0 snap-center snap-always flex items-center justify-center p-4">
              <motion.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src={img} alt={`Gallery Reel ${idx}`} className="w-full h-full object-cover rounded-xl shadow-2xl border border-white/10 pointer-events-none" />
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full text-white/40 text-sm gap-2">
              <ImageIcon size={32} className="opacity-20" />
              <p className={isUrdu ? 'font-kanz text-lg' : ''}>{uiDictionary.gallery.emptyState}</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-charcoal border-t border-white/10 flex flex-col shrink-0 z-10 relative transition-all duration-300">
        <button onClick={() => setIsSummaryOpen(!isSummaryOpen)} className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
          <span className={`font-bold tracking-widest text-gold/60 ${isUrdu ? 'font-kanz text-[14px]' : 'text-[11px] uppercase'}`}>{uiDictionary.gallery.summary}</span>
          {isSummaryOpen ? <ChevronDown size={14} className="text-gold/60" /> : <ChevronUp size={14} className="text-gold/60" />}
        </button>

        <AnimatePresence>
          {isSummaryOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`overflow-hidden px-4 pb-4 space-y-2 text-white/80 ${isUrdu ? 'font-kanz text-[13px]' : 'text-[11px]'}`}>
              {summaryData && (
                <div className="mb-3 pb-3 border-b border-white/10 space-y-2">
                  <h4 className={`font-bold text-gold/90 ${isUrdu ? 'text-[15px]' : 'text-[12px]'}`}>{summaryData.heading}</h4>
                  <p className="leading-relaxed opacity-80">{summaryData.content}</p>
                </div>
              )}
              <div className="flex justify-between border-b border-white/10 pb-1.5">
                <span className="font-semibold text-gold/80">{uiDictionary.gallery.totalImages}</span>
                <span className="font-bold">{images.length}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="font-semibold text-gold/80">{uiDictionary.gallery.displayMode}</span>
                <span className="font-bold">{uiDictionary.gallery.autoSliding}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
