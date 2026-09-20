import { DepartmentRole, PeriodicTaskItem, DepartmentEvaluationReport } from '../types';

export const INITIAL_PERIODIC_TASKS: PeriodicTaskItem[] = [
  // 1. Projects & Civil
  {
    id: 'pt-proj-1',
    department: 'projects',
    title: 'مراجعة نسب الإنجاز المدني الأسبوعية مع المقاول العام',
    description: 'مطابقة أعمال الخرسانات المسلحة وقواعد الضواغط والمظلات مع الجدول الزمني المعتمد وتوقيع محضر الأعمال الأسبوعي.',
    category: 'إشراف مدني وإنشائي',
    frequency: 'weekly',
    frequencyLabel: 'أسبوعي',
    assignedTo: 'م. أحمد الشربيني',
    assignedPhone: '+201012345671',
    dueDate: '2026-09-24',
    lastExecutedDate: '2026-09-17',
    nextScheduledDate: '2026-09-24',
    status: 'in_progress',
    priority: 'high',
    notes: 'جاري استكمال تسليح حوض صهاريج التخزين والمظلة الرئيسية'
  },
  {
    id: 'pt-proj-2',
    department: 'projects',
    title: 'معاينة واختبار هبوط قواعد ضواغط الغاز (Vibration Pads)',
    description: 'فحص استواء وامتصاص الاهتزازات لقواعد ضواغط الغاز 250 بار والتأكد من عدم وجود تشققات مجهرية.',
    category: 'ضبط جودة الخرسانة',
    frequency: 'monthly',
    frequencyLabel: 'شهري',
    assignedTo: 'م. سامح جودة',
    assignedPhone: '+201012345672',
    dueDate: '2026-09-30',
    lastExecutedDate: '2026-08-31',
    nextScheduledDate: '2026-09-30',
    status: 'scheduled',
    priority: 'high',
    notes: 'تم فحص المنسوب الليزري والتسجيل بالدفتر الفني'
  },
  {
    id: 'pt-proj-3',
    department: 'projects',
    title: 'اعتماد مستخلصات الأعمال الجارية ومطابقة جدول الكميات',
    description: 'حصر الكميات المنفذة فعلياً ومطابقتها مع بنود العقد ومستندات الطرح والأسعار المعتمدة.',
    category: 'مستخلصات هندسية',
    frequency: 'monthly',
    frequencyLabel: 'شهري',
    assignedTo: 'م. تامر ممدوح',
    dueDate: '2026-10-05',
    lastExecutedDate: '2026-09-05',
    nextScheduledDate: '2026-10-05',
    status: 'scheduled',
    priority: 'medium'
  },

  // 2. Operations & Compressors
  {
    id: 'pt-ops-1',
    department: 'operations',
    title: 'الفحص اليومي لضواغط الغاز الطبيعي (250 بار)',
    description: 'مراجعة ضغوط السحب والطرد، حرارة الزيت، ضغط التزييت، والتأكد من عدم وجود اهتزازات غير طبيعية في الكومبريسور.',
    category: 'صيانة تشغيل يومية',
    frequency: 'daily',
    frequencyLabel: 'يومي',
    assignedTo: 'فني/ كريم عبد الغني',
    assignedPhone: '+201023456781',
    dueDate: '2026-09-20',
    lastExecutedDate: '2026-09-19',
    nextScheduledDate: '2026-09-21',
    status: 'completed',
    priority: 'high',
    notes: 'الضواغط تعمل بكفاءة 98% وضغط الطرد مستقر عند 252 بار'
  },
  {
    id: 'pt-ops-2',
    department: 'operations',
    title: 'معايرة واختبار دقة عدادات طلمبات التموين (Dispensers)',
    description: 'معايرة كمية الغاز المتدفقة لكل متر مكعب قياسي Sm3 ومطابقة قراءات العداد الميكانيكي والإلكتروني.',
    category: 'معايرة قياس',
    frequency: 'weekly',
    frequencyLabel: 'أسبوعي',
    assignedTo: 'م. إبراهيم فوزي',
    assignedPhone: '+201023456782',
    dueDate: '2026-09-22',
    lastExecutedDate: '2026-09-15',
    nextScheduledDate: '2026-09-22',
    status: 'scheduled',
    priority: 'high'
  },
  {
    id: 'pt-ops-3',
    department: 'operations',
    title: 'تغيير فلاتر مجفف الغاز (Gas Dryer) وفحص الرطوبة والندى',
    description: 'فحص مادة السيليكا جيل وفلاتر الشوائب لضمان وصول غاز جاف تماماً وخالٍ من الرطوبة للمركبات.',
    category: 'معالجة وتنقية الغاز',
    frequency: 'monthly',
    frequencyLabel: 'شهري',
    assignedTo: 'م. حسام غانم',
    dueDate: '2026-10-01',
    nextScheduledDate: '2026-10-01',
    status: 'scheduled',
    priority: 'medium'
  },

  // 3. HSE (Safety & Environment)
  {
    id: 'pt-hse-1',
    department: 'hse',
    title: 'فحص واختبار صمامات الإغلاق التلقائي في الطوارئ (ESD Valves)',
    description: 'اختبار أزرار الطوارئ ESD بالموقع والتأكد من عزل خط الغاز الرئيسي خلال أقل من ثانية واحدة.',
    category: 'إيقاف طوارئ وسلامة',
    frequency: 'weekly',
    frequencyLabel: 'أسبوعي',
    assignedTo: 'أخصائي سلامة/ مصطفى رضوان',
    assignedPhone: '+201034567891',
    dueDate: '2026-09-21',
    lastExecutedDate: '2026-09-14',
    nextScheduledDate: '2026-09-21',
    status: 'scheduled',
    priority: 'high',
    notes: 'تمت تجربة زر الطوارئ على خط المظلة رقم 1 بنجاح'
  },
  {
    id: 'pt-hse-2',
    department: 'hse',
    title: 'معايرة حساسات تسريب الغاز الميثان (Gas Detectors CH4)',
    description: 'معايرة أجهزة الاستشعار بالأشعة تحت الحمراء عند 20% و 40% من الحد الأدنى للاشتعال (LEL).',
    category: 'كشف تسريب غاز',
    frequency: 'monthly',
    frequencyLabel: 'شهري',
    assignedTo: 'م. حازم السعيد',
    assignedPhone: '+201034567892',
    dueDate: '2026-09-25',
    nextScheduledDate: '2026-09-25',
    status: 'in_progress',
    priority: 'high'
  },
  {
    id: 'pt-hse-3',
    department: 'hse',
    title: 'إجراء محاكاة تجربة إخلاء ومكافحة حريق مع العاملين',
    description: 'تدريب عمال المحطة على استخدام طفايات البودرة الجافة وتصرفات الطوارئ مع سيارات العملاء.',
    category: 'تدريب وتأهيل السلامة',
    frequency: 'quarterly',
    frequencyLabel: 'ربع سنوي',
    assignedTo: 'أخصائي سلامة/ وليد حمدي',
    dueDate: '2026-10-15',
    nextScheduledDate: '2026-10-15',
    status: 'scheduled',
    priority: 'medium'
  },

  // 4. Technical
  {
    id: 'pt-tech-1',
    department: 'technical',
    title: 'قياس ضغوط خط الربط الشبكي ومحطة تخفيض الضغط والقياس (PRMS)',
    description: 'مطابقة ضغط خط الغاز الوارد من الشبكة القومية (16 - 70 بار) مع ضغط الدخول للضواغط وتسجيل الفروق.',
    category: 'شبكات وخطوط غاز',
    frequency: 'weekly',
    frequencyLabel: 'أسبوعي',
    assignedTo: 'م. شريف عبد المنعم',
    dueDate: '2026-09-23',
    nextScheduledDate: '2026-09-23',
    status: 'scheduled',
    priority: 'high'
  },
  {
    id: 'pt-tech-2',
    department: 'technical',
    title: 'فحص ومقاومة التأريض الكهربائي ومانعات الصواعق',
    description: 'قياس مقاومة الأرضي لأجسام الضواغط والاسطوانات والتأكد من أنها أقل من 4 أوم طبقاً لكود NFPA 52.',
    category: 'تأريض وحماية كاثودية',
    frequency: 'semi_annual',
    frequencyLabel: 'نصف سنوي',
    assignedTo: 'م. حسام عاشور',
    dueDate: '2026-11-01',
    nextScheduledDate: '2026-11-01',
    status: 'scheduled',
    priority: 'high'
  },

  // 5. Licensing & Government
  {
    id: 'pt-lic-1',
    department: 'licensing',
    title: 'متابعة تجديد رخصة التشغيل ومطابقة اشتراطات الحماية المدنية',
    description: 'متابعة ملف المحطة لدى إدارة الحماية المدنية بالمحافظة واستلام تقرير المعاينة النهائي.',
    category: 'تراخيص دفاع مدني',
    frequency: 'monthly',
    frequencyLabel: 'شهري',
    assignedTo: 'أ. مجدي عبد السلام',
    assignedPhone: '+201045678901',
    dueDate: '2026-09-28',
    nextScheduledDate: '2026-09-28',
    status: 'in_progress',
    priority: 'high'
  },
  {
    id: 'pt-lic-2',
    department: 'licensing',
    title: 'متابعة تصاريح جهاز المدينة ومطابقة السجل البيئي مع جهاز شؤون البيئة',
    description: 'تجديد السجل البيئي للمحطة ومطابقة قياسات الضوضاء والانبعاثات مع اللائحة التنفيذية لقانون البيئة.',
    category: 'موافقات بيئية وتخطيط',
    frequency: 'quarterly',
    frequencyLabel: 'ربع سنوي',
    assignedTo: 'أ. كمال بدر',
    dueDate: '2026-10-20',
    nextScheduledDate: '2026-10-20',
    status: 'scheduled',
    priority: 'medium'
  },

  // 6. Legal
  {
    id: 'pt-leg-1',
    department: 'legal',
    title: 'المراجعة الدورية لعقود توريد المعدات ووثائق التأمين الشامل',
    description: 'مراجعة سريان وثائق التأمين ضد أخطار الحريق والمسؤولية المدنية تجاه الغير لموقع المحطة.',
    category: 'عقود وتأمين',
    frequency: 'quarterly',
    frequencyLabel: 'ربع سنوي',
    assignedTo: 'المستشار/ هشام الشافعي',
    dueDate: '2026-10-10',
    nextScheduledDate: '2026-10-10',
    status: 'scheduled',
    priority: 'medium'
  },

  // 7. Financial
  {
    id: 'pt-fin-1',
    department: 'financial',
    title: 'المطابقة الشهرية لإيرادات مبيعات الغاز ومستحقات الهيئة العامة للبترول',
    description: 'مطابقة عدادات البيع اليومية مع الدفع الإلكتروني وتحويل نصيب الهيئة العامة للبترول وشركة إيجاس.',
    category: 'تسويات مالية وبترول',
    frequency: 'monthly',
    frequencyLabel: 'شهري',
    assignedTo: 'أ. هيثم توفيق',
    dueDate: '2026-09-30',
    nextScheduledDate: '2026-09-30',
    status: 'scheduled',
    priority: 'high'
  },

  // 8. Marketing
  {
    id: 'pt-mkt-1',
    department: 'marketing',
    title: 'مسح وحصر الكثافة المرورية الدوري لسيارات التاكسي والميكروباص',
    description: 'تشغيل كاميرا الرصد الذكي بالموقع لقياس تدفق المركبات المؤهلة للتحويل وتحديث دراسة الجدوى.',
    category: 'دراسات سوق وحصر مروري',
    frequency: 'monthly',
    frequencyLabel: 'شهري',
    assignedTo: 'أ. عادل نور الدين',
    assignedPhone: '+201056789012',
    dueDate: '2026-09-26',
    lastExecutedDate: '2026-08-25',
    nextScheduledDate: '2026-09-26',
    status: 'in_progress',
    priority: 'high',
    notes: 'متوسط الحصر 2,450 سيارة يومياً مع قابلية تحويل 62%'
  }
];

