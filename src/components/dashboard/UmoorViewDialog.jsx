'use client';

import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import Dialog from '../ui/Dialog';

export default function UmoorViewDialog({ open, onClose, umoor, language }) {
  if (!umoor) return null;

  const isUrdu = language === 'ur';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={umoor.name || 'Untitled Umoor'}
      subtitle={`${umoor.cities?.length || 0} cities · ${(umoor.cities || []).reduce(
        (s, c) => s + (c.achievements?.length || 0),
        0
      )} achievements · ${(umoor.cities || []).reduce(
        (s, c) => s + (c.improvements?.length || 0),
        0
      )} improvements`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Accordion info */}
        {(umoor.accordion?.heading || umoor.accordion?.content) && (
          <div className="bg-gradient-to-br from-emerald-50/70 to-gold/5 rounded-xl p-5 border border-emerald-dark/8">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-dark/10 flex items-center justify-center shrink-0 mt-0.5">
                <FileText size={16} className="text-emerald-dark" />
              </div>
              <div className={isUrdu ? 'font-kanz text-right flex-1' : 'flex-1'}>
                {umoor.accordion.heading && (
                  <h4 className="font-bold text-emerald-dark text-sm mb-1">
                    {umoor.accordion.heading}
                  </h4>
                )}
                {umoor.accordion.content && (
                  <p className="text-charcoal/60 text-sm leading-relaxed whitespace-pre-wrap">
                    {umoor.accordion.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cities */}
        {umoor.cities?.length > 0 ? (
          <div className="space-y-4">
            {umoor.cities.map((city, cIdx) => (
              <div
                key={city.id || cIdx}
                className="bg-white rounded-xl border border-charcoal/8 overflow-hidden shadow-sm"
              >
                {/* City header */}
                <div className="px-5 py-3.5 bg-gradient-to-r from-purple-50/60 to-white border-b border-charcoal/5">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-purple-500" />
                    <h4
                      className={`font-bold text-charcoal ${
                        isUrdu ? 'font-kanz text-base' : 'text-sm'
                      }`}
                    >
                      {city.name || 'Untitled City'}
                    </h4>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Achievements */}
                  {city.achievements?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                          Achievements ({city.achievements.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {city.achievements.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 pl-1"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm text-charcoal/75 leading-relaxed ${
                                  isUrdu ? 'font-kanz text-right text-base' : ''
                                }`}
                              >
                                {item.text}
                              </p>
                              {item.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {item.tags.map((tag, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wide"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvements */}
                  {city.improvements?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                          Improvements ({city.improvements.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {city.improvements.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 pl-1"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm text-charcoal/75 leading-relaxed ${
                                  isUrdu ? 'font-kanz text-right text-base' : ''
                                }`}
                              >
                                {item.text}
                              </p>
                              {item.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {item.tags.map((tag, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-700 uppercase tracking-wide"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gallery */}
                  {city.images?.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ImageIcon size={14} className="text-blue-500" />
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                          Gallery ({city.images.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {city.images.map((img, imgIdx) => (
                          <div
                            key={imgIdx}
                            className="aspect-square rounded-lg overflow-hidden border border-charcoal/10 hover:border-blue-300 transition-colors"
                          >
                            <img
                              src={img}
                              alt={`Gallery ${imgIdx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state for a city */}
                  {(!city.achievements || city.achievements.length === 0) &&
                    (!city.improvements || city.improvements.length === 0) &&
                    (!city.images || city.images.length === 0) && (
                      <p className="text-sm text-charcoal/30 text-center py-4">
                        No data recorded for this city.
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <MapPin size={32} className="mx-auto text-charcoal/15 mb-3" />
            <p className="text-charcoal/40 text-sm">
              No cities have been added to this umoor yet.
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
}
