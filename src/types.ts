export type VehicleType = 
  | 'private'          // ملاكي
  | 'taxi'             // تاكسي حسب المحافظة
  | 'microbus'         // ميكروباص
  | 'van'              // فان (سوزوكي تمناية)
  | 'minibus'          // ميني باص
  | 'pickup'           // نصف نقل
  | 'bus'              // اتوبيس
  | 'motorcycle'       // دراجة نارية / تروسيكل
  | 'suzuki_van'       // توافق خلفي
  | 'peugeot_station'; // توافق خلفي

export interface VehicleConfig {
  type: VehicleType;
  label: string;
  subLabel: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  accentColor: string;
  dailyAvgKm: number;
  monthlySavingsEgp: number;
  cngSuitability: 'مرتفعة جداً' | 'مرتفعة' | 'متوسطة';
  description: string;
  shortcutKey: string;
}

export const VEHICLE_TYPES: Record<VehicleType, VehicleConfig> = {
  private: {
    type: 'private',
    label: 'ملاكي',
    subLabel: 'سيارات ركوب خاصة',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-400',
    borderColor: 'border-blue-500/40',
    accentColor: '#3b82f6',
    dailyAvgKm: 40,
    monthlySavingsEgp: 2100,
    cngSuitability: 'متوسطة',
    description: 'سيارات الصالون والركوب الشخصي مع متوسط استهلاك وقود منزلي وتجاري',
    shortcutKey: '1',
  },
  taxi: {
    type: 'taxi',
    label: 'تاكسي حسب المحافظة',
    subLabel: 'تاكسي العاصمة والأقاليم',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    accentColor: '#f59e0b',
    dailyAvgKm: 200,
    monthlySavingsEgp: 8600,
    cngSuitability: 'مرتفعة جداً',
    description: 'تاكسي أبيض (القاهرة/الجيزة)، أصفر وأسود (الإسكندرية)، برتقالي/أبيض (الأقاليم)',
    shortcutKey: '2',
  },
  microbus: {
    type: 'microbus',
    label: 'ميكروباص',
    subLabel: 'نقل جماعي 14 راكب',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    accentColor: '#10b981',
    dailyAvgKm: 230,
    monthlySavingsEgp: 9800,
    cngSuitability: 'مرتفعة جداً',
    description: 'ميكروباصات تويوتا هايس وكينج لونج خطوط السير الداخلية وبين المحافظات',
    shortcutKey: '3',
  },
  van: {
    type: 'van',
    label: 'فان',
    subLabel: 'سوزوكي تمناية 7 راكب',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    accentColor: '#a855f7',
    dailyAvgKm: 170,
    monthlySavingsEgp: 6900,
    cngSuitability: 'مرتفعة جداً',
    description: 'سيارات الميني فان وسوزوكي وشيفروليه N300 لنقل الركاب والتوصيل',
    shortcutKey: '4',
  },
  minibus: {
    type: 'minibus',
    label: 'ميني باص',
    subLabel: 'كوستر 28 راكب ونقل موظفين',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
    accentColor: '#06b6d4',
    dailyAvgKm: 190,
    monthlySavingsEgp: 10500,
    cngSuitability: 'مرتفعة جداً',
    description: 'حافلات الميني باص والمتوسطة لنقل الشركات والمدارس والخطوط الحضرية',
    shortcutKey: '5',
  },
  pickup: {
    type: 'pickup',
    label: 'نصف نقل',
    subLabel: 'شيفروليه الدبابة وشاحنات خفيفة',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-400',
    borderColor: 'border-orange-500/40',
    accentColor: '#f97316',
    dailyAvgKm: 180,
    monthlySavingsEgp: 8200,
    cngSuitability: 'مرتفعة جداً',
    description: 'سيارات النقل الخفيف والبيك آب ونقل البضائع والتموين اليومي',
    shortcutKey: '6',
  },
  bus: {
    type: 'bus',
    label: 'اتوبيس',
    subLabel: 'نقل عام وسياحي وشاحنات',
    badgeBg: 'bg-red-500/20',
    badgeText: 'text-red-400',
    borderColor: 'border-red-500/40',
    accentColor: '#ef4444',
    dailyAvgKm: 250,
    monthlySavingsEgp: 14500,
    cngSuitability: 'مرتفعة جداً',
    description: 'أتوبيسات هيئة النقل العام والأتوبيسات السياحية الكبيرة والشاحنات',
    shortcutKey: '7',
  },
  motorcycle: {
    type: 'motorcycle',
    label: 'دراجة نارية / تروسيكل',
    subLabel: 'موتوسيكل ودليفري وتروسيكل',
    badgeBg: 'bg-teal-500/20',
    badgeText: 'text-teal-400',
    borderColor: 'border-teal-500/40',
    accentColor: '#14b8a6',
    dailyAvgKm: 90,
    monthlySavingsEgp: 2800,
    cngSuitability: 'متوسطة',
    description: 'الدراجات النارية والتروسيكل التجاري لنقل البضائع الخفيفة والتوصيل',
    shortcutKey: '8',
  },
  // Backward compatibility
  suzuki_van: {
    type: 'suzuki_van',
    label: 'فان',
    subLabel: 'سوزوكي تمناية 7 راكب',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    accentColor: '#a855f7',
    dailyAvgKm: 170,
    monthlySavingsEgp: 6900,
    cngSuitability: 'مرتفعة جداً',
    description: 'سيارات الميني فان وسوزوكي 7 راكب',
    shortcutKey: '4',
  },
  peugeot_station: {
    type: 'peugeot_station',
    label: 'بيجو ستيشن',
    subLabel: 'ستيشن 7 راكب بين المحافظات',
    badgeBg: 'bg-rose-500/20',
    badgeText: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    accentColor: '#f43f5e',
    dailyAvgKm: 280,
    monthlySavingsEgp: 11200,
    cngSuitability: 'مرتفعة جداً',
    description: 'سيارات بيجو 504 و505 ستيشن سقف طويل لخطوط السفر والأقاليم',
    shortcutKey: '9',
  },
};

