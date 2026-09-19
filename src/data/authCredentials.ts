import { 
  SuperAdminCredentials, 
  DepartmentAccessCredentials, 
  DepartmentActivityLogItem, 
  RecordedVideoSession, 
  DepartmentRole 
} from '../types';

export const DEFAULT_SUPER_ADMIN: SuperAdminCredentials = {
  email: 'mohamedyoussef255@gmail.com',
  password: '000000',
  lastUpdated: '2026-09-18T10:00:00.000Z'
};

export const INITIAL_DEPT_CREDENTIALS: Record<DepartmentRole, DepartmentAccessCredentials> = {
  admin: {
    department: 'admin',
    password: '000000',
    gmTitle: 'مدير عام إدارة النظام والتحكم (Super Admin)',
    defaultGmName: 'م. محمد يوسف',
    defaultGmPhone: '+201019544000',
    lastUpdated: '2026-09-18T10:00:00.000Z'
  },
  marketing: {
    department: 'marketing',
    password: 'MKT-8492',
    gmTitle: 'مدير عام التسويق والدراسات الميدانية',
    defaultGmName: 'م. أحمد الشناوي',
    defaultGmPhone: '+201001234567',
    lastUpdated: '2026-09-18T10:00:00.000Z'
  },
  projects: {
    department: 'projects',
    password: 'PRJ-3104',
    gmTitle: 'مدير عام المشروعات والأعمال المدنية',
    defaultGmName: 'م. طارق عبد الرازق',
    defaultGmPhone: '+201007654321',
    lastUpdated: '2026-09-18T10:00:00.000Z'
  },
  operations: {
    department: 'operations',
    password: 'OPS-7721',
    gmTitle: 'مدير عام التشغيل والصيانة (المعدات والآلات)',
    defaultGmName: 'م. خالد الصاوي',
    defaultGmPhone: '+201009876543',
    lastUpdated: '2026-09-18T10:00:00.000Z'
  },
  hse: {
    department: 'hse',
    password: 'HSE-9912',
    gmTitle: 'مدير عام السلامة والأمن الصناعي (HSE)',
    defaultGmName: 'م. حسام البحيري',
    defaultGmPhone: '+201011223344',
    lastUpdated: '2026-09-18T10:00:00.000Z'
  },
  technical: {
    department: 'technical',
    password: 'TEC-4501',
    gmTitle: 'مدير عام الإدارة الفنية وضغوط الشبكات',
    defaultGmName: 'م. وليد مصطفى',
    defaultGmPhone: '+201022334455',
    lastUpdated: '2026-09-18T10:00:00.000Z'
  },
  licensing: {
    department: 'licensing',
    password: 'LIC-6284',
    gmTitle: 'مدير عام التراخيص والموافقات الحكومية',
    defaultGmName: 'أ. سامح النجار',
    defaultGmPhone: '+201033445566',
    lastUpdated: '2026-09-18T10:00:00.000Z'
  },
  legal: {
    department: 'legal',
    password: 'LEG-1938',
    gmTitle: 'مدير عام الإدارة القانونية والعقود',
    defaultGmName: 'المستشار شريف فوزي',
    defaultGmPhone: '+201044556677',
    lastUpdated: '2026-09-18T10:00:00.000Z'
  },
  financial: {
    department: 'financial',
    password: 'FIN-5520',
    gmTitle: 'مدير عام الشئون المالية ودراسات الجدوى',
    defaultGmName: 'أ. محمود الكردي',
    defaultGmPhone: '+201055667788',
    lastUpdated: '2026-09-18T10:00:00.000Z'
  },
  surveyor: {
    department: 'surveyor',
    password: 'SRV-0011',
    gmTitle: 'معاين ميداني معتمد',
    defaultGmName: 'فريق المعاينة',
    defaultGmPhone: '+201099887766',
    lastUpdated: '2026-09-18T10:00:00.000Z'
  }
};

// Storage keys
const SUPER_ADMIN_KEY = 'cargas_super_admin_credentials_v1';
const DEPT_CREDENTIALS_KEY = 'cargas_dept_credentials_v1';
const ACTIVITY_LOGS_KEY = 'cargas_activity_logs_v1';
const VIDEO_ARCHIVE_KEY = 'cargas_recorded_video_archive_v1';

