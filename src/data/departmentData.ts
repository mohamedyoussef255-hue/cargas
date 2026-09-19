import { 
  DepartmentReview, 
  SafetyZoningRequirement, 
  CustomFeasibilityIndicator, 
  ExecutiveSiteRecommendation,
  CustomCostItem
} from '../types';

export const DEFAULT_SAFETY_ZONING: SafetyZoningRequirement[] = [
  {
    id: 'safe-01',
    item: 'مسافة الأمان بين حزمة الضاغط (Compressor) وسور المحطة والممتلكات المجاورة',
    codeStandard: 'NFPA 52 (Sec 8.4) والكود المصري للغاز الطبيعي',
    minRequiredDistanceMeters: 4.5,
    actualDistanceMeters: 6.8,
    equipmentZoned: 'حزمة الضاغط الهيدروليكي / الكهربائي',
    isCompliant: true,
    notes: 'الموقع يوفر ارتداداً كافياً يزيد عن الحد الأدنى الإلزامي مع إمكانية إنشاء جدار عازل'
  },
  {
    id: 'safe-02',
    item: 'المسافة الفاصلة بين بطاريات التخزين الاسطوانية (Cascades) وطلمبات التموين',
    codeStandard: 'NFPA 52 / ECE R110 محطات التموين بالغاز المضغوط',
    minRequiredDistanceMeters: 6.0,
    actualDistanceMeters: 8.5,
    equipmentZoned: 'الحاويات الاسطوانية 250 بار',
    isCompliant: true,
    notes: 'مسافة آمنة جداً وتسمح بمرور سيارات الصيانة وحافلات الطوارئ'
  },
  {
    id: 'safe-03',
    item: 'مسافة طلمبات التموين (Dispensers) عن مباني الإدارة واستراحة العملاء',
    codeStandard: 'كود الحماية المدنية المصرية لمحطات الوقود',
    minRequiredDistanceMeters: 3.0,
    actualDistanceMeters: 5.2,
    equipmentZoned: 'طلمبات التموين ومظلة التوزيع Canopy',
    isCompliant: true,
    notes: 'تحقق ارتداداً آمناً مع مسار حركة حر لحركة دخول وخروج المركبات'
  },
  {
    id: 'safe-04',
    item: 'حواجز الحماية الخرسانية المضادة للانفجار (Blast Protection Walls)',
    codeStandard: 'NFPA 52 Sec 8.5 & API RP 500',
    minRequiredDistanceMeters: 2.5,
    actualDistanceMeters: 3.0,
    equipmentZoned: 'منطقة الضاغط وخزانات الغاز',
    isCompliant: true,
    notes: 'جدران خرسانة مسلحة بسمك 25 سم وارتفاع 3.2 متر مقاومة للحرائق حتى 4 ساعات'
  },
  {
    id: 'safe-05',
    item: 'نظام صمامات الإغلاق التلقائي للطوارئ (ESD Valves) وكواشف تسريب الميثان',
    codeStandard: 'ISO 16923 / NFPA 52 (ESD Systems)',
    minRequiredDistanceMeters: 1.0,
    actualDistanceMeters: 1.0,
    equipmentZoned: 'خط الإمداد، الضاغط، وحاويات التخزين',
    isCompliant: true,
    notes: 'نظام إغلاق فوري يعمل هوائياً وكهربائياً مع حساسات ميثان تعمل بالأشعة تحت الحمراء'
  }
];