export const VEHICLE_CONFIGS = VEHICLE_TYPES;

export const createDefaultVehicleCounts = (overrides?: Partial<Record<VehicleType, number>>): Record<VehicleType, number> => ({
  private: 0,
  taxi: 0,
  microbus: 0,
  van: 0,
  minibus: 0,
  pickup: 0,
  bus: 0,
  motorcycle: 0,
  suzuki_van: 0,
  peugeot_station: 0,
  ...overrides,
});

export interface DetectionRecord {
  id: string;
  sessionId: string;
  timestamp: string;
  timeDisplay: string;
  vehicleType: VehicleType;
  confidence: number;
  method: 'camera_ai' | 'manual_tap' | 'motion_sensor';
  description?: string;
  snapshotUrl?: string;
}

export interface MonitoringSession {
  id: string;
  code: string;
  title: string;
  locationName: string;
  governorate: string;
  city: string;
  district?: string;
  roadType?: string;
  resolvedAddress?: string;
  autoLocationResolved?: boolean;
  onlinePoiData?: string;
  customFieldValues?: Record<string, any>;
  coordinates: {
    lat: number;
    lng: number;
  };
  nearestStation: string;
  trafficDirection: string;
  surveyorName: string;
  status: 'active' | 'completed' | 'paused';
  startTime: string;
  endTime?: string;
  durationSeconds: number;
  counts: Record<VehicleType, number>;
  detections: DetectionRecord[];
  notes?: string;
  // Geolocation & Auto GPS tracking metadata
  gpsAccuracyMeters?: number;
  elevationMeters?: number;
  autoGpsCaptured?: boolean;
  gpsCaptureTimestamp?: string;
  // Department reviews and site evaluations
  departmentReviews?: Record<string, DepartmentReview>;
  customIndicators?: CustomFeasibilityIndicator[];
  customCostItems?: CustomCostItem[];
  safetyZoning?: SafetyZoningRequirement[];
  // Station Construction & Execution Phase Data (الموقف التنفيذي الإنشائي للمحطة)
  executionData?: StationExecutionData;
  // Department-specific documentation & video archive
  departmentOrigin?: DepartmentRole;
  documentationCategory?: 'traffic_census' | 'equipment_machinery' | 'land_civil' | 'safety_inspection' | 'technical_network' | 'licensing_legal';
  recordedVideoUrl?: string;
  videoDurationSeconds?: number;
  sessionSnapshotThumbnails?: string[];
}

// Station Construction & Execution Phase
export type StationExecutionStatus = 
  | 'feasibility_approved' // معتمدة ومؤهلة للإنشاء
  | 'site_handover'        // تسليم الموقع وتجهيز الأرض
  | 'civil_works'          // الأعمال المدنية والإنشائية الجارية
  | 'equipment_supply'     // توريد وتركيب الضاغط والموزعات
  | 'safety_commissioning' // اختبارات الأمان والسلامة والغاز
  | 'operational';         // تم إطلاق الغاز والتشغيل التجاري

