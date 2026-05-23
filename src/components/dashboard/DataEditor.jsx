'use client';

import { useState } from 'react';
import { Save, Loader2, Image as ImageIcon, FileText, Languages } from 'lucide-react';
import UmoorTable from './UmoorTable';

export default function DataEditor({ initialData, onSave, isSaving, language }) {
  // Deep clone to avoid mutating props directly
  const [data, setData] = useState(JSON.parse(JSON.stringify(initialData)));
  const [activeTab, setActiveTab] = useState('umoors'); // umoors, common, dictionary
  
  const isUrdu = language === 'ur';

  // Ensure database objects are initialized robustly
  if (!data.reportsData) data.reportsData = [];
  if (!data.commonData) {
    data.commonData = { sliderImages: [], accordion: [{ heading: '', content: '' }] };
  }
  if (!data.commonData.accordion || data.commonData.accordion.length === 0) {
    data.commonData.accordion = [{ heading: '', content: '' }];
  }
  if (!data.TAGS_META) data.TAGS_META = {};
  if (!data.uiDictionary) data.uiDictionary = {};

  const handleSave = () => {
    onSave(data);
  };

  // UI Text custom dictionary updates
  const updateDict = (category, key, value) => {
    setData({
      ...data,
      uiDictionary: {
        ...data.uiDictionary,
        [category]: {
          ...data.uiDictionary[category],
          [key]: value
        }
      }
    });
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white focus:ring-2 focus:ring-emerald-dark/20 focus:border-emerald-dark/30 outline-none text-sm transition-all ${
    isUrdu ? 'font-kanz text-right text-base' : 'text-left'
  }`;

  return (
    <div className="flex flex-col h-full bg-cream/30">
      {/* Top sticky bar with tabs and global save button */}
      <div className="flex flex-col sm:flex-row border-b border-charcoal/10 bg-white shrink-0 sm:items-center justify-between px-4 py-2 sm:py-0 gap-3">
        <div className="flex overflow-x-auto scrollbar-none -mb-[1px]">
          <button
            onClick={() => setActiveTab('umoors')}
            className={`px-5 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'umoors'
                ? 'border-emerald-dark text-emerald-dark'
                : 'border-transparent text-charcoal/60 hover:text-charcoal'
            }`}
          >
            <FileText size={16} />
            Umoors &amp; Cities
          </button>
          <button
            onClick={() => setActiveTab('common')}
            className={`px-5 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'common'
                ? 'border-emerald-dark text-emerald-dark'
                : 'border-transparent text-charcoal/60 hover:text-charcoal'
            }`}
          >
            <ImageIcon size={16} />
            Common Data
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-5 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'dictionary'
                ? 'border-emerald-dark text-emerald-dark'
                : 'border-transparent text-charcoal/60 hover:text-charcoal'
            }`}
          >
            <Languages size={16} />
            UI Text (Dictionary)
          </button>
        </div>
        
        <div className="flex items-center self-end sm:self-auto py-2">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-emerald-dark hover:bg-emerald-light text-gold px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-75 disabled:pointer-events-none text-sm"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Main tab content areas */}
      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === 'umoors' && (
          <div className="space-y-6">
            <UmoorTable data={data} onChange={setData} language={language} />
          </div>
        )}

        {activeTab === 'common' && (
          <div className="space-y-6 max-w-4xl">
            {/* Main Page Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-charcoal/8 p-6 space-y-4">
              <div className="border-b border-charcoal/5 pb-3">
                <h3 className="font-bold text-base text-emerald-dark">Main Page Accordion</h3>
                <p className="text-xs text-charcoal/40 mt-0.5">
                  Static information block displayed under the hero section on the public report page.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1.5">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={data.commonData.accordion[0].heading || ''}
                    onChange={(e) => {
                      const newData = { ...data };
                      newData.commonData.accordion[0].heading = e.target.value;
                      setData(newData);
                    }}
                    className={inputClass}
                    placeholder="Enter heading..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1.5">
                    Content
                  </label>
                  <textarea
                    value={data.commonData.accordion[0].content || ''}
                    onChange={(e) => {
                      const newData = { ...data };
                      newData.commonData.accordion[0].content = e.target.value;
                      setData(newData);
                    }}
                    className={`${inputClass} min-h-[120px] resize-none`}
                    placeholder="Enter description content..."
                  />
                </div>
              </div>
            </div>
            
            {/* Global Slider Images */}
            <div className="bg-white rounded-2xl shadow-sm border border-charcoal/8 p-6 space-y-4">
              <div className="border-b border-charcoal/5 pb-3">
                <h3 className="font-bold text-base text-emerald-dark">Global Slider Images</h3>
                <p className="text-xs text-charcoal/40 mt-0.5">
                  Paste external image URLs here to replace the default hero slide gallery. Use one URL per line.
                </p>
              </div>
              <textarea 
                value={data.commonData.sliderImages?.join('\n') || ''} 
                onChange={(e) => {
                  const newData = { ...data };
                  newData.commonData.sliderImages = e.target.value
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  setData(newData);
                }} 
                className="w-full px-4 py-3 rounded-xl border border-charcoal/10 outline-none text-sm font-mono min-h-[180px] focus:ring-2 focus:ring-emerald-dark/20 focus:border-emerald-dark/30 transition-all bg-cream/10" 
                placeholder="https://images.unsplash.com/photo-example-1&#10;https://images.unsplash.com/photo-example-2"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {activeTab === 'dictionary' && (
          <div className="bg-white rounded-2xl shadow-sm border border-charcoal/8 overflow-hidden max-w-4xl">
            <div className="p-5 bg-gradient-to-r from-emerald-50/50 to-white border-b border-charcoal/8">
              <h3 className="font-bold text-emerald-dark text-base">UI Text Customization</h3>
              <p className="text-xs text-charcoal/50 mt-0.5">
                Customize localized labels and static UI messages visible in the report pages.
              </p>
            </div>
            <div className="p-6 space-y-8">
              {Object.entries(data.uiDictionary || {}).map(([category, items]) => (
                <div key={category} className="space-y-4">
                  <h4 className="font-bold text-charcoal/80 text-sm uppercase tracking-wider border-b border-charcoal/5 pb-1">
                    {category}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(items).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <label className="block text-xs font-semibold text-charcoal/45">
                          {key}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateDict(category, key, e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(data.uiDictionary || {}).length === 0 && (
                <p className="text-center text-charcoal/30 py-8 text-sm">
                  No custom dictionary items found for this language.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
