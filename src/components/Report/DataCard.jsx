import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, X, AlertTriangle } from 'lucide-react';
import { useReportData, useLanguage } from '../../context/LanguageContext';

export default function DataCard({ title, icon: Icon, theme, items, summaryData }) {
  const { TAGS_META, uiDictionary } = useReportData();
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  const [activeTags, setActiveTags] = useState([]);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const dragRef = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

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

  const uniqueTags = useMemo(() => {
    const tagsSet = new Set();
    items.forEach(i => {
      if (i.tags && Array.isArray(i.tags)) i.tags.forEach(t => tagsSet.add(t));
      else if (i.tagId) tagsSet.add(i.tagId);
    });
    return Array.from(tagsSet).filter(Boolean);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeTags.length === 0) return items;
    return items.filter(i => {
      const itemTags = (i.tags && Array.isArray(i.tags)) ? i.tags : (i.tagId ? [i.tagId] : []);
      return itemTags.some(t => activeTags.includes(t));
    });
  }, [items, activeTags]);

  const colors = theme === 'emerald'
    ? { border: 'border-emerald-200', bg: 'bg-emerald-50/50', headerBg: 'bg-emerald-dark', headerText: 'text-gold', tagActive: 'text-emerald-dark', tagHover: 'hover:text-emerald-dark', itemBg: 'bg-white', itemBorder: 'border-emerald-100', footerBg: 'bg-emerald-50', footerText: 'text-emerald-800/60' }
    : { border: 'border-[#E8C84A]/40', bg: 'bg-[#E8C84A]/10', headerBg: 'bg-[#E8C84A]', headerText: 'text-gray-900', tagActive: 'text-[#E8C84A]', tagHover: 'hover:text-[#E8C84A]', itemBg: 'bg-white', itemBorder: 'border-[#E8C84A]/30', footerBg: 'bg-[#E8C84A]/10', footerText: 'text-gray-800/60' };

  return (
    <div className={`flex flex-col h-[550px] lg:h-full rounded-2xl border shadow-lg overflow-hidden ${colors.border} bg-white`}>
      <div className={`${colors.headerBg} ${colors.headerText} px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10 relative`}>
        <div className="flex items-center gap-3">
          <Icon size={22} className="opacity-90" />
          <h2 className={`font-bold tracking-wide ${isUrdu ? 'font-kanz text-xl' : 'font-heading text-lg'}`}>{title}</h2>
        </div>
        <span className={`font-bold uppercase tracking-wider bg-white/20 px-3 py-1.5 rounded-full ${isUrdu ? 'font-kanz text-[12px]' : 'text-[10px]'}`}>
          {filteredItems.length} {uiDictionary.dataCard.items}
        </span>
      </div>

      {uniqueTags.length > 0 && (
        <div className="border-b border-gray-100 bg-white shrink-0 shadow-sm z-10 relative">
          <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2 cursor-grab" onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeaveOrUp} onMouseUp={handleMouseLeaveOrUp} onMouseMove={handleMouseMove}>
            <button onClick={() => setActiveTags([])} className={`rounded-full whitespace-nowrap font-bold tracking-wider transition-all px-3 py-1 ${activeTags.length === 0 ? colors.tagActive : 'text-charcoal/60 ' + colors.tagHover} ${isUrdu ? 'font-kanz text-[14px]' : 'text-[11px] uppercase'}`}>
              {uiDictionary.dataCard.allTags}
            </button>
            {uniqueTags.map(tagId => {
              const meta = TAGS_META[tagId] || { name: tagId };
              const isActive = activeTags.includes(tagId);
              return (
                <button key={tagId} onClick={() => setActiveTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId])} className={`flex items-center gap-1.5 text-nowrap font-bold rounded-full tracking-wider transition-all px-3 py-1 ${isActive ? colors.tagActive : 'text-charcoal/60 ' + colors.tagHover} ${isUrdu ? 'font-kanz text-[14px]' : 'text-[11px]'}`}>
                  <span>#{meta.name}</span>
                  {isActive && <X size={12} strokeWidth={3} className="opacity-80" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide ${colors.bg}`}>
        <AnimatePresence mode="popLayout">
          {filteredItems.map(item => (
            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className={`rounded-xl p-5 shadow-sm border ${colors.itemBg} ${colors.itemBorder}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-2">
                  {(item.tags || (item.tagId ? [item.tagId] : [])).map(tId => (
                    <span key={tId} className={`tracking-wide font-extrabold ${theme === 'emerald' ? 'text-emerald-600' : 'text-[#E8C84A]'} ${isUrdu ? 'font-kanz text-[14px]' : 'text-[11px]'}`}>
                      #{TAGS_META[tId]?.name || tId}
                    </span>
                  ))}
                </div>
                <span className={`font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 ${isUrdu ? 'font-kanz text-[12px]' : 'text-[10px]'}`}>
                  {isUrdu ? item.cityId : item.cityId.toUpperCase()}
                </span>
              </div>
              <div className="space-y-3">
                <p className={`leading-relaxed font-medium ${isUrdu ? 'font-kanz text-lg text-gray-800' : 'text-sm text-gray-600'}`}>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-charcoal/40 text-sm gap-2">
            <AlertTriangle size={32} className="opacity-20" />
            <p className={isUrdu ? 'font-kanz text-lg' : ''}>{uiDictionary.dataCard.emptyState.replace('{title}', isUrdu ? title : title.toLowerCase())}</p>
          </div>
        )}
      </div>

      <div className={`${colors.footerBg} ${colors.footerText} border-t border-black/5 flex flex-col shrink-0 z-10 relative transition-all duration-300`}>
        <button onClick={() => setIsSummaryOpen(!isSummaryOpen)} className="w-full p-3 flex items-center justify-between hover:bg-black/5 transition-colors cursor-pointer">
          <span className={`font-bold tracking-widest ${isUrdu ? 'font-kanz text-[14px]' : 'text-[11px] uppercase'}`}>{title} {uiDictionary.dataCard.summary}</span>
          {isSummaryOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        <AnimatePresence>
          {isSummaryOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`overflow-hidden px-4 pb-4 space-y-2 ${isUrdu ? 'font-kanz text-[13px]' : 'text-[11px]'}`}>
              {summaryData && (
                <div className="mb-3 pb-3 border-b border-black/10 space-y-2">
                  <h4 className={`font-bold opacity-90 ${isUrdu ? 'text-[15px]' : 'text-[12px]'}`}>{summaryData.heading}</h4>
                  <p className="leading-relaxed opacity-70">{summaryData.content}</p>
                </div>
              )}
              <div className="flex justify-between border-b border-black/5 pb-1.5">
                <span className="font-semibold opacity-80">{uiDictionary.dataCard.totalItems}</span>
                <span className="font-bold">{filteredItems.length}</span>
              </div>
              <div className="flex justify-between border-b border-black/5 pb-1.5">
                <span className="font-semibold opacity-80">{uiDictionary.dataCard.citiesRepresented}</span>
                <span className="font-bold">{new Set(filteredItems.map(i => i.cityId)).size}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="font-semibold opacity-80">{uiDictionary.dataCard.activeTags}</span>
                <span className={`font-bold truncate ${isUrdu ? 'text-left mr-4' : 'text-right ml-4'}`}>
                  {activeTags.length === 0 ? uiDictionary.filters.allUmoors : activeTags.map(tId => TAGS_META[tId]?.name || tId).join(isUrdu ? '، ' : ', ')}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
