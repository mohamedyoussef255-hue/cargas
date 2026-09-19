import { 
  PlatformMasterSettings, 
  FuelPricing, 
  FeasibilityDefaults, 
  FeasibilityFieldDefinition,
  CustomFuelItem,
  CargasCenterItem, 
  CylinderSpecItem, 
  ConversionSystemItem, 
  ContactNumberItem 
} from '../types';

export const DEFAULT_FEASIBILITY_FIELDS: FeasibilityFieldDefinition[] = [
  // CapEx Parameters (التكاليف الاستثمارية)
  {
    id: 'f-capex-compressors',
    key: 'capexCompressors',
    category: 'capex',
    label: 'وحدة الضواغط الرئيسية (Compressors)',
    subLabel: 'محطة الضاغط الهيدروليكي / الميكانيكي عالي الضغط',
    unit: 'ج.م',
    defaultValue: 6500000,
    value: 6500000,
    isVisible: true,
    description: 'تكلفة وحدة الضواغط الرئيسية شاملة لوحة التحكم الكهربائية والمبردات',
  },
  {
    id: 'f-capex-cascades',
    key: 'capexCascades',
    category: 'capex',
    label: 'اسطوانات التخزين والمخازن (Cascades)',
    subLabel: 'بطاريات التخزين بسعات الضغط الثلاثي (250 بار)',
    unit: 'ج.م',
    defaultValue: 2400000,
    value: 2400000,
    isVisible: true,
    description: 'خزانات التخزين التراكمي عالية الضغط لتلبية أوقات الذروة',
  },
  {
    id: 'f-capex-dispensers',
    key: 'capexDispensers',
    category: 'capex',
    label: 'موزعات الغاز السريعة (Dispensers)',
    subLabel: 'نقاط التموين السريع بمعدل 50-70 كجم/دقيقة',
    unit: 'ج.م',
    defaultValue: 1800000,
    value: 1800000,
    isVisible: true,
    description: 'موزعات التموين الإلكترونية المزدوجة بمسدسات NGV1 و NGV2',
  },
  {
    id: 'f-capex-pipeline',
    key: 'capexGasPipeline',
    category: 'capex',
    label: 'خط الربط وغرفة المحابس والقياس (Gas Pipeline & RMS)',
    subLabel: 'توصيل الغاز من الشبكة القومية وتخفيض الضغط',
    unit: 'ج.م',
    defaultValue: 2200000,
    value: 2200000,
    isVisible: true,
    description: 'خط التغذية وغرفة تخفيض الضغط والقياس والفلترة RMS',
  },
  {
    id: 'f-capex-civil',
    key: 'capexCivilAndCanopy',
    category: 'capex',
    label: 'الأعمال المدنية والمظلات والمحولات (Civil & Canopy)',
    subLabel: 'الإنشاءات، المظلات المضادة للانفجار، وغرفة المحول',
    unit: 'ج.م',
    defaultValue: 3800000,
    value: 3800000,
    isVisible: true,
    description: 'الصبات الخرسانية المقاومة للاهتزاز، مظلة التموين، والمحول الكهربائي',
  },
  {
    id: 'f-capex-conversion',
    key: 'capexConversionCenter',
    category: 'capex',
    label: 'مركز التحويل والفحص الملحق (Conversion Center)',
    subLabel: 'حارات التحويل ورافعات السيارات وأجهزة المعايرة',
    unit: 'ج.م',
    defaultValue: 1500000,
    value: 1500000,
    isVisible: true,
    description: 'تجهيزات مركز تحويل السيارات وصيانة الاسطوانات الملحق بالمحطة',
  },
  {
    id: 'f-capex-safety',
    key: 'capexPermitsAndSafety',
    category: 'capex',
    label: 'التراخيص ونظم الإطفاء والسلامة (HSE & Permits)',
    subLabel: 'منظومة الإطفاء التلقائي، كواشف الغاز، وتراخيص الحماية المدنية',
    unit: 'ج.م',
    defaultValue: 900000,
    value: 900000,
    isVisible: true,
    description: 'تراخيص الجهات الحكومية، شبكة الإطفاء الغازي، وأجهزة كشف التسريب',
  },

  // OpEx Parameters (مصاريف التشغيل السنوية)
  {
    id: 'f-opex-electricity',
    key: 'opexElectricityAnnual',
    category: 'opex',
    label: 'تكلفة الكهرباء السنوية المقدرة (Electricity)',
    subLabel: 'استهلاك محركات الضواغط والإنارة والتكييف',
    unit: 'ج.م/سنة',
    defaultValue: 950000,
    value: 950000,
    isVisible: true,
    description: 'فاتورة الكهرباء السنوية لغرفة الضواغط ومرافق المحطة',
  },
  {
    id: 'f-opex-maintenance',
    key: 'opexMaintenanceAnnual',
    category: 'opex',
    label: 'الصيانة الدورية وقطع الغيار (Maintenance)',
    subLabel: 'عقود الصيانة الوقائية للضواغط وتغيير الزيوت والفلاتر',
    unit: 'ج.م/سنة',
    defaultValue: 680000,
    value: 680000,
    isVisible: true,
    description: 'قطع الغيار الاستهلاكية والصيانة الدورية للضواغط والموزعات',
  },
  {
    id: 'f-opex-labor',
    key: 'opexLaborAnnual',
    category: 'opex',
    label: 'أجور العمالة والتشغيل السنوية (Labor)',
    subLabel: 'رواتب الفنيين ومسؤولي التموين والأمن والسلامة',
    unit: 'ج.م/سنة',
    defaultValue: 840000,
    value: 840000,
    isVisible: true,
    description: 'أطقم التشغيل على الورديات ومسؤولي السلامة والصحة المهنية',
  },
  {
    id: 'f-opex-insurance',
    key: 'opexInsuranceAndAdmin',
    category: 'opex',
    label: 'التأمين والمصاريف الإدارية (Insurance & Admin)',
    subLabel: 'وثائق التأمين الشامل ومصاريف التشغيل الإدارية',
    unit: 'ج.م/سنة',
    defaultValue: 420000,
    value: 420000,
    isVisible: true,
    description: 'وثائق التأمين على الأصول ضد الحريق ومصاريف الاتصالات والبرمجيات',
  },

  // Margin Parameters (هوامش الربح والعوائد)
  {
    id: 'f-param-cng-margin',
    key: 'cngProfitMarginPerM3',
    category: 'margin',
    label: 'هامش ربح الغاز الطبيعي (CNG Profit Margin)',
    subLabel: 'هامش ربح المحطة لكل متر مكعب غاز مباع',
    unit: 'ج.م/م³',
    defaultValue: 1.50,
    value: 1.50,
    isVisible: true,
    description: 'الهامش المالي المقرر من كارجاس لكل متر مكعب غاز مباع',
  },
  {
    id: 'f-param-capture-rate',
    key: 'captureRatePercent',
    category: 'margin',
    label: 'نسبة الاستقطاب من حركة المرور (Capture Rate)',
    subLabel: 'نسبة المركبات المارة التي ستدخل المحطة للتموين',
    unit: '%',
    defaultValue: 5.5,
    value: 5.5,
    isVisible: true,
    description: 'المعدل التقديري لتحول حركة السيارات المارة إلى مبيعات فعلية بالمحطة',
  },
  {
    id: 'f-param-conversion-margin',
    key: 'conversionNetMarginPerCar',
    category: 'margin',
    label: 'صافي ربح تحويل السيارة الواحدة (Conversion Net Margin)',
    subLabel: 'متوسط ربح تحويل المركبة للعمل بالغاز الطبيعي',
    unit: 'ج.م/سيارة',
    defaultValue: 2200,
    value: 2200,
    isVisible: true,
    description: 'صافي هامش الربح المحقق لمركز التحويل لكل سيارة يتم تحويلها',
  },

  // Operational Parameters (المحددات التشغيلية)
  {
    id: 'f-param-monthly-conversions',
    key: 'monthlyConversionsCount',
    category: 'operational',
    label: 'عدد التحويلات الشهرية المستهدفة (Monthly Conversions)',
    subLabel: 'معدل التحويل المتوقع بالمركز التابع للمحطة',
    unit: 'سيارة/شهر',
    defaultValue: 45,
    value: 45,
    isVisible: true,
    description: 'الهدف الشهري لتحويل السيارات الملاكي والأجرة بمركز الخدمة',
  },
  {
    id: 'f-param-discount-rate',
    key: 'discountRatePercent',
    category: 'operational',
    label: 'معدل الخصم لحساب القيمة الحالية (Discount Rate)',
    subLabel: 'سعر الفائدة المرجعي لحساب صافي القيمة الحالية NPV',
    unit: '%',
    defaultValue: 14.0,
    value: 14.0,
    isVisible: true,
    description: 'المعدل المستخدم لحساب القيمة الحالية الصافية وفترة استرداد رأس المال',
  },
  {
    id: 'f-param-operating-hours',
    key: 'operatingHoursPerDay',
    category: 'operational',
    label: 'ساعات العمل اليومية للمحطة (Operating Hours)',
    subLabel: 'متوسط ساعات تشغيل الموزعات يومياً',
    unit: 'ساعة/يوم',
    defaultValue: 18,
    value: 18,
    isVisible: true,
    description: 'عدد ساعات استقبال المركبات والتموين الفعلي بالغاز يومياً',
  },
];

