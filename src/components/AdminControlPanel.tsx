import React, { useState, useMemo } from 'react';
import {
  Sliders,
  DollarSign,
  Fuel,
  Building2,
  BookOpen,
  Filter,
  FileSpreadsheet,
  Printer,
  Download,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  TrendingUp,
  BarChart2,
  MapPin,
  Car,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Phone,
  Flame,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpDown,
  FileText,
  UploadCloud,
  Camera,
  Share2
} from 'lucide-react';
import {
  PlatformMasterSettings,
  FuelPricing,
  FeasibilityDefaults,
  CargasCenterItem,
  CylinderSpecItem,
  ConversionSystemItem,
  MonitoringSession,
  LocationQueryFilter,
  VehicleType,
  VEHICLE_TYPES,
  CustomFormField,
  FormChangeRequest,
  DepartmentRole
} from '../types';
import { CargasNgvLogo } from './CargasNgvLogo';
import { DEFAULT_FUEL_PRICING, DEFAULT_FEASIBILITY_SETTINGS } from '../data/defaultSettings';
import { AdminHistoricalDataImporter } from './AdminHistoricalDataImporter';
import { AdminFormCustomizer } from './AdminFormCustomizer';
import { AdminContactsManager } from './AdminContactsManager';
import { AdminFeasibilityManager } from './AdminFeasibilityManager';
import { AdminFuelsManager } from './AdminFuelsManager';
import { AdminInvitationsManager } from './AdminInvitationsManager';
import { AdminPasswordsManager } from './AdminPasswordsManager';
import { AdminActivityLogsManager } from './AdminActivityLogsManager';
import { VideoArchiveModal } from './VideoArchiveModal';
import { Key, Film, History } from 'lucide-react';

interface AdminControlPanelProps {
  settings: PlatformMasterSettings;
  onUpdateSettings: (newSettings: PlatformMasterSettings) => void;
  sessions: MonitoringSession[];
  onSelectSession?: (session: MonitoringSession) => void;
  onUpdateSession?: (updatedSession: MonitoringSession) => void;
  onDeleteSession?: (sessionId: string) => void;
  onClearSessions?: () => void;
  onRestoreDefaultSessions?: () => void;
  onImportSessions?: (newSessions: MonitoringSession[]) => void;
  customFields?: CustomFormField[];
  onUpdateFields?: (fields: CustomFormField[]) => void;
  changeRequests?: FormChangeRequest[];
  onUpdateChangeRequests?: (requests: FormChangeRequest[]) => void;
  onPreviewDepartment?: (dept: DepartmentRole) => void;
  initialTab?: 'pricing' | 'contacts' | 'form_builder' | 'queries' | 'datamgmt' | 'analytics' | 'feasibility' | 'technical' | 'historical' | 'invitations' | 'passwords' | 'activity_logs' | 'video_archive';
  selectedFormBuilderDept?: DepartmentRole;
}

