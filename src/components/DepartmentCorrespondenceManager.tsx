import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Inbox, 
  Mail, 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Paperclip, 
  Building2, 
  ShieldCheck, 
  User, 
  CornerDownLeft, 
  Calendar,
  X,
  Sparkles,
  Archive,
  Eye
} from 'lucide-react';
import { DepartmentRole, DepartmentCorrespondence, MemoPriority, MemoStatus } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import { CargasNgvLogo } from './CargasNgvLogo';

interface DepartmentCorrespondenceManagerProps {
  currentDept?: DepartmentRole | 'admin';
  currentDepartment?: DepartmentRole | 'admin';
  currentUserRole?: DepartmentRole | string;
  currentUserName?: string;
  isAdminView?: boolean;
  onClose?: () => void;
}

const INITIAL_CORRESPONDENCE: DepartmentCorrespondence[] = [
  {
    id: 'cor-1',
    refNumber: 'CRG-ADM-2026/09-001',
    date: '2026-09-20',
    time: '09:30',
    senderDept: 'admin',
    senderName: 'إدارة النظام والتحكم (Super Admin)',
    senderTitle: 'المشرف العام على المنظومة الرقمية',
    recipientDept: 'all',
    subject: 'توجيه إداري عاجل: تعميم استخدام الكاميرا الميدانية وتحديث حقول استمارات المواقع',
    body: 'السادة مديري العموم ومسؤولي الإدارات بشركة كارجاس،\nتحية طيبة وبعد،\nيرجى التكرم بالإحاطة بأنه تم تفعيل نظام التوثيق والتصوير الميداني التخصصي، ويتعين على كافة الإدارات (المشروعات، التشغيل، السلامة، الشؤون الفنية، التراخيص، القانونية، المالية، التسويق) رصد كافة المواقع عبر الاستمارة الموحدة واعتماد البيانات الميدانية باليوم والتاريخ.\nشاكرين حسن تعاونكم،،',
    priority: 'urgent',
    status: 'delivered',
    attachments: [
      { name: 'دليل_التوجيه_الإداري_المركزي.pdf', size: '1.2 MB', type: 'application/pdf' }
    ],
    replies: [
      {
        id: 'rep-1',
        senderDept: 'operations',
        senderName: 'م. خالد الصاوي (مدير عام التشغيل)',
        date: '2026-09-20 11:15',
        message: 'تم الإحاطة وتعميم التوجيه على كافة مهندسي وفنيي المحطات والضواغط.'
      },
      {
        id: 'rep-2',
        senderDept: 'projects',
        senderName: 'م. طارق عبد الرازق (مدير عام المشروعات)',
        date: '2026-09-20 12:40',
        message: 'تم ربط تقارير المعاينات الميدانية الإنشائية بمستخلصات التنفيذ.'
      }
    ]
  },
  {
    id: 'cor-2',
    refNumber: 'CRG-PRJ-2026/09-014',
    date: '2026-09-19',
    time: '14:20',
    senderDept: 'projects',
    senderName: 'م. طارق عبد الرازق',
    senderTitle: 'مدير عام المشروعات والأعمال المدنية',
    recipientDept: 'operations',
    subject: 'إشعار جاهزية القواعد الخرسانية لضواغط الغاز بموقع محطة النرجس الجديدة',
    body: 'السيد المهندس / مدير عام التشغيل والصيانة المحترم،\nنود إحاطتكم باكتمال صب ومعالجة القواعد الخرسانية لضواغط الغاز (250 بار) بموقع محطة النرجس التجمع الخامس، ومطابقتها لاختبارات الهبوط والموجات فوق الصوتية.\nيرجى التفضل بإيفاد فريق الفحص لاستلام القواعد وتحديد موعد توريد الضواغط ومجففات الغاز.\nوتفضلوا بقبول فائق الاحترام والتقدير،،',
    priority: 'important',
    status: 'replied',
    replies: [
      {
        id: 'rep-3',
        senderDept: 'operations',
        senderName: 'م. خالد الصاوي',
        date: '2026-09-19 16:00',
        message: 'تم تحديد موعد المعاينة المشتركة غداً الساعة 10:00 صباحاً بصحبة مهندس الصيانة وضبط الجودة.'
      }
    ]
  },
  {
    id: 'cor-3',
    refNumber: 'CRG-MKT-2026/09-028',
    date: '2026-09-18',
    time: '11:45',
    senderDept: 'marketing',
    senderName: 'م. أحمد الشناوي',
    senderTitle: 'مدير عام التسويق والدراسات الميدانية',
    recipientDept: 'financial',
    subject: 'مذكرة إحالة: نتائج دراسة الجدوى وتدفق حركة المرور لموقع طريق السويس ك 34',
    body: 'السيد الأستاذ / مدير عام الشئون المالية ودراسات الجدوى المحترم،\nمرفق لسيادتكم تقرير الحصر المروري ورصد المركبات لموقع محطة طريق السويس، حيث أظهرت البيانات تدفق 450 مركبة أجرة وميكروباص في ساعة الذروة، مع عائد متوقع 22,000 متر مكعب غاز يومياً.\nيرجى التكرم بحساب فترة الاسترداد ونموذج الإيجار المقترح تمهيداً للعرض على مجلس الإدارة.\nشاكرين لسيادتكم،،',
    priority: 'normal',
    status: 'under_review'
  },
  {
    id: 'cor-4',
    refNumber: 'CRG-HSE-2026/09-009',
    date: '2026-09-17',
    time: '13:10',
    senderDept: 'hse',
    senderName: 'م. حسام البحيري',
    senderTitle: 'مدير عام السلامة والأمن الصناعي',
    recipientDept: 'licensing',
    subject: 'مطابقة اشتراطات الحماية المدنية وتقرير فحص مسافات الأمان لموقع الواحات',
    body: 'السيد الأستاذ / مدير عام التراخيص والموافقات الحكومية المحترم،\nبالإشارة لمعاينة موقع محطة طريق الواحات، نفيدكم بمطابقة الموقع لكود NFPA 52 واشتراطات مسافات الأمان من خط التنظيم (أكثر من 12 متراً)، وقد تم توفير شبكة إطفاء فوم ورشاشات مياه.\nيرجى التكرم باستكمال ملف الترخيص لدى الحماية المدنية بالجيزة.\nوتفضلوا بقبول التحية،،',
    priority: 'important',
    status: 'delivered'
  }
];

