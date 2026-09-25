import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Car, 
  Flame, 
  FileText, 
  Send, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Zap, 
  Camera, 
  ShieldCheck, 
  Printer, 
  Download, 
  Share2, 
  Calendar, 
  DollarSign, 
  Compass, 
  Layers, 
  Sliders, 
  Eye, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Award,
  RefreshCw,
  XCircle,
  HelpCircle,
  Plus,
  Wrench
} from 'lucide-react';
import { MonitoringSession, CNGStation, LandownerInspectionRequest, createDefaultVehicleCounts } from '../types';
import { OfficialLetterPdfModal, OfficialLetterData, OfficialLetterType } from './OfficialLetterPdfModal';
import { DevelopmentEfficiencyModal } from './DevelopmentEfficiencyModal';
import { LandownerInspectionModal } from './LandownerInspectionModal';

export type MarketingWorkflowStep = 
  | 'applications'     // 1. طلبات الملاك والشركات
  | 'crew'             // 2. تشكيل طاقم المعاينة الميدانية (2-3 موظفين)
  | 'radar'            // 3. رادار كاميرا الرصد الميداني وحصر المركبات
  | 'study_decision'   // 4. الدراسة التسويقية المتكاملة وتحديد الصلاحية
  | 'dispatches'       // 5. منظومة الخطابات الرسمية الموجهة للإدارات (PDF)
  | 'followup'         // 6. نظام متابعة المخاطبات والاستعجال والتنبيهات
  | 'staff_kpi'        // 7. تقييم أداء العاملين بإدارة التسويق
  | 'dev_efficiency';  // 8. تطوير المحطات ورفع الكفاءة (ستُفعّل قريباً)

interface MarketingStationOperationsWorkflowProps {
  session?: MonitoringSession | null;
  sessions?: MonitoringSession[];
  activeSession?: MonitoringSession | null;
  stations: CNGStation[];
  onSelectSession?: (session: MonitoringSession) => void;
  onUpdateSession: (updatedSession: MonitoringSession) => void;
  onNavigateToCamera?: () => void;
  onNavigateToCameraRadar?: () => void;
  onNavigateToMap?: () => void;
}