export type ExecutionCategory = 'civil' | 'equipment' | 'hse' | 'legal' | 'financial';

export interface ExecutionSubTask {
  id: string;
  title: string;
  completed: boolean;
  completionDate?: string;
  notes?: string;
}

export interface ExecutionWorkItem {
  id: string;
  category: ExecutionCategory;
  departmentName: string;
  title: string;
  description: string;
  weightPercent: number; // الوزن النسبي في إجمالي إنشاء المحطة
  progressPercent: number; // 0 - 100
  status: 'not_started' | 'in_progress' | 'inspection' | 'completed' | 'delayed';
  startDate: string;
  targetEndDate: string;
  actualEndDate?: string;
  assignedEngineer: string;
  contractorName?: string;
  estimatedCostEgp: number;
  disbursedCostEgp: number;
  subTasks: ExecutionSubTask[];
  notes?: string;
}

export interface DailySiteLog {
  id: string;
  date: string; // YYYY-MM-DD
  reportType: 'daily' | 'weekly' | 'monthly' | 'milestone';
  recordedBy: string;
  residentEngineer: string;
  weatherAndSiteCondition: string;
  workforceCount: number; // عدد العمال والفنيين بالموقع
  equipmentOnSite: string; // المعدات المتواجدة بالموقع
  completedWorksToday: string;
  plannedWorksTomorrow: string;
  hseIndustrialSafetyStatus: string; // حالة الأمن الصناعي (مثال: صفر حوادث، التزام بالخوذات والسترات)
  delaysOrObstacles?: string;
  siteProgressSnapshotPercent: number; // نسبة الإنجاز في هذا التاريخ
  photosCount: number;
}

export interface StationExecutionData {
  executionStatus: StationExecutionStatus;
  kickoffDate: string;
  targetHandoverDate: string;
  actualHandoverDate?: string;
  contractorName: string;
  consultantEngineer: string;
  residentEngineer: string;
  overallProgressPercent: number;
  totalApprovedBudgetEgp: number;
  totalDisbursedBudgetEgp: number;
  workItems: ExecutionWorkItem[];
  dailyLogs: DailySiteLog[];
}

// Department review types
export type DepartmentType = 'projects' | 'hse' | 'operations' | 'legal' | 'financial';

export type DepartmentReviewDecision = 'approved' | 'rejected' | 'conditional' | 'deferred' | 'pending';

export interface DepartmentReviewAttachment {
  id: string;
  name: string;
  sizeBytes: number;
  sizeFormatted?: string;
  type: 'pdf' | 'image' | 'word' | 'excel' | 'other';
  category?: 'pdf' | 'image' | 'word' | 'excel' | 'other';
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  dataUrl?: string; // base64 or blob URL
  notes?: string;
}

export interface DepartmentCustomField {
  id: string;
  department: DepartmentType;
  label: string;
  fieldType: 'number' | 'text' | 'select' | 'boolean';
  value: string | number | boolean;
  unit?: string;
  options?: string[];
  impactsCapex?: boolean;
  impactsOpex?: boolean;
  capexAmount?: number;
  opexAmount?: number;
  notes?: string;
}

export interface DepartmentReview {
  department: DepartmentType;
  departmentName: string;
  reviewerName: string;
  reviewDate: string;
  decision: DepartmentReviewDecision;
  justification: string;
  rejectionReasons?: string;
  detectedErrors?: string;
  attachments?: DepartmentReviewAttachment[];
  customFields: DepartmentCustomField[];
  costEstimates?: {
    civilCostEgp?: number;
    electricalCostEgp?: number;
    excavationCostEgp?: number;
    concreteCostEgp?: number;
    pipelineCostEgp?: number;
    compressorCostEgp?: number;
    dispenserCostEgp?: number;
    safetyEquipmentCostEgp?: number;
  };
  hseEvaluation?: {
    nfpa52Compliant: boolean;
    civilDefenseApproved: boolean;
    environmentalImpactApproved: boolean;
    blastWallRequired: boolean;
    emergencyShutdownZonesOk: boolean;
    gasDetectorsInstalled: boolean;
    minSafeDistanceMeters: number;
    actualDistanceMeters: number;
  };
  operationalSpecs?: {
    compressorCapacityM3h: number;
    inletGasPressureBar: number;
    storageCascadesWaterCapacityL: number;
    dispenserHosesCount: number;
    pipelineLengthMeters: number;
    requiredPowerKva: number;
  };
  legalReview?: {
    landTenureType: 'ownership' | 'long_term_lease' | 'usufruct' | 'concession';
    contractDurationYears: number;
    annualLeaseCostEgp: number;
    buildingPermitFeasible: boolean;
    zoningClearance: boolean;
    titleDeedVerified: boolean;
    disputeRiskLevel: 'low' | 'medium' | 'high';
  };
  financialAudit?: {
    totalCapexAudited: number;
    annualOpexAudited: number;
    npvAudited: number;
    irrAuditedPercent: number;
    paybackYearsAudited: number;
    roiAuditedPercent: number;
    auditStatus: 'approved' | 'enhance_required' | 'rejected';
    auditorNotes: string;
    identifiedErrors: string[];
    correctionLog?: Array<{
      parameter: string;
      originalValue: number | string;
      correctedValue: number | string;
      reason: string;
    }>;
  };
}