export const DepartmentCorrespondenceManager: React.FC<DepartmentCorrespondenceManagerProps> = ({
  currentDept: propDept,
  currentDepartment,
  currentUserRole,
  currentUserName,
  isAdminView = false,
  onClose
}) => {
  const currentDept: DepartmentRole | 'admin' = propDept || currentDepartment || 'admin';
  const [messages, setMessages] = useState<DepartmentCorrespondence[]>(() => {
    try {
      const stored = localStorage.getItem('cng_department_correspondence_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load correspondence', e);
    }
    return INITIAL_CORRESPONDENCE;
  });

  const [activeTab, setActiveTab] = useState<'inbox' | 'outbox' | 'compose' | 'registry'>(
    isAdminView ? 'registry' : 'inbox'
  );

  const [selectedMessage, setSelectedMessage] = useState<DepartmentCorrespondence | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Compose Form
  const [composeRecipient, setComposeRecipient] = useState<DepartmentRole | 'admin' | 'all'>('admin');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [composePriority, setComposePriority] = useState<MemoPriority>('normal');
  const [replyText, setReplyText] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Save to storage
  const saveMessagesToStorage = (updated: DepartmentCorrespondence[]) => {
    setMessages(updated);
    try {
      localStorage.setItem('cng_department_correspondence_v1', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save correspondence', e);
    }
  };

  // Filter messages
  const incomingMessages = messages.filter(m => 
    m.recipientDept === currentDept || m.recipientDept === 'all' || (currentDept === 'admin')
  );

  const outgoingMessages = messages.filter(m => 
    m.senderDept === currentDept
  );

  const displayedList = isAdminView || activeTab === 'registry'
    ? messages
    : activeTab === 'inbox'
    ? incomingMessages
    : outgoingMessages;

  const filteredList = displayedList.filter(m => {
    const matchSearch = m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        m.refNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = filterDept === 'all' || m.senderDept === filterDept || m.recipientDept === filterDept;
    const matchPriority = filterPriority === 'all' || m.priority === filterPriority;
    return matchSearch && matchDept && matchPriority;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject.trim() || !composeBody.trim()) return;

    const senderMeta = currentDept === 'admin' 
      ? { title: 'مدير عام إدارة النظام والتحكم (Super Admin)', defaultGmName: 'إدارة النظام' }
      : DEPARTMENTS_METADATA[currentDept] || { title: 'إدارة تخصصية', defaultGmName: 'مدير الإدارة' };

    const prefix = currentDept === 'admin' ? 'ADM' : currentDept.substring(0, 3).toUpperCase();
    const newMemo: DepartmentCorrespondence = {
      id: 'cor-' + Date.now(),
      refNumber: `CRG-${prefix}-${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(messages.length + 1).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      senderDept: currentDept,
      senderName: senderMeta.defaultGmName || 'مدير الإدارة',
      senderTitle: senderMeta.title || 'مسؤول الإدارة',
      recipientDept: composeRecipient,
      subject: composeSubject.trim(),
      body: composeBody.trim(),
      priority: composePriority,
      status: 'sent',
      replies: []
    };

    const updated = [newMemo, ...messages];
    saveMessagesToStorage(updated);

    // Reset Form
    setComposeSubject('');
    setComposeBody('');
    setActiveTab(currentDept === 'admin' ? 'registry' : 'outbox');
    setSelectedMessage(newMemo);
  };

  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    const senderMeta = currentDept === 'admin' 
      ? { defaultGmName: 'إدارة النظام والتحكم (Super Admin)' }
      : DEPARTMENTS_METADATA[currentDept] || { defaultGmName: 'مدير الإدارة' };

    const newReply = {
      id: 'rep-' + Date.now(),
      senderDept: currentDept,
      senderName: senderMeta.defaultGmName || 'مسؤول الإدارة',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      message: replyText.trim()
    };

    const updated = messages.map(m => {
      if (m.id === selectedMessage.id) {
        return {
          ...m,
          status: 'replied' as MemoStatus,
          replies: [...(m.replies || []), newReply]
        };
      }
      return m;
    });

    saveMessagesToStorage(updated);
    setSelectedMessage({
      ...selectedMessage,
      status: 'replied',
      replies: [...(selectedMessage.replies || []), newReply]
    });
    setReplyText('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                المراسلات والمخاطبات الرسمية بين الإدارات
              </h2>
              <span className="px-2 py-0.5 text-[11px] rounded font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {isAdminView || currentDept === 'admin' ? 'سجل الرقابة المركزي (مدير النظام)' : `بيئة مراسلات ${currentDept}`}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              إرسال واستقبال الخطابات والمذكرات الرسمية وتوثيقها بالرقم الإشاري والتاريخ
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between px-4 gap-2 flex-wrap border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(isAdminView || currentDept === 'admin') && (
            <button
              onClick={() => setActiveTab('registry')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'registry'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>سجل المراسلات المركزي العام</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded bg-slate-900/40 font-mono">
                {messages.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>صندوق الوارد (المستلم)</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded bg-blue-900/60 text-blue-200 font-mono">
              {incomingMessages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('outbox')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'outbox'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>صندوق الصادر (المرسل)</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded bg-indigo-900/60 text-indigo-200 font-mono">
              {outgoingMessages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'compose'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء مخاطبة رسمية جديدة</span>
          </button>
        </div>

        {/* Search Input */}
        {activeTab !== 'compose' && (
          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم الإشارة أو الموضوع..."
                className="w-full pr-8 pl-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="p-4">
        {activeTab === 'compose' ? (
          /* Compose New Official Letter */
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto space-y-4 p-5 rounded-xl bg-slate-800/50 border border-slate-700">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-700 pb-3">
              <FileText className="w-4 h-4" />
              <span>تحرير مخاطبة / مذكرة رسمية جديدة</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">الجهة الموجه إليها الخطاب:</label>
                <select
                  value={composeRecipient}
                  onChange={(e) => setComposeRecipient(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="admin">مدير النظام والتحكم (Super Admin)</option>
                  <option value="all">كافة الإدارات والمديرين العموم (تعميم مركزي)</option>
                  <option value="projects">إدارة المشروعات والأعمال المدنية</option>
                  <option value="operations">إدارة التشغيل والصيانة (المعدات والآلات)</option>
                  <option value="hse">إدارة السلامة والأمن الصناعي (HSE)</option>
                  <option value="technical">الإدارة الفنية وضغوط الشبكات</option>
                  <option value="licensing">إدارة التراخيص والموافقات الحكومية</option>
                  <option value="legal">الإدارة القانونية والعقود</option>
                  <option value="financial">إدارة الشئون المالية ودراسات الجدوى</option>
                  <option value="marketing">إدارة التسويق والدراسات الميدانية</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">درجة الأهمية والاستعجال:</label>
                <select
                  value={composePriority}
                  onChange={(e) => setComposePriority(e.target.value as MemoPriority)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="normal">عادي</option>
                  <option value="important">هام ومطلوب المتابعة</option>
                  <option value="urgent">عاجل جداً وفوري</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">موضوع المخاطبة / المذكرة:</label>
              <input
                type="text"
                required
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="مثال: التنسيق الفني المشترك لمعاينة موقع محطة النرجس..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">نص المذكرة / المخاطبة الرسمية:</label>
              <textarea
                required
                rows={6}
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="السيد المهندس / الأستاذ المحترم،&#10;تحية طيبة وبعد،&#10;بالإشارة إلى..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Paperclip className="w-3.5 h-3.5" />
                <span>إمكانية إرفاق ملفات PDF ومستندات المعاينة</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('inbox')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال المخاطبة الرسمية وتوثيقها</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Split View: List on Right / Details on Left */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Messages List Column */}
            <div className="md:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredList.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs rounded-xl bg-slate-800/30 border border-slate-800">
                  لا توجد مخاطبات أو مراسلات مطابقة لخيارات البحث
                </div>
              ) : (
                filteredList.map((memo) => (
                  <div
                    key={memo.id}
                    onClick={() => setSelectedMessage(memo)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedMessage?.id === memo.id
                        ? 'bg-blue-900/30 border-blue-500 shadow-md'
                        : 'bg-slate-800/50 hover:bg-slate-800 border-slate-700/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                        {memo.refNumber}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                        memo.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        memo.priority === 'important' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {memo.priority === 'urgent' ? 'عاجل جداً' : memo.priority === 'important' ? 'هام' : 'عادي'}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-white truncate mb-1">
                      {memo.subject}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[150px]">
                        من: {memo.senderDept === 'admin' ? 'مدير النظام' : memo.senderDept}
                      </span>
                      <span className="font-mono text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {memo.date}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Details Column */}
            <div className="md:col-span-7 bg-slate-800/60 border border-slate-700 rounded-xl p-4 sm:p-5 flex flex-col justify-between">
              {selectedMessage ? (
                <div className="space-y-4">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        {selectedMessage.refNumber}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {selectedMessage.date} {selectedMessage.time}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowPrintModal(true)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>طباعة الخطاب</span>
                    </button>
                  </div>

                  {/* Sender & Recipient Header */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block">الجهة الصادر منها:</span>
                      <span className="font-bold text-white">{selectedMessage.senderName}</span>
                      <span className="text-[10px] text-slate-400 block">{selectedMessage.senderTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">الجهة الموجه إليها:</span>
                      <span className="font-bold text-blue-300">
                        {selectedMessage.recipientDept === 'all' ? 'كافة الإدارات' :
                         selectedMessage.recipientDept === 'admin' ? 'مدير عام إدارة النظام والتحكم' :
                         selectedMessage.recipientDept}
                      </span>
                    </div>
                  </div>

                  {/* Subject and Body */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2 pb-1 border-b border-slate-700/60">
                      {selectedMessage.subject}
                    </h3>
                    <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800/80 text-slate-200 text-xs leading-relaxed whitespace-pre-line font-sans">
                      {selectedMessage.body}
                    </div>
                  </div>

                  {/* Attachments if any */}
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400">المرفقات والوثائق:</span>
                      {selectedMessage.attachments.map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-800 text-xs">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                            <span>{att.name}</span>
                          </div>
                          <span className="text-slate-500 font-mono text-[10px]">{att.size}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Official Replies Thread */}
                  <div className="space-y-2 pt-2 border-t border-slate-700">
                    <span className="text-xs font-bold text-slate-300 block">الإفادات والردود الرسمية الموثقة:</span>
                    {selectedMessage.replies && selectedMessage.replies.length > 0 ? (
                      selectedMessage.replies.map(rep => (
                        <div key={rep.id} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-1 text-xs">
                          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                            <span>{rep.senderName}</span>
                            <span className="font-mono text-slate-500 text-[10px]">{rep.date}</span>
                          </div>
                          <p className="text-slate-300">{rep.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">لا توجد إفادات أو ردود مسجلة بعد على هذه المذكرة.</p>
                    )}
                  </div>

                  {/* Quick Reply Form */}
                  <div className="pt-2 border-t border-slate-700">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="كتابة إفادة أو رد رسمي وتوثيقه..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                      />
                      <button
                        type="button"
                        onClick={handleSendReply}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
                      >
                        <CornerDownLeft className="w-3.5 h-3.5" />
                        <span>رد رسمي</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <Mail className="w-8 h-8 text-slate-600" />
                  <span>يرجى اختيار مخاطبة من القائمة لعرض تفاصيلها والرد عليها</span>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Printable Modal Letterhead */}
      {showPrintModal && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 p-8 rounded-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
              <CargasNgvLogo size="md" layout="horizontal" />
              <div className="text-left">
                <span className="font-bold text-emerald-800 text-sm">مذكرة مخاطبة داخلية معتمدة</span>
                <p className="text-xs text-slate-500 font-mono">Ref: {selectedMessage.refNumber}</p>
                <p className="text-xs text-slate-500">التاريخ: {selectedMessage.date}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-600">من: <b>{selectedMessage.senderName} ({selectedMessage.senderTitle})</b></span>
                <span className="text-slate-600">إلى: <b>{selectedMessage.recipientDept}</b></span>
              </div>
              <div className="font-bold text-sm text-slate-900 pt-2">
                الموضوع: {selectedMessage.subject}
              </div>
            </div>

            <div className="p-4 rounded bg-slate-50 border text-xs leading-relaxed whitespace-pre-line text-slate-800 min-h-[160px]">
              {selectedMessage.body}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">توقيع المسؤول:</span>
                <span className="font-bold">{selectedMessage.senderName}</span>
              </div>
              <div className="w-20 h-12 border border-dashed border-emerald-500 rounded flex items-center justify-center text-[10px] text-emerald-700 font-bold">
                كارجاس NGV
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                طباعة الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
