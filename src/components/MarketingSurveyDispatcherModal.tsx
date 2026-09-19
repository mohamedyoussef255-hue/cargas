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
  Compass
} from 'lucide-react';
import { MarketingSurveyAssignment } from '../types';

interface MarketingSurveyDispatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchAssignment?: (assignment: MarketingSurveyAssignment) => void;
}

export const MarketingSurveyDispatcherModal: React.FC<MarketingSurveyDispatcherModalProps> = ({
  isOpen,
  onClose,
  onDispatchAssignment,
}) => {
  const [siteName, setSiteName] = useState<string>('محطة الأمل المقترحة - المحور المركزي');
  const [governorate, setGovernorate] = useState<string>('الجيزة');
  const [cityOrDistrict, setCityOrDistrict] = useState<string>('مدينة 6 أكتوبر / حي المحور');
  const [addressDetails, setAddressDetails] = useState<string>('تقاطع المحور المركزي أمام مجمع مواقف السرفيس والميكروباص');
  const [surveyorName, setSurveyorName] = useState<string>('م. إبراهيم كمال (معاين ميداني)');
  const [surveyorPhone, setSurveyorPhone] = useState<string>('01098765432');
  const [targetScope, setTargetScope] = useState<'new_station' | 'dual_fuel_conversion' | 'fleet_census' | 'highway_corridor'>('new_station');
  const [instructions, setInstructions] = useState<string>('يرجى الرصد الميداني لمدة ساعة على الأقل خلال وقت الذروة، مع تشغيل التحديد التلقائي للموقع بالكاميرا.');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Build the dedicated survey URL with URL parameters
  const baseUrl = window.location.origin + window.location.pathname;
  const surveyParams = new URLSearchParams({
    mode: 'survey',
    role: 'surveyor',
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
إدارة التسويق والدراسات الميدانية

تم تكليفكم رسمياً بمهمة رصد ومعاينة ميدانية لموقع:
📍 الموقع: ${siteName}
🏛 المحافظة / الحي: ${governorate} - ${cityOrDistrict}
🔍 العنوان التقديري: ${addressDetails}
👤 المعاين المكلف: ${surveyorName}
🎯 نطاق المهمة: ${
    targetScope === 'new_station' ? 'محطة غاز طبيعي جديدة' :
    targetScope === 'dual_fuel_conversion' ? 'حصر أساطيل التحويل المشترك' :
    targetScope === 'highway_corridor' ? 'تقييم محور وطريق سريع' : 'حصر مركبات ميداني'
  }

يرجى الضغط على رابط المعاينة المباشر لبدء الرصد الذكي بالكاميرا وتحديد إحداثيات الموقع أوتوماتيكياً:
🔗 ${generatedSurveyUrl}

⚠️ تعليمات: ${instructions}
(ملاحظة: هذا الرابط مخصص للمعاين الميداني ومحمي بصلاحية رصد فقط دون الوصول لبيانات الإدارات الأخرى).`;

  const cleanPhone = surveyorPhone.replace(/[^0-9]/g, '');
  // If phone starts with 0 (Egyptian number), replace leading 0 with 20
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
      assignedBy: 'إدارة التسويق والدراسات',
      assignedDate: new Date().toISOString(),
      targetScope,
      status: 'dispatched',
      surveyToken: 'tok-' + Math.random().toString(36).substring(2, 9),
      surveyUrl: generatedSurveyUrl,
      instructions
    };

    if (onDispatchAssignment) {
      onDispatchAssignment(newAssignment);
    }

    // Open WhatsApp in new tab
    window.open(whatsappHref, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>تكليف معاين ميداني وإرسال الرابط بالواتساب</span>
                <span className="px-2 py-0.5 text-[11px] bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  إدارة التسويق
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                توليد رابط مخصص يتيح للعامل فقط صفحة المعاينة والرصد بالكاميرا دون باقي المنظومة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          
          {/* Site & Surveyor Details Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم الموقع المقترح للمعاينة:
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                placeholder="مثال: محطة النيل - طريق المريوطية"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                المدينة / الحي / المنطقة:
              </label>
              <input
                type="text"
                value={cityOrDistrict}
                onChange={(e) => setCityOrDistrict(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                placeholder="مثال: حي العمرانية / شارع الهرم"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                نطاق وهدف المعاينة:
              </label>
              <select
                value={targetScope}
                onChange={(e) => setTargetScope(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="new_station">إنشاء محطة غاز طبيعي جديدة</option>
                <option value="dual_fuel_conversion">حصر أساطيل وتحويل مشترك</option>
                <option value="highway_corridor">تقييم محور وطريق سريع</option>
                <option value="fleet_census">حصر شامل لمركبات الأجرة والسرفيس</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
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
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
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

          {/* Special Instructions for Surveyor */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              تعليمات خاصة للمعاين:
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Security & Isolation Notice */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-bold text-amber-300">
                صلاحية محكمة ومستقلة:
              </p>
              <p className="text-slate-400 leading-relaxed">
                عند فتح المعاين لهذا الرابط من هاتفه عبر الواتساب، سيتم إدخاله في **صفحة المعاينة والرصد الميداني فقط**. لن يظهر له أي وصول لبيانات الإدارة المالية أو دراسة الجدوى أو قرارات الإدارات الأخرى أو لوحة التحكم.
              </p>
            </div>
          </div>

          {/* Generated Link Display */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                رابط المعاينة المباشر المخصص:
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ</span>
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

          {/* WhatsApp Preview Text Box */}
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1.5">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              نص رسالة الواتساب الجاهزة للإرسال:
            </span>
            <div className="text-xs text-slate-300 font-sans whitespace-pre-wrap bg-slate-900/60 p-2.5 rounded border border-slate-800 max-h-32 overflow-y-auto">
              {whatsappText}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            إلغاء
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
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
