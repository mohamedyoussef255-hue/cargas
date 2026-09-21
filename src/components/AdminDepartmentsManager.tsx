import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Edit3, 
  Trash2, 
  Plus, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Eye, 
  EyeOff,
  AlertTriangle,
  FolderPlus,
  Sparkles
} from 'lucide-react';
import { CustomDepartmentConfig } from '../types';

export const DEFAULT_DEPARTMENTS: CustomDepartmentConfig[] = [
  {
    id: 'projects',
    key: 'projects',
    title: 'إدارة المشروعات والأعمال المدنية',
    shortName: 'المشروعات',
    description: 'معاينة الموقع الإنشائية، المساحات والمقايسات، وحالة التربة والخرسانات',
    badge: 'الأعمال المدنية',
    defaultGmName: 'م. طارق عبد الرازق',
    defaultGmPhone: '+201001234567',
    iconName: 'Building2',
    isEnabled: true,
    order: 1
  },
  {
    id: 'operations',
    key: 'operations',
    title: 'إدارة التشغيل والصيانة (المعدات والآلات)',
    shortName: 'التشغيل',
    description: 'مواصفات الضواغط، طلمبات التموين، المولدات ومسارات حركة المركبات',
    badge: 'الضواغط والمعدات',
    defaultGmName: 'م. خالد الصاوي',
    defaultGmPhone: '+201009876543',
    iconName: 'Wrench',
    isEnabled: true,
    order: 2
  },
  {
    id: 'hse',
    key: 'hse',
    title: 'إدارة السلامة والأمن الصناعي (HSE)',
    shortName: 'السلامة والصحة المهنية',
    description: 'كود NFPA، مسافات الأمان، حساسات تسريب الميثان، وصمامات طوارئ ESD',
    badge: 'HSE والسلامة',
    defaultGmName: 'م. حسام البحيري',
    defaultGmPhone: '+201011223344',
    iconName: 'Flame',
    isEnabled: true,
    order: 3
  },
  {
    id: 'technical',
    key: 'technical',
    title: 'الإدارة الفنية وضغوط الشبكات',
    shortName: 'الشؤون الفنية',
    description: 'قطر خط الغاز، الضغط الوارد بالبار، ومحطات تخفيض الضغط والقياس PRMS',
    badge: 'الغاز والشبكات',
    defaultGmName: 'م. محمود الشريف',
    defaultGmPhone: '+201022334455',
    iconName: 'Cpu',
    isEnabled: true,
    order: 4
  },
  {
    id: 'licensing',
    key: 'licensing',
    title: 'إدارة التراخيص والموافقات الحكومية',
    shortName: 'التراخيص',
    description: 'موافقات الحماية المدنية، جهات الولاية، البيئة، ورخص تشغيل محطات الوقود',
    badge: 'التراخيص والمحليات',
    defaultGmName: 'أ. أشرف القاضي',
    defaultGmPhone: '+201033445566',
    iconName: 'FileCheck',
    isEnabled: true,
    order: 5
  },
  {
    id: 'legal',
    key: 'legal',
    title: 'الإدارة القانونية والعقود',
    shortName: 'الشؤون القانونية',
    description: 'سندات الملكية، التوكيلات، فحص النزاعات القضائية، وصياغة عقود الإيجار والتشغيل',
    badge: 'العقود والملكية',
    defaultGmName: 'المستشار شريف رمزي',
    defaultGmPhone: '+201044556677',
    iconName: 'Scale',
    isEnabled: true,
    order: 6
  },
  {
    id: 'financial',
    key: 'financial',
    title: 'إدارة الشئون المالية ودراسات الجدوى',
    shortName: 'الشؤون المالية',
    description: 'التكلفة الرأسمالية CAPEX، القيمة الإيجارية، المبيعات اليومية، وفترة استرداد التكلفة',
    badge: 'الجدوى الاقتصادية',
    defaultGmName: 'أ. وائل فهمي',
    defaultGmPhone: '+201055667788',
    iconName: 'BadgeDollarSign',
    isEnabled: true,
    order: 7
  },
  {
    id: 'marketing',
    key: 'marketing',
    title: 'إدارة التسويق والدراسات الميدانية',
    shortName: 'التسويق والمبيعات',
    description: 'حصر الكثافة المرورية، استهداف سيارات التاكسي والميكروباص، وتحليل المنافسين',
    badge: 'الحصر المروري',
    defaultGmName: 'م. أحمد الشناوي',
    defaultGmPhone: '+201066778899',
    iconName: 'Share2',
    isEnabled: true,
    order: 8
  }
];

