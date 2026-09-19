import React, { useState, useEffect } from 'react';
import { X, MapPin, Plus, Building2, Flame, Layers, CheckCircle2, ShieldAlert, Sparkles, Wrench, Compass, Gauge, Car } from 'lucide-react';
import { CNGStation, FacilityType } from '../types';
import { BRANDS_INFO, BrandType, CompanyBrandBadge } from './CompanyBrandBadges';

interface AddStationMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveStation: (station: CNGStation) => void;
  initialCoords?: { lat: number; lng: number } | null;
}

export const AddStationMapModal: React.FC<AddStationMapModalProps> = ({
  isOpen,
  onClose,
  onSaveStation,
  initialCoords
}) => {
  // Tab for organizing the rich marketing & operational fields
  const [activeTab, setActiveTab] = useState<'basic' | 'marketing' | 'operations'>('basic');

  // Basic Info
  const [name, setName] = useState('');
  const [brand, setBrand] = useState<BrandType>('cargas');
  const [facilityType, setFacilityType] = useState<FacilityType>('fueling_station');
  const [governorate, setGovernorate] = useState('الجيزة');
  const [city, setCity] = useState('الهرم');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number>(29.9880);
  const [lng, setLng] = useState<number>(31.1350);
  const [status, setStatus] = useState<'active' | 'proposed' | 'maintenance'>('proposed');
  const [dispenserCount, setDispenserCount] = useState(8);
  const [notes, setNotes] = useState('');

  // Marketing & Field Study Fields
  const [boundaryNorth, setBoundaryNorth] = useState('');
  const [boundarySouth, setBoundarySouth] = useState('');
  const [boundaryEast, setBoundaryEast] = useState('');
  const [boundaryWest, setBoundaryWest] = useState('');
  const [totalAreaM2, setTotalAreaM2] = useState<number>(1800);
  const [landTenure, setLandTenure] = useState<'ownership' | 'usufruct' | 'allocation' | 'lease'>('ownership');
  const [landNature, setLandNature] = useState<'urban_vacant' | 'agricultural' | 'existing_fuel_station' | 'other'>('urban_vacant');
  const [gasGridAvailable, setGasGridAvailable] = useState<boolean>(true);
  const [siteRating, setSiteRating] = useState<'+A' | 'A' | 'B' | 'C'>('+A');

  // Operations & Maintenance Fields
  const [compressorCapacityM3h, setCompressorCapacityM3h] = useState<number>(1500);
  const [compressorCount, setCompressorCount] = useState<number>(2);
  const [gasInletPressureBar, setGasInletPressureBar] = useState<number>(4);
  const [maneuverRating, setManeuverRating] = useState<'excellent' | 'adequate' | 'inadequate' | 'modification_needed'>('excellent');
  const [queueCapacityVehicles, setQueueCapacityVehicles] = useState<number>(14);

  useEffect(() => {
    if (initialCoords) {
      setLat(Number(initialCoords.lat.toFixed(6)));
      setLng(Number(initialCoords.lng.toFixed(6)));
    }
  }, [initialCoords]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const brandMeta = BRANDS_INFO[brand];

    const newStation: CNGStation = {
      id: 'st-' + Date.now(),
      name: name.trim(),
      company: brand === 'cargas' ? 'كارجاس (Cargas)' : `${brandMeta.nameAr} (${brandMeta.nameEn})`,
      brand,
      facilityType,
      governorate,
      city,
      address: address.trim() || `${city}، ${governorate}`,
      lat,
      lng,
      dispenserCount,
      hasConversionCenter: facilityType === 'conversion_center' || facilityType === 'integrated',
      status,
      cngCapacityM3h: compressorCapacityM3h,
      notes: notes.trim(),
      // Marketing fields
      boundaryNorth: boundaryNorth.trim() || undefined,
      boundarySouth: boundarySouth.trim() || undefined,
      boundaryEast: boundaryEast.trim() || undefined,
      boundaryWest: boundaryWest.trim() || undefined,
      totalAreaM2,
      landTenure,
      landNature,
      gasGridAvailable,
      siteRating,
      // Operational & Maintenance fields
      compressorCapacityM3h,
      compressorCount,
      gasInletPressureBar,
      maneuverRating,
      queueCapacityVehicles,
    };

    onSaveStation(newStation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full text-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-base text-white">تثبيت محطة أو موقع جديد على الخريطة</h3>
              <p className="text-xs text-slate-400">ربط اللوجو والموقع الفعلي بقاعدة بيانات التسويق والتشغيل والصيانة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'basic'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>البيانات الأساسية واللوجو</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('marketing')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'marketing'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>التسويق والدراسات الميدانية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('operations')}
            className={`pb-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'operations'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>التشغيل والصيانة الفنية</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {activeTab === 'basic' && (
            <div className="space-y-4">
              
              {/* Station Name */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  اسم المحطة أو الموقع المقترح <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: كارجاس - المنصورية الهرم أو محطة مصر للبترول/كارجاس"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              {/* Company / Brand Selection (All Brands Supported) */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  الشركة المالكة واللوجو المعروض على الخريطة
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(BRANDS_INFO) as BrandType[]).map((bKey) => {
                    const b = BRANDS_INFO[bKey];
                    const isSelected = brand === bKey;
                    return (
                      <button
                        key={bKey}
                        type="button"
                        onClick={() => setBrand(bKey)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-right transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                            : 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        <div 
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: b.primaryColor }}
                        />
                        <div className="truncate">
                          <span className="font-bold text-[11px] block">{b.nameAr}</span>
                          <span className="text-[9px] text-slate-400 font-mono block">{b.nameEn}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Facility Type (Fueling vs Conversion vs Integrated) */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">نوع المنشأة / المركز</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFacilityType('fueling_station')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      facilityType === 'fueling_station'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold'
                        : 'bg-slate-800/40 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Flame className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                    <span>محطة تموين غاز</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFacilityType('conversion_center')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      facilityType === 'conversion_center'
                        ? 'bg-amber-600/20 border-amber-500 text-white font-bold'
                        : 'bg-slate-800/40 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Wrench className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                    <span>مركز تحويل وصيانة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFacilityType('integrated')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      facilityType === 'integrated'
                        ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                        : 'bg-slate-800/40 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                    <span>متكاملة (تموين + تحويل)</span>
                  </button>
                </div>
              </div>

              {/* Coordinates GPS */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-400 text-[11px] font-mono mb-1">خط العرض (Latitude)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] font-mono mb-1">خط الطول (Longitude)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Location Hierarchy */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">المحافظة</label>
                  <input
                    type="text"
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">المركز / الحي</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Address detail */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">العنوان التفصيلي</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="الشارع، العلامات المميزة، التقاطعات..."
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">حالة الموقع / المحطة</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="proposed">موقع مقترح كارجاس تحت الدراسة ⭐</option>
                    <option value="active">محطة قائمة وتعمل حالياً ✅</option>
                    <option value="maintenance">محطة قيد الإنشاء أو الصيانة 🛠️</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">تصنيف الموقع الميداني</label>
                  <select
                    value={siteRating}
                    onChange={(e) => setSiteRating(e.target.value as any)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="+A">+A موقع استراتيجي ومحور رئيسي كثيف</option>
                    <option value="A">A موقع ممتاز تجارياً</option>
                    <option value="B">B موقع متوسط الجدوى</option>
                    <option value="C">C موقع محدود الحركة</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="space-y-4">
              
              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-slate-300 text-xs leading-relaxed">
                <p className="font-bold text-amber-300 mb-0.5">الحقول المعتمدة لإدارة التسويق والدراسات الميدانية:</p>
                <p className="text-slate-400">تُستخدم هذه الحقول لتحديد الجدوى الاقتصادية وحساب نطاق الجذب وحصر الكثافات المرورية للموقع.</p>
              </div>

              {/* Four Boundaries */}
              <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <label className="block text-slate-300 font-bold mb-1">حدود الموقع الأربعة (طبقا للنموذج الرسمي):</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">الحد البحري (الواجهة الرئيسية)</label>
                    <input
                      type="text"
                      placeholder="مثال: طريق سريع بعرض 40 متر"
                      value={boundaryNorth}
                      onChange={(e) => setBoundaryNorth(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">الحد القبلي (الخلفي)</label>
                    <input
                      type="text"
                      placeholder="مثال: قطعة أرض فضاء ملك الغير"
                      value={boundarySouth}
                      onChange={(e) => setBoundarySouth(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">الحد الشرقي</label>
                    <input
                      type="text"
                      placeholder="مثال: طريق فرعي أو محطة وقود سائل"
                      value={boundaryEast}
                      onChange={(e) => setBoundaryEast(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">الحد الغربي</label>
                    <input
                      type="text"
                      placeholder="مثال: مجرى مائي أو مبنى سكني"
                      value={boundaryWest}
                      onChange={(e) => setBoundaryWest(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Area & Tenure */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">المساحة الإجمالية (م٢)</label>
                  <input
                    type="number"
                    value={totalAreaM2}
                    onChange={(e) => setTotalAreaM2(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">حيازة الأرض</label>
                  <select
                    value={landTenure}
                    onChange={(e) => setLandTenure(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="ownership">ملك خالص</option>
                    <option value="usufruct">حق انتفاع</option>
                    <option value="allocation">تخصيص رسمي</option>
                    <option value="lease">عقد إيجار</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">طبيعة الأرض</label>
                  <select
                    value={landNature}
                    onChange={(e) => setLandNature(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="urban_vacant">فضاء داخل كردون المدينة</option>
                    <option value="agricultural">أرض زراعية</option>
                    <option value="existing_fuel_station">محطة وقود قائمة</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>

              {/* Gas Grid Available */}
              <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-200 font-bold block">توافر شبكة الغاز الطبيعي بالمنطقة</span>
                  <span className="text-slate-400 text-[11px]">هل يمر خط غاز طبيعي بالقرب من الموقع لإمكانية الربط الفني</span>
                </div>
                <select
                  value={gasGridAvailable ? 'yes' : 'no'}
                  onChange={(e) => setGasGridAvailable(e.target.value === 'yes')}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="yes">متوفر خط غاز ✅</option>
                  <option value="no">غير متوفر حالياً ❌</option>
                </select>
              </div>

            </div>
          )}

          {activeTab === 'operations' && (
            <div className="space-y-4">
              
              <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl text-slate-300 text-xs leading-relaxed">
                <p className="font-bold text-blue-300 mb-0.5">الحقول المعتمدة لإدارة التشغيل والصيانة الفنية:</p>
                <p className="text-slate-400">تحديد متطلبات الضواغط، ضغط الغاز الداخل، ونقاط التموين وسهولة دوران ومناورة المركبات.</p>
              </div>

              {/* Compressors & Flow Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">سعة الضاغط (م٣/ساعة)</label>
                  <input
                    type="number"
                    step="100"
                    value={compressorCapacityM3h}
                    onChange={(e) => setCompressorCapacityM3h(parseInt(e.target.value) || 1000)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">عدد الضواغط (Compressors)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={compressorCount}
                    onChange={(e) => setCompressorCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">ضغط الغاز الداخل (Bar)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={gasInletPressureBar}
                    onChange={(e) => setGasInletPressureBar(parseFloat(e.target.value) || 4)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Dispensers & Maneuver */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">عدد نقاط التموين (Dispensers)</label>
                  <input
                    type="number"
                    min="2"
                    max="24"
                    value={dispenserCount}
                    onChange={(e) => setDispenserCount(parseInt(e.target.value) || 4)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">تقييم سهولة المناورة للمركبات</label>
                  <select
                    value={maneuverRating}
                    onChange={(e) => setManeuverRating(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="excellent">ممتاز (دوران حر ومسارات منفصلة)</option>
                    <option value="adequate">مناسب (مناورة مناسبة للملاكي والأجرة)</option>
                    <option value="modification_needed">يتطلب تعديل تنظيمي للمسارات</option>
                    <option value="inadequate">غير ملائم / مساحة دوران حرجة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">سعة طابور الانتظار (مركبة)</label>
                  <input
                    type="number"
                    min="2"
                    max="50"
                    value={queueCapacityVehicles}
                    onChange={(e) => setQueueCapacityVehicles(parseInt(e.target.value) || 10)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">ملاحظات التشغيل والصيانة الفنية</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ملاحظات حول المحولات، غرفة الضواغط، أو مسارات الدخول والخروج..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تثبيت المحطة واللوجو على الخريطة</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
