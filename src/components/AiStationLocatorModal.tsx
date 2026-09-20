import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Search,
  MapPin,
  Building2,
  CheckCircle2,
  Plus,
  Compass,
  Filter,
  Flame,
  Printer,
  Share2,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Layers,
  Check
} from 'lucide-react';
import { CNGStation } from '../types';
import { BRANDS_INFO, BrandType, CompanyBrandBadge } from './CompanyBrandBadges';

interface AiStationLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStations: (stations: CNGStation[]) => void;
  existingStations: CNGStation[];
}

const EGYPT_GOVERNORATES = [
  'كافة المحافظات',
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'القليوبية',
  'الشرقية',
  'الدقهلية',
  'الغربية',
  'المنوفية',
  'البحيرة',
  'كفر الشيخ',
  'دمياط',
  'بورسعيد',
  'الإسماعيلية',
  'السويس',
  'البحر الأحمر',
  'جنوب سيناء',
  'شمال سيناء',
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'مطروح',
  'الوادي الجديد'
];

export const AiStationLocatorModal: React.FC<AiStationLocatorModalProps> = ({
  isOpen,
  onClose,
  onAddStations,
  existingStations
}) => {
  const [query, setQuery] = useState('');
  const [governorate, setGovernorate] = useState('كافة المحافظات');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CNGStation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchSource, setSearchSource] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    setAddedNotice(null);

    try {
      const res = await fetch('/api/search-stations-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          governorate: governorate === 'كافة المحافظات' ? '' : governorate,
          brand: selectedBrand === 'all' ? '' : selectedBrand
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.stations)) {
          setResults(data.stations);
          setSearchSource(data.source === 'gemini_ai_locator' ? 'محرك الذكاء الاصطناعي Gemini 2.5' : 'أطلس محطات الجمهورية الجغرافي المعتمد');
          // Select all by default for easy batch add
          setSelectedIds(new Set(data.stations.map((s: CNGStation) => s.id)));
        } else {
          setResults([]);
        }
      }
    } catch (err) {
      console.error('Error during AI station search:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectStation = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === results.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(results.map(r => r.id)));
    }
  };

  const handleAddSelected = () => {
    const stationsToAdd = results.filter(r => selectedIds.has(r.id));
    if (stationsToAdd.length === 0) return;

    onAddStations(stationsToAdd);
    setAddedNotice(`تم بنجاح إضافة ${stationsToAdd.length} محطة حقيقية إلى شبكة المنظومة!`);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleShareWhatsApp = () => {
    const activeResults = results.filter(r => selectedIds.has(r.id));
    if (activeResults.length === 0) return;

    const listText = activeResults.slice(0, 8).map((st, i) => 
      `${i + 1}. *${st.name}* (${st.company})\n   📍 ${st.city}، ${st.governorate}\n   🛰️ الإحداثيات: ${st.lat.toFixed(5)}, ${st.lng.toFixed(5)}\n   🔗 https://www.google.com/maps?q=${st.lat},${st.lng}\n   ⛽ موزعات الغاز: ${st.dispenserCount}`
    ).join('\n\n');

    const text = `*نتائج البحث الذكي عن محطات الوقود والغاز الطبيعي في مصر • كارجاس NGV*
🔍 الاستعلام: ${query || 'كافة المحطات'} | المحافظة: ${governorate}
📊 عدد المحطات المستخرجة: ${activeResults.length} محطة

${listText}

${activeResults.length > 8 ? `\n... بالإضافة إلى ${activeResults.length - 8} محطة أخرى مسجلة بالإحداثيات.` : ''}

مستخرج عبر منظومة كارجاس الرقمية لإدارة المشروعات والمواقع الميدانية.`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none print:bg-white print:text-black">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  البحث بالذكاء الاصطناعي عن محطات الوقود والغاز في كافة أنحاء الجمهورية
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30">
                  AI GIS Locator
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تحديد مواقع ومحطات الوقود والغاز الطبيعي الفعلية مع إحداثيات GPS الدقيقة لتمكين استبدال البيانات التجريبية ببيانات واقعية.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="تراجع والعودة إلى لوحة الإدارة"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>تراجع / عودة</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Controls Form */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 space-y-4 print:hidden">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Text Search Input */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث باسم المحطة، الطريق، المدينة (مثال: محطة رمسيس، الطريق الدائري)..."
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Governorate Dropdown */}
              <div className="sm:col-span-3">
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  {EGYPT_GOVERNORATES.map(gov => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="sm:col-span-2">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="all">كافة الشركات</option>
                  <option value="cargas">كارجاس (Cargas)</option>
                  <option value="gastec">غازتك (Gastec)</option>
                  <option value="chillout">تشيل آوت / وطنية</option>
                  <option value="mastergas">ماستر جاس</option>
                  <option value="taqa">طاقة غاز</option>
                  <option value="misr_petroleum">مصر للبترول</option>
                  <option value="coop">التعاون للبترول</option>
                  <option value="totalenergies">توتال إنرجيز</option>
                  <option value="mobil">موبيل</option>
                  <option value="shell">شيل</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جارِ البحث...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>بحث ذكي</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">اقتراحات شائعة:</span>
              {[
                { label: 'محطات كارجاس بالقاهرة والجيزة', gov: 'القاهرة', q: 'كارجاس' },
                { label: 'محطات الإسكندرية والساحل', gov: 'الإسكندرية', q: 'محطة' },
                { label: 'محطات الدلتا (طنطا والمنصورة وبنها)', gov: 'الغربية', q: 'غاز' },
                { label: 'محطات الصعيد (أسيوط والمنيا وقنا)', gov: 'أسيوط', q: 'غاز طبيعي' },
                { label: 'محطات مدن القناة (السويس وبورسعيد)', gov: 'بورسعيد', q: 'محطة' }
              ].map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setGovernorate(pill.gov);
                    setQuery(pill.q);
                    setTimeout(() => handleSearch(), 50);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-purple-300 border border-slate-700 text-[11px] transition-colors cursor-pointer"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {addedNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-between animate-fade-in shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{addedNotice}</span>
              </div>
            </div>
          )}

          {/* Results Summary Bar */}
          {hasSearched && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-300 font-bold">
                  تم العثور على <strong className="text-purple-400 font-mono text-sm">{results.length}</strong> محطة حقيقية
                </span>
                {searchSource && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">
                    المصدر: {searchSource}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  {selectedIds.size === results.length ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
                </button>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  disabled={selectedIds.size === 0}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer shadow"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>إرسال بالواتساب ({selectedIds.size})</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة النتائج</span>
                </button>
              </div>
            </div>
          )}

          {/* Initial state before search */}
          {!hasSearched && !isLoading && (
            <div className="text-center py-16 px-4 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto shadow-inner">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">
                محرك الذكاء الاصطناعي لتحديد محطات الوقود والغاز في مصر
              </h4>
              <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
                اضغط على "بحث ذكي" أو اختر محافظة لبدء استخراج بيانات محطات الوقود والغاز الطبيعي الحقيقية المسجلة بالإحداثيات المعتمدة، ثم حدد المحطات لاستبدال البيانات التجريبية فوراً.
              </p>
              <button
                type="button"
                onClick={() => handleSearch()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>استكشاف محطات الجمهورية الآن</span>
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-300">جارِ مسح إحداثيات ومواقع المحطات بالذكاء الاصطناعي...</p>
              <p className="text-xs text-slate-500">استخراج خطوط الطول والعرض، ونقاط التموين، ومراكز التحويل المعتمدة</p>
            </div>
          )}

          {/* Stations List */}
          {hasSearched && !isLoading && results.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              لم يتم العثور على محطات متطابقة مع شروط البحث. يرجى تجربة كلمات بحث أخرى أو اختيار "كافة المحافظات".
            </div>
          )}

          {hasSearched && !isLoading && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {results.map((st) => {
                const isSelected = selectedIds.has(st.id);
                const isAlreadyPresent = existingStations.some(
                  es => es.name === st.name || (Math.abs(es.lat - st.lat) < 0.001 && Math.abs(es.lng - st.lng) < 0.001)
                );

                return (
                  <div
                    key={st.id}
                    onClick={() => toggleSelectStation(st.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none relative ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500/70 shadow-lg shadow-purple-900/20'
                        : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800'
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-slate-900 border-slate-700 text-transparent'
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="text-sm font-black text-white line-clamp-1">{st.name}</h5>
                          <span className="text-xs text-purple-300 font-semibold">{st.company}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isAlreadyPresent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                            مضافة بالفعل
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700 font-bold">
                          {st.governorate}
                        </span>
                      </div>
                    </div>

                    {/* Address */}
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 mb-2.5 pr-8">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="line-clamp-1">{st.address}</span>
                    </p>

                    {/* Meta Specs */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2 font-mono text-emerald-400">
                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{st.lat.toFixed(5)}, {st.lng.toFixed(5)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">
                          ⛽ <strong>{st.dispenserCount}</strong> موزعات
                        </span>
                        {st.hasConversionCenter && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                            مركز تحويل
                          </span>
                        )}
                        <a
                          href={`https://www.google.com/maps?q=${st.lat},${st.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded text-cyan-400 hover:text-cyan-300 hover:bg-slate-700/80 transition-colors"
                          title="فتح الموقع في خرائط Google"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-400">
            {selectedIds.size > 0 ? (
              <span>
                تم اختيار <strong className="text-white font-bold">{selectedIds.size}</strong> محطة للإضافة المباشرة إلى المنظومة.
              </span>
            ) : (
              <span>حدد المحطات المطلوب استبدالها أو إضافتها لشبكة البيانات الحقيقية.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleAddSelected}
              disabled={selectedIds.size === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة المحطات الحقيقية المحددة ({selectedIds.size})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