// Custom dynamic Feasibility Indicator
export interface CustomFeasibilityIndicator {
  id: string;
  name: string;
  category: 'financial' | 'technical' | 'operational' | 'safety';
  value: number | string;
  unit: string;
  targetBenchmark?: string;
  description: string;
  status: 'compliant' | 'warning' | 'critical' | 'neutral';
}

// Custom Cost Items (CAPEX & OPEX line items)
export interface CustomCostItem {
  id: string;
  name: string;
  department: DepartmentType;
  departmentName: string;
  costEgp: number;
  category: 'capex' | 'opex';
  notes?: string;
}

// Safety Zoning & Equipment Placement Requirements
export interface SafetyZoningRequirement {
  id: string;
  item: string;
  codeStandard: string; // e.g. "NFPA 52 / الكود المصري لمحطات الغاز"
  minRequiredDistanceMeters: number;
  actualDistanceMeters: number;
  equipmentZoned: string; // "الضاغط", "الحاويات الاسطوانية", "الطلمبات", "غرفة المولد"
  isCompliant: boolean;
  notes: string;
}

// Multi-Department Overall Site Investment Recommendation
export interface ExecutiveSiteRecommendation {
  overallVerdict: 'recommended_immediately' | 'conditional_approval' | 'rejected';
  verdictScorePercent: number;
  weights: {
    financial: number; // 35%
    technical: number; // 25%
    safetyHse: number; // 25%
    legal: number;     // 15%
  };
  financialScore: number;
  technicalScore: number;
  safetyScore: number;
  legalScore: number;
  executiveSummary: string;
  mandatoryPrerequisites: string[];
  identifiedRisks: string[];
  committeeDate: string;
}

export type FacilityType = 'fueling_station' | 'conversion_center' | 'integrated';

export interface CNGStation {
  id: string;
  name: string;
  company: 'غازتك (Gastec)' | 'كارجاس (Cargas)' | 'ماستر جاس (MasterGas)' | 'طاقة غاز (Taqa Gas)' | 'الوطنية للغاز (ChillOut)' | string;
  governorate: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  dispenserCount: number;
  hasConversionCenter: boolean;
  facilityType?: FacilityType; // محطة تموين | مركز تحويل | متكاملة
  status: 'active' | 'maintenance' | 'proposed';
  brand?: 'cargas' | 'gastec' | 'mastergas' | 'taqa' | 'chillout' | 'wataniya' | 'totalenergies' | 'shell' | 'mobil' | 'misr_petroleum' | 'coop' | 'gogas' | 'other';
  cngCapacityM3h?: number;
  distanceFromSiteKm?: number;
  notes?: string;
  phone?: string;
  openingDate?: string;
  
  // التشغيل والصيانة (Operational & Technical from Form 5)
  compressorCapacityM3h?: number; // قوة الضاغط
  compressorCount?: number; // عدد الضواغط
  gasInletPressureBar?: number; // ضغط الغاز الداخل (بار)
  queueCapacityVehicles?: number; // سعة طابور الانتظار (مركبة)
  compressorBreakdowns?: 'routine_only' | 'rare' | 'frequent'; // أعطال الضاغط
  maintenanceDowntimeHours?: number; // فترات التوقف للصيانة
  compressorOperatingHours?: number; // متوسط ساعات عمل الضاغط يومياً
  canopyType?: 'exists' | 'none' | 'spreader'; // المظلة: يوجد / لا يوجد / سبريدر
  stationAreaRating?: 'small' | 'adequate' | 'large'; // المساحة: صغيرة / مناسبة / كبيرة
  maneuverRating?: 'excellent' | 'adequate' | 'inadequate' | 'modification_needed'; // المناورة وسهولة الدخول والخروج
  dailyCustomerCarsCount?: number; // متوسط عدد السيارات يومياً
  dailyAvgSalesM3?: number; // متوسط المبيعات اليومية (م٣)
  monthlyGasSalesM3?: number; // مبيعات الغاز الشهرية (م٣)
  
