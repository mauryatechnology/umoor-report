'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { BarChart3, Image as ImageIcon, MapPin, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import FadeIn from '../../../components/animations/FadeIn';

export default function DashboardOverview({ params }) {
  const { location } = use(params);
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/reports/${location}`);
        if (res.ok) {
          const data = await res.json();
          setReport(data.report);
        }
      } catch (error) {
        console.error('Failed to fetch report overview:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [location]);

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-dark" />
      </div>
    );
  }

  // Calculate stats based on English data (assuming structure matches Urdu)
  const data = report?.reportsDataEn?.reportsData || [];
  
  const totalUmoors = data.length;
  let totalCities = 0;
  let totalAchievements = 0;
  let totalImprovements = 0;
  let totalImages = 0;

  data.forEach(umoor => {
    if (umoor.cities) {
      totalCities += umoor.cities.length;
      umoor.cities.forEach(city => {
        totalAchievements += city.achievements?.length || 0;
        totalImprovements += city.improvements?.length || 0;
        totalImages += city.images?.length || 0;
      });
    }
  });

  const stats = [
    { title: 'Total Umoors', value: totalUmoors, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Cities Mapped', value: totalCities, icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Achievements', value: totalAchievements, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Improvements', value: totalImprovements, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Gallery Images', value: totalImages, icon: ImageIcon, color: 'text-pink-600', bg: 'bg-pink-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-dark font-heading">Overview</h1>
          <p className="text-charcoal/60 mt-1">Summary of your report data across all regions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, idx) => (
          <FadeIn key={idx} delay={idx * 0.1}>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-dark/5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-sm text-charcoal/60 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <FadeIn delay={0.3}>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-dark/5 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-charcoal/5 bg-gradient-to-r from-emerald-50 to-white">
              <h2 className="text-lg font-bold text-emerald-dark flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Edit English Data
              </h2>
              <p className="text-sm text-charcoal/60 mt-1">Manage global English content and specific items.</p>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <p className="text-charcoal/70 mb-6 text-sm">
                Update the English version of achievements, improvements, labels, and accordion sections. This data powers the English view of your portal.
              </p>
              <Link href={`/dashboard/${location}/english`} className="inline-flex items-center justify-between w-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal font-medium px-4 py-3 rounded-xl transition-colors">
                <span>Go to English Editor</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-dark/5 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-charcoal/5 bg-gradient-to-r from-gold/10 to-white">
              <h2 className="text-lg font-bold text-emerald-dark flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold"></span>
                Edit Urdu Data
              </h2>
              <p className="text-sm text-charcoal/60 mt-1">Manage global Urdu content and specific items.</p>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <p className="text-charcoal/70 mb-6 text-sm">
                Update the Urdu version of achievements, improvements, labels, and accordion sections. This data powers the Urdu view of your portal.
              </p>
              <Link href={`/dashboard/${location}/urdu`} className="inline-flex items-center justify-between w-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal font-medium px-4 py-3 rounded-xl transition-colors">
                <span>Go to Urdu Editor</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
