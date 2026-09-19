import React, { useState } from 'react';
import { 
  Building2, 
  Wrench, 
  Share2, 
  Flame, 
  Cpu, 
  FileCheck, 
  Scale, 
  BadgeDollarSign, 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  PhoneCall, 
  UserCheck, 
  Sparkles, 
  Lock, 
  Layers,
  ExternalLink,
  ChevronLeft,
  Copy,
  Check
} from 'lucide-react';
import { DepartmentRole } from '../types';
import { DEPARTMENTS_METADATA, DEPARTMENT_ROLE_SPECS } from '../data/departmentCustomFields';
import { CargasNgvLogo } from './CargasNgvLogo';

interface DepartmentLoginGatewayProps {
  department: DepartmentRole;
  userType?: 'gm' | 'staff';
  initialUserName?: string | null;
  onEnterWorkspace: (confirmedUserName?: string) => void;
  onReturnToPortal: () => void;
}

export const DepartmentLoginGateway: React.FC<DepartmentLoginGatewayProps> = ({
  department,
  userType = 'gm',
  initialUserName,
  onEnterWorkspace,
  onReturnToPortal,
}) => {
  const [userName, setUserName] = useState<string>(initialUserName || '');
  const [isCopied, setIsCopied] = useState(false);

  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;
  const spec = DEPARTMENT_ROLE_SPECS[department];

  const getDeptIcon = (dept: DepartmentRole) => {
    switch (dept) {
      case 'operations':
        return <Wrench className="w-8 h-8 text-amber-400" />;
      case 'marketing':
        return <Share2 className="w-8 h-8 text-indigo-400" />;
      case 'projects':
        return <Building2 className="w-8 h-8 text-blue-400" />;
      case 'hse':
        return <Flame className="w-8 h-8 text-emerald-400" />;
      case 'technical':
        return <Cpu className="w-8 h-8 text-teal-400" />;
      case 'licensing':
        return <FileCheck className="w-8 h-8 text-orange-400" />;
      case 'legal':
        return <Scale className="w-8 h-8 text-purple-400" />;
      case 'financial':
        return <BadgeDollarSign className="w-8 h-8 text-cyan-400" />;
      case 'surveyor':
        return <Camera className="w-8 h-8 text-sky-400" />;
      default:
        return <Building2 className="w-8 h-8 text-slate-400" />;
    }
  };

  const handleCopyDirectLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const isGM = userType === 'gm';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white">
      
      {/* Top Bar with Cargas Brand & Hotline 19544 */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <CargasNgvLogo size="md" showText={true} />
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:19544"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>الخط الساخن: <strong>19544</strong></span>
          </a>

          <button
            onClick={onReturnToPortal}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>البوابة الرئيسية</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Gateway Card */}
      <div className="max-w-3xl mx-auto w-full my-auto py-8">
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl overflow-hidden">
          
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16"></div>

          <div className="relative z-10 space-y-6">
            
            {/* Top Identity Tag */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>رابط دخول رسمي معتمد من الإدارة العامة لكارجاس</span>
              </div>

              <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                {isGM ? 'صفة الدخول: مدير عام الإدارة' : 'صفة الدخول: عضو فريق العمل الميداني'}
              </span>
            </div>

            {/* Department Icon and Titles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 shadow-lg">
                {getDeptIcon(department)}
              </div>

              <div className="space-y-1 flex-1">
                <span className="text-xs text-slate-400 font-bold block">
                  بوابة الدخول المخصصة لـ
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {meta.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  {meta.subtitle}
                </p>
              </div>
            </div>

            {/* Personalized Welcome Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">
                    بيانات المستخدم والمشرف على الجلسة:
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {spec?.gmTitle || 'مدير عام الإدارة'}
                </span>
              </div>

              {initialUserName ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">الاسم والصفة المعتمدة:</span>
                  <strong className="text-sm text-emerald-300 font-bold">{initialUserName}</strong>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="أدخل اسمك الكريم (مثال: م. مصطفى كمال - مدير عام التشغيل)"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    سيتم تدوين هذا الاسم تلقائياً على كافة مراجعات واعتمادات إدارتكم.
                  </span>
                </div>
              )}
            </div>

            {/* Authorized Scope Highlights */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">
                الاختصاصات ونطاق العمل المعتمد لإدارتكم:
              </span>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-emerald-300 mb-1.5">{meta.primaryScope}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-slate-400 text-[11px]">
                  {meta.keyResponsibilities.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Data Isolation Guarantee */}
            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
              <Layers className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-blue-300">
                  منظومة عزل الصلاحيات وحماية البيانات:
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  تظهر لسيادتكم حصرياً البيانات والحقول الخاصة بإدارتكم دون تداخل مع الإدارات الأخرى، وتصب مخرجاتكم وتقاريركم مباشرة في لوحة تحكم الإدارة العامة لمتابعة تقدم المشروعات ومحطات الغاز.
                </p>
              </div>
            </div>

            {/* Enter Workspace CTA Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                id="btn-enter-dept-workspace"
                onClick={() => onEnterWorkspace(userName)}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-xl shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <span>دخول بيئة عمل الإدارة ومباشرة المهام</span>
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleCopyDirectLink}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                title="نسخ رابط الوصول المباشر"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'تم نسخ الرابط' : 'نسخ رابط الدخول'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Footer System Line */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-400 pt-4 border-t border-slate-900">
        منظومة كارجاس للغاز الطبيعي NGV • قطاع البترول والثروة المعدنية • الخط الساخن: 19544 • طوارئ الغاز: 129
      </div>

    </div>
  );
};