  // التسويق والدراسة الميدانية (Marketing & Trade Area from Forms 1, 2, 3, 4)
  boundaryNorth?: string; // الحد البحري / الواجهة
  boundarySouth?: string; // الحد القبلي / الخلفي
  boundaryEast?: string;  // الحد الشرقي / الجانب الأيمن
  boundaryWest?: string;  // الحد الغربي / الجانب الأيسر
  totalAreaM2?: number;   // إجمالي المساحة
  siteDimensions?: string; // أبعاد الموقع: واجهة × عمق
  landTenure?: 'ownership' | 'usufruct' | 'allocation' | 'lease'; // ملك / حق انتفاع / تخصيص / إيجار
  landNature?: 'agricultural' | 'urban_vacant' | 'existing_fuel_station' | 'other';
  gasGridAvailable?: boolean; // توافر خط الغاز بالمنطقة
  areaDescription?: string; // منطقة سكنية / صناعية / طريق رئيسي
  siteRating?: '+A' | 'A' | 'B' | 'C'; // تقييم الموقع
  nearestPetrolStation?: string; // أقرب محطة بنزين ومسافتها
  nearestPetrolDistance?: string;
  nearestCngStation?: string; // أقرب محطة غاز ومسافتها
  nearestCngDistance?: string;
  nearestBusStand?: string; // أقرب موقف سيارات
  nearestBusStandDistance?: string;
  trafficQuarterHourRating?: 'weak' | 'medium' | 'high' | 'very_high'; // الكثافة المرورية في ربع ساعة
  liquidFuelSales?: {
    gasoline95?: number;
    gasoline92?: number;
    gasoline80?: number;
    diesel?: number;
  };
  conversionCenterAvailability?: string; // توافر مركز تحويل بالمنطقة
  tradeAreaIndustrialDemand?: string; // المصانع والشركات والمزارع التي تعمل بالغاز
}

// Contact Number Item for Master Control Panel
export interface ContactNumberItem {
  id: string;
  title: string;
  number: string;
  department: string;
  type: 'hotline' | 'mobile' | 'landline' | 'whatsapp' | 'emergency';
  isPrimary: boolean;
  description?: string;
  isActive: boolean;
}

// Landowner Site Inspection Request (نموذج طلب المعاينة لإقامة محطة غاز كارجاس)
export interface LandownerInspectionRequest {
  id: string;
  requestNumber: string;
  applicantName: string; // مقدمه لسيادتكم
  nationalId: string;    // بطاقة رقم قومي
  residenceAddress: string; // المقيم في
  residenceGovernorate: string; // المحافظة
  phone: string;         // تليفون
  siteAddress: string;   // عنوان الموقع
  siteDistrict: string;  // المركز / الحي
  siteGovernorate: string; // محافظة الموقع
  coordinates: {
    lat: number;
    lng: number;
  };
  boundaryNorth: string; // الحد البحري
  boundarySouth: string; // الحد القبلي
  boundaryEast: string;  // الحد الشرقي
  boundaryWest: string;  // الحد الغربي
  totalAreaM2: number;   // مساحة الموقع تقريباً
  siteDimensions?: string; // واجهة × عمق
  currentSiteStatus: 'vacant_land' | 'existing_fuel_station' | 'building' | 'other'; // الوضع الحالي
  landTenure: 'ownership' | 'usufruct' | 'allocation' | 'lease'; // ملك / حق انتفاع / تخصيص / إيجار
  landNature: 'agricultural' | 'urban_vacant' | 'existing_station' | 'other'; // أرض زراعية / فضاء داخل كردون / محطة قائمة / أخرى
  gasGridAvailable: boolean; // يوجد غاز طبيعي بالمنطقة / لا يوجد
  requestDate: string; // تحرير في
  status: 'pending' | 'survey_scheduled' | 'approved' | 'rejected' | 'station_created';
  notes?: string;
  assignedSurveyor?: string;
  surveyDate?: string;
  surveyRating?: '+A' | 'A' | 'B' | 'C';
  createdStationId?: string;
}

