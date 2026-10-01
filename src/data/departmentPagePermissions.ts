import { DepartmentRole } from '../types';

export type DepartmentInternalPageId =
  | 'marketing_hub'        // منظومة تسويق المحطات ورادار الحركة وحصر المركبات (Marketing)
  | 'landowners'           // صفحة طلبات معاينة ملاك الأراضي والمحطات (Marketing)
  | 'form'                 // صفحة استمارة ومطابقة الموقع والاشتراطات الفنية
  | 'correspondence'       // صفحة المراسلات والمخاطبات الرسمية واستعجال PDF
  | 'camera'               // صفحة كاميرا الرصد الميداني والتوثيق الرقمي
  | 'kpis'                 // صفحة تقييم أداء الإدارة ومؤشرات الإنجاز (KPIs)
  | 'tasks'                // صفحة جدولة المهام والمتابعة الدورية
  | 'alerts'               // صفحة التنبيهات والمهام العاجلة (>48 ساعة)
  | 'reports'              // صفحة إعداد وطباعة التقارير الرسمية المؤتمتة
  | 'videos'               // صفحة مخزن وفيديوهات الرصد الميدانية الموثقة
  | 'logs'                 // صفحة سجل نشاط وتكليفات الإدارة الموثق
  | 'inspection'           // صفحة المعاينة الميدانية التخصصية للإدارة
  | 'guide';               // صفحة دليل الاستخدام التفاعلي لمنظومة كارجاس

export interface PageRoleVisibility {
  gm: boolean;    // ظهور الصفحة للمدير العام للإدارة
  staff: boolean; // ظهور الصفحة للموظفين والمهندسين
}

export interface DepartmentPageMetadata {
  id: DepartmentInternalPageId;
  title: string;
  shortTitle: string;
  description: string;
  category: 'core' | 'field' | 'executive' | 'marketing';
  iconName: string;
  isMarketingSpecific?: boolean;
}

