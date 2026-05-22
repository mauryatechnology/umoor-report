'use client';

import { useState, useMemo } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useReportData, useLanguage } from '../../context/LanguageContext';
import PageHero from './PageHero';
import FadeIn from '../animations/FadeIn';
import FilterPanel from './FilterPanel';
import DataCard from './DataCard';
import VerticalGalleryCard from './VerticalGalleryCard';
import AccordionItem from './AccordionItem';

export default function ReportPage() {
  const { reportsData, commonData, uiDictionary } = useReportData();
  const { language } = useLanguage();

  const [activeUmoorId, setActiveUmoorId] = useState('all');
  const [activeCityId, setActiveCityId] = useState('all');
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [openAccordionIdx, setOpenAccordionIdx] = useState(null);

  const handleUmoorChange = (umoorId) => {
    setActiveUmoorId(umoorId);
    setActiveCityId('all');
  };

  const umoors = useMemo(() => reportsData.map(u => ({ id: u.id, name: u.name })), [reportsData]);
  
  const allCities = useMemo(() => {
    const cityMap = new Map();
    reportsData.forEach(u => u.cities?.forEach(c => cityMap.set(c.id, { id: c.id, name: c.name })));
    return Array.from(cityMap.values());
  }, [reportsData]);

  const aggregatedData = useMemo(() => {
    const ach = [];
    const imp = [];
    const imgs = [];

    const umoorsToShow = activeUmoorId === 'all'
      ? reportsData
      : reportsData.filter(u => u.id === activeUmoorId);

    umoorsToShow.forEach(umoor => {
      const citiesToShow = activeCityId === 'all'
        ? umoor.cities || []
        : (umoor.cities || []).filter(c => c.id === activeCityId);

      citiesToShow.forEach(city => {
        city.achievements?.forEach((item, idx) => {
          ach.push({ id: `ach-${umoor.id}-${city.id}-${idx}`, text: item.text, tags: item.tags, umoorId: umoor.id, cityId: city.id });
        });
        city.improvements?.forEach((item, idx) => {
          imp.push({ id: `imp-${umoor.id}-${city.id}-${idx}`, text: item.text, tags: item.tags, umoorId: umoor.id, cityId: city.id });
        });
        if (city.images?.length > 0) imgs.push(...city.images);
      });
    });

    return { achievements: ach, improvements: imp, images: imgs };
  }, [activeUmoorId, activeCityId, reportsData]);

  const availableCities = useMemo(() => {
    if (activeUmoorId === 'all') {
      const allCityIds = new Set();
      reportsData.forEach(u => u.cities?.forEach(c => allCityIds.add(c.id)));
      return allCities.filter(c => allCityIds.has(c.id));
    }
    const umoor = reportsData.find(u => u.id === activeUmoorId);
    if (!umoor) return [];
    const cityIds = new Set((umoor.cities || []).map(c => c.id));
    return allCities.filter(c => cityIds.has(c.id));
  }, [activeUmoorId, allCities, reportsData]);
  
  const dynamicAccordion = useMemo(() => {
    // Guard against missing accordion data in commonData
    const defaultAccordion = { images: [], docUrl: '', heading: 'Major Issues Overview', content: '' };
    let accordionData = (commonData.accordion && commonData.accordion[0]) || defaultAccordion;
    if (activeUmoorId !== 'all' && activeCityId !== 'all') {
      const umoor = reportsData.find(u => u.id === activeUmoorId);
      const city = umoor?.cities?.find(c => c.id === activeCityId);
      if (city?.accordion) accordionData = city.accordion;
    } else if (activeUmoorId !== 'all') {
      const umoor = reportsData.find(u => u.id === activeUmoorId);
      if (umoor?.accordion) accordionData = umoor.accordion;
    }
    return accordionData;
  }, [activeUmoorId, activeCityId, reportsData, commonData]);

  return (
    <div className="font-body bg-cream min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col">
        <PageHero title={uiDictionary.hero.title} subtitle={uiDictionary.hero.subtitle} breadcrumbs={[{ label: uiDictionary.hero.breadcrumb }]} />

        <FilterPanel 
          umoors={umoors} 
          availableCities={availableCities} 
          activeUmoorId={activeUmoorId} 
          activeCityId={activeCityId} 
          handleUmoorChange={handleUmoorChange} 
          setActiveCityId={setActiveCityId} 
          isFiltersVisible={isFiltersVisible} 
          setIsFiltersVisible={setIsFiltersVisible} 
        />

        <div className="max-w-4xl mx-auto px-4 py-8 md:py-10 w-full z-10 relative">
          <FadeIn>
            <div className="space-y-4">
              <AccordionItem item={dynamicAccordion} isOpen={openAccordionIdx === 0} onToggle={() => setOpenAccordionIdx(openAccordionIdx === 0 ? null : 0)} />
            </div>
          </FadeIn>
        </div>

        <div className="max-w-[1600px] w-full mx-auto px-4 py-8 lg:py-10 flex-1 flex flex-col">
          <FadeIn className="w-full flex-1 min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[550px] lg:h-[calc(100vh-320px)]">
              <DataCard title={uiDictionary.dataCard.achievementsTitle} type="achievements" icon={CheckCircle} theme="emerald" items={aggregatedData.achievements} summaryData={dynamicAccordion} />
              <DataCard title={uiDictionary.dataCard.improvementsTitle} type="improvements" icon={AlertTriangle} theme="#E8C84A" items={aggregatedData.improvements} summaryData={dynamicAccordion} />
              <VerticalGalleryCard images={aggregatedData.images} summaryData={dynamicAccordion} />
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
