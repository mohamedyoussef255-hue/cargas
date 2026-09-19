import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  Phone, 
  User, 
  CheckCircle2, 
  Plus, 
  Share2, 
  Send, 
  Search, 
  Flame, 
  Wrench, 
  FileText, 
  AlertCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';
import { LandownerApplication, DepartmentRole } from '../types';

interface LandownerSurveyApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: LandownerApplication[];
  onAddApplication: (app: LandownerApplication) => void;
  onUpdateApplicationStatus: (id: string, newStatus: LandownerApplication['status'], score?: number) => void;
  onDispatchSurveyor?: (app: LandownerApplication) => void;
  currentRole?: DepartmentRole;
}

export const LandownerSurveyApplicationModal: React.FC<LandownerSurveyApplicationModalProps> = ({
  isOpen,
  onClose,
  applications,
  onAddApplication,
  onUpdateApplicationStatus,
  onDispatchSurveyor,
  currentRole = 'marketing',
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'new_form'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGov, setFilterGov] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<LandownerApplication | null>(null);

  // New Application Form State
  const [ownerName, setOwnerName] = useState('');
  const [ownerType, setOwnerType] = useState<LandownerApplication['ownerType']>('owner');
  const [nationalId, setNationalId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [governorate, setGovernorate] = useState('الجيزة');
  const [city, setCity] = useState('');
  const [districtOrVillage, setDistrictOrVillage] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [lat, setLat] = useState<number>(30.0131);
  const [lng, setLng] = useState<number>(31.2089);
  const [totalAreaM2, setTotalAreaM2] = useState<number>(1800);
  const [frontageMeters, setFrontageMeters] = useState<number>(40);
  const [depthMeters, setDepthMeters] = useState<number>(45);
  const [currentSiteUsage, setCurrentSiteUsage] = useState<LandownerApplication['currentSiteUsage']>('existing_fuel_station');
  const [existingStationBrand, setExistingStationBrand] = useState('مصر للبترول');
  const [roadClassification, setRoadClassification] = useState<LandownerApplication['roadClassification']>('main_axis');
  const [hasMedianIsland, setHasMedianIsland] = useState<boolean>(true);
  const [hasOppositeUTurn, setHasOppositeUTurn] = useState<boolean>(true);
  const [roadWidthMeters, setRoadWidthMeters] = useState<number>(35);
  const [ownershipDocumentType, setOwnershipDocumentType] = useState<LandownerApplication['ownershipDocumentType']>('registered_deed');
  const [licenseStatus, setLicenseStatus] = useState<LandownerApplication['licenseStatus']>('has_commercial_license');
  const [partnershipPreference, setPartnershipPreference] = useState<LandownerApplication['partnershipPreference']>('integrated_fuel_and_cng');
  const [notes, setNotes] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !phoneNumber.trim()) return;

    const newApp: LandownerApplication = {
      id: 'app-owner-' + Date.now(),
      ownerName: ownerName.trim(),
      ownerType,
      nationalId: nationalId.trim() || undefined,
      phoneNumber: phoneNumber.trim(),
      whatsappNumber: (whatsappNumber.trim() || phoneNumber.trim()).replace(/^0/, '20'),
      email: email.trim() || undefined,
      governorate,
      city: city.trim() || governorate,
      districtOrVillage: districtOrVillage.trim() || 'المركز الرئيسي',
      fullAddress: fullAddress.trim() || `${city}، ${governorate}`,
      gpsCoords: { lat, lng },
      totalAreaM2,
      frontageMeters,
      depthMeters,
      currentSiteUsage,
      existingStationBrand: currentSiteUsage === 'existing_fuel_station' ? existingStationBrand : undefined,
      roadClassification,
      hasMedianIsland,
      hasOppositeUTurn,
      roadWidthMeters,
      ownershipDocumentType,
      licenseStatus,
      partnershipPreference,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pending_review',
      notes: notes.trim() || undefined,
      marketingEvaluationScore: Math.round(75 + Math.random() * 20),
    };

    onAddApplication(newApp);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setViewMode('list');
      // Reset form
      setOwnerName('');
      setPhoneNumber('');
      setFullAddress('');
      setNotes('');
    }, 1500);
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.fullAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phoneNumber.includes(searchTerm);
    const matchesGov = filterGov === 'all' || app.governorate === filterGov;
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesGov && matchesStatus;
  });

  const getStatusBadge = (status: LandownerApplication['status']) => {
    switch (status) {
      case 'approved_marketing':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">معتمد تسويقياً للإنشاء</span>;
      case 'surveyor_dispatched':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">تم تكليف معاين ميداني</span>;
      case 'survey_completed':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">تمت المعاينة الميدانية</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">مرفوض (غير ملائم)</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">قيد الفحص والمراجعة المبدئية</span>;
    }
  };

  const generateWhatsAppMessage = (app: LandownerApplication) => {
    const text = `شركة كارجاس للغاز الطبيعي (CARGAS NGV) 🌿
عناية المالك/المستثمر: ${app.ownerName}
بشأن طلبكم لمعاينة الموقع الكائن في: ${app.fullAddress}
المساحة: ${app.totalAreaM2} م² | الغرض: ${app.partnershipPreference === 'integrated_fuel_and_cng' ? 'إضافة محطة غاز طبيعي لمحطة الوقود' : 'إنشاء محطة تموين وتحويل غاز'}

نحيطكم علماً بأنه قد تم فحص الطلب مبدئياً وتقييم جاذبية الموقع بنسبة ${app.marketingEvaluationScore || 85}%، وسيقوم مهندس المعاينة الميدانية التابع لكارجاس بزيارة الموقع ومطابقة الاشتراطات.
الخط الساخن: 19544`;
    return encodeURIComponent(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full text-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <span>نموذج طلبات معاينة ملاك المواقع والأراضي</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  إدارة التسويق والدراسات
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                استقبال ومعاينة طلبات ملاك الأراضي ومحطات الوقود القائمة لإضافة محطات غاز أو مراكز تحويل كارجاس
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'new_form' : 'list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'new_form'
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
              }`}
            >
              {viewMode === 'new_form' ? (
                <>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>العودة لقائمة الطلبات ({applications.length})</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>تسجيل طلب معاينة جديد</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs">
          
          {/* ========================================================= */}
          {/* VIEW: NEW APPLICATION FORM (LANDOWNER SUBMISSION)          */}
          {/* ========================================================= */}
          {viewMode === 'new_form' ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">تم تسجيل طلب المعاينة بنجاح وإدراجه ضمن استعلامات إدارة التسويق والدراسات الميدانية!</span>
                </div>
              )}

              {/* Step 1: Owner Info */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>بيانات المالك ومقدم طلب المعاينة</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">اسم المالك / المفوض <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="مثال: الحاج إبراهيم منصور الهواري"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الصفة القانونية</label>
                    <select
                      value={ownerType}
                      onChange={(e) => setOwnerType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="owner">مالك الأرض الأصيل</option>
                      <option value="station_operator">مشغل / صاحب محطة وقود قائمة</option>
                      <option value="authorized_agent">وكيل / مفوض رسمي بموجب توكيل</option>
                      <option value="investor">مستثمر / مطور عقاري</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">رقم الهاتف والتواصل <span className="text-rose-400">*</span></label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="01001234567"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">رقم الواتساب (لإرسال إفادة المعاينة)</label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="01001234567"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الرقم القومي (اختياري)</label>
                    <input
                      type="text"
                      value={nationalId}
                      onChange={(e) => setNationalId(e.target.value)}
                      placeholder="14 رقم"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">سند الملكية المتاح</label>
                    <select
                      value={ownershipDocumentType}
                      onChange={(e) => setOwnershipDocumentType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="registered_deed">عقد مسجل شهر عقاري (أزرق)</option>
                      <option value="primary_contract">عقد ابتدائي بصحة توقيع ونفاذ</option>
                      <option value="usufruct">حق انتفاع / تخصيص حكومي معتمد</option>
                      <option value="long_term_lease">عقد إيجار طويل الأجل مسجل</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Site Location and Dimensions */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>الموقع الجغرافي والأبعاد والمساحة</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">المحافظة <span className="text-rose-400">*</span></label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="القاهرة">القاهرة</option>
                      <option value="الجيزة">الجيزة</option>
                      <option value="القليوبية">القليوبية</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="الشرقية">الشرقية</option>
                      <option value="الدقهلية">الدقهلية</option>
                      <option value="المنوفية">المنوفية</option>
                      <option value="البحيرة">البحيرة</option>
                      <option value="السويس">السويس</option>
                      <option value="الإسماعيلية">الإسماعيلية</option>
                      <option value="بني سويف">بني سويف</option>
                      <option value="الفيوم">الفيوم</option>
                      <option value="أسيوط">أسيوط</option>
                      <option value="محافظة أخرى">محافظة أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">المدينة / المركز <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="مثال: الهرم أو التجمع أو شبرا"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الحي / المنطقة / القرية</label>
                    <input
                      type="text"
                      value={districtOrVillage}
                      onChange={(e) => setDistrictOrVillage(e.target.value)}
                      placeholder="مثال: طريق المنصورية"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">العنوان التفصيلي وأقرب علامة مميزة <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="مثال: طريق المنصورية الرئيسي - بجوار قرية العزبة السياحية"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">المساحة الإجمالية (م²)</label>
                    <input
                      type="number"
                      value={totalAreaM2}
                      onChange={(e) => setTotalAreaM2(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">طول الواجهة على الشارع (متر)</label>
                    <input
                      type="number"
                      value={frontageMeters}
                      onChange={(e) => setFrontageMeters(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">عمق الأرض (متر)</label>
                    <input
                      type="number"
                      value={depthMeters}
                      onChange={(e) => setDepthMeters(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Current Status and Partnership Goal */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span>النشاط الحالي والغرض من طلب المعاينة</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">النشاط الحالي للأرض / الموقع</label>
                    <select
                      value={currentSiteUsage}
                      onChange={(e) => setCurrentSiteUsage(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="existing_fuel_station">محطة وقود سائل قائمة (بنزين وسولار)</option>
                      <option value="vacant_land">أرض فضاء صالحة للإنشاء</option>
                      <option value="commercial_garage">جراج تجاري أو ساحة انتظار سيارات</option>
                      <option value="transport_hub">موقف سرفيس أو محطة نقل ركاب</option>
                      <option value="industrial_warehouse">مخزن أو هنجر صناعي</option>
                    </select>
                  </div>

                  {currentSiteUsage === 'existing_fuel_station' && (
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">اسم / ماركة محطة البنزين القائمة</label>
                      <input
                        type="text"
                        value={existingStationBrand}
                        onChange={(e) => setExistingStationBrand(e.target.value)}
                        placeholder="مثال: مصر للبترول / التعاون / توتال / شل / موبيل"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">الغرض ونموذج الشراكة المطلوب مع كارجاس</label>
                    <select
                      value={partnershipPreference}
                      onChange={(e) => setPartnershipPreference(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="integrated_fuel_and_cng">إضافة طلمبات غاز طبيعي لمحطة البنزين القائمة (شراكة استغلال)</option>
                      <option value="cng_only_station">إنشاء محطة تموين غاز طبيعي مستقلة ومظلة كارجاس</option>
                      <option value="station_and_conversion">محطة تموين متكاملة + مركز تحويل وصيانة سيارات</option>
                      <option value="conversion_center_only">مركز تحويل وصيانة وفحص أسطوانات غاز فقط</option>
                      <option value="long_term_lease_to_cargas">تأجير الأرض / الموقع لكارجاس بعقد طويل الأجل</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">تصنيف الشارع والجزيرة الوسطى</label>
                    <select
                      value={roadClassification}
                      onChange={(e) => setRoadClassification(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="main_axis">محور رئيسي سريع بحركة مرورية كثيفة</option>
                      <option value="highway">طريق سريع حر / إقليمي</option>
                      <option value="commercial_street">شارع تجاري بقلب المدينة ومواقف سرفيس</option>
                      <option value="city_entrance">مدخل مدينة أو منطقة صناعية</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">ملاحظات إضافية وتفاصيل الموقع</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي بيانات تود إضافتها عن كثافة السيارات بالمنطقة، وجود خط غاز قريب، خطوط السرفيس..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>تأكيد تسجيل طلب المعاينة</span>
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================= */
            /* VIEW: LIST OF LANDOWNER APPLICATIONS                      */
            /* ========================================================= */
            <div className="space-y-4">
              
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="البحث باسم المالك، العنوان، المدينة، أو الهاتف..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <select
                  value={filterGov}
                  onChange={(e) => setFilterGov(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="all">كافة المحافظات</option>
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="القليوبية">القليوبية</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="الشرقية">الشرقية</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="all">كافة الحالات</option>
                  <option value="pending_review">قيد الفحص</option>
                  <option value="surveyor_dispatched">تم تكليف معاين</option>
                  <option value="approved_marketing">معتمد تسويقياً</option>
                  <option value="rejected">مرفوض</option>
                </select>
              </div>

              {/* Applications List */}
              <div className="space-y-3">
                {filteredApps.length === 0 ? (
                  <div className="text-center py-10 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                    <Building2 className="w-10 h-10 mx-auto text-slate-500 mb-2" />
                    <p className="font-bold text-slate-300">لا توجد طلبات معاينة تطابق البحث</p>
                    <p className="text-[11px] text-slate-500 mt-1">اضغط على "تسجيل طلب معاينة جديد" لإضافة موقع لمالك جديد</p>
                  </div>
                ) : (
                  filteredApps.map((app) => (
                    <div 
                      key={app.id}
                      className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:border-indigo-500/50 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-400">
                            {app.governorate.charAt(0)}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-sm text-white">{app.ownerName}</h4>
                              <span className="text-[10px] text-slate-400 font-mono">({app.applicationDate})</span>
                            </div>
                            <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                              <span>{app.fullAddress}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusBadge(app.status)}
                          {app.marketingEvaluationScore && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              تقييم: {app.marketingEvaluationScore}%
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details Strip */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-700/60 text-[11px]">
                        <div>
                          <span className="text-slate-400 block">المساحة والواجهة:</span>
                          <span className="font-bold text-slate-200">{app.totalAreaM2} م² (واجهة {app.frontageMeters}م)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">النشاط الحالي:</span>
                          <span className="font-bold text-slate-200">
                            {app.currentSiteUsage === 'existing_fuel_station' ? `محطة ${app.existingStationBrand || 'بنزين'}` : 'أرض فضاء'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">المطلوب من كارجاس:</span>
                          <span className="font-bold text-emerald-400">
                            {app.partnershipPreference === 'integrated_fuel_and_cng' ? 'إضافة طلمبات غاز' : 'محطة تموين وتحويل'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">الهاتف والواتساب:</span>
                          <span className="font-bold font-mono text-cyan-300" dir="ltr">{app.phoneNumber}</span>
                        </div>
                      </div>

                      {app.notes && (
                        <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                          <strong className="text-slate-300">ملاحظات الموقع: </strong> {app.notes}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/60">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`https://wa.me/${app.whatsappNumber}?text=${generateWhatsAppMessage(app)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>مراسلة المالك واتساب</span>
                          </a>

                          <a
                            href={`tel:${app.phoneNumber}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Phone className="w-3 h-3 text-indigo-400" />
                            <span>اتصال هاتفي</span>
                          </a>
                        </div>

                        {/* Status update controls for Marketing & Admin */}
                        <div className="flex items-center gap-1.5">
                          {app.status === 'pending_review' && (
                            <>
                              <button
                                onClick={() => onUpdateApplicationStatus(app.id, 'surveyor_dispatched')}
                                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                              >
                                <Compass className="w-3 h-3" />
                                <span>تكليف مساح ميداني</span>
                              </button>

                              <button
                                onClick={() => onUpdateApplicationStatus(app.id, 'approved_marketing', 92)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>اعتماد مبدئي</span>
                              </button>
                            </>
                          )}

                          {app.status === 'surveyor_dispatched' && (
                            <button
                              onClick={() => onUpdateApplicationStatus(app.id, 'approved_marketing', 95)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>اعتماد نهائي وإحالة للمشروعات</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