export interface FeasibilityFinancialMetrics {
  totalCapex: number;
  annualOpex: number;
  dailyGasDispensedM3: number;
  annualGasDispensedM3: number;
  annualGasGrossProfit: number;
  annualConversionGrossProfit: number;
  annualAncillaryProfit: number;
  annualTotalRevenue: number;
  annualNetCashFlow: number;
  paybackPeriodYears: number;
  npv: number;
  irr: number;
  breakEvenDailyM3: number;
  tenYearCashFlows: Array<{
    year: number;
    cashInflow: number;
    cashOutflow: number;
    netCashFlow: number;
    cumulativeCashFlow: number;
    discountedCashFlow: number;
  }>;
}

// Fuel & Energy Pricing
export interface FuelPricing {
  cngPrice: number; // EGP per m³
  gasoline80Price: number; // EGP per liter
  gasoline92Price: number; // EGP per liter
  gasoline95Price: number; // EGP per liter
  dieselPrice: number; // EGP per liter
  lastUpdated: string;
}

// Dynamic Field Definition for CapEx, OpEx, Margins, and Feasibility Parameters
export interface FeasibilityFieldDefinition {
  id: string;
  key: string;
  category: 'capex' | 'opex' | 'margin' | 'operational';
  label: string; // The user can change e.g. "وحدة الضواغط الرئيسية" to whatever they want!
  subLabel?: string;
  unit: string; // "ج.م", "ج.م/م³", "ج.م/سنة", "%"
  defaultValue: number;
  value: number;
  isVisible: boolean; // Show or hide toggle!
  isCustom?: boolean; // Added by user
  description?: string;
}

// Fuel Price & Energy Item for Dynamic Fuels Management
export interface CustomFuelItem {
  id: string;
  key?: string;
  name: string; // User can rename e.g. "بنزين 80" or "غاز طبيعي كارجاس"
  subName?: string;
  price: number;
  unit: string; // "ج.م / لتر", "ج.م / م³", "ج.م / ك.و.س"
  color: string;
  isVisible: boolean;
  isCustom?: boolean;
}

// Feasibility & CapEx/OpEx Master Defaults
export interface FeasibilityDefaults {
  capexCompressors: number;
  capexCascades: number;
  capexDispensers: number;
  capexGasPipeline: number;
  capexCivilAndCanopy: number;
  capexConversionCenter: number;
  capexPermitsAndSafety: number;
  opexElectricityAnnual: number;
  opexMaintenanceAnnual: number;
  opexLaborAnnual: number;
  opexInsuranceAndAdmin: number;
  cngProfitMarginPerM3: number;
  captureRatePercent: number;
  conversionNetMarginPerCar: number;
  monthlyConversionsCount: number;
  discountRatePercent: number;
  operatingHoursPerDay: number;
  // Dynamic fields list enabling add, edit label/name, remove, and show/hide:
  customFields?: FeasibilityFieldDefinition[];
}

// Technical Guide Centers
export interface CargasCenterItem {
  id: string;
  name: string;
  governorate: string;
  city: string;
  address: string;
  phone: string;
  services: string[];
  hours: string;
  isActive: boolean;
}

// Cylinder Technical Specs
export interface CylinderSpecItem {
  id: string;
  name: string;
  material: string;
  specs: string;
  pressure: string;
  features: string[];
  suitable: string;
  approxWeightKg: number;
  capacityLiters: number;
  equivalentCngM3: number;
}

// Conversion System Specs
export interface ConversionSystemItem {
  id: string;
  name: string;
  generation: string;
  technology: string;
  suitableVehicles: string;
  features: string[];
  avgKitPriceEgp: number;
  warrantyYears: number;
}

// Global Platform Master Settings
export interface PlatformMasterSettings {
  pricing: FuelPricing;
  customFuels?: CustomFuelItem[];
  feasibility: FeasibilityDefaults;
  centers: CargasCenterItem[];
  cylinders: CylinderSpecItem[];
  systems: ConversionSystemItem[];
  contacts?: ContactNumberItem[];
  general: {
    companyName: string;
    hotline: string; // 19544
    defaultSurveyorName: string;
    emergencyHotline?: string;
    marketingPhone?: string;
    whatsappNumber?: string;
    customerServicePhone?: string;
  };
}

