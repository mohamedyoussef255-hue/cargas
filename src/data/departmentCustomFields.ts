import { DepartmentRole, DepartmentMetadata, CustomFormField, FormChangeRequest, ActiveTabType } from '../types';

export interface DepartmentRoleSpec {
  role: DepartmentRole;
  allowedTabs: ActiveTabType[];
  primaryTab: ActiveTabType;
  gmTitle: string;
  theme: {
    accentColor: string;
    badgeClass: string;
    headerGradient: string;
    borderAccent: string;
    tabActiveClass: string;
    bannerGradient: string;
  };
  sampleRoles: string[];
}

export const DEPARTMENT_ROLE_SPECS: Record<DepartmentRole, DepartmentRoleSpec> = {
  admin: {
    role: 'admin',
    allowedTabs: ['admin', 'departments', 'camera', 'sessions', 'map', 'feasibility', 'execution', 'calculator', 'guide'],
    primaryTab: 'admin',
    gmTitle: 'مدير عام إدارة النظام والتحكم (Super Admin)',
    theme: {
      accentColor: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      headerGradient: 'from-emerald-950/70 via-slate-900 to-slate-950',
      borderAccent: 'border-emerald-500/40',
      tabActiveClass: 'bg-emerald-600 text-white shadow-emerald-600/30',
      bannerGradient: 'from-emerald-900/60 to-slate-900/80',
    },
    sampleRoles: ['مدير نظام ومطور', 'مشرف عام المنظومة', 'مدقق بيانات مركزي']
  },
  marketing: {
    role: 'marketing',
    allowedTabs: ['departments', 'camera', 'sessions', 'calculator', 'map'],
    primaryTab: 'departments',
    gmTitle: 'مدير عام التسويق والدراسات الميدانية',
    theme: {
      accentColor: 'text-indigo-400',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      headerGradient: 'from-indigo-950/70 via-slate-900 to-slate-950',
      borderAccent: 'border-indigo-500/40',
      tabActiveClass: 'bg-indigo-600 text-white shadow-indigo-600/30',
      bannerGradient: 'from-indigo-900/60 to-slate-900/80',
    },
    sampleRoles: ['مسؤول دراسات ميدانية', 'معاين جغرافي', 'محلل تدفق مروري', 'منسق تسويق ومبيعات']
  },
  projects: {
    role: 'projects',
    allowedTabs: ['departments', 'execution', 'sessions', 'map'],
    primaryTab: 'departments',
    gmTitle: 'مدير عام المشروعات والأعمال المدنية',
    theme: {
      accentColor: 'text-blue-400',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      headerGradient: 'from-blue-950/70 via-slate-900 to-slate-950',
      borderAccent: 'border-blue-500/40',
      tabActiveClass: 'bg-blue-600 text-white shadow-blue-600/30',
      bannerGradient: 'from-blue-900/60 to-slate-900/80',
    },
    sampleRoles: ['مهندس مشروعات موقع', 'مهندس أعمال مدنية', 'مشرف تنفيذ معماري', 'متابع جداول زمنية']
  },
  operations: {
    role: 'operations',
    allowedTabs: ['departments', 'execution', 'guide', 'sessions'],
    primaryTab: 'departments',
    gmTitle: 'مدير عام التشغيل والصيانة (المعدات والآلات)',
    theme: {
      accentColor: 'text-amber-400',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      headerGradient: 'from-amber-950/70 via-slate-900 to-slate-950',
      borderAccent: 'border-amber-500/40',
      tabActiveClass: 'bg-amber-600 text-white shadow-amber-600/30',
      bannerGradient: 'from-amber-900/60 to-slate-900/80',
    },
    sampleRoles: ['مهندس صيانة ضواغط', 'مشرف محطة تموين', 'فني ميكانيكا غاز', 'مسؤول قطع الغيار والمهمات']
  },
  technical: {
    role: 'technical',
    allowedTabs: ['departments', 'guide', 'sessions', 'map'],
    primaryTab: 'departments',
    gmTitle: 'مدير عام الإدارة الفنية والشبكات',
    theme: {
      accentColor: 'text-teal-400',
      badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      headerGradient: 'from-teal-950/70 via-slate-900 to-slate-950',
      borderAccent: 'border-teal-500/40',
      tabActiveClass: 'bg-teal-600 text-white shadow-teal-600/30',
      bannerGradient: 'from-teal-900/60 to-slate-900/80',
    },
    sampleRoles: ['مهندس شبكات وضغوط', 'أخصائي خطوط غاز', 'فني محابس وأجهزة قياس', 'مهندس ضبط جودة']
  },
  hse: {
    role: 'hse',
    allowedTabs: ['departments', 'sessions', 'map'],
    primaryTab: 'departments',
    gmTitle: 'مدير عام السلامة والأمن الصناعي (HSE)',
    theme: {
      accentColor: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      headerGradient: 'from-emerald-950/70 via-slate-900 to-slate-950',
      borderAccent: 'border-emerald-500/40',
      tabActiveClass: 'bg-emerald-600 text-white shadow-emerald-600/30',
      bannerGradient: 'from-emerald-900/60 to-slate-900/80',
    },
    sampleRoles: ['أخصائي سلامة وصحة مهنية', 'مفتش أمن صناعي', 'مسؤول مكافحة حريق وطوارئ', 'مراجع كود NFPA 52']
  },
  licensing: {
    role: 'licensing',
    allowedTabs: ['departments', 'sessions', 'map'],
    primaryTab: 'departments',
    gmTitle: 'مدير عام التراخيص والموافقات الحكومية',
    theme: {
      accentColor: 'text-orange-400',
      badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      headerGradient: 'from-orange-950/70 via-slate-900 to-slate-950',
      borderAccent: 'border-orange-500/40',
      tabActiveClass: 'bg-orange-600 text-white shadow-orange-600/30',
      bannerGradient: 'from-orange-900/60 to-slate-900/80',
    },
    sampleRoles: ['مسؤول علاقات وتراخيص حكومية', 'باحث تصاريح وتخطيط', 'متابع موافقات الحماية المدنية', 'منسق أجهزة المدن']
  },
  legal: {
    role: 'legal',
    allowedTabs: ['departments', 'sessions'],
    primaryTab: 'departments',
    gmTitle: 'مدير عام الشؤون القانونية والعقود',
    theme: {
      accentColor: 'text-purple-400',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      headerGradient: 'from-purple-950/70 via-slate-900 to-slate-950',
      borderAccent: 'border-purple-500/40',
      tabActiveClass: 'bg-purple-600 text-white shadow-purple-600/30',
      bannerGradient: 'from-purple-900/60 to-slate-900/80',
    },
    sampleRoles: ['مستشار قانوني', 'باحث ملكية وعقود', 'موثق شهر عقاري', 'محامي شؤون شركات']
  },
  financial: {
    role: 'financial',
    allowedTabs: ['departments', 'feasibility', 'calculator', 'sessions'],
    primaryTab: 'departments',
    gmTitle: 'مدير عام الشؤون المالية ودراسات الجدوى',
    theme: {
      accentColor: 'text-cyan-400',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      headerGradient: 'from-cyan-950/70 via-slate-900 to-slate-950',
      borderAccent: 'border-cyan-500/40',
      tabActiveClass: 'bg-cyan-600 text-white shadow-cyan-600/30',
      bannerGradient: 'from-cyan-900/60 to-slate-900/80',
    },
    sampleRoles: ['محلل مالي واقتصادي', 'محاسب تكاليف مشروعات', 'مسؤول دراسات الجدوى', 'مراجع حسابات وتدفقات']
  },
  surveyor: {
    role: 'surveyor',
    allowedTabs: ['camera'],
    primaryTab: 'camera',
    gmTitle: 'المعاين الميداني المعتمد',
    theme: {
      accentColor: 'text-sky-400',
      badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      headerGradient: 'from-sky-950/70 via-slate-900 to-slate-950',
      borderAccent: 'border-sky-500/40',
      tabActiveClass: 'bg-sky-600 text-white shadow-sky-600/30',
      bannerGradient: 'from-sky-900/60 to-slate-900/80',
    },
    sampleRoles: ['مساح ميداني معتمد']
  }
};

