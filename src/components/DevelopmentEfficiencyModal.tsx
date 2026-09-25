import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  ShoppingBag, 
  Coffee, 
  Wrench, 
  Clock, 
  ShieldCheck, 
  X, 
  Award, 
  Gift, 
  BatteryCharging, 
  BarChart3,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface DevelopmentEfficiencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevelopmentEfficiencyModal: React.FC<DevelopmentEfficiencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden text-right text-white animate-fadeIn">
        
        {/* Banner with Glowing Gradient */}
        <div className="relative bg-gradient-to-r from-amber-600 via-rose-600 to-emerald-600 p-6 sm:p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-black/40 text-amber-300 font-black text-xs border border-amber-400/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>قطاع استراتيجي جديد (ستُفعّل قريباً)</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-amber-300" />
            <span>الإدارة العامة لتطوير المحطات ورفع الكفاءة</span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-xl leading-relaxed">
            الذراع الاستثماري المستقبلي لشركة كارجاس لتعظيم مبيعات الغاز الطبيعي، وتطوير الخدمات التجارية المتكاملة، وتعويض فواقد أعمال الصيانة ببرامج جذب العملاء.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-slate-200">
          
          {/* Main Mission Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 space-y-2">
            <h3 className="font-bold text-sm text-amber-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>الرؤية والهدف الاستراتيجي للإدارة</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ستتولى الإدارة بعد إطلاقها مسئولية زيادة مبيعات الشركة ورفع معدلات التموين اليومية والشهرية بالمحطات، وضمان استمرارية التشغيل بكفاءة قصوى عبر حزمة من المبادرات التنافسية المتقدمة.
            </p>
          </div>

          {/* Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pillar 1: Loyalty & Promotion */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Gift className="w-4 h-4" />
                </div>
                <span>برامج جذب وولاء العملاء والحملات الترويجية</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>نقاط مكافآت التموين بالغاز الطبيعي لأسطول التاكسي والنقل والملاكي.</li>
                <li>حملات تسويقية وترويجية موسعة في مواقف السيارات والمناطق الصناعية.</li>
                <li>تسهيلات التحويل والتقسيط الميسر بالتنسيق مع البنوك والجهات التمويلية.</li>
              </ul>
            </div>

            {/* Pillar 2: EV Charging Stations */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                  <BatteryCharging className="w-4 h-4" />
                </div>
                <span>منظومة شحن السيارات بالكهرباء (EV Charging)</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>إدراج شواحن السيارات الكهربائية السريعة (DC Fast Chargers) داخل محطات كارجاس.</li>
                <li>تحويل المحطة إلى مجمع طاقة متكامل ونظيف (غاز طبيعي + شحن كهربائي).</li>
                <li>استثمار أوقات انتظار الشحن في زيادة الإقبال على الخدمات التجارية.</li>
              </ul>
            </div>

            {/* Pillar 3: Commercial Services */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span>الأنشطة التجارية والخدمية (تعويض فواقد الصيانة)</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>إقامة منافذ سوبر ماركت حديث وكافيهات ومصليات مكيفة داخل المحطة.</li>
                <li>مراكز خدمة سريعة لتغيير الزيوت وغسيل السيارات ومراجعة ضغط الإطارات.</li>
                <li>تعويض الفاقد في مبيعات الغاز الناتج عن توقفات الصيانة عبر عوائد إيجارات الأنشطة.</li>
              </ul>
            </div>

            {/* Pillar 4: Predictive Maintenance */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <span>التحسب للأعطال والتوصية بالصيانة الاستباقية</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>رصد ساعات تشغيل الضواغط والمعدات والتنبؤ المبكر باقتراب العمر الافتراضي.</li>
                <li>جدولة الصيانة الدورية في الساعات ذات الكثافة المرورية المنخفضة لتفادي ضياع المبيعات.</li>
                <li>توفير قطع الغيار الحرجة والموزعات الاحتياطية لتقليص فترات التوقف إلى الصفر.</li>
              </ul>
            </div>

          </div>

          {/* Under Development Notice */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <span>يجري حالياً إعداد الهيكل التنظيمي والسياسات الاستثمارية لتفعيل الإدارة في التحديث القادم للمنظومة.</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shrink-0 cursor-pointer"
            >
              فهمت ذلك
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
