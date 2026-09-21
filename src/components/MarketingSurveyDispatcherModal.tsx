import React, { useState } from 'react';
import { 
  Share2, 
  Send, 
  Check, 
  Copy, 
  Phone, 
  MapPin, 
  UserCheck, 
  Sparkles, 
  AlertCircle, 
  X, 
  ExternalLink,
  MessageSquare,
  Compass,
  Clock,
  Car,
  TrendingUp,
  Building2,
  Layers,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { MarketingSurveyAssignment, MarketingSessionCategory, DepartmentRole } from '../types';

interface MarketingSurveyDispatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchAssignment?: (assignment: MarketingSurveyAssignment) => void;
  defaultDepartment?: DepartmentRole;
}

export const MarketingSurveyDispatcherModal: React.FC<MarketingSurveyDispatcherModalProps> = ({
  isOpen,
  onClose,
  onDispatchAssignment,
  defaultDepartment = 'marketing',
}) => {
  const [siteName, setSiteName] = useState<string>('محطة الأمل المقترحة - المحور المركزي');
  const [governorate, setGovernorate] = useState<string>('الجيزة');
  const [cityOrDistrict, setCityOrDistrict] = useState<string>('مدينة 6 أكتوبر / حي المحور');
  const [addressDetails, setAddressDetails] = useState<string>('تقاطع المحور المركزي أمام مجمع مواقف السرفيس والميكروباص');
  const [surveyorName, setSurveyorName] = useState<string>('م. إبراهيم كمال (معاين ميداني)');
  const [surveyorPhone, setSurveyorPhone] = useState<string>('01098765432');
  
  // The 4 Specific Survey Sessions requested by User
  const [sessionCategory, setSessionCategory] = useState<MarketingSessionCategory>('site_periods');
  // Periods count for site survey (minimum 4 periods, expandable)
  const [periodsCount, setPeriodsCount] = useState<number>(4);
  // Target Department where results will appear to the General Manager
  const [targetDepartment, setTargetDepartment] = useState<DepartmentRole>(defaultDepartment);

  const [instructions, setInstructions] = useState<string>('الالتزام التام بالرصد الميداني لكل فترة زمنية بما لا يقل عن 15 دقيقة مع تسجيل كافة فئات المركبات بدقة.');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Category labels and details
  const categoryDetails: Record<MarketingSessionCategory, { title: string; desc: string; icon: any }> = {
    site_periods: {
      title: 'جلسة رصد ومعاينة الموقع (أربع فترات زمنية مختلفة)',
      desc: `رصد على مدار اليوم (صباحية، ظهيرة، بعد الظهر، ليلية) مدة كل فترة لا تقل عن 15 دقيقة (محدد: ${periodsCount} فترات).`,
      icon: Clock
    },
    density_hubs: {
      title: 'جلسة رصد التجمعات ذات الكثافة المرورية',
      desc: 'حصر الميادين المزدحمة، المناطق الصناعية، والتقاطعات المحورية ذات الكثافة المرورية العالية.',
      icon: TrendingUp
    },
    competitors: {
      title: 'جلسة رصد المنافسين ومحطات الوقود المجاورة',
      desc: 'حصر محطات الغاز والوقود المحيطة، المسافات، أسعار المتر المكعب، وأوقات الانتظار.',
      icon: Building2
    },
    stations_parking: {
      title: 'جلسة رصد المواقف وخطوط السير',
      desc: 'حصر مواقف سيارات السرفيس، الميكروباص، التاكسي، بيجو الأقاليم، ونصف النقل المحيطة بالموقع.',
      icon: Car
    }
  };

  const targetDeptLabels: Record<DepartmentRole, string> = {
    marketing: 'إدارة التسويق والدراسات الميدانية',
    projects: 'إدارة المشروعات والأعمال المدنية',
    operations: 'إدارة التشغيل والصيانة',
    hse: 'إدارة السلامة والصحة المهنية والأمن الصناعي',
    technical: 'الإدارة الفنية وشبكات الغاز',
    licensing: 'إدارة التراخيص والموافقات',
    legal: 'الإدارة القانونية والعقود',
    financial: 'الإدارة المالية ودراسات الجدوى',
    admin: 'لوحة الإدارة المركزية',
    surveyor: 'المعاين الميداني'
  };

  // Build the dedicated survey URL with URL parameters
  const baseUrl = window.location.origin + window.location.pathname;
  const surveyParams = new URLSearchParams({
    mode: 'survey',
    role: 'surveyor',
    category: sessionCategory,
    targetDept: targetDepartment,
    periods: periodsCount.toString(),
    site: siteName,
    gov: governorate,
    dist: cityOrDistrict,
    surveyor: surveyorName,
    phone: surveyorPhone,
    t: Date.now().toString()
  });
  const generatedSurveyUrl = `${baseUrl}?${surveyParams.toString()}`;

  // Arabic WhatsApp message
  const whatsappText = `السلام عليكم ورحمة الله وبركاته،
شركة كارجاس للغاز الطبيعي (CARGAS NGV) ⛽️
تكليف بمهمة رصد ميدانية رسمية من: ${targetDeptLabels[targetDepartment]}

📍 الموقع المستهدف: *${siteName}*
🏛 المحافظة والحي: ${governorate} - ${cityOrDistrict}
🗺 تفاصيل الموقع: ${addressDetails}
👤 المعاين المكلف: ${surveyorName}

🎯 نوع جلسة الرصد المحددة:
*${categoryDetails[sessionCategory].title}*
${sessionCategory === 'site_periods' ? `⏱ عدد الفترات المطلوبة: ${periodsCount} فترات زمنية على مدار اليوم (مدة كل فترة لا تقل عن 15 دقيقة إجبارياً).` : ''}
${categoryDetails[sessionCategory].desc}

🔗 رابط جلسة الرصد الميداني الحصري:
${generatedSurveyUrl}

⚠️ تعليمات هامة:
${instructions}
📌 بمجرد إتمام وحفظ الجلسة، ستظهر النتائج والبيانات فوراً للمدير العام في صفحة [${targetDeptLabels[targetDepartment]}].
(الرابط مخصص فقط للرصد الميداني ولا يتيح الوصول لأي بيانات إدارية أخرى).`;

  const cleanPhone = surveyorPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone;
  const whatsappHref = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(whatsappText)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedSurveyUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDispatch = () => {
    const newAssignment: MarketingSurveyAssignment = {
      id: 'dispatch-' + Date.now(),
      siteName,
      governorate,
      cityOrDistrict,
      addressDetails,
      surveyorName,
      surveyorPhone,
      assignedBy: targetDeptLabels[targetDepartment],
      assignedDate: new Date().toISOString(),
      targetScope: 'new_station',
      sessionCategory,
      assignedDepartmentTarget: targetDepartment,
      status: 'dispatched',
      surveyToken: 'tok-' + Math.random().toString(36).substring(2, 9),
      surveyUrl: generatedSurveyUrl,
      instructions
    };

    if (onDispatchAssignment) {
      onDispatchAssignment(newAssignment);
    }

    // Open WhatsApp
    window.open(whatsappHref, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>إرسال جلسة الرصد عبر الواتساب للمعاينة الميدانية</span>
                <span className="px-2 py-0.5 text-[11px] bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 font-semibold">
                  جلسة رصد فقط
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                تخصيص جلسة رصد محددة وإرسالها للمعاين الميداني؛ وفور إنهائها تظهر النتائج للمدير العام بالإدارة المحددة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm max-h-[75vh] overflow-y-auto">
          
          {/* 1. Selection of the 4 Specific Survey Sessions */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-indigo-300">
              اختر نوع جلسة الرصد المحددة المطلوب تكليفها:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(categoryDetails) as MarketingSessionCategory[]).map((catKey) => {
                const item = categoryDetails[catKey];
                const isSelected = sessionCategory === catKey;
                const IconComponent = item.icon;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setSessionCategory(catKey)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 text-white shadow-md'
                        : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed pr-8">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* If Multi-period site session selected: configure periods */}
          {sessionCategory === 'site_periods' && (
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>فترات الرصد الزمني على مدار اليوم (مدة كل جلسة لا تقل عن 15 دقيقة إجبارياً)</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300">عدد الفترات:</span>
                  <select
                    value={periodsCount}
                    onChange={(e) => setPeriodsCount(parseInt(e.target.value, 10) || 4)}
                    className="bg-slate-900 border border-slate-700 text-xs text-white px-2 py-1 rounded font-bold"
                  >
                    <option value={4}>4 فترات (الأساسية القياسية)</option>
                    <option value={5}>5 فترات (إضافة ذروة إضافية)</option>
                    <option value={6}>6 فترات (تغطية 24 ساعة)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                  <span className="block font-bold text-white">الفترة 1: الصباحية</span>
                  <span className="text-slate-400 text-[10px]">07:00 ص - 10:00 ص</span>
                  <span className="block text-emerald-400 font-mono text-[10px] mt-0.5">≥ 15 دقيقة</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                  <span className="block font-bold text-white">الفترة 2: الظهيرة</span>
                  <span className="text-slate-400 text-[10px]">12:00 م - 03:00 م</span>
                  <span className="block text-emerald-400 font-mono text-[10px] mt-0.5">≥ 15 دقيقة</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                  <span className="block font-bold text-white">الفترة 3: بعد الظهر</span>
                  <span className="text-slate-400 text-[10px]">04:00 م - 07:00 م</span>
                  <span className="block text-emerald-400 font-mono text-[10px] mt-0.5">≥ 15 دقيقة</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700">
                  <span className="block font-bold text-white">الفترة 4: المسائية الليلية</span>
                  <span className="text-slate-400 text-[10px]">08:00 م - 11:00 م</span>
                  <span className="block text-emerald-400 font-mono text-[10px] mt-0.5">≥ 15 دقيقة</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Destination Department for Completed Results */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
            <label className="block text-xs font-bold text-slate-200">
              جهة وتخصيص ظهور النتائج للمدير العام عند إنهاء الجلسة:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <select
                  value={targetDepartment}
                  onChange={(e) => setTargetDepartment(e.target.value as DepartmentRole)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="marketing">إدارة التسويق والدراسات (الجهة التقييمية الأولى)</option>
                  <option value="projects">إدارة المشروعات والأعمال المدنية</option>
                  <option value="operations">إدارة التشغيل والصيانة</option>
                  <option value="hse">إدارة السلامة والصحة المهنية والأمن الصناعي</option>
                  <option value="technical">الإدارة الفنية وشبكات الغاز</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تصل البيانات تلقائياً وتُحدث تقييم الطاقة الاستيعابية والقرار التوافقي</span>
              </div>
            </div>
          </div>

          {/* 3. Site & Surveyor Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم الموقع المقترح:
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                placeholder="مثال: محطة الأمل - المحور المركزي"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                المحافظة:
              </label>
              <select
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="الجيزة">الجيزة</option>
                <option value="القاهرة">القاهرة</option>
                <option value="الإسكندرية">الإسكندرية</option>
                <option value="القليوبية">القليوبية</option>
                <option value="الشرقية">الشرقية</option>
                <option value="الدقهلية">الدقهلية</option>
                <option value="الغربية">الغربية</option>
                <option value="السويس">السويس</option>
                <option value="بني سويف">بني سويف</option>
                <option value="المنيا">المنيا</option>
                <option value="أسيوط">أسيوط</option>
                <option value="قنا">قنا</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                المدينة / الحي:
              </label>
              <input
                type="text"
                value={cityOrDistrict}
                onChange={(e) => setCityOrDistrict(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                العنوان والعلامات المميزة:
              </label>
              <input
                type="text"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>اسم المعاين الميداني المكلف:</span>
              </label>
              <input
                type="text"
                value={surveyorName}
                onChange={(e) => setSurveyorName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>رقم واتساب المعاين:</span>
              </label>
              <input
                type="text"
                value={surveyorPhone}
                onChange={(e) => setSurveyorPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                placeholder="01012345678"
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              تعليمات خاصة للمعاين:
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Isolation & Privacy Guarantee */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-bold text-amber-300">
                حماية أمنية: يفتح الرابط شاشة الرصد الميداني فقط
              </p>
              <p className="text-slate-400 leading-relaxed">
                المعاين أو الشخص المستلم يفتح الكاميرا ويسجل الرصد فقط بدون أي صلاحية للاطلاع على الخطط الإدارية أو المالية أو تقارير الإدارات الأخرى.
              </p>
            </div>
          </div>

          {/* Generated Link Display */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                رابط جلسة الرصد المباشر:
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>نسخ الرابط</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] font-mono text-slate-400 break-all select-all bg-slate-900/80 p-2 rounded border border-slate-800">
              {generatedSurveyUrl}
            </p>
          </div>

          {/* WhatsApp Text Preview */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1.5">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              نص رسالة الواتساب الجاهزة للإرسال:
            </span>
            <div className="text-xs text-slate-300 font-sans whitespace-pre-wrap bg-slate-900/60 p-2.5 rounded border border-slate-800 max-h-36 overflow-y-auto">
              {whatsappText}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            إلغاء
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4 text-slate-400" />
              <span>نسخ الرابط</span>
            </button>

            <button
              type="button"
              onClick={handleDispatch}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال عبر الواتساب فوراً</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