export const DEPARTMENTS_METADATA: Record<DepartmentRole, DepartmentMetadata> = {
  admin: {
    role: 'admin',
    title: 'إدارة النظام والتحكم الشامل',
    subtitle: 'المدير العام • التحكم المركزي وتخصيص الحقول والاعتمادات',
    badge: 'Super Admin',
    color: 'emerald',
    bgGradient: 'from-emerald-900/50 via-slate-900 to-slate-950',
    iconName: 'ShieldCheck',
    primaryScope: 'كافة صفحات المنظومة والتقارير التنفيذية وتخصيص النماذج',
    keyResponsibilities: [
      'إدارة الصلاحيات والوصول الموحد لكافة الإدارات',
      'تخصيص نماذج وحقول الإدارات (إضافة، تعديل، حذف، إظهار، إخفاء)',
      'اعتماد أو رفض طلبات تعديل النماذج المقدمة من الإدارات',
      'التقارير والاستعلامات المجمعة والرقابة العليا على سير العمل'
    ]
  },
  marketing: {
    role: 'marketing',
    title: 'إدارة التسويق والدراسات الميدانية',
    subtitle: 'خطط الانتشار • تكليف المعاينين • إرسال الروابط بالواتساب',
    badge: 'Marketing & Dispatch',
    color: 'indigo',
    bgGradient: 'from-indigo-900/50 via-slate-900 to-slate-950',
    iconName: 'Share2',
    primaryScope: 'استكشاف المواقع وحصر حركة المرور وتكليف المعاينين الميدانيين عبر الواتساب',
    keyResponsibilities: [
      'توليد روابط المعاينة الميدانية المشفرة وإرسالها للمعاينين عبر الواتساب',
      'حصر التدفق المروري للمركبات والطلب المتوقع على الغاز الطبيعي',
      'تقييم الجاذبية التسويقية للموقع والمحاور الرئيسية ومواقف السرفيس',
      'متابعة حالة مهام المعاينة المستلمة من الميدان لحظة بلحظة'
    ]
  },
  surveyor: {
    role: 'surveyor',
    title: 'المعاينة والرصد الميداني',
    subtitle: 'مهمة مساح ميداني معتمدة • رصد الكاميرا الذكي وتحديد الموقع',
    badge: 'Field Surveyor',
    color: 'sky',
    bgGradient: 'from-sky-900/50 via-slate-900 to-slate-950',
    iconName: 'Camera',
    primaryScope: 'رصد أسطول المركبات بالكاميرا والتحديد التلقائي للموقع الجغرافي دون أي وصول لإدارات أخرى',
    keyResponsibilities: [
      'الرصد الذكي التلقائي للمركبات المارة أمام الموقع بالكاميرا',
      'التحديد التلقائي الدقيق للموقع الجغرافي والعنوان عبر الأقمار الصناعية',
      'تسجيل الملاحظات الميدانية والصور الحية للموقع',
      'إرسال المعاينة مباشرة لإدارة التسويق لاعتمادها'
    ]
  },
  projects: {
    role: 'projects',
    title: 'إدارة المشروعات والأعمال المدنية',
    subtitle: 'المخططات الهندسية • الأعمال الإنشائية • مساحات الموقع والمظلة',
    badge: 'Civil & Engineering',
    color: 'blue',
    bgGradient: 'from-blue-900/50 via-slate-900 to-slate-950',
    iconName: 'Building2',
    primaryScope: 'الأعمال المدنية، تجهيز الموقع، المظلة، أساسات الضاغط، والمخططات المعمارية',
    keyResponsibilities: [
      'فحص أبعاد ومساحة الأرض وصلاحيتها للمحطة (الحد الأدنى 400 - 600 م²)',
      'تصميم المخطط الهندسي العام (Layout) وحارات الدخول والخروج',
      'تجهيز مظلة تموين الغاز وقواعد تثبيت الضواغط ومبنى التحكم',
      'إعداد المقايسة التقديرية للأعمال المدنية والجدول الزمني للإنشاء'
    ]
  },
  hse: {
    role: 'hse',
    title: 'إدارة السلامة والأمن الصناعي (HSE)',
    subtitle: 'كود NFPA 52 • شبكات الإطفاء والإنذار • مسافات الأمان ومخاطر الغاز',
    badge: 'Safety & HSE',
    color: 'emerald',
    bgGradient: 'from-emerald-900/50 via-slate-900 to-slate-950',
    iconName: 'Flame',
    primaryScope: 'السلامة والصحة المهنية ومسافات الأمان وتأمين الموقع ضد أخطار الضغط العالي والحرائق',
    keyResponsibilities: [
      'التحقق من مسافات الأمان المعتمدة لكود NFPA 52 (المباني المجاورة وخزانات الوقود)',
      'اعتماد شبكة الإطفاء التلقائي (FM200 / رغوي / بودرة جافة)',
      'تحديد صمامات الإغلاق السريع للطوارئ (ESD) وكواشف تسريب الغاز والميثان',
      'إصدار تصريح السلامة والأمن الصناعي قبل بدء تجارب التشغيل'
    ]
  },
  operations: {
    role: 'operations',
    title: 'إدارة التشغيل والصيانة (المعدات والآلات)',
    subtitle: 'الضواغط • موزعات الغاز • محطة تخفيض الضغط • لوحات الأولوية',
    badge: 'Machinery & Operations',
    color: 'amber',
    bgGradient: 'from-amber-900/50 via-slate-900 to-slate-950',
    iconName: 'Wrench',
    primaryScope: 'الآلات والمعدات والموزعات والضواغط ووحدات تجفيف الغاز وقطع الغيار',
    keyResponsibilities: [
      'تحديد سعة ونوع ضاغط الغاز الطبيعي (مثال: 1000 - 1500 م³/ساعة - 250 بار)',
      'تحديد عدد نقاط وموزعات تموين السيارات ومسدسات الضغط العالي (NGV Dispensers)',
      'فحص وحدة تجفيف الغاز الطبيعي (Gas Dryer Unit) وخزانات السلندرات (Cascade)',
      'جدولة خطط الصيانة الوقائية للآلات وتوافر قطع الغيار والمحابس'
    ]
  },
  technical: {
    role: 'technical',
    title: 'الإدارة الفنية والشبكات',
    subtitle: 'ضغوط الشبكة القومية • أقطار الأنابيب • المواصفات القياسية للغاز',
    badge: 'Technical & Grid',
    color: 'teal',
    bgGradient: 'from-teal-900/50 via-slate-900 to-slate-950',
    iconName: 'Cpu',
    primaryScope: 'الربط على الشبكة القومية للغاز، ضغوط التغذية، ومحابس العزل الفنية',
    keyResponsibilities: [
      'قياس ضغط خط الغاز المغذي للمحطة من الشبكة القومية (الحد الأدنى 4 - 16 بار)',
      'تحديد مسار خط التغذية الفرعي والمسافة حتى المحطة والقطر المطلوب',
      'فحص محطة القياس وتخفيض الضغط (PRMS)',
      'مطابقة المواصفات الفنية للغاز القياسي وتجهيزات منظومة الربط'
    ]
  },
  licensing: {
    role: 'licensing',
    title: 'إدارة التراخيص والموافقات الحكومية',
    subtitle: 'الحماية المدنية • التنمية المحلية والحي • وزارة البترول والبيئة',
    badge: 'Licensing & Permits',
    color: 'orange',
    bgGradient: 'from-orange-900/50 via-slate-900 to-slate-950',
    iconName: 'FileCheck',
    primaryScope: 'استخراج وتجديد التراخيص الحكومية وموافقات الجهات السيادية',
    keyResponsibilities: [
      'موافقة إدارة الحماية المدنية على منظومة مكافحة الحريق',
      'رخصة التشغيل من مجلس المدينة / الحي / هيئة المجتمعات العمرانية',
      'موافقة جهاز شؤون البيئة ودراسة الأثر البيئي للمحطة',
      'تصريح الهيئة المصرية العامة للبترول والشركة القابضة للغازات (إيجاس)'
    ]
  },
  legal: {
    role: 'legal',
    title: 'الإدارة القانونية والعقود',
    subtitle: 'سندات الملكية وحق الانتفاع • عقود الشراكة والتشغيل • التكييف القانوني',
    badge: 'Legal & Contracts',
    color: 'purple',
    bgGradient: 'from-purple-900/50 via-slate-900 to-slate-950',
    iconName: 'Scale',
    primaryScope: 'السلامة القانونية للأرض والعقود ومذكرات التفاهم والضمانات',
    keyResponsibilities: [
      'مراجعة سند ملكية الأرض أو عقد الإيجار / حق الانتفاع (BOT)',
      'صياغة عقد الشراكة والتشغيل مع محطات الوقود الشريكة أو أصحاب الأراضي',
      'التحقق من عدم وجود نزاعات قضائية أو موانع تخطيطية على العقار',
      'توثيق العقود بالشهر العقاري وحفظ ملف المحطة القانوني'
    ]
  },
  financial: {
    role: 'financial',
    title: 'الإدارة المالية ودراسات الجدوى',
    subtitle: 'التكاليف الاستثمارية • معدل العائد الداخلي IRR • فترة الاسترداد Payback',
    badge: 'Financial & Feasibility',
    color: 'cyan',
    bgGradient: 'from-cyan-900/50 via-slate-900 to-slate-950',
    iconName: 'BadgeDollarSign',
    primaryScope: 'الجدوى الاقتصادية والتدفقات النقدية وهوامش بيع المتر المكعب من الغاز',
    keyResponsibilities: [
      'حساب التكاليف الاستثمارية التقديرية (CAPEX) للأعمال المدنية والمعدات',
      'تقدير المصاريف التشغيلية (OPEX) وفواتير الكهرباء وتأمين الموقع',
      'حساب المبيعات السنوية المتوقعة من الغاز وفترة استرداد رأس المال',
      'حساب معدل العائد الداخلي (IRR) وصافي القيمة الحالية للمشروع (NPV)'
    ]
  }
};

