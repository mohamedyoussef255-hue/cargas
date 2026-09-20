import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  User,
  Filter,
  RefreshCw,
  Search,
  ListTodo,
  CheckSquare,
  Square,
  Flame,
  MessageSquare
} from 'lucide-react';
import { DepartmentRole, PeriodicTaskItem, TaskRecurrenceFrequency, TaskExecutionStatus } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import { INITIAL_PERIODIC_TASKS } from '../data/departmentPeriodicTasksData';

export function loadDepartmentTasks(): PeriodicTaskItem[] {
  try {
    const saved = localStorage.getItem('cargas_periodic_tasks_v1');
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_PERIODIC_TASKS;
}

interface DepartmentPeriodicTasksSchedulerProps {
  department: DepartmentRole;
  onSendWhatsAppTask?: (task: PeriodicTaskItem) => void;
}

export const DepartmentPeriodicTasksScheduler: React.FC<DepartmentPeriodicTasksSchedulerProps> = ({
  department,
  onSendWhatsAppTask
}) => {
  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;

  // Local state initialized with department tasks
  const [tasks, setTasks] = useState<PeriodicTaskItem[]>(() => {
    return INITIAL_PERIODIC_TASKS.filter(t => t.department === department);
  });

  const [frequencyFilter, setFrequencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskFrequency, setNewTaskFrequency] = useState<TaskRecurrenceFrequency>('weekly');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [newTaskAssignedPhone, setNewTaskAssignedPhone] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'normal'>('high');

  // Filtered tasks
  const filteredTasks = tasks.filter(t => {
    if (frequencyFilter !== 'all' && t.frequency !== frequencyFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchTerm) {
      const match = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.category.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const scheduledTasks = tasks.filter(t => t.status === 'scheduled').length;

  // Toggle status
  const handleToggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (t.status === 'completed') {
        return { ...t, status: 'in_progress' };
      }
      return {
        ...t,
        status: 'completed',
        lastExecutedDate: new Date().toISOString().split('T')[0],
        completedAt: new Date().toLocaleDateString('ar-EG')
      };
    }));
  };

  // Add task handler
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !newTaskAssignedTo.trim()) return;

    const freqLabels: Record<TaskRecurrenceFrequency, string> = {
      daily: 'يومي',
      weekly: 'أسبوعي',
      monthly: 'شهري',
      quarterly: 'ربع سنوي',
      semi_annual: 'نصف سنوي',
      annual: 'سنوي'
    };

    const task: PeriodicTaskItem = {
      id: `pt-custom-${Date.now()}`,
      department,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'مهمة دورية معتمدة لإدارة ' + meta.title,
      category: newTaskCategory.trim() || 'مهام دورية عامة',
      frequency: newTaskFrequency,
      frequencyLabel: freqLabels[newTaskFrequency],
      assignedTo: newTaskAssignedTo.trim(),
      assignedPhone: newTaskAssignedPhone.trim(),
      dueDate: newTaskDueDate,
      nextScheduledDate: newTaskDueDate,
      status: 'scheduled',
      priority: newTaskPriority,
      notes: 'تمت إضافتها بواسطة مدير الإدارة'
    };

    setTasks(prev => [task, ...prev]);
    setIsAddModalOpen(false);

    // Reset
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskCategory('');
    setNewTaskAssignedTo('');
    setNewTaskAssignedPhone('');
  };

  // WhatsApp Task Dispatch
  const handleDispatchWhatsApp = (task: PeriodicTaskItem) => {
    const text = `*تكليف مهمة دورية معتمدة - ${meta.title}*\n` +
      `*شركة كارجاس للغاز الطبيعي NGV*\n\n` +
      `الأستاذ / المهندس: *${task.assignedTo}* المحترم،\n\n` +
      `تحية طيبة وبعد،،،\n` +
      `يرجى التكرم بتنفيذ المهمة الدورية المجدولة التالية:\n\n` +
      `📌 *عنوان المهمة:* ${task.title}\n` +
      `📋 *التصنيف:* ${task.category}\n` +
      `🔄 *التكرار الدوري:* ${task.frequencyLabel}\n` +
      `📅 *الموعد المحدد للتسليم:* ${task.dueDate}\n` +
      `⚡ *الأولوية:* ${task.priority === 'high' ? 'عالية ومستعجلة' : task.priority === 'medium' ? 'متوسطة' : 'عادية'}\n\n` +
      `📝 *التفاصيل:* ${task.description}\n\n` +
      `يرجى توثيق إنجاز المهمة وتسجيل الملاحظات بالمنظومة فور الانتهاء.\n` +
      `شاكرين حسن تعاونكم،\n` +
      `إدارة ${meta.title} • كارجاس 19544`;

    const cleanPhone = (task.assignedPhone || '').replace(/[^0-9]/g, '');
    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5 text-blue-400" />
                <span>جدولة المهام الدورية والوقائية المعتمدة</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {meta.title}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              جدول المهام والتفتيشات الدورية للإدارة
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              تنظيم ومتابعة التكليفات اليومية والأسبوعية والشهرية، مع إمكانية إرسال التكليف مباشرة لمهندسي وفنيي الإدارة عبر الواتساب وتوثيق الإنجاز.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مهمة دورية جديدة</span>
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block font-medium">إجمالي المهام المجدولة</span>
            <span className="text-xl font-mono font-bold text-white mt-1 block">{totalTasks}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-emerald-400 block font-medium">مكتملة وموثقة</span>
            <span className="text-xl font-mono font-bold text-emerald-400 mt-1 block">{completedTasks}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-blue-400 block font-medium">قيد التنفيذ الميداني</span>
            <span className="text-xl font-mono font-bold text-blue-400 mt-1 block">{inProgressTasks}</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-amber-400 block font-medium">مجدولة للموعد القادم</span>
            <span className="text-xl font-mono font-bold text-amber-400 mt-1 block">{scheduledTasks}</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="بحث في اسم المهمة أو المسؤول..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>التكرار:</span>
          </span>
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">كافة التكرارات</option>
            <option value="daily">يومي</option>
            <option value="weekly">أسبوعي</option>
            <option value="monthly">شهري</option>
            <option value="quarterly">ربع سنوي</option>
          </select>

          <span className="text-xs text-slate-400 whitespace-nowrap mr-2">الحالة:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">كافة الحالات</option>
            <option value="scheduled">مجدولة</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="completed">مكتملة</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-8 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-400 font-medium">لا توجد مهام دورية مطابقة لمعايير البحث الحالية.</p>
            <button
              onClick={() => { setFrequencyFilter('all'); setStatusFilter('all'); setSearchTerm(''); }}
              className="text-xs text-blue-400 hover:underline cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                className={`bg-slate-900 border rounded-xl p-4 transition-all shadow-sm ${
                  isDone 
                    ? 'border-emerald-500/30 bg-slate-900/60' 
                    : isInProgress 
                    ? 'border-blue-500/40 bg-slate-900/90' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                      title={isDone ? 'تغيير الحالة إلى قيد التنفيذ' : 'تعليم كمكتملة وموثقة'}
                    >
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          task.frequency === 'daily'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : task.frequency === 'weekly'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        }`}>
                          {task.frequencyLabel}
                        </span>

                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {task.category}
                        </span>

                        {task.priority === 'high' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                            <Flame className="w-3 h-3 text-rose-400" />
                            <span>أولوية قصوى</span>
                          </span>
                        )}

                        {isDone && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>مكتملة</span>
                          </span>
                        )}
                      </div>

                      <h3 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                        {task.description}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 flex-wrap font-medium">
                        <span className="flex items-center gap-1 text-slate-300">
                          <User className="w-3.5 h-3.5 text-blue-400" />
                          <span>المسؤول: <strong>{task.assignedTo}</strong></span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>الموعد المحدد: <strong className="font-mono text-slate-200">{task.dueDate}</strong></span>
                        </span>
                        {task.lastExecutedDate && (
                          <span className="text-slate-400">
                            آخر تنفيذ: {task.lastExecutedDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleDispatchWhatsApp(task)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm hover:scale-105"
                      title="إرسال تفاصيل المهمة للمسؤول عبر الواتساب"
                    >
                      <Send className="w-3 h-3 text-emerald-400" />
                      <span>إرسال بالواتساب</span>
                    </button>

                    <button
                      onClick={() => handleToggleTaskStatus(task.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        isDone 
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      {isDone ? 'إعادة فتح' : 'توثيق الإنجاز'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>جدولة مهمة دورية جديدة لـ {meta.title}</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">عنوان المهمة الدورية *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الفحص الأسبوعي لصمامات الأمان..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">التكرار الدوري *</label>
                  <select
                    value={newTaskFrequency}
                    onChange={(e) => setNewTaskFrequency(e.target.value as TaskRecurrenceFrequency)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="daily">يومي</option>
                    <option value="weekly">أسبوعي</option>
                    <option value="monthly">شهري</option>
                    <option value="quarterly">ربع سنوي</option>
                    <option value="semi_annual">نصف سنوي</option>
                    <option value="annual">سنوي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">التصنيف الفني</label>
                  <input
                    type="text"
                    placeholder="مثال: أمن صناعي، صيانة وقائية..."
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">المسؤول المكلف *</label>
                  <input
                    type="text"
                    required
                    placeholder="اسم المهندس أو الفني..."
                    value={newTaskAssignedTo}
                    onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">رقم هاتف الواتساب</label>
                  <input
                    type="text"
                    placeholder="+2010xxxxxxxx"
                    value={newTaskAssignedPhone}
                    onChange={(e) => setNewTaskAssignedPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">تاريخ الموعد المستهدف *</label>
                  <input
                    type="date"
                    required
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">الأولوية</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="high">عالية ومستعجلة</option>
                    <option value="medium">متوسطة</option>
                    <option value="normal">عادية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">وصف المهمة والتعليمات الفنية</label>
                <textarea
                  rows={2}
                  placeholder="اكتب تعليمات التنفيذ واشتراطات السلامة..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  حفظ وجدولة المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
