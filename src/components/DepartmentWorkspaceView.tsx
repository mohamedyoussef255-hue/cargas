import React, { useState, useMemo, useEffect } from 'react';
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
  Download, 
  LayoutGrid, 
  TrendingUp, 
  Compass, 
  ArrowRight,
  ChevronLeft,
  X 
} from 'lucide-react';
import { 
  DepartmentRole, 
  MonitoringSession, 
  CustomFormField, 
  FormChangeRequest, 
  CNGStation 
} from '../types';
import { DEPARTMENTS_METADATA, INITIAL_FORM_CHANGE_REQUESTS } from '../data/departmentCustomFields';
import { MarketingStationOperationsWorkflow } from './MarketingStationOperationsWorkflow';
import { DevelopmentEfficiencyModal } from './DevelopmentEfficiencyModal';
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
import { InAppNotificationCenterModal } from './InAppNotificationCenterModal';
import { getUnreadNotificationsCount } from '../utils/inAppMessagingService';

export type DepartmentViewPage = 
  | 'directory'            // فهرس وبوابة صفحات الإدارة
  | 'form'                 // صفحة استمارة ومطابقة الموقع والاشتراطات الفنية
  | 'correspondence'       // صفحة المراسلات والمخاطبات الرسمية واستعجال PDF
  | 'camera'               // صفحة كاميرا الرصد الميداني والتوثيق الرقمي
  | 'kpis'                 // صفحة تقييم أداء الإدارة ومؤشرات الإنجاز
  | 'tasks'                // صفحة جدولة المهام والمتابعة الدورية
  | 'alerts'               // صفحة التنبيهات والمهام العاجلة (>48 ساعة)
  | 'reports'              // صفحة إعداد وطباعة التقارير الرسمية المؤتمتة
  | 'videos'               // صفحة مخزن وفيديوهات الرصد الميدانية الموثقة
  | 'logs'                 // صفحة سجل نشاط وتكليفات الإدارة الموثق
  | 'inspection'           // صفحة المعاينة الميدانية التخصصية للإدارة
  | 'guide'                // صفحة دليل الاستخدام التفاعلي لمنظومة كارجاس
  | 'marketing_hub'        // صفحة منظومة تسويق المحطات ورادار الحركة (Marketing)
  | 'landowners';          // صفحة طلبات معاينة ملاك الأراضي والمحطات (Marketing)

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
  stations?: CNGStation[];
  onNavigateToCamera?: () => void;
  onNavigateToMap?: () => void;
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
  changeRequests,
  stations = [],
  onNavigateToCamera,
  onNavigateToMap
}) => {
  const meta = DEPARTMENTS_METADATA[department] || {
    title: `إدارة ${department}`,
    badge: 'إدارة تخصصية',
    subtitle: 'بيئة عمل الإدارة المستقلة',
    themeColor: 'emerald'
  };

  const isMarketing = department === 'marketing';

  // Primary Dedicated Page Navigation State:
  // Default to 'directory' so the user sees clear, spacious Page Cards rather than cramped icons side-by-side!
  const [activePage, setActivePage] = useState<DepartmentViewPage>('directory');

  // Backup snapshot download notice
  const [backupNotice, setBackupNotice] = useState<string | null>(null);
  const [isDevEfficiencyOpen, setIsDevEfficiencyOpen] = useState<boolean>(false);

  // Export Complete System Snapshot JSON
  const handleExportBackupSnapshot = () => {
    try {
      const snapshot = {
        title: "CARGAS NGV - النسخة الاحتياطية الكاملة للمنظومة",
        exportTimestamp: new Date().toISOString(),
        currentDepartment: department,
        sessionsCount: sessions.length,
        sessions,
        customFields,
        activeSessionId: activeSession?.id,
        savedDataStorage: {
          sessions: localStorage.getItem('cng_monitoring_sessions_v1'),
          stations: localStorage.getItem('cng_stations_v1'),
          correspondence: localStorage.getItem('cng_department_correspondence_v1'),
          changeRequests: localStorage.getItem('cng_form_change_requests_v1'),
          activityLogs: localStorage.getItem('cng_activity_logs_v1'),
        }
      };

      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cargas_system_snapshot_${new Date().toISOString().split('T')[0]}_${department}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBackupNotice('تم حفظ وتصدير لقطة المنظومة الاحتياطية بنجاح بصيغة JSON!');
      setTimeout(() => setBackupNotice(null), 3500);
    } catch (e) {
      console.error("Backup export failed", e);
      alert("حدث خطأ أثناء تصدير النسخة الاحتياطية.");
    }
  };

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
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);
  const [isFieldInspectionOpen, setIsFieldInspectionOpen] = useState<boolean>(false);
  const [isInAppNotifOpen, setIsInAppNotifOpen] = useState<boolean>(false);
  const [unreadInAppCount, setUnreadInAppCount] = useState<number>(() => getUnreadNotificationsCount(department));

  useEffect(() => {
    const handleUpdate = () => {
      setUnreadInAppCount(getUnreadNotificationsCount(department));
    };
    window.addEventListener('cng_notifications_updated', handleUpdate);
    window.addEventListener('cng_new_inapp_message', handleUpdate);
    return () => {
      window.removeEventListener('cng_notifications_updated', handleUpdate);
      window.removeEventListener('cng_new_inapp_message', handleUpdate);
    };
  }, [department]);

  // Form field values stored locally or loaded from session
  const [fieldValues, setFieldValues] = useState<Record<string, any>>(() => {
    return activeSession?.customFieldValues?.[department] || {};
  });

  // Department-specific custom fields (visible only)
  const deptCustomFields = customFields.filter(f => f.department === department && f.visible);

  const handleFieldChange = (key: string, value: any) => {
    const updated = { ...fieldValues, [key]: value };
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

  // Helper for Department Icon
  const renderDepartmentIcon = (className = "w-6 h-6") => {
    switch (department) {
      case 'operations': return <Wrench className={`${className} text-amber-400`} />;
      case 'marketing': return <Share2 className={`${className} text-indigo-400`} />;
      case 'projects': return <Building2 className={`${className} text-blue-400`} />;
      case 'hse': return <Flame className={`${className} text-emerald-400`} />;
      case 'technical': return <Cpu className={`${className} text-cyan-400`} />;
      case 'licensing': return <FileCheck className={`${className} text-orange-400`} />;
      case 'legal': return <Scale className={`${className} text-purple-400`} />;
      case 'financial': return <BadgeDollarSign className={`${className} text-teal-400`} />;
      default: return <FileText className={`${className} text-slate-400`} />;
    }
  };

  // Helper metadata for current active page
  const getPageInfo = (page: DepartmentViewPage): { title: string; subtitle: string; icon: React.ReactNode } => {
    switch (page) {
      case 'form':
        return {
          title: 'صفحة استمارة ومطابقة الموقع والاشتراطات الفنية',
          subtitle: 'فحص بنود الموقع، المواصفات المعتمدة، والتسجيل الميداني الفوري',
          icon: <FileText className="w-5 h-5 text-blue-400" />
        };
      case 'correspondence':
        return {
          title: 'صفحة المراسلات والمخاطبات الرسمية واستعجال PDF',
          subtitle: 'إرسال واستقبال الخطابات المعتمدة وتوجيه خطابات الاستعجال والتنبيهات',
          icon: <Mail className="w-5 h-5 text-purple-400" />
        };
      case 'camera':
        return {
          title: 'صفحة كاميرا الرصد الميداني والتوثيق الرقمي',
          subtitle: 'التقاط صور الموقع والمعدات مع توثيق الإحداثيات والختم المعتمد',
          icon: <Camera className="w-5 h-5 text-emerald-400" />
        };
      case 'kpis':
        return {
          title: 'صفحة تقييم أداء الإدارة ومؤشرات الإنجاز (KPIs)',
          subtitle: 'تحليل دقيق لنسب الامتثال وسرعة الرد وجودة المخرجات الفنية',
          icon: <Award className="w-5 h-5 text-amber-400" />
        };
      case 'tasks':
        return {
          title: 'صفحة جدولة المهام والمتابعة الدورية للمحطات',
          subtitle: 'تتبع مراحل التنفيذ، تواريخ الزيارات الميدانية، وتحديث التقارير',
          icon: <Calendar className="w-5 h-5 text-emerald-400" />
        };
      case 'alerts':
        return {
          title: 'صفحة التنبيهات والمهام العاجلة (> 48 ساعة)',
          subtitle: 'متابعة البنود والمحطات المتأخرة والطلبات المعلقة للبت الفوري',
          icon: <AlertTriangle className="w-5 h-5 text-rose-400" />
        };
      case 'reports':
        return {
          title: 'صفحة إعداد وطباعة التقارير الرسمية المؤتمتة',
          subtitle: 'توليد وطباعة التقارير الفنية التنفيذية بوضع القراءة المريح',
          icon: <Sparkles className="w-5 h-5 text-sky-400" />
        };
      case 'videos':
        return {
          title: 'صفحة مخزن وفيديوهات الرصد الميدانية الموثقة',
          subtitle: 'أرشيف تسجيلات الفيديو الميدانية للمواقع والمعدات بجودة عالية',
          icon: <Film className="w-5 h-5 text-amber-400" />
        };
      case 'logs':
        return {
          title: 'صفحة سجل نشاط وتكليفات الإدارة الموثق',
          subtitle: 'السجل الزمني المعتمد لجميع العمليات والقرارات والمخاطبات',
          icon: <History className="w-5 h-5 text-cyan-400" />
        };
      case 'inspection':
        return {
          title: 'صفحة المعاينة الميدانية التخصصية للإدارة',
          subtitle: 'إجراء فحص ميداني متكامل مع توثيق نقاط الجاهزية والاعتماد',
          icon: <ClipboardCheck className="w-5 h-5 text-emerald-400" />
        };
      case 'guide':
        return {
          title: 'صفحة دليل الاستخدام التفاعلي لمنظومة كارجاس',
          subtitle: 'الشرح العملي لإجراءات النظام ومهام الإدارات خطوة بخطوة',
          icon: <BookOpen className="w-5 h-5 text-blue-400" />
        };
      case 'marketing_hub':
        return {
          title: 'صفحة منظومة تسويق المحطات ورادار الحركة',
          subtitle: 'رادار المركبات، دراسة الجدوى، استهداف السائقين، والخطابات المعتمدة',
          icon: <Sparkles className="w-5 h-5 text-emerald-400" />
        };
      case 'landowners':
        return {
          title: 'صفحة طلبات معاينة ملاك الأراضي والمحطات',
          subtitle: 'استقبال ومراجعة استمارات الملاك وتوزيع روابط المعاينة عبر الواتساب',
          icon: <FileCheck className="w-5 h-5 text-teal-400" />
        };
      default:
        return {
          title: 'فهرس وبوابة صفحات الإدارة',
          subtitle: 'اختر الصفحة المطلوبة لفتحها بالكامل في بيئة عمل مستقلة',
          icon: <LayoutGrid className="w-5 h-5 text-slate-400" />
        };
    }
  };

  const activePageInfo = getPageInfo(activePage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. TOP DEPARTMENT IDENTITY & MASTER BAR (دائماً في أعلى واجهة الإدارة) */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow">
            {renderDepartmentIcon("w-6 h-6")}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-white">
                {meta.title}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {meta.badge}
              </span>
              <span className="hidden sm:inline-block text-[11px] px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                بيئة عمل تخصصية مستقلة
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {/* Global Executive Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          
          {/* Quick Active Station Selector */}
          {sessions.length > 0 && (
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={activeSession?.id || sessions[0]?.id}
                onChange={(e) => {
                  const found = sessions.find(s => s.id === e.target.value);
                  if (found) onSelectSession(found);
                }}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer max-w-[180px] sm:max-w-[220px] truncate"
              >
                {sessions.map(s => (
                  <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                    {s.code} - {s.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Backup Snapshot Export (حفظ النسخة الحالية) */}
          <button
            id="btn-dept-backup-snapshot"
            onClick={handleExportBackupSnapshot}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow cursor-pointer"
            title="حفظ وتصدير نسخة احتياطية من المنظومة وسجلاتها (JSON Snapshot)"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">حفظ النسخة الحالية</span>
          </button>

          {/* In-App Messaging & Ringtone Notifications */}
          <button
            id="btn-dept-inapp-notifications"
            onClick={() => setIsInAppNotifOpen(true)}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer ${
              unreadInAppCount > 0
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400 shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="فتح منظومة الإرسال الداخلي والإشعارات والرنين"
          >
            <Bell className={`w-3.5 h-3.5 ${unreadInAppCount > 0 ? 'text-amber-300 animate-bounce' : 'text-slate-400'}`} />
            <span>الرسائل والرنين</span>
            {unreadInAppCount > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-rose-500 text-white font-black text-[10px] border border-white/20">
                {unreadInAppCount}
              </span>
            )}
          </button>

          {/* Urgent Tasks Badge */}
          <button
            id="btn-dept-urgent-task-badge"
            onClick={() => setActivePage('alerts')}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer ${
              notificationsSummary.totalUrgentCount > 0
                ? 'bg-rose-600/90 hover:bg-rose-500 text-white border border-rose-400 shadow-rose-600/30 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
            title="فتح صفحة التنبيهات والمهام العاجلة"
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${notificationsSummary.totalUrgentCount > 0 ? 'text-amber-200' : 'text-slate-400'}`} />
            <span>تنبيهات عاجلة</span>
            <span className="flex items-center justify-center min-w-[20px] h-[20px] px-1 rounded-full bg-black/40 text-white font-black text-[10px] border border-white/20">
              {notificationsSummary.totalUrgentCount}
            </span>
          </button>

          {/* Switch Department / Logout */}
          <button
            onClick={onSwitchDepartment}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 text-rose-200 text-xs font-bold border border-rose-500/40 transition-colors cursor-pointer"
            title="تسجيل الخروج من الإدارة أو التبديل"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Backup Notification Toast */}
      {backupNotice && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl flex items-center justify-between gap-2 shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">{backupNotice}</span>
          </div>
          <button onClick={() => setBackupNotice(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DEDICATED PAGE NAVIGATION HEADER (عندما تكون داخل صفحة محددة) */}
      {/* ========================================================================= */}
      {activePage !== 'directory' && (
        <div className="p-4 bg-slate-900/95 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            {/* Prominent Return to Directory Button */}
            <button
              onClick={() => setActivePage('directory')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/30 cursor-pointer group shrink-0"
              title="الرجوع إلى فهرس صفحات الإدارة"
            >
              <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>فهرس صفحات الإدارة</span>
            </button>

            <div className="h-7 w-px bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                {activePageInfo.icon}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  {activePageInfo.title}
                </h2>
                <p className="text-[11px] text-slate-400">{activePageInfo.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Quick Page Switcher Dropdown (للتنقل المباشر دون إجبار على العودة للفهرس) */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-400 hidden lg:inline">الانتقال السريع لصفحة:</span>
            <select
              value={activePage}
              onChange={(e) => setActivePage(e.target.value as DepartmentViewPage)}
              className="w-full md:w-auto bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="directory">📋 فهرس كافة صفحات الإدارة</option>
              <option value="form">📄 صفحة استمارة ومطابقة الموقع</option>
              <option value="correspondence">✉️ صفحة المراسلات والمخاطبات الرسمية</option>
              <option value="camera">📷 صفحة كاميرا الرصد الميداني والتوثيق</option>
              <option value="kpis">📊 صفحة تقييم الأداء والمؤشرات (KPIs)</option>
              <option value="tasks">📅 صفحة جدولة المهام والمتابعة الدورية</option>
              <option value="alerts">🚨 صفحة التنبيهات والمهام العاجلة</option>
              <option value="reports">📑 صفحة إعداد وطباعة التقارير الرسمية</option>
              <option value="videos">🎬 صفحة مخزن الفيديوهات الميدانية</option>
              <option value="logs">📜 صفحة سجل نشاط وتكليفات الإدارة</option>
              <option value="inspection">🔍 صفحة المعاينة الميدانية للإدارة</option>
              <option value="guide">📖 صفحة دليل الاستخدام التفاعلي</option>
              {isMarketing && <option value="marketing_hub">🌐 صفحة منظومة تسويق المحطات ورادار الحركة</option>}
              {isMarketing && <option value="landowners">📋 صفحة طلبات معاينة ملاك الأراضي</option>}
            </select>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PAGE VIEW: THE MASTER DIRECTORY (فهرس صفحات وأقسام الإدارة المستقلة) */}
      {/*    بدلاً من صف الأيقونات المتراصة جنباً إلى جنب وتكديس البيانات تحت بعضها */}
      {/* ========================================================================= */}
      {activePage === 'directory' && (
        <div className="space-y-6">
          
          {/* Urgent Attention Alert Banner (if pending items >48h) */}
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
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    يوجد بنود أو مراحل تجاوزت 48 ساعة دون اعتماد أو تقارير ميدانية متأخرة. اضغط لفتح صفحة التنبيهات العاجلة فوراً.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => setActivePage('alerts')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>فتح صفحة التنبيهات واتخاذ الإجراء</span>
                </button>
                <button
                  onClick={() => setIsUrgentBannerDismissed(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="إخفاء التنبيه مؤقتاً"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Directory Section Header */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-emerald-400" />
                  <span>صفحات وأقسام {meta.title} المستقلة</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  تم تهيئة كل ميزة كصفحة مستقلة بذاتها لضمان أقصى درجات التركيز والسرعة، دون تكديس الأيقونات أو البيانات فوق بعضها.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTeamInviteModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all cursor-pointer"
                  title="دعوة أعضاء فريق الإدارة برابط واتساب مباشر"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>دعوة فريق الإدارة</span>
                </button>
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 transition-all cursor-pointer"
                  title="رفع طلب تعديل أو إضافة حقول في النموذج المعتمد"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>طلب تحديث الحقول</span>
                </button>
              </div>
            </div>
          </div>

          {/* The Spacious Pages Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">

            {/* Page 1: Form & Specifications */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-blue-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[11px] font-bold border border-blue-500/20">
                    الاستمارة والمواصفات
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-blue-300 transition-colors">
                    استمارة ومطابقة الموقع
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    فحص الاشتراطات الفنية المعتمدة للإدارة، تسجيل مواصفات المحطة، وإدخال بيانات التقييم الهندسي وحفظها.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('form')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة الاستمارة بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 2: Official Dispatches & Escalations */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-purple-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-[11px] font-bold border border-purple-500/20">
                    مخاطبات واستعجال PDF
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
                    المراسلات والمخاطبات الرسمية
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    إدارة الخطابات الصادرة والواردة، خطابات الاستعجال الرسمية، والتنسيق المباشر مع إدارة التسويق ومدير النظام.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('correspondence')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-purple-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة المراسلات بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 3: Dedicated Field Monitoring Camera */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-emerald-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] font-bold border border-emerald-500/20">
                    توثيق ميداني حي
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                    كاميرا الرصد الميداني التخصصية
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    التقاط صور الموقع، فحص المعدات والأرض، إضافة ملاحظات الجاهزية وتوثيق الإحداثيات الجغرافية المعتمدة.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('camera')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة الكاميرا بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 4: Performance Evaluation & KPIs */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-amber-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-bold border border-amber-500/20">
                    مؤشرات الأداء الحية
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                    تقييم أداء الإدارة ومؤشرات الإنجاز
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    قياس نسب الامتثال والجاهزية، معدل سرعة الاستجابة للمخاطبات، ورادار كفاءة التدقيق الميداني.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('kpis')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-amber-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة مؤشرات الأداء بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 5: Periodic Tasks Scheduler */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-teal-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 text-[11px] font-bold border border-teal-500/20">
                    متابعة دورية
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-teal-300 transition-colors">
                    جدولة المهام والمتابعة الدورية
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    تتبع مراحل التنفيذ، تواريخ الزيارات الميدانية الدورية، وتحديث تقارير الإنجاز اليومية للمحطات.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('tasks')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-teal-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة جدولة المهام بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 6: Urgent Alerts Center (>48h) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-rose-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    notificationsSummary.totalUrgentCount > 0
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {notificationsSummary.totalUrgentCount} إجراء عاجل
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-rose-300 transition-colors">
                    التنبيهات والمهام العاجلة (&gt; 48 ساعة)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    تحديد البنود والمحطات التي تجاوزت المهلة الزمنية، طلبات تعديل الاستمارة المعلقة، وتحديث الموقف فورياً.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('alerts')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة التنبيهات العاجلة بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 7: Automated Reporting Engine */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-sky-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 text-[11px] font-bold border border-sky-500/20">
                    تقارير تنفيذية رسمية
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-sky-300 transition-colors">
                    إعداد وطباعة التقارير المؤتمتة
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    توليد التقارير الميدانية الشاملة مع وضع القراءة المريح وخيارات الطباعة الرسمية المعتمدة.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('reports')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-sky-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة التقارير بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 8: Documented Field Videos Archive */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-amber-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <Film className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[11px] font-bold border border-amber-500/20">
                    أرشيف الوسائط
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                    مخزن وفيديوهات الرصد الموثقة
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    أرشيف التسجيلات المرئية للمواقع والمعدات، استعراض الفيديوهات، والبحث والتنزيل المباشر.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('videos')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-amber-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة مخزن الفيديوهات بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 9: Activity & Assignments Audit Log */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-cyan-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <History className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[11px] font-bold border border-cyan-500/20">
                    تدقيق وسجل موثق
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                    سجل نشاط وتكليفات الإدارة
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    السجل الزمني المعتمد لجميع العمليات والقرارات والمخاطبات الصادرة والواردة للإدارة باليوم والتاريخ.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('logs')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة سجل النشاط بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 10: Department Specialized Field Inspection */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-emerald-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] font-bold border border-emerald-500/20">
                    معاينة تخصصية
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                    المعاينة الميدانية التخصصية
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    إجراء معاينة ميدانية طبقاً لاختصاص الإدارة، رصد الجاهزية الفنية، واستخراج محضر المعاينة المعتمد.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('inspection')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة المعاينة الميدانية بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 11: Interactive User Guide */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg hover:shadow-blue-950/20 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[11px] font-bold border border-blue-500/20">
                    إرشادات النظام
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-blue-300 transition-colors">
                    دليل الاستخدام التفاعلي
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    شرح مفصل ومصور لمهام الإدارات في منظومة كارجاس، دورة حياة المحطة، وطريقة إنجاز المعاينات بدقة.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActivePage('guide')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow"
              >
                <span>فتح صفحة دليل الاستخدام بالكامل</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Page 12 (Marketing Only): Station Marketing Operations & Vehicle Radar */}
            {isMarketing && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-500/40 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                      خاص بالتسويق
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                      منظومة تسويق المحطات ورادار الحركة
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      رادار المركبات والكثافة المرورية، دراسة الجدوى الاستهلاكية، وإدارة استهداف المركبات بالموقع.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePage('marketing_hub')}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer shadow"
                >
                  <span>فتح منظومة التسويق بالكامل</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Page 13 (Marketing Only): Landowner Survey Applications */}
            {isMarketing && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/50 via-slate-900 to-slate-950 border border-teal-500/40 hover:border-teal-400 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/40">
                      طلبات الملاك
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-teal-300 transition-colors">
                      طلبات معاينة ملاك الأراضي والمحطات
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      مراجعة استمارات ملاك الأراضي المتقدمين للشراكة، وتوليد روابط المعاينة التفاعلية وإرسالها بالواتساب.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onOpenLandownerApplications) {
                      onOpenLandownerApplications();
                    } else {
                      setActivePage('landowners');
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black transition-all cursor-pointer shadow"
                >
                  <span>فتح صفحة طلبات الملاك</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Page: In-App Messaging & Audio Notifications */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/40 hover:border-indigo-400 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 group-hover:scale-105 transition-transform">
                    <Bell className="w-6 h-6 text-indigo-300" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/40 flex items-center gap-1">
                    <span>إرسال داخلي ورنين</span>
                    {unreadInAppCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    )}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                    منظومة الإرسال الداخلي والإشعارات الرنانة
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    إرسال واستقبال الرسائل والتكليفات والتنبيهات المباشرة دون مغادرة التطبيق مع صوت رنين مميز وإشعارات متقدمة.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsInAppNotifOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all cursor-pointer shadow"
              >
                <span>فتح صندوق الإرسال الداخلي ({unreadInAppCount} غير مقروء)</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DEDICATED PAGE: FORM & SPECIFICATIONS (استمارة ومطابقة الموقع) */}
      {/* ========================================================================= */}
      {activePage === 'form' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Site Selector Bar */}
          {sessions.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow">
              <div className="flex items-center gap-2.5">
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
                  className="w-full sm:w-auto bg-slate-800 border border-slate-700 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {sessions.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.title} ({s.locationName}، {s.governorate})
                    </option>
                  ))}
                </select>

                {activeSession?.autoLocationResolved && (
                  <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-emerald-500/10 text-emerald-300 rounded-xl border border-emerald-500/30 font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    موقع مؤكد أوتوماتيكياً
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Department-Specific Dedicated Workspaces */}
          {department === 'marketing' && activeSession && (
            <MarketingDedicatedSessionsManager
              session={activeSession}
              onUpdateSession={(updated) => {
                onSelectSession(updated);
              }}
              onOpenDispatcherModal={() => setIsMarketingModalOpen(true)}
              onOpenDedicatedCamera={() => setActivePage('camera')}
              onOpenLandownerApplications={onOpenLandownerApplications}
            />
          )}

          {department === 'projects' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      منظومة الرفع المساحي والخرائط الهندسية ومناسيب الموقع
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      أبعاد الأرض، المخطط الهندسي العام (Layout Plan)، فحص التربة، القواعد الخرسانية، والشوارع
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage('camera')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>كاميرا الرفع المساحي والخرائط</span>
                </button>
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

          {department === 'operations' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      سجل رصد وتوزيع المعدات والآلات والضواغط والموزعات
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      مطابقة ضاغط الغاز الرئيسي (250 بار)، موزعات التموين، بنوك الأسطوانات، وسجل الصيانة
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage('camera')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/30 cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  <span>كاميرا رصد ومواصفات المعدات</span>
                </button>
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

          {department === 'hse' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-rose-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      منظومة رصد السلامة والصحة المهنية والأمن الصناعي أثناء التنفيذ
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      مطابقة مسافات الأمان NFPA 52، كواشف الغاز واللهب، محابس الطوارئ ESD، ومعدات الإطفاء
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage('camera')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  <span>كاميرا رصد السلامة والأمن الصناعي</span>
                </button>
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

          {department === 'technical' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      منظومة فحص شبكة الغاز الطبيعي ومحطة القياس والتخفيض (PRS)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      خط الغاز الطبيعي المغذي، نقطة الربط (Tie-in)، ضغط الشبكة، ومنظومة القياس والفلترة
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage('camera')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/30 cursor-pointer"
                >
                  <Cpu className="w-4 h-4" />
                  <span>كاميرا فحص شبكة الغاز والربط</span>
                </button>
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

          {department === 'licensing' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      سجل التراخيص والموافقات السيادية والمحلية
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      موافقات الحماية المدنية، جهاز شؤون البيئة، التنمية المحلية، وبيان الصلاحية
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage('camera')}
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

          {department === 'legal' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      سجل العقود وسندات الملكية والتوثيق القانوني
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      سند ملكية الأرض، عقد الإيجار طويل الأجل / الشراكة، وتوثيق الشهر العقاري
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage('camera')}
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

          {department === 'financial' && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-950 border border-teal-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                    <BadgeDollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">
                      دراسة الجدوى المالية والتكاليف الاستثمارية ومعدل الاسترداد
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      التكاليف الرأسمالية (CAPEX)، التكاليف التشغيلية (OPEX)، ومعدل العائد الداخلي (IRR)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage('camera')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>كاميرا معاينة الموقع مالياً</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">التكلفة الاستثمارية (CAPEX)</span>
                  <span className="text-sm font-bold text-white font-mono">22.5 مليون ج.م</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">شاملة الضاغط والموزعات</span>
                </div>
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">معدل العائد الداخلي (IRR)</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">28.5%</span>
                  <span className="text-[10px] text-emerald-300 block mt-0.5">يتجاوز المستهدف (20%)</span>
                </div>
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">فترة استرداد رأس المال</span>
                  <span className="text-sm font-bold text-amber-300 font-mono">3.2 سنوات</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">أداء مالي فائق الجدوى</span>
                </div>
                <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">صافي القيمة الحالية (NPV)</span>
                  <span className="text-sm font-bold text-white font-mono">14.8 مليون ج.م</span>
                  <span className="text-[10px] text-cyan-400 block mt-0.5">معدل خصم 14%</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 sm:p-5 bg-slate-900/95 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>حقول ومعايير مطابقة الموقع ({meta.title})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  أدخل المعطيات الفنية واضغط حفظ لتحديث الملف المركزي للمحطة فورياً.
                </p>
              </div>

              <button
                onClick={handleSaveData}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات في ملف المحطة</span>
              </button>
            </div>

            {isSavedNotice && (
              <div className="p-3 bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم حفظ وتحديث بيانات الإدارة في ملف المحطة المركزي بنجاح.</span>
              </div>
            )}

            <div className="p-6 space-y-6">
              {deptCustomFields.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl space-y-2">
                  <p>لا توجد حقول نشطة حالياً لهذه الإدارة.</p>
                  <p className="text-slate-500">يمكن لمدير النظام إضافة وتخصيص حقول جديدة من لوحة التحكم المركزية.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {deptCustomFields.map((field) => {
                    const currentVal = fieldValues[field.key] ?? field.defaultValue ?? '';

                    return (
                      <div key={field.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5">
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

                        {field.type === 'select' && field.options ? (
                          <select
                            value={currentVal}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
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
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
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
                            rows={3}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <input
                            type="text"
                            value={currentVal}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Form Protection Banner */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    هذا النموذج معتمد رسمياً ومحمي. لتعديل أو إضافة متطلبات تخصصية، يمكنك رفع طلب تحديث الحقول.
                  </span>
                </div>
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="text-amber-400 hover:text-amber-300 font-bold underline shrink-0 cursor-pointer"
                >
                  رفع طلب تحديث الحقول الآن ←
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. DEDICATED PAGE: OFFICIAL CORRESPONDENCE & PDF DISPATCHES */}
      {/* ========================================================================= */}
      {activePage === 'correspondence' && (
        <div className="space-y-4 animate-fadeIn">
          <DepartmentCorrespondenceManager 
            currentDepartment={department}
            currentUserRole={department}
            currentUserName={meta.title}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. DEDICATED PAGE: SPECIALIZED FIELD CAMERA (كاميرا الرصد والتوثيق) */}
      {/* ========================================================================= */}
      {activePage === 'camera' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                منظومة كاميرا الرصد الميداني التخصصية لـ {meta.title}
              </h3>
              <p className="text-xs text-slate-300 max-w-xl mx-auto mt-1 leading-relaxed">
                رصد وتوثيق المعدات، مسافات الأمان، الرفع المساحي والخرائط، وتوليد صور معتمدة بالختم والإحداثيات الجغرافية.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsDedicatedCameraOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>تشغيل الكاميرا والتقاط صور فورية</span>
              </button>

              <button
                onClick={() => setActivePage('videos')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-sm font-bold border border-amber-500/30 transition-all cursor-pointer"
              >
                <Film className="w-5 h-5 text-amber-400" />
                <span>استعراض تسجيلات الفيديو السابقة</span>
              </button>
            </div>
          </div>

          {/* Station Photo Gallery for Active Station */}
          {activeSession && activeSession.photos && activeSession.photos.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>صور الرصد الموثقة للمحطة الحالية ({activeSession.title})</span>
                </h4>
                <span className="text-xs text-slate-400 font-mono">
                  {activeSession.photos.length} صورة مسجلة
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {activeSession.photos.map((photo, pIdx) => (
                  <div key={pIdx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video relative group">
                    <img 
                      src={photo} 
                      alt={`توثيق ${pIdx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] text-white font-bold">لقطة {pIdx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. DEDICATED PAGE: PERFORMANCE EVALUATION & KPIS */}
      {/* ========================================================================= */}
      {activePage === 'kpis' && (
        <div className="space-y-4 animate-fadeIn">
          <DepartmentPerformanceEvaluation 
            department={department} 
            onExit={() => setActivePage('directory')} 
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. DEDICATED PAGE: PERIODIC TASKS SCHEDULER */}
      {/* ========================================================================= */}
      {activePage === 'tasks' && (
        <div className="space-y-4 animate-fadeIn">
          <DepartmentPeriodicTasksScheduler department={department} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. DEDICATED PAGE: DEPARTMENT ALERTS CENTER (>48H) */}
      {/* ========================================================================= */}
      {activePage === 'alerts' && (
        <div className="space-y-4 animate-fadeIn">
          <DepartmentAlertsCenter 
            department={department}
            onNavigateSubTab={(tab) => {
              if (tab === 'form') setActivePage('form');
              else if (tab === 'tasks') setActivePage('tasks');
              else if (tab === 'evaluation') setActivePage('kpis');
              else if (tab === 'reports') setActivePage('reports');
              else if (tab === 'logs') setActivePage('logs');
              else setActivePage('alerts');
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. DEDICATED PAGE: AUTOMATED REPORTING ENGINE */}
      {/* ========================================================================= */}
      {activePage === 'reports' && (
        <div className="space-y-4 animate-fadeIn">
          <AutomatedReportingEngine 
            department={department}
            sessions={sessions}
            onExit={() => setActivePage('directory')}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. DEDICATED PAGE: VIDEOS & RECORDINGS ARCHIVE */}
      {/* ========================================================================= */}
      {activePage === 'videos' && (
        <div className="space-y-4 animate-fadeIn">
          <VideoArchiveModal
            isOpen={true}
            onClose={() => setActivePage('directory')}
            defaultDepartmentFilter={department}
            isEmbedded={true}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. DEDICATED PAGE: ACTIVITY & ASSIGNMENTS AUDIT LOG */}
      {/* ========================================================================= */}
      {activePage === 'logs' && (
        <div className="space-y-4 animate-fadeIn">
          <DepartmentActivityAuditLog 
            department={department}
            onExit={() => setActivePage('directory')}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. DEDICATED PAGE: SPECIALIZED FIELD INSPECTION */}
      {/* ========================================================================= */}
      {activePage === 'inspection' && (
        <div className="space-y-4 animate-fadeIn">
          <DepartmentFieldInspectionModal
            isOpen={true}
            department={department}
            activeSession={activeSession}
            sessions={sessions}
            onClose={() => setActivePage('directory')}
            onSaveInspection={() => {
              setActivePage('directory');
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. DEDICATED PAGE: INTERACTIVE USER GUIDE */}
      {/* ========================================================================= */}
      {activePage === 'guide' && (
        <div className="space-y-4 animate-fadeIn">
          <InteractiveUserGuideModal
            currentDepartment={department}
            onClose={() => setActivePage('directory')}
            onNavigateSubTab={(tab) => {
              if (tab === 'form') setActivePage('form');
              else if (tab === 'tasks') setActivePage('tasks');
              else if (tab === 'evaluation') setActivePage('kpis');
              else if (tab === 'reports') setActivePage('reports');
              else if (tab === 'logs') setActivePage('logs');
              else if (tab === 'alerts') setActivePage('alerts');
              else setActivePage('directory');
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 15. DEDICATED PAGE: MARKETING STATION OPERATIONS WORKFLOW (Marketing only) */}
      {/* ========================================================================= */}
      {activePage === 'marketing_hub' && isMarketing && (
        <div className="space-y-4 animate-fadeIn">
          <MarketingStationOperationsWorkflow
            stations={stations}
            sessions={sessions}
            activeSession={activeSession}
            onSelectSession={onSelectSession}
            onUpdateSession={onUpdateSession}
            onNavigateToCamera={onNavigateToCamera}
            onNavigateToMap={onNavigateToMap}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 16. DEDICATED PAGE: LANDOWNER APPLICATIONS MANAGER (Marketing only) */}
      {/* ========================================================================= */}
      {activePage === 'landowners' && isMarketing && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-center animate-fadeIn">
          <FileCheck className="w-12 h-12 text-teal-400 mx-auto" />
          <h3 className="text-base font-black text-white">منظومة طلبات ملاك الأراضي والمحطات</h3>
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            يمكنك استعراض كافة الطلبات المقدمة من الملاك والشركاء المحتملين وإرسال استمارات المعاينة الفورية عبر تطبيق الواتساب.
          </p>
          <button
            onClick={() => {
              if (onOpenLandownerApplications) onOpenLandownerApplications();
            }}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow cursor-pointer"
          >
            فتح نافذة إدارة طلبات الملاك التفاعلية
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 17. GLOBAL MODALS (تفتح عند الطلب من أي صفحة أو زر) */}
      {/* ========================================================================= */}
      {/* Department Dedicated Field Camera Modal */}
      {isDedicatedCameraOpen && (
        <DepartmentDedicatedCameraModal
          isOpen={isDedicatedCameraOpen}
          onClose={() => setIsDedicatedCameraOpen(false)}
          department={department}
          activeSession={activeSession}
        />
      )}

      {/* Video Archive Modal */}
      {isVideoArchiveOpen && (
        <VideoArchiveModal
          isOpen={isVideoArchiveOpen}
          onClose={() => setIsVideoArchiveOpen(false)}
          defaultDepartmentFilter={department}
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

      {/* Team WhatsApp Invite Modal */}
      <DepartmentTeamInviteModal
        isOpen={isTeamInviteModalOpen}
        onClose={() => setIsTeamInviteModalOpen(false)}
        department={department}
      />

      {/* Department Task Notifications Modal */}
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
          setActivePage('tasks');
        }}
      />

      {/* Development & Efficiency Modal */}
      <DevelopmentEfficiencyModal
        isOpen={isDevEfficiencyOpen}
        onClose={() => setIsDevEfficiencyOpen(false)}
      />

      {/* In-App Messaging & Audio Ringtone Notifications Modal */}
      <InAppNotificationCenterModal
        isOpen={isInAppNotifOpen}
        onClose={() => setIsInAppNotifOpen(false)}
        currentDepartment={department}
      />

    </div>
  );
};
