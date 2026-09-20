import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Eye,
  Download,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  Settings2
} from 'lucide-react';
import { DepartmentRole, CustomFormField } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';

export type DynamicFieldType = 'text' | 'number' | 'select' | 'textarea' | 'date' | 'boolean' | 'file';

interface ExcelTemplateImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDepartment?: DepartmentRole;
  onImportFields: (dept: DepartmentRole, fields: any[]) => void;
  currentUserRole?: DepartmentRole | 'admin';
}

interface DetectedFieldItem {
  id: string;
  label: string;
  type: DynamicFieldType;
  required: boolean;
  placeholder?: string;
  section: string;
  options?: string[];
  unit?: string;
  sampleValue?: string;
  selected: boolean;
}

export const ExcelTemplateImporterModal: React.FC<ExcelTemplateImporterModalProps> = ({
  isOpen,
  onClose,
  targetDepartment = 'marketing',
  onImportFields,
  currentUserRole = 'admin'
}) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentRole>(targetDepartment);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [detectedFields, setDetectedFields] = useState<DetectedFieldItem[]>([]);
  const [defaultSection, setDefaultSection] = useState<string>('استمارة الفحص الميداني المعتمدة (Excel)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Infer field type from sample values
  const inferFieldType = (label: string, sample: any): { type: DynamicFieldType; unit?: string; options?: string[] } => {
    const l = label.toLowerCase();
    const s = String(sample || '').toLowerCase();

    // Check by label keywords
    if (l.includes('تاريخ') || l.includes('date') || l.includes('يوم')) {
      return { type: 'date' };
    }
    if (l.includes('صورة') || l.includes('photo') || l.includes('مرفق') || l.includes('file')) {
      return { type: 'file' };
    }
    if (l.includes('ملاحظ') || l.includes('وصف') || l.includes('تقرير') || l.includes('notes') || l.includes('description')) {
      return { type: 'textarea' };
    }
    if (l.includes('ضغط') || l.includes('pressure') || l.includes('بار')) {
      return { type: 'number', unit: 'بار' };
    }
    if (l.includes('مساحة') || l.includes('area') || l.includes('م2')) {
      return { type: 'number', unit: 'م٢' };
    }
    if (l.includes('تكلفة') || l.includes('سعر') || l.includes('مبلغ') || l.includes('cost') || l.includes('جنيه')) {
      return { type: 'number', unit: 'جنيه مصري' };
    }
    if (l.includes('مسافة') || l.includes('distance') || l.includes('متر') || l.includes('كم')) {
      return { type: 'number', unit: 'متر' };
    }
    if (l.includes('عدد') || l.includes('كمية') || l.includes('count') || l.includes('سعة') || l.includes('capacity')) {
      return { type: 'number' };
    }
    if (s === 'نعم' || s === 'لا' || s === 'true' || s === 'false' || l.includes('متاح') || l.includes('هل')) {
      return { type: 'select', options: ['نعم', 'لا', 'قيد الدراسة'] };
    }
    if (s && !isNaN(Number(s)) && s.trim() !== '') {
      return { type: 'number' };
    }

    return { type: 'text' };
  };

  // Process Excel Workbook
  const handleFileUpload = (selectedFile: File) => {
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setIsProcessing(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (workbook.SheetNames.length === 0) {
          setErrorMsg('ملف الإكسل فارغ ولا يحتوي على أي أوراق عمل.');
          setIsProcessing(false);
          return;
        }

        setSheetNames(workbook.SheetNames);
        const firstSheetName = workbook.SheetNames[0];
        setSelectedSheet(firstSheetName);
        parseSheet(workbook, firstSheetName);
      } catch (err: any) {
        setErrorMsg(`فشل قراءة ملف الإكسل: ${err.message || 'صيغة غير مدعومة'}`);
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const parseSheet = (workbook: XLSX.WorkBook, sheetName: string) => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length === 0) {
      setErrorMsg('ورقة العمل المحددة فارغة.');
      setDetectedFields([]);
      setIsProcessing(false);
      return;
    }

    // Heuristic: Check if row 0 is headers (horizontal table)
    // Or if column 0 contains field labels (vertical questionnaire form)
    let fields: DetectedFieldItem[] = [];

    // Check vertical layout (Key-Value form: Col A = Field Name, Col B = Value/Description)
    const isVerticalForm = jsonData.length > 3 && jsonData[0].length <= 4;

    if (isVerticalForm) {
      jsonData.forEach((row, idx) => {
        const label = String(row[0] || '').trim();
        const sampleVal = row[1] !== undefined ? String(row[1]).trim() : '';

        // Skip blank or short header noise
        if (label && label.length > 1 && !label.startsWith('===') && !label.startsWith('---')) {
          const { type, unit, options } = inferFieldType(label, sampleVal);
          fields.push({
            id: `excel_fld_${Date.now()}_${idx}`,
            label,
            type,
            required: false,
            placeholder: `أدخل ${label}`,
            section: defaultSection,
            options,
            unit,
            sampleValue: sampleVal || undefined,
            selected: true
          });
        }
      });
    } else {
      // Horizontal Table: First row contains column names
      const headers = jsonData[0] || [];
      const sampleRow = jsonData[1] || [];

      headers.forEach((h: any, idx: number) => {
        const label = String(h || '').trim();
        if (label) {
          const sampleVal = sampleRow[idx] !== undefined ? String(sampleRow[idx]).trim() : '';
          const { type, unit, options } = inferFieldType(label, sampleVal);
          fields.push({
            id: `excel_fld_${Date.now()}_${idx}`,
            label,
            type,
            required: false,
            placeholder: `أدخل ${label}`,
            section: defaultSection,
            options,
            unit,
            sampleValue: sampleVal || undefined,
            selected: true
          });
        }
      });
    }

    if (fields.length === 0) {
      setErrorMsg('لم يتم العثور على رؤوس أعمدة أو حقول واضحة في ورقة العمل.');
    } else {
      setDetectedFields(fields);
    }
    setIsProcessing(false);
  };

  // Switch sheet
  const handleSheetChange = (sheetName: string) => {
    if (!file) return;
    setSelectedSheet(sheetName);
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        parseSheet(workbook, sheetName);
      } catch (err: any) {
        setErrorMsg('فشل تبديل ورقة العمل.');
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Toggle field selection
  const handleToggleSelect = (index: number) => {
    setDetectedFields(prev => prev.map((f, i) => i === index ? { ...f, selected: !f.selected } : f));
  };

  // Update field type
  const handleUpdateFieldType = (index: number, newType: DynamicFieldType) => {
    setDetectedFields(prev => prev.map((f, i) => i === index ? { ...f, type: newType } : f));
  };

  // Update field label
  const handleUpdateFieldLabel = (index: number, newLabel: string) => {
    setDetectedFields(prev => prev.map((f, i) => i === index ? { ...f, label: newLabel } : f));
  };

  // Apply imported fields
  const handleConfirmImport = () => {
    const selected = detectedFields.filter(f => f.selected && f.label.trim().length > 0);
    if (selected.length === 0) {
      setErrorMsg('يرجى تحديد حقل واحد على الأقل لتوليده.');
      return;
    }

    const newCustomFields = selected.map((item, idx) => ({
      id: item.id || `fld-${selectedDept}-${Date.now()}-${idx}`,
      department: selectedDept,
      name: `field_${Date.now()}_${idx}`,
      key: `custom_${Date.now().toString(36)}_${idx}`,
      label: item.label,
      type: item.type,
      required: item.required,
      options: item.options,
      placeholder: item.placeholder,
      unit: item.unit,
      section: item.section || defaultSection,
      visibleToAll: true,
      visible: true,
      createdBy: currentUserRole,
      createdAt: new Date().toISOString()
    }));

    onImportFields(selectedDept, newCustomFields);
    setSuccessCount(newCustomFields.length);

    setTimeout(() => {
      onClose();
    }, 1800);
  };

  // Download Sample Template for departments
  const handleDownloadSampleTemplate = () => {
    const sampleData = [
      ['اسم الحقل / البيان المطلوب', 'القيمة التوضيحية', 'نوع البيان', 'ملاحظات الإدارة'],
      ['رقم كود المحطة المقترحة', 'CRG-CAI-105', 'نص', 'إلزامي'],
      ['الضغط التشغيلي بالبار', '250', 'رقم (بار)', 'من واقع فحص شبكة الغاز'],
      ['مسافة الأمان عن أقرب مبنى سكني', '15.5', 'رقم (متر)', 'كود NFPA 52'],
      ['توافر موافقة الحماية المدنية', 'نعم', 'اختيار (نعم/لا)', 'تراخيص'],
      ['تاريخ المعاينة الميدانية', '2026-09-20', 'تاريخ', 'ميداني'],
      ['ملاحظات وتوصيات المهندس الميداني', 'الموقع مناسب جداً مع إمكانية إضافة 8 مسدسات تموين', 'نص متعدد الأسطر', 'فني']
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'نموذج_استمارة_فحص');
    XLSX.writeFile(wb, `نموذج_استمارة_${selectedDept}_كارجاس.xlsx`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>استيراد وتوليد حقول النماذج تلقائياً من ملفات Excel</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ذكي وآلي
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                يقوم النظام بقراءة استمارات الإكسل وتوليد حقول المعاينة المخصصة للإدارة بضغطة زر واحدة
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

        {/* Modal Content */}
        <div className="p-5 space-y-6">
          
          {/* Target Department Selection (if admin) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>الإدارة المستهدفة لاعتماد النموذج:</span>
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value as DepartmentRole)}
                disabled={currentUserRole !== 'admin'}
                className="w-full bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none"
              >
                {Object.entries(DEPARTMENTS_METADATA)
                  .filter(([role]) => role !== 'admin')
                  .map(([role, meta]) => (
                    <option key={role} value={role}>
                      {meta.title} ({meta.subtitle.split('•')[0]})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>اسم القسم أو المجموعة في الاستمارة:</span>
              </label>
              <input
                type="text"
                value={defaultSection}
                onChange={(e) => setDefaultSection(e.target.value)}
                placeholder="مثال: فحص سلامة الموقع والمسافات البينية"
                className="w-full bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* File Upload Drop Zone */}
          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/70 bg-slate-950/40 hover:bg-slate-950/80 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Upload className="w-7 h-7 animate-bounce" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  اسحب وأفلت استمارة الإكسل هنا، أو اضغط للتصفح
                </p>
                <p className="text-xs text-slate-400">
                  يدعم صيغ Excel (.xlsx, .xls) وملفات الجداول (.csv)
                </p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadSampleTemplate();
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل نموذج استمارة فارغ (Sample Excel)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">{fileName}</h4>
                  <p className="text-xs text-slate-400">
                    تم التعرف على <strong className="text-emerald-400">{detectedFields.length}</strong> حقل من الملف
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {sheetNames.length > 1 && (
                  <select
                    value={selectedSheet}
                    onChange={(e) => handleSheetChange(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:border-emerald-500"
                  >
                    {sheetNames.map(s => (
                      <option key={s} value={s}>ورقة: {s}</option>
                    ))}
                  </select>
                )}

                <button
                  onClick={() => {
                    setFile(null);
                    setDetectedFields([]);
                    setErrorMsg(null);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/30 transition-colors"
                >
                  تغيير الملف
                </button>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="text-center py-6 text-emerald-400 space-y-2">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-slate-300">جارٍ تحليل هيكل وأعمدة ملف الإكسل...</p>
            </div>
          )}

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success notice */}
          {successCount !== null && (
            <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-center space-y-1">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">تم توليد {successCount} حقل بنجاح!</h4>
              <p className="text-xs text-slate-300">تم دمج الحقول في نموذج {DEPARTMENTS_METADATA[selectedDept]?.title} وجاهزة للعمل الفوري.</p>
            </div>
          )}

          {/* Detected Fields Preview Table */}
          {detectedFields.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>الحقول المكتشفة تلقائياً ({detectedFields.filter(f => f.selected).length} محددة)</span>
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDetectedFields(prev => prev.map(f => ({ ...f, selected: true })))}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    تحديد الكل
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    type="button"
                    onClick={() => setDetectedFields(prev => prev.map(f => ({ ...f, selected: false })))}
                    className="text-[11px] text-slate-400 hover:underline"
                  >
                    إلغاء التحديد
                  </button>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold sticky top-0 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5 w-10 text-center">اختيار</th>
                      <th className="p-2.5">اسم الحقل / المعيار</th>
                      <th className="p-2.5 w-32">نوع البيان</th>
                      <th className="p-2.5 w-24">القيمة الاسترشادية</th>
                      <th className="p-2.5 w-12 text-center">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                    {detectedFields.map((field, idx) => (
                      <tr key={field.id} className={`hover:bg-slate-800/40 transition-colors ${field.selected ? '' : 'opacity-50'}`}>
                        <td className="p-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={field.selected}
                            onChange={() => handleToggleSelect(idx)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => handleUpdateFieldLabel(idx, e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        <td className="p-2.5">
                          <select
                            value={field.type}
                            onChange={(e) => handleUpdateFieldType(idx, e.target.value as DynamicFieldType)}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs focus:border-emerald-500"
                          >
                            <option value="text">نص عادي</option>
                            <option value="number">رقمي / قياس</option>
                            <option value="select">قائمة خيارات</option>
                            <option value="textarea">نص تفصيلي</option>
                            <option value="date">تاريخ</option>
                            <option value="file">ملف / صورة</option>
                          </select>
                        </td>
                        <td className="p-2.5 text-slate-400 font-mono text-[11px] truncate max-w-[120px]">
                          {field.sampleValue || '—'}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => setDetectedFields(prev => prev.filter((_, i) => i !== idx))}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                            title="حذف من الاستيراد"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            إلغاء
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={detectedFields.filter(f => f.selected).length === 0 || isProcessing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>اعتماد وتوليد {detectedFields.filter(f => f.selected).length} حقل في نموذج {DEPARTMENTS_METADATA[selectedDept]?.title}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
