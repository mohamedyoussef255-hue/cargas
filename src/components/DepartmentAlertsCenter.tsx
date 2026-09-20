import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Plus, 
  X, 
  ExternalLink, 
  ShieldAlert, 
  Flame, 
  Wrench, 
  Calendar,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { DepartmentRole, DepartmentAlertItem, AlertSeverity } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';

interface DepartmentAlertsCenterProps {
  department: DepartmentRole;
  onNavigateSubTab?: (subTab: 'form' | 'tasks' | 'evaluation' | 'reports' | 'logs') => void;
}

const STORAGE_KEY_ALERTS = 'cargas_department_alerts_v1';

const INITIAL_ALERTS: DepartmentAlertItem[] = [
  {
    id: 'alt-ops-01',
    department: 'operations',
    title: 'موعد المعايرة الدورية لضواغط الغاز (Compressors)',
    message: 'تنبيه عاجل: اقتراب موعد الفحص والمعايرة الدورية لضاغط الغاز الرئيسي بمحطة الرماية والجيزة وفقاً للجدول الزمني المعتمد.',
    severity: 'critical',
    category: 'maintenance',
    categoryLabel: 'صيانة وقائية ومعايرة',
    createdAt: new Date().toISOString(),
    dateStr: '2026/09/20',
    dueDate: '2026/09/25',
    actionLabel: 'متابعة المهمة في جدول المهام',
    actionSubTab: 'tasks',
    isRead: false,
  },
  {
    id: 'alt-ops-02',
    department: 'operations',
    title: 'مراجعة قراءات عدادات الدخول والضغط الاستاتيكي',
    message: 'يرجى مراجعة وتحديث قراءات ضغط الدخول لشبكة الغاز باستمارة موقع محطة الرماية قبل نهاية وردية اليوم.',
    severity: 'warning',
    category: 'form_review',
    categoryLabel: 'استمارة الموقع',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    dateStr: '2026/09/20',
    actionLabel: 'الانتقال لاستمارة الموقع',
    actionSubTab: 'form',
    isRead: false,
  },
  {
    id: 'alt-hse-01',
    department: 'hse',
    title: 'تفتيش منظومة مكافحة الحريق والإنذار المبكر',
    message: 'ضرورة إجراء التفتيش الشهري الإلزامي على شبكة الرشاشات المائية وخراطيم الحريق ومستشعرات تسريب غاز الميثان.',
    severity: 'critical',
    category: 'safety',
    categoryLabel: 'سلامة وصحة مهنية',
    createdAt: new Date().toISOString(),
    dateStr: '2026/09/20',
    dueDate: '2026/09/22',
    actionLabel: 'جدول مهام السلامة',
    actionSubTab: 'tasks',
    isRead: false,
  },
  {
    id: 'alt-proj-01',
    department: 'projects',
    title: 'اعتماد المخططات التنفيذية للقواعد الخرسانية (As-Built)',
    message: 'مطلوب مراجعة واعتماد المخطط التنفيذي لقواعد المظلات والضواغط المقدم من المقاول العام لمحطة الإسماعيلية.',
    severity: 'warning',
    category: 'periodic_task',
    categoryLabel: 'إشراف هندسي',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    dateStr: '2026/09/19',
    actionLabel: 'متابعة الموقف التنفيذي',
    actionSubTab: 'tasks',
    isRead: false,
  },
  {
    id: 'alt-legal-01',
    department: 'legal',
    title: 'متابعة تجديد موافقة الحماية المدنية وجهاز البيئة',
    message: 'تذكير إداري: تم رفع ملف الترخيص لموقع المحطة الجديدة وبانتظار رد المعاينة الميدانية من إدارة الحماية المدنية.',
    severity: 'info',
    category: 'legal',
    categoryLabel: 'تراخيص وشئون قانونية',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    dateStr: '2026/09/19',
    actionLabel: 'سجل المتابعة القانونية',
    actionSubTab: 'form',
    isRead: true,
  },
  {
    id: 'alt-fin-01',
    department: 'financial',
    title: 'تحديث دراسة الجدوى المالية بعد تسعير الغاز الجديد',
    message: 'يرجى مراجعة مؤشرات العائد الداخلي IRR وفترة الاسترداد للمواقع الجديدة في ضوء الأسعار التشغيلية المحدثة.',
    severity: 'info',
    category: 'budget',
    categoryLabel: 'جدوى مالية وموازنة',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    dateStr: '2026/09/18',
    actionLabel: 'تقييم الأداء المالي',
    actionSubTab: 'evaluation',
    isRead: false,
  }
];

