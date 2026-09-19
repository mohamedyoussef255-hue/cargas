import React from 'react';
import { Printer, X, MapPin, Compass, Building2, Car, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CNGStation, MonitoringSession } from '../types';
import { BRANDS_INFO, BrandType } from './CompanyBrandBadges';

interface MapPrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStation: CNGStation | null;
  selectedSession: MonitoringSession | null;
  nearbyCompetitors: Array<{
    station: CNGStation;
    distanceKm: number;
  }>;
  mapTileMode: 'satellite' | 'streets';
}

export const MapPrintReportModal: React.FC<MapPrintReportModalProps> = ({
  isOpen,
  onClose,
  selectedStation,
  selectedSession,
  nearbyCompetitors,
  mapTileMode
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const stationName = selectedStation?.name || selectedSession?.title || 'موقع دراسة ميدانية لمحطة كارجاس NGV';
  const gov = selectedStation?.governorate || selectedSession?.governorate || 'الجيزة / القاهرة';
  const lat = selectedStation?.lat || selectedSession?.coordinates?.lat || 29.9880;
  const lng = selectedStation?.lng || selectedSession?.coordinates?.lng || 31.1350;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full text-slate-100 overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black print:max-w-none">
        
        {/* Top Modal Controls (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-base text-white">معاينة وطباعة تقرير الخريطة والموقع الجغرافي</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-trigger-print"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير (A4 / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div id="printable-map-document" className="p-8 space-y-6 print:p-6 print:space-y-4">
          
          {/* Header with Official Cargas NGV Logo and Title */}
          <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 shrink-0">
                <img src="/cargas_ngv_logo.svg" alt="كارجاس NGV" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-white print:text-black">
                    شركة الغاز الطبيعي للسيارات (كارجاس)
                  </h1>
                  <span className="text-amber-500 font-mono font-black text-lg">CARGAS NGV</span>
                </div>
                <p className="text-xs text-slate-400 print:text-gray-600 font-medium">
                  الإدارة العامة للتسويق والمشروعات • تقرير الحصر الميداني والموقع الجغرافي وخريطة المنافسين
                </p>
                <p className="text-[11px] text-emerald-400 print:text-emerald-700 font-bold mt-0.5">
                  نوع الخريطة: {mapTileMode === 'satellite' ? 'صور الأقمار الصناعية (Google Earth / Esri Satellite)' : 'خريطة شبكة الطرق والمحاور (Google Streets)'}
                </p>
              </div>
            </div>

            <div className="text-left text-xs font-mono text-slate-300 print:text-gray-700">
              <div><strong>تاريخ الإصدار:</strong> {currentDate}</div>
              <div><strong>وقت الطباعة:</strong> {currentTime}</div>
              <div><strong>رقم الملف:</strong> CRG-GEO-{Math.floor(lat * 100)}-{Math.floor(lng * 100)}</div>
            </div>
          </div>

          {/* Location Key Information Card */}
          <div className="bg-slate-800/60 print:bg-gray-50 border border-slate-700 print:border-gray-300 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 print:text-gray-500 block mb-1">اسم الموقع / المحطة المرصودة:</span>
              <strong className="text-sm text-white print:text-black font-bold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                {stationName}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 print:text-gray-500 block mb-1">المحافظة والمنطقة:</span>
              <strong className="text-sm text-white print:text-black font-bold">
                {gov} - {selectedStation?.city || 'نطاق تشغيلي'}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 print:text-gray-500 block mb-1">الإحداثيات الجغرافية (GPS):</span>
              <strong className="text-sm font-mono text-emerald-400 print:text-emerald-800 font-bold dir-ltr">
                {lat.toFixed(6)}° N, {lng.toFixed(6)}° E
              </strong>
            </div>
          </div>

          {/* Simulated Satellite Frame Banner for Print */}
          <div className="border border-slate-700 print:border-gray-400 rounded-xl overflow-hidden bg-slate-950 print:bg-gray-100 p-4 relative">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-300 print:text-gray-800 font-bold flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                معاينة النطاق الجغرافي للمحطة (نطاقات 1 كم، 3 كم، 5 كم)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 print:text-emerald-800 font-mono text-[11px] font-bold">
                إسقاط WGS 84 • Web Mercator
              </span>
            </div>

            <div className="h-44 sm:h-52 bg-slate-900 print:bg-gray-200 rounded-lg flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-700 print:border-gray-400">
              <div className="w-16 h-16 mb-2">
                <img src="/cargas_ngv_logo.svg" alt="كارجاس" className="w-full h-full object-contain filter drop-shadow" />
              </div>
              <p className="text-sm font-bold text-white print:text-black">{stationName}</p>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1 font-mono">
                Lat: {lat.toFixed(5)} | Lng: {lng.toFixed(5)} • نطاق تغطية حتى 5 كيلومتر
              </p>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-300 print:text-gray-700">
                <span className="flex items-center gap-1">🟢 دائرة 1 كم: كثافة الركاب المباشرة</span>
                <span className="flex items-center gap-1">🟡 دائرة 3 كم: نطاق الجذب التجاري للميكروباص والتاكسي</span>
                <span className="flex items-center gap-1">🔵 دائرة 5 كم: المحور الرئيسي والمنافسة</span>
              </div>
            </div>
          </div>

          {/* Competitors Proximity Matrix */}
          <div>
            <h3 className="font-bold text-sm text-white print:text-black mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>مصفوفة المحطات المنافسة القريبة (غازتك، ماستر جاس، تشيل أوت، وطنية، توتال)</span>
            </h3>
            
            <div className="border border-slate-800 print:border-gray-300 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-right">
                <thead className="bg-slate-800/80 print:bg-gray-200 text-slate-300 print:text-gray-800 font-bold border-b border-slate-700 print:border-gray-300">
                  <tr>
                    <th className="py-2.5 px-3">الشركة المالكة</th>
                    <th className="py-2.5 px-3">اسم المحطة</th>
                    <th className="py-2.5 px-3">المسافة الهوائية</th>
                    <th className="py-2.5 px-3">نقاط الشحن (Dispensers)</th>
                    <th className="py-2.5 px-3">مركز تحويل</th>
                    <th className="py-2.5 px-3">مستوى المنافسة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 print:divide-gray-200 font-medium">
                  {nearbyCompetitors.length > 0 ? (
                    nearbyCompetitors.map(({ station, distanceKm }, idx) => {
                      const brandKey = (station.brand || 'other') as BrandType;
                      const brand = BRANDS_INFO[brandKey] || BRANDS_INFO.other;
                      return (
                        <tr key={station.id || idx} className="hover:bg-slate-800/40 print:hover:bg-transparent">
                          <td className="py-2 px-3 font-bold text-white print:text-black flex items-center gap-1.5">
                            <span 
                              className="w-2.5 h-2.5 rounded-full inline-block shrink-0" 
                              style={{ backgroundColor: brand.primaryColor }}
                            />
                            {station.company}
                          </td>
                          <td className="py-2 px-3 text-slate-300 print:text-gray-700">{station.name}</td>
                          <td className="py-2 px-3 font-mono font-bold text-amber-400 print:text-amber-800">
                            {distanceKm.toFixed(2)} كم
                          </td>
                          <td className="py-2 px-3 font-mono">{station.dispenserCount} نقاط شحن</td>
                          <td className="py-2 px-3">
                            {station.hasConversionCenter ? (
                              <span className="text-emerald-400 print:text-emerald-800 font-bold">متوفر</span>
                            ) : (
                              <span className="text-slate-500">غير متوفر</span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              distanceKm < 2 
                                ? 'bg-rose-500/20 text-rose-300 print:text-rose-700 border border-rose-500/30' 
                                : distanceKm < 4 
                                ? 'bg-amber-500/20 text-amber-300 print:text-amber-700 border border-amber-500/30' 
                                : 'bg-blue-500/20 text-blue-300 print:text-blue-700 border border-blue-500/30'
                            }`}>
                              {distanceKm < 2 ? 'مباشرة (عالية)' : distanceKm < 4 ? 'متوسطة' : 'بعيدة'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-3 px-4 text-center text-slate-400 print:text-gray-600">
                        لا توجد محطات منافسة مسجلة في النطاق المحيط المباشر (أولوية انتشار عالية لكارجاس)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traffic Fleet Summary if Session Selected */}
          {selectedSession && (
            <div className="bg-slate-800/40 print:bg-gray-50 border border-slate-700 print:border-gray-300 rounded-xl p-4">
              <h4 className="font-bold text-xs text-white print:text-black mb-2 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-blue-400" />
                حصر وتصنيف أسطول المركبات المارة أمام الكاميرا
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
                {Object.entries(selectedSession.counts).slice(0, 8).map(([key, count]) => (
                  <div key={key} className="bg-slate-900/60 print:bg-white p-2 rounded-lg border border-slate-800 print:border-gray-300">
                    <span className="text-[10px] text-slate-400 print:text-gray-600 block truncate">{key}</span>
                    <strong className="font-mono font-bold text-emerald-400 print:text-emerald-800 text-sm">{count}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signatures & Official Approvals Block */}
          <div className="pt-6 border-t border-slate-800 print:border-gray-400 grid grid-cols-3 gap-4 text-center text-xs text-slate-400 print:text-gray-700">
            <div>
              <p className="font-bold text-white print:text-black mb-8">مهندس المعاينة والرصد الميداني</p>
              <div className="border-b border-dotted border-slate-600 print:border-gray-400 w-32 mx-auto"></div>
              <p className="mt-1 text-[10px]">التوقيع: .....................</p>
            </div>

            <div>
              <p className="font-bold text-white print:text-black mb-8">مدير إدارة التسويق</p>
              <div className="border-b border-dotted border-slate-600 print:border-gray-400 w-32 mx-auto"></div>
              <p className="mt-1 text-[10px]">التوقيع: .....................</p>
            </div>

            <div>
              <p className="font-bold text-white print:text-black mb-8">مدير عام المشروعات والشئون الفنية</p>
              <div className="border-b border-dotted border-slate-600 print:border-gray-400 w-32 mx-auto"></div>
              <p className="mt-1 text-[10px]">التوقيع: .....................</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