export const ALL_DEPARTMENT_PAGES: DepartmentPageMetadata[] = [
  {
    id: 'marketing_hub',
    title: 'منظومة تسويق المحطات ورادار الحركة',
    shortTitle: 'رادار التسويق والمحطات',
    description: 'رادار المركبات والكثافة المرورية، دراسة الجدوى الاستهلاكية، وإدارة استهداف المركبات بالموقع',
    category: 'marketing',
    iconName: 'Sparkles',
    isMarketingSpecific: true,
  },
  {
    id: 'landowners',
    title: 'طلبات معاينة ملاك الأراضي والمحطات',
    shortTitle: 'طلبات الملاك',
    description: 'مراجعة استمارات ملاك الأراضي المتقدمين للشراكة وتوليد روابط المعاينة التفاعلية بالواتساب',
    category: 'marketing',
    iconName: 'FileCheck',
    isMarketingSpecific: true,
  },
  {
    id: 'form',
    title: 'استمارة ومطابقة الموقع والاشتراطات الفنية',
    shortTitle: 'استمارة الموقع',
    description: 'فحص الاشتراطات الفنية المعتمدة للإدارة، تسجيل مواصفات المحطة، وإدخال بيانات التقييم',
    category: 'core',
    iconName: 'FileText',
  },
  {
    id: 'inspection',
    title: 'المعاينة الميدانية التخصصية للإدارة',
    shortTitle: 'المعاينة الميدانية',
    description: 'إجراء معاينة ميدانية طبقاً لاختصاص الإدارة، رصد الجاهزية الفنية، واستخراج محضر المعاينة المعتمد',
    category: 'field',
    iconName: 'ClipboardCheck',
  },
  {
    id: 'camera',
    title: 'كاميرا الرصد الميداني والتوثيق الرقمي',
    shortTitle: 'كاميرا التوثيق',
    description: 'التقاط صور الموقع، فحص المعدات والأرض، إضافة ملاحظات الجاهزية وتوثيق الإحداثيات الجغرافية',
    category: 'field',
    iconName: 'Camera',
  },
  {
    id: 'tasks',
    title: 'جدولة المهام والمتابعة الدورية',
    shortTitle: 'جدولة المهام',
    description: 'تتبع مراحل التنفيذ، تواريخ الزيارات الميدانية الدورية، وتحديث تقارير الإنجاز اليومية',
    category: 'field',
    iconName: 'Calendar',
  },
  {
    id: 'alerts',
    title: 'التنبيهات والمهام العاجلة (> 48 ساعة)',
    shortTitle: 'التنبيهات العاجلة',
    description: 'تحديد البنود والمحطات التي تجاوزت المهلة، طلبات تعديل الاستمارة المعلقة، وتحديث الموقف فورياً',
    category: 'executive',
    iconName: 'AlertTriangle',
  },
  {
    id: 'reports',
    title: 'إعداد وطباعة التقارير الرسمية المؤتمتة',
    shortTitle: 'التقارير التنفيذية',
    description: 'توليد التقارير الميدانية الشاملة مع وضع القراءة المريح وخيارات الطباعة الرسمية المعتمدة',
    category: 'executive',
    iconName: 'Sparkles',
  },
  {
    id: 'videos',
    title: 'مخزن وفيديوهات الرصد الميدانية الموثقة',
    shortTitle: 'مخزن الفيديوهات',
    description: 'أرشيف التسجيلات المرئية للمواقع والمعدات، استعراض الفيديوهات، والبحث والتنزيل المباشر',
    category: 'field',
    iconName: 'Film',
  },
  {
    id: 'correspondence',
    title: 'المراسلات والمخاطبات الرسمية واستعجال PDF',
    shortTitle: 'المراسلات الرسمية',
    description: 'إدارة الخطابات الصادرة والواردة، خطابات الاستعجال الرسمية، والتنسيق المباشر بين الإدارات',
    category: 'core',
    iconName: 'Mail',
  },
  {
    id: 'kpis',
    title: 'تقييم أداء الإدارة ومؤشرات الإنجاز (KPIs)',
    shortTitle: 'مؤشرات الأداء (KPIs)',
    description: 'قياس نسب الامتثال والجاهزية، معدل سرعة الاستجابة للمخاطبات، ورادار كفاءة التدقيق الميداني',
    category: 'executive',
    iconName: 'Award',
  },
  {
    id: 'logs',
    title: 'سجل نشاط وتكليفات الإدارة الموثق',
    shortTitle: 'سجل النشاط',
    description: 'السجل الزمني المعتمد لجميع العمليات والقرارات والمخاطبات الصادرة والواردة باليوم والتاريخ',
    category: 'executive',
    iconName: 'History',
  },
  {
    id: 'guide',
    title: 'دليل الاستخدام التفاعلي لمنظومة كارجاس',
    shortTitle: 'دليل الاستخدام',
    description: 'شرح مفصل ومصور لمهام الإدارات في منظومة كارجاس، دورة حياة المحطة، وطريقة إنجاز المعاينات',
    category: 'core',
    iconName: 'BookOpen',
  },
];

export type DepartmentPagesPermissionsConfig = Record<string, Record<string, PageRoleVisibility>>;

export const STORAGE_KEY_DEPARTMENT_PERMISSIONS = 'cng_department_pages_permissions_v2';
export const EVENT_DEPARTMENT_PERMISSIONS_UPDATED = 'cng_department_page_permissions_updated';

