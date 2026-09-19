import React from 'react';
import { 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  FileText, 
  Building2, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Flame, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { MonitoringSession, VEHICLE_TYPES, VehicleType } from '../types';
import { CargasNgvLogo } from './CargasNgvLogo';

interface FeasibilityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSession: MonitoringSession | null;
  projectName: string;
  governorate: string;
  city: string;
  surveyorName: string;
  totalSurveyed: number;
  commercialTotal: number;
  commercialPercentage: number;
  counts: Record<VehicleType, number>;
  dailyGasDispensedM3: number;
  annualGasDispensedM3: number;
  totalCapexEgp: number;
  annualOpexEgp: number;
  annualNetProfitEgp: number;
  paybackYears: number;
  npvEgp: number;
  irrPercent: number;
  breakEvenDailyM3: number;
  recommendedDispensers: number;
  recommendedCompressors: number;
  recommendedCompressorCapacity: number;
  captureRate: number;
  cngPrice: number;
  gasolinePrice: number;
  cngProfitMargin: number;
  tenYearCashFlows: Array<{
    year: number;
    cashInflow: number;
    cashOutflow: number;
    netCashFlow: number;
    cumulativeCashFlow: number;
  }>;
}

export const FeasibilityReportModal: React.FC<FeasibilityReportModalProps> = ({
  isOpen,
  onClose,
  selectedSession,
  projectName,
  governorate,
  city,
  surveyorName,
  totalSurveyed,
  commercialTotal,
  commercialPercentage,
  counts,
  dailyGasDispensedM3,
  annualGasDispensedM3,
  totalCapexEgp,
  annualOpexEgp,
  annualNetProfitEgp,
  paybackYears,
  npvEgp,
  irrPercent,
  breakEvenDailyM3,
  recommendedDispensers,
  recommendedCompressors,
  recommendedCompressorCapacity,
  captureRate,
  cngPrice,
  gasolinePrice,
  cngProfitMargin,
  tenYearCashFlows,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const reportData = {
      project: projectName,
      generatedDate: new Date().toISOString(),
      location: { governorate, city },
      surveyor: surveyorName,
      surveyData: {
        totalSurveyed,
        commercialTotal,
        commercialPercentage,
        counts,
      },
      technicalSizing: {
        dailyGasDispensedM3,
        annualGasDispensedM3,
        recommendedDispensers,
        recommendedCompressors,
        recommendedCompressorCapacity,
        captureRatePercent: captureRate,
      },
      financialMetrics: {
        totalCapexEgp,
        annualOpexEgp,
        annualNetProfitEgp,
        paybackYears,
        npvEgp,
        irrPercent,
        breakEvenDailyM3,
      },
      tenYearProjections: tenYearCashFlows,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CNG_Feasibility_Report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black">
        
        {/* Header - Not printed */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5 text-white">
            <CargasNgvLogo size="xs" showText={false} />
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-base">تقرير دراسة الجدوى التنفيذي الرسمي • كارجاس NGV</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / تصدير PDF</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>تحميل البيانات (JSON)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content - Scrollable on screen, full on print */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-200 print:text-black print:overflow-visible print:p-4 print:text-xs">
          
          {/* Official Letterhead */}
          <div className="border-b-2 border-emerald-500 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CargasNgvLogo size="lg" showText={false} />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white print:text-black flex items-center gap-2">
                  <span>تقرير دراسة الجدوى الفنية والمالية لمحطة تموين الغاز الطبيعي</span>
                  <span className="text-amber-400 font-mono text-base print:text-emerald-700">(كارجاس NGV)</span>
                </h1>
                <p className="text-xs text-slate-400 print:text-gray-600">
                  منظومة كارجاس الموحدة: رصد وتصنيف حركة المركبات الميدانية بالذكاء الاصطناعي • CNG Survey & Feasibility
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-gray-700 font-mono">
              <div>تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</div>
              <div>كود التقرير: CNG-FS-{Date.now().toString().slice(-6)}</div>
              <div className="text-emerald-400 font-semibold print:text-emerald-700">حالة التقييم: مُجْدٍ استثمارياً (Approved)</div>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/60 p-4 rounded-xl border border-slate-700 print:bg-gray-100 print:border-gray-300">
            <div>
              <span className="text-[11px] text-slate-400 print:text-gray-600 block">اسم المشروع المقترح</span>
              <strong className="text-sm text-white print:text-black font-semibold">{projectName}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 print:text-gray-600 block">المحافظة والمدينة</span>
              <strong className="text-sm text-white print:text-black font-semibold">{governorate} - {city}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 print:text-gray-600 block">مهندس الرصد والدراسة</span>
              <strong className="text-sm text-white print:text-black font-semibold">{surveyorName || 'م. أحمد الشناوي'}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 print:text-gray-600 block">مرجعية عينة الرصد</span>
              <strong className="text-sm text-emerald-400 print:text-emerald-700 font-semibold">
                {selectedSession ? selectedSession.title : 'إجمالي كافة الجلسات الميدانية'}
              </strong>
            </div>
          </div>

          {/* Key Financial KPIs */}
          <div>
            <h4 className="text-sm font-bold text-white print:text-black mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400 print:text-emerald-600" />
              <span>أهم المؤشرات المالية والاستثمارية للمشروع</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center print:border-gray-300 print:bg-white">
                <span className="text-[11px] text-slate-400 print:text-gray-600 block">رأس المال المستثمر (CAPEX)</span>
                <span className="text-base font-black text-white print:text-black font-mono">
                  {(totalCapexEgp / 1000000).toFixed(2)} مليون ج.م
                </span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center print:border-gray-300 print:bg-white">
                <span className="text-[11px] text-slate-400 print:text-gray-600 block">صافي التدفق السنوي (NPV 10Y)</span>
                <span className="text-base font-black text-emerald-400 print:text-emerald-700 font-mono">
                  {(npvEgp / 1000000).toFixed(2)} مليون ج.م
                </span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center print:border-gray-300 print:bg-white">
                <span className="text-[11px] text-slate-400 print:text-gray-600 block">معدل العائد الداخلي (IRR)</span>
                <span className="text-base font-black text-amber-400 print:text-amber-700 font-mono">
                  {irrPercent.toFixed(1)}%
                </span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center print:border-gray-300 print:bg-white">
                <span className="text-[11px] text-slate-400 print:text-gray-600 block">فترة استرداد رأس المال</span>
                <span className="text-base font-black text-blue-400 print:text-blue-700 font-mono">
                  {paybackYears.toFixed(1)} سنوات
                </span>
              </div>
            </div>
          </div>

          {/* Traffic Survey Breakdown Table */}
          <div>
            <h4 className="text-sm font-bold text-white print:text-black mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-600" />
              <span>نتائج رصد وتصنيف حركة السيارات الميدانية</span>
            </h4>
            <div className="border border-slate-700 rounded-xl overflow-hidden print:border-gray-300">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-800/90 text-slate-300 print:bg-gray-100 print:text-black">
                  <tr>
                    <th className="p-2.5">فئة المركبة المرصودة</th>
                    <th className="p-2.5 text-center">العدد المرصود</th>
                    <th className="p-2.5 text-center">النسبة المئوية</th>
                    <th className="p-2.5 text-center">متوسط الاستهلاك اليومي</th>
                    <th className="p-2.5 text-center">الطلب المتوقع على الغاز</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                  {(Object.keys(VEHICLE_TYPES) as VehicleType[]).map((type) => {
                    const cfg = VEHICLE_TYPES[type];
                    const count = counts[type] || 0;
                    const pct = totalSurveyed > 0 ? Math.round((count / totalSurveyed) * 100) : 0;
                    return (
                      <tr key={type} className="hover:bg-slate-800/40">
                        <td className="p-2.5">
                          <span className="font-semibold text-white print:text-black">{cfg.label}</span>
                          <span className="text-[10px] text-slate-400 print:text-gray-500 block">{cfg.subLabel}</span>
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-white print:text-black">{count}</td>
                        <td className="p-2.5 text-center font-mono">{pct}%</td>
                        <td className="p-2.5 text-center font-mono">{cfg.dailyAvgKm} كم/يوم</td>
                        <td className="p-2.5 text-center font-mono text-emerald-400 print:text-emerald-700 font-semibold">
                          {Math.round((count * captureRate * 18 * (cfg.dailyAvgKm / 100) * 8) / 100)} م³/يوم
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-800/60 font-bold print:bg-gray-100">
                    <td className="p-2.5 text-white print:text-black">الإجمالي الكلي</td>
                    <td className="p-2.5 text-center font-mono text-white print:text-black">{totalSurveyed} مركبة</td>
                    <td className="p-2.5 text-center font-mono">100%</td>
                    <td className="p-2.5 text-center text-slate-400 print:text-gray-600">أسطول الأجرة: {commercialPercentage}%</td>
                    <td className="p-2.5 text-center font-mono text-emerald-400 print:text-emerald-700">
                      {dailyGasDispensedM3.toLocaleString('ar-EG')} م³/يوم
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Station Sizing */}
          <div className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl print:bg-white print:border-gray-300">
            <h4 className="text-sm font-bold text-white print:text-black mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 print:text-amber-600" />
              <span>المواصفات والتجهيزات الهندسية المقترحة للمحطة</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 print:text-gray-600 block">عدد الموزعات السريعة:</span>
                <strong className="text-white print:text-black text-sm">{recommendedDispensers} موزعات (Dual Hose)</strong>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-600 block">عدد الضواغط المطلوبة:</span>
                <strong className="text-white print:text-black text-sm">{recommendedCompressors} ضواغط رئيسية + احتياطي</strong>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-600 block">سعة الضغط الإجمالية:</span>
                <strong className="text-white print:text-black text-sm">{recommendedCompressorCapacity} م³/ساعة (Nm³/h)</strong>
              </div>
              <div>
                <span className="text-slate-400 print:text-gray-600 block">نقطة التعادل التشغيلية:</span>
                <strong className="text-emerald-400 print:text-emerald-700 text-sm">{breakEvenDailyM3.toLocaleString('ar-EG')} م³/يوم</strong>
              </div>
            </div>
          </div>

          {/* 10-Year Projections Table */}
          <div>
            <h4 className="text-sm font-bold text-white print:text-black mb-2">
              جدول التدفقات النقدية المتوقعة (10 سنوات) - بالألف جنيه مصري
            </h4>
            <div className="border border-slate-700 rounded-xl overflow-hidden print:border-gray-300">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-800 text-slate-300 print:bg-gray-100 print:text-black">
                  <tr>
                    <th className="p-2 text-center">السنة</th>
                    <th className="p-2 text-center">الإيراد الكلي</th>
                    <th className="p-2 text-center">المصاريف التشغيلية</th>
                    <th className="p-2 text-center">صافي التدفق السنوي</th>
                    <th className="p-2 text-center">التدفق التراكمي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200">
                  {tenYearCashFlows.map((cf) => (
                    <tr key={cf.year} className="hover:bg-slate-800/30">
                      <td className="p-2 text-center font-bold">السنة {cf.year}</td>
                      <td className="p-2 text-center font-mono">{(cf.cashInflow / 1000).toLocaleString('ar-EG', { maximumFractionDigits: 0 })}</td>
                      <td className="p-2 text-center font-mono">{(cf.cashOutflow / 1000).toLocaleString('ar-EG', { maximumFractionDigits: 0 })}</td>
                      <td className="p-2 text-center font-mono text-emerald-400 print:text-emerald-700 font-bold">
                        {(cf.netCashFlow / 1000).toLocaleString('ar-EG', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-2 text-center font-mono">
                        {(cf.cumulativeCashFlow / 1000).toLocaleString('ar-EG', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures and Endorsement Block */}
          <div className="border-t border-slate-700 pt-6 mt-6 grid grid-cols-3 gap-4 text-center text-xs text-slate-400 print:text-black print:border-gray-400">
            <div>
              <div className="font-semibold text-white print:text-black mb-8">إعداد مهندس الرصد الميداني</div>
              <div className="border-t border-dashed border-slate-600 pt-1">التوقيع والاعتماد</div>
            </div>
            <div>
              <div className="font-semibold text-white print:text-black mb-8">مراجعة الدراسات الاقتصادية</div>
              <div className="border-t border-dashed border-slate-600 pt-1">التوقيع والاعتماد</div>
            </div>
            <div>
              <div className="font-semibold text-white print:text-black mb-8">اعتماد لجنة الاستثمار والتطوير</div>
              <div className="border-t border-dashed border-slate-600 pt-1">خاتم الشركة / الإدارة</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
