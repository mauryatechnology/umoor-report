'use client';

import { useState, useEffect, use } from 'react';
import { Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import DataEditor from '../../../../components/dashboard/DataEditor';

export default function EnglishEditor({ params }) {
  const { location } = use(params);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/reports/${location}`);
        if (res.ok) {
          const resData = await res.json();
          // Initialize with default structure if empty
          setData(resData.report.reportsDataEn || {
            reportsData: [],
            commonData: { sliderImages: [], accordion: [{ heading: '', content: '' }] },
            TAGS_META: {},
            uiDictionary: {}
          });
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
        setMessage({ type: 'error', text: 'Failed to load data.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [location]);

  const handleSave = async (updatedData) => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    // Optimistic update
    const previousData = data;
    setData(updatedData);

    try {
      const res = await fetch(`/api/reports/${location}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'en',
          data: updatedData
        }),
      });

      if (!res.ok) throw new Error('Failed to save');
      
      setMessage({ type: 'success', text: 'Changes saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Save error:', error);
      setData(previousData); // Rollback
      setMessage({ type: 'error', text: 'Failed to save changes. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-emerald-dark/5 sticky top-0 z-30">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-dark font-heading flex items-center gap-2">
            English Data Editor
          </h1>
          <p className="text-sm text-charcoal/60 mt-1">Manage content for the English view of your report.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {message.text && (
            <span className={`text-sm flex items-center gap-1.5 font-medium ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </span>
          )}
          {/* Note: Save button is handled internally by DataEditor, this header just shows context */}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-emerald-dark/5 overflow-hidden">
        {data && (
          <DataEditor 
            initialData={data} 
            onSave={handleSave} 
            isSaving={isSaving}
            language="en"
          />
        )}
      </div>
    </div>
  );
}
