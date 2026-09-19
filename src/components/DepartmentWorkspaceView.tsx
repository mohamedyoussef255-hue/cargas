import React, { useState } from 'react';
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
  Calendar
} from 'lucide-react';
import { 
  DepartmentRole, 
  MonitoringSession, 
  CustomFormField, 
  FormChangeRequest,
  DepartmentActivityLogItem
} from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import { RequestFormChangeModal } from './RequestFormChangeModal';
import { MarketingSurveyDispatcherModal } from './MarketingSurveyDispatcherModal';
import { DepartmentTeamInviteModal } from './DepartmentTeamInviteModal';
import { DepartmentDedicatedCameraModal } from './DepartmentDedicatedCameraModal';
import { VideoArchiveModal } from './VideoArchiveModal';
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
}) => {
  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;
  const isOps = department === 'operations';
  const isMarketing = department === 'marketing';

  // Modal states
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isMarketingModalOpen, setIsMarketingModalOpen] = useState<boolean>(false);
  const [isTeamInviteModalOpen, setIsTeamInviteModalOpen] = useState<boolean>(false);
  const [isDedicatedCameraOpen, setIsDedicatedCameraOpen] = useState<boolean>(false);
  const [isVideoArchiveOpen, setIsVideoArchiveOpen] = useState<boolean>(false);
  const [showActivityLogs, setShowActivityLogs] = useState<boolean>(false);
  const [isSavedNotice, setIsSavedNotice] = useState<boolean>(false);

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
          
          {/* Monitoring Camera Button (Strictly restricted to Marketing Department) */}
          {department === 'marketing' && (
            <button
              id="btn-dept-camera"
              onClick={() => setIsDedicatedCameraOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
              title="فتح كاميرا الرصد الميداني وحصر السيارات لإدارة التسويق والدراسات"
            >
              <Camera className="w-4 h-4" />
              <span>كاميرا الرصد الميداني وحصر السيارات</span>
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

          {/* Landowner Survey Applications Button */}
          {onOpenLandownerApplications && (
            <button
              onClick={onOpenLandownerApplications}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 cursor-pointer"
              title="عرض وإدارة طلبات المعاينة المقدمة من ملاك الأراضي ومحطات الوقود"
            >
              <FileText className="w-4 h-4" />
              <span>طلبات معاينة ملاك المواقع</span>
            </button>
          )}

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
            title="طلب تعديل حقول الاستمارة من مدير النظام"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>مخاطبة مدير النظام</span>
          </button>

          {/* Switch Department / Logout */}
          <button
            onClick={onSwitchDepartment}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors"
          >
            <span>خروج / تبديل الإدارة</span>
          </button>
        </div>
      </div>

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
                <Sparkles className="w-3 h-3 text-emerald-400" />
                موقع مؤكد أوتوماتيكياً
              </span>
            )}
          </div>
        </div>
      )}

      {/* Special Highlights for Operations & Maintenance (المعدات والآلات) */}
      {isOps && (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-amber-300">
                سجل المعدات والآلات والضواغط وموزعات الغاز الطبيعي (NGV Machinery)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              خاص بإدارة التشغيل والصيانة فقط
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            وفقاً لضوابط الصلاحيات، يظهر لإدارة التشغيل والصيانة حصرياً كافة البيانات الفنية المتعلقة بضاغط الغاز الرئيسي (250 بار)، موزعات تموين السيارات، محطة تخفيض الضغط، وحدة التجفيف، وساعات التشغيل والصيانة الدورية.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">ضغط التموين الأقصى</span>
              <span className="text-sm font-bold text-amber-300 font-mono">220 - 250 Bar</span>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">الضاغط الموصى به</span>
              <span className="text-sm font-bold text-white">1000 - 1500 م³/س</span>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">موزعات التموين</span>
              <span className="text-sm font-bold text-white">4 موزعات (8 مسدس)</span>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">وحدة التجفيف (Gas Dryer)</span>
              <span className="text-sm font-bold text-emerald-400">ثنائية البرج متوافقة</span>
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
                هذا النموذج مقفل ومعتمد من إدارة النظام. إذا كنت بحاجة لإضافة أو تعديل حقول جديدة، يرجى تقديم طلب رسمي.
              </span>
            </div>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold underline shrink-0 cursor-pointer"
            >
              مخاطبة مدير النظام الآن
            </button>
          </div>
        </div>
      </div>

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

    </div>
  );
};
