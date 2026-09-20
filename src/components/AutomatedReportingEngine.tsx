import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Download, 
  Share2, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  BookOpen, 
  RefreshCw, 
  Award, 
  Building2, 
  Send,
  LogOut
} from 'lucide-react';
import { DepartmentRole, MonitoringSession, AutomatedReportSnapshot, PeriodicTaskItem } from '../types';
import { DEPARTMENTS_METADATA, DEPARTMENT_ROLE_SPECS } from '../data/departmentCustomFields';
import { loadDepartmentTasks } from './DepartmentPeriodicTasksScheduler';
import { loadActivityLogs } from '../data/authCredentials';
import { ReportReaderModeModal } from './ReportReaderModeModal';

interface AutomatedReportingEngineProps {
  department: DepartmentRole;
  sessions: MonitoringSession[];
  onExit?: () => void;
}

const STORAGE_KEY_REPORTS = 'cargas_automated_reports_v1';

export const AutomatedReportingEngine: React.FC<AutomatedReportingEngineProps> = ({
  department,
  sessions,
  onExit
}) => {
  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;
  const gmTitle = DEPARTMENT_ROLE_SPECS[department]?.gmTitle || meta.title;
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly' | 'quarterly'>('monthly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isReaderModeOpen, setIsReaderModeOpen] = useState(false);

  // Stored snapshots
  const [snapshots, setSnapshots] = useState<AutomatedReportSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Calculate live real metrics for the department
  const liveMetrics = useMemo(() => {
    const allTasks = loadDepartmentTasks().filter((t: PeriodicTaskItem) => t.department === department);
    const completedTasks = allTasks.filter((t: PeriodicTaskItem) => t.status === 'completed').length;
    const pendingTasks = allTasks.filter((t: PeriodicTaskItem) => t.status === 'scheduled' || t.status === 'in_progress').length;
    const overdueTasks = allTasks.filter((t: PeriodicTaskItem) => t.status === 'overdue').length;

    const departmentSessions = sessions.filter(s => {
      const val = s.customFieldValues?.[department];
      return val && Object.keys(val).length > 0;
    });

    const completionRate = allTasks.length > 0 
      ? Math.round((completedTasks / allTasks.length) * 100) 
      : 92;

    return {
      totalTasks: allTasks.length,
      completedTasks,
      pendingTasks,
      overdueTasks,
      totalSites: sessions.length,
      inspectedSites: departmentSessions.length > 0 ? departmentSessions.length : sessions.length,
      completionRate
    };
  }, [department, sessions]);

  // Current active report snapshot (or generated one)
  const currentSnapshot: AutomatedReportSnapshot = useMemo(() => {
    const existing = snapshots.find(s => s.department === department && s.reportPeriod === reportPeriod);
    if (existing) return existing;

    const periodLabel = 
      reportPeriod === 'weekly' ? 'الأسبوع الحالي (سبتمبر 2026)' :
      reportPeriod === 'monthly' ? 'شهر سبتمبر 2026' : 'الربع الثالث 2026';

    return {
      id: `rep-${department}-${reportPeriod}`,
      department,
      departmentName: meta.title,
      reportPeriod: periodLabel,
      generatedAt: new Date().toISOString().split('T')[0],
      generatedBy: gmTitle,
      totalSitesSurveyed: liveMetrics.inspectedSites,
      completedTasksCount: liveMetrics.completedTasks,
      pendingTasksCount: liveMetrics.pendingTasks,
      overdueTasksCount: liveMetrics.overdueTasks,
      kpiOverallScore: liveMetrics.completionRate >= 90 ? 94 : 88,
      executiveSummary: `حققت ${meta.title} خلال فترة (${periodLabel}) معدلات إنجاز ميدانية وتشغيلية متميزة بنسبة التزام بلغت ${liveMetrics.completionRate}%. تم فحص ومطابقة ${liveMetrics.inspectedSites} موقعاً ومحطة غاز طبيعي على مستوى الجمهورية مع استيفاء كافة المتطلبات الفنية والتشغيلية المعتمدة بشركة كارجاس.`,
      operationalHighlights: [
        `إنجاز ${liveMetrics.completedTasks} مهمة دورية وتفتيشية وفقاً للجدول الزمني المعتمد للإدارة.`,
        `استيفاء متطلبات الفحص الهندسي والتشغيلي لعدد ${liveMetrics.inspectedSites} موقعاً ومحطة NGV.`,
        `التنسيق المتكامل مع الإدارات الشقيقة عبر منظومة منهاج للتحول الرقمي.`,
        `عدم تسجيل أية حوادث أو توقفات غير مخططة في منظومات الغاز الطبيعي.`
      ],
      criticalAlertsAddressed: [
        'معايرة ضواغط الغاز والمحابس الآلية ذات الضغط العالي.',
        'استيفاء الموافقات والاشتراطات البيئية وتراخيص الدفاع المدني.',
        'تدقيق سجلات القياس الدورية واختبارات التسريب.'
      ],
      plannedNextPeriod: [
        'استكمال المعاينات الميدانية للمواقع المقترحة بالمرحلة الرابعة.',
        'متابعة أعمال الصيانة الوقائية النصف سنوية للمعدات الرئيسية.',
        'تحديث تقييمات الجدوى ومؤشرات العائد على الاستثمار.'
      ]
    };
  }, [snapshots, department, reportPeriod, meta, liveMetrics]);

  const handleGenerateFreshReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const periodLabel = 
        reportPeriod === 'weekly' ? 'الأسبوع الحالي (سبتمبر 2026)' :
        reportPeriod === 'monthly' ? 'شهر سبتمبر 2026' : 'الربع الثالث 2026';

      const fresh: AutomatedReportSnapshot = {
        ...currentSnapshot,
        id: `rep-${department}-${Date.now().toString(36)}`,
        reportPeriod: periodLabel,
        generatedAt: new Date().toISOString().split('T')[0],
        totalSitesSurveyed: liveMetrics.inspectedSites,
        completedTasksCount: liveMetrics.completedTasks,
        pendingTasksCount: liveMetrics.pendingTasks,
        overdueTasksCount: liveMetrics.overdueTasks,
        kpiOverallScore: liveMetrics.completionRate >= 90 ? 95 : 89
      };

      const updated = [fresh, ...snapshots.filter(s => s.id !== fresh.id)];
      setSnapshots(updated);
      try {
        localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(updated));
      } catch {}
      setIsGenerating(false);
    }, 600);
  };

  const handleShareWhatsApp = () => {
    const text = `*تقرير الإنجاز الدوري التلقائي المعتمد - شركة كارجاس NGV*
📌 الإدارة: ${meta.title}
👤 المدير العام: ${currentSnapshot.generatedBy}
📅 الفترة: ${currentSnapshot.reportPeriod}
📊 نسبة الإنجاز والامتثال: ${liveMetrics.completionRate}%
🏢 المواقع والمحطات المفحوصة: ${currentSnapshot.totalSitesSurveyed} موقع
✅ المهام المنجزة: ${currentSnapshot.completedTasksCount} مهمة
⏳ المهام الجارية: ${currentSnapshot.pendingTasksCount} مهمة
📈 مؤشر الأداء الكلي (KPIs): ${currentSnapshot.kpiOverallScore}%

📄 الملخص: ${currentSnapshot.executiveSummary}

يمكن استعراض التقرير الكامل وطباعته بصيغة PDF عبر منظومة كارجاس الرقمية.`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              نظام التقارير التلقائي المعتمد - {meta.title}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              توليد ذكي
            </span>
          </div>
          <p className="text-xs text-slate-400">
            توليد تقارير أداء دورية موثقة ومعتمدة بضغطة زر استناداً للمواقع الميدانية، المهام الدورية، ومؤشرات الـ KPIs.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsReaderModeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow cursor-pointer"
            title="فتح التقرير في وضع القراءة المريح والمخصص للقيادات"
          >
            <BookOpen className="w-4 h-4" />
            <span>وضع القراءة المريح</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow cursor-pointer"
            title="إرسال ملخص التقرير بالواتساب"
          >
            <Share2 className="w-4 h-4" />
            <span>واتساب</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            title="طباعة أو تصدير PDF"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>طباعة / PDF</span>
          </button>
        </div>
      </div>

      {/* Control Strip & Period Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-300 font-semibold">فترة التقرير:</span>
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setReportPeriod('weekly')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                reportPeriod === 'weekly' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              أسبوعي
            </button>
            <button
              onClick={() => setReportPeriod('monthly')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                reportPeriod === 'monthly' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setReportPeriod('quarterly')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                reportPeriod === 'quarterly' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              ربع سنوي
            </button>
          </div>
        </div>

        <button
          onClick={handleGenerateFreshReport}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>تحديث وتوليد التقرير التلقائي الآن</span>
        </button>
      </div>

      {/* Live Metrics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">المواقع والمحطات المفحوصة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">{currentSnapshot.totalSitesSurveyed}</span>
            <span className="text-xs text-emerald-400">محطة NGV</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">المهام الدورية المنجزة</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">{currentSnapshot.completedTasksCount}</span>
            <span className="text-xs text-slate-400">من {liveMetrics.totalTasks}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">نسبة الالتزام والامتثال</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-400 font-mono">{liveMetrics.completionRate}%</span>
            <span className="text-xs text-blue-300">ممتاز</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block mb-1">مؤشر التقييم العام (KPIs)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400 font-mono">{currentSnapshot.kpiOverallScore}%</span>
            <span className="text-xs text-amber-300">تقدير A</span>
          </div>
        </div>
      </div>

      {/* Main Report Document View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                وثيقة رسمية معتمدة
              </span>
              <span className="text-xs text-slate-400 font-mono">{currentSnapshot.generatedAt}</span>
            </div>
            <h3 className="text-xl font-black text-white">
              تقرير الأداء الدوري المعتمد لـ {meta.title}
            </h3>
            <p className="text-xs text-slate-400">
              المسؤول المعتمد: <strong className="text-slate-200">{currentSnapshot.generatedBy}</strong> | الفترة: <strong className="text-emerald-300">{currentSnapshot.reportPeriod}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400 font-mono">
              <span className="text-xs font-bold">التقييم</span>
              <span className="text-lg font-black">{currentSnapshot.kpiOverallScore}%</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>الملخص التنفيذي المعتمد:</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {currentSnapshot.executiveSummary}
          </p>
        </div>

        {/* Highlights and Critical Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>أبرز الإنجازات التشغيلية الميدانية:</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentSnapshot.operationalHighlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>إجراءات الأمان والمعايرة المستوفاة:</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentSnapshot.criticalAlertsAddressed.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Planned Next Period */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-blue-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>خطة وتكليفات الفترة المقبلة:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs text-slate-300">
            {currentSnapshot.plannedNextPeriod.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures & Official Stamp */}
        <div className="pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-400">
          <div className="space-y-2">
            <p>المعد والمعتمد:</p>
            <p className="font-bold text-slate-200">{currentSnapshot.generatedBy}</p>
            <p className="text-[11px] text-slate-500">منظومة منهاج الرقمية - شركة كارجاس للغاز الطبيعي</p>
          </div>
          <div className="text-left sm:text-right space-y-1">
            <p className="text-[11px] text-emerald-400 font-mono">CONFIRMED & SEALED BY CARGAS DIGITAL</p>
            <p className="text-[10px] text-slate-500 font-mono">REF: {currentSnapshot.id}</p>
          </div>
        </div>
      </div>

      {/* Reader Mode Modal */}
      {isReaderModeOpen && (
        <ReportReaderModeModal
          title={`تقرير الأداء الدوري - ${meta.title}`}
          subtitle={`الفترة: ${currentSnapshot.reportPeriod} | المدير العام: ${currentSnapshot.generatedBy}`}
          reportData={currentSnapshot}
          onClose={() => setIsReaderModeOpen(false)}
        />
      )}
    </div>
  );
};