export const DEFAULT_CUSTOM_FUELS: CustomFuelItem[] = [
  {
    id: 'fuel-cng',
    key: 'cngPrice',
    name: 'الغاز الطبيعي المضغوط (CNG)',
    subName: 'غاز كارجاس المعتمد للسيارات والمركبات',
    price: 7.00,
    unit: 'ج.م / م³',
    color: '#10b981',
    isVisible: true,
  },
  {
    id: 'fuel-gasoline80',
    key: 'gasoline80Price',
    name: 'بنزين 80 أوكتان',
    subName: 'وقود بترولي اقتصادي للمركبات القديمة',
    price: 13.75,
    unit: 'ج.م / لتر',
    color: '#f59e0b',
    isVisible: true,
  },
  {
    id: 'fuel-gasoline92',
    key: 'gasoline92Price',
    name: 'بنزين 92 أوكتان',
    subName: 'وقود بترولي قياسي للملاكي',
    price: 15.25,
    unit: 'ج.م / لتر',
    color: '#3b82f6',
    isVisible: true,
  },
  {
    id: 'fuel-gasoline95',
    key: 'gasoline95Price',
    name: 'بنزين 95 أوكتان',
    subName: 'وقود بترولي فائق الأداء',
    price: 17.00,
    unit: 'ج.م / لتر',
    color: '#8b5cf6',
    isVisible: true,
  },
  {
    id: 'fuel-diesel',
    key: 'dieselPrice',
    name: 'سولار / ديزل',
    subName: 'وقود الشاحنات والميكروباص والنقل الثقيل',
    price: 13.50,
    unit: 'ج.م / لتر',
    color: '#64748b',
    isVisible: true,
  },
];

