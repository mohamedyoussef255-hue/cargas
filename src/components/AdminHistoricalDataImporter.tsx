import React, { useState, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  UploadCloud,
  Image as ImageIcon,
  MapPin,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCw,
  FileText,
  Clock,
  Compass,
  Check,
  X,
  Layers,
  ArrowUpDown,
  Sparkles,
  ExternalLink,
  Flame,
  ShieldCheck,
  Wrench,
  DollarSign
} from 'lucide-react';
import { 
  MonitoringSession, 
  VehicleType, 
  VEHICLE_CONFIGS, 
  CompanyStationCensusItem, 
  HistoricalPhotoItem,
  createDefaultVehicleCounts
} from '../types';
import { INITIAL_COMPANY_STATIONS_CENSUS, INITIAL_HISTORICAL_PHOTOS } from '../data/companyStationsCensus';

interface AdminHistoricalDataImporterProps {
  sessions: MonitoringSession[];
  onImportSessions: (newSessions: MonitoringSession[]) => void;
  censusStations?: CompanyStationCensusItem[];
  onUpdateCensusStations?: (stations: CompanyStationCensusItem[]) => void;
}

export const AdminHistoricalDataImporter: React.FC<AdminHistoricalDataImporterProps> = ({
  sessions,
  onImportSessions,
  censusStations: propCensusStations,
  onUpdateCensusStations
}) => {
  // Active Sub-Tab within Historical Data Importer
  const [activeSubTab, setActiveSubTab] = useState<'excel_import' | 'photos' | 'gps_batch' | 'company_census'>('excel_import');

  // Local storage state for company stations census
  const [censusStations, setCensusStations] = useState<CompanyStationCensusItem[]>(() => {
    if (propCensusStations && propCensusStations.length > 0) return propCensusStations;
    const saved = localStorage.getItem('cargas_company_stations_census');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved census', e);
      }
    }
    return INITIAL_COMPANY_STATIONS_CENSUS;
  });

  // Local storage state for historical photos
  const [historicalPhotos, setHistoricalPhotos] = useState<HistoricalPhotoItem[]>(() => {
    const saved = localStorage.getItem('cargas_historical_photos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved historical photos', e);
      }
    }
    return INITIAL_HISTORICAL_PHOTOS;
  });

  // Save census stations changes
  const updateCensusStations = (newStations: CompanyStationCensusItem[]) => {
    setCensusStations(newStations);
    localStorage.setItem('cargas_company_stations_census', JSON.stringify(newStations));
    if (onUpdateCensusStations) onUpdateCensusStations(newStations);
  };

  // Save photos changes
  const updateHistoricalPhotos = (newPhotos: HistoricalPhotoItem[]) => {
    setHistoricalPhotos(newPhotos);
    localStorage.setItem('cargas_historical_photos', JSON.stringify(newPhotos));
  };

  // --------------------------------------------------------------------------
  // TAB 1: EXCEL / CSV IMPORTER STATE & HANDLERS
  // --------------------------------------------------------------------------
  const [excelImportType, setExcelImportType] = useState<'sessions' | 'census'>('sessions');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [importedFileName, setImportedFileName] = useState<string>('');
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [importNotification, setImportNotification] = useState<string | null>(null);
  const excelFileInputRef = useRef<HTMLInputElement>(null);

  // Download Sample Excel Template
  const handleDownloadSampleTemplate = (type: 'sessions' | 'census') => {
    if (type === 'sessions') {
      const sampleData = [
        {
          'كود_الموقع': 'CRG-SURV-101',
          'اسم_الموقع_أو_المحور': 'ميدان المطرية ومحور مسطرد',
          'المحافظة': 'القاهرة',
          'المدينة_الحي': 'المطرية',
          'خط_العرض_Lat': 30.1248,
          'خط_الطول_Lng': 31.3125,
          'ميكروباص': 420,
          'تاكسي': 180,
          'سوزوكي_فان': 140,
          'بيجو_ستيشن': 65,
          'ملاكي': 310,
          'اسم_المعاين': 'م. كريم سامي',
          'تاريخ_المعاينة': '2024-04-12',
          'أقرب_محطة': 'محطة كارجاس ألماظة (4.5 كم)',
          'ملاحظات': 'تدفق ميكروباصات مكثف جداً باتجاه مسطرد وشبرا الخيمة'
        },
        {
          'كود_الموقع': 'CRG-SURV-102',
          'اسم_الموقع_أو_المحور': 'محور 26 يوليو تقاطع المنصورية',
          'المحافظة': 'الجيزة',
          'المدينة_الحي': 'كرداسة',
          'خط_العرض_Lat': 30.0245,
          'خط_الطول_Lng': 31.1120,
          'ميكروباص': 380,
          'تاكسي': 95,
          'سوزوكي_فان': 210,
          'بيجو_ستيشن': 40,
          'ملاكي': 450,
          'اسم_المعاين': 'م. أحمد شكري',
          'تاريخ_المعاينة': '2024-05-18',
          'أقرب_محطة': 'محطة كارجاس الرماية (6 كم)',
          'ملاحظات': 'موقع واعد على مدخل الشيخ زايد والواحات'
        }
      ];
      const ws = XLSX.utils.json_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'جلسات_الرصد_التاريخية');
      XLSX.writeFile(wb, 'نموذج_استيراد_جلسات_رصد_كارجاس.xlsx');
    } else {
      const sampleData = [
        {
          'كود_المحطة': 'CRG-PORT-21',
          'اسم_المحطة': 'محطة كارجاس - بورسعيد الكورنيش',
          'المحافظة': 'بورسعيد',
          'المدينة_الحي': 'حي الشرق',
          'العنوان_التفصيلي': 'طريق شاطئ بورسعيد بجوار الغرفة التجارية',
          'خط_العرض_Lat': 31.2653,
          'خط_الطول_Lng': 32.3019,
          'الحالة_التشغيلية': 'operational', // operational, under_construction, licensed_pending, proposed
          'عدد_الموزعات': 8,
          'سعة_الضاغط_م3_س': 1500,
          'سنة_التشغيل': 2021,
          'يوجد_مركز_تحويل': 'نعم',
          'المبيعات_السنوية_م3': 3400000,
          'قيمة_الاستثمار_مليون_جم': 21.5,
          'الجهة_المنفذة_أو_الشريك': 'غاز مصر / كارجاس',
          'ملاحظات': 'تخدم مركبات الأجرة وسيارات النقل الداخلي ببورسعيد'
        },
        {
          'كود_المحطة': 'CRG-TAN-22',
          'اسم_المحطة': 'محطة كارجاس - طنطا الاستاد',
          'المحافظة': 'الغربية',
          'المدينة_الحي': 'طنطا',
          'العنوان_التفصيلي': 'شارع البحر أمام مجمع استاد طنطا الرياضي',
          'خط_العرض_Lat': 30.7865,
          'خط_الطول_Lng': 31.0004,
          'الحالة_التشغيلية': 'under_construction',
          'عدد_الموزعات': 10,
          'سعة_الضاغط_م3_س': 1800,
          'سنة_التشغيل': 2026,
          'يوجد_مركز_تحويل': 'نعم',
          'المبيعات_السنوية_م3': 4100000,
          'قيمة_الاستثمار_مليون_جم': 26.0,
          'الجهة_المنفذة_أو_الشريك': 'بتروجت',
          'ملاحظات': 'الأعمال الإنشائية جارية وتوريد الضاغط متوقع الشهر القادم'
        }
      ];
      const ws = XLSX.utils.json_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'حصر_محطات_الشركة');
      XLSX.writeFile(wb, 'نموذج_استيراد_حصر_محطات_كارجاس.xlsx');
    }
  };

  // Read and parse uploaded Excel or CSV file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingExcel(true);
    setImportedFileName(file.name);
    setImportNotification(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Parse as JSON array of objects
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
        if (rawJson.length === 0) {
          alert('الملف فارغ أو لا يحتوي على صفوف بيانات صالحة.');
          setIsProcessingExcel(false);
          return;
        }

        const headers = Object.keys(rawJson[0]);
        setParsedHeaders(headers);
        setParsedRows(rawJson);
        setIsProcessingExcel(false);
      } catch (error) {
        console.error('Error parsing excel file', error);
        alert('حدث خطأ أثناء قراءة ملف الإكسيل. يرجى التأكد من أن الملف سليم وبصيغة .xlsx أو .xls أو .csv');
        setIsProcessingExcel(false);
      }
    };
    reader.onerror = () => {
      alert('تعذر قراءة الملف.');
      setIsProcessingExcel(false);
    };
    reader.readAsArrayBuffer(file);
  };

  // Confirm Import into Platform
  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;

    if (excelImportType === 'sessions') {
      // Map parsed rows to MonitoringSession[]
      const newSessions: MonitoringSession[] = parsedRows.map((row, idx) => {
        // Find matching keys with flexibility for Arabic/English headers
        const getVal = (...keys: string[]) => {
          for (const k of keys) {
            if (row[k] !== undefined && row[k] !== '') return row[k];
            // case-insensitive check
            const foundKey = Object.keys(row).find(rk => rk.toLowerCase().includes(k.toLowerCase()) || k.includes(rk));
            if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') return row[foundKey];
          }
          return '';
        };

        const code = String(getVal('كود_الموقع', 'كود', 'code', 'الكود') || `HIST-SURV-${Date.now()}-${idx + 1}`);
        const locationName = String(getVal('اسم_الموقع_أو_المحور', 'اسم_الموقع', 'الموقع', 'location', 'name') || `موقع رصد تاريخي ${idx + 1}`);
        const governorate = String(getVal('المحافظة', 'governorate') || 'القاهرة');
        const city = String(getVal('المدينة_الحي', 'المدينة', 'الحي', 'city') || 'القاهرة');
        const lat = Number(getVal('خط_العرض_Lat', 'خط_العرض', 'lat', 'latitude')) || 30.0444;
        const lng = Number(getVal('خط_الطول_Lng', 'خط_الطول', 'lng', 'longitude')) || 31.2357;
        const surveyorName = String(getVal('اسم_المعاين', 'المعاين', 'surveyor') || 'أرشيف بيانات كارجاس التاريخية');
        const nearestStation = String(getVal('أقرب_محطة', 'nearest', 'nearestStation') || 'محطة كارجاس المركزية');
        const notes = String(getVal('ملاحظات', 'notes', 'بيان') || 'تم استيراد هذا السجل من قاعدة البيانات التاريخية لشركة كارجاس عبر ملف إكسيل');

        const microbus = Number(getVal('ميكروباص', 'microbus')) || 0;
        const taxi = Number(getVal('تاكسي', 'taxi')) || 0;
        const van = Number(getVal('سوزوكي_فان', 'فان', 'suzuki_van', 'van')) || 0;
        const peugeot = Number(getVal('بيجو_ستيشن', 'بيجو', 'peugeot_station', 'peugeot')) || 0;
        const privateCar = Number(getVal('ملاكي', 'private', 'privateCar')) || 0;

        const total = microbus + taxi + van + peugeot + privateCar;

        return {
          id: `session-imported-${Date.now()}-${idx}`,
          code,
          title: `معاينة: ${locationName}`,
          locationName,
          governorate,
          city,
          coordinates: { lat, lng },
          nearestStation,
          trafficDirection: 'اتجاهين متعددي المسارات',
          surveyorName,
          status: 'completed',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          durationSeconds: 3600,
          counts: createDefaultVehicleCounts({
            microbus: microbus || 150,
            taxi: taxi || 80,
            van: van || 60,
            peugeot_station: peugeot || 25,
            private: privateCar || 200,
            suzuki_van: van || 60
          }),
          detections: [],
          notes,
          autoGpsCaptured: true,
          gpsAccuracyMeters: 5
        };
      });

      onImportSessions(newSessions);
      setImportNotification(`تم بنجاح استيراد ${newSessions.length} جلسة وموقع رصد تاريخي إلى قاعدة بيانات المنظومة!`);
    } else {
      // Map parsed rows to CompanyStationCensusItem[]
      const newCensusItems: CompanyStationCensusItem[] = parsedRows.map((row, idx) => {
        const getVal = (...keys: string[]) => {
          for (const k of keys) {
            if (row[k] !== undefined && row[k] !== '') return row[k];
            const foundKey = Object.keys(row).find(rk => rk.toLowerCase().includes(k.toLowerCase()) || k.includes(rk));
            if (foundKey && row[foundKey] !== undefined && row[foundKey] !== '') return row[foundKey];
          }
          return '';
        };

        const code = String(getVal('كود_المحطة', 'كود', 'code') || `CRG-IMP-${Date.now()}-${idx + 1}`);
        const name = String(getVal('اسم_المحطة', 'المحطة', 'name') || `محطة كارجاس ${idx + 1}`);
        const governorate = String(getVal('المحافظة', 'governorate') || 'القاهرة');
        const city = String(getVal('المدينة_الحي', 'المدينة', 'city') || 'القاهرة');
        const address = String(getVal('العنوان_التفصيلي', 'العنوان', 'address') || 'العنوان المسجل بأرشيف كارجاس');
        const lat = Number(getVal('خط_العرض_Lat', 'lat')) || 30.0444;
        const lng = Number(getVal('خط_الطول_Lng', 'lng')) || 31.2357;
        const rawStatus = String(getVal('الحالة_التشغيلية', 'حالة_المحطة', 'status') || 'operational').toLowerCase();
        
        let status: CompanyStationCensusItem['status'] = 'operational';
        if (rawStatus.includes('إنشاء') || rawStatus.includes('construction')) status = 'under_construction';
        else if (rawStatus.includes('ترخيص') || rawStatus.includes('license')) status = 'licensed_pending';
        else if (rawStatus.includes('مقترح') || rawStatus.includes('proposed')) status = 'proposed';

        const dispenserCount = Number(getVal('عدد_الموزعات', 'الموزعات', 'dispensers')) || 8;
        const compressorCapacityM3h = Number(getVal('سعة_الضاغط_م3_س', 'الضاغط', 'compressor')) || 1500;
        const commissioningYear = Number(getVal('سنة_التشغيل', 'السنة', 'year')) || 2022;
        const hasConversionCenter = String(getVal('يوجد_مركز_تحويل', 'مركز_تحويل', 'conversion')).includes('نعم') || String(getVal('conversion')).toLowerCase() === 'true';
        const annualVolumeM3 = Number(getVal('المبيعات_السنوية_م3', 'volume')) || 3200000;
        const investmentValueMillionEgp = Number(getVal('قيمة_الاستثمار_مليون_جم', 'استثمار', 'investment')) || 20;
        const contractorOrPartner = String(getVal('الجهة_المنفذة_أو_الشريك', 'المقاول', 'شريك', 'partner') || 'كارجاس');
        const notes = String(getVal('ملاحظات', 'notes') || 'مستوردة عبر شيت إكسيل');

        return {
          id: `cargas-st-imported-${Date.now()}-${idx}`,
          code,
          name,
          governorate,
          city,
          address,
          lat,
          lng,
          status,
          dispenserCount,
          compressorCapacityM3h,
          commissioningYear,
          hasConversionCenter,
          annualVolumeM3,
          investmentValueMillionEgp,
          contractorOrPartner,
          notes
        };
      });

      const updated = [...newCensusItems, ...censusStations];
      updateCensusStations(updated);
      setImportNotification(`تم بنجاح إضافة ${newCensusItems.length} محطة تاريخية جديدة إلى حصر أعمال ومحطات الشركة!`);
    }

    setParsedRows([]);
    setParsedHeaders([]);
    setImportedFileName('');
    if (excelFileInputRef.current) excelFileInputRef.current.value = '';
  };

  // --------------------------------------------------------------------------
  // TAB 2: HISTORICAL PHOTOS UPLOADER & GALLERY
  // --------------------------------------------------------------------------
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoLocation, setPhotoLocation] = useState('');
  const [photoGovernorate, setPhotoGovernorate] = useState('القاهرة');
  const [photoCategory, setPhotoCategory] = useState<HistoricalPhotoItem['category']>('site_survey');
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [photoDescription, setPhotoDescription] = useState('');
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
  const [activePhotoModal, setActivePhotoModal] = useState<HistoricalPhotoItem | null>(null);
  const [photoSearchFilter, setPhotoSearchFilter] = useState('');
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState<string>('all');
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setSelectedPhotoPreview(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddHistoricalPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhotoPreview || !photoTitle.trim()) {
      alert('يرجى اختيار صورة وكتابة عنوان توثيقي.');
      return;
    }

    const newPhoto: HistoricalPhotoItem = {
      id: `photo-${Date.now()}`,
      title: photoTitle.trim(),
      locationOrStationName: photoLocation.trim() || 'محطة / موقع كارجاس',
      governorate: photoGovernorate,
      category: photoCategory,
      date: photoDate,
      url: selectedPhotoPreview,
      description: photoDescription.trim() || 'صورة توثيقية محفوظة بالأرشيف الرقمي',
      uploadedAt: new Date().toISOString(),
      fileSizeKb: Math.round(selectedPhotoPreview.length / 1024)
    };

    updateHistoricalPhotos([newPhoto, ...historicalPhotos]);
    setPhotoTitle('');
    setPhotoLocation('');
    setPhotoDescription('');
    setSelectedPhotoPreview(null);
    if (photoFileInputRef.current) photoFileInputRef.current.value = '';
    alert('تم حفظ وتوثيق الصورة بنجاح في أرشيف كارجاس التاريخي!');
  };

  const handleDeletePhoto = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الصورة من الأرشيف التاريخي؟')) {
      const updated = historicalPhotos.filter(p => p.id !== id);
      updateHistoricalPhotos(updated);
      if (activePhotoModal?.id === id) setActivePhotoModal(null);
    }
  };

  const filteredPhotos = useMemo(() => {
    return historicalPhotos.filter(p => {
      const matchSearch = photoSearchFilter === '' || 
        p.title.toLowerCase().includes(photoSearchFilter.toLowerCase()) ||
        p.locationOrStationName.toLowerCase().includes(photoSearchFilter.toLowerCase()) ||
        p.governorate.toLowerCase().includes(photoSearchFilter.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(photoSearchFilter.toLowerCase()));
      
      const matchCategory = photoCategoryFilter === 'all' || p.category === photoCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [historicalPhotos, photoSearchFilter, photoCategoryFilter]);

  // --------------------------------------------------------------------------
  // TAB 3: BATCH GPS COORDINATES FEEDER
  // --------------------------------------------------------------------------
  const [gpsInputText, setGpsInputText] = useState(
    `30.0444, 31.2357, محطة كارجاس ميدان رمسيس, القاهرة
30.1245, 31.2580, محور مسطرد تقاطع الدائري, القليوبية
29.9880, 31.1350, كارجاس الهرم ومشعل, الجيزة
31.2001, 29.9187, محطة كارجاس سيدي جابر, الإسكندرية
29.9668, 32.5498, كارجاس طريق ناصر, السويس`
  );
  const [gpsPreviewResults, setGpsPreviewResults] = useState<any[]>([]);

  const handleParseGpsLines = () => {
    const lines = gpsInputText.split('\n').filter(l => l.trim().length > 0);
    const parsed = lines.map((line, idx) => {
      const parts = line.split(/[,;\t]/).map(p => p.trim());
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      const name = parts[2] || `موقع رصد إحداثيات #${idx + 1}`;
      const gov = parts[3] || 'القاهرة';

      const isValidEgypt = !isNaN(lat) && !isNaN(lng) && lat >= 21 && lat <= 32.5 && lng >= 24 && lng <= 37;

      return {
        id: `gps-parsed-${idx}`,
        lat,
        lng,
        name,
        governorate: gov,
        isValid: isValidEgypt,
        status: isValidEgypt ? 'إحداثيات جغرافية مطابقة داخل مصر' : 'تحذير: إحداثيات خارج نطاق جمهورية مصر العربية'
      };
    });

    setGpsPreviewResults(parsed);
  };

  const handleImportGpsAsSessions = () => {
    if (gpsPreviewResults.length === 0) return;
    const validOnes = gpsPreviewResults.filter(p => p.isValid);
    if (validOnes.length === 0) {
      alert('لا توجد إحداثيات صالحة للاستيراد.');
      return;
    }

    const newSessions: MonitoringSession[] = validOnes.map((item, idx) => ({
      id: `session-gps-${Date.now()}-${idx}`,
      code: `GPS-SITE-${idx + 101}`,
      title: `معاينة جغرافية: ${item.name}`,
      locationName: item.name,
      governorate: item.governorate,
      city: item.governorate,
      coordinates: { lat: item.lat, lng: item.lng },
      nearestStation: 'محطة كارجاس المركزية',
      trafficDirection: 'محور رئيسي اتجاهين',
      surveyorName: 'فريق المسح الجغرافي ونظم المعلومات GIS',
      status: 'active',
      startTime: new Date().toISOString(),
      durationSeconds: 1800,
      counts: createDefaultVehicleCounts({
        microbus: 120,
        taxi: 75,
        van: 50,
        peugeot_station: 20,
        private: 180,
        suzuki_van: 50
      }),
      detections: [],
      notes: 'تم توليد هذا الموقع تلقائياً من مغذي إحداثيات الـ GPS المجمع بنظام GIS كارجاس',
      autoGpsCaptured: true,
      gpsAccuracyMeters: 4
    }));

    onImportSessions(newSessions);
    alert(`تم بنجاح تحويل وتثبيت ${newSessions.length} موقع إحداثيات إلى جلسات ومواقع رصد معتمدة!`);
    setGpsPreviewResults([]);
  };

  // --------------------------------------------------------------------------
  // TAB 4: COMPANY STATIONS CENSUS & PORTFOLIO
  // --------------------------------------------------------------------------
  const [censusSearch, setCensusSearch] = useState('');
  const [censusGovFilter, setCensusGovFilter] = useState('all');
  const [censusStatusFilter, setCensusStatusFilter] = useState('all');
  const [isAddingStationModal, setIsAddingStationModal] = useState(false);
  const [newStationDraft, setNewStationDraft] = useState<Partial<CompanyStationCensusItem>>({
    name: '',
    code: '',
    governorate: 'القاهرة',
    city: '',
    address: '',
    lat: 30.0444,
    lng: 31.2357,
    status: 'operational',
    dispenserCount: 8,
    compressorCapacityM3h: 1500,
    commissioningYear: 2024,
    hasConversionCenter: true,
    annualVolumeM3: 3500000,
    investmentValueMillionEgp: 20,
    contractorOrPartner: 'كارجاس',
    notes: ''
  });

  // Calculate high-level portfolio metrics
  const censusMetrics = useMemo(() => {
    const totalStations = censusStations.length;
    const operational = censusStations.filter(s => s.status === 'operational').length;
    const underConstruction = censusStations.filter(s => s.status === 'under_construction').length;
    const licensedPending = censusStations.filter(s => s.status === 'licensed_pending').length;
    const totalDispensers = censusStations.reduce((acc, s) => acc + (s.dispenserCount || 0), 0);
    const totalCompressorCapacity = censusStations.reduce((acc, s) => acc + (s.compressorCapacityM3h || 0), 0);
    const totalInvestmentMillions = censusStations.reduce((acc, s) => acc + (s.investmentValueMillionEgp || 0), 0);
    const totalAnnualVolumeMillionM3 = (censusStations.reduce((acc, s) => acc + (s.annualVolumeM3 || 0), 0) / 1000000).toFixed(1);

    return {
      totalStations,
      operational,
      underConstruction,
      licensedPending,
      totalDispensers,
      totalCompressorCapacity,
      totalInvestmentMillions,
      totalAnnualVolumeMillionM3
    };
  }, [censusStations]);

  // Filtered census stations
  const filteredCensus = useMemo(() => {
    return censusStations.filter(s => {
      const matchSearch = censusSearch === '' || 
        s.name.toLowerCase().includes(censusSearch.toLowerCase()) ||
        s.code.toLowerCase().includes(censusSearch.toLowerCase()) ||
        s.address.toLowerCase().includes(censusSearch.toLowerCase()) ||
        s.city.toLowerCase().includes(censusSearch.toLowerCase());
      
      const matchGov = censusGovFilter === 'all' || s.governorate === censusGovFilter;
      const matchStatus = censusStatusFilter === 'all' || s.status === censusStatusFilter;
      return matchSearch && matchGov && matchStatus;
    });
  }, [censusStations, censusSearch, censusGovFilter, censusStatusFilter]);

  // Save new station manually
  const handleSaveNewStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStationDraft.name?.trim()) {
      alert('يرجى كتابة اسم المحطة.');
      return;
    }

    const newItem: CompanyStationCensusItem = {
      id: `cargas-st-${Date.now()}`,
      code: newStationDraft.code?.trim() || `CRG-${Date.now().toString().slice(-4)}`,
      name: newStationDraft.name.trim(),
      governorate: newStationDraft.governorate || 'القاهرة',
      city: newStationDraft.city || 'القاهرة',
      address: newStationDraft.address || '',
      lat: Number(newStationDraft.lat) || 30.0444,
      lng: Number(newStationDraft.lng) || 31.2357,
      status: (newStationDraft.status as any) || 'operational',
      dispenserCount: Number(newStationDraft.dispenserCount) || 8,
      compressorCapacityM3h: Number(newStationDraft.compressorCapacityM3h) || 1500,
      commissioningYear: Number(newStationDraft.commissioningYear) || new Date().getFullYear(),
      hasConversionCenter: Boolean(newStationDraft.hasConversionCenter),
      annualVolumeM3: Number(newStationDraft.annualVolumeM3) || 3000000,
      investmentValueMillionEgp: Number(newStationDraft.investmentValueMillionEgp) || 20,
      contractorOrPartner: newStationDraft.contractorOrPartner || 'كارجاس',
      notes: newStationDraft.notes || ''
    };

    updateCensusStations([newItem, ...censusStations]);
    setIsAddingStationModal(false);
    alert('تمت إضافة المحطة بنجاح إلى حصر الشركة!');
  };

  const handleDeleteStation = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المحطة من حصر أعمال الشركة؟')) {
      const updated = censusStations.filter(s => s.id !== id);
      updateCensusStations(updated);
    }
  };

  // Export census to Excel
  const handleExportCensusExcel = () => {
    const exportData = censusStations.map(s => ({
      'كود_المحطة': s.code,
      'اسم_المحطة': s.name,
      'المحافظة': s.governorate,
      'المدينة_الحي': s.city,
      'العنوان_التفصيلي': s.address,
      'خط_العرض_Lat': s.lat,
      'خط_الطول_Lng': s.lng,
      'الحالة_التشغيلية': s.status === 'operational' ? 'عاملة وتضخ الغاز' : s.status === 'under_construction' ? 'قيد الإنشاء والتجهيز' : 'مطروحة للترخيص',
      'عدد_الموزعات': s.dispenserCount,
      'سعة_الضاغط_م3_س': s.compressorCapacityM3h,
      'سنة_التشغيل': s.commissioningYear,
      'يوجد_مركز_تحويل': s.hasConversionCenter ? 'نعم' : 'لا',
      'المبيعات_السنوية_م3': s.annualVolumeM3,
      'قيمة_الاستثمار_مليون_جم': s.investmentValueMillionEgp,
      'المقاول_أو_الشريك': s.contractorOrPartner,
      'ملاحظات': s.notes
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'حصر_محطات_كارجاس_الرسمي');
    XLSX.writeFile(wb, `حصر_أعمال_محطات_كارجاس_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* ------------------------------------------------------------- */}
      {/* HEADER BANNER: HISTORICAL DATA & COMPANY CENSUS ENGINE        */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>إثراء قاعدة البيانات وحصر أعمال الشركة</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                Excel • Images • GPS • Census
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              منظومة رفع البيانات التاريخية، الصور، الإحداثيات وحصر محطات كارجاس
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              تتيح لإدارة النظام رفع شيتات إكسيل وCSV للجلسات التاريخية وحصر المحطات، وتوثيق الصور والمخططات الهندسية، وتغذية إحداثيات الـ GPS المجمعة لربط كافة أعمال ومشروعات الشركة في منصة رقمية موحدة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleDownloadSampleTemplate(excelImportType)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>تحميل نموذج إكسيل جاهز</span>
            </button>
            <button
              onClick={handleExportCensusExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير الحصر الشامل (Excel)</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-slate-700/80">
          
          <button
            onClick={() => setActiveSubTab('excel_import')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'excel_import'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
            <span>رفع واستيراد شيتات الإكسيل (Excel / CSV)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('photos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'photos'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-300" />
            <span>معرض الصور والمخططات التاريخية ({historicalPhotos.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gps_batch')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'gps_batch'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Compass className="w-4 h-4 text-cyan-300" />
            <span>تغذية إحداثيات GPS المجمعة</span>
          </button>

          <button
            onClick={() => setActiveSubTab('company_census')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'company_census'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-300" />
            <span>حصر أعمال ومحطات الشركة ({censusStations.length})</span>
          </button>

        </div>
      </div>

      {/* Notification Toast */}
      {importNotification && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{importNotification}</span>
          </div>
          <button
            onClick={() => setImportNotification(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 1: EXCEL / CSV IMPORTER                               */}
      {/* ============================================================= */}
      {activeSubTab === 'excel_import' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>معالج استيراد البيانات التاريخية من ملفات Excel و CSV</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  قم باختيار نوع البيانات المستوردة، وتنزيل النموذج الاسترشادي، ثم رفع الملف ليتم تحليله وإدراجه مباشرة في قاعدة البيانات.
                </p>
              </div>

              {/* Data Import Target Selector */}
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 px-2">وجهة الاستيراد:</span>
                <button
                  type="button"
                  onClick={() => {
                    setExcelImportType('sessions');
                    setParsedRows([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    excelImportType === 'sessions'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  جلسات ومواقع الرصد
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExcelImportType('census');
                    setParsedRows([]);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    excelImportType === 'census'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  حصر محطات وأعمال الشركة
                </button>
              </div>
            </div>

            {/* Template Download & File Upload Zone */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Box 1: Download Templates */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <Download className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    1. تنزيل نموذج إكسيل المعتمد
                  </h4>
                  <p className="text-xs text-slate-400">
                    ملف مجهز بكافة الأعمدة المطلوبة باللغتين العربية والإنجليزية مع صفوف تجريبية لتسهيل نقل البيانات.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadSampleTemplate(excelImportType)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>تنزيل نموذج {excelImportType === 'sessions' ? 'جلسات الرصد' : 'حصر المحطات'}</span>
                </button>
              </div>

              {/* Box 2 & 3: File Drag & Drop Zone */}
              <div className="lg:col-span-2">
                <input
                  ref={excelFileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => excelFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-950/60 hover:bg-slate-900/60 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 min-h-[160px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      اضغط هنا لاختيار ملف إكسيل (.xlsx / .xls) أو ملف CSV
                    </h5>
                    <p className="text-xs text-slate-400 mt-1">
                      يدعم كافة صيغ مايكروسوفت إكسيل، ويتم قراءة الأعمدة بالعربية تلقائياً وفهرستها.
                    </p>
                  </div>
                  {importedFileName && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                      الملف المحدد: {importedFileName}
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Parsed Rows Preview Table */}
            {parsedRows.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        تمت قراءة وفهرسة {parsedRows.length} سجل بنجاح من الملف
                      </h4>
                      <span className="text-xs text-slate-400">
                        الوجهة: {excelImportType === 'sessions' ? 'جلسات ومواقع الرصد التاريخية' : 'حصر أعمال ومحطات الشركة'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setParsedRows([]);
                        setImportedFileName('');
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmImport}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>تأكيد استيراد {parsedRows.length} سجل إلى قاعدة البيانات</span>
                    </button>
                  </div>
                </div>

                {/* Table Preview */}
                <div className="overflow-x-auto border border-slate-800 rounded-xl max-h-80 overflow-y-auto">
                  <table className="w-full text-right text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold sticky top-0 border-b border-slate-800">
                      <tr>
                        <th className="p-3">#</th>
                        {parsedHeaders.slice(0, 8).map((h, i) => (
                          <th key={i} className="p-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                      {parsedRows.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                          {parsedHeaders.slice(0, 8).map((h, i) => (
                            <td key={i} className="p-3 whitespace-nowrap max-w-[200px] truncate">
                              {String(row[h] || '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {parsedRows.length > 10 && (
                  <p className="text-[11px] text-slate-400 text-center">
                    يتم عرض أول 10 صفوف فقط للمعاينة من أصل {parsedRows.length} صف سيتم إدراجهم بالكامل.
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 2: HISTORICAL PHOTOS & BLUEPRINTS GALLERY             */}
      {/* ============================================================= */}
      {activeSubTab === 'photos' && (
        <div className="space-y-6">
          
          {/* Upload New Photo Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>رفع وتوثيق صورة أو مخطط تاريخي جديد في الأرشيف</span>
            </h3>

            <form onSubmit={handleAddHistoricalPhoto} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  عنوان الصورة أو المخطط: *
                </label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="مثال: كروكي مساحي عام لمحطة الرماية"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  اسم الموقع أو المحطة المرتبطة:
                </label>
                <input
                  type="text"
                  value={photoLocation}
                  onChange={(e) => setPhotoLocation(e.target.value)}
                  placeholder="مثال: محطة كارجاس الهرم"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  المحافظة:
                </label>
                <select
                  value={photoGovernorate}
                  onChange={(e) => setPhotoGovernorate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="القليوبية">القليوبية</option>
                  <option value="السويس">السويس</option>
                  <option value="بورسعيد">بورسعيد</option>
                  <option value="الإسماعيلية">الإسماعيلية</option>
                  <option value="الغربية">الغربية</option>
                  <option value="الدقهلية">الدقهلية</option>
                  <option value="الشرقية">الشرقية</option>
                  <option value="المنوفية">المنوفية</option>
                  <option value="البحيرة">البحيرة</option>
                  <option value="بني سويف">بني سويف</option>
                  <option value="الفيوم">الفيوم</option>
                  <option value="المنيا">المنيا</option>
                  <option value="أسيوط">أسيوط</option>
                  <option value="سوهاج">سوهاج</option>
                  <option value="قنا">قنا</option>
                  <option value="الأقصر">الأقصر</option>
                  <option value="أسوان">أسوان</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  تصنيف الوثيقة:
                </label>
                <select
                  value={photoCategory}
                  onChange={(e) => setPhotoCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="site_survey">معاينة موقع ميدانية ورصد مروري</option>
                  <option value="blueprint">كروكي ومخطط مساحي هندسي</option>
                  <option value="construction">أعمال إنشائية وتجهيز محطة</option>
                  <option value="opening">افتتاح رسمي وتدشين</option>
                  <option value="aerial_map">صورة جوية وأقمار صناعية</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  تاريخ الصورة أو المعاينة:
                </label>
                <input
                  type="date"
                  value={photoDate}
                  onChange={(e) => setPhotoDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  ملف الصورة: *
                </label>
                <input
                  ref={photoFileInputRef}
                  type="file"
                  required
                  accept="image/*"
                  onChange={handlePhotoFileSelected}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 file:me-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  وصف وملاحظات توثيقية:
                </label>
                <input
                  type="text"
                  value={photoDescription}
                  onChange={(e) => setPhotoDescription(e.target.value)}
                  placeholder="وصف موجز لمحتوى الصورة أو المخطط، أبعاد الموقع، أو أسماء أعضاء المعاينة..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-3 flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>حفظ وتوثيق الصورة بالأرشيف</span>
                </button>
              </div>

            </form>
          </div>

          {/* Gallery Filters & Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  <input
                    type="text"
                    value={photoSearchFilter}
                    onChange={(e) => setPhotoSearchFilter(e.target.value)}
                    placeholder="بحث في الصور والمخططات..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={photoCategoryFilter}
                  onChange={(e) => setPhotoCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="all">كافة التصنيفات ({historicalPhotos.length})</option>
                  <option value="site_survey">معاينة موقع ورصد</option>
                  <option value="blueprint">كروكي ومخطط</option>
                  <option value="construction">أعمال إنشائية</option>
                  <option value="opening">افتتاح وتدشين</option>
                </select>
              </div>

              <span className="text-xs text-slate-400">
                إجمالي الصور بالأرشيف: <strong className="text-white font-mono">{filteredPhotos.length}</strong>
              </span>
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="relative h-44 overflow-hidden bg-slate-950">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none"></div>

                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                        {photo.category === 'blueprint' ? 'مخطط كروكي' : photo.category === 'site_survey' ? 'معاينة رصد' : photo.category === 'construction' ? 'إنشائي' : 'افتتاح'}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 left-2 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {photo.governorate}
                      </span>
                      <span className="font-mono text-slate-400">{photo.date}</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1" title={photo.title}>
                        {photo.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                        {photo.description || photo.locationOrStationName}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActivePhotoModal(photo)}
                        className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>تكبير ومعاينة</span>
                      </button>

                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer p-1"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">لا توجد صور تاريخية مطابقة لمعايير البحث.</p>
              </div>
            )}
          </div>

          {/* Lightbox Modal */}
          {activePhotoModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">{activePhotoModal.title}</h4>
                    <span className="text-xs text-slate-400">
                      {activePhotoModal.locationOrStationName} ({activePhotoModal.governorate}) • {activePhotoModal.date}
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePhotoModal(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 flex-1 overflow-auto bg-slate-950 flex items-center justify-center">
                  <img
                    src={activePhotoModal.url}
                    alt={activePhotoModal.title}
                    className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-2xl"
                  />
                </div>

                {activePhotoModal.description && (
                  <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
                    <p>{activePhotoModal.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 3: BATCH GPS COORDINATES FEEDER                       */}
      {/* ============================================================= */}
      {activeSubTab === 'gps_batch' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>مغذي ومحلل إحداثيات الـ GPS المجمعة (GIS Batch Feeder)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                الصق قائمة إحداثيات جغرافية (خط العرض، خط الطول، اسم الموقع، المحافظة) ليتم تدقيقها جغرافياً في نطاق مصر وتوليد مواقع معاينة معتمدة فوراً.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold">بيانات الإحداثيات (كل سطر: خط العرض، خط الطول، اسم الموقع، المحافظة):</span>
                <span className="text-slate-400 font-mono">Format: Lat, Lng, Name, Governorate</span>
              </div>

              <textarea
                rows={6}
                value={gpsInputText}
                onChange={(e) => setGpsInputText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                placeholder="30.0444, 31.2357, محطة كارجاس رمسيس, القاهرة"
              />

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400">
                  نطاق مصر المعتمد: خط عرض 21° إلى 32.5° شمالاً، خط طول 24° إلى 37° شرقاً.
                </span>
                <button
                  type="button"
                  onClick={handleParseGpsLines}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>تدقيق وتحليل الإحداثيات</span>
                </button>
              </div>
            </div>

            {/* Parsed GPS Results */}
            {gpsPreviewResults.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
                <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      تم تحليل {gpsPreviewResults.length} موقع إحداثيات
                    </h4>
                    <span className="text-xs text-emerald-400">
                      صالح ومطابق: {gpsPreviewResults.filter(p => p.isValid).length} | غير مطابق: {gpsPreviewResults.filter(p => !p.isValid).length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleImportGpsAsSessions}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>تحويل المواقع الصالحة إلى جلسات رصد بالمنظومة</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-xl">
                  <table className="w-full text-right text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">اسم الموقع</th>
                        <th className="p-3">المحافظة</th>
                        <th className="p-3">خط العرض (Lat)</th>
                        <th className="p-3">خط الطول (Lng)</th>
                        <th className="p-3">حالة التدقيق الجغرافي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                      {gpsPreviewResults.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-bold text-white">{item.name}</td>
                          <td className="p-3">{item.governorate}</td>
                          <td className="p-3 font-mono text-cyan-400">{item.lat}</td>
                          <td className="p-3 font-mono text-cyan-400">{item.lng}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              item.isValid
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SUB-TAB 4: COMPANY STATIONS CENSUS & PORTFOLIO                */}
      {/* ============================================================= */}
      {activeSubTab === 'company_census' && (
        <div className="space-y-6">
          
          {/* Executive Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center shadow-lg">
              <span className="text-xs text-slate-400 block mb-1">إجمالي المحطات</span>
              <span className="text-2xl font-black font-mono text-white">
                {censusMetrics.totalStations}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-1">محطة مسجلة بالحصر</span>
            </div>

            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 text-center shadow-lg">
              <span className="text-xs text-slate-400 block mb-1">محطات عاملة</span>
              <span className="text-2xl font-black font-mono text-emerald-400">
                {censusMetrics.operational}
              </span>
              <span className="text-[10px] text-emerald-300 block mt-1">تضخ الغاز حالياً</span>
            </div>

            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 text-center shadow-lg">
              <span className="text-xs text-slate-400 block mb-1">قيد الإنشاء</span>
              <span className="text-2xl font-black font-mono text-amber-400">
                {censusMetrics.underConstruction}
              </span>
              <span className="text-[10px] text-amber-300 block mt-1">أعمال مدنية وتوريد</span>
            </div>

            <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-4 text-center shadow-lg">
              <span className="text-xs text-slate-400 block mb-1">مسدسات التموين</span>
              <span className="text-2xl font-black font-mono text-blue-400">
                {censusMetrics.totalDispensers}
              </span>
              <span className="text-[10px] text-blue-300 block mt-1">نقطة تموين سريعة</span>
            </div>

            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-4 text-center shadow-lg">
              <span className="text-xs text-slate-400 block mb-1">سعة الضواغط</span>
              <span className="text-2xl font-black font-mono text-purple-400">
                {censusMetrics.totalCompressorCapacity.toLocaleString()}
              </span>
              <span className="text-[10px] text-purple-300 block mt-1">متر مكعب / ساعة</span>
            </div>

            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-4 text-center shadow-lg">
              <span className="text-xs text-slate-400 block mb-1">المحفظة الاستثمارية</span>
              <span className="text-2xl font-black font-mono text-cyan-400">
                {censusMetrics.totalInvestmentMillions}
              </span>
              <span className="text-[10px] text-cyan-300 block mt-1">مليون جنيه مصري</span>
            </div>

          </div>

          {/* Filter Bar & Add Station Button */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={censusSearch}
                  onChange={(e) => setCensusSearch(e.target.value)}
                  placeholder="بحث باسم المحطة أو الكود أو العنوان..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={censusGovFilter}
                onChange={(e) => setCensusGovFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">كافة المحافظات</option>
                <option value="القاهرة">القاهرة</option>
                <option value="الجيزة">الجيزة</option>
                <option value="الإسكندرية">الإسكندرية</option>
                <option value="القليوبية">القليوبية</option>
                <option value="السويس">السويس</option>
                <option value="بورسعيد">بورسعيد</option>
                <option value="الإسماعيلية">الإسماعيلية</option>
                <option value="الغربية">الغربية</option>
                <option value="المنوفية">المنوفية</option>
                <option value="أسيوط">أسيوط</option>
                <option value="بني سويف">بني سويف</option>
              </select>

              <select
                value={censusStatusFilter}
                onChange={(e) => setCensusStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
              >
                <option value="all">كافة الحالات</option>
                <option value="operational">عاملة</option>
                <option value="under_construction">قيد الإنشاء</option>
                <option value="licensed_pending">مطروحة للترخيص</option>
              </select>

            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCensusExcel}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>تصدير إكسيل</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddingStationModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة محطة يدوياً للحصر</span>
              </button>
            </div>
          </div>

          {/* Detailed Census Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-2xl shadow-xl">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">كود المحطة</th>
                  <th className="p-3">اسم المحطة</th>
                  <th className="p-3">المحافظة / الحي</th>
                  <th className="p-3">الحالة التشغيلية</th>
                  <th className="p-3">الموزعات</th>
                  <th className="p-3">سعة الضاغط</th>
                  <th className="p-3">مركز تحويل</th>
                  <th className="p-3">سنة التدشين</th>
                  <th className="p-3">قيمة الاستثمار</th>
                  <th className="p-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredCensus.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-amber-400">{st.code}</td>
                    <td className="p-3">
                      <span className="font-bold text-white block">{st.name}</span>
                      <span className="text-[11px] text-slate-400 block truncate max-w-xs">{st.address}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-slate-200">{st.governorate}</span>
                      <span className="text-[11px] text-slate-400 block">{st.city}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        st.status === 'operational'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : st.status === 'under_construction'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}>
                        {st.status === 'operational' ? 'عاملة' : st.status === 'under_construction' ? 'قيد الإنشاء' : 'مطروحة للترخيص'}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-400">{st.dispenserCount} نقاط</td>
                    <td className="p-3 font-mono">{st.compressorCapacityM3h} م³/س</td>
                    <td className="p-3">
                      {st.hasConversionCenter ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          نعم
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">لا يوجد</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">{st.commissioningYear}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">
                      {st.investmentValueMillionEgp} م ج.م
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteStation(st.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="حذف من الحصر"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Station Modal */}
          {isAddingStationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <span>إضافة محطة جديدة إلى حصر أعمال كارجاس</span>
                  </h4>
                  <button
                    onClick={() => setIsAddingStationModal(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveNewStation} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">اسم المحطة: *</label>
                    <input
                      type="text"
                      required
                      value={newStationDraft.name || ''}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, name: e.target.value })}
                      placeholder="مثال: محطة كارجاس - مدينة نصر"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">كود المحطة:</label>
                    <input
                      type="text"
                      value={newStationDraft.code || ''}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, code: e.target.value })}
                      placeholder="مثال: CRG-CAI-15"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">المحافظة:</label>
                    <select
                      value={newStationDraft.governorate || 'القاهرة'}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, governorate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="القاهرة">القاهرة</option>
                      <option value="الجيزة">الجيزة</option>
                      <option value="الإسكندرية">الإسكندرية</option>
                      <option value="القليوبية">القليوبية</option>
                      <option value="السويس">السويس</option>
                      <option value="بورسعيد">بورسعيد</option>
                      <option value="الإسماعيلية">الإسماعيلية</option>
                      <option value="الغربية">الغربية</option>
                      <option value="المنوفية">المنوفية</option>
                      <option value="أسيوط">أسيوط</option>
                      <option value="بني سويف">بني سويف</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">المدينة أو الحي:</label>
                    <input
                      type="text"
                      value={newStationDraft.city || ''}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, city: e.target.value })}
                      placeholder="مثال: مدينة نصر"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">العنوان بالتفصيل:</label>
                    <input
                      type="text"
                      value={newStationDraft.address || ''}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, address: e.target.value })}
                      placeholder="شارع الطيران تقاطع الأوتوستراد"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">خط العرض (Lat):</label>
                    <input
                      type="number"
                      step="any"
                      value={newStationDraft.lat || 30.0444}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, lat: parseFloat(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">خط الطول (Lng):</label>
                    <input
                      type="number"
                      step="any"
                      value={newStationDraft.lng || 31.2357}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, lng: parseFloat(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">الحالة التشغيلية:</label>
                    <select
                      value={newStationDraft.status || 'operational'}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, status: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="operational">عاملة ومفعلة</option>
                      <option value="under_construction">قيد الإنشاء والتجهيز</option>
                      <option value="licensed_pending">مطروحة للترخيص</option>
                      <option value="proposed">موقع مقترح</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">عدد الموزعات (نقاط التموين):</label>
                    <input
                      type="number"
                      value={newStationDraft.dispenserCount || 8}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, dispenserCount: parseInt(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">سعة الضاغط (م³/ساعة):</label>
                    <input
                      type="number"
                      value={newStationDraft.compressorCapacityM3h || 1500}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, compressorCapacityM3h: parseInt(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">قيمة الاستثمار (مليون ج.م):</label>
                    <input
                      type="number"
                      step="any"
                      value={newStationDraft.investmentValueMillionEgp || 20}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, investmentValueMillionEgp: parseFloat(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="hasConversionCheck"
                      checked={newStationDraft.hasConversionCenter || false}
                      onChange={(e) => setNewStationDraft({ ...newStationDraft, hasConversionCenter: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-950 border-slate-700 cursor-pointer"
                    />
                    <label htmlFor="hasConversionCheck" className="text-xs text-slate-300 cursor-pointer">
                      تتضمن مركز تحويل وصيانة معتمد تابع لكارجاس
                    </label>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingStationModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-blue-600/30"
                    >
                      حفظ المحطة في الحصر
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
