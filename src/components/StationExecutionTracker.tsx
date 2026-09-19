import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Wrench, 
  ShieldCheck, 
  Scale, 
  DollarSign, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Printer, 
  FileText, 
  TrendingUp, 
  Users, 
  HardHat, 
  Flame, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Search, 
  MapPin, 
  Award, 
  Edit3, 
  Save, 
  Activity, 
  Layers, 
  CheckSquare, 
  Square,
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';
import { 
  MonitoringSession, 
  StationExecutionData, 
  ExecutionWorkItem, 
  DailySiteLog, 
  ExecutionCategory,
  StationExecutionStatus 
} from '../types';
import { createDefaultStationExecutionData } from '../utils/executionDefaults';
import { CargasNgvLogo } from './CargasNgvLogo';

interface StationExecutionTrackerProps {
  session: MonitoringSession;
  onUpdateSession: (updatedSession: MonitoringSession) => void;
  onNavigateToFeasibility?: () => void;
  onNavigateToDepartments?: () => void;
  onNavigateToAdmin?: () => void;
}

export const StationExecutionTracker: React.FC<StationExecutionTrackerProps> = ({
  session,
  onUpdateSession,
  onNavigateToFeasibility,
  onNavigateToDepartments,
  onNavigateToAdmin
}) => {
  // Ensure execution data exists
  const executionData: StationExecutionData = useMemo(() => {
    if (session.executionData) {
      return session.executionData;
    }
    // Compute total capex from reviews or use default
    const auditedCapex = session.departmentReviews?.financial?.financialAudit?.totalCapexAudited || 38500000;
    return createDefaultStationExecutionData(session.title, auditedCapex);
  }, [session]);

  // Save back to session if not previously stored
  React.useEffect(() => {
    if (!session.executionData) {
      onUpdateSession({
        ...session,
        executionData
      });
    }
  }, [session, executionData, onUpdateSession]);

  // Filter state for work items
  const [selectedCategory, setSelectedCategory] = useState<'all' | ExecutionCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'inspection' | 'delayed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reporting tab / mode: 'current' | 'specific_date' | 'weekly' | 'monthly' | 'custom_range'
  const [reportMode, setReportMode] = useState<'current' | 'specific_date' | 'weekly' | 'monthly' | 'custom_range'>('current');
  const [selectedSpecificDate, setSelectedSpecificDate] = useState<string>('2026-09-17');
  const [customRangeStart, setCustomRangeStart] = useState<string>('2026-09-01');
  const [customRangeEnd, setCustomRangeEnd] = useState<string>('2026-09-17');

  // Modals
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [showAddWorkItemModal, setShowAddWorkItemModal] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // New log form state
  const [newLogDate, setNewLogDate] = useState('2026-09-17');
  const [newLogType, setNewLogType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [newLogEngineer, setNewLogEngineer] = useState('م. تامر مصطفى');
  const [newLogWeather, setNewLogWeather] = useState('مشمس معتدل، 29°م');
  const [newLogWorkforce, setNewLogWorkforce] = useState(38);
  const [newLogEquipment, setNewLogEquipment] = useState('ونش 50 طن، لودر، ماكينات لحام، خلاطة خرسانة');
  const [newLogAchievements, setNewLogAchievements] = useState('');
  const [newLogPlanned, setNewLogPlanned] = useState('');
  const [newLogHse, setNewLogHse] = useState('سجل أمان تام (صفر حوادث). الالتزام التام بمهمات الوقاية PPE');
  const [newLogObstacles, setNewLogObstacles] = useState('');
  const [newLogProgressPercent, setNewLogProgressPercent] = useState<number>(executionData.overallProgressPercent);

  // New Work Item Form
  const [newItemCategory, setNewItemCategory] = useState<ExecutionCategory>('civil');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(5);
  const [newItemCost, setNewItemCost] = useState(1500000);
  const [newItemEngineer, setNewItemEngineer] = useState('م. تامر مصطفى');
  const [newItemStartDate, setNewItemStartDate] = useState('2026-09-15');
  const [newItemEndDate, setNewItemEndDate] = useState('2026-10-30');

  // Helpers to update execution data
  const updateExecution = (updater: Partial<StationExecutionData>) => {
    const updated: StationExecutionData = {
      ...executionData,
      ...updater
    };
    onUpdateSession({
      ...session,
      executionData: updated
    });
  };

  // Toggle subtask completion
  const handleToggleSubtask = (itemId: string, subtaskId: string) => {
    const updatedItems = executionData.workItems.map(item => {
      if (item.id !== itemId) return item;
      const updatedSubtasks = item.subTasks.map(st => {
        if (st.id !== subtaskId) return st;
        return {
          ...st,
          completed: !st.completed,
          completionDate: !st.completed ? new Date().toISOString().split('T')[0] : undefined
        };
      });

      // Recalculate progress based on subtasks
      const completedCount = updatedSubtasks.filter(st => st.completed).length;
      const totalCount = updatedSubtasks.length;
      const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : item.progressPercent;
      const status = progressPercent === 100 ? 'completed' : progressPercent > 0 ? 'in_progress' : 'not_started';

      return {
        ...item,
        subTasks: updatedSubtasks,
        progressPercent,
        status: status as any
      };
    });

    // Recalculate overall progress
    const totalWeight = updatedItems.reduce((sum, it) => sum + it.weightPercent, 0);
    const weightedProgress = Math.round(
      updatedItems.reduce((sum, it) => sum + (it.progressPercent * it.weightPercent), 0) / (totalWeight || 100)
    );

    updateExecution({
      workItems: updatedItems,
      overallProgressPercent: weightedProgress
    });
  };

  // Quick progress adjustment
  const handleUpdateItemProgress = (itemId: string, newProgress: number) => {
    const cleanProgress = Math.min(100, Math.max(0, newProgress));
    const updatedItems = executionData.workItems.map(item => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        progressPercent: cleanProgress,
        status: (cleanProgress === 100 ? 'completed' : cleanProgress > 0 ? 'in_progress' : 'not_started') as any
      };
    });

    const totalWeight = updatedItems.reduce((sum, it) => sum + it.weightPercent, 0);
    const weightedProgress = Math.round(
      updatedItems.reduce((sum, it) => sum + (it.progressPercent * it.weightPercent), 0) / (totalWeight || 100)
    );

    updateExecution({
      workItems: updatedItems,
      overallProgressPercent: weightedProgress
    });
  };

  // Add a new daily site log
  const handleAddDailyLog = () => {
    if (!newLogAchievements.trim()) return;

    const newLog: DailySiteLog = {
      id: `log-${Date.now()}`,
      date: newLogDate,
      reportType: newLogType,
      recordedBy: newLogEngineer,
      residentEngineer: newLogEngineer,
      weatherAndSiteCondition: newLogWeather,
      workforceCount: Number(newLogWorkforce) || 30,
      equipmentOnSite: newLogEquipment,
      completedWorksToday: newLogAchievements,
      plannedWorksTomorrow: newLogPlanned || 'استكمال الأعمال المجدولة طبقاً للبرنامج الزمني',
      hseIndustrialSafetyStatus: newLogHse,
      delaysOrObstacles: newLogObstacles || 'لا توجد معوقات تؤثر على المسار الحرج للمشروع',
      siteProgressSnapshotPercent: Number(newLogProgressPercent) || executionData.overallProgressPercent,
      photosCount: 4
    };

    updateExecution({
      dailyLogs: [newLog, ...executionData.dailyLogs]
    });

    setNewLogAchievements('');
    setNewLogPlanned('');
    setNewLogObstacles('');
    setShowAddLogModal(false);
  };

  // Add a new work item
  const handleAddWorkItem = () => {
    if (!newItemTitle.trim()) return;

    const deptMap: Record<ExecutionCategory, string> = {
      civil: 'إدارة المشروعات',
      equipment: 'إدارة التشغيل والتموين',
      hse: 'إدارة السلامة والصحة المهنية (HSE)',
      legal: 'الإدارة القانونية والتعاقدات',
      financial: 'الإدارة المالية ودراسات الجدوى'
    };

    const newItem: ExecutionWorkItem = {
      id: `work-custom-${Date.now()}`,
      category: newItemCategory,
      departmentName: deptMap[newItemCategory],
      title: newItemTitle,
      description: newItemDesc || 'بند تنفيذي معتمد من إدارة المشروع',
      weightPercent: Number(newItemWeight) || 5,
      progressPercent: 0,
      status: 'not_started',
      startDate: newItemStartDate,
      targetEndDate: newItemEndDate,
      assignedEngineer: newItemEngineer,
      estimatedCostEgp: Number(newItemCost) || 0,
      disbursedCostEgp: 0,
      subTasks: [
        { id: `st-c-${Date.now()}-1`, title: 'بدء وتجهيز الأعمال بالموقع', completed: false },
        { id: `st-c-${Date.now()}-2`, title: 'تنفيذ البند طبقاً للمواصفات', completed: false },
        { id: `st-c-${Date.now()}-3`, title: 'المعاينة والاستلام من الاستشاري', completed: false },
      ]
    };

    const updatedItems = [...executionData.workItems, newItem];
    updateExecution({
      workItems: updatedItems
    });

    setNewItemTitle('');
    setNewItemDesc('');
    setShowAddWorkItemModal(false);
  };

  // Filtered work items
  const filteredWorkItems = useMemo(() => {
    return executionData.workItems.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesDept = item.departmentName.toLowerCase().includes(query);
        const matchesEng = item.assignedEngineer.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesDept && !matchesEng) return false;
      }
      return true;
    });
  }, [executionData.workItems, selectedCategory, statusFilter, searchQuery]);

  // Filtered daily logs for periodic reporting
  const filteredLogs = useMemo(() => {
    if (reportMode === 'current') {
      // Latest logs
      return executionData.dailyLogs.slice(0, 5);
    }
    if (reportMode === 'specific_date') {
      return executionData.dailyLogs.filter(log => log.date === selectedSpecificDate);
    }
    if (reportMode === 'weekly') {
      // Logs within last 7 days from selected date
      return executionData.dailyLogs.filter(log => {
        const d = new Date(log.date).getTime();
        const sel = new Date(selectedSpecificDate).getTime();
        const diffDays = (sel - d) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
      });
    }
    if (reportMode === 'monthly') {
      // Logs in the same year-month
      const monthPrefix = selectedSpecificDate.substring(0, 7); // e.g. "2026-09"
      return executionData.dailyLogs.filter(log => log.date.startsWith(monthPrefix));
    }
    if (reportMode === 'custom_range') {
      return executionData.dailyLogs.filter(log => log.date >= customRangeStart && log.date <= customRangeEnd);
    }
    return executionData.dailyLogs;
  }, [executionData.dailyLogs, reportMode, selectedSpecificDate, customRangeStart, customRangeEnd]);

  // Department Progress Breakdown
  const deptProgressStats = useMemo(() => {
    const categories: ExecutionCategory[] = ['civil', 'equipment', 'hse', 'legal', 'financial'];
    return categories.map(cat => {
      const items = executionData.workItems.filter(it => it.category === cat);
      const totalWeight = items.reduce((s, it) => s + it.weightPercent, 0);
      const progress = totalWeight > 0 
        ? Math.round(items.reduce((s, it) => s + (it.progressPercent * it.weightPercent), 0) / totalWeight)
        : 0;
      const completedItems = items.filter(it => it.status === 'completed').length;
      const totalDisbursed = items.reduce((s, it) => s + it.disbursedCostEgp, 0);
      const totalEstimated = items.reduce((s, it) => s + it.estimatedCostEgp, 0);

      const labels: Record<ExecutionCategory, { name: string; icon: any; color: string; bg: string; border: string }> = {
        civil: { name: 'المشروعات والأعمال المدنية', icon: Building2, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
        equipment: { name: 'التشغيل والمعدات والآلات', icon: Wrench, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
        hse: { name: 'السلامة والأمن الصناعي (HSE)', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
        legal: { name: 'الشؤون القانونية والتراخيص', icon: Scale, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
        financial: { name: 'الموقف المالي والمستخلصات', icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
      };

      return {
        category: cat,
        ...labels[cat],
        progress,
        itemsCount: items.length,
        completedItems,
        totalDisbursed,
        totalEstimated
      };
    });
  }, [executionData.workItems]);

  // Status badge helper
  const renderStatusBadge = (status: ExecutionWorkItem['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>مكتمل 100%</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>قيد التنفيذ بالموقع</span>
          </span>
        );
      case 'inspection':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>تحت الفحص والمعاينة</span>
          </span>
        );
      case 'delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>متأخر عن الجدول</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <Clock className="w-3.5 h-3.5" />
            <span>لم يبدأ بعد</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner with Official Cargas NGV Logo & Site Context */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Logo and Station Title */}
          <div className="flex items-center gap-4">
            <div className="bg-slate-950/80 p-2 rounded-2xl border border-slate-800 shadow-inner">
              <CargasNgvLogo size="lg" layout="vertical" subtitle="قطاع المشروعات والتنفيذ" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  مرحلة البدء في التنفيذ الإنشائي
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {session.code}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {session.locationName}، {session.governorate}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                منظومة رصد تنفيذ وإنشاء محطة: {session.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                المقاول العام: <span className="text-amber-400 font-semibold">{executionData.contractorName}</span> • الاستشاري: <span className="text-slate-200">{executionData.consultantEngineer}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap self-stretch lg:self-auto justify-end">
            <button
              id="btn-print-execution-report"
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>استخراج التقرير والمحضر المعتمد</span>
            </button>

            <button
              id="btn-add-daily-log"
              onClick={() => setShowAddLogModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل يومية موقع جديدة</span>
            </button>

            {onNavigateToDepartments && (
              <button
                onClick={onNavigateToDepartments}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-blue-400" />
                <span>موافقات الإدارات</span>
              </button>
            )}

            {onNavigateToFeasibility && (
              <button
                onClick={onNavigateToFeasibility}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>دراسة الجدوى</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Key Execution Metrics Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Metric 1: Overall Progress */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">نسبة الإنجاز الإجمالية</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400">
                {executionData.overallProgressPercent}%
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 2: Kickoff & Handover */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">تاريخ التسليم المستهدف</span>
              <span className="text-sm sm:text-base font-bold text-white font-mono">
                {executionData.targetHandoverDate}
              </span>
              <span className="text-[10px] text-blue-400 block">بدء العمل: {executionData.kickoffDate}</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 3: Capex Disbursed vs Approved */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">المصروف من الميزانية</span>
              <span className="text-sm sm:text-base font-bold text-amber-400 font-mono">
                {(executionData.totalDisbursedBudgetEgp / 1000000).toFixed(2)}M ج.م
              </span>
              <span className="text-[10px] text-slate-400 block">
                من {((executionData.totalApprovedBudgetEgp || 38500000) / 1000000).toFixed(1)}M ج.م
              </span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 4: Workforce on Site */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block">العمالة الحالية بالموقع</span>
              <span className="text-xl sm:text-2xl font-black text-cyan-400">
                {executionData.dailyLogs[0]?.workforceCount || 38} فرد
              </span>
              <span className="text-[10px] text-slate-400 block">مهندسين وفنيين وعمال</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Metric 5: HSE Industrial Safety */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between col-span-2 sm:col-span-1">
            <div>
              <span className="text-[11px] text-slate-400 block">سجل الأمن الصناعي</span>
              <span className="text-sm sm:text-base font-black text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                0 حوادث
              </span>
              <span className="text-[10px] text-emerald-300 block">معدل التزام تام 100%</span>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <HardHat className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Department Progress Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>موقف إدارات كارجاس الخمس في مرحلة التنفيذ الإنشائي:</span>
          </h2>
          <span className="text-xs text-slate-400">
            اضغط على أي إدارة لتصفية بنود الأعمال أدناه
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {deptProgressStats.map(dept => {
            const Icon = dept.icon;
            const isSelected = selectedCategory === dept.category;
            return (
              <button
                key={dept.category}
                onClick={() => setSelectedCategory(isSelected ? 'all' : dept.category)}
                className={`p-4 rounded-xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                  isSelected 
                    ? 'bg-slate-800/95 border-blue-500 shadow-md ring-2 ring-blue-500/30' 
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${dept.bg} ${dept.border} border flex items-center justify-center ${dept.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-black font-mono ${dept.color}`}>
                    {dept.progress}%
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                  {dept.name}
                </h3>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      dept.category === 'civil' ? 'bg-amber-400' :
                      dept.category === 'equipment' ? 'bg-cyan-400' :
                      dept.category === 'hse' ? 'bg-emerald-400' :
                      dept.category === 'legal' ? 'bg-purple-400' : 'bg-blue-400'
                    }`}
                    style={{ width: `${dept.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{dept.completedItems} من {dept.itemsCount} بنود منجزة</span>
                  <span className="font-mono">{(dept.totalDisbursed / 1000000).toFixed(1)}M ج.م</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Periodic & Daily Reporting Control Center (محرك التقارير الدورية واليومية) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>مركز استخراج تقارير الموقف التنفيذي (يومي • أسبوعي • شهري • فترة مخصصة)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              رصد تقارير المهندس المقيم ويوميات الموقع في أي تاريخ محدد أو خلال فترات أسبوعية وشهرية
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
            <button
              onClick={() => setReportMode('current')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                reportMode === 'current'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الموقف الحالي المباشر
            </button>
            <button
              onClick={() => setReportMode('specific_date')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                reportMode === 'specific_date'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              في تاريخ معين
            </button>
            <button
              onClick={() => setReportMode('weekly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                reportMode === 'weekly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              تقرير أسبوعي
            </button>
            <button
              onClick={() => setReportMode('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                reportMode === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              تقرير شهري
            </button>
            <button
              onClick={() => setReportMode('custom_range')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                reportMode === 'custom_range'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              فترة مخصصة
            </button>
          </div>
        </div>

        {/* Sub-selectors depending on mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3 flex-wrap">
            {reportMode === 'specific_date' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-semibold">اختر التاريخ المحدد:</span>
                <input
                  type="date"
                  value={selectedSpecificDate}
                  onChange={(e) => setSelectedSpecificDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            )}

            {reportMode === 'weekly' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-semibold">أسبوع ينتهي في تاريخ:</span>
                <input
                  type="date"
                  value={selectedSpecificDate}
                  onChange={(e) => setSelectedSpecificDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
                <span className="text-[11px] text-slate-400">(يعرض الأسبوع السابق لهذا التاريخ)</span>
              </div>
            )}

            {reportMode === 'monthly' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-semibold">شهر التقرير:</span>
                <input
                  type="month"
                  value={selectedSpecificDate.substring(0, 7)}
                  onChange={(e) => setSelectedSpecificDate(`${e.target.value}-01`)}
                  className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            )}

            {reportMode === 'custom_range' && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-300 font-semibold">من تاريخ:</span>
                <input
                  type="date"
                  value={customRangeStart}
                  onChange={(e) => setCustomRangeStart(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
                <span className="text-xs text-slate-300 font-semibold">إلى تاريخ:</span>
                <input
                  type="date"
                  value={customRangeEnd}
                  onChange={(e) => setCustomRangeEnd(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            )}

            {reportMode === 'current' && (
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>عرض أحدث التطورات الميدانية المسجلة حتى اليوم: <span className="font-mono text-emerald-400 font-bold">{new Date().toISOString().split('T')[0]}</span></span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              عدد التقارير المطابقة للفترة: <strong className="text-white">{filteredLogs.length}</strong>
            </span>
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>طباعة هذه الفترة</span>
            </button>
          </div>
        </div>

        {/* Filtered Logs Cards */}
        {filteredLogs.length > 0 ? (
          <div className="space-y-3">
            {filteredLogs.map(log => (
              <div 
                key={log.id}
                className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {log.reportType === 'daily' ? 'تقرير يومي' : log.reportType === 'weekly' ? 'تقرير أسبوعي' : 'تقرير شهري'}
                    </span>
                    <span className="text-sm font-bold text-white font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {log.date}
                    </span>
                    <span className="text-xs text-slate-400">
                      • المهندس المقيم: <strong className="text-slate-200">{log.residentEngineer}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-300 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      {log.workforceCount} فرد
                    </span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                      نسبة إنجاز الموقع: {log.siteProgressSnapshotPercent}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="font-bold text-emerald-300 block flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      الأعمال والمهام المنجزة:
                    </span>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                      {log.completedWorksToday}
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
                    <span className="font-bold text-blue-300 block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      خطة الأعمال المستهدفة:
                    </span>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                      {log.plannedWorksTomorrow}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] pt-1 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      الأمن الصناعي:
                    </span>
                    <span className="text-slate-300">{log.hseIndustrialSafetyStatus}</span>
                  </div>

                  {log.delaysOrObstacles && (
                    <div className="flex items-center gap-1 text-rose-300">
                      <AlertTriangle className="w-3 h-3" />
                      <span>{log.delaysOrObstacles}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
            <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">لا توجد سجلات موقع مسجلة في هذا النطاق الزمني المحدد.</p>
            <p className="text-xs text-slate-500 mt-1">يمكنك إضافة يومية موقع جديدة أو اختيار تاريخ آخر.</p>
          </div>
        )}
      </div>

      {/* 5. Detailed Work Items Execution Table (رصد موقف كل بند إنشائي وتجهيزي) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-400" />
              <span>قائمة الأعمال والبنود التنفيذية الجارية للمحطة ({filteredWorkItems.length} بند):</span>
            </h2>
            <p className="text-xs text-slate-400">
              متابعة دقيقة لكل تفصيلة إنشائية أو ميكانيكية أو قانونية ونسب إنجازها على الطبيعة
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث في البنود والمهندسين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-white pr-8 pl-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 w-48"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">كافة الحالات</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="inspection">تحت الفحص</option>
              <option value="delayed">متأخر</option>
            </select>

            <button
              onClick={() => setShowAddWorkItemModal(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة بند تنفيذي</span>
            </button>
          </div>
        </div>

        {/* Work Items List */}
        <div className="space-y-3">
          {filteredWorkItems.map(item => {
            const isExpanded = expandedItemId === item.id;
            return (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {item.departmentName}
                      </span>
                      {renderStatusBadge(item.status)}
                      <span className="text-xs text-slate-400">
                        الوزن النسبي: <strong className="text-amber-400 font-mono">{item.weightPercent}%</strong>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Progress & Controls */}
                  <div className="flex items-center gap-4">
                    <div className="w-36 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[10px]">نسبة الإنجاز:</span>
                        <span className="font-bold font-mono text-emerald-400">{item.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Progress Slider */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={item.progressPercent}
                      onChange={(e) => handleUpdateItemProgress(item.id, Number(e.target.value))}
                      className="w-20 accent-emerald-500 cursor-pointer"
                      title="تعديل نسبة الإنجاز سريعاً"
                    />

                    {/* Expand/Collapse subtasks */}
                    <button
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      title="عرض خطوات ومراحل البند"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Sub-tasks and Financial Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4">
                    {/* Sub-tasks checklist */}
                    <div>
                      <span className="text-xs font-bold text-slate-300 block mb-2">
                        المراحل والمهام الفرعية التفصيلية للبند:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.subTasks.map(st => (
                          <button
                            key={st.id}
                            onClick={() => handleToggleSubtask(item.id, st.id)}
                            className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-right transition-all cursor-pointer ${
                              st.completed
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <div className="mt-0.5">
                              {st.completed ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-500 shrink-0" />
                              )}
                            </div>
                            <div className="flex-1">
                              <span className={`text-xs block ${st.completed ? 'line-through text-slate-400' : 'font-medium'}`}>
                                {st.title}
                              </span>
                              {st.completionDate && (
                                <span className="text-[10px] text-emerald-400 block font-mono">
                                  تم الإنجاز: {st.completionDate}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Metadata & Cost info */}
                    <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-slate-400 block text-[11px]">المهندس المسؤول:</span>
                        <strong className="text-white">{item.assignedEngineer}</strong>
                        {item.contractorName && (
                          <span className="text-[11px] text-slate-400 block">المقاول: {item.contractorName}</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 block text-[11px]">الجدول الزمني للبند:</span>
                        <span className="text-white font-mono">من {item.startDate} إلى {item.targetEndDate}</span>
                        {item.actualEndDate && (
                          <span className="text-[11px] text-emerald-400 block font-mono">
                            تم الانتهاء الفعلي: {item.actualEndDate}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-400 block text-[11px]">الموقف المالي للبند:</span>
                        <span className="text-amber-400 font-bold font-mono">
                          المنصرف: {(item.disbursedCostEgp / 1000000).toFixed(2)}M ج.م
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          المقدر: {(item.estimatedCostEgp / 1000000).toFixed(2)}M ج.م
                        </span>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="text-xs text-slate-300 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="font-semibold text-amber-300">ملاحظات فنية: </span>
                        {item.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: Printable Official Station Execution Report (محضر الموقف التنفيذي المعتمد للطباعة) */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-6">
            {/* Modal Header Controls (Not Printed) */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  معاينة وطباعة تقرير الموقف التنفيذي الرسمي للمحطة
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الآن (Print)</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* Document Body (Formatted like an official Egyptian Petroleum Ministry / Cargas paper) */}
            <div className="p-6 sm:p-8 bg-white text-slate-900 space-y-6 print:p-0 print:m-0" id="official-print-document">
              {/* Document Header with Logos */}
              <div className="flex items-center justify-between border-b-2 border-emerald-700 pb-4">
                <div className="text-right space-y-0.5">
                  <p className="text-xs font-bold text-slate-600">جمهورية مصر العربية</p>
                  <p className="text-xs font-bold text-slate-700">وزارة البترول والثروة المعدنية</p>
                  <p className="text-sm font-black text-emerald-800">شركة الغاز الطبيعي للسيارات (كارجاس)</p>
                  <p className="text-[11px] font-semibold text-slate-500">قطاع المشروعات والتنفيذ والأمن الصناعي</p>
                </div>

                <div className="flex flex-col items-center">
                  <CargasNgvLogo size="lg" layout="vertical" subtitle="الغاز الطبيعي للمركبات • CARGAS" lightBackground={true} />
                </div>

                <div className="text-left space-y-1 font-mono text-xs text-slate-700">
                  <p><strong>كود المحطة:</strong> {session.code}</p>
                  <p><strong>تاريخ التقرير:</strong> {new Date().toISOString().split('T')[0]}</p>
                  <p><strong>حالة المحطة:</strong> مرحلة التنفيذ الإنشائي</p>
                </div>
              </div>

              {/* Title */}
              <div className="text-center py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <h2 className="text-base sm:text-lg font-black text-emerald-900">
                  محضر الموقف التنفيذي وسير أعمال إنشاء محطة غاز طبيعي
                </h2>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  الموقع: {session.locationName} - {session.city} - محافظة {session.governorate}
                </p>
              </div>

              {/* Executive Summary Table */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border border-slate-300 rounded-lg p-3 bg-slate-50">
                <div>
                  <span className="text-slate-500 block">المقاول العام:</span>
                  <strong className="text-slate-900">{executionData.contractorName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">المهندس المقيم:</span>
                  <strong className="text-slate-900">{executionData.residentEngineer}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">نسبة الإنجاز الفعلية:</span>
                  <strong className="text-emerald-700 text-sm font-black font-mono">
                    {executionData.overallProgressPercent}%
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 block">الميزانية المصروفة:</span>
                  <strong className="text-amber-700 text-sm font-black font-mono">
                    {(executionData.totalDisbursedBudgetEgp / 1000000).toFixed(2)} مليون ج.م
                  </strong>
                </div>
              </div>

              {/* Department Roles & Status Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 border-b border-slate-300 pb-1">
                  أولاً: موقف إدارات كارجاس المتخصصة من أعمال التنفيذ الميدانية:
                </h4>
                <table className="w-full text-xs text-right border border-slate-300 divide-y divide-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2 border-l border-slate-300">الإدارة المعنية</th>
                      <th className="p-2 border-l border-slate-300">المهام التنفيذية الحالية</th>
                      <th className="p-2 border-l border-slate-300 text-center">نسبة الإنجاز</th>
                      <th className="p-2 border-l border-slate-300 text-center">حالة البند</th>
                      <th className="p-2 text-left font-mono">المنصرف (ج.م)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {deptProgressStats.map(dept => (
                      <tr key={dept.category} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-900 border-l border-slate-300">
                          {dept.name}
                        </td>
                        <td className="p-2 text-slate-700 border-l border-slate-300">
                          {dept.itemsCount} بنود تفصيلية معتمدة
                        </td>
                        <td className="p-2 text-center font-bold font-mono text-emerald-800 border-l border-slate-300">
                          {dept.progress}%
                        </td>
                        <td className="p-2 text-center border-l border-slate-300">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            مطابق للجدول
                          </span>
                        </td>
                        <td className="p-2 text-left font-mono font-bold text-slate-800">
                          {dept.totalDisbursed.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Latest Site Logs Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 border-b border-slate-300 pb-1">
                  ثانياً: سجل اليوميات والأعمال الميدانية المنجزة خلال الفترة:
                </h4>
                <table className="w-full text-xs text-right border border-slate-300 divide-y divide-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-2 border-l border-slate-300 w-24">التاريخ</th>
                      <th className="p-2 border-l border-slate-300">الأعمال المنجزة على الطبيعة</th>
                      <th className="p-2 border-l border-slate-300 w-36">الأمن الصناعي والسلامة</th>
                      <th className="p-2 text-center w-20">الإنجاز</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredLogs.slice(0, 4).map(log => (
                      <tr key={log.id}>
                        <td className="p-2 font-mono font-bold text-slate-800 border-l border-slate-300">
                          {log.date}
                        </td>
                        <td className="p-2 text-slate-800 leading-relaxed whitespace-pre-line border-l border-slate-300">
                          {log.completedWorksToday}
                        </td>
                        <td className="p-2 text-slate-700 border-l border-slate-300 text-[11px]">
                          {log.hseIndustrialSafetyStatus}
                        </td>
                        <td className="p-2 text-center font-bold font-mono text-emerald-800">
                          {log.siteProgressSnapshotPercent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Official Approvals & Stamps */}
              <div className="pt-6 border-t-2 border-slate-400 grid grid-cols-4 gap-4 text-center text-xs">
                <div className="space-y-8">
                  <p className="font-bold text-slate-800">مهندس الموقع المقيم</p>
                  <p className="font-mono text-slate-600">م. تامر مصطفى</p>
                </div>
                <div className="space-y-8">
                  <p className="font-bold text-slate-800">مدير عام المشروعات</p>
                  <p className="font-mono text-slate-600">م. أحمد الشربيني</p>
                </div>
                <div className="space-y-8">
                  <p className="font-bold text-slate-800">مدير عام الأمن الصناعي</p>
                  <p className="font-mono text-slate-600">م. عصام فوزي</p>
                </div>
                <div className="space-y-8">
                  <p className="font-bold text-slate-800">مساعد رئيس الشركة للعمليات</p>
                  <p className="font-mono text-slate-600">اعتماد رسمي وختم كارجاس</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Daily Site Log (تسجيل يومية موقع جديدة) */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  تسجيل يومية موقع وموقف تنفيذي جديد
                </h3>
              </div>
              <button
                onClick={() => setShowAddLogModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                إلغاء
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">تاريخ اليومية:</label>
                <input
                  type="date"
                  value={newLogDate}
                  onChange={(e) => setNewLogDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">نوع التقرير:</label>
                <select
                  value={newLogType}
                  onChange={(e) => setNewLogType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="daily">يومي (Daily Log)</option>
                  <option value="weekly">أسبوعي (Weekly Summary)</option>
                  <option value="monthly">شهري (Monthly Milestone)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">حجم العمالة بالموقع:</label>
                <input
                  type="number"
                  value={newLogWorkforce}
                  onChange={(e) => setNewLogWorkforce(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">المهندس المقيم:</label>
                <input
                  type="text"
                  value={newLogEngineer}
                  onChange={(e) => setNewLogEngineer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">حالة الطقس والموقع:</label>
                <input
                  type="text"
                  value={newLogWeather}
                  onChange={(e) => setNewLogWeather(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="text-slate-300 font-semibold block mb-1">المعدات المتواجدة بالموقع اليوم:</label>
              <input
                type="text"
                value={newLogEquipment}
                onChange={(e) => setNewLogEquipment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="أوناش، خلاطات، ماكينات لحام، حفارات..."
              />
            </div>

            <div className="text-xs">
              <label className="text-emerald-300 font-semibold block mb-1">
                الأعمال المنفذة والمنجزة على الطبيعة اليوم (*):
              </label>
              <textarea
                rows={3}
                value={newLogAchievements}
                onChange={(e) => setNewLogAchievements(e.target.value)}
                placeholder="تفاصيل صب الخرسانات، تركيب الهياكل، إنزال الضاغط، لحام الخطوط..."
                className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="text-xs">
              <label className="text-blue-300 font-semibold block mb-1">الأعمال المستهدفة للغد:</label>
              <textarea
                rows={2}
                value={newLogPlanned}
                onChange={(e) => setNewLogPlanned(e.target.value)}
                placeholder="خطة عمل اليوم التالي..."
                className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-amber-300 font-semibold block mb-1">موقف الأمن الصناعي والسلامة:</label>
                <input
                  type="text"
                  value={newLogHse}
                  onChange={(e) => setNewLogHse(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">نسبة إنجاز الموقع في هذا التاريخ (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newLogProgressPercent}
                  onChange={(e) => setNewLogProgressPercent(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddLogModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddDailyLog}
                disabled={!newLogAchievements.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold cursor-pointer shadow"
              >
                حفظ وإضافة اليومية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Custom Work Item (إضافة بند تنفيذي جديد) */}
      {showAddWorkItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  إضافة بند تنفيذي جديد للمشروع
                </h3>
              </div>
              <button
                onClick={() => setShowAddWorkItemModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                إلغاء
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">الإدارة المسؤولة:</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="civil">المشروعات والأعمال المدنية</option>
                  <option value="equipment">التشغيل وتوريد المعدات والآلات</option>
                  <option value="hse">السلامة والأمن الصناعي (HSE)</option>
                  <option value="legal">الشؤون القانونية والتراخيص</option>
                  <option value="financial">الموقف المالي وصرف المستخلصات</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">المهندس المسؤول:</label>
                <input
                  type="text"
                  value={newItemEngineer}
                  onChange={(e) => setNewItemEngineer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="text-slate-300 font-semibold block mb-1">عنوان البند التنفيذي (*):</label>
              <input
                type="text"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="مثال: تركيب نظام تصريف المياه والأرضيات الإيبوكسية"
                className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="text-xs">
              <label className="text-slate-300 font-semibold block mb-1">وصف وتفاصيل البند:</label>
              <textarea
                rows={2}
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                placeholder="المواصفات الفنية والمقايسة المعتمدة..."
                className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">الوزن النسبي (%):</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newItemWeight}
                  onChange={(e) => setNewItemWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">التكلفة التقديرية (ج.م):</label>
                <input
                  type="number"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">تاريخ البدء:</label>
                <input
                  type="date"
                  value={newItemStartDate}
                  onChange={(e) => setNewItemStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">تاريخ الانتهاء:</label>
                <input
                  type="date"
                  value={newItemEndDate}
                  onChange={(e) => setNewItemEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-lg font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddWorkItemModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddWorkItem}
                disabled={!newItemTitle.trim()}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold cursor-pointer shadow"
              >
                إضافة البند للموقع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