export const DEFAULT_CONTACT_NUMBERS: ContactNumberItem[] = [
  {
    id: 'contact-hotline-main',
    title: 'الخط الساخن الموحد (كارجاس NGV)',
    number: '19544',
    department: 'خدمة العملاء والشكاوى والاستفسارات',
    type: 'hotline',
    isPrimary: true,
    description: 'الرقم المختصر الرسمي المعتمد لشركة كارجاس لخدمات الغاز وتموين وتحويل السيارات',
    isActive: true,
  },
  {
    id: 'contact-emergency-ops',
    title: 'طوارئ الغاز وعمليات التشغيل والصيانة (24 ساعة)',
    number: '129 / 19544',
    department: 'إدارة العمليات والتشغيل وطوارئ الشبكة',
    type: 'emergency',
    isPrimary: false,
    description: 'غرفة العمليات المركزية لمتابعة ضغوط الغاز والمحطات على مدار الساعة',
    isActive: true,
  },
  {
    id: 'contact-marketing-dev',
    title: 'إدارة التسويق والدراسات الميدانية وتطوير المحطات',
    number: '02-24185200',
    department: 'إدارة التسويق وتطوير الأعمال',
    type: 'landline',
    isPrimary: false,
    description: 'استقبال طلبات ملاك الأراضي والمعاينات الميدانية للمواقع الجديدة',
    isActive: true,
  },
  {
    id: 'contact-whatsapp-field',
    title: 'واتساب خدمة العملاء والمعاينين الميدانيين',
    number: '+201019544000',
    department: 'المتابعة الميدانية وخدمة العملاء',
    type: 'whatsapp',
    isPrimary: false,
    description: 'إرسال واستقبال إحداثيات المواقع وصور المعاينة الميدانية الفورية',
    isActive: true,
  },
  {
    id: 'contact-conversion-maint',
    title: 'الدعم الفني ومراكز التحويل وصيانة الاسطوانات',
    number: '02-25936400',
    department: 'الإدارة الفنية ومراكز التحويل المعتمدة',
    type: 'landline',
    isPrimary: false,
    description: 'المتابعة الدورية، فحص واختبار الاسطوانات بالماء المضغوط، والضمان المعتمد',
    isActive: true,
  },
];

