import React, { useState, useMemo } from 'react';
import { FuelPricing, CustomFuelItem } from '../types';
import { DEFAULT_FUEL_PRICING, DEFAULT_CUSTOM_FUELS } from '../data/defaultSettings';
import { 
  Flame, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Edit3, 
  RotateCcw, 
  Check, 
  X, 
  TrendingUp, 
  Search, 
  Sliders 
} from 'lucide-react';

interface AdminFuelsManagerProps {
  currentPricing: FuelPricing;
  customFuels?: CustomFuelItem[];
  onSave: (pricing: FuelPricing, fuels: CustomFuelItem[]) => void;
  onReset: () => void;
}

export const AdminFuelsManager: React.FC<AdminFuelsManagerProps> = ({
  currentPricing,
  customFuels,
  onSave,
  onReset,
}) => {
  const [fuels, setFuels] = useState<CustomFuelItem[]>(() => {
    if (Array.isArray(customFuels) && customFuels.length > 0) {
      return customFuels;
    }
    return DEFAULT_CUSTOM_FUELS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);

  // Adding new fuel state
  const [isAddingFuel, setIsAddingFuel] = useState(false);
  const [newFuelName, setNewFuelName] = useState('');
  const [newFuelSubName, setNewFuelSubName] = useState('');
  const [newFuelPrice, setNewFuelPrice] = useState<number>(10);
  const [newFuelUnit, setNewFuelUnit] = useState('ج.م / لتر');
  const [newFuelColor, setNewFuelColor] = useState('#10b981');

  // Inline rename state
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineNameText, setInlineNameText] = useState('');

  // Full edit modal
  const [editingFuelId, setEditingFuelId] = useState<string | null>(null);
  const [editFuelForm, setEditFuelForm] = useState<Partial<CustomFuelItem>>({});

  // Success indicator
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filtered fuels
  const filteredFuels = useMemo(() => {
    return fuels.filter(f => {
      const matchSearch = !searchQuery.trim() || 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.subName && f.subName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchVis = showHiddenOnly ? !f.isVisible : true;
      return matchSearch && matchVis;
    });
  }, [fuels, searchQuery, showHiddenOnly]);

  // CNG price reference
  const cngItem = useMemo(() => {
    return fuels.find(f => f.key === 'cngPrice') || fuels[0] || { price: 7.00 };
  }, [fuels]);

  // Update Price
  const handleUpdatePrice = (id: string, price: number) => {
    setFuels(prev => prev.map(f => f.id === id ? { ...f, price } : f));
  };

  // Toggle Visibility
  const handleToggleVisibility = (id: string) => {
    setFuels(prev => prev.map(f => f.id === id ? { ...f, isVisible: !f.isVisible } : f));
  };

  // Start inline rename
  const handleStartRename = (fuel: CustomFuelItem) => {
    setInlineEditingId(fuel.id);
    setInlineNameText(fuel.name);
  };

  // Save inline rename
  const handleSaveRename = (id: string) => {
    if (!inlineNameText.trim()) return;
    setFuels(prev => prev.map(f => f.id === id ? { ...f, name: inlineNameText.trim() } : f));
    setInlineEditingId(null);
  };

  // Open Edit Modal
  const handleOpenEdit = (fuel: CustomFuelItem) => {
    setEditingFuelId(fuel.id);
    setEditFuelForm({ ...fuel });
  };

  // Save Edit Modal
  const handleSaveEdit = () => {
    if (!editingFuelId || !editFuelForm.name?.trim()) return;
    setFuels(prev => prev.map(f => {
      if (f.id === editingFuelId) {
        return {
          ...f,
          name: editFuelForm.name!.trim(),
          subName: editFuelForm.subName?.trim(),
          price: Number(editFuelForm.price) || 0,
          unit: editFuelForm.unit || f.unit,
        };
      }
      return f;
    }));
    setEditingFuelId(null);
    setEditFuelForm({});
  };

  // Delete Fuel
  const handleDeleteFuel = (id: string) => {
    setFuels(prev => prev.filter(f => f.id !== id));
  };

  // Add Fuel
  const handleCreateFuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFuelName.trim()) return;

    const newFuel: CustomFuelItem = {
      id: `fuel-custom-${Date.now()}`,
      name: newFuelName.trim(),
      subName: newFuelSubName.trim() || undefined,
      price: Number(newFuelPrice) || 0,
      unit: newFuelUnit.trim() || 'ج.م / لتر',
      color: newFuelColor,
      isVisible: true,
      isCustom: true,
    };

    setFuels(prev => [...prev, newFuel]);
    setIsAddingFuel(false);
    setNewFuelName('');
    setNewFuelSubName('');
    setNewFuelPrice(10);
  };

  // Reset to default fuels
  const handleResetToDefault = () => {
    if (window.confirm('هل أنت متأكد من استعادة أسعار وأنواع الوقود الافتراضية؟')) {
      setFuels(DEFAULT_CUSTOM_FUELS);
      onReset();
    }
  };

  // Commit & Save
  const handleCommit = () => {
    const updatedPricing: FuelPricing = {
      ...currentPricing,
      cngPrice: fuels.find(f => f.key === 'cngPrice')?.price ?? currentPricing.cngPrice,
      gasoline80Price: fuels.find(f => f.key === 'gasoline80Price')?.price ?? currentPricing.gasoline80Price,
      gasoline92Price: fuels.find(f => f.key === 'gasoline92Price')?.price ?? currentPricing.gasoline92Price,
      gasoline95Price: fuels.find(f => f.key === 'gasoline95Price')?.price ?? currentPricing.gasoline95Price,
      dieselPrice: fuels.find(f => f.key === 'dieselPrice')?.price ?? currentPricing.dieselPrice,
      lastUpdated: new Date().toISOString(),
    };

    onSave(updatedPricing, fuels);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>تعديل وإدارة أسعار الغاز الطبيعي وأنواع الوقود (تحديث ديناميكي فوري)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  إمكانية تعديل مسميات أنواع الوقود، تغيير الأسعار، إضافة وقود جديد، وحذف أو إخفاء أي نوع وقود من المنظومة وحاسبة الوفر.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddingFuel(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة نوع وقود جديد</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">الأسعار الرسمية</span>
            </button>

            <button
              type="button"
              onClick={handleCommit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>تطبيق وحفظ التعديلات فوراً</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">عدد أنواع الوقود المسجلة:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
              {fuels.filter(f => f.isVisible).length} مفعل
            </span>
            {fuels.filter(f => !f.isVisible).length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs">
                {fuels.filter(f => !f.isVisible).length} مخفي
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في أنواع الوقود..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowHiddenOnly(!showHiddenOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                showHiddenOnly 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              {showHiddenOnly ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{showHiddenOnly ? 'المخفي فقط' : 'الكل'}</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>تم حفظ أسعار ومسميات الوقود وتعميمها بنجاح على كافة صفحات المنظومة وحاسبة الوفر!</span>
          </div>
        )}
      </div>

      {/* Fuels Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFuels.map((fuel) => {
          const isEditingName = inlineEditingId === fuel.id;
          const isCng = fuel.key === 'cngPrice';
          const savingsPerUnit = fuel.price - cngItem.price;
          const savingsPercent = fuel.price > 0 ? Math.round((savingsPerUnit / fuel.price) * 100) : 0;

          return (
            <div
              key={fuel.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isCng
                  ? 'bg-emerald-950/40 border-2 border-emerald-500/60 shadow-lg'
                  : fuel.isVisible
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
              }`}
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isCng ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        الغاز الطبيعي الرئيسي
                      </span>
                    ) : fuel.isCustom ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        وقود مخصص
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        وقود بترولي
                      </span>
                    )}
                    {!fuel.isVisible && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        مخفي
                      </span>
                    )}
                  </div>

                  {/* Actions: Visibility, Edit, Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(fuel.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        fuel.isVisible 
                          ? 'text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                          : 'text-slate-500 border-slate-700 hover:text-slate-300'
                      }`}
                      title={fuel.isVisible ? 'إخفاء هذا الوقود' : 'إظهار هذا الوقود'}
                    >
                      {fuel.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(fuel)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                      title="تعديل التفاصيل والوحدة"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>

                    {!isCng && (
                      <button
                        type="button"
                        onClick={() => handleDeleteFuel(fuel.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 cursor-pointer"
                        title="حذف هذا الوقود"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Fuel Name (Editable Inline) */}
                {isEditingName ? (
                  <div className="flex items-center gap-1.5 mb-2">
                    <input
                      type="text"
                      value={inlineNameText}
                      onChange={(e) => setInlineNameText(e.target.value)}
                      className="flex-1 bg-slate-950 border border-emerald-500 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveRename(fuel.id)}
                      className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setInlineEditingId(null)}
                      className="p-1 rounded bg-slate-800 text-slate-400 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 mb-1">
                    <h4 className="text-sm font-bold text-white">
                      {fuel.name}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleStartRename(fuel)}
                      className="text-slate-500 hover:text-emerald-400 p-0.5 rounded cursor-pointer"
                      title="تعديل اسم ومسمى هذا الوقود"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {fuel.subName && (
                  <p className="text-xs text-slate-400 mb-3">
                    {fuel.subName}
                  </p>
                )}

                {/* Price Input */}
                <div className="mt-3">
                  <div className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">السعر الرسمي:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        value={fuel.price}
                        onChange={(e) => handleUpdatePrice(fuel.id, parseFloat(e.target.value) || 0)}
                        className="w-24 bg-transparent font-mono text-base font-black text-emerald-400 text-left focus:outline-none"
                      />
                      <span className="text-xs font-bold text-slate-300 font-sans">{fuel.unit}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Savings Comparison (if not CNG) */}
              {!isCng && (
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">وفر الغاز الطبيعي vs هذا الوقود:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-emerald-400">
                      +{savingsPerUnit > 0 ? savingsPerUnit.toFixed(2) : '0.00'} ج.م
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ({savingsPercent > 0 ? `${savingsPercent}%` : '0%'})
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time Savings Simulation Preview */}
      <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>محاكاة فورية لفارق التكلفة والوفر الناتج عن الأسعار المعدلة (شهرياً لمسافة 3000 كم):</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {filteredFuels.filter(f => !f.key?.includes('cng') && f.isVisible).map(f => {
            const litersPerMonth = 300; // avg consumption for 3000 km
            const fuelCost = litersPerMonth * f.price;
            const cngCost = litersPerMonth * cngItem.price;
            const monthlySaving = Math.max(0, fuelCost - cngCost);
            const yearlySaving = monthlySaving * 12;

            return (
              <div key={f.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block font-medium">مقارنة مع {f.name}:</span>
                <div className="mt-1 flex items-baseline justify-between">
                  <strong className="text-emerald-400 font-mono text-sm">
                    {monthlySaving.toLocaleString('ar-EG')} ج.م
                  </strong>
                  <span className="text-[11px] text-slate-500">وفراً شهرياً</span>
                </div>
                <span className="text-[10px] text-amber-400/90 block mt-0.5">
                  ({yearlySaving.toLocaleString('ar-EG')} ج.م / سنوياً للمركبة)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add New Fuel */}
      {isAddingFuel && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">إضافة نوع وقود جديد للمنظومة</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingFuel(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFuel} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اسم ونوع الوقود:
                </label>
                <input
                  type="text"
                  required
                  value={newFuelName}
                  onChange={(e) => setNewFuelName(e.target.value)}
                  placeholder="مثال: شحن كهربائي فائق السرعة EV"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  الوصف أو الاستخدام:
                </label>
                <input
                  type="text"
                  value={newFuelSubName}
                  onChange={(e) => setNewFuelSubName(e.target.value)}
                  placeholder="مثال: تعرفة شحن السيارات الكهربائية بالكيلوواط ساعة"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    السعر الرسمي:
                  </label>
                  <input
                    type="number"
                    required
                    step="0.25"
                    value={newFuelPrice}
                    onChange={(e) => setNewFuelPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    وحدة القياس:
                  </label>
                  <input
                    type="text"
                    required
                    value={newFuelUnit}
                    onChange={(e) => setNewFuelUnit(e.target.value)}
                    placeholder="ج.م / لتر أو ج.م / ك.و.س"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingFuel(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  إضافة الوقود
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Full Edit Fuel */}
      {editingFuelId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">تعديل تفاصيل الوقود</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingFuelId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  المسمى المعروض:
                </label>
                <input
                  type="text"
                  value={editFuelForm.name || ''}
                  onChange={(e) => setEditFuelForm({ ...editFuelForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  الوصف أو الاستخدام:
                </label>
                <input
                  type="text"
                  value={editFuelForm.subName || ''}
                  onChange={(e) => setEditFuelForm({ ...editFuelForm, subName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    السعر:
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={editFuelForm.price ?? 0}
                    onChange={(e) => setEditFuelForm({ ...editFuelForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    وحدة القياس:
                  </label>
                  <input
                    type="text"
                    value={editFuelForm.unit || ''}
                    onChange={(e) => setEditFuelForm({ ...editFuelForm, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingFuelId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 cursor-pointer"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
