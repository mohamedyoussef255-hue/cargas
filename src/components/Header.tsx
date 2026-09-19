import React from 'react';
import { 
  Camera, 
  MapPin, 
  BarChart3, 
  History, 
  PlusCircle, 
  Calculator, 
  BookOpen, 
  Sliders, 
  Building2, 
  HardHat, 
  LogOut, 
  UserCheck, 
  Phone, 
  Users, 
  Eye, 
  X, 
  SlidersHorizontal,
  Share2,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { MonitoringSession, DepartmentRole, ActiveTabType } from '../types';
export type { ActiveTabType };
import { CargasNgvLogo } from './CargasNgvLogo';
import { DEPARTMENTS_METADATA, DEPARTMENT_ROLE_SPECS } from '../data/departmentCustomFields';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  activeSession: MonitoringSession | null;
  onNewSession: () => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean | ((prev: boolean) => boolean)) => void;
  currentRole?: DepartmentRole | null;
  onSwitchDepartment?: () => void;
  hotline?: string;
  isAdminPreview?: boolean;
  onExitPreview?: () => void;
  onCustomizeDepartment?: (dept: DepartmentRole) => void;
  onOpenTeamInvite?: () => void;
  userType?: 'gm' | 'staff' | null;
  userName?: string | null;
  isDirectLink?: boolean;
  onOpenLandownerApplications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeSession,
  onNewSession,
  isMobilePreview,
  setIsMobilePreview,
  currentRole = 'admin',
  onSwitchDepartment,
  hotline = '19544',
  isAdminPreview = false,
  onExitPreview,
  onCustomizeDepartment,
  onOpenTeamInvite,
  userType = 'gm',
  userName,
  isDirectLink = false,
  onOpenLandownerApplications,
}) => {
  const effectiveRole = currentRole || 'admin';
  const roleMeta = DEPARTMENTS_METADATA[effectiveRole] || DEPARTMENTS_METADATA.admin;
  const spec = DEPARTMENT_ROLE_SPECS[effectiveRole] || DEPARTMENT_ROLE_SPECS.admin;
  
  const isSurveyor = effectiveRole === 'surveyor';
  const isAdmin = effectiveRole === 'admin' && !isAdminPreview;

  // Allowed tabs strictly filtered per department
  const allowedTabs: ActiveTabType[] = spec.allowedTabs || ['departments'];

  // Subtitle determination
  const getHeaderSubtitle = () => {
    if (isAdminPreview) {
      return `معاينة مباشرة لشاشة: ${spec.gmTitle}`;
    }
    if (userType === 'staff') {
      return `فريق عمل ومهندسو ${roleMeta.title} ${userName ? `• الزميل: ${userName}` : ''}`;
    }
    if (effectiveRole !== 'admin') {
      return `${spec.gmTitle} • ${roleMeta.subtitle}`;
    }
    return 'التحكم المركزي الشامل لكافة الإدارات والمعاينات والجدوى الفنية';
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${spec.theme.borderAccent} bg-gradient-to-r ${spec.theme.headerGradient} shadow-md`}>
      
      {/* Admin Preview Floating Warning & Quick Action Bar */}
      {isAdminPreview && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-950 animate-pulse shrink-0" />
            <span>
              وضع المعاينة المباشرة لمدير النظام (Live Preview): أنت تتصفح التطبيق الآن تماماً كما يراه <strong>{spec.gmTitle}</strong> وموظفوه بالمسطرة والأيقونات المخصصة لإدارته فقط.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onCustomizeDepartment && (
              <button
                onClick={() => onCustomizeDepartment(effectiveRole)}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>تعديل حقول واستمارة هذه الإدارة</span>
              </button>
            )}

            {onExitPreview && (
              <button
                onClick={onExitPreview}
                className="px-3 py-1 bg-slate-950 hover:bg-black text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow"
              >
                <X className="w-3.5 h-3.5 text-amber-400" />
                <span>إنهاء المعاينة والعودة لـ Super Admin</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo and Brand with Official Cargas NGV emblem - Natural & Compact */}
          <div className="flex items-center gap-2.5">
            <CargasNgvLogo size="sm" showText={false} className="hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>منظومة أدارة مشروعات ومحطات كارجاس</span>
                  <span className="text-amber-400 font-mono font-bold text-[11px] sm:text-xs bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">NGV</span>
                </h1>
                
                {/* Dynamic Role Badge */}
                <span className={`hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${spec.theme.badgeClass}`}>
                  <UserCheck className="w-3 h-3" />
                  <span>
                    {isAdminPreview ? `معاينة: ${roleMeta.title}` : (userType === 'staff' ? `فريق عمل ${roleMeta.title.split(' ')[1] || ''}` : roleMeta.title)}
                  </span>
                </span>
              </div>
              <p className="text-[10px] text-slate-300 hidden sm:block truncate max-w-[340px] font-medium">
                {getHeaderSubtitle()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* General Manager WhatsApp Share to Staff / Engineers (GM only) */}
            {effectiveRole !== 'admin' && !isSurveyor && userType === 'gm' && onOpenTeamInvite && (
              <button
                id="btn-gm-team-invite"
                onClick={onOpenTeamInvite}
                title="إرسال رابط دعوة مخصص لمهندسي وموظفي الإدارة عبر الواتساب"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 text-xs font-bold transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">دعوة موظفيك ومهندسيك</span>
                <Share2 className="w-3 h-3 text-emerald-200" />
              </button>
            )}

            {/* Landowner Survey Request Button */}
            {onOpenLandownerApplications && (
              <button
                id="btn-landowner-applications"
                onClick={onOpenLandownerApplications}
                title="نموذج وطلبات معاينة الأراضي والمحطات لملاك المواقع"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-950/70 border border-teal-500/40 hover:bg-teal-900/80 text-teal-300 text-xs font-bold transition-all shadow cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden lg:inline">طلب معاينة موقع</span>
              </button>
            )}

            {/* Hotline 19544 Badge */}
            <a
              href={`tel:${hotline}`}
              id="header-hotline-badge"
              title={`الخط الساخن الموحد لكارجاس: ${hotline}`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 hover:bg-slate-800 text-xs font-bold text-emerald-300 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-slate-400 font-normal text-[11px]">الخط الساخن:</span>
              <span className="font-mono text-emerald-300 font-black tracking-wider">{hotline}</span>
            </a>

            {/* Department Switcher / Portal Landing Button (Allowed for GM and Admin only; hidden for direct staff) */}
            {onSwitchDepartment && !isDirectLink && userType !== 'staff' && (
              <button
                id="btn-switch-department"
                onClick={onSwitchDepartment}
                title="الرجوع لبوابة دخول الإدارات الرئيسية"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden md:inline">بوابة الإدارات</span>
                <LogOut className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Navigation Tabs Ruler - Strictly Filtered Per Department */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 border-t border-slate-800/80 no-scrollbar">
          
          {/* Surveyor Single View */}
          {isSurveyor ? (
            <div className="flex items-center justify-between w-full py-1 text-xs">
              <div className="flex items-center gap-2 text-sky-300 font-bold">
                <Camera className="w-4 h-4 text-sky-400" />
                <span>رابط المعاينة الميدانية المكلف بها (تسجيل وحصر سيارات الموقع بالكاميرا)</span>
              </div>
              <span className="text-slate-400 text-[11px]">
                تم الإرسال عبر واتساب بواسطة إدارة التسويق
              </span>
            </div>
          ) : (
            <>
              {/* Tab 1: Department Workspace (Primary for all departments except Super Admin) */}
              {allowedTabs.includes('departments') && (
                <button
                  id="tab-department-workspace"
                  onClick={() => setActiveTab('departments')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'departments'
                      ? `${spec.theme.tabActiveClass} text-white shadow-lg`
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-700/60'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>
                    {isAdmin ? 'مراجعة واعتماد الإدارات' : `صفحة واستمارة ${roleMeta.title.split(' ')[1] || 'الإدارة'}`}
                  </span>
                  {!isAdmin && (
                    <span className="px-1.5 py-0.2 text-[10px] rounded bg-white/20 text-white font-mono">
                      الرئيسية
                    </span>
                  )}
                </button>
              )}

              {/* Tab: Execution Tracker (Projects & Operations & Admin) */}
              {allowedTabs.includes('execution') && (
                <button
                  id="tab-execution"
                  onClick={() => setActiveTab('execution')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'execution'
                      ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <HardHat className="w-4 h-4 text-amber-400" />
                  <span>تنفيذ المحطة والتقارير الميدانية</span>
                </button>
              )}

              {/* Tab: Feasibility Analytics (Financial, Marketing, Admin) */}
              {allowedTabs.includes('feasibility') && (
                <button
                  id="tab-feasibility"
                  onClick={() => setActiveTab('feasibility')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'feasibility'
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span>دراسة الجدوى وتكاليف المحطات</span>
                </button>
              )}

              {/* Tab: Conversion Calculator (Financial, Marketing, Admin) */}
              {allowedTabs.includes('calculator') && (
                <button
                  id="tab-calculator"
                  onClick={() => setActiveTab('calculator')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'calculator'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>حاسبة الوفر والتقسيط</span>
                </button>
              )}

              {/* Tab: Technical Guide (Operations, Technical, Admin) */}
              {allowedTabs.includes('guide') && (
                <button
                  id="tab-guide"
                  onClick={() => setActiveTab('guide')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'guide'
                      ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  <span>الدليل الفني ومراكز كارجاس</span>
                </button>
              )}

              {/* Tab: Sessions List (Included only if allowed) */}
              {allowedTabs.includes('sessions') && (
                <button
                  id="tab-sessions"
                  onClick={() => setActiveTab('sessions')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'sessions'
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <History className="w-4 h-4 text-blue-400" />
                  <span>سجل الجلسات والمواقع</span>
                </button>
              )}

              {/* Tab: Field Map (Included only if allowed for this department) */}
              {allowedTabs.includes('map') && (
                <button
                  id="tab-map"
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'map'
                      ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>الخريطة وجوجل إيرث</span>
                </button>
              )}

              {/* Tab: Super Admin Management (Only for Super Admin) */}
              {allowedTabs.includes('admin') && (
                <button
                  id="tab-admin"
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40'
                      : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/50 border border-amber-500/20'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>إدارة النظام والتحكم</span>
                  <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 rounded border border-amber-500/40 font-bold">
                    Super Admin
                  </span>
                </button>
              )}
            </>
          )}

        </nav>
      </div>
    </header>
  );
};