export const DEFAULT_FUEL_PRICING: FuelPricing = {
  cngPrice: 7.00, // EGP per m³
  gasoline80Price: 13.75, // EGP per Liter
  gasoline92Price: 15.25, // EGP per Liter
  gasoline95Price: 17.00, // EGP per Liter
  dieselPrice: 13.50, // EGP per Liter
  lastUpdated: new Date().toISOString(),
};

export const DEFAULT_FEASIBILITY_SETTINGS: FeasibilityDefaults = {
  capexCompressors: 6500000,
  capexCascades: 2400000,
  capexDispensers: 1800000,
  capexGasPipeline: 2200000,
  capexCivilAndCanopy: 3800000,
  capexConversionCenter: 1500000,
  capexPermitsAndSafety: 900000,
  opexElectricityAnnual: 950000,
  opexMaintenanceAnnual: 680000,
  opexLaborAnnual: 840000,
  opexInsuranceAndAdmin: 420000,
  cngProfitMarginPerM3: 1.50,
  captureRatePercent: 5.5,
  conversionNetMarginPerCar: 2200,
  monthlyConversionsCount: 45,
  discountRatePercent: 14.0,
  operatingHoursPerDay: 18,
  customFields: DEFAULT_FEASIBILITY_FIELDS,
};

export const DEFAULT_CARGAS_CENTERS: CargasCenterItem[] = [
  {
    id: 'center-1',
    name: 'مركز كارجاس الرئيسي - ألماظة (القاهرة)',
    governorate: 'القاهرة',
    city: 'مصر الجديدة',
    address: 'شارع صلاح سالم، بجوار نادي الجلاء، مصر الجديدة',
    phone: '19614 / 0224185200',
    services: ['تحويل ملاكي وأجرة', 'فحص واختبار اسطوانات دوري بالماء المضغوط', 'صيانة أجهزة الحقن المتزامن'],
    hours: 'من 8:00 صباحاً حتى 8:00 مساءً (يومياً)',
    isActive: true,
  },
  {
    id: 'center-2',
    name: 'مركز كارجاس - غمرة والظاهر (القاهرة)',
    governorate: 'القاهرة',
    city: 'الظاهر',
    address: 'ميدان الظاهر، أمام محطة مترو غمرة',
    phone: '19614 / 0225936400',
    services: ['تحويل فوري للأجرة والتاكسي', 'تركيب اسطوانات 70 و 90 لتر', 'خدمات الضمان المعتمد'],
    hours: 'من 8:00 صباحاً حتى 9:00 مساءً',
    isActive: true,
  },
  {
    id: 'center-3',
    name: 'مركز كارجاس - المنيب ومجمع المواقف (الجيزة)',
    governorate: 'الجيزة',
    city: 'جنوب الجيزة',
    address: 'طريق مصر أسوان الزراعي، بجوار محطة مترو ومواقف المنيب',
    phone: '19614 / 0237748500',
    services: ['تحويل وصيانة ميكروباص وسوزوكي فان وبيجو ستيشن', 'فحص المرور الإلكتروني', 'مبيعات زيوت مخصصة للغاز'],
    hours: 'خدمة مستمرة 24 ساعة للتموين والصيانة الخفيفة',
    isActive: true,
  },
  {
    id: 'center-4',
    name: 'مركز كارجاس - الموقف الجديد بمحرم بك (الإسكندرية)',
    governorate: 'الإسكندرية',
    city: 'وسط الإسكندرية',
    address: 'طريق الموقف الجديد، محرم بك، الإسكندرية',
    phone: '19614 / 034951200',
    services: ['مركز متكامل للتحويل والفحص لشرق وغرب الإسكندرية', 'كشف أعطال بالكمبيوتر وضبط المحركات'],
    hours: 'من 8:30 صباحاً حتى 7:30 مساءً',
    isActive: true,
  },
  {
    id: 'center-5',
    name: 'مركز كارجاس - طنطا واستاد طنطا (الغربية)',
    governorate: 'الغربية',
    city: 'طنطا',
    address: 'شارع الجيش، مدخل طنطا، أمام استاد طنطا الرياضي',
    phone: '19614 / 0403328100',
    services: ['خدمة أساطيل الدلتا والميكروباص الإقليمي', 'إصدار شهادات فحص المرور المعتمدة'],
    hours: 'من 9:00 صباحاً حتى 6:00 مساءً',
    isActive: true,
  },
  {
    id: 'center-6',
    name: 'مركز كارجاس - مدينة نصر والحي العاشر (القاهرة)',
    governorate: 'القاهرة',
    city: 'مدينة نصر',
    address: 'امتداد مصطفى النحاس، تقاطع الحي العاشر ومحور الوفاء والأمل',
    phone: '19614 / 0224719000',
    services: ['تحويل ملاكي ونقل ذكي (أوبر/كريم)', 'استبدال اسطوانات قديمة', 'تقسيط بدون فوائد'],
    hours: 'من 8:30 صباحاً حتى 8:30 مساءً',
    isActive: true,
  },
];

