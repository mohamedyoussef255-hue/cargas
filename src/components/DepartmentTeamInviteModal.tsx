import React, { useState } from 'react';
import { 
  Users, 
  Send, 
  Copy, 
  Check, 
  Phone, 
  UserPlus, 
  CheckCircle2, 
  Sparkles, 
  X, 
  MessageSquare,
  Shield,
  Briefcase
} from 'lucide-react';
import { DepartmentRole, DepartmentTeamMemberInvite } from '../types';
import { DEPARTMENTS_METADATA, DEPARTMENT_ROLE_SPECS } from '../data/departmentCustomFields';

interface DepartmentTeamInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentRole;
}

export const DepartmentTeamInviteModal: React.FC<DepartmentTeamInviteModalProps> = ({
  isOpen,
  onClose,
  department,
}) => {
  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.marketing;
  const spec = DEPARTMENT_ROLE_SPECS[department] || DEPARTMENT_ROLE_SPECS.marketing;

  const [memberName, setMemberName] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberRole, setMemberRole] = useState(spec.sampleRoles[0] || 'مهندس موقع');
  const [customRoleText, setCustomRoleText] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Local storage of invited staff for this department
  const storageKey = `cargas_team_invites_${department}`;
  const [invitedTeam, setInvitedTeam] = useState<DepartmentTeamMemberInvite[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  if (!isOpen) return null;

  const effectiveRole = memberRole === 'custom' ? (customRoleText || 'عضو فريق العمل') : memberRole;

  // Build direct employee URL
  const getDirectLink = () => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    const params = new URLSearchParams();
    params.set('role', department);
    params.set('userType', 'staff');
    if (memberName.trim()) {
      params.set('userName', memberName.trim());
    }
    params.set('source', 'team_invite');
    return `${origin}${path}?${params.toString()}`;
  };

  const directLink = getDirectLink();

  const getTeamWhatsAppMessage = () => {
    return `السلام عليكم ورحمة الله، الزميل العزيز ${memberName.trim() ? memberName.trim() : 'عضو فريق العمل'} (${effectiveRole})،\n\n` +
      `يسرنا دعوتكم للبدء بالعمل عبر المنظومة الرقمية لشركة كارجاس - (${meta.title}).\n` +
      `تم إعداد حساب الوصول الخاص بسيادتكم لمتابعة وتسجيل البيانات والاستمارات الخاصة بإدارتنا عبر الرابط المباشر التالي:\n` +
      `${directLink}\n\n` +
      `برجاء الحفظ والدخول للبدء الفوري.\n` +
      `مع خالص التحيات والتقدير،\n` +
      `${spec.gmTitle}\n` +
      `شركة كارجاس للغاز الطبيعي (CARGAS NGV)`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    let cleanPhone = memberPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('01')) {
      cleanPhone = '2' + cleanPhone;
    } else if (cleanPhone.length === 10 && cleanPhone.startsWith('1')) {
      cleanPhone = '20' + cleanPhone;
    }

    const newMember: DepartmentTeamMemberInvite = {
      id: 'team-' + Date.now(),
      department,
      memberName: memberName.trim() || 'مهندس / إداري بالقسم',
      memberPhone: cleanPhone || 'غير محدد',
      memberRole: effectiveRole,
      directUrl: directLink,
      invitedAt: new Date().toISOString(),
      invitedBy: spec.gmTitle,
    };

    const updated = [newMember, ...invitedTeam];
    setInvitedTeam(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    const message = getTeamWhatsAppMessage();
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn my-6">
        {/* Header */}
        <div className={`px-6 py-4.5 bg-gradient-to-r ${spec.theme.headerGradient} border-b ${spec.theme.borderAccent} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${spec.theme.badgeClass}`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>دعوة فريق العمل والمهندسين والإداريين</span>
              </h3>
              <p className="text-xs text-slate-300">
                من: <strong className="text-amber-300">{spec.gmTitle}</strong> • {meta.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSendWhatsApp} className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-xs flex items-start gap-2.5 leading-relaxed">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              يمكنك كمدير عام للإدارة إرسال روابط دعوة مباشرة لمهندسي وإداريي إدارتك عبر الواتساب.
              الرابط يفتح لهم تلقائياً صفحات واستمارات <strong>{meta.title}</strong> فقط دون أي صفحات أخرى، لتمكينهم من تسجيل البيانات الميدانية والمكتبية.
            </div>
          </div>

          {/* Member Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 block">
              اسم المهندس أو الموظف:
            </label>
            <input
              type="text"
              required
              placeholder="مثال: م. أحمد عبد العزيز"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Member Role / Position */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 block flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>الدور أو المسمى الوظيفي داخل الإدارة:</span>
            </label>
            <select
              value={memberRole}
              onChange={(e) => setMemberRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            >
              {spec.sampleRoles.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
              <option value="custom">مسمى وظيفي آخر...</option>
            </select>

            {memberRole === 'custom' && (
              <input
                type="text"
                placeholder="اكتب المسمى الوظيفي هنا..."
                value={customRoleText}
                onChange={(e) => setCustomRoleText(e.target.value)}
                className="w-full mt-2 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>

          {/* WhatsApp Phone Number */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-200 flex items-center justify-between">
              <span>رقم هاتف الواتساب:</span>
              <span className="text-[10px] text-slate-400 font-normal">مع كود الدولة (مثال: 01012345678)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                dir="ltr"
                placeholder="010XXXXXXXX"
                value={memberPhone}
                onChange={(e) => setMemberPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500 text-right"
              />
            </div>
          </div>

          {/* Direct Link Preview */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-semibold">
                الرابط المباشر لموظف الإدارة:
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
              >
                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{isCopied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
              </button>
            </div>
            <span className="font-mono text-[11px] text-indigo-300 break-all select-all block bg-slate-900 p-2 rounded border border-slate-800">
              {directLink}
            </span>
          </div>

          {/* Message Preview */}
          <div className="space-y-1">
            <label className="font-bold text-slate-200 block">نص رسالة الواتساب:</label>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto text-[11px]">
              {getTeamWhatsAppMessage()}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{isCopied ? 'تم نسخ الرابط' : 'نسخ الرابط فقط'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer"
              >
                إغلاق
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال عبر الواتساب</span>
              </button>
            </div>
          </div>
        </form>

        {/* Previous Team Invites Roster */}
        {invitedTeam.length > 0 && (
          <div className="p-5 bg-slate-950/80 border-t border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>أعضاء الفريق الذين تمت دعوتهم بالواتساب ({invitedTeam.length})</span>
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {invitedTeam.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.memberName}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({item.memberRole})</span>
                    <span className="text-emerald-400 font-mono text-[10px]">{item.memberPhone}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.directUrl);
                      alert('تم نسخ الرابط المباشر للزميل!');
                    }}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="نسخ الرابط مجدداً"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