// Query Filters for Inspected Locations
export interface LocationQueryFilter {
  searchQuery: string;
  governorate: string;
  minFlowPerHour: number;
  dominantVehicleType: 'all' | VehicleType;
  surveyor: string;
  status: 'all' | 'completed' | 'active';
  sortBy: 'totalVehicles' | 'flowRate' | 'cngDemand' | 'date' | 'microbusCount';
  sortOrder: 'desc' | 'asc';
}

// Historical Photo or Blueprint Document
export interface HistoricalPhotoItem {
  id: string;
  title: string;
  locationOrStationName: string;
  governorate: string;
  category: 'site_survey' | 'blueprint' | 'aerial_map' | 'construction' | 'opening';
  date: string;
  url: string; // base64 data url or image url
  description?: string;
  uploadedAt: string;
  fileSizeKb?: number;
}

// Company Station Census & Portfolio Item
export interface CompanyStationCensusItem {
  id: string;
  name: string;
  code: string;
  governorate: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  status: 'operational' | 'under_construction' | 'licensed_pending' | 'proposed' | 'expansion';
  dispenserCount: number;
  compressorCapacityM3h: number;
  commissioningYear: number;
  hasConversionCenter: boolean;
  annualVolumeM3?: number;
  investmentValueMillionEgp?: number;
  contractorOrPartner?: string;
  notes?: string;
}

// -------------------------------------------------------------
// Department Portal & Role-Based Access Control (RBAC) Types
// -------------------------------------------------------------
export type DepartmentRole = 
  | 'admin'        // إدارة النظام والتحكم الشامل
  | 'marketing'    // إدارة التسويق والدراسات الميدانية وتكليف المعاينين
  | 'surveyor'     // المعاين الميداني (رابط الرصد المستقل عبر الواتساب)
  | 'projects'     // إدارة المشروعات والأعمال المدنية
  | 'hse'          // إدارة الأمن الصناعي والسلامة والصحة المهنية
  | 'operations'   // إدارة التشغيل والصيانة (المعدات والآلات والضواغط والموزعات)
  | 'technical'    // الإدارة الفنية (ضغوط الشبكة والمواصفات القياسية)
  | 'licensing'    // إدارة التراخيص والموافقات الحكومية
  | 'legal'        // الإدارة القانونية والعقود
  | 'financial';   // الإدارة المالية ودراسات الجدوى

export interface DepartmentMetadata {
  role: DepartmentRole;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  bgGradient: string;
  iconName: string;
  primaryScope: string;
  keyResponsibilities: string[];
}

// Dynamic Custom Form Field (Editable by Admin only)
export interface CustomFormField {
  id: string;
  department: DepartmentRole;
  label: string;
  key: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'boolean' | 'file';
  options?: string[];
  required: boolean;
  visible: boolean; // إظهار أو إخفاء الحقل
  defaultValue?: string | number | boolean;
  description?: string;
  section?: string;
  createdBy: string;
  createdAt: string;
}

// Form Change Request submitted by a Department to System Admin
export interface FormChangeRequest {
  id: string;
  department: DepartmentRole;
  departmentName: string;
  requesterName: string;
  requestType: 'add_field' | 'edit_field' | 'hide_field' | 'delete_field' | 'custom_modification' | 'import_file';
  fieldLabel: string;
  fieldType?: string;
  fieldKey?: string;
  justification: string;
  proposedSection?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  adminNotes?: string;
  reviewedAt?: string;
  // Attached Word/Excel file data
  attachedFileName?: string;
  attachedFileType?: 'word' | 'excel' | 'csv';
  attachedFileSize?: string;
  attachedFileContent?: string;
  parsedFields?: {
    label: string;
    type: 'text' | 'number' | 'select' | 'boolean' | 'date';
    key: string;
    section?: string;
    options?: string[];
    description?: string;
  }[];
}

