import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Building2,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Save,
  Info,
  Filter,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  Sliders,
  Check
} from 'lucide-react';
import { DepartmentRole } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import {
  ALL_DEPARTMENT_PAGES,
  DepartmentPagesPermissionsConfig,
  getDepartmentPagePermissions,
  saveDepartmentPagePermissions,
  DEFAULT_DEPARTMENT_PAGE_PERMISSIONS,
  DepartmentInternalPageId
} from '../data/departmentPagePermissions';

interface AdminDepartmentPermissionsManagerProps {
  onPreviewDepartment?: (dept: DepartmentRole, previewUserType?: 'gm' | 'staff') => void;
}

export const AdminDepartmentPermissionsManager: React.FC<AdminDepartmentPermissionsManagerProps> = ({
  onPreviewDepartment,
}) => {
  const [permissions, setPermissions] = useState<DepartmentPagesPermissionsConfig>(() =>
    getDepartmentPagePermissions()
  );
  const [selectedDept, setSelectedDept] = useState<DepartmentRole>('marketing');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Sync state if changed from another tab/event
  useEffect(() => {
    const handleUpdate = () => {
      setPermissions(getDepartmentPagePermissions());
    };
    window.addEventListener('cng_department_page_permissions_updated', handleUpdate);
    return () => {
      window.removeEventListener('cng_department_page_permissions_updated', handleUpdate);
    };
  }, []);

  const meta = DEPARTMENTS_METADATA[selectedDept] || {
    title: `إدارة ${selectedDept}`,
    badge: 'إدارة تخصصية',
    subtitle: 'بيئة عمل الإدارة',
  };

  const handleToggle = (pageId: string, role: 'gm' | 'staff') => {
    const currentDeptPerms = permissions[selectedDept] || {};
    const currentPagePerm = currentDeptPerms[pageId] || { gm: true, staff: true };
    const nextVal = !currentPagePerm[role];

    const updatedDeptPerms = {
      ...currentDeptPerms,
      [pageId]: {
        ...currentPagePerm,
        [role]: nextVal,
      },
    };

    const updatedAll = {
      ...permissions,
      [selectedDept]: updatedDeptPerms,
    };

    setPermissions(updatedAll);
    saveDepartmentPagePermissions(updatedAll);

    setSaveSuccessMsg(`تم تحديث صلاحية صفحة "${pageId}" فورياً`);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  // Quick preset: Enable all for GM
  const handleEnableAllForGM = () => {
    const currentDeptPerms = { ...(permissions[selectedDept] || {}) };
    ALL_DEPARTMENT_PAGES.forEach((page) => {
      if (!page.isMarketingSpecific || selectedDept === 'marketing') {
        currentDeptPerms[page.id] = {
          ...(currentDeptPerms[page.id] || { gm: true, staff: true }),
          gm: true,
        };
      }
    });

    const updated = { ...permissions, [selectedDept]: currentDeptPerms };
    setPermissions(updated);
    saveDepartmentPagePermissions(updated);
    setSaveSuccessMsg('تم تفعيل كافة الصفحات للمدير العام بنجاح');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Quick preset: Restrict staff (hide marketing hub / radar and high-level KPIs)
  const handleApplyStaffPresets = () => {
    const currentDeptPerms = { ...(permissions[selectedDept] || {}) };
    ALL_DEPARTMENT_PAGES.forEach((page) => {
      if (!page.isMarketingSpecific || selectedDept === 'marketing') {
        const isHiddenForStaff =
          page.id === 'marketing_hub' ||
          page.id === 'landowners' ||
          page.id === 'kpis';

        currentDeptPerms[page.id] = {
          ...(currentDeptPerms[page.id] || { gm: true, staff: true }),
          staff: !isHiddenForStaff,
        };
      }
    });

    const updated = { ...permissions, [selectedDept]: currentDeptPerms };
    setPermissions(updated);
    saveDepartmentPagePermissions(updated);
    setSaveSuccessMsg('تم تطبيق وضع الموظفين والمهندسين (إخفاء رادار التسويق والمؤشرات الحساسة)');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Quick preset: Enable all for both
  const handleEnableAllForBoth = () => {
    const currentDeptPerms = { ...(permissions[selectedDept] || {}) };
    ALL_DEPARTMENT_PAGES.forEach((page) => {
      if (!page.isMarketingSpecific || selectedDept === 'marketing') {
        currentDeptPerms[page.id] = { gm: true, staff: true };
      }
    });

    const updated = { ...permissions, [selectedDept]: currentDeptPerms };
    setPermissions(updated);
    saveDepartmentPagePermissions(updated);
    setSaveSuccessMsg('تم إظهار كافة الصفحات للجميع (المدير والموظفون)');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Reset to system defaults
  const handleResetToDefaults = () => {
    if (window.confirm('هل أنت متأكد من استعادة الضبط القياسي المعتمد لصلاحيات وصفحات الإدارات؟')) {
      setPermissions(DEFAULT_DEPARTMENT_PAGE_PERMISSIONS);
      saveDepartmentPagePermissions(DEFAULT_DEPARTMENT_PAGE_PERMISSIONS);
      setSaveSuccessMsg('تمت استعادة الضبط القياسي لجميع الإدارات والأدوار بنجاح');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  // Filter pages for selected department
  const applicablePages = useMemo(() => {
    return ALL_DEPARTMENT_PAGES.filter((p) => {
      if (p.isMarketingSpecific && selectedDept !== 'marketing') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.shortTitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedDept, searchQuery]);

  // Statistics for selected department
  const stats = useMemo(() => {
    const deptPerms = permissions[selectedDept] || {};
    let gmCount = 0;
    let staffCount = 0;
    const total = applicablePages.length;

    applicablePages.forEach((p) => {
      const perm = deptPerms[p.id] ?? { gm: true, staff: true };
      if (perm.gm !== false) gmCount++;
      if (perm.staff !== false) staffCount++;
    });

    return { gmCount, staffCount, total };
  }, [permissions, selectedDept, applicablePages]);

  const departmentsList: DepartmentRole[] = [
    'marketing',
    'projects',
    'operations',
    'hse',
    'technical',
    'licensing',
    'legal',
    'financial',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner & Instructions */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  صلاحيات وظهور الصفحات الداخلية بكل إدارة
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  تحكم مباشر لمدير النظام
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                تحكم بدقة فيما يظهر للمدير العام وما يظهر للموظفين أو المهندسين لكل صفحة داخلية. على سبيل المثال: إظهار <span className="text-amber-300 font-bold">منظومة تسويق المحطات ورادار الحركة</span> للمدير العام وإخفاؤها عن الموظفين فورياً بضغطة زر واحدة.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={handleResetToDefaults}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all shadow cursor-pointer"
              title="استعادة الضبط القياسي الافتراضي"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>استعادة الافتراضي</span>
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Departments Selection Tabs */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-indigo-400" />
          <span>اختر الإدارة المستهدفة لتعديل ظهور صفحاتها:</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {departmentsList.map((deptKey) => {
            const dMeta = DEPARTMENTS_METADATA[deptKey];
            const isSelected = selectedDept === deptKey;
            const isMkt = deptKey === 'marketing';

            return (
              <button
                key={deptKey}
                onClick={() => setSelectedDept(deptKey)}
                className={`p-3 rounded-xl text-right transition-all flex flex-col justify-between cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 scale-[1.02]'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {dMeta?.badge || 'إدارة'}
                  </span>
                  {isMkt && (
                    <span className="text-[10px] text-amber-300 animate-pulse font-bold" title="تحتوي على رادار الحركة">
                      ★ رادار
                    </span>
                  )}
                </div>
                <div className="text-xs font-black truncate">{dMeta?.title || deptKey}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Selected Department Summary & Actions */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-black text-white">{meta.title}</h4>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {meta.badge}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <span>
              إجمالي الصفحات: <strong className="text-white font-mono">{stats.total}</strong>
            </span>
            <span className="text-indigo-300">
              ظاهرة للمدير العام: <strong className="font-mono text-emerald-400">{stats.gmCount}</strong>
            </span>
            <span className="text-amber-300">
              ظاهرة للموظفين والمهندسين: <strong className="font-mono text-amber-400">{stats.staffCount}</strong>
            </span>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleEnableAllForGM}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all shadow cursor-pointer"
            title="تفعيل ظهور كافة الصفحات للمدير العام"
          >
            تفعيل الكل للمدير
          </button>
          <button
            onClick={handleApplyStaffPresets}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow cursor-pointer"
            title="حجب رادار الحركة والمؤشرات الاستراتيجية عن الموظفين"
          >
            وضع الموظفين (حجب الرادار)
          </button>
          <button
            onClick={handleEnableAllForBoth}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all shadow cursor-pointer"
            title="إظهار كافة الصفحات لكلا الرتبتين"
          >
            إظهار الكل للجميع
          </button>

          {/* Live Preview Button */}
          {onPreviewDepartment && (
            <div className="flex items-center gap-1.5 mr-2">
              <button
                onClick={() => onPreviewDepartment(selectedDept, 'gm')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow flex items-center gap-1 cursor-pointer"
                title="معاينة فورية لواجهة الإدارة برتبة المدير العام"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>معاينة كمدير</span>
              </button>
              <button
                onClick={() => onPreviewDepartment(selectedDept, 'staff')}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black transition-all shadow flex items-center gap-1 cursor-pointer"
                title="معاينة فورية لواجهة الإدارة برتبة موظف / مهندس"
              >
                <Users className="w-3.5 h-3.5" />
                <span>معاينة كموظف</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Input Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="بحث في أسماء الصفحات الداخلية للإدارة..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Pages Table / Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800">
          {applicablePages.map((page) => {
            const deptPerms = permissions[selectedDept] || {};
            const perm = deptPerms[page.id] ?? { gm: true, staff: true };
            const isGmVisible = perm.gm !== false;
            const isStaffVisible = perm.staff !== false;
            const isMarketingRadar = page.id === 'marketing_hub';

            return (
              <div
                key={page.id}
                className={`p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
                  isMarketingRadar
                    ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900 to-indigo-950/20 border-r-4 border-r-emerald-500'
                    : 'hover:bg-slate-850/60'
                }`}
              >
                {/* Page Info */}
                <div className="flex items-start gap-3.5 max-w-xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isMarketingRadar
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {isMarketingRadar ? (
                      <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                    ) : (
                      <Sliders className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-sm font-black text-white">{page.title}</h5>
                      {isMarketingRadar && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          المطلوبة في رغبة الإدارة (رادار الحركة)
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                        ID: {page.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {page.description}
                    </p>
                    {isMarketingRadar && (
                      <p className="text-[11px] text-amber-300 font-semibold mt-1">
                        ★ إعداد مقترح: مفعّلة للمدير العام ومخفية عن الموظفين والمهندسين.
                      </p>
                    )}
                  </div>
                </div>

                {/* Role Toggles Controls */}
                <div className="flex items-center gap-3 self-stretch md:self-center justify-between md:justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  {/* GM Toggle */}
                  <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-xl">
                    <div className="text-right">
                      <span className="block text-[11px] font-bold text-slate-200">المدير العام (GM)</span>
                      <span className={`text-[10px] font-black ${isGmVisible ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isGmVisible ? 'ظاهرة للمدير' : 'مخفية'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(page.id, 'gm')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isGmVisible ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                      title={isGmVisible ? 'إخفاء هذه الصفحة عن المدير العام' : 'إظهار هذه الصفحة للمدير العام'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isGmVisible ? '-translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Staff / Engineers Toggle */}
                  <div className={`flex items-center gap-2 bg-slate-950/80 border px-3.5 py-2 rounded-xl ${
                    isMarketingRadar && !isStaffVisible
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-slate-800'
                  }`}>
                    <div className="text-right">
                      <span className="block text-[11px] font-bold text-slate-200">الموظفون والمهندسون</span>
                      <span className={`text-[10px] font-black ${isStaffVisible ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isStaffVisible ? 'ظاهرة للموظف' : 'مخفية عن الموظف'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(page.id, 'staff')}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isStaffVisible ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                      title={isStaffVisible ? 'إخفاء هذه الصفحة عن الموظفين والمهندسين' : 'إظهار هذه الصفحة للموظفين والمهندسين'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isStaffVisible ? '-translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
