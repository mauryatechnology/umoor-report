import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useReportData, useLanguage } from '../../context/LanguageContext';

export default function FilterPanel({ 
  umoors, 
  availableCities, 
  activeUmoorId, 
  activeCityId, 
  handleUmoorChange, 
  setActiveCityId, 
  isFiltersVisible, 
  setIsFiltersVisible 
}) {
  const { uiDictionary } = useReportData();
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  const umoorScrollRef = useRef(null);
  const cityScrollRef = useRef(null);
  const dragRef = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const scrollTabs = (ref, direction) => {
    if (ref.current) {
      // In RTL mode, scrolling behavior mirrors natively on modern browsers
      const amount = (direction === 'left' && !isUrdu) || (direction === 'right' && isUrdu) ? -200 : 200;
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e) => {
    const el = e.currentTarget;
    dragRef.current.isDown = true;
    dragRef.current.startX = e.pageX - el.offsetLeft;
    dragRef.current.scrollLeft = el.scrollLeft;
    el.style.cursor = 'grabbing';
    el.style.userSelect = 'none';
  };
  const handleMouseLeaveOrUp = (e) => {
    dragRef.current.isDown = false;
    e.currentTarget.style.cursor = 'grab';
    e.currentTarget.style.removeProperty('user-select');
  };
  const handleMouseMove = (e) => {
    if (!dragRef.current.isDown) return;
    e.preventDefault();
    const el = e.currentTarget;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragRef.current.startX) * 1.5;
    el.scrollLeft = dragRef.current.scrollLeft - walk;
  };

  return (
    <div className="sticky z-40 top-[72px] flex flex-col shadow-md rounded-b-3xl">
      <AnimatePresence initial={false}>
        {isFiltersVisible && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden flex flex-col">
            
            {/* Umoor Filter */}
            <div className="bg-white/95 backdrop-blur-md border-b border-emerald-dark/10 transition-all duration-300">
              <div className="max-w-7xl mx-auto px-4 relative group">
                <button onClick={() => scrollTabs(umoorScrollRef, 'left')} className={`absolute ${isUrdu ? 'right-0 bg-gradient-to-l pr-3 pl-6' : 'left-0 bg-gradient-to-r pl-3 pr-6'} top-1/2 -translate-y-1/2 z-10 from-white via-white to-transparent py-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block`}>
                  <div className="w-7 h-7 rounded-full bg-white shadow-md border border-emerald-dark/10 flex items-center justify-center text-emerald-dark hover:text-gold"><ChevronLeft size={16} /></div>
                </button>
                <div ref={umoorScrollRef} className="flex items-center gap-2.5 overflow-x-auto py-3 scrollbar-hide px-2 md:px-8 cursor-grab" onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeaveOrUp} onMouseUp={handleMouseLeaveOrUp} onMouseMove={handleMouseMove}>
                  <button onClick={() => handleUmoorChange('all')} className={`flex items-center gap-1.5 px-5 py-2 rounded-full transition-all shrink-0 border ${isUrdu ? 'text-lg font-kanz' : 'text-sm font-semibold'} ${activeUmoorId === 'all' ? 'bg-emerald-dark text-gold border-emerald-dark shadow-lg scale-105' : 'bg-white text-charcoal/70 border-emerald-dark/10 hover:border-gold/50 hover:text-emerald-dark'}`}>
                    {uiDictionary.filters.allUmoors}
                  </button>
                  {umoors.map((umoor) => (
                    <button key={umoor.id} onClick={() => handleUmoorChange(umoor.id)} className={`px-5 py-2 rounded-full transition-all shrink-0 border ${isUrdu ? 'text-xl font-kanz' : 'text-sm font-semibold'} ${activeUmoorId === umoor.id ? 'bg-emerald-dark text-gold border-emerald-dark shadow-lg scale-105' : 'bg-white text-charcoal/70 border-emerald-dark/10 hover:border-gold/50 hover:text-emerald-dark'}`}>
                      {umoor.name}
                    </button>
                  ))}
                </div>
                <button onClick={() => scrollTabs(umoorScrollRef, 'right')} className={`absolute ${isUrdu ? 'left-0 bg-gradient-to-r pl-3 pr-6' : 'right-0 bg-gradient-to-l pr-3 pl-6'} top-1/2 -translate-y-1/2 z-10 from-white via-white to-transparent py-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block`}>
                  <div className="w-7 h-7 rounded-full bg-white shadow-md border border-emerald-dark/10 flex items-center justify-center text-emerald-dark hover:text-gold"><ChevronRight size={16} /></div>
                </button>
              </div>
            </div>

            {/* City Filter */}
            <div className="bg-cream/95 backdrop-blur-md border-b border-emerald-dark/5 transition-all duration-300">
              <div className="max-w-7xl mx-auto px-4 relative group">
                <button onClick={() => scrollTabs(cityScrollRef, 'left')} className={`absolute ${isUrdu ? 'right-0 bg-gradient-to-l pr-3 pl-6' : 'left-0 bg-gradient-to-r pl-3 pr-6'} top-1/2 -translate-y-1/2 z-10 from-cream via-cream to-transparent py-3 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block`}>
                  <div className="w-6 h-6 rounded-full bg-cream shadow border border-emerald-dark/10 flex items-center justify-center text-emerald-dark hover:text-gold"><ChevronLeft size={14} /></div>
                </button>
                <div ref={cityScrollRef} className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-hide px-2 md:px-8 cursor-grab" onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeaveOrUp} onMouseUp={handleMouseLeaveOrUp} onMouseMove={handleMouseMove}>
                  <button onClick={() => setActiveCityId('all')} className={`px-4 py-1.5 rounded-full transition-all shrink-0 border ${isUrdu ? 'text-[15px] font-kanz' : 'text-xs font-semibold'} ${activeCityId === 'all' ? 'bg-gold text-emerald-dark border-gold shadow-md' : 'bg-white text-charcoal/60 border-charcoal/10 hover:border-gold/50 hover:text-emerald-dark'}`}>
                    {uiDictionary.filters.allCities}
                  </button>
                  {availableCities.map((city) => (
                    <button key={city.id} onClick={() => setActiveCityId(city.id)} className={`px-4 py-1.5 rounded-full transition-all shrink-0 border ${isUrdu ? 'text-[16px] font-kanz' : 'text-xs font-semibold'} ${activeCityId === city.id ? 'bg-gold text-emerald-dark border-gold shadow-md' : 'bg-white text-charcoal/60 border-charcoal/10 hover:border-gold/50 hover:text-emerald-dark'}`}>
                      {city.name}
                    </button>
                  ))}
                </div>
                <button onClick={() => scrollTabs(cityScrollRef, 'right')} className={`absolute ${isUrdu ? 'left-0 bg-gradient-to-r pl-3 pr-6' : 'right-0 bg-gradient-to-l pr-3 pl-6'} top-1/2 -translate-y-1/2 z-10 from-cream via-cream to-transparent py-3 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block`}>
                  <div className="w-6 h-6 rounded-full bg-cream shadow border border-emerald-dark/10 flex items-center justify-center text-emerald-dark hover:text-gold"><ChevronRight size={14} /></div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full bg-white/95 backdrop-blur-md flex justify-center py-1.5 border-b border-emerald-dark/10 shadow-sm z-20 relative">
        <button onClick={() => setIsFiltersVisible(!isFiltersVisible)} className={`flex items-center gap-1.5 text-emerald-dark/60 hover:text-gold transition-colors font-bold ${isUrdu ? 'text-[12px] font-kanz' : 'text-[10px] uppercase tracking-wider'}`}>
          {isFiltersVisible ? uiDictionary.filters.hideFilters : uiDictionary.filters.showFilters}
          {isFiltersVisible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </div>
  );
}
