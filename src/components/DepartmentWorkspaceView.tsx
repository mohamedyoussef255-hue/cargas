import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Flame, 
  Wrench, 
  Cpu, 
  FileCheck, 
  Scale, 
  BadgeDollarSign, 
  Share2, 
  Lock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  FileText, 
  Plus, 
  Printer, 
  Eye, 
  MapPin, 
  Clock, 
  Sparkles,
  Gauge,
  Sliders,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  FolderOpen,
  Users,
  Camera,
  Film,
  History,
  Calendar,
  Award,
  LogOut,
  Bell,
  BookOpen,
  Mail,
  ClipboardCheck,
  AlertTriangle,
  X
} from 'lucide-react';
import { 
  DepartmentRole, 
  MonitoringSession, 
  CustomFormField, 
  FormChangeRequest,
  DepartmentActivityLogItem
} from '../types';
import { DEPARTMENTS_METADATA, INITIAL_FORM_CHANGE_REQUESTS } from '../data/departmentCustomFields';
import { RequestFormChangeModal } from './RequestFormChangeModal';
import { MarketingSurveyDispatcherModal } from './MarketingSurveyDispatcherModal';
import { DepartmentTeamInviteModal } from './DepartmentTeamInviteModal';
import { DepartmentDedicatedCameraModal } from './DepartmentDedicatedCameraModal';
import { VideoArchiveModal } from './VideoArchiveModal';
import { DepartmentPeriodicTasksScheduler } from './DepartmentPeriodicTasksScheduler';
import { DepartmentPerformanceEvaluation } from './DepartmentPerformanceEvaluation';
import { DepartmentActivityAuditLog } from './DepartmentActivityAuditLog';
import { DepartmentAlertsCenter } from './DepartmentAlertsCenter';
import { AutomatedReportingEngine } from './AutomatedReportingEngine';
import { InteractiveUserGuideModal } from './InteractiveUserGuideModal';
import { MarketingDedicatedSessionsManager } from './MarketingDedicatedSessionsManager';
import { DepartmentFieldInspectionModal } from './DepartmentFieldInspectionModal';
import { DepartmentCorrespondenceManager } from './DepartmentCorrespondenceManager';
import { DepartmentTaskNotificationsModal } from './DepartmentTaskNotificationsModal';
import { getDepartmentTaskNotificationsSummary } from '../utils/taskNotificationsHelper';
import { loadActivityLogs } from '../data/authCredentials';

interface DepartmentWorkspaceViewProps {
  department: DepartmentRole;
  sessions: MonitoringSession[];
  activeSession: MonitoringSession | null;
  onSelectSession: (session: MonitoringSession) => void;
  onUpdateSession: (updatedSession: MonitoringSession) => void;
  customFields: CustomFormField[];
  onSubmitFormChangeRequest: (request: FormChangeRequest) => void;
  onNavigateToAdmin?: () => void;
  onSwitchDepartment: () => void;
  onOpenLandownerApplications?: () => void;
  changeRequests?: FormChangeRequest[];
}

