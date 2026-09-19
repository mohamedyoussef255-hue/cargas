import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, Check, X, KeyRound, AlertCircle } from 'lucide-react';
import { verifyAdminPassword, setSessionAdminAuthenticated } from '../utils/adminAuth';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMessage(null);
      setShowPassword(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('يرجى إدخال كلمة سر مدير النظام للمتابعة.');
      return;
    }

    const isValid = verifyAdminPassword(password);
    if (isValid) {
      setSessionAdminAuthenticated(true);
      setErrorMessage(null);
      onSuccess();
    } else {
      setErrorMessage('كلمة السر غير صحيحة! يرجى إدخال كلمة السر المعتمدة (الافتراضية: 000000).');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 space-y-6 transition-transform ${
          isShaking ? 'animate-bounce text-rose-400' : ''
        }`}
      >
        {/* Header with Shield & Security Badge */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>منطقة محصنة ومحمية بكلمة سر</span>
            </div>
            <h2 className="text-xl font-black text-white">
              دخول مدير النظام والتحكم الشامل
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              لوحة الإدارة العامة لكارجاس NGV • صلاحية التحكم في النماذج، الأسعار، ودراسات الجدوى
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              كلمة سر مدير النظام (Admin Password):
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="أدخل كلمة السر (الافتراضية: 000000)"
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-3 text-white text-sm tracking-wider focus:outline-none transition-colors"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                title={showPassword ? 'إخفاء كلمة السر' : 'إظهار كلمة السر'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span className="flex items-center gap-1 text-amber-400 font-mono">
                <KeyRound className="w-3.5 h-3.5" />
                <span>كلمة السر الافتراضية: <strong>000000</strong></span>
              </span>
              <span className="text-slate-400">يمكنك تغييرها لاحقاً من الإعدادات</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>تأكيد الدخول لإدارة النظام</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
