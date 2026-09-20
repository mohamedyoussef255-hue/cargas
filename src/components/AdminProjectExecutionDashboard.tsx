import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart
} from 'recharts';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Building2,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Filter,
  RefreshCw,
  Printer,
  Download,
  Flame,
  ShieldCheck,
  HardHat,
  Scale,
  Wrench,
  FileCheck,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { DepartmentRole } from '../types';

export interface AdminProjectExecutionDashboardProps {
  onPreviewDepartment?: (dept: DepartmentRole) => void;
}

export interface DepartmentScheduleProgress {
  id: string;
  role: DepartmentRole;
  departmentName: string;
  shortName: string;
  managerName: string;
  actualProgress: number; // 0-100%
  plannedProgress: number; // 0-100%
  variance: number; // actual - planned (+ is ahead, - is delayed)
  spi: number; // Schedule Performance Index = actual / planned
  status: 'ahead' | 'on_track' | 'slight_delay' | 'delayed';
  approvedBudgetEgp: number;
  disbursedBudgetEgp: number;
  tasksCompleted: number;
  tasksTotal: number;
  startDate: string;
  targetEndDate: string;
  currentMilestone: string;
  correctiveAction?: string;
  performanceMetrics: {
    scheduleAdherence: number;
    budgetEfficiency: number;
    qualitySafety: number;
    tasksPace: number;
    responsiveness: number;
  };
}

export interface StationProjectOverview {
  id: string;
  name: string;
  governorate: string;
  type: string;
  kickoffDate: string;
  targetHandoverDate: string;
  overallActualProgress: number;
  overallPlannedProgress: number;
  totalApprovedBudgetEgp: number;
  totalDisbursedBudgetEgp: number;
  departments: DepartmentScheduleProgress[];
  timelineHistory: {
    period: string; // month or week
    plannedCumulative: number;
    actualCumulative: number;
    monthlyTarget: number;
    monthlyActual: number;
  }[];
}

