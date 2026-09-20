import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Sun, 
  Moon, 
  BookOpen, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Award,
  LogOut,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { AutomatedReportSnapshot } from '../types';

interface ReportReaderModeModalProps {
  title: string;
  subtitle?: string;
  reportData?: AutomatedReportSnapshot | any;
  customContent?: React.ReactNode;
  onClose: () => void;
}

type ReaderTheme = 'sepia' | 'dark' | 'light';

export const ReportReaderModeModal: React.FC<ReportReaderModeModalProps> = ({
  title,
  subtitle,
  reportData,
  customContent,
  onClose
}) => {
  const [theme, setTheme] = useState<ReaderTheme>('sepia');
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(1); // 0: small, 1: medium, 2: large, 3: xl
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const summary = reportData?.executiveSummary || title;
    const text = `*تقرير رسمي معتمد - وضع القراءة للقيادات - شركة كارجاس NGV*
📌 العنوان: ${title}
${subtitle ? `📍 ${subtitle}\n` : ''}
📄 ملخص التقرير:
${summary}

يمكن قراءة التقرير وطباعته بجودة عالية عبر منظومة منهاج الرقمية.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const themeClasses = {
    sepia: {
      bg: 'bg-[#fbf0d9]',
      text: 'text-[#433422]',
      cardBg: 'bg-[#f4e4c1] border-[#e2cca4]',
      heading: 'text-[#2b1f13]',
      mutedText: 'text-[#70583b]',
      highlightBg: 'bg-[#ebd4ab]',
      border: 'border-[#dfc69c]'
    },
    dark: {
      bg: 'bg-slate-950',
      text: 'text-slate-200',
      cardBg: 'bg-slate-900 border-slate-800',
      heading: 'text-white',
      mutedText: 'text-slate-400',
      highlightBg: 'bg-slate-800/80',
      border: 'border-slate-800'
    },
    light: {
      bg: 'bg-white',
      text: 'text-slate-800',
      cardBg: 'bg-slate-50 border-slate-200',
      heading: 'text-slate-950',
      mutedText: 'text-slate-600',
      highlightBg: 'bg-slate-100',
      border: 'border-slate-200'
    }
  }[theme];

  const fontSizeClass = [
    'text-xs leading-relaxed',
    'text-sm leading-relaxed',
    'text-base leading-loose',
    'text-lg leading-loose'
  ][fontSizeLevel];

  const headingSizeClass = [
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl'
  ][fontSizeLevel];

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${themeClasses.bg} transition-colors duration-200`}>
      {/* Top Floating Reader Toolbar */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-opacity-90 border-b px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
              وضع القراءة التنفيذي (Distraction-Free Reader Mode)
            </span>
            <h1 className={`text-sm sm:text-base font-black ${themeClasses.heading} line-clamp-1`}>
              {title}
            </h1>
          </div>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Theme Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/10 dark:bg-white/10">
            <button
              onClick={() => setTheme('sepia')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'sepia' ? 'bg-[#ebd4ab] text-[#433422] shadow' : 'opacity-70 hover:opacity-100'
              }`}
              title="نمط الورق الصحفي الفاخر (Sepia)"
            >
              ورق فاخر
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'light' ? 'bg-white text-slate-900 shadow' : 'opacity-70 hover:opacity-100'
              }`}
              title="النمط النهاري الأبيض (Light)"
            >
              نهاري
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-slate-900 text-white shadow' : 'opacity-70 hover:opacity-100'
              }`}
              title="النمط الليلي المريح (Dark)"
            >
              ليلي
            </button>
          </div>

          {/* Font Resizing */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/10 dark:bg-white/10">
            <button
              onClick={() => setFontSizeLevel(Math.max(0, fontSizeLevel - 1))}
              disabled={fontSizeLevel === 0}
              className="p-1.5 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-30"
              title="تصغير الخط"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono font-bold px-1">A</span>
            <button
              onClick={() => setFontSizeLevel(Math.min(3, fontSizeLevel + 1))}
              disabled={fontSizeLevel === 3}
              className="p-1.5 rounded-lg text-xs font-bold cursor-pointer disabled:opacity-30"
              title="تكبير الخط"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Share & Print */}
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow"
            title="إرسال عبر الواتساب"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">واتساب</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer shadow"
            title="طباعة أو تصدير PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">طباعة / PDF</span>
          </button>

          {/* Back / Exit with Arrow */}
          <button
            id="btn-reader-back"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer shadow"
            title="تراجع والعودة إلى الشاشة السابقة"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>تراجع / عودة</span>
          </button>

          {/* Close X */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-black/20 transition-colors cursor-pointer"
            title="إغلاق التقرير"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Document Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* Document Header */}
        <div className={`p-6 sm:p-8 rounded-3xl ${themeClasses.cardBg} border shadow-lg space-y-3 text-center`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>وثيقة رسمية معتمدة - شركة كارجاس للغاز الطبيعي</span>
          </div>

          <h2 className={`${headingSizeClass} font-black ${themeClasses.heading}`}>
            {title}
          </h2>

          {subtitle && (
            <p className={`text-xs sm:text-sm font-semibold ${themeClasses.mutedText}`}>
              {subtitle}
            </p>
          )}

          <div className="pt-2 text-[11px] font-mono opacity-70">
            تاريخ التوليد: {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Custom content or Default Snapshot Content */}
        {customContent ? (
          <div className={`${fontSizeClass} ${themeClasses.text} space-y-6`}>
            {customContent}
          </div>
        ) : reportData ? (
          <div className="space-y-6">
            {/* Executive Summary Card */}
            {reportData.executiveSummary && (
              <section className={`p-6 sm:p-8 rounded-3xl ${themeClasses.cardBg} border shadow-md space-y-3`}>
                <h3 className="text-base font-bold flex items-center gap-2 text-amber-500">
                  <Award className="w-5 h-5" />
                  <span>الملخص التنفيذي المعتمد:</span>
                </h3>
                <p className={`${fontSizeClass} ${themeClasses.text}`}>
                  {reportData.executiveSummary}
                </p>
              </section>
            )}

            {/* Metrics Snapshot Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-4 rounded-2xl ${themeClasses.cardBg} border text-center`}>
                <span className={`text-[11px] block ${themeClasses.mutedText}`}>المواقع المفحوصة</span>
                <span className={`text-2xl font-black font-mono ${themeClasses.heading}`}>
                  {reportData.totalSitesSurveyed || 0}
                </span>
              </div>
              <div className={`p-4 rounded-2xl ${themeClasses.cardBg} border text-center`}>
                <span className={`text-[11px] block ${themeClasses.mutedText}`}>المهام المنجزة</span>
                <span className={`text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400`}>
                  {reportData.completedTasksCount || 0}
                </span>
              </div>
              <div className={`p-4 rounded-2xl ${themeClasses.cardBg} border text-center`}>
                <span className={`text-[11px] block ${themeClasses.mutedText}`}>المهام الجارية</span>
                <span className={`text-2xl font-black font-mono text-blue-600 dark:text-blue-400`}>
                  {reportData.pendingTasksCount || 0}
                </span>
              </div>
              <div className={`p-4 rounded-2xl ${themeClasses.cardBg} border text-center`}>
                <span className={`text-[11px] block ${themeClasses.mutedText}`}>التقييم الكلي</span>
                <span className={`text-2xl font-black font-mono text-amber-600 dark:text-amber-400`}>
                  {reportData.kpiOverallScore || 90}%
                </span>
              </div>
            </div>

            {/* Operational Highlights */}
            {reportData.operationalHighlights && reportData.operationalHighlights.length > 0 && (
              <section className={`p-6 sm:p-8 rounded-3xl ${themeClasses.cardBg} border shadow-md space-y-4`}>
                <h3 className="text-base font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>الإنجازات الميدانية والتشغيلية البارزة:</span>
                </h3>
                <ul className={`space-y-3 ${fontSizeClass} ${themeClasses.text}`}>
                  {reportData.operationalHighlights.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Critical Alerts Addressed */}
            {reportData.criticalAlertsAddressed && reportData.criticalAlertsAddressed.length > 0 && (
              <section className={`p-6 sm:p-8 rounded-3xl ${themeClasses.cardBg} border shadow-md space-y-4`}>
                <h3 className="text-base font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-5 h-5" />
                  <span>المعايير والتنبيهات الفنية المستوفاة:</span>
                </h3>
                <ul className={`space-y-3 ${fontSizeClass} ${themeClasses.text}`}>
                  {reportData.criticalAlertsAddressed.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Planned Next Period */}
            {reportData.plannedNextPeriod && reportData.plannedNextPeriod.length > 0 && (
              <section className={`p-6 sm:p-8 rounded-3xl ${themeClasses.cardBg} border shadow-md space-y-4`}>
                <h3 className="text-base font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <FileText className="w-5 h-5" />
                  <span>تكليفات وخطة الفترة القادمة:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {reportData.plannedNextPeriod.map((item: string, idx: number) => (
                    <div key={idx} className={`p-4 rounded-2xl ${themeClasses.highlightBg} border ${themeClasses.border} space-y-1`}>
                      <span className="text-xs font-bold font-mono opacity-70">خطوة 0{idx + 1}</span>
                      <p className={`text-xs ${themeClasses.text}`}>{item}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : null}

        {/* Bottom Quick Action Bar (Print / WhatsApp / Back) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition-all cursor-pointer shadow"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>تراجع والعودة للقائمة</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              <Share2 className="w-4 h-4" />
              <span>إرسال التقرير بالواتساب</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-blue-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المستند (A4 / PDF)</span>
            </button>
          </div>
        </div>

        {/* Footer Seal */}
        <footer className={`p-6 rounded-2xl ${themeClasses.cardBg} border text-center space-y-2`}>
          <p className="text-xs font-bold">
            تم اعتماد هذا التقرير رسمياً عبر منظومة منهاج للتحول الرقمي - شركة كارجاس
          </p>
          <p className={`text-[11px] ${themeClasses.mutedText}`}>
            جمهورية مصر العربية - وزارة البترول والثروة المعدنية
          </p>
        </footer>
      </main>
    </div>
  );
};
