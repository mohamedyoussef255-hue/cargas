import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Edit2, 
  Check, 
  X, 
  RotateCcw, 
  ShieldCheck, 
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DepartmentRole } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import { 
  CameraInspectionTask, 
  loadAllCameraTasks, 
  addCameraTask, 
  updateCameraTaskLabel, 
  toggleCameraTaskVisibility, 
  deleteCameraTask, 
  resetCameraTasksToDefault,
  EVENT_CAMERA_TASKS_UPDATED 
} from '../utils/cameraTasksConfig';

interface AdminCameraTasksManagerProps {
  initialDepartment?: DepartmentRole | 'all';
  isEmbedded?: boolean;
  onClose?: () => void;
}

export const AdminCameraTasksManager: React.FC<AdminCameraTasksManagerProps> = ({
  initialDepartment = 'all',
  isEmbedded = false,
  onClose
}) => {
  const [tasks, setTasks] = useState<CameraInspectionTask[]>(() => loadAllCameraTasks());
  const [selectedDept, setSelectedDept] = useState<DepartmentRole | 'all'>(initialDepartment);
  const [newTaskLabel, setNewTaskLabel] = useState<string>('');
  const [newTaskDept, setNewTaskDept] = useState<DepartmentRole | 'all'>(initialDepartment === 'all' ? 'operations' : initialDepartment);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setTasks(loadAllCameraTasks());
    };
    window.addEventListener(EVENT_CAMERA_TASKS_UPDATED, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_CAMERA_TASKS_UPDATED, handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const filteredTasks = tasks.filter(t => {
    if (selectedDept === 'all') return true;
    return t.department === selectedDept || t.department === 'all';
  });

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskLabel.trim()) return;
    addCameraTask(newTaskDept, newTaskLabel.trim());
    setNewTaskLabel('');
    showToast('تمت إضافة بند المعاينة الجديد بجانب الكاميرا بنجاح.');
  };

  const handleStartEdit = (task: CameraInspectionTask) => {
    setEditingTaskId(task.id);
    setEditingLabel(task.label);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingLabel.trim()) return;
    updateCameraTaskLabel(id, editingLabel.trim());
    setEditingTaskId(null);
    showToast('تم تعديل نص بند الكاميرا بنجاح.');
  };

  const handleToggleVisibility = (id: string, currentVisible: boolean) => {
    toggleCameraTaskVisibility(id);
    showToast(currentVisible ? 'تم إخفاء البند من واجهة الكاميرا للمستخدمين.' : 'تم إظهار البند بجانب الكاميرا.');
  };

  const handleDelete = (id: string, label: string) => {
    if (window.confirm(`هل أنت متأكد من إزالة هذا البند نهائياً؟\n"${label}"`)) {
      deleteCameraTask(id);
      showToast('تم حذف البند نهائياً.');
    }
  };

  const handleReset = () => {
    if (window.confirm('هل تريد استعادة بنود الكاميرا الافتراضية لكافة الإدارات؟')) {
      const reset = resetCameraTasksToDefault();
      setTasks(reset);
      showToast('تمت استعادة البنود القياسية الافتراضية.');
    }
  };

  const deptList: { key: DepartmentRole | 'all'; title: string }[] = [
    { key: 'all', title: 'كافة الإدارات' },
    { key: 'operations', title: 'التشغيل والصيانة' },
    { key: 'projects', title: 'المشروعات والتنفيذ' },
    { key: 'hse', title: 'الأمن الصناعي والسلامة' },
    { key: 'technical', title: 'الإدارة الفنية' },
    { key: 'marketing', title: 'التسويق وتطوير الأعمال' },
    { key: 'financial', title: 'الشئون المالية والمراجعة' },
    { key: 'legal', title: 'الإدارة القانونية' },
    { key: 'licensing', title: 'التراخيص والموافقات' },
  ];

  return (
    <div className={`space-y-4 ${isEmbedded ? '' : 'p-4 sm:p-6 bg-slate-900 border border-slate-800 rounded-3xl'}`}>
      
      {/* Toast Notice */}
      {successToast && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center justify-between text-emerald-300 text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>تحكم مدير النظام في مهام وبنود كاميرا الرصد الميداني</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                تحكم شامل
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              إضافة وتعديل وإخفاء وإظهار وإزالة العناصر والمهام التي تظهر لمهندسي وفرق عمل كل إدارة بجانب الكاميرا.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="استعادة بنود الكاميرا الافتراضية"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>استعادة الافتراضي</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {deptList.map(d => (
          <button
            key={d.key}
            type="button"
            onClick={() => {
              setSelectedDept(d.key);
              if (d.key !== 'all') setNewTaskDept(d.key);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedDept === d.key
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {d.title}
          </button>
        ))}
      </div>

      {/* Add New Task Form */}
      <form onSubmit={handleAddNewTask} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="sm:w-48 shrink-0">
          <select
            value={newTaskDept}
            onChange={(e) => setNewTaskDept(e.target.value as DepartmentRole | 'all')}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="operations">التشغيل والصيانة</option>
            <option value="projects">المشروعات والتنفيذ</option>
            <option value="hse">الأمن الصناعي والسلامة</option>
            <option value="technical">الإدارة الفنية</option>
            <option value="marketing">التسويق والمبيعات</option>
            <option value="financial">الشئون المالية</option>
            <option value="legal">الشئون القانونية</option>
            <option value="licensing">التراخيص</option>
            <option value="all">كافة الإدارات (عام)</option>
          </select>
        </div>

        <input
          type="text"
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
          placeholder="اكتب اسم المهمة / عنصر الفحص المطلوب ظهوره بجانب الكاميرا..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />

        <button
          type="submit"
          disabled={!newTaskLabel.trim()}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-amber-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة للمهام</span>
        </button>
      </form>

      {/* Tasks List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>بنود الفحص الحالية ({filteredTasks.length} بند):</span>
          <span>الحالة والأدوات (تعديل • إخفاء/إظهار • إزالة)</span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            لا توجد بنود مسجلة لهذا القسم حالياً. أضف بنداً جديداً بالأعلى.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => {
              const deptMeta = task.department === 'all' 
                ? { title: 'كافة الإدارات', badge: 'عام' } 
                : (DEPARTMENTS_METADATA[task.department] || { title: task.department, badge: task.department });
              const isEditing = editingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    task.isVisible
                      ? 'bg-slate-950/80 border-slate-800'
                      : 'bg-slate-950/40 border-slate-800/50 opacity-60'
                  }`}
                >
                  {/* Task Label & Dept Badge */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-bold shrink-0">
                      {deptMeta.title}
                    </span>

                    {isEditing ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={editingLabel}
                          onChange={(e) => setEditingLabel(e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-amber-500 text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(task.id)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs"
                          title="حفظ"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTaskId(null)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                          title="إلغاء"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs font-medium truncate ${task.isVisible ? 'text-white' : 'text-slate-500 line-through'}`}>
                        {task.label}
                      </span>
                    )}
                  </div>

                  {/* Actions (تعديل - اخفاء/اظهار - إزالة) */}
                  {!isEditing && (
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      {/* Hide/Show Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleVisibility(task.id, task.isVisible)}
                        className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                          task.isVisible
                            ? 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                        }`}
                        title={task.isVisible ? "إخفاء هذا البند من الكاميرا" : "إظهار هذا البند بجانب الكاميرا"}
                      >
                        {task.isVisible ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="text-[11px]">{task.isVisible ? 'ظاهر' : 'مخفي'}</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(task)}
                        className="p-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/30 text-xs transition-colors cursor-pointer"
                        title="تعديل نص البند"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(task.id, task.label)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 text-xs transition-colors cursor-pointer"
                        title="إزالة وحذف هذا البند"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
