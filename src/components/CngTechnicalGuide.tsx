import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Zap, 
  Flame, 
  Wrench, 
  Phone, 
  MapPin, 
  ExternalLink,
  HelpCircle,
  Clock,
  Gauge,
  Info,
  Settings,
  Plus
} from 'lucide-react';
import { CargasNgvLogo } from './CargasNgvLogo';
import { CargasCenterItem, CylinderSpecItem, ConversionSystemItem } from '../types';
import { DEFAULT_CARGAS_CENTERS, DEFAULT_CYLINDER_SPECS } from '../data/defaultSettings';

interface CngTechnicalGuideProps {
  centers?: CargasCenterItem[];
  cylinders?: CylinderSpecItem[];
  systems?: ConversionSystemItem[];
  onNavigateToAdmin?: () => void;
}

export const CngTechnicalGuide: React.FC<CngTechnicalGuideProps> = ({
  centers,
  cylinders,
  systems,
  onNavigateToAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'cylinders' | 'safety' | 'licensing' | 'centers'>('cylinders');

  // Cylinder types from props or defaults
  const cylinderTypes = cylinders && cylinders.length > 0 ? cylinders : DEFAULT_CYLINDER_SPECS;

  // Cargas Centers from props or defaults
  const cargasCenters = centers && centers.length > 0 ? centers : DEFAULT_CARGAS_CENTERS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CargasNgvLogo size="lg" showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  الدليل الفني والمواصفات المعتمدة لمنظومة الغاز الطبيعي (كارجاس NGV)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                  ISO 11439 Standards
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                دليل شامل لمعايير الأمان، مواصفات الاسطوانات، إجراءات ترخيص المرور، وشبكة مراكز التحويل والصيانة المعتمدة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
                title="تعديل بيانات الدليل الفني ومراكز كارجاس"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>إدارة الدليل الفني والمراكز</span>
              </button>
            )}

            <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-right">
              <span className="text-[10px] text-slate-400 block">الخط الساخن لشركة كارجاس:</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-black text-base">
                <Phone className="w-4 h-4" />
                <span>19614</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('cylinders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'cylinders'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>أنواع ومواصفات اسطوانات الغاز</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'safety'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>منظومة الأمان وصمامات الإغلاق</span>
        </button>

        <button
          onClick={() => setActiveTab('licensing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'licensing'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>إجراءات الفحص والترخيص بالمرور</span>
        </button>

        <button
          onClick={() => setActiveTab('centers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'centers'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>فروع ومراكز كارجاس المعتمدة</span>
        </button>
      </div>

      {/* TAB 1: CYLINDER TYPES */}
      {activeTab === 'cylinders' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cylinderTypes.map((cyl) => (
            <div key={cyl.id} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
                  <h3 className="font-bold text-white text-base">{cyl.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                    200 Bar
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">مادة الصنع:</span>
                    <strong className="text-slate-200">{cyl.material}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">معايير الجودة والضغط:</span>
                    <span className="text-amber-400 font-mono font-semibold">{cyl.specs} • {cyl.pressure}</span>
                  </div>

                  <div className="pt-2">
                    <span className="text-slate-400 block text-[11px] mb-1.5 font-bold">أبرز المميزات الهندسية:</span>
                    <ul className="space-y-1.5 text-slate-300">
                      {cyl.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700 text-xs">
                <span className="text-slate-400 block text-[11px]">الفئات الموصى بها:</span>
                <strong className="text-emerald-300 font-medium">{cyl.suitable}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SAFETY & VALVES */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>صمامات الأمان الآلية المزدوجة (Safety Valves)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
                  <strong className="text-emerald-400 text-sm block mb-1">
                    1. صمام تصريف الضغط والحرارة (PRD - Pressure Relief Device)
                  </strong>
                  <p className="text-slate-300 leading-relaxed">
                    صمام مدمج ينصهر عند درجة حرارة 110 مئوية أو ضغط أعلى من 300 بار ليقوم بتفريغ الغاز في مسار آمن خارج كابينة الركاب لمنع حدوث أي انفجار حتى في حال نشوب حريق خارجي للسيارة.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
                  <strong className="text-emerald-400 text-sm block mb-1">
                    2. صمام قطع التدفق الزائد (Excess Flow Valve)
                  </strong>
                  <p className="text-slate-300 leading-relaxed">
                    يقوم بغلق مخرج الاسطوانة تلقائياً في أقل من 0.05 ثانية في حال حدوث أي كسر أو قطع في مواسير الغاز تحت السيارة، مانعاً تسرب الغاز من الاسطوانة.
                  </p>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
                  <strong className="text-emerald-400 text-sm block mb-1">
                    3. الصمام الكهرومغناطيسي الذكي (Solenoid Valve)
                  </strong>
                  <p className="text-slate-300 leading-relaxed">
                    يعمل مع وحدة التحكم الإلكترونية (ECU) للسيارة؛ يفتح فقط أثناء تشغيل المحرك على الغاز، ويغلق ذاتياً بمجرد إطفاء الكونتاكت أو حدوث أي تصادم.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <span>حقائق علمية: لماذا الغاز الطبيعي أكثر أماناً من البنزين؟</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
                  <strong className="text-amber-400 block mb-1">أخف وزناً من الهواء (يطير لأعلى):</strong>
                  الغاز الطبيعي كثافته 0.65 مقارنة بالهواء، مما يعني أنه في حال حدوث أي تسريب يتطاير للأعلى في الغلاف الجوي فوراً ولا يتجمع تحت السيارة كبخار البنزين القابل للاشتعال.
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
                  <strong className="text-amber-400 block mb-1">درجة حرارة اشتعال ذاتي أعلى بكثير:</strong>
                  يشتعل الغاز الطبيعي عند 650° مئوية، بينما يشتعل البنزين عند 250° مئوية فقط، مما يجعله أكثر مقاومة للاشتعال بمقدار 2.6 ضعف البنزين.
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700">
                  <strong className="text-amber-400 block mb-1">مدى اشتعال ضيق (Flammability Range):</strong>
                  لا يشتعل الغاز إلا في نسبة محددة ودقيقة للغاية تتراوح بين 5% إلى 15% فقط مع الهواء؛ وإذا زادت أو قلت النسبة لا يشتعل مطلقاً.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: LICENSING & TRAFFIC DEPT */}
      {activeTab === 'licensing' && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>خطوات ومستندات الفحص الفني وإثبات الغاز برخصة السيارة بالمرور</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold flex items-center justify-center mb-2">1</span>
              <strong className="text-white text-sm block mb-1">التحويل بمركز معتمد</strong>
              <p className="text-slate-400 leading-relaxed">
                يتم تحويل السيارة في أحد مراكز كارجاس أو غازتك المعتمدة واستلام ملف الفحص وضمان طقم التحويل.
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold flex items-center justify-center mb-2">2</span>
              <strong className="text-white text-sm block mb-1">استخراج شهادة الفحص</strong>
              <p className="text-slate-400 leading-relaxed">
                إصدار شهادة فحص واختبار سريان الاسطوانة المعتمدة ومختومة تفيد بسلامة الدائرة وتركيب صمامات الأمان.
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold flex items-center justify-center mb-2">3</span>
              <strong className="text-white text-sm block mb-1">التوجه لوحدة المرور</strong>
              <p className="text-slate-400 leading-relaxed">
                تقديم الملف والشهادة إلى مهندس الفحص الفني بوحدة المرور التابع لها لترصيص السيارة وتدوين نوع الوقود.
              </p>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-700">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold flex items-center justify-center mb-2">4</span>
              <strong className="text-white text-sm block mb-1">طباعة الرخصة (بنزين / غاز)</strong>
              <p className="text-slate-400 leading-relaxed">
                تحديث رخصة السيارة الرسمية ليصبح نوع الوقود المعتمد: «بنزين / غاز طبيعي مضغوط»، وسداد الرسوم الرمزية.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CARGAS SERVICE CENTERS */}
      {activeTab === 'centers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cargasCenters.map((center, index) => (
              <div key={index} className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3 text-xs">
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-700 pb-2 mb-2">
                    <h4 className="font-bold text-white text-sm">{center.name}</h4>
                    <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                      <MapPin className="w-4 h-4" />
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs mb-2">{center.address}</p>

                  <div className="space-y-1 mb-3">
                    <span className="text-slate-400 text-[11px] block font-semibold">الخدمات المتوفرة:</span>
                    <div className="flex flex-wrap gap-1">
                      {center.services.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{center.hours}</span>
                  </span>
                  <span className="text-emerald-400 font-bold">{center.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
