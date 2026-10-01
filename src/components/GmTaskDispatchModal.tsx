import React, { useState, useMemo } from 'react';
import {
  Send,
  X,
  UserCheck,
  Building2,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Phone,
  MessageSquare,
  FileCheck,
  Sparkles,
  ClipboardList,
  MapPin,
  Share2,
  Bell,
  ArrowRight
} from 'lucide-react';
import { DepartmentRole, MonitoringSession, CNGStation, DepartmentEmployeeItem } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import { dispatchInAppNotification } from '../utils/inAppMessagingService';
import { playNotificationChime } from '../utils/audioNotificationService';

export interface GmDispatchedTask {
  id: string;
  department: DepartmentRole;
  recipientName: string;
  recipientPhone: string;
  recipientRoleTitle: string;
  taskType: 'inspection' | 'report' | 'spec_check' | 'camera_documentation' | 'external_followup' | 'approved_dispatch';
  title: string;
  stationCode?: string;
  stationName?: string;
  priority: 'urgent' | 'high' | 'normal';
  dueDate: string;
  instructions: string;
  sentAt: string;
  status: 'sent' | 'acknowledged' | 'in_progress' | 'completed';
  channel: 'whatsapp' | 'inapp' | 'both';
}

interface GmTaskDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentRole;
  sessions: MonitoringSession[];
  activeSession?: MonitoringSession | null;
  stations?: CNGStation[];
}

const DEFAULT_EMPLOYEES_BY_DEPT: Record<string, { name: string; phone: string; title: string }[]> = {
  marketing: [
    { name: 'م. عمر الألفي', phone: '+201112233447', title: 'باحث ميداني ورصد كثافات مرورية' },
    { name: 'أ. كريم سراج', phone: '+201123344558', title: 'مسؤول دراسات الجدوى الميدانية' },
  ],
  projects: [
    { name: 'م. إبراهيم كمال', phone: '+201112233441', title: 'مهندس موقع ومسؤول خرسانات' },
    { name: 'م. كريم سامي', phone: '+201122334451', title: 'مهندس مكتب فني ومقايسات' },
  ],
  operations: [
    { name: 'م. رامي زهران', phone: '+201112233442', title: 'مهندس صيانة ضواغط وميكانيكا' },
    { name: 'م. أحمد حامد', phone: '+201122334452', title: 'مشرف شبكات تموين ومضخات' },
  ],
  hse: [
    { name: 'كيميائي / سارة المنشاوي', phone: '+201112233443', title: 'أخصائي سلامة وصحة مهنية' },
    { name: 'م. إيهاب مرسي', phone: '+201122334453', title: 'مفتش أمن صناعي وتصاريح عمل' },
  ],
  technical: [
    { name: 'م. ياسر عفيفي', phone: '+201112233444', title: 'مهندس ضغوط وربط شبكات غاز' },
    { name: 'م. بلال شوقي', phone: '+201122334454', title: 'مهندس صيانة محطات PRMS' },
  ],
  licensing: [
    { name: 'أ. وليد الجوهري', phone: '+201112233445', title: 'أخصائي متابعة تراخيص وأجهزة مدن' },
    { name: 'أ. عصام رضوان', phone: '+201122334455', title: 'مسؤول موافقات الحماية المدنية' },
  ],
  legal: [
    { name: 'أ. مروان عبد الحي', phone: '+201112233448', title: 'باحث قانوني وفحص نزاعات عقارية' },
  ],
  financial: [
    { name: 'أ. حازم السعدني', phone: '+201112233446', title: 'محاسب تكاليف وموازنات محطات' },
  ],
};