export const DepartmentWorkspaceView: React.FC<DepartmentWorkspaceViewProps> = ({
  department,
  sessions,
  activeSession,
  onSelectSession,
  onUpdateSession,
  customFields,
  onSubmitFormChangeRequest,
  onNavigateToAdmin,
  onSwitchDepartment,
  onOpenLandownerApplications,
  changeRequests
}) => {
  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;
  const isOps = department === 'operations';
  const isMarketing = department === 'marketing';

  // Task notifications & overdue milestones calculation (>48h)
  const notificationsSummary = useMemo(() => {
    const reqs = changeRequests || (() => {
      try {
        const saved = localStorage.getItem('cng_form_change_requests_v1');
        if (saved) return JSON.parse(saved);
      } catch {}
      return INITIAL_FORM_CHANGE_REQUESTS;
    })();
    return getDepartmentTaskNotificationsSummary(department, sessions, reqs);
  }, [department, sessions, changeRequests]);

  // Modal states
  const [isTaskNotificationsModalOpen, setIsTaskNotificationsModalOpen] = useState<boolean>(false);
  const [isUrgentBannerDismissed, setIsUrgentBannerDismissed] = useState<boolean>(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState<boolean>(false);
  const [isTeamInviteModalOpen, setIsTeamInviteModalOpen] = useState<boolean>(false);
  const [isDedicatedCameraOpen, setIsDedicatedCameraOpen] = useState<boolean>(false);
  const [isVideoArchiveOpen, setIsVideoArchiveOpen] = useState<boolean>(false);
  const [showActivityLogs, setShowActivityLogs] = useState<boolean>(false);
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);
  const [isFieldInspectionOpen, setIsFieldInspectionOpen] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'tasks' | 'evaluation' | 'alerts' | 'reports' | 'logs' | 'correspondence'>('form');

  // Form field values stored locally or loaded from session
  const [fieldValues, setFieldValues] = useState<Record<string, any>>(() => {
    return activeSession?.customFieldValues?.[department] || {};
  });

  // Department-specific custom fields (visible only)
  const deptCustomFields = customFields.filter(f => f.department === department && f.visible);

  const handleFieldChange = (key: string, val: any) => {
    const updated = { ...fieldValues, [key]: val };
    setFieldValues(updated);

    if (activeSession) {
      const updatedSession: MonitoringSession = {
        ...activeSession,
        customFieldValues: {
          ...(activeSession.customFieldValues || {}),
          [department]: updated
        }
      };
      onUpdateSession(updatedSession);
    }
  };

  const handleSaveData = () => {
    if (activeSession) {
      const updatedSession: MonitoringSession = {
        ...activeSession,
        customFieldValues: {
          ...(activeSession.customFieldValues || {}),
          [department]: fieldValues
        }
      };
      onUpdateSession(updatedSession);
      setIsSavedNotice(true);
      setTimeout(() => setIsSavedNotice(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Breadcrumb & Department Identity Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white shrink-0">
            {department === 'operations' && <Wrench className="w-6 h-6 text-amber-400" />}
            {department === 'marketing' && <Share2 className="w-6 h-6 text-indigo-400" />}
            {department === 'projects' && <Building2 className="w-6 h-6 text-blue-400" />}
            {department === 'hse' && <Flame className="w-6 h-6 text-emerald-400" />}
            {department === 'technical' && <Cpu className="w-6 h-6 text-teal-400" />}
            {department === 'licensing' && <FileCheck className="w-6 h-6 text-orange-400" />}
            {department === 'legal' && <Scale className="w-6 h-6 text-purple-400" />}
            {department === 'financial' && <BadgeDollarSign className="w-6 h-6 text-cyan-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">
                {meta.title}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {meta.badge}
              </span>
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                بيئة عمل مستقلة ومحمية
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          
          {/* Task Notification Badge for > 48h Pending Requests & Overdue Milestones */}
          <button
            id="btn-dept-urgent-task-badge"
            onClick={() => setIsTaskNotificationsModalOpen(true)}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer ${
              notificationsSummary.totalUrgentCount > 0
                ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-rose-600/30 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title={`تنبيهات المهام: ${notificationsSummary.urgentPendingRequestsCount} طلبات حقول معلقة، و ${notificationsSummary.urgentMilestonesCount} مراحل متأخرة تجاوزت 48 ساعة`}
          >
            <div className="flex items-center gap-1.5">
              <AlertTriangle className={`w-4 h-4 ${notificationsSummary.totalUrgentCount > 0 ? 'text-amber-200' : 'text-slate-400'}`} />
              <span>تنبيهات المهام العاجلة</span>
            </div>

            <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-black/40 text-white font-black text-[11px] border border-white/20">
              {notificationsSummary.totalUrgentCount}
            </span>

            {notificationsSummary.totalUrgentCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </button>

          {/* Department-Dedicated Monitoring Camera Button */}
          <button
            id="btn-dept-camera"
            onClick={() => setIsDedicatedCameraOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            title={`فتح كاميرا الرصد الميداني والتوثيق لـ ${meta.title}`}
          >
            {department === 'projects' ? <Building2 className="w-4 h-4" /> :
             department === 'operations' ? <Wrench className="w-4 h-4" /> :
             department === 'hse' ? <Flame className="w-4 h-4" /> :
             department === 'technical' ? <Cpu className="w-4 h-4" /> :
             department === 'marketing' ? <Camera className="w-4 h-4" /> :
             <Camera className="w-4 h-4" />}
            <span>
              {department === 'projects' ? 'كاميرا الرفع المساحي والخرائط' :
               department === 'operations' ? 'كاميرا رصد أماكن ومواصفات المعدات' :
               department === 'hse' ? 'كاميرا رصد منظومة السلامة والأمن الصناعي' :
               department === 'technical' ? 'كاميرا فحص شبكة الغاز والربط' :
               department === 'marketing' ? 'كاميرا رصد وحصر المركبات' :
               'كاميرا المعاينة الميدانية'}
            </span>
          </button>

          {/* Marketing Only: WhatsApp Survey Dispatcher Button */}
          {department === 'marketing' && (
            <button
              id="btn-marketing-dispatch-wa"
              onClick={() => setIsMarketingModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/30 cursor-pointer"
              title="إرسال جلسة رصد محددة للمعاين الميداني عبر الواتساب"
            >
              <Share2 className="w-4 h-4" />
              <span>إرسال جلسة رصد بالواتساب</span>
            </button>
          )}

          {/* Department Video Archive Storage */}
          <button
            id="btn-dept-video-archive"
            onClick={() => setIsVideoArchiveOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            title="مخزن وفيديوهات الرصد الخاصة بالإدارة والمنظومة"
          >
            <Film className="w-4 h-4" />
            <span>مخزن الفيديوهات الموثقة</span>
          </button>

          {/* Department Activity Logs */}
          <button
            id="btn-dept-activity-logs"
            onClick={() => setShowActivityLogs(!showActivityLogs)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              showActivityLogs
                ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-sky-500/30'
            }`}
            title="سجل نشاط وتكليفات الإدارة باليوم والتاريخ"
          >
            <History className="w-4 h-4" />
            <span>سجل نشاط الإدارة</span>
          </button>

          {/* Landowner Survey Applications Button - ONLY in Marketing Department */}
          {department === 'marketing' && onOpenLandownerApplications && (
            <button
              onClick={onOpenLandownerApplications}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 cursor-pointer"
              title="عرض وإدارة طلبات المعاينة المقدمة من ملاك الأراضي ومحطات الوقود وإرسالها بالواتساب"
            >
              <FileText className="w-4 h-4" />
              <span>طلبات معاينة ملاك المواقع</span>
            </button>
          )}

          {/* Department Dedicated Field Inspection Button */}
          <button
            onClick={() => setIsFieldInspectionOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            title="تنفيذ معاينة ميدانية ورصد كافة ما يناسب الإدارة من معلومات ومواصفات"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>تنفيذ معاينة ميدانية للإدارة</span>
          </button>

          {/* Inter-Department Correspondence Button */}
          <button
            onClick={() => setActiveSubTab('correspondence')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              activeSubTab === 'correspondence'
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border-purple-500/30'
            }`}
            title="المراسلات والمخاطبات الرسمية بين الإدارات وإدارة النظام"
          >
            <Mail className="w-4 h-4 text-purple-400" />
            <span>المراسلات والمخاطبات</span>
          </button>

          {/* Team Invite WhatsApp Button */}
          <button
            onClick={() => setIsTeamInviteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all cursor-pointer"
            title="إرسال رابط دعوة مخصص لمهندسي وموظفي الإدارة بالواتساب"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>دعوة فريق الإدارة بالواتساب</span>
          </button>

          {/* Request Form Change Button */}
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all cursor-pointer"
            title="طلب تعديل أو إضافة حقول للاستمارة"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>طلب تحديث الحقول</span>
            {notificationsSummary.urgentPendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {notificationsSummary.urgentPendingRequestsCount} معلق
              </span>
            )}
          </button>

          {/* Interactive User Guide Button */}
          <button
            onClick={() => setIsUserGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-bold border border-blue-500/30 transition-all cursor-pointer"
            title="فتح دليل الاستخدام التفاعلي لمنظومة كارجاس"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>دليل الاستخدام</span>
          </button>

          {/* Switch Department / Logout */}
          <button
            onClick={onSwitchDepartment}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/70 text-rose-200 text-xs font-bold border border-rose-500/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج من الإدارة</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar for Department Features */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar shadow-lg">
        <button
          id="subtab-dept-form"
          onClick={() => setActiveSubTab('form')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'form'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>استمارة ومطابقة الموقع</span>
        </button>

        <button
          id="subtab-dept-tasks"
          onClick={() => setActiveSubTab('tasks')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'tasks'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>جدولة المهام الدورية</span>
          {notificationsSummary.urgentMilestonesCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
              {notificationsSummary.urgentMilestonesCount} متأخرة
            </span>
          )}
        </button>

        <button
          id="subtab-dept-evaluation"
          onClick={() => setActiveSubTab('evaluation')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'evaluation'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>تقييم أداء الإدارة (KPIs)</span>
        </button>

        <button
          id="subtab-dept-alerts"
          onClick={() => setActiveSubTab('alerts')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'alerts'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>لوحة التنبيهات والإشعارات</span>
          {notificationsSummary.totalUrgentCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
              {notificationsSummary.totalUrgentCount}
            </span>
          )}
        </button>

        <button
          id="subtab-dept-reports"
          onClick={() => setActiveSubTab('reports')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'reports'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>نظام التقارير التلقائي ووضع القراءة</span>
        </button>

        <button
          id="subtab-dept-inspection"
          onClick={() => setIsFieldInspectionOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30"
          title="تنفيذ معاينة ميدانية مخصصة للإدارة مع رفع الملاحظات الفنية والإحداثيات"
        >
          <ClipboardCheck className="w-4 h-4 text-emerald-400" />
          <span>معاينة ميدانية للإدارة</span>
        </button>

        <button
          id="subtab-dept-correspondence"
          onClick={() => setActiveSubTab('correspondence')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'correspondence'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
          title="المراسلات والمخاطبات الرسمية بين الإدارات وإدارة النظام"
        >
          <Mail className="w-4 h-4 text-purple-400" />
          <span>المراسلات والمخاطبات</span>
        </button>

        <button
          id="subtab-dept-logs"
          onClick={() => setActiveSubTab('logs')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'logs'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span>سجل نشاط الإدارة</span>
        </button>
      </div>

      {/* Overdue Milestones & Pending Requests (>48h) Attention Banner */}
      {notificationsSummary.totalUrgentCount > 0 && !isUrgentBannerDismissed && (
        <div
          id="banner-dept-urgent-tasks-alert"
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/50 border-2 border-rose-500/50 shadow-xl shadow-rose-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 text-rose-400 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  تنبيه المهام والطلبات العاجلة (&gt; 48 ساعة دون تحديث)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-black">
                  {notificationsSummary.totalUrgentCount} إجراء عاجل مطلوب
                </span>
                {notificationsSummary.urgentPendingRequestsCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                    {notificationsSummary.urgentPendingRequestsCount} طلبات تعديل استمارة معلقة
                  </span>
                )}
                {notificationsSummary.urgentMilestonesCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                    {notificationsSummary.urgentMilestonesCount} مراحل تنفيذية للمحطات
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                يوجد بنود تجاوزت 48 ساعة دون اعتماد من مدير النظام أو محطات لم يتم تسجيل تقريرها الميداني اليومي. يمكنك مراجعة التفاصيل وتحديث الموقف فورياً.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <button
              id="btn-open-urgent-tasks-modal-banner"
              onClick={() => setIsTaskNotificationsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>عرض التفاصيل واتخاذ الإجراء</span>
            </button>
            <button
              id="btn-dismiss-urgent-tasks-banner"
              onClick={() => setIsUrgentBannerDismissed(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="إخفاء التنبيه مؤقتاً"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Expandable Department Activity Logs Section */}
      {showActivityLogs && (
        <div className="bg-slate-900/95 border border-sky-500/40 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-bold text-white">
                سجل نشاط وتكليفات الإدارة الموثق باليوم والتاريخ
              </h3>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 font-mono">
              {department}
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pt-1">
            {loadActivityLogs().filter(log => log.department === department).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">لا توجد سجلات مسجلة لهذه الإدارة بعد.</p>
            ) : (
              loadActivityLogs()
                .filter(log => log.department === department)
                .map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{item.title}</span>
                        {item.recipientName && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            المستلم: {item.recipientName}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {item.actorName}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{item.details}</p>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px] shrink-0 font-mono">
                      <span>{item.dateStr}</span>
                      <span className="text-amber-400">{item.timeStr}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* Subtab View 1: Site Selector and Form */}
      {activeSubTab === 'form' && (
        <>
          {/* Site Selector */}
          {sessions.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-200">
                  المحطة أو الموقع الميداني محل الفحص:
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={activeSession?.id || sessions[0]?.id}
                  onChange={(e) => {
                    const found = sessions.find(s => s.id === e.target.value);
                    if (found) onSelectSession(found);
                  }}
                  className="w-full sm:w-auto bg-slate-800 border border-slate-700 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.title} ({s.locationName}، {s.governorate})
                    </option>
                  ))}
                </select>

                {activeSession?.autoLocationResolved && (
                  <span className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-[10px] bg-emerald-500/10 text-emerald-300 rounded border border-emerald-500/30">
                    <Sparkles className="w-3 text-emerald-400" />
                    موقع مؤكد أوتوماتيكياً
                  </span>
                )}
              </div>
            </div>
          )}

      {/* ========================================================================= */}
      {/* DEPARTMENT-SPECIFIC DEDICATED WORKSPACES ("ضع في كل صفحة إدارة ما يخصها") */}
      {/* ========================================================================= */}

      {/* 1. MARKETING DEPARTMENT DEDICATED WORKSPACE */}
      {department === 'marketing' && activeSession && (
        <MarketingDedicatedSessionsManager
          session={activeSession}
          onUpdateSession={(updated) => {
            onSelectSession(updated);
          }}
          onOpenDispatcherModal={() => setIsMarketingModalOpen(true)}
          onOpenDedicatedCamera={() => setIsDedicatedCameraOpen(true)}
          onOpenLandownerApplications={onOpenLandownerApplications}
        />
      )}

      {/* 2. PROJECTS DEPARTMENT DEDICATED WORKSPACE (المشروعات والرفع المساحي والخرائط) */}
      {department === 'projects' && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">
                    منظومة الرفع المساحي والخرائط الهندسية ومناسيب الموقع
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                    خاص بإدارة المشروعات
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  أبعاد الأرض، المخطط الهندسي العام (Layout Plan)، فحص التربة، القواعد الخرسانية، والشوارع ومحاور الدخول والخروج
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDedicatedCameraOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>كاميرا الرفع المساحي والخرائط</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVideoArchiveOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-bold border border-blue-500/30 transition-all cursor-pointer"
              >
                <Film className="w-4 h-4 text-blue-400" />
                <span>خزينة وسجل فيديوهات الرفع المساحي</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">أبعاد الأرض المرفوعة</span>
              <span className="text-sm font-bold text-white font-mono">40 م × 35 م</span>
              <span className="text-[10px] text-blue-400 block mt-0.5">إجمالي المساحة: 1,400 م²</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">مناسيب الموقع والتربة</span>
              <span className="text-sm font-bold text-emerald-400">منسوب متوازن (+0.45م)</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">جهد التربة: 2.1 كجم/سم²</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">القواعد الخرسانية للضاغط</span>
              <span className="text-sm font-bold text-amber-300">مسلحة معزولة للاهتزاز</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">سمك 60 سم + وسائد امتصاص</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">عروض الشوارع والمحاور</span>
              <span className="text-sm font-bold text-white">شارع رئيسي 30 م + مدخل 12 م</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">حارات تباطؤ وتسارع معتمدة</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. OPERATIONS & MAINTENANCE DEPARTMENT DEDICATED WORKSPACE (المعدات والآلات والضواغط) */}
      {department === 'operations' && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">
                    سجل رصد وتوزيع المعدات والآلات والضواغط والموزعات
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                    خاص بإدارة التشغيل والصيانة
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  رصد ومطابقة ضاغط الغاز الرئيسي (250 بار)، موزعات التموين، بنوك الأسطوانات، وحدة التجفيف، وسجل الصيانة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDedicatedCameraOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30 cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>كاميرا رصد ومواصفات المعدات</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVideoArchiveOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
              >
                <Film className="w-4 h-4 text-amber-400" />
                <span>خزينة وسجل فيديوهات المعدات</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">الضاغط الموصى به والمطابق</span>
              <span className="text-sm font-bold text-amber-300 font-mono">1,500 Nm³/h</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">ضغط التشغيل: 250 Bar</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">موزعات التموين (Dispensers)</span>
              <span className="text-sm font-bold text-white">3 موزعات مزدوجة</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">6 خراطيم تموين متزامنة</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">بنوك التخزين (Cascades)</span>
              <span className="text-sm font-bold text-white">ثلاثية المستويات</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">سعة 3,000 لتر مائي</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">وحدة التجفيف واللوحة (MCC)</span>
              <span className="text-sm font-bold text-emerald-400">ثنائية البرج + PLC</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">ربط ومراقبة SCADA فورية</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. HSE & INDUSTRIAL SAFETY DEPARTMENT DEDICATED WORKSPACE (السلامة والأمن الصناعي والصحة المهنية) */}
      {department === 'hse' && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">
                    منظومة رصد السلامة والصحة المهنية والأمن الصناعي أثناء التنفيذ
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                    خاص بإدارة السلامة والأمن الصناعي
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  مطابقة مسافات الأمان NFPA 52، كواشف الغاز واللهب، محابس الطوارئ ESD، ومعدات الإطفاء ومسارات الإخلاء
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDedicatedCameraOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>كاميرا رصد السلامة والأمن الصناعي</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVideoArchiveOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold border border-rose-500/30 transition-all cursor-pointer"
              >
                <Film className="w-4 h-4 text-rose-400" />
                <span>خزينة وسجل فيديوهات السلامة</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">مسافات الأمان كود NFPA 52</span>
              <span className="text-sm font-bold text-emerald-400">مستوفاة بالكامل 100%</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">ارتداد ≥ 7.5 م عن الحدود</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">كواشف الغاز واللهب</span>
              <span className="text-sm font-bold text-white">4 كواشف IR + 2 UV/IR</span>
              <span className="text-[10px] text-rose-400 block mt-0.5">معايرة أوتوماتيكية للإنذار</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">صمامات الإغلاق السريع (ESD)</span>
              <span className="text-sm font-bold text-amber-300">3 محابس طوارئ يدوية/هوائية</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">زمن إغلاق &lt; 2 ثانية</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">شبكة الإطفاء ومسارات الهروب</span>
              <span className="text-sm font-bold text-white">مدافع بودرة 250 كجم + CO2</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">مخارج إخلاء ثنائية واضحة</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. TECHNICAL AFFAIRS DEPARTMENT DEDICATED WORKSPACE (الإدارة الفنية وشبكة الغاز) */}
      {department === 'technical' && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">
                    منظومة فحص شبكة الغاز الطبيعي ومحطة القياس والتخفيض (PRS)
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                    خاص بالإدارة الفنية
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  خط الغاز الطبيعي المغذي، نقطة الربط (Tie-in)، ضغط الشبكة، ومنظومة القياس والفلترة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDedicatedCameraOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/30 cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>كاميرا فحص شبكة الغاز والربط</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVideoArchiveOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer"
              >
                <Film className="w-4 h-4 text-cyan-400" />
                <span>خزينة وسجل فيديوهات الشبكة</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">ضغط خط الغاز المغذي</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">16 - 25 Bar</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">ضغط ممتاز ومستقر</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">مسافة نقطة الربط</span>
              <span className="text-sm font-bold text-white font-mono">120 متراً فقط</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">قطر خط الربط: 6 بوصة</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">محطة التخفيض والقياس</span>
              <span className="text-sm font-bold text-white">PRS 2,500 Nm³/h</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">مزدوجة الخطوط (Duty/Standby)</span>
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">اختبارات ضغط النيتروجين</span>
              <span className="text-sm font-bold text-emerald-400">معتمدة ومطابقة</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">شهادة فحص هيدروستاتيكي جاهزة</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. LICENSING DEPARTMENT DEDICATED WORKSPACE (إدارة التراخيص والموافقات) */}
      {department === 'licensing' && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">
                    سجل التراخيص والموافقات السيادية والمحلية
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    خاص بإدارة التراخيص
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  موافقات الحماية المدنية، جهاز شؤون البيئة، التنمية المحلية، وبيان الصلاحية
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDedicatedCameraOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>كاميرا توثيق الموقع والحدود</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">موافقة الحماية المدنية</span>
              <span className="text-sm font-bold text-emerald-400">سارية ومعتمدة</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">مطابقة تقرير المعاينة</span>
            </div>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">تقييم الأثر البيئي (EIA)</span>
              <span className="text-sm font-bold text-white">تصنيف (ب) معتمد</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">جهاز شؤون البيئة</span>
            </div>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">بيان الصلاحية والاشتراطات</span>
              <span className="text-sm font-bold text-white">داخل الحيز المعتمد</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">الوحدة المحلية / مجلس المدينة</span>
            </div>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">موافقة هيئة الطرق والكباري</span>
              <span className="text-sm font-bold text-cyan-400">تصريح ربط ومداخل ومخارج</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">ساري لمدة عام للتنفيذ</span>
            </div>
          </div>
        </div>
      )}

      {/* 7. LEGAL AFFAIRS DEPARTMENT DEDICATED WORKSPACE (الإدارة القانونية) */}
      {department === 'legal' && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">
                    سجل العقود وسندات الملكية والتوثيق القانوني
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                    خاص بالإدارة القانونية
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  سند ملكية الأرض، عقد الإيجار طويل الأجل / الشراكة، وتوثيق الشهر العقاري
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDedicatedCameraOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>كاميرا توثيق حدود الموقع</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">سند الملكية وحالة الأرض</span>
              <span className="text-sm font-bold text-emerald-400">عقد مسجل شهر عقاري</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">خالٍ من أي نزاعات قضائية</span>
            </div>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">نوع التعاقد المقترح</span>
              <span className="text-sm font-bold text-white">إيجار طويل الأجل 25 سنة</span>
              <span className="text-[10px] text-indigo-400 block mt-0.5">مع حق تجديد تلقائي 10 سنوات</span>
            </div>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">حق المرور وحرم خط الغاز</span>
              <span className="text-sm font-bold text-white">حرم قانوني مستوفى</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">تصريح حفر رسمي معتمد</span>
            </div>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">الرأي القانوني النهائي</span>
              <span className="text-sm font-bold text-emerald-400">صالح قانونياً للتعاقد</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">مسودة العقد جاهزة للتوقيع</span>
            </div>
          </div>
        </div>
      )}

      {/* 8. FINANCIAL DEPARTMENT DEDICATED WORKSPACE (الإدارة المالية) */}
      {department === 'financial' && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-950 border border-teal-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <BadgeDollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">
                    دراسة الجدوى المالية والتكاليف الاستثمارية ومعدل الاسترداد
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                    خاص بالإدارة المالية
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  التكاليف الرأسمالية (CAPEX)، التكاليف التشغيلية (OPEX)، معدل العائد الداخلي (IRR)، وتوقعات الإيرادات
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDedicatedCameraOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>كاميرا معاينة الموقع مالياً</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">التكلفة الاستثمارية التقديرية (CAPEX)</span>
              <span className="text-sm font-bold text-white font-mono">22.5 مليون ج.م</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">شاملة الضاغط والموزعات والمحطة</span>
            </div>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">معدل العائد الداخلي المتوقع (IRR)</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">28.5%</span>
              <span className="text-[10px] text-emerald-300 block mt-0.5">يتجاوز المستهدف الاستثماري (20%)</span>
            </div>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">فترة استرداد رأس المال (Payback)</span>
              <span className="text-sm font-bold text-amber-300 font-mono">3.2 سنوات</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">أداء مالي فائق الجدوى</span>
            </div>
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">صافي القيمة الحالية (NPV)</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">+ 18.2 مليون ج.م</span>
              <span className="text-[10px] text-cyan-400 block mt-0.5">جدوى اقتصادية ممتازة وموصى بالتنفيذ</span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Form Custom Fields (Controlled by Admin) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>استمارة وبيانات {meta.title}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-mono">
                {deptCustomFields.length} حقول معتمدة
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              الحقول المخصصة والمعتمدة مركزياً من مدير النظام لهذا القسم
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveData}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </div>

        {isSavedNotice && (
          <div className="p-3 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ وتحديث بيانات الإدارة في ملف المحطة المركزي بنجاح.</span>
          </div>
        )}

        <div className="p-6 space-y-5">
          {deptCustomFields.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl space-y-2">
              <p>لا توجد حقول نشطة حالياً لهذه الإدارة.</p>
              <p className="text-slate-500">يمكن لمدير النظام إضافة وتخصيص حقول جديدة من لوحة التحكم المركزية.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {deptCustomFields.map((field) => {
                const currentVal = fieldValues[field.key] ?? field.defaultValue ?? '';

                return (
                  <div key={field.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                        <span>{field.label}</span>
                        {field.required && <span className="text-rose-400 font-bold">*</span>}
                      </label>
                      {field.section && (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {field.section}
                        </span>
                      )}
                    </div>

                    {field.description && (
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {field.description}
                      </p>
                    )}

                    {/* Field Input render based on type */}
                    {field.type === 'select' && field.options ? (
                      <select
                        value={currentVal}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                      >
                        {field.options.map((opt, oIdx) => (
                          <option key={oIdx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'number' ? (
                      <input
                        type="number"
                        value={currentVal}
                        onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    ) : field.type === 'boolean' ? (
                      <div className="flex items-center gap-4 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                          <input
                            type="radio"
                            name={field.key}
                            checked={currentVal === true}
                            onChange={() => handleFieldChange(field.key, true)}
                            className="text-emerald-500 focus:ring-0"
                          />
                          <span>نعم / متوافق ومجهز</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                          <input
                            type="radio"
                            name={field.key}
                            checked={currentVal === false}
                            onChange={() => handleFieldChange(field.key, false)}
                            className="text-rose-500 focus:ring-0"
                          />
                          <span>لا / غير متوافق أو مطلوب</span>
                        </label>
                      </div>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={currentVal}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Form Protection Banner */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                هذا النموذج معتمد رسمياً ومحمي. لتعديل أو إضافة متطلبات تخصصية، يمكنك رفع طلب تحديث الحقول.
              </span>
            </div>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold underline shrink-0 cursor-pointer"
            >
              طلب تحديث الحقول
            </button>
          </div>
        </div>
      </div>
    </>
  )}

  {/* Subtab View 2: Periodic Tasks Scheduler */}
  {activeSubTab === 'tasks' && (
    <div className="space-y-4">
      <DepartmentPeriodicTasksScheduler department={department} />
    </div>
  )}

  {/* Subtab View 3: Performance Evaluation and KPIs */}
  {activeSubTab === 'evaluation' && (
    <div className="space-y-4">
      <DepartmentPerformanceEvaluation 
        department={department} 
        onExit={() => setActiveSubTab('form')} 
      />
    </div>
  )}

  {/* Subtab View 4: Department Alerts Center */}
  {activeSubTab === 'alerts' && (
    <div className="space-y-4">
      <DepartmentAlertsCenter 
        department={department}
        onNavigateSubTab={(tab) => setActiveSubTab(tab as any)}
      />
    </div>
  )}

  {/* Subtab View 5: Automated Reporting Engine & Reader Mode */}
  {activeSubTab === 'reports' && (
    <div className="space-y-4">
      <AutomatedReportingEngine 
        department={department}
        sessions={sessions}
        onExit={() => setActiveSubTab('form')}
      />
    </div>
  )}

  {/* Subtab View 6: Department Activity Audit Log */}
  {activeSubTab === 'logs' && (
    <div className="space-y-4">
      <DepartmentActivityAuditLog 
        department={department}
        onExit={() => setActiveSubTab('form')}
      />
    </div>
  )}

  {/* Subtab View 7: Department Correspondence & Inter-Department Messaging */}
  {activeSubTab === 'correspondence' && (
    <div className="space-y-4">
      <DepartmentCorrespondenceManager 
        currentDepartment={department}
        currentUserRole={department}
        currentUserName={meta.title}
      />
    </div>
  )}

      {/* Department Dedicated Field Inspection Modal */}
      {isFieldInspectionOpen && (
        <DepartmentFieldInspectionModal
          isOpen={isFieldInspectionOpen}
          department={department}
          activeSession={activeSession}
          sessions={sessions}
          onClose={() => setIsFieldInspectionOpen(false)}
          onSaveInspection={() => {
            setIsFieldInspectionOpen(false);
          }}
        />
      )}

      {/* Interactive User Guide Modal */}
      {isUserGuideOpen && (
        <InteractiveUserGuideModal
          currentDepartment={department}
          onClose={() => setIsUserGuideOpen(false)}
          onNavigateSubTab={(tab) => setActiveSubTab(tab as any)}
        />
      )}

      {/* Request Form Change Modal */}
      <RequestFormChangeModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        department={department}
        onSubmitRequest={onSubmitFormChangeRequest}
      />

      {/* Marketing Survey Dispatcher Modal */}
      <MarketingSurveyDispatcherModal
        isOpen={isMarketingModalOpen}
        onClose={() => setIsMarketingModalOpen(false)}
      />

      {/* General Manager to Team Members WhatsApp Invite Modal */}
      <DepartmentTeamInviteModal
        isOpen={isTeamInviteModalOpen}
        onClose={() => setIsTeamInviteModalOpen(false)}
        department={department}
      />

      {/* Department Dedicated Field Camera Modal */}
      <DepartmentDedicatedCameraModal
        isOpen={isDedicatedCameraOpen}
        onClose={() => setIsDedicatedCameraOpen(false)}
        department={department}
        activeSession={activeSession}
      />

      {/* Video & Camera Recordings Archive Modal */}
      <VideoArchiveModal
        isOpen={isVideoArchiveOpen}
        onClose={() => setIsVideoArchiveOpen(false)}
        defaultDepartmentFilter={department}
      />

      {/* Department Task Notifications & Overdue Milestones Modal */}
      <DepartmentTaskNotificationsModal
        isOpen={isTaskNotificationsModalOpen}
        onClose={() => setIsTaskNotificationsModalOpen(false)}
        department={department}
        summary={notificationsSummary}
        sessions={sessions}
        onUpdateSession={onUpdateSession}
        onOpenFormChangeModal={() => {
          setIsTaskNotificationsModalOpen(false);
          setIsRequestModalOpen(true);
        }}
        onNavigateToTasksTab={() => {
          setIsTaskNotificationsModalOpen(false);
          setActiveSubTab('tasks');
        }}
      />

    </div>
  );
};
