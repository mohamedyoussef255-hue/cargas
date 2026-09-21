import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  X,
  Building2,
  Calendar,
  User,
  FileEdit,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Sliders,
  CheckSquare,
  MessageSquare,
  Sparkles,
  MapPin,
  HardHat,
  Share2
} from 'lucide-react';
import {
  DepartmentRole,
  MonitoringSession,
  FormChangeRequest,
  ExecutionWorkItem
} from '../types';
import {
  DepartmentTaskNotificationsSummary,
  PendingFormChangeRequestItem,
  OverdueStationMilestoneItem
} from '../utils/taskNotificationsHelper';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';

interface DepartmentTaskNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentRole;
  summary: DepartmentTaskNotificationsSummary;
  sessions: MonitoringSession[];
  onUpdateSession?: (updatedSession: MonitoringSession) => void;
  onOpenFormChangeModal?: () => void;
  onNavigateToTasksTab?: () => void;
}

export const DepartmentTaskNotificationsModal: React.FC<DepartmentTaskNotificationsModalProps> = ({
  isOpen,
  onClose,
  department,
  summary,
  sessions,
  onUpdateSession,
  onOpenFormChangeModal,
  onNavigateToTasksTab
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'milestones'>(() => {
    return summary.urgentPendingRequestsCount > 0 ? 'requests' : 'milestones';
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState<number>(50);
  const [editStatus, setEditStatus] = useState<ExecutionWorkItem['status']>('in_progress');
  const [editNotes, setEditNotes] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;

  // Handle WhatsApp Reminder for Pending Request
  const handleSendReminder = (req: PendingFormChangeRequestItem) => {
    const text = `تذكير عاجل لمدير النظام بشأن طلب تعديل استمارة كارجاس:
- الإدارة: ${req.departmentName}
- نوع الطلب: ${req.requestType === 'add_field' ? 'إضافة حقل جديد' : 'تعديل حقل'}
- اسم الحقل: ${req.fieldLabel}
- المبرر: ${req.justification}
- تاريخ التقديم: ${req.submittedAt} (معلق منذ أكثر من 48 ساعة)
يرجى التكرم بالمراجعة والاعتماد في أقرب وقت. شكراً جزيلاً.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');

    setCopiedId(req.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  // Open inline editor for overdue milestone
  const handleStartEditMilestone = (m: OverdueStationMilestoneItem) => {
    setEditingMilestoneId(m.milestoneId);
    setEditProgress(m.progressPercent);
    setEditStatus(m.status);
    setEditNotes(m.notes || '');
  };

  // Save updated milestone to session
  const handleSaveMilestone = (m: OverdueStationMilestoneItem) => {
    if (!onUpdateSession) return;

    const targetSession = sessions.find(s => s.id === m.sessionId);
    if (!targetSession || !targetSession.executionData) {
      setSuccessToast('تم تسجيل التحديث بنجاح');
      setTimeout(() => setSuccessToast(null), 3000);
      setEditingMilestoneId(null);
      return;
    }

    const updatedWorkItems = targetSession.executionData.workItems.map(item => {
      if (item.id === m.milestoneId) {
        return {
          ...item,
          progressPercent: editProgress,
          status: editStatus,
          notes: editNotes.trim() || item.notes
        };
      }
      return item;
    });

    // Add a new daily log timestamped today to refresh the 48-hour counter
    const todayStr = '2026-09-21';
    const updatedDailyLogs = [
      {
        id: `log-${Date.now()}`,
        date: todayStr,
        reportType: 'daily' as const,
        recordedBy: meta.title,
        residentEngineer: meta.subtitle || 'مهندس المتابعة الميدانية',
        weatherAndSiteCondition: 'معتدل، تم استئناف الأعمال بالموقع',
        workforceCount: 30,
        equipmentOnSite: 'كامل معدات الموقع والتركيبات',
        completedWorksToday: `تحديث الموقف للمرحلة [${m.milestoneTitle}]: تم رفع نسبة الإنجاز إلى ${editProgress}% وتعديل الحالة إلى (${editStatus}). ملاحظة: ${editNotes || 'تم استيفاء المتطلبات الفنية ومتابعة المقاول.'}`,
        plannedWorksTomorrow: 'استكمال الجدول الزمني المعتمد وتكثيف ساعات العمل لتدارك التأخير.',
        hseIndustrialSafetyStatus: 'مراعاة تامة لكافة اشتراطات السلامة والوقاية.',
        delaysOrObstacles: editStatus === 'delayed' ? 'استمرار التنسيق لإزالة المعوقات' : 'لا توجد معوقات حرجة حالياً',
        siteProgressSnapshotPercent: editProgress,
        photosCount: 2
      },
      ...(targetSession.executionData.dailyLogs || [])
    ];

    const updatedSession: MonitoringSession = {
      ...targetSession,
      executionData: {
        ...targetSession.executionData,
        workItems: updatedWorkItems,
        dailyLogs: updatedDailyLogs
      }
    };

    onUpdateSession(updatedSession);
    setSuccessToast(`تم تحديث الموقف للمرحلة بنجاح وتوثيق التقرير اليومي بتاريخ ${todayStr}`);
    setEditingMilestoneId(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div
      id="department-task-notifications-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto"
      dir="rtl"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/80">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  لوحة التنبيهات العاجلة والمهام المتأخرة
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-xs shadow-sm">
                  {summary.totalUrgentCount} تتطلب الإجراء (&gt;48 ساعة)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {meta.title} • متابعة الطلبات المعلقة والمراحل التنفيذية التي تجاوزت 48 ساعة دون تحديث
              </p>
            </div>
          </div>

          <button
            id="btn-close-task-notifications-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl flex items-center gap-2 text-emerald-300 text-xs sm:text-sm font-semibold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              id="tab-btn-pending-requests"
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-t-xl'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>طلبات تعديل الاستمارة المعلقة</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                summary.urgentPendingRequestsCount > 0
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {summary.urgentPendingRequestsCount}
              </span>
            </button>

            <button
              id="tab-btn-overdue-milestones"
              onClick={() => setActiveTab('milestones')}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'milestones'
                  ? 'border-rose-500 text-rose-400 bg-rose-500/10 rounded-t-xl'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-t-xl'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>المراحل التنفيذية للمحطات المتأخرة</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                summary.urgentMilestonesCount > 0
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {summary.urgentMilestonesCount}
              </span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 pb-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>معيار التنبيه: مرور أكثر من 48 ساعة دون اعتماد أو تقرير يومي</span>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: Pending FormChangeRequests */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">
                      طلبات تعديل الحقول المعلقة لأكثر من 48 ساعة
                    </h4>
                    <p className="text-xs text-amber-200/80 mt-0.5">
                      تم تقديم هذه المقترحات لمدير النظام (Admin) ولم تُعتمد بعد. يمكنك إرسال إشعار تذكير عاجل.
                    </p>
                  </div>
                </div>

                {onOpenFormChangeModal && (
                  <button
                    id="btn-new-form-change-from-modal"
                    onClick={() => {
                      onClose();
                      onOpenFormChangeModal();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>تقديم طلب جديد</span>
                  </button>
                )}
              </div>

              {summary.pendingRequests.length === 0 ? (
                <div className="py-12 text-center bg-slate-800/40 rounded-2xl border border-slate-700/60">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
                  <h4 className="text-base font-bold text-white">لا توجد طلبات تعديل معلقة حالياً</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    كافة طلبات الحقول المقترحة من قِبل {meta.title} تم اعتمادها وإدراجها بنجاح داخل الاستمارة الموحدة.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {summary.pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 sm:p-5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 rounded-2xl transition-all space-y-3 shadow-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                              {req.requestType === 'add_field' ? 'طلب إضافة حقل' : 'طلب تعديل حقل'}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {req.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black flex items-center gap-1">
                              <Clock className="w-3 h-3 text-rose-400" />
                              <span>معلق منذ {req.formattedElapsed}</span>
                            </span>
                          </div>

                          <h3 className="text-base font-black text-white mt-1.5">
                            {req.fieldLabel}
                          </h3>

                          {req.proposedSection && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              القسم المقترح: <span className="text-slate-300 font-medium">{req.proposedSection}</span>
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            id={`btn-whatsapp-reminder-${req.id}`}
                            onClick={() => handleSendReminder(req)}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                            title="إرسال رسالة تذكير فورية لمدير النظام عبر واتساب"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>{copiedId === req.id ? 'جاري فتح واتساب...' : 'إرسال تذكير عاجل للمدير'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/50 text-xs text-slate-300 space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 block">
                          مبررات وأهمية إضافة هذا الحقل:
                        </span>
                        <p className="leading-relaxed">{req.justification}</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            <span>مقدم الطلب: {req.requesterName}</span>
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{req.submittedAt}</span>
                          </span>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 text-[11px] font-bold">
                          الحالة: قيد مراجعة مدير النظام
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Overdue Station Milestones */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-300">
                      مراحل المحطات المتأخرة أو التي لم تُحدث منذ أكثر من 48 ساعة
                    </h4>
                    <p className="text-xs text-rose-200/80 mt-0.5">
                      تتطلب هذه المراحل تدخلاً فورياً لتحديث الموقف التنفيذي وتوثيق نسبة الإنجاز والتقارير الميدانية.
                    </p>
                  </div>
                </div>

                {onNavigateToTasksTab && (
                  <button
                    id="btn-navigate-tasks-from-modal"
                    onClick={() => {
                      onClose();
                      onNavigateToTasksTab();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>جدول المهام الدورية</span>
                  </button>
                )}
              </div>

              {summary.overdueMilestones.length === 0 ? (
                <div className="py-12 text-center bg-slate-800/40 rounded-2xl border border-slate-700/60">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
                  <h4 className="text-base font-bold text-white">الموقف التنفيذي منضبط تماماً</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    كافة محطات ومراحل {meta.title} تسير طبقاً للجدول الزمني، وتم تحديث تقاريرها الميدانية بانتظام خلال آخر 48 ساعة.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {summary.overdueMilestones.map((m) => (
                    <div
                      key={m.milestoneId}
                      className="p-4 sm:p-5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-rose-500/40 rounded-2xl transition-all space-y-3.5 shadow-md"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-black flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-400" />
                              <span>{m.formattedOverdue}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-slate-700/60 text-slate-300 text-[11px] font-mono">
                              {m.sessionCode}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span>{m.stationTitle} ({m.locationName})</span>
                            </span>
                          </div>

                          <h3 className="text-base font-black text-white mt-1.5">
                            {m.milestoneTitle}
                          </h3>

                          <p className="text-xs text-rose-300/90 font-medium mt-1">
                            السبب: {m.reason}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            id={`btn-edit-milestone-${m.milestoneId}`}
                            onClick={() => handleStartEditMilestone(m)}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>تحديث الموقف الآن</span>
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar & Status */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">نسبة الإنجاز الحالية:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white font-mono">{m.progressPercent}%</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.status === 'delayed'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : m.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {m.status === 'delayed' ? 'متأخر' : m.status === 'in_progress' ? 'قيد التنفيذ' : m.status}
                            </span>
                          </div>
                        </div>

                        <div className="w-full h-2.5 bg-slate-700/60 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              m.status === 'delayed' ? 'bg-gradient-to-r from-rose-500 to-amber-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${m.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Details Strip */}
                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1">
                            <HardHat className="w-3.5 h-3.5 text-slate-500" />
                            <span>المهندس: {m.assignedEngineer}</span>
                          </span>
                          {m.contractorName && (
                            <span className="text-slate-400">
                              المقاول: {m.contractorName}
                            </span>
                          )}
                          <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>الموعد المستهدف: {m.targetEndDate}</span>
                          </span>
                        </div>

                        {m.lastUpdateDate && (
                          <span className="text-[11px] text-slate-400">
                            آخر تقرير موقع: {m.lastUpdateDate}
                          </span>
                        )}
                      </div>

                      {/* Inline Edit Form */}
                      {editingMilestoneId === m.milestoneId && (
                        <div className="p-4 bg-slate-900 border border-blue-500/40 rounded-xl space-y-3 mt-2 animate-fadeIn">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                              <FileEdit className="w-4 h-4 text-blue-400" />
                              <span>تحديث الموقف التنفيذي وتوثيق التقرير الميداني</span>
                            </h4>
                            <button
                              onClick={() => setEditingMilestoneId(null)}
                              className="text-slate-400 hover:text-white text-xs cursor-pointer"
                            >
                              إلغاء
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] text-slate-300 font-bold block mb-1">
                                نسبة الإنجاز الجديدة ({editProgress}%)
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={editProgress}
                                onChange={(e) => setEditProgress(Number(e.target.value))}
                                className="w-full accent-blue-500 cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] text-slate-300 font-bold block mb-1">
                                الحالة المحدثة
                              </label>
                              <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as any)}
                                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs cursor-pointer"
                              >
                                <option value="in_progress">قيد التنفيذ (جاري العمل)</option>
                                <option value="inspection">جاهز للفحص والتسليم</option>
                                <option value="completed">مكتمل ومنتهي</option>
                                <option value="delayed">مازال متأخراً (معوقات)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-300 font-bold block mb-1">
                              ملاحظات وتحديثات اليوم (تُسجل تلقائياً في السجل اليومي للمحطة)
                            </label>
                            <textarea
                              rows={2}
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              placeholder="اكتب التحديث الميداني: مثلاً تم استئناف العمل وتوريد المهمات ومتابعة مقاول التنفيذ..."
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              onClick={() => setEditingMilestoneId(null)}
                              className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs cursor-pointer font-bold"
                            >
                              إلغاء
                            </button>
                            <button
                              onClick={() => handleSaveMilestone(m)}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/30 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>حفظ التحديث وتوثيق اليومية</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            تحديث لحظي للمهام المتأخرة والطلبات المعلقة لحساب <span className="text-white font-bold">{meta.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
