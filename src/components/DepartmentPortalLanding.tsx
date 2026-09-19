import React, { useState } from 'react';
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
  Users
} from 'lucide-react';
import { DepartmentRole } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import { CargasNgvLogo } from './CargasNgvLogo';

interface DepartmentPortalLandingProps {
  onSelectRole: (role: DepartmentRole) => void;
  onOpenAdminLogin: () => void;
  onOpenDeptLogin: (role: DepartmentRole) => void;
}

export const DepartmentPortalLanding: React.FC<DepartmentPortalLandingProps> = ({
  onSelectRole,
  onOpenAdminLogin,
  onOpenDeptLogin,
}) => {
  const [hoveredRole, setHoveredRole] = useState<DepartmentRole | null>(null);

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
                منظومة أدارة مشروعات ومحطات كارجاس
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                بيئة عمل مؤمنة ومعزولة لكل إدارة، تظهر لكل مدير عام وفريق عمله المهام والتقارير المخصصة له فقط عبر كلمة سر معتمدة وموجهة بالواتساب، مع إدارة ورقابة مركزية شاملة تحت مظلة <span className="text-emerald-400 font-bold">إدارة النظام</span>.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <CargasNgvLogo size="lg" showText={false} className="shadow-2xl" />
            </div>
          </div>

          {/* Isolation & Protection Features */}
          <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>عزل الصلاحيات:</strong> يرى كل مدير عام وموظف ما يخص إدارته فقط</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>دخول محمي بكلمة سر:</strong> كلمة سر لكل إدارة مرسلة عبر الواتساب</span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>إدارة النظام:</strong> مقتصرة على البريد المعتمد وكلمة السر المركزية</span>
            </div>
          </div>
        </div>

        {/* 1. Super Admin Featured Access Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-2 border-emerald-500/40 p-6 sm:p-7 shadow-xl hover:border-emerald-400 transition-all group">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    التحكم المركزي الشامل
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    SUPER ADMIN ACCESS
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  إدارة النظام والتحكم الشامل
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  الدخول مقصور على البريد الإلكتروني <strong className="text-emerald-400 font-mono">mohamedyoussef255@gmail.com</strong> وبكلمة السر المعتمدة (<strong className="text-emerald-400 font-mono">000000</strong>)، مع إمكانية تعديل كلمة السر وإدارة كلمات سر كافة الإدارات.
                </p>
              </div>
            </div>

            <button
              id="btn-admin-portal-login"
              onClick={onOpenAdminLogin}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
            >
              <Lock className="w-4 h-4" />
              <span>دخول إدارة النظام والتحكم الشامل</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Departments Grid (8 Departments) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>إدارات وبيئات عمل كارجاس المستقلة</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  8 إدارات تخصصية
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                لا يدخل المدير العام إلا بكلمة السر التي أعدها مدير النظام وأرسلها له عبر الواتساب، ويظهر له فقط ما يخص إدارته.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentsList.map((role) => {
              const meta = DEPARTMENTS_METADATA[role];
              const isHovered = hoveredRole === role;
              const isOps = role === 'operations';
              const isMarketing = role === 'marketing';

              return (
                <div
                  key={role}
                  id={`card-dept-${role}`}
                  onMouseEnter={() => setHoveredRole(role)}
                  onMouseLeave={() => setHoveredRole(null)}
                  onClick={() => onOpenDeptLogin(role)}
                  className={`relative group rounded-2xl border transition-all duration-300 p-5 cursor-pointer flex flex-col justify-between overflow-hidden ${
                    isOps
                      ? 'bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900 border-amber-500/30 hover:border-amber-400 shadow-lg shadow-amber-950/20'
                      : isMarketing
                      ? 'bg-gradient-to-b from-indigo-950/20 via-slate-900 to-slate-900 border-indigo-500/30 hover:border-indigo-400'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top: Icon & Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 bg-slate-800/80 border-slate-700 group-hover:scale-105 transition-transform">
                        {getRoleIcon(role)}
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {meta.badge}
                      </span>
                    </div>

                    {/* Department Title */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {meta.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {meta.subtitle}
                      </p>
                    </div>

                    {/* Password notice box */}
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>الدخول بكلمة سر مرسلة بالواتساب</span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium group-hover:text-white transition-colors">
                      دخول الإدارة
                    </span>
                    <div className="flex items-center gap-1 text-emerald-400 font-bold group-hover:translate-x-[-4px] transition-transform">
                      <span>تسجيل الدخول</span>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
