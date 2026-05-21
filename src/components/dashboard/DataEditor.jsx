'use client';

import { useState } from 'react';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function DataEditor({ initialData, onSave, isSaving, language }) {
  // Deep clone to avoid mutating props directly
  const [data, setData] = useState(JSON.parse(JSON.stringify(initialData)));
  const [activeTab, setActiveTab] = useState('umoors'); // umoors, common, dictionary, tags
  
  const isUrdu = language === 'ur';

  // Make sure structure is robust
  if (!data.reportsData) data.reportsData = [];
  if (!data.commonData) data.commonData = { sliderImages: [], accordion: [{ heading: '', content: '' }] };
  if (!data.TAGS_META) data.TAGS_META = {};
  if (!data.uiDictionary) data.uiDictionary = {};

  const handleSave = () => {
    onSave(data);
  };

  const addUmoor = () => {
    setData({
      ...data,
      reportsData: [
        ...data.reportsData,
        {
          id: `umoor-${Date.now()}`,
          name: '',
          accordion: { heading: '', content: '' },
          cities: []
        }
      ]
    });
  };

  const updateUmoor = (index, field, value) => {
    const newReports = [...data.reportsData];
    newReports[index][field] = value;
    setData({ ...data, reportsData: newReports });
  };

  const removeUmoor = (index) => {
    if (confirm('Are you sure you want to delete this Umoor and all its cities?')) {
      const newReports = [...data.reportsData];
      newReports.splice(index, 1);
      setData({ ...data, reportsData: newReports });
    }
  };

  const addCity = (umoorIndex) => {
    const newReports = [...data.reportsData];
    newReports[umoorIndex].cities.push({
      id: `city-${Date.now()}`,
      name: '',
      achievements: [],
      improvements: [],
      images: [],
      accordion: { heading: '', content: '' }
    });
    setData({ ...data, reportsData: newReports });
  };

  const updateCity = (umoorIndex, cityIndex, field, value) => {
    const newReports = [...data.reportsData];
    newReports[umoorIndex].cities[cityIndex][field] = value;
    setData({ ...data, reportsData: newReports });
  };

  const removeCity = (umoorIndex, cityIndex) => {
    if (confirm('Are you sure you want to delete this city?')) {
      const newReports = [...data.reportsData];
      newReports[umoorIndex].cities.splice(cityIndex, 1);
      setData({ ...data, reportsData: newReports });
    }
  };

  const addItem = (umoorIndex, cityIndex, type) => {
    const newReports = [...data.reportsData];
    if (!newReports[umoorIndex].cities[cityIndex][type]) {
      newReports[umoorIndex].cities[cityIndex][type] = [];
    }
    newReports[umoorIndex].cities[cityIndex][type].push({ text: '', tags: [] });
    setData({ ...data, reportsData: newReports });
  };

  const updateItem = (umoorIndex, cityIndex, type, itemIndex, field, value) => {
    const newReports = [...data.reportsData];
    
    if (field === 'tags') {
      // Split by comma and clean up for tags
      value = value.split(',').map(t => t.trim()).filter(Boolean);
    }
    
    newReports[umoorIndex].cities[cityIndex][type][itemIndex][field] = value;
    setData({ ...data, reportsData: newReports });
  };

  const removeItem = (umoorIndex, cityIndex, type, itemIndex) => {
    const newReports = [...data.reportsData];
    newReports[umoorIndex].cities[cityIndex][type].splice(itemIndex, 1);
    setData({ ...data, reportsData: newReports });
  };

  const handleImageUpload = async (e, umoorIndex, cityIndex) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We can use a small local loading state or just wait. For simplicity:
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const uploadData = await res.json();
      
      if (res.ok) {
        const newReports = [...data.reportsData];
        if (!newReports[umoorIndex].cities[cityIndex].images) {
          newReports[umoorIndex].cities[cityIndex].images = [];
        }
        newReports[umoorIndex].cities[cityIndex].images.push(uploadData.url);
        setData({ ...data, reportsData: newReports });
      }
    } catch (error) {
      console.error('Image upload failed', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const removeImage = (umoorIndex, cityIndex, imgIndex) => {
    const newReports = [...data.reportsData];
    newReports[umoorIndex].cities[cityIndex].images.splice(imgIndex, 1);
    setData({ ...data, reportsData: newReports });
  };

  // Very basic dictionary editor
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

  // Helper for RTL input fields
  const inputClass = `w-full px-3 py-2 rounded-lg border border-charcoal/10 bg-white focus:ring-2 focus:ring-emerald-dark/20 outline-none text-sm ${isUrdu ? 'font-kanz text-right text-lg' : 'text-left'}`;

  return (
    <div className="flex flex-col h-full bg-cream/30">
      <div className="flex border-b border-charcoal/10 bg-white shrink-0 overflow-x-auto">
        <button onClick={() => setActiveTab('umoors')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'umoors' ? 'border-emerald-dark text-emerald-dark' : 'border-transparent text-charcoal/60 hover:text-charcoal'}`}>Umoors & Cities</button>
        <button onClick={() => setActiveTab('common')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'common' ? 'border-emerald-dark text-emerald-dark' : 'border-transparent text-charcoal/60 hover:text-charcoal'}`}>Common Data</button>
        <button onClick={() => setActiveTab('dictionary')} className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'dictionary' ? 'border-emerald-dark text-emerald-dark' : 'border-transparent text-charcoal/60 hover:text-charcoal'}`}>UI Text (Dictionary)</button>
        
        <div className="ml-auto p-2 flex items-center">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-emerald-dark hover:bg-emerald-light text-gold px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-70 text-sm"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {activeTab === 'umoors' && (
          <div className="space-y-8">
            {data.reportsData.map((umoor, uIdx) => (
              <div key={umoor.id || uIdx} className="bg-white rounded-xl shadow-sm border border-emerald-dark/10 overflow-hidden">
                <div className="bg-emerald-50/50 p-4 border-b border-emerald-dark/10 flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <label className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1 block">Umoor Name</label>
                    <input type="text" value={umoor.name} onChange={(e) => updateUmoor(uIdx, 'name', e.target.value)} className={inputClass} placeholder="e.g. Umoor Diniyah" />
                  </div>
                  <button onClick={() => removeUmoor(uIdx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-5">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="p-4 bg-white">
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1 block">Main Accordion Heading</label>
                    <input type="text" value={umoor.accordion?.heading || ''} onChange={(e) => {
                      const newAcc = { ...umoor.accordion, heading: e.target.value };
                      updateUmoor(uIdx, 'accordion', newAcc);
                    }} className={inputClass} />
                  </div>
                  <div className="mb-6">
                    <label className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1 block">Main Accordion Content</label>
                    <textarea value={umoor.accordion?.content || ''} onChange={(e) => {
                      const newAcc = { ...umoor.accordion, content: e.target.value };
                      updateUmoor(uIdx, 'accordion', newAcc);
                    }} className={`${inputClass} min-h-[80px]`} />
                  </div>

                  <div className="space-y-4 pl-4 border-l-2 border-charcoal/5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-charcoal/80 text-sm uppercase tracking-wider">Cities</h4>
                      <button onClick={() => addCity(uIdx)} className="text-xs font-bold text-emerald-dark bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                        <Plus size={14} /> Add City
                      </button>
                    </div>

                    {umoor.cities?.map((city, cIdx) => (
                      <div key={city.id || cIdx} className="bg-cream/20 rounded-lg p-4 border border-charcoal/5">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1 block">City Name</label>
                            <input type="text" value={city.name} onChange={(e) => updateCity(uIdx, cIdx, 'name', e.target.value)} className={inputClass} placeholder="e.g. Bhopal" />
                          </div>
                          <button onClick={() => removeCity(uIdx, cIdx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-5">
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Achievements */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Achievements</span>
                            <button onClick={() => addItem(uIdx, cIdx, 'achievements')} className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"><Plus size={12}/> Add</button>
                          </div>
                          <div className="space-y-2">
                            {city.achievements?.map((item, iIdx) => (
                              <div key={iIdx} className="flex gap-2 items-start bg-white p-2 rounded border border-charcoal/5">
                                <div className="flex-1 space-y-2">
                                  <textarea value={item.text} onChange={(e) => updateItem(uIdx, cIdx, 'achievements', iIdx, 'text', e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="Description" />
                                  <input type="text" value={item.tags?.join(', ') || ''} onChange={(e) => updateItem(uIdx, cIdx, 'achievements', iIdx, 'tags', e.target.value)} className={`${inputClass} text-xs py-1`} placeholder="Tags (comma separated)" dir="ltr" />
                                </div>
                                <button onClick={() => removeItem(uIdx, cIdx, 'achievements', iIdx)} className="p-1.5 text-charcoal/40 hover:text-red-500 rounded"><Trash2 size={14}/></button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Improvements */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Improvements</span>
                            <button onClick={() => addItem(uIdx, cIdx, 'improvements')} className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium"><Plus size={12}/> Add</button>
                          </div>
                          <div className="space-y-2">
                            {city.improvements?.map((item, iIdx) => (
                              <div key={iIdx} className="flex gap-2 items-start bg-white p-2 rounded border border-charcoal/5">
                                <div className="flex-1 space-y-2">
                                  <textarea value={item.text} onChange={(e) => updateItem(uIdx, cIdx, 'improvements', iIdx, 'text', e.target.value)} className={`${inputClass} min-h-[60px]`} placeholder="Description" />
                                  <input type="text" value={item.tags?.join(', ') || ''} onChange={(e) => updateItem(uIdx, cIdx, 'improvements', iIdx, 'tags', e.target.value)} className={`${inputClass} text-xs py-1`} placeholder="Tags (comma separated)" dir="ltr" />
                                </div>
                                <button onClick={() => removeItem(uIdx, cIdx, 'improvements', iIdx)} className="p-1.5 text-charcoal/40 hover:text-red-500 rounded"><Trash2 size={14}/></button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Gallery */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Gallery Images</span>
                            <label className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium cursor-pointer">
                              <Plus size={12}/> Upload
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, uIdx, cIdx)} />
                            </label>
                          </div>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {city.images?.map((img, imgIdx) => (
                              <div key={imgIdx} className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 group border border-charcoal/10">
                                <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                <button onClick={() => removeImage(uIdx, cIdx, imgIdx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 size={12}/>
                                </button>
                              </div>
                            ))}
                            {(!city.images || city.images.length === 0) && <div className="text-xs text-charcoal/40 py-2">No images</div>}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            <button onClick={addUmoor} className="w-full py-4 border-2 border-dashed border-emerald-dark/20 rounded-xl text-emerald-dark font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors">
              <Plus size={18} /> Add New Umoor
            </button>
          </div>
        )}

        {activeTab === 'common' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-charcoal/10 p-6">
              <h3 className="font-bold text-lg text-emerald-dark mb-4">Main Page Accordion</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal/80 mb-1.5">Heading</label>
                  <input type="text" value={data.commonData?.accordion?.[0]?.heading || ''} onChange={(e) => {
                    const newData = {...data};
                    if (!newData.commonData.accordion) newData.commonData.accordion = [{}];
                    newData.commonData.accordion[0].heading = e.target.value;
                    setData(newData);
                  }} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal/80 mb-1.5">Content</label>
                  <textarea value={data.commonData?.accordion?.[0]?.content || ''} onChange={(e) => {
                    const newData = {...data};
                    if (!newData.commonData.accordion) newData.commonData.accordion = [{}];
                    newData.commonData.accordion[0].content = e.target.value;
                    setData(newData);
                  }} className={`${inputClass} min-h-[100px]`} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-charcoal/10 p-6">
              <h3 className="font-bold text-lg text-emerald-dark mb-4">Global Slider Images</h3>
              <p className="text-sm text-charcoal/60 mb-4">You can paste external image URLs here to replace the default hero slider.</p>
              <textarea 
                value={data.commonData?.sliderImages?.join('\n') || ''} 
                onChange={(e) => {
                  const newData = {...data};
                  newData.commonData.sliderImages = e.target.value.split('\n').map(s => s.trim()).filter(Boolean);
                  setData(newData);
                }} 
                className="w-full px-4 py-3 rounded-xl border border-charcoal/10 outline-none text-sm font-mono min-h-[150px]" 
                placeholder="https://image1.jpg&#10;https://image2.jpg"
                dir="ltr"
              />
            </div>
          </div>
        )}

        {activeTab === 'dictionary' && (
          <div className="bg-white rounded-xl shadow-sm border border-charcoal/10 overflow-hidden">
            <div className="p-4 bg-charcoal/5 border-b border-charcoal/10">
              <h3 className="font-bold text-charcoal">UI Text Customization</h3>
              <p className="text-sm text-charcoal/60">Customize the labels and static text for this language.</p>
            </div>
            <div className="p-6 space-y-6">
              {Object.entries(data.uiDictionary || {}).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-bold text-emerald-dark capitalize mb-3 border-b border-charcoal/5 pb-2">{category}</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(items).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-charcoal/50 mb-1">{key}</label>
                        <input type="text" value={value} onChange={(e) => updateDict(category, key, e.target.value)} className={inputClass} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