export const AdminDepartmentsManager: React.FC = () => {
  const [departments, setDepartments] = useState<CustomDepartmentConfig[]>(() => {
    try {
      const stored = localStorage.getItem('cng_custom_departments_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DEPARTMENTS;
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingDept, setEditingDept] = useState<CustomDepartmentConfig | null>(null);

  // Form State
  const [deptKey, setDeptKey] = useState<string>('');
  const [deptTitle, setDeptTitle] = useState<string>('');
  const [deptShortName, setDeptShortName] = useState<string>('');
  const [deptDescription, setDeptDescription] = useState<string>('');
  const [deptBadge, setDeptBadge] = useState<string>('');
  const [deptGmName, setDeptGmName] = useState<string>('');
  const [deptGmPhone, setDeptGmPhone] = useState<string>('');
  const [deptOrder, setDeptOrder] = useState<number>(1);
  const [deptEnabled, setDeptEnabled] = useState<boolean>(true);

  const saveDepartments = (data: CustomDepartmentConfig[]) => {
    setDepartments(data);
    localStorage.setItem('cng_custom_departments_v1', JSON.stringify(data));
  };

  const openAddDept = () => {
    setEditingDept(null);
    setDeptKey(`dept_${Date.now()}`);
    setDeptTitle('');
    setDeptShortName('');
    setDeptDescription('');
    setDeptBadge('');
    setDeptGmName('');
    setDeptGmPhone('+2010...');
    setDeptOrder(departments.length + 1);
    setDeptEnabled(true);
    setShowModal(true);
  };

  const openEditDept = (dept: CustomDepartmentConfig) => {
    setEditingDept(dept);
    setDeptKey(dept.key);
    setDeptTitle(dept.title);
    setDeptShortName(dept.shortName || '');
    setDeptDescription(dept.description || '');
    setDeptBadge(dept.badge);
    setDeptGmName(dept.defaultGmName || '');
    setDeptGmPhone(dept.defaultGmPhone || '');
    setDeptOrder(dept.order ?? 1);
    setDeptEnabled(dept.isEnabled ?? true);
    setShowModal(true);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptTitle.trim() || !deptShortName.trim()) return;

    if (editingDept) {
      const updated = departments.map(d => d.id === editingDept.id ? {
        ...d,
        title: deptTitle.trim(),
        shortName: deptShortName.trim(),
        description: deptDescription.trim(),
        badge: deptBadge.trim(),
        defaultGmName: deptGmName.trim(),
        defaultGmPhone: deptGmPhone.trim(),
        order: deptOrder,
        isEnabled: deptEnabled
      } : d);
      saveDepartments(updated);
    } else {
      const newDept: CustomDepartmentConfig = {
        id: `dept-${Date.now()}`,
        key: deptKey.trim() || `dept_${Date.now()}`,
        title: deptTitle.trim(),
        shortName: deptShortName.trim(),
        description: deptDescription.trim(),
        badge: deptBadge.trim() || deptShortName.trim(),
        defaultGmName: deptGmName.trim(),
        defaultGmPhone: deptGmPhone.trim(),
        iconName: 'Building2',
        order: deptOrder,
        isEnabled: deptEnabled
      };
      saveDepartments([...departments, newDept]);
    }
    setShowModal(false);
  };

  const handleDeleteDept = (id: string, title: string) => {
    if (confirm(`هل أنت متأكد من رغبتك في حذف "${title}" من قائمة إدارات المنظومة؟`)) {
      const updated = departments.filter(d => d.id !== id);
      saveDepartments(updated);
    }
  };

  const handleToggleEnable = (id: string) => {
    const updated = departments.map(d => d.id === id ? { ...d, isEnabled: !d.isEnabled } : d);
    saveDepartments(updated);
  };

  const handleResetDefaults = () => {
    if (confirm('هل ترغب في إعادة ضبط قائمة إدارات شركة كارجاس إلى الهيكل القياسي؟')) {
      saveDepartments(DEFAULT_DEPARTMENTS);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              هيكل وتخصيص الإدارات: إضافة، تعديل مسميات، أو حذف إدارة
            </h3>
            <p className="text-xs text-slate-400">
              التحكم في المسمى الكامل والمختصر لكافة الإدارات، الوصف الوظيفي، وتعديل بطاقات العمل
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>الهيكل القياسي</span>
          </button>

          <button
            onClick={openAddDept}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>إضافة إدارة جديدة</span>
          </button>
        </div>
      </div>

      {/* Departments Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">م</th>
              <th className="py-3 px-4">المسمى الرسمي للإدارة</th>
              <th className="py-3 px-4">الاسم المختصر</th>
              <th className="py-3 px-4">الوصف واختصاصات العمل</th>
              <th className="py-3 px-4">المدير العام المسؤول</th>
              <th className="py-3 px-4 text-center">الحالة</th>
              <th className="py-3 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {departments.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((dept, index) => {
              const deptId = dept.id || dept.key;
              return (
              <tr key={deptId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-slate-500 font-bold">{index + 1}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">{dept.title}</div>
                  <span className="font-mono text-[10px] text-indigo-400">ID: {dept.key}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800">
                    {dept.shortName || dept.title}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300 max-w-xs truncate" title={dept.description}>
                  {dept.description || dept.subtitle}
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-200">{dept.defaultGmName || 'غير محدد'}</div>
                  <div className="font-mono text-[10px] text-slate-400">{dept.defaultGmPhone}</div>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleToggleEnable(deptId)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                      dept.isEnabled
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {dept.isEnabled ? 'مفعلة' : 'متوقفة'}
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => openEditDept(dept)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                      title="تعديل اسم وبيانات الإدارة"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDept(deptId, dept.title)}
                      className="p-1 rounded bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                      title="إزالة الإدارة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      {/* Modal: Edit / Add Department */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveDept} className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white">
                {editingDept ? 'تعديل بيانات واسم الإدارة' : 'إضافة إدارة جديدة للهيكل'}
              </h4>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">اسم الإدارة الرسمي بالكامل:</label>
                <input
                  type="text"
                  required
                  value={deptTitle}
                  onChange={(e) => setDeptTitle(e.target.value)}
                  placeholder="مثال: إدارة المشروعات والأعمال المدنية..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">الاسم المختصر (للقوائم):</label>
                  <input
                    type="text"
                    required
                    value={deptShortName}
                    onChange={(e) => setDeptShortName(e.target.value)}
                    placeholder="المشروعات..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">شارة الإدارة (Badge):</label>
                  <input
                    type="text"
                    value={deptBadge}
                    onChange={(e) => setDeptBadge(e.target.value)}
                    placeholder="الأعمال المدنية..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">الوصف الوظيفي والمهام:</label>
                <textarea
                  rows={2}
                  value={deptDescription}
                  onChange={(e) => setDeptDescription(e.target.value)}
                  placeholder="اختصاصات ومهام عمل الإدارة في معاينة وتجهيز المحطات..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">اسم المدير العام:</label>
                  <input
                    type="text"
                    value={deptGmName}
                    onChange={(e) => setDeptGmName(e.target.value)}
                    placeholder="م. ..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">هاتف المدير العام:</label>
                  <input
                    type="text"
                    value={deptGmPhone}
                    onChange={(e) => setDeptGmPhone(e.target.value)}
                    placeholder="+201..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">ترتيب الظهور:</label>
                  <input
                    type="number"
                    value={deptOrder}
                    onChange={(e) => setDeptOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">حالة التفعيل:</label>
                  <select
                    value={deptEnabled ? 'true' : 'false'}
                    onChange={(e) => setDeptEnabled(e.target.value === 'true')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="true">مفعلة وتظهر بالمنظومة</option>
                    <option value="false">معطلة ومخفية</option>
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
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                حفظ بيانات الإدارة
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