// Landowner Site Survey Application (طلب معاينة مقدم من مالك الموقع / الأرض لإضافة محطة غاز أو مركز تحويل)
export interface LandownerApplication {
  id: string;
  ownerName: string;
  ownerType: 'owner' | 'authorized_agent' | 'station_operator' | 'investor';
  nationalId?: string;
  phoneNumber: string;
  whatsappNumber: string;
  email?: string;
  governorate: string;
  city: string;
  districtOrVillage: string;
  fullAddress: string;
  gpsCoords?: { lat: number; lng: number };
  totalAreaM2: number;
  frontageMeters: number;
  depthMeters: number;
  currentSiteUsage: 'vacant_land' | 'existing_fuel_station' | 'commercial_garage' | 'transport_hub' | 'industrial_warehouse';
  existingStationBrand?: string;
  roadClassification: 'highway' | 'main_axis' | 'commercial_street' | 'city_entrance';
  hasMedianIsland: boolean;
  hasOppositeUTurn: boolean;
  roadWidthMeters: number;
  ownershipDocumentType: 'registered_deed' | 'primary_contract' | 'usufruct' | 'long_term_lease';
  licenseStatus: 'has_building_permit' | 'has_commercial_license' | 'agricultural_with_reconciliation' | 'unlicensed';
  partnershipPreference: 'cng_only_station' | 'integrated_fuel_and_cng' | 'conversion_center_only' | 'station_and_conversion' | 'long_term_lease_to_cargas' | 'revenue_share';
  applicationDate: string;
  status: 'pending_review' | 'surveyor_dispatched' | 'survey_completed' | 'approved_marketing' | 'rejected';
  notes?: string;
  marketingEvaluationScore?: number;
  assignedSurveyorName?: string;
  assignedSurveyorPhone?: string;
  linkedSessionId?: string;
}

// WhatsApp Shareable Field Survey Assignment
export interface MarketingSurveyAssignment {
  id: string;
  siteName: string;
  governorate: string;
  cityOrDistrict: string;
  addressDetails?: string;
  surveyorName: string;
  surveyorPhone: string;
  assignedBy: string;
  assignedDate: string;
  targetScope: 'new_station' | 'dual_fuel_conversion' | 'fleet_census' | 'highway_corridor';
  status: 'dispatched' | 'in_progress' | 'completed' | 'cancelled';
  surveyToken: string;
  surveyUrl: string;
  instructions?: string;
  completedSessionId?: string;
}

export type ActiveTabType = 
  | 'camera' 
  | 'sessions' 
  | 'map' 
  | 'feasibility' 
  | 'departments' 
  | 'execution' 
  | 'calculator' 
  | 'guide' 
  | 'admin'
  | 'invitations';

// WhatsApp General Manager Invitation record
export interface DepartmentInvitationItem {
  id: string;
  department: DepartmentRole;
  departmentName: string;
  recipientName: string;
  recipientPhone: string;
  userType: 'general_manager' | 'staff' | 'engineer';
  roleTitle: string;
  directUrl: string;
  sentAt: string;
  sentBy: string;
  notes?: string;
}

// Department Team Member Invitation record (sent by General Manager)
export interface DepartmentTeamMemberInvite {
  id: string;
  department: DepartmentRole;
  memberName: string;
  memberPhone: string;
  memberRole: string; // e.g. مهندس موقع، فني، محاسب، إداري
  directUrl: string;
  invitedAt: string;
  invitedBy: string;
  notes?: string;
}

// Super Admin Credentials
export interface SuperAdminCredentials {
  email: string;
  password: string;
  lastUpdated?: string;
}

// Department Access Password & GM credentials (managed by Super Admin)
export interface DepartmentAccessCredentials {
  department: DepartmentRole;
  password: string;
  gmTitle: string;
  defaultGmName: string;
  defaultGmPhone: string;
  lastUpdated: string;
}

// Central Department Activity & Message Log Item
export interface DepartmentActivityLogItem {
  id: string;
  department: DepartmentRole;
  departmentName: string;
  actorName: string;
  actorRole: 'general_manager' | 'staff' | 'engineer' | 'super_admin';
  actionType: 'login' | 'invite_sent' | 'message_sent' | 'task_assigned' | 'camera_session_saved' | 'form_updated' | 'video_recorded';
  title: string;
  details: string;
  timestamp: string;
  dateStr: string;
  timeStr: string;
  recipientName?: string;
  recipientPhone?: string;
  relatedSessionId?: string;
  metadata?: Record<string, any>;
}

// Stored Video Recording in Central/Department Archive
export interface RecordedVideoSession {
  id: string;
  sessionId: string;
  sessionTitle: string;
  department: DepartmentRole;
  departmentName: string;
  locationName: string;
  governorate: string;
  recordedBy: string;
  recordedAt: string;
  timestampDisplay: string;
  durationSeconds: number;
  category: 'traffic_census' | 'equipment_machinery' | 'land_civil' | 'safety_inspection' | 'technical_network' | 'licensing_legal';
  categoryLabel: string;
  videoUrl?: string;
  thumbnailUrl: string;
  notes?: string;
  equipmentInspected?: string[];
  findingsSummary?: string;
  fileSizeBytes?: number;
}