export const DEFAULT_CUSTOM_INDICATORS: CustomFeasibilityIndicator[] = [
  {
    id: 'ind-01',
    name: 'صافي القيمة الحالية المعدلة (Risk-Adjusted NPV)',
    category: 'financial',
    value: 12450000,
    unit: 'ج.م',
    targetBenchmark: '> 8,000,000 ج.م',
    description: 'صافي التدفقات المخصومة بمعدل 14% على مدار 10 سنوات تشغيلية',
    status: 'compliant'
  },
  {
    id: 'ind-02',
    name: 'معدل العائد الداخلي المرجح (IRR)',
    category: 'financial',
    value: 34.6,
    unit: '%',
    targetBenchmark: '> 22%',
    description: 'العائد السنوي المتوقع على رأس المال المستثمر في إنشاء المحطة ومركز التحويل',
    status: 'compliant'
  },
  {
    id: 'ind-03',
    name: 'فترة استرداد رأس المال المخصومة (Discounted Payback)',
    category: 'financial',
    value: 2.7,
    unit: 'سنة',
    targetBenchmark: '< 4 سنوات',
    description: 'المدة الزمنية لاسترداد إجمالي النفقات الرأسمالية (CAPEX) بالكامل',
    status: 'compliant'
  },
  {
    id: 'ind-04',
    name: 'نقطة التعادل لحجم التموين اليومي (Breakeven Sales)',
    category: 'operational',
    value: 2850,
    unit: 'م³/يوم',
    targetBenchmark: '< 4,000 م³/يوم',
    description: 'الكمية الدنيا المطلوبة يومياً لتغطية كامل النفقات التشغيلية والتمويلية',
    status: 'compliant'
  },
  {
    id: 'ind-05',
    name: 'معدل استهلاك الطاقة النوعي للضغط (Specific Energy Consumption)',
    category: 'technical',
    value: 0.275,
    unit: 'كيلووات.ساعة / م³',
    targetBenchmark: '< 0.32 ك.و.س/م³',
    description: 'كفاءة محركات الضواغط الكهربائية في ضغط الغاز من 8 بار إلى 250 بار',
    status: 'compliant'
  },
  {
    id: 'ind-06',
    name: 'معامل الأمان الصناعي والتوافق المكاني (HSE Index)',
    category: 'safety',
    value: 96.5,
    unit: '%',
    targetBenchmark: '> 90%',
    description: 'مؤشر الامتثال لمسافات الأمان وموافقات الحماية المدنية والبيئة',
    status: 'compliant'
  }
];

export const DEFAULT_CUSTOM_COST_ITEMS: CustomCostItem[] = [
  {
    id: 'cost-01',
    name: 'أعمال إحلال التربة وسند الجوانب وقواعد العزل الاهتزازي للضاغط',
    department: 'projects',
    departmentName: 'إدارة المشروعات والإنشاءات',
    costEgp: 450000,
    category: 'capex',
    notes: 'تربة طينية تتطلب دكاً وإحلالاً بطبقة سن متدرج 60 سم'
  },
  {
    id: 'cost-02',
    name: 'كابلات توصيل الجهد المتوسط ومحول كهربائي خاص قدرة 630 ك.ف.أ',
    department: 'projects',
    departmentName: 'إدارة المشروعات والإنشاءات',
    costEgp: 1150000,
    category: 'capex',
    notes: 'خط ربط من أقرب محطة محولات بمسافة 280 متراً'
  },
  {
    id: 'cost-03',
    name: 'محطة تخفيض الضغط والقياس والفلترة (PRMS) وربط الشبكة القومية',
    department: 'operations',
    departmentName: 'إدارة التشغيل والصيانة',
    costEgp: 1800000,
    category: 'capex',
    notes: 'تخفيض الضغط من 16 بار إلى 8 بار مع عدادات كوريوليس دقيقة'
  },
  {
    id: 'cost-04',
    name: 'منظومة إطفاء رغوي تلقائي وشبكة إنذار مبكر للغاز بالأشعة تحت الحمراء',
    department: 'hse',
    departmentName: 'إدارة السلامة والصحة المهنية HSE',
    costEgp: 380000,
    category: 'capex',
    notes: 'اشتراط إلزامي من الإدارة العامة للحماية المدنية'
  }
];

