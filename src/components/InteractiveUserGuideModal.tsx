import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Search, 
  FileText, 
  Calendar, 
  Award, 
  Bell, 
  Share2, 
  Printer, 
  Lock, 
  Sparkles, 
  ChevronLeft, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Wrench,
  Flame,
  HelpCircle,
  Lightbulb,
  LogOut
} from 'lucide-react';
import { DepartmentRole } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';

interface InteractiveUserGuideModalProps {
  currentDepartment?: DepartmentRole;
  onClose: () => void;
  onNavigateSubTab?: (subTab: 'form' | 'tasks' | 'evaluation' | 'reports' | 'logs' | 'alerts') => void;
}

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge: string;
  summary: string;
  steps: {
    title: string;
    description: string;
    tip?: string;
  }[];
  relatedSubTab?: 'form' | 'tasks' | 'evaluation' | 'reports' | 'logs' | 'alerts';
}

export const InteractiveUserGuideModal: React.FC<InteractiveUserGuideModalProps> = ({
  currentDepartment = 'operations',
  onClose,
  onNavigateSubTab
}) => {
  const meta = DEPARTMENTS_METADATA[currentDepartment] || DEPARTMENTS_METADATA.operations;
  const [activeSectionId, setActiveSectionId] = useState<string>('form');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sections: GuideSection[] = [
    {
      id: 'form',
      title: 'استمارة ومطابقة الموقع الميداني',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      badge: 'الخطوة الأولى',
      summary: 'كيفية ملء استمارة الموقع الميداني المعتمدة لإدارتك وتأكيد استيفاء الاشتراطات الفنية.',
      relatedSubTab: 'form',
      steps: [
        {
          title: '1. اختيار المحطة أو الموقع الميداني',
          description: 'من القائمة المنسدلة أعلى صفحة الإدارة، اختر المحطة المستهدفة (كود المحطة، الاسم، المحافظة). يتم تحميل بيانات الموقع تلقائياً.',
          tip: 'المواقع التي تم رصد إحداثياتها بنظام GPS تظهر عليها شارة "موقع مؤكد أوتوماتيكياً".'
        },
        {
          title: '2. استيفاء حقول الإدارة التخصصية',
          description: 'قم بتعبئة الحقول المخصصة لإدارتك فقط (الضغوط، المسافات الآمنة، التراخيص، إلخ). باقي حقول الإدارات الأخرى تكون مقفلة لضمان الخصوصية والمسؤولية.',
          tip: 'إذا كانت هناك متطلبات فنية جديدة لإدارتك، يمكنك النقر على زر "طلب تحديث الحقول" لمخاطبة مدير النظام.'
        },
        {
          title: '3. حفظ واعتماد الاستمارة',
          description: 'انقر على زر "حفظ استمارة الإدارة للموقع" لتثبيت المدخلات وحفظها في قاعدة البيانات وسجل المتابعة الرقمي.',
          tip: 'يمكنك أيضاً استخدام كاميرا الموقع لرصد مقطع فيديو أو صور توثيقية ترتبط مباشرة بملف المحطة.'
        }
      ]
    },
    {
      id: 'tasks',
      title: 'جدولة ومتابعة المهام الدورية',
      icon: <Calendar className="w-5 h-5 text-emerald-400" />,
      badge: 'إدارة العمليات',
      summary: 'نظام إدارة المهام الدورية (يومية، أسبوعية، شهرية) وتوزيع التكليفات ومتابعة نسب الإنجاز.',
      relatedSubTab: 'tasks',
      steps: [
        {
          title: '1. استعراض جدول المهام الدورية',
          description: 'انتقل إلى تبويب "جدولة المهام الدورية للإدارة" للاطلاع على كافة التكليفات المجدولة وأولوياتها ومواعيد استحقاقها.',
          tip: 'المهام تصنف تلقائياً حسب الأولوية وتظهر المهام المتأخرة باللون الأحمر للتنبيه الفوري.'
        },
        {
          title: '2. إضافة مهمة جديدة وتكليف المسؤول',
          description: 'انقر على زر "إضافة مهمة دورية جديدة"، حدد التكرار (يومي، أسبوعي، شهري)، واسم المسؤول ورقم هاتفه، وتاريخ الاستحقاق.',
          tip: 'يمكن تفعيل خيار "إلزام برفع صورة أو إثبات إنجاز" لضمان جودة التنفيذ الميداني.'
        },
        {
          title: '3. تحديث حالة المهمة والاعتماد',
          description: 'عند إتمام المهمة، قم بتغيير حالتها إلى "مكتملة" ليتم توثيق اسم المنفذ وتاريخ وساعة الإنجاز تلقائياً في سجل نشاط الإدارة.'
        }
      ]
    },
    {
      id: 'evaluation',
      title: 'تقييم أداء الإدارة ومؤشرات KPIs',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      badge: 'مؤشرات الأداء',
      summary: 'الاطلاع على التقييم المؤسسي المعتمد للإدارة، تحليل المعايير الفنية، ونقاط القوة والتحسين.',
      relatedSubTab: 'evaluation',
      steps: [
        {
          title: '1. قراءة مؤشر الأداء العام (Overall Score)',
          description: 'يعرض التقييم نسبة مئوية محسوبة بدقة بناءً على الأوزان النسبية للمعايير التشغيلية المعتمدة لكل إدارة.',
          tip: 'التقديرات تبدأ من ممتاز A+ (أكثر من 95%) وحتى C للمستويات التي تتطلب تحسيناً فورياً.'
        },
        {
          title: '2. مراجعة نقاط القوة ومجالات التحسين',
          description: 'تعرض الشاشة بطاقات تحليلية توضح أبرز الإنجازات والاشتراطات التي تفوقت فيها الإدارة، إلى جانب توصيات القيادة العليا لتطوير الأداء.'
        },
        {
          title: '3. تصدير وطباعة تقرير التقييم المعتمد',
          description: 'يمكنك طباعة التقرير أو تصديره PDF أو إرساله ملخصاً رسمياً بالواتساب بضغطة زر واحدة.'
        }
      ]
    },
    {
      id: 'alerts',
      title: 'لوحة التنبيهات والإشعارات الحية',
      icon: <Bell className="w-5 h-5 text-rose-400" />,
      badge: 'المتابعة العاجلة',
      summary: 'التعامل مع التنبيهات الحرجة، مواعيد المعايرة، الاشتراطات البيئية والتراخيص المتأخرة.',
      relatedSubTab: 'alerts',
      steps: [
        {
          title: '1. متابعة شارة التنبيهات النشطة',
          description: 'تظهر شارة التنبيهات أعلى الواجهة بعدد الإشعارات غير المقروءة ودرجة خطورتها (حرج، تحذير، معلوماتي).',
          tip: 'الضغط على زر التنبيهات يفتح لوحة التنبيهات المباشرة دون الحاجة لمغادرة صفحتك الحالية.'
        },
        {
          title: '2. اتخاذ إجراء فوري (Take Action)',
          description: 'يحتوي كل تنبيه على زر انتقال مباشر للمهمة أو الاستمارة المرتبطة لحل المشكلة فوراً.',
          tip: 'بعد المراجعة، انقر على "تمت المراجعة" لنقل التنبيه إلى الأرشيف المقروء.'
        }
      ]
    },
    {
      id: 'reports',
      title: 'نظام التقارير التلقائي ووضع القراءة',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      badge: 'التقارير الذكية',
      summary: 'توليد التقارير التشغيلية الدورية تلقائياً، واستخدام وضع القراءة التنفيذي الخالي من المشتتات.',
      relatedSubTab: 'reports',
      steps: [
        {
          title: '1. توليد تقرير دوري تلقائي',
          description: 'من تبويب التقارير التلقائية، اختر الفترة (أسبوعي، شهري، ربع سنوي) واضغط "توليد التقرير التلقائي الآن". المنظومة تجمع وتلخص كافة المؤشرات فورياً.',
          tip: 'التقرير يشتمل على ملخص تنفيذي موجه للإدارة العليا، وأبرز الإنجازات، وخطة الفترة القادمة.'
        },
        {
          title: '2. تفعيل وضع القراءة المريح (Reader Mode)',
          description: 'اضغط على زر "وضع القراءة المريح" لعرض التقرير في شاشة كاملة نظيفة مع إمكانية التبديل بين نمط الورق الفاخر (Sepia)، أو النهاري، أو الليلي، والتحكم بحجم الخط.',
          tip: 'وضع القراءة مثالي للعرض على شاشات الاجتماعات أو مراجعة القيادات دون أي تعقيدات برمجية.'
        },
        {
          title: '3. المشاركة والطباعة الفورية',
          description: 'يوفر التقرير أزراراً جاهزة للطباعة والتصدير بتنسيق PDF أو إرسال ملخص منسق ومعتمد مباشرة عبر تطبيق الواتساب.'
        }
      ]
    }
  ];

  const filteredSections = sections.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.steps.some(st => st.title.toLowerCase().includes(searchQuery.toLowerCase()) || st.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  دليل الاستخدام التفاعلي لمنظومة كارجاس
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {meta.title}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                مرجع استرشادي شامل لشرح أدوات الاستمارات، المهام الدورية، التقييم، والتقارير التنفيذية.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors cursor-pointer"
            title="خروج من دليل الاستخدام"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج</span>
          </button>
        </div>

        {/* Search & Categories Navigation */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في فصول الدليل..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeSectionId === sec.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {sec.icon}
                <span>{sec.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Active Chapter Header */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                {activeSection.icon}
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider block">
                  {activeSection.badge}
                </span>
                <h3 className="text-lg font-black text-white">
                  {activeSection.title}
                </h3>
                <p className="text-xs text-slate-400 pt-0.5">
                  {activeSection.summary}
                </p>
              </div>
            </div>

            {activeSection.relatedSubTab && onNavigateSubTab && (
              <button
                onClick={() => {
                  onNavigateSubTab(activeSection.relatedSubTab!);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow cursor-pointer shrink-0"
              >
                <span>انتقل للتبويب الآن</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Detailed Steps */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              خطوات وإرشادات الاستخدام العملية:
            </h4>

            {activeSection.steps.map((step, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800/90 hover:border-slate-700 transition-all space-y-2 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h5 className="text-sm font-bold text-white">
                    {step.title}
                  </h5>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pr-8">
                  {step.description}
                </p>

                {step.tip && (
                  <div className="mr-8 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-300">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>تلميح ذكي:</strong> {step.tip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Special Advice for Current Department */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-start gap-3 text-xs text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-white mb-1">
                توجيه تنفيذي معتمد لـ {meta.title}:
              </strong>
              يرجى التأكد من استيفاء المعاينات والمهام في مواعيدها المقررة لضمان احتسابها ضمن مؤشر التقييم الفصلي المعتمد للشركة وتجنب تراكم أي تنبيهات حرجة.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>منظومة منهاج الرقمية - دليل الجودة والتشغيل</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            إغلاق الدليل
          </button>
        </div>

      </div>
    </div>
  );
};