export const DEFAULT_CYLINDER_SPECS: CylinderSpecItem[] = [
  {
    id: 'cyl-1',
    name: 'اسطوانات النوع الأول (Type 1 - Steel)',
    material: 'صلب غير ملحوم بالكامل (Seamless Chromium-Molybdenum Steel)',
    specs: 'المعيار القياسي ISO 11439 و ECE R110',
    pressure: '200 بار تشغيل / 300 بار اختبار هيدروليكي',
    features: [
      'الأكثر انتشاراً في مصر بنسبة 85% لصلابتها العالية وملاءمتها للمناخ الحار',
      'عمر افتراضي تشغيلي يصل إلى 20 عاماً مع الفحص الدوري الإلزامي كل 3 سنوات',
      'تتحمل الصدمات الميكانيكية الشديدة وحوادث الاصطدام دون تشوه أو تسريب'
    ],
    suitable: 'سيارات الأجرة (التاكسي)، الميكروباص، السوزوكي فان، والملاكي اليومي',
    approxWeightKg: 65,
    capacityLiters: 70,
    equivalentCngM3: 15.5,
  },
  {
    id: 'cyl-2',
    name: 'اسطوانات النوع الثاني (Type 2 - Composite Hoop)',
    material: 'بطانة فولاذية رقيقة مقواة بألياف زجاجية محيطية (Hoop-Wrapped Glass Fiber)',
    specs: 'وزن أخف بنسبة 25-30% مقارنة بالصلب الكامل',
    pressure: '200 بار تشغيل / 300 بار اختبار',
    features: [
      'تخفيف وزن الحقيبة الخلفية بنسبة ملحوظة لمنع هبوط مؤخرة السيارة',
      'كفاءة حرارية وعزل ممتاز بفضل غلاف الألياف المركبة',
      'مثالية للسيارات الصغيرة والمتوسطة للمحافظة على نظام التعليق الخلفي'
    ],
    suitable: 'سيارات الملاكي الحديثة والشاحنات الخفيفة وسيارات النقل الذكي',
    approxWeightKg: 48,
    capacityLiters: 70,
    equivalentCngM3: 15.5,
  },
  {
    id: 'cyl-3',
    name: 'اسطوانات النوع الثالث والرابع (Type 3 / 4 Composite)',
    material: 'بطانة ألومنيوم أو بوليمر كربوني خفيف (Carbon Fiber Fully Wrapped)',
    specs: 'وزن فائق الخفة (أخف بنسبة 60-70% من الصلب التقليدي)',
    pressure: '200 إلى 250 بار تشغيل',
    features: [
      'أعلى مستوى تكنولوجي عالمي وأخف وزناً على الإطلاق',
      'مقاومة تامة للتآكل والصدأ الداخلي والخارجي',
      'معتمدة في الحافلات الكبرى وسيارات الهايبرد والشاحنات الثقيلة'
    ],
    suitable: 'المركبات التجارية الحديثة، الأتوبيسات النقل العام، وأساطيل النقل السريع',
    approxWeightKg: 28,
    capacityLiters: 90,
    equivalentCngM3: 20.0,
  },
];

