import React, { useState } from 'react';
import { 
  Phone, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  MessageSquare, 
  Building2, 
  Radio, 
  AlertTriangle,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { PlatformMasterSettings, ContactNumberItem } from '../types';
import { DEFAULT_CONTACT_NUMBERS } from '../data/defaultSettings';

interface AdminContactsManagerProps {
  settings: PlatformMasterSettings;
  onUpdateSettings: (newSettings: PlatformMasterSettings) => void;
  showSaveNotice?: (msg: string) => void;
}

export const AdminContactsManager: React.FC<AdminContactsManagerProps> = ({
  settings,
  onUpdateSettings,
  showSaveNotice = () => {},
}) => {
  // Master General Contacts draft
  const [hotline, setHotline] = useState(settings.general.hotline || '19544');
  const [emergencyHotline, setEmergencyHotline] = useState(settings.general.emergencyHotline || '129 / 19544');
  const [marketingPhone, setMarketingPhone] = useState(settings.general.marketingPhone || '02-24185200');
  const [whatsappNumber, setWhatsappNumber] = useState(settings.general.whatsappNumber || '+201019544000');
  const [customerServicePhone, setCustomerServicePhone] = useState(settings.general.customerServicePhone || '19544');

  // Contact list
  const contacts = settings.contacts && settings.contacts.length > 0 
    ? settings.contacts 
    : DEFAULT_CONTACT_NUMBERS;

  // New Contact form state
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formNumber, setFormNumber] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formType, setFormType] = useState<ContactNumberItem['type']>('landline');
  const [formDescription, setFormDescription] = useState('');
  const [formIsPrimary, setFormIsPrimary] = useState(false);

  // Save General Numbers
  const handleSaveGeneralNumbers = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: PlatformMasterSettings = {
      ...settings,
      general: {
        ...settings.general,
        hotline: hotline.trim() || '19544',
        emergencyHotline: emergencyHotline.trim(),
        marketingPhone: marketingPhone.trim(),
        whatsappNumber: whatsappNumber.trim(),
        customerServicePhone: customerServicePhone.trim(),
      },
    };

    onUpdateSettings(updatedSettings);
    showSaveNotice(`تم تحديث الخط الساخن الموحد (${hotline}) وأرقام التواصل الرسمية بنجاح!`);
  };

  // Add / Edit Contact Item
  const handleSaveContactItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formNumber.trim()) {
      alert('يرجى كتابة اسم الجهة ورقم الهاتف.');
      return;
    }

    let updatedList: ContactNumberItem[];

    if (editingContactId) {
      updatedList = contacts.map((c) => {
        if (c.id === editingContactId) {
          return {
            ...c,
            title: formTitle.trim(),
            number: formNumber.trim(),
            department: formDepartment.trim() || 'إداري',
            type: formType,
            description: formDescription.trim(),
            isPrimary: formIsPrimary,
          };
        }
        // If this one is primary, unset others if same type
        if (formIsPrimary && c.type === formType) {
          return { ...c, isPrimary: false };
        }
        return c;
      });
      showSaveNotice(`تم تحديث رقم الاتصال: ${formTitle}`);
    } else {
      const newItem: ContactNumberItem = {
        id: `contact-${Date.now()}`,
        title: formTitle.trim(),
        number: formNumber.trim(),
        department: formDepartment.trim() || 'إدارة عامة',
        type: formType,
        description: formDescription.trim(),
        isPrimary: formIsPrimary,
        isActive: true,
      };

      updatedList = [newItem, ...contacts];
      showSaveNotice(`تمت إضافة رقم اتصال جديد: ${newItem.title}`);
    }

    onUpdateSettings({
      ...settings,
      contacts: updatedList,
    });

    // Reset
    resetForm();
  };

  const resetForm = () => {
    setIsAddingContact(false);
    setEditingContactId(null);
    setFormTitle('');
    setFormNumber('');
    setFormDepartment('');
    setFormType('landline');
    setFormDescription('');
    setFormIsPrimary(false);
  };

  const handleStartEdit = (item: ContactNumberItem) => {
    setEditingContactId(item.id);
    setFormTitle(item.title);
    setFormNumber(item.number);
    setFormDepartment(item.department);
    setFormType(item.type);
    setFormDescription(item.description || '');
    setFormIsPrimary(!!item.isPrimary);
    setIsAddingContact(true);
  };

  const handleDeleteContact = (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف الرقم: "${title}"؟`)) return;
    const updated = contacts.filter((c) => c.id !== id);
    onUpdateSettings({
      ...settings,
      contacts: updated,
    });
    showSaveNotice(`تم حذف رقم الاتصال "${title}" بنجاح.`);
  };

  const handleToggleActive = (id: string) => {
    const updated = contacts.map((c) =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    );
    onUpdateSettings({
      ...settings,
      contacts: updated,
    });
  };

  const handleRestoreDefaults = () => {
    if (!confirm('هل ترغب في استعادة أرقام التواصل الافتراضية المعتمدة لكارجاس (الخط الساخن 19544)؟')) return;
    onUpdateSettings({
      ...settings,
      contacts: DEFAULT_CONTACT_NUMBERS,
      general: {
        ...settings.general,
        hotline: '19544',
        emergencyHotline: '129 / 19544',
        marketingPhone: '02-24185200',
        whatsappNumber: '+201019544000',
        customerServicePhone: '19544',
      },
    });
    setHotline('19544');
    setEmergencyHotline('129 / 19544');
    setMarketingPhone('02-24185200');
    setWhatsappNumber('+201019544000');
    setCustomerServicePhone('19544');
    showSaveNotice('تمت استعادة أرقام التواصل الافتراضية والخط الساخن 19544 بنجاح.');
  };

  const getTypeBadge = (type: ContactNumberItem['type']) => {
    switch (type) {
      case 'hotline':
        return <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">خط ساخن مختصر</span>;
      case 'emergency':
        return <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">طوارئ 24 ساعة</span>;
      case 'whatsapp':
        return <span className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/20 text-green-300 font-bold border border-green-500/30">واتساب</span>;
      case 'mobile':
        return <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">محمول</span>;
      default:
        return <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 font-bold">هاتف أرضي</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Phone className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>إدارة الخط الساخن وأرقام التواصل المعتمدة</span>
              <span className="text-amber-400 font-mono text-base font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
                19544
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            التحكم في الرقم المختصر الموحد (19544) وأرقام طوارئ الغاز وإدارة التسويق وخدمة العملاء الظاهرة في الترويسة، التقارير الميدانية، والخرائط، مع إمكانية إضافة وتعديل جهات الاتصال الخاصة بكارجاس.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>استعادة الأرقام الافتراضية</span>
          </button>
        </div>
      </div>

      {/* Main General Numbers Edit Form */}
      <form onSubmit={handleSaveGeneralNumbers} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>الأرقام الرئيسية النشطة بالمنظومة والترويسة والتقارير</span>
          </h3>
          <span className="text-[11px] text-slate-400">تُحدث فوراً في كافة شاشات التطبيق</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Main Hotline 19544 */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>الخط الساخن الموحد (الرقم المختصر)</span>
              </label>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">رئيسي</span>
            </div>
            <input
              type="text"
              required
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              placeholder="19544"
              className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3 py-2 text-emerald-400 font-mono text-base font-black tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <p className="text-[11px] text-slate-400">الرقم الرسمي المعتمد لشركة كارجاس لخدمات الغاز والتحويل والشكاوى</p>
          </div>

          {/* Gas Emergency 129 / 19544 */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>طوارئ الغاز وعمليات التشغيل (24 س)</span>
              </label>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">طوارئ</span>
            </div>
            <input
              type="text"
              value={emergencyHotline}
              onChange={(e) => setEmergencyHotline(e.target.value)}
              placeholder="129 / 19544"
              className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-3 py-2 text-rose-300 font-mono text-sm font-bold focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <p className="text-[11px] text-slate-400">غرفة العمليات المركزية ومتابعة شبكات ومحطات الغاز</p>
          </div>

          {/* Marketing & Field Survey Phone */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>إدارة التسويق والمعاينات الميدانية</span>
            </label>
            <input
              type="text"
              value={marketingPhone}
              onChange={(e) => setMarketingPhone(e.target.value)}
              placeholder="02-24185200"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-400">استقبال طلبات ملاك الأراضي والمعاينات وتطوير المحطات</p>
          </div>

          {/* WhatsApp Support */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-green-300 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <span>واتساب خدمة العملاء والإحداثيات الميدانية</span>
            </label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="+201019544000"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold focus:outline-none focus:border-green-500"
            />
            <p className="text-[11px] text-slate-400">إرسال واستقبال إحداثيات المواقع وصور المعاينة الفورية</p>
          </div>

          {/* Customer Service Phone */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>هاتف خدمة العملاء المباشر</span>
            </label>
            <input
              type="text"
              value={customerServicePhone}
              onChange={(e) => setCustomerServicePhone(e.target.value)}
              placeholder="19544"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm font-bold focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-400">الاستفسار عن أسعار التحويل ومواقع مراكز الخدمة</p>
          </div>

        </div>

        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>حفظ واعتماد أرقام التواصل والخط الساخن</span>
          </button>
        </div>
      </form>

      {/* Detailed Contact Directory Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>دليل أرقام التواصل التفصيلي والإدارات ({contacts.length} رقم)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              يمكنك إضافة أرقام الإدارات الفنية، غرف العمليات بالمحافظات، ومسؤولي المعاينات
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsAddingContact(!isAddingContact);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة رقم اتصال جديد</span>
          </button>
        </div>

        {/* Add / Edit Form Modal or Inline */}
        {isAddingContact && (
          <form onSubmit={handleSaveContactItem} className="bg-slate-950 border border-slate-700/80 rounded-xl p-4 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{editingContactId ? 'تعديل بيانات جهة الاتصال' : 'إضافة جهة اتصال جديدة'}</span>
              </span>
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم الجهة أو الإدارة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: إدارة الدعم الفني بمحافظة الإسكندرية"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الرقم / وسيلة الاتصال</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: 19544 أو 03-4859000"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-emerald-400 font-mono text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">الإدارة / القسم</label>
                <input
                  type="text"
                  placeholder="مثال: قطاع العمليات والشبكات"
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">نوع الرقم</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="hotline">خط ساخن مختصر (Hotline)</option>
                  <option value="emergency">طوارئ 24 ساعة (Emergency)</option>
                  <option value="landline">هاتف أرضي (Landline)</option>
                  <option value="mobile">محمول (Mobile)</option>
                  <option value="whatsapp">واتساب (WhatsApp)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-bold mb-1">الوصف وأوقات العمل</label>
                <input
                  type="text"
                  placeholder="مثال: متاح من 8 صباحاً حتى 4 عصراً، استقبال استفسارات الفحص"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={formIsPrimary}
                  onChange={(e) => setFormIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                />
                <span>تعيين كرقم رئيسي معتمد لهذا التصنيف</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
                >
                  {editingContactId ? 'حفظ التعديلات' : 'إضافة الرقم'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Directory Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {contacts.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                item.isActive
                  ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/30 border-slate-800/40 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{item.title}</span>
                      {item.isPrimary && (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
                          رقم معتمد
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{item.department}</span>
                  </div>

                  {getTypeBadge(item.type)}
                </div>

                <div className="flex items-center gap-2 my-2 font-mono text-emerald-400 text-base font-black">
                  <span>{item.number}</span>
                </div>

                {item.description && (
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleActive(item.id)}
                  className={`text-[11px] font-medium transition-colors cursor-pointer ${
                    item.isActive ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  {item.isActive ? '● نشط بالنظام' : '○ متوقف مؤقتاً'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="تعديل الرقم"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteContact(item.id, item.title)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="حذف الرقم"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
