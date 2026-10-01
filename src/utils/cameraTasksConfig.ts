import { DepartmentRole } from '../types';

export interface CameraInspectionTask {
  id: string;
  department: DepartmentRole | 'all';
  label: string;
  isVisible: boolean;
  order: number;
}

const STORAGE_KEY_CAMERA_TASKS = 'cargas_camera_tasks_config_v2';

export const DEFAULT_CAMERA_TASKS: Record<string, { id: string; label: string }[]> = {
  operations: [
    { id: 'ops_1', label: 'رصد مكان ضاغط الغاز الرئيسي ومسافات الارتداد' },
    { id: 'ops_2', label: 'بيان مواصفات الضاغط (1000 - 1500 م³/ساعة - 250 بار)' },
    { id: 'ops_3', label: 'رصد أماكن موزعات الغاز (Dispensers) وجزر التموين' },
    { id: 'ops_4', label: 'رصد وتصوير بنوك الأسطوانات ومصفوفات التخزين (Cascades)' },
    { id: 'ops_5', label: 'رصد لوحة التحكم الكهربائية وغرفة التحكم والمراقبة (MCC)' },
    { id: 'ops_6', label: 'بيان وتصوير خطوط السحب والطرد ونظام التبريد والتهوية' },
  ],
  projects: [
    { id: 'proj_1', label: 'رفع مساحي دقيق للمكان وتحديد إحداثيات الحدود والأركان' },
    { id: 'proj_2', label: 'مطابقة الخرائط الهندسية والمخطط العام المعتمد (Layout Plan)' },
    { id: 'proj_3', label: 'قياس أبعاد الأرض الفعلية (الطول × العرض) وإجمالي المساحة' },
    { id: 'proj_4', label: 'فحص الشوارع المحيطة ومحاور الدخول والخروج وعروض الحارات' },
    { id: 'proj_5', label: 'فحص مناسيب الموقع وتسوية الأرض واختبارات التربة والأساسات' },
    { id: 'proj_6', label: 'رصد وتوثيق القواعد الخرسانية المسلحة للضاغط والمظلة' },
  ],
  hse: [
    { id: 'hse_1', label: 'رصد منظومة السلامة والصحة المهنية والأمن الصناعي أثناء التنفيذ' },
    { id: 'hse_2', label: 'فحص ومطابقة مسافات الأمان القياسية طبقاً لكود NFPA 52' },
    { id: 'hse_3', label: 'رصد وتجربة كواشف الغاز الطبيعي (Gas Detectors)' },
    { id: 'hse_4', label: 'رصد كواشف اللهب والأشعة تحت وفوق الحمراء UV/IR' },
    { id: 'hse_5', label: 'فحص محابس وصمامات الغلق السريع في الطوارئ (ESD Valves)' },
    { id: 'hse_6', label: 'منظومة مكافحة الحريق ومدافع البودرة ومسارات الهروب والإخلاء' },
  ],
  technical: [
    { id: 'tech_1', label: 'رصد موقع محطة تخفيض الضغط والقياس (PRS)' },
    { id: 'tech_2', label: 'نقطة الربط على خط الغاز الطبيعي المغذي وبيان الضغط' },
    { id: 'tech_3', label: 'عدادات قياس التدفق والحجم والحرارة القياسية' },
    { id: 'tech_4', label: 'اختبارات ضغوط النيتروجين وفحص تسريب الغاز' },
    { id: 'tech_5', label: 'منظومة المحابس والفلترة وخط التغذية الرئيسي' },
  ],
  marketing: [
    { id: 'mkt_1', label: 'رصد كثافة الحركة المرورية وتدفق المركبات أمام الموقع' },
    { id: 'mkt_2', label: 'معاينة الواجهة الإعلانية ورؤية لافتات كارجاس' },
    { id: 'mkt_3', label: 'حصر أساطيل التاكسي والميكروباص المترددة على المنطقة' },
  ],
  financial: [
    { id: 'fin_1', label: 'مطابقة الأصول الرأسمالية والمعدات المسلمة ميدانياً' },
    { id: 'fin_2', label: 'معاينة دفاتر التوريد وفواتير بنود التنفيذ بالمحطة' },
  ],
  legal: [
    { id: 'leg_1', label: 'مطابقة العقود وسندات الملكية والحدود الجغرافية' },
    { id: 'leg_2', label: 'فحص التراخيص المؤقتة وتصاريح الحفر المعتمدة' },
  ],
  licensing: [
    { id: 'lic_1', label: 'معاينة مطابقة اشتراطات الحماية المدنية والتراخيص' },
    { id: 'lic_2', label: 'فحص موافقات البيئة والوحدات المحلية بالمحافظة' },
  ]
};

