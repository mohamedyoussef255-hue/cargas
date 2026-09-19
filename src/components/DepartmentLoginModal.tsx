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
  onSuccess: () => void;
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

  if (!isOpen) return null;

  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;
  const spec = DEPARTMENT_ROLE_SPECS[department];
  const deptCreds = loadDepartmentCredentials()[department];
  const currentExpectedPassword = deptCreds?.password || '123456';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanInput = password.trim();

      if (cleanInput !== currentExpectedPassword) {
        setErrorMsg('كلمة السر غير صحيحة. يرجى إدخال كلمة السر المستلمة عبر الواتساب من مدير النظام');
        return;
      }

      // Mark session department as authenticated
      sessionStorage.setItem(`cargas_dept_auth_${department}`, 'true');
      onSuccess();
    }, 350);
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
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            {spec.gmTitle}
          </p>
        </div>
      </div>

      {/* Security notice box */}
      <div className="mb-5 p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2.5">
        <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block text-indigo-200 font-bold mb-0.5">الدخول بكلمة سر مرسلة عبر الواتساب:</strong>
          لا يتم الدخول لهذه الصفحة إلا عبر كلمة السر المعتمدة من مدير النظام، والمرسلة لسيادتكم عبر الواتساب لتأكيد الصلاحية وإرسال تكليفات المهام لمهندسيكم.
        </div>
      </div>

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
            كلمة السر المعتمدة للإدارة (المستلمة من مدير النظام)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة سر الإدارة"
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
          
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>كلمة السر الافتراضية للتجربة:</span>
            <button
              type="button"
              onClick={() => setPassword(currentExpectedPassword)}
              className="text-indigo-400 hover:text-indigo-300 font-mono font-bold underline cursor-pointer"
            >
              استخدام ({currentExpectedPassword})
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
      </form>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-800 text-center space-y-1">
        <p className="text-xs text-slate-400">
          منظومة أدارة مشروعات ومحطات كارجاس للغاز الطبيعي
        </p>
        <p className="text-[11px] text-slate-400">
          إذا لم تستلم كلمة السر بعد، يرجى التواصل مع مدير النظام المركزي
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
