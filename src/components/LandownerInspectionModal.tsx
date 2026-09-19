import React, { useState } from 'react';
import { X, Printer, MapPin, Building, FileText, CheckCircle2, Phone, Calendar, User, Compass, Layers, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { LandownerInspectionRequest, CNGStation } from '../types';
import { CargasNgvLogo } from './CargasNgvLogo';

interface LandownerInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRequest: (req: LandownerInspectionRequest) => void;
  onConvertToStation?: (station: CNGStation) => void;
  initialCoords?: { lat: number; lng: number };
  existingRequest?: LandownerInspectionRequest | null;
}

export const LandownerInspectionModal: React.FC<LandownerInspectionModalProps> = ({
  isOpen,
  onClose,
  onSubmitRequest,
  onConvertToStation,
  initialCoords,
  existingRequest,
}) => {
  // Mode: Form edit or Printable Letterhead view
  const [viewMode, setViewMode] = useState<'form' | 'print_preview'>(existingRequest ? 'print_preview' : 'form');

  // Form Fields
  const [applicantName, setApplicantName] = useState(existingRequest?.applicantName || '');
  const [nationalId, setNationalId] = useState(existingRequest?.nationalId || '');
  const [residenceAddress, setResidenceAddress] = useState(existingRequest?.residenceAddress || '');
  const [residenceGovernorate, setResidenceGovernorate] = useState(existingRequest?.residenceGovernorate || 'الجيزة');
  const [phone, setPhone] = useState(existingRequest?.phone || '');

  // Site Info
  const [siteAddress, setSiteAddress] = useState(existingRequest?.siteAddress || '');
  const [siteDistrict, setSiteDistrict] = useState(existingRequest?.siteDistrict || '');
  const [siteGovernorate, setSiteGovernorate] = useState(existingRequest?.siteGovernorate || 'الجيزة');
  const [lat, setLat] = useState<number>(existingRequest?.coordinates.lat ?? initialCoords?.lat ?? 30.0444);
  const [lng, setLng] = useState<number>(existingRequest?.coordinates.lng ?? initialCoords?.lng ?? 31.2357);

  // Boundaries (حدود الموقع الأربعة من النموذج الرسمي)
  const [boundaryNorth, setBoundaryNorth] = useState(existingRequest?.boundaryNorth || '');
  const [boundarySouth, setBoundarySouth] = useState(existingRequest?.boundarySouth || '');
  const [boundaryEast, setBoundaryEast] = useState(existingRequest?.boundaryEast || '');
  const [boundaryWest, setBoundaryWest] = useState(existingRequest?.boundaryWest || '');

  // Site Specs
  const [totalAreaM2, setTotalAreaM2] = useState<number>(existingRequest?.totalAreaM2 || 1500);
  const [siteDimensions, setSiteDimensions] = useState(existingRequest?.siteDimensions || '35م واجهة × 42م عمق');
  const [currentSiteStatus, setCurrentSiteStatus] = useState<LandownerInspectionRequest['currentSiteStatus']>(
    existingRequest?.currentSiteStatus || 'vacant_land'
  );
  const [landTenure, setLandTenure] = useState<LandownerInspectionRequest['landTenure']>(
    existingRequest?.landTenure || 'ownership'
  );
  const [landNature, setLandNature] = useState<LandownerInspectionRequest['landNature']>(
    existingRequest?.landNature || 'urban_vacant'
  );
  const [gasGridAvailable, setGasGridAvailable] = useState<boolean>(
    existingRequest?.gasGridAvailable ?? true
  );
  const [requestDate, setRequestDate] = useState<string>(
    existingRequest?.requestDate || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(existingRequest?.notes || '');

  if (!isOpen) return null;

  const handleFetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(6)));
          setLng(Number(pos.coords.longitude.toFixed(6)));
        },
        (err) => {
          alert('تعذر تحديد الموقع الجغرافي تلقائياً. يرجى إدخال الإحداثيات يدوياً.');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !phone || !siteAddress) {
      alert('يرجى ملء الحقول الأساسية: اسم مقدم الطلب، رقم الهاتف، وعنوان الموقع.');
      return;
    }

    const newReq: LandownerInspectionRequest = {
      id: existingRequest?.id || `req-${Date.now()}`,
      requestNumber: existingRequest?.requestNumber || `REQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      applicantName,
      nationalId,
      residenceAddress,
      residenceGovernorate,
      phone,
      siteAddress,
      siteDistrict,
      siteGovernorate,
      coordinates: { lat, lng },
      boundaryNorth,
      boundarySouth,
      boundaryEast,
      boundaryWest,
      totalAreaM2,
      siteDimensions,
      currentSiteStatus,
      landTenure,
      landNature,
      gasGridAvailable,
      requestDate,
      status: existingRequest?.status || 'pending',
      notes,
    };

    onSubmitRequest(newReq);
    setViewMode('print_preview');
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleConvertDirectlyToStation = () => {
    if (!onConvertToStation) return;
    const proposedStation: CNGStation = {
      id: `proposed-st-${Date.now()}`,
      name: `موقع مقترح - ${siteDistrict || siteAddress}`,
      company: 'كارجاس (Cargas)',
      governorate: siteGovernorate,
      city: siteDistrict,
      address: siteAddress,
      lat,
      lng,
      dispenserCount: 6,
      hasConversionCenter: true,
      facilityType: 'integrated',
      status: 'proposed',
      brand: 'cargas',
      cngCapacityM3h: 1500,
      notes: `طلب معاينة معتمد رقم ${existingRequest?.requestNumber || 'جديد'}. مقدم الطلب: ${applicantName} (${phone})`,
      totalAreaM2,
      boundaryNorth,
      boundarySouth,
      boundaryEast,
      boundaryWest,
      landTenure,
      gasGridAvailable,
      siteRating: '+A',
    };
    onConvertToStation(proposedStation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <CargasNgvLogo size="sm" showText={false} />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>نموذج طلب معاينة إقامة محطة تموين بالغاز الطبيعي</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  كارجاس CARGAS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                النموذج الرسمي المقدم من ملاك المواقع والأراضي لإضافة نشاط ومحطة غاز طبيعي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'form' ? 'print_preview' : 'form')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              {viewMode === 'form' ? (
                <>
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>معاينة الخطاب الرسمي والطباعة</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>تعديل البيانات بالنموذج</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {viewMode === 'form' ? (
            /* ========================================================
               FORM EDIT MODE
               ======================================================== */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Official Destination banner */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-400 font-bold block">الجهة الموجه إليها الطلب:</span>
                  <p className="text-sm font-black text-white">السادة / شركة الغاز الطبيعي للسيارات (كارجاس - CARGAS)</p>
                </div>
                <div className="text-left font-mono text-xs text-slate-400">
                  <span>الخط الساخن: </span>
                  <strong className="text-emerald-400 font-bold text-sm">19544</strong>
                </div>
              </div>

              {/* Section 1: Landowner / Applicant Info */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>أولاً: بيانات مالك الموقع / مقدم الطلب لسيادتكم</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">مقدمه لسيادتكم (الاسم الرباعي)</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: الحاج / إبراهيم عبد الرحمن الشاذلي"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">بطاقة رقم قومي (14 رقم)</label>
                    <input
                      type="text"
                      maxLength={14}
                      placeholder="مثال: 27508120104523"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">المقيم في (عنوان السكن)</label>
                    <input
                      type="text"
                      placeholder="العنوان السكني لمالك الموقع أو المفوض"
                      value={residenceAddress}
                      onChange={(e) => setResidenceAddress(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">محافظة الإقامة</label>
                    <input
                      type="text"
                      value={residenceGovernorate}
                      onChange={(e) => setResidenceGovernorate(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">تليفون محمول للتواصل والواتساب</label>
                    <input
                      type="tel"
                      required
                      placeholder="مثال: 01001234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">تاريخ تحرير الطلب</label>
                    <input
                      type="date"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Site Location & GPS Coordinates */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>ثانياً: عنوان الموقع المراد معاينته وإحداثيات الخريطة</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleFetchCurrentLocation}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>تحديد الموقع الحالي بالجهاز (GPS)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">عنوان الموقع بالتفصيل</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: طريق المنصورية السياحي - مدخل كرداسة، أمام نزلة الدائري"
                      value={siteAddress}
                      onChange={(e) => setSiteAddress(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">المركز / الحي / المدينة</label>
                    <input
                      type="text"
                      placeholder="مثال: كرداسة / الهرم"
                      value={siteDistrict}
                      onChange={(e) => setSiteDistrict(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">المحافظة</label>
                    <input
                      type="text"
                      value={siteGovernorate}
                      onChange={(e) => setSiteGovernorate(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-mono mb-1.5">خط العرض (Latitude)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lat}
                      onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-mono mb-1.5">خط الطول (Longitude)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lng}
                      onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Four Boundaries (حدود الموقع الأربعة من النموذج الرسمي) */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-blue-400 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-400" />
                  <span>ثالثاً: حدود الموقع الأربعة (كما بنموذج كارجاس المعتمد)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">
                      1. الحد البحري (الجهة الأمامية / الطريق الرئيسي)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: طريق المنصورية السياحي بعرض 40م"
                      value={boundaryNorth}
                      onChange={(e) => setBoundaryNorth(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">
                      2. الحد القبلي (الجهة الخلفية)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: أرض ملك ورثة فلان مسورة"
                      value={boundarySouth}
                      onChange={(e) => setBoundarySouth(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">
                      3. الحد الشرقي (الجهة اليمنى)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: طريق فرعي بعرض 12 متر أو جار"
                      value={boundaryEast}
                      onChange={(e) => setBoundaryEast(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">
                      4. الحد الغربي (الجهة اليسرى)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: أرض فضاء ملك الغير"
                      value={boundaryWest}
                      onChange={(e) => setBoundaryWest(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Physical Specs, Area & Tenure */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-purple-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>رابعاً: المساحة، حيازة الأرض، وطبيعة الموقع والغاز</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">المساحة الإجمالية (م٢ تقريباً)</label>
                    <input
                      type="number"
                      value={totalAreaM2}
                      onChange={(e) => setTotalAreaM2(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">أبعاد الواجهة بالعمق (م)</label>
                    <input
                      type="text"
                      placeholder="مثال: 45م واجهة × 39م عمق"
                      value={siteDimensions}
                      onChange={(e) => setSiteDimensions(e.target.value)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">الوضع الحالي للموقع</label>
                    <select
                      value={currentSiteStatus}
                      onChange={(e) => setCurrentSiteStatus(e.target.value as any)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="vacant_land">قطعة أرض فضاء</option>
                      <option value="existing_fuel_station">محطة وقود قائمة (إضافة نشاط غاز)</option>
                      <option value="building">مبنى قائم</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">حيازة الأرض</label>
                    <select
                      value={landTenure}
                      onChange={(e) => setLandTenure(e.target.value as any)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ownership">ملك خالص</option>
                      <option value="usufruct">حق انتفاع</option>
                      <option value="allocation">تخصيص رسمي</option>
                      <option value="lease">عقد إيجار</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">طبيعة الأرض</label>
                    <select
                      value={landNature}
                      onChange={(e) => setLandNature(e.target.value as any)}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="urban_vacant">أرض فضاء داخل كردون المدينة</option>
                      <option value="agricultural">أرض زراعية</option>
                      <option value="existing_station">محطة وقود قائمة</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-bold mb-1.5">توافر الغاز الطبيعي بالمنطقة</label>
                    <select
                      value={gasGridAvailable ? 'yes' : 'no'}
                      onChange={(e) => setGasGridAvailable(e.target.value === 'yes')}
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="yes">يوجد خط غاز طبيعي بالمنطقة</option>
                      <option value="no">لا يوجد خط غاز حالياً</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-xs font-bold mb-1.5">ملاحظات إضافية ومزايا الموقع</label>
                  <textarea
                    rows={2}
                    placeholder="كثافة المرور، الأنشطة المجاورة، أية تفاصيل أخرى تهم المعاينين..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Official Declaration Text Box */}
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-slate-200 text-xs leading-relaxed">
                <p className="font-bold text-emerald-300 mb-1">صيغة الإقرار الرسمي الموجه لكارجاس:</p>
                <p className="text-slate-300 italic">
                  "حيث أنني أرغب في التعاون مع شركتكم الموقرة على إقامة محطة تموين سيارات بالغاز الطبيعي، وعليه يرجى التفضل بعمل معاينة للموقع المشار إليه عاليه لبيان مدى صلاحية الموقع من عدمه لإقامة محطة تموين السيارات للعمل بالغاز الطبيعي."
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('print_preview')}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>عرض الخطاب المعتمد للطباعة</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>حفظ طلب المعاينة وإدراجه بالقاعدة</span>
                  </button>
                </div>
              </div>

            </form>
          ) : (
            /* ========================================================
               PRINTABLE OFFICIAL LETTERHEAD VIEW
               ======================================================== */
            <div className="space-y-6">
              
              {/* Action Toolbar */}
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 print:hidden">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>تنسيق جاهز للطباعة والتصدير بتصميم كارجاس الرسمي</span>
                </div>

                <div className="flex items-center gap-2">
                  {onConvertToStation && (
                    <button
                      type="button"
                      onClick={handleConvertDirectlyToStation}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>تثبيت الموقع على الخريطة مع اللوجو فوراً</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleTriggerPrint}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة النموذج (Print / PDF)</span>
                  </button>
                </div>
              </div>

              {/* White Document Canvas (Paper-like Presentation) */}
              <div 
                id="official-inspection-letter"
                className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-300 space-y-6 text-sm leading-relaxed"
                dir="rtl"
              >
                {/* Official Letterhead */}
                <div className="flex items-start justify-between border-b-2 border-emerald-700 pb-4">
                  <div className="space-y-1">
                    <h1 className="text-xl font-black text-emerald-800 tracking-wide">
                      الشركة المصرية الدولية لتكنولوجيا الغاز
                    </h1>
                    <p className="text-base font-black text-slate-800">
                      ( كــارجــاس - CARGAS NGV )
                    </p>
                    <p className="text-xs text-slate-600">
                      إدارة التسويق والدراسات الميدانية وتطوير المحطات
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <img src="/cargas_ngv_logo.svg" alt="CARGAS" className="w-16 h-16 object-contain" />
                    <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">الخط الساخن: 19544</span>
                  </div>
                </div>

                {/* Form Title & Serial */}
                <div className="text-center py-2 bg-slate-100 rounded-lg border border-slate-300">
                  <h2 className="text-lg font-black text-slate-900">
                    نموذج طلب معاينة لإقامة محطة تموين سيارات بالغاز الطبيعي
                  </h2>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">
                    رقم الطلب: {existingRequest?.requestNumber || `REQ-${new Date().getFullYear()}-0199`} | التاريخ: {requestDate}
                  </p>
                </div>

                {/* Addressee */}
                <div className="font-bold text-slate-900">
                  <p>السادة / شركة الغاز الطبيعي للسيارات (كارجاس)</p>
                  <p className="text-xs text-slate-700 mt-1">تحية طيبة وبعد ،،،</p>
                </div>

                {/* Body Details */}
                <div className="space-y-3 text-xs leading-loose border border-slate-200 p-4 rounded-lg bg-slate-50/50">
                  <p>
                    <strong>مقدمه لسيادتكم: </strong>
                    <span className="underline decoration-dotted font-bold text-slate-900">{applicantName || '...................................................'}</span>
                    <span className="mr-4"><strong>بطاقة رقم قومي: </strong></span>
                    <span className="font-mono font-bold text-slate-900">{nationalId || '..........................'}</span>
                  </p>

                  <p>
                    <strong>المقيم في: </strong>
                    <span>{residenceAddress || '...................................................'}</span>
                    <span className="mr-4"><strong>محافظة: </strong></span>
                    <span>{residenceGovernorate}</span>
                    <span className="mr-4"><strong>تليفون محمول: </strong></span>
                    <span className="font-mono font-bold text-emerald-800">{phone || '......................'}</span>
                  </p>

                  <p>
                    <strong>عنوان الموقع المراد معاينته: </strong>
                    <span className="font-bold text-slate-900">{siteAddress || '...........................................................................'}</span>
                  </p>

                  <p>
                    <strong>المركز / الحي: </strong>
                    <span>{siteDistrict || '..........................'}</span>
                    <span className="mr-4"><strong>المحافظة: </strong></span>
                    <span>{siteGovernorate}</span>
                    <span className="mr-4"><strong>الإحداثيات الجغرافية: </strong></span>
                    <span className="font-mono text-slate-800 font-bold">Lat: {lat}, Lng: {lng}</span>
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <p className="font-bold text-slate-900 mb-1">حدود الموقع الأربعة:</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pr-2">
                      <p><strong>1. الحد البحري (الواجهة): </strong>{boundaryNorth || '....................................'}</p>
                      <p><strong>2. الحد القبلي (الخلفي): </strong>{boundarySouth || '....................................'}</p>
                      <p><strong>3. الحد الشرقي (الأيمن): </strong>{boundaryEast || '....................................'}</p>
                      <p><strong>4. الحد الغربي (الأيسر): </strong>{boundaryWest || '....................................'}</p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <p><strong>المساحة الإجمالية: </strong>{totalAreaM2} م٢ تقريباً</p>
                    <p><strong>الأبعاد: </strong>{siteDimensions}</p>
                    <p><strong>الوضع الحالي: </strong>{currentSiteStatus === 'existing_fuel_station' ? 'محطة وقود قائمة' : 'أرض فضاء'}</p>
                    <p><strong>حيازة الأرض: </strong>{landTenure === 'ownership' ? 'ملك خالص' : landTenure}</p>
                  </div>

                  <p className="text-[11px]">
                    <strong>طبيعة الأرض: </strong>{landNature === 'urban_vacant' ? 'أرض فضاء داخل كردون المدينة' : landNature}
                    <span className="mr-4"><strong>توافر خط الغاز الطبيعي: </strong>{gasGridAvailable ? 'متوفر بالمنطقة' : 'غير متوفر'}</span>
                  </p>
                </div>

                {/* Legal / Official Text */}
                <div className="p-4 bg-slate-100/80 rounded-lg text-xs leading-relaxed text-slate-800 border-r-4 border-emerald-600">
                  <p className="font-bold text-slate-900 mb-1">نص الطلب:</p>
                  <p>
                    "حيث أنني أرغب في التعاون مع شركتكم الموقرة على إقامة محطة تموين سيارات بالغاز الطبيعي، وعليه يرجى التفضل بعمل معاينة للموقع المشار إليه عاليه لبيان مدى صلاحية الموقع من عدمه لإقامة محطة تموين السيارات للعمل بالغاز الطبيعي."
                  </p>
                </div>

                {/* Signatures and Date Footer */}
                <div className="flex items-end justify-between pt-6 border-t border-slate-300">
                  <div>
                    <p className="text-xs text-slate-600">تحريراً في: <strong>{requestDate}</strong></p>
                    <p className="text-xs text-slate-500 mt-1">الخط الساخن الموحد لكارجاس: 19544</p>
                  </div>

                  <div className="text-center space-y-3">
                    <p className="text-xs font-bold text-slate-900">مقدمه لسيادتكم</p>
                    <div className="h-10 flex items-center justify-center font-serif text-slate-700 font-bold">
                      {applicantName}
                    </div>
                    <p className="text-[10px] text-slate-500">التوقيع / البصمة</p>
                  </div>
                </div>

                {/* Internal Inspection Record Section */}
                <div className="border-t-2 border-dashed border-slate-300 pt-4 mt-6 text-[11px] text-slate-600">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <p className="font-bold text-slate-800 mb-1">خاص بإدارة التسويق والمعاينات الميدانية بشركة كارجاس:</p>
                    <div className="grid grid-cols-3 gap-2">
                      <p>اسم المعاين المكلف: ....................................</p>
                      <p>تاريخ المعاينة الفعلي: ..... / ..... / 2025</p>
                      <p>التقييم المبدئي: [  ] ممتاز  [  ] جيد  [  ] غير مطابق</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
