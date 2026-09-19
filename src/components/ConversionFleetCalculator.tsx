import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Coins, 
  TrendingUp, 
  Leaf, 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Flame, 
  Calendar, 
  ArrowRight, 
  Zap, 
  CreditCard, 
  Percent,
  Sliders,
  Sparkles,
  Edit2,
  Check,
  RotateCcw
} from 'lucide-react';
import { VEHICLE_TYPES, VehicleType, FuelPricing } from '../types';
import { CargasNgvLogo } from './CargasNgvLogo';

interface ConversionFleetCalculatorProps {
  pricing?: FuelPricing;
  onUpdatePricing?: (newPricing: FuelPricing) => void;
  onNavigateToAdmin?: () => void;
}

export const ConversionFleetCalculator: React.FC<ConversionFleetCalculatorProps> = ({
  pricing,
  onUpdatePricing,
  onNavigateToAdmin
}) => {
  // Selected Vehicle Type
  const [selectedType, setSelectedType] = useState<VehicleType>('taxi');

  // Fueling parameters (synced with platform settings)
  const [fuelType, setFuelType] = useState<'80' | '92' | '95'>('92');
  const [gasolinePrice, setGasolinePrice] = useState<number>(() => pricing?.gasoline92Price ?? 15.25);
  const [cngPrice, setCngPrice] = useState<number>(() => pricing?.cngPrice ?? 7.00);

  // Quick edit mode inside calculator page
  const [isQuickEditingPrice, setIsQuickEditingPrice] = useState<boolean>(false);
  const [customCngPrice, setCustomCngPrice] = useState<number>(() => pricing?.cngPrice ?? 7.00);
  const [custom92Price, setCustom92Price] = useState<number>(() => pricing?.gasoline92Price ?? 15.25);
  const [custom80Price, setCustom80Price] = useState<number>(() => pricing?.gasoline80Price ?? 13.75);
  const [custom95Price, setCustom95Price] = useState<number>(() => pricing?.gasoline95Price ?? 17.00);

  // Keep synced with parent settings
  useEffect(() => {
    if (pricing) {
      setCngPrice(pricing.cngPrice);
      setCustomCngPrice(pricing.cngPrice);
      setCustom92Price(pricing.gasoline92Price);
      setCustom80Price(pricing.gasoline80Price);
      setCustom95Price(pricing.gasoline95Price);
      if (fuelType === '80') setGasolinePrice(pricing.gasoline80Price);
      else if (fuelType === '92') setGasolinePrice(pricing.gasoline92Price);
      else if (fuelType === '95') setGasolinePrice(pricing.gasoline95Price);
    }
  }, [pricing, fuelType]);

  // Handle saving custom prices from the calculator directly
  const handleSaveQuickPrices = () => {
    const updatedPricing: FuelPricing = {
      cngPrice: customCngPrice,
      gasoline80Price: custom80Price,
      gasoline92Price: custom92Price,
      gasoline95Price: custom95Price,
      dieselPrice: pricing?.dieselPrice ?? 13.50,
      lastUpdated: new Date().toISOString(),
    };

    setCngPrice(customCngPrice);
    if (fuelType === '80') setGasolinePrice(custom80Price);
    else if (fuelType === '92') setGasolinePrice(custom92Price);
    else if (fuelType === '95') setGasolinePrice(custom95Price);

    if (onUpdatePricing) {
      onUpdatePricing(updatedPricing);
    }
    setIsQuickEditingPrice(false);
  };

  // Driving parameters
  const [dailyKm, setDailyKm] = useState<number>(160); // km per day
  const [workingDaysPerMonth, setWorkingDaysPerMonth] = useState<number>(26); // days
  const [consumptionLitersPer100Km, setConsumptionLitersPer100Km] = useState<number>(9.5); // L/100km

  // Conversion Cost & Financing
  const [conversionCostEgp, setConversionCostEgp] = useState<number>(14500);
  const [cylinderSizeLiters, setCylinderSizeLiters] = useState<number>(70); // Equivalent to ~15-16 m3 of CNG
  const [financingMonths, setFinancingMonths] = useState<number>(12); // 12, 24, 36
  const [interestRatePercent, setInterestRatePercent] = useState<number>(0); // Subsidized initiative 0% or low interest

  // Update defaults when vehicle type changes
  const handleTypeSelect = (type: VehicleType) => {
    setSelectedType(type);
    const defaults = VEHICLE_TYPES[type];
    setDailyKm(defaults.dailyAvgKm);
    const consumptionMap: Record<VehicleType, number> = {
      private: 8.0,
      taxi: 9.5,
      microbus: 13.5,
      van: 7.5,
      minibus: 15.0,
      pickup: 11.0,
      bus: 26.0,
      motorcycle: 3.5,
      suzuki_van: 7.5,
      peugeot_station: 11.0,
    };
    setConsumptionLitersPer100Km(consumptionMap[type] || 9.5);
    
    // Set appropriate cylinder size
    if (type === 'microbus' || type === 'peugeot_station') {
      setCylinderSizeLiters(90);
      setConversionCostEgp(16500);
    } else if (type === 'suzuki_van') {
      setCylinderSizeLiters(60);
      setConversionCostEgp(13500);
    } else {
      setCylinderSizeLiters(70);
      setConversionCostEgp(14500);
    }
  };

  // Fuel price helper
  const handleFuelTypeChange = (grade: '80' | '92' | '95') => {
    setFuelType(grade);
    const p80 = pricing ? pricing.gasoline80Price : 13.75;
    const p92 = pricing ? pricing.gasoline92Price : 15.25;
    const p95 = pricing ? pricing.gasoline95Price : 17.00;

    if (grade === '80') setGasolinePrice(p80);
    if (grade === '92') setGasolinePrice(p92);
    if (grade === '95') setGasolinePrice(p95);
  };

  // Financial Calculations
  const monthlyKm = dailyKm * workingDaysPerMonth;
  const annualKm = monthlyKm * 12;

  // 1 m3 of CNG provides approx the same mileage as 1 Liter of gasoline (1:1 energy equivalence in modern sequential injection kits)
  const monthlyGasolineLiters = (monthlyKm / 100) * consumptionLitersPer100Km;
  const monthlyGasolineCost = monthlyGasolineLiters * gasolinePrice;

  const monthlyCngM3 = monthlyGasolineLiters; // 1 m3 ~ 1 liter
  const monthlyCngCost = monthlyCngM3 * cngPrice;

  const monthlySavingsEgp = Math.max(0, monthlyGasolineCost - monthlyCngCost);
  const annualSavingsEgp = monthlySavingsEgp * 12;
  const savingsPercentage = monthlyGasolineCost > 0 ? Math.round((monthlySavingsEgp / monthlyGasolineCost) * 100) : 0;

  // Financing Installment
  const totalLoanAmount = conversionCostEgp * (1 + (interestRatePercent / 100) * (financingMonths / 12));
  const monthlyInstallmentEgp = Math.round(totalLoanAmount / financingMonths);

  // Net cash retained by driver during repayment period
  const netMonthlyProfitDuringFinancing = Math.max(0, monthlySavingsEgp - monthlyInstallmentEgp);

  // Payback period if paid in cash
  const cashPaybackMonths = monthlySavingsEgp > 0 ? Number((conversionCostEgp / monthlySavingsEgp).toFixed(1)) : 0;

  // Environmental Impact:
  // 1 liter gasoline emits ~2.31 kg CO2. 1 m3 CNG emits ~1.85 kg CO2 (~25% lower direct CO2 + virtually 0 particulate matter/soot)
  const annualCo2GasolineKg = monthlyGasolineLiters * 12 * 2.31;
  const annualCo2CngKg = monthlyCngM3 * 12 * 1.85;
  const annualCo2SavedKg = Math.max(0, annualCo2GasolineKg - annualCo2CngKg);
  const treesEquivalent = Math.round(annualCo2SavedKg / 22); // 1 mature tree absorbs ~22 kg CO2/year

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Top Hero Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CargasNgvLogo size="lg" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  حاسبة الوفر المالي ومبادرة تحويل المركبات للغاز الطبيعي (كارجاس NGV)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  وفر حتى {savingsPercentage}%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                احسب فوراً الوفر المالي الشهري، قسط طقم التحويل من الوفر، والأثر البيئي لأسطولك أو سيارتك الخاصة
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
            <div className="flex items-center gap-2 text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-700">
              <span className="text-slate-400">سعر الغاز الطبيعي الحالي:</span>
              <strong className="text-emerald-400 font-mono text-base font-black">
                {cngPrice.toFixed(2)} ج.م/م³
              </strong>
              <span className="text-slate-500 text-[10px]">(مقابل {gasolinePrice.toFixed(2)} ج.م بنزين)</span>
            </div>

            <button
              onClick={() => setIsQuickEditingPrice(!isQuickEditingPrice)}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isQuickEditingPrice ? 'إغلاق التعديل' : 'تعديل الأسعار'}</span>
            </button>
          </div>
        </div>

        {/* Quick Price Editor Drawer */}
        {isQuickEditingPrice && (
          <div className="mt-4 pt-4 border-t border-slate-700/80 bg-slate-900/90 p-4 rounded-xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>تعديل مباشر لأسعار الطاقة في حاسبة الوفر (يُعمم على المنظومة):</span>
              </span>
              {onNavigateToAdmin && (
                <button
                  type="button"
                  onClick={onNavigateToAdmin}
                  className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  فتح لوحة التحكم الكاملة ←
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-emerald-400 block mb-1">سعر الغاز (ج.م/م³):</label>
                <input
                  type="number"
                  step="0.25"
                  value={customCngPrice}
                  onChange={(e) => setCustomCngPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-emerald-500/60 rounded-lg px-2.5 py-1.5 font-mono text-emerald-300 font-black text-sm"
                />
              </div>

              <div>
                <label className="text-[11px] text-amber-300 block mb-1">بنزين 92 (ج.م/لتر):</label>
                <input
                  type="number"
                  step="0.25"
                  value={custom92Price}
                  onChange={(e) => setCustom92Price(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">بنزين 80 (ج.م/لتر):</label>
                <input
                  type="number"
                  step="0.25"
                  value={custom80Price}
                  onChange={(e) => setCustom80Price(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] text-rose-300 block mb-1">بنزين 95 (ج.م/لتر):</label>
                <input
                  type="number"
                  step="0.25"
                  value={custom95Price}
                  onChange={(e) => setCustom95Price(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsQuickEditingPrice(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveQuickPrices}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>حفظ وتطبيق الأسعار الجديدة</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Type Selector Cards */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 block">
          اختر فئة المركبة المستهدفة بالحسابات:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(Object.keys(VEHICLE_TYPES) as VehicleType[]).map((type) => {
            const cfg = VEHICLE_TYPES[type];
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                id={`btn-select-vehicle-${type}`}
                onClick={() => handleTypeSelect(type)}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-600/10'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">
                      {type === 'private' ? '🚗' : type === 'taxi' ? '🚕' : type === 'microbus' ? '🚐' : type === 'suzuki_van' ? '🚙' : '🚘'}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <strong className="text-sm font-bold block">{cfg.label}</strong>
                  <span className="text-[10px] text-slate-400 block">{cfg.subLabel}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">متوسط:</span>
                  <span className="text-emerald-400 font-semibold">{cfg.dailyAvgKm} كم/يوم</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Real-Time Financial Outcomes on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Inputs & Financing Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Fuel & Usage Parameters */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>محددات استهلاك الوقود والمسافة</span>
            </h3>

            {/* Gasoline Grade */}
            <div>
              <label className="block text-xs text-slate-300 mb-1.5">نوع البنزين المستخدم حالياً:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['80', '92', '95'] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => handleFuelTypeChange(grade)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      fuelType === grade
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    بنزين {grade} ({grade === '80' ? (pricing?.gasoline80Price ?? 13.75).toFixed(2) : grade === '92' ? (pricing?.gasoline92Price ?? 15.25).toFixed(2) : (pricing?.gasoline95Price ?? 17.00).toFixed(2)} ج.م)
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Distance */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-300">المسافة المقطوعة يومياً:</span>
                <span className="font-mono text-emerald-400 font-bold">{dailyKm} كم/يوم</span>
              </div>
              <input
                type="range"
                min="30"
                max="450"
                step="5"
                value={dailyKm}
                onChange={(e) => setDailyKm(parseInt(e.target.value) || 100)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>30 كم (مشاوير خفيفة)</span>
                <span>200 كم (تاكسي)</span>
                <span>450 كم (خطوط أقاليم)</span>
              </div>
            </div>

            {/* Working days and Consumption */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">أيام العمل شهرياً:</label>
                <input
                  type="number"
                  min="15"
                  max="31"
                  value={workingDaysPerMonth}
                  onChange={(e) => setWorkingDaysPerMonth(parseInt(e.target.value) || 26)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">الاستهلاك (لتر/100كم):</label>
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="20"
                  value={consumptionLitersPer100Km}
                  onChange={(e) => setConsumptionLitersPer100Km(parseFloat(e.target.value) || 9.5)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Kit Cost & Financing / National Initiative */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>مبادرة التقسيط وتكلفة جهاز التحويل</span>
            </h3>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                تكلفة جهاز التحويل واسطوانة الغاز (شامل الفحص والتركيب):
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="500"
                  value={conversionCostEgp}
                  onChange={(e) => setConversionCostEgp(parseFloat(e.target.value) || 14000)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                />
                <span className="absolute left-3 top-2 text-xs text-slate-400">جنيه مصري</span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1.5">نظام التقسيط الميسر (المبادرة القومية):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { months: 12, label: 'سنة (12 شهر)' },
                  { months: 24, label: 'سنتان (24 شهر)' },
                  { months: 36, label: '3 سنوات (36 شهر)' }
                ].map((plan) => (
                  <button
                    key={plan.months}
                    onClick={() => setFinancingMonths(plan.months)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      financingMonths === plan.months
                        ? 'bg-blue-600 text-white font-black'
                        : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {plan.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-300">القسط الشهري التقريبي:</span>
              <strong className="text-blue-300 font-mono font-black text-base">
                {monthlyInstallmentEgp.toLocaleString('ar-EG')} ج.م/شهر
              </strong>
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Financial ROI & Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Big Savings Metric Card */}
          <div className="bg-gradient-to-br from-emerald-950/70 via-slate-800/90 to-slate-900 border border-emerald-500/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-400 font-semibold block mb-1">
                  صافي الوفر الشهري المباشر في جيب السائق
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {monthlySavingsEgp.toLocaleString('ar-EG', { maximumFractionDigits: 0 })}
                  <span className="text-lg sm:text-xl font-normal text-emerald-400 mr-2">ج.م / شهرياً</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <Coins className="w-8 h-8" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-emerald-500/30 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">الوفر السنوي الإجمالي:</span>
                <strong className="text-emerald-300 font-mono text-base block">
                  {annualSavingsEgp.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">نسبة خفض فاتورة الوقود:</span>
                <strong className="text-amber-400 font-mono text-base block">
                  {savingsPercentage}% وفر
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">استرداد ثمن الطقم نقداً:</span>
                <strong className="text-blue-300 font-mono text-base block">
                  خلال {cashPaybackMonths} شهر فقط
                </strong>
              </div>
            </div>
          </div>

          {/* Fuel Cost Comparison: Gasoline vs CNG */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>مقارنة تكلفة استهلاك الوقود شهرياً ({monthlyKm.toLocaleString('ar-EG')} كم)</span>
            </h3>

            {/* Gasoline Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-rose-300 font-semibold">بنزين {fuelType} الحالي:</span>
                <span className="font-mono text-rose-300 font-bold">
                  {monthlyGasolineCost.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م/شهر
                </span>
              </div>
              <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div className="h-full bg-rose-500 rounded-full w-full"></div>
              </div>
            </div>

            {/* CNG Bar */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-emerald-400 font-semibold">الغاز الطبيعي CNG:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {monthlyCngCost.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م/شهر
                </span>
              </div>
              <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(10, (monthlyCngCost / monthlyGasolineCost) * 100))}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-slate-300 leading-relaxed">
              💡 <strong>معلومة مؤكدة:</strong> قسط طقم الغاز الشهري البالغ ({monthlyInstallmentEgp.toLocaleString('ar-EG')} ج.م) يتم سداده <strong>بالكامل من وفر البنزين</strong>، ويتبقى معك أيضاً فائض صافي مقداره <strong>{netMonthlyProfitDuringFinancing.toLocaleString('ar-EG')} ج.م شهرياً</strong> كسيولة إضافية خلال فترة التقسيط!
            </div>
          </div>

          {/* Environmental Impact Box */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">الأثر البيئي وخفض الانبعاثات الكربونية</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحويل هذه السيارة يوفر سنوياً <strong className="text-emerald-400">{(annualCo2SavedKg / 1000).toFixed(2)} طن</strong> من غاز CO2
                </p>
              </div>
            </div>
            <div className="text-left font-mono shrink-0">
              <span className="text-xs text-slate-400 block">يعادل زراعة:</span>
              <span className="text-base font-black text-emerald-400">{treesEquivalent} شجرة</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