export const DepartmentAlertsCenter: React.FC<DepartmentAlertsCenterProps> = ({
  department,
  onNavigateSubTab
}) => {
  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;

  const [alerts, setAlerts] = useState<DepartmentAlertItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ALERTS;
  });

  const [filterSeverity, setFilterSeverity] = useState<'all' | AlertSeverity>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New alert form
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newSeverity, setNewSeverity] = useState<AlertSeverity>('warning');
  const [newDueDate, setNewDueDate] = useState('');

  const saveAlerts = (updated: DepartmentAlertItem[]) => {
    setAlerts(updated);
    try {
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(updated));
    } catch {}
  };

  const handleToggleRead = (id: string) => {
    const updated = alerts.map(a => a.id === id ? { ...a, isRead: !a.isRead } : a);
    saveAlerts(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = alerts.map(a => 
      (a.department === department || a.department === 'all') ? { ...a, isRead: true } : a
    );
    saveAlerts(updated);
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const newItem: DepartmentAlertItem = {
      id: 'alt-' + Date.now().toString(36),
      department,
      title: newTitle.trim(),
      message: newMessage.trim(),
      severity: newSeverity,
      category: 'periodic_task',
      categoryLabel: 'تنبيه إداري داخلي',
      createdAt: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString('ar-EG'),
      dueDate: newDueDate || undefined,
      isRead: false,
    };

    saveAlerts([newItem, ...alerts]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewMessage('');
    setNewDueDate('');
  };

  const departmentAlerts = useMemo(() => {
    return alerts.filter(a => a.department === department || a.department === 'all');
  }, [alerts, department]);

  const filteredAlerts = useMemo(() => {
    return departmentAlerts.filter(a => {
      const matchSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
      const matchStatus = 
        filterStatus === 'all' ? true : 
        filterStatus === 'unread' ? !a.isRead : a.isRead;
      return matchSeverity && matchStatus;
    });
  }, [departmentAlerts, filterSeverity, filterStatus]);

  const unreadCount = useMemo(() => {
    return departmentAlerts.filter(a => !a.isRead).length;
  }, [departmentAlerts]);

  const criticalCount = useMemo(() => {
    return departmentAlerts.filter(a => a.severity === 'critical' && !a.isRead).length;
  }, [departmentAlerts]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="relative">
              <Bell className="w-6 h-6 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
              )}
            </div>
            <h2 className="text-lg font-bold text-white">
              لوحة تنبيهات وإشعارات {meta.title}
            </h2>
            <div className="flex items-center gap-1.5 mr-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {unreadCount} تنبيه نشط
              </span>
              {criticalCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  {criticalCount} حرج
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400">
            مركز المتابعة الحية للتنبيهات العاجلة، المهام المتأخرة، متطلبات الصيانة الدورية واشتراطات السلامة.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              تعيين الكل كمقروء
            </button>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة تنبيه داخلي</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">مستوى الخطورة:</span>
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filterSeverity === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل ({departmentAlerts.length})
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filterSeverity === 'critical' ? 'bg-rose-600 text-white' : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              حرج
            </button>
            <button
              onClick={() => setFilterSeverity('warning')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filterSeverity === 'warning' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              تحذير
            </button>
            <button
              onClick={() => setFilterSeverity('info')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filterSeverity === 'info' ? 'bg-blue-600 text-white' : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              معلوماتي
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">حالة القراءة:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-xs text-white px-2.5 py-1 rounded-lg focus:outline-none focus:border-amber-500"
          >
            <option value="all">كافة الحالات</option>
            <option value="unread">غير مقروء فقط ({unreadCount})</option>
            <option value="read">المقروءة سابقاً</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-200 mb-1">لا توجد تنبيهات نشطة حالياً</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              ممتاز! جميع مؤشرات ومتطلبات {meta.title} مستوفاة ولا توجد إجراءات حرجة متأخرة.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all shadow-md relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  alert.isRead 
                    ? 'bg-slate-900/60 border-slate-800/80 opacity-75' 
                    : isCritical
                    ? 'bg-rose-950/25 border-rose-500/50 shadow-rose-950/20'
                    : isWarning
                    ? 'bg-amber-950/25 border-amber-500/50 shadow-amber-950/20'
                    : 'bg-blue-950/25 border-blue-500/50 shadow-blue-950/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    isCritical 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                      : isWarning
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}>
                    {isCritical ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isCritical
                          ? 'bg-rose-500 text-white'
                          : isWarning
                          ? 'bg-amber-500 text-slate-950 font-black'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {isCritical ? 'حرج وعاجل' : isWarning ? 'تحذير هام' : 'تنبيه دوري'}
                      </span>
                      <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {alert.categoryLabel}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {alert.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                      {alert.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 font-mono">
                      <span>التاريخ: {alert.dateStr}</span>
                      {alert.dueDate && (
                        <span className="text-amber-400 font-bold">
                          الموعد النهائي: {alert.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                  {alert.actionLabel && alert.actionSubTab && onNavigateSubTab && (
                    <button
                      onClick={() => onNavigateSubTab(alert.actionSubTab!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer shadow"
                    >
                      <span>{alert.actionLabel}</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleRead(alert.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      alert.isRead
                        ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        : 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                    }`}
                  >
                    {alert.isRead ? 'إعادة كغير مقروء' : 'تمت المراجعة'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Alert Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">إضافة تنبيه داخلي للإدارة</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  عنوان التنبيه:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: موعد فحص صمامات الأمان أو تدقيق السجلات"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    درجة الخطورة:
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as AlertSeverity)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="critical">حرج وعاجل (أحمر)</option>
                    <option value="warning">تحذير هام (أصفر)</option>
                    <option value="info">معلوماتي وتذكيري (أزرق)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    الموعد النهائي للتنفيذ:
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  نص التنبيه والملاحظات التفصيلية:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="اكتب التوجيهات أو أسباب التنبيه بدقة ليطلع عليها الفريق..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20"
                >
                  نشر التنبيه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
