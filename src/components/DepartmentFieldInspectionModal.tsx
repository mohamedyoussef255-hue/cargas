import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Save, 
  Compass, 
  Navigation, 
  Building2, 
  Wrench, 
  Flame, 
  Cpu, 
  FileCheck, 
  Scale, 
  BadgeDollarSign, 
  Share2,
  Calendar,
  User,
  Phone,
  FileText,
  Clock,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import { DepartmentRole, MonitoringSession, DepartmentFieldInspection } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import { CargasNgvLogo } from './CargasNgvLogo';

interface DepartmentFieldInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentRole;
  activeSession: MonitoringSession | null;
  sessions?: MonitoringSession[];
  onSaveInspection?: (inspection: DepartmentFieldInspection) => void;
}

export const DepartmentFieldInspectionModal: React.FC<DepartmentFieldInspectionModalProps> = ({
  isOpen,
  onClose,
  department,
  activeSession,
  sessions = [],
  onSaveInspection
}) => {
  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;

  const [siteName, setSiteName] = useState<string>(activeSession?.locationName || activeSession?.title || 'موقع محطة كارجاس الجديد');
  const [governorate, setGovernorate] = useState<string>(activeSession?.governorate || 'الجيزة');
  const [district, setDistrict] = useState<string>('حي الدقي / المهندسين');
  const [address, setAddress] = useState<string>(activeSession?.locationName || 'شارع التحرير الرئيسي');
  const [lat, setLat] = useState<number>(activeSession?.coordinates.lat || 30.0444);
  const [lng, setLng] = useState<number>(activeSession?.coordinates.lng || 31.2357);
  const [isGpsLoading, setIsGpsLoading] = useState<boolean>(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  const [inspectorName, setInspectorName] = useState<string>(meta.defaultGmName || 'م. أحمد الشربيني');
  const [inspectorPhone, setInspectorPhone] = useState<string>(meta.defaultGmPhone || '+201012345678');
  const [inspectionDate, setInspectionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [overallEvaluation, setOverallEvaluation] = useState<'compliant' | 'conditional' | 'non_compliant'>('compliant');
  const [summaryNotes, setSummaryNotes] = useState<string>('تمت المعاينة الميدانية على الطبيعة وتحديد كافة المعايير الفنية والهندسية اللازمة.');
  const [recommendations, setRecommendations] = useState<string>('يوصى باستكمال إجراءات التنسيق مع الإدارات الشريكة وسرعة بدء الأعمال الميدانية.');

  // Department-specific parameters
  const [deptData, setDeptData] = useState<Record<string, any>>(() => {
    switch (department) {
      case 'projects':
        return {
          totalAreaM2: 1650,
          facadeWidthM: 38,
          depthM: 44,
          soilCondition: 'تربة طميية متماسكة - تحتاج طبقة إحلال 50 سم',
          streetLevelStatus: 'منسوب الموقع أعلى من الشارع بـ 15 سم (ممتاز لتصريف الأمطار)',
          civilReadiness: 'جاهز لأعمال الحفر والخرسانات المسلحة',
          hazards: 'لا توجد كابلات ضغط عالي أو خطوط بترول تعوق الموقع',
          truckTurningRadius: 'دوران الشاحنات متاح بسهولة (نصف قطر > 14م)'
        };
      case 'operations':
        return {
          compressorCount: 2,
          compressorCapacityNm3: 1500,
          dispensersCount: 4,
          hosesCount: 8,
          trafficFlowEase: 'مسار حلقي باتجاه واحد بدون تقاطعات حرجة',
          waitingCapacityCars: 18,
          controlRoomLocation: 'الجهة الشمالية الشرقية بجوار مدخل الإدارة',
          gasDryerReady: 'نعم، مجفف هواء وغاز عالي الكفاءة',
          generatorKva: 250
        };
      case 'hse':
        return {
          safetySetbackDistanceM: 12.5,
          esdValveLocations: '3 محابس إغلاق طوارئ (المظلة، غرفة الضواغط، مدخل المحطة)',
          ch4GasDetectors: '8 حساسات تحت الحمراء مربوطة بلوحة الإنذار المركزي',
          firefightingSystem: 'شبكة إطفاء فوم + مياه 2.5 بوصة + 6 طفايات بودرة 50 كجم',
          emergencyExits: 'مخرجان للطوارئ منفصلان ومضاءان بإشارات فسفورية',
          civilDefenseCodeCompliance: 'مطابق للكود المصري وأكواد NFPA 52'
        };
      case 'technical':
        return {
          pipelineDiameterInch: 4,
          pipelinePressureBar: 35,
          distanceToPrmsMeters: 140,
          prmsStationLocation: 'أرض فضاء مخصصة بالركن الجنوبي للموقع',
          groundingResistanceOhm: 2.1,
          lightningRodInstalled: 'نعم، مانعة صواعق إلكترونية تغطي نصف قطر 60م',
          electricalCapacityKva: 400
        };
      case 'licensing':
        return {
          jurisdiction: 'هيئة المجتمعات العمرانية الجديدة',
          buildingPermitStatus: 'ترخيص بناء محطة وقود صادر وساري',
          civilDefenseApproval: 'موافقة مبدئية معتمدة من إدارة الحماية المدنية',
          trafficApproval: 'موافقة الإدارة العامة للمرور على المداخل والمخارج',
          environmentalRegistry: 'السجل البيئي قيد الإصدار من جهاز شؤون البيئة'
        };
      case 'legal':
        return {
          deedType: 'عقد ملكية مسجل بالشهر العقاري (حصة أصلية)',
          ownerAuthorization: 'توكيل رسمي عام إدارة وتأجير ساري المفعول',
          disputesAndLiens: 'خالٍ تماماً من أي حجوزات أو نزاعات قضائية أو رهونات بنكية',
          contractTenureYears: 15,
          commercialRegistryNum: 'سجل تجاري رقم 884729 - استثمار'
        };
      case 'financial':
        return {
          annualRentEgp: 650000,
          capexCivilEquipmentEgp: 4200000,
          utilityConnectionsCostEgp: 480000,
          expectedDailySalesSm3: 16000,
          projectedMonthlyProfitEgp: 320000,
          paybackPeriodYears: 2.3
        };
      case 'marketing':
      default:
        return {
          peakTrafficHourlyCars: 680,
          taxiMicrobusSharePercent: 62,
          nearestCngCompetitorKm: 4.8,
          frontageVisibility: 'واجهة رئيسية مكشوفة بزاوية رؤية 180 درجة لشارع حيوي',
          promotionalSignageSpace: 'متاح مساحة وافرة ليونيكول كارجاس واللوحات الإرشادية'
        };
    }
  });

  const [isSaved, setIsSaved] = useState(false);
  const [printPreview, setPrintPreview] = useState(false);

  if (!isOpen) return null;

  const handleFetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsNotice('نظام GPS غير مدعوم في هذا المتصفح');
      return;
    }
    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setIsGpsLoading(false);
        setGpsNotice(`تم التقاط الإحداثيات بنجاح بدقة: ${Math.round(pos.coords.accuracy)} متر`);
        setTimeout(() => setGpsNotice(null), 3500);
      },
      (err) => {
        setIsGpsLoading(false);
        setGpsNotice('تعذر الوصول إلى نظام GPS: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = () => {
    const inspection: DepartmentFieldInspection = {
      id: 'insp-' + Date.now(),
      department,
      siteName,
      governorate,
      district,
      address,
      coordinates: { lat, lng },
      inspectionDate,
      inspectorName,
      inspectorPhone,
      overallEvaluation,
      summaryNotes,
      recommendations,
      data: deptData,
      createdAt: new Date().toISOString()
    };

    try {
      const existingStr = localStorage.getItem('cng_field_inspections_v1');
      const existingList: DepartmentFieldInspection[] = existingStr ? JSON.parse(existingStr) : [];
      localStorage.setItem('cng_field_inspections_v1', JSON.stringify([inspection, ...existingList]));
    } catch (e) {
      console.error('Error saving field inspection', e);
    }

    if (onSaveInspection) {
      onSaveInspection(inspection);
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  تنفيذ معاينة ميدانية ورصد الموقع • {meta.title}
                </h2>
                <span className="px-2 py-0.5 text-[11px] rounded font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {meta.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                تسجيل وحصر البيانات الفنية والميدانية المتخصصة الخاصة بالإدارة
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintPreview(!printPreview)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{printPreview ? 'العودة للاستمارة' : 'معاينة التقرير الرسمي'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {isSaved && (
          <div className="m-4 p-3 rounded-xl bg-emerald-600 text-white flex items-center gap-2 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>تم حفظ تقرير المعاينة الميدانية التخصصية بنجاح وتوثيقه في سجل المنظومة!</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-6">
          
          {/* Printable Letterhead Mode */}
          {printPreview ? (
            <div className="bg-white text-slate-900 p-8 rounded-xl shadow-lg border border-slate-300 space-y-6 print:p-0">
              <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
                <CargasNgvLogo size="md" layout="horizontal" />
                <div className="text-left">
                  <span className="font-bold text-emerald-800 text-sm">تقرير معاينة ميدانية فنية معتمدة</span>
                  <p className="text-xs text-slate-500 font-mono">Ref: INSP-{department.toUpperCase()}-{inspectionDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">الإدارة المختصة:</span>
                  <span className="font-bold">{meta.title}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">اسم الموقع:</span>
                  <span className="font-bold">{siteName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">المحافظة:</span>
                  <span className="font-bold">{governorate} - {district}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">تاريخ المعاينة:</span>
                  <span className="font-bold">{inspectionDate}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-sm text-slate-800 border-b pb-2">بيانات الرصد الميداني التخصصية:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(deptData).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 rounded bg-slate-100/60">
                      <span className="text-slate-600">{key}:</span>
                      <span className="font-bold text-slate-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">القرار والتوصية النهائية:</span>
                  <span className={`px-2 py-0.5 rounded font-black text-xs ${
                    overallEvaluation === 'compliant' ? 'bg-emerald-100 text-emerald-800' :
                    overallEvaluation === 'conditional' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {overallEvaluation === 'compliant' ? 'مطابق وصالح للتنفيذ' :
                     overallEvaluation === 'conditional' ? 'مطابق بتحفظات واشتراطات' : 'غير مطابق'}
                  </span>
                </div>
                <p className="text-slate-700 font-medium">{summaryNotes}</p>
                <p className="text-slate-600 italic">التوصيات: {recommendations}</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">مهندس / مسؤول المعاينة:</span>
                  <span className="font-bold">{inspectorName} ({inspectorPhone})</span>
                </div>
                <div className="text-center">
                  <span className="text-slate-500 block">اعتماد مدير عام الإدارة:</span>
                  <span className="font-bold">{meta.defaultGmName}</span>
                </div>
                <div className="text-left">
                  <span className="text-slate-500 block">خاتم الإدارة المعتمد:</span>
                  <div className="w-20 h-12 border border-dashed border-emerald-500 rounded flex items-center justify-center text-[10px] text-emerald-600 font-bold">
                    معتمد كارجاس
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* General Site Data Section */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>البيانات الأساسية للموقع ونظام الملاحة GPS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">اسم الموقع / المحطة:</label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">المحافظة:</label>
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="القاهرة">القاهرة</option>
                      <option value="الجيزة">الجيزة</option>
                      <option value="القليوبية">القليوبية</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="الشرقية">الشرقية</option>
                      <option value="الغربية">الغربية</option>
                      <option value="المنوفية">المنوفية</option>
                      <option value="الدقهلية">الدقهلية</option>
                      <option value="البحيرة">البحيرة</option>
                      <option value="بني سويف">بني سويف</option>
                      <option value="السويس">السويس</option>
                      <option value="الإسماعيلية">الإسماعيلية</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">المنطقة / الحي:</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-300 block mb-1">العنوان التفصيلي / الشارع:</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleFetchCurrentLocation}
                      disabled={isGpsLoading}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{isGpsLoading ? 'جاري التقاط الموقع...' : 'التقاط إحداثيات GPS'}</span>
                    </button>
                  </div>
                </div>

                {gpsNotice && (
                  <div className="text-[11px] font-mono text-sky-300 bg-sky-950/60 p-2 rounded border border-sky-800">
                    {gpsNotice} • خط العرض: {lat.toFixed(5)} ، خط الطول: {lng.toFixed(5)}
                  </div>
                )}
              </div>

              {/* Inspector Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">اسم المعاين / المهندس:</label>
                  <input
                    type="text"
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">رقم الهاتف / الواتساب:</label>
                  <input
                    type="text"
                    value={inspectorPhone}
                    onChange={(e) => setInspectorPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">تاريخ المعاينة:</label>
                  <input
                    type="date"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Department-Tailored Technical Survey Fields */}
              <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>عناصر الرصد الفني التخصصي لـ {meta.title}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(deptData).map(([fieldKey, fieldValue]) => (
                    <div key={fieldKey} className="space-y-1">
                      <label className="text-xs text-slate-300 font-medium block">
                        {fieldKey === 'totalAreaM2' ? 'المساحة الإجمالية للموقع (م2):' :
                         fieldKey === 'facadeWidthM' ? 'عرض الواجهة على الشارع (متر):' :
                         fieldKey === 'depthM' ? 'عمق الأرض (متر):' :
                         fieldKey === 'soilCondition' ? 'حالة التربة ومناسيب التأسيس:' :
                         fieldKey === 'streetLevelStatus' ? 'منسوب الموقع بالنسبة لأسفلت الشارع:' :
                         fieldKey === 'civilReadiness' ? 'جاهزية الأعمال المدنية والإنشائية:' :
                         fieldKey === 'hazards' ? 'عوائق ومخاطر الموقع المجاورة:' :
                         fieldKey === 'truckTurningRadius' ? 'سهولة دوران الشاحنات وتفريغ المعدات:' :
                         fieldKey === 'compressorCount' ? 'عدد ضواغط الغاز المقترحة:' :
                         fieldKey === 'compressorCapacityNm3' ? 'طاقة الضواغط (م3 قياسي/ساعة):' :
                         fieldKey === 'dispensersCount' ? 'عدد طلمبات التموين (Dispensers):' :
                         fieldKey === 'hosesCount' ? 'عدد خراطيم تموين الغاز:' :
                         fieldKey === 'trafficFlowEase' ? 'مسار وسلاسة حركة المركبات بالموقع:' :
                         fieldKey === 'waitingCapacityCars' ? 'سعة استيعاب طابور الانتظار (عدد سيارات):' :
                         fieldKey === 'controlRoomLocation' ? 'موقع غرفة التحكم واللوحات الكهربائية:' :
                         fieldKey === 'gasDryerReady' ? 'جاهزية وموقع مجفف الغاز (Gas Dryer):' :
                         fieldKey === 'generatorKva' ? 'قدرة المولد الاحتياطي المقترح (KVA):' :
                         fieldKey === 'safetySetbackDistanceM' ? 'مسافات الأمان القانونية من خط التنظيم (م):' :
                         fieldKey === 'esdValveLocations' ? 'أماكن وتوزيع صمامات إغلاق الطوارئ ESD:' :
                         fieldKey === 'ch4GasDetectors' ? 'حساسات ومنظومة كشف تسريب الغاز الميثان:' :
                         fieldKey === 'firefightingSystem' ? 'شبكة مكافحة الحريق وخزانات المياه:' :
                         fieldKey === 'emergencyExits' ? 'مخارج الطوارئ ومسارات الإخلاء:' :
                         fieldKey === 'civilDefenseCodeCompliance' ? 'مطابقة الكود المصري والدفاع المدني:' :
                         fieldKey === 'pipelineDiameterInch' ? 'قطر خط الغاز المغذي (بوصة):' :
                         fieldKey === 'pipelinePressureBar' ? 'ضغط خط الغاز الوارد (بار Bar):' :
                         fieldKey === 'distanceToPrmsMeters' ? 'المسافة لأقرب نقطة ربط شبكي (متر):' :
                         fieldKey === 'prmsStationLocation' ? 'موقع محطة تخفيض الضغط والقياس PRMS:' :
                         fieldKey === 'groundingResistanceOhm' ? 'قياس مقاومة التأريض ومانعات الصواعق (أوم):' :
                         fieldKey === 'lightningRodInstalled' ? 'شبكة مانعات الصواعق المقترحة:' :
                         fieldKey === 'electricalCapacityKva' ? 'القدرة الكهربائية المطلوبة من شركة التوزيع (KVA):' :
                         fieldKey === 'jurisdiction' ? 'جهة الولاية الإدارية على الموقع:' :
                         fieldKey === 'buildingPermitStatus' ? 'موقف رخصة البناء والتشغيل:' :
                         fieldKey === 'civilDefenseApproval' ? 'موافقة إدارة الحماية المدنية:' :
                         fieldKey === 'trafficApproval' ? 'تصريح المرور على المداخل والمخارج:' :
                         fieldKey === 'environmentalRegistry' ? 'السجل البيئي وموافقة جهاز البيئة:' :
                         fieldKey === 'deedType' ? 'سند ملكية الأرض والوثائق الرسمية:' :
                         fieldKey === 'ownerAuthorization' ? 'صحة توكيلات وصفة المالك:' :
                         fieldKey === 'disputesAndLiens' ? 'خلو الموقع من النزاعات والرهونات القضائية:' :
                         fieldKey === 'contractTenureYears' ? 'مدة التعاقد المقترحة (سنوات):' :
                         fieldKey === 'commercialRegistryNum' ? 'رقم السجل التجاري والبطاقة الضريبية:' :
                         fieldKey === 'annualRentEgp' ? 'القيمة الإيجارية السنوية المقترحة (جنيه):' :
                         fieldKey === 'capexCivilEquipmentEgp' ? 'التكلفة الرأسمالية التقديرية CAPEX (جنيه):' :
                         fieldKey === 'utilityConnectionsCostEgp' ? 'تكلفة مقايسات المرافق والربط (جنيه):' :
                         fieldKey === 'expectedDailySalesSm3' ? 'المبيعات اليومية المتوقعة (م3 غاز):' :
                         fieldKey === 'projectedMonthlyProfitEgp' ? 'صافي العائد الشهري المتوقع (جنيه):' :
                         fieldKey === 'paybackPeriodYears' ? 'فترة استرداد رأس المال التقديرية (سنوات):' :
                         fieldKey === 'peakTrafficHourlyCars' ? 'كثافة المرور في ساعة الذروة (مركبة/ساعة):' :
                         fieldKey === 'taxiMicrobusSharePercent' ? 'نسبة المركبات المؤهلة للتحويل (تاكسي وميكروباص %):' :
                         fieldKey === 'nearestCngCompetitorKm' ? 'المسافة لأقرب محطة غاز طبيعي منافسة (كم):' :
                         fieldKey === 'frontageVisibility' ? 'وضوح واجهة المحطة وزاوية الرؤية للسائقين:' :
                         fieldKey === 'promotionalSignageSpace' ? 'إمكانية وضع لوحات كارجاس الدعائية:' :
                         fieldKey}
                      </label>
                      <input
                        type={typeof fieldValue === 'number' ? 'number' : 'text'}
                        value={fieldValue}
                        onChange={(e) => {
                          const val = typeof fieldValue === 'number' ? Number(e.target.value) : e.target.value;
                          setDeptData({ ...deptData, [fieldKey]: val });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Decision & Recommendations */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                <label className="text-xs text-slate-300 font-bold block">
                  التقييم الفني النهائي لصلاحية الموقع للمنظومة:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOverallEvaluation('compliant')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      overallEvaluation === 'compliant'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ✓ مطابق وصالح للتنفيذ
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverallEvaluation('conditional')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      overallEvaluation === 'conditional'
                        ? 'bg-amber-600/30 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚠ مطابق مع اشتراطات
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverallEvaluation('non_compliant')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      overallEvaluation === 'non_compliant'
                        ? 'bg-rose-600/30 border-rose-500 text-rose-300 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ✕ غير مطابق حالياً
                  </button>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">ملاحظات المعاينة الميدانية التلخيصية:</label>
                  <textarea
                    rows={2}
                    value={summaryNotes}
                    onChange={(e) => setSummaryNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">التوصيات التنفيذية للإدارة:</label>
                  <input
                    type="text"
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/70">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          
          <button
            id="btn-save-department-field-inspection"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>حفظ واعتماد تقرير المعاينة الميدانية</span>
          </button>
        </div>

      </div>
    </div>
  );
};
