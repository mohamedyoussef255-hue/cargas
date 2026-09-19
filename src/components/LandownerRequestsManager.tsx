import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Phone, 
  User, 
  Compass, 
  Search, 
  Filter,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  Building2
} from 'lucide-react';
import { LandownerInspectionRequest, CNGStation } from '../types';
import { CargasNgvLogo } from './CargasNgvLogo';

interface LandownerRequestsManagerProps {
  requests: LandownerInspectionRequest[];
  onUpdateRequest: (req: LandownerInspectionRequest) => void;
  onNewRequest: () => void;
  onOpenPrintModal: (req: LandownerInspectionRequest) => void;
  onConvertToStation: (station: CNGStation, reqId: string) => void;
  onShowOnMap?: (lat: number, lng: number) => void;
}

export const LandownerRequestsManager: React.FC<LandownerRequestsManagerProps> = ({
  requests,
  onUpdateRequest,
  onNewRequest,
  onOpenPrintModal,
  onConvertToStation,
  onShowOnMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LandownerInspectionRequest['status']>('all');
  const [governorateFilter, setGovernorateFilter] = useState<string>('all');

  // Filtered requests
  const filtered = requests.filter((r) => {
    const matchesSearch = 
      r.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.siteAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesGov = governorateFilter === 'all' || r.siteGovernorate === governorateFilter;

    return matchesSearch && matchesStatus && matchesGov;
  });

  const uniqueGovernorates = Array.from(new Set(requests.map((r) => r.siteGovernorate))).filter(Boolean);

  const getStatusBadge = (status: LandownerInspectionRequest['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>مقبول للمعاينة الميدانية</span>
          </span>
        );
      case 'survey_scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <Clock className="w-3.5 h-3.5" />
            <span>محدد موعد معاينة</span>
          </span>
        );
      case 'station_created':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Building2 className="w-3.5 h-3.5" />
            <span>مثبت كمحطة كارجاس بالخريطة</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>غير مطابق للشروط</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Clock className="w-3.5 h-3.5" />
            <span>قيد المراجعة الفنية</span>
          </span>
        );
    }
  };

  const handleConvert = (req: LandownerInspectionRequest) => {
    const station: CNGStation = {
      id: `station-from-${req.id}`,
      name: `كارجاس - ${req.siteDistrict || req.applicantName}`,
      company: 'كارجاس (Cargas)',
      governorate: req.siteGovernorate,
      city: req.siteDistrict,
      address: req.siteAddress,
      lat: req.coordinates.lat,
      lng: req.coordinates.lng,
      dispenserCount: 6,
      hasConversionCenter: true,
      facilityType: 'integrated',
      status: 'proposed',
      brand: 'cargas',
      cngCapacityM3h: 1500,
      totalAreaM2: req.totalAreaM2,
      boundaryNorth: req.boundaryNorth,
      boundarySouth: req.boundarySouth,
      boundaryEast: req.boundaryEast,
      boundaryWest: req.boundaryWest,
      landTenure: req.landTenure,
      gasGridAvailable: req.gasGridAvailable,
      siteRating: '+A',
      notes: `تم التثبيت من طلب المعاينة ${req.requestNumber}. مقدم الطلب: ${req.applicantName} (${req.phone})`,
    };

    onConvertToStation(station, req.id);
    onUpdateRequest({
      ...req,
      status: 'station_created',
      createdStationId: station.id,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white">
              طلبات المعاينة المقدمة من ملاك المواقع لإضافة محطات غاز كارجاس
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              {requests.length} طلب
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            استقبال طلبات ملاك الأراضي ومحطات الوقود القائمة الراغبين في التعاقد مع كارجاس، ومطابقة الشروط الفنية وإحداثيات الموقع، والطباعة الرسمية للنموذج المعتمد، وتثبيت الموقع واللوجو على الخريطة.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewRequest}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>تقديم طلب معاينة جديد</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالاسم، العنوان، الهاتف، أو رقم الطلب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
          >
            <option value="all">كافة الحالات ({requests.length})</option>
            <option value="pending">قيد المراجعة الفنية</option>
            <option value="approved">مقبول للمعاينة</option>
            <option value="survey_scheduled">محدد موعد معاينة</option>
            <option value="station_created">مثبت بالخريطة كمحطة</option>
            <option value="rejected">غير مطابق</option>
          </select>

          {/* Governorate Filter */}
          {uniqueGovernorates.length > 0 && (
            <select
              value={governorateFilter}
              onChange={(e) => setGovernorateFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
            >
              <option value="all">كافة المحافظات</option>
              {uniqueGovernorates.map((gov) => (
                <option key={gov} value={gov}>
                  محافظة {gov}
                </option>
              ))}
            </select>
          )}
        </div>

      </div>

      {/* Requests Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-bold text-sm">لا توجد طلبات معاينة تطابق معايير البحث.</p>
            <p className="text-slate-500 text-xs mt-1">اضغط على زر "تقديم طلب معاينة جديد" لإضافة طلب جديد.</p>
          </div>
        ) : (
          filtered.map((req) => (
            <div
              key={req.id}
              className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all shadow-md space-y-4"
            >
              
              {/* Card Top: Applicant Name & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white">{req.applicantName}</h3>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {req.requestNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>الرقم القومي: {req.nationalId || 'غير مسجل'}</span>
                      <span>•</span>
                      <span className="font-mono text-emerald-400 font-bold">{req.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {getStatusBadge(req.status)}
                  <span className="text-xs text-slate-500 font-mono">
                    {req.requestDate}
                  </span>
                </div>
              </div>

              {/* Card Middle: Site Details & Boundaries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Location Specs */}
                <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 font-bold block">موقع الأرض / المحطة:</span>
                      <span className="text-slate-200 font-medium">{req.siteAddress}</span>
                      <span className="text-slate-400 block mt-0.5">
                        {req.siteDistrict} - محافظة {req.siteGovernorate}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-300">
                    <span>المساحة: <strong>{req.totalAreaM2} م٢</strong> ({req.siteDimensions || 'أبعاد قياسية'})</span>
                    <span className="font-mono text-emerald-400 text-[11px]">
                      Lat: {req.coordinates.lat}, Lng: {req.coordinates.lng}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>الوضع: {req.currentSiteStatus === 'existing_fuel_station' ? 'محطة وقود قائمة' : 'أرض فضاء'}</span>
                    <span>•</span>
                    <span>الحيازة: {req.landTenure === 'ownership' ? 'ملك خالص' : req.landTenure}</span>
                    <span>•</span>
                    <span className={req.gasGridAvailable ? 'text-emerald-400' : 'text-amber-400'}>
                      {req.gasGridAvailable ? 'يوجد خط غاز' : 'لا يوجد خط غاز'}
                    </span>
                  </div>
                </div>

                {/* Boundaries Four Sides */}
                <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-400 font-bold block mb-1">حدود الموقع الأربعة:</span>
                  <p className="text-slate-300 line-clamp-1">
                    <strong className="text-blue-400">البحري (الواجهة): </strong>{req.boundaryNorth || 'غير محدد'}
                  </p>
                  <p className="text-slate-300 line-clamp-1">
                    <strong className="text-blue-400">القبلي (الخلفي): </strong>{req.boundarySouth || 'غير محدد'}
                  </p>
                  <p className="text-slate-300 line-clamp-1">
                    <strong className="text-blue-400">الشرقي: </strong>{req.boundaryEast || 'غير محدد'}
                  </p>
                  <p className="text-slate-300 line-clamp-1">
                    <strong className="text-blue-400">الغربي: </strong>{req.boundaryWest || 'غير محدد'}
                  </p>
                </div>

              </div>

              {/* Notes if any */}
              {req.notes && (
                <p className="text-xs text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-300">ملاحظات المعاينة: </strong>{req.notes}
                </p>
              )}

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                
                {/* Status Quick Changer */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">تحديث الحالة:</span>
                  <select
                    value={req.status}
                    onChange={(e) => onUpdateRequest({ ...req, status: e.target.value as any })}
                    className="bg-slate-800 border border-slate-700 text-xs text-white px-2.5 py-1 rounded-lg focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pending">قيد المراجعة</option>
                    <option value="survey_scheduled">محدد موعد معاينة</option>
                    <option value="approved">موافقة مبدئية</option>
                    <option value="station_created">مثبت كمحطة بالخريطة</option>
                    <option value="rejected">غير مطابق</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  {onShowOnMap && (
                    <button
                      type="button"
                      onClick={() => onShowOnMap(req.coordinates.lat, req.coordinates.lng)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>عرض على الخريطة</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenPrintModal(req)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة الخطاب الرسمي</span>
                  </button>

                  {req.status !== 'station_created' && (
                    <button
                      type="button"
                      onClick={() => handleConvert(req)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>تثبيت المحطة واللوجو بالخريطة</span>
                    </button>
                  )}
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
