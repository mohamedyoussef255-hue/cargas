import React, { useState, useEffect } from 'react';
import { 
  ListFilter, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Sliders, 
  Eye, 
  EyeOff, 
  X,
  Search,
  Sparkles
} from 'lucide-react';
import { DropdownOptionItem } from '../types';

export const DEFAULT_DROPDOWN_CATEGORIES = [
  { id: 'governorates', name: 'قائمة المحافظات', dept: 'عام' },
  { id: 'site_types', name: 'أنواع المواقع والأراضي', dept: 'المشروعات' },
  { id: 'compressor_capacities', name: 'سعات وطاقات الضواغط (م3/س)', dept: 'التشغيل' },
  { id: 'pipeline_pressures', name: 'ضغوط خطوط الغاز (بار)', dept: 'الشؤون الفنية' },
  { id: 'deed_types', name: 'سندات الملكية والوثائق القانونية', dept: 'القانونية' },
  { id: 'licensing_authorities', name: 'جهات الولاية والتراخيص', dept: 'التراخيص' },
  { id: 'firefighting_systems', name: 'منظومات السلامة والإطفاء', dept: 'السلامة HSE' },
  { id: 'vehicle_types', name: 'أنواع وفئات المركبات المستهدفة', dept: 'التسويق' }
];

export const INITIAL_DROPDOWN_ITEMS: DropdownOptionItem[] = [
  // Governorates
  { id: 'gov-1', category: 'governorates', label: 'القاهرة', value: 'القاهرة', order: 1, isEnabled: true },
  { id: 'gov-2', category: 'governorates', label: 'الجيزة', value: 'الجيزة', order: 2, isEnabled: true },
  { id: 'gov-3', category: 'governorates', label: 'القليوبية', value: 'القليوبية', order: 3, isEnabled: true },
  { id: 'gov-4', category: 'governorates', label: 'الإسكندرية', value: 'الإسكندرية', order: 4, isEnabled: true },
  { id: 'gov-5', category: 'governorates', label: 'الشرقية', value: 'الشرقية', order: 5, isEnabled: true },
  { id: 'gov-6', category: 'governorates', label: 'الغربية', value: 'الغربية', order: 6, isEnabled: true },
  { id: 'gov-7', category: 'governorates', label: 'بني سويف', value: 'بني سويف', order: 7, isEnabled: true },
  { id: 'gov-8', category: 'governorates', label: 'السويس', value: 'السويس', order: 8, isEnabled: true },
  
  // Site Types
  { id: 'st-1', category: 'site_types', label: 'محطة وقود سائل قائمة (إضافة غاز)', value: 'liquid_existing', order: 1, isEnabled: true },
  { id: 'st-2', category: 'site_types', label: 'أرض فضاء جديدة (Greenfield)', value: 'greenfield', order: 2, isEnabled: true },
  { id: 'st-3', category: 'site_types', label: 'جراج أسطول نقل عام / شركات', value: 'fleet_depot', order: 3, isEnabled: true },
  { id: 'st-4', category: 'site_types', label: 'محطة شريكة على طريق سريع', value: 'highway_station', order: 4, isEnabled: true },

  // Compressor Capacities
  { id: 'cc-1', category: 'compressor_capacities', label: '500 م3/ساعة (محطة صغيرة)', value: '500', order: 1, isEnabled: true },
  { id: 'cc-2', category: 'compressor_capacities', label: '1000 م3/ساعة (محطة متوسطة)', value: '1000', order: 2, isEnabled: true },
  { id: 'cc-3', category: 'compressor_capacities', label: '1500 م3/ساعة (محطة قياسية كارجاس)', value: '1500', order: 3, isEnabled: true },
  { id: 'cc-4', category: 'compressor_capacities', label: '2000 م3/ساعة (محطة كثيفة المرور)', value: '2000', order: 4, isEnabled: true },
  { id: 'cc-5', category: 'compressor_capacities', label: '3000 م3/ساعة (محطة عملاقة جراج)', value: '3000', order: 5, isEnabled: true },

  // Pipeline Pressures
  { id: 'pp-1', category: 'pipeline_pressures', label: '7 بار (ضغط منخفض - يحتاج ضاغط خاص)', value: '7', order: 1, isEnabled: true },
  { id: 'pp-2', category: 'pipeline_pressures', label: '16 بار (ضغط متوسط مثالي)', value: '16', order: 2, isEnabled: true },
  { id: 'pp-3', category: 'pipeline_pressures', label: '25 بار (ضغط عالي ممتاز)', value: '25', order: 3, isEnabled: true },
  { id: 'pp-4', category: 'pipeline_pressures', label: '35 بار (ربط شبكة قومية)', value: '35', order: 4, isEnabled: true },
  { id: 'pp-5', category: 'pipeline_pressures', label: '70 بار (خط رئيسي PRMS)', value: '70', order: 5, isEnabled: true },

  // Deed Types
  { id: 'dt-1', category: 'deed_types', label: 'عقد مسجل شهر عقاري نهائي', value: 'registered_deed', order: 1, isEnabled: true },
  { id: 'dt-2', category: 'deed_types', label: 'عقد بيع ابتدائي + صحة توقيع', value: 'primary_signature', order: 2, isEnabled: true },
  { id: 'dt-3', category: 'deed_types', label: 'قرار تخصيص من هيئة المجتمعات العمرانية', value: 'new_urban_allocation', order: 3, isEnabled: true },
  { id: 'dt-4', category: 'deed_types', label: 'عقد إيجار طويل الأجل (15-25 سنة)', value: 'long_term_lease', order: 4, isEnabled: true },
  { id: 'dt-5', category: 'deed_types', label: 'حق انتفاع رسمي صادر من جهة حكومية', value: 'usufruct_right', order: 5, isEnabled: true },

  // Licensing Authorities
  { id: 'la-1', category: 'licensing_authorities', label: 'هيئة المجتمعات العمرانية الجديدة وأجهزة المدن', value: 'urban_authority', order: 1, isEnabled: true },
  { id: 'la-2', category: 'licensing_authorities', label: 'الإدارة المحلية ووحدات الأحياء والمراكز', value: 'local_municipality', order: 2, isEnabled: true },
  { id: 'la-3', category: 'licensing_authorities', label: 'الهيئة العامة للتنمية السياحية', value: 'tourism_dev', order: 3, isEnabled: true },
  { id: 'la-4', category: 'licensing_authorities', label: 'الهيئة العامة للرقابة على الصادرات والواردات', value: 'import_export', order: 4, isEnabled: true }
];