export const DEFAULT_CONVERSION_SYSTEMS: ConversionSystemItem[] = [
  {
    id: 'sys-1',
    name: 'نظام الحقن المتزامن الإلكتروني (Sequential Multipoint Injection)',
    generation: 'الجيل الرابع (4th Gen Sequential)',
    technology: 'وحدة تحكم إلكترونية (ECU) مبرمجة لقراءة إشارات رشاشات البنزين بدقة أجزاء من الثانية',
    suitableVehicles: 'محركات البنزين الحديثة بنظام الحقن المتعدد (MPI) ومختلف سعات المحرك (1000cc - 2500cc)',
    features: [
      'تحويل أوتوماتيكي ذكي بين البنزين والغاز دون شعور السائق بأي اهتزاز',
      'انعدام فاقد القدرة والعزم بنسبة تصل إلى 97% مقارنة بالبنزين',
      'حساسات أمان متعددة تقطع تدفق الغاز فوراً في حالة توقف المحرك أو الحوادث'
    ],
    avgKitPriceEgp: 14500,
    warrantyYears: 3,
  },
  {
    id: 'sys-2',
    name: 'نظام الحقن المباشر للمحركات التوربينية (Direct Injection GDI / TSI)',
    generation: 'الجيل الخامس والسادس (5th/6th Gen GDI)',
    technology: 'حقن خليط الغاز بنسبة 90% مع حقن 10% بنزين لحماية وتبريد رشاشات البنزين المباشرة داخل غرفة الاحتراق',
    suitableVehicles: 'السيارات الأوروبية واليابانية والكورية الحديثة ذات المحركات التربو (TSI, GDI, EcoBoost, Turbo)',
    features: [
      'حماية محركات التربو الحديثة من فرط حرارة الصمامات والرشاشات',
      'تسارع استثنائي ومحافظة تامة على الأداء الرياضي للمركبة',
      'توفير في الوقود يصل إلى 55% مقارنة ببنزين 95 مرتفع التكلفة'
    ],
    avgKitPriceEgp: 18500,
    warrantyYears: 3,
  },
  {
    id: 'sys-3',
    name: 'نظام الكربراتير والحقن الأحادي (Carburetor & Mono-Jetronic)',
    generation: 'الجيل الثاني والثالث التقليدي',
    technology: 'خلاط ميكانيكي (Mixer) مع مخفض ضغط ومحبس كهربائي ذو تدفق هوائي',
    suitableVehicles: 'سيارات الأجرة القديمة والبيجو الستيشن وسيارات الثمانينات والتسعينات',
    features: [
      'تكلفة تحويل وصيانة اقتصادية وفي متناول الجميع',
      'قطع غيار متوفرة ومقاومة عالية لظروف التشغيل الشاقة',
      'مفتاح تحويل يدوي مع مبين رقمي لمستوى الغاز بالصالون'
    ],
    avgKitPriceEgp: 11500,
    warrantyYears: 2,
  },
];

