import React, { useState } from 'react';
import { 
  History, 
  MapPin, 
  Clock, 
  Car, 
  Download, 
  ExternalLink, 
  Play, 
  Trash2, 
  Filter, 
  Calendar, 
  Flame, 
  Eye, 
  CheckCircle2, 
  Search,
  Plus,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { MonitoringSession, VEHICLE_TYPES, VehicleType } from '../types';
import { CargasNgvLogo } from './CargasNgvLogo';

interface SessionsListProps {
  sessions: MonitoringSession[];
  onSelectSession: (session: MonitoringSession) => void;
  onResumeSession: (session: MonitoringSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onStartNewSession: () => void;
  onUpdateSession?: (session: MonitoringSession) => void;
}

export const SessionsList: React.FC<SessionsListProps> = ({
  sessions,
  onSelectSession,
  onResumeSession,
  onDeleteSession,
  onStartNewSession,
  onUpdateSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGov, setSelectedGov] = useState<string>('all');
  const [inspectSession, setInspectSession] = useState<MonitoringSession | null>(null);

  // Edit Session State (اسم الجلسة وبياناتها)
  const [editingSession, setEditingSession] = useState<MonitoringSession | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editLocationName, setEditLocationName] = useState<string>('');
  const [editGovernorate, setEditGovernorate] = useState<string>('');
  const [editCity, setEditCity] = useState<string>('');
  const [editSurveyor, setEditSurveyor] = useState<string>('');
  const [editNearestStation, setEditNearestStation] = useState<string>('');
  const [editPrivate, setEditPrivate] = useState<number>(0);
  const [editMicrobus, setEditMicrobus] = useState<number>(0);
  const [editTaxi, setEditTaxi] = useState<number>(0);
  const [editVan, setEditVan] = useState<number>(0);
  const [editPeugeot, setEditPeugeot] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<'active' | 'completed' | 'paused'>('completed');

  const handleOpenEdit = (session: MonitoringSession) => {
    setEditingSession(session);
    setEditTitle(session.title);
    setEditLocationName(session.locationName);
    setEditGovernorate(session.governorate);
    setEditCity(session.city);
    setEditSurveyor(session.surveyorName || '');
    setEditNearestStation(session.nearestStation || '');
    setEditPrivate(session.counts.private || 0);
    setEditMicrobus(session.counts.microbus || 0);
    setEditTaxi(session.counts.taxi || 0);
    setEditVan(session.counts.suzuki_van || 0);
    setEditPeugeot(session.counts.peugeot_station || 0);
    setEditStatus(session.status);
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !onUpdateSession) return;

    const updatedSession: MonitoringSession = {
      ...editingSession,
      title: editTitle.trim() || editingSession.title,
      locationName: editLocationName.trim() || editingSession.locationName,
      governorate: editGovernorate.trim() || editingSession.governorate,
      city: editCity.trim() || editingSession.city,
      surveyorName: editSurveyor.trim() || editingSession.surveyorName,
      nearestStation: editNearestStation.trim() || editingSession.nearestStation,
      status: editStatus,
      counts: {
        ...editingSession.counts,
        private: Number(editPrivate),
        microbus: Number(editMicrobus),
        taxi: Number(editTaxi),
        suzuki_van: Number(editVan),
        peugeot_station: Number(editPeugeot)
      }
    };

    onUpdateSession(updatedSession);
    setEditingSession(null);
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.surveyorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGov = selectedGov === 'all' || s.governorate === selectedGov;
    return matchesSearch && matchesGov;
  });

  // Unique Governorates in sessions
  const governorates = Array.from(new Set(sessions.map((s) => s.governorate)));

  // Format Date
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Format Duration
  const formatDuration = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    if (hours > 0) {
      return `${hours} ساعة و ${mins} دقيقة`;
    }
    return `${mins} دقيقة`;
  };

  // Export to CSV
  const exportToCsv = (session: MonitoringSession) => {
    const total = Object.values(session.counts).reduce((a, b) => a + b, 0);
    const rows = [
      ['كود الجلسة', session.code],
      ['عنوان الجلسة', session.title],
      ['المحافظة', session.governorate],
      ['المدينة', session.city],
      ['الموقع التفصيلي', session.locationName],
      ['إحداثيات GPS', `${session.coordinates.lat}, ${session.coordinates.lng}`],
      ['أقرب محطة غاز طبيعي', session.nearestStation],
      ['مسؤول الرصد', session.surveyorName],
      ['وقت البدء', session.startTime],
      ['المدة الإجمالية (ثواني)', session.durationSeconds],
      ['إجمالي المركبات المرصودة', total],
      ['---', '---'],
      ['نوع المركبة', 'العدد المرصود', 'النسبة المئوية'],
      ['ملاكي', session.counts.private, total > 0 ? `${Math.round((session.counts.private / total) * 100)}%` : '0%'],
      ['أجرة ميكروباص', session.counts.microbus, total > 0 ? `${Math.round((session.counts.microbus / total) * 100)}%` : '0%'],
      ['أجرة تاكسي', session.counts.taxi, total > 0 ? `${Math.round((session.counts.taxi / total) * 100)}%` : '0%'],
      ['سوزوكي فان', session.counts.suzuki_van, total > 0 ? `${Math.round((session.counts.suzuki_van / total) * 100)}%` : '0%'],
      ['بيجو ستيشن', session.counts.peugeot_station, total > 0 ? `${Math.round((session.counts.peugeot_station / total) * 100)}%` : '0%'],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `تقرير_رصد_CNG_${session.code}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner & Header */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CargasNgvLogo size="lg" showText={false} />
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                سجل جلسات الرصد الميداني وحركة المركبات
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              إدارة وتوثيق جلسات الرصد بالكاميرا والتحليل الميداني لمنظومة كارجاس NGV
            </p>
          </div>
        </div>

        <button
          onClick={onStartNewSession}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>بدء جلسة رصد جديدة</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الجلسة، الموقع، أو مسؤول الرصد..."
            className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Governorate Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedGov}
            onChange={(e) => setSelectedGov(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">جميع المحافظات ({sessions.length})</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sessions Cards Grid */}
      {filteredSessions.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-12 text-center text-slate-400">
          <History className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-base font-semibold text-slate-300">لا توجد جلسات رصد مطابقة لمعايير البحث</p>
          <p className="text-xs text-slate-500 mt-1">جرّب تغيير خيارات البحث أو ابدأ جلسة جديدة</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSessions.map((session) => {
            const total = Object.values(session.counts).reduce((a, b) => a + b, 0);
            const commercialCount = session.counts.microbus + session.counts.taxi + session.counts.suzuki_van + session.counts.peugeot_station;
            const commercialPct = total > 0 ? Math.round((commercialCount / total) * 100) : 0;

            return (
              <div
                key={session.id}
                className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Code & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                      {session.code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      session.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                        : 'bg-slate-700/60 text-slate-400 border-slate-600'
                    }`}>
                      {session.status === 'active' ? '● جارية الآن' : 'مكتملة'}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <h3 className="font-bold text-white text-base mb-1.5 line-clamp-1">
                    {session.title}
                  </h3>
                  
                  <div className="space-y-1 text-xs text-slate-300 mb-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{session.locationName} ({session.governorate})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{formatDate(session.startTime)} • ({formatDuration(session.durationSeconds)})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">أقرب محطة: {session.nearestStation}</span>
                    </div>
                  </div>

                  {/* Vehicle Breakdown Pills */}
                  <div className="grid grid-cols-5 gap-1 text-center mb-4">
                    <div className="bg-slate-900/60 rounded-lg p-1.5 border border-slate-800">
                      <span className="text-[10px] text-blue-400 block font-semibold">ملاكي</span>
                      <span className="text-xs font-bold text-white font-mono">{session.counts.private}</span>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-1.5 border border-slate-800">
                      <span className="text-[10px] text-emerald-400 block font-semibold">ميكروباص</span>
                      <span className="text-xs font-bold text-white font-mono">{session.counts.microbus}</span>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-1.5 border border-slate-800">
                      <span className="text-[10px] text-amber-400 block font-semibold">تاكسي</span>
                      <span className="text-xs font-bold text-white font-mono">{session.counts.taxi}</span>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-1.5 border border-slate-800">
                      <span className="text-[10px] text-purple-400 block font-semibold">سوزوكي</span>
                      <span className="text-xs font-bold text-white font-mono">{session.counts.suzuki_van}</span>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-1.5 border border-slate-800">
                      <span className="text-[10px] text-rose-400 block font-semibold">بيجو</span>
                      <span className="text-xs font-bold text-white font-mono">{session.counts.peugeot_station}</span>
                    </div>
                  </div>

                  {/* Total and Target Highlight */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-between text-xs mb-4">
                    <div>
                      <span className="text-slate-400 block text-[10px]">إجمالي المرصود</span>
                      <span className="text-base font-black text-white font-mono">{total} مركبة</span>
                    </div>
                    <div className="text-left">
                      <span className="text-slate-400 block text-[10px]">مستهدف الغاز (نقل/أجرة)</span>
                      <span className="text-base font-black text-emerald-400 font-mono">{commercialPct}%</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* View Details */}
                    <button
                      onClick={() => setInspectSession(session)}
                      className="px-2 py-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
                      title="عرض التقرير التفصيلي"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>عرض</span>
                    </button>

                    {/* Edit Session Name & Data */}
                    <button
                      onClick={() => handleOpenEdit(session)}
                      className="px-2 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="تعديل اسم الجلسة وبياناتها وأعداد المركبات"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>تعديل</span>
                    </button>

                    {/* Export CSV */}
                    <button
                      onClick={() => exportToCsv(session)}
                      className="p-1.5 rounded-lg bg-slate-700/70 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                      title="تصدير بيانات الجلسة CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف الجلسة (${session.code})؟`)) {
                          onDeleteSession(session.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors"
                      title="حذف الجلسة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Open / Resume with Camera */}
                  <button
                    onClick={() => onResumeSession(session)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>مواصلة الرصد</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Session Modal */}
      {inspectSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 my-8 shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {inspectSession.code}
                </span>
                <h3 className="font-bold text-white text-base sm:text-lg">
                  تقرير جلسة الرصد الميداني
                </h3>
              </div>
              <button
                onClick={() => setInspectSession(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕ إغلاق
              </button>
            </div>

            {/* Session Summary Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-800/60 p-4 rounded-2xl border border-slate-700/70">
              <div>
                <span className="text-slate-400 block">عنوان النقطة:</span>
                <strong className="text-white text-sm">{inspectSession.title}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">المحافظة والمنطقة:</span>
                <strong className="text-white text-sm">{inspectSession.locationName} ({inspectSession.governorate} - {inspectSession.city})</strong>
              </div>
              <div>
                <span className="text-slate-400 block">توقيت وبداية الجلسة:</span>
                <span className="text-slate-200">{formatDate(inspectSession.startTime)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">مدة الرصد:</span>
                <span className="text-slate-200">{formatDuration(inspectSession.durationSeconds)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">مسؤول الرصد:</span>
                <span className="text-slate-200">{inspectSession.surveyorName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">أقرب محطة غاز طبيعي:</span>
                <span className="text-emerald-400 font-semibold">{inspectSession.nearestStation}</span>
              </div>
            </div>

            {/* Vehicle Detailed Breakdown Table */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2">توزيع تصنيف السيارات المرصودة</h4>
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-800 text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="p-2.5">نوع السيارة</th>
                      <th className="p-2.5">الوصف التشغيلي</th>
                      <th className="p-2.5 text-center">العدد</th>
                      <th className="p-2.5 text-center">النسبة</th>
                      <th className="p-2.5 text-center">أولوية الغاز</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {(Object.keys(VEHICLE_TYPES) as VehicleType[]).map((typeKey) => {
                      const cfg = VEHICLE_TYPES[typeKey];
                      const count = inspectSession.counts[typeKey] || 0;
                      const total = Object.values(inspectSession.counts).reduce((a, b) => a + b, 0);
                      const pct = total > 0 ? Math.round((count / total) * 100) : 0;

                      return (
                        <tr key={typeKey} className="hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-white">{cfg.label}</td>
                          <td className="p-2.5 text-slate-400">{cfg.subLabel}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-white">{count}</td>
                          <td className="p-2.5 text-center font-mono text-emerald-400">{pct}%</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${cfg.badgeBg} ${cfg.badgeText}`}>
                              {cfg.cngSuitability}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => exportToCsv(inspectSession)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>تصدير ملف CSV</span>
              </button>

              <button
                onClick={() => {
                  onResumeSession(inspectSession);
                  setInspectSession(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" />
                <span>فتح الجلسة في الكاميرا</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Session Name and Data Modal */}
      {editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <form onSubmit={handleSaveEditSubmit} className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-white text-base">
                    تعديل اسم الجلسة وبياناتها
                  </h3>
                  <span className="font-mono text-xs text-blue-400 font-bold">
                    كود الجلسة: {editingSession.code}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSession(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Session Title */}
              <div>
                <label className="text-slate-300 block mb-1 font-bold">اسم / عنوان الجلسة الرئيسي:</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold text-sm"
                  placeholder="مثال: رصد محور المشير - التجمع الخامس..."
                />
              </div>

              {/* Location & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">الموقع التفصيلي:</label>
                  <input
                    type="text"
                    required
                    value={editLocationName}
                    onChange={(e) => setEditLocationName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium"
                    placeholder="اسم الشارع أو الميدان..."
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">المحافظة:</label>
                  <input
                    type="text"
                    required
                    value={editGovernorate}
                    onChange={(e) => setEditGovernorate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium"
                    placeholder="القاهرة، الجيزة..."
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">المدينة / الحي:</label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium"
                    placeholder="مدينة نصر، المعادي..."
                  />
                </div>
              </div>

              {/* Surveyor & Nearest Station */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">مسؤول الرصد الميداني:</label>
                  <input
                    type="text"
                    value={editSurveyor}
                    onChange={(e) => setEditSurveyor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium"
                    placeholder="اسم المهندس / الفني..."
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">أقرب محطة غاز طبيعي:</label>
                  <input
                    type="text"
                    value={editNearestStation}
                    onChange={(e) => setEditNearestStation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-medium"
                    placeholder="محطة كارجاس..."
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-slate-300 block mb-1 font-bold">حالة الجلسة:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'active' | 'completed')}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold"
                >
                  <option value="completed">مكتملة ومحفوظة (Completed)</option>
                  <option value="active">جارية ونشطة الآن (Active)</option>
                </select>
              </div>

              {/* Vehicle Counts Breakdown */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-300 block mb-2 font-bold text-xs">
                  أعداد وتصنيف المركبات المرصودة:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <label className="text-blue-400 block text-[11px] font-bold mb-1">ملاكي:</label>
                    <input
                      type="number"
                      min={0}
                      value={editPrivate}
                      onChange={(e) => setEditPrivate(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center"
                    />
                  </div>

                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <label className="text-emerald-400 block text-[11px] font-bold mb-1">ميكروباص:</label>
                    <input
                      type="number"
                      min={0}
                      value={editMicrobus}
                      onChange={(e) => setEditMicrobus(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center"
                    />
                  </div>

                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <label className="text-amber-400 block text-[11px] font-bold mb-1">أجرة تاكسي:</label>
                    <input
                      type="number"
                      min={0}
                      value={editTaxi}
                      onChange={(e) => setEditTaxi(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center"
                    />
                  </div>

                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <label className="text-purple-400 block text-[11px] font-bold mb-1">سوزوكي فان:</label>
                    <input
                      type="number"
                      min={0}
                      value={editVan}
                      onChange={(e) => setEditVan(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center"
                    />
                  </div>

                  <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                    <label className="text-rose-400 block text-[11px] font-bold mb-1">بيجو ستيشن:</label>
                    <input
                      type="number"
                      min={0}
                      value={editPeugeot}
                      onChange={(e) => setEditPeugeot(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono font-bold text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingSession(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات في الجلسة</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