export const AdminDropdownOptionsManager: React.FC = () => {
  const [items, setItems] = useState<DropdownOptionItem[]>(() => {
    try {
      const stored = localStorage.getItem('cng_dropdown_options_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DROPDOWN_ITEMS;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('governorates');
  const [search, setSearch] = useState<string>('');

  // Edit / Add modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DropdownOptionItem | null>(null);
  const [itemLabel, setItemLabel] = useState<string>('');
  const [itemValue, setItemValue] = useState<string>('');
  const [itemOrder, setItemOrder] = useState<number>(1);
  const [itemEnabled, setItemEnabled] = useState<boolean>(true);

  const saveToStorage = (updated: DropdownOptionItem[]) => {
    setItems(updated);
    localStorage.setItem('cng_dropdown_options_v1', JSON.stringify(updated));
  };

  const currentCategoryItems = items.filter(i => i.category === selectedCategory);
  const filteredItems = currentCategoryItems.filter(i => 
    i.label.includes(search) || i.value.includes(search)
  );

  const openAddModal = () => {
    setEditingItem(null);
    setItemLabel('');
    setItemValue('');
    setItemOrder(currentCategoryItems.length + 1);
    setItemEnabled(true);
    setShowModal(true);
  };

  const openEditModal = (item: DropdownOptionItem) => {
    setEditingItem(item);
    setItemLabel(item.label);
    setItemValue(item.value);
    setItemOrder(item.order ?? 1);
    setItemEnabled(item.isEnabled ?? true);
    setShowModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemLabel.trim()) return;

    if (editingItem) {
      const updated = items.map(i => i.id === editingItem.id ? {
        ...i,
        label: itemLabel.trim(),
        value: itemValue.trim() || itemLabel.trim(),
        order: itemOrder,
        isEnabled: itemEnabled
      } : i);
      saveToStorage(updated);
    } else {
      const newItem: DropdownOptionItem = {
        id: `opt-${Date.now()}`,
        category: selectedCategory,
        label: itemLabel.trim(),
        value: itemValue.trim() || itemLabel.trim(),
        order: itemOrder,
        isEnabled: itemEnabled
      };
      saveToStorage([...items, newItem]);
    }
    setShowModal(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الخيار من القائمة المنسدلة؟')) {
      const updated = items.filter(i => i.id !== id);
      saveToStorage(updated);
    }
  };

  const handleToggleEnable = (id: string) => {
    const updated = items.map(i => i.id === id ? { ...i, isEnabled: !i.isEnabled } : i);
    saveToStorage(updated);
  };

  const handleResetDefaults = () => {
    if (confirm('هل ترغب في استعادة القوائم المنسدلة الافتراضية لمنظومة كارجاس؟')) {
      saveToStorage(INITIAL_DROPDOWN_ITEMS);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ListFilter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              التحكم في القوائم المنسدلة بالتطبيق لكافة الإدارات
            </h3>
            <p className="text-xs text-slate-400">
              إضافة، تعديل، إخفاء أو إزالة عناصر القوائم المنسدلة في استمارات المحافظات والضواغط والشبكات والتراخيص
            </p>
          </div>
        </div>

        <button
          onClick={handleResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة الافتراضيات</span>
        </button>
      </div>

      {/* Main Grid: Category Selector on Right, Items on Left */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Category List */}
        <div className="md:col-span-4 space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          <span className="text-xs font-bold text-slate-400 px-2 block mb-2">
            اختر القائمة المنسدلة للتعديل:
          </span>
          {DEFAULT_DROPDOWN_CATEGORIES.map(cat => {
            const count = items.filter(i => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition-all text-right cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                <div>
                  <div className="block">{cat.name}</div>
                  <span className={`text-[10px] block ${isSelected ? 'text-purple-200' : 'text-slate-500'}`}>
                    الإدارة: {cat.dept}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-purple-900/80 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Items Management */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                <span>عناصر:</span>
                <span className="text-purple-400 font-black">
                  {DEFAULT_DROPDOWN_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                </span>
              </h4>
              <span className="text-[11px] text-slate-400">
                إجمالي العناصر: {currentCategoryItems.length} (مفعل: {currentCategoryItems.filter(i => i.isEnabled).length})
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-44">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث في العناصر..."
                  className="w-full pr-8 pl-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <button
                onClick={openAddModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة عنصر للقائمة</span>
              </button>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">الترتيب</th>
                  <th className="py-2.5 px-3">النص الظاهر في القائمة (Label)</th>
                  <th className="py-2.5 px-3">القيمة البرمجية (Value)</th>
                  <th className="py-2.5 px-3 text-center">الظهور</th>
                  <th className="py-2.5 px-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{item.order}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{item.label}</td>
                    <td className="py-2.5 px-3 font-mono text-purple-300 text-[11px]">{item.value}</td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => handleToggleEnable(item.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                          item.isEnabled
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {item.isEnabled ? 'مفعل ويظهر' : 'مخفي'}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                          title="تعديل"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 rounded bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveItem} className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white">
                {editingItem ? 'تعديل عنصر في القائمة المنسدلة' : 'إضافة عنصر جديد للقائمة'}
              </h4>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">النص الظاهر في القائمة (بالعربية):</label>
                <input
                  type="text"
                  required
                  value={itemLabel}
                  onChange={(e) => setItemLabel(e.target.value)}
                  placeholder="مثال: مطروح، 2500 م3/س، الخ..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">القيمة البرمجية / الرمز الإنجليزي (اختياري):</label>
                <input
                  type="text"
                  value={itemValue}
                  onChange={(e) => setItemValue(e.target.value)}
                  placeholder="إذا تُرك فارغاً فسيتم استخدام نفس النص"
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">ترتيب الظهور:</label>
                  <input
                    type="number"
                    value={itemOrder}
                    onChange={(e) => setItemOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">حالة التفعيل:</label>
                  <select
                    value={itemEnabled ? 'true' : 'false'}
                    onChange={(e) => setItemEnabled(e.target.value === 'true')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="true">مفعل ويظهر للمستخدمين</option>
                    <option value="false">معطل ومخفي مؤقتاً</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                حفظ العنصر
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
