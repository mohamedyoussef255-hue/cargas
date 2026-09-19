import React, { useState, useMemo } from 'react';
import { 
  FeasibilityDefaults, 
  FeasibilityFieldDefinition 
} from '../types';
import { DEFAULT_FEASIBILITY_FIELDS } from '../data/defaultSettings';
import { 
  DollarSign, 
  Building2, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Edit3, 
  RotateCcw, 
  Check, 
  X, 
  Sliders, 
  Search, 
  Layers, 
  Info,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface AdminFeasibilityManagerProps {
  initialDefaults: FeasibilityDefaults;
  onSave: (updated: FeasibilityDefaults) => void;
  onReset: () => void;
}

export const AdminFeasibilityManager: React.FC<AdminFeasibilityManagerProps> = ({
  initialDefaults,
  onSave,
  onReset,
}) => {
  // Ensure we have fields array
  const [fields, setFields] = useState<FeasibilityFieldDefinition[]>(() => {
    if (Array.isArray(initialDefaults.customFields) && initialDefaults.customFields.length > 0) {
      return initialDefaults.customFields;
    }
    return DEFAULT_FEASIBILITY_FIELDS;
  });

  const [activeCategory, setActiveCategory] = useState<'all' | 'capex' | 'opex' | 'margin' | 'operational'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);

  // Modal State for Adding a New Field
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldCategory, setNewFieldCategory] = useState<'capex' | 'opex' | 'margin' | 'operational'>('capex');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldSubLabel, setNewFieldSubLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState<number>(0);
  const [newFieldUnit, setNewFieldUnit] = useState('ج.م');
  const [newFieldDesc, setNewFieldDesc] = useState('');

  // Editing single field full modal
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FeasibilityFieldDefinition>>({});

  // Quick inline rename tracking
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineLabelText, setInlineLabelText] = useState('');

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Success message notification
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filtered fields
  const filteredFields = useMemo(() => {
    return fields.filter(f => {
      const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
      const matchesSearch = !searchQuery.trim() || 
        f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.subLabel && f.subLabel.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesVisibility = showHiddenOnly ? !f.isVisible : true;
      return matchesCategory && matchesSearch && matchesVisibility;
    });
  }, [fields, activeCategory, searchQuery, showHiddenOnly]);

  // Dynamic Calculated Totals for Active Visible Fields
  const activeCapexTotal = useMemo(() => {
    return fields
      .filter(f => f.category === 'capex' && f.isVisible)
      .reduce((sum, f) => sum + (Number(f.value) || 0), 0);
  }, [fields]);

  const activeOpexTotal = useMemo(() => {
    return fields
      .filter(f => f.category === 'opex' && f.isVisible)
      .reduce((sum, f) => sum + (Number(f.value) || 0), 0);
  }, [fields]);

  const visibleCount = useMemo(() => fields.filter(f => f.isVisible).length, [fields]);
  const hiddenCount = useMemo(() => fields.filter(f => !f.isVisible).length, [fields]);

  // Update Field Value
  const handleUpdateValue = (id: string, value: number) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, value } : f));
  };

  // Toggle Visibility (Show / Hide)
  const handleToggleVisibility = (id: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, isVisible: !f.isVisible } : f));
  };

  // Start inline rename
  const handleStartInlineRename = (f: FeasibilityFieldDefinition) => {
    setInlineEditingId(f.id);
    setInlineLabelText(f.label);
  };

  // Save inline rename
  const handleSaveInlineRename = (id: string) => {
    if (!inlineLabelText.trim()) return;
    setFields(prev => prev.map(f => f.id === id ? { ...f, label: inlineLabelText.trim() } : f));
    setInlineEditingId(null);
  };

  // Open Full Edit Modal
  const handleOpenEditModal = (f: FeasibilityFieldDefinition) => {
    setEditingFieldId(f.id);
    setEditForm({ ...f });
  };

  // Save Full Edit Modal
  const handleSaveEditModal = () => {
    if (!editingFieldId || !editForm.label?.trim()) return;
    setFields(prev => prev.map(f => {
      if (f.id === editingFieldId) {
        return {
          ...f,
          label: editForm.label!.trim(),
          subLabel: editForm.subLabel?.trim(),
          value: Number(editForm.value) || 0,
          unit: editForm.unit || f.unit,
          description: editForm.description?.trim(),
        };
      }
      return f;
    }));
    setEditingFieldId(null);
    setEditForm({});
  };

  // Delete Field
  const handleDeleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    setDeleteConfirmId(null);
  };

  // Add New Field
  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;

    const newField: FeasibilityFieldDefinition = {
      id: `f-custom-${Date.now()}`,
      key: `custom_${Date.now()}`,
      category: newFieldCategory,
      label: newFieldLabel.trim(),
      subLabel: newFieldSubLabel.trim() || undefined,
      unit: newFieldUnit.trim() || 'ج.م',
      defaultValue: Number(newFieldValue) || 0,
      value: Number(newFieldValue) || 0,
      isVisible: true,
      isCustom: true,
      description: newFieldDesc.trim() || undefined,
    };

    setFields(prev => [...prev, newField]);
    setIsAddingField(false);
    setNewFieldLabel('');
    setNewFieldSubLabel('');
    setNewFieldValue(0);
    setNewFieldUnit('ج.م');
    setNewFieldDesc('');
  };

  // Reset to default standard fields
  const handleResetDefaults = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في استعادة كافة مسميات وقيم الحقول الافتراضية؟ سيتم إرجاع جميع المسميات الرسمية بما فيها وحدة الضواغط الرئيسية.')) {
      setFields(DEFAULT_FEASIBILITY_FIELDS);
      onReset();
    }
  };

  // Commit & Save to Parent
  const handleCommitSave = () => {
    // Synchronize backwards-compatible properties from matching fields
    const updatedFeasibility: FeasibilityDefaults = {
      ...initialDefaults,
      customFields: fields,
      // sync standard keys if matching field exists
      capexCompressors: fields.find(f => f.key === 'capexCompressors')?.value ?? initialDefaults.capexCompressors,
      capexCascades: fields.find(f => f.key === 'capexCascades')?.value ?? initialDefaults.capexCascades,
      capexDispensers: fields.find(f => f.key === 'capexDispensers')?.value ?? initialDefaults.capexDispensers,
      capexGasPipeline: fields.find(f => f.key === 'capexGasPipeline')?.value ?? initialDefaults.capexGasPipeline,
      capexCivilAndCanopy: fields.find(f => f.key === 'capexCivilAndCanopy')?.value ?? initialDefaults.capexCivilAndCanopy,
      capexConversionCenter: fields.find(f => f.key === 'capexConversionCenter')?.value ?? initialDefaults.capexConversionCenter,
      capexPermitsAndSafety: fields.find(f => f.key === 'capexPermitsAndSafety')?.value ?? initialDefaults.capexPermitsAndSafety,
      opexElectricityAnnual: fields.find(f => f.key === 'opexElectricityAnnual')?.value ?? initialDefaults.opexElectricityAnnual,
      opexMaintenanceAnnual: fields.find(f => f.key === 'opexMaintenanceAnnual')?.value ?? initialDefaults.opexMaintenanceAnnual,
      opexLaborAnnual: fields.find(f => f.key === 'opexLaborAnnual')?.value ?? initialDefaults.opexLaborAnnual,
      opexInsuranceAndAdmin: fields.find(f => f.key === 'opexInsuranceAndAdmin')?.value ?? initialDefaults.opexInsuranceAndAdmin,
      cngProfitMarginPerM3: fields.find(f => f.key === 'cngProfitMarginPerM3')?.value ?? initialDefaults.cngProfitMarginPerM3,
      captureRatePercent: fields.find(f => f.key === 'captureRatePercent')?.value ?? initialDefaults.captureRatePercent,
      conversionNetMarginPerCar: fields.find(f => f.key === 'conversionNetMarginPerCar')?.value ?? initialDefaults.conversionNetMarginPerCar,
      monthlyConversionsCount: fields.find(f => f.key === 'monthlyConversionsCount')?.value ?? initialDefaults.monthlyConversionsCount,
      discountRatePercent: fields.find(f => f.key === 'discountRatePercent')?.value ?? initialDefaults.discountRatePercent,
      operatingHoursPerDay: fields.find(f => f.key === 'operatingHoursPerDay')?.value ?? initialDefaults.operatingHoursPerDay,
    };

    onSave(updatedFeasibility);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats & Controls */}
      <div className="bg-slate-800/95 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>تعديل محددات دراسة الجدوى وتكاليف المحطات (CapEx & OpEx)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  تحكم كامل: تعديل مسميات البنود (مثل وحدة الضواغط الرئيسية)، إضافة حقول جديدة، حذف، وإظهار أو إخفاء أي بند.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddingField(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حقل / بند جديد</span>
            </button>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
              title="استرجاع كافة المسميات والقيم الافتراضية"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">استعادة الافتراضيات</span>
            </button>

            <button
              type="button"
              onClick={handleCommitSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>حفظ وتعميم التعديلات</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-400 block font-medium">إجمالي CapEx النشط:</span>
              <strong className="text-lg font-mono text-white">
                {activeCapexTotal.toLocaleString('ar-EG')} <span className="text-xs text-slate-400">ج.م</span>
              </strong>
            </div>
            <Building2 className="w-6 h-6 text-emerald-500/60" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-400 block font-medium">إجمالي OpEx السنوي النشط:</span>
              <strong className="text-lg font-mono text-white">
                {activeOpexTotal.toLocaleString('ar-EG')} <span className="text-xs text-slate-400">ج.م/سنة</span>
              </strong>
            </div>
            <DollarSign className="w-6 h-6 text-amber-500/60" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-blue-400 block font-medium">حالة الحقول والبنود:</span>
              <div className="flex items-center gap-2 text-xs mt-0.5">
                <span className="text-emerald-400 font-bold">{visibleCount} نشط مفعّل</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 font-medium">{hiddenCount} مخفي</span>
              </div>
            </div>
            <Layers className="w-6 h-6 text-blue-500/60" />
          </div>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>تم حفظ وتحديث محددات دراسة الجدوى وتعميم المسميات الجديدة بنجاح!</span>
          </div>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeCategory === 'all' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              كافة البنود ({fields.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('capex')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeCategory === 'capex' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              التكاليف الاستثمارية CapEx ({fields.filter(f => f.category === 'capex').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('opex')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeCategory === 'opex' 
                  ? 'bg-amber-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              مصاريف التشغيل OpEx ({fields.filter(f => f.category === 'opex').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('margin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeCategory === 'margin' 
                  ? 'bg-purple-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              هوامش الربح ({fields.filter(f => f.category === 'margin').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('operational')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeCategory === 'operational' 
                  ? 'bg-cyan-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              محددات التشغيل ({fields.filter(f => f.category === 'operational').length})
            </button>
          </div>

          {/* Search & Hidden Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في أسماء ومسميات البنود..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
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
              title="تصفية الحقول المخفية"
            >
              {showHiddenOnly ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{showHiddenOnly ? 'عرض المخفي فقط' : 'إظهار الكل'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-3">
        {filteredFields.length === 0 ? (
          <div className="p-8 text-center bg-slate-800/50 rounded-2xl border border-slate-700 text-slate-400 text-xs">
            لا توجد بنود مطابقة للبحث أو التصفية المحددة.
          </div>
        ) : (
          filteredFields.map((field) => {
            const isEditingThis = inlineEditingId === field.id;
            const categoryBadge = {
              capex: { text: 'CapEx استثماري', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
              opex: { text: 'OpEx تشغيلي', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
              margin: { text: 'هامش ربح', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
              operational: { text: 'محدد تشغيلي', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
            }[field.category];

            return (
              <div 
                key={field.id}
                className={`p-4 rounded-2xl border transition-all ${
                  field.isVisible 
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600 shadow-sm' 
                    : 'bg-slate-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Field Name & Details with inline rename */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryBadge.bg}`}>
                        {categoryBadge.text}
                      </span>
                      {field.isCustom && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          بند مخصص إضافي
                        </span>
                      )}
                      {!field.isVisible && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          <span>مخفي من دراسة الجدوى</span>
                        </span>
                      )}
                    </div>

                    {/* Inline Name Editing or Display */}
                    {isEditingThis ? (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={inlineLabelText}
                          onChange={(e) => setInlineLabelText(e.target.value)}
                          className="flex-1 bg-slate-950 border border-blue-500 rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
                          autoFocus
                          placeholder="اكتب المسمى الجديد للبند..."
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveInlineRename(field.id)}
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                          title="حفظ المسمى الجديد"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setInlineEditingId(null)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
                          title="إلغاء"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 pt-1">
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{field.label}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleStartInlineRename(field)}
                          className="p-1 text-slate-400 hover:text-blue-400 rounded transition-colors cursor-pointer"
                          title="تعديل اسم ومسمى هذا البند مباشرة"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {field.subLabel && (
                      <p className="text-xs text-slate-400">
                        {field.subLabel}
                      </p>
                    )}
                    {field.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {field.description}
                      </p>
                    )}
                  </div>

                  {/* Value and Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Value Input */}
                    <div className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">القيمة:</span>
                      <input
                        type="number"
                        step={field.category === 'margin' || field.category === 'operational' ? '0.1' : '10000'}
                        value={field.value}
                        onChange={(e) => handleUpdateValue(field.id, parseFloat(e.target.value) || 0)}
                        className="w-28 sm:w-36 bg-transparent text-sm sm:text-base font-mono font-bold text-emerald-400 focus:outline-none text-left"
                      />
                      <span className="text-xs font-bold text-slate-300 font-sans">{field.unit}</span>
                    </div>

                    {/* Visibility Toggle (Eye) */}
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(field.id)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        field.isVisible 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                          : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                      }`}
                      title={field.isVisible ? 'إخفاء هذا البند من دراسة الجدوى' : 'إظهار هذا البند وتفعيله في الحسابات'}
                    >
                      {field.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Full Edit Modal Trigger */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(field)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                      title="تعديل تفصيلي للبند (الاسم، الوصف، الوحدة)"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>

                    {/* Delete Trigger */}
                    {deleteConfirmId === field.id ? (
                      <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-500/50 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => handleDeleteField(field.id)}
                          className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                        >
                          تأكيد الحذف
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(field.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                        title="حذف هذا البند"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add New Field */}
      {isAddingField && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">إضافة بند / حقل جديد لدراسة الجدوى</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingField(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateField} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  تصنيف البند:
                </label>
                <select
                  value={newFieldCategory}
                  onChange={(e) => {
                    const cat = e.target.value as any;
                    setNewFieldCategory(cat);
                    if (cat === 'capex') setNewFieldUnit('ج.م');
                    else if (cat === 'opex') setNewFieldUnit('ج.م/سنة');
                    else if (cat === 'margin') setNewFieldUnit('ج.م/م³');
                    else setNewFieldUnit('%');
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="capex">تكلفة استثمارية رأسمالية (CapEx)</option>
                  <option value="opex">تكلفة تشغيلية وصيانة سنوية (OpEx)</option>
                  <option value="margin">هامش ربح مالي (Margin)</option>
                  <option value="operational">محدد تشغيلي أو فني (Operational)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  مسمى البند / الحقل (الاسم المعروض):
                </label>
                <input
                  type="text"
                  required
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="مثال: محطة محولات كهربائية خاصة 1 ميجاوات"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    القيمة المالية أو الرقمية:
                  </label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={newFieldValue}
                    onChange={(e) => setNewFieldValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    وحدة القياس:
                  </label>
                  <input
                    type="text"
                    required
                    value={newFieldUnit}
                    onChange={(e) => setNewFieldUnit(e.target.value)}
                    placeholder="ج.م أو ج.م/سنة أو %"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  وصف مختصر أو مواصفات فنية (اختياري):
                </label>
                <input
                  type="text"
                  value={newFieldSubLabel}
                  onChange={(e) => setNewFieldSubLabel(e.target.value)}
                  placeholder="مثال: محول جهد متوسط 22 ك.ف مع لوحة قواطع التوزيع"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ملاحظات إضافية (اختياري):
                </label>
                <textarea
                  rows={2}
                  value={newFieldDesc}
                  onChange={(e) => setNewFieldDesc(e.target.value)}
                  placeholder="أي تفاصيل تظهر لفرق دراسات الجدوى الهندسية..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingField(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  إضافة البند للمنظومة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Full Edit Existing Field */}
      {editingFieldId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">تعديل بيانات ومسمى البند</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingFieldId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  المسمى المعروض (Label):
                </label>
                <input
                  type="text"
                  value={editForm.label || ''}
                  onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                  placeholder="اكتب المسمى الجديد للبند"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    القيمة:
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editForm.value ?? 0}
                    onChange={(e) => setEditForm({ ...editForm, value: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    وحدة القياس:
                  </label>
                  <input
                    type="text"
                    value={editForm.unit || ''}
                    onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  الوصف الفني المختصر:
                </label>
                <input
                  type="text"
                  value={editForm.subLabel || ''}
                  onChange={(e) => setEditForm({ ...editForm, subLabel: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ملاحظات تفصيلية:
                </label>
                <textarea
                  rows={2}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingFieldId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditModal}
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