// Sample Comprehensive Multi-Project Data for Cargas NGV
const PROJECTS_DATABASE: StationProjectOverview[] = [
  {
    id: 'proj-cargas-moushir',
    name: 'محطة كارجاس النموذجية المتكاملة - محور المشير طنطاوي (القاهرة الجديدة)',
    governorate: 'القاهرة',
    type: 'محطة تموين سريعة + مركز تحويل سيارات',
    kickoffDate: '2026-08-01',
    targetHandoverDate: '2026-12-15',
    overallActualProgress: 81,
    overallPlannedProgress: 83,
    totalApprovedBudgetEgp: 38500000,
    totalDisbursedBudgetEgp: 29850000,
    timelineHistory: [
      { period: 'الأسبوع 1 (أغسطس)', plannedCumulative: 15, actualCumulative: 15, monthlyTarget: 15, monthlyActual: 15 },
      { period: 'الأسبوع 2 (أغسطس)', plannedCumulative: 28, actualCumulative: 30, monthlyTarget: 13, monthlyActual: 15 },
      { period: 'الأسبوع 3 (أغسطس)', plannedCumulative: 42, actualCumulative: 44, monthlyTarget: 14, monthlyActual: 14 },
      { period: 'الأسبوع 4 (أغسطس)', plannedCumulative: 55, actualCumulative: 56, monthlyTarget: 13, monthlyActual: 12 },
      { period: 'الأسبوع 1 (سبتمبر)', plannedCumulative: 65, actualCumulative: 67, monthlyTarget: 10, monthlyActual: 11 },
      { period: 'الأسبوع 2 (سبتمبر)', plannedCumulative: 74, actualCumulative: 75, monthlyTarget: 9, monthlyActual: 8 },
      { period: 'الأسبوع 3 (سبتمبر)', plannedCumulative: 83, actualCumulative: 81, monthlyTarget: 9, monthlyActual: 6 },
      { period: 'الأسبوع 4 (سبتمبر)', plannedCumulative: 90, actualCumulative: 87, monthlyTarget: 7, monthlyActual: 6 },
      { period: 'أكتوبر (مستهدف)', plannedCumulative: 96, actualCumulative: 94, monthlyTarget: 6, monthlyActual: 7 },
      { period: 'نوفمبر (التسليم النهائي)', plannedCumulative: 100, actualCumulative: 100, monthlyTarget: 4, monthlyActual: 6 }
    ],
    departments: [
      {
        id: 'dept-projects',
        role: 'projects',
        departmentName: 'إدارة المشروعات والأعمال المدنية',
        shortName: 'المشروعات والمدني',
        managerName: 'م. تامر مصطفى',
        actualProgress: 86,
        plannedProgress: 88,
        variance: -2,
        spi: 0.98,
        status: 'on_track',
        approvedBudgetEgp: 13600000,
        disbursedBudgetEgp: 11300000,
        tasksCompleted: 9,
        tasksTotal: 11,
        startDate: '2026-08-01',
        targetEndDate: '2026-10-20',
        currentMilestone: 'إنهاء تجليد المظلة المعدنية Canopy وأرضيات الموزعات',
        correctiveAction: 'تكثيف وردية مسائية لإنهاء أعمال كلادينج المظلة قبل موعدها',
        performanceMetrics: { scheduleAdherence: 88, budgetEfficiency: 92, qualitySafety: 95, tasksPace: 85, responsiveness: 90 }
      },
      {
        id: 'dept-operations',
        role: 'operations',
        departmentName: 'إدارة التشغيل والمعدات والضواغط',
        shortName: 'التشغيل والمعدات',
        managerName: 'م. طارق عبد الخالق',
        actualProgress: 72,
        plannedProgress: 75,
        variance: -3,
        spi: 0.96,
        status: 'slight_delay',
        approvedBudgetEgp: 23000000,
        disbursedBudgetEgp: 17900000,
        tasksCompleted: 6,
        tasksTotal: 9,
        startDate: '2026-08-15',
        targetEndDate: '2026-10-30',
        currentMilestone: 'تثبيت الضاغط 1200 م³/ساعة وربط بطاريات الاسطوانات Cascades',
        correctiveAction: 'توجيه فريق فني إضافي لمعايرة الموزعات ومقاييس التدفق الكتلي',
        performanceMetrics: { scheduleAdherence: 82, budgetEfficiency: 88, qualitySafety: 94, tasksPace: 78, responsiveness: 85 }
      },
      {
        id: 'dept-hse',
        role: 'hse',
        departmentName: 'إدارة السلامة والصحة المهنية (HSE)',
        shortName: 'السلامة والأمن الصناعي',
        managerName: 'م. عصام فوزي',
        actualProgress: 64,
        plannedProgress: 60,
        variance: 4,
        spi: 1.07,
        status: 'ahead',
        approvedBudgetEgp: 7450000,
        disbursedBudgetEgp: 4900000,
        tasksCompleted: 5,
        tasksTotal: 7,
        startDate: '2026-08-20',
        targetEndDate: '2026-11-15',
        currentMilestone: 'اكتمال حوائط الصد Blast Walls وجاري سحب شبكة الإطفاء الآلية',
        correctiveAction: 'الجدول الزمني متقدم بنجاح والالتزام بمهمات الوقاية صفر حوادث',
        performanceMetrics: { scheduleAdherence: 96, budgetEfficiency: 90, qualitySafety: 98, tasksPace: 92, responsiveness: 95 }
      },
      {
        id: 'dept-technical',
        role: 'technical',
        departmentName: 'الإدارة الفنية ومحطات الغاز',
        shortName: 'الفنية والشبكات',
        managerName: 'م. أحمد عبد الفتاح',
        actualProgress: 90,
        plannedProgress: 92,
        variance: -2,
        spi: 0.98,
        status: 'on_track',
        approvedBudgetEgp: 4200000,
        disbursedBudgetEgp: 3850000,
        tasksCompleted: 7,
        tasksTotal: 8,
        startDate: '2026-08-05',
        targetEndDate: '2026-10-12',
        currentMilestone: 'اختبارات الضغط الهيدروستاتيكي لخط الغاز الصلب 4 بوصة',
        correctiveAction: 'بانتظار تصريح الربط النهائي مع غاز مصر Hot Tapping',
        performanceMetrics: { scheduleAdherence: 91, budgetEfficiency: 94, qualitySafety: 96, tasksPace: 90, responsiveness: 92 }
      },
      {
        id: 'dept-legal',
        role: 'legal',
        departmentName: 'الإدارة القانونية والتعاقدات',
        shortName: 'القانونية والتعاقدات',
        managerName: 'المستشار حازم الجمال',
        actualProgress: 100,
        plannedProgress: 100,
        variance: 0,
        spi: 1.00,
        status: 'on_track',
        approvedBudgetEgp: 2400000,
        disbursedBudgetEgp: 2400000,
        tasksCompleted: 5,
        tasksTotal: 5,
        startDate: '2026-07-15',
        targetEndDate: '2026-08-25',
        currentMilestone: 'تم توثيق عقد الشراكة وحق الانتفاع ورخصة البناء بالشهر العقاري',
        correctiveAction: 'المرحلة مكتملة بنجاح 100% طبقاً للمخطط الزمني الأصلي',
        performanceMetrics: { scheduleAdherence: 100, budgetEfficiency: 100, qualitySafety: 100, tasksPace: 100, responsiveness: 98 }
      },
      {
        id: 'dept-licensing',
        role: 'licensing',
        departmentName: 'إدارة التراخيص والموافقات الحكومية',
        shortName: 'التراخيص والموافقات',
        managerName: 'أ. أسامة رشدي',
        actualProgress: 88,
        plannedProgress: 85,
        variance: 3,
        spi: 1.04,
        status: 'ahead',
        approvedBudgetEgp: 1800000,
        disbursedBudgetEgp: 1600000,
        tasksCompleted: 6,
        tasksTotal: 7,
        startDate: '2026-07-20',
        targetEndDate: '2026-10-05',
        currentMilestone: 'استلام تصريح الحفر المعتمد وموافقة جهاز شؤون البيئة EEAA',
        correctiveAction: 'الموافقة النهائية للحماية المدنية مجدولة فور انتهاء تجارب الإطفاء',
        performanceMetrics: { scheduleAdherence: 94, budgetEfficiency: 93, qualitySafety: 95, tasksPace: 91, responsiveness: 90 }
      },
      {
        id: 'dept-financial',
        role: 'financial',
        departmentName: 'الإدارة المالية ودراسات الجدوى',
        shortName: 'المالية ودراسات الجدوى',
        managerName: 'أ. هاني سليم',
        actualProgress: 82,
        plannedProgress: 80,
        variance: 2,
        spi: 1.02,
        status: 'ahead',
        approvedBudgetEgp: 38500000,
        disbursedBudgetEgp: 29850000,
        tasksCompleted: 4,
        tasksTotal: 5,
        startDate: '2026-08-01',
        targetEndDate: '2026-11-30',
        currentMilestone: 'اعتماد المستخلص الجاري رقم 2 ومطابقة فروق الأسعار مع الموازنة',
        correctiveAction: 'نسبة الصرف 77.5% متوافقة مع مراحل الإنجاز الميداني بدون عجز',
        performanceMetrics: { scheduleAdherence: 95, budgetEfficiency: 98, qualitySafety: 97, tasksPace: 89, responsiveness: 94 }
      },
      {
        id: 'dept-marketing',
        role: 'marketing',
        departmentName: 'إدارة التسويق والدراسات الميدانية',
        shortName: 'التسويق والدراسات',
        managerName: 'أ. عادل نور الدين',
        actualProgress: 95,
        plannedProgress: 90,
        variance: 5,
        spi: 1.06,
        status: 'ahead',
        approvedBudgetEgp: 950000,
        disbursedBudgetEgp: 900000,
        tasksCompleted: 5,
        tasksTotal: 5,
        startDate: '2026-07-10',
        targetEndDate: '2026-09-15',
        currentMilestone: 'إتمام مسح الكثافة المرورية بالذكاء الاصطناعي وتحديد خطة الترويج',
        correctiveAction: 'تجهيز حملة الافتتاح وباقات تقسيط تحويل السيارات الترويجية',
        performanceMetrics: { scheduleAdherence: 98, budgetEfficiency: 96, qualitySafety: 94, tasksPace: 95, responsiveness: 96 }
      }
    ]
  },
  {
    id: 'proj-cargas-suez',
    name: 'محطة كارجاس السريعة - طريق السويس / مدخل الهايكستب',
    governorate: 'القاهرة',
    type: 'محطة غاز طبيعي سريعة لميكروباصات السفر والنقل',
    kickoffDate: '2026-07-15',
    targetHandoverDate: '2026-11-30',
    overallActualProgress: 88,
    overallPlannedProgress: 85,
    totalApprovedBudgetEgp: 29000000,
    totalDisbursedBudgetEgp: 24500000,
    timelineHistory: [
      { period: 'يوليو', plannedCumulative: 20, actualCumulative: 22, monthlyTarget: 20, monthlyActual: 22 },
      { period: 'أغسطس', plannedCumulative: 50, actualCumulative: 54, monthlyTarget: 30, monthlyActual: 32 },
      { period: 'سبتمبر', plannedCumulative: 85, actualCumulative: 88, monthlyTarget: 35, monthlyActual: 34 },
      { period: 'أكتوبر (مستهدف)', plannedCumulative: 96, actualCumulative: 95, monthlyTarget: 11, monthlyActual: 7 },
      { period: 'نوفمبر (التشغيل)', plannedCumulative: 100, actualCumulative: 100, monthlyTarget: 4, monthlyActual: 5 }
    ],
    departments: [
      {
        id: 'suez-proj',
        role: 'projects',
        departmentName: 'إدارة المشروعات والأعمال المدنية',
        shortName: 'المشروعات والمدني',
        managerName: 'م. أحمد الشربيني',
        actualProgress: 92,
        plannedProgress: 90,
        variance: 2,
        spi: 1.02,
        status: 'ahead',
        approvedBudgetEgp: 10500000,
        disbursedBudgetEgp: 9800000,
        tasksCompleted: 8,
        tasksTotal: 9,
        startDate: '2026-07-15',
        targetEndDate: '2026-10-15',
        currentMilestone: 'إتمام المظلة وأرضيات تموين النقل الجماعي',
        correctiveAction: 'تسليم الموقع للاختبارات التشغيلية',
        performanceMetrics: { scheduleAdherence: 95, budgetEfficiency: 94, qualitySafety: 96, tasksPace: 92, responsiveness: 94 }
      },
      {
        id: 'suez-ops',
        role: 'operations',
        departmentName: 'إدارة التشغيل والمعدات والضواغط',
        shortName: 'التشغيل والمعدات',
        managerName: 'م. سامح الجوهري',
        actualProgress: 85,
        plannedProgress: 82,
        variance: 3,
        spi: 1.04,
        status: 'ahead',
        approvedBudgetEgp: 14500000,
        disbursedBudgetEgp: 12200000,
        tasksCompleted: 6,
        tasksTotal: 7,
        startDate: '2026-08-01',
        targetEndDate: '2026-10-30',
        currentMilestone: 'تشغيل تجريبي للضاغط والموزعات',
        correctiveAction: 'جاهز لضخ الغاز',
        performanceMetrics: { scheduleAdherence: 92, budgetEfficiency: 90, qualitySafety: 95, tasksPace: 88, responsiveness: 90 }
      },
      {
        id: 'suez-hse',
        role: 'hse',
        departmentName: 'إدارة السلامة والصحة المهنية (HSE)',
        shortName: 'السلامة والأمن الصناعي',
        managerName: 'م. شريف سلامة',
        actualProgress: 80,
        plannedProgress: 78,
        variance: 2,
        spi: 1.03,
        status: 'ahead',
        approvedBudgetEgp: 4000000,
        disbursedBudgetEgp: 2500000,
        tasksCompleted: 4,
        tasksTotal: 5,
        startDate: '2026-08-10',
        targetEndDate: '2026-11-10',
        currentMilestone: 'اختبار منظومة الإغلاق ESD ومكافحة الحريق',
        correctiveAction: 'تجهيز رخصة الحماية المدنية',
        performanceMetrics: { scheduleAdherence: 90, budgetEfficiency: 88, qualitySafety: 97, tasksPace: 89, responsiveness: 92 }
      }
    ]
  },
  {
    id: 'proj-cargas-roubiki',
    name: 'محطة كارجاس الصناعية - مدينة الروبيكي للجلود (العاشر من رمضان)',
    governorate: 'الشرقية',
    type: 'محطة أساطيل صناعية ونقل شاحنات',
    kickoffDate: '2026-08-15',
    targetHandoverDate: '2026-12-30',
    overallActualProgress: 68,
    overallPlannedProgress: 72,
    totalApprovedBudgetEgp: 34000000,
    totalDisbursedBudgetEgp: 22100000,
    timelineHistory: [
      { period: 'أغسطس', plannedCumulative: 25, actualCumulative: 22, monthlyTarget: 25, monthlyActual: 22 },
      { period: 'سبتمبر', plannedCumulative: 72, actualCumulative: 68, monthlyTarget: 47, monthlyActual: 46 },
      { period: 'أكتوبر (مستهدف)', plannedCumulative: 88, actualCumulative: 85, monthlyTarget: 16, monthlyActual: 17 },
      { period: 'نوفمبر', plannedCumulative: 96, actualCumulative: 95, monthlyTarget: 8, monthlyActual: 10 },
      { period: 'ديسمبر (الافتتاح)', plannedCumulative: 100, actualCumulative: 100, monthlyTarget: 4, monthlyActual: 5 }
    ],
    departments: [
      {
        id: 'roubiki-proj',
        role: 'projects',
        departmentName: 'إدارة المشروعات والأعمال المدنية',
        shortName: 'المشروعات والمدني',
        managerName: 'م. إبراهيم رضوان',
        actualProgress: 70,
        plannedProgress: 75,
        variance: -5,
        spi: 0.93,
        status: 'slight_delay',
        approvedBudgetEgp: 12000000,
        disbursedBudgetEgp: 8500000,
        tasksCompleted: 5,
        tasksTotal: 8,
        startDate: '2026-08-15',
        targetEndDate: '2026-11-15',
        currentMilestone: 'صب القواعد المسلحة للضاغط العملاق 1500 م³/ساعة',
        correctiveAction: 'مضاعفة فرق العمل للتعويض عن تأخر حفر الصخور',
        performanceMetrics: { scheduleAdherence: 80, budgetEfficiency: 85, qualitySafety: 92, tasksPace: 75, responsiveness: 82 }
      },
      {
        id: 'roubiki-ops',
        role: 'operations',
        departmentName: 'إدارة التشغيل والمعدات والضواغط',
        shortName: 'التشغيل والمعدات',
        managerName: 'م. طارق عبد الخالق',
        actualProgress: 65,
        plannedProgress: 70,
        variance: -5,
        spi: 0.93,
        status: 'slight_delay',
        approvedBudgetEgp: 18000000,
        disbursedBudgetEgp: 11000000,
        tasksCompleted: 4,
        tasksTotal: 7,
        startDate: '2026-09-01',
        targetEndDate: '2026-11-30',
        currentMilestone: 'وصول بطاريات التخزين لموقع العاشر من رمضان',
        correctiveAction: 'التنسيق مع المورد لتسريع شحن لوحات التحكم',
        performanceMetrics: { scheduleAdherence: 78, budgetEfficiency: 82, qualitySafety: 90, tasksPace: 72, responsiveness: 80 }
      },
      {
        id: 'roubiki-hse',
        role: 'hse',
        departmentName: 'إدارة السلامة والصحة المهنية (HSE)',
        shortName: 'السلامة والأمن الصناعي',
        managerName: 'م. عصام فوزي',
        actualProgress: 68,
        plannedProgress: 68,
        variance: 0,
        spi: 1.00,
        status: 'on_track',
        approvedBudgetEgp: 4000000,
        disbursedBudgetEgp: 2600000,
        tasksCompleted: 3,
        tasksTotal: 4,
        startDate: '2026-09-05',
        targetEndDate: '2026-12-10',
        currentMilestone: 'مراجعة اشتراطات الأمان في البيئة الصناعية',
        correctiveAction: 'مطابقة خطط الإخلاء مع منطقة المصانع',
        performanceMetrics: { scheduleAdherence: 88, budgetEfficiency: 90, qualitySafety: 94, tasksPace: 85, responsiveness: 88 }
      }
    ]
  }
];

