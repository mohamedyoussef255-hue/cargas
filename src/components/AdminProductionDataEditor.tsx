import React, { useState } from 'react';
import {
  Layers,
  Edit3,
  Plus,
  Trash2,
  MapPin,
  Compass,
  CheckCircle2,
  X,
  Search,
  Filter,
  Sparkles,
  Building2,
  Car,
  RotateCcw,
  Share2,
  Printer,
  ExternalLink,
  Save,
  Check,
  AlertTriangle,
  Flame,
  Wrench,
  Gauge
} from 'lucide-react';
import { CNGStation, MonitoringSession, VehicleType, VEHICLE_TYPES, FacilityType } from '../types';
import { BRANDS_INFO, BrandType, CompanyBrandBadge } from './CompanyBrandBadges';
import { AiStationLocatorModal } from './AiStationLocatorModal';

interface AdminProductionDataEditorProps {
  stations: CNGStation[];
  onUpdateStations: (updated: CNGStation[]) => void;
  sessions: MonitoringSession[];
  onUpdateSessions: (updated: MonitoringSession[]) => void;
  onBack?: () => void;
}

export const AdminProductionDataEditor: React.FC<AdminProductionDataEditorProps> = ({
  stations,
  onUpdateStations,
  sessions,
  onUpdateSessions,
  onBack
}) => {
  const [activeSection, setActiveSection] = useState<'stations' | 'sessions'>('stations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGov, setSelectedGov] = useState('all');

  // Edit Modal States
  const [editingStation, setEditingStation] = useState<CNGStation | null>(null);
  const [isAddingNewStation, setIsAddingNewStation] = useState(false);
  const [editingSession, setEditingSession] = useState<MonitoringSession | null>(null);
  const [isAiLocatorOpen, setIsAiLocatorOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filtered stations
  const filteredStations = stations.filter(st => {
    const matchGov = selectedGov === 'all' || st.governorate.includes(selectedGov) || selectedGov.includes(st.governorate);
    const matchQuery = !searchQuery || 
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGov && matchQuery;
  });

  // Filtered sessions
  const filteredSessions = sessions.filter(s => {
    const matchGov = selectedGov === 'all' || s.governorate.includes(selectedGov) || selectedGov.includes(s.governorate);
    const matchQuery = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.surveyorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGov && matchQuery;
  });

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Station Handlers
  const handleSaveStation = (stationToSave: CNGStation) => {
    let updated: CNGStation[];
    const exists = stations.some(s => s.id === stationToSave.id);
    if (exists) {
      updated = stations.map(s => s.id === stationToSave.id ? stationToSave : s);
      notify(`تم تحديث بيانات المحطة: "${stationToSave.name}" بنجاح!`);
    } else {
      updated = [stationToSave, ...stations];
      notify(`تمت إضافة المحطة الحقيقية: "${stationToSave.name}" بنجاح!`);
    }
    onUpdateStations(updated);
    setEditingStation(null);
    setIsAddingNewStation(false);
  };

  const handleDeleteStation = (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من حذف المحطة: "${name}"؟`)) {
      const updated = stations.filter(s => s.id !== id);
      onUpdateStations(updated);
      notify(`تم حذف المحطة: "${name}".`);
    }
  };

  // Session Handlers
  const handleSaveSession = (sessionToSave: MonitoringSession) => {
    const updated = sessions.map(s => s.id === sessionToSave.id ? sessionToSave : s);
    onUpdateSessions(updated);
    notify(`تم حفظ وتحديث بيانات الجلسة: "${sessionToSave.title}" بنجاح!`);
    setEditingSession(null);
  };

  const handleDeleteSession = (id: string, title: string) => {
    if (window.confirm(`هل أنت متأكد من حذف موقع الرصد: "${title}"؟`)) {
      const updated = sessions.filter(s => s.id !== id);
      onUpdateSessions(updated);
      notify(`تم حذف موقع الرصد: "${title}".`);
    }
  };

  // Batch AI Stations Add
  const handleBatchAddAiStations = (newStations: CNGStation[]) => {
    // Merge avoiding duplicates by coordinates or exact name
    const existingIds = new Set(stations.map(s => s.id));
    const toAdd = newStations.filter(ns => !existingIds.has(ns.id));
    const merged = [...toAdd, ...stations];
    onUpdateStations(merged);
    notify(`تم بنجاح إضافة ${toAdd.length} محطة حقيقية عبر الذكاء الاصطناعي!`);
  };

  // WhatsApp Sharing
  const handleShareWhatsApp = () => {
    if (activeSection === 'stations') {
      const text = `*بيانات شبكة محطات الوقود والغاز الطبيعي الفعلية • كارجاس NGV*
إجمالي المحطات المسجلة: ${stations.length} محطة

أبرز المحطات:
${stations.slice(0, 6).map((st, i) => `${i + 1}. *${st.name}* (${st.company})\n   📍 ${st.city}، ${st.governorate} | ⛽ ${st.dispenserCount} موزعات\n   🛰️ ${st.lat.toFixed(5)}, ${st.lng.toFixed(5)}`).join('\n\n')}

بيانات معتمدة من لوحة تحكم مدير منظومة كارجاس.`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      const text = `*بيانات مواقع وجلسات الرصد الميداني ودراسات الجدوى • كارجاس NGV*
إجمالي المواقع المسجلة: ${sessions.length} موقع

أبرز المواقع:
${sessions.slice(0, 6).map((s, i) => `${i + 1}. *${s.code} - ${s.title}*\n   📍 ${s.locationName}، ${s.governorate}\n   👷 المعاين: ${s.surveyorName} | 🚗 المركبات: ${s.totalVehicles || Object.values(s.counts).reduce((a, b) => a + b, 0)} مركبة`).join('\n\n')}

بيانات معتمدة من لوحة تحكم مدير منظومة كارجاس.`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Navigation & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-white">
                لوحة تعديل واستبدال البيانات التجريبية ببيانات واقعية
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                إدارة الإنتاج الفعلي
              </span>
            </div>
            <p className="text-xs text-slate-400">
              تتيح لمدير المنظومة التعديل المباشر على كافة المحطات والمواقع المسجلة أو تغييرها، وتحديث إحداثيات GPS، واستبدال النماذج الافتراضية ببيانات حقيقية ميدانية، والبحث بالذكاء الاصطناعي.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all cursor-pointer shadow"
                title="تراجع والعودة إلى لوحة تحكم الإدارة"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>تراجع / عودة</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAiLocatorOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>بحث بالذكاء الاصطناعي عن محطات مصر</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow"
            >
              <Share2 className="w-4 h-4" />
              <span>إرسال بالواتساب</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / PDF</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-800 border border-slate-700">
            <button
              type="button"
              onClick={() => setActiveSection('stations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSection === 'stations'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>محطات الوقود والغاز ({stations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('sessions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeSection === 'sessions'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>مواقع وجلسات الرصد ({sessions.length})</span>
            </button>
          </div>

          {/* Quick Add Button */}
          {activeSection === 'stations' ? (
            <button
              type="button"
              onClick={() => {
                setEditingStation({
                  id: 'st-real-' + Date.now(),
                  name: '',
                  company: 'كارجاس (Cargas)',
                  brand: 'cargas',
                  governorate: 'الجيزة',
                  city: 'الهرم',
                  address: '',
                  lat: 29.9880,
                  lng: 31.1350,
                  dispenserCount: 8,
                  hasConversionCenter: true,
                  facilityType: 'integrated',
                  status: 'active',
                  notes: 'محطة حقيقية مسجلة حديثاً بالمنظومة'
                });
                setIsAddingNewStation(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة محطة حقيقية يدوياً</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-mono">
              اضغط على "تعديل" على أي جلسة لاستبدال بياناتها ببيانات حقيقية
            </span>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeSection === 'stations' ? "ابحث باسم المحطة أو الشركة أو العنوان..." : "ابحث باسم الجلسة أو الكود أو الموقع..."}
              className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedGov}
              onChange={(e) => setSelectedGov(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">كافة المحافظات ({activeSection === 'stations' ? stations.length : sessions.length})</option>
              <option value="القاهرة">القاهرة</option>
              <option value="الجيزة">الجيزة</option>
              <option value="الإسكندرية">الإسكندرية</option>
              <option value="القليوبية">القليوبية</option>
              <option value="الشرقية">الشرقية</option>
              <option value="الدقهلية">الدقهلية</option>
              <option value="الغربية">الغربية</option>
              <option value="المنوفية">المنوفية</option>
              <option value="البحيرة">البحيرة</option>
              <option value="دمياط">دمياط</option>
              <option value="بورسعيد">بورسعيد</option>
              <option value="السويس">السويس</option>
              <option value="الإسماعيلية">الإسماعيلية</option>
              <option value="الفيوم">الفيوم</option>
              <option value="بني سويف">بني سويف</option>
              <option value="المنيا">المنيا</option>
              <option value="أسيوط">أسيوط</option>
              <option value="سوهاج">سوهاج</option>
              <option value="قنا">قنا</option>
              <option value="الأقصر">الأقصر</option>
              <option value="أسوان">أسوان</option>
              <option value="البحر الأحمر">البحر الأحمر</option>
              <option value="جنوب سيناء">جنوب سيناء</option>
              <option value="مطروح">مطروح</option>
            </select>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: STATIONS TABLE & DIRECT EDIT                        */}
      {/* ============================================================== */}
      {activeSection === 'stations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
            <span>سجل محطات الوقود والغاز الميدانية المعروضة: ({filteredStations.length})</span>
            <span>انقر على "تعديل" لتحديث الإحداثيات أو الاسم أو الاستبدال</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-850 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">المحطة والشركة</th>
                  <th className="p-3.5">المحافظة والمدينة</th>
                  <th className="p-3.5">العنوان الميداني</th>
                  <th className="p-3.5">إحداثيات GPS</th>
                  <th className="p-3.5">نقاط التموين</th>
                  <th className="p-3.5">مركز تحويل</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">إجراءات المدير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStations.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{st.name}</div>
                      <span className="text-[11px] text-purple-400 font-semibold">{st.company}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-[11px]">
                        {st.governorate}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{st.city}</div>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-slate-400">
                      {st.address}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400 text-[11px]">
                      <div className="flex items-center gap-1">
                        <span>{st.lat.toFixed(5)}, {st.lng.toFixed(5)}</span>
                        <a
                          href={`https://www.google.com/maps?q=${st.lat},${st.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 p-1"
                          title="عرض في Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      ⛽ {st.dispenserCount}
                    </td>
                    <td className="p-3.5">
                      {st.hasConversionCenter ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                          ✓ نعم
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">لا</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        st.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        st.status === 'proposed' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {st.status === 'active' ? 'نشطة' : st.status === 'proposed' ? 'مقترحة' : 'صيانة'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingStation(st)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold transition-all cursor-pointer"
                          title="تعديل بيانات المحطة واستبدالها"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStation(st.id, st.name)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                          title="حذف المحطة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: SESSIONS TABLE & DIRECT EDIT                        */}
      {/* ============================================================== */}
      {activeSection === 'sessions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
            <span>سجل مواقع الرصد ودراسات الجدوى الميدانية: ({filteredSessions.length})</span>
            <span>تعديل مباشر على بيانات المواقع والرصد واستبدال النماذج التجريبية</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-850 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">كود وموقع الجلسة</th>
                  <th className="p-3.5">المحافظة والمدينة</th>
                  <th className="p-3.5">المعاين والباحث</th>
                  <th className="p-3.5">إحداثيات GPS</th>
                  <th className="p-3.5">إجمالي السيارات</th>
                  <th className="p-3.5">ملاكي / تاكسي / ميكروباص</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">إجراءات المدير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                        {s.code}
                      </span>
                      <div className="font-bold text-white text-sm mt-1">{s.title}</div>
                      <div className="text-[11px] text-slate-400">{s.locationName}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-bold text-[11px]">
                        {s.governorate}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.city}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-300">
                      {s.surveyorName}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400 text-[11px]">
                      <div className="flex items-center gap-1">
                        <span>{s.coordinates.lat.toFixed(5)}, {s.coordinates.lng.toFixed(5)}</span>
                        <a
                          href={`https://www.google.com/maps?q=${s.coordinates.lat},${s.coordinates.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 p-1"
                          title="عرض في Google Maps"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold font-mono text-emerald-400 text-sm">
                      {(s.totalVehicles || Object.values(s.counts).reduce((a, b) => a + b, 0)).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-300">
                      <div>ملاكي: {s.counts.private || 0}</div>
                      <div>تاكسي: {s.counts.taxi || 0} | ميكروباص: {s.counts.microbus || 0}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        s.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {s.status === 'completed' ? 'مكتملة' : s.status === 'active' ? 'نشطة' : 'معلقة'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingSession(s)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                          title="تعديل بيانات جلسة الرصد واستبدالها"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(s.id, s.title)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                          title="حذف الجلسة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT STATION DETAILS                                    */}
      {/* ============================================================== */}
      {editingStation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-slate-900 border border-slate-700/90 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-6 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-purple-400" />
                <h3 className="font-bold text-lg text-white">
                  {isAddingNewStation ? 'إضافة محطة وقود وغاز حقيقية' : `تعديل بيانات المحطة: ${editingStation.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setEditingStation(null); setIsAddingNewStation(false); }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveStation(editingStation);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المحطة الرسمي *</label>
                  <input
                    type="text"
                    required
                    value={editingStation.name}
                    onChange={(e) => setEditingStation({ ...editingStation, name: e.target.value })}
                    placeholder="مثال: محطة كارجاس - ميدان الجيزة"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الشركة المشغلة</label>
                  <input
                    type="text"
                    value={editingStation.company}
                    onChange={(e) => setEditingStation({ ...editingStation, company: e.target.value })}
                    placeholder="كارجاس (Cargas) / غازتك / تشيل آوت"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المحافظة</label>
                  <input
                    type="text"
                    value={editingStation.governorate}
                    onChange={(e) => setEditingStation({ ...editingStation, governorate: e.target.value })}
                    placeholder="مثال: الجيزة"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المدينة أو المركز</label>
                  <input
                    type="text"
                    value={editingStation.city}
                    onChange={(e) => setEditingStation({ ...editingStation, city: e.target.value })}
                    placeholder="مثال: الدقي"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">العنوان التفصيلي وموقع الطريق</label>
                  <input
                    type="text"
                    value={editingStation.address}
                    onChange={(e) => setEditingStation({ ...editingStation, address: e.target.value })}
                    placeholder="مثال: شارع التحرير تقاطع شارع الدقي بجوار محطة المترو"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">خط العرض (Latitude)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={editingStation.lat}
                    onChange={(e) => setEditingStation({ ...editingStation, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-emerald-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">خط الطول (Longitude)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={editingStation.lng}
                    onChange={(e) => setEditingStation({ ...editingStation, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-emerald-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">عدد نقاط التموين (Dispensers)</label>
                  <input
                    type="number"
                    min="1"
                    max="32"
                    value={editingStation.dispenserCount}
                    onChange={(e) => setEditingStation({ ...editingStation, dispenserCount: parseInt(e.target.value, 10) || 4 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">نوع المنشأة</label>
                  <select
                    value={editingStation.facilityType}
                    onChange={(e) => setEditingStation({ ...editingStation, facilityType: e.target.value as FacilityType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="fueling_station">محطة تموين غاز طبيعي فقط</option>
                    <option value="conversion_center">مركز تحويل سيارات فقط</option>
                    <option value="integrated">منشأة متكاملة (تموين + تحويل)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingStation.hasConversionCenter}
                      onChange={(e) => setEditingStation({ ...editingStation, hasConversionCenter: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded bg-slate-800 border-slate-700"
                    />
                    <span>يوجد مركز تحويل معتمد بالمحطة</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">حالة المحطة</label>
                  <select
                    value={editingStation.status}
                    onChange={(e) => setEditingStation({ ...editingStation, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="active">نشطة وتعمل حالياً</option>
                    <option value="proposed">مقترحة / قيد الدراسة</option>
                    <option value="maintenance">تحت الصيانة والتطوير</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">ملاحظات تشغيلية وميدانية</label>
                  <textarea
                    rows={2}
                    value={editingStation.notes || ''}
                    onChange={(e) => setEditingStation({ ...editingStation, notes: e.target.value })}
                    placeholder="ملاحظات حول سعة الضاغط، خطوط الإمداد، الكثافة المرورية..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setEditingStation(null); setIsAddingNewStation(false); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ بيانات المحطة الحقيقية</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT SESSION DETAILS                                    */}
      {/* ============================================================== */}
      {editingSession && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-slate-900 border border-slate-700/90 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-6 text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Car className="w-6 h-6 text-emerald-400" />
                <h3 className="font-bold text-lg text-white">
                  تعديل موقع وجلسة الرصد: {editingSession.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSession(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveSession(editingSession);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">كود الجلسة</label>
                  <input
                    type="text"
                    value={editingSession.code}
                    onChange={(e) => setEditingSession({ ...editingSession, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-amber-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم الموقع / المشروع *</label>
                  <input
                    type="text"
                    required
                    value={editingSession.title}
                    onChange={(e) => setEditingSession({ ...editingSession, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم الطريق / المعلم الرئيسي</label>
                  <input
                    type="text"
                    value={editingSession.locationName}
                    onChange={(e) => setEditingSession({ ...editingSession, locationName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المحافظة</label>
                  <input
                    type="text"
                    value={editingSession.governorate}
                    onChange={(e) => setEditingSession({ ...editingSession, governorate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المدينة / الحي</label>
                  <input
                    type="text"
                    value={editingSession.city}
                    onChange={(e) => setEditingSession({ ...editingSession, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم الباحث / المعاين</label>
                  <input
                    type="text"
                    value={editingSession.surveyorName}
                    onChange={(e) => setEditingSession({ ...editingSession, surveyorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">إحداثيات GPS (خط العرض)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={editingSession.coordinates.lat}
                    onChange={(e) => setEditingSession({
                      ...editingSession,
                      coordinates: { ...editingSession.coordinates, lat: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">إحداثيات GPS (خط الطول)</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={editingSession.coordinates.lng}
                    onChange={(e) => setEditingSession({
                      ...editingSession,
                      coordinates: { ...editingSession.coordinates, lng: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-2">أعداد وتصنيف السيارات المرصودة</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['private', 'taxi', 'microbus', 'van', 'minibus', 'pickup', 'bus', 'motorcycle'] as VehicleType[]).map((vType) => (
                      <div key={vType} className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                        <span className="text-[11px] text-slate-400 block mb-1">{VEHICLE_TYPES[vType]?.label || vType}</span>
                        <input
                          type="number"
                          min="0"
                          value={editingSession.counts[vType] || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10) || 0;
                            const newCounts = { ...editingSession.counts, [vType]: val };
                            const newTotal = Object.values(newCounts).reduce((acc, c) => acc + c, 0);
                            setEditingSession({
                              ...editingSession,
                              counts: newCounts,
                              totalVehicles: newTotal
                            });
                          }}
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">أقرب محطة غاز طبيعي منافسة</label>
                  <input
                    type="text"
                    value={editingSession.nearestStation || ''}
                    onChange={(e) => setEditingSession({ ...editingSession, nearestStation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المسافة لأقرب محطة (كم)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingSession.nearestStationDistanceKm || 0}
                    onChange={(e) => setEditingSession({ ...editingSession, nearestStationDistanceKm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ بيانات الجلسة الحقيقية</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Station Locator Modal */}
      <AiStationLocatorModal
        isOpen={isAiLocatorOpen}
        onClose={() => setIsAiLocatorOpen(false)}
        onAddStations={handleBatchAddAiStations}
        existingStations={stations}
      />
    </div>
  );
};
