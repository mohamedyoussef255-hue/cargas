import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Coins, 
  Leaf, 
  Flame, 
  ArrowUpRight, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  FileText,
  Printer,
  Sliders,
  Zap,
  Gauge,
  HelpCircle,
  Car,
  Bus,
  RefreshCw,
  Clock,
  ShieldCheck,
  Briefcase,
  Settings,
  Award
} from 'lucide-react';
import { MonitoringSession, VEHICLE_TYPES, VehicleType, FuelPricing, FeasibilityDefaults, createDefaultVehicleCounts } from '../types';
import { FeasibilityReportModal } from './FeasibilityReportModal';
import { CargasNgvLogo } from './CargasNgvLogo';

interface CngFeasibilityAnalyticsProps {
  sessions: MonitoringSession[];
  pricing?: FuelPricing;
  feasibilityDefaults?: FeasibilityDefaults;
  onNavigateToAdmin?: () => void;
  onNavigateToDepartments?: () => void;
}

export const CngFeasibilityAnalytics: React.FC<CngFeasibilityAnalyticsProps> = ({ 
  sessions,
  pricing,
  feasibilityDefaults,
  onNavigateToAdmin,
  onNavigateToDepartments,
}) => {
  // Active sub-tab inside the Feasibility Platform
  const [subTab, setSubTab] = useState<'dashboard' | 'technical' | 'financial' | 'cashflows' | 'fleet_savings' | 'sensitivity'>('dashboard');

  // Selected monitoring session for the study ('all' or session.id)
  const [selectedSessionId, setSelectedSessionId] = useState<string>('all');

  // Project details
  const [projectName, setProjectName] = useState<string>('محطة ومركز تحويل الغاز الطبيعي النموذجي');
  const [targetGovernorate, setTargetGovernorate] = useState<string>('الجيزة');
  const [targetCity, setTargetCity] = useState<string>('مجمع مواقف المنيب');
  const [surveyorName, setSurveyorName] = useState<string>('م. أحمد الشناوي');

  // Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Economic Parameters
  const [gasolinePrice, setGasolinePrice] = useState<number>(() => pricing?.gasoline92Price ?? 15.25);
  const [cngPrice, setCngPrice] = useState<number>(() => pricing?.cngPrice ?? 7.00);
  const [cngProfitMargin, setCngProfitMargin] = useState<number>(() => feasibilityDefaults?.cngProfitMarginPerM3 ?? 1.50); // EGP profit margin per m3
  const [conversionCostEgp, setConversionCostEgp] = useState<number>(14500);
  const [conversionNetMarginPerCar, setConversionNetMarginPerCar] = useState<number>(() => feasibilityDefaults?.conversionNetMarginPerCar ?? 2200);
  const [monthlyConversionsCount, setMonthlyConversionsCount] = useState<number>(() => feasibilityDefaults?.monthlyConversionsCount ?? 45);

  // Traffic & Sizing Assumptions
  const [captureRate, setCaptureRate] = useState<number>(() => feasibilityDefaults?.captureRatePercent ?? 5.5); // % of passing traffic that fuels at this station
  const [operatingHoursPerDay, setOperatingHoursPerDay] = useState<number>(() => feasibilityDefaults?.operatingHoursPerDay ?? 18);
  const [discountRate, setDiscountRate] = useState<number>(() => feasibilityDefaults?.discountRatePercent ?? 14); // % for NPV

  // CAPEX Parameters (in EGP)
  const [capexCompressors, setCapexCompressors] = useState<number>(() => feasibilityDefaults?.capexCompressors ?? 6500000);
  const [capexCascades, setCapexCascades] = useState<number>(() => feasibilityDefaults?.capexCascades ?? 2400000);
  const [capexDispensers, setCapexDispensers] = useState<number>(() => feasibilityDefaults?.capexDispensers ?? 1800000);
  const [capexGasPipeline, setCapexGasPipeline] = useState<number>(() => feasibilityDefaults?.capexGasPipeline ?? 2200000);
  const [capexCivilAndCanopy, setCapexCivilAndCanopy] = useState<number>(() => feasibilityDefaults?.capexCivilAndCanopy ?? 3800000);
  const [capexConversionCenter, setCapexConversionCenter] = useState<number>(() => feasibilityDefaults?.capexConversionCenter ?? 1500000);
  const [capexPermitsAndSafety, setCapexPermitsAndSafety] = useState<number>(() => feasibilityDefaults?.capexPermitsAndSafety ?? 900000);

  // OPEX Parameters (Annual in EGP)
  const [opexElectricity, setOpexElectricity] = useState<number>(() => feasibilityDefaults?.opexElectricityAnnual ?? 950000);
  const [opexMaintenance, setOpexMaintenance] = useState<number>(() => feasibilityDefaults?.opexMaintenanceAnnual ?? 680000);
  const [opexLabor, setOpexLabor] = useState<number>(() => feasibilityDefaults?.opexLaborAnnual ?? 840000);
  const [opexInsuranceAndAdmin, setOpexInsuranceAndAdmin] = useState<number>(() => feasibilityDefaults?.opexInsuranceAndAdmin ?? 420000);

  // Synchronize when global settings are updated in the Control Panel
  useEffect(() => {
    if (pricing) {
      setCngPrice(pricing.cngPrice);
      setGasolinePrice(pricing.gasoline92Price);
    }
  }, [pricing]);

  useEffect(() => {
    if (feasibilityDefaults) {
      setCapexCompressors(feasibilityDefaults.capexCompressors);
      setCapexCascades(feasibilityDefaults.capexCascades);
      setCapexDispensers(feasibilityDefaults.capexDispensers);
      setCapexGasPipeline(feasibilityDefaults.capexGasPipeline);
      setCapexCivilAndCanopy(feasibilityDefaults.capexCivilAndCanopy);
      setCapexConversionCenter(feasibilityDefaults.capexConversionCenter);
      setCapexPermitsAndSafety(feasibilityDefaults.capexPermitsAndSafety);
      setOpexElectricity(feasibilityDefaults.opexElectricityAnnual);
      setOpexMaintenance(feasibilityDefaults.opexMaintenanceAnnual);
      setOpexLabor(feasibilityDefaults.opexLaborAnnual);
      setOpexInsuranceAndAdmin(feasibilityDefaults.opexInsuranceAndAdmin);
      setCngProfitMargin(feasibilityDefaults.cngProfitMarginPerM3);
      setCaptureRate(feasibilityDefaults.captureRatePercent);
      setConversionNetMarginPerCar(feasibilityDefaults.conversionNetMarginPerCar);
      setMonthlyConversionsCount(feasibilityDefaults.monthlyConversionsCount);
      setDiscountRate(feasibilityDefaults.discountRatePercent);
      setOperatingHoursPerDay(feasibilityDefaults.operatingHoursPerDay);

      if (feasibilityDefaults.customFields) {
        const initialCustomValues: Record<string, number> = {};
        feasibilityDefaults.customFields.forEach(f => {
          if (f.isCustom) {
            initialCustomValues[f.id] = f.defaultValue;
          }
        });
        setCustomFieldsValues(initialCustomValues);
      }
    }
  }, [feasibilityDefaults]);

  // Dynamic Custom Feasibility Fields state
  const [customFieldsValues, setCustomFieldsValues] = useState<Record<string, number>>({});

  // Helper lookup functions for dynamic labels & visibility
  const getFieldInfo = (key: string) => {
    return feasibilityDefaults?.customFields?.find(f => f.key === key);
  };
  const getFieldLabel = (key: string, fallback: string) => {
    const f = getFieldInfo(key);
    return f ? f.label : fallback;
  };
  const getFieldSubLabel = (key: string, fallback?: string) => {
    const f = getFieldInfo(key);
    return f?.subLabel || fallback || '';
  };
  const isFieldVisible = (key: string) => {
    const f = getFieldInfo(key);
    return f ? f.isVisible : true;
  };

  // Active Session Resolution
  const selectedSession = useMemo(() => {
    if (selectedSessionId === 'all') return null;
    return sessions.find(s => s.id === selectedSessionId) || null;
  }, [sessions, selectedSessionId]);

  // Aggregate or session counts
  const activeCounts: Record<VehicleType, number> = useMemo(() => {
    const counts: Record<VehicleType, number> = createDefaultVehicleCounts();

    if (selectedSession) {
      (Object.keys(counts) as VehicleType[]).forEach((type) => {
        counts[type] = selectedSession.counts[type] || 0;
      });
    } else {
      sessions.forEach((s) => {
        (Object.keys(counts) as VehicleType[]).forEach((type) => {
          counts[type] += s.counts[type] || 0;
        });
      });
    }

    return counts;
  }, [sessions, selectedSession]);

  const totalSurveyed = useMemo(() => {
    return Object.values(activeCounts).reduce((a, b) => a + b, 0);
  }, [activeCounts]);

  // Commercial Fleet proportion
  const commercialTotal = 
    activeCounts.microbus + 
    activeCounts.taxi + 
    activeCounts.suzuki_van + 
    activeCounts.peugeot_station;

  const commercialPercentage = totalSurveyed > 0 
    ? Math.round((commercialTotal / totalSurveyed) * 100) 
    : 0;

  // Total Survey Duration Hours to compute hourly flow rate
  const surveyHours = useMemo(() => {
    if (selectedSession) {
      return Math.max(1, selectedSession.durationSeconds / 3600);
    }
    const totalSecs = sessions.reduce((acc, s) => acc + (s.durationSeconds || 3600), 0);
    return Math.max(1, totalSecs / 3600);
  }, [sessions, selectedSession]);

  // Hourly Rate and Daily Projected Traffic
  const hourlyTrafficRate = Math.round(totalSurveyed / surveyHours);
  const dailyProjectedPassingTraffic = hourlyTrafficRate * operatingHoursPerDay;

  // Station Traffic & Sizing: Daily Gas Dispensed
  // Weighted avg m3 per vehicle type:
  const avgM3PerType: Record<VehicleType, number> = {
    private: 12,
    taxi: 16,
    microbus: 26,
    van: 15,
    minibus: 28,
    pickup: 20,
    bus: 55,
    motorcycle: 5,
    suzuki_van: 15,
    peugeot_station: 24,
  };

  const dailyFuelingVehicles = Math.round(dailyProjectedPassingTraffic * (captureRate / 100));

  const weightedAvgM3PerVehicle = useMemo(() => {
    if (totalSurveyed === 0) return 18;
    let sum = 0;
    (Object.keys(activeCounts) as VehicleType[]).forEach((type) => {
      sum += (activeCounts[type] || 0) * avgM3PerType[type];
    });
    return Math.round((sum / totalSurveyed) * 10) / 10;
  }, [activeCounts, totalSurveyed]);

  const dailyGasDispensedM3 = Math.round(dailyFuelingVehicles * weightedAvgM3PerVehicle);
  const annualGasDispensedM3 = dailyGasDispensedM3 * 365;

  // Recommended Equipment
  const recommendedDispensers = Math.max(4, Math.ceil(dailyFuelingVehicles / 160) * 2);
  const recommendedCompressors = dailyGasDispensedM3 > 12000 ? 3 : 2;
  const recommendedCompressorCapacity = Math.round((dailyGasDispensedM3 / operatingHoursPerDay) * 1.35); // with 35% peak factor

  // Dynamic Custom CAPEX and OPEX totals
  const customCapexTotal = useMemo(() => {
    if (!feasibilityDefaults?.customFields) return 0;
    return feasibilityDefaults.customFields
      .filter(f => f.isCustom && f.category === 'capex' && f.isVisible)
      .reduce((sum, f) => sum + (customFieldsValues[f.id] ?? f.defaultValue), 0);
  }, [feasibilityDefaults, customFieldsValues]);

  const customOpexTotal = useMemo(() => {
    if (!feasibilityDefaults?.customFields) return 0;
    return feasibilityDefaults.customFields
      .filter(f => f.isCustom && f.category === 'opex' && f.isVisible)
      .reduce((sum, f) => sum + (customFieldsValues[f.id] ?? f.defaultValue), 0);
  }, [feasibilityDefaults, customFieldsValues]);

  // CAPEX & OPEX Totals
  const totalCapexEgp = 
    (isFieldVisible('capexCompressors') ? capexCompressors : 0) + 
    (isFieldVisible('capexCascades') ? capexCascades : 0) + 
    (isFieldVisible('capexDispensers') ? capexDispensers : 0) + 
    (isFieldVisible('capexGasPipeline') ? capexGasPipeline : 0) + 
    (isFieldVisible('capexCivilAndCanopy') ? capexCivilAndCanopy : 0) + 
    (isFieldVisible('capexConversionCenter') ? capexConversionCenter : 0) + 
    (isFieldVisible('capexPermitsAndSafety') ? capexPermitsAndSafety : 0) +
    customCapexTotal;

  const annualOpexEgp = 
    (isFieldVisible('opexElectricityAnnual') ? opexElectricity : 0) + 
    (isFieldVisible('opexMaintenanceAnnual') ? opexMaintenance : 0) + 
    (isFieldVisible('opexLaborAnnual') ? opexLabor : 0) + 
    (isFieldVisible('opexInsuranceAndAdmin') ? opexInsuranceAndAdmin : 0) +
    customOpexTotal;

  // Revenues & Margins
  const annualGasGrossProfit = annualGasDispensedM3 * cngProfitMargin;
  const annualConversionGrossProfit = monthlyConversionsCount * 12 * conversionNetMarginPerCar;
  const annualAncillaryProfit = Math.round(dailyFuelingVehicles * 365 * 3.5); // Lubes, quick shop
  const annualTotalGrossProfit = annualGasGrossProfit + annualConversionGrossProfit + annualAncillaryProfit;
  const annualNetCashFlow = Math.max(0, annualTotalGrossProfit - annualOpexEgp);

  // Payback period
  const paybackYears = annualNetCashFlow > 0 ? totalCapexEgp / annualNetCashFlow : 99;

  // 10-Year Discounted Cash Flow Projection
  const tenYearCashFlows = useMemo(() => {
    const list = [];
    let cumulative = -totalCapexEgp;
    const r = discountRate / 100;

    for (let yr = 1; yr <= 10; yr++) {
      // Modest 3.5% growth in gas demand in years 2-5 as conversion center expands
      const growthMultiplier = yr === 1 ? 1.0 : Math.min(1.30, 1 + (yr - 1) * 0.04);
      const yearInflow = Math.round(annualTotalGrossProfit * growthMultiplier);
      const yearOutflow = Math.round(annualOpexEgp * (1 + (yr - 1) * 0.03)); // 3% inflation on opex
      const yearNet = yearInflow - yearOutflow;
      cumulative += yearNet;
      const discounted = yearNet / Math.pow(1 + r, yr);

      list.push({
        year: yr,
        cashInflow: yearInflow,
        cashOutflow: yearOutflow,
        netCashFlow: yearNet,
        cumulativeCashFlow: cumulative,
        discountedCashFlow: discounted,
      });
    }
    return list;
  }, [totalCapexEgp, annualTotalGrossProfit, annualOpexEgp, discountRate]);

  // Net Present Value (NPV)
  const npvEgp = useMemo(() => {
    const sumDiscounted = tenYearCashFlows.reduce((acc, row) => acc + row.discountedCashFlow, 0);
    return Math.round(sumDiscounted - totalCapexEgp);
  }, [tenYearCashFlows, totalCapexEgp]);

  // Internal Rate of Return (IRR) approximation
  const irrPercent = useMemo(() => {
    if (annualNetCashFlow <= 0) return 0;
    // Simple iterative solver for IRR
    let low = 0.01;
    let high = 1.0;
    for (let iter = 0; iter < 40; iter++) {
      const mid = (low + high) / 2;
      let npvMid = -totalCapexEgp;
      for (let yr = 1; yr <= 10; yr++) {
        const growth = yr === 1 ? 1.0 : Math.min(1.30, 1 + (yr - 1) * 0.04);
        const net = (annualTotalGrossProfit * growth) - (annualOpexEgp * (1 + (yr - 1) * 0.03));
        npvMid += net / Math.pow(1 + mid, yr);
      }
      if (npvMid > 0) {
        low = mid;
      } else {
        high = mid;
      }
    }
    return (low + high) / 2 * 100;
  }, [totalCapexEgp, annualTotalGrossProfit, annualOpexEgp]);

  // Break-even daily volume in m3
  const breakEvenDailyM3 = useMemo(() => {
    if (cngProfitMargin <= 0) return 0;
    const dailyFixedCosts = annualOpexEgp / 365;
    const dailyOtherProfits = (annualConversionGrossProfit + annualAncillaryProfit) / 365;
    const requiredGasProfitDaily = Math.max(0, dailyFixedCosts - dailyOtherProfits);
    return Math.round(requiredGasProfitDaily / cngProfitMargin);
  }, [annualOpexEgp, annualConversionGrossProfit, annualAncillaryProfit, cngProfitMargin]);

  // Monthly savings calculation per vehicle type
  const calculateTypeSavings = (dailyKm: number, litersPer100Km: number) => {
    const dailyGasCost = (dailyKm / 100) * litersPer100Km * gasolinePrice;
    const dailyCngCost = (dailyKm / 100) * litersPer100Km * cngPrice;
    const dailySavings = Math.max(0, dailyGasCost - dailyCngCost);
    return Math.round(dailySavings * 30);
  };

  const calculatePaybackMonths = (monthlySavings: number) => {
    if (monthlySavings <= 0) return 0;
    return Number((conversionCostEgp / monthlySavings).toFixed(1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Banner: Project Title, Session Selector & Report Trigger */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <CargasNgvLogo size="lg" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>منصة دراسة الجدوى المتكاملة لمحطات ومراكز تحويل الغاز الطبيعي</span>
                  <span className="text-amber-400 font-mono text-sm">(كارجاس NGV)</span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                نموذج مالي وهندسي تفاعلي يربط نتائج الرصد الميداني بالكاميرا بتوقعات الاستثمار والربحية لمحطات كارجاس
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Session Selector */}
            <div className="relative">
              <select
                id="select-feasibility-session"
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 font-medium focus:border-emerald-500 focus:outline-none cursor-pointer"
              >
                <option value="all">📊 إجمالي كافة الجلسات الميدانية ({sessions.length} جلسات)</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    📍 {s.title} ({s.governorate} - {Object.values(s.counts).reduce((a, b) => a + b, 0)} مركبة)
                  </option>
                ))}
              </select>
            </div>

            {/* Department Reviews Button */}
            {onNavigateToDepartments && (
              <button
                onClick={onNavigateToDepartments}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900/70 hover:bg-blue-800 border border-blue-500/50 text-blue-300 text-xs font-semibold transition-colors cursor-pointer shadow"
                title="مراجعة واعتماد الإدارات الخمس (المشروعات، السلامة، التشغيل، القانونية، المالية)"
              >
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>مراجعة واعتماد الإدارات</span>
              </button>
            )}

            {/* Official Report Button */}
            <button
              id="btn-open-feasibility-report"
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>تقرير دراسة الجدوى التنفيذي</span>
            </button>

            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
                title="تعديل تكاليف الإنشاء وأسعار الطاقة في لوحة التحكم"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">لوحة التحكم والمحددات</span>
              </button>
            )}
          </div>

        </div>

        {/* Selected Scope Indicator & Fast Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-700/60 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">عينة المركبات المرصودة</span>
            <span className="text-base sm:text-lg font-black text-white font-mono">{totalSurveyed} مركبة</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">({hourlyTrafficRate} مركبة/ساعة)</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">حصة أسطول الأجرة والنقل</span>
            <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">{commercialPercentage}%</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">({commercialTotal} مركبة تجارية)</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">الطلب اليومي التقديري للغاز</span>
            <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
              {dailyGasDispensedM3.toLocaleString('ar-EG')} م³/يوم
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">({dailyFuelingVehicles} سيارة مموّنة/يوم)</span>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">فترة استرداد رأس المال</span>
            <span className="text-base sm:text-lg font-black text-blue-400 font-mono">
              {paybackYears.toFixed(1)} سنوات
            </span>
            <span className="text-[10px] text-emerald-400 block mt-0.5 font-semibold">IRR: {irrPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 no-scrollbar">
        <button
          id="subtab-dashboard"
          onClick={() => setSubTab('dashboard')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'dashboard'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>المؤشرات الاستثمارية (KPIs)</span>
        </button>

        <button
          id="subtab-technical"
          onClick={() => setSubTab('technical')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'technical'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>الدراسة الفنية والمعدات</span>
        </button>

        <button
          id="subtab-financial"
          onClick={() => setSubTab('financial')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'financial'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>التكاليف (CAPEX / OPEX)</span>
        </button>

        <button
          id="subtab-cashflows"
          onClick={() => setSubTab('cashflows')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'cashflows'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>التدفقات النقدية لـ 10 سنوات</span>
        </button>

        <button
          id="subtab-fleet_savings"
          onClick={() => setSubTab('fleet_savings')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'fleet_savings'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>جدوى وفر المركبات والأساطيل</span>
        </button>

        <button
          id="subtab-sensitivity"
          onClick={() => setSubTab('sensitivity')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'sensitivity'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>تحليل الحساسية والسيناريوهات</span>
        </button>
      </div>

      {/* SUB-VIEW 1: EXECUTIVE DASHBOARD */}
      {subTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* 4 Big Key Investment Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="text-slate-400 text-xs font-medium mb-1 flex items-center justify-between">
                <span>صافي القيمة الحالية (NPV 10Y)</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {(npvEgp / 1000000).toFixed(2)} مليون ج.م
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                محسوبة بمعدل خصم {discountRate}% على مدى 10 سنوات
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="text-slate-400 text-xs font-medium mb-1 flex items-center justify-between">
                <span>معدل العائد الداخلي (IRR)</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-300 font-mono">
                {irrPercent.toFixed(1)}%
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                يتجاوز تكلفة الفرصة البديلة ومعدل الفائدة البنكية
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="text-slate-400 text-xs font-medium mb-1 flex items-center justify-between">
                <span>فترة استرداد رأس المال</span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-blue-400 font-mono">
                {paybackYears.toFixed(1)} سنة
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                استرداد تكلفة المشروع البالغة {(totalCapexEgp / 1000000).toFixed(2)} مليون ج.م
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="text-slate-400 text-xs font-medium mb-1 flex items-center justify-between">
                <span>نقطة التعادل اليومية (Break-even)</span>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-300 font-mono">
                {breakEvenDailyM3.toLocaleString('ar-EG')} م³/يوم
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                يمثل فقط {dailyGasDispensedM3 > 0 ? Math.round((breakEvenDailyM3 / dailyGasDispensedM3) * 100) : 0}% من حجم المبيعات المتوقعة
              </p>
            </div>

          </div>

          {/* Sizing & Revenue Breakdown Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Structure */}
            <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                <span>هيكل الإيرادات السنوية المتوقعة لمحطة الغاز</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* Gas retail */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">إيرادات هامش بيع الغاز الطبيعي</div>
                    <div className="text-slate-400 text-[11px]">
                      {annualGasDispensedM3.toLocaleString('ar-EG')} م³/سنة × {cngProfitMargin.toFixed(2)} ج.م/م³ هامش
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 font-bold text-base block">
                      {(annualGasGrossProfit / 1000000).toFixed(2)} مليون ج.م
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {Math.round((annualGasGrossProfit / annualTotalGrossProfit) * 100)}% من الإجمالي
                    </span>
                  </div>
                </div>

                {/* Conversion Center */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">أرباح مركز تحويل وصيانة السيارات الملحق</div>
                    <div className="text-slate-400 text-[11px]">
                      {monthlyConversionsCount * 12} سيارة محولة سنوياً × {conversionNetMarginPerCar.toLocaleString('ar-EG')} ج.م ربح الطقم
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 font-bold text-base block">
                      {(annualConversionGrossProfit / 1000000).toFixed(2)} مليون ج.م
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {Math.round((annualConversionGrossProfit / annualTotalGrossProfit) * 100)}% من الإجمالي
                    </span>
                  </div>
                </div>

                {/* Ancillary */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">خدمات مرافقة (تغيير زيوت، مغسلة سريعة، متجر)</div>
                    <div className="text-slate-400 text-[11px]">
                      متوسط 3.50 ج.م عائد إضافي لكل سيارة مموّنة
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 font-bold text-base block">
                      {(annualAncillaryProfit / 1000000).toFixed(2)} مليون ج.م
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {Math.round((annualAncillaryProfit / annualTotalGrossProfit) * 100)}% من الإجمالي
                    </span>
                  </div>
                </div>

                {/* Total Gross Profit */}
                <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-between font-bold">
                  <span className="text-emerald-200">إجمالي الإيرادات السنوية الإجمالية:</span>
                  <span className="text-emerald-300 font-mono text-lg">
                    {(annualTotalGrossProfit / 1000000).toFixed(2)} مليون ج.م/سنة
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Sizing summary */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>المواصفات التقديرية الموصى بها</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">عدد الموزعات السريعة (Dispensers):</span>
                  <strong className="text-white text-sm font-mono block mt-0.5">
                    {recommendedDispensers} موزعات مزدوجة (Dual-Hose)
                  </strong>
                  <span className="text-[10px] text-emerald-400">تستوعب تموين {recommendedDispensers * 2} سيارات متزامنة</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">قدرة الضواغط الهندسية:</span>
                  <strong className="text-white text-sm font-mono block mt-0.5">
                    {recommendedCompressors} ضواغط بقوة {recommendedCompressorCapacity} م³/ساعة
                  </strong>
                  <span className="text-[10px] text-slate-400">تشمل خط احتياطي N+1 لضمان استمرارية التشغيل</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                  <span className="text-slate-400 block text-[11px]">طاقة مركز التحويل الشهري:</span>
                  <strong className="text-white text-sm font-mono block mt-0.5">
                    {monthlyConversionsCount} مركبة/شهر (2 خط تحويل وفحص)
                  </strong>
                  <span className="text-[10px] text-blue-400">معتمد من كبرى شركات الغاز الطبيعي</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-VIEW 2: TECHNICAL SIZING & EQUIPMENT */}
      {subTab === 'technical' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>معايير دراسة الطاقة الاستيعابية وتجهيزات المحطة الهندسية</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  نسبة استقطاب المحطة من حركة المرور (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={captureRate}
                    onChange={(e) => setCaptureRate(parseFloat(e.target.value) || 5)}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="font-mono text-emerald-400 font-bold text-sm w-12 text-left">
                    {captureRate}%
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  متوسط المحطات الحضرية 4% - 8% بناءً على سهولة الدخول والخروج
                </span>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  ساعات التشغيل الفعلي للمحطة يومياً
                </label>
                <input
                  type="number"
                  min="12"
                  max="24"
                  value={operatingHoursPerDay}
                  onChange={(e) => setOperatingHoursPerDay(parseInt(e.target.value) || 18)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">المحطات الحيوية تعمل 18 إلى 24 ساعة</span>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  متوسط حجم تفويلة الغاز المرجح (م³/سيارة)
                </label>
                <input
                  type="number"
                  value={weightedAvgM3PerVehicle}
                  disabled
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-slate-400 text-sm font-mono cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400">مستخرج آلياً حسب توزيع الفئات الخمس المرصودة</span>
              </div>
            </div>
          </div>

          {/* Technical Fleet Breakdown Table */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h4 className="font-bold text-white text-sm">
                توزيع استهلاك الغاز الطبيعي اليومي بحسب الفئات الخمس
              </h4>
              <span className="text-xs text-emerald-400 font-mono">
                إجمالي الطلب: {dailyGasDispensedM3.toLocaleString('ar-EG')} م³/يوم
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-3">الفئة</th>
                    <th className="p-3 text-center">العدد المرصود</th>
                    <th className="p-3 text-center">النسبة المئوية</th>
                    <th className="p-3 text-center">السيارات المموّنة/يوم</th>
                    <th className="p-3 text-center">متوسط التفويلة</th>
                    <th className="p-3 text-center">حجم الغاز اليومي (م³)</th>
                    <th className="p-3 text-center">الإيراد اليومي المتوقع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(Object.keys(VEHICLE_TYPES) as VehicleType[]).map((type) => {
                    const cfg = VEHICLE_TYPES[type];
                    const count = activeCounts[type] || 0;
                    const pct = totalSurveyed > 0 ? (count / totalSurveyed) : 0;
                    const fuelingTypeVehicles = Math.round(dailyFuelingVehicles * pct);
                    const avgM3 = avgM3PerType[type];
                    const typeDailyM3 = fuelingTypeVehicles * avgM3;
                    const dailyGrossMargin = typeDailyM3 * cngProfitMargin;

                    return (
                      <tr key={type} className="hover:bg-slate-800/40">
                        <td className="p-3">
                          <div className="font-bold text-white">{cfg.label}</div>
                          <div className="text-[11px] text-slate-400">{cfg.subLabel}</div>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-white">{count}</td>
                        <td className="p-3 text-center font-mono">{(pct * 100).toFixed(1)}%</td>
                        <td className="p-3 text-center font-mono text-emerald-400 font-bold">{fuelingTypeVehicles}</td>
                        <td className="p-3 text-center font-mono text-slate-300">{avgM3} م³</td>
                        <td className="p-3 text-center font-mono text-amber-300 font-bold">
                          {typeDailyM3.toLocaleString('ar-EG')} م³
                        </td>
                        <td className="p-3 text-center font-mono text-emerald-300">
                          {dailyGrossMargin.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: CAPEX & OPEX FINANCIAL BREAKDOWN */}
      {subTab === 'financial' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CAPEX Breakdown */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span>التكاليف الاستثمارية الرأسمالية (CAPEX)</span>
                </h3>
                <span className="font-mono font-black text-blue-400 text-base">
                  {(totalCapexEgp / 1000000).toFixed(2)} مليون ج.م
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {isFieldVisible('capexCompressors') && (
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {getFieldLabel('capexCompressors', 'محطة الضواغط ومجففات الغاز عالي الضغط (جنيه)')}
                    </label>
                    <input
                      type="number"
                      step="100000"
                      value={capexCompressors}
                      onChange={(e) => setCapexCompressors(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {isFieldVisible('capexCascades') && (
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {getFieldLabel('capexCascades', 'خزانات التخزين الأسطواني البنكي (Cascades)')}
                    </label>
                    <input
                      type="number"
                      step="100000"
                      value={capexCascades}
                      onChange={(e) => setCapexCascades(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {isFieldVisible('capexDispensers') && (
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {getFieldLabel('capexDispensers', 'موزعات الغاز السريعة ونقاط البيع (Dispensers & POS)')}
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={capexDispensers}
                      onChange={(e) => setCapexDispensers(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {isFieldVisible('capexGasPipeline') && (
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {getFieldLabel('capexGasPipeline', 'خط التغذية والربط بشبكة الغاز الطبيعي (Gas Pipeline Connection)')}
                    </label>
                    <input
                      type="number"
                      step="100000"
                      value={capexGasPipeline}
                      onChange={(e) => setCapexGasPipeline(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {isFieldVisible('capexCivilAndCanopy') && (
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {getFieldLabel('capexCivilAndCanopy', 'الأعمال المدنية والمظلات والمباني الإدارية والكهرباء')}
                    </label>
                    <input
                      type="number"
                      step="100000"
                      value={capexCivilAndCanopy}
                      onChange={(e) => setCapexCivilAndCanopy(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {isFieldVisible('capexConversionCenter') && (
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {getFieldLabel('capexConversionCenter', 'تجهيزات ورشة ومركز تحويل السيارات الملحق')}
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={capexConversionCenter}
                      onChange={(e) => setCapexConversionCenter(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* User-defined Custom CapEx Fields */}
                {feasibilityDefaults?.customFields
                  ?.filter(f => f.isCustom && f.category === 'capex' && f.isVisible)
                  .map(customField => (
                    <div key={customField.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-blue-500/30">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-blue-300 font-bold">
                          {customField.label} ({customField.unit})
                        </label>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">بند مخصص</span>
                      </div>
                      {customField.subLabel && (
                        <p className="text-[10px] text-slate-400 mb-1">{customField.subLabel}</p>
                      )}
                      <input
                        type="number"
                        step="10000"
                        value={customFieldsValues[customField.id] ?? customField.defaultValue}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setCustomFieldsValues(prev => ({ ...prev, [customField.id]: val }));
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-blue-500/40 text-white font-mono focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* OPEX Breakdown */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span>المصاريف التشغيلية السنوية (OPEX)</span>
                </h3>
                <span className="font-mono font-black text-amber-400 text-base">
                  {(annualOpexEgp / 1000000).toFixed(2)} مليون ج.م/سنة
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {isFieldVisible('opexElectricityAnnual') && (
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {getFieldLabel('opexElectricityAnnual', 'فاتورة استهلاك الكهرباء للضواغط السنوية (جنيه/سنة)')}
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={opexElectricity}
                      onChange={(e) => setOpexElectricity(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {isFieldVisible('opexMaintenanceAnnual') && (
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {getFieldLabel('opexMaintenanceAnnual', 'عقود الصيانة الدورية للضواغط والموزعات وقطع الغيار')}
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={opexMaintenance}
                      onChange={(e) => setOpexMaintenance(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {isFieldVisible('opexLaborAnnual') && (
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {getFieldLabel('opexLaborAnnual', 'أجور ورواتب المهندسين والفنيين والعمال والمحاسبين')}
                    </label>
                    <input
                      type="number"
                      step="50000"
                      value={opexLabor}
                      onChange={(e) => setOpexLabor(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {isFieldVisible('opexInsuranceAndAdmin') && (
                  <div>
                    <label className="block text-slate-300 mb-1">
                      {getFieldLabel('opexInsuranceAndAdmin', 'وثائق التأمين والتراخيص والمصاريف الإدارية والعمومية')}
                    </label>
                    <input
                      type="number"
                      step="25000"
                      value={opexInsuranceAndAdmin}
                      onChange={(e) => setOpexInsuranceAndAdmin(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Dynamic custom opex fields */}
                {feasibilityDefaults?.customFields
                  ?.filter(f => f.isCustom && f.category === 'opex' && f.isVisible)
                  .map(customField => (
                    <div key={customField.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-amber-500/30">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-amber-300 font-bold">
                          {customField.label} ({customField.unit})
                        </label>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">بند مخصص</span>
                      </div>
                      {customField.subLabel && (
                        <p className="text-[10px] text-slate-400 mb-1">{customField.subLabel}</p>
                      )}
                      <input
                        type="number"
                        step="10000"
                        value={customFieldsValues[customField.id] ?? customField.defaultValue}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setCustomFieldsValues(prev => ({ ...prev, [customField.id]: val }));
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-white font-mono focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  ))}

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 mt-6">
                  <div className="text-slate-300 text-xs font-semibold mb-2">
                    ملخص صافي الربح السنوي التشغيلي (EBITDA):
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">صافي التدفق النقدي السنوي:</span>
                    <span className="text-emerald-400 font-mono font-bold text-lg">
                      {(annualNetCashFlow / 1000000).toFixed(2)} مليون ج.م
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* SUB-VIEW 4: 10-YEAR CASH FLOW PROJECTIONS */}
      {subTab === 'cashflows' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">
                  جدول التدفقات النقدية المتوقعة وصافي القيمة الحالية (10 سنوات)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  بمعدل خصم استثماري {discountRate}% ونمو سنوي تقديري 4% في مبيعات الغاز
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">معدل الخصم (%):</span>
                <input
                  type="number"
                  min="8"
                  max="25"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 14)}
                  className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white text-center"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="p-3 text-center">السنة</th>
                    <th className="p-3 text-center">التدفقات الداخلة (الإيراد)</th>
                    <th className="p-3 text-center">التدفقات الخارجة (OPEX)</th>
                    <th className="p-3 text-center">صافي التدفق السنوي</th>
                    <th className="p-3 text-center">التدفق المخصوم (DCF)</th>
                    <th className="p-3 text-center">التدفق التراكمي للمشروع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  <tr className="bg-slate-900/40 text-slate-400 font-sans">
                    <td className="p-3 text-center font-bold">سنة التأسيس (0)</td>
                    <td className="p-3 text-center font-mono">0</td>
                    <td className="p-3 text-center font-mono text-rose-400">
                      {(totalCapexEgp / 1000).toLocaleString('ar-EG')} ألف ج.م
                    </td>
                    <td className="p-3 text-center font-mono text-rose-400">
                      -{(totalCapexEgp / 1000).toLocaleString('ar-EG')} ألف ج.م
                    </td>
                    <td className="p-3 text-center font-mono text-rose-400">
                      -{(totalCapexEgp / 1000).toLocaleString('ar-EG')} ألف ج.م
                    </td>
                    <td className="p-3 text-center font-mono text-rose-400">
                      -{(totalCapexEgp / 1000).toLocaleString('ar-EG')} ألف ج.م
                    </td>
                  </tr>
                  {tenYearCashFlows.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-800/40">
                      <td className="p-3 text-center font-sans font-bold text-white">السنة {row.year}</td>
                      <td className="p-3 text-center text-slate-200">
                        {(row.cashInflow / 1000).toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ألف
                      </td>
                      <td className="p-3 text-center text-slate-400">
                        {(row.cashOutflow / 1000).toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ألف
                      </td>
                      <td className="p-3 text-center text-emerald-400 font-bold">
                        {(row.netCashFlow / 1000).toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ألف
                      </td>
                      <td className="p-3 text-center text-amber-300">
                        {(row.discountedCashFlow / 1000).toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ألف
                      </td>
                      <td className={`p-3 text-center font-bold ${row.cumulativeCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {(row.cumulativeCashFlow / 1000).toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ألف
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: FLEET & VEHICLE DRIVER ROI */}
      {subTab === 'fleet_savings' && (
        <div className="space-y-6">
          {/* Fuel Price & Conversion Cost Simulator Bar */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                معايير حاسبة الوفر الاقتصادي وفترة استرداد تكلفة التحويل
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  سعر لتر البنزين المرجعي (جنيه/لتر)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={gasolinePrice}
                  onChange={(e) => setGasolinePrice(parseFloat(e.target.value) || 15.25)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  سعر متر الغاز الطبيعي المضغوط (جنيه/م³)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={cngPrice}
                  onChange={(e) => setCngPrice(parseFloat(e.target.value) || 7.00)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  متوسط تكلفة جهاز واسطوانة التحويل (جنيه)
                </label>
                <input
                  type="number"
                  step="500"
                  value={conversionCostEgp}
                  onChange={(e) => setConversionCostEgp(parseFloat(e.target.value) || 14500)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Strategic Fleet Table */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm sm:text-base">
                جدوى تحويل الفئات الخمس المرصودة بالكاميرا
              </h3>
              <span className="text-xs text-emerald-400 font-medium">
                تحديث فوري بناءً على أسعار الوقود
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700/80">
                  <tr>
                    <th className="p-3">الفئة المرصودة</th>
                    <th className="p-3 text-center">إجمالي المرصود</th>
                    <th className="p-3 text-center">متوسط الكيلومتر/يوم</th>
                    <th className="p-3 text-center">الوفر الشهري التقديري</th>
                    <th className="p-3 text-center">فترة استرداد التكلفة</th>
                    <th className="p-3 text-center">الجدوى الاستثمارية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(Object.keys(VEHICLE_TYPES) as VehicleType[]).map((typeKey) => {
                    const cfg = VEHICLE_TYPES[typeKey];
                    const count = activeCounts[typeKey] || 0;
                    
                    const consumptionMap: Record<VehicleType, number> = {
                      private: 8.5,
                      taxi: 10.0,
                      microbus: 14.0,
                      van: 7.5,
                      minibus: 16.0,
                      pickup: 11.5,
                      bus: 28.0,
                      motorcycle: 3.5,
                      suzuki_van: 7.5,
                      peugeot_station: 12.5,
                    };

                    const monthlySavings = calculateTypeSavings(cfg.dailyAvgKm, consumptionMap[typeKey]);
                    const paybackMonths = calculatePaybackMonths(monthlySavings);

                    return (
                      <tr key={typeKey} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{cfg.label}</div>
                          <div className="text-[11px] text-slate-400">{cfg.subLabel}</div>
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-white text-base">
                          {count}
                          <span className="block text-[10px] text-slate-400 font-normal">
                            ({totalSurveyed > 0 ? `${Math.round((count / totalSurveyed) * 100)}%` : '0%'})
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-200">
                          {cfg.dailyAvgKm} كم
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-400 text-base">
                          {monthlySavings.toLocaleString('ar-EG')} ج.م
                        </td>
                        <td className="p-3 text-center font-mono text-amber-400">
                          {paybackMonths} أشهر
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}>
                            {cfg.cngSuitability}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 6: SENSITIVITY ANALYSIS */}
      {subTab === 'sensitivity' && (
        <div className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              <span>تحليل الحساسية لمخاطر وتقلبات السوق (Sensitivity Analysis)</span>
            </h3>
            <p className="text-xs text-slate-400">
              اختبار قدرة المشروع على تحقيق أرباح مجدية في ثلاث سيناريوهات رئيسية لمعدلات الطلب وهوامش الأسعار
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Conservative */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  السيناريو المتحفظ (-20% طلب)
                </span>
                <div className="text-lg font-black text-white font-mono mt-1">
                  {Math.round(dailyGasDispensedM3 * 0.8).toLocaleString('ar-EG')} م³/يوم
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>فترة الاسترداد: <span className="font-mono text-white font-bold">{(paybackYears * 1.25).toFixed(1)} سنة</span></div>
                  <div>معدل IRR: <span className="font-mono text-amber-400 font-bold">{(irrPercent * 0.78).toFixed(1)}%</span></div>
                  <div>التقييم: <span className="text-emerald-400 font-semibold">مقبول ومربح</span></div>
                </div>
              </div>

              {/* Base */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  السيناريو الأساسي (Base Case)
                </span>
                <div className="text-lg font-black text-emerald-300 font-mono mt-1">
                  {dailyGasDispensedM3.toLocaleString('ar-EG')} م³/يوم
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>فترة الاسترداد: <span className="font-mono text-white font-bold">{paybackYears.toFixed(1)} سنة</span></div>
                  <div>معدل IRR: <span className="font-mono text-amber-300 font-bold">{irrPercent.toFixed(1)}%</span></div>
                  <div>التقييم: <span className="text-emerald-300 font-bold">ممتاز وموصى به</span></div>
                </div>
              </div>

              {/* Optimistic */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  السيناريو المتفائل (+20% طلب)
                </span>
                <div className="text-lg font-black text-white font-mono mt-1">
                  {Math.round(dailyGasDispensedM3 * 1.2).toLocaleString('ar-EG')} م³/يوم
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>فترة الاسترداد: <span className="font-mono text-white font-bold">{(paybackYears * 0.82).toFixed(1)} سنة</span></div>
                  <div>معدل IRR: <span className="font-mono text-emerald-400 font-bold">{(irrPercent * 1.22).toFixed(1)}%</span></div>
                  <div>التقييم: <span className="text-blue-300 font-bold">عائد استثنائي فائق</span></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Printable / Downloadable Official Report Modal */}
      <FeasibilityReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedSession={selectedSession}
        projectName={selectedSession ? selectedSession.title : projectName}
        governorate={selectedSession ? selectedSession.governorate : targetGovernorate}
        city={selectedSession ? selectedSession.city : targetCity}
        surveyorName={selectedSession ? selectedSession.surveyorName : surveyorName}
        totalSurveyed={totalSurveyed}
        commercialTotal={commercialTotal}
        commercialPercentage={commercialPercentage}
        counts={activeCounts}
        dailyGasDispensedM3={dailyGasDispensedM3}
        annualGasDispensedM3={annualGasDispensedM3}
        totalCapexEgp={totalCapexEgp}
        annualOpexEgp={annualOpexEgp}
        annualNetProfitEgp={annualNetCashFlow}
        paybackYears={paybackYears}
        npvEgp={npvEgp}
        irrPercent={irrPercent}
        breakEvenDailyM3={breakEvenDailyM3}
        recommendedDispensers={recommendedDispensers}
        recommendedCompressors={recommendedCompressors}
        recommendedCompressorCapacity={recommendedCompressorCapacity}
        captureRate={captureRate}
        cngPrice={cngPrice}
        gasolinePrice={gasolinePrice}
        cngProfitMargin={cngProfitMargin}
        tenYearCashFlows={tenYearCashFlows}
      />

    </div>
  );
};
