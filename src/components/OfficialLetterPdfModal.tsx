import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  Send, 
  FileText, 
  CheckCircle2, 
  Building2, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  ShieldCheck,
  Zap,
  Flame,
  Wrench,
  DollarSign
} from 'lucide-react';
import { CargasNgvLogo } from './CargasNgvLogo';

export type OfficialLetterType = 
  | 'projects_drawings_cost'
  | 'operations_gas_pipeline'
  | 'finance_feasibility_study'
  | 'legal_contracts_licensing'
  | 'hse_safety_approval'
  | 'conversion_center_review'
  | 'escalation_reminder_1'
  | 'escalation_reminder_2';

export interface OfficialLetterData {
  letterType: OfficialLetterType;
  refNumber: string;
  date: string;
  siteName: string;
  locationAddress: string;
  governorate: string;
  coordinates: { lat: number; lng: number };
  areaM2?: number;
  frontageM?: number;
  streetsCount?: number;
  isLiquidFuelStation?: boolean;
  liquidPartnerName?: string;
  hasEvChargingProposed?: boolean;
  expectedDailySalesM3?: number;
  expectedMonthlySalesM3?: number;
  pipelineCostEstimate?: number;
  civilCostEstimate?: number;
  surveyorLeadName: string;
  marketingGmName: string;
  urgentDaysOverdue?: number;
  originalLetterRef?: string;
}

interface OfficialLetterPdfModalProps {
  data: OfficialLetterData;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSend?: (refNumber: string) => void;
}