// Initial Default Form Fields (Customizable dynamically by System Admin)
export const INITIAL_CUSTOM_FORM_FIELDS: CustomFormField[] = [
  // ==============================================================
  // Marketing & Field Study Fields (إدارة التسويق والدراسات الميدانية)
  // مستنبطة من نماذج المعاينة الفنية ودراسات الانتشار الجغرافي
  // ==============================================================
  {
    id: 'fld-mkt-1',
    department: 'marketing',
    label: 'تصنيف الطريق والمحور أمام الموقع',
    key: 'roadClassification',
    type: 'select',
    options: [
      'محور سريع حر / طريق دولي (كثافة سفر ونقل)',
      'محور مروري رئيسي داخل المدينة / العاصمة',
      'شارع تجاري رئيسي مزدحم (مواقف سرفيس وميكروباص)',
      'مدخل مدينة أو منطقة صناعية استراتيجية',
      'شارع داخلي يخدم تجمعات سكنية كثيفة'
    ],
    required: true,
    visible: true,
    defaultValue: 'محور مروري رئيسي داخل المدينة / العاصمة',
    description: 'تحديد نوعية وتصنيف الطريق لحساب معدل استقطاب المركبات وتدفق الغاز',
    section: 'الدراسة المرورية والتسويقية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-mkt-2',
    department: 'marketing',
    label: 'متوسط سرعة المركبات أمام الموقع (كم/ساعة)',
    key: 'averageTrafficSpeedKmh',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 50,
    description: 'السرعات بين 30 - 60 كم/س تعطي أعلى معدلات دخول للمحطة وسهولة مناورة',
    section: 'الدراسة المرورية والتسويقية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-mkt-3',
    department: 'marketing',
    label: 'طبيعة حركة الشارع والجزيرة الوسطى',
    key: 'streetTrafficType',
    type: 'select',
    options: [
      'اتجاهين بجزيرة وسطى وفتحة دوران (U-Turn) مقابلة للموقع',
      'اتجاهين بجزيرة وسطى واليوترن على بعد أقل من 300 متر',
      'اتجاهين بدون جزيرة وسطى (دخول وخروج مباشر من الاتجاهين)',
      'اتجاه واحد (One-Way) عريض بأكثر من 4 حارات',
      'اتجاهين بفاصل خرساني واليوترن يبعد أكثر من 1 كم'
    ],
    required: true,
    visible: true,
    defaultValue: 'اتجاهين بجزيرة وسطى وفتحة دوران (U-Turn) مقابلة للموقع',
    section: 'الدراسة المرورية والتسويقية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-mkt-4',
    department: 'marketing',
    label: 'المسافة لأقرب فتحة دوران للخلف U-Turn (متر)',
    key: 'uTurnDistanceMeters',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 150,
    description: 'قرب الدوران للخلف يضاعف مبيعات الغاز بخدمة الاتجاهين المعاكسين',
    section: 'الدراسة المرورية والتسويقية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-mkt-5',
    department: 'marketing',
    label: 'المسافة لأقرب محطة غاز طبيعي منافسة (كم)',
    key: 'distanceToNearestCngCompetitorKm',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 4.5,
    description: 'إذا زادت المسافة عن 3 كم يعتبر الموقع ذا أولوية استثمارية قصوى لكارجاس',
    section: 'المنافسة والحصة السوقية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-mkt-6',
    department: 'marketing',
    label: 'الشركة المنافسة الأقرب في النطاق الجغرافي',
    key: 'nearestCompetitorBrand',
    type: 'select',
    options: [
      'غازتك (Gastec)',
      'ماستر جاس (Master Gas)',
      'طاقة غاز (TAQA Gas)',
      'تشيل أوت (ChillOut)',
      'الوطنية (Wataniya)',
      'توتال إنرجيز (TotalEnergies)',
      'شل (Shell)',
      'موبيل (Mobil)',
      'مصر للبترول (Misr Petroleum)',
      'التعاون للبترول (Coop)',
      'لا توجد أي محطة غاز في نطاق 5 كم (سوق خالي تماماً)'
    ],
    required: true,
    visible: true,
    defaultValue: 'غازتك (Gastec)',
    section: 'المنافسة والحصة السوقية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-mkt-7',
    department: 'marketing',
    label: 'مواقف السرفيس ومركبات الأجرة المحيطة (نطاق 1.5 كم)',
    key: 'nearbyTransitHubs',
    type: 'select',
    options: [
      'موقف سرفيس وميكروباص إقليمي ضخم (+500 مركبة يومياً)',
      'محطة أتوبيسات نقل عام أو سرفيس متوسط (200 - 500 مركبة)',
      'موقف تاكسي وسيارات أجرة ونقل خفيف محلي',
      'منطقة سكنية وتجارية بحركة ملاكي وأوبر/ديدي كثيفة',
      'طريق شاحنات ونقل ثقيل يعمل بالديزل'
    ],
    required: true,
    visible: true,
    defaultValue: 'موقف سرفيس وميكروباص إقليمي ضخم (+500 مركبة يومياً)',
    section: 'الطلب والعملاء المستهدفون',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-mkt-8',
    department: 'marketing',
    label: 'مبيعات الوقود السائل الحالية للموقع (لتر/يوم)',
    key: 'existingLiquidFuelDailySalesLiters',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 25000,
    description: 'في حالة إضافة الغاز لمحطة وقود سائل قائمة (بنزين 92 / 95 / سولار)',
    section: 'الطلب والعملاء المستهدفون',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-mkt-9',
    department: 'marketing',
    label: 'مبيعات الغاز الطبيعي اليومية المستهدفة (متر مكعب/يوم)',
    key: 'targetCngDailySalesM3',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 12000,
    description: 'الهدف البيعي التقديري لتغطية التكاليف وتحقيق هوامش أرباح كارجاس',
    section: 'الطلب والعملاء المستهدفون',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-mkt-10',
    department: 'marketing',
    label: 'إمكانية تشغيل مركز تحويل سيارات وفحص أسطوانات',
    key: 'conversionCenterFeasibility',
    type: 'select',
    options: [
      'متاح مساحة كافية لإنشاء مركز تحويل وصيانة متكامل (ورشة + معرض أسطوانات)',
      'متاح مساحة لنقطة فحص واستبدال أسطوانات فقط',
      'غير متاح مساحة (محطة تموين غاز سريعة فقط)',
      'يوجد مركز تحويل كارجاس قائم قريب يخدم المنطقة'
    ],
    required: true,
    visible: true,
    defaultValue: 'متاح مساحة كافية لإنشاء مركز تحويل وصيانة متكامل (ورشة + معرض أسطوانات)',
    section: 'مراكز التحويل والصيانة',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-mkt-11',
    department: 'marketing',
    label: 'التقييم التسويقي الشامل لجاذبية الموقع',
    key: 'siteMarketingRating',
    type: 'select',
    options: [
      'فئة (+A) موقع استثنائي استراتيجي (كثافة فائقة وأولوية تنفيذ فورية)',
      'فئة (A) موقع ممتاز واعد تجارياً',
      'فئة (B) موقع جيد يحتاج تسويق وتنشيط تعاقدات أساطيل',
      'فئة (C) موقع محدود التدفق (مشروط بضمانات تشغيل)'
    ],
    required: true,
    visible: true,
    defaultValue: 'فئة (+A) موقع استثنائي استراتيجي (كثافة فائقة وأولوية تنفيذ فورية)',
    section: 'التقييم النهائي للتسويق',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },

  // Operations & Maintenance Fields (خاص بالمعدات والآلات)
  {
    id: 'fld-ops-1',
    department: 'operations',
    label: 'نوع وسعة ضاغط الغاز الطبيعي الرئيسي (Compressor)',
    key: 'compressorModelAndCapacity',
    type: 'select',
    options: [
      'ضاغط 1000 م³/ساعة - 250 بار (Aspro / Galileo)',
      'ضاغط 1500 م³/ساعة - 250 بار (Nuovo Pignone / Ariel)',
      'ضاغط 2000 م³/ساعة - 250 بار (محطات فائقة السعة)',
      'ضاغط هيدروليكي معياري 800 م³/ساعة (Compac)'
    ],
    required: true,
    visible: true,
    defaultValue: 'ضاغط 1000 م³/ساعة - 250 بار (Aspro / Galileo)',
    description: 'المعدة الرئيسية لضغط الغاز الطبيعي لـ 250 بار لتعبئة المركبات',
    section: 'بيانات المعدات والآلات',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-ops-2',
    department: 'operations',
    label: 'عدد موزعات الغاز الطبيعي (Dispensers)',
    key: 'dispenserCount',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 4,
    description: 'كل موزع يحتوي على مسدسين عالي وسريع الضغط',
    section: 'بيانات المعدات والآلات',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-ops-3',
    department: 'operations',
    label: 'سعة وحدة تجفيف الغاز (Gas Dryer Unit)',
    key: 'gasDryerStatus',
    type: 'select',
    options: ['وحدة تجفيف غاز ثنائية البرج متوافقة', 'وحدة تجفيف معيارية مدمجة بالضاغط', 'تحتاج توريد وحدة تجفيف خارجية'],
    required: true,
    visible: true,
    defaultValue: 'وحدة تجفيف غاز ثنائية البرج متوافقة',
    section: 'بيانات المعدات والآلات',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-ops-4',
    department: 'operations',
    label: 'خزانات الاسطوانات المتتالية (Cascade Storage Buffer)',
    key: 'cascadeStorageVolume',
    type: 'select',
    options: ['سعة 3000 لتر ماء (3 بنوك ضغط)', 'سعة 5000 لتر ماء (للكثافات العالية)', 'سعة 1500 لتر ماء (مواقع مدمجة)'],
    required: true,
    visible: true,
    defaultValue: 'سعة 3000 لتر ماء (3 بنوك ضغط)',
    section: 'بيانات المعدات والآلات',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-ops-5',
    department: 'operations',
    label: 'جاهزية لوحة الأولوية والتحكم الإلكتروني (Priority Panel)',
    key: 'priorityPanelStatus',
    type: 'boolean',
    required: true,
    visible: true,
    defaultValue: true,
    description: 'لوحة أولوية الملء لتسريع دورة التموين من الخزانات والضاغط',
    section: 'بيانات المعدات والآلات',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },

  // Projects & Engineering Fields
  {
    id: 'fld-proj-1',
    department: 'projects',
    label: 'مساحة الأرض الإجمالية المتاحة (متر مربع)',
    key: 'siteTotalAreaM2',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 550,
    section: 'الأبعاد والمدنيات',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-proj-2',
    department: 'projects',
    label: 'نوع التربة وأعمال الإحلال المطلوبة لقواعد الضاغط',
    key: 'soilTypeAndFoundations',
    type: 'text',
    required: true,
    visible: true,
    defaultValue: 'تربة رملية متماسكة - تحتاج قاعدة خرسانية مسلحة معزولة لامتصاص الاهتزازات',
    section: 'الأعمال الإنشائية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-proj-3',
    department: 'projects',
    label: 'حالة مظلة المحطة وحارات تموين المركبات',
    key: 'canopyAndLanesStatus',
    type: 'select',
    options: ['مظلة جديدة مستقلة خاصة بكارجاس', 'إضافة حارات لمظلة محطة وقود شريكة قائمة', 'مظلة مشتركة بنزين وغاز'],
    required: true,
    visible: true,
    defaultValue: 'إضافة حارات لمظلة محطة وقود شريكة قائمة',
    section: 'الأعمال الإنشائية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },

  // HSE Fields
  {
    id: 'fld-hse-1',
    department: 'hse',
    label: 'مسافة الأمان لكود NFPA 52 بين الضاغط وخزانات الوقود السائل (متر)',
    key: 'nfpaSafetyDistanceMeters',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 15,
    description: 'الحد الأدنى للمسافة لا يقل عن 7.5 متر طبقاً لكود NFPA 52 الأمريكي والاشتراطات المصرية',
    section: 'اشتراطات السلامة والحرائق',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-hse-2',
    department: 'hse',
    label: 'نظام كشف تسريب الغاز والحريق الآلي (Gas & Flame Detection)',
    key: 'gasDetectionSystem',
    type: 'select',
    options: ['كواشف بصرية وحرارية وكواشف أشعة تحت حمراء لميثان الغاز مع إنذار صوتي', 'كواشف نقطية قياسية', 'نظام متكامل مربوط بالإغلاق التلقائي'],
    required: true,
    visible: true,
    defaultValue: 'نظام متكامل مربوط بالإغلاق التلقائي',
    section: 'اشتراطات السلامة والحرائق',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },

  // Technical Fields
  {
    id: 'fld-tech-1',
    department: 'technical',
    label: 'ضغط خط الغاز الطبيعي المغذي من الشبكة القومية (Bar)',
    key: 'gridGasPressureBar',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 7,
    description: 'الضغط الطبيعي لشبكة التوزيع يقع بين 4 إلى 16 بار',
    section: 'الشبكة القومية والتغذية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-tech-2',
    department: 'technical',
    label: 'مسافة أقرب خط غاز رئيسي حتى موقع المحطة (متر)',
    key: 'distanceToGasGridMeters',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 120,
    section: 'الشبكة القومية والتغذية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },

  // Licensing Fields
  {
    id: 'fld-lic-1',
    department: 'licensing',
    label: 'موقف موافقة إدارة الحماية المدنية على الموقع',
    key: 'civilDefenseApprovalStatus',
    type: 'select',
    options: ['موافقة نهائية صادرة وسارية', 'موافقة مبدئية مشروطة بتنفيذ شبكة الإطفاء', 'قيد الفحص والمراجعة الميدانية', 'لم تبدأ إجراءات التقديم'],
    required: true,
    visible: true,
    defaultValue: 'موافقة مبدئية مشروطة بتنفيذ شبكة الإطفاء',
    section: 'التراخيص والموافقات',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },

  // Legal Fields
  {
    id: 'fld-leg-1',
    department: 'legal',
    label: 'طبيعة السند القانوني للأرض / المحطة',
    key: 'landTenureType',
    type: 'select',
    options: ['عقد شراكة واستغلال مع محطة بترول (مصر للبترول / التعاون / توتال / شل)', 'ملكية خالصة مسجلة بالشهر العقاري', 'عقد إيجار طويل الأجل (15 - 25 سنة)', 'حق انتفاع مع هيئة حكومية / محافظة'],
    required: true,
    visible: true,
    defaultValue: 'عقد شراكة واستغلال مع محطة بترول (مصر للبترول / التعاون / توتال / شل)',
    section: 'الملف القانوني والعقود',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },

  // Financial Fields
  {
    id: 'fld-fin-1',
    department: 'financial',
    label: 'إجمالي التكلفة الاستثمارية التقديرية (مليون جنيه)',
    key: 'totalInvestmentCapexMillion',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 14.5,
    section: 'الجدوى والمؤشرات المالية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  },
  {
    id: 'fld-fin-2',
    department: 'financial',
    label: 'فترة استرداد رأس المال المتوقعة (سنوات)',
    key: 'paybackPeriodYears',
    type: 'number',
    required: true,
    visible: true,
    defaultValue: 2.8,
    section: 'الجدوى والمؤشرات المالية',
    createdBy: 'إدارة النظام',
    createdAt: '2026-01-01'
  }
];

// Initial Pending Form Modification Requests from Departments to Admin
export const INITIAL_FORM_CHANGE_REQUESTS: FormChangeRequest[] = [
  {
    id: 'req-1',
    department: 'operations',
    departmentName: 'إدارة التشغيل والصيانة (المعدات والآلات)',
    requesterName: 'م. سامح الجمال (مدير عام التشغيل والصيانة)',
    requestType: 'add_field',
    fieldLabel: 'ساعات تشغيل الضاغط الدورية قبل العمرة (Compressor Running Hours)',
    fieldType: 'number',
    fieldKey: 'compressorServiceIntervalHours',
    justification: 'مهم جداً لحساب مواعيد الصيانة الوقائية وتبديل فلاتر الزيت والغاز ووصلات الضغط العالي',
    proposedSection: 'بيانات المعدات والآلات',
    status: 'pending',
    submittedAt: '2026-03-15 11:30'
  },
  {
    id: 'req-2',
    department: 'marketing',
    departmentName: 'إدارة التسويق والدراسات الميدانية',
    requesterName: 'أ. هاني سراج (رئيس قسم التسويق والمبيعات)',
    requestType: 'add_field',
    fieldLabel: 'عدد خطوط السرفيس ومواقف الميكروباص المحيطة بالموقع (500 متر)',
    fieldType: 'number',
    fieldKey: 'nearbyMicrobusHubsCount',
    justification: 'لتقدير حجم سيارات الأجرة اليومية الراغبة في التحويل والتموين بالغاز',
    proposedSection: 'الدراسة الميدانية والطلب',
    status: 'pending',
    submittedAt: '2026-03-16 09:15'
  }
];
