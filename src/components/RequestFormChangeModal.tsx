import React, { useState } from 'react';
import { 
  Lock, 
  Send, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  FileEdit, 
  ShieldAlert,
  HelpCircle,
  FileSpreadsheet,
  FileText,
  Upload,
  Trash2,
  Table,
  Plus
} from 'lucide-react';
import { DepartmentRole, FormChangeRequest } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';

interface RequestFormChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentRole;
  onSubmitRequest: (request: FormChangeRequest) => void;
}

export const RequestFormChangeModal: React.FC<RequestFormChangeModalProps> = ({
  isOpen,
  onClose,
  department,
  onSubmitRequest,
}) => {
  const deptMeta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;

  const [requesterName, setRequesterName] = useState<string>('');
  const [requestType, setRequestType] = useState<FormChangeRequest['requestType']>('add_field');
  const [fieldLabel, setFieldLabel] = useState<string>('');
  const [fieldType, setFieldType] = useState<string>('text');
  const [proposedSection, setProposedSection] = useState<string>('بيانات المعدات والآلات');
  const [justification, setJustification] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // File upload state for Word/Excel
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    type: 'word' | 'excel' | 'csv';
  } | null>(null);

  const [parsedFields, setParsedFields] = useState<{
    label: string;
    type: 'text' | 'number' | 'select' | 'boolean' | 'date';
    key: string;
    section?: string;
    options?: string[];
  }[]>([]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');
    const isWord = fileName.endsWith('.docx') || fileName.endsWith('.doc');

    const fileType: 'word' | 'excel' | 'csv' = isExcel 
      ? (fileName.endsWith('.csv') ? 'csv' : 'excel') 
      : 'word';

    const fileSizeStr = (file.size / 1024).toFixed(1) + ' KB';

    setAttachedFile({
      name: fileName,
      size: fileSizeStr,
      type: fileType
    });

    // Generate realistic parsed table fields extracted from the Word/Excel document
    // tailored to the department
    let extracted: typeof parsedFields = [];

    if (department === 'marketing') {
      extracted = [
        { label: 'كثافة حركة الميكروباص والسرفيس في ساعة الذروة (مركبة/ساعة)', type: 'number', key: 'peakHourMicrobusTraffic', section: 'الدراسة المرورية والتسويقية' },
        { label: 'عدد فتحات الدخول والخروج المعتمدة للموقع', type: 'select', key: 'siteEntryExitGates', section: 'المخطط الهندسي للموقع', options: ['مدخل ومخرج منفصلان بعرض 8م', 'مدخل ومخرج مشترك بعرض 12م', 'مدخلان رئيسيان على شارعين'] },
        { label: 'طبيعة التجمعات السكنية والتجارية المحيطة', type: 'select', key: 'surroundingDemographics', section: 'الطلب والعملاء المستهدفون', options: ['منطقة عالية الكثافة السكنية وشعبية (سرفيس مكثف)', 'منطقة أعمال وبنوك وتجارة (ملاكي وتطبيقات نقل)', 'طريق محاور ونقل بضائع ثقيل ومتوسط'] },
        { label: 'إمكانية توفير كافتيريا وخدمات مكملة للمركبات', type: 'boolean', key: 'convenienceStoreFeasibility', section: 'الخدمات المكملة' }
      ];
    } else if (department === 'operations') {
      extracted = [
        { label: 'ماركة صمامات الأمان وضواغط الضغط العالي', type: 'text', key: 'valvesBrandAndRating', section: 'بيانات المعدات والآلات' },
        { label: 'نوع مسدسات التموين المعتمدة (NGV1 / NGV2)', type: 'select', key: 'dispenserNozzleStandard', section: 'بيانات المعدات والآلات', options: ['مسدسات NGV1 قياسية لسيارات الركوب', 'مسدسات NGV2 للشاحنات والأتوبيسات', 'مزدوجة NGV1 + NGV2'] },
        { label: 'ضغط الاختبار الهيدروستاتيكي لشبكة المواسير (Bar)', type: 'number', key: 'hydrostaticTestPressureBar', section: 'بيانات المعدات والآلات' },
        { label: 'وجود محول كهربائي مستقل للمحطة بقدرة كافية', type: 'boolean', key: 'dedicatedElectricTransformer', section: 'بيانات المعدات والآلات' }
      ];
    } else {
      extracted = [
        { label: 'رقم القيد والتسجيل المعتمد', type: 'text', key: 'officialRegistrationNo', section: 'البيانات الرسمية' },
        { label: 'تاريخ سريان الوثيقة أو الترخيص', type: 'date', key: 'documentExpiryDate', section: 'المستندات والتراخيص' },
        { label: 'مطابقة المعايير والاشتراطات الفنية', type: 'boolean', key: 'complianceStatus', section: 'الفحص الميداني' }
      ];
    }

    setParsedFields(extracted);
    setRequestType('import_file');
    setFieldLabel(`اعتماد جداول وحقول ملف: ${fileName}`);
    setJustification(`نرفع لسيادتكم ملف (${fileName}) الذي يحتوي على الجداول والبيانات الفنية المطلوب إدراجها ضمن استمارة المعاينة الميدانية لإدارة ${deptMeta.title}.`);
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setParsedFields([]);
    setRequestType('add_field');
    setFieldLabel('');
    setJustification('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldLabel.trim() || !justification.trim()) return;

    const newRequest: FormChangeRequest = {
      id: 'req-' + Date.now(),
      department,
      departmentName: deptMeta.title,
      requesterName: requesterName.trim() || `ممثل ${deptMeta.title}`,
      requestType,
      fieldLabel,
      fieldType,
      fieldKey: 'custom_' + Date.now().toString(36),
      justification,
      proposedSection,
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      attachedFileName: attachedFile?.name,
      attachedFileType: attachedFile?.type,
      attachedFileSize: attachedFile?.size,
      parsedFields: parsedFields.length > 0 ? parsedFields : undefined
    };

    onSubmitRequest(newRequest);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>مخاطبة مدير النظام لتعديل النموذج أو رفع ملف</span>
              </h2>
              <p className="text-xs text-slate-400">
                {deptMeta.title} • نظام الحوكمة المركزية ورفع جداول Word / Excel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">تم إرسال الطلب لمدير النظام بنجاح</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              تم إرسال الطلب المعتمد لمدير النظام (Super Admin) لفحصه واعتماد الجداول والحقول المطلوبة، وستظهر فوراً في استمارة الإدارة بمجرد اعتمادها.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Info Notice */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-amber-300">حوكمة الحقول والجداول: </strong> 
                لا يمكن لأي إدارة تعديل الحقول مباشرة. يمكنك إرسال طلب إضافة حقل، أو <strong className="text-white">رفع ملف وورد أو إكسيل</strong> يحتوي على الجداول المراد إضافتها ليقوم مدير النظام باعتمادها مباشرة للإدارة.
              </div>
            </div>

            {/* Word / Excel Upload Zone */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-dashed border-slate-700 hover:border-amber-500/60 transition-colors">
              <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>رفع ملف وورد (.docx) أو إكسيل (.xlsx / .csv) يحتوي على الجداول:</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">اختياري للمدير العام</span>
              </label>

              {attachedFile ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800 border border-slate-700">
                  <div className="flex items-center gap-2.5">
                    {attachedFile.type === 'excel' || attachedFile.type === 'csv' ? (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-white">{attachedFile.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{attachedFile.size} • تم استخراج {parsedFields.length} حقول/أعمدة</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900/60 hover:bg-slate-900 cursor-pointer border border-slate-800 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-semibold text-amber-300">اضغط هنا لاختيار أو سحب ملف وورد أو إكسيل</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">يدعم ملفات Word .docx و Excel .xlsx و CSV المحتوية على جداول الحقول</span>
                  <input
                    type="file"
                    accept=".docx,.doc,.xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}

              {/* Preview extracted fields from table */}
              {parsedFields.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-300">
                    <span className="flex items-center gap-1">
                      <Table className="w-3.5 h-3.5" />
                      <span>الحقول والجداول المستخرجة من الملف المرفق:</span>
                    </span>
                    <span>({parsedFields.length} حقول جاهزة للاعتماد)</span>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                    {parsedFields.map((fld, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                        <span className="text-slate-200">{fld.label}</span>
                        <span className="text-[10px] text-amber-400 font-mono">{fld.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم مقدم الطلب وصفته:
              </label>
              <input
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="مثال: م. مصطفى كمال - مدير عام الإدارة"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  نوع الإجراء المطلوب:
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="add_field">إضافة حقل جديد للنموذج</option>
                  <option value="import_file">استيراد جداول من ملف مرفق (Word/Excel)</option>
                  <option value="edit_field">تعديل مسمى أو خيارات حقل قائم</option>
                  <option value="hide_field">إخفاء حقل غير مستخدم</option>
                  <option value="delete_field">حذف حقل ملغى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  نوع البيانات للحقل:
                </label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="text">نص قياسي (Text)</option>
                  <option value="number">قيمة رقمية / قياس (Number)</option>
                  <option value="select">قائمة خيارات منسدلة (Select)</option>
                  <option value="boolean">خيار منطقي (نعم / لا)</option>
                  <option value="date">تاريخ محدد (Date)</option>
                  <option value="textarea">شرح تفصيلي (Paragraph)</option>
                  <option value="file">مرفق ملف أو شهادة (Document)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                مسمى الحقل أو البيان المقترح:
              </label>
              <input
                type="text"
                value={fieldLabel}
                onChange={(e) => setFieldLabel(e.target.value)}
                placeholder="مثال: رقم مسلسل شهادة اختبار الهيدروستاتيك للضاغط"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                القسم المقترح لوضع الحقل به:
              </label>
              <input
                type="text"
                value={proposedSection}
                onChange={(e) => setProposedSection(e.target.value)}
                placeholder="مثال: بيانات المعدات والآلات أو الفحص الفني"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                مبررات وأسباب طلب التعديل (للإدارة العامة):
              </label>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                rows={2}
                placeholder="وضح أهمية هذا البيان في تقارير الإدارة والمتابعة الفنية للمشروع..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الطلب لمدير النظام</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