export const DEFAULT_PLATFORM_SETTINGS: PlatformMasterSettings = {
  pricing: DEFAULT_FUEL_PRICING,
  customFuels: DEFAULT_CUSTOM_FUELS,
  feasibility: DEFAULT_FEASIBILITY_SETTINGS,
  centers: DEFAULT_CARGAS_CENTERS,
  cylinders: DEFAULT_CYLINDER_SPECS,
  systems: DEFAULT_CONVERSION_SYSTEMS,
  contacts: DEFAULT_CONTACT_NUMBERS,
  general: {
    companyName: 'الشركة المصرية الدولية لتكنولوجيا الغاز (كارجاس - CARGAS)',
    hotline: '19544',
    defaultSurveyorName: 'م. أحمد الشناوي',
    emergencyHotline: '129 / 19544',
    marketingPhone: '02-24185200',
    whatsappNumber: '+201019544000',
    customerServicePhone: '19544',
  },
};

const STORAGE_KEY = 'cargas_unified_settings_v1';

export function loadPlatformSettings(): PlatformMasterSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure hotline is 19544 if legacy 19614 was saved
      const savedGeneral = parsed.general || {};
      if (savedGeneral.hotline === '19614') {
        savedGeneral.hotline = '19544';
      }

      // Merge feasibility customFields
      const savedFeas = parsed.feasibility || {};
      const mergedFields = Array.isArray(savedFeas.customFields) && savedFeas.customFields.length > 0
        ? savedFeas.customFields
        : DEFAULT_FEASIBILITY_FIELDS;

      // Merge custom fuels
      const mergedFuels = Array.isArray(parsed.customFuels) && parsed.customFuels.length > 0
        ? parsed.customFuels
        : DEFAULT_CUSTOM_FUELS;

      // Merge with defaults in case of missing keys
      return {
        ...DEFAULT_PLATFORM_SETTINGS,
        ...parsed,
        pricing: { ...DEFAULT_PLATFORM_SETTINGS.pricing, ...(parsed.pricing || {}) },
        customFuels: mergedFuels,
        feasibility: { 
          ...DEFAULT_PLATFORM_SETTINGS.feasibility, 
          ...savedFeas,
          customFields: mergedFields 
        },
        general: { ...DEFAULT_PLATFORM_SETTINGS.general, ...savedGeneral, hotline: savedGeneral.hotline || '19544' },
        contacts: Array.isArray(parsed.contacts) && parsed.contacts.length > 0 ? parsed.contacts : DEFAULT_CONTACT_NUMBERS,
        centers: Array.isArray(parsed.centers) && parsed.centers.length > 0 ? parsed.centers : DEFAULT_CARGAS_CENTERS,
        cylinders: Array.isArray(parsed.cylinders) && parsed.cylinders.length > 0 ? parsed.cylinders : DEFAULT_CYLINDER_SPECS,
        systems: Array.isArray(parsed.systems) && parsed.systems.length > 0 ? parsed.systems : DEFAULT_CONVERSION_SYSTEMS,
      };
    }
  } catch (e) {
    console.error('Error loading settings from localStorage', e);
  }
  return DEFAULT_PLATFORM_SETTINGS;
}

export function savePlatformSettings(settings: PlatformMasterSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to localStorage', e);
  }
}
