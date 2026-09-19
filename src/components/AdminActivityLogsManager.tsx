import React, { useState } from 'react';
import { 
  History, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Share2, 
  MessageSquare, 
  CheckCircle2, 
  Camera, 
  Wrench, 
  Building2, 
  Flame, 
  Cpu, 
  FileCheck, 
  Scale, 
  BadgeDollarSign, 
  Users, 
  Download,
  Printer,
  RefreshCw
} from 'lucide-react';
import { DepartmentRole, DepartmentActivityLogItem } from '../types';
import { loadActivityLogs } from '../data/authCredentials';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';

export const AdminActivityLogsManager: React.FC = () => {
  const [logs, setLogs] = useState<DepartmentActivityLogItem[]>(() => loadActivityLogs());
  const [selectedDept, setSelectedDept] = useState<DepartmentRole | 'all'>('all');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshLogs = () => {
    setLogs(loadActivityLogs());
  };

  const filteredLogs = logs.filter(item => {
    const matchDept = selectedDept === 'all' || item.department === selectedDept;
    const matchType = selectedActionType === 'all' || item.actionType === selectedActionType;
    const query = searchQuery.trim().toLowerCase();
    const matchSearch = query === '' ||
      item.title.toLowerCase().includes(query) ||
      item.details.toLowerCase().includes(query) ||
      item.actorName.toLowerCase().includes(query) ||
      (item.recipientName && item.recipientName.toLowerCase().includes(query));
    return matchDept && matchType && matchSearch;
  });

  const getActionBadge = (type: DepartmentActivityLogItem['actionType']) => {
    switch (type) {
      case 'invite_sent':
        return { label: 'دعوة عبر الواتساب', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'task_assigned':
        return { label: 'تكليف مهام ميدانية', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'camera_session_saved':
        return { label: 'حفظ وتوثيق رصد بالكاميرا', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'message_sent':
        return { label: 'توجيه / رسالة داخلية', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'login':
        return { label: 'تسجيل دخول للإدارة', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      default:
        return { label: 'نشاط إداري', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const getDeptIcon = (dept: DepartmentRole) => {
    switch (dept) {
      case 'marketing': return <Share2 className="w-4 h-4 text-indigo-400" />;
      case 'operations': return <Wrench className="w-4 h-4 text-amber-400" />;
      case 'projects': return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'hse': return <Flame className="w-4 h-4 text-emerald-400" />;
      case 'technical': return <Cpu className="w-4 h-4 text-teal-400" />;
      case 'licensing': return <FileCheck className="w-4 h-4 text-orange-400" />;
      case 'legal': return <Scale className="w-4 h-4 text-purple-400" />;
      case 'financial': return <BadgeDollarSign className="w-4 h-4 text-cyan-400" />;
      default: return <Building2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              الرقابة المركزية الشاملة
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {filteredLogs.length} حركة مسجلة
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            سجل نشاط الإدارات والتكليفات الميدانية باليوم والتاريخ
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            رصد حي لكافة أنشطة مديري العموم، الدعوات، ورسائل التكليف المرسلة بالواتساب للمهندسين، وجلسات الرصد المصورة وتحديثات النماذج الميدانية.
          </p>
        </div>

        <button
          onClick={refreshLogs}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>تحديث السجل</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
        
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">كافة الإدارات</option>
            <option value="marketing">التسويق والدراسات الميدانية</option>
            <option value="operations">التشغيل والصيانة</option>
            <option value="projects">المشروعات والأعمال المدنية</option>
            <option value="hse">السلامة والأمن الصناعي</option>
            <option value="technical">الإدارة الفنية وضغوط الشبكات</option>
            <option value="licensing">التراخيص الحكومية</option>
            <option value="legal">الشئون القانونية والعقود</option>
            <option value="financial">الشئون المالية</option>
          </select>

          {/* Action Type Filter */}
          <select
            value={selectedActionType}
            onChange={(e) => setSelectedActionType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">كافة أنواع الأنشطة</option>
            <option value="task_assigned">تكليف مهام ميدانية</option>
            <option value="invite_sent">دعوات بالواتساب</option>
            <option value="camera_session_saved">حفظ جلسات رصد بالكاميرا</option>
            <option value="message_sent">رسائل وتوجيهات داخلية</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في تفاصيل النشاط أو الموظف المكلف..."
            className="w-full px-3 py-2 pr-8 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>

      {/* Logs Timeline List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
            <History className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-bold">لا توجد حركات مطابقة لمعايير البحث</p>
            <p className="text-xs text-slate-500">سيتم تسجيل أي رسائل دعوة أو تكليفات يقوم بها المدير العام فورياً هنا</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const badge = getActionBadge(log.actionType);
            const deptMeta = DEPARTMENTS_METADATA[log.department];

            return (
              <div
                key={log.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Main details */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {getDeptIcon(log.department)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-200">
                        {deptMeta?.title || log.departmentName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-white">
                      {log.title}
                    </h4>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                      {log.details}
                    </p>

                    {/* Target recipient info if available */}
                    {log.recipientName && (
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span>المستلم/المكلف: <strong className="text-slate-200">{log.recipientName}</strong></span>
                        {log.recipientPhone && <span>({log.recipientPhone})</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Day, Date and Time Column */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 shrink-0 text-right">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{log.dateStr}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-mono mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{log.timeStr}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    بواسطة: {log.actorName}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