// Super Admin getters & setters
export function loadSuperAdminCredentials(): SuperAdminCredentials {
  try {
    const saved = localStorage.getItem(SUPER_ADMIN_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_SUPER_ADMIN;
}

export function saveSuperAdminCredentials(creds: SuperAdminCredentials): void {
  try {
    localStorage.setItem(SUPER_ADMIN_KEY, JSON.stringify(creds));
  } catch {}
}

// Department Passwords getters & setters
export function loadDepartmentCredentials(): Record<DepartmentRole, DepartmentAccessCredentials> {
  try {
    const saved = localStorage.getItem(DEPT_CREDENTIALS_KEY);
    if (saved) return { ...INITIAL_DEPT_CREDENTIALS, ...JSON.parse(saved) };
  } catch {}
  return INITIAL_DEPT_CREDENTIALS;
}

export function saveDepartmentCredentials(creds: Record<DepartmentRole, DepartmentAccessCredentials>): void {
  try {
    localStorage.setItem(DEPT_CREDENTIALS_KEY, JSON.stringify(creds));
  } catch {}
}

// Initial Seed Activity Logs
export const INITIAL_ACTIVITY_LOGS: DepartmentActivityLogItem[] = [
  {
    id: 'act-001',
    department: 'operations',
    departmentName: 'إدارة التشغيل والصيانة',
    actorName: 'م. خالد الصاوي (المدير العام)',
    actorRole: 'general_manager',
    actionType: 'task_assigned',
    title: 'تكليف مهندس الصيانة بفحص ضاغط محطة الرماية',
    details: 'تم إرسال تكليف ورابط المهام عبر الواتساب للمهندس أحمد بدر لمعاينة ضاغط الغاز الطبيعي 1200 م٣/ساعة وتوثيقه بالكاميرا.',
    timestamp: '2026-09-18T14:30:00.000Z',
    dateStr: '2026/09/18',
    timeStr: '02:30 م',
    recipientName: 'م. أحمد بدر',
    recipientPhone: '+201012399887',
    relatedSessionId: 'st-01'
  },
  {
    id: 'act-002',
    department: 'marketing',
    departmentName: 'إدارة التسويق والدراسات الميدانية',
    actorName: 'م. أحمد الشناوي (المدير العام)',
    actorRole: 'general_manager',
    actionType: 'invite_sent',
    title: 'إرسال دعوة رصد ميداني للمهندس مصطفى كامل',
    details: 'تم إرسال رابط تكليف الرصد الميداني وحصر سيارات الأجرة والملاكي لمحور المشير طنطاوي عبر الواتساب.',
    timestamp: '2026-09-18T12:15:00.000Z',
    dateStr: '2026/09/18',
    timeStr: '12:15 م',
    recipientName: 'م. مصطفى كامل',
    recipientPhone: '+201023456789',
    relatedSessionId: 'st-02'
  },
  {
    id: 'act-003',
    department: 'projects',
    departmentName: 'إدارة المشروعات والأعمال المدنية',
    actorName: 'م. طارق عبد الرازق (المدير العام)',
    actorRole: 'general_manager',
    actionType: 'camera_session_saved',
    title: 'حفظ وتوثيق جلسة رصد الأرض والقواعد الخرسانية',
    details: 'تم توثيق مراحل صب القواعد المسلحة لمظلة المحطة بمحطة كورنيش النيل بالمنيب وحفظ تسجيل الكاميرا الميداني.',
    timestamp: '2026-09-18T11:00:00.000Z',
    dateStr: '2026/09/18',
    timeStr: '11:00 ص',
    relatedSessionId: 'st-04'
  },
  {
    id: 'act-004',
    department: 'hse',
    departmentName: 'إدارة السلامة والصحة المهنية',
    actorName: 'م. حسام البحيري (المدير العام)',
    actorRole: 'general_manager',
    actionType: 'message_sent',
    title: 'توجيه تعليمات فورية بشأن مسافات الأمان NFPA 52',
    details: 'إرسال تنبيه رسمي عبر المنظومة لمهندسي الموقع للتأكد من مسافة الـ 7.5 متر بين كابينة الضاغط وسور المحطة.',
    timestamp: '2026-09-18T09:45:00.000Z',
    dateStr: '2026/09/18',
    timeStr: '09:45 ص'
  },
  {
    id: 'act-005',
    department: 'technical',
    departmentName: 'الإدارة الفنية وضغوط الشبكات',
    actorName: 'م. وليد مصطفى (المدير العام)',
    actorRole: 'general_manager',
    actionType: 'task_assigned',
    title: 'تكليف باختبار ضغط شبكة خط الغاز المغذي',
    details: 'تم تكليف فني القياس بمطابقة قراءات ضغط الدخول (4 بار) وإجراء اختبار النيتروجين الهيدروستاتيكي.',
    timestamp: '2026-09-17T16:20:00.000Z',
    dateStr: '2026/09/17',
    timeStr: '04:20 م'
  }
];

// Activity logs getters & adders
export function loadActivityLogs(): DepartmentActivityLogItem[] {
  try {
    const saved = localStorage.getItem(ACTIVITY_LOGS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_ACTIVITY_LOGS;
}

export function saveActivityLogs(logs: DepartmentActivityLogItem[]): void {
  try {
    localStorage.setItem(ACTIVITY_LOGS_KEY, JSON.stringify(logs));
  } catch {}
}

export function logDepartmentActivity(action: Omit<DepartmentActivityLogItem, 'id' | 'timestamp' | 'dateStr' | 'timeStr'>): DepartmentActivityLogItem {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });

  const newItem: DepartmentActivityLogItem = {
    id: 'act-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    ...action,
    timestamp: now.toISOString(),
    dateStr,
    timeStr,
  };

  try {
    const current = loadActivityLogs();
    const updated = [newItem, ...current];
    saveActivityLogs(updated);
  } catch {}

  return newItem;
}

// Initial Seed Video Archive Sessions
export const INITIAL_RECORDED_VIDEOS: RecordedVideoSession[] = [
  {
    id: 'vid-01',
    sessionId: 'st-01',
    sessionTitle: 'محطة كارجاس - ميدان الرماية والهرم',
    department: 'operations',
    departmentName: 'إدارة التشغيل والصيانة',
    locationName: 'ميدان الرماية والهرم',
    governorate: 'الجيزة',
    recordedBy: 'م. خالد الصاوي (مدير عام التشغيل)',
    recordedAt: '2026-09-18T10:30:00.000Z',
    timestampDisplay: '18 سبتمبر 2026 - 10:30 ص',
    durationSeconds: 145,
    category: 'equipment_machinery',
    categoryLabel: 'رصد ورفع الآلات والضواغط والموزعات',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    notes: 'توثيق حالة الضاغط الغازي 1200 م٣/ساعة، قياس درجات حرارة المحامل، واختبار عمل الموزعات الأربعة.',
    equipmentInspected: ['ضاغط الغاز الرئيسي Safe G-1200', 'عدد 4 طلمبات توزيع NGV', 'بطاريات تخزين غاز 250 بار', 'لوحة التحكم الكهربائية'],
    findingsSummary: 'جميع المعدات مطابقة للمواصفات القياسية، كفاءة الضغط 98.4%، لا توجد أي تسريبات أو أصوات غير طبيعية.',
    fileSizeBytes: 24500000
  },
  {
    id: 'vid-02',
    sessionId: 'st-02',
    sessionTitle: 'محطة غازتك/كارجاس - محور المشير طنطاوي',
    department: 'projects',
    departmentName: 'إدارة المشروعات والأعمال المدنية',
    locationName: 'محور المشير طنطاوي',
    governorate: 'القاهرة',
    recordedBy: 'م. طارق عبد الرازق (مدير عام المشروعات)',
    recordedAt: '2026-09-18T12:00:00.000Z',
    timestampDisplay: '18 سبتمبر 2026 - 12:00 م',
    durationSeconds: 210,
    category: 'land_civil',
    categoryLabel: 'رصد الأرض والإنشاءات والجمالونات',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861563?w=800&auto=format&fit=crop&q=80',
    notes: 'توثيق مراحل صب القواعد الخرسانية وتركيب أعمدة الجمالون المعدني لمظلة تموين الغاز الطبيعي.',
    equipmentInspected: ['أرض الموقع والمداخل والمخارج', 'القواعد الخرسانية المسلحة', 'هيكل المظلة والجمالونات', 'مبنى التحكم والمبيعات'],
    findingsSummary: 'تم الانتهاء من 72% من الأعمال الإنشائية المدنية، اختبار كسر مكعبات الخرسانة حقق 350 كجم/سم٢ بنجاح.',
    fileSizeBytes: 38200000
  },
  {
    id: 'vid-03',
    sessionId: 'st-04',
    sessionTitle: 'محطة كارجاس - كورنيش النيل بالمنيب',
    department: 'marketing',
    departmentName: 'إدارة التسويق والدراسات الميدانية',
    locationName: 'كورنيش النيل بالمنيب ومجمع المواقف',
    governorate: 'الجيزة',
    recordedBy: 'م. أحمد الشناوي (مدير عام التسويق)',
    recordedAt: '2026-09-17T09:15:00.000Z',
    timestampDisplay: '17 سبتمبر 2026 - 09:15 ص',
    durationSeconds: 180,
    category: 'traffic_census',
    categoryLabel: 'رصد تدفق المرور وحصر المركبات الميداني',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    notes: 'جلسة حصر وحركة مرور حية في ساعة الذروة الصباحية أمام مجمع مواقف المنيب.',
    equipmentInspected: ['كاميرا الذكاء الاصطناعي لحصر المركبات', 'شريان الطريق الدائري ومطلع المنيب'],
    findingsSummary: 'تم رصد 248 ميكروباص و112 تاكسي و320 سيارة ملاكي خلال جلسة الرصد، الموقع ذو كثافة مرورية استثنائية (تصنيف +A).',
    fileSizeBytes: 29000000
  },
  {
    id: 'vid-04',
    sessionId: 'st-03',
    sessionTitle: 'محطة غازتك - طريق النصر وعباس العقاد',
    department: 'hse',
    departmentName: 'إدارة السلامة والصحة المهنية (HSE)',
    locationName: 'طريق النصر وعباس العقاد',
    governorate: 'القاهرة',
    recordedBy: 'م. حسام البحيري (مدير عام السلامة)',
    recordedAt: '2026-09-16T14:40:00.000Z',
    timestampDisplay: '16 سبتمبر 2026 - 02:40 م',
    durationSeconds: 95,
    category: 'safety_inspection',
    categoryLabel: 'فحص أنظمة الأمان والسلامة ومكافحة الحريق',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
    notes: 'اختبار كواشف الغاز، صمامات الغلق السريع ESD، ونظام إطفاء المسحوق الجاف التلقائي.',
    equipmentInspected: ['نظام الغلق التلقائي ESD', 'كواشف الأشعة فوق البنفسجية واللهب UV/IR', 'صمامات التنفيس PRV', 'مدافع وخراطيم الإطفاء'],
    findingsSummary: 'زمن الاستجابة التلقائية للغلق السريع أقل من ثانيتين، تم اعتماد شهادة الأمان الدوري للمحطة.',
    fileSizeBytes: 16800000
  }
];

// Video archive getters & adders
export function loadVideoArchive(): RecordedVideoSession[] {
  try {
    const saved = localStorage.getItem(VIDEO_ARCHIVE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return INITIAL_RECORDED_VIDEOS;
}

export function saveVideoArchive(videos: RecordedVideoSession[]): void {
  try {
    localStorage.setItem(VIDEO_ARCHIVE_KEY, JSON.stringify(videos));
  } catch {}
}

export function addVideoToArchive(session: RecordedVideoSession): void {
  try {
    const current = loadVideoArchive();
    const updated = [session, ...current];
    saveVideoArchive(updated);
  } catch {}
}

// ==============================================================
// SESSION AUTHENTICATION HELPERS
// ==============================================================

export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem('cargas_admin_authenticated') === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(val: boolean): void {
  try {
    if (val) {
      sessionStorage.setItem('cargas_admin_authenticated', 'true');
    } else {
      sessionStorage.removeItem('cargas_admin_authenticated');
    }
  } catch {}
}

export function clearAdminAuth(): void {
  try {
    sessionStorage.removeItem('cargas_admin_authenticated');
  } catch {}
}

export function isDeptAuthenticated(dept: string): boolean {
  try {
    return sessionStorage.getItem(`cargas_dept_auth_${dept}`) === 'true';
  } catch {
    return false;
  }
}

export function setDeptAuthenticated(dept: string, val: boolean): void {
  try {
    if (val) {
      sessionStorage.setItem(`cargas_dept_auth_${dept}`, 'true');
    } else {
      sessionStorage.removeItem(`cargas_dept_auth_${dept}`);
    }
  } catch {}
}

export function clearDeptAuth(dept: string): void {
  try {
    sessionStorage.removeItem(`cargas_dept_auth_${dept}`);
  } catch {}
}

