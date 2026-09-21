import React, { useState } from 'react';
import { 
  Clock, 
  TrendingUp, 
  Building2, 
  Car, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Share2, 
  Sliders, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Check, 
  XCircle, 
  MapPin, 
  Gauge, 
  DollarSign, 
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Timer
} from 'lucide-react';
import { 
  MonitoringSession, 
  MarketingSessionCategory, 
  SurveyTimePeriodItem, 
  CompetitorSurveyRecord, 
  ParkingHubSurveyRecord, 
  DensityHubSurveyRecord, 
  StationConsensusEvaluation,
  DepartmentRole,
  VehicleType
} from '../types';

interface MarketingDedicatedSessionsManagerProps {
  session: MonitoringSession;
  onUpdateSession: (updatedSession: MonitoringSession) => void;
  onOpenDispatcherModal: () => void;
  onOpenDedicatedCamera: () => void;
  onOpenLandownerApplications?: () => void;
}

export const MarketingDedicatedSessionsManager: React.FC<MarketingDedicatedSessionsManagerProps> = ({
  session,
  onUpdateSession,
  onOpenDispatcherModal,
  onOpenDedicatedCamera,
  onOpenLandownerApplications,
}) => {
  const [activeSessionTab, setActiveSessionTab] = useState<MarketingSessionCategory>('site_periods');
  const [activePeriodId, setActivePeriodId] = useState<string | null>(null);
  
  // Timer state for active period observation
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  // Initialize or fetch periods (Default 4 distinct periods, minimum 15 mins each)
  const defaultPeriods: SurveyTimePeriodItem[] = [
    {
      id: 'period-1',
      periodNumber: 1,
      periodName: 'الفترة الأولى: ذروة الصباح',
      timeSlot: '07:00 ص - 10:00 ص',
      minDurationMinutes: 15,
      actualDurationSeconds: 960, // 16 mins
      completed: true,
      counts: { taxi: 42, microbus: 78, private: 110, pickup: 35, bus: 12, van: 0, minibus: 0, motorcycle: 0, suzuki_van: 0, peugeot_station: 0 },
      totalVehicles: 277,
      trafficRatePerHour: 1038,
      peakHourNotes: 'كثافة عالية لمركبات السرفيس والميكروباص المتجهة نحو التجمعات العمالية ومحاور الربط.',
      recordedAt: '08:30 ص'
    },
    {
      id: 'period-2',
      periodNumber: 2,
      periodName: 'الفترة الثانية: فترة الظهيرة ومنتصف اليوم',
      timeSlot: '12:00 م - 03:00 م',
      minDurationMinutes: 15,
      actualDurationSeconds: 900, // 15 mins
      completed: true,
      counts: { taxi: 28, microbus: 54, private: 85, pickup: 22, bus: 6, van: 0, minibus: 0, motorcycle: 0, suzuki_van: 0, peugeot_station: 0 },
      totalVehicles: 195,
      trafficRatePerHour: 780,
      peakHourNotes: 'حركة منتظمة مع تواجد لسيارات النقل الخفيف ونصف النقل المحملة بالبضائع.',
      recordedAt: '01:15 م'
    },
    {
      id: 'period-3',
      periodNumber: 3,
      periodName: 'الفترة الثالثة: الذروة المسائية والعودة',
      timeSlot: '04:00 م - 07:00 م',
      minDurationMinutes: 15,
      actualDurationSeconds: 1080, // 18 mins
      completed: true,
      counts: { taxi: 56, microbus: 92, private: 145, pickup: 30, bus: 15, van: 0, minibus: 0, motorcycle: 0, suzuki_van: 0, peugeot_station: 0 },
      totalVehicles: 338,
      trafficRatePerHour: 1126,
      peakHourNotes: 'أعلى ذروة مرورية يومية مع تباطؤ في الإشارة واصطفاف مستمر على محور الموقع.',
      recordedAt: '05:45 م'
    },
    {
      id: 'period-4',
      periodNumber: 4,
      periodName: 'الفترة الرابعة: الفترة الليلية وهدوء الحركة',
      timeSlot: '08:00 م - 11:00 م',
      minDurationMinutes: 15,
      actualDurationSeconds: 900, // 15 mins
      completed: true,
      counts: { taxi: 35, microbus: 40, private: 65, pickup: 18, bus: 4, van: 0, minibus: 0, motorcycle: 0, suzuki_van: 0, peugeot_station: 0 },
      totalVehicles: 162,
      trafficRatePerHour: 648,
      peakHourNotes: 'استمرار حركة التاكسي والسرفيس بين المدن والضواحي، مناسب لتشغيل الضاغط الليلي.',
      recordedAt: '09:20 م'
    }
  ];

  const surveyPeriods: SurveyTimePeriodItem[] = session.surveyPeriods && session.surveyPeriods.length > 0 
    ? session.surveyPeriods 
    : defaultPeriods;

  // Default Competitors
  const defaultCompetitors: CompetitorSurveyRecord[] = [
    {
      id: 'comp-1',
      name: 'محطة وقود مصر للبترول (بنزين وسولار فقط)',
      brand: 'مصر للبترول',
      distanceKm: 0.8,
      distanceMeter: 800,
      dispensersCount: 4,
      cngAvailable: false,
      cngPriceM3: 0,
      queueLengthVehicles: 6,
      avgWaitTimeMinutes: 5,
      notes: 'لا تقدم خدمة الغاز الطبيعي المضغوط، فرصة ذهبية لجذب سيارات المنطقة إلى كارجاس.'
    },
    {
      id: 'comp-2',
      name: 'محطة غازتك (غاز طبيعي ووقود)',
      brand: 'غازتك',
      distanceKm: 3.8,
      distanceMeter: 3800,
      dispensersCount: 3,
      cngAvailable: true,
      cngPriceM3: 7.0,
      queueLengthVehicles: 14,
      avgWaitTimeMinutes: 18,
      notes: 'طوابير انتظار طويلة واختناق مروري يؤكد وجود طلب فائق غير مغطى في هذا القطاع الجغرافي.'
    }
  ];

  const competitorsList: CompetitorSurveyRecord[] = session.competitorsSurvey && session.competitorsSurvey.length > 0
    ? session.competitorsSurvey
    : defaultCompetitors;

  // Default Parking Hubs
  const defaultParkingHubs: ParkingHubSurveyRecord[] = [
    {
      id: 'hub-1',
      hubName: 'موقف سرفيس الميدان والمحور المركزي',
      locationDetails: 'يبعد 450 متراً عن الموقع المقترح',
      transportType: 'microbus',
      linesCount: 8,
      activeVehiclesCount: 180,
      dailyPassengersEst: 14000,
      conversionReadiness: 'high',
      notes: 'رغبة عارمة لدى السائقين للتموين بالغاز فور افتتاح المحطة لتقليل مصاريف التشغيل بنسبة 55%.'
    },
    {
      id: 'hub-2',
      hubName: 'نقطة تجمع سيارات الأجرة والتاكسي الأبيض',
      locationDetails: 'أمام محطة القطار / المترو السطحي',
      transportType: 'taxi',
      linesCount: 4,
      activeVehiclesCount: 95,
      dailyPassengersEst: 6500,
      conversionReadiness: 'high',
      notes: 'كافة المركبات محولة بالفعل وتبحث عن محطة قريبة دون الانتظار في طوابير طويلة.'
    }
  ];

  const parkingHubsList: ParkingHubSurveyRecord[] = session.parkingHubsSurvey && session.parkingHubsSurvey.length > 0
    ? session.parkingHubsSurvey
    : defaultParkingHubs;

  // Default Density Hubs
  const defaultDensityHubs: DensityHubSurveyRecord[] = [
    {
      id: 'dense-1',
      zoneName: 'المنطقة الصناعية والتجارية المركزية',
      zoneType: 'logistics_center',
      estimatedVehiclesPerHour: 1450,
      peakFlowTime: '07:30 ص - 09:30 ص',
      cngPotentialDemand: 'very_high',
      notes: 'كثافة أساطيل توزيع ونقل خفيف ومتوسط وميني باصات شركات.'
    },
    {
      id: 'dense-2',
      zoneName: 'تقاطع المحور الشرياني مع الطريق الدائري',
      zoneType: 'major_intersection',
      estimatedVehiclesPerHour: 2200,
      peakFlowTime: '05:00 م - 07:30 م',
      cngPotentialDemand: 'very_high',
      notes: 'نقطة عبور استراتيجية لكافة المحافظات المجاورة.'
    }
  ];

  const densityHubsList: DensityHubSurveyRecord[] = session.densityHubsSurvey && session.densityHubsSurvey.length > 0
    ? session.densityHubsSurvey
    : defaultDensityHubs;

  // Available sessions check (Non-mandatory principle)
  const availableSessionsSummary = {
    hasPeriods: surveyPeriods.length > 0,
    completedPeriods: surveyPeriods.filter(p => p.completed).length,
    totalPeriods: surveyPeriods.length,
    hasCompetitors: competitorsList.length > 0,
    competitorsCount: competitorsList.length,
    hasParking: parkingHubsList.length > 0,
    parkingHubsCount: parkingHubsList.length,
    hasDensity: densityHubsList.length > 0,
    densityHubsCount: densityHubsList.length,
  };

  // Automated Capacity & Operational Sizing Calculation based on available data
  const totalVehiclesObserved = surveyPeriods.reduce((acc, p) => acc + p.totalVehicles, 0);
  const avgFlowPerHour = Math.round(surveyPeriods.reduce((acc, p) => acc + p.trafficRatePerHour, 0) / (surveyPeriods.length || 1));
  const estimatedDailyCngDemandM3 = Math.round(totalVehiclesObserved * 38); // 38 m3 avg refill per target vehicle
  
  // Recommended sizing
  const recommendedCompressor = estimatedDailyCngDemandM3 > 18000 ? 2000 : (estimatedDailyCngDemandM3 > 10000 ? 1500 : 1000);
  const recommendedDispensers = estimatedDailyCngDemandM3 > 18000 ? 4 : (estimatedDailyCngDemandM3 > 10000 ? 3 : 2);
  const recommendedHoses = recommendedDispensers * 2;

  // Consensus State
  const defaultConsensus: StationConsensusEvaluation = session.stationConsensus || {
    id: 'consensus-' + session.id,
    sessionId: session.id,
    siteName: session.title || session.locationName,
    governorate: session.governorate,
    marketingStep: {
      status: 'viable',
      evaluatedAt: new Date().toISOString().split('T')[0],
      evaluator: 'م. تامر الشناوي (مدير عام إدارة التسويق والدراسات)',
      reason: 'الموقع يتميز بكثافة مرورية مرتفعة ووجود مواقف سرفيس نشطة، مع عدم وجود محطات غاز منافسة في نطاق 3.5 كم.',
      recommendedCompressorCapacityNm3h: recommendedCompressor,
      recommendedDispensersCount: recommendedDispensers,
      recommendedDualFuelPoints: recommendedHoses,
      projectedDailyCngDemandM3: estimatedDailyCngDemandM3,
      peakHourlyCapacityM3: Math.round(recommendedCompressor * 0.9),
      recommendedConversionWorkshop: true
    },
    departmentConsensus: {
      marketing: { approved: true, decision: 'approve', notes: 'صالح ومجدٍ تسويقياً بأعلى معايير الطلب.', departmentName: 'إدارة التسويق والدراسات' },
      projects: { approved: true, decision: 'approve', notes: 'أبعاد الأرض (40م × 35م) ومناسيب الموقع متوافقة للأعمال المدنية.', departmentName: 'إدارة المشروعات' },
      operations: { approved: true, decision: 'approve', notes: 'جاهزية الموقع لتثبيت ضاغط 1500 م3/ساعة وتوزيع 3 موزعات.', departmentName: 'إدارة التشغيل والصيانة' },
      hse: { approved: true, decision: 'approve', notes: 'مستوفٍ لمسافات الأمان ومواصفة NFPA 52 والبعد عن مصادر الشرر.', departmentName: 'إدارة السلامة والأمن الصناعي' },
      technical: { approved: true, decision: 'approve', notes: 'يتوفر خط غاز طبيعي بضغط 16 بار يبعد 120 متراً فقط عن الموقع.', departmentName: 'الإدارة الفنية' },
      licensing: { approved: true, decision: 'approve', notes: 'الموقع يقع داخل الحيز العمراني المعتمد وتم استخراج بيان الصلاحية.', departmentName: 'إدارة التراخيص' },
      legal: { approved: true, decision: 'approve', notes: 'عقد الإيجار طويل الأجل (25 سنة) جاهز للتوقيع مع المالك.', departmentName: 'الإدارة القانونية' },
      financial: { approved: true, decision: 'approve', notes: 'معدل العائد الداخلي IRR يبلغ 28.5% وفترة الاسترداد 3.2 سنوات.', departmentName: 'الإدارة المالية' },
      admin: { approved: true, decision: 'approve', notes: 'اعتماد أولي للبدء في الإجراءات.', departmentName: 'الإدارة العليا' },
      surveyor: { approved: true, decision: 'approve', notes: 'تمت المعاينة الميدانية بدقة.', departmentName: 'المعاين الميداني' }
    },
    finalResolution: {
      decision: 'execute',
      reasons: [
        'تحقيق الجدوى الاقتصادية ومعدل عائد داخلي يتجاوز 25%',
        'موقع استراتيجي يخدم 8 خطوط سرفيس وميكروباص نشطة',
        'توفر البنية التحتية لشبكة الغاز الطبيعي بضغط تشغيلي ممتاز',
        'استيفاء اشتراطات السلامة والبيئة ومسافات الأمان القانونية'
      ],
      officialNotes: 'تمت الموافقة بالإجماع من اللجنة المشتركة للبدء الفوري في أعمال الطرح والإنشاء.',
      resolvedAt: new Date().toISOString().split('T')[0],
      resolvedBy: 'اللجنة العليا لتقييم واختيار المواقع الجديدة',
      committeeMembers: ['مدير عام التسويق', 'مدير عام المشروعات', 'مدير عام التشغيل', 'مدير عام السلامة']
    }
  };

  const [consensusData, setConsensusData] = useState<StationConsensusEvaluation>(defaultConsensus);

  // Add new time period (قابلة للزيادة)
  const handleAddNewPeriod = () => {
    const nextNum = surveyPeriods.length + 1;
    const newPeriod: SurveyTimePeriodItem = {
      id: 'period-' + Date.now(),
      periodNumber: nextNum,
      periodName: `الفترة ${nextNum}: فترة رصد إضافية مخصصة`,
      timeSlot: 'حسب توجيهات المدير العام',
      minDurationMinutes: 15,
      actualDurationSeconds: 900,
      completed: false,
      counts: { taxi: 0, microbus: 0, private: 0, pickup: 0, bus: 0, van: 0, minibus: 0, motorcycle: 0, suzuki_van: 0, peugeot_station: 0 },
      totalVehicles: 0,
      trafficRatePerHour: 0,
      peakHourNotes: 'فترة رصد ميداني إضافية لتدقيق الكثافة المرورية.'
    };
    const updated = [...surveyPeriods, newPeriod];
    onUpdateSession({
      ...session,
      surveyPeriods: updated
    });
  };

  // Save consensus change
  const handleUpdateConsensus = (newConsensus: StationConsensusEvaluation) => {
    setConsensusData(newConsensus);
    onUpdateSession({
      ...session,
      stationConsensus: newConsensus
    });
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Summary of Available Sessions */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>منظومة الرصد التسويقي والتقييم المؤسسي المتكامل</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold border border-emerald-500/20">
              اعتماد المتوفر دون إلزام بالكل
            </span>
          </div>
          <h2 className="text-xl font-black text-white">
            جلسات الرصد الميداني الأربعة ودراسة الجدوى الفنية
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            معاينة الموقع عبر 4 فترات زمنية (≥ 15 دقيقة) • رصد التجمعات ذات الكثافة • دراسة المنافسين • حصر المواقف
          </p>
        </div>

        {/* Action Buttons: WhatsApp Dispatch & Live Camera */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenLandownerApplications && (
            <button
              type="button"
              onClick={onOpenLandownerApplications}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
              title="إدارة طلبات معاينة ملاك المواقع والأراضي وإرسال الرابط للعميل بالواتساب"
            >
              <FileText className="w-4 h-4" />
              <span>طلبات معاينة ملاك المواقع (واتساب)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenDispatcherModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>إرسال جلسة رصد عبر الواتساب</span>
          </button>

          <button
            type="button"
            onClick={onOpenDedicatedCamera}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Gauge className="w-4 h-4" />
            <span>بدء رصد ميداني بالكاميرا</span>
          </button>
        </div>
      </div>

      {/* 2. Four Sessions Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Tab 1: 4 Time Periods */}
        <button
          type="button"
          onClick={() => setActiveSessionTab('site_periods')}
          className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden ${
            activeSessionTab === 'site_periods'
              ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${activeSessionTab === 'site_periods' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'}`}>
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {availableSessionsSummary.completedPeriods}/{availableSessionsSummary.totalPeriods} فترات
            </span>
          </div>
          <span className="font-bold text-xs block">معاينة الموقع (4 فترات زمنية)</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">مدة كل جلسة ≥ 15 دقيقة</span>
        </button>

        {/* Tab 2: High Density Hubs */}
        <button
          type="button"
          onClick={() => setActiveSessionTab('density_hubs')}
          className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden ${
            activeSessionTab === 'density_hubs'
              ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${activeSessionTab === 'density_hubs' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-amber-400'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {availableSessionsSummary.densityHubsCount} بؤر رصد
            </span>
          </div>
          <span className="font-bold text-xs block">التجمعات ذات الكثافة</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">الميادين والتقاطعات المحورية</span>
        </button>

        {/* Tab 3: Competitors */}
        <button
          type="button"
          onClick={() => setActiveSessionTab('competitors')}
          className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden ${
            activeSessionTab === 'competitors'
              ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${activeSessionTab === 'competitors' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-blue-400'}`}>
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {availableSessionsSummary.competitorsCount} محطات
            </span>
          </div>
          <span className="font-bold text-xs block">رصد ودراسة المنافسين</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">المسافات والغاز والطوابير</span>
        </button>

        {/* Tab 4: Public Transport & Parking Hubs */}
        <button
          type="button"
          onClick={() => setActiveSessionTab('stations_parking')}
          className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden ${
            activeSessionTab === 'stations_parking'
              ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${activeSessionTab === 'stations_parking' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-emerald-400'}`}>
              <Car className="w-4 h-4" />
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {availableSessionsSummary.parkingHubsCount} مواقف
            </span>
          </div>
          <span className="font-bold text-xs block">رصد المواقف وخطوط السير</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">السرفيس والميكروباص والتاكسي</span>
        </button>

      </div>

      {/* 3. Detailed View of the Selected Session */}
      
      {/* View 1: Multi-Period Site Survey (4 distinct periods, min 15 mins) */}
      {activeSessionTab === 'site_periods' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>جلسة رصد ومعاينة الموقع على مدار اليوم</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                أربع فترات زمنية رئيسية (قابلة للزيادة) مدة كل فترة لا تقل عن 15 دقيقة إجبارياً لضمان الدقة الإحصائية
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddNewPeriod}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold border border-indigo-500/40 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة فترة زمنية أخرى</span>
            </button>
          </div>

          {/* Periods Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {surveyPeriods.map((period, idx) => (
              <div 
                key={period.id}
                className={`p-4 rounded-xl border transition-all ${
                  period.completed 
                    ? 'bg-slate-950/60 border-slate-800' 
                    : 'bg-indigo-950/20 border-indigo-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-bold font-mono">
                        {period.periodNumber}
                      </span>
                      <h4 className="text-sm font-bold text-white">{period.periodName}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="font-mono">{period.timeSlot}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">
                        المدة: {Math.round(period.actualDurationSeconds / 60)} دقيقة (الحد الأدنى: {period.minDurationMinutes} د)
                      </span>
                    </div>
                  </div>

                  {period.completed ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مكتملة</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" />
                      <span>جاهزة للرصد</span>
                    </span>
                  )}
                </div>

                {/* Counts Breakdown */}
                <div className="grid grid-cols-5 gap-1.5 p-2 rounded-lg bg-slate-900 border border-slate-800 text-center mb-3">
                  <div className="p-1">
                    <span className="block text-[10px] text-slate-400">ميكروباص</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">{period.counts.microbus}</span>
                  </div>
                  <div className="p-1">
                    <span className="block text-[10px] text-slate-400">تاكسي</span>
                    <span className="text-xs font-bold text-blue-400 font-mono">{period.counts.taxi}</span>
                  </div>
                  <div className="p-1">
                    <span className="block text-[10px] text-slate-400">ملاكي</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">{period.counts.private}</span>
                  </div>
                  <div className="p-1">
                    <span className="block text-[10px] text-slate-400">نقل / بيك أب</span>
                    <span className="text-xs font-bold text-purple-400 font-mono">{period.counts.pickup}</span>
                  </div>
                  <div className="p-1">
                    <span className="block text-[10px] text-slate-400">حافلات</span>
                    <span className="text-xs font-bold text-cyan-400 font-mono">{period.counts.bus}</span>
                  </div>
                </div>

                {/* Flow rate & Observations */}
                <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-900/50 text-slate-300 border border-slate-800/80 mb-2">
                  <span>إجمالي المركبات المرصودة: <strong className="text-white font-mono">{period.totalVehicles}</strong></span>
                  <span>معدل التدفق: <strong className="text-indigo-400 font-mono">{period.trafficRatePerHour} مركبة/ساعة</strong></span>
                </div>

                {period.peakHourNotes && (
                  <p className="text-[11px] text-slate-400 bg-slate-900/30 p-2 rounded border border-slate-800/50">
                    <span className="text-slate-300 font-semibold">ملاحظات المعاين:</span> {period.peakHourNotes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Daily Aggregate Insights */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-300 block mb-1">
                الحصيلة الإجمالية لجلسات رصد الموقع (4 فترات):
              </span>
              <p className="text-xs text-slate-300">
                إجمالي المركبات المسجلة: <strong className="text-white font-mono">{totalVehiclesObserved} مركبة</strong> • 
                متوسط معدل التدفق: <strong className="text-indigo-400 font-mono">{avgFlowPerHour} مركبة/ساعة</strong>
              </p>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold">
              مؤشر الكثافة: ممتاز ومؤهل بشدة للإنشاء
            </span>
          </div>
        </div>
      )}

      {/* View 2: High-Density Hubs Survey */}
      {activeSessionTab === 'density_hubs' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>جلسة رصد التجمعات ذات الكثافة المرورية العالية</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              حصر المناطق الصناعية، الميادين المحورية، ونقاط الربط اللوجستي المغذية للطلب على الغاز
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {densityHubsList.map((hub) => (
              <div key={hub.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{hub.zoneName}</h4>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                    طلب فائق: {hub.cngPotentialDemand === 'very_high' ? 'مرتفع جداً' : 'مرتفع'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="block text-[10px] text-slate-400">التدفق التقديري:</span>
                    <span className="font-bold text-white font-mono">{hub.estimatedVehiclesPerHour} مركبة/ساعة</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">أوقات الذروة:</span>
                    <span className="font-bold text-indigo-300">{hub.peakFlowTime}</span>
                  </div>
                </div>
                {hub.notes && (
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-2 rounded">
                    {hub.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Competitors Survey */}
      {activeSessionTab === 'competitors' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span>جلسة رصد ودراسة المنافسين ومحطات الوقود المحيطة</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              بيان المسافات، توافر خدمة الغاز الطبيعي، أطوال الطوابير، وأوقات الانتظار لتحديد الحصة السوقية المتوقعة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitorsList.map((comp) => (
              <div key={comp.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{comp.name}</h4>
                    <span className="text-xs text-indigo-400 font-semibold">المسافة: {comp.distanceKm} كم ({comp.distanceMeter} م)</span>
                  </div>
                  {comp.cngAvailable ? (
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/30">
                      محطة غاز منافسة
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                      فرصة استثمارية (بدون غاز)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="block text-[10px] text-slate-400">طوابير الانتظار</span>
                    <span className="font-bold text-amber-400 font-mono">{comp.queueLengthVehicles} سيارة</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">وقت التموين</span>
                    <span className="font-bold text-white font-mono">{comp.avgWaitTimeMinutes} دقيقة</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">سعر المتر³</span>
                    <span className="font-bold text-emerald-400 font-mono">{comp.cngPriceM3 > 0 ? `${comp.cngPriceM3} ج.م` : 'غير متوفر'}</span>
                  </div>
                </div>

                {comp.notes && (
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-2 rounded">
                    {comp.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 4: Public Transport & Parking Hubs */}
      {activeSessionTab === 'stations_parking' && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-emerald-400" />
              <span>جلسة رصد المواقف وخطوط السير والنقل الجماعي</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              حصر مواقف السرفيس، الميكروباص، التاكسي، بيجو الأقاليم، ونصف النقل المحيطة بالموقع
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parkingHubsList.map((hub) => (
              <div key={hub.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{hub.hubName}</h4>
                    <span className="text-xs text-slate-400">{hub.locationDetails}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    جاهزية التحويل: {hub.conversionReadiness === 'high' ? 'عالية جداً' : 'متوسطة'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="block text-[10px] text-slate-400">خطوط السير</span>
                    <span className="font-bold text-indigo-400 font-mono">{hub.linesCount} خطوط</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">أسطول المركبات</span>
                    <span className="font-bold text-amber-400 font-mono">{hub.activeVehiclesCount} مركبة</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">الركاب يومياً</span>
                    <span className="font-bold text-white font-mono">{hub.dailyPassengersEst.toLocaleString()} راكب</span>
                  </div>
                </div>

                {hub.notes && (
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 p-2 rounded">
                    {hub.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Marketing Feasibility Advisory & Recommended Station Sizing (الخطوة الأولى) */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  تقرير إدارة التسويق: صلاحية الموقع والنصائح بالطاقة الاستيعابية والتشغيلية
                </h3>
                <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-500/40">
                  الخطوة التقييمية الأولى (Marketing First)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تحديد قدرة الضاغط وعدد الموزعات والطلب التقديري يومياً استناداً إلى جلسات الرصد الفعلية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">قرار إدارة التسويق:</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>الموقع صالح ومجدٍ للتنفيذ</span>
            </span>
          </div>
        </div>

        {/* Operational Sizing Recommendation Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">طاقة الضاغط الموصى بها:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white font-mono">{consensusData.marketingStep.recommendedCompressorCapacityNm3h}</span>
              <span className="text-xs text-indigo-400 font-semibold">متر مكعب/ساعة (Nm³/h)</span>
            </div>
            <span className="block text-[10px] text-slate-400 mt-1">تغطي الذروة وتضمن سرعة تموين دون انتظار</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">الموزعات ونقاط التموين:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white font-mono">{consensusData.marketingStep.recommendedDispensersCount} موزعات</span>
              <span className="text-xs text-amber-400 font-semibold">({consensusData.marketingStep.recommendedDualFuelPoints} خراطيم مزدوجة)</span>
            </div>
            <span className="block text-[10px] text-slate-400 mt-1">تموين 6 سيارات في نفس اللحظة</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">مبيعات الغاز المتوقعة يومياً:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-emerald-400 font-mono">{consensusData.marketingStep.projectedDailyCngDemandM3.toLocaleString()}</span>
              <span className="text-xs text-emerald-300 font-semibold">م³/يوم</span>
            </div>
            <span className="block text-[10px] text-slate-400 mt-1">بناءً على حصر المركبات والمواقف المحيطة</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="block text-[11px] text-slate-400 mb-1">مركز تحويل أساطيل ملحق:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-cyan-300">موصى به بشدة</span>
            </div>
            <span className="block text-[10px] text-slate-400 mt-1">لوجود 8 خطوط سرفيس بحاجة لتحويل أساطيلها</span>
          </div>
        </div>

        {/* Marketing Justification Note */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
          <span className="font-bold text-slate-200">التعليل التسويقي الرسمي:</span>
          <p className="text-slate-300 leading-relaxed">
            {consensusData.marketingStep.reason}
          </p>
        </div>
      </div>

      {/* 5. Inter-Department Consensus Matrix & Final Resolution (التوافق مع كافة الإدارات والقرار النهائي) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>مصفوفة التوافق المؤسسي بين الإدارات المعنية والقرار النهائي</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            الانتهاء إلى قرار إما (التنفيذ) أو (الرفض) أو (التأجيل) بأسباب موثقة ومعتمدة من كافة الإدارات
          </p>
        </div>

        {/* Department Consensus Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(consensusData.departmentConsensus)
            .filter(([role]) => ['marketing', 'projects', 'operations', 'hse', 'technical', 'licensing', 'legal', 'financial'].includes(role))
            .map(([role, item]) => (
              <div key={role} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{item.departmentName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.decision === 'approve' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : item.decision === 'reject'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.decision === 'approve' ? 'موافقة وتأييد' : item.decision === 'reject' ? 'رفض' : 'تأجيل'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.notes}
                </p>
              </div>
            ))}
        </div>

        {/* Final Committee Institutional Resolution Box (تنفيذ / رفض / تأجيل بأسباب) */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-slate-950 to-emerald-950/40 border-2 border-emerald-500/40 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                القرار المؤسسي النهائي للجنة العليا:
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-black text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>اعتماد المحطة للتنفيذ الفوري (Execution)</span>
                </span>
                <span className="text-xs text-slate-400">
                  تاريخ القرار: {consensusData.finalResolution.resolvedAt}
                </span>
              </div>
            </div>

            {/* Decision Switcher for Testing/Review */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  const updated = {
                    ...consensusData,
                    finalResolution: { ...consensusData.finalResolution, decision: 'execute' as const }
                  };
                  handleUpdateConsensus(updated);
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  consensusData.finalResolution.decision === 'execute'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                تنفيذ
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = {
                    ...consensusData,
                    finalResolution: { ...consensusData.finalResolution, decision: 'postpone' as const }
                  };
                  handleUpdateConsensus(updated);
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  consensusData.finalResolution.decision === 'postpone'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                تأجيل بأسباب
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = {
                    ...consensusData,
                    finalResolution: { ...consensusData.finalResolution, decision: 'reject' as const }
                  };
                  handleUpdateConsensus(updated);
                }}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  consensusData.finalResolution.decision === 'reject'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                رفض
              </button>
            </div>
          </div>

          {/* Documented Reasons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200">الأسباب والمبررات الموثقة للقرار:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {consensusData.finalResolution.reasons.map((reason, rIdx) => (
                <div key={rIdx} className="flex items-start gap-2 p-2 rounded bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Committee Notes */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <span className="font-bold text-slate-300">ملاحظات اعتماد اللجنة:</span> {consensusData.finalResolution.officialNotes}
          </div>
        </div>

      </div>

    </div>
  );
};