export const AdminProjectExecutionDashboard: React.FC<AdminProjectExecutionDashboardProps> = ({
  onPreviewDepartment
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ahead' | 'on_track' | 'slight_delay' | 'delayed'>('all');
  const [chartViewMode, setChartViewMode] = useState<'comparison' | 'timeline' | 'radar' | 'financial'>('comparison');

  // Active Project or Combined Portfolio
  const activeProject = useMemo(() => {
    if (selectedProjectId === 'all') {
      // Aggregate Portfolio
      const primary = PROJECTS_DATABASE[0];
      return {
        id: 'all',
        name: 'كافة مشروعات ومحطات كارجاس الجارية (المحفظة الاستثمارية الشاملة)',
        governorate: 'على مستوى الجمهورية',
        type: 'محطات متكاملة + مراكز تحويل + محطات سريعة',
        kickoffDate: '2026-07-15',
        targetHandoverDate: '2026-12-30',
        overallActualProgress: 80,
        overallPlannedProgress: 81,
        totalApprovedBudgetEgp: PROJECTS_DATABASE.reduce((sum, p) => sum + p.totalApprovedBudgetEgp, 0),
        totalDisbursedBudgetEgp: PROJECTS_DATABASE.reduce((sum, p) => sum + p.totalDisbursedBudgetEgp, 0),
        departments: primary.departments,
        timelineHistory: primary.timelineHistory
      };
    }
    return PROJECTS_DATABASE.find(p => p.id === selectedProjectId) || PROJECTS_DATABASE[0];
  }, [selectedProjectId]);

  // Filtered Departments
  const filteredDepartments = useMemo(() => {
    if (statusFilter === 'all') return activeProject.departments;
    return activeProject.departments.filter(d => d.status === statusFilter);
  }, [activeProject, statusFilter]);

  // Statistics KPI calculations
  const totalDepts = activeProject.departments.length;
  const aheadDepts = activeProject.departments.filter(d => d.variance > 0).length;
  const onTrackDepts = activeProject.departments.filter(d => d.variance === 0 || (d.variance >= -2 && d.variance < 0)).length;
  const delayedDepts = activeProject.departments.filter(d => d.variance < -2).length;
  const avgSpi = (activeProject.departments.reduce((sum, d) => sum + d.spi, 0) / (totalDepts || 1)).toFixed(2);
  const disbursementPercent = Math.round((activeProject.totalDisbursedBudgetEgp / (activeProject.totalApprovedBudgetEgp || 1)) * 100);

  // Status Distribution Pie Data
  const statusPieData = useMemo(() => {
    return [
      { name: 'متقدم عن الجدول', value: aheadDepts, color: '#10b981' },
      { name: 'في الموعد المقبول', value: onTrackDepts, color: '#3b82f6' },
      { name: 'تأخير طفيف مع تدارك', value: delayedDepts, color: '#f59e0b' }
    ].filter(item => item.value > 0);
  }, [aheadDepts, onTrackDepts, delayedDepts]);

  // Radar Chart Multi-Performance Data
  const radarData = useMemo(() => {
    return [
      {
        subject: 'الالتزام بالجدول الزمني',
        'الفعلي': Math.round(activeProject.departments.reduce((acc, d) => acc + d.performanceMetrics.scheduleAdherence, 0) / totalDepts),
        'المستهدف المخطط': 95,
        fullMark: 100
      },
      {
        subject: 'كفاءة ضبط الميزانية',
        'الفعلي': Math.round(activeProject.departments.reduce((acc, d) => acc + d.performanceMetrics.budgetEfficiency, 0) / totalDepts),
        'المستهدف المخطط': 90,
        fullMark: 100
      },
      {
        subject: 'معايير الأمان والجودة',
        'الفعلي': Math.round(activeProject.departments.reduce((acc, d) => acc + d.performanceMetrics.qualitySafety, 0) / totalDepts),
        'المستهدف المخطط': 100,
        fullMark: 100
      },
      {
        subject: 'معدل إنجاز المهام',
        'الفعلي': Math.round(activeProject.departments.reduce((acc, d) => acc + d.performanceMetrics.tasksPace, 0) / totalDepts),
        'المستهدف المخطط': 90,
        fullMark: 100
      },
      {
        subject: 'سرعة الاستجابة والملاحظات',
        'الفعلي': Math.round(activeProject.departments.reduce((acc, d) => acc + d.performanceMetrics.responsiveness, 0) / totalDepts),
        'المستهدف المخطط': 92,
        fullMark: 100
      }
    ];
  }, [activeProject, totalDepts]);

  // Financial Stacked Comparison Data
  const financialChartData = useMemo(() => {
    return activeProject.departments.map(d => ({
      name: d.shortName,
      'المنصرف المعتمد (مليون ج.م)': Number((d.disbursedBudgetEgp / 1000000).toFixed(2)),
      'المتبقي من الموازنة (مليون ج.م)': Number(((d.approvedBudgetEgp - d.disbursedBudgetEgp) / 1000000).toFixed(2)),
      'إجمالي الموازنة': Number((d.approvedBudgetEgp / 1000000).toFixed(2))
    }));
  }, [activeProject]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="admin-pmo-dashboard" className="space-y-6 text-right" dir="rtl">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER & PROJECT SELECTOR BAR                            */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" />
                مكتب إدارة المشروعات المركزي PMO
              </span>
              <span className="text-xs text-slate-400">تحديث فوري لنسب الإنجاز والجداول الزمنية</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <LayoutDashboard className="w-6 h-6 text-blue-400 shrink-0" />
              <span>لوحة مؤشرات إنجاز الإدارات مقارنة بالجدول الزمني المخطط للمشاريع</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              منظومة الرصد البياني الدقيق لمقارنة معدلات التنفيذ الفعلي على أرض الواقع مع المخطط الزمني المعتمد لكافة إدارات شركة كارجاس (المشروعات، التشغيل، السلامة، الفنية، القانونية، المالية، التراخيص، التسويق).
            </p>
          </div>

          {/* Project Switcher Dropdown & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-initial min-w-[260px]">
              <label className="block text-[11px] font-bold text-slate-300 mb-1">المشروع / الموقع المعني:</label>
              <select
                id="select-pmo-project"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 focus:border-blue-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-medium focus:outline-none transition-colors"
              >
                <option value="all">🌐 كافة مشروعات ومحطات كارجاس (المحفظة الشاملة)</option>
                {PROJECTS_DATABASE.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <button
                id="btn-print-pmo-dashboard"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition-colors cursor-pointer"
                title="طباعة أو تصدير تقرير الإنجاز"
              >
                <Printer className="w-3.5 h-3.5 text-blue-400" />
                <span>طباعة</span>
              </button>
            </div>
          </div>
        </div>

        {/* Selected Project Quick Tags */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>المحافظة: <strong className="text-white">{activeProject.governorate}</strong></span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>النمط: <strong className="text-white">{activeProject.type}</strong></span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>الجدول الزمني: <strong className="text-white">{activeProject.kickoffDate}</strong> إلى <strong className="text-white">{activeProject.targetHandoverDate}</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
              مؤشر كفاءة الجدول SPI: <strong>{avgSpi}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. TOP METRIC CARDS (KPI HIGHLIGHTS)                            */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Overall Progress vs Target */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-400 text-xs font-medium block">متوسط الإنجاز الفعلي الإجمالي</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-emerald-400 font-mono">
                  {activeProject.overallActualProgress}%
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  من المستهدف ({activeProject.overallPlannedProgress}%)
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          {/* Progress Bar comparison */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>الفعلي: {activeProject.overallActualProgress}%</span>
              <span>المخطط: {activeProject.overallPlannedProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${activeProject.overallActualProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 2: Schedule Performance Index (SPI) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-400 text-xs font-medium block">مؤشر كفاءة الجدول الزمني (SPI)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-3xl font-black font-mono ${Number(avgSpi) >= 1.0 ? 'text-emerald-400' : Number(avgSpi) >= 0.95 ? 'text-blue-400' : 'text-amber-400'}`}>
                  {avgSpi}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {Number(avgSpi) >= 1.0 ? 'متقدم/منضبط' : Number(avgSpi) >= 0.95 ? 'في الموعد المقبول' : 'يحتاج تسريع'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2.5">
            النسبة بين القيمة المكتملة والمخططة (SPI = Actual / Planned). قيمة 1.0 تعني مطابقة تامة للخطة الزمنية.
          </p>
        </div>

        {/* Metric 3: Departments On-Track Ratio */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-400 text-xs font-medium block">التزام الإدارات بالجدول الزمني</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-blue-400 font-mono">
                  {aheadDepts + onTrackDepts} / {totalDepts}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  إدارة منضبطة
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-[11px]">
            <span className="text-emerald-400 font-bold">{aheadDepts} متقدمة</span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-400 font-bold">{onTrackDepts} في الموعد</span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-bold">{delayedDepts} تأخير طفيف</span>
          </div>
        </div>

        {/* Metric 4: Financial Disbursement Progress */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4.5 relative overflow-hidden shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-slate-400 text-xs font-medium block">المصروف الفعلي للموازنة المعتمدة</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {(activeProject.totalDisbursedBudgetEgp / 1000000).toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  من {(activeProject.totalApprovedBudgetEgp / 1000000).toFixed(1)} مليون ج.م
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>نسبة الصرف المالي: {disbursementPercent}%</span>
              <span>الوفر المحقق: ~3.2%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${disbursementPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 3. CHART VIEW CONTROLS & SUB-NAV TABS                           */}
      {/* ============================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="tab-chart-comparison"
            onClick={() => setChartViewMode('comparison')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              chartViewMode === 'comparison'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>مقارنة الإنجاز الفعلي مقابل المخطط (أعمدة بيانية)</span>
          </button>

          <button
            id="tab-chart-timeline"
            onClick={() => setChartViewMode('timeline')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              chartViewMode === 'timeline'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>منحنى المسار الزمني للمشروع (S-Curve)</span>
          </button>

          <button
            id="tab-chart-radar"
            onClick={() => setChartViewMode('radar')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              chartViewMode === 'radar'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>مخطط الرادار لأداء الإدارات المتعدد</span>
          </button>

          <button
            id="tab-chart-financial"
            onClick={() => setChartViewMode('financial')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              chartViewMode === 'financial'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>الموقف المالي وصرف المستخلصات</span>
          </button>
        </div>

        {/* Filter by Department Status */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">تصفية الإدارات:</span>
          <select
            id="filter-dept-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
          >
            <option value="all">كافة الإدارات ({totalDepts})</option>
            <option value="ahead">متقدمة عن الجدول ({aheadDepts})</option>
            <option value="on_track">في الموعد المقبول ({onTrackDepts})</option>
            <option value="slight_delay">تأخير طفيف مع تدارك ({delayedDepts})</option>
          </select>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MAIN CHARTS DISPLAY (RECHARTS INTEGRATION)                   */}
      {/* ============================================================== */}

      {/* VIEW 1: COMPARISON BARCHART (ACTUAL vs PLANNED SCHEDULE) */}
      {chartViewMode === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Composed Bar & Line Chart (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span>مقارنة نسب الإنجاز الفعلي مقابل الجدول الزمني المخطط لكل إدارة</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  توضح الأعمدة الخضراء نسبة الإنجاز الفعلي الموثقة ميدانياً، بينما توضح الأعمدة البنفسجية الخطة الزمنية المعتمدة
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                  <span>الفعلي %</span>
                </span>
                <span className="flex items-center gap-1 text-indigo-400 font-bold">
                  <span className="w-3 h-3 rounded bg-indigo-500 inline-block"></span>
                  <span>المخطط %</span>
                </span>
              </div>
            </div>

            <div className="h-84 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={filteredDepartments}
                  margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                  <XAxis
                    dataKey="shortName"
                    stroke="#94a3b8"
                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      direction: 'rtl',
                      textAlign: 'right',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    }}
                    formatter={(val: any, name: any) => {
                      if (name === 'actualProgress') return [`${val}%`, 'نسبة الإنجاز الفعلي على الطبيعة'];
                      if (name === 'plannedProgress') return [`${val}%`, 'المخطط الزمني المستهدف'];
                      return [val, name];
                    }}
                    labelFormatter={(label: any) => `الإدارة: ${label}`}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    formatter={(value) => {
                      if (value === 'actualProgress') return 'نسبة الإنجاز الفعلي %';
                      if (value === 'plannedProgress') return 'الجدول الزمني المخطط %';
                      return value;
                    }}
                  />
                  <Bar
                    dataKey="actualProgress"
                    name="actualProgress"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="plannedProgress"
                    name="plannedProgress"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Breakdown & Variance Gauge (1 Col) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                <PieChartIcon className="w-5 h-5 text-emerald-400" />
                <span>توزيع التزام الإدارات بالجدول</span>
              </h2>
              <p className="text-xs text-slate-400 mb-3">
                تصنيف إدارات المشروع طبقاً لنسبة الانحراف الزمني
              </p>

              <div className="h-52 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '10px',
                        color: '#f8fafc',
                        direction: 'rtl'
                      }}
                      formatter={(val: any, name: any) => [`${val} إدارة`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Status Legend Pills */}
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>متقدمة عن الخطة (+Variance)</span>
                  </span>
                  <strong className="font-mono">{aheadDepts} إدارة</strong>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>في الموعد تماماً (0 إلى -2%)</span>
                  </span>
                  <strong className="font-mono">{onTrackDepts} إدارة</strong>
                </div>
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>تأخير طفيف مع خطة تدارك</span>
                  </span>
                  <strong className="font-mono">{delayedDepts} إدارة</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
              كافة الأعمال تحت إشراف وتدقيق الإدارة العليا لكارجاس
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: S-CURVE PROJECT TIMELINE (AREACHART) */}
      {chartViewMode === 'timeline' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-400" />
                <span>منحنى مسار المشروع التراكمي (Project Cumulative S-Curve)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                تتبع مسار الإنجاز التراكمي أسبوعياً ومقارنته بالخطة الزمنية المستهدفة حتى موعد إطلاق الغاز والتشغيل التجاري
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                <span>الفعلي التراكمي %</span>
              </span>
              <span className="flex items-center gap-1 text-blue-400 font-bold">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span>
                <span>المخطط التراكمي %</span>
              </span>
            </div>
          </div>

          <div className="h-88 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeProject.timelineHistory}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="plannedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis
                  dataKey="period"
                  stroke="#94a3b8"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  domain={[0, 100]}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                  formatter={(val: any, name: any) => {
                    if (name === 'actualCumulative') return [`${val}%`, 'نسبة الإنجاز التراكمي الفعلي'];
                    if (name === 'plannedCumulative') return [`${val}%`, 'النسبة التراكمية المخططة'];
                    return [val, name];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  formatter={(value) => {
                    if (value === 'actualCumulative') return 'الفعلي التراكمي %';
                    if (value === 'plannedCumulative') return 'المخطط التراكمي %';
                    return value;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="plannedCumulative"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#plannedGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="actualCumulative"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#actualGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* VIEW 3: RADAR CHART (MULTI-DIMENSIONAL PERFORMANCE) */}
      {chartViewMode === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Activity className="w-5 h-5 text-purple-400" />
              <span>مخطط الرادار التقييمي للأداء الإداري والتشغيلي</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              مقارنة جودة الأداء الميداني عبر 5 محاور هندسية وإدارية رئيسية
            </p>

            <div className="h-80 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius={95}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar name="الفعلي المحقق" dataKey="الفعلي" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  <Radar name="المستهدف المعتمد" dataKey="المستهدف المخطط" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                  <Legend verticalAlign="top" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      direction: 'rtl'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>مؤشرات الجودة والامتثال لمعايير كارجاس</span>
              </h2>
              <div className="space-y-3 mt-4">
                {radarData.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-bold text-white">{item.subject}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-emerald-400 font-bold">الفعلي: {item['الفعلي']}%</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-400">المستهدف: {item['المستهدف المخطط']}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item['الفعلي']}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs mt-4">
              <strong>ملاحظة الجودة:</strong> جميع اختبارات الضغط الهيدروستاتيكي وتجارب أمان الحريق مسجلة وموثقة في سجل الأنشطة الميداني للمنظومة.
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: FINANCIAL STACKED EXPENDITURE CHART */}
      {chartViewMode === 'financial' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>توزيع الموازنة المعتمدة والمصروفات الفعلية حسب الإدارات (مليون جنيه مصري)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                مقارنة المبالغ المنصرفة للمقاولين والموردين مع المتبقي في ميزانية كل إدارة بالمشروع
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <span className="w-3 h-3 rounded bg-amber-500 inline-block"></span>
                <span>المنصرف المعتمد</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400 font-bold">
                <span className="w-3 h-3 rounded bg-slate-700 inline-block"></span>
                <span>المتبقي من الموازنة</span>
              </span>
            </div>
          </div>

          <div className="h-88 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialChartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  unit=" M"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                  formatter={(val: any, name: any) => [`${val} مليون ج.م`, name]}
                />
                <Legend verticalAlign="top" align="right" />
                <Bar
                  dataKey="المنصرف المعتمد (مليون ج.م)"
                  stackId="a"
                  fill="#f59e0b"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="المتبقي من الموازنة (مليون ج.م)"
                  stackId="a"
                  fill="#334155"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. DETAILED DEPARTMENTS PROGRESS & SCHEDULE TABLE              */}
      {/* ============================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>جدول المتابعة التفصيلي لإدارات المشروع ومؤشرات الانحراف الزمني</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              بيانات رقمية حية لكل إدارة: المهام المكتملة، التواريخ المحددة، نسبة الانحراف، والإجراء التصحيحي المعتمد
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono">
            عدد الإدارات المعروضة: <strong>{filteredDepartments.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700/80 bg-slate-800/60 text-slate-300 font-bold">
                <th className="p-3 text-right">الإدارة والمسؤول</th>
                <th className="p-3 text-center">المهام المنجزة</th>
                <th className="p-3 text-center">المدى الزمني</th>
                <th className="p-3 text-center">الفعلي %</th>
                <th className="p-3 text-center">المخطط %</th>
                <th className="p-3 text-center">الانحراف (Variance)</th>
                <th className="p-3 text-center">كفاءة الجدول (SPI)</th>
                <th className="p-3 text-center">الحالة</th>
                <th className="p-3 text-right">الموقف والإجراء المعتمد</th>
                <th className="p-3 text-center">الإجراء والمتابعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredDepartments.map((dept) => {
                const isAhead = dept.variance > 0;
                const isDelayed = dept.variance < -2;
                const isOnTrack = !isAhead && !isDelayed;

                return (
                  <tr key={dept.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Dept Name & Manager */}
                    <td className="p-3">
                      <div className="font-bold text-white text-sm">{dept.departmentName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <HardHat className="w-3 h-3 text-blue-400" />
                        <span>{dept.managerName}</span>
                      </div>
                    </td>

                    {/* Tasks Completed */}
                    <td className="p-3 text-center">
                      <span className="px-2 py-1 rounded bg-slate-800 font-mono font-bold text-slate-200">
                        {dept.tasksCompleted} / {dept.tasksTotal}
                      </span>
                    </td>

                    {/* Timeline Dates */}
                    <td className="p-3 text-center text-[11px] font-mono text-slate-400 whitespace-nowrap">
                      <div>من: {dept.startDate}</div>
                      <div>إلى: {dept.targetEndDate}</div>
                    </td>

                    {/* Actual Progress Bar */}
                    <td className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono font-bold text-emerald-400 text-sm">
                          {dept.actualProgress}%
                        </span>
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${dept.actualProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Planned Schedule Target */}
                    <td className="p-3 text-center">
                      <span className="font-mono font-bold text-indigo-300 text-sm">
                        {dept.plannedProgress}%
                      </span>
                    </td>

                    {/* Variance (+ / -) */}
                    <td className="p-3 text-center font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs ${
                          isAhead
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isDelayed
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {isAhead ? (
                          <>
                            <TrendingUp className="w-3 h-3" />
                            <span>+{dept.variance}%</span>
                          </>
                        ) : dept.variance < 0 ? (
                          <>
                            <TrendingDown className="w-3 h-3" />
                            <span>{dept.variance}%</span>
                          </>
                        ) : (
                          <span>0%</span>
                        )}
                      </span>
                    </td>

                    {/* SPI Indicator */}
                    <td className="p-3 text-center font-mono font-bold">
                      <span className={`text-xs ${dept.spi >= 1.0 ? 'text-emerald-400' : dept.spi >= 0.95 ? 'text-blue-400' : 'text-amber-400'}`}>
                        {dept.spi.toFixed(2)}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3 text-center">
                      {isAhead && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px]">
                          متقدم
                        </span>
                      )}
                      {isOnTrack && (
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold text-[11px]">
                          في الموعد
                        </span>
                      )}
                      {isDelayed && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[11px]">
                          تأخير طفيف
                        </span>
                      )}
                    </td>

                    {/* Current Milestone & Action */}
                    <td className="p-3 max-w-xs">
                      <div className="text-[11px] font-medium text-slate-300 leading-relaxed">
                        {dept.currentMilestone}
                      </div>
                      {dept.correctiveAction && (
                        <div className="text-[10px] text-blue-300 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 shrink-0 text-blue-400" />
                          <span>{dept.correctiveAction}</span>
                        </div>
                      )}
                    </td>

                    {/* Department Quick Preview Action */}
                    <td className="p-3 text-center">
                      {onPreviewDepartment ? (
                        <button
                          onClick={() => onPreviewDepartment(dept.role)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all hover:scale-105 cursor-pointer shadow-sm"
                          title={`معاينة وتدقيق استمارات ومهام ${dept.departmentName}`}
                        >
                          <ExternalLink className="w-3 h-3 text-emerald-400" />
                          <span>معاينة الإدارة</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">مفعل</span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