// Default configuration:
// Note user's explicit specification:
// For marketing: marketing_hub is visible to GM (true) but HIDDEN from employees (false)!
export const DEFAULT_DEPARTMENT_PAGE_PERMISSIONS: DepartmentPagesPermissionsConfig = {
  marketing: {
    marketing_hub: { gm: true, staff: false }, // Requested explicitly by user!
    landowners: { gm: true, staff: false },
    form: { gm: true, staff: true },
    inspection: { gm: true, staff: true },
    camera: { gm: true, staff: true },
    tasks: { gm: true, staff: true },
    alerts: { gm: true, staff: true },
    reports: { gm: true, staff: true },
    videos: { gm: true, staff: true },
    correspondence: { gm: true, staff: true },
    kpis: { gm: true, staff: false },
    logs: { gm: true, staff: true },
    guide: { gm: true, staff: true },
  },
  projects: {
    form: { gm: true, staff: true },
    inspection: { gm: true, staff: true },
    camera: { gm: true, staff: true },
    tasks: { gm: true, staff: true },
    alerts: { gm: true, staff: true },
    reports: { gm: true, staff: true },
    videos: { gm: true, staff: true },
    correspondence: { gm: true, staff: true },
    kpis: { gm: true, staff: true },
    logs: { gm: true, staff: true },
    guide: { gm: true, staff: true },
  },
  operations: {
    form: { gm: true, staff: true },
    inspection: { gm: true, staff: true },
    camera: { gm: true, staff: true },
    tasks: { gm: true, staff: true },
    alerts: { gm: true, staff: true },
    reports: { gm: true, staff: true },
    videos: { gm: true, staff: true },
    correspondence: { gm: true, staff: true },
    kpis: { gm: true, staff: true },
    logs: { gm: true, staff: true },
    guide: { gm: true, staff: true },
  },
  hse: {
    form: { gm: true, staff: true },
    inspection: { gm: true, staff: true },
    camera: { gm: true, staff: true },
    tasks: { gm: true, staff: true },
    alerts: { gm: true, staff: true },
    reports: { gm: true, staff: true },
    videos: { gm: true, staff: true },
    correspondence: { gm: true, staff: true },
    kpis: { gm: true, staff: true },
    logs: { gm: true, staff: true },
    guide: { gm: true, staff: true },
  },
  technical: {
    form: { gm: true, staff: true },
    inspection: { gm: true, staff: true },
    camera: { gm: true, staff: true },
    tasks: { gm: true, staff: true },
    alerts: { gm: true, staff: true },
    reports: { gm: true, staff: true },
    videos: { gm: true, staff: true },
    correspondence: { gm: true, staff: true },
    kpis: { gm: true, staff: true },
    logs: { gm: true, staff: true },
    guide: { gm: true, staff: true },
  },
  licensing: {
    form: { gm: true, staff: true },
    inspection: { gm: true, staff: true },
    camera: { gm: true, staff: true },
    tasks: { gm: true, staff: true },
    alerts: { gm: true, staff: true },
    reports: { gm: true, staff: true },
    videos: { gm: true, staff: true },
    correspondence: { gm: true, staff: true },
    kpis: { gm: true, staff: true },
    logs: { gm: true, staff: true },
    guide: { gm: true, staff: true },
  },
  legal: {
    form: { gm: true, staff: true },
    inspection: { gm: true, staff: true },
    camera: { gm: true, staff: true },
    tasks: { gm: true, staff: true },
    alerts: { gm: true, staff: true },
    reports: { gm: true, staff: true },
    videos: { gm: true, staff: true },
    correspondence: { gm: true, staff: true },
    kpis: { gm: true, staff: true },
    logs: { gm: true, staff: true },
    guide: { gm: true, staff: true },
  },
  financial: {
    form: { gm: true, staff: true },
    inspection: { gm: true, staff: true },
    camera: { gm: true, staff: true },
    tasks: { gm: true, staff: true },
    alerts: { gm: true, staff: true },
    reports: { gm: true, staff: true },
    videos: { gm: true, staff: true },
    correspondence: { gm: true, staff: true },
    kpis: { gm: true, staff: true },
    logs: { gm: true, staff: true },
    guide: { gm: true, staff: true },
  },
};

export const getDepartmentPagePermissions = (): DepartmentPagesPermissionsConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEPARTMENT_PERMISSIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults to ensure all keys and departments exist
      const merged: DepartmentPagesPermissionsConfig = { ...DEFAULT_DEPARTMENT_PAGE_PERMISSIONS };
      for (const dept of Object.keys(DEFAULT_DEPARTMENT_PAGE_PERMISSIONS)) {
        merged[dept] = {
          ...DEFAULT_DEPARTMENT_PAGE_PERMISSIONS[dept],
          ...(parsed[dept] || {}),
        };
      }
      return merged;
    }
  } catch (e) {
    console.error('Error loading department permissions:', e);
  }
  return DEFAULT_DEPARTMENT_PAGE_PERMISSIONS;
};

export const saveDepartmentPagePermissions = (config: DepartmentPagesPermissionsConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY_DEPARTMENT_PERMISSIONS, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent(EVENT_DEPARTMENT_PERMISSIONS_UPDATED, { detail: config }));
  } catch (e) {
    console.error('Error saving department permissions:', e);
  }
};

export const isDepartmentPageVisible = (
  department: string,
  pageId: string,
  role: 'gm' | 'staff'
): boolean => {
  // Directory is always visible
  if (pageId === 'directory') return true;

  const config = getDepartmentPagePermissions();
  const deptConfig = config[department];
  if (!deptConfig) return true; // Default to true if not specified

  const pageSetting = deptConfig[pageId];
  if (!pageSetting) return true; // Default to true if page not restricted

  return pageSetting[role] !== false;
};