export const INITIAL_DEPARTMENT_EVALUATIONS: Record<DepartmentRole, DepartmentEvaluationReport> = {
  projects: {
    id: 'eval-projects-2026-q3',
    department: 'projects',
    departmentName: 'إدارة المشروعات والأعمال المدنية',
    gmName: 'م. طارق عبد الحميد',
    evaluationPeriod: 'الربع الثالث 2026',
    evaluatedAt: '2026-09-15',
    evaluatorName: 'لجنة الإدارة العليا ومتابعة المشروعات',
    evaluatorRole: 'Super Admin Central Committee',
    overallScore: 94,
    grade: 'A+',
    gradeLabel: 'ممتاز مرتفع (Exceeds Expectations)',
    approvedBySuperAdmin: true,
    executiveSummary: 'أظهرت إدارة المشروعات التزاماً هندسياً فائقاً في تنفيذ القواعد الإنشائية وشبكات خطوط الغاز بمحطة السويس والقاهرة الكبرى مع تقليص مدة التنفيذ أسبوعين عن المخطط.',
    keyStrengths: [
      'التنفيذ المسبق لصب قواعد الضواغط ومظلات التموين بنسبة إنجاز 86% مقارنة بـ 84% المخططة.',
      'التنسيق الاحترافي مع استشاري المشروع والمقاول العام وتلافي ملاحظات التربة سريعاً.',
      'ضبط الجودة لعينات الخرسانة واختبارات كسر المكعبات بنسبة نجاح 100%.'
    ],
    areasOfImprovement: [
      'تحديث تقارير التوثيق اليومية عبر تطبيق الهاتف لتقليل الفارق الزمني للإدخال.',
      'الربط الرقمي اللحظي مع إدارة السلامة HSE لتوثيق تصاريح العمل الساخن رقمياً.'
    ],
    criteria: [
      {
        id: 'c-1',
        title: 'الالتزام بالجدول الزمني ومواعيد التسليم المحددة',
        weightPercent: 25,
        score: 96,
        benchmark: 90,
        notes: 'إنجاز متقدم بمقدار +2% عن المخطط الزمني المعتمد لعام 2026',
        strengths: ['الالتزام بالمسار الحرج Critical Path'],
        recommendations: ['الاستمرار بنفس وتيرة العمل لإنهاء محطة السويس']
      },
      {
        id: 'c-2',
        title: 'معايير الجودة والأمن الصناعي والسلامة الهندسية',
        weightPercent: 25,
        score: 95,
        benchmark: 92,
        notes: 'تطبيق كامل لكود NFPA 52 واشتراطات الهيئة العامة للبترول',
        strengths: ['صفر حوادث مهنية خلال الربع الحالي'],
        recommendations: ['استمرار ارتداء مهمات الوقاية PPE لجميع العمال']
      },
      {
        id: 'c-3',
        title: 'كفاءة الصرف وإدارة الموازنة والمستخلصات',
        weightPercent: 20,
        score: 92,
        benchmark: 90,
        notes: 'صرف المستخلصات الجارية في حدود الموازنة المعتمدة بدون تجاوزات سعرية',
        strengths: ['مراجعة دقيقة لدفاتر الحصر'],
        recommendations: ['تسريع دورة توقيع مستخلصات الأعمال الترابية']
      },
      {
        id: 'c-4',
        title: 'سرعة إنجاز المهام الدورية والتكليفات الميدانية',
        weightPercent: 15,
        score: 93,
        benchmark: 88,
        notes: 'إتمام 18 مهمة دورية من أصل 19 مهمة مجدولة بنجاح',
        strengths: ['سرعة الاستجابة الميدانية للمهندسين'],
        recommendations: ['توثيق المعاينات بالصور الجغرافية الحية']
      },
      {
        id: 'c-5',
        title: 'الاستجابة للتوجيهات وملاحظات إدارة النظام',
        weightPercent: 15,
        score: 94,
        benchmark: 90,
        notes: 'تلافي الملاحظات المرفوعة من لجان المتابعة خلال أقل من 48 ساعة',
        strengths: ['تواصل فعال مع إدارة النظام'],
        recommendations: ['حفظ نسخ احتياطية من محاضر الاستلام الابتدائي']
      }
    ]
  },
  operations: {
    id: 'eval-operations-2026-q3',
    department: 'operations',
    departmentName: 'إدارة التشغيل والمعدات والضواغط',
    gmName: 'م. حازم المنشاوي',
    evaluationPeriod: 'الربع الثالث 2026',
    evaluatedAt: '2026-09-16',
    evaluatorName: 'لجنة الإدارة العليا والتحكم',
    evaluatorRole: 'Super Admin Central Committee',
    overallScore: 92,
    grade: 'A',
    gradeLabel: 'ممتاز (Exceeds Standards)',
    approvedBySuperAdmin: true,
    executiveSummary: 'جاهزية متقدمة لضواغط الغاز ومعدات الضغط العالي مع برنامج صيانة وقائية منتظم يحافظ على استمرارية الضخ وتفادي توقف المحطات.',
    keyStrengths: [
      'الفحص اليومي لضواغط 250 بار بنسبة التزام 99%.',
      'معايرة دورية دقيقة لموزعات الغاز الطبيعي (Dispensers).',
      'توفير قطع الغيار الحرجة لصمامات السحب والطرد مسبقاً.'
    ],
    areasOfImprovement: [
      'تدريب الفنيين الجدد على قراءة أجهزة تحليل الغاز الرقمية.',
      'ربط عدادات ساعات التشغيل لاسلكياً مع لوحة المتابعة المركزية.'
    ],
    criteria: [
      { id: 'c-1', title: 'الالتزام بجدول جاهزية المعدات والتشغيل', weightPercent: 25, score: 91, benchmark: 90, notes: 'المعدات جاهزة للتشغيل بنسبة 98%', strengths: ['صيانة وقائية دورية'], recommendations: ['تقليل زمن التوقف للصيانة'] },
      { id: 'c-2', title: 'الأمن الصناعي والسلامة التشغيلية', weightPercent: 25, score: 95, benchmark: 92, notes: 'اختبارات ضغط الهيدروستاتيك مطابقة للمواصفات', strengths: ['فحص دوري لمنظومة ESD'], recommendations: ['تثبيت إشارات التحذير باللغتين'] },
      { id: 'c-3', title: 'إدارة تكاليف التشغيل والصيانة', weightPercent: 20, score: 90, benchmark: 88, notes: 'وفر في استهلاك زيوت التزييت بنسبة 6%', strengths: ['مراقبة كفاءة الطاقة'], recommendations: ['مراجعة تسعير قطع الغيار البديلة'] },
      { id: 'c-4', title: 'إنجاز المهام الدورية والمعايرات', weightPercent: 15, score: 93, benchmark: 90, notes: 'إتمام 24 فحصاً دورياً شهرياً في موعده', strengths: ['التزام كامل بالمعايرات'], recommendations: ['إرفاق شهادات المعايرة بالمنظومة'] },
      { id: 'c-5', title: 'الاستجابة وتلافي ملاحظات الأعطال', weightPercent: 15, score: 92, benchmark: 88, notes: 'زمن استجابة للأعطال الطارئة أقل من 45 دقيقة', strengths: ['فرق طوارئ متنقلة'], recommendations: ['زيادة رصيد قطع الغيار بالمحافظات'] }
    ]
  },
  hse: {
    id: 'eval-hse-2026-q3',
    department: 'hse',
    departmentName: 'إدارة السلامة والصحة المهنية (HSE)',
    gmName: 'د. أشرف الصاوي',
    evaluationPeriod: 'الربع الثالث 2026',
    evaluatedAt: '2026-09-17',
    evaluatorName: 'لجنة الإدارة العليا والتحكم',
    evaluatorRole: 'Super Admin Central Committee',
    overallScore: 97,
    grade: 'A+',
    gradeLabel: 'ممتاز مرتفع (Benchmark / القيادة المثالية)',
    approvedBySuperAdmin: true,
    executiveSummary: 'أعلى تقييم بالمنظومة في معايير السلامة وصفر حوادث، مع تدريب شامل لكافة العاملين على كود NFPA 52 والجاهزية للطوارئ.',
    keyStrengths: [
      'سجل سلامة نظيف 100% وبدون أي حوادث أو إصابات مهنية (Zero Lost-Time Incidents).',
      'فحص واختبار أسبوعي لصمامات الطوارئ ESD وكواشف الميثان CH4.',
      'محاكاة دورية للإخلاء ومكافحة الحريق بالتعاون مع الدفاع المدني.'
    ],
    areasOfImprovement: [
      'تحديث لوحات الإرشاد الرقمية التفاعلية أمام العملاء.',
      'توزيع حقائب طوارئ طبية إضافية بمراكز التحويل.'
    ],
    criteria: [
      { id: 'c-1', title: 'الالتزام بجدول التفتيش الدوري للسلامة', weightPercent: 25, score: 98, benchmark: 95, notes: 'تفتيش دوري لجميع المحطات والمواقع الجارية', strengths: ['تغطية 100% للمواقع'], recommendations: ['الاستمرار بنفس الكفاءة'] },
      { id: 'c-2', title: 'معايير جودة السلامة والأمن الصناعي', weightPercent: 25, score: 99, benchmark: 95, notes: 'تطبيق المعايير القياسية العالمية للغاز الطبيعي', strengths: ['شهادات مطابقة NFPA'], recommendations: ['نشر ثقافة السلامة للجمهور'] },
      { id: 'c-3', title: 'كفاءة موازنة مهمات الوقاية وأجهزة الرصد', weightPercent: 20, score: 94, benchmark: 90, notes: 'شراء أجود أجهزة استشعار الميثان بأفضل تكلفة', strengths: ['عقود توريد مباشرة'], recommendations: ['تأمين مخزون إضافي من طفايات CO2'] },
      { id: 'c-4', title: 'تنفيذ برامج التدريب والتجارب الوهمية', weightPercent: 15, score: 96, benchmark: 90, notes: 'تدريب 140 عاملاً وسائقاً على التعامل مع الغاز', strengths: ['ورش عمل تفاعلية'], recommendations: ['منح شهادات اجتياز رقمية'] },
      { id: 'c-5', title: 'الاستجابة لتقارير تلافي الملاحظات', weightPercent: 15, score: 97, benchmark: 92, notes: 'إغلاق 100% من الملاحظات التفتيشية فورياً', strengths: ['متابعة حازمة وفورية'], recommendations: ['إدراج تنبيهات آلية للمخالفات'] }
    ]
  },
  technical: {
    id: 'eval-technical-2026-q3',
    department: 'technical',
    departmentName: 'الإدارة الفنية ومحطات الغاز',
    gmName: 'م. خالد الدسوقي',
    evaluationPeriod: 'الربع الثالث 2026',
    evaluatedAt: '2026-09-14',
    evaluatorName: 'لجنة الإدارة العليا والتحكم',
    evaluatorRole: 'Super Admin Central Committee',
    overallScore: 91,
    grade: 'A',
    gradeLabel: 'ممتاز (Exceeds Standards)',
    approvedBySuperAdmin: true,
    executiveSummary: 'إشراف فني متميز على شبكات الربط وقياسات الغاز ومحطات PRMS مع اعتماد المخططات الهندسية بدقة.',
    keyStrengths: ['مراجعة دقيقة لضغوط الشبكة القومية.', 'تصميم دوائر الأمان الكهربائي والحماية الكاثودية.', 'جاهزية الفحوصات الفنية للاستلام الابتدائي.'],
    areasOfImprovement: ['تقليص مدة اعتماد الرسومات التفصيلية (As-Built Drawings).'],
    criteria: [
      { id: 'c-1', title: 'الالتزام بجدول الاعتمادات الفنية', weightPercent: 25, score: 89, benchmark: 90, notes: 'اعتماد 92% من التصاميم في الموعد', strengths: ['دقة هندسية عالية'], recommendations: ['تسريع اعتماد لوحات التحكم'] },
      { id: 'c-2', title: 'معايير الجودة الفنية والمواصفات القياسية', weightPercent: 25, score: 94, benchmark: 90, notes: 'مطابقة تامة لمواصفات شركة إيجاس', strengths: ['فحص دقيق للمواد'], recommendations: ['تحديث مكتبة المواصفات'] },
      { id: 'c-3', title: 'كفاءة دراسات الجدوى الهندسية', weightPercent: 20, score: 91, benchmark: 88, notes: 'تحديد أدق مسارات خطوط الربط بأقل تكلفة حفر', strengths: ['وفر في مسارات الخطوط'], recommendations: ['التنسيق المبكر مع شركات المرافق'] },
      { id: 'c-4', title: 'إنجاز المهام والفحوصات الدورية', weightPercent: 15, score: 92, benchmark: 88, notes: 'إتمام كافة قياسات المقاومة والأرضي', strengths: ['أجهزة قياس حديثة ومكودة'], recommendations: ['توثيق تقارير الفحص رقمياً'] },
      { id: 'c-5', title: 'الاستجابة للاستفسارات الهندسية', weightPercent: 15, score: 90, benchmark: 88, notes: 'تقديم الدعم الفني لفرق العمل بالموقع', strengths: ['حلول هندسية مبتكرة'], recommendations: ['تنظيم جلسات دعم فني أسبوعية'] }
    ]
  },
  licensing: {
    id: 'eval-licensing-2026-q3',
    department: 'licensing',
    departmentName: 'إدارة التراخيص والموافقات الحكومية',
    gmName: 'أ. مجدي عبد السلام',
    evaluationPeriod: 'الربع الثالث 2026',
    evaluatedAt: '2026-09-12',
    evaluatorName: 'لجنة الإدارة العليا والتحكم',
    evaluatorRole: 'Super Admin Central Committee',
    overallScore: 88,
    grade: 'B+',
    gradeLabel: 'جيد جداً مرتفع (Very Good)',
    approvedBySuperAdmin: true,
    executiveSummary: 'متابعة حثيثة لملفات التراخيص مع جهات الدولة والحماية المدنية والبيئة وأجهزة المدن الجديدة مع تسريع استخراج تصاريح الحفر.',
    keyStrengths: ['علاقات حكومية وتنسيق فعال.', 'استخراج موافقة الحماية المدنية بمحافظة السويس.', 'إتمام المعاينة البيئية المبدئية بنجاح.'],
    areasOfImprovement: ['متابعة رخصة تشغيل المحطة النهائية مع الحي لتقليص البيروقراطية.'],
    criteria: [
      { id: 'c-1', title: 'الالتزام بالجدول الزمني لإصدار التراخيص', weightPercent: 25, score: 85, benchmark: 88, notes: 'تأخير طفيف ناتج عن إجراءات مراجعة الحماية المدنية', strengths: ['متابعة يومية للجهات'], recommendations: ['تقديم الملفات رقمياً عبر بوابة الخدمات'] },
      { id: 'c-2', title: 'دقة واكتمال المستندات القانونية والفنية', weightPercent: 25, score: 92, benchmark: 90, notes: 'ملفات مستوفاة لكافة الاشتراطات والرسومات', strengths: ['تجهيز مسبق ومتقن'], recommendations: ['أرشفة رقمية سحابية للموافقات'] },
      { id: 'c-3', title: 'إدارة الرسوم الحكومية وتراخيص الحفر', weightPercent: 20, score: 90, benchmark: 88, notes: 'سداد الرسوم بالقيم القانونية المعتمدة', strengths: ['تفاوض ممتاز لرسوم الطرق'], recommendations: ['تتبع إيصالات السداد بدقة'] },
      { id: 'c-4', title: 'متابعة المهام الدورية والموافقات المرحلية', weightPercent: 15, score: 87, benchmark: 88, notes: 'تجديد تصاريح العمل المؤقتة في موعدها', strengths: ['تواصل مباشر مع مسؤولي المدن'], recommendations: ['إنشاء جدول تنبيه مبكر للتجديدات'] },
      { id: 'c-5', title: 'الاستجابة لمتطلبات إدارة النظام', weightPercent: 15, score: 89, benchmark: 88, notes: 'تحديث حالة كل رخصة في المنظومة دورياً', strengths: ['وضوح الموقف القانوني'], recommendations: ['رفع صور التراخيص فحصاً ضوئياً بجودة عالية'] }
    ]
  },
  legal: {
    id: 'eval-legal-2026-q3',
    department: 'legal',
    departmentName: 'الإدارة القانونية والتعاقدات',
    gmName: 'المستشار/ هشام الشافعي',
    evaluationPeriod: 'الربع الثالث 2026',
    evaluatedAt: '2026-09-13',
    evaluatorName: 'لجنة الإدارة العليا والتحكم',
    evaluatorRole: 'Super Admin Central Committee',
    overallScore: 93,
    grade: 'A',
    gradeLabel: 'ممتاز (Exceeds Standards)',
    approvedBySuperAdmin: true,
    executiveSummary: 'صياغة قانونية متينة لعقود إيجار الأراضي ومقاولات التنفيذ مع حماية مصالح شركة كارجاس بنسبة 100%.',
    keyStrengths: ['تدقيق بنود الملكية وسندات ملكية أراضي المحطات.', 'حماية الشركة من أي غرامات تأخير أو نزاعات.', 'صياغة بروتوكولات التعاون مع شركات البترول الشقيقة.'],
    areasOfImprovement: ['تسريع دراسة العقود النموذجية للعملاء التجاريين.'],
    criteria: [
      { id: 'c-1', title: 'الالتزام بمواعيد مراجعة وصياغة العقود', weightPercent: 25, score: 93, benchmark: 90, notes: 'مراجعة عقود المقاولين خلال 72 ساعة', strengths: ['سرعة في الصياغة المحكمة'], recommendations: ['اعتماد نماذج عقود موحدة'] },
      { id: 'c-2', title: 'جودة الصياغة وحماية حقوق الشركة', weightPercent: 25, score: 96, benchmark: 92, notes: 'عقود محصنة قانونياً ومتوافقة مع قانون المناقصات', strengths: ['بنود واضحة للضمان والصيانة'], recommendations: ['تضمين شروط التحكيم السريع'] },
      { id: 'c-3', title: 'إدارة الالتزامات والضمانات البنكية', weightPercent: 20, score: 92, benchmark: 90, notes: 'متابعة خطابات الضمان المبدئية والنهائية للمقاولين', strengths: ['سريان خطابات الضمان بنسبة 100%'], recommendations: ['تنبيه مالي قبل انتهاء الضمان بـ 30 يوماً'] },
      { id: 'c-4', title: 'إنجاز المهام الدورية والاستشارات القانونية', weightPercent: 15, score: 91, benchmark: 88, notes: 'تقديم 16 رأياً واستشارة قانونية للإدارات', strengths: ['دعم قانوني فوري'], recommendations: ['أرشفة الفتاوى القانونية'] },
      { id: 'c-5', title: 'الاستجابة لمتطلبات المنظومة', weightPercent: 15, score: 94, benchmark: 90, notes: 'تحديث بيانات العقود والوثائق الرسمية بالمنظومة', strengths: ['دقة عالية في البيانات'], recommendations: ['الاستمرار بنفس مستوى التدقيق'] }
    ]
  },
  financial: {
    id: 'eval-financial-2026-q3',
    department: 'financial',
    departmentName: 'الإدارة المالية ودراسات الجدوى',
    gmName: 'أ. هيثم توفيق',
    evaluationPeriod: 'الربع الثالث 2026',
    evaluatedAt: '2026-09-16',
    evaluatorName: 'لجنة الإدارة العليا والتحكم',
    evaluatorRole: 'Super Admin Central Committee',
    overallScore: 95,
    grade: 'A+',
    gradeLabel: 'ممتاز مرتفع (Exceeds Expectations)',
    approvedBySuperAdmin: true,
    executiveSummary: 'إدارة مالية حكيمة، تدقيق مستمر للموازنات التقديرية، تسويات منتظمة مع الهيئة المصرية العامة للبترول، ونموذج جدوى اقتصادية دقيق.',
    keyStrengths: ['تدقيق مستخلصات التنفيذ وتوفير 420 ألف جنيه من فروق الأسعار غير المستحقة.', 'مطابقة يومية لحصيلة مبيعات الغاز والدفع الإلكتروني.', 'تحديث حاسبة الوفر للعملاء ومعدلات فترات الاسترداد Payback Period.'],
    areasOfImprovement: ['تطوير تقارير التدفقات النقدية التقديرية لمشاريع المحطات الجديدة.'],
    criteria: [
      { id: 'c-1', title: 'الالتزام بمواعيد إعداد ومراجعة الموازنات', weightPercent: 25, score: 96, benchmark: 92, notes: 'موازنة المحطات منضبطة ومطابقة للمستهدف', strengths: ['رقابة مالية صارمة'], recommendations: ['تحديث تقديرات التضخم دورياً'] },
      { id: 'c-2', title: 'دقة حسابات الجدوى والتحليل المالي', weightPercent: 25, score: 97, benchmark: 92, notes: 'معدل عائد داخلي IRR للمحطة يتجاوز 22.4%', strengths: ['دراسات جدوى متكاملة'], recommendations: ['مشاركة نماذج الحسابات مع الإدارات'] },
      { id: 'c-3', title: 'كفاءة الإنفاق وإدارة السيولة النقدية', weightPercent: 20, score: 94, benchmark: 90, notes: 'سداد دفعات التوريدات في مواعيد الخصومات النقدية', strengths: ['وفر مالي ممتاز'], recommendations: ['تنويع سبل الدفع الإلكتروني بالمحطات'] },
      { id: 'c-4', title: 'إنجاز التسويات والمهام المالية الدورية', weightPercent: 15, score: 95, benchmark: 90, notes: 'تسويات الهيئة العامة للبترول منتهية حتى تاريخه', strengths: ['عدم وجود متأخرات مالية'], recommendations: ['تفعيل التقارير الآلية اللحظية'] },
      { id: 'c-5', title: 'الاستجابة لتوصيات التدقيق والمراجعة', weightPercent: 15, score: 93, benchmark: 90, notes: 'ملاحظات الجهاز المركزي للمحاسبات صفرية', strengths: ['شفافية وامتثال مالي تام'], recommendations: ['الاستمرار بنفس النهج المؤسسي'] }
    ]
  },
  marketing: {
    id: 'eval-marketing-2026-q3',
    department: 'marketing',
    departmentName: 'إدارة التسويق والدراسات الميدانية',
    gmName: 'أ. عادل نور الدين',
    evaluationPeriod: 'الربع الثالث 2026',
    evaluatedAt: '2026-09-18',
    evaluatorName: 'لجنة الإدارة العليا والتحكم',
    evaluatorRole: 'Super Admin Central Committee',
    overallScore: 96,
    grade: 'A+',
    gradeLabel: 'ممتاز مرتفع (Exceeds Expectations)',
    approvedBySuperAdmin: true,
    executiveSummary: 'استخدام متطور لتقنيات حصر الكثافة المرورية الذكي بالكاميرا، وتقدير واقعي لأعداد سيارات الأجرة والملاكي المحولة، وحملات تقسيط جاذبة للجمهور.',
    keyStrengths: ['حصر ميداني ذكي دقيق للمركبات المؤهلة للتحويل.', 'تفعيل خدمة إرسال روابط المعاينة لمهندسي المسح الميداني عبر الواتساب.', 'باقات تقسيط تحويل السيارات بدون فوائد زادت الإقبال بنسبة 28%.'],
    areasOfImprovement: ['توسيع الحملات الترويجية لمركبات الفان والنقل الخفيف بالأقاليم.'],
    criteria: [
      { id: 'c-1', title: 'الالتزام بجدول المسح المروري والدراسات الميدانية', weightPercent: 25, score: 97, benchmark: 90, notes: 'إتمام حصر 12 موقعاً ومحطة مقترحة في الموعد', strengths: ['تقنيات مسح مروري متقدمة'], recommendations: ['التوسع في قياس أوقات الذروة'] },
      { id: 'c-2', title: 'دقة تقديرات مبيعات الغاز وحجم الأسطول', weightPercent: 25, score: 96, benchmark: 90, notes: 'انحراف التقديرات التسويقية أقل من 3% عن الواقع', strengths: ['نماذج قياس واقعية'], recommendations: ['استمرار تحديث بيانات محافظات القناة'] },
      { id: 'c-3', title: 'كفاءة إدارة ميزانيات الحملات الترويجية', weightPercent: 20, score: 94, benchmark: 88, notes: 'تكلفة استقطاب سيارة محولة جديدة انخفضت 18%', strengths: ['تسويق رقمي وميداني فعال'], recommendations: ['زيادة الشراكات مع مواقف السرفيس'] },
      { id: 'c-4', title: 'سرعة إنجاز المهام الدورية وحصر المواقع', weightPercent: 15, score: 96, benchmark: 90, notes: 'إرسال واستلام تقارير المساحين خلال ساعات', strengths: ['ربط متكامل بالواتساب'], recommendations: ['تثبيت حوافز للمساحين الميدانيين'] },
      { id: 'c-5', title: 'الاستجابة لطلبات المعاينة وتغذية المنظومة', weightPercent: 15, score: 98, benchmark: 92, notes: 'تغذية دراسات الجدوى بكافة بيانات المرور بدقة', strengths: ['تكامل تام مع الإدارة المالية'], recommendations: ['الاستمرار في قيادة التحول الرقمي'] }
    ]
  },
  admin: {
    id: 'eval-admin-2026-q3',
    department: 'admin',
    departmentName: 'إدارة النظام والتحكم الشامل',
    gmName: 'مدير عام إدارة النظام والتحكم المركزي',
    evaluationPeriod: 'الربع الثالث 2026',
    evaluatedAt: '2026-09-19',
    evaluatorName: 'مجلس إدارة شركة كارجاس',
    evaluatorRole: 'Board of Directors Cargas',
    overallScore: 98,
    grade: 'A+',
    gradeLabel: 'ممتاز قيادي (Exemplary)',
    approvedBySuperAdmin: true,
    executiveSummary: 'إدارة مركزية محكمة لكافة الإدارات، حوكمة كلمات السر والوصول، توفير لوحة مؤشرات PMO لحظية، وتكامل رقمي شامل لجميع محطات كارجاس.',
    keyStrengths: ['عزل كامل لصلاحيات الإدارات وتأمين المنظومة.', 'إطلاق لوحة مؤشرات إنجاز المشروعات PMO المتقدمة.', 'دعم فني وتنسيق مستمر لجميع المديرين والمهندسين.'],
    areasOfImprovement: ['الاستمرار في أتمتة التقارير الدورية بالواتساب.'],
    criteria: [
      { id: 'c-1', title: 'حوكمة الصلاحيات وإدارة الوصول', weightPercent: 25, score: 99, benchmark: 95, notes: 'عزل تام لبيئات عمل الإدارات بكلمات سر آمنة', strengths: ['أعلى معايير الأمان السيبراني'], recommendations: ['تدوير كلمات السر ربع سنوياً'] },
      { id: 'c-2', title: 'كفاءة الرقابة المركزية ولوحة PMO', weightPercent: 25, score: 98, benchmark: 95, notes: 'متابعة لحظية للجداول الزمنية والانحرافات', strengths: ['رسوم بيانية تفاعلية دقيقة'], recommendations: ['تحديث البيانات لحظياً من المواقع'] },
      { id: 'c-3', title: 'إدارة موارد المنظومة والتكاليف', weightPercent: 20, score: 96, benchmark: 92, notes: 'تشغيل النظام بأعلى كفاءة وأقل استهلاك للموارد', strengths: ['بنية برمجية خفيفة وسريعة'], recommendations: ['توسيع السيرفرات عند إضافة محطات جديدة'] },
      { id: 'c-4', title: 'إنجاز التكليفات والمهام المركزية', weightPercent: 15, score: 98, benchmark: 92, notes: 'توفير الدعم الميداني لكافة الإدارات في الموعد', strengths: ['استجابة استباقية'], recommendations: ['الاستمرار بالجاهزية العالية'] },
      { id: 'c-5', title: 'التكامل والتطوير المستمر للنظام', weightPercent: 15, score: 99, benchmark: 95, notes: 'تطبيق كافة مقترحات التطوير اللغوي والميداني', strengths: ['تجاوب فوري مع متطلبات العمل'], recommendations: ['إصدار تقارير أداء شهرية مجمعة'] }
    ]
  },
  surveyor: {
    id: 'eval-surveyor-2026-q3',
    department: 'surveyor',
    departmentName: 'المعاينة الميدانية ومسح الموقع',
    gmName: 'فريق المعاينة الميدانية',
    evaluationPeriod: 'الربع الثالث 2026',
    evaluatedAt: '2026-09-15',
    evaluatorName: 'إدارة التسويق والدراسات الميدانية',
    evaluatorRole: 'Marketing Department Evaluation',
    overallScore: 92,
    grade: 'A',
    gradeLabel: 'ممتاز (Exceeds Standards)',
    approvedBySuperAdmin: true,
    executiveSummary: 'أداء ميداني عالي الكفاءة في توثيق وحصر سيارات الموقع، وتحديد الإحداثيات الجغرافية بدقة GPS.',
    keyStrengths: ['سرعة الوصول للمواقع وتصوير المركبات بالكاميرا.', 'دقة الإحداثيات والبيانات المدخلة.'],
    areasOfImprovement: ['تحسين جودة التصوير أثناء فترات الليل أو الإضاءة المنخفضة.'],
    criteria: [
      { id: 'c-1', title: 'الالتزام بمواعيد المعاينات الميدانية', weightPercent: 25, score: 93, benchmark: 90, notes: 'إتمام المعاينات في نفس يوم التكليف', strengths: ['انضباط زمني'], recommendations: ['التنسيق المسبق مع مسؤولي المواقع'] },
      { id: 'c-2', title: 'دقة حصر وتصنيف أنواع السيارات', weightPercent: 25, score: 94, benchmark: 90, notes: 'دقة عالية في تصنيف التاكسي والميكروباص والملاكي', strengths: ['فحص دقيق للمركبات'], recommendations: ['استخدام أدوات تثبيت الهاتف أثناء التصوير'] },
      { id: 'c-3', title: 'كفاءة استخدام أدوات النظام والكاميرا', weightPercent: 20, score: 90, benchmark: 88, notes: 'توثيق البيانات لحظياً دون فقدان للصور', strengths: ['إتقان العمل على الهاتف'], recommendations: ['التأكد من شحن بطاريات الهاتف مسبقاً'] },
      { id: 'c-4', title: 'إنجاز التكليفات والمهام الدورية', weightPercent: 15, score: 91, benchmark: 88, notes: 'إتمام 20 تكليف مسح ميداني بنجاح', strengths: ['سرعة في الإرسال بالواتساب'], recommendations: ['متابعة تسليم التقارير فور الانتهاء'] },
      { id: 'c-5', title: 'الاستجابة لملاحظات إدارة التسويق', weightPercent: 15, score: 92, benchmark: 88, notes: 'إعادة المعاينة للمناطق المزدحمة عند الطلب', strengths: ['مرونة عالية في العمل الميداني'], recommendations: ['الاستمرار في التعاون المثمر'] }
    ]
  }
};