export const EVENT_CAMERA_TASKS_UPDATED = 'cargas_camera_tasks_updated';

// Initialize default tasks config if not already stored
export const loadAllCameraTasks = (): CameraInspectionTask[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMERA_TASKS);
    if (raw) {
      const parsed: CameraInspectionTask[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error loading camera tasks from localStorage:', err);
  }

  // Generate initial default array from default items
  const initialTasks: CameraInspectionTask[] = [];
  let orderCounter = 1;

  Object.entries(DEFAULT_CAMERA_TASKS).forEach(([deptKey, items]) => {
    items.forEach((item) => {
      initialTasks.push({
        id: item.id,
        department: deptKey as DepartmentRole,
        label: item.label,
        isVisible: true,
        order: orderCounter++
      });
    });
  });

  try {
    localStorage.setItem(STORAGE_KEY_CAMERA_TASKS, JSON.stringify(initialTasks));
  } catch {}

  return initialTasks;
};

// Load tasks for a specific department (visible only, or all if requested)
export const loadDepartmentCameraTasks = (
  department: DepartmentRole,
  includeHidden: boolean = false
): CameraInspectionTask[] => {
  const allTasks = loadAllCameraTasks();
  return allTasks.filter(t => {
    const matchesDept = t.department === department || t.department === 'all';
    if (!matchesDept) return false;
    return includeHidden ? true : t.isVisible !== false;
  }).sort((a, b) => (a.order || 0) - (b.order || 0));
};

// Save updated tasks list
export const saveCameraTasks = (tasks: CameraInspectionTask[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CAMERA_TASKS, JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent(EVENT_CAMERA_TASKS_UPDATED, { detail: tasks }));
  } catch (err) {
    console.error('Failed to save camera tasks:', err);
  }
};

// Add new task
export const addCameraTask = (
  department: DepartmentRole | 'all',
  label: string
): CameraInspectionTask => {
  const tasks = loadAllCameraTasks();
  const newTask: CameraInspectionTask = {
    id: `cam_task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    department,
    label: label.trim(),
    isVisible: true,
    order: tasks.length + 1
  };
  const updated = [...tasks, newTask];
  saveCameraTasks(updated);
  return newTask;
};

// Update task label
export const updateCameraTaskLabel = (id: string, newLabel: string): void => {
  const tasks = loadAllCameraTasks();
  const updated = tasks.map(t => t.id === id ? { ...t, label: newLabel.trim() } : t);
  saveCameraTasks(updated);
};

// Toggle visibility (إخفاء / إظهار)
export const toggleCameraTaskVisibility = (id: string): void => {
  const tasks = loadAllCameraTasks();
  const updated = tasks.map(t => t.id === id ? { ...t, isVisible: !t.isVisible } : t);
  saveCameraTasks(updated);
};

// Delete/Remove task (إزالة)
export const deleteCameraTask = (id: string): void => {
  const tasks = loadAllCameraTasks();
  const updated = tasks.filter(t => t.id !== id);
  saveCameraTasks(updated);
};

// Reset to factory defaults
export const resetCameraTasksToDefault = (): CameraInspectionTask[] => {
  try {
    localStorage.removeItem(STORAGE_KEY_CAMERA_TASKS);
  } catch {}
  return loadAllCameraTasks();
};
