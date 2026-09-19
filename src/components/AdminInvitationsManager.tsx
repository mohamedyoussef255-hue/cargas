import React, { useState } from 'react';
import { 
  Share2, 
  Send, 
  Eye, 
  Copy, 
  Check, 
  Phone, 
  Sliders, 
  Building2, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles, 
  UserCheck, 
  CheckCircle2, 
  Users, 
  Filter, 
  Search,
  MessageSquare,
  Lock,
  ArrowRight
} from 'lucide-react';
import { DepartmentRole, CustomFormField, DepartmentInvitationItem } from '../types';
import { DEPARTMENTS_METADATA, DEPARTMENT_ROLE_SPECS } from '../data/departmentCustomFields';

interface AdminInvitationsManagerProps {
  customFields: CustomFormField[];
  onPreviewDepartment: (dept: DepartmentRole) => void;
  onNavigateToFormBuilder?: (dept: DepartmentRole) => void;
}

export const AdminInvitationsManager: React.FC<AdminInvitationsManagerProps> = ({
  customFields,
  onPreviewDepartment,
  onNavigateToFormBuilder,
}) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentRole | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLinkRole, setCopiedLinkRole] = useState<string | null>(null);

  // WhatsApp Invite Modal State
  const [activeModalDept, setActiveModalDept] = useState<DepartmentRole | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [userRoleType, setUserRoleType] = useState<'general_manager' | 'staff'>('general_manager');
  const [invitationNote, setInvitationNote] = useState('');
  const [sentInvitations, setSentInvitations] = useState<DepartmentInvitationItem[]>(() => {
    try {
      const saved = localStorage.getItem('cargas_gm_invitations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const departmentList: DepartmentRole[] = [
    'marketing',
    'projects',
    'operations',
    'technical',
    'hse',
    'licensing',
    'legal',
    'financial',
    'surveyor'
  ];

  // Helper to build the direct department URL
  const getDepartmentLink = (dept: DepartmentRole, type: 'gm' | 'staff' = 'gm', name?: string) => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    const params = new URLSearchParams();
    params.set('role', dept);
    params.set('userType', type);
    if (name && name.trim()) {
      params.set('userName', name.trim());
    }
    params.set('source', 'wa_invite');
    return `${origin}${path}?${params.toString()}`;
  };

  const handleCopyLink = (dept: DepartmentRole, type: 'gm' | 'staff' = 'gm') => {
    const link = getDepartmentLink(dept, type);
    navigator.clipboard.writeText(link);
    setCopiedLinkRole(dept);
    setTimeout(() => {
      setCopiedLinkRole(null);
    }, 3000);
  };

  const handleOpenInviteModal = (dept: DepartmentRole) => {
    const spec = DEPARTMENT_ROLE_SPECS[dept];
    setActiveModalDept(dept);
    setRecipientName('');
    setRecipientPhone('');
    setUserRoleType('general_manager');
    setInvitationNote(`دعوة رسمية لـ ${spec.gmTitle}`);
  };

  const getWhatsAppMessage = (dept: DepartmentRole, name: string, type: 'general_manager' | 'staff') => {
    const meta = DEPARTMENTS_METADATA[dept];
    const spec = DEPARTMENT_ROLE_SPECS[dept];
    const directUrl = getDepartmentLink(dept, type === 'general_manager' ? 'gm' : 'staff', name);
    
    if (type === 'general_manager') {
      return `تحية طيبة، السيد/ة ${name ? name : spec.gmTitle} المحترم،\n\n` +
        `يسر إدارة شركة كارجاس للغاز الطبيعي (CARGAS NGV) دعوتكم للانضمام إلى منظومة كارجاس الرقمية المتكاملة.\n` +
        `تم تخصيص بيئة عمل رقمية مستقلة لـ (${meta.title}) تتيح لسيادتكم حصرياً:\n` +
        `• الاطلاع والتحكم الكامل في استمارات وبيانات الإدارة المعتمدة\n` +
        `• متابعة مواقع ومحطات الغاز الطبيعي الميدانية\n` +
        `• إرسال وتكليف مهندسي وإداريي إدارتكم بروابط مخصصة للعمل بالنظام\n\n` +
        `رابط الوصول المباشر والآمن لإدارتكم:\n${directUrl}\n\n` +
        `مع خالص التقدير،\n` +
        `إدارة النظام والتحكم المركزي • شركة كارجاس\n` +
        `الخط الساخن: 19544`;
    } else {
      return `السلام عليكم ورحمة الله، الزميل العزيز ${name ? name : 'عضو فريق العمل'}،\n\n` +
        `يسرنا دعوتكم للعمل عبر منظومة كارجاس الرقمية - (${meta.title}).\n` +
        `يمكنكم الدخول المباشر لتسجيل وتحديث البيانات والاستمارات الميدانية الموكلة لإدارتكم عبر الرابط:\n` +
        `${directUrl}\n\n` +
        `مع تحيات ${spec.gmTitle} • شركة كارجاس 19544`;
    }
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalDept) return;

    const meta = DEPARTMENTS_METADATA[activeModalDept];
    const spec = DEPARTMENT_ROLE_SPECS[activeModalDept];
    const message = getWhatsAppMessage(activeModalDept, recipientName, userRoleType);
    const directUrl = getDepartmentLink(activeModalDept, userRoleType === 'general_manager' ? 'gm' : 'staff', recipientName);

    // Clean phone number (default Egypt +20)
    let cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('01')) {
      cleanPhone = '2' + cleanPhone;
    } else if (cleanPhone.length === 10 && cleanPhone.startsWith('1')) {
      cleanPhone = '20' + cleanPhone;
    }

    // Save invitation record in local state and localStorage
    const newInvite: DepartmentInvitationItem = {
      id: 'inv-' + Date.now(),
      department: activeModalDept,
      departmentName: meta.title,
      recipientName: recipientName.trim() || spec.gmTitle,
      recipientPhone: cleanPhone || 'غير محدد',
      userType: userRoleType,
      roleTitle: userRoleType === 'general_manager' ? spec.gmTitle : 'مهندس / موظف بالإدارة',
      directUrl,
      sentAt: new Date().toISOString(),
      sentBy: 'مدير النظام (Super Admin)',
      notes: invitationNote,
    };

    const updated = [newInvite, ...sentInvitations];
    setSentInvitations(updated);
    try {
      localStorage.setItem('cargas_gm_invitations', JSON.stringify(updated));
    } catch {}

    // Open WhatsApp
    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
    setActiveModalDept(null);
  };

  const filteredDepartments = departmentList.filter(dept => {
    if (selectedDept !== 'all' && dept !== selectedDept) return false;
    if (!searchQuery) return true;
    const meta = DEPARTMENTS_METADATA[dept];
    const spec = DEPARTMENT_ROLE_SPECS[dept];
    return meta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           spec.gmTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
           meta.primaryScope.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>إدارة دعوات مديري العموم وفرق العمل عبر واتساب</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                    WhatsApp Direct Deep-Links
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  إرسال روابط مخصصة ومشفرة لكل مدير عام إدارة؛ تفتح له حصرياً صفحات إدارته وتغير المسطرة العلوية بالكامل.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Notice Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300">
            <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>يمكنك دائماً <strong>معاينة صفحة الإدارة</strong> قبل إرسال الرابط للتأكد من اكتمال الحقول.</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث باسم الإدارة أو المسمى الوظيفي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedDept('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedDept === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              كافة الإدارات ({departmentList.length})
            </button>
            {departmentList.map(dept => {
              const meta = DEPARTMENTS_METADATA[dept];
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDept === dept
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {meta.title.replace('إدارة ', '').replace('الإدارة ', '')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Copied Alert */}
      {copiedLinkRole && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>تم نسخ رابط الوصول المباشر لهذه الإدارة إلى الحافظة بنجاح! جاهز للصق في واتساب.</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
            {getDepartmentLink(copiedLinkRole as DepartmentRole)}
          </span>
        </div>
      )}

      {/* Departments Invitation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepartments.map((dept) => {
          const meta = DEPARTMENTS_METADATA[dept];
          const spec = DEPARTMENT_ROLE_SPECS[dept];
          const deptFieldsCount = customFields.filter(f => f.department === dept && f.visible).length;

          return (
            <div
              key={dept}
              className={`p-5 rounded-2xl bg-gradient-to-b ${spec.theme.bannerGradient} border ${spec.theme.borderAccent} shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-500 transition-all`}
            >
              <div className="space-y-3">
                {/* Top Role & GM Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${spec.theme.badgeClass}`}>
                      {meta.badge}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5">
                      {meta.title}
                    </h3>
                  </div>

                  <span className="text-xs px-2 py-1 rounded-lg bg-slate-900/90 text-slate-300 border border-slate-700 font-mono">
                    {deptFieldsCount} حقول نشطة
                  </span>
                </div>

                {/* GM Title Card */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>المخاطب الرئيسي: {spec.gmTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {meta.primaryScope}
                  </p>
                </div>

                {/* Permitted Pages in Top Bar */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold block">
                    الصفحات المتاحة في المسطرة العلوية لهذا القسم:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {spec.allowedTabs.map(tabKey => (
                      <span
                        key={tabKey}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 font-medium"
                      >
                        {tabKey === 'departments' && 'بيانات واستمارة الإدارة'}
                        {tabKey === 'camera' && 'كاميرا الرصد الذكي'}
                        {tabKey === 'sessions' && 'سجل المواقع والمعاينات'}
                        {tabKey === 'feasibility' && 'دراسة الجدوى'}
                        {tabKey === 'execution' && 'متابعة التنفيذ'}
                        {tabKey === 'calculator' && 'حاسبة الوفر'}
                        {tabKey === 'guide' && 'الدليل الفني'}
                        {tabKey === 'map' && 'الخريطة الميدانية'}
                        {tabKey === 'admin' && 'لوحة التحكم'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                {/* 1. Preview button (Crucial User Requirement) */}
                <button
                  onClick={() => onPreviewDepartment(dept)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer shadow"
                  title="معاينة الشاشة تماماً كما ستظهر لمدير عام هذه الإدارة قبل إرسال الرابط"
                >
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>معاينة صفحة الإدارة والمسطرة قبل الإرسال</span>
                </button>

                {/* 2. WhatsApp and Copy Link row */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenInviteModal(dept)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال بالواتساب</span>
                  </button>

                  <button
                    onClick={() => handleCopyLink(dept, 'gm')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                  >
                    {copiedLinkRole === dept ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 3. Quick Edit Fields Link */}
                {onNavigateToFormBuilder && (
                  <button
                    onClick={() => onNavigateToFormBuilder(dept)}
                    className="w-full text-center text-[11px] text-slate-400 hover:text-amber-300 transition-colors py-1 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Sliders className="w-3 h-3 text-amber-400" />
                    <span>تعديل أو إضافة حقول نموذج {meta.title}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sent Invitations Log */}
      {sentInvitations.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                سجل الدعوات المرسلة عبر الواتساب لمديري العموم ({sentInvitations.length})
              </h3>
            </div>
            <button
              onClick={() => {
                if (confirm('هل تريد مسح سجل الدعوات؟')) {
                  setSentInvitations([]);
                  localStorage.removeItem('cargas_gm_invitations');
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300"
            >
              تفريغ السجل
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">الإدارة المعنية</th>
                  <th className="py-2.5 px-3">المخاطب</th>
                  <th className="py-2.5 px-3">الهاتف</th>
                  <th className="py-2.5 px-3">النوع</th>
                  <th className="py-2.5 px-3">تاريخ الإرسال</th>
                  <th className="py-2.5 px-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sentInvitations.slice(0, 10).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-bold text-white">{inv.departmentName}</td>
                    <td className="py-2.5 px-3 text-slate-300">{inv.recipientName}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400">{inv.recipientPhone}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {inv.userType === 'general_manager' ? 'مدير عام' : 'موظف / مهندس'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {new Date(inv.sentAt).toLocaleString('ar-EG')}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(inv.directUrl);
                            alert('تم نسخ الرابط المباشر!');
                          }}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="نسخ الرابط"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onPreviewDepartment(inv.department)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400"
                          title="معاينة الشاشة"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* WhatsApp Dispatch Modal */}
      {activeModalDept && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    تجهيز دعوة واتساب: {DEPARTMENTS_METADATA[activeModalDept].title}
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {DEPARTMENT_ROLE_SPECS[activeModalDept].gmTitle}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveModalDept(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendWhatsApp} className="p-6 space-y-4 text-xs">
              {/* Target Role Tier */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 block">صفة المدعو:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserRoleType('general_manager')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      userRoleType === 'general_manager'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold block text-xs">مدير عام الإدارة (GM)</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      يمنحه صلاحية إدارة القسم وإرسال الروابط لموظفيه
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserRoleType('staff')}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      userRoleType === 'staff'
                        ? 'bg-emerald-950/40 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-bold block text-xs">مهندس / موظف بالقسم</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      دخول مباشر على صفحات واستمارات الإدارة للتعبئة
                    </span>
                  </button>
                </div>
              </div>

              {/* Recipient Name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-200 block">
                  اسم المدعو (اختياري، يظهر في نص الرسالة):
                </label>
                <input
                  type="text"
                  placeholder={`مثال: المهندس / مدير عام ${DEPARTMENTS_METADATA[activeModalDept].title}`}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* WhatsApp Phone */}
              <div className="space-y-1">
                <label className="font-bold text-slate-200 flex items-center justify-between">
                  <span>رقم هاتف الواتساب:</span>
                  <span className="text-[10px] text-slate-400 font-normal">مع كود الدولة (مثال: 01012345678 أو 2010...)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="010XXXXXXXX"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 text-right"
                  />
                </div>
              </div>

              {/* Generated Direct URL Display */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="text-[11px] text-slate-400 font-semibold block">
                  الرابط المباشر الذي سيتم تضمينه بالدعوة:
                </span>
                <span className="font-mono text-[11px] text-indigo-300 break-all select-all block bg-slate-900 p-2 rounded border border-slate-800">
                  {getDepartmentLink(activeModalDept, userRoleType === 'general_manager' ? 'gm' : 'staff', recipientName)}
                </span>
              </div>

              {/* WhatsApp Message Preview */}
              <div className="space-y-1">
                <label className="font-bold text-slate-200 block">معاينة نص رسالة الواتساب:</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto text-[11px]">
                  {getWhatsAppMessage(activeModalDept, recipientName, userRoleType)}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onPreviewDepartment(activeModalDept);
                    setActiveModalDept(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>معاينة الشاشة أولاً</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalDept(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال الدعوة عبر واتساب الآن</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
