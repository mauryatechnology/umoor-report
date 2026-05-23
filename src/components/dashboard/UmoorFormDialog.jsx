'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  MapPin,
  Save,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import Dialog from '../ui/Dialog';

const emptyUmoor = () => ({
  id: `umoor-${Date.now()}`,
  name: '',
  accordion: { heading: '', content: '' },
  cities: [],
});

const emptyCity = () => ({
  id: `city-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: '',
  achievements: [],
  improvements: [],
  images: [],
  accordion: { heading: '', content: '' },
});

export default function UmoorFormDialog({
  open,
  onClose,
  onSave,
  initialData,
  language,
  isEditing,
}) {
  const [formData, setFormData] = useState(emptyUmoor());
  const [expandedCities, setExpandedCities] = useState({});

  const isUrdu = language === 'ur';
  const inputClass = `w-full px-3 py-2.5 rounded-lg border border-charcoal/10 bg-white focus:ring-2 focus:ring-emerald-dark/20 focus:border-emerald-dark/30 outline-none text-sm transition-all ${
    isUrdu ? 'font-kanz text-right text-base' : 'text-left'
  }`;

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(JSON.parse(JSON.stringify(initialData)));
        // Expand all cities by default in edit mode
        const expanded = {};
        initialData.cities?.forEach((_, i) => {
          expanded[i] = true;
        });
        setExpandedCities(expanded);
      } else {
        setFormData(emptyUmoor());
        setExpandedCities({});
      }
    }
  }, [open, initialData]);

  const toggleCity = (idx) => {
    setExpandedCities((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const addCity = () => {
    const newCities = [...formData.cities, emptyCity()];
    setFormData({ ...formData, cities: newCities });
    setExpandedCities((prev) => ({ ...prev, [newCities.length - 1]: true }));
  };

  const removeCity = (idx) => {
    const newCities = [...formData.cities];
    newCities.splice(idx, 1);
    setFormData({ ...formData, cities: newCities });
  };

  const updateCity = (idx, field, value) => {
    const newCities = [...formData.cities];
    newCities[idx] = { ...newCities[idx], [field]: value };
    setFormData({ ...formData, cities: newCities });
  };

  const addItem = (cityIdx, type) => {
    const newCities = [...formData.cities];
    if (!newCities[cityIdx][type]) newCities[cityIdx][type] = [];
    newCities[cityIdx][type] = [
      ...newCities[cityIdx][type],
      { text: '', tags: [] },
    ];
    setFormData({ ...formData, cities: newCities });
  };

  const updateItem = (cityIdx, type, itemIdx, field, value) => {
    const newCities = [...formData.cities];
    const items = [...newCities[cityIdx][type]];
    if (field === 'tags') {
      value = value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }
    items[itemIdx] = { ...items[itemIdx], [field]: value };
    newCities[cityIdx] = { ...newCities[cityIdx], [type]: items };
    setFormData({ ...formData, cities: newCities });
  };

  const removeItem = (cityIdx, type, itemIdx) => {
    const newCities = [...formData.cities];
    const items = [...newCities[cityIdx][type]];
    items.splice(itemIdx, 1);
    newCities[cityIdx] = { ...newCities[cityIdx], [type]: items };
    setFormData({ ...formData, cities: newCities });
  };

  const handleImageUpload = async (e, cityIdx) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        { method: 'POST', body: file }
      );
      const uploadData = await res.json();

      if (res.ok) {
        const newCities = [...formData.cities];
        if (!newCities[cityIdx].images) newCities[cityIdx].images = [];
        newCities[cityIdx].images = [
          ...newCities[cityIdx].images,
          uploadData.url,
        ];
        setFormData({ ...formData, cities: newCities });
      }
    } catch (error) {
      console.error('Image upload failed', error);
    }
  };

  const removeImage = (cityIdx, imgIdx) => {
    const newCities = [...formData.cities];
    const imgs = [...newCities[cityIdx].images];
    imgs.splice(imgIdx, 1);
    newCities[cityIdx] = { ...newCities[cityIdx], images: imgs };
    setFormData({ ...formData, cities: newCities });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl text-sm font-medium text-charcoal/70 bg-charcoal/5 hover:bg-charcoal/10 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="bg-emerald-dark hover:bg-emerald-light text-gold px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm text-sm"
      >
        <Save size={16} />
        {isEditing ? 'Save Changes' : 'Add Umoor'}
      </button>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Umoor' : 'Add New Umoor'}
      subtitle={
        isEditing
          ? 'Modify the umoor details, cities, and items below.'
          : 'Fill in the details to create a new umoor entry.'
      }
      size="xl"
      footer={footer}
    >
      <div className="space-y-6">
        {/* Umoor basic info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-1.5">
              Umoor Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
              placeholder={isUrdu ? 'مثال: امور دینیہ' : 'e.g. Umoor Diniyah'}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-1.5">
              Accordion Heading
            </label>
            <input
              type="text"
              value={formData.accordion?.heading || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accordion: { ...formData.accordion, heading: e.target.value },
                })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-1.5">
              Accordion Content
            </label>
            <textarea
              value={formData.accordion?.content || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  accordion: { ...formData.accordion, content: e.target.value },
                })
              }
              className={`${inputClass} min-h-[70px] resize-none`}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-charcoal/8 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-purple-500" />
              <h3 className="font-bold text-charcoal text-sm">Cities</h3>
              <span className="text-xs text-charcoal/40 bg-charcoal/5 px-2 py-0.5 rounded-full">
                {formData.cities.length}
              </span>
            </div>
            <button
              onClick={addCity}
              className="text-xs font-bold text-emerald-dark bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Add City
            </button>
          </div>

          <div className="space-y-3">
            {formData.cities.map((city, cIdx) => (
              <div
                key={city.id || cIdx}
                className="border border-charcoal/8 rounded-xl overflow-hidden bg-cream/20"
              >
                {/* City header — collapsible */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-white/60 cursor-pointer hover:bg-white/80 transition-colors"
                  onClick={() => toggleCity(cIdx)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {expandedCities[cIdx] ? (
                      <ChevronDown size={16} className="text-charcoal/40 shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-charcoal/40 shrink-0" />
                    )}
                    <span
                      className={`font-semibold text-sm truncate ${
                        isUrdu ? 'font-kanz text-base' : ''
                      }`}
                    >
                      {city.name || (
                        <span className="italic text-charcoal/30">
                          Untitled City
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2 ml-2 text-xs text-charcoal/40">
                      <span>{city.achievements?.length || 0} ach.</span>
                      <span>·</span>
                      <span>{city.improvements?.length || 0} imp.</span>
                      <span>·</span>
                      <span>{city.images?.length || 0} img.</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCity(cIdx);
                    }}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* City body — expanded */}
                {expandedCities[cIdx] && (
                  <div className="px-4 py-4 space-y-4 border-t border-charcoal/5">
                    {/* City name */}
                    <div>
                      <label className="block text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-1">
                        City Name
                      </label>
                      <input
                        type="text"
                        value={city.name}
                        onChange={(e) =>
                          updateCity(cIdx, 'name', e.target.value)
                        }
                        className={inputClass}
                        placeholder={isUrdu ? 'مثال: بھوپال' : 'e.g. Bhopal'}
                      />
                    </div>

                    {/* Achievements */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                          Achievements
                        </span>
                        <button
                          onClick={() => addItem(cIdx, 'achievements')}
                          className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {city.achievements?.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="flex gap-2 items-start bg-white p-2.5 rounded-lg border border-charcoal/5"
                          >
                            <div className="flex-1 space-y-2">
                              <textarea
                                value={item.text}
                                onChange={(e) =>
                                  updateItem(
                                    cIdx,
                                    'achievements',
                                    iIdx,
                                    'text',
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} min-h-[50px] resize-none`}
                                placeholder="Description"
                              />
                              <input
                                type="text"
                                value={item.tags?.join(', ') || ''}
                                onChange={(e) =>
                                  updateItem(
                                    cIdx,
                                    'achievements',
                                    iIdx,
                                    'tags',
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} text-xs py-1.5`}
                                placeholder="Tags (comma separated)"
                                dir="ltr"
                              />
                            </div>
                            <button
                              onClick={() =>
                                removeItem(cIdx, 'achievements', iIdx)
                              }
                              className="p-1.5 text-charcoal/30 hover:text-red-500 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {(!city.achievements ||
                          city.achievements.length === 0) && (
                          <p className="text-xs text-charcoal/30 py-2 text-center">
                            No achievements added
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Improvements */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                          Improvements
                        </span>
                        <button
                          onClick={() => addItem(cIdx, 'improvements')}
                          className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium"
                        >
                          <Plus size={12} /> Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {city.improvements?.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="flex gap-2 items-start bg-white p-2.5 rounded-lg border border-charcoal/5"
                          >
                            <div className="flex-1 space-y-2">
                              <textarea
                                value={item.text}
                                onChange={(e) =>
                                  updateItem(
                                    cIdx,
                                    'improvements',
                                    iIdx,
                                    'text',
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} min-h-[50px] resize-none`}
                                placeholder="Description"
                              />
                              <input
                                type="text"
                                value={item.tags?.join(', ') || ''}
                                onChange={(e) =>
                                  updateItem(
                                    cIdx,
                                    'improvements',
                                    iIdx,
                                    'tags',
                                    e.target.value
                                  )
                                }
                                className={`${inputClass} text-xs py-1.5`}
                                placeholder="Tags (comma separated)"
                                dir="ltr"
                              />
                            </div>
                            <button
                              onClick={() =>
                                removeItem(cIdx, 'improvements', iIdx)
                              }
                              className="p-1.5 text-charcoal/30 hover:text-red-500 rounded transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {(!city.improvements ||
                          city.improvements.length === 0) && (
                          <p className="text-xs text-charcoal/30 py-2 text-center">
                            No improvements added
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Gallery */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          Gallery Images
                        </span>
                        <label className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium cursor-pointer">
                          <Plus size={12} /> Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, cIdx)}
                          />
                        </label>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {city.images?.map((img, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 group border border-charcoal/10"
                          >
                            <img
                              src={img}
                              alt="Gallery"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeImage(cIdx, imgIdx)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        ))}
                        {(!city.images || city.images.length === 0) && (
                          <div className="text-xs text-charcoal/30 py-2">
                            No images uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {formData.cities.length === 0 && (
              <div className="text-center py-6 text-charcoal/30 text-sm">
                No cities added yet. Click "Add City" to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
