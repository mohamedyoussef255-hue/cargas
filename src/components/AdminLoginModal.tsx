import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { loadSuperAdminCredentials } from '../data/authCredentials';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('mohamedyoussef255@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const creds = loadSuperAdminCredentials();

    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim().toLowerCase();
      const expectedEmail = creds.email.trim().toLowerCase();

      if (cleanEmail !== expectedEmail) {
        setErrorMsg('البريد الإلكتروني غير مصرح له بالدخول لصفحة إدارة النظام والتحكم الشامل');
        return;
      }

      if (password !== creds.password) {
        setErrorMsg('كلمة السر غير صحيحة. يرجى التأكد من كلمة سر مدير النظام');
        return;
      }

      // Mark session as authenticated super admin
      sessionStorage.setItem('cargas_admin_authenticated', 'true');
      onSuccess();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/50">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Icon */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              بوابة الدخول المركزية المعتمدة
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
              إدارة النظام والتحكم الشامل
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              الدخول مقصور حصرياً على مدير النظام المركزي
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="font-medium">{errorMsg}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
              البريد الإلكتروني المعتمد لمدير النظام
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mohamedyoussef255@gmail.com"
                className="w-full px-4 py-3 pl-11 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-left font-mono"
                dir="ltr"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 text-right">
              البريد المسجل: <span className="text-emerald-400 font-mono">mohamedyoussef255@gmail.com</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-right">
              كلمة السر الرئيسية (المبدئية 000000)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة السر"
                className="w-full px-4 py-3 pl-11 pr-11 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-left font-mono tracking-widest"
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
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>يمكنك تعديل كلمة السر لاحقاً من لوحة التحكم</span>
              <span className="text-slate-400">الافتراضي: 000000</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>تسجيل الدخول والتحكم الشامل</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-400">
            منظومة أدارة مشروعات ومحطات كارجاس • شركة كارجاس للغاز الطبيعي NGV
          </p>
        </div>
      </div>
    </div>
  );
};