export const AdminControlPanel: React.FC<AdminControlPanelProps> = ({
  settings,
  onUpdateSettings,
  sessions,
  onSelectSession,
  onUpdateSession,
  onDeleteSession,
  onClearSessions,
  onRestoreDefaultSessions,
  onImportSessions,
  customFields = [],
  onUpdateFields = () => {},
  changeRequests = [],
  onUpdateChangeRequests = () => {},
  onPreviewDepartment,
  initialTab = 'pricing',
  selectedFormBuilderDept,
}) => {
  // Active Panel Tab
  const [activeTab, setActiveTab] = useState<'pricing' | 'contacts' | 'form_builder' | 'queries' | 'datamgmt' | 'analytics' | 'feasibility' | 'technical' | 'historical' | 'invitations' | 'passwords' | 'activity_logs' | 'video_archive'>(initialTab);
  const [currentFormBuilderDept, setCurrentFormBuilderDept] = useState<DepartmentRole>(selectedFormBuilderDept || 'operations');

  // Local draft states for easy editing and saving
  const [pricingDraft, setPricingDraft] = useState<FuelPricing>(settings.pricing);
  const [feasibilityDraft, setFeasibilityDraft] = useState<FeasibilityDefaults>(settings.feasibility);
  const [centersList, setCentersList] = useState<CargasCenterItem[]>(settings.centers);
  const [cylindersList, setCylindersList] = useState<CylinderSpecItem[]>(settings.cylinders);
  const [systemsList, setSystemsList] = useState<ConversionSystemItem[]>(settings.systems);

  // Success alert indicator
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  
  // Clear data confirmation modal state
  const [showClearConfirmModal, setShowClearConfirmModal] = useState<boolean>(false);
  
  // Editing session state in queries / management
  const [editingSession, setEditingSession] = useState<MonitoringSession | null>(null);

  const showSaveNotice = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => {
      setSaveSuccessMsg(null);
    }, 4000);
  };

  // -------------------------------------------------------------
  // SAVE PRICING
  // -------------------------------------------------------------
  const handleSavePricing = () => {
    const updated: PlatformMasterSettings = {
      ...settings,
      pricing: {
        ...pricingDraft,
        lastUpdated: new Date().toISOString(),
      },
    };
    onUpdateSettings(updated);
    showSaveNotice('تم تحديث وتعميم أسعار الغاز والبنزين بنجاح على كافة أقسام المنظومة وحاسبة الوفر!');
  };

  const handleResetPricing = () => {
    setPricingDraft(DEFAULT_FUEL_PRICING);
    const updated: PlatformMasterSettings = {
      ...settings,
      pricing: DEFAULT_FUEL_PRICING,
    };
    onUpdateSettings(updated);
    showSaveNotice('تمت استعادة الأسعار الرسمية المعتمدة لوزارة البترول والثروة المعدنية.');
  };

  // -------------------------------------------------------------
  // SAVE FEASIBILITY
  // -------------------------------------------------------------
  const handleSaveFeasibility = () => {
    const updated: PlatformMasterSettings = {
      ...settings,
      feasibility: feasibilityDraft,
    };
    onUpdateSettings(updated);
    showSaveNotice('تم حفظ محددات وتكاليف دراسة الجدوى وتعميمها بنجاح!');
  };

  const handleResetFeasibility = () => {
    setFeasibilityDraft(DEFAULT_FEASIBILITY_SETTINGS);
    const updated: PlatformMasterSettings = {
      ...settings,
      feasibility: DEFAULT_FEASIBILITY_SETTINGS,
    };
    onUpdateSettings(updated);
    showSaveNotice('تمت استعادة محددات دراسة الجدوى القياسية.');
  };

  // -------------------------------------------------------------
  // CARGAS CENTERS MANAGEMENT
  // -------------------------------------------------------------
  const [isAddingCenter, setIsAddingCenter] = useState<boolean>(false);
  const [newCenterName, setNewCenterName] = useState('');
  const [newCenterGov, setNewCenterGov] = useState('القاهرة');
  const [newCenterCity, setNewCenterCity] = useState('');
  const [newCenterAddress, setNewCenterAddress] = useState('');
  const [newCenterPhone, setNewCenterPhone] = useState('19614');
  const [newCenterHours, setNewCenterHours] = useState('من 8:00 ص حتى 8:00 م');
  const [newCenterServices, setNewCenterServices] = useState('تحويل ملاكي وأجرة، فحص دوري، صيانة');

  const handleAddCenter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCenterName.trim()) return;

    const newCenter: CargasCenterItem = {
      id: 'center-' + Date.now(),
      name: newCenterName.trim(),
      governorate: newCenterGov,
      city: newCenterCity.trim() || newCenterGov,
      address: newCenterAddress.trim() || 'الشارع الرئيسي',
      phone: newCenterPhone.trim() || '19614',
      hours: newCenterHours.trim() || 'يومياً',
      services: newCenterServices.split('،').map(s => s.trim()).filter(Boolean),
      isActive: true,
    };

    const updatedCenters = [newCenter, ...centersList];
    setCentersList(updatedCenters);
    const updated: PlatformMasterSettings = {
      ...settings,
      centers: updatedCenters,
    };
    onUpdateSettings(updated);

    // Reset Form
    setNewCenterName('');
    setNewCenterCity('');
    setNewCenterAddress('');
    setIsAddingCenter(false);
    showSaveNotice(`تمت إضافة مركز كارجاس جديد: ${newCenter.name}`);
  };

  const handleDeleteCenter = (centerId: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف مركز: "${name}" من الدليل الفني؟`)) return;
    const updatedCenters = centersList.filter(c => c.id !== centerId);
    setCentersList(updatedCenters);
    onUpdateSettings({ ...settings, centers: updatedCenters });
    showSaveNotice(`تم حذف المركز "${name}" بنجاح.`);
  };

  const handleToggleCenterStatus = (centerId: string) => {
    const updatedCenters = centersList.map(c => 
      c.id === centerId ? { ...c, isActive: !c.isActive } : c
    );
    setCentersList(updatedCenters);
    onUpdateSettings({ ...settings, centers: updatedCenters });
  };

  // -------------------------------------------------------------
  // SESSIONS / DATA MANAGEMENT HANDLERS (ADMIN EDIT & UPDATE)
  // -------------------------------------------------------------
  const handleSaveSessionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !onUpdateSession) return;
    onUpdateSession(editingSession);
    showSaveNotice(`تم تعديل وحفظ بيانات جلسة المعاينة (${editingSession.title}) بنجاح!`);
    setEditingSession(null);
  };

  const handleDeleteSingleSession = (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف جلسة المعاينة: "${title}" نهائياً من النظام؟`)) return;
    if (onDeleteSession) {
      onDeleteSession(id);
      showSaveNotice(`تم حذف جلسة "${title}" بنجاح.`);
    }
  };

  const handleConfirmClearAllData = () => {
    if (onClearSessions) {
      onClearSessions();
      setShowClearConfirmModal(false);
      showSaveNotice('تم تفريغ كافة البيانات التجريبية وجلسات الرصد بنجاح. التطبيق الآن جاهز للإدخال الفعلي!');
    }
  };

  const handleRestoreSampleData = () => {
    if (onRestoreDefaultSessions) {
      onRestoreDefaultSessions();
      showSaveNotice('تمت استعادة البيانات التجريبية النموذجية للمنظومة.');
    }
  };

  // -------------------------------------------------------------
  // QUERIES & REPORTS FILTER STATE
  // -------------------------------------------------------------
  const [filters, setFilters] = useState<LocationQueryFilter>({
    searchQuery: '',
    governorate: 'all',
    minFlowPerHour: 0,
    dominantVehicleType: 'all',
    surveyor: 'all',
    status: 'all',
    sortBy: 'totalVehicles',
    sortOrder: 'desc',
  });

  // Extract unique Governorates and Surveyors from sessions
  const governoratesList = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach(s => set.add(s.governorate));
    return Array.from(set);
  }, [sessions]);

  const surveyorsList = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach(s => {
      if (s.surveyorName) set.add(s.surveyorName);
    });
    return Array.from(set);
  }, [sessions]);

  // Compute calculated metrics for each session
  interface EnrichedSession extends MonitoringSession {
    totalVehicles: number;
    flowPerHour: number;
    dominantType: VehicleType;
    estimatedCngDemandDailyM3: number;
    feasibilityScore: number;
    recommendation: string;
  }

  const enrichedSessions: EnrichedSession[] = useMemo(() => {
    return sessions.map(s => {
      const totalVehicles = Object.values(s.counts).reduce((a, b) => a + b, 0);
      const hours = Math.max(s.durationSeconds / 3600, 0.25);
      const flowPerHour = Math.round(totalVehicles / hours);

      // Find dominant vehicle type
      let maxCount = -1;
      let dominantType: VehicleType = 'microbus';
      (Object.keys(s.counts) as VehicleType[]).forEach(t => {
        if (s.counts[t] > maxCount) {
          maxCount = s.counts[t];
          dominantType = t;
        }
      });

      // Estimated daily CNG demand based on high-consumption commercial vehicles (microbus: 45 m3/day, taxi: 30 m3/day, etc.)
      const dailyCommercial = (s.counts.microbus * 35) + (s.counts.taxi * 25) + (s.counts.peugeot_station * 40) + (s.counts.suzuki_van * 20);
      const estimatedCngDemandDailyM3 = Math.round((dailyCommercial / hours) * 14 * 0.12); // Extrapolated for 14 operational hours with 12% capture

      // Feasibility score (0 - 100)
      const commercialRatio = totalVehicles > 0 ? ((s.counts.microbus + s.counts.taxi + s.counts.suzuki_van + s.counts.peugeot_station) / totalVehicles) : 0;
      let rawScore = (flowPerHour / 12) + (commercialRatio * 45);
      if (s.counts.microbus > 100) rawScore += 15;
      if (s.counts.taxi > 80) rawScore += 10;
      const feasibilityScore = Math.min(100, Math.max(25, Math.round(rawScore)));

      let recommendation = 'موقع مجدٍ لإنشاء محطة تموين غاز طبيعي ومركز تحويل سريع';
      if (feasibilityScore >= 80) {
        recommendation = 'أولوية قصوى (Grade A+): كثافة تجارية استثنائية تستدعي إنشاء محطة سعة 2000 م³/ساعة';
      } else if (feasibilityScore >= 60) {
        recommendation = 'أولوية مرتفعة (Grade A): حركة ممتازة للغاز الطبيعي مع فرصة مركز تحويل ميكروباص وتاكسي';
      } else {
        recommendation = 'أولوية متوسطة (Grade B): يفضل دعم المحطة القريبة بموزعات إضافية أو تشغيل وحدة تموين متنقلة';
      }

      return {
        ...s,
        totalVehicles,
        flowPerHour,
        dominantType,
        estimatedCngDemandDailyM3,
        feasibilityScore,
        recommendation,
      };
    });
  }, [sessions]);

  // Filter and Sort Sessions
  const filteredSessions = useMemo(() => {
    return enrichedSessions.filter(s => {
      // Text search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchLoc = s.locationName.toLowerCase().includes(q);
        const matchCode = s.code.toLowerCase().includes(q);
        const matchCity = s.city.toLowerCase().includes(q);
        if (!matchTitle && !matchLoc && !matchCode && !matchCity) return false;
      }

      // Governorate
      if (filters.governorate !== 'all' && s.governorate !== filters.governorate) {
        return false;
      }

      // Surveyor
      if (filters.surveyor !== 'all' && s.surveyorName !== filters.surveyor) {
        return false;
      }

      // Min flow rate
      if (s.flowPerHour < filters.minFlowPerHour) {
        return false;
      }

      // Dominant vehicle
      if (filters.dominantVehicleType !== 'all' && s.dominantType !== filters.dominantVehicleType) {
        return false;
      }

      // Status
      if (filters.status !== 'all' && s.status !== filters.status) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (filters.sortBy === 'totalVehicles') {
        valA = a.totalVehicles;
        valB = b.totalVehicles;
      } else if (filters.sortBy === 'flowRate') {
        valA = a.flowPerHour;
        valB = b.flowPerHour;
      } else if (filters.sortBy === 'cngDemand') {
        valA = a.estimatedCngDemandDailyM3;
        valB = b.estimatedCngDemandDailyM3;
      } else if (filters.sortBy === 'microbusCount') {
        valA = a.counts.microbus;
        valB = b.counts.microbus;
      } else if (filters.sortBy === 'date') {
        valA = new Date(a.startTime).getTime();
        valB = new Date(b.startTime).getTime();
      }

      return filters.sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [enrichedSessions, filters]);

  // Aggregate statistics for filtered locations
  const querySummary = useMemo(() => {
    const count = filteredSessions.length;
    const totalVehicles = filteredSessions.reduce((acc, s) => acc + s.totalVehicles, 0);
    const totalMicrobus = filteredSessions.reduce((acc, s) => acc + s.counts.microbus, 0);
    const totalTaxi = filteredSessions.reduce((acc, s) => acc + s.counts.taxi, 0);
    const totalPrivate = filteredSessions.reduce((acc, s) => acc + s.counts.private, 0);
    const totalVan = filteredSessions.reduce((acc, s) => acc + s.counts.suzuki_van, 0);
    const totalPeugeot = filteredSessions.reduce((acc, s) => acc + s.counts.peugeot_station, 0);
    const totalCngDemandM3 = filteredSessions.reduce((acc, s) => acc + s.estimatedCngDemandDailyM3, 0);
    const avgScore = count > 0 ? Math.round(filteredSessions.reduce((acc, s) => acc + s.feasibilityScore, 0) / count) : 0;

    return {
      count,
      totalVehicles,
      totalMicrobus,
      totalTaxi,
      totalPrivate,
      totalVan,
      totalPeugeot,
      totalCngDemandM3,
      avgScore,
    };
  }, [filteredSessions]);

  // -------------------------------------------------------------
  // EXPORT HANDLERS
  // -------------------------------------------------------------
  const handleExportCSV = () => {
    if (filteredSessions.length === 0) {
      alert('لا توجد بيانات مطابقة للاستعلام لتصديرها.');
      return;
    }

    const headers = [
      'كود الجلسة',
      'عنوان الموقع',
      'المحافظة',
      'المدينة',
      'القائم بالمعاينة',
      'إجمالي المركبات',
      'تدفق (مركبة/ساعة)',
      'ملاكي',
      'ميكروباص',
      'أجرة تاكسي',
      'سوزوكي فان',
      'بيجو ستيشن',
      'الطلب المتوقع للغاز (م3/يوم)',
      'مؤشر الجدوى %',
      'أقرب محطة غاز',
      'التاريخ والوقت',
      'التوصية الفنية'
    ];

    const rows = filteredSessions.map(s => [
      `"${s.code}"`,
      `"${s.locationName}"`,
      `"${s.governorate}"`,
      `"${s.city}"`,
      `"${s.surveyorName}"`,
      s.totalVehicles,
      s.flowPerHour,
      s.counts.private,
      s.counts.microbus,
      s.counts.taxi,
      s.counts.suzuki_van,
      s.counts.peugeot_station,
      s.estimatedCngDemandDailyM3,
      `${s.feasibilityScore}%`,
      `"${s.nearestStation}"`,
      `"${new Date(s.startTime).toLocaleDateString('ar-EG')}"`,
      `"${s.recommendation}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cargas_survey_locations_report_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(filteredSessions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cargas_survey_locations_${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <CargasNgvLogo size="lg" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Sliders className="w-5 h-5" />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>لوحة التحكم وإدارة البيانات والاستعلامات المتقدمة</span>
                  <span className="text-amber-400 font-mono text-sm font-bold">كارجاس NGV</span>
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                تعديل أسعار الغاز والوقود في كافة الصفحات وحاسبة الوفر • ضبط محددات دراسة الجدوى والدليل الفني • استعلامات وتقارير شاملة لكافة المواقع المعاينة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-700">
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">سعر الغاز الحالي المعتمد:</span>
              <strong className="text-emerald-400 font-mono text-base font-black">
                {settings.pricing.cngPrice.toFixed(2)} ج.م/م³
              </strong>
            </div>
            <span className="h-7 w-px bg-slate-800 mx-1"></span>
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">عدد مواقع المعاينة:</span>
              <strong className="text-amber-400 font-mono text-base font-black">
                {sessions.length} موقع
              </strong>
            </div>
          </div>
        </div>

        {/* Global Success Notification Alert */}
        {saveSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center gap-2 animate-fadeIn shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{saveSuccessMsg}</span>
          </div>
        )}

        {/* Tab Navigation Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-700/80">
          
          {/* Central Passwords & Direct Auth Tab */}
          <button
            id="tab-passwords"
            onClick={() => setActiveTab('passwords')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'passwords'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>كلمات سر الإدارات ومدير النظام</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
              000000
            </span>
          </button>

          {/* Activity Logs Tab */}
          <button
            id="tab-activity-logs"
            onClick={() => setActiveTab('activity_logs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'activity_logs'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <History className="w-4 h-4 text-sky-400" />
            <span>سجل أنشطة وتكليفات الإدارات</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
              باليوم والتاريخ
            </span>
          </button>

          {/* Video & Camera Archive Tab */}
          <button
            id="tab-video-archive"
            onClick={() => setActiveTab('video_archive')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'video_archive'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Film className="w-4 h-4 text-indigo-400" />
            <span>مخزن وفيديوهات الرصد الميداني</span>
          </button>

          <button
            id="tab-pricing"
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Fuel className="w-4 h-4 text-emerald-400" />
            <span>أسعار الغاز والوقود (تحديث فوري)</span>
          </button>

          <button
            id="tab-contacts"
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>إدارة أرقام التواصل والخط الساخن ({settings.general.hotline || '19544'})</span>
          </button>

          <button
            id="tab-form-builder"
            onClick={() => setActiveTab('form_builder')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'form_builder'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>تخصيص نماذج الإدارات والاعتمادات</span>
            {changeRequests && changeRequests.filter(r => r.status === 'pending').length > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>

          {/* New Tab: WhatsApp Invitations to Department General Managers */}
          <button
            id="tab-invitations"
            onClick={() => setActiveTab('invitations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'invitations'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>دعوات مديري العموم بالواتساب</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              روابط مخصصة
            </span>
          </button>

          <button
            id="tab-queries"
            onClick={() => setActiveTab('queries')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'queries'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>استعلامات وتقارير المواقع المعاينة ({sessions.length})</span>
          </button>

          <button
            id="tab-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>تحليل بيانات وجدوى المواقع الاستثمارية</span>
          </button>

          <button
            id="tab-feasibility"
            onClick={() => setActiveTab('feasibility')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'feasibility'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <DollarSign className="w-4 h-4 text-yellow-400" />
            <span>محددات دراسة الجدوى وتكاليف المحطات</span>
          </button>

          <button
            id="tab-technical"
            onClick={() => setActiveTab('technical')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'technical'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>إدارة الدليل الفني ومراكز كارجاس ({centersList.length})</span>
          </button>

          <button
            id="tab-datamgmt"
            onClick={() => setActiveTab('datamgmt')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'datamgmt'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <Layers className="w-4 h-4 text-rose-400" />
            <span>إدارة وتفريغ البيانات وتحديث النظام</span>
          </button>

          <button
            id="tab-historical"
            onClick={() => setActiveTab('historical')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'historical'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>استيراد وتوثيق البيانات التاريخية (Excel & صور)</span>
          </button>

          {/* Direct Clear Button In Tabs Bar */}
          <button
            id="btn-quick-clear-data"
            onClick={() => setShowClearConfirmModal(true)}
            title="تفريغ التطبيق من البيانات التجريبية نهائياً"
            className="ms-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 font-bold text-xs cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>تفريغ البيانات التجريبية</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB: PASSWORDS & ACCESS CONTROL (SUPER ADMIN & DEPARTMENTS)   */}
      {/* ============================================================== */}
      {activeTab === 'passwords' && (
        <AdminPasswordsManager />
      )}

      {/* ============================================================== */}
      {/* TAB: ACTIVITY LOGS BY DAY, DATE & TIME                         */}
      {/* ============================================================== */}
      {activeTab === 'activity_logs' && (
        <AdminActivityLogsManager />
      )}

      {/* ============================================================== */}
      {/* TAB: VIDEO & CAMERA RECORDINGS ARCHIVE                        */}
      {/* ============================================================== */}
      {activeTab === 'video_archive' && (
        <VideoArchiveModal
          isOpen={true}
          onClose={() => setActiveTab('pricing')}
          isEmbedded={true}
        />
      )}

      {/* ============================================================== */}
      {/* TAB: CONTACTS & HOTLINE 19544 MANAGEMENT                      */}
      {/* ============================================================== */}
      {activeTab === 'contacts' && (
        <AdminContactsManager
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          showSaveNotice={showSaveNotice}
        />
      )}

      {/* ============================================================== */}
      {/* TAB 1: FUEL & CNG PRICING ADJUSTMENT (DYNAMIC FUELS MANAGER)   */}
      {/* ============================================================== */}
      {activeTab === 'pricing' && (
        <AdminFuelsManager
          currentPricing={settings.pricing}
          customFuels={settings.customFuels}
          onSave={(updatedPricing, updatedFuels) => {
            setPricingDraft(updatedPricing);
            const updated: PlatformMasterSettings = {
              ...settings,
              pricing: updatedPricing,
              customFuels: updatedFuels,
            };
            onUpdateSettings(updated);
            showSaveNotice('تم تحديث وتعميم أسعار الغاز والبنزين وأنواع الوقود بنجاح على كافة أقسام المنظومة وحاسبة الوفر!');
          }}
          onReset={handleResetPricing}
        />
      )}

      {/* ============================================================== */}
      {/* TAB 2: QUERIES & SURVEY LOCATION COMPREHENSIVE REPORTS        */}
      {/* ============================================================== */}
      {activeTab === 'queries' && (
        <div className="space-y-6">
          
          {/* Query Filter Builder Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  محرك الاستعلامات والفلترة المتقدمة لبيانات المواقع المعاينة
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>تصدير Excel/CSV</span>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير JSON</span>
                </button>
                <button
                  onClick={handlePrintReport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة تقرير المواقع</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              
              {/* Search input */}
              <div className="lg:col-span-2 relative">
                <label className="text-[11px] text-slate-400 block mb-1">بحث بالاسم أو الكود أو الشارع:</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث عن اسم الموقع، الشارع، الكود..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 pr-9 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Governorate selector */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">تصفية حسب المحافظة:</label>
                <select
                  value={filters.governorate}
                  onChange={(e) => setFilters({ ...filters, governorate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">كافة المحافظات ({governoratesList.length})</option>
                  {governoratesList.map(gov => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>

              {/* Dominant vehicle type */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">الفئة الأكثر كثافة بالموقع:</label>
                <select
                  value={filters.dominantVehicleType}
                  onChange={(e) => setFilters({ ...filters, dominantVehicleType: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">كافة الفئات</option>
                  {(Object.keys(VEHICLE_TYPES) as VehicleType[]).map(type => (
                    <option key={type} value={type}>
                      {VEHICLE_TYPES[type].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Surveyor */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">القائم بالمعاينة:</label>
                <select
                  value={filters.surveyor}
                  onChange={(e) => setFilters({ ...filters, surveyor: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">كافة المهندسين ({surveyorsList.length})</option>
                  {surveyorsList.map(surv => (
                    <option key={surv} value={surv}>{surv}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Sorting & Flow slider */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">الترتيب حسب:</span>
                <button
                  onClick={() => setFilters({ ...filters, sortBy: 'totalVehicles', sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' })}
                  className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer flex items-center gap-1 ${
                    filters.sortBy === 'totalVehicles' ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  <span>إجمالي المركبات</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>

                <button
                  onClick={() => setFilters({ ...filters, sortBy: 'cngDemand', sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' })}
                  className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer flex items-center gap-1 ${
                    filters.sortBy === 'cngDemand' ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  <span>طلب الغاز المتوقع</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>

                <button
                  onClick={() => setFilters({ ...filters, sortBy: 'microbusCount', sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc' })}
                  className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer flex items-center gap-1 ${
                    filters.sortBy === 'microbusCount' ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' : 'border-slate-700 text-slate-400'
                  }`}
                >
                  <span>كثافة الميكروباص</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">الحد الأدنى لتدفق المركبات:</span>
                <span className="font-mono text-amber-400 font-bold">{filters.minFlowPerHour} مركبة/ساعة</span>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="25"
                  value={filters.minFlowPerHour}
                  onChange={(e) => setFilters({ ...filters, minFlowPerHour: parseInt(e.target.value) || 0 })}
                  className="w-24 accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Quick Stats Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center">
              <span className="text-xs text-slate-400 block mb-1">المواقع المطابقة للاستعلام</span>
              <strong className="text-2xl font-mono font-black text-white">{querySummary.count}</strong>
              <span className="text-[10px] text-slate-500 block">من إجمالي {sessions.length} موقع</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center">
              <span className="text-xs text-slate-400 block mb-1">إجمالي المركبات المرصودة</span>
              <strong className="text-2xl font-mono font-black text-emerald-400">
                {querySummary.totalVehicles.toLocaleString('ar-EG')}
              </strong>
              <span className="text-[10px] text-slate-500 block">مركبة تم توثيقها بالكاميرا</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center">
              <span className="text-xs text-slate-400 block mb-1">الطلب اليومي المقدر للغاز</span>
              <strong className="text-2xl font-mono font-black text-amber-400">
                {querySummary.totalCngDemandM3.toLocaleString('ar-EG')}
              </strong>
              <span className="text-[10px] text-slate-500 block">متر مكعب / يوم (m³/day)</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center">
              <span className="text-xs text-slate-400 block mb-1">متوسط مؤشر الجدوى الفنية</span>
              <strong className="text-2xl font-mono font-black text-cyan-400">{querySummary.avgScore}%</strong>
              <span className="text-[10px] text-emerald-400 block font-semibold">مواقع مجدية استثمارياً</span>
            </div>
          </div>

          {/* Surveyed Locations Data Table */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-700/80 bg-slate-900/60 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>سجل بيانات المواقع المعاينة وتحليلات التدفق</span>
              </h4>
              <span className="text-xs text-slate-400">
                عرض {filteredSessions.length} موقع
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5 font-bold">كود الجلسة والموقع</th>
                    <th className="p-3.5 font-bold">المحافظة / المدينة</th>
                    <th className="p-3.5 font-bold">القائم بالمعاينة</th>
                    <th className="p-3.5 font-bold text-center">إجمالي المركبات</th>
                    <th className="p-3.5 font-bold text-center">التدفق (مركبة/س)</th>
                    <th className="p-3.5 font-bold text-center">توزيع المركبات (ميكروباص / تاكسي / فان / بيجو / ملاكي)</th>
                    <th className="p-3.5 font-bold text-center">طلب الغاز المقدر</th>
                    <th className="p-3.5 font-bold text-center">مؤشر الجدوى</th>
                    <th className="p-3.5 font-bold text-center">إجراءات الإدارة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredSessions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                        لا توجد مواقع مطابقة لمعايير الاستعلام المحددة.
                      </td>
                    </tr>
                  ) : (
                    filteredSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] font-mono text-slate-300">
                              {session.code}
                            </span>
                            <span>{session.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            <span>{session.locationName}</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-semibold text-slate-200">{session.governorate}</div>
                          <div className="text-[11px] text-slate-400">{session.city}</div>
                        </td>

                        <td className="p-3.5 text-slate-300">
                          {session.surveyorName}
                        </td>

                        <td className="p-3.5 text-center font-mono font-bold text-white text-sm">
                          {session.totalVehicles}
                        </td>

                        <td className="p-3.5 text-center font-mono font-bold text-emerald-400">
                          {session.flowPerHour}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center justify-center gap-1 font-mono text-[11px]">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300" title="ميكروباص">
                              🚐 {session.counts.microbus}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300" title="تاكسي">
                              🚕 {session.counts.taxi}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300" title="سوزوكي فان">
                              🚙 {session.counts.suzuki_van}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300" title="بيجو ستيشن">
                              🚘 {session.counts.peugeot_station}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300" title="ملاكي">
                              🚗 {session.counts.private}
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5 text-center font-mono font-bold text-amber-400">
                          {session.estimatedCngDemandDailyM3.toLocaleString('ar-EG')} م³/يوم
                        </td>

                        <td className="p-3.5 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            session.feasibilityScore >= 80 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                              : session.feasibilityScore >= 60
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {session.feasibilityScore}%
                          </span>
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {onSelectSession && (
                              <button
                                onClick={() => onSelectSession(session)}
                                title="عرض في شاشة جلسة الرصد"
                                className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                              >
                                عرض
                              </button>
                            )}
                            <button
                              onClick={() => setEditingSession({ ...session })}
                              title="تعديل بيانات الموقع وحفظ التحديثات كمدير"
                              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>تعديل</span>
                            </button>
                            {onDeleteSession && (
                              <button
                                onClick={() => handleDeleteSingleSession(session.id, session.title)}
                                title="حذف هذه الجلسة"
                                className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: ADVANCED SITE FEASIBILITY & ANALYTICS TOOLS            */}
      {/* ============================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                <span>التحليل المقارن وترتيب المواقع الأكثر جدوى استثمارياً لإنشاء محطات الغاز</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                خوارزمية ذكية تحتسب مؤشر الجدوى بناءً على كثافة مركبات النقل الجماعي والأجرة (الميكروباص والتاكسي والفان) التي تحقق أعلى مبيعات للغاز ومعدل دوران سريع لرأس المال.
              </p>
            </div>

            {/* Ranking Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {enrichedSessions.slice(0, 3).map((site, idx) => (
                <div 
                  key={site.id} 
                  className={`p-5 rounded-2xl border relative overflow-hidden flex flex-col justify-between ${
                    idx === 0
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-xl'
                      : idx === 1
                      ? 'bg-slate-900/90 border-amber-500/50'
                      : 'bg-slate-900/90 border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black font-mono ${
                        idx === 0 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        المرتبة #{idx + 1}
                      </span>
                      <strong className="text-lg font-mono font-black text-emerald-400">
                        {site.feasibilityScore}%
                      </strong>
                    </div>

                    <h4 className="text-base font-bold text-white truncate">
                      {site.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 mb-3 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{site.locationName} ({site.governorate})</span>
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between">
                        <span className="text-slate-400">معدل التدفق:</span>
                        <span className="font-mono font-bold text-white">{site.flowPerHour} مركبة/ساعة</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">كثافة النقل التجاري:</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {site.counts.microbus + site.counts.taxi + site.counts.suzuki_van + site.counts.peugeot_station} مركبة
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">مبيعات الغاز اليومية المتوقعة:</span>
                        <span className="font-mono font-bold text-amber-400">{site.estimatedCngDemandDailyM3.toLocaleString('ar-EG')} م³/يوم</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-300/90 font-medium mt-4 pt-3 border-t border-slate-800">
                    {site.recommendation}
                  </p>
                </div>
              ))}
            </div>

            {/* Comparison Matrix Table */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>مصفوفة مقارنة المؤشرات الفنية بين كافة مواقع المعاينة:</span>
              </h4>

              <div className="space-y-3">
                {enrichedSessions.map((site) => (
                  <div key={site.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {site.code}
                        </span>
                        <strong className="text-sm text-white">{site.locationName}</strong>
                        <span className="text-xs text-slate-400">({site.governorate})</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        أقرب محطة غاز: <span className="text-slate-300">{site.nearestStation}</span> • القائم بالرصد: {site.surveyorName}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block">التدفق</span>
                        <strong className="text-white text-sm">{site.flowPerHour} v/h</strong>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block">الطلب المتوقع</span>
                        <strong className="text-amber-400 text-sm">{site.estimatedCngDemandDailyM3} m³</strong>
                      </div>
                      <div className="text-center min-w-[70px]">
                        <span className="text-[10px] text-slate-400 block">درجة الجدوى</span>
                        <strong className="text-emerald-400 text-sm">{site.feasibilityScore}%</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: FEASIBILITY CAPEX & OPEX DEFAULTS MANAGEMENT           */}
      {/* ============================================================== */}
      {activeTab === 'feasibility' && (
        <AdminFeasibilityManager
          initialDefaults={settings.feasibility}
          onSave={(updatedFeasibility) => {
            setFeasibilityDraft(updatedFeasibility);
            const updated: PlatformMasterSettings = {
              ...settings,
              feasibility: updatedFeasibility,
            };
            onUpdateSettings(updated);
            showSaveNotice('تم حفظ وتعميم محددات وتكاليف دراسة الجدوى والمسميات الجديدة بنجاح!');
          }}
          onReset={handleResetFeasibility}
        />
      )}

      {/* ============================================================== */}
      {/* TAB 5: TECHNICAL GUIDE & CARGAS CENTERS MANAGEMENT            */}
      {/* ============================================================== */}
      {activeTab === 'technical' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <span>إدارة مراكز كارجاس للتحويل والصيانة وبيانات الدليل الفني</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  إضافة وتعديل وحذف مراكز التحويل الرسمية وفروع الخدمة لشركة كارجاس المعروضة في الدليل الفني.
                </p>
              </div>

              <button
                onClick={() => setIsAddingCenter(!isAddingCenter)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer transition-all shadow-lg shadow-emerald-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingCenter ? 'إلغاء الإضافة' : 'إضافة مركز كارجاس جديد'}</span>
              </button>
            </div>

            {/* Add Center Inline Form */}
            {isAddingCenter && (
              <form onSubmit={handleAddCenter} className="bg-slate-900/90 border border-emerald-500/50 rounded-2xl p-5 space-y-4 animate-fadeIn">
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>بيانات مركز كارجاس الجديد:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">اسم المركز الفرعي:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مركز كارجاس - شبرا الخيمة"
                      value={newCenterName}
                      onChange={(e) => setNewCenterName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">المحافظة:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: القليوبية"
                      value={newCenterGov}
                      onChange={(e) => setNewCenterGov(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">المدينة / الحي:</label>
                    <input
                      type="text"
                      placeholder="مثال: شبرا الخيمة"
                      value={newCenterCity}
                      onChange={(e) => setNewCenterCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-300 block mb-1">العنوان التفصيلي:</label>
                    <input
                      type="text"
                      placeholder="مثال: ميدان المؤسسة، بجوار محطة مترو شبرا"
                      value={newCenterAddress}
                      onChange={(e) => setNewCenterAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">التليفون / الخط الساخن:</label>
                    <input
                      type="text"
                      value={newCenterPhone}
                      onChange={(e) => setNewCenterPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-300 block mb-1">الخدمات المتاحة (مفصولة بفواصل):</label>
                    <input
                      type="text"
                      value={newCenterServices}
                      onChange={(e) => setNewCenterServices(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">مواعيد العمل:</label>
                    <input
                      type="text"
                      value={newCenterHours}
                      onChange={(e) => setNewCenterHours(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCenter(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-lg"
                  >
                    حفظ المركز بالدليل
                  </button>
                </div>
              </form>
            )}

            {/* Centers List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-300">
                مراكز التحويل والصيانة المعتمدة المسجلة بالدليل ({centersList.length}):
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {centersList.map((center) => (
                  <div
                    key={center.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-white">{center.name}</h5>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                              {center.governorate}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            <span>{center.address}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleCenterStatus(center.id)}
                            title={center.isActive ? 'تعطيل المركز' : 'تفعيل المركز'}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              center.isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCenter(center.id, center.name)}
                            title="حذف المركز"
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2 mb-3">
                        {center.services.map((srv, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            ✓ {srv}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {center.hours}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {center.phone}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: DATA MANAGEMENT, CLEARING TEST DATA & SYSTEM UPDATES   */}
      {/* ============================================================== */}
      {activeTab === 'datamgmt' && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-rose-400" />
                  <span>إدارة وتفريغ البيانات التجريبية وتحديث المنظومة</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  أدوات المدير للتحكم في قواعد البيانات المحلية، تفريغ جلسات المعاينة الافتراضية، واستعادة نماذج الاختبار، وتعديل وتحديث بيانات المواقع.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestoreSampleData}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>استعادة البيانات النموذجية</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowClearConfirmModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-lg shadow-rose-600/30"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>تفريغ التطبيق من كافة البيانات التجريبية</span>
                </button>
              </div>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">جلسات الرصد المسجلة:</span>
                  <strong className="text-xl font-mono font-bold text-white">{sessions.length} جلسة</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400">
                  <Car className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">مراكز كارجاس بالدليل:</span>
                  <strong className="text-xl font-mono font-bold text-emerald-400">{centersList.length} مركز</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">حالة التخزين المحلي:</span>
                  <strong className="text-xs font-mono font-bold text-emerald-400">نشط (cng_platform_sessions_v1)</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Explanatory Banner */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-0.5">تعليمات تفريغ البيانات والبدء الميداني:</strong>
                <p className="leading-relaxed text-slate-300">
                  عند الضغط على زر "تفريغ التطبيق من البيانات التجريبية"، سيتم مسح كافة المواقع الاختبارية (الرصد، العدادات، والتقارير المحفوظة)، مما يتيح لك بدء استخدام التطبيق ميدانياً وتسجيل المواقع الفعلية من خلال الكاميرا والرصد اليدوي. في حال رغبتك بالرجوع للاختبار، يمكنك دائماً الضغط على "استعادة البيانات النموذجية".
                </p>
              </div>
            </div>

            {/* Interactive Sessions Management List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-amber-400" />
                  <span>تعديل وحذف جلسات الرصد والمواقع الحالية:</span>
                </h4>
                <span className="text-xs text-slate-400">
                  {sessions.length > 0 ? `إجمالي (${sessions.length}) موقع مسجل` : 'لا توجد بيانات حالياً (التطبيق فارغ)'}
                </span>
              </div>

              {sessions.length === 0 ? (
                <div className="p-8 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h5 className="text-base font-bold text-white">التطبيق فارغ وجاهز لتسجيل البيانات الفعلية</h5>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    تم تفريغ جميع البيانات التجريبية بنجاح. يمكنك الآن بدء جلسات رصد جديدة من شاشة "رصد الكاميرا الذكية" أو استعادة العينات التجريبية للاختبار.
                  </p>
                  <button
                    type="button"
                    onClick={handleRestoreSampleData}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>استعادة البيانات النموذجية للاختبار</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                                {s.code}
                              </span>
                              <h5 className="text-sm font-bold text-white">{s.title}</h5>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>{s.locationName} ({s.governorate} - {s.city})</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingSession({ ...s })}
                              title="تعديل بيانات الموقع والمركبات كمدير"
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-pointer transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSingleSession(s.id, s.title)}
                              title="حذف هذه الجلسة"
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Counts Badge breakdown */}
                        <div className="flex flex-wrap gap-1 mt-3 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            🚐 ميكروباص: <strong className="text-emerald-400">{s.counts.microbus}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            🚕 تاكسي: <strong className="text-yellow-400">{s.counts.taxi}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            🚙 فان: <strong className="text-purple-400">{s.counts.suzuki_van}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            🚘 بيجو: <strong className="text-rose-400">{s.counts.peugeot_station}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            🚗 ملاكي: <strong className="text-blue-400">{s.counts.private}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 mt-3 border-t border-slate-800">
                        <span>القائم بالمعاينة: <strong className="text-slate-200">{s.surveyorName || 'غير محدد'}</strong></span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {Object.values(s.counts).reduce((a, b) => a + b, 0)} مركبة إجمالاً
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: FORM BUILDER & DEPARTMENT REQUESTS APPROVAL              */}
      {/* ============================================================== */}
      {activeTab === 'form_builder' && (
        <AdminFormCustomizer
          customFields={customFields}
          onUpdateFields={onUpdateFields}
          changeRequests={changeRequests}
          onUpdateChangeRequests={onUpdateChangeRequests}
          initialDept={currentFormBuilderDept}
          onPreviewDepartment={onPreviewDepartment}
        />
      )}

      {/* ============================================================== */}
      {/* TAB: WHATSAPP INVITATIONS & DIRECT LINKS DISPATCHER            */}
      {/* ============================================================== */}
      {activeTab === 'invitations' && (
        <AdminInvitationsManager
          customFields={customFields}
          onPreviewDepartment={onPreviewDepartment || (() => {})}
          onNavigateToFormBuilder={(dept: DepartmentRole) => {
            setCurrentFormBuilderDept(dept);
            setActiveTab('form_builder');
          }}
        />
      )}

      {/* ============================================================== */}
      {/* TAB 7: HISTORICAL DATA & EXCEL / PHOTO ARCHIVE IMPORT          */}
      {/* ============================================================== */}
      {activeTab === 'historical' && (
        <AdminHistoricalDataImporter
          sessions={sessions}
          onImportSessions={onImportSessions || (() => {})}
        />
      )}
      {/* ============================================================== */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">تفريغ التطبيق من البيانات التجريبية</h4>
                <span className="text-xs text-rose-400 font-semibold">إجراء إداري لتجهيز النظام للعمل الفعلي</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              أنت على وشك تفريغ وحذف كافة جلسات الرصد والمواقع والبيانات التجريبية المحفوظة محلياً ({sessions.length} موقع). سيصبح التطبيق فارغاً تماماً للبدء في الرصد الميداني الحقيقي.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              💡 <span className="text-slate-300 font-semibold">ملاحظة للمدير:</span> يمكنك دائماً في أي وقت استعادة العينات التجريبية الافتراضية بضغطة زر من تبويب "إدارة وتفريغ البيانات".
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                إلغاء الأمر
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAllData}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>نعم، فرّغ التطبيق الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT SESSION / SITE DATA MODAL (ADMIN CONTROL)        */}
      {/* ============================================================== */}
      {editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Edit2 className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-base font-bold text-white">
                    تعديل وتحديث بيانات جلسة المعاينة ({editingSession.code})
                  </h4>
                  <span className="text-xs text-slate-400">تعديل معلومات الموقع وأعداد المركبات المسجلة وحفظ التغييرات</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingSession(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSessionEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div>
                  <label className="text-xs text-slate-400 block mb-1">عنوان الجلسة:</label>
                  <input
                    type="text"
                    value={editingSession.title}
                    onChange={(e) => setEditingSession({ ...editingSession, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">اسم الموقع / المحور:</label>
                  <input
                    type="text"
                    value={editingSession.locationName}
                    onChange={(e) => setEditingSession({ ...editingSession, locationName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">المحافظة:</label>
                  <input
                    type="text"
                    value={editingSession.governorate}
                    onChange={(e) => setEditingSession({ ...editingSession, governorate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">المدينة / الحي:</label>
                  <input
                    type="text"
                    value={editingSession.city}
                    onChange={(e) => setEditingSession({ ...editingSession, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">القائم بالمعاينة (المهندس):</label>
                  <input
                    type="text"
                    value={editingSession.surveyorName}
                    onChange={(e) => setEditingSession({ ...editingSession, surveyorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">اتجاه حركة المرور:</label>
                  <input
                    type="text"
                    value={editingSession.trafficDirection}
                    onChange={(e) => setEditingSession({ ...editingSession, trafficDirection: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 block mb-1">أقرب محطة غاز طبيعي قائمة:</label>
                  <input
                    type="text"
                    value={editingSession.nearestStation || ''}
                    onChange={(e) => setEditingSession({ ...editingSession, nearestStation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

              </div>

              {/* Vehicle Counts Adjustment */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <label className="text-xs font-bold text-amber-400 block">
                  تعديل أعداد المركبات المرصودة (Vehicle Counts):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-emerald-400 block font-bold mb-1">🚐 ميكروباص</span>
                    <input
                      type="number"
                      min="0"
                      value={editingSession.counts.microbus}
                      onChange={(e) => setEditingSession({
                        ...editingSession,
                        counts: { ...editingSession.counts, microbus: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center font-mono font-bold text-white text-xs"
                    />
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-yellow-400 block font-bold mb-1">🚕 تاكسي</span>
                    <input
                      type="number"
                      min="0"
                      value={editingSession.counts.taxi}
                      onChange={(e) => setEditingSession({
                        ...editingSession,
                        counts: { ...editingSession.counts, taxi: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center font-mono font-bold text-white text-xs"
                    />
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-purple-400 block font-bold mb-1">🚙 فان</span>
                    <input
                      type="number"
                      min="0"
                      value={editingSession.counts.suzuki_van}
                      onChange={(e) => setEditingSession({
                        ...editingSession,
                        counts: { ...editingSession.counts, suzuki_van: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center font-mono font-bold text-white text-xs"
                    />
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-rose-400 block font-bold mb-1">🚘 بيجو ستيشن</span>
                    <input
                      type="number"
                      min="0"
                      value={editingSession.counts.peugeot_station}
                      onChange={(e) => setEditingSession({
                        ...editingSession,
                        counts: { ...editingSession.counts, peugeot_station: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center font-mono font-bold text-white text-xs"
                    />
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-blue-400 block font-bold mb-1">🚗 ملاكي</span>
                    <input
                      type="number"
                      min="0"
                      value={editingSession.counts.private}
                      onChange={(e) => setEditingSession({
                        ...editingSession,
                        counts: { ...editingSession.counts, private: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-center font-mono font-bold text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">الملاحظات الفنية والتوصيات للموقع:</label>
                <textarea
                  rows={2}
                  value={editingSession.notes || ''}
                  onChange={(e) => setEditingSession({ ...editingSession, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ وتحديث بيانات الموقع</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
