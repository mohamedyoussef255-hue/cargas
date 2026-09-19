import { StationExecutionData, ExecutionWorkItem, DailySiteLog } from '../types';

export const createDefaultStationExecutionData = (
  stationTitle: string,
  approvedBudget: number = 38500000
): StationExecutionData => {
  const kickoffDate = '2026-08-01';
  const targetHandoverDate = '2026-12-15';

  const workItems: ExecutionWorkItem[] = [
    // 1. Civil & Construction (الأعمال المدنية والإنشائية) - إدارة المشروعات
    {
      id: 'work-civ-1',
      category: 'civil',
      departmentName: 'إدارة المشروعات',
      title: 'أعمال الحفر والإحلال وسند جوانب الموقع',
      description: 'حفر الموقع بعمق 2.5م، إحلال طبقات سن متدرج ورمل مغسول، واختبارات بروكتور للدمك بنسبة لا تقل عن 95%',
      weightPercent: 8,
      progressPercent: 100,
      status: 'completed',
      startDate: '2026-08-02',
      targetEndDate: '2026-08-18',
      actualEndDate: '2026-08-16',
      assignedEngineer: 'م. تامر مصطفى',
      contractorName: 'شركة النيل للإنشاءات الهندسية',
      estimatedCostEgp: 2400000,
      disbursedCostEgp: 2400000,
      subTasks: [
        { id: 'st-c1-1', title: 'رفع الإحداثيات وتثبيت نقاط الصفر المساحي', completed: true, completionDate: '2026-08-03' },
        { id: 'st-c1-2', title: 'إتمام حفر بئر التربة وعزل الجوانب', completed: true, completionDate: '2026-08-10' },
        { id: 'st-c1-3', title: 'دمك طبقات الإحلال واختبار كثافة الموقع', completed: true, completionDate: '2026-08-16' },
      ],
      notes: 'تم استلام تقرير معامل التربة بالدمك بنجاح 98%'
    },
    {
      id: 'work-civ-2',
      category: 'civil',
      departmentName: 'إدارة المشروعات',
      title: 'القواعد الخرسانية المسلحة للضاغط والمظلة والموزعات',
      description: 'صب قواعد الضاغط المعزولة ضد الاهتزازات مع حشو فواصل التمدد، وقواعد أعمدة المظلة المعدنية وممرات التموين',
      weightPercent: 12,
      progressPercent: 95,
      status: 'in_progress',
      startDate: '2026-08-18',
      targetEndDate: '2026-09-22',
      assignedEngineer: 'م. تامر مصطفى',
      contractorName: 'شركة النيل للإنشاءات الهندسية',
      estimatedCostEgp: 4200000,
      disbursedCostEgp: 3800000,
      subTasks: [
        { id: 'st-c2-1', title: 'حدادة ونجارة القواعد المسلحة للضاغط الكندي', completed: true, completionDate: '2026-08-28' },
        { id: 'st-c2-2', title: 'صب الخرسانة الجاهزة بمقاومة إجهاد 350 كجم/سم²', completed: true, completionDate: '2026-09-04' },
        { id: 'st-c2-3', title: 'معالجة وعزل القواعد بالبيتومين المطاطي', completed: true, completionDate: '2026-09-12' },
        { id: 'st-c2-4', title: 'تركيب خوابير التثبيت Anchor Bolts لجميع الآلات', completed: false },
      ],
      notes: 'جاري فك الشدات ومعاينة مكعبات كسر الخرسانة بعمر 28 يوم'
    },
    {
      id: 'work-civ-3',
      category: 'civil',
      departmentName: 'إدارة المشروعات',
      title: 'تصنيع وتركيب هيكل المظلة المعدنية Canopy والكلادينج',
      description: 'تركيب الجمالون الفولاذي، تجليد الواجهات بألواح الكلادينج المعتمدة لكارجاس بالألوان الرسمية، ووحدات الإضاءة المقاومة للانفجار Ex',
      weightPercent: 10,
      progressPercent: 70,
      status: 'in_progress',
      startDate: '2026-09-01',
      targetEndDate: '2026-10-10',
      assignedEngineer: 'م. أحمد الشربيني',
      contractorName: 'المتحدة للأعمال المعدنية',
      estimatedCostEgp: 3800000,
      disbursedCostEgp: 2600000,
      subTasks: [
        { id: 'st-c3-1', title: 'توريد الهياكل الفولاذية المدهونة ضد الصدأ', completed: true, completionDate: '2026-09-05' },
        { id: 'st-c3-2', title: 'رفع وتثبيت أعمدة وروافد المظلة بالونش الهيدروليكي', completed: true, completionDate: '2026-09-14' },
        { id: 'st-c3-3', title: 'تركيب أسقف الصاج المعزول وشنابر التثبيت', completed: false },
        { id: 'st-c3-4', title: 'تجليد شريط كارجاس المضيء وحروف NGV ثلاثية الأبعاد', completed: false },
      ],
      notes: 'تم إنهاء 80% من الهيكل المعدني ويجري تجهيز ألواح الكلادينج الخارجي'
    },
    {
      id: 'work-civ-4',
      category: 'civil',
      departmentName: 'إدارة المشروعات',
      title: 'المبنى الإداري وغرفة المولد والمحطة الكهربائية',
      description: 'تشييد المبنى الإداري لخدمة العملاء، دورات المياه، غرفة التحكم ولوحات التوزيع وغرفة محول الكهرباء 500 KVA',
      weightPercent: 8,
      progressPercent: 80,
      status: 'in_progress',
      startDate: '2026-08-20',
      targetEndDate: '2026-10-05',
      assignedEngineer: 'م. إبراهيم رضوان',
      contractorName: 'شركة النيل للإنشاءات الهندسية',
      estimatedCostEgp: 3200000,
      disbursedCostEgp: 2500000,
      subTasks: [
        { id: 'st-c4-1', title: 'بناء الحوائط وصب السقف الخرساني للمبنى', completed: true, completionDate: '2026-09-02' },
        { id: 'st-c4-2', title: 'تمديد مواسير الكهرباء الداخلية وشبكات المياه', completed: true, completionDate: '2026-09-10' },
        { id: 'st-c4-3', title: 'أعمال البياض والتشطيبات والسيراميك', completed: false },
        { id: 'st-c4-4', title: 'تركيب الأبواب المقاومة للحريق لغرفة الكهرباء', completed: false },
      ],
      notes: 'المبنى في مرحلة التشطيبات النهائية والدهانات المقاومة للعوامل الجوية'
    },

    // 2. Equipment, Machinery & Networks (المعدات والآلات والشبكات) - إدارة التشغيل
    {
      id: 'work-eq-1',
      category: 'equipment',
      departmentName: 'إدارة التشغيل والتموين',
      title: 'توريد وضبط ضاغط الغاز الطبيعي عالي الضغط (Compressor 1200 m³/h)',
      description: 'وصول ضاغط الغاز الطبيعي كارجاس بمواصفات إيطالية، وتثبيته على القواعد الخرسانية مع مجاري تصريف الزيوت والعوازل الصوتية',
      weightPercent: 16,
      progressPercent: 85,
      status: 'inspection',
      startDate: '2026-08-15',
      targetEndDate: '2026-10-15',
      assignedEngineer: 'م. طارق عبد الخالق',
      contractorName: 'مورد معتمد - كارجاس للمعدات',
      estimatedCostEgp: 9500000,
      disbursedCostEgp: 8500000,
      subTasks: [
        { id: 'st-e1-1', title: 'الإفراج الجمركي وشهادة الفحص والتطابق', completed: true, completionDate: '2026-08-25' },
        { id: 'st-e1-2', title: 'إنزال الضاغط على وسائد التثبيت المانعة للاهتزاز', completed: true, completionDate: '2026-09-08' },
        { id: 'st-e1-3', title: 'توصيل كابلات القدرة الكهربائية والمحرك الرئيسي', completed: true, completionDate: '2026-09-15' },
        { id: 'st-e1-4', title: 'معايرة حساسات الزيت والحرارة والتصريف الآلي', completed: false },
      ],
      notes: 'تمت المعاينة الأولية من مهندسي التشغيل وبانتظار بدء اختبارات التشغيل على البارد'
    },
    {
      id: 'work-eq-2',
      category: 'equipment',
      departmentName: 'إدارة التشغيل والتموين',
      title: 'تركيب بطاريات اسطوانات التخزين Cascades (3-Bank Storage)',
      description: 'تركيب مصفوفة اسطوانات الغاز سعة 3000 لتر مياه ضغط 250 بار بنظام السحب الثلاثي (منخفض - متوسط - مرتفع)',
      weightPercent: 10,
      progressPercent: 75,
      status: 'in_progress',
      startDate: '2026-08-25',
      targetEndDate: '2026-10-20',
      assignedEngineer: 'م. طارق عبد الخالق',
      contractorName: 'كارجاس لخدمات الغاز',
      estimatedCostEgp: 4800000,
      disbursedCostEgp: 3600000,
      subTasks: [
        { id: 'st-e2-1', title: 'تثبيت الإطار الفولاذي لبطاريات الاسطوانات', completed: true, completionDate: '2026-09-06' },
        { id: 'st-e2-2', title: 'ربط الاسطوانات بمواسير ستانلس ستيل SS 316', completed: true, completionDate: '2026-09-12' },
        { id: 'st-e2-3', title: 'تركيب صمامات الأمان Relief Valves ومحابس العزل', completed: false },
        { id: 'st-e2-4', title: 'إجراء اختبار النيتروجين للتأكد من عدم التسريب', completed: false },
      ],
      notes: 'تم الانتهاء من تجميع البطارية وجاري ربط لوحة السحب الأوتوماتيكية Priority Panel'
    },
    {
      id: 'work-eq-3',
      category: 'equipment',
      departmentName: 'إدارة التشغيل والتموين',
      title: 'توريد وتركيب موزعات التموين الذكية CNG Dispensers والمسدسات',
      description: 'تركيب 2 موزع مزدوج (4 مسدسات تموين NGV1 و NGV2)، ومقاييس التدفق الكتلية Mass Flow Meters وشاشات الدفع الإلكتروني',
      weightPercent: 10,
      progressPercent: 60,
      status: 'in_progress',
      startDate: '2026-09-05',
      targetEndDate: '2026-10-30',
      assignedEngineer: 'م. سامح الجوهري',
      contractorName: 'شركة التجهيزات البترولية المتطورة',
      estimatedCostEgp: 3600000,
      disbursedCostEgp: 2000000,
      subTasks: [
        { id: 'st-e3-1', title: 'تثبيت الموزعات على الجزر الخرسانية المرتفعة', completed: true, completionDate: '2026-09-11' },
        { id: 'st-e3-2', title: 'توصيل خطوط التغذية الستانلس ستيل ووصلات الانفصال Breakaway', completed: false },
        { id: 'st-e3-3', title: 'ربط كابلات الإشارة مع كمبيوتر المحطة POS ونظام مبيعات كارجاس', completed: false },
        { id: 'st-e3-4', title: 'معايرة عدادات الغاز واعتمادها من مصلحة الدمغة والموازين', completed: false },
      ],
      notes: 'وصلت الموزعات لموقع المحطة وتم تثبيتها بنجاح على الجزر'
    },
    {
      id: 'work-eq-4',
      category: 'equipment',
      departmentName: 'إدارة التشغيل والتموين',
      title: 'مد واختبار خط الغاز الطبيعي المغذي واختبار الضغط الهيدروستاتيكي',
      description: 'حفر ومد خط غاز صلب 4 بوصة من خط الشبكة القومية الرئيسي بطول 350م، وتركيب محطة تخفيض الضغط والقياس DRS',
      weightPercent: 12,
      progressPercent: 70,
      status: 'in_progress',
      startDate: '2026-08-10',
      targetEndDate: '2026-10-12',
      assignedEngineer: 'م. سامح الجوهري',
      contractorName: 'غاز مصر / تاون جاس',
      estimatedCostEgp: 5100000,
      disbursedCostEgp: 3800000,
      subTasks: [
        { id: 'st-e4-1', title: 'حفر مسار خط الغاز وتجهيز فرشة الرمل الناعم', completed: true, completionDate: '2026-08-22' },
        { id: 'st-e4-2', title: 'لحام المواسير وفحص اللحامات بأشعة إكس رادار', completed: true, completionDate: '2026-09-09' },
        { id: 'st-e4-3', title: 'إجراء الاختبار الهيدروستاتيكي بضغط 1.5 ضعف ضغط التشغيل', completed: false },
        { id: 'st-e4-4', title: 'ربط صمام الدخول الرئيسي Hot Tapping', completed: false },
      ],
      notes: 'تم الانتهاء من 85% من مد الخط وتمرير اللحامات، بانتظار تصريح الربط النهائي'
    },

    // 3. HSE & Industrial Safety (السلامة والأمن الصناعي) - إدارة السلامة
    {
      id: 'work-hse-1',
      category: 'hse',
      departmentName: 'إدارة السلامة والصحة المهنية (HSE)',
      title: 'تشييد حوائط الصد الخرسانية المسلحة Blast Walls حول الضاغط والاسطوانات',
      description: 'بناء حوائط خرسانية مسلحة بارتفاع 3.5 م وسمك 25 سم طبقاً للمعيار القياسي NFPA 52 والكود المصري لعزل منطقة الضغط العالي',
      weightPercent: 6,
      progressPercent: 90,
      status: 'in_progress',
      startDate: '2026-08-25',
      targetEndDate: '2026-09-25',
      assignedEngineer: 'م. عصام فوزي (مدير السلامة)',
      contractorName: 'شركة النيل للإنشاءات الهندسية',
      estimatedCostEgp: 1900000,
      disbursedCostEgp: 1800000,
      subTasks: [
        { id: 'st-h1-1', title: 'مراجعة أبعاد ومسافات الأمان طبقاً لرسم السلامة المعتمد', completed: true, completionDate: '2026-08-26' },
        { id: 'st-h1-2', title: 'صب الحوائط الخرسانية الثلاثية حول مجمع الضاغط', completed: true, completionDate: '2026-09-10' },
        { id: 'st-h1-3', title: 'دهان الحوائط بدهانات عاكسة ومقاومة للحرارة', completed: false },
      ],
      notes: 'تمت مطابقة حوائط الصد مع اشتراطات الدفاع المدني ومتبقي الدهانات التحذيرية'
    },
    {
      id: 'work-hse-2',
      category: 'hse',
      departmentName: 'إدارة السلامة والصحة المهنية (HSE)',
      title: 'تركيب شبكة الإطفاء الآلية ورشاشات الفوم وخزان مياه الحريق',
      description: 'خزان مياه حريق سعة 120 م³ ومضخة ديزل + كهربائية، وشبكة رشاشات مياه ديلوج Deluge System فوق الضاغط وحاويات التخزين',
      weightPercent: 8,
      progressPercent: 65,
      status: 'in_progress',
      startDate: '2026-09-01',
      targetEndDate: '2026-10-25',
      assignedEngineer: 'م. عصام فوزي (مدير السلامة)',
      contractorName: 'سيفتي برو لأنظمة الإطفاء المتكاملة',
      estimatedCostEgp: 3100000,
      disbursedCostEgp: 2000000,
      subTasks: [
        { id: 'st-h2-1', title: 'إنشاء قاعدة وتركيب خزان مياه مكافحة الحريق', completed: true, completionDate: '2026-09-08' },
        { id: 'st-h2-2', title: 'تركيب طلمبات الحريق الرئيسية (ديزل وجوكي وكهرباء)', completed: true, completionDate: '2026-09-14' },
        { id: 'st-h2-3', title: 'مد شبكة مواسير الحريق والرشاشات العلوية', completed: false },
        { id: 'st-h2-4', title: 'اختبار ضغط شبكة الحريق وتوزيع صناديق الخراطيم', completed: false },
      ],
      notes: 'جاري استكمال تركيب الرشاشات الديلوج أعلى حواضن الضاغط'
    },
    {
      id: 'work-hse-3',
      category: 'hse',
      departmentName: 'إدارة السلامة والصحة المهنية (HSE)',
      title: 'منظومة كواشف تسريب الميثان CH4 ونظام الإغلاق الطارئ ESD',
      description: 'تثبيت 8 كواشف غاز ميثان بصرية وكهروكيميائية، و4 أزرار إغلاق طارئ ESD بمحيط المحطة مع صمام إغلاق أوتوماتيكي سريع',
      weightPercent: 6,
      progressPercent: 50,
      status: 'in_progress',
      startDate: '2026-09-10',
      targetEndDate: '2026-11-05',
      assignedEngineer: 'م. شريف سلامة',
      contractorName: 'كارجاس للأمن الصناعي',
      estimatedCostEgp: 1800000,
      disbursedCostEgp: 900000,
      subTasks: [
        { id: 'st-h3-1', title: 'تحديد نقاط توزيع كواشف الغاز طبقاً لاتجاه الرياح وحركة الهواء', completed: true, completionDate: '2026-09-12' },
        { id: 'st-h3-2', title: 'تثبيت لوحة الإنذار المركزية F&G Control Panel', completed: false },
        { id: 'st-h3-3', title: 'تركيب أزرار الطوارئ ESD عند المداخل وغرفة التحكم والمظلة', completed: false },
        { id: 'st-h3-4', title: 'اختبار زمن استجابة صمام الإغلاق السريع (أقل من ثانية واحدة)', completed: false },
      ],
      notes: 'تم استلام لوحات الحساسات ويجري سحب كابلات الأمان المقاومة للحريق'
    },
    {
      id: 'work-hse-4',
      category: 'hse',
      departmentName: 'إدارة السلامة والصحة المهنية (HSE)',
      title: 'المعاينة الميدانية النهائية واعتماد الحماية المدنية',
      description: 'حضور لجنة المعاينة من الإدارة العامة للحماية المدنية بوزارة الداخلية والتفتيش على مسافات الأمان وشهادة الصلاحية',
      weightPercent: 4,
      progressPercent: 10,
      status: 'not_started',
      startDate: '2026-10-25',
      targetEndDate: '2026-11-20',
      assignedEngineer: 'م. عصام فوزي (مدير السلامة)',
      contractorName: 'إدارة السلامة كارجاس',
      estimatedCostEgp: 650000,
      disbursedCostEgp: 200000,
      subTasks: [
        { id: 'st-h4-1', title: 'سداد الرسوم وتقديم الملف الهندسي للحماية المدنية', completed: true, completionDate: '2026-09-01' },
        { id: 'st-h4-2', title: 'تجهيز طفايات الحريق اليدوية المتنقلة وعربات البودرة 50 كجم', completed: false },
        { id: 'st-h4-3', title: 'إجراء تجربة إخلاء ومحاكاة إطفاء حية بحضور مفتشي الحماية', completed: false },
        { id: 'st-h4-4', title: 'استلام الشهادة الرسمية وتصريح التشغيل الأمني', completed: false },
      ],
      notes: 'الملف مقدم بالكامل ومجدول التفتيش فور الانتهاء من شبكة الحريق'
    },

    // 4. Legal & Regulatory (الشؤون القانونية والتراخيص) - الإدارة القانونية
    {
      id: 'work-leg-1',
      category: 'legal',
      departmentName: 'الإدارة القانونية والتعاقدات',
      title: 'إنهاء وتوقيع عقد الشراكة وحق الانتفاع النهائي للأرض',
      description: 'صياغة العقد النهائي مع الشريك التجاري / الجهة المالكة للأرض وتوثيق العقد بالشهر العقاري وحفظ الضمانات المالية',
      weightPercent: 4,
      progressPercent: 100,
      status: 'completed',
      startDate: '2026-07-15',
      targetEndDate: '2026-08-05',
      actualEndDate: '2026-08-03',
      assignedEngineer: 'المستشار حازم الجمال',
      contractorName: 'الإدارة القانونية كارجاس',
      estimatedCostEgp: 850000,
      disbursedCostEgp: 850000,
      subTasks: [
        { id: 'st-l1-1', title: 'مراجعة سند ملكية الأرض والمخطط المساحي', completed: true, completionDate: '2026-07-20' },
        { id: 'st-l1-2', title: 'التفاوض النهائي على نسبة العائد السنوي ومدة التعاقد 20 سنة', completed: true, completionDate: '2026-07-28' },
        { id: 'st-l1-3', title: 'توقيع العقد الرسمي وتوثيقه أمام الشهر العقاري', completed: true, completionDate: '2026-08-03' },
      ],
      notes: 'تم توثيق العقد بمدينة نصر برقم توثيق رسمي وتم إيداعه في أرشيف الشركة'
    },
    {
      id: 'work-leg-2',
      category: 'legal',
      departmentName: 'الإدارة القانونية والتعاقدات',
      title: 'استخراج رخصة البناء النهائية من الحي والجهة المحلية',
      description: 'تقديم الرسومات الإنشائية والمعمارية المعتمدة من نقابة المهندسين لحي شرق / مجلس المدينة واستخراج ترخيص البناء',
      weightPercent: 4,
      progressPercent: 100,
      status: 'completed',
      startDate: '2026-07-25',
      targetEndDate: '2026-08-15',
      actualEndDate: '2026-08-12',
      assignedEngineer: 'أ. مجدي عزمي',
      contractorName: 'الإدارة القانونية كارجاس',
      estimatedCostEgp: 1100000,
      disbursedCostEgp: 1100000,
      subTasks: [
        { id: 'st-l2-1', title: 'اعتماد اللوحات الهندسية بنقابة المهندسين', completed: true, completionDate: '2026-07-29' },
        { id: 'st-l2-2', title: 'معاينة الإدارة الهندسية بالحي للموقع', completed: true, completionDate: '2026-08-05' },
        { id: 'st-l2-3', title: 'سداد رسوم التحسين وإصدار الترخيص برقم 142/2026', completed: true, completionDate: '2026-08-12' },
      ],
      notes: 'رخصة البناء صادرة ومعلقة بمدخل موقع العمل'
    },
    {
      id: 'work-leg-3',
      category: 'legal',
      departmentName: 'الإدارة القانونية والتعاقدات',
      title: 'موافقة جهاز شؤون البيئة النهائية (EEAA)',
      description: 'تقديم دراسة تقييم الأثر البيئي (الفئة ج) واستيفاء كافة الشروط المتعلقة بالضوضاء والانبعاثات وتدوير المخلفات',
      weightPercent: 3,
      progressPercent: 100,
      status: 'completed',
      startDate: '2026-08-01',
      targetEndDate: '2026-08-25',
      actualEndDate: '2026-08-22',
      assignedEngineer: 'د. خالد عبد الرحمن',
      contractorName: 'مكتب استشاري بيئي معتمد',
      estimatedCostEgp: 450000,
      disbursedCostEgp: 450000,
      subTasks: [
        { id: 'st-l3-1', title: 'إعداد سجل الأثر البيئي ودراسة نمذجة الضوضاء للضاغط', completed: true, completionDate: '2026-08-10' },
        { id: 'st-l3-2', title: 'جلسة الاستماع والتشاور المجتمعي واستيفاء الملاحظات', completed: true, completionDate: '2026-08-18' },
        { id: 'st-l3-3', title: 'استلام الموافقة البيئية النهائية برقم قيد 8820', completed: true, completionDate: '2026-08-22' },
      ],
      notes: 'الموافقة البيئية معتمدة وسارية طوال مدة تشغيل المحطة'
    },

    // 5. Financial & Disbursements (الموقف المالي وصرف المستخلصات) - الإدارة المالية
    {
      id: 'work-fin-1',
      category: 'financial',
      departmentName: 'الإدارة المالية ودراسات الجدوى',
      title: 'صرف الدفعة المقدمة ومستخلصات الأعمال الميدانية المعتمدة',
      description: 'مراجعة الدفاتر، وتدقيق فواتير المقاولين والاستشاريين وصرف المستخلصات الدورية طبقاً لنسب الإنجاز على الطبيعة',
      weightPercent: 5,
      progressPercent: 78,
      status: 'in_progress',
      startDate: '2026-08-01',
      targetEndDate: '2026-11-30',
      assignedEngineer: 'أ. هاني سليم (المدير المالي للمشروعات)',
      contractorName: 'الإدارة المالية كارجاس',
      estimatedCostEgp: 38500000,
      disbursedCostEgp: 29850000,
      subTasks: [
        { id: 'st-f1-1', title: 'صرف دفعة مقدمة للمقاول العام للأعمال المدنية (20%)', completed: true, completionDate: '2026-08-04' },
        { id: 'st-f1-2', title: 'اعتماد وصرف المستخلص الجاري رقم (1) للأعمال المدنية', completed: true, completionDate: '2026-08-25' },
        { id: 'st-f1-3', title: 'اعتماد وصرف المستخلص الجاري رقم (2) للأعمال الكهروميكانيكية', completed: true, completionDate: '2026-09-10' },
        { id: 'st-f1-4', title: 'مراجعة بند فروق الأسعار والمطابقة مع الموازنة التقديرية', completed: false },
      ],
      notes: 'تم صرف 29.85 مليون جنيه من إجمالي الميزانية المعتمدة 38.5 مليون (نسبة الصرف 77.5%)، مع وفر إيجابي 3% عن الموازنة'
    }
  ];

  // Calculate weighted progress
  const totalWeight = workItems.reduce((sum, item) => sum + item.weightPercent, 0);
  const weightedProgress = Math.round(
    workItems.reduce((sum, item) => sum + (item.progressPercent * item.weightPercent), 0) / (totalWeight || 100)
  );

  const totalDisbursed = workItems.reduce((sum, item) => {
    // avoid double counting the master financial work item
    if (item.id === 'work-fin-1') return sum;
    return sum + item.disbursedCostEgp;
  }, 0);

  // Daily Site Logs history
  const dailyLogs: DailySiteLog[] = [
    {
      id: 'log-1',
      date: '2026-09-17',
      reportType: 'daily',
      recordedBy: 'م. تامر مصطفى',
      residentEngineer: 'م. تامر مصطفى',
      weatherAndSiteCondition: 'مشمس معتدل، درجة الحرارة 29°م، أرضية الموقع جافة تماماً',
      workforceCount: 38,
      equipmentOnSite: 'ونش هيدروليكي 50 طن، 2 لودر كوماتسو، ماكينة دك تربة، خلاطة خرسانة جاهزة، ماكينات لحام مواسير الغاز',
      completedWorksToday: '1. استكمال رفع جمالون المظلة الرئيسية Canopy وتثبيت الروافد المعدنية.\n2. معاينة مهندس التشغيل لتوصيلات محرك الضاغط الكهروميكانيكية.\n3. صب الأرضيات الخرسانية حول جزيرة الموزعات رقم 1 و 2.',
      plannedWorksTomorrow: 'بدء تركيب ألواح الكلادينج الخارجي للمظلة، واختبار تسريب النيتروجين لحاويات الاسطوانات Cascades.',
      hseIndustrialSafetyStatus: 'سجل أمان تام (صفر حوادث). الالتزام بنسبة 100% بارتداء مهمات الوقاية الشخصية PPE والخوذات، وفحص تصاريح العمل الساخن Hot Work Permit للحام.',
      delaysOrObstacles: 'لا توجد معوقات، توريدات كابلات الكهرباء وصلت في موعدها.',
      siteProgressSnapshotPercent: weightedProgress,
      photosCount: 6
    },
    {
      id: 'log-2',
      date: '2026-09-15',
      reportType: 'daily',
      recordedBy: 'م. طارق عبد الخالق',
      residentEngineer: 'م. تامر مصطفى',
      weatherAndSiteCondition: 'صافٍ، رياح خفيفة شمالية',
      workforceCount: 34,
      equipmentOnSite: 'ونش 50 طن، ماكينات لحام، سيارات نقل خامات',
      completedWorksToday: 'إنزال وتثبيت ضاغط الغاز الطبيعي 1200 م³/ساعة على القواعد الخرسانية المعزولة، وربط كابلات القدرة بمبنى الكهرباء.',
      plannedWorksTomorrow: 'بدء ربط شبكة مواسير الفولاذ المقاوم للصدأ SS 316 بين الضاغط وبطاريات التخزين.',
      hseIndustrialSafetyStatus: 'صفر حوادث. تطبيق إجراءات السلامة الصارمة أثناء مناورة الونش وإنزال وحدة الضاغط الثقيلة بحضور مسؤول السلامة.',
      delaysOrObstacles: 'ازدحام مروري بسيط عند مدخل الموقع أثناء وصول الشاحنة الثقيلة تم تنظيمه بالتنسيق مع إدارة المرور.',
      siteProgressSnapshotPercent: 72,
      photosCount: 8
    },
    {
      id: 'log-3',
      date: '2026-09-10',
      reportType: 'weekly',
      recordedBy: 'م. تامر مصطفى',
      residentEngineer: 'م. تامر مصطفى',
      weatherAndSiteCondition: 'صيفي معتدل',
      workforceCount: 42,
      equipmentOnSite: 'كامل معدات الحفر والصب والرفع',
      completedWorksToday: 'تقرير الموقف الأسبوعي: الانتهاء بنجاح من صب حوائط الصد الخرسانية Blast Walls وعزلها، وإتمام فحص أشعة اللحامات لخط الغاز المغذي بنسبة نجاح 100%.',
      plannedWorksTomorrow: 'استكمال تثبيت الهيكل الفولاذي واستقبال الضاغط.',
      hseIndustrialSafetyStatus: 'صفر حوادث. تدريب أسبوعي Tool-Box Talk للعمال على مخاطر الرفع والتثبيت، وسلامة العمل على ارتفاعات.',
      delaysOrObstacles: 'تم تجاوز تأخر توريد حديد التسليح عبر توفير كمية إضافية من مخازن كارجاس المركزية.',
      siteProgressSnapshotPercent: 68,
      photosCount: 12
    },
    {
      id: 'log-4',
      date: '2026-09-01',
      reportType: 'monthly',
      recordedBy: 'م. أحمد الشربيني',
      residentEngineer: 'م. تامر مصطفى',
      weatherAndSiteCondition: 'صيفي حار',
      workforceCount: 36,
      equipmentOnSite: 'حفارات، لودرات، خلاطات خرسانة',
      completedWorksToday: 'تقرير نهاية الشهر الأول للإنشاءات: إنجاز كامل أعمال الحفر والإحلال وصب 85% من القواعد الخرسانية والمبنى الإداري، والبدء في تصنيع الهيكل المعدني.',
      plannedWorksTomorrow: 'خطة الشهر الثاني: توريد وتركيب الضاغط وحاويات التخزين وخط الغاز الرئيسي.',
      hseIndustrialSafetyStatus: 'سجل أمان ممتاز (0 حوادث و 0 إصابات). التزام تام باللوحات التحذيرية وأطواق الإغلاق المؤقتة.',
      delaysOrObstacles: 'المشروع متقدم بيومين عن الجدول الزمني المعتمد في دراسة الجدوى.',
      siteProgressSnapshotPercent: 55,
      photosCount: 15
    }
  ];

  return {
    executionStatus: 'civil_works',
    kickoffDate,
    targetHandoverDate,
    contractorName: 'تحالف شركة النيل للإنشاءات الهندسية وشركة غاز مصر',
    consultantEngineer: 'المكتب الاستشاري للبترول والطاقة (ECG)',
    residentEngineer: 'م. تامر مصطفى (مدير المشروع المقيم)',
    overallProgressPercent: weightedProgress,
    totalApprovedBudgetEgp: approvedBudget,
    totalDisbursedBudgetEgp: totalDisbursed || 29850000,
    workItems,
    dailyLogs
  };
};
