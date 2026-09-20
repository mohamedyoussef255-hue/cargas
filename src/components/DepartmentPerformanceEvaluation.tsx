import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  ShieldCheck,
  Calendar,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Printer,
  Share2,
  X,
  Send,
  FileText,
  Sliders,
  Star,
  Building2,
  UserCheck,
  BarChart3
} from 'lucide-react';
import { DepartmentRole, DepartmentEvaluationReport, DepartmentEvaluationCriterion } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import { INITIAL_DEPARTMENT_EVALUATIONS } from '../data/departmentPeriodicTasksData';

interface DepartmentPerformanceEvaluationProps {
  department: DepartmentRole;
  onExit?: () => void;
  isAdminEvaluator?: boolean;
}

export const DepartmentPerformanceEvaluation: React.FC<DepartmentPerformanceEvaluationProps> = ({
  department,
  onExit,
  isAdminEvaluator = false
}) => {
  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;

  // Local report state
  const [report, setReport] = useState<DepartmentEvaluationReport>(() => {
    return INITIAL_DEPARTMENT_EVALUATIONS[department] || INITIAL_DEPARTMENT_EVALUATIONS.operations;
  });

  const [isEditingScores, setIsEditingScores] = useState<boolean>(false);
  const [tempScores, setTempScores] = useState<Record<string, number>>(() => {
    const scores: Record<string, number> = {};
    report.criteria.forEach(c => { scores[c.id] = c.score; });
    return scores;
  });

  // Calculate overall weighted score
  const calculateOverall = (scoresMap: Record<string, number>) => {
    let total = 0;
    report.criteria.forEach(c => {
      const s = scoresMap[c.id] ?? c.score;
      total += (s * c.weightPercent) / 100;
    });
    return Math.round(total);
  };

  const currentScore = calculateOverall(tempScores);

  const getGrade = (score: number) => {
    if (score >= 95) return { grade: 'A+' as const, label: 'ممتاز مرتفع (Exceeds Expectations)', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };
    if (score >= 90) return { grade: 'A' as const, label: 'ممتاز (Exceeds Standards)', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };
    if (score >= 85) return { grade: 'B+' as const, label: 'جيد جداً مرتفع (Very Good)', color: 'text-blue-400 bg-blue-500/20 border-blue-500/40' };
    if (score >= 80) return { grade: 'B' as const, label: 'جيد (Meets Standards)', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' };
    return { grade: 'C' as const, label: 'مقبول (Needs Improvement)', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40' };
  };

  const gradeInfo = getGrade(report.overallScore);

  // Save adjusted scores
  const handleSaveEvaluation = () => {
    const newOverall = calculateOverall(tempScores);
    const newGrade = getGrade(newOverall);

    const updatedCriteria = report.criteria.map(c => ({
      ...c,
      score: tempScores[c.id] ?? c.score
    }));

    setReport(prev => ({
      ...prev,
      overallScore: newOverall,
      grade: newGrade.grade,
      gradeLabel: newGrade.label,
      criteria: updatedCriteria,
      evaluatedAt: new Date().toISOString().split('T')[0]
    }));

    setIsEditingScores(false);
  };

  // Print Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  // Send WhatsApp PDF summary
  const handleSendWhatsApp = () => {
    const text = `*تقرير تقييم أداء معتمد - شركة كارجاس للغاز الطبيعي*\n` +
      `*الإدارة المحترمة:* ${report.departmentName}\n` +
      `*المدير العام:* ${report.gmName}\n` +
      `*فترة التقييم:* ${report.evaluationPeriod}\n` +
      `*تاريخ الاعتماد:* ${report.evaluatedAt}\n\n` +
      `🏆 *النتيجة والدرجة الإجمالية:* ${report.overallScore}/100 - [ ${report.grade} | ${report.gradeLabel} ]\n\n` +
      `📊 *تفصيل محاور ومعايير التقييم:*\n` +
      report.criteria.map(c => `• ${c.title} (${c.weightPercent}%): *${c.score}/100*`).join('\n') +
      `\n\n` +
      `📋 *الملخص التنفيذي:* ${report.executiveSummary}\n\n` +
      `🌟 *أبرز نقاط القوة:*\n` +
      report.keyStrengths.map(s => `✓ ${s}`).join('\n') +
      `\n\n` +
      `💡 *فرص التحسين والتوصيات:*\n` +
      report.areasOfImprovement.map(a => `← ${a}`).join('\n') +
      `\n\n` +
      `📄 *ملاحظة حفظ كـ PDF:* يمكنك طباعة التقرير من شاشة النظام واختيار "حفظ بتنسيق PDF" لأرشفته رسمياً.\n` +
      `منظومة إدارة المشروعات والمحطات • كارجاس NGV 19544`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Exit, Print, WhatsApp) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>تقرير تقييم الأداء المؤسسي للإدارة</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {report.evaluationPeriod}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              مؤشرات الأداء الرئيسية (KPIs) ونسب الإنجاز ومعايير الجودة المعتمدة
            </p>
          </div>
        </div>

        {/* 3 Main Action Buttons Requested by User */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Button 1: Send via WhatsApp */}
          <button
            id="btn-eval-send-whatsapp"
            onClick={handleSendWhatsApp}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            title="إرسال ملخص التقييم والـ PDF عبر الواتساب"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إرسال التقرير بالواتساب</span>
          </button>

          {/* Button 2: Print Report */}
          <button
            id="btn-eval-print-report"
            onClick={handlePrintReport}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all cursor-pointer"
            title="طباعة التقرير أو حفظه بصيغة PDF"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>طباعة التقرير (PDF)</span>
          </button>

          {/* Button 3: Exit Report */}
          {onExit && (
            <button
              id="btn-eval-exit-report"
              onClick={onExit}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 font-bold text-xs transition-all cursor-pointer"
              title="خروج وإغلاق التقرير والعودة لواجهة الإدارة"
            >
              <X className="w-3.5 h-3.5" />
              <span>خروج من التقرير</span>
            </button>
          )}

          {/* Optional: Edit scores */}
          <button
            onClick={() => setIsEditingScores(!isEditingScores)}
            className="px-2.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs border border-slate-700 cursor-pointer"
            title="تعديل درجات ومحاور التقييم"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 print:border-none print:shadow-none print:p-2 print:bg-white print:text-black">
        
        {/* Printable Official Header */}
        <div className="border-b border-slate-800 print:border-slate-300 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white print:text-slate-900">
                شركة الغاز الطبيعي للسيارات (كارجاس) • CARGAS NGV
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:border-slate-400 print:text-slate-800">
                إحدى شركات قطاع البترول المصري
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white print:text-slate-950">
              بطاقة تقييم الأداء ومؤشرات الإنجاز: {report.departmentName}
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600">
              المدير العام المسؤول: <strong>{report.gmName}</strong> • فترة التقييم: <strong>{report.evaluationPeriod}</strong> • تاريخ التقييم: <strong>{report.evaluatedAt}</strong>
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className={`p-4 rounded-2xl border text-center shrink-0 min-w-[170px] ${gradeInfo.color} print:border-slate-400 print:text-slate-900 print:bg-slate-100`}>
            <span className="text-[11px] block font-bold">النتيجة والدرجة الإجمالية</span>
            <div className="text-3xl sm:text-4xl font-mono font-black mt-0.5">
              {report.overallScore}
              <span className="text-sm font-normal text-slate-400 print:text-slate-600">/100</span>
            </div>
            <span className="text-xs font-bold block mt-1">
              التقدير: {report.grade}
            </span>
            <span className="text-[10px] text-slate-300 print:text-slate-700 block">
              {report.gradeLabel}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 rounded-2xl p-4 sm:p-5 space-y-2">
          <h3 className="text-xs font-bold text-slate-400 print:text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>الملخص التنفيذي وتوصيات الإدارة العليا</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 print:text-slate-800 leading-relaxed">
            {report.executiveSummary}
          </p>
        </div>

        {/* Interactive / Static Criteria Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white print:text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>محاور التقييم ومعايير الجودة والالتزام (KPIs)</span>
            </h3>
            {isEditingScores && (
              <span className="text-xs text-amber-400 font-bold animate-pulse">
                وضع تعديل درجات التقييم مفعل
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.criteria.map((crit) => {
              const currentVal = isEditingScores ? (tempScores[crit.id] ?? crit.score) : crit.score;
              return (
                <div
                  key={crit.id}
                  className="bg-slate-950/50 print:bg-slate-50 border border-slate-800 print:border-slate-300 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-white print:text-slate-900">
                        {crit.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 print:text-slate-600 block">
                        الوزن النسبي: {crit.weightPercent}% • المستهدف: {crit.benchmark}%
                      </span>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-base font-mono font-bold text-emerald-400 print:text-slate-900">
                        {currentVal}
                      </span>
                      <span className="text-xs text-slate-400 print:text-slate-600">/100</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 print:bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        currentVal >= 90 ? 'bg-emerald-500' : currentVal >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${currentVal}%` }}
                    />
                  </div>

                  {/* Slider if editing */}
                  {isEditingScores && (
                    <div className="pt-2 border-t border-slate-800">
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={currentVal}
                        onChange={(e) => setTempScores(prev => ({ ...prev, [crit.id]: Number(e.target.value) }))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                  )}

                  <p className="text-[11px] text-slate-300 print:text-slate-700 leading-relaxed">
                    {crit.notes}
                  </p>
                </div>
              );
            })}
          </div>

          {isEditingScores && (
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditingScores(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveEvaluation}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                حفظ التقييم الجديد (الدرجة: {currentScore}/100)
              </button>
            </div>
          )}
        </div>

        {/* Strengths & Areas of Improvement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Key Strengths */}
          <div className="bg-emerald-950/20 print:bg-emerald-50 border border-emerald-500/30 print:border-emerald-300 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-emerald-300 print:text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>أبرز نقاط القوة والإنجازات المتميزة</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 print:text-slate-800">
              {report.keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas of Improvement */}
          <div className="bg-blue-950/20 print:bg-blue-50 border border-blue-500/30 print:border-blue-300 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-blue-300 print:text-blue-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>فرص التحسين والتوصيات الدورية القادمة</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300 print:text-slate-800">
              {report.areasOfImprovement.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-bold shrink-0">←</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Official Signatures for Print */}
        <div className="border-t border-slate-800 print:border-slate-300 pt-6 mt-6 grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs text-slate-400 print:text-slate-700">
          <div>
            <span className="block font-bold text-slate-300 print:text-slate-900">المدير العام للإدارة</span>
            <span className="block font-medium mt-1">{report.gmName}</span>
            <div className="h-10 mt-2 border-b border-dashed border-slate-700 print:border-slate-400" />
          </div>

          <div>
            <span className="block font-bold text-slate-300 print:text-slate-900">لجنة التقييم والرقابة</span>
            <span className="block font-medium mt-1">{report.evaluatorName}</span>
            <div className="h-10 mt-2 border-b border-dashed border-slate-700 print:border-slate-400" />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="block font-bold text-slate-300 print:text-slate-900">اعتماد إدارة النظام والتحكم</span>
            <span className="block font-medium mt-1">كارجاس للغاز الطبيعي NGV</span>
            <div className="h-10 mt-2 border-b border-dashed border-slate-700 print:border-slate-400" />
          </div>
        </div>

      </div>
    </div>
  );
};
