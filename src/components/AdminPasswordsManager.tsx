import React, { useState } from 'react';
import { 
  Lock, 
  Key, 
  ShieldCheck, 
  Share2, 
  Send, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Save, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  UserCheck,
  Phone
} from 'lucide-react';
import { DepartmentRole, DepartmentAccessCredentials, SuperAdminCredentials } from '../types';
import { 
  loadSuperAdminCredentials, 
  saveSuperAdminCredentials, 
  loadDepartmentCredentials, 
  saveDepartmentCredentials 
} from '../data/authCredentials';
import { DEPARTMENTS_METADATA, DEPARTMENT_ROLE_SPECS } from '../data/departmentCustomFields';

export const AdminPasswordsManager: React.FC = () => {
  // Super Admin state
  const [adminCreds, setAdminCreds] = useState<SuperAdminCredentials>(() => loadSuperAdminCredentials());
  const [adminPasswordInput, setAdminPasswordInput] = useState(adminCreds.password);
  const [adminEmailInput, setAdminEmailInput] = useState(adminCreds.email);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminSaveNotice, setAdminSaveNotice] = useState<string | null>(null);

  // Departments passwords state
  const [deptCreds, setDeptCreds] = useState<Record<DepartmentRole, DepartmentAccessCredentials>>(() => loadDepartmentCredentials());
  const [copiedDept, setCopiedDept] = useState<string | null>(null);
  const [showDeptPasswords, setShowDeptPasswords] = useState<Record<string, boolean>>({});
  const [deptSaveNotice, setDeptSaveNotice] = useState<string | null>(null);

  const departmentsList: DepartmentRole[] = [
    'marketing',
    'operations',
    'projects',
    'hse',
    'technical',
    'licensing',
    'legal',
    'financial'
  ];

  // Save Super Admin changes
  const handleSaveAdminCreds = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SuperAdminCredentials = {
      email: adminEmailInput.trim(),
      password: adminPasswordInput.trim(),
      lastUpdated: new Date().toISOString()
    };
    setAdminCreds(updated);
    saveSuperAdminCredentials(updated);
    setAdminSaveNotice('تم تحديث بيانات دخول مدير النظام المركزي بنجاح!');
    setTimeout(() => setAdminSaveNotice(null), 3000);
  };

  // Change individual department password
  const handleDeptPasswordChange = (dept: DepartmentRole, newPass: string) => {
    setDeptCreds(prev => ({
      ...prev,
      [dept]: {
        ...prev[dept],
        password: newPass,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  // Save all departments passwords
  const handleSaveAllDeptPasswords = () => {
    saveDepartmentCredentials(deptCreds);
    setDeptSaveNotice('تم حفظ وتعميم كلمات سر الإدارات بنجاح!');
    setTimeout(() => setDeptSaveNotice(null), 3000);
  };

  // Generate random strong password
  const generateRandomPassword = (dept: DepartmentRole) => {
    const prefix = dept.substring(0, 3).toUpperCase();
    const num = Math.floor(1000 + Math.random() * 9000);
    const newPass = `${prefix}-${num}`;
    handleDeptPasswordChange(dept, newPass);
  };

  // Generate direct link for department
  const getDirectLink = (dept: DepartmentRole) => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    return `${origin}${path}?role=${dept}`;
  };

  // Copy link and password
  const handleCopyCredentials = (dept: DepartmentRole) => {
    const cred = deptCreds[dept];
    const link = getDirectLink(dept);
    const meta = DEPARTMENTS_METADATA[dept];
    const text = `بيانات دخول (${meta.title}) - منظومة كارجاس:\nالرابط: ${link}\nكلمة السر: ${cred?.password}`;
    
    navigator.clipboard.writeText(text);
    setCopiedDept(dept);
    setTimeout(() => setCopiedDept(null), 2500);
  };

  // Send credentials to GM via WhatsApp
  const handleSendWhatsAppToGM = (dept: DepartmentRole) => {
    const cred = deptCreds[dept];
    const meta = DEPARTMENTS_METADATA[dept];
    const spec = DEPARTMENT_ROLE_SPECS[dept];
    const link = getDirectLink(dept);

    const message = `السلام عليكم ورحمة الله،\n` +
      `السيد/ة ${spec.gmTitle} المحترم،\n\n` +
      `تحية طيبة وبعد،،،\n` +
      `يسرنا تزويد سيادتكم ببيانات الدخول المعتمدة لصفحة بيئة عمل (${meta.title}) بمنظومة أدارة مشروعات ومحطات كارجاس:\n\n` +
      `• رابط الدخول المباشر لإدارتكم:\n${link}\n\n` +
      `• كلمة السر المعتمدة:\n${cred?.password}\n\n` +
      `عند الدخول ستتمكنون من توثيق ومتابعة المشروعات، رصد المعدات بالكاميرا، وإرسال روابط وتكليفات المهام لمهندسي إدارتكم عبر الواتساب.\n\n` +
      `مع أطيب التمنيات،\n` +
      `مدير عام إدارة النظام والتحكم المركزي • شركة كارجاس 19544`;

    const cleanPhone = (cred?.defaultGmPhone || '').replace(/[^0-9]/g, '');
    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(waUrl, '_blank');
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Super Admin Credentials Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                الحساب الرئيسي الأعلى صلاحية (Super Admin)
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                إعدادات دخول إدارة النظام والتحكم الشامل
              </h3>
            </div>
          </div>

          {adminSaveNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{adminSaveNotice}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveAdminCreds} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              البريد الإلكتروني المعتمد لمدير النظام
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500"
                dir="ltr"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              البريد الأساسي المطلوب: <code className="text-emerald-400">mohamedyoussef255@gmail.com</code>
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              كلمة السر الرئيسية لمدير النظام (قابلة للتعديل)
            </label>
            <div className="relative">
              <input
                type={showAdminPassword ? 'text' : 'password'}
                required
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 tracking-wider"
                dir="ltr"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              الافتراضي المطلوب: <code className="text-emerald-400">000000</code>
            </span>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ وتحديث بيانات مدير النظام</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Department Passwords & WhatsApp Dispatch */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              <span>إدارة وتوليد كلمات سر الإدارات وإرسالها عبر الواتساب</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              لا يدخل أي مدير عام إلا بكلمة السر التي تحددها هنا ويرسلها له مدير النظام عبر الواتساب مع رابط مباشر يظهر له صفحته فقط.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {deptSaveNotice && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                {deptSaveNotice}
              </span>
            )}
            <button
              onClick={handleSaveAllDeptPasswords}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ كافة كلمات السر</span>
            </button>
          </div>
        </div>

        {/* Departments Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departmentsList.map(dept => {
            const meta = DEPARTMENTS_METADATA[dept];
            const spec = DEPARTMENT_ROLE_SPECS[dept];
            const cred = deptCreds[dept];
            const isPasswordVisible = !!showDeptPasswords[dept];
            const isCopied = copiedDept === dept;

            return (
              <div
                key={dept}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <h4 className="text-sm font-black text-white">
                        {meta.title}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {meta.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {spec.gmTitle}
                  </p>

                  {/* Password Input & Controls */}
                  <div className="mt-3.5 space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-300">
                      كلمة السر المعتمدة للإدارة:
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={isPasswordVisible ? 'text' : 'password'}
                          value={cred?.password || ''}
                          onChange={(e) => handleDeptPasswordChange(dept, e.target.value)}
                          className="w-full px-3 py-2 pl-9 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs sm:text-sm tracking-wider focus:outline-none focus:border-indigo-500"
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowDeptPasswords({ ...showDeptPasswords, [dept]: !isPasswordVisible })}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {isPasswordVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => generateRandomPassword(dept)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                        title="توليد كلمة سر عشوائية قوية"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions: Send via WhatsApp & Copy Link */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCredentials(dept)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'تم النسخ' : 'نسخ الرابط والرمز'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppToGM(dept)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال بالواتساب للمدير</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
