import React, { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Compass, Calendar, Clock, User, Flame, Check, Radio, Satellite } from 'lucide-react';
import { MonitoringSession, VehicleType, createDefaultVehicleCounts } from '../types';
import { INITIAL_CNG_STATIONS } from '../data/initialData';
import { CargasNgvLogo } from './CargasNgvLogo';
import { 
  getDefaultDepartmentReviews, 
  DEFAULT_SAFETY_ZONING, 
  DEFAULT_CUSTOM_INDICATORS, 
  DEFAULT_CUSTOM_COST_ITEMS 
} from '../data/departmentData';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (newSession: MonitoringSession) => void;
}

const GOVERNORATES = [
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
  'الفيوم',
  'بني سويف',
  'المنيا',
  'أسيوط',
  'سوهاج',
  'قنا',
  'الأقصر',
  'أسوان',
  'البحر الأحمر',
  'مطروح',
];

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  onStartSession,
}) => {
  const [title, setTitle] = useState('جلسة رصد حركة مركبات الغاز - نقطة ميدانية');
  const [governorate, setGovernorate] = useState('الجيزة');
  const [city, setCity] = useState('الهرم');
  const [locationName, setLocationName] = useState('تقاطع شارع فيصل مع طريق المنصورية');
  const [trafficDirection, setTrafficDirection] = useState('طريق رئيسي - اتجاهين');
  const [surveyorName, setSurveyorName] = useState('م. محمد عبد الرحمن');
  const [nearestStation, setNearestStation] = useState('محطة كارجاس - ميدان الرماية والهرم');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 29.9880, lng: 31.1350 });
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [elevation, setElevation] = useState<number | null>(null);
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [autoGpsSuccess, setAutoGpsSuccess] = useState<boolean>(false);
  const [gpsTime, setGpsTime] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Auto-fetch real-time GPS coordinates and timestamp immediately upon modal opening
  useEffect(() => {
    if (!isOpen) return;

    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detectedLat = Number(pos.coords.latitude.toFixed(5));
        const detectedLng = Number(pos.coords.longitude.toFixed(5));
        setCoords({ lat: detectedLat, lng: detectedLng });
        setGpsAccuracy(Math.round(pos.coords.accuracy || 8));
        if (pos.coords.altitude) {
          setElevation(Math.round(pos.coords.altitude));
        }
        setAutoGpsSuccess(true);
        setGpsTime(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsGettingGps(false);
      },
      (err) => {
        console.warn("Auto GPS error:", err);
        setIsGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }, [isOpen]);

  if (!isOpen) return null;

  // Manual GPS Re-sync
  const handleGetGps = () => {
    if (!navigator.geolocation) {
      alert("خاصية تحديد الموقع غير مدعومة في متصفحك");
      return;
    }
    setIsGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        });
        setGpsAccuracy(Math.round(pos.coords.accuracy || 5));
        setAutoGpsSuccess(true);
        setGpsTime(new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsGettingGps(false);
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCode = `CNG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const emptyCounts: Record<VehicleType, number> = createDefaultVehicleCounts();

    const session: MonitoringSession = {
      id: 'session-' + Date.now(),
      code: newCode,
      title: title.trim() || 'جلسة رصد ميداني جديدة',
      locationName: locationName.trim(),
      governorate,
      city: city.trim(),
      coordinates: coords,
      gpsAccuracyMeters: gpsAccuracy ?? 8,
      elevationMeters: elevation ?? 26,
      autoGpsCaptured: true,
      gpsCaptureTimestamp: now,
      nearestStation,
      trafficDirection,
      surveyorName: surveyorName.trim() || 'مهندس الرصد الميداني',
      status: 'active',
      startTime: now,
      durationSeconds: 0,
      counts: emptyCounts,
      detections: [],
      notes: notes.trim(),
      // Pre-initialize departmental evaluations and custom study metrics
      departmentReviews: getDefaultDepartmentReviews(newCode),
      customIndicators: DEFAULT_CUSTOM_INDICATORS,
      customCostItems: DEFAULT_CUSTOM_COST_ITEMS,
      safetyZoning: DEFAULT_SAFETY_ZONING,
    };

    onStartSession(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-slate-100 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <CargasNgvLogo size="sm" showText={false} />
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>بدء جلسة رصد ميداني جديدة</span>
                <span className="text-xs text-amber-400 font-mono">(كارجاس NGV)</span>
              </h3>
              <p className="text-xs text-slate-400">
                تسجيل الموقع والزمن المستهدف لرصد السيارات بالكاميرا
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Session Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              عنوان / مسمى جلسة الرصد
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              placeholder="مثال: رصد محور المشير طنطاوي وموقف الحي العاشر"
            />
          </div>

          {/* Location Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                المحافظة
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                {GOVERNORATES.map(gov => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                المدينة / الحي / المنطقة
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="مثال: مصر الجديدة"
              />
            </div>
          </div>

          {/* Point/Street Location & Auto GPS Indicator */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                الموقع التفصيلي / الشارع / التقاطع
              </label>
              <button
                type="button"
                onClick={handleGetGps}
                disabled={isGettingGps}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                <Navigation className={`w-3 h-3 ${isGettingGps ? 'animate-spin' : ''}`} />
                <span>{isGettingGps ? 'جاري جلب إحداثيات GPS...' : 'تحديث إحداثيات GPS'}</span>
              </button>
            </div>

            {/* Auto GPS Live Status Badge */}
            <div className="mb-2 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-300 font-semibold flex items-center gap-1">
                  <Satellite className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تحديد تلقائي فوري للموقع والزمن:</span>
                </span>
                <span className="font-mono text-emerald-400 text-[11px] bg-slate-900/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  {coords.lat.toFixed(5)}° N, {coords.lng.toFixed(5)}° E
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                {gpsAccuracy && (
                  <span className="bg-slate-900/70 px-2 py-0.5 rounded text-slate-300 font-mono">
                    دقة: ±{gpsAccuracy}م
                  </span>
                )}
                {gpsTime && (
                  <span className="flex items-center gap-1 text-amber-300 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{gpsTime}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 pl-24 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="مثال: ميدان الحصري أمام موقف السرفيس"
              />
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                {coords.lat}, {coords.lng}
              </div>
            </div>
          </div>

          {/* Traffic Direction & Nearest CNG Station */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اتجاه حركة السير المستهدف
              </label>
              <select
                value={trafficDirection}
                onChange={(e) => setTrafficDirection(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="طريق رئيسي - اتجاهين">طريق رئيسي - اتجاهين</option>
                <option value="اتجاه واحد صاعد (كوبري/نفق)">اتجاه واحد صاعد (كوبري/نفق)</option>
                <option value="مدخل مجمع مواقف ركاب">مدخل مجمع مواقف ركاب</option>
                <option value="طريق دائري / سريع">طريق دائري / سريع</option>
                <option value="ميدان وتقاطع محوري">ميدان وتقاطع محوري</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                أقرب محطة غاز طبيعي (CNG)
              </label>
              <select
                value={nearestStation}
                onChange={(e) => setNearestStation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                {INITIAL_CNG_STATIONS.map(st => (
                  <option key={st.id} value={st.name}>
                    {st.name} ({st.governorate})
                  </option>
                ))}
                <option value="محطة أخرى قيد الإنشاء">محطة أخرى قيد الإنشاء</option>
              </select>
            </div>
          </div>

          {/* Surveyor Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              اسم مسؤول الرصد الميداني
            </label>
            <div className="relative">
              <input
                type="text"
                value={surveyorName}
                onChange={(e) => setSurveyorName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="اسم المهندس أو الباحث الميداني"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ملاحظات موقع الرصد الميداني (اختياري)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              placeholder="مثال: رصد خلال ساعة الذروة الصباحية مع تركيز على سيارات الأجرة والميكروباص"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>بدء الجلسة وفتح الكاميرا</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
