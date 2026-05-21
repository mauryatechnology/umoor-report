'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useReportData, useLanguage } from '../../context/LanguageContext';

export default function AccordionItem({ item, isOpen, onToggle }) {
  const { uiDictionary } = useReportData();
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  if (!item) return null;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-dark/10 overflow-hidden">
      <button onClick={onToggle} className="w-full px-6 py-5 flex items-center justify-between hover:bg-emerald-50/50 transition-colors cursor-pointer">
        <div className="w-8 shrink-0"></div>
        <div className="flex-1 text-center">
          <h3 className={`font-bold text-emerald-dark ${isUrdu ? 'font-kanz text-2xl' : 'text-lg'}`}>{item.heading}</h3>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-gold text-white' : 'bg-emerald-50 text-emerald-dark'}`}>
          <ChevronDown size={18} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-6 pb-6 pt-2 border-t border-emerald-dark/5 space-y-6">
              <div className="flex flex-col gap-4 items-center max-w-4xl mx-auto">
                {item.content && (
                  <div className="space-y-3 text-center w-full">
                    <p className={`text-charcoal/80 leading-relaxed ${isUrdu ? 'font-kanz text-xl' : 'text-sm'}`}>{item.content}</p>
                  </div>
                )}
              </div>

              {item.images && item.images.length > 0 && (
                <div className="flex flex-col items-center gap-6 pt-4">
                  {item.images.map((img, idx) => (
                    <img key={idx} src={img} alt="Accordion Content" className="w-full max-w-md h-auto rounded-xl shadow-md" />
                  ))}
                </div>
              )}

              {item.docUrl && (
                <div className="pt-4 flex justify-center">
                  <a href={item.docUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 bg-emerald-dark text-gold px-6 py-2.5 rounded-full font-bold hover:bg-emerald-800 transition-colors shadow-md hover:shadow-lg ${isUrdu ? 'font-kanz text-lg' : 'text-sm'}`}>
                    {uiDictionary.accordion.downloadReport}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
