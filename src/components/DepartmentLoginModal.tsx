import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  PhoneCall, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Share2,
  Wrench,
  Flame,
  Cpu,
  FileCheck,
  Scale,
  BadgeDollarSign,
  KeyRound,
  ExternalLink,
  X
} from 'lucide-react';
import { DepartmentRole } from '../types';
import { DEPARTMENTS_METADATA, DEPARTMENT_ROLE_SPECS } from '../data/departmentCustomFields';
import { loadDepartmentCredentials } from '../data/authCredentials';

interface DepartmentLoginModalProps {
  department: DepartmentRole;
  isOpen: boolean;
  isStandaloneScreen?: boolean;
  onClose?: () => void;
  onSuccess: (isAdminOverride?: boolean) => void;
  onBackToMainPortal?: () => void;
}

export const DepartmentLoginModal: React.FC<DepartmentLoginModalProps> = ({
  department,
  isOpen,
  isStandaloneScreen = false,
  onClose,
  onSuccess,
  onBackToMainPortal,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [adminNotice, setAdminNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;
  const spec = DEPARTMENT_ROLE_SPECS[department];
  const allDeptCreds = loadDepartmentCredentials();
  const deptCred = allDeptCreds[department];
  const currentExpectedPassword = deptCred?.password || '123456';
  const gmName = deptCred?.defaultGmName || 'مدير عام الإدارة';
  const gmTitle = deptCred?.gmTitle || spec.gmTitle;
  const gmPhone = deptCred?.defaultGmPhone || '+201019544000';

  const getDeptIcon = () => {
    switch (department) {
      case 'marketing': return <Share2 className="w-8 h-8 text-indigo-400" />;
      case 'projects': return <Building2 className="w-8 h-8 text-blue-400" />;
      case 'operations': return <Wrench className="w-8 h-8 text-amber-400" />;
      case 'hse': return <Flame className="w-8 h-8 text-emerald-400" />;
      case 'technical': return <Cpu className="w-8 h-8 text-teal-400" />;
      case 'licensing': return <FileCheck className="w-8 h-8 text-orange-400" />;
      case 'legal': return <Scale className="w-8 h-8 text-purple-400" />;
      case 'financial': return <BadgeDollarSign className="w-8 h-8 text-cyan-400" />;
      default: return <Building2 className="w-8 h-8 text-slate-400" />;
    }
  };

  // WhatsApp link to request the password from the General Manager of the department
  const handleRequestPasswordFromGM = () => {
    const cleanPhone = (gmPhone || '').replace(/[^0-9]/g, '');
    const msg = `السلام عليكم ورحمة الله وبركاته،\n` +
      `السيد/ة ${gmName} (${gmTitle}) المحترم،\n\n` +
      `تحية طيبة وبعد،،،\n` +
      `يرجى التكرم بموافاتنا بكلمة سر الدخول المعتمدة لصفحة بيئة عمل (${meta.title}) بمنظومة مشروعات ومحطات كارجاس لمتابعة المهام والنماذج الميدانية.\n\n` +
      `شاكرين ومقدرين حسن تعاونكم،\n` +
      `فريق ومهندسو الإدارة • منظومة كارجاس`;

    const url = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // System Administrator Login with 0000 for ALL departments
  const handleSystemAdminLoginWith0000 = () => {
    setErrorMsg(null);
    setIsLoading(true);
    setAdminNotice('جاري تفعيل دخول مدير النظام برمز 0000 لكافة الإدارات...');

    setTimeout(() => {
      setIsLoading(false);
      // Mark session as department authenticated AND system admin authenticated
      sessionStorage.setItem(`cargas_dept_auth_${department}`, 'true');
      sessionStorage.setItem('cargas_admin_authenticated', 'true');
      sessionStorage.setItem('cng_admin_authed_v1', 'true');
      onSuccess(true);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanInput = password.trim();

      // Check if password matches Department password (sent via GM) OR System Administrator master PIN 0000
      const isSystemAdmin = cleanInput === '0000';
      const isDeptValid = cleanInput === currentExpectedPassword;

      if (!isDeptValid && !isSystemAdmin) {
        setErrorMsg('كلمة السر غير صحيحة. يرجى إدخال كلمة السر المرسلة عبر مدير عام الإدارة، أو استخدام أيقونة دخول مدير النظام برمز (0000)');
        return;
      }

      // Mark session department as authenticated
      sessionStorage.setItem(`cargas_dept_auth_${department}`, 'true');
      if (isSystemAdmin) {
        sessionStorage.setItem('cargas_admin_authenticated', 'true');
        sessionStorage.setItem('cng_admin_authed_v1', 'true');
      }
      onSuccess(isSystemAdmin);
    }, 300);
  };

  const content = (
    <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-950/80">
      
      {/* Top action: Close or Back */}
      {onClose && !isStandaloneScreen && (
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {isStandaloneScreen && onBackToMainPortal && (
        <button
          onClick={onBackToMainPortal}
          className="inline-flex items-center gap-2 mb-4 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للبوابة الرئيسية</span>
        </button>
      )}

      {/* Department Identity Header */}
      <div className="text-center space-y-3 mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner">
          {getDeptIcon()}
        </div>
        <div>
          <span className="text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {meta.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            {meta.title}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              {gmName}
            </span>
            <span className="text-xs text-slate-400">
              ({gmTitle})
            </span>
          </div>
        </div>
      </div>

      {/* Security notice box: Password sent via General Manager */}
      <div className="mb-5 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs space-y-2">
        <div className="flex items-start gap-2.5">
          <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block text-indigo-200 font-bold mb-1">
              الدخول بكلمة سر يتم إرسالها عبر مدير عام الإدارة:
            </strong>
            الدخول لصفحة الإدارة مقتصر على كلمة السر المعتمدة التي يرسلها <strong className="text-white">{gmName}</strong> لمهندسي وفريق عمل الإدارة عبر الواتساب لتأكيد الصلاحية وإنجاز التكليفات.
          </div>
        </div>

        {/* WhatsApp Request from GM Button */}
        <div className="pt-2 border-t border-indigo-500/20 flex justify-end">
          <button
            type="button"
            onClick={handleRequestPasswordFromGM}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer shadow-sm"
            title="إرسال طلب كلمة السر لمدير عام الإدارة عبر واتساب"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>طلب كلمة السر من مدير عام الإدارة عبر واتساب</span>
            <ExternalLink className="w-3 h-3 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Admin Notice */}
      {adminNotice && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{adminNotice}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div className="font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
            كلمة السر (المرسلة عبر مدير عام الإدارة: {gmName})
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة السر المستلمة من مدير عام الإدارة"
              className="w-full px-4 py-3 pl-11 pr-11 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-left font-mono tracking-wider"
              dir="ltr"
            />
            <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>تأكيد الدخول لبيئة {meta.badge}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Prominent System Administrator Icon / Access Section (رمز 0000 لكافة الإدارات) */}
      <div className="mt-5 pt-4 border-t border-slate-800">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="block text-xs font-bold text-emerald-300">
                أيقونة دخول مدير النظام لكافة الإدارات
              </span>
              <span className="block text-[11px] text-slate-400">
                تسجيل دخول مباشر لمدير النظام بكلمة سر 0000
              </span>
            </div>
          </div>

          <button
            type="button"
            id="btn-modal-sys-admin-login-0000"
            onClick={handleSystemAdminLoginWith0000}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
            title="دخول فوري لمدير النظام بكلمة سر 0000 لكافة الإدارات"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-200" />
            <span>دخول مدير النظام (0000)</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-center space-y-1">
        <p className="text-xs text-slate-400">
          منظومة إدارة مشروعات ومحطات كارجاس للغاز الطبيعي • CARGAS NGV
        </p>
        <p className="text-[11px] text-slate-500">
          تواصل مع مدير عام الإدارة ({gmName}) لاستلام كلمة السر، أو استخدم أيقونة مدير النظام (0000).
        </p>
      </div>
    </div>
  );

  if (isStandaloneScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {content}
    </div>
  );
};
