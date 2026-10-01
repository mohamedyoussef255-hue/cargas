import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Share2, 
  Building2, 
  Flame, 
  Wrench, 
  Cpu, 
  FileCheck, 
  Scale, 
  BadgeDollarSign, 
  Lock, 
  Key, 
  CheckCircle2, 
  ChevronLeft,
  Mail,
  Users,
  KeyRound,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  Eye,
  X
} from 'lucide-react';
import { DepartmentRole } from '../types';
import { DEPARTMENTS_METADATA, DEPARTMENT_ROLE_SPECS } from '../data/departmentCustomFields';
import { loadDepartmentCredentials } from '../data/authCredentials';

interface DepartmentPortalLandingProps {
  onSelectRole: (role: DepartmentRole) => void;
  onOpenAdminLogin: () => void;
  onOpenDeptLogin: (role: DepartmentRole) => void;
  onAdminQuickLoginDept?: (role: DepartmentRole) => void;
  isAdminLoggedIn?: boolean;
}

export const DepartmentPortalLanding: React.FC<DepartmentPortalLandingProps> = ({
  onSelectRole,
  onOpenAdminLogin,
  onOpenDeptLogin,
  onAdminQuickLoginDept,
  isAdminLoggedIn = false,
}) => {
  const [hoveredRole, setHoveredRole] = useState<DepartmentRole | null>(null);
  const [sectorFilter, setSectorFilter] = useState<'all' | 'technical' | 'administrative'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [adminClickCount, setAdminClickCount] = useState<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const deptCreds = loadDepartmentCredentials();

  const handleSecretAdminTrigger = () => {
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    const nextCount = adminClickCount + 1;
    if (nextCount >= 5) {
      setAdminClickCount(0);
      onOpenAdminLogin();
    } else {
      setAdminClickCount(nextCount);
      clickTimerRef.current = setTimeout(() => {
        setAdminClickCount(0);
      }, 3500);
    }
  };

  const getRoleIcon = (role: DepartmentRole) => {
    switch (role) {
      case 'marketing':
        return <Share2 className="w-6 h-6 text-indigo-400" />;
      case 'projects':
        return <Building2 className="w-6 h-6 text-blue-400" />;
      case 'hse':
        return <Flame className="w-6 h-6 text-emerald-400" />;
      case 'operations':
        return <Wrench className="w-6 h-6 text-amber-400" />;
      case 'technical':
        return <Cpu className="w-6 h-6 text-teal-400" />;
      case 'licensing':
        return <FileCheck className="w-6 h-6 text-orange-400" />;
      case 'legal':
        return <Scale className="w-6 h-6 text-purple-400" />;
      case 'financial':
        return <BadgeDollarSign className="w-6 h-6 text-cyan-400" />;
      default:
        return <Building2 className="w-6 h-6 text-slate-400" />;
    }
  };

  const departmentsList: DepartmentRole[] = [
    'marketing',
    'projects',
    'operations',
    'hse',
    'technical',
    'licensing',
    'legal',
    'financial'
  ];

  const technicalRoles: DepartmentRole[] = ['operations', 'projects', 'hse', 'technical'];
  const adminRoles: DepartmentRole[] = ['marketing', 'financial', 'legal', 'licensing'];

  const filteredDepartments = departmentsList.filter((role) => {
    // Sector filter
    if (sectorFilter === 'technical' && !technicalRoles.includes(role)) return false;
    if (sectorFilter === 'administrative' && !adminRoles.includes(role)) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const meta = DEPARTMENTS_METADATA[role];
      const cred = deptCreds[role];
      const titleMatch = meta?.title?.toLowerCase().includes(q);
      const subMatch = meta?.subtitle?.toLowerCase().includes(q);
      const gmMatch = cred?.defaultGmName?.toLowerCase().includes(q);
      if (!titleMatch && !subMatch && !gmMatch) return false;
    }

    return true;
  });

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>بوابة الدخول الموحدة لإدارات كارجاس • CARGAS NGV Unified Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                منظومة إدارة مشروعات ومحطات كارجاس
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                بوابة مركزية معتمدة لإدارات شركة كارجاس للغاز الطبيعي. يتم الدخول إلى بيئات العمل المتخصصة بكلمة المرور الرسمية المعتمدة لكل إدارة ومتابعة التقارير والمطابقة الفنية.
              </p>
            </div>

            {/* If Admin is already logged in, show status & return button */}
            {isAdminLoggedIn && (
              <div className="w-full md:w-auto shrink-0">
                <button
                  type="button"
                  id="btn-admin-portal-link"
                  onClick={onOpenAdminLogin}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>لوحة تحكم مدير النظام المركزية</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Isolation & Protection Features */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>عزل الصلاحيات:</strong> بيئات عمل مستقلة تماماً لكل قطاع وإدارة تنفيذية</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
              <span><strong>دخول معتمد:</strong> كلمة مرور مشفرة ومخصصة لمسؤولي وموظفي كل إدارة</span>
            </div>
          </div>
        </div>

        {/* 1. Super Admin Card - ONLY visible if already logged in as Admin */}
        {isAdminLoggedIn && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/40 p-6 sm:p-7 shadow-xl hover:border-emerald-400 transition-all group">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      جلسة نشطة ومسجلة
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      SUPER ADMIN • PIN 0000
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    لوحة تحكم إدارة النظام والتحكم الشامل
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    أنت مسجل كمدير النظام برمز 0000. يمكنك العودة مباشرة إلى لوحة التحكم المركزية ومتابعة تقارير كافة الإدارات.
                  </p>
                </div>
              </div>

              <button
                id="btn-admin-portal-login"
                onClick={onOpenAdminLogin}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>العودة للوحة تحكم إدارة النظام</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 2. Departments Grid (8 Departments) with Sector Filtering and Search */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>إدارات وبيئات عمل كارجاس المستقلة</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                  {filteredDepartments.length} من 8 إدارات
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                تصفح الإدارات حسب التخصص والقطاع الوظيفي أو بالبحث المباشر.
              </p>
            </div>

            {/* Sector Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن إدارة أو مدير عام..."
                  className="pr-9 pl-8 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-56"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSectorFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sectorFilter === 'all'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الكل (8)
                </button>
                <button
                  type="button"
                  onClick={() => setSectorFilter('technical')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sectorFilter === 'technical'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="التشغيل والصيانة، المشروعات، الأمن الصناعي، الفنية"
                >
                  هندسي وفني (4)
                </button>
                <button
                  type="button"
                  onClick={() => setSectorFilter('administrative')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sectorFilter === 'administrative'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="التسويق، المالية، القانونية، التراخيص"
                >
                  مالي وتجاري (4)
                </button>
              </div>
            </div>
          </div>

          {filteredDepartments.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
              <p className="text-slate-300 text-sm font-bold">لا توجد إدارات مطابقة لبحثك</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSectorFilter('all');
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                إظهار كافة الإدارات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDepartments.map((role) => {
              const meta = DEPARTMENTS_METADATA[role];
              const spec = DEPARTMENT_ROLE_SPECS[role];
              const cred = deptCreds[role];
              const gmName = cred?.defaultGmName || 'مدير عام الإدارة';
              const gmTitle = cred?.gmTitle || spec?.gmTitle;
              const isOps = role === 'operations';
              const isMarketing = role === 'marketing';

              return (
                <div
                  key={role}
                  id={`card-dept-${role}`}
                  onMouseEnter={() => setHoveredRole(role)}
                  onMouseLeave={() => setHoveredRole(null)}
                  className={`relative group rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden ${
                    isOps
                      ? 'bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900 border-amber-500/30 hover:border-amber-400 shadow-lg shadow-amber-950/20'
                      : isMarketing
                      ? 'bg-gradient-to-b from-indigo-950/20 via-slate-900 to-slate-900 border-indigo-500/30 hover:border-indigo-400'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top: Entry Icon Button & Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        id={`btn-icon-dept-${role}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDeptLogin(role);
                        }}
                        title={`تسجيل الدخول إلى ${meta.title}`}
                        className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-indigo-500/60 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md group/icon"
                      >
                        {getRoleIcon(role)}
                      </button>

                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {meta.badge}
                        </span>
                        <span className="text-[9px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>دخول محمي</span>
                        </span>
                      </div>
                    </div>

                    {/* Department Title */}
                    <div>
                      <h3 
                        onClick={() => onOpenDeptLogin(role)}
                        className="text-sm sm:text-base font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        {meta.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {meta.subtitle}
                      </p>
                    </div>

                    {/* GM Name & Notice box */}
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">كلمة السر تُرسل عبر مدير عام الإدارة</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        المعتمد: <span className="text-amber-300 font-medium">{gmName}</span> ({gmTitle})
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Login Action */}
                  <div className="pt-3 mt-3 border-t border-slate-800/60 space-y-2">
                    {isAdminLoggedIn ? (
                      /* Admin Preview Direct Button when already authenticated as admin */
                      <button
                        type="button"
                        id={`btn-admin-preview-${role}`}
                        onClick={() => {
                          if (onAdminQuickLoginDept) {
                            onAdminQuickLoginDept(role);
                          } else {
                            onSelectRole(role);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-sm hover:translate-y-[-1px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-950" />
                        <span>معاينة وتصفح الإدارة (مدير النظام)</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      /* Standard Regular User: Enter via GM password */
                      <button
                        type="button"
                        id={`btn-pwd-login-${role}`}
                        onClick={() => onOpenDeptLogin(role)}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer shadow-sm hover:translate-y-[-1px]"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>الدخول بكلمة سر مدير عام الإدارة</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Secret 5-Clicks Footer for System Administrator */}
        <div className="pt-6 mt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span
              onClick={handleSecretAdminTrigger}
              className="cursor-pointer select-none hover:text-slate-300 transition-colors"
              title=""
            >
              شركة الغاز الطبيعي للسيارات (كارجاس) • <strong className="font-bold text-slate-400 hover:text-emerald-400 transition-colors">منظومة إدارة مشروعات ومحطات كارجاس</strong> • قطاع المشروعات والتنفيذ • الخط الساخن: 19544
            </span>
            {adminClickCount > 0 && adminClickCount < 5 && (
              <span className="text-[10px] text-amber-400/80 font-mono animate-pulse">
                ({5 - adminClickCount})
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-600 font-mono">
            CARGAS NGV Platform
          </div>
        </div>

      </div>
    </div>
  );
};