export const OfficialLetterPdfModal: React.FC<OfficialLetterPdfModalProps> = ({
  data,
  isOpen,
  onClose,
  onConfirmSend,
}) => {
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handlePrintPdf = () => {
    window.print();
  };

  // Generate Letter details according to user business logic
  const getLetterContent = () => {
    switch (data.letterType) {
      case 'projects_drawings_cost':
        return {
          title: 'طلب إعداد التكاليف الإنشائية والرسومات الهندسية للموقع (AutoCAD / PDF)',
          recipientTitle: 'السيد المهندس / مدير عام الإدارة العامة للمشروعات',
          salutation: 'تحية طيبة وبعد ،،،',
          intro: `في إطار خطة الشركة للتوسع في شبكة محطات تموين وتحويل السيارات بالغاز الطبيعي، وطبقاً للدراسة التسويقية الميدانية التي أجرتها إدارة تسويق المحطات لموقع "${data.siteName}"، يرجى التكرم بالإحاطة بأن الموقع قد اجتاز دراسة الجدوى التسويقية الأولية وصدر قرار بصلاحيته للاستثمار.`,
          bulletPoints: [
            'إعداد المقايسة التقديرية والتكاليف الإنشائية للموقع المزمع إنشاؤه.',
            'إعداد الرسم الهندسي التنفيذي للموقع بصيغة (AutoCAD / PDF) وتوقيع المحطة على الرسومات.',
            'توزيع أماكن: الضاغط (Compressor)، الحاويات وسلندرات الغاز، غرفة المحولات والكهرباء، المبنى الإداري، المظلة، وجزر وطلمبات التموين (Dispenser).',
            'التنسيق الفني المشترك مع إدارة التراخيص التابعة للإدارة العامة للشئون القانونية لإنهاء تراخيص ورسوم المرافق ذات الصلة بالأعمال الإنشائية وغرفة المحولات.',
          ],
          closing: 'برجاء التفضل بالتوجيه نحو سرعة إعداد المطلوب وموافاة إدارة تسويق المحطات بما تم خلال 48 ساعة، حتى يتسنى استكمال العرض على الإدارة العامة للشئون المالية.',
          departmentSignature: 'مدير إدارة تسويق المحطات',
          approvedBy: 'مساعد رئيس الشركة للشئون التجارية',
          tag: 'مخاطبة فنية وإنشائية رسمية',
        };

      case 'operations_gas_pipeline':
        return {
          title: 'استعلام رسمي عن توافر خط غاز طبيعي وتكلفته وضغطه',
          recipientTitle: 'السيد المهندس / مدير عام الإدارة العامة للتشغيل والصيانة',
          salutation: 'تحية طيبة وبعد ،،،',
          intro: `بالإشارة إلى أعمال المعاينة التسويقية الميدانية لموقع "${data.siteName}" الكائن في ${data.locationAddress} بمحافظة ${data.governorate}، والمدعمة بالخريطة والإحداثيات الجغرافية المرفقة بهذا الخطاب:`,
          bulletPoints: [
            `الإحداثيات الجغرافية المعتمدة: دائرة عرض (${data.coordinates.lat.toFixed(6)}) - خط طول (${data.coordinates.lng.toFixed(6)}).`,
            'الاستعلام الفني عن وجود وتوافر خط غاز طبيعي بالمنطقة المحيطة بالموقع وسعة خط التغذية المتاح.',
            'في حالة توافر خط الغاز: موافاة إدارة تسويق المحطات بقطر الخط، ضغط الغاز المتاح (بالبار Bar)، والتكلفة التقديرية لتوصيل خط الغاز للمحطة.',
            'في حالة عدم توافر خط غاز: الإفادة الرسمية بذلك ليتسنى لإدارة التسويق اتخاذ قرار بتأجيل الموقع أو الاعتذار لمالك الأرض.',
          ],
          closing: 'برجاء التكرم بموافاتنا بالإفادة الفنية خلال موعد غايته 48 ساعة من تاريخه لتحديد الموقف الاستثماري للمحطة.',
          departmentSignature: 'مدير إدارة تسويق المحطات',
          approvedBy: 'مساعد رئيس الشركة للشئون التجارية',
          tag: 'استعلام توافر خط غاز وتكلفته',
        };

      case 'finance_feasibility_study':
        return {
          title: 'طلب إعداد دراسة الجدوى المالية لمشروع إنشاء المحطة',
          recipientTitle: 'السيد الأستاذ / مدير عام الإدارة العامة للشئون المالية',
          salutation: 'تحية طيبة وبعد ،،،',
          intro: `بناءً على نتائج الدراسة التسويقية الميدانية ومسوحات الرادار المروري المنفذة لموقع "${data.siteName}"، وبالتنسيق مع إفادات إدارتي المشروعات والتشغيل، نتشرف بأن نرفق لسيادتكم المعطيات التسويقية المعتمدة:`,
          bulletPoints: [
            `المبيعات التقديرية المتوقعة للغاز الطبيعي: (${(data.expectedDailySalesM3 || 10000).toLocaleString('ar-EG')} م³/يوم) بواقع (${(data.expectedMonthlySalesM3 || 300000).toLocaleString('ar-EG')} م³/شهر).`,
            `التكاليف الإنشائية والمعدات (تقديري المشروعات): (${(data.civilCostEstimate || 18500000).toLocaleString('ar-EG')} جنيه مصري).`,
            `تكلفة توصيل خط الغاز التقديرية: (${(data.pipelineCostEstimate || 3200000).toLocaleString('ar-EG')} جنيه مصري).`,
            'المطلوب: إعداد دراسة الجدوى المالية وحساب معدل العائد الداخلي على الاستثمار (IRR)، وصافي القيمة الحالية (NPV)، والتدفقات النقدية، وافتراض عمر للمشروع وفترة استرداد رأس المال (Payback Period).',
          ],
          closing: 'برجاء التكرم بالتوجيه نحو إعداد الدراسة المالية وموافاتنا بالتوصية النهائية للعرض على السلطة المختصة للشروع في التنفيذ.',
          departmentSignature: 'مدير إدارة تسويق المحطات',
          approvedBy: 'مساعد رئيس الشركة للشئون التجارية',
          tag: 'دراسة جدوى مالية ومؤشرات استثمارية',
        };

      case 'legal_contracts_licensing':
        return {
          title: 'بدء الإجراءات القانونية وإبرام عقود المحطة وإنهاء التراخيص',
          recipientTitle: 'السيد المستشار / مدير عام الإدارة العامة للشئون القانونية والتراخيص',
          salutation: 'تحية طيبة وبعد ،،،',
          intro: `إلحاقاً بموافقة الإدارة العامة للشئون المالية على الجدوى الاقتصادية لموقع "${data.siteName}"، وبدء مرحلة الشروع في التنفيذ، نرجو التكرم بالتوجيه نحو:`,
          bulletPoints: [
            'مراجعة سندات الملكية والمستندات المقدمة من مالك الموقع وإعداد مسودة العقد النهائي.',
            'التنسيق مع إدارة التراخيص لبدء إجراءات استخراج تراخيص المرافق وتراخيص المحطة بالتنسيق مع المشروعات والأمن الصناعي.',
            'إنهاء التصاريح الإدارية وتوثيق العقود تمهيداً لبدء استلام الموقع.',
          ],
          closing: 'برجاء اتخاذ اللازم قانونياً وإفادتنا بصورة من مسودة العقد المعتمد.',
          departmentSignature: 'مدير إدارة تسويق المحطات',
          approvedBy: 'مساعد رئيس الشركة للشئون التجارية',
          tag: 'الشئون القانونية والتراخيص',
        };

      case 'hse_safety_approval':
        return {
          title: 'مراجعة اشتراطات السلامة والصحة المهنية (HSE) وكود إيجاس',
          recipientTitle: 'السيد الكيميائي / مدير عام إدارة السلامة والصحة المهنية وتأمين بيئة العمل',
          salutation: 'تحية طيبة وبعد ،،،',
          intro: `في إطار التجهيز لأعمال التنفيذ لمحطة كارجاس بموقع "${data.siteName}"، يرجى التكرم بتكليف لجان السلامة لمراجعة:`,
          bulletPoints: [
            'مطابقة الموقع لاشتراطات الشركة المصرية القابضة للغازات الطبيعية (إيجاس) والكود المصري لغاز السيارات.',
            'مراجعة مسافات الأمان ومواصفات حوائط الصد حول الضاغط والحاويات طبقاً لمعايير (NFPA 52).',
            'اعتماد مخطط شبكة الإنذار الآلي المبكر وشبكة مكافحة الحريق بالمحطة.',
          ],
          closing: 'شاكرين لسيادتكم حسن التعاون لما فيه أمان المحطة وسلامة العاملين والمترددين.',
          departmentSignature: 'مدير إدارة تسويق المحطات',
          approvedBy: 'مساعد رئيس الشركة للشئون التجارية',
          tag: 'الأمن الصناعي والسلامة المهنية',
        };

      case 'conversion_center_review':
        return {
          title: 'استطلاع رأي بشأن إقامة مركز تحويل سيارات داخل الموقع',
          recipientTitle: 'السيد المهندس / مدير عام الإدارة العامة لتحويل السيارات',
          salutation: 'تحية طيبة وبعد ،،،',
          intro: `نظراً لتوافر مساحة إضافية بموقع محطة "${data.siteName}"، نتشرف بمخاطبتكم لبحث إمكانية إقامة مركز لتحويل السيارات بالغاز الطبيعي ملحق بالمحطة:`,
          bulletPoints: [
            `المساحة الكلية للموقع: (${data.areaM2 || 1200} م²)، وتسمح بتخصيص جناح لتحويل السيارات وصيانة الأجهزة.`,
            'مراجعة مدى تغطية مراكز التحويل الحالية التابعة للشركة للمنطقة الجغرافية المحيطة.',
            'الإفادة بمدى جدوى إدراج مركز تحويل بالموقع لخدمة أسطول السيارات المستهدف بالمنطقة.',
          ],
          closing: 'برجاء الإفادة بالرأي الفني والتسويقي للإدارة العامة للتحويل.',
          departmentSignature: 'مدير إدارة تسويق المحطات',
          approvedBy: 'مساعد رئيس الشركة للشئون التجارية',
          tag: 'مراكز التحويل والدعم الفني',
        };

      case 'escalation_reminder_1':
        return {
          title: 'استعجال أول (First Escalation) - سرعة الإفادة بالرد على الخطاب الرسمي',
          recipientTitle: 'السيد المهندس / مدير عام الإدارة المختصة',
          salutation: 'تحية طيبة وبعد ،،،',
          intro: `إيماءً إلى خطابنا السابق المسجل برقم صادر (${data.originalLetterRef || 'CRG-MKT-042'}) والموجه لسيادتكم بتاريخ سابق بخصوص موقع محطة "${data.siteName}":`,
          bulletPoints: [
            `تجاوزت مهلة الرد المقررة (48 ساعة) مدة تزيد عن (${data.urgentDaysOverdue || 2} أيام).`,
            'الموقع محل الخطاب يمثل أولوية استثمارية عاجلة للشركة نظراً للكثافة المرورية ومبيعات الغاز المستهدفة.',
            'يتوقف استكمال ملف الجدوى والعرض على السلطة المختصة على ورود رد سيادتكم الفني المعتمد.',
          ],
          closing: 'لذا نرجو التكرم بالتوجيه نحو سرعة التكرم بموافاتنا بالرد اللازم بالسرعة الممكنة.',
          departmentSignature: 'مدير إدارة تسويق المحطات',
          approvedBy: 'مساعد رئيس الشركة للشئون التجارية',
          tag: 'استعجال رسمي أول (First Escalation)',
        };

      case 'escalation_reminder_2':
      default:
        return {
          title: 'استعجال ثانٍ وإنذار أسبقية (Second Escalation) - موقف عاجل جداً',
          recipientTitle: 'السيد الأستاذ / المهندس / مدير عام الإدارة المعنية',
          salutation: 'تحية طيبة وبعد ،،،',
          intro: `إلحاقاً بخطابنا الصادر واستعجالنا الأول برقم (${data.originalLetterRef || 'CRG-MKT-042'}) بشأن موقع محطة "${data.siteName}"، ونظراً لتأخر الرد:`,
          bulletPoints: [
            `تأخر ورود الرد بمدة (${data.urgentDaysOverdue || 5} أيام) مما يترتب عليه تعطل الجدول الزمني لتنفيذ المحطة.`,
            'التأكيد على أن أي تأخير في الرد يؤثر مباشرة على الحصة السوقية للشركة أمام شركات الغاز المنافسة بالمنطقة.',
            'سيتم رفع الموقف للعرض على السيد المهندس / رئيس مجلس الإدارة والعضو المنتدب للإحاطة والتوجيه.',
          ],
          closing: 'برجاء التفضل بموافاتنا بالرد النهائي خلال 24 ساعة من تاريخ استلام هذا الخطاب.',
          departmentSignature: 'مدير إدارة تسويق المحطات',
          approvedBy: 'مساعد رئيس الشركة للشئون التجارية',
          tag: 'استعجال رسمي ثانٍ وعاجل جداً',
        };
    }
  };

  const content = getLetterContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      
      {/* Container */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-right text-slate-100">
        
        {/* Top Control Bar (Screen only) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
              {content.tag}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              رقم القيد: {data.refNumber}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              title="طباعة الخطاب وحفظه كملف PDF رسمي"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة وتصدير PDF</span>
            </button>

            {onConfirmSend && (
              <button
                onClick={() => {
                  onConfirmSend(data.refNumber);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال للإدارة وتثبيت المتابعة</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Letter Document Viewer */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center">
          
          {/* Printable Letter Sheet (A4 Layout) */}
          <div 
            ref={printAreaRef}
            id="cargas-official-letter-sheet"
            className="w-full max-w-[780px] bg-white text-slate-900 rounded-lg p-8 sm:p-12 shadow-2xl relative border border-slate-300 font-serif leading-relaxed"
            style={{ minHeight: '1050px', direction: 'rtl' }}
          >
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
              <span className="text-8xl font-black tracking-widest text-slate-800">CARGAS NGV</span>
            </div>

            {/* Official Header */}
            <div className="border-b-2 border-emerald-800 pb-5 mb-6">
              <div className="flex items-center justify-between">
                
                {/* Right Header Text */}
                <div className="text-right text-xs space-y-1 text-slate-800 font-sans font-bold">
                  <p>جمهورية مصر العربية</p>
                  <p>وزارة البترول والثروة المعدنية</p>
                  <p>الشركة المصرية الدولية لتكنولوجيا الغاز</p>
                  <p className="text-emerald-800 font-black text-sm">كارجاس (CARGAS)</p>
                  <p className="text-slate-600 font-semibold text-[11px]">الإدارة العامة للشئون التجارية - إدارة تسويق المحطات</p>
                </div>

                {/* Center / Left Logo */}
                <div className="flex flex-col items-center">
                  <div className="scale-90">
                    <CargasNgvLogo />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">تأسست عام 1995</span>
                </div>

              </div>

              {/* Ref Number & Date Bar */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 text-xs text-slate-700 font-sans">
                <div>
                  <span className="font-bold text-slate-900">رقم الصادر: </span>
                  <span className="font-mono text-emerald-900 font-bold">{data.refNumber}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">التاريخ: </span>
                  <span>{data.date} م</span>
                </div>
              </div>

            </div>

            {/* Recipient Block */}
            <div className="mb-6 space-y-1.5 font-sans">
              <h2 className="text-base sm:text-lg font-black text-slate-950">
                {content.recipientTitle}
              </h2>
              <p className="text-xs text-slate-600 font-semibold">المحترم ،،،</p>
              <p className="text-xs text-slate-700 font-bold pt-1">{content.salutation}</p>
            </div>

            {/* Letter Subject Box */}
            <div className="bg-emerald-50 border-r-4 border-emerald-700 p-3.5 mb-6 rounded-l-md font-sans">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-black text-emerald-950 shrink-0">الموضوع: </span>
                <span className="font-bold text-emerald-900">{content.title}</span>
              </div>
              <div className="text-[11px] text-emerald-800 mt-1 flex flex-wrap items-center gap-3">
                <span>الموقع: <strong>{data.siteName}</strong></span>
                <span>المحافظة: <strong>{data.governorate}</strong></span>
                {data.isLiquidFuelStation && (
                  <span className="text-amber-800 font-bold">
                    (محطة وقود سائل قائمة - شراكة: {data.liquidPartnerName || 'شركاء البترول'})
                  </span>
                )}
                {data.hasEvChargingProposed && (
                  <span className="text-blue-800 font-bold">(مقترح إضافة شحن كهربائي EV)</span>
                )}
              </div>
            </div>

            {/* Letter Body Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed">
              <p className="text-justify font-medium">
                {content.intro}
              </p>

              {/* Bulleted Requirements */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5 my-4">
                <p className="font-bold text-slate-900 text-xs">البيانات والمتطلبات الفنية الواجب موافاتنا بها:</p>
                <ul className="space-y-2 text-xs text-slate-800 list-inside">
                  {content.bulletPoints.map((bp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold shrink-0">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Geographic Coordinates & Location Box */}
              <div className="border border-dashed border-emerald-600 bg-emerald-50/40 rounded-lg p-3 text-xs text-slate-800 flex flex-wrap justify-between items-center gap-2">
                <div className="space-y-1">
                  <p className="font-bold text-emerald-950 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>محددات الموقع الجغرافي والإحداثيات:</span>
                  </p>
                  <p className="font-mono text-[11px] text-slate-700">
                    Lat: {data.coordinates.lat.toFixed(6)} , Lng: {data.coordinates.lng.toFixed(6)}
                  </p>
                  <p className="text-[11px] text-slate-600">{data.locationAddress}</p>
                </div>
                <div className="text-left font-sans text-[11px] text-slate-600">
                  <p>المساحة: <strong>{data.areaM2 || 1200} م²</strong></p>
                  <p>الواجهة: <strong>{data.frontageM || 35} متر</strong></p>
                  <p>عدد الشوارع: <strong>{data.streetsCount || 2}</strong></p>
                </div>
              </div>

              <p className="text-justify font-semibold text-slate-900 pt-2">
                {content.closing}
              </p>

              <p className="text-center font-bold text-xs text-slate-700 pt-4">
                وتفضلوا بقبول فائق الاحترام والتقدير ،،،
              </p>
            </div>

            {/* Official Signatures & Stamp Block */}
            <div className="mt-12 pt-6 border-t border-slate-300 font-sans">
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                
                {/* Surveyor / Marketing Officer */}
                <div className="space-y-1">
                  <p className="font-bold text-slate-600 text-[11px]">مسؤول الرصد والمتابعة</p>
                  <p className="font-black text-slate-900">{data.surveyorLeadName || 'مهندس أول تسويق'}</p>
                  <div className="h-10 flex items-center justify-center text-[10px] text-slate-400 italic">
                    (توقيع معتمد)
                  </div>
                </div>

                {/* Official Cargas Stamp Simulation */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-2 border-emerald-800/80 flex flex-col items-center justify-center p-1 text-[9px] text-emerald-900 font-bold rotate-[-8deg] shadow-sm select-none">
                    <span>كارجاس CARGAS</span>
                    <span className="text-[8px] text-slate-700">الشئون التجارية</span>
                    <span className="font-black text-[10px] text-emerald-800">صادر معتمد</span>
                    <span className="text-[7px] text-slate-500 font-mono">{data.refNumber}</span>
                  </div>
                </div>

                {/* Marketing General Manager */}
                <div className="space-y-1">
                  <p className="font-bold text-slate-600 text-[11px]">{content.departmentSignature}</p>
                  <p className="font-black text-slate-900">{data.marketingGmName || 'مدير الإدارة'}</p>
                  <p className="text-[10px] text-slate-500 pt-1">معتمد من: {content.approvedBy}</p>
                  <div className="h-10 flex items-center justify-center text-[10px] text-slate-400 italic">
                    (توقيع وخاتم رسمي)
                  </div>
                </div>

              </div>

              {/* Bottom Print Footer */}
              <div className="text-center text-[9px] text-slate-400 mt-8 pt-3 border-t border-slate-200 flex justify-between items-center font-mono">
                <span>تاريخ التوليد: {new Date().toLocaleString('ar-EG')}</span>
                <span>منظومة كارجاس الرقمية لإدارة تسويق المحطات - وثيقة رسمية صادرة PDF</span>
                <span>صفحة 1 من 1</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
