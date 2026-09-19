import React, { useState, useMemo } from 'react';
import {
  Building2,
  ShieldCheck,
  Wrench,
  Scale,
  DollarSign,
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Printer,
  Download,
  Flame,
  Zap,
  MapPin,
  Check,
  AlertCircle,
  FileText,
  Sliders,
  TrendingUp,
  Activity,
  Layers,
  HelpCircle,
  Info,
  HardHat,
  ArrowRight,
  Paperclip,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { 
  MonitoringSession, 
  DepartmentReview, 
  DepartmentType, 
  DepartmentCustomField, 
  SafetyZoningRequirement, 
  CustomFeasibilityIndicator,
  ExecutiveSiteRecommendation,
  CustomCostItem,
  DepartmentReviewAttachment,
  DepartmentReviewDecision
} from '../types';
import { 
  getDefaultDepartmentReviews, 
  DEFAULT_SAFETY_ZONING, 
  DEFAULT_CUSTOM_INDICATORS, 
  computeOverallRecommendation 
} from '../data/departmentData';
import { CargasNgvLogo } from './CargasNgvLogo';
import { DepartmentAttachmentsManager } from './DepartmentAttachmentsManager';

interface DepartmentReviewsWorkflowProps {
  session: MonitoringSession;
  onUpdateSession: (updatedSession: MonitoringSession) => void;
  onNavigateToFeasibility?: () => void;
  onNavigateToDepartments?: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToExecution?: () => void;
}

export const DepartmentReviewsWorkflow: React.FC<DepartmentReviewsWorkflowProps> = ({
  session,
  onUpdateSession,
  onNavigateToFeasibility,
  onNavigateToAdmin,
  onNavigateToExecution
}) => {
  // Active Department Tab
  const [activeDept, setActiveDept] = useState<DepartmentType | 'recommendation'>('projects');

  // Load or initialize reviews from session
  const reviews = useMemo(() => {
    return session.departmentReviews || getDefaultDepartmentReviews(session.code);
  }, [session.departmentReviews, session.code]);

  // Safety Zoning Requirements
  const safetyZoning = useMemo(() => {
    return session.safetyZoning || DEFAULT_SAFETY_ZONING;
  }, [session.safetyZoning]);

  // Custom Indicators
  const customIndicators = useMemo(() => {
    return session.customIndicators || DEFAULT_CUSTOM_INDICATORS;
  }, [session.customIndicators]);

  // Modals / State for adding new custom field
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<'number' | 'text' | 'select' | 'boolean'>('number');
  const [newFieldValue, setNewFieldValue] = useState<string>('0');
  const [newFieldUnit, setNewFieldUnit] = useState('ج.م');
  const [newFieldImpactsCapex, setNewFieldImpactsCapex] = useState(true);
  const [newFieldNotes, setNewFieldNotes] = useState('');

  // Modals / State for adding custom feasibility indicator
  const [isAddingIndicator, setIsAddingIndicator] = useState(false);
  const [newIndName, setNewIndName] = useState('');
  const [newIndCategory, setNewIndCategory] = useState<'financial' | 'technical' | 'operational' | 'safety'>('financial');
  const [newIndValue, setNewIndValue] = useState<number | string>(0);
  const [newIndUnit, setNewIndUnit] = useState('%');
  const [newIndBenchmark, setNewIndBenchmark] = useState('');
  const [newIndDesc, setNewIndDesc] = useState('');

  // Financial Auditor inline editing state (for correcting project costs and assumptions)
  const [isAuditorEditingCosts, setIsAuditorEditingCosts] = useState(false);
  const [auditorCorrectionNote, setAuditorCorrectionNote] = useState('');
  const [auditorCostDraft, setAuditorCostDraft] = useState({
    civilCostEgp: reviews.projects?.costEstimates?.civilCostEgp ?? 3800000,
    pipelineCostEgp: reviews.operations?.costEstimates?.pipelineCostEgp ?? 2200000,
    compressorCostEgp: reviews.projects?.costEstimates?.compressorCostEgp ?? 6500000,
    electricalCostEgp: reviews.projects?.costEstimates?.electricalCostEgp ?? 1350000,
    safetyCostEgp: reviews.hse?.costEstimates?.safetyEquipmentCostEgp ?? 900000,
  });

  // Dynamic CAPEX calculation considering custom fields from Projects, Operations & HSE
  const dynamicCapexSummary = useMemo(() => {
    let baseCapex = 18500000; // Base baseline
    
    // Add estimates from projects
    if (reviews.projects?.costEstimates) {
      const p = reviews.projects.costEstimates;
      baseCapex = (p.civilCostEgp || 0) + 
                  (p.electricalCostEgp || 0) + 
                  (p.excavationCostEgp || 0) + 
                  (p.pipelineCostEgp || 0) + 
                  (p.compressorCostEgp || 0) + 
                  (p.dispenserCostEgp || 0) + 
                  (p.safetyEquipmentCostEgp || 0);
    }

    // Add additional custom Capex amounts added by departments
    let customCapexTotal = 0;
    Object.values(reviews).forEach(rev => {
      rev.customFields?.forEach(f => {
        if (f.impactsCapex && f.capexAmount) {
          customCapexTotal += Number(f.capexAmount);
        }
      });
    });

    return {
      baseCapex,
      customCapexTotal,
      totalCapex: baseCapex + customCapexTotal
    };
  }, [reviews]);

  // Quick Financial Indicators based on dynamic Capex
  const calculatedFinancials = useMemo(() => {
    const totalCapex = dynamicCapexSummary.totalCapex;
    const annualGrossProfit = 7850000; // Expected average from vehicle traffic
    const annualOpex = 2850000 + (reviews.legal?.legalReview?.annualLeaseCostEgp || 480000);
    const annualNetCashFlow = annualGrossProfit - annualOpex;
    const paybackYears = Number((totalCapex / Math.max(annualNetCashFlow, 1)).toFixed(2));
    const roi = Number(((annualNetCashFlow / Math.max(totalCapex, 1)) * 100).toFixed(1));
    const npv = Math.round(annualNetCashFlow * 5.216 - totalCapex); // 10 years at 14% discount
    const irr = Number(Math.max(8, Math.min(48, (annualNetCashFlow / totalCapex) * 100 * 0.95)).toFixed(1));

    return {
      totalCapex,
      annualOpex,
      annualNetCashFlow,
      paybackYears,
      roi,
      npv,
      irr
    };
  }, [dynamicCapexSummary, reviews]);

  // Overall Recommendation
  const overallRecommendation: ExecutiveSiteRecommendation = useMemo(() => {
    return computeOverallRecommendation(reviews, calculatedFinancials, safetyZoning);
  }, [reviews, calculatedFinancials, safetyZoning]);

  // Aggregate all attachments uploaded across all departments
  const allDepartmentAttachments = useMemo(() => {
    const list: Array<{
      departmentKey: DepartmentType;
      departmentName: string;
      attachment: DepartmentReviewAttachment;
    }> = [];

    const depts: Array<{ key: DepartmentType; name: string }> = [
      { key: 'projects', name: 'قطاع المشروعات والأعمال المدنية' },
      { key: 'hse', name: 'إدارة السلامة والصحة المهنية (HSE)' },
      { key: 'operations', name: 'قطاع العمليات والشبكات والمعدات' },
      { key: 'legal', name: 'الإدارة العامة للشؤون القانونية' },
      { key: 'financial', name: 'المراجعة والتدقيق المالي' },
    ];

    depts.forEach(d => {
      const atts = reviews[d.key]?.attachments || [];
      atts.forEach(att => {
        list.push({
          departmentKey: d.key,
          departmentName: d.name,
          attachment: att
        });
      });
    });

    return list;
  }, [reviews]);

  // --------------------------------------------------------------------------
  // HANDLERS FOR UPDATING REVIEWS
  // --------------------------------------------------------------------------
  const updateDepartmentReview = (dept: DepartmentType, updatedReview: Partial<DepartmentReview>) => {
    const current = reviews[dept] || getDefaultDepartmentReviews(session.code)[dept];
    const newReviews = {
      ...reviews,
      [dept]: {
        ...current,
        ...updatedReview,
        reviewDate: new Date().toISOString().split('T')[0]
      }
    };

    onUpdateSession({
      ...session,
      departmentReviews: newReviews
    });
  };

  // Add a new custom field to the active department
  const handleAddCustomField = () => {
    if (!newFieldLabel.trim()) return;
    if (activeDept === 'recommendation') return;
    const dept = activeDept;

    const currentReview = reviews[dept];
    const newField: DepartmentCustomField = {
      id: `field-${dept}-${Date.now()}`,
      department: dept,
      label: newFieldLabel.trim(),
      fieldType: newFieldType,
      value: newFieldType === 'number' ? Number(newFieldValue) || 0 : newFieldValue,
      unit: newFieldUnit.trim() || undefined,
      impactsCapex: newFieldImpactsCapex,
      capexAmount: newFieldImpactsCapex && newFieldType === 'number' ? Number(newFieldValue) || 0 : undefined,
      notes: newFieldNotes.trim() || undefined
    };

    const updatedFields = [...(currentReview.customFields || []), newField];
    updateDepartmentReview(dept, { customFields: updatedFields });

    // Reset modal form
    setNewFieldLabel('');
    setNewFieldValue('0');
    setNewFieldNotes('');
    setIsAddingField(false);
  };

  // Remove a custom field
  const handleRemoveCustomField = (fieldId: string) => {
    if (activeDept === 'recommendation') return;
    const dept = activeDept;
    const currentReview = reviews[dept];
    const updatedFields = (currentReview.customFields || []).filter(f => f.id !== fieldId);
    updateDepartmentReview(dept, { customFields: updatedFields });
  };

  // Update a custom field's value directly
  const handleFieldChange = (fieldId: string, newValue: any) => {
    if (activeDept === 'recommendation') return;
    const dept = activeDept;
    const currentReview = reviews[dept];
    const updatedFields = (currentReview.customFields || []).map(f => {
      if (f.id === fieldId) {
        const isNum = f.fieldType === 'number';
        const parsedVal = isNum ? Number(newValue) || 0 : newValue;
        return {
          ...f,
          value: parsedVal,
          capexAmount: f.impactsCapex && isNum ? Number(parsedVal) : f.capexAmount
        };
      }
      return f;
    });
    updateDepartmentReview(dept, { customFields: updatedFields });
  };

  // Save Auditor corrections to project costs
  const handleSaveAuditorCorrections = () => {
    const updatedProjects = {
      ...reviews.projects,
      costEstimates: {
        ...reviews.projects.costEstimates,
        civilCostEgp: Number(auditorCostDraft.civilCostEgp),
        electricalCostEgp: Number(auditorCostDraft.electricalCostEgp),
        compressorCostEgp: Number(auditorCostDraft.compressorCostEgp)
      }
    };

    const updatedOperations = {
      ...reviews.operations,
      costEstimates: {
        ...reviews.operations?.costEstimates,
        pipelineCostEgp: Number(auditorCostDraft.pipelineCostEgp)
      }
    };

    const currentFinancial = reviews.financial;
    const correctionLog = [
      ...(currentFinancial?.financialAudit?.correctionLog || []),
      {
        parameter: 'تعديل وتدقيق تكاليف المشروعات وخط الغاز والضاغط',
        originalValue: dynamicCapexSummary.baseCapex,
        correctedValue: Number(auditorCostDraft.civilCostEgp) + Number(auditorCostDraft.electricalCostEgp) + Number(auditorCostDraft.compressorCostEgp) + Number(auditorCostDraft.pipelineCostEgp),
        reason: auditorCorrectionNote || 'مراجعة وتدقيق معتمد من الإدارة المالية'
      }
    ];

    const updatedFinancial: DepartmentReview = {
      ...currentFinancial,
      decision: 'approved',
      financialAudit: {
        ...currentFinancial?.financialAudit,
        totalCapexAudited: dynamicCapexSummary.totalCapex,
        annualOpexAudited: calculatedFinancials.annualOpex,
        npvAudited: calculatedFinancials.npv,
        irrAuditedPercent: calculatedFinancials.irr,
        paybackYearsAudited: calculatedFinancials.paybackYears,
        roiAuditedPercent: calculatedFinancials.roi,
        auditStatus: 'approved',
        auditorNotes: auditorCorrectionNote || 'تم تدقيق التكاليف واعتماد دراسة الجدوى بعد تصحيح البنود الهندسية والتشغيلية.',
        identifiedErrors: [],
        correctionLog
      }
    };

    const newReviews = {
      ...reviews,
      projects: updatedProjects,
      operations: updatedOperations,
      financial: updatedFinancial
    };

    onUpdateSession({
      ...session,
      departmentReviews: newReviews
    });

    setIsAuditorEditingCosts(false);
  };

  // Add custom indicator
  const handleAddCustomIndicator = () => {
    if (!newIndName.trim()) return;
    const newIndicator: CustomFeasibilityIndicator = {
      id: `ind-${Date.now()}`,
      name: newIndName.trim(),
      category: newIndCategory,
      value: newIndCategory === 'financial' || newIndCategory === 'operational' ? Number(newIndValue) || 0 : newIndValue,
      unit: newIndUnit.trim(),
      targetBenchmark: newIndBenchmark.trim() || undefined,
      description: newIndDesc.trim() || 'مؤشر مخصص مضاف من فريق العمل',
      status: 'compliant'
    };

    const updated = [...customIndicators, newIndicator];
    onUpdateSession({
      ...session,
      customIndicators: updated
    });

    setNewIndName('');
    setIsAddingIndicator(false);
  };

  // Remove custom indicator
  const handleRemoveIndicator = (id: string) => {
    const updated = customIndicators.filter(i => i.id !== id);
    onUpdateSession({
      ...session,
      customIndicators: updated
    });
  };

  // Toggle Safety Zoning Compliance
  const handleToggleSafetyCompliance = (id: string) => {
    const updated = safetyZoning.map(s => {
      if (s.id === id) {
        return { ...s, isCompliant: !s.isCompliant };
      }
      return s;
    });

    onUpdateSession({
      ...session,
      safetyZoning: updated
    });
  };

  // Print official committee evaluation
  const handlePrintCommitteeReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      
      {/* Top Banner: Site Metadata and Executive Status */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
              <CargasNgvLogo size="sm" showText={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                  {session.code}
                </span>
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  منظومة مراجعة واعتماد الإدارات ودراسة الجدوى الشاملة
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {session.locationName} ({session.governorate})
                </span>
                <span className="font-mono text-slate-300">
                  GPS: {session.coordinates.lat.toFixed(4)}° N, {session.coordinates.lng.toFixed(4)}° E
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Flame className="w-3.5 h-3.5" />
                  {session.nearestStation}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Overall Score Badge */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="bg-slate-800/80 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">إجمالي CAPEX</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {(dynamicCapexSummary.totalCapex / 1000000).toFixed(2)} م ج.م
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">العائد الداخلي IRR</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {calculatedFinancials.irr}%
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block">فترة الاسترداد</span>
              <span className="text-sm font-bold font-mono text-blue-400">
                {calculatedFinancials.paybackYears} سنة
              </span>
            </div>

            {/* Print button */}
            <button
              onClick={handlePrintCommitteeReport}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
              title="طباعة محضر الاجتماع وتوصية الإدارات"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">طباعة التقرير</span>
            </button>
          </div>
        </div>

        {/* 5-Departments Status Tracker Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-800">
          
          {/* Projects Dept */}
          <button
            onClick={() => setActiveDept('projects')}
            className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
              activeDept === 'projects'
                ? 'bg-blue-500/20 border-blue-500/60 shadow-md shadow-blue-500/10'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1 text-blue-400">
                <Building2 className="w-3.5 h-3.5" />
                <span>المشروعات</span>
              </span>
              <div className="flex items-center gap-1">
                {(reviews.projects?.attachments?.length || 0) > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono flex items-center gap-0.5" title={`${reviews.projects?.attachments?.length} مرفق`}>
                    <Paperclip className="w-2.5 h-2.5" />
                    {reviews.projects?.attachments?.length}
                  </span>
                )}
                {reviews.projects?.decision === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {reviews.projects?.decision === 'conditional' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                {reviews.projects?.decision === 'deferred' && <Clock className="w-3.5 h-3.5 text-blue-400" />}
                {reviews.projects?.decision === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {reviews.projects?.decision === 'approved' ? 'موافقة معتمدة' :
               reviews.projects?.decision === 'deferred' ? 'مؤجل للاستيفاء' :
               reviews.projects?.decision === 'rejected' ? 'مرفوض هندسياً' : 'موافقة مشروطة'}
            </div>
          </button>

          {/* HSE Dept */}
          <button
            onClick={() => setActiveDept('hse')}
            className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
              activeDept === 'hse'
                ? 'bg-emerald-500/20 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>السلامة HSE</span>
              </span>
              <div className="flex items-center gap-1">
                {(reviews.hse?.attachments?.length || 0) > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono flex items-center gap-0.5" title={`${reviews.hse?.attachments?.length} مرفق`}>
                    <Paperclip className="w-2.5 h-2.5" />
                    {reviews.hse?.attachments?.length}
                  </span>
                )}
                {reviews.hse?.decision === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {reviews.hse?.decision === 'conditional' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                {reviews.hse?.decision === 'deferred' && <Clock className="w-3.5 h-3.5 text-blue-400" />}
                {reviews.hse?.decision === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {reviews.hse?.decision === 'approved' ? 'معتمد NFPA 52' :
               reviews.hse?.decision === 'deferred' ? 'مؤجل للاشتراطات' :
               reviews.hse?.decision === 'rejected' ? 'مرفوض بيئياً' : 'مشروط بالسلامة'}
            </div>
          </button>

          {/* Operations Dept */}
          <button
            onClick={() => setActiveDept('operations')}
            className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
              activeDept === 'operations'
                ? 'bg-amber-500/20 border-amber-500/60 shadow-md shadow-amber-500/10'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1 text-amber-400">
                <Wrench className="w-3.5 h-3.5" />
                <span>التشغيل والصيانة</span>
              </span>
              <div className="flex items-center gap-1">
                {(reviews.operations?.attachments?.length || 0) > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono flex items-center gap-0.5" title={`${reviews.operations?.attachments?.length} مرفق`}>
                    <Paperclip className="w-2.5 h-2.5" />
                    {reviews.operations?.attachments?.length}
                  </span>
                )}
                {reviews.operations?.decision === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {reviews.operations?.decision === 'conditional' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                {reviews.operations?.decision === 'deferred' && <Clock className="w-3.5 h-3.5 text-blue-400" />}
                {reviews.operations?.decision === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {reviews.operations?.decision === 'approved' ? 'معتمد تشغيلياً' :
               reviews.operations?.decision === 'deferred' ? 'مؤجل لدراسة الضغط' :
               reviews.operations?.decision === 'rejected' ? 'مرفوض فنياً' : 'مشروط بالشبكة'}
            </div>
          </button>

          {/* Legal Dept */}
          <button
            onClick={() => setActiveDept('legal')}
            className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
              activeDept === 'legal'
                ? 'bg-purple-500/20 border-purple-500/60 shadow-md shadow-purple-500/10'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1 text-purple-400">
                <Scale className="w-3.5 h-3.5" />
                <span>القانونية</span>
              </span>
              <div className="flex items-center gap-1">
                {(reviews.legal?.attachments?.length || 0) > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono flex items-center gap-0.5" title={`${reviews.legal?.attachments?.length} مرفق`}>
                    <Paperclip className="w-2.5 h-2.5" />
                    {reviews.legal?.attachments?.length}
                  </span>
                )}
                {reviews.legal?.decision === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {reviews.legal?.decision === 'conditional' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                {reviews.legal?.decision === 'deferred' && <Clock className="w-3.5 h-3.5 text-blue-400" />}
                {reviews.legal?.decision === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {reviews.legal?.decision === 'approved' ? 'سليم قانونياً' :
               reviews.legal?.decision === 'deferred' ? 'مؤجل للتوثيق' :
               reviews.legal?.decision === 'rejected' ? 'مرفوض تعاقدياً' : 'مشروط بالعقد'}
            </div>
          </button>

          {/* Financial Dept */}
          <button
            onClick={() => setActiveDept('financial')}
            className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
              activeDept === 'financial'
                ? 'bg-cyan-500/20 border-cyan-500/60 shadow-md shadow-cyan-500/10'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1 text-cyan-400">
                <DollarSign className="w-3.5 h-3.5" />
                <span>المالية والتدقيق</span>
              </span>
              <div className="flex items-center gap-1">
                {(reviews.financial?.attachments?.length || 0) > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono flex items-center gap-0.5" title={`${reviews.financial?.attachments?.length} مرفق`}>
                    <Paperclip className="w-2.5 h-2.5" />
                    {reviews.financial?.attachments?.length}
                  </span>
                )}
                {reviews.financial?.decision === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {reviews.financial?.decision === 'conditional' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                {reviews.financial?.decision === 'deferred' && <Clock className="w-3.5 h-3.5 text-blue-400" />}
                {reviews.financial?.decision === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {reviews.financial?.decision === 'approved' ? 'مجدٍ استثمارياً' :
               reviews.financial?.decision === 'deferred' ? 'مؤجل للمراجعة' :
               reviews.financial?.decision === 'rejected' ? 'غير مجدٍ مالياً' : 'مشروط بالتدقيق'}
            </div>
          </button>

          {/* Final Executive Recommendation */}
          <button
            onClick={() => setActiveDept('recommendation')}
            className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
              activeDept === 'recommendation'
                ? 'bg-rose-500/20 border-rose-500/60 shadow-md shadow-rose-500/10'
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold flex items-center gap-1 text-rose-400">
                <Award className="w-3.5 h-3.5" />
                <span>القرار النهائي</span>
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-mono">
                {overallRecommendation.verdictScorePercent}%
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-bold truncate">
              {overallRecommendation.overallVerdict === 'recommended_immediately' ? 'موصى بالتنفيذ' : 'مشروط بالاستيفاء'}
            </div>
          </button>

        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* DEPARTMENT VIEW 1: PROJECTS & CIVIL ENGINEERING                    */}
      {/* ------------------------------------------------------------------ */}
      {activeDept === 'projects' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
              <div>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold mb-1">
                  <Building2 className="w-4 h-4" />
                  <span>قطاع المشروعات والأعمال المدنية والكهربائية</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  تكاليف الإنشاءات، الخرسانات المسلحة، الكهرباء والمظلات
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحديد دقيق لكافة بنود الـ CAPEX الإنشائية وإمكانية إضافة حقول هندسية مخصصة تسمع فوراً في دراسة الجدوى.
                </p>
              </div>

              {/* Decision Toggle */}
              <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 px-2">قرار إدارة المشروعات:</span>
                <button
                  onClick={() => updateDepartmentReview('projects', { decision: 'approved' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.projects?.decision === 'approved'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  اعتماد وموافقة
                </button>
                <button
                  onClick={() => updateDepartmentReview('projects', { decision: 'conditional' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.projects?.decision === 'conditional'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  موافقة مشروطة
                </button>
                <button
                  onClick={() => updateDepartmentReview('projects', { decision: 'rejected' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.projects?.decision === 'rejected'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  رفض
                </button>
              </div>
            </div>

            {/* Base Engineering Cost Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  أعمال المباني والخرسانات المسلحة (ج.م)
                </label>
                <input
                  type="number"
                  value={reviews.projects?.costEstimates?.civilCostEgp || 3800000}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updateDepartmentReview('projects', {
                      costEstimates: {
                        ...reviews.projects?.costEstimates,
                        civilCostEgp: val
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">قواعد الضاغط والمبنى الإداري</span>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  الأعمال الكهربائية والمحولات (ج.م)
                </label>
                <input
                  type="number"
                  value={reviews.projects?.costEstimates?.electricalCostEgp || 1350000}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updateDepartmentReview('projects', {
                      costEstimates: {
                        ...reviews.projects?.costEstimates,
                        electricalCostEgp: val
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">محول 630 ك.ف.أ ولوحات التوزيع</span>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  أعمال الحفر وسند الجوانب والتربة (ج.م)
                </label>
                <input
                  type="number"
                  value={reviews.projects?.costEstimates?.excavationCostEgp || 480000}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updateDepartmentReview('projects', {
                      costEstimates: {
                        ...reviews.projects?.costEstimates,
                        excavationCostEgp: val
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono font-bold focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">أعمال الإحلال والدمك الميكانيكي</span>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  مظلة التموين Canopy والتغطيات (ج.م)
                </label>
                <input
                  type="number"
                  value={reviews.projects?.costEstimates?.concreteCostEgp || 1850000}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updateDepartmentReview('projects', {
                      costEstimates: {
                        ...reviews.projects?.costEstimates,
                        concreteCostEgp: val
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-blue-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">هيكل معدني كارجاس والواجهات</span>
              </div>

            </div>

            {/* Custom Department Fields Section (Add Any Custom Field requested by Projects!) */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">
                    الحقول والبيانات المخصصة لإدارة المشروعات (تسمع تلقائياً في دراسة الجدوى)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingField(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة حقل مخصص جديد للمشروعات</span>
                </button>
              </div>

              {/* Render Custom Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(reviews.projects?.customFields || []).map((field) => (
                  <div key={field.id} className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200">{field.label}</span>
                        {field.impactsCapex && (
                          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] rounded font-bold border border-emerald-500/30">
                            يؤثر على CAPEX
                          </span>
                        )}
                      </div>
                      {field.notes && <p className="text-[11px] text-slate-400 mt-0.5">{field.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      {field.fieldType === 'number' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={field.value as number}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-28 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-blue-500"
                          />
                          {field.unit && <span className="text-xs text-slate-400">{field.unit}</span>}
                        </div>
                      )}

                      {field.fieldType === 'text' && (
                        <input
                          type="text"
                          value={field.value as string}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-48 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      )}

                      {field.fieldType === 'select' && (
                        <select
                          value={field.value as string}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-48 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                        >
                          {(field.options || []).map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      <button
                        onClick={() => handleRemoveCustomField(field.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="حذف هذا الحقل"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineer Justification and Approval Signature */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                ملاحظات وتبرير مهندس المشروعات التنفيذي:
              </label>
              <textarea
                rows={2}
                value={reviews.projects?.justification || ''}
                onChange={(e) => updateDepartmentReview('projects', { justification: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                placeholder="اكتب التبرير الفني والجدول الزمني المخطط لتنفيذ الأعمال المدنية والكهربائية..."
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>المراجع: {reviews.projects?.reviewerName}</span>
                <span>تاريخ التقييم: {reviews.projects?.reviewDate}</span>
              </div>
            </div>

            {/* Department Attachments & Decision Action Panel */}
            <DepartmentAttachmentsManager
              department="projects"
              departmentName="قطاع المشروعات والأعمال المدنية"
              reviewerRoleTitle="مدير إدارة المشروعات الهندسية"
              reviewerName={reviews.projects?.reviewerName || 'م. أحمد شكري'}
              decision={reviews.projects?.decision || 'conditional'}
              onUpdateDecision={(dec) => updateDepartmentReview('projects', { decision: dec })}
              attachments={reviews.projects?.attachments || []}
              onUpdateAttachments={(atts) => updateDepartmentReview('projects', { attachments: atts })}
              accentColor="blue"
            />

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* DEPARTMENT VIEW 2: HSE & INDUSTRIAL SAFETY (NFPA 52)               */}
      {/* ------------------------------------------------------------------ */}
      {activeDept === 'hse' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>إدارة السلامة والصحة المهنية والأمن الصناعي (HSE)</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  اشتراطات الأمن الصناعي لوضع المعدات والمحطة (كود NFPA 52 والبيئة)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  فحص مسافات الأمان حول الضاغط، الحاويات الاسطوانية، كواشف الميثان، وتصاريح الحماية المدنية.
                </p>
              </div>

              {/* Decision Toggle */}
              <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 px-2">قرار إدارة السلامة:</span>
                <button
                  onClick={() => updateDepartmentReview('hse', { decision: 'approved' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.hse?.decision === 'approved'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مطابق وموافق
                </button>
                <button
                  onClick={() => updateDepartmentReview('hse', { decision: 'conditional' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.hse?.decision === 'conditional'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  اشتراطات استيفاء
                </button>
                <button
                  onClick={() => updateDepartmentReview('hse', { decision: 'rejected' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.hse?.decision === 'rejected'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  رفض أمني/بيئي
                </button>
              </div>
            </div>

            {/* Industrial Safety & Equipment Placement Checklist */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>مصفوفة مسافات الأمان والارتدادات الإلزامية للمعدات (NFPA 52 Standard)</span>
              </h3>

              <div className="space-y-2.5">
                {safetyZoning.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.isCompliant
                        ? 'bg-slate-800/70 border-emerald-500/30'
                        : 'bg-rose-950/20 border-rose-500/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleSafetyCompliance(item.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                            item.isCompliant ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{item.item}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700 font-mono">
                              {item.codeStandard}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.notes}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">الحد الأدنى</span>
                          <span className="font-mono text-amber-400 font-bold">{item.minRequiredDistanceMeters} م</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">المسافة الفعلية</span>
                          <span className="font-mono text-emerald-400 font-bold">{item.actualDistanceMeters} م</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-[11px] font-bold ${
                          item.isCompliant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {item.isCompliant ? 'مطابق للكود' : 'غير مطابق'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom HSE Fields */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    الحقول والبيانات المخصصة لإدارة السلامة والصحة المهنية
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingField(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة حقل مخصص للسلامة</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(reviews.hse?.customFields || []).map((field) => (
                  <div key={field.id} className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-slate-200 block truncate">{field.label}</span>
                      {field.notes && <p className="text-[11px] text-slate-400 mt-0.5">{field.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      {field.fieldType === 'number' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={field.value as number}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-24 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono text-emerald-400 font-bold focus:outline-none"
                          />
                          {field.unit && <span className="text-xs text-slate-400">{field.unit}</span>}
                        </div>
                      )}

                      {field.fieldType === 'select' && (
                        <select
                          value={field.value as string}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-48 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none"
                        >
                          {(field.options || []).map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      <button
                        onClick={() => handleRemoveCustomField(field.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HSE Notes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                تقرير استشاري الأمن الصناعي وخطة الطوارئ:
              </label>
              <textarea
                rows={2}
                value={reviews.hse?.justification || ''}
                onChange={(e) => updateDepartmentReview('hse', { justification: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>استشاري السلامة: {reviews.hse?.reviewerName}</span>
                <span>تاريخ التقرير: {reviews.hse?.reviewDate}</span>
              </div>
            </div>

            {/* Department Attachments & Decision Action Panel */}
            <DepartmentAttachmentsManager
              department="hse"
              departmentName="إدارة السلامة والصحة المهنية والأمن الصناعي (HSE)"
              reviewerRoleTitle="مدير إدارة السلامة والأمن الصناعي"
              reviewerName={reviews.hse?.reviewerName || 'كيميائي / محمود بدوي'}
              decision={reviews.hse?.decision || 'conditional'}
              onUpdateDecision={(dec) => updateDepartmentReview('hse', { decision: dec })}
              attachments={reviews.hse?.attachments || []}
              onUpdateAttachments={(atts) => updateDepartmentReview('hse', { attachments: atts })}
              accentColor="emerald"
            />

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* DEPARTMENT VIEW 3: OPERATIONS & MAINTENANCE                        */}
      {/* ------------------------------------------------------------------ */}
      {activeDept === 'operations' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-1">
                  <Wrench className="w-4 h-4" />
                  <span>إدارة التشغيل والصيانة والشبكات</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  المعدات والآلات: الضاغط، الحاويات، طلمبات التموين وتكلفة خط الغاز
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحديد دقيق لمواصفات حزمة الضاغط، الضغط الداخل، سعة البطاريات الاسطوانية، وتكاليف مد خط الغاز للبنية التحتية.
                </p>
              </div>

              {/* Decision Toggle */}
              <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 px-2">قرار التشغيل والصيانة:</span>
                <button
                  onClick={() => updateDepartmentReview('operations', { decision: 'approved' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.operations?.decision === 'approved'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  جاهز للتشغيل
                </button>
                <button
                  onClick={() => updateDepartmentReview('operations', { decision: 'conditional' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.operations?.decision === 'conditional'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تعديلات فنية
                </button>
                <button
                  onClick={() => updateDepartmentReview('operations', { decision: 'rejected' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.operations?.decision === 'rejected'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  غير مناسب فنياً
                </button>
              </div>
            </div>

            {/* Technical Equipment Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  طاقة الضاغط (Sm³/h)
                </label>
                <input
                  type="number"
                  value={reviews.operations?.operationalSpecs?.compressorCapacityM3h || 1500}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updateDepartmentReview('operations', {
                      operationalSpecs: {
                        ...reviews.operations?.operationalSpecs,
                        compressorCapacityM3h: val,
                        inletGasPressureBar: reviews.operations?.operationalSpecs?.inletGasPressureBar || 12,
                        storageCascadesWaterCapacityL: reviews.operations?.operationalSpecs?.storageCascadesWaterCapacityL || 5000,
                        dispenserHosesCount: reviews.operations?.operationalSpecs?.dispenserHosesCount || 8,
                        pipelineLengthMeters: reviews.operations?.operationalSpecs?.pipelineLengthMeters || 310,
                        requiredPowerKva: reviews.operations?.operationalSpecs?.requiredPowerKva || 500
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">يكفي لتموين 65 سيارة/ساعة</span>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  ضغط الغاز الداخل من الشبكة (Bar)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={reviews.operations?.operationalSpecs?.inletGasPressureBar || 12.4}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updateDepartmentReview('operations', {
                      operationalSpecs: {
                        ...reviews.operations?.operationalSpecs,
                        compressorCapacityM3h: reviews.operations?.operationalSpecs?.compressorCapacityM3h || 1500,
                        inletGasPressureBar: val,
                        storageCascadesWaterCapacityL: reviews.operations?.operationalSpecs?.storageCascadesWaterCapacityL || 5000,
                        dispenserHosesCount: reviews.operations?.operationalSpecs?.dispenserHosesCount || 8,
                        pipelineLengthMeters: reviews.operations?.operationalSpecs?.pipelineLengthMeters || 310,
                        requiredPowerKva: reviews.operations?.operationalSpecs?.requiredPowerKva || 500
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">شبكة الغاز القومية للضغط المتوسط</span>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  تكلفة خط الغاز والبنية التحتية (ج.م)
                </label>
                <input
                  type="number"
                  value={reviews.operations?.costEstimates?.pipelineCostEgp || 2200000}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updateDepartmentReview('operations', {
                      costEstimates: {
                        ...reviews.operations?.costEstimates,
                        pipelineCostEgp: val
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-cyan-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">خط الربط الصلب ومحطة القياس</span>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  عدد خراطيم طلمبات التموين (Hoses)
                </label>
                <input
                  type="number"
                  value={reviews.operations?.operationalSpecs?.dispenserHosesCount || 8}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updateDepartmentReview('operations', {
                      operationalSpecs: {
                        ...reviews.operations?.operationalSpecs,
                        compressorCapacityM3h: reviews.operations?.operationalSpecs?.compressorCapacityM3h || 1500,
                        inletGasPressureBar: reviews.operations?.operationalSpecs?.inletGasPressureBar || 12,
                        storageCascadesWaterCapacityL: reviews.operations?.operationalSpecs?.storageCascadesWaterCapacityL || 5000,
                        dispenserHosesCount: val,
                        pipelineLengthMeters: reviews.operations?.operationalSpecs?.pipelineLengthMeters || 310,
                        requiredPowerKva: reviews.operations?.operationalSpecs?.requiredPowerKva || 500
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-purple-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">4 طلمبات مزدوجة Coriolis</span>
              </div>

            </div>

            {/* Custom Operations Fields */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">
                    الحقول والبيانات المخصصة لإدارة التشغيل والصيانة
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingField(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة حقل مخصص للتشغيل</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(reviews.operations?.customFields || []).map((field) => (
                  <div key={field.id} className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-slate-200 block truncate">{field.label}</span>
                      {field.notes && <p className="text-[11px] text-slate-400 mt-0.5">{field.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      {field.fieldType === 'number' && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={field.value as number}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="w-24 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono text-emerald-400 font-bold focus:outline-none"
                          />
                          {field.unit && <span className="text-xs text-slate-400">{field.unit}</span>}
                        </div>
                      )}

                      {field.fieldType === 'select' && (
                        <select
                          value={field.value as string}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-48 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none"
                        >
                          {(field.options || []).map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      <button
                        onClick={() => handleRemoveCustomField(field.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Operations Notes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                تقرير مدير عام العمليات والغاز الطبيعي:
              </label>
              <textarea
                rows={2}
                value={reviews.operations?.justification || ''}
                onChange={(e) => updateDepartmentReview('operations', { justification: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>المراجع: {reviews.operations?.reviewerName}</span>
                <span>تاريخ الفحص: {reviews.operations?.reviewDate}</span>
              </div>
            </div>

            {/* Department Attachments & Decision Action Panel */}
            <DepartmentAttachmentsManager
              department="operations"
              departmentName="قطاع العمليات والشبكات والمعدات والغاز"
              reviewerRoleTitle="مدير عام العمليات والصيانة"
              reviewerName={reviews.operations?.reviewerName || 'م. سامح الجمال'}
              decision={reviews.operations?.decision || 'conditional'}
              onUpdateDecision={(dec) => updateDepartmentReview('operations', { decision: dec })}
              attachments={reviews.operations?.attachments || []}
              onUpdateAttachments={(atts) => updateDepartmentReview('operations', { attachments: atts })}
              accentColor="amber"
            />

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* DEPARTMENT VIEW 4: LEGAL AFFAIRS                                   */}
      {/* ------------------------------------------------------------------ */}
      {activeDept === 'legal' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
              <div>
                <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold mb-1">
                  <Scale className="w-4 h-4" />
                  <span>الإدارة العامة للشئون القانونية والعقود</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  مراجعة عقد استغلال الأرض، الملكية، التراخيص والمخاطر القانونية
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  فحص سلامة الموقف التعاقدي، مدة عقد الإيجار / الانتفاع، والقيمة الإيجارية السنوية المحملة على التشغيل.
                </p>
              </div>

              {/* Decision Toggle */}
              <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 px-2">الرأي القانوني:</span>
                <button
                  onClick={() => updateDepartmentReview('legal', { decision: 'approved' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.legal?.decision === 'approved'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مطابق قانوناً
                </button>
                <button
                  onClick={() => updateDepartmentReview('legal', { decision: 'conditional' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.legal?.decision === 'conditional'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تحفظات قانونية
                </button>
                <button
                  onClick={() => updateDepartmentReview('legal', { decision: 'rejected' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.legal?.decision === 'rejected'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مانع قانوني
                </button>
              </div>
            </div>

            {/* Contract Terms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              
              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  مدة العقد وحق الانتفاع (سنة)
                </label>
                <input
                  type="number"
                  value={reviews.legal?.legalReview?.contractDurationYears || 25}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updateDepartmentReview('legal', {
                      legalReview: {
                        ...reviews.legal?.legalReview,
                        contractDurationYears: val,
                        landTenureType: reviews.legal?.legalReview?.landTenureType || 'long_term_lease',
                        annualLeaseCostEgp: reviews.legal?.legalReview?.annualLeaseCostEgp || 480000,
                        buildingPermitFeasible: reviews.legal?.legalReview?.buildingPermitFeasible ?? true,
                        zoningClearance: reviews.legal?.legalReview?.zoningClearance ?? true,
                        titleDeedVerified: reviews.legal?.legalReview?.titleDeedVerified ?? true,
                        disputeRiskLevel: reviews.legal?.legalReview?.disputeRiskLevel || 'low'
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-purple-400 font-mono font-bold focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">فترة تشغيل آمنة ومستقرة</span>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  القيمة الإيجارية السنوية للأرض (ج.م)
                </label>
                <input
                  type="number"
                  value={reviews.legal?.legalReview?.annualLeaseCostEgp || 480000}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    updateDepartmentReview('legal', {
                      legalReview: {
                        ...reviews.legal?.legalReview,
                        contractDurationYears: reviews.legal?.legalReview?.contractDurationYears || 25,
                        landTenureType: reviews.legal?.legalReview?.landTenureType || 'long_term_lease',
                        annualLeaseCostEgp: val,
                        buildingPermitFeasible: reviews.legal?.legalReview?.buildingPermitFeasible ?? true,
                        zoningClearance: reviews.legal?.legalReview?.zoningClearance ?? true,
                        titleDeedVerified: reviews.legal?.legalReview?.titleDeedVerified ?? true,
                        disputeRiskLevel: reviews.legal?.legalReview?.disputeRiskLevel || 'low'
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono font-bold focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">تُحسب ضمن نفقات الـ OPEX السنوية</span>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  مستوى مخاطر النزاع القضائي
                </label>
                <select
                  value={reviews.legal?.legalReview?.disputeRiskLevel || 'low'}
                  onChange={(e) => {
                    const val = e.target.value as 'low' | 'medium' | 'high';
                    updateDepartmentReview('legal', {
                      legalReview: {
                        ...reviews.legal?.legalReview,
                        contractDurationYears: reviews.legal?.legalReview?.contractDurationYears || 25,
                        landTenureType: reviews.legal?.legalReview?.landTenureType || 'long_term_lease',
                        annualLeaseCostEgp: reviews.legal?.legalReview?.annualLeaseCostEgp || 480000,
                        buildingPermitFeasible: reviews.legal?.legalReview?.buildingPermitFeasible ?? true,
                        zoningClearance: reviews.legal?.legalReview?.zoningClearance ?? true,
                        titleDeedVerified: reviews.legal?.legalReview?.titleDeedVerified ?? true,
                        disputeRiskLevel: val
                      }
                    });
                  }}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                >
                  <option value="low">منخفضة جداً (خلو كامل من النزاعات)</option>
                  <option value="medium">متوسطة (تتطلب استيفاء توثيق ورثة)</option>
                  <option value="high">مرتفعة (وجود نزاع قضائي معلق)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">فحص السجل العيني ومحكمة الأمور الوقتية</span>
              </div>

            </div>

            {/* Custom Legal Fields */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">
                    الحقول والبنود المخصصة للإدارة القانونية
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingField(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة بند قانوني مخصص</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(reviews.legal?.customFields || []).map((field) => (
                  <div key={field.id} className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-slate-200 block truncate">{field.label}</span>
                      {field.notes && <p className="text-[11px] text-slate-400 mt-0.5">{field.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      {field.fieldType === 'select' && (
                        <select
                          value={field.value as string}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-48 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs text-slate-200 focus:outline-none"
                        >
                          {(field.options || []).map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {field.fieldType === 'number' && (
                        <input
                          type="number"
                          value={field.value as number}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          className="w-24 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono text-emerald-400 font-bold focus:outline-none"
                        />
                      )}

                      <button
                        onClick={() => handleRemoveCustomField(field.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Opinion */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                الرأي والفتوى القانونية للمستشار القانوني:
              </label>
              <textarea
                rows={2}
                value={reviews.legal?.justification || ''}
                onChange={(e) => updateDepartmentReview('legal', { justification: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>المستشار القانوني: {reviews.legal?.reviewerName}</span>
                <span>تاريخ التوثيق: {reviews.legal?.reviewDate}</span>
              </div>
            </div>

            {/* Department Attachments & Decision Action Panel */}
            <DepartmentAttachmentsManager
              department="legal"
              departmentName="الإدارة العامة للشئون القانونية والعقود"
              reviewerRoleTitle="مدير الشؤون القانونية والمستشار القانوني"
              reviewerName={reviews.legal?.reviewerName || 'المستشار القانوني / شريف رضوان'}
              decision={reviews.legal?.decision || 'conditional'}
              onUpdateDecision={(dec) => updateDepartmentReview('legal', { decision: dec })}
              attachments={reviews.legal?.attachments || []}
              onUpdateAttachments={(atts) => updateDepartmentReview('legal', { attachments: atts })}
              accentColor="purple"
            />

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* DEPARTMENT VIEW 5: FINANCIAL AUDIT & CONTROL (EDIT ANY PARAMETER!) */}
      {/* ------------------------------------------------------------------ */}
      {activeDept === 'financial' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span>الإدارة العامة للشئون المالية ودراسات الجدوى والمراجعة</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  المراجعة المالية الشاملة، رصد الأخطاء وإمكانية تعديل أي بيان مباشرة
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  اعتماد التدفقات النقدية ومعدل العائد الداخلي (IRR) وصافي القيمة الحالية (NPV) وتعديل التكاليف فورا.
                </p>
              </div>

              {/* Financial Decision */}
              <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400 px-2">قرار الاعتماد المالي:</span>
                <button
                  onClick={() => updateDepartmentReview('financial', { decision: 'approved' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.financial?.decision === 'approved'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  موافقة واعتماد التمويل
                </button>
                <button
                  onClick={() => updateDepartmentReview('financial', { decision: 'conditional' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.financial?.decision === 'conditional'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تعزيز وإعادة مراجعة
                </button>
                <button
                  onClick={() => updateDepartmentReview('financial', { decision: 'rejected' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviews.financial?.decision === 'rejected'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  رفض التمويل
                </button>
              </div>
            </div>

            {/* Financial Performance KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">صافي القيمة الحالية (NPV)</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {calculatedFinancials.npv.toLocaleString()} ج.م
                </span>
                <span className="text-[10px] text-emerald-500/90 block mt-1">معدل خصم 14% على 10 سنوات</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">معدل العائد الداخلي (IRR)</span>
                <span className="text-lg font-bold font-mono text-amber-400">
                  {calculatedFinancials.irr}%
                </span>
                <span className="text-[10px] text-amber-500/90 block mt-1">يفوق تكلفة الفرصة البديلة</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">فترة استرداد رأس المال</span>
                <span className="text-lg font-bold font-mono text-blue-400">
                  {calculatedFinancials.paybackYears} سنة
                </span>
                <span className="text-[10px] text-blue-500/90 block mt-1">استرداد كامل للـ CAPEX</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">معدل العائد على الاستثمار ROI</span>
                <span className="text-lg font-bold font-mono text-purple-400">
                  {calculatedFinancials.roi}%
                </span>
                <span className="text-[10px] text-purple-500/90 block mt-1">عائد تشغيلي سنوي صافٍ</span>
              </div>

            </div>

            {/* Error Detection & Direct Parameter Editing Console */}
            <div className="bg-slate-950/70 border border-cyan-500/40 rounded-xl p-5 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">
                    لوحة تحكم المدقق المالي: رصد الأخطاء وتعديل تكاليف المشروعات والتشغيل مباشرة
                  </h3>
                </div>
                {!isAuditorEditingCosts ? (
                  <button
                    onClick={() => setIsAuditorEditingCosts(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>تعديل التكاليف ورصد الأخطاء الآن</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveAuditorCorrections}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>حفظ التصحيحات وتطبيقها فوراً</span>
                    </button>
                    <button
                      onClick={() => setIsAuditorEditingCosts(false)}
                      className="px-2.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700"
                    >
                      إلغاء
                    </button>
                  </div>
                )}
              </div>

              {isAuditorEditingCosts ? (
                <div className="p-4 bg-slate-900 border border-cyan-500/50 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        تكلفة الأعمال المدنية (ج.م)
                      </label>
                      <input
                        type="number"
                        value={auditorCostDraft.civilCostEgp}
                        onChange={(e) => setAuditorCostDraft({ ...auditorCostDraft, civilCostEgp: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        تكلفة حزمة الضاغط الهيدروليكي (ج.م)
                      </label>
                      <input
                        type="number"
                        value={auditorCostDraft.compressorCostEgp}
                        onChange={(e) => setAuditorCostDraft({ ...auditorCostDraft, compressorCostEgp: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        تكلفة خط الغاز والبنية التحتية (ج.م)
                      </label>
                      <input
                        type="number"
                        value={auditorCostDraft.pipelineCostEgp}
                        onChange={(e) => setAuditorCostDraft({ ...auditorCostDraft, pipelineCostEgp: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        تكلفة كابلات ومحولات الكهرباء (ج.م)
                      </label>
                      <input
                        type="number"
                        value={auditorCostDraft.electricalCostEgp}
                        onChange={(e) => setAuditorCostDraft({ ...auditorCostDraft, electricalCostEgp: Number(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      مبرر التعديل المالي وسند تصحيح الخطأ:
                    </label>
                    <input
                      type="text"
                      value={auditorCorrectionNote}
                      onChange={(e) => setAuditorCorrectionNote(e.target.value)}
                      placeholder="مثال: تصحيح تكلفة خط الغاز وفق عروض أسعار شركة تاون جاس المحدثة لعام 2026"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-200"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تمت مراجعة جميع بنود التكاليف واعتماد الـ CAPEX والـ OPEX ومطابقتها للسوق.</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    يمكن للمدقق المالي تعديل أي بند في أي وقت وستنعكس تلقائياً على كافة مؤشرات الجدوى.
                  </span>
                </div>
              )}
            </div>

            {/* Custom Indicators Section */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">
                    المؤشرات المالية والفنية المخصصة في دراسة الجدوى
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingIndicator(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة مؤشر مالي جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {customIndicators.map((ind) => (
                  <div key={ind.id} className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{ind.name}</span>
                        <button
                          onClick={() => handleRemoveIndicator(ind.id)}
                          className="text-slate-500 hover:text-rose-400 p-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{ind.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                      <span className="text-sm font-bold font-mono text-cyan-400">
                        {typeof ind.value === 'number' ? ind.value.toLocaleString() : ind.value} {ind.unit}
                      </span>
                      {ind.targetBenchmark && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          المعيار: {ind.targetBenchmark}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Auditor Notes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                ملاحظات رئيس قطاع الشئون المالية والتوصية الائتمانية:
              </label>
              <textarea
                rows={2}
                value={reviews.financial?.justification || ''}
                onChange={(e) => updateDepartmentReview('financial', { justification: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>المراجع المالي: {reviews.financial?.reviewerName}</span>
                <span>تاريخ الاعتماد: {reviews.financial?.reviewDate}</span>
              </div>
            </div>

            {/* Department Attachments & Decision Action Panel */}
            <DepartmentAttachmentsManager
              department="financial"
              departmentName="قطاع المراجعة والتدقيق المالي ودراسات الجدوى"
              reviewerRoleTitle="رئيس قطاع الشئون المالية والتدقيق"
              reviewerName={reviews.financial?.reviewerName || 'أ. تامر عبد الحميد'}
              decision={reviews.financial?.decision || 'conditional'}
              onUpdateDecision={(dec) => updateDepartmentReview('financial', { decision: dec })}
              attachments={reviews.financial?.attachments || []}
              onUpdateAttachments={(atts) => updateDepartmentReview('financial', { attachments: atts })}
              accentColor="cyan"
            />

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* FINAL EXECUTIVE COMMITTEE RECOMMENDATION                           */}
      {/* ------------------------------------------------------------------ */}
      {activeDept === 'recommendation' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
              <div>
                <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold mb-1">
                  <Award className="w-4 h-4" />
                  <span>محضر اللجنة العليا المشتركة لاعتماد المواقع الاستثمارية</span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  التوصية النهائية المجمعة للجنة الفنية والمالية المشتركة
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  خوارزمية حسابية تجمع تقييم الإدارات الخمس بأوزان نسبية (المالية 35%، التشغيل 25%، السلامة 25%، القانونية 15%).
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
                  overallRecommendation.overallVerdict === 'recommended_immediately'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : overallRecommendation.overallVerdict === 'conditional_approval'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  <Award className="w-4 h-4" />
                  <span>
                    {overallRecommendation.overallVerdict === 'recommended_immediately' && 'موصى بالتنفيذ والإنشاء فوراً'}
                    {overallRecommendation.overallVerdict === 'conditional_approval' && 'موافقة مشروطة باستيفاء متطلبات'}
                    {overallRecommendation.overallVerdict === 'rejected' && 'غير موصى به استثمارياً'}
                  </span>
                </span>
              </div>
            </div>

            {/* Score Gauges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-semibold">المؤشر المالي (35%)</span>
                  <span className="font-mono font-bold text-emerald-400">{overallRecommendation.financialScore}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${overallRecommendation.financialScore}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">IRR: {calculatedFinancials.irr}% | استرداد: {calculatedFinancials.paybackYears} سنة</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-semibold">المؤشر الفني والتشغيلي (25%)</span>
                  <span className="font-mono font-bold text-amber-400">{overallRecommendation.technicalScore}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${overallRecommendation.technicalScore}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">الضاغط 1500 م³/س | ضغط 12.4 بار</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-semibold">مؤشر السلامة والأمن الصناعي (25%)</span>
                  <span className="font-mono font-bold text-blue-400">{overallRecommendation.safetyScore}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${overallRecommendation.safetyScore}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">مطابقة كاملة لكود NFPA 52</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-semibold">المؤشر القانوني والتراخيص (15%)</span>
                  <span className="font-mono font-bold text-purple-400">{overallRecommendation.legalScore}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${overallRecommendation.legalScore}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">عقد 25 سنة معتمد وخالٍ من النزاع</span>
              </div>

            </div>

            {/* Committee Executive Summary & Action Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>الاشتراطات والمتطلبات الإلزامية قبل بدء الصرف:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {overallRecommendation.mandatoryPrerequisites.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>المخاطر المحتملة وإجراءات التحوط:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {overallRecommendation.identifiedRisks.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Committee Sign-off Section & Transition to Station Construction */}
            <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">تاريخ انعقاد اللجنة:</span>
                  <span className="font-mono text-emerald-400">{overallRecommendation.committeeDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    حالة المحضر: معتمد وموقع إلكترونياً من الإدارات الخمس
                  </span>
                  <button
                    onClick={handlePrintCommitteeReport}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>تصدير المحضر الرسمي</span>
                  </button>
                </div>
              </div>

              {/* Consolidated Departmental Attachments Archive */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      <Paperclip className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <span>أرشيف المستندات والمرفقات المعززة لقرارات الإدارات</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                          {allDepartmentAttachments.length} مستند مرفق
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        كافة وثائق الـ PDF والرسومات الهندسية وصور المعاينات ومذكرات Word وجداول Excel المرفوعة من الإدارات الخمس لتعزيز قراراتها
                      </p>
                    </div>
                  </div>
                </div>

                {allDepartmentAttachments.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-dashed border-slate-700 text-center">
                    <Paperclip className="w-6 h-6 text-slate-500 mx-auto mb-1.5 opacity-60" />
                    <p className="text-xs text-slate-300 font-medium">لا توجد مرفقات رسمية مسجلة حتى الآن</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      يمكن لمدير المشروعات وباقي الإدارات رفع مذكرات بي دي اف وصور وتقارير أكسيل من خلال تبويب كل إدارة بالضغط على "رفع ملف جديد".
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                    {allDepartmentAttachments.map(({ departmentKey, departmentName, attachment }) => {
                      const deptDecision = reviews[departmentKey]?.decision || 'conditional';
                      const decisionBadgeMap: Record<DepartmentReviewDecision, { label: string; color: string }> = {
                        approved: { label: 'موافقة', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                        conditional: { label: 'مشروط', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
                        deferred: { label: 'تأجيل', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
                        rejected: { label: 'رفض', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
                        pending: { label: 'قيد المراجعة', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' }
                      };
                      const decisionBadge = decisionBadgeMap[deptDecision] || decisionBadgeMap.conditional;
                      const fileCat = attachment.category || attachment.type || 'other';
                      const fileSize = attachment.sizeFormatted || `${(attachment.sizeBytes / 1024).toFixed(1)} KB`;

                      return (
                        <div
                          key={attachment.id}
                          className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between gap-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {fileCat === 'image' && attachment.dataUrl ? (
                                <img
                                  src={attachment.dataUrl}
                                  alt={attachment.name}
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                                  {fileCat === 'pdf' && <FileText className="w-4 h-4 text-rose-400" />}
                                  {fileCat === 'excel' && <FileSpreadsheet className="w-4 h-4 text-emerald-400" />}
                                  {fileCat === 'word' && <FileText className="w-4 h-4 text-blue-400" />}
                                  {fileCat === 'other' && <Paperclip className="w-4 h-4 text-slate-400" />}
                                  {fileCat === 'image' && <Eye className="w-4 h-4 text-cyan-400" />}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-200 truncate" title={attachment.name}>
                                  {attachment.name}
                                </p>
                                <span className="text-[10px] text-slate-400 block">
                                  {fileSize} • {attachment.uploadedAt}
                                </span>
                              </div>
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium shrink-0 ${decisionBadge.color}`}>
                              {decisionBadge.label}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                            <span className="text-slate-400 truncate max-w-[140px]" title={departmentName}>
                              {departmentName}
                            </span>
                            {attachment.dataUrl ? (
                              <a
                                href={attachment.dataUrl}
                                download={attachment.name}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                              >
                                <Download className="w-3 h-3" />
                                <span>تحميل</span>
                              </a>
                            ) : (
                              <span className="text-slate-500">تم التوثيق</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Transition to Execution Stage */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-blue-950/30 p-3.5 rounded-lg border border-blue-800/40">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HardHat className="w-4 h-4 text-amber-400" />
                    <span>مرحلة البدء في تنفيذ المحطة الإنشائي والميداني</span>
                  </span>
                  <p className="text-[11px] text-slate-300">
                    تم قبول وتصنيف الموقع وموافقة كافة الإدارات. يمكنك الآن متابعة سير الإنشاءات، توريد المعدات، الأمن الصناعي، والمستخلصات.
                  </p>
                </div>

                {onNavigateToExecution && (
                  <button
                    id="btn-launch-execution-workflow"
                    onClick={onNavigateToExecution}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-900/40 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <span>الانتقال لمتابعة تنفيذ المحطة</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: ADD CUSTOM FIELD TO DEPARTMENT                              */}
      {/* ------------------------------------------------------------------ */}
      {isAddingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-400" />
              <span>إضافة حقل / بيان مخصص لصفحة الإدارة</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">اسم الحقل / البيان المطلوب:</label>
              <input
                type="text"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                placeholder="مثال: عمق الحفر وسند الجوانب / تكلفة كابلات المحول"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">نوع البيان:</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="number">رقمي / قيمة مالية</option>
                  <option value="text">نصي / وصف</option>
                  <option value="select">قائمة خيارات</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">وحدة القياس:</label>
                <input
                  type="text"
                  value={newFieldUnit}
                  onChange={(e) => setNewFieldUnit(e.target.value)}
                  placeholder="ج.م / متر / م²"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">القيمة الأولية:</label>
              <input
                type="text"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white font-mono"
              />
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-800/60 rounded-lg">
              <input
                type="checkbox"
                id="capexImpact"
                checked={newFieldImpactsCapex}
                onChange={(e) => setNewFieldImpactsCapex(e.target.checked)}
                className="rounded border-slate-600 text-blue-600"
              />
              <label htmlFor="capexImpact" className="text-xs text-slate-200 cursor-pointer">
                يؤثر هذا البند ويُضاف تلقائياً إلى إجمالي تكلفة الإنشاءات (CAPEX)
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">ملاحظات توضيحية:</label>
              <input
                type="text"
                value={newFieldNotes}
                onChange={(e) => setNewFieldNotes(e.target.value)}
                placeholder="ملاحظات مرجعية خاصة بمهندس الإدارة..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-300"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingField(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleAddCustomField}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 shadow"
              >
                حفظ وإضافة الحقل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: ADD CUSTOM FEASIBILITY INDICATOR                            */}
      {/* ------------------------------------------------------------------ */}
      {isAddingIndicator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>إضافة مؤشر مالي أو فني مخصص لدراسة الجدوى</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">اسم المؤشر:</label>
              <input
                type="text"
                value={newIndName}
                onChange={(e) => setNewIndName(e.target.value)}
                placeholder="مثال: معدل تغطية خدمة الديون DSCR"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">التصنيف:</label>
                <select
                  value={newIndCategory}
                  onChange={(e) => setNewIndCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white"
                >
                  <option value="financial">مؤشر مالي</option>
                  <option value="technical">مؤشر فني</option>
                  <option value="operational">مؤشر تشغيلي</option>
                  <option value="safety">مؤشر أمن صناعي</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">وحدة القياس:</label>
                <input
                  type="text"
                  value={newIndUnit}
                  onChange={(e) => setNewIndUnit(e.target.value)}
                  placeholder="% / ج.م / سنة / م³"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">القيمة المستهدفة / الحالية:</label>
                <input
                  type="text"
                  value={newIndValue}
                  onChange={(e) => setNewIndValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">المعيار المرجعي:</label>
                <input
                  type="text"
                  value={newIndBenchmark}
                  onChange={(e) => setNewIndBenchmark(e.target.value)}
                  placeholder="مثال: > 25%"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">الوصف وأهمية المؤشر:</label>
              <input
                type="text"
                value={newIndDesc}
                onChange={(e) => setNewIndDesc(e.target.value)}
                placeholder="شرح مختصر عن كيفية حساب المؤشر والغرض منه..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-300"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingIndicator(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleAddCustomIndicator}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500 shadow"
              >
                حفظ وإدراج المؤشر
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