export const getDefaultDepartmentReviews = (sessionCode = 'CNG-SITE'): Record<string, DepartmentReview> => ({
  projects: {
    department: 'projects',
    departmentName: 'إدارة المشروعات والإنشاءات الهندسية',
    reviewerName: 'م. إبراهيم فؤاد - مدير عام المشروعات',
    reviewDate: new Date().toISOString().split('T')[0],
    decision: 'approved',
    justification: 'الموقع مستوفٍ للمساحات المطلوبة (1,200 م²). تم إعداد الرسومات الهندسية للأعمال المدنية وقواعد الضاغط المانعة للاهتزاز ومظلة التموين.',
    customFields: [
      {
        id: 'field-proj-01',
        department: 'projects',
        label: 'عمق الحفر وأعمال التدعيم وقواعد الخرسانة المسلحة',
        fieldType: 'number',
        value: 3.8,
        unit: 'متر',
        impactsCapex: true,
        capexAmount: 580000,
        notes: 'قواعد خرسانية ثقيلة تتحمل اهتزازات الضاغط'
      },
      {
        id: 'field-proj-02',
        department: 'projects',
        label: 'مساحة مظلة التموين Canopy وأعمال التغطية المعدنية',
        fieldType: 'number',
        value: 380,
        unit: 'م²',
        impactsCapex: true,
        capexAmount: 920000,
        notes: 'مظلة تسع 8 طلمبات تموين مع إنارة انفجارية LED'
      },
      {
        id: 'field-proj-03',
        department: 'projects',
        label: 'طول مسار كابلات الكهرباء للمحول الرئيسي',
        fieldType: 'number',
        value: 260,
        unit: 'متر',
        impactsCapex: true,
        capexAmount: 640000,
        notes: 'كابلات مسلحة نحاس 3x185 مم²'
      },
      {
        id: 'field-proj-04',
        department: 'projects',
        label: 'حالة الصرف والبيارات وتصريف مياه الأمطار',
        fieldType: 'select',
        value: 'مطابق للمواصفات مع ربط على شبكة الصرف العمومية',
        options: [
          'مطابق للمواصفات مع ربط على شبكة الصرف العمومية',
          'يتطلب خزان تجميع وبيارة خاصة',
          'يحتاج أعمال تسوية وتعلية منسوب'
        ],
        impactsCapex: false
      }
    ],
    costEstimates: {
      civilCostEgp: 3800000,
      electricalCostEgp: 1350000,
      excavationCostEgp: 480000,
      concreteCostEgp: 1850000,
      pipelineCostEgp: 2200000,
      compressorCostEgp: 6500000,
      dispenserCostEgp: 1800000,
      safetyEquipmentCostEgp: 900000
    }
  },

  hse: {
    department: 'hse',
    departmentName: 'إدارة السلامة والصحة المهنية وحماية البيئة (HSE)',
    reviewerName: 'د. أشرف النجار - استشاري السلامة الصناعية',
    reviewDate: new Date().toISOString().split('T')[0],
    decision: 'approved',
    justification: 'تمت معاينة الموقع ميدانياً وفقاً لكود NFPA 52 والاشتراطات البيئية. مسافات الأمان حول الضواغط والحاويات والحدود الخارجية ممتازة.',
    customFields: [
      {
        id: 'field-hse-01',
        department: 'hse',
        label: 'مسافة الارتداد الآمن بين الضاغط وأقرب مبنى سكني مجاور',
        fieldType: 'number',
        value: 14.5,
        unit: 'متر',
        impactsCapex: false,
        notes: 'الحد الأدنى المطلوب 10 أمتار (مستوفى بفائض 4.5 م)'
      },
      {
        id: 'field-hse-02',
        department: 'hse',
        label: 'موافقة الإدارة العامة للحماية المدنية والدفاع المدني',
        fieldType: 'select',
        value: 'تم الحصول على الموافقة المبدئية مع استيفاء مخطط الإطفاء',
        options: [
          'تم الحصول على الموافقة المبدئية مع استيفاء مخطط الإطفاء',
          'قيد المراجعة الفنية بلجنة الحماية المدنية',
          'مرفوض لوجود عوائق أمن صناعي'
        ],
        impactsCapex: false
      },
      {
        id: 'field-hse-03',
        department: 'hse',
        label: 'تكلفة نظام الإنذار والإطفاء ومكافحة الحريق الآلي',
        fieldType: 'number',
        value: 420000,
        unit: 'ج.م',
        impactsCapex: true,
        capexAmount: 420000,
        notes: 'شبكة مياه إطفاء وخزانات رغوية وكواشف UV/IR'
      }
    ],
    hseEvaluation: {
      nfpa52Compliant: true,
      civilDefenseApproved: true,
      environmentalImpactApproved: true,
      blastWallRequired: true,
      emergencyShutdownZonesOk: true,
      gasDetectorsInstalled: true,
      minSafeDistanceMeters: 5.0,
      actualDistanceMeters: 7.8
    }
  },

  operations: {
    department: 'operations',
    departmentName: 'إدارة التشغيل والصيانة الهندسية',
    reviewerName: 'م. طارق عبد الوهاب - مدير عام العمليات والغاز',
    reviewDate: new Date().toISOString().split('T')[0],
    decision: 'approved',
    justification: 'الموقع قريب من خط الغاز المغذي بضغط 12 بار مما يتيح تشغيل ضاغط بقدرة 1500 م³/ساعة بكفاءة وسرعة تموين لا تتجاوز 3 دقائق للسيارة.',
    customFields: [
      {
        id: 'field-ops-01',
        department: 'operations',
        label: 'ضغط الغاز الطبيعي بخط التغذية المغذي للموقع (Inlet Gas Pressure)',
        fieldType: 'number',
        value: 12.4,
        unit: 'بار (Bar)',
        impactsCapex: false,
        notes: 'ضغط ممتاز يقلل من الطاقة الكهربائية المطلوبة للضغط بنسبة 18%'
      },
      {
        id: 'field-ops-02',
        department: 'operations',
        label: 'طول مسار مد خط الغاز المغذي للبنية التحتية حتى المحطة',
        fieldType: 'number',
        value: 310,
        unit: 'متر طولي',
        impactsCapex: true,
        capexAmount: 2150000,
        notes: 'قطر 6 بوصة صلب غير ملحوم مع محبس عزل سطحي'
      },
      {
        id: 'field-ops-03',
        department: 'operations',
        label: 'نوع وسعة طلمبات التموين (Dispenser Technology)',
        fieldType: 'select',
        value: 'طلمبات إلكترونية مزدوجة الخرطوم Coriolis Mass Flow 80kg/min',
        options: [
          'طلمبات إلكترونية مزدوجة الخرطوم Coriolis Mass Flow 80kg/min',
          'طلمبات 4 خراطيم فائقة السرعة للميكروباص والحافلات',
          'طلمبات تقليدية ميكانيكية'
        ],
        impactsCapex: false
      }
    ],
    operationalSpecs: {
      compressorCapacityM3h: 1500,
      inletGasPressureBar: 12.4,
      storageCascadesWaterCapacityL: 5000,
      dispenserHosesCount: 8,
      pipelineLengthMeters: 310,
      requiredPowerKva: 500
    }
  },

  legal: {
    department: 'legal',
    departmentName: 'الإدارة العامة للشئون القانونية والعقود',
    reviewerName: 'المستشار حازم الشريف - مدير الشئون القانونية',
    reviewDate: new Date().toISOString().split('T')[0],
    decision: 'approved',
    justification: 'تمت مراجعة سند الملكية وسجل الإشهار والمسح المساحي للأرض، الموقع خالٍ تماماً من أي منازعات أو حقوق عينية للغير، وبنود العقد تكفل استقرار الاستثمار لمدة 25 سنة.',
    customFields: [
      {
        id: 'field-legal-01',
        department: 'legal',
        label: 'طبيعة السند القانوني للأرض وحيازة الموقع',
        fieldType: 'select',
        value: 'عقد إيجار طويل الأجل لمدة 25 عاماً قابل للتجديد التلقائي',
        options: [
          'عقد إيجار طويل الأجل لمدة 25 عاماً قابل للتجديد التلقائي',
          'ملكية خالصة مسجلة وموثقة بالشهر العقاري',
          'حق انتفاع صادر من المحافظة أو هيئة المجتمعات العمرانية'
        ],
        impactsCapex: false
      },
      {
        id: 'field-legal-02',
        department: 'legal',
        label: 'القيمة الإيجارية السنوية للأرض وتدرج الأسعار',
        fieldType: 'number',
        value: 480000,
        unit: 'ج.م سنوياً',
        impactsOpex: true,
        opexAmount: 480000,
        notes: 'زيادة سنوية بنسبة 5% بعد انقضاء أول 5 سنوات'
      },
      {
        id: 'field-legal-03',
        department: 'legal',
        label: 'موقف رخصة البناء والتراخيص النوعية من الإدارة المحلية',
        fieldType: 'select',
        value: 'صالح للترخيص ولا توجد موانع تنظيمية أو قيود ارتفاع',
        options: [
          'صالح للترخيص ولا توجد موانع تنظيمية أو قيود ارتفاع',
          'يتطلب استثناء تنظيمياً من المحافظة',
          'غير مطابق للاستخدام التجاري'
        ],
        impactsCapex: false
      }
    ],
    legalReview: {
      landTenureType: 'long_term_lease',
      contractDurationYears: 25,
      annualLeaseCostEgp: 480000,
      buildingPermitFeasible: true,
      zoningClearance: true,
      titleDeedVerified: true,
      disputeRiskLevel: 'low'
    }
  },

  financial: {
    department: 'financial',
    departmentName: 'الإدارة العامة للمراجعة المالية ودراسات الجدوى',
    reviewerName: 'أ. د. سامي عبد المحسن - رئيس قطاع الشئون المالية والاستثمار',
    reviewDate: new Date().toISOString().split('T')[0],
    decision: 'approved',
    justification: 'دراسة الجدوى المالية ممتازة ومعدلات العائد تفوق معدل تكلفة الفرصة البديلة للاستثمار. فترة الاسترداد 2.7 سنة مع عائد داخلي 34.6%. نوصي باعتماد التمويل الاستثماري فوراً.',
    customFields: [
      {
        id: 'field-fin-01',
        department: 'financial',
        label: 'حالة التدقيق والمطابقة للتكاليف الرأسمالية والتشغيلية',
        fieldType: 'select',
        value: 'تمت المراجعة والتدقيق والاعتماد المالي بالكامل دون أخطاء جوهرية',
        options: [
          'تمت المراجعة والتدقيق والاعتماد المالي بالكامل دون أخطاء جوهرية',
          'تم تعديل بعض البنود وتصحيح التكاليف عبر لوحة التحكم',
          'توجد أخطاء جوهرية تتطلب تعزيز الدراسة وإعادتها'
        ],
        impactsCapex: false
      },
      {
        id: 'field-fin-02',
        department: 'financial',
        label: 'معدل الأمان النقدي ونسبة تغطية خدمة الديون (DSCR)',
        fieldType: 'number',
        value: 2.65,
        unit: 'مضاعف (Ratio)',
        impactsCapex: false,
        notes: 'معدل آمن جداً يفوق المعيار البنكي (1.30)'
      },
      {
        id: 'field-fin-03',
        department: 'financial',
        label: 'توصية اعتماد التمويل الرأسمالي',
        fieldType: 'select',
        value: 'موافقة نهائية معتمدة للبدء في طرح مناقصات التنفيذ',
        options: [
          'موافقة نهائية معتمدة للبدء في طرح مناقصات التنفيذ',
          'موافقة مشروطة بتخفيض تكاليف الأعمال المدنية',
          'رفض التمويل لعدم الجدوى'
        ],
        impactsCapex: false
      }
    ],
    financialAudit: {
      totalCapexAudited: 20600000,
      annualOpexAudited: 2890000,
      npvAudited: 12450000,
      irrAuditedPercent: 34.6,
      paybackYearsAudited: 2.7,
      roiAuditedPercent: 37.2,
      auditStatus: 'approved',
      auditorNotes: 'الأرقام متسقة مع متوسط كثافة المركبات المرصودة (أكثر من 450 مركبة تجارية في الجلسة).',
      identifiedErrors: [],
      correctionLog: []
    }
  }
});