export const MarketingStationOperationsWorkflow: React.FC<MarketingStationOperationsWorkflowProps> = ({
  session: propSession,
  sessions,
  activeSession,
  stations,
  onSelectSession,
  onUpdateSession,
  onNavigateToCamera,
  onNavigateToCameraRadar,
  onNavigateToMap,
}) => {
  // Resolve active session reliably
  const session: MonitoringSession = propSession || activeSession || (sessions && sessions.length > 0 ? sessions[0] : {
    id: 'mkt-default-session',
    code: 'MKT-SITE-01',
    title: 'موقع محطة كارجاس المقترحة',
    locationName: 'موقع محور 26 يوليو المركزي',
    governorate: 'الجيزة',
    city: 'الشيخ زايد',
    trafficDirection: 'اتجاهين',
    surveyorName: 'م. محمد عبد الرحمن',
    durationSeconds: 7200,
    coordinates: { lat: 30.0131, lng: 31.2089 },
    startTime: new Date().toISOString(),
    status: 'completed',
    counts: createDefaultVehicleCounts({
      private: 420,
      taxi: 280,
      microbus: 310,
      van: 95,
      minibus: 45,
      pickup: 80,
      bus: 35,
      motorcycle: 60,
      peugeot_station: 15,
      suzuki_van: 30
    }),
    detections: [],
    nearestStation: 'محطة كارجاس ميدان الرماية (2.1 كم)',
    notes: 'موقع استراتيجي ممتاز بكثافة مرورية عالية ومردود استثماري واعد.',
    stationConsensus: {
      decision: 'approved',
      marketingScore: 92,
      feasibilityVerdict: 'viable',
      expectedDailySalesM3: 12500,
      notes: 'موقع معتمد تسويقياً ويصلح لإنشاء محطة متكاملة تموين غاز طبيعي وشحن كهربائي.'
    } as any
  });

  const [activeStep, setActiveStep] = useState<MarketingWorkflowStep>('study_decision');
  
  // Modals state
  const [isLetterModalOpen, setIsLetterModalOpen] = useState<boolean>(false);
  const [letterModalData, setLetterModalData] = useState<OfficialLetterData | null>(null);
  const [isDevEfficiencyOpen, setIsDevEfficiencyOpen] = useState<boolean>(false);
  const [isLandownerModalOpen, setIsLandownerModalOpen] = useState<boolean>(false);

  // Marketing Site Decision State
  const [siteDecision, setSiteDecision] = useState<'approved' | 'rejected' | 'postponed' | 'conditional'>(
    (session.stationConsensus as any)?.decision || 'approved'
  );
  const [decisionNotes, setDecisionNotes] = useState<string>(
    session.notes || 'الموقع يحقق كثافة مرورية عالية ومردود استثماري واعد للشركة مع توافر مساحات مناورة مناسبة.'
  );

  // Field Survey Crew State (2 to 3 staff)
  const [crewCount, setCrewCount] = useState<number>(3);
  const [crewLead, setCrewLead] = useState<string>('م. محمد عبد الرحمن (مهندس أول تسويق)');
  const [crewSurveyor, setCrewSurveyor] = useState<string>('م. أحمد سامي (مسؤول رصد الكاميرا وحصر المركبات)');
  const [crewAnalyst, setCrewAnalyst] = useState<string>('أ. إبراهيم كمال (باحث دراسات المنافسين والمحيط)');
  const [surveyDate, setSurveyDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [surveyTimeSlot, setSurveyTimeSlot] = useState<string>('08:00 ص - 12:00 م (ذروة صباحية)');

  // Marketing Technical & Financial Assumptions
  const [expectedDailySalesM3, setExpectedDailySalesM3] = useState<number>(12500);
  const [isLiquidPartner, setIsLiquidPartner] = useState<boolean>(true);
  const [liquidPartnerName, setLiquidPartnerName] = useState<string>('محطة مصر للبترول / موبيل قائمة');
  const [hasEvCharging, setHasEvCharging] = useState<boolean>(true);

  // Dispatches Tracking Log (with 48h timer and escalations)
  const [dispatches, setDispatches] = useState<{
    id: string;
    deptName: string;
    deptRole: string;
    letterType: OfficialLetterType;
    refNumber: string;
    sentDate: string;
    hoursPassed: number;
    status: 'replied' | 'pending' | 'overdue';
    responseNote?: string;
    escalationLevel: number; // 0: None, 1: First Escalation, 2: Second Escalation
  }[]>([
    {
      id: 'disp-1',
      deptName: 'الإدارة العامة للمشروعات',
      deptRole: 'projects',
      letterType: 'projects_drawings_cost',
      refNumber: 'CRG-MKT-PRJ-2025/11-042',
      sentDate: '2025-11-20',
      hoursPassed: 54,
      status: 'overdue',
      responseNote: 'جاري مراجعة المخططات الهندسية وتوقيع الضاغط وحاويات الغاز على الرسومات',
      escalationLevel: 1,
    },
    {
      id: 'disp-2',
      deptName: 'الإدارة العامة للتشغيل والصيانة',
      deptRole: 'operations',
      letterType: 'operations_gas_pipeline',
      refNumber: 'CRG-MKT-OPS-2025/11-043',
      sentDate: '2025-11-20',
      hoursPassed: 54,
      status: 'replied',
      responseNote: 'يتوافر خط غاز طبيعي بقطر 6 بوصة وضغط 16 بار يبعد 240 متر عن الموقع، التكلفة التقديرية 2.8 مليون جنيه',
      escalationLevel: 0,
    },
    {
      id: 'disp-3',
      deptName: 'الإدارة العامة للشئون المالية',
      deptRole: 'finance',
      letterType: 'finance_feasibility_study',
      refNumber: 'CRG-MKT-FIN-2025/11-044',
      sentDate: '2025-11-22',
      hoursPassed: 18,
      status: 'pending',
      responseNote: 'قيد إعداد جدول التدفقات النقدية ومعدل العائد الداخلي (IRR)',
      escalationLevel: 0,
    },
    {
      id: 'disp-4',
      deptName: 'الإدارة العامة للشئون القانونية والتراخيص',
      deptRole: 'legal',
      letterType: 'legal_contracts_licensing',
      refNumber: 'CRG-MKT-LEG-2025/11-045',
      sentDate: '2025-11-23',
      hoursPassed: 8,
      status: 'pending',
      responseNote: 'مراجعة سند ملكية الموقع ورخص الوقود السائل تمهيداً لصياغة العقد',
      escalationLevel: 0,
    },
    {
      id: 'disp-5',
      deptName: 'إدارة السلامة والصحة المهنية (HSE)',
      deptRole: 'hse',
      letterType: 'hse_safety_approval',
      refNumber: 'CRG-MKT-HSE-2025/11-046',
      sentDate: '2025-11-23',
      hoursPassed: 8,
      status: 'pending',
      responseNote: 'مطابقة مسافات الأمان وحوائط الصد طبقاً لكود إيجاس وNFPA 52',
      escalationLevel: 0,
    },
  ]);

  // Open Letter Modal Helper
  const handleOpenLetter = (letterType: OfficialLetterType, originalRef?: string, overdueDays?: number) => {
    const letterData: OfficialLetterData = {
      letterType,
      refNumber: `CRG-MKT-${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      siteName: session.locationName || 'موقع محطة كارجاس المقترحة',
      locationAddress: session.resolvedAddress || (session as any).address || session.locationName || 'طريق المحور المركزي - الحي الصناعي',
      governorate: session.governorate || 'الجيزة',
      coordinates: session.coordinates,
      areaM2: 1250,
      frontageM: 38,
      streetsCount: 2,
      isLiquidFuelStation: isLiquidPartner,
      liquidPartnerName: liquidPartnerName,
      hasEvChargingProposed: hasEvCharging,
      expectedDailySalesM3: expectedDailySalesM3,
      expectedMonthlySalesM3: expectedDailySalesM3 * 30,
      civilCostEstimate: 19500000,
      pipelineCostEstimate: 2800000,
      surveyorLeadName: crewLead.split('(')[0].trim(),
      marketingGmName: 'م. أحمد حامد (مدير عام التسويق)',
      originalLetterRef: originalRef,
      urgentDaysOverdue: overdueDays || 3,
    };

    setLetterModalData(letterData);
    setIsLetterModalOpen(true);
  };

  // Handle Escalations (1st and 2nd escalation)
  const handleEscalate = (dispatchId: string, currentLevel: number) => {
    const nextLevel = currentLevel + 1;
    const targetDisp = dispatches.find(d => d.id === dispatchId);
    if (!targetDisp) return;

    const letterType = nextLevel === 1 ? 'escalation_reminder_1' : 'escalation_reminder_2';
    handleOpenLetter(letterType, targetDisp.refNumber, Math.floor(targetDisp.hoursPassed / 24));

    // Update dispatch list
    setDispatches(prev => prev.map(d => {
      if (d.id === dispatchId) {
        return {
          ...d,
          escalationLevel: nextLevel,
          responseNote: `تم إرسال ${nextLevel === 1 ? 'الاستعجال الأول' : 'الاستعجال الثاني العاجل'} بتاريخ اليوم`
        };
      }
      return d;
    }));
  };

  // Total vehicles surveyed from camera
  const totalVehiclesCount = Object.values(session.counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Top Banner: Marketing Department Core Identity */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-950 border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>المنظومة المتكاملة لإدارة تسويق المحطات</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                كود الموقع: {session.code || 'MKT-SITE-01'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-emerald-400" />
              <span>{session.locationName || 'موقع محطة كارجاس المقترحة'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{session.governorate} - {session.resolvedAddress || (session as any).address || session.locationName || 'طريق المحور المركزي'}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-bold">
                إجمالي رصد رادار الكاميرا: {totalVehiclesCount} مركبة
              </span>
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Quick Open Camera Radar */}
            {onNavigateToCameraRadar && (
              <button
                id="btn-mkt-open-radar"
                onClick={onNavigateToCameraRadar}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                title="فتح كاميرا الرصد الميداني ورادار حصر وتصنيف المركبات"
              >
                <Camera className="w-4 h-4" />
                <span>رادار كاميرا الرصد</span>
              </button>
            )}

            {/* Quick Open Landowner Applications */}
            <button
              id="btn-mkt-landowner-apps"
              onClick={() => setIsLandownerModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs border border-teal-500/30 shadow transition-all cursor-pointer"
              title="عرض طلبات المعاينة المقدمة من ملاك الأراضي وإرسال الرابط بالواتساب"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              <span>طلبات الملاك (واتساب)</span>
            </button>

            {/* Development & Efficiency Department Preview */}
            <button
              id="btn-mkt-dev-efficiency"
              onClick={() => setIsDevEfficiencyOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600/90 to-rose-600/90 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 border border-amber-400/40 transition-all cursor-pointer"
              title="إدارة تطوير المحطات ورفع الكفاءة (ستُفعّل قريباً)"
            >
              <TrendingUp className="w-4 h-4 text-amber-200" />
              <span>تطوير المحطات ورفع الكفاءة</span>
              <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[9px] font-black text-amber-300">
                قريباً
              </span>
            </button>

          </div>
        </div>

        {/* Step-by-Step Main Horizontal Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          
          <button
            onClick={() => setActiveStep('applications')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeStep === 'applications'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>1. طلبات المعاينة (الملاك)</span>
          </button>

          <button
            onClick={() => setActiveStep('crew')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeStep === 'crew'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>2. طاقم المعاينة (2-3 موظفين)</span>
          </button>

          <button
            onClick={() => setActiveStep('radar')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeStep === 'radar'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>3. رادار الكاميرا الميداني</span>
          </button>

          <button
            onClick={() => setActiveStep('study_decision')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeStep === 'study_decision'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>4. دراسة الجدوى وقرار الصلاحية</span>
          </button>

          <button
            onClick={() => setActiveStep('dispatches')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeStep === 'dispatches'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>5. الخطابات الرسمية (PDF)</span>
          </button>

          <button
            onClick={() => setActiveStep('followup')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeStep === 'followup'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>6. متابعة المخاطبات والاستعجال</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500/40 text-[10px] font-black">
              48h
            </span>
          </button>

          <button
            onClick={() => setActiveStep('staff_kpi')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeStep === 'staff_kpi'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>7. تقييم أداء العاملين</span>
          </button>

          <button
            onClick={() => setIsDevEfficiencyOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>8. تطوير المحطات (ستُفعّل قريباً)</span>
          </button>

        </div>

      </div>

      {/* WORKFLOW VIEW CONTENT */}

      {/* 1. APPLICATIONS TAB */}
      {activeStep === 'applications' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                <span>المرحلة 1: طلبات المعاينة المقدمة من الملاك والشركات</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                استقبال بيانات أصحاب المواقع، مساحات الأراضي، وسندات الملكية، وإرسال رابط استمارة المعاينة الموحدة عبر واتساب
              </p>
            </div>

            <button
              onClick={() => setIsLandownerModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>إرسال رابط الاستمارة للمالك بالواتساب</span>
            </button>
          </div>

          {/* Cards for Application Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
              <span className="text-slate-400 font-bold">بيانات مقدم الطلب:</span>
              <p className="text-white font-bold text-sm">شركة النور للمقاولات والاستثمار</p>
              <p className="text-slate-400">ممثل المالك: م. عادل إبراهيم</p>
              <p className="text-slate-400 font-mono">هاتف / واتساب: 01012345678</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
              <span className="text-slate-400 font-bold">طبيعة الموقع المقترح:</span>
              <p className="text-emerald-400 font-bold text-sm">محطة وقود سائل قائمة (شراكة)</p>
              <p className="text-slate-300">المساحة: 1,450 م² - الواجهة: 42 متر</p>
              <p className="text-slate-300">الشوارع المحيطة: شارعان رئيسيان مزدوجان</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
              <span className="text-slate-400 font-bold">مستندات الملكية والرخص:</span>
              <div className="space-y-1 text-slate-300">
                <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>عقد الملكية مسجل بالشهر العقاري</span>
                </p>
                <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>رخصة تشغيل وقود سائل سارية</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CREW ASSIGNMENT TAB */}
      {activeStep === 'crew' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>المرحلة 2: تشكيل طاقم المعاينة الميدانية (2 إلى 3 موظفين)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                تحديد موعد النزول الميداني وتعيين مهندسي وباحثي إدارة تسويق المحطات لإجراء المسح التسويقي والرصد المروري
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400">حجم الطاقم:</span>
              <button
                onClick={() => setCrewCount(2)}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                  crewCount === 2 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                2 موظفين
              </button>
              <button
                onClick={() => setCrewCount(3)}
                className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                  crewCount === 3 ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                3 موظفين
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Lead Surveyor */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                رئيس طاقم المعاينة (الموظف 1)
              </span>
              <div>
                <label className="text-slate-400 font-bold block mb-1">الاسم والصفة:</label>
                <input
                  type="text"
                  value={crewLead}
                  onChange={(e) => setCrewLead(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-slate-400 text-[11px]">
                المسئولية: التقييم العام للموقع، قياس الواجهات، ومراجعة أبعاد الدخول والخروج والمناورة.
              </p>
            </div>

            {/* Radar / Camera Surveyor */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px]">
                مسؤول رادار الكاميرا (الموظف 2)
              </span>
              <div>
                <label className="text-slate-400 font-bold block mb-1">الاسم والصفة:</label>
                <input
                  type="text"
                  value={crewSurveyor}
                  onChange={(e) => setCrewSurveyor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <p className="text-slate-400 text-[11px]">
                المسئولية: تثبيت كاميرا الموبايل، تشغيل رادار الرصد الذكي، وحصر فئات وتدفق المركبات.
              </p>
            </div>

            {/* Analyst (if 3) */}
            {crewCount === 3 && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                  باحث دراسات المنافسين (الموظف 3)
                </span>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">الاسم والصفة:</label>
                  <input
                    type="text"
                    value={crewAnalyst}
                    onChange={(e) => setCrewAnalyst(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <p className="text-slate-400 text-[11px]">
                  المسئولية: مسح محطات المنافسين القريبة (غازتك، ماستر جاس) وحصر مواقف الميكروباص والتاكسي.
                </p>
              </div>
            )}

          </div>

          {/* Schedule Row */}
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-400">تاريخ المعاينة الميدانية:</span>
                <input
                  type="date"
                  value={surveyDate}
                  onChange={(e) => setSurveyDate(e.target.value)}
                  className="mr-2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400">فترة وساعة الرصد:</span>
                <input
                  type="text"
                  value={surveyTimeSlot}
                  onChange={(e) => setSurveyTimeSlot(e.target.value)}
                  className="mr-2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white"
                />
              </div>
            </div>

            <button
              onClick={() => setActiveStep('radar')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <span>الانتقال لرادار الكاميرا الميداني</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. RADAR SCANNER TAB */}
      {activeStep === 'radar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                <span>المرحلة 3: رادار كاميرا الرصد الميداني وحصر وتصنيف المركبات</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                برمجة كاميرا الموبايل لتعمل كرادار ذكي يرصد حركة المرور، يصنف المركبات (ملاكي، تاكسي، ميكروباص)، ويحسب تدفق أسطول الغاز
              </p>
            </div>

            {onNavigateToCameraRadar && (
              <button
                onClick={onNavigateToCameraRadar}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>فتح شاشة الرادار الكاملة بالكاميرا</span>
              </button>
            )}
          </div>

          {/* Radar Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-slate-400 text-[11px]">إجمالي المركبات المرصودة</span>
              <p className="text-2xl font-black text-cyan-400 font-mono mt-1">{totalVehiclesCount}</p>
              <span className="text-[10px] text-slate-500">مركبة تم رصدها</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-slate-400 text-[11px]">أسطول الغاز المستهدف</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {(session.counts.microbus || 0) + (session.counts.taxi || 0)}
              </p>
              <span className="text-[10px] text-emerald-500 font-bold">تاكسي وميكروباص</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-slate-400 text-[11px]">معدل التدفق بالساعة</span>
              <p className="text-2xl font-black text-amber-400 font-mono mt-1">
                {Math.round(totalVehiclesCount * 3.5)}
              </p>
              <span className="text-[10px] text-slate-500">مركبة / ساعة</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span className="text-slate-400 text-[11px]">كثافة الطلب التقديرية</span>
              <p className="text-2xl font-black text-rose-400 font-mono mt-1">مرتفعة جداً</p>
              <span className="text-[10px] text-rose-300">مؤشر جاذبية 94%</span>
            </div>
          </div>

          {/* Breakdown by Vehicle Type */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300">تصنيف أسطول المركبات طبقاً للرادار:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">ملاكي</span>
                <span className="text-white font-mono font-bold text-sm">{session.counts.private || 0}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 block text-[11px] font-bold">تاكسي (هدف أساسي)</span>
                <span className="text-emerald-300 font-mono font-bold text-sm">{session.counts.taxi || 0}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-emerald-500/30">
                <span className="text-emerald-400 block text-[11px] font-bold">ميكروباص (هدف أساسي)</span>
                <span className="text-emerald-300 font-mono font-bold text-sm">{session.counts.microbus || 0}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">نصف نقل / فان</span>
                <span className="text-white font-mono font-bold text-sm">{(session.counts.pickup || 0) + (session.counts.van || 0)}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">أتوبيس</span>
                <span className="text-white font-mono font-bold text-sm">{session.counts.bus || 0}</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">دراجة / تروسيكل</span>
                <span className="text-white font-mono font-bold text-sm">{session.counts.motorcycle || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FEASIBILITY STUDY & MARKETING SITE DECISION TAB */}
      {activeStep === 'study_decision' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>المرحلة 4: الدراسة التسويقية المتكاملة وتحديد صلاحية الموقع</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                تقييم الموقع بناءً على الكثافة المرورية، محطات المنافسين (غازتك، ماستر جاس)، الشراكة مع الوقود السائل، إضافة شحن السيارات بالكهرباء، واتخاذ قرار إدارة التسويق
              </p>
            </div>

            {onNavigateToMap && (
              <button
                onClick={onNavigateToMap}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>عرض خريطة المنافسين ومواقع كارجاس</span>
              </button>
            )}
          </div>

          {/* Integrated Study Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* Sales Forecast */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 space-y-3">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>المبيعات التقديرية المتوقعة للغاز</span>
              </span>
              <div>
                <label className="text-slate-400 block mb-1">المبيعات اليومية المتوقعة (م³/يوم):</label>
                <input
                  type="number"
                  value={expectedDailySalesM3}
                  onChange={(e) => setExpectedDailySalesM3(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold text-base"
                />
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex justify-between items-center font-mono">
                <span className="text-slate-400">المبيعات الشهرية:</span>
                <span className="text-emerald-300 font-black text-sm">
                  {(expectedDailySalesM3 * 30).toLocaleString('ar-EG')} م³/شهر
                </span>
              </div>
            </div>

            {/* Liquid Fuel & EV Partnership */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 space-y-3">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                <Zap className="w-4 h-4" />
                <span>الوقود السائل والشحن الكهربائي</span>
              </span>
              
              <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={isLiquidPartner}
                  onChange={(e) => setIsLiquidPartner(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
                />
                <span>محطة وقود سائل قائمة (شراكة إضافة نشاط الغاز)</span>
              </label>

              {isLiquidPartner && (
                <input
                  type="text"
                  value={liquidPartnerName}
                  onChange={(e) => setLiquidPartnerName(e.target.value)}
                  placeholder="اسم شركة الوقود السائل الشريكة..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              )}

              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-blue-300 font-bold">
                  <input
                    type="checkbox"
                    checked={hasEvCharging}
                    onChange={(e) => setHasEvCharging(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-500 bg-slate-900 border-slate-700"
                  />
                  <span>إضافة نشاط شحن السيارات بالكهرباء (EV Charging)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  طبقاً لرؤية كارجاس الحديثة لتحويل الموقع إلى مجمع طاقة متكامل ونظيف.
                </p>
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 space-y-3">
              <span className="font-bold text-rose-400 flex items-center gap-1.5 text-sm">
                <Building2 className="w-4 h-4" />
                <span>محيط المنافسين وأقرب محطات</span>
              </span>
              <p className="text-slate-300 text-xs leading-relaxed">
                أقرب محطة غازتك: <strong>3.8 كم</strong> (لا توجد تغطية مباشرة للمحور).
              </p>
              <p className="text-slate-300 text-xs leading-relaxed">
                أقرب محطة كارجاس تابعة للشركة: <strong>6.2 كم</strong> (الموقع يحقق انتشار استراتيجي جديد دون إزاحة مبيعات كارجاس).
              </p>
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px] font-bold">
                ✓ التقييم التنافسي: أسبقية مطلقة لكارجاس والاستحواذ على حصة سوقية 78%.
              </div>
            </div>

          </div>

          {/* OFFICIAL MARKETING SITE DECISION BOX */}
          <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-base text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>قرار إدارة تسويق المحطات بشأن صلاحية الموقع</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحديد القرار الاستثماري لإدارة التسويق والانتقال لمرحلة مخاطبة الإدارات المعنية
                </p>
              </div>

              {/* Decision Radio / Buttons */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSiteDecision('approved')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    siteDecision === 'approved'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  ✓ صالح ومقبول للاستثمار
                </button>
                <button
                  type="button"
                  onClick={() => setSiteDecision('conditional')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    siteDecision === 'conditional'
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  مشروط بتعديل المداخل والمناورة
                </button>
                <button
                  type="button"
                  onClick={() => setSiteDecision('postponed')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    siteDecision === 'postponed'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  مؤجل لحين توافر خط الغاز
                </button>
                <button
                  type="button"
                  onClick={() => setSiteDecision('rejected')}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    siteDecision === 'rejected'
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  مرفوض لضعف الجدوى
                </button>
              </div>
            </div>

            {/* Decision Notes */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">
                مبررات وتوصيات قرار إدارة التسويق:
              </label>
              <textarea
                rows={2}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Next Step Transition Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                باعتماد صلاحية الموقع، يتم فوراً إصدار وتوليد الخطابات الرسمية للإدارات بصيغة PDF.
              </span>
              <button
                onClick={() => setActiveStep('dispatches')}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-purple-600/20 cursor-pointer"
              >
                <span>الانتقال لمنظومة الخطابات الرسمية (PDF)</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* 5. OFFICIAL DISPATCHES TAB (GENERATED AS PDF) */}
      {activeStep === 'dispatches' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>المرحلة 5: منظومة الخطابات الرسمية الموجهة للإدارات (مولدة بصيغة PDF)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                توليد خطابات رسمية فورية ومطابقة لصيغ وزارة البترول وكارجاس، معتمدة وموجهة لكل إدارة تخصصية، تصدر بصيغة PDF وليس Word
              </p>
            </div>
          </div>

          {/* Letter Dispatch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Projects Dispatch Card */}
            <div className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 transition-all rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                    خطاب إلزامي أول
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">CRG-MKT-PRJ</span>
                </div>
                <h3 className="font-bold text-white text-sm">الإدارة العامة للمشروعات</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  طلب إعداد التكاليف الإنشائية ورسم هندسي للموقع أوتوكاد / PDF لتوقيع الضاغط، الحاويات، غرفة الكهرباء، المظلة، وجزر وطلمبات التموين (Dispenser).
                </p>
              </div>

              <button
                onClick={() => handleOpenLetter('projects_drawings_cost')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>توليد ومعاينة خطاب المشروعات (PDF)</span>
              </button>
            </div>

            {/* 2. Operations & Pipeline Dispatch Card */}
            <div className="bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px]">
                    خطاب استعلام خط الغاز
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">CRG-MKT-OPS</span>
                </div>
                <h3 className="font-bold text-white text-sm">الإدارة العامة للتشغيل والصيانة</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  الاستعلام الفني عن وجود وتوافر خط غاز طبيعي بالمنطقة طبقاً للإحداثيات والخريطة، وتحديد تكلفة توصيل الخط وضغطه وقطره، أو الإفادة بعدم توافره.
                </p>
              </div>

              <button
                onClick={() => handleOpenLetter('operations_gas_pipeline')}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>توليد ومعاينة خطاب التشغيل وخط الغاز (PDF)</span>
              </button>
            </div>

            {/* 3. Finance Feasibility Dispatch Card */}
            <div className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition-all rounded-2xl p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                    خطاب الجدوى المالية
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">CRG-MKT-FIN</span>
                </div>
                <h3 className="font-bold text-white text-sm">الإدارة العامة للشئون المالية</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  طلب إعداد دراسة الجدوى المالية الشاملة بناءً على المبيعات التقديرية والتكاليف، وحساب IRR والتدفقات النقدية وفترة استرداد رأس المال.
                </p>
              </div>

              <button
                onClick={() => handleOpenLetter('finance_feasibility_study')}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>توليد ومعاينة خطاب الشئون المالية (PDF)</span>
              </button>
            </div>

          </div>

          {/* Execution Phase Letters Row */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-slate-200">
              خطابات مرحلة الشروع في التنفيذ (بعد موافقة الجدوى المالية):
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleOpenLetter('legal_contracts_licensing')}
                className="p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-right text-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">الشئون القانونية والتراخيص</p>
                  <p className="text-slate-400 text-[11px]">إبرام العقود وتراخيص المرافق</p>
                </div>
                <FileText className="w-4 h-4 text-purple-400" />
              </button>

              <button
                onClick={() => handleOpenLetter('hse_safety_approval')}
                className="p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-right text-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">السلامة والصحة المهنية (HSE)</p>
                  <p className="text-slate-400 text-[11px]">مراجعة كود إيجاس ومسافات NFPA</p>
                </div>
                <ShieldCheck className="w-4 h-4 text-rose-400" />
              </button>

              <button
                onClick={() => handleOpenLetter('conversion_center_review')}
                className="p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-right text-xs transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-white">الإدارة العامة للتحويل</p>
                  <p className="text-slate-400 text-[11px]">إقامة مركز تحويل غاز طبيعي بالموقع</p>
                </div>
                <Wrench className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DISPATCHES TRACKING & ESCALATION TAB */}
      {activeStep === 'followup' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-400" />
                <span>المرحلة 6: نظام متابعة المخاطبات، تحديد مهلة الرد، والاستعجال الأول والثاني</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                استمرار دور إدارة التسويق في متابعة كافة الخطابات المرسلة للإدارات حتى تشغيل المحطة، مع احتساب مهلة الرد (48-72 ساعة) وإرسال استعجال رسمي PDF
              </p>
            </div>
          </div>

          {/* Active Dispatches Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
                  <th className="p-3">الإدارة المعنية</th>
                  <th className="p-3">رقم الخطاب الصادر</th>
                  <th className="p-3">تاريخ الإرسال</th>
                  <th className="p-3">المدة المنقضية</th>
                  <th className="p-3">موقف الرد</th>
                  <th className="p-3 text-center">إجراءات الاستعجال الرسمي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {dispatches.map((disp) => {
                  const isOverdue = disp.hoursPassed > 48 && disp.status !== 'replied';

                  return (
                    <tr key={disp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white">
                        {disp.deptName}
                      </td>
                      <td className="p-3 font-mono text-emerald-400 text-[11px]">
                        {disp.refNumber}
                      </td>
                      <td className="p-3 font-mono text-slate-400">
                        {disp.sentDate}
                      </td>
                      <td className="p-3">
                        <span className={`font-mono font-bold ${isOverdue ? 'text-rose-400' : 'text-slate-300'}`}>
                          {disp.hoursPassed} ساعة
                        </span>
                        {isOverdue && (
                          <span className="mr-1 text-[10px] text-rose-400 block font-bold">
                            (تجاوز مهلة الـ 48 ساعة)
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {disp.status === 'replied' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>تم استلام الرد</span>
                          </span>
                        ) : isOverdue ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold text-[10px] inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>متأخر ويتطلب استعجال</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px] inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>قيد الإفادة</span>
                          </span>
                        )}
                        <p className="text-[10px] text-slate-400 mt-1 max-w-xs">{disp.responseNote}</p>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {disp.status === 'replied' ? (
                            <span className="text-[11px] text-emerald-400 font-bold">
                              مكتمل ومسجل
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEscalate(disp.id, disp.escalationLevel)}
                                className={`px-2.5 py-1.5 rounded-lg text-white font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                                  disp.escalationLevel === 0
                                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30 animate-pulse'
                                }`}
                              >
                                <Send className="w-3 h-3" />
                                <span>
                                  {disp.escalationLevel === 0
                                    ? 'إرسال استعجال أول (PDF)'
                                    : 'إرسال استعجال ثانٍ وإنذار (PDF)'}
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. STAFF PERFORMANCE & KPI TAB */}
      {activeStep === 'staff_kpi' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>المرحلة 7: نظام تقييم أداء مهندسي وموظفي إدارة تسويق المحطات</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                قياس كفاءة وسرعة إنجاز المعاينات الميدانية، دقة تقديرات مبيعات الغاز، وسرعة المتابعة والاستعجال مع الإدارات
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4.5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">م. محمد عبد الرحمن</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                  مهندس أول تسويق
                </span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <p>المعاينات المنجزة هذا الشهر: <strong className="text-emerald-400 font-mono">14 موقع</strong></p>
                <p>دقة الدراسات التسويقية: <strong className="text-cyan-400 font-mono">96.8%</strong></p>
                <p>معدل سرعة المتابعة: <strong className="text-amber-400 font-mono">ممتاز (أقل من 24 س)</strong></p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-bold">
                <span className="text-slate-400">التقييم الإجمالي:</span>
                <span className="text-emerald-400 text-sm">98 / 100 (امتياز)</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4.5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">م. أحمد سامي</h4>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px]">
                  مسؤول رصد الكاميرا والرادار
                </span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <p>جلسات الرصد المنفذة: <strong className="text-emerald-400 font-mono">22 جلسة</strong></p>
                <p>إجمالي المركبات المفحوصة: <strong className="text-cyan-400 font-mono">48,500 مركبة</strong></p>
                <p>معدل تغطية ساعات الذروة: <strong className="text-amber-400 font-mono">100%</strong></p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-bold">
                <span className="text-slate-400">التقييم الإجمالي:</span>
                <span className="text-emerald-400 text-sm">95 / 100 (امتياز)</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4.5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">أ. إبراهيم كمال</h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">
                  باحث دراسات المنافسين
                </span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <p>محطات المنافسين المرصودة: <strong className="text-emerald-400 font-mono">31 محطة</strong></p>
                <p>تحديث أسعار ومبيعات السوق: <strong className="text-cyan-400 font-mono">أسبوعي مستمر</strong></p>
                <p>التنسيق مع شركات الوقود: <strong className="text-amber-400 font-mono">عالي الفاعلية</strong></p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-bold">
                <span className="text-slate-400">التقييم الإجمالي:</span>
                <span className="text-emerald-400 text-sm">94 / 100 (امتياز)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Letter PDF Modal */}
      {letterModalData && (
        <OfficialLetterPdfModal
          isOpen={isLetterModalOpen}
          data={letterModalData}
          onClose={() => setIsLetterModalOpen(false)}
          onConfirmSend={(refNum) => {
            alert(`تم تسجيل وإرسال الخطاب الرسمي رقم (${refNum}) بنجاح إلى الإدارة المختصة وتثبيته في سجل المتابعة.`);
          }}
        />
      )}

      {/* Development & Efficiency Modal */}
      <DevelopmentEfficiencyModal
        isOpen={isDevEfficiencyOpen}
        onClose={() => setIsDevEfficiencyOpen(false)}
      />

      {/* Landowner Inspection Modal */}
      <LandownerInspectionModal
        isOpen={isLandownerModalOpen}
        onClose={() => setIsLandownerModalOpen(false)}
        onSubmitRequest={(req) => {
          alert(`تم تسجيل طلب معاينة الموقع المقدم من (${req.applicantName}) بنجاح.`);
          setIsLandownerModalOpen(false);
        }}
      />

    </div>
  );
};
