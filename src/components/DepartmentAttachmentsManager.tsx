import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  File,
  Image as ImageIcon,
  Paperclip,
  Check,
  AlertCircle,
  X
} from 'lucide-react';
import { DepartmentReviewAttachment, DepartmentReviewDecision, DepartmentType } from '../types';

interface DepartmentAttachmentsManagerProps {
  department: DepartmentType;
  departmentName: string;
  reviewerRoleTitle: string;
  reviewerName: string;
  decision: DepartmentReviewDecision;
  onUpdateDecision: (decision: DepartmentReviewDecision) => void;
  attachments: DepartmentReviewAttachment[];
  onUpdateAttachments: (attachments: DepartmentReviewAttachment[]) => void;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'purple' | 'cyan';
}

export const DepartmentAttachmentsManager: React.FC<DepartmentAttachmentsManagerProps> = ({
  department,
  departmentName,
  reviewerRoleTitle,
  reviewerName,
  decision,
  onUpdateDecision,
  attachments = [],
  onUpdateAttachments,
  accentColor = 'blue'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNote, setUploadNote] = useState('');
  const [previewAttachment, setPreviewAttachment] = useState<DepartmentReviewAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to detect file category
  const detectFileType = (fileName: string, mimeType: string): 'pdf' | 'image' | 'word' | 'excel' | 'other' => {
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf' || mimeType.includes('pdf')) return 'pdf';
    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'].includes(ext) || mimeType.startsWith('image/')) return 'image';
    if (['doc', 'docx'].includes(ext) || mimeType.includes('word') || mimeType.includes('officedocument.wordprocessingml')) return 'word';
    if (['xls', 'xlsx', 'csv'].includes(ext) || mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('csv')) return 'excel';
    return 'other';
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  // Handle incoming files
  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: DepartmentReviewAttachment[] = [];
    const readPromises: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      const type = detectFileType(file.name, file.type);
      const promise = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          newItems.push({
            id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name,
            sizeBytes: file.size,
            type,
            mimeType: file.type || 'application/octet-stream',
            uploadedAt: new Date().toISOString(),
            uploadedBy: reviewerName || reviewerRoleTitle,
            dataUrl,
            notes: uploadNote.trim() || `مرفق معزز لقرار ${departmentName}`
          });
          resolve();
        };
        reader.onerror = () => resolve();
        reader.readAsDataURL(file);
      });
      readPromises.push(promise);
    });

    Promise.all(readPromises).then(() => {
      if (newItems.length > 0) {
        onUpdateAttachments([...attachments, ...newItems]);
        setUploadNote('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    });
  };

  // Remove attachment
  const handleRemoveAttachment = (id: string) => {
    const updated = attachments.filter((a) => a.id !== id);
    onUpdateAttachments(updated);
    if (previewAttachment?.id === id) setPreviewAttachment(null);
  };

  // Download attachment
  const handleDownload = (att: DepartmentReviewAttachment) => {
    if (!att.dataUrl) return;
    const a = document.createElement('a');
    a.href = att.dataUrl;
    a.download = att.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // File type icon & badge
  const getFileBadge = (type: string) => {
    switch (type) {
      case 'pdf':
        return {
          icon: <FileText className="w-4 h-4 text-rose-400" />,
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          label: 'PDF'
        };
      case 'image':
        return {
          icon: <ImageIcon className="w-4 h-4 text-amber-400" />,
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          label: 'صورة'
        };
      case 'word':
        return {
          icon: <File className="w-4 h-4 text-blue-400" />,
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          label: 'Word'
        };
      case 'excel':
        return {
          icon: <FileText className="w-4 h-4 text-emerald-400" />,
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          label: 'Excel'
        };
      default:
        return {
          icon: <Paperclip className="w-4 h-4 text-slate-400" />,
          bg: 'bg-slate-700/50 text-slate-300 border-slate-600',
          label: 'مستند'
        };
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-800">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. DECISION SELECTOR - 4 EXPLICIT STATES                       */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>قرار {departmentName} الرسمي:</span>
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              حدد القرار النهائي للإدارة، وقم برفع المستندات أو المذكرات أو الصور التي تعزز هذا القرار.
            </p>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
            {reviewerRoleTitle}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          
          {/* Decision 1: APPROVED */}
          <button
            type="button"
            onClick={() => onUpdateDecision('approved')}
            className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              decision === 'approved'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>اعتماد وموافقة</span>
          </button>

          {/* Decision 2: CONDITIONAL / MODIFICATION */}
          <button
            type="button"
            onClick={() => onUpdateDecision('conditional')}
            className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              decision === 'conditional'
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-amber-300'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span>طلب تعديل واستيفاء</span>
          </button>

          {/* Decision 3: DEFERRED / POSTPONED */}
          <button
            type="button"
            onClick={() => onUpdateDecision('deferred')}
            className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              decision === 'deferred'
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-purple-300'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span>تأجيل القرار للدراسة</span>
          </button>

          {/* Decision 4: REJECTED */}
          <button
            type="button"
            onClick={() => onUpdateDecision('rejected')}
            className={`p-3 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              decision === 'rejected'
                ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30 ring-2 ring-rose-400/50'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-rose-300'
            }`}
          >
            <XCircle className="w-5 h-5" />
            <span>رفض الموقع</span>
          </button>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. ATTACHMENT UPLOADER - PDF / IMAGE / WORD / EXCEL            */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Paperclip className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>المستندات والمرفقات المعززة لقرار {departmentName}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">
                  {attachments.length} مرفق
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">
                متاح رفع تقارير PDF، صور معاينات ميدانية PNG/JPG، مذكرات وورد DOCX، وجداول إكسيل XLSX/CSV.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
              PDF
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              JPG/PNG
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              DOCX
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              XLSX/CSV
            </span>
          </div>
        </div>

        {/* Note input before uploading */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={uploadNote}
            onChange={(e) => setUploadNote(e.target.value)}
            placeholder="مسمى أو وصف توضيحي للمرفق (مثال: مقايسة بند الخرسانات، كروكي مسار خط الغاز، تقرير الحماية المدنية)..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>اختر ملفات لرفعها</span>
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.csv,application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          onChange={(e) => processFiles(e.target.files)}
          className="hidden"
        />

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            processFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <Upload className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                اسحب وأفلت المستندات هنا أو اضغط للاختيار من جهازك
              </p>
              <span className="text-[11px] text-slate-400">
                يمكن رفع مستندات متعددة معاً (بي دي اف، صور عالية الدقة، وورد، إكسيل)
              </span>
            </div>
          </div>
        </div>

        {/* Uploaded Attachments List */}
        {attachments.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 block">
              المرفقات المحفوظة بالملف ({attachments.length}):
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {attachments.map((att) => {
                const badge = getFileBadge(att.type);
                return (
                  <div
                    key={att.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700 shrink-0 mt-0.5">
                          {badge.icon}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white truncate" title={att.name}>
                            {att.name}
                          </h5>
                          {att.notes && (
                            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">
                              {att.notes}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                            <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold ${badge.bg}`}>
                              {badge.label}
                            </span>
                            <span>{formatFileSize(att.sizeBytes)}</span>
                            <span>•</span>
                            <span>{new Date(att.uploadedAt).toLocaleDateString('ar-EG')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {att.dataUrl && (
                          <>
                            <button
                              type="button"
                              onClick={() => setPreviewAttachment(att)}
                              title="معاينة المرفق"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownload(att)}
                              title="تنزيل الملف"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-400" />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          title="حذف هذا المرفق"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. PREVIEW MODAL                                              */}
      {/* ------------------------------------------------------------- */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
                  {getFileBadge(previewAttachment.type).icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white truncate max-w-md">
                    {previewAttachment.name}
                  </h4>
                  <span className="text-xs text-slate-400">
                    {previewAttachment.notes || 'مرفق معزز للقرار'} • {formatFileSize(previewAttachment.sizeBytes)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(previewAttachment)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewAttachment(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-auto bg-slate-950 flex items-center justify-center min-h-[300px]">
              {previewAttachment.type === 'image' && previewAttachment.dataUrl ? (
                <img
                  src={previewAttachment.dataUrl}
                  alt={previewAttachment.name}
                  className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-lg"
                />
              ) : previewAttachment.type === 'pdf' && previewAttachment.dataUrl ? (
                <iframe
                  src={previewAttachment.dataUrl}
                  title={previewAttachment.name}
                  className="w-full h-[65vh] rounded-xl border border-slate-800 bg-white"
                />
              ) : (
                <div className="text-center space-y-3 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mx-auto flex items-center justify-center text-slate-400">
                    {getFileBadge(previewAttachment.type).icon}
                  </div>
                  <h5 className="text-base font-bold text-white">{previewAttachment.name}</h5>
                  <p className="text-xs text-slate-400 max-w-md">
                    مستند {getFileBadge(previewAttachment.type).label} محفوظ بنجاح داخل قاعدة البيانات، اضغط على زر التنزيل لفتحه في البرنامج المخصص بجهازك.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDownload(previewAttachment)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-2 shadow-lg shadow-blue-600/30"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل وفتح الملف ({formatFileSize(previewAttachment.sizeBytes)})</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
