import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  Send, 
  ArrowRight, 
  Navigation, 
  Sparkles, 
  FileText, 
  Share2, 
  Layers, 
  ShieldCheck, 
  Compass, 
  Clock, 
  Camera, 
  Check,
  AlertCircle
} from 'lucide-react';
import { LandownerApplication } from '../types';

interface ClientLandownerSurveyPortalProps {
  initialApp?: LandownerApplication | null;
  clientPhoneFromUrl?: string;
  clientNameFromUrl?: string;
  onSaveApplication: (app: LandownerApplication) => void;
  onClose?: () => void;
}

export const ClientLandownerSurveyPortal: React.FC<ClientLandownerSurveyPortalProps> = ({
  initialApp,
  clientPhoneFromUrl,
  clientNameFromUrl,
  onSaveApplication,
  onClose,
}) => {
  // Form State initialized from initialApp or URL params
  const [ownerName, setOwnerName] = useState(initialApp?.ownerName || clientNameFromUrl || '');
  const [ownerType, setOwnerType] = useState<LandownerApplication['ownerType']>(initialApp?.ownerType || 'owner');
  const [nationalId, setNationalId] = useState(initialApp?.nationalId || '');
  const [phoneNumber, setPhoneNumber] = useState(initialApp?.phoneNumber || clientPhoneFromUrl || '');
  const [whatsappNumber, setWhatsappNumber] = useState(initialApp?.whatsappNumber || clientPhoneFromUrl || '');
  const [email, setEmail] = useState(initialApp?.email || '');
  
  // Location
  const [governorate, setGovernorate] = useState(initialApp?.governorate || 'الجيزة');
  const [city, setCity] = useState(initialApp?.city || '');
  const [districtOrVillage, setDistrictOrVillage] = useState(initialApp?.districtOrVillage || '');
  const [fullAddress, setFullAddress] = useState(initialApp?.fullAddress || '');
  const [lat, setLat] = useState<number>(initialApp?.gpsCoords?.lat || 30.0131);
  const [lng, setLng] = useState<number>(initialApp?.gpsCoords?.lng || 31.2089);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(Boolean(initialApp?.gpsCoords));

  // Land Specifications
  const [totalAreaM2, setTotalAreaM2] = useState<number>(initialApp?.totalAreaM2 || 1500);
  const [frontageMeters, setFrontageMeters] = useState<number>(initialApp?.frontageMeters || 35);
  const [depthMeters, setDepthMeters] = useState<number>(initialApp?.depthMeters || 42);
  const [currentSiteUsage, setCurrentSiteUsage] = useState<LandownerApplication['currentSiteUsage']>(
    initialApp?.currentSiteUsage || 'existing_fuel_station'
  );
  const [existingStationBrand, setExistingStationBrand] = useState(initialApp?.existingStationBrand || 'مصر للبترول');
  const [roadClassification, setRoadClassification] = useState<LandownerApplication['roadClassification']>(
    initialApp?.roadClassification || 'main_axis'
  );
  const [hasMedianIsland, setHasMedianIsland] = useState<boolean>(initialApp?.hasMedianIsland ?? true);
  const [hasOppositeUTurn, setHasOppositeUTurn] = useState<boolean>(initialApp?.hasOppositeUTurn ?? true);
  const [roadWidthMeters, setRoadWidthMeters] = useState<number>(initialApp?.roadWidthMeters || 30);
  const [ownershipDocumentType, setOwnershipDocumentType] = useState<LandownerApplication['ownershipDocumentType']>(
    initialApp?.ownershipDocumentType || 'registered_deed'
  );
  const [licenseStatus, setLicenseStatus] = useState<LandownerApplication['licenseStatus']>(
    initialApp?.licenseStatus || 'has_commercial_license'
  );
  const [partnershipPreference, setPartnershipPreference] = useState<LandownerApplication['partnershipPreference']>(
    initialApp?.partnershipPreference || 'integrated_fuel_and_cng'
  );

  // Client additional updates
  const [clientNotes, setClientNotes] = useState(initialApp?.notes || '');
  const [preferredSurveyDate, setPreferredSurveyDate] = useState(initialApp?.preferredSurveyDate || '');
  
  // Submission Status
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<LandownerApplication | null>(null);

  // Auto GPS detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('خاصية تحديد الموقع غير مدعومة في هذا المتصفح');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(Number(pos.coords.latitude.toFixed(6)));
        setLng(Number(pos.coords.longitude.toFixed(6)));
        setIsLocating(false);
        setLocationSuccess(true);
      },
      (err) => {
        setIsLocating(false);
        console.warn('GPS error:', err);
        // Fallback default coordinates
        setLat(30.0444);
        setLng(31.2357);
        setLocationSuccess(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !phoneNumber.trim()) {
      alert('برجاء إدخال اسم المالك ورقم الهاتف للتواصل');
      return;
    }

    const appId = initialApp?.id || `app-owner-${Date.now()}`;
    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    const cleanWhatsapp = (whatsappNumber.trim() || cleanPhone).replace(/\s+/g, '');

    const updated: LandownerApplication = {
      id: appId,
      ownerName: ownerName.trim(),
      ownerType,
      nationalId: nationalId.trim() || undefined,
      phoneNumber: cleanPhone,
      whatsappNumber: cleanWhatsapp.startsWith('0') ? '2' + cleanWhatsapp : cleanWhatsapp,
      email: email.trim() || undefined,
      governorate,
      city: city.trim() || governorate,
      districtOrVillage: districtOrVillage.trim() || 'المركز الرئيسي',
      fullAddress: fullAddress.trim() || `${city || governorate}، ${governorate}`,
      gpsCoords: { lat, lng },
      totalAreaM2: Number(totalAreaM2) || 1200,
      frontageMeters: Number(frontageMeters) || 30,
      depthMeters: Number(depthMeters) || 40,
      currentSiteUsage,
      existingStationBrand: currentSiteUsage === 'existing_fuel_station' ? existingStationBrand : undefined,
      roadClassification,
      hasMedianIsland,
      hasOppositeUTurn,
      roadWidthMeters: Number(roadWidthMeters) || 25,
      ownershipDocumentType,
      licenseStatus,
      partnershipPreference,
      applicationDate: initialApp?.applicationDate || new Date().toISOString().split('T')[0],
      status: 'client_submitted',
      filledByClient: true,
      clientSubmittedAt: new Date().toISOString(),
      clientUpdateNotes: clientNotes.trim() || undefined,
      preferredSurveyDate: preferredSurveyDate || undefined,
      marketingEvaluationScore: initialApp?.marketingEvaluationScore || 88,
      notes: clientNotes.trim() || initialApp?.notes,
    };

    onSaveApplication(updated);
    setSubmittedApp(updated);
    setIsSubmitted(true);
  };

  // WhatsApp return notification to Cargas Marketing
  const generateReturnToMarketingWhatsAppUrl = (app: LandownerApplication) => {
    const marketingPhone = '201006579899'; // Cargas Marketing General Department
    const message = `شركة كارجاس - إدارة التسويق وتطوير الأعمال 🌿
السلام عليكم ورحمة الله وبركاته،
أنا العميل / ${app.ownerName}
أحيطكم علماً بأنه تم استيفاء وتحديث استمارة طلب معاينة الموقع الخاص بي لإقامة / إضافة محطة غاز طبيعي:
📍 الموقع: ${app.fullAddress} (${app.governorate})
📐 المساحة: ${app.totalAreaM2} م² | الواجهة: ${app.frontageMeters} م
⛽ النشاط الحالي: ${app.currentSiteUsage === 'existing_fuel_station' ? `محطة وقود قائمة (${app.existingStationBrand})` : 'أرض فضاء'}
🤝 نموذج الشراكة: ${app.partnershipPreference === 'integrated_fuel_and_cng' ? 'إضافة طلمبات غاز طبيعي' : 'محطة تموين وتحويل غاز'}
🌐 الإحداثيات: https://maps.google.com/?q=${app.gpsCoords?.lat},${app.gpsCoords?.lng}
${app.preferredSurveyDate ? `📅 موعد المعاينة المفضل: ${app.preferredSurveyDate}` : ''}
${app.clientUpdateNotes ? `📝 ملاحظات إضافية: ${app.clientUpdateNotes}` : ''}

تم حفظ الاستمارة بنجاح، نرجو المتابعة وإيفاد مهندس المعاينة الميدانية.`;

    return `https://wa.me/${marketingPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Top Corporate Branding Header */}
      <header className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-500/30 px-4 py-3 sticky top-0 z-30 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm">
              CARGAS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-black text-white">شركة الغاز الطبيعي للسيارات (كارجاس)</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  إدارة التسويق
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                استمارة طلب معاينة موقع لإضافة نشاط ومحطة تموين الغاز الطبيعي (تعبئة العميل)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-emerald-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>الخط الساخن: <strong className="font-mono">19544</strong></span>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                العودة للتطبيق
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6">
        {isSubmitted && submittedApp ? (
          /* ========================================================= */
          /* SUCCESS RECEIPT VIEW                                      */
          /* ========================================================= */
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-fade-in my-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                تم الاستلام بنجاح وتحديث الطلب لدى إدارة التسويق
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                شكراً لك أستاذ / {submittedApp.ownerName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                تم تسجيل وتحديث بيانات موقعك بنجاح. تظهر الآن كافة البيانات المحدثة تلقائياً في منظومة إدارة التسويق وتطوير الأعمال بشركة كارجاس للبدء في المعاينة الفنية.
              </p>
            </div>

            {/* Submission Summary Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-right text-xs space-y-2.5 max-w-lg mx-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">رقم مرجع الطلب:</span>
                <span className="font-mono text-emerald-400 font-bold">{submittedApp.id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">عنوان الموقع:</span>
                <span className="text-white font-semibold">{submittedApp.fullAddress}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">المساحة والواجهة:</span>
                <span className="text-white font-mono">{submittedApp.totalAreaM2} م² (واجهة {submittedApp.frontageMeters}م)</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">النموذج المقترح:</span>
                <span className="text-emerald-300 font-bold">
                  {submittedApp.partnershipPreference === 'integrated_fuel_and_cng' ? 'إضافة طلمبات غاز لمحطة قائمة' : 'محطة تموين وتحويل كارجاس'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">وقت التحديث:</span>
                <span className="text-slate-300 font-mono text-[11px]">{new Date().toLocaleString('ar-EG')}</span>
              </div>
            </div>

            {/* Key Action: Return WhatsApp notification back to Cargas Marketing */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={generateReturnToMarketingWhatsAppUrl(submittedApp)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>إرسال تأكيد الاستيفاء لإدارة التسويق عبر الواتساب</span>
              </a>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  الرجوع لصفحة إدارة التسويق
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* CLIENT INTERACTIVE SURVEY FORM                            */
          /* ========================================================= */
          <form onSubmit={handleSubmitForm} className="space-y-5">
            {/* Banner Guide */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4" />
                <span>مرحباً بك في بوابة ملاك المواقع والشركاء - شركة كارجاس</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                يسعدنا تلقي طلبكم لإضافة نشاط الغاز الطبيعي المضغوط بموقعكم. يرجى التكرم بتدقيق البيانات التالية ليقوم فريق إدارة التسويق والدراسات بدراسة الموقع وترتيب موعد المعاينة الفنية.
              </p>
            </div>

            {/* Section 1: Applicant & Landowner Details */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-amber-300 font-bold text-xs">
                <User className="w-4 h-4" />
                <span>1. بيانات المالك ومقدم الطلب</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">
                    اسم المالك / الشركة المالكة <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="مثال: الحاج إبراهيم منصور الهواري"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">
                    صفة مقدم الطلب
                  </label>
                  <select
                    value={ownerType}
                    onChange={(e) => setOwnerType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="owner">المالك الأصلي للأرض / المحطة</option>
                    <option value="authorized_agent">وكيل مفوض رسمي بتوكيل ساري</option>
                    <option value="station_operator">مستأجر / مشغل محطة قائمة</option>
                    <option value="investor">مستثمر شريك</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">
                    رقم الهاتف للاتصال المباشر <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">
                    رقم الواتساب للتواصل وإرسال التقارير
                  </label>
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Site Location & GPS */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                  <MapPin className="w-4 h-4" />
                  <span>2. العنوان والموقع الجغرافي وإحداثيات GPS</span>
                </div>

                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold transition-all shadow cursor-pointer disabled:opacity-50"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'جاري تحديد موقعك...' : 'تحديد موقعي التلقائي عبر GPS'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">المحافظة</label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="القاهرة">القاهرة</option>
                    <option value="الجيزة">الجيزة</option>
                    <option value="القليوبية">القليوبية</option>
                    <option value="الإسكندرية">الإسكندرية</option>
                    <option value="الشرقية">الشرقية</option>
                    <option value="الدقهلية">الدقهلية</option>
                    <option value="البحيرة">البحيرة</option>
                    <option value="الغربية">الغربية</option>
                    <option value="المنوفية">المنوفية</option>
                    <option value="دمياط">دمياط</option>
                    <option value="بورسعيد">بورسعيد</option>
                    <option value="الإسماعيلية">الإسماعيلية</option>
                    <option value="السويس">السويس</option>
                    <option value="الفيوم">الفيوم</option>
                    <option value="بني سويف">بني سويف</option>
                    <option value="المنيا">المنيا</option>
                    <option value="أسيوط">أسيوط</option>
                    <option value="سوهاج">سوهاج</option>
                    <option value="قنا">قنا</option>
                    <option value="الأقصر">الأقصر</option>
                    <option value="أسوان">أسوان</option>
                    <option value="البحر الأحمر">البحر الأحمر</option>
                    <option value="مطروح">مطروح</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">المدينة / المركز</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: 6 أكتوبر / التجمع / دمنهور"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">الحي / المنطقة أو القرية</label>
                  <input
                    type="text"
                    value={districtOrVillage}
                    onChange={(e) => setDistrictOrVillage(e.target.value)}
                    placeholder="مثال: المنطقة الصناعية الثالثة"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold text-[11px] mb-1">العنوان التفصيلي وأقرب علامة مميزة</label>
                <input
                  type="text"
                  required
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="مثال: طريق مصر إسكندرية الصحراوي، الكيلو 28 أمام القرية الذكية"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {locationSuccess && (
                <div className="p-3 bg-slate-950/70 rounded-xl border border-cyan-500/30 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300 font-mono">
                      إحداثيات الموقع: Lat: {lat}, Lng: {lng}
                    </span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>معاينة على الخريطة</span>
                    <Navigation className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Section 3: Land Specs & Current Status */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-emerald-300 font-bold text-xs">
                <Building2 className="w-4 h-4" />
                <span>3. مواصفات الأرض والنشاط الحالي والنموذج المطلوب</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">المساحة الإجمالية (م²)</label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={totalAreaM2}
                    onChange={(e) => setTotalAreaM2(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">طول الواجهة على الشارع (متر)</label>
                  <input
                    type="number"
                    required
                    min={15}
                    value={frontageMeters}
                    onChange={(e) => setFrontageMeters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">عمق الأرض للداخل (متر)</label>
                  <input
                    type="number"
                    required
                    min={20}
                    value={depthMeters}
                    onChange={(e) => setDepthMeters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">الوضع والنشاط الحالي للموقع</label>
                  <select
                    value={currentSiteUsage}
                    onChange={(e) => setCurrentSiteUsage(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="existing_fuel_station">محطة وقود سائل قائمة (بنزين وسولار)</option>
                    <option value="vacant_land">أرض فضاء صالحة للإنشاء</option>
                    <option value="commercial_garage">جراج أو ساحة انتظار سيارات</option>
                    <option value="transport_hub">موقف سرفيس أو محطة ركاب</option>
                    <option value="industrial_warehouse">مخزن أو هنجر صناعي</option>
                  </select>
                </div>

                {currentSiteUsage === 'existing_fuel_station' && (
                  <div>
                    <label className="block text-slate-300 font-bold text-[11px] mb-1">ماركة / شركة المحطة القائمة</label>
                    <input
                      type="text"
                      value={existingStationBrand}
                      onChange={(e) => setExistingStationBrand(e.target.value)}
                      placeholder="مثال: مصر للبترول / التعاون / توتال / شل / موبيل"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <div className={currentSiteUsage === 'existing_fuel_station' ? 'sm:col-span-2' : ''}>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">نموذج التعاقد والشراكة المفضل مع كارجاس</label>
                  <select
                    value={partnershipPreference}
                    onChange={(e) => setPartnershipPreference(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="integrated_fuel_and_cng">إضافة طلمبات غاز طبيعي للمحطة القائمة (شراكة استغلال)</option>
                    <option value="cng_only_station">إنشاء محطة تموين غاز طبيعي مستقلة ومظلة كارجاس</option>
                    <option value="station_and_conversion">محطة تموين متكاملة + مركز تحويل وصيانة سيارات</option>
                    <option value="long_term_lease_to_cargas">تأجير الأرض لكارجاس بعقد إيجار طويل الأجل</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Client Preferences & Notes */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-indigo-300 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>4. موعد المعاينة المفضل والملاحظات الإضافية</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">
                    الموعد أو اليوم المفضل لحضور مهندس المعاينة
                  </label>
                  <input
                    type="text"
                    value={preferredSurveyDate}
                    onChange={(e) => setPreferredSurveyDate(e.target.value)}
                    placeholder="مثال: يوم الثلاثاء القادم صباحاً من 10 إلى 1 ظهراً"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold text-[11px] mb-1">
                    حالة سند الملكية والترخيص
                  </label>
                  <select
                    value={ownershipDocumentType}
                    onChange={(e) => setOwnershipDocumentType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="registered_deed">عقد ملكية مسجل شهر عقاري</option>
                    <option value="primary_contract">عقد بيع ابتدائي مثبت التاريخ</option>
                    <option value="long_term_lease">عقد إيجار طويل الأجل ساري</option>
                    <option value="usufruct">حق انتفاع رسمي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold text-[11px] mb-1">
                  ملاحظات تود إحاطة مهندسي كارجاس بها (مثل الكثافة المرورية، خطوط السرفيس، وجود خط غاز)
                </label>
                <textarea
                  rows={2}
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="اكتب أي معلومات إضافية عن المحاور القريبة أو طبيعة السيارات المارة..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال وتأكيد بيانات الموقع لإدارة التسويق بكارجاس 🌿</span>
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2">
                بالضغط على الزر، سيتم تحديث بياناتك مباشرة لدى إدارة التسويق لإجراء المعاينة الفنية والتواصل معك.
              </p>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        منظومة كارجاس لمعاينة وتطوير محطات الغاز الطبيعي • قطاع التسويق والدراسات الفنية © 2026
      </footer>
    </div>
  );
};
