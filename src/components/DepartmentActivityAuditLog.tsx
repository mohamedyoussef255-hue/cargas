import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar,
  Tag,
  AlertCircle,
  FileText,
  Share2,
  X,
  Sparkles
} from 'lucide-react';
import { DepartmentRole, DepartmentActivityLogItem } from '../types';
import { DEPARTMENTS_METADATA, DEPARTMENT_ROLE_SPECS } from '../data/departmentCustomFields';
import { loadActivityLogs, logDepartmentActivity, saveActivityLogs } from '../data/authCredentials';

interface DepartmentActivityAuditLogProps {
  department: DepartmentRole;
  onExit?: () => void;
}

export const DepartmentActivityAuditLog: React.FC<DepartmentActivityAuditLogProps> = ({
  department,
  onExit
}) => {
  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;
  const gmTitle = DEPARTMENT_ROLE_SPECS[department]?.gmTitle || meta.title;
  const [logs, setLogs] = useState<DepartmentActivityLogItem[]>(() => loadActivityLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);

  // New entry form state
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newActorName, setNewActorName] = useState(gmTitle);
  const [newActionType, setNewActionType] = useState<DepartmentActivityLogItem['actionType']>('task_assigned');
  const [newRecipient, setNewRecipient] = useState('');

  // Department specific logs
  const departmentLogs = useMemo(() => {
    return logs.filter(l => l.department === department);
  }, [logs, department]);

  const filteredLogs = useMemo(() => {
    return departmentLogs.filter(log => {
      const matchSearch = 
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.recipientName && log.recipientName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchType = actionTypeFilter === 'all' || log.actionType === actionTypeFilter;

      return matchSearch && matchType;
    });
  }, [departmentLogs, searchQuery, actionTypeFilter]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetails.trim()) return;

    const created = logDepartmentActivity({
      department,
      departmentName: meta.title,
      actorName: newActorName.trim() || 'مسؤول الإدارة',
      actorRole: 'general_manager',
      actionType: newActionType,
      title: newTitle.trim(),
      details: newDetails.trim(),
      recipientName: newRecipient.trim() || undefined
    });

    setLogs(loadActivityLogs());
    setIsNewEntryModalOpen(false);
    setNewTitle('');
    setNewDetails('');
    setNewRecipient('');
  };

  const handleExportCsv = () => {
    const headers = ['التاريخ', 'الوقت', 'نوع الإجراء', 'عنوان النشاط', 'التفاصيل', 'المنفذ', 'المستلم'];
    const rows = filteredLogs.map(l => [
      l.dateStr,
      l.timeStr,
      l.actionType,
      `"${l.title.replace(/"/g, '""')}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.actorName.replace(/"/g, '""')}"`,
      `"${(l.recipientName || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `سجل_نشاط_${department}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (type: DepartmentActivityLogItem['actionType']) => {
    switch (type) {
      case 'task_assigned':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">تكليف مهمة</span>;
      case 'form_updated':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">تحديث استمارة</span>;
      case 'message_sent':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">مراسلة / توجيه</span>;
      case 'camera_session_saved':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">رصد كاميرا</span>;
      case 'login':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">دخول المنظومة</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">إجراء إداري</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-6 h-6 text-sky-400" />
            <h2 className="text-lg font-bold text-white">
              سجل نشاط وتكليفات {meta.title}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
              {filteredLogs.length} قيد نشاط
            </span>
          </div>
          <p className="text-xs text-slate-400">
            سجل إلكتروني معتمد يوثق كافة التعديلات، التكليفات الميدانية، والمراسلات الرسمية باليوم والساعة.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsNewEntryModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-sky-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل نشاط جديد</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title="تصدير السجل بتنسيق Excel / CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">تصدير CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title="طباعة السجل الرسمي"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">طباعة</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في سجل الأنشطة والمنفذين..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">نوع الإجراء:</span>
          <select
            value={actionTypeFilter}
            onChange={(e) => setActionTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg text-xs text-white px-3 py-1.5 focus:outline-none focus:border-sky-500"
          >
            <option value="all">كافة الإجراءات ({departmentLogs.length})</option>
            <option value="task_assigned">تكليفات المهام</option>
            <option value="form_updated">تحديث الاستمارات</option>
            <option value="message_sent">توجيهات ومراسلات</option>
            <option value="camera_session_saved">جلسات الكاميرا الميدانية</option>
            <option value="login">تسجيلات الدخول</option>
          </select>
        </div>
      </div>

      {/* Timeline of Activities */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-300 mb-1">لا توجد سجلات نشاط مطابقة</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              لم يتم العثور على أية قيود نشاط تطابق خيارات البحث الحالية. يمكنك إضافة قيد نشاط جديد بضغطة زر.
            </p>
          </div>
        ) : (
          <div className="relative border-r-2 border-slate-800 pr-4 space-y-4 mr-2">
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className="relative bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 transition-all shadow-md group"
              >
                {/* Node indicator on the timeline */}
                <div className="absolute -right-[23px] top-4 w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-slate-950" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getActionBadge(log.actionType)}
                    <h4 className="text-sm font-bold text-white">{log.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{log.dateStr}</span>
                    <Clock className="w-3.5 h-3.5 text-amber-400 ml-1" />
                    <span className="text-amber-300">{log.timeStr}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {log.details}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <User className="w-3 h-3 text-sky-400" />
                      المنفذ: <strong className="text-white">{log.actorName}</strong>
                    </span>
                    {log.recipientName && (
                      <span className="inline-flex items-center gap-1 text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        المستلم / المعني: {log.recipientName}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {log.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Activity Entry Modal */}
      {isNewEntryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">تسجيل قيد نشاط جديد للإدارة</h3>
              </div>
              <button 
                onClick={() => setIsNewEntryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  عنوان النشاط أو الإجراء:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: معاينة ضواغط المحطة أو إصدار مذكرة التراخيص"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    تصنيف الإجراء:
                  </label>
                  <select
                    value={newActionType}
                    onChange={(e) => setNewActionType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="task_assigned">تكليف مهمة ميدانية</option>
                    <option value="form_updated">تحديث استمارة مطابقة</option>
                    <option value="message_sent">توجيه إداري / مراسلة</option>
                    <option value="camera_session_saved">رصد كاميرا ميدانية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    اسم المنفذ (المسؤول):
                  </label>
                  <input
                    type="text"
                    value={newActorName}
                    onChange={(e) => setNewActorName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  المستلم أو الجهة المعنية (اختياري):
                </label>
                <input
                  type="text"
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  placeholder="مثال: م. أحمد عبد الفتاح أو مقاول الأعمال المدنية"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  تفاصيل وملاحظات الإجراء:
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="اكتب تفاصيل الإجراء أو التوصية الفنية بدقة للتوثيق المعتمد..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewEntryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30"
                >
                  حفظ وتوثيق الإجراء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