export const computeOverallRecommendation = (
  reviews: Record<string, DepartmentReview>,
  financialMetrics: {
    npv: number;
    irr: number;
    paybackYears: number;
    roi: number;
  },
  safetyRequirements: SafetyZoningRequirement[]
): ExecutiveSiteRecommendation => {
  // Score weights:
  // Financial: 35%
  // Technical / Operations: 25%
  // Safety HSE: 25%
  // Legal: 15%

  // 1. Financial Score (0 - 100)
  let financialScore = 70;
  if (financialMetrics.irr >= 30) financialScore += 15;
  else if (financialMetrics.irr >= 20) financialScore += 8;
  else if (financialMetrics.irr < 12) financialScore -= 20;

  if (financialMetrics.paybackYears <= 3) financialScore += 15;
  else if (financialMetrics.paybackYears <= 4.5) financialScore += 8;
  else financialScore -= 10;

  if (reviews.financial?.decision === 'rejected') financialScore = 15;
  else if (reviews.financial?.decision === 'conditional') financialScore = Math.min(financialScore, 75);

  financialScore = Math.min(100, Math.max(0, financialScore));

  // 2. Technical & Operations Score (0 - 100)
  let technicalScore = 80;
  if (reviews.projects?.decision === 'approved' && reviews.operations?.decision === 'approved') {
    technicalScore = 95;
  } else if (reviews.projects?.decision === 'rejected' || reviews.operations?.decision === 'rejected') {
    technicalScore = 30;
  } else {
    technicalScore = 70;
  }

  // 3. Safety HSE Score (0 - 100)
  let safetyScore = 85;
  const nonCompliantZoning = safetyRequirements.filter(s => !s.isCompliant).length;
  if (nonCompliantZoning === 0) safetyScore = 98;
  else safetyScore = Math.max(20, 98 - (nonCompliantZoning * 25));

  if (reviews.hse?.decision === 'rejected') safetyScore = 20;
  else if (reviews.hse?.decision === 'conditional') safetyScore = Math.min(safetyScore, 75);

  // 4. Legal Score (0 - 100)
  let legalScore = 85;
  if (reviews.legal?.decision === 'approved') legalScore = 96;
  else if (reviews.legal?.decision === 'rejected') legalScore = 15;
  else legalScore = 65;

  // Composite Weighted Score
  const verdictScorePercent = Number((
    (financialScore * 0.35) +
    (technicalScore * 0.25) +
    (safetyScore * 0.25) +
    (legalScore * 0.15)
  ).toFixed(1));

  let overallVerdict: 'recommended_immediately' | 'conditional_approval' | 'rejected' = 'conditional_approval';
  if (verdictScorePercent >= 82 && reviews.hse?.decision !== 'rejected' && reviews.financial?.decision !== 'rejected') {
    overallVerdict = 'recommended_immediately';
  } else if (verdictScorePercent < 55 || reviews.hse?.decision === 'rejected' || reviews.financial?.decision === 'rejected') {
    overallVerdict = 'rejected';
  }

  const prerequisites: string[] = [];
  if (safetyScore < 90) prerequisites.push('استيفاء تصريح الدفاع المدني النهائي وتركيب كواشف الميثان الذاتية');
  if (reviews.projects?.decision === 'conditional') prerequisites.push('تأكيد عمق قواعد الخرسانة وسند جوانب التربة قبل صب قواعد الضاغط');
  if (reviews.legal?.decision === 'conditional') prerequisites.push('إنهاء توثيق عقد الإيجار / الانتفاع بالشهر العقاري');
  if (reviews.operations?.decision === 'conditional') prerequisites.push('مراجعة ضغط شبكة الغاز في أوقات ذروة فصل الشتاء');

  return {
    overallVerdict,
    verdictScorePercent,
    weights: {
      financial: 35,
      technical: 25,
      safetyHse: 25,
      legal: 15
    },
    financialScore,
    technicalScore,
    safetyScore,
    legalScore,
    executiveSummary: overallVerdict === 'recommended_immediately'
      ? 'الموقع استثماري ذو جدوى ممتازة ومطابق تماماً لكافة المعايير الهندسية واشتراطات الأمن الصناعي NFPA 52 وتوافق الإدارات الخمس.'
      : overallVerdict === 'conditional_approval'
      ? 'الموقع مجدٍ اقتصادياً ومقبول فنياً مع ضرورة استيفاء بعض المتطلبات الفنية واشتراطات السلامة قبل الصرف الرأسمالي.'
      : 'الموقع غير موصى به استثمارياً لوجود تحفظات جوهرية في اشتراطات الأمن الصناعي أو العائد المالي.',
    mandatoryPrerequisites: prerequisites.length > 0 ? prerequisites : ['البدء فوراً في إسناد أعمال الطرح والمقاولات المدنية وكهروميكانيكا الغاز'],
    identifiedRisks: [
      'تغير أسعار مدخلات البنية التحتية والمعدات المستوردة (الضواغط والخزانات)',
      'تذبذب ضغط خط الغاز في ساعات ذروة الاستهلاك الصناعي والمنزلي',
      'تراخي الرقابة على مسافات الأمان ومحيط التموين'
    ],
    committeeDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
  };
};