export const GmTaskDispatchModal: React.FC<GmTaskDispatchModalProps> = ({
  isOpen,
  onClose,
  department,
  sessions,
  activeSession,
  stations = [],
}) => {
  const meta = DEPARTMENTS_METADATA[department] || {
    title: `إدارة ${department}`,
    badge: 'إدارة تخصصية',
  };

  // Load registered department employees from storage
  const availableEmployees = useMemo(() => {
    try {
      const stored = localStorage.getItem('cng_department_employees_v1');
      if (stored) {
        const parsed: DepartmentEmployeeItem[] = JSON.parse(stored);
        const deptEmployees = parsed.filter(e => e.department === department && e.status === 'active');
        if (deptEmployees.length > 0) {
          return deptEmployees.map(e => ({
            name: e.name,
            phone: e.phone,
            title: e.title,
          }));
        }
      }
    } catch {}
    return DEFAULT_EMPLOYEES_BY_DEPT[department] || [
      { name: 'مهندس الموقع المعين', phone: '+201000000000', title: 'فريق العمل الميداني' }
    ];
  }, [department]);

  // Form State
  const [selectedRecipientIdx, setSelectedRecipientIdx] = useState<number>(0);
  const [isCustomRecipient, setIsCustomRecipient] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customPhone, setCustomPhone] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('مهندس / عضو بالإدارة');

  const [taskType, setTaskType] = useState<GmDispatchedTask['taskType']>('inspection');
  const [taskTitle, setTaskTitle] = useState<string>('تكليف بمعاينة ميدانية وتحديث تقرير الموقع');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(activeSession?.id || (sessions[0]?.id || ''));
  const [priority, setPriority] = useState<GmDispatchedTask['priority']>('urgent');
  const [dueDate, setDueDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [instructions, setInstructions] = useState<string>('');
  const [dispatchMethod, setDispatchMethod] = useState<'both' | 'whatsapp' | 'inapp'>('both');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentRecipient = isCustomRecipient
    ? { name: customName || 'عضو الإدارة', phone: customPhone, title: customTitle }
    : availableEmployees[selectedRecipientIdx] || { name: 'عضو الإدارة', phone: '', title: '' };

  const targetSession = sessions.find(s => s.id === selectedSessionId) || activeSession;

  const handleSendDispatch = () => {
    if (!currentRecipient.name.trim()) {
      alert('يرجى تحديد أو إدخال اسم المستلم من أعضاء الإدارة.');
      return;
    }

    const newTask: GmDispatchedTask = {
      id: `task-gm-${Date.now()}`,
      department,
      recipientName: currentRecipient.name,
      recipientPhone: currentRecipient.phone,
      recipientRoleTitle: currentRecipient.title || 'عضو الإدارة',
      taskType,
      title: taskTitle.trim() || 'تكليف رسمي من المدير العام',
      stationCode: targetSession?.code,
      stationName: targetSession?.title || targetSession?.locationName,
      priority,
      dueDate,
      instructions: instructions.trim() || 'يرجى مراجعة الموقع وتحديث البيانات والاشتراطات بالمنظومة.',
      sentAt: new Date().toISOString(),
      status: 'sent',
      channel: dispatchMethod,
    };

    // 1. Save in local dispatched tasks storage
    try {
      const existing = localStorage.getItem('cng_gm_dispatched_tasks_v1');
      const list: GmDispatchedTask[] = existing ? JSON.parse(existing) : [];
      list.unshift(newTask);
      localStorage.setItem('cng_gm_dispatched_tasks_v1', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    // 2. Add to Activity Logs
    try {
      const logsRaw = localStorage.getItem('cng_activity_logs_v1');
      const logs = logsRaw ? JSON.parse(logsRaw) : [];
      logs.unshift({
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorName: `المدير العام لـ ${meta.title}`,
        department,
        actionType: 'task_assigned',
        description: `إصدار تكليف/تقرير رسمي إلى (${currentRecipient.name}) بخصوص: ${newTask.title}`,
        details: newTask.instructions,
        stationCode: targetSession?.code,
      });
      localStorage.setItem('cng_activity_logs_v1', JSON.stringify(logs));
    } catch {}

    // 3. Send In-App Notification if requested
    if (dispatchMethod === 'both' || dispatchMethod === 'inapp') {
      dispatchInAppNotification({
        senderRole: department,
        senderName: `المدير العام لـ ${meta.title}`,
        recipientRole: department,
        title: `تكليف جديد: ${newTask.title}`,
        content: `تكليف موجه إلى: ${currentRecipient.name} (${currentRecipient.title}) - الأولوية: ${priority === 'urgent' ? 'عاجل جداً' : priority === 'high' ? 'هام' : 'اعتيادي'}. التعليمات: ${newTask.instructions}`,
        category: priority === 'urgent' ? 'urgent' : 'task',
        priority: priority === 'urgent' ? 'urgent' : 'high',
        stationCode: targetSession?.code,
      });
      playNotificationChime();
    }

    // 4. WhatsApp Dispatch link
    if (dispatchMethod === 'both' || dispatchMethod === 'whatsapp') {
      const appUrl = window.location.origin + window.location.pathname;
      const cleanPhone = currentRecipient.phone.replace(/[^0-9]/g, '');
      const priorityLabel = priority === 'urgent' ? '🔴 عاجل وفوري جدًا' : priority === 'high' ? '🟡 هام وعاجل' : '🟢 متابعة دورية';

      const waText = 
`*منظومة كارجاس CARGAS NGV - تكليف رسمي معتمد*
━━━━━━━━━━━━━━━━━━━━
*جهة الإصدار:* المدير العام لـ ${meta.title}
*الموجه إليه:* ${currentRecipient.name} (${currentRecipient.title})
*نوع التكليف:* ${newTask.title}
*درجة الأولوية:* ${priorityLabel}
*المحطة المستهدفة:* ${targetSession?.code ? targetSession.code + ' - ' + targetSession.title : 'محطة تحت الدراسة'}
*الموعد الأقصى للإنجاز:* ${dueDate}

*التعليمات والمطلوب تنفيذه:*
${newTask.instructions}

*رابط مباشر لفتح صفحة المحطة والتنفيذ في المنظومة:*
${appUrl}?role=${department}&userType=staff

━━━━━━━━━━━━━━━━━━━━
شركة الغاز الطبيعي للسيارات (كارجاس)`;

      const encoded = encodeURIComponent(waText);
      const waUrl = cleanPhone 
        ? `https://wa.me/${cleanPhone}?text=${encoded}`
        : `https://wa.me/?text=${encoded}`;

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');
    }

    setSuccessToast(`تم إرسال التكليف بنجاح إلى (${currentRecipient.name})`);
    setTimeout(() => {
      setSuccessToast(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[94vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-indigo-950/50 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  إرسال تكليف / مهمة / تقرير لأفراد الإدارة
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  صلاحية المدير العام
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                توجيه المهام التنفيذية والتقارير الرسمية مباشرة لفريق عمل {meta.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-right">
          
          {successToast && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* 1. Recipient Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>اختر العضو / المهندس الموجه إليه التكليف:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCustomRecipient(!isCustomRecipient)}
                className="text-[11px] text-indigo-400 hover:underline font-normal"
              >
                {isCustomRecipient ? '← اختيار من قائمة أعضاء الإدارة المسجلين' : '+ كتابة اسم وهاتف عضو آخر'}
              </button>
            </label>

            {!isCustomRecipient ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableEmployees.map((emp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedRecipientIdx(idx)}
                    className={`p-3 rounded-xl border text-right transition-all flex items-start justify-between cursor-pointer ${
                      selectedRecipientIdx === idx
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-black text-white">{emp.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{emp.title}</div>
                      <div className="text-[10px] text-indigo-300 font-mono mt-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{emp.phone}</span>
                      </div>
                    </div>
                    {selectedRecipientIdx === idx && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">اسم العضو / المهندس:</span>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="مثال: م. أحمد عبد الله"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">رقم الواتساب:</span>
                  <input
                    type="text"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    placeholder="+2010..."
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-2 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">المسمى الوظيفي:</span>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="مهندس فحص ميداني"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Task Category & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                نوع التكليف أو الإجراء:
              </label>
              <select
                value={taskType}
                onChange={(e) => {
                  const val = e.target.value as GmDispatchedTask['taskType'];
                  setTaskType(val);
                  if (val === 'inspection') setTaskTitle('تكليف بمعاينة ميدانية وفحص الموقع');
                  else if (val === 'report') setTaskTitle('إعداد تقرير فني معتمد للمحطة');
                  else if (val === 'spec_check') setTaskTitle('مطابقة الاشتراطات وتحديث الاستمارة');
                  else if (val === 'camera_documentation') setTaskTitle('توثيق الموقع بالصور والفيديوهات بالكاميرا');
                  else if (val === 'external_followup') setTaskTitle('متابعة دورية واستعجال جهة الاختصاص');
                  else if (val === 'approved_dispatch') setTaskTitle('تسليم التقرير النهائي المعتمد');
                }}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="inspection">🔍 تكليف بمعاينة ميدانية وفحص الموقع</option>
                <option value="report">📄 إعداد وتحديث تقرير فني / مالي معتمد</option>
                <option value="spec_check">📋 مطابقة الاشتراطات وتحديث الاستمارة</option>
                <option value="camera_documentation">📷 توثيق صور وفيديوهات بالكاميرا</option>
                <option value="external_followup">⏳ متابعة دورية واستعجال جهة خارجية</option>
                <option value="approved_dispatch">📑 إرسال تقرير وملاحظات رسمية</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                المحطة المرتبطة بالتكليف:
              </label>
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.title} ({s.city || s.governorate})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Task Subject */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              عنوان التكليف أو الموضوع:
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3.5 py-2.5 focus:border-indigo-500 focus:outline-none"
              placeholder="مثال: فحص نقاط الأمان والسلامة بمحطة التحرير واستيفاء الملاحظات"
            />
          </div>

          {/* 3. Priority and Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                درجة الأولوية والأهمية:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPriority('urgent')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    priority === 'urgent'
                      ? 'bg-rose-600 text-white border-rose-400 shadow-md shadow-rose-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  عاجل فوري 🔴
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    priority === 'high'
                      ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  هام 🟡
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('normal')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                    priority === 'normal'
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  اعتيادي 🟢
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                الموعد الأقصى للإنجاز (Deadline):
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 4. Instructions and Notes */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              توجيهات المدير العام وتعليمات التنفيذ:
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="اكتب التوجيهات المحددة المطلوب من الزميل تنفيذها (مثال: يرجى التوجه للموقع اليوم، مراجعة مسارات الدخول والخروج ورفع تقرير فوري معتمد قبل الساعة 4 مساءً)..."
              className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-xl p-3 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          {/* 5. Dispatch Channel */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              طريقة وقناة الإرسال:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDispatchMethod('both')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  dispatchMethod === 'both'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>واتساب + تنبيه بالمنظومة</span>
              </button>
              <button
                type="button"
                onClick={() => setDispatchMethod('whatsapp')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  dispatchMethod === 'whatsapp'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                <span>واتساب فقط</span>
              </button>
              <button
                type="button"
                onClick={() => setDispatchMethod('inapp')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  dispatchMethod === 'inapp'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-300" />
                <span>تنبيه داخلي فقط</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            إلغاء وتراجع
          </button>

          <button
            type="button"
            onClick={handleSendDispatch}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>إرسال التكليف فوراً إلى ({currentRecipient.name})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
