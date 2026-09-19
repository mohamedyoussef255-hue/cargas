import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Edit2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Clock, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Wrench, 
  Layers, 
  Save, 
  Filter, 
  Search,
  Sparkles,
  Lock,
  FileSpreadsheet,
  Table
} from 'lucide-react';
import { DepartmentRole, CustomFormField, FormChangeRequest } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';

interface AdminFormCustomizerProps {
  customFields: CustomFormField[];
  onUpdateFields: (fields: CustomFormField[]) => void;
  changeRequests: FormChangeRequest[];
  onUpdateChangeRequests: (requests: FormChangeRequest[]) => void;
  initialDept?: DepartmentRole;
  onPreviewDepartment?: (dept: DepartmentRole) => void;
}

export const AdminFormCustomizer: React.FC<AdminFormCustomizerProps> = ({
  customFields,
  onUpdateFields,
  changeRequests,
  onUpdateChangeRequests,
  initialDept = 'operations',
  onPreviewDepartment,
}) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentRole>(initialDept);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Add Field Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newLabel, setNewLabel] = useState<string>('');
  const [newType, setNewType] = useState<CustomFormField['type']>('text');
  const [newSection, setNewSection] = useState<string>('بيانات المعدات والآلات');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newRequired, setNewRequired] = useState<boolean>(true);
  const [newOptionsStr, setNewOptionsStr] = useState<string>('');
  const [newDefaultVal, setNewDefaultVal] = useState<string>('');

  // Edit Field State
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState<string>('');
  const [editSection, setEditSection] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');

  const deptMeta = DEPARTMENTS_METADATA[selectedDept] || DEPARTMENTS_METADATA.operations;

  // Filtered fields for selected department
  const filteredFields = customFields.filter(f => {
    if (f.department !== selectedDept) return false;
    if (!searchTerm) return true;
    return f.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (f.section && f.section.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Pending requests for approval
  const pendingRequests = changeRequests.filter(r => r.status === 'pending');

  // Toggle Field Visibility (إظهار / إخفاء)
  const handleToggleVisibility = (fieldId: string) => {
    const updated = customFields.map(f => {
      if (f.id === fieldId) {
        return { ...f, visible: !f.visible };
      }
      return f;
    });
    onUpdateFields(updated);
  };

  // Delete Field
  const handleDeleteField = (fieldId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحقل من نموذج الإدارة؟')) {
      const updated = customFields.filter(f => f.id !== fieldId);
      onUpdateFields(updated);
    }
  };

  // Start Editing Field
  const handleStartEdit = (field: CustomFormField) => {
    setEditingFieldId(field.id);
    setEditLabel(field.label);
    setEditSection(field.section || '');
    setEditDescription(field.description || '');
  };

  // Save Edit Field
  const handleSaveEdit = (fieldId: string) => {
    const updated = customFields.map(f => {
      if (f.id === fieldId) {
        return {
          ...f,
          label: editLabel.trim() || f.label,
          section: editSection.trim() || f.section,
          description: editDescription.trim() || f.description,
        };
      }
      return f;
    });
    onUpdateFields(updated);
    setEditingFieldId(null);
  };

  // Add New Field
  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const options = newType === 'select' && newOptionsStr
      ? newOptionsStr.split(',').map(s => s.trim()).filter(Boolean)
      : undefined;

    const newField: CustomFormField = {
      id: `fld-${selectedDept}-${Date.now()}`,
      department: selectedDept,
      label: newLabel.trim(),
      key: `custom_${Date.now().toString(36)}`,
      type: newType,
      options,
      required: newRequired,
      visible: true,
      defaultValue: newDefaultVal || undefined,
      description: newDescription.trim() || undefined,
      section: newSection.trim() || 'بيانات عامة',
      createdBy: 'مدير النظام',
      createdAt: new Date().toLocaleDateString('ar-EG')
    };

    onUpdateFields([...customFields, newField]);
    setIsAddModalOpen(false);
    setNewLabel('');
    setNewDescription('');
    setNewOptionsStr('');
    setNewDefaultVal('');
  };

  // Approve Change Request from Department (including Word/Excel file table imports)
  const handleApproveRequest = (request: FormChangeRequest) => {
    // 1. If the request has parsed fields from an attached Word or Excel file
    if (request.parsedFields && request.parsedFields.length > 0) {
      const importedFields: CustomFormField[] = request.parsedFields.map((fld, idx) => ({
        id: `fld-${request.department}-${Date.now()}-${idx}`,
        department: request.department,
        label: fld.label,
        key: fld.key || `custom_${Date.now().toString(36)}_${idx}`,
        type: (fld.type as any) || 'text',
        options: fld.options,
        required: false,
        visible: true,
        section: fld.section || request.proposedSection || 'جداول معتمدة من الملف',
        description: `تم استيراده واعتماده من ملف (${request.attachedFileName || 'مرفق'}) المعتمد من مدير عام ${request.departmentName}`,
        createdBy: `إدارة النظام (اعتماد ملف: ${request.requesterName})`,
        createdAt: new Date().toLocaleDateString('ar-EG')
      }));
      onUpdateFields([...customFields, ...importedFields]);
    } else if (request.requestType === 'add_field') {
      // Single field addition
      const newField: CustomFormField = {
        id: `fld-${request.department}-${Date.now()}`,
        department: request.department,
        label: request.fieldLabel,
        key: request.fieldKey || `custom_${Date.now().toString(36)}`,
        type: (request.fieldType as any) || 'text',
        required: false,
        visible: true,
        section: request.proposedSection || 'حقول معتمدة جديدة',
        description: `تم اعتماده بناء على طلب ${request.requesterName}: ${request.justification}`,
        createdBy: `إدارة النظام (بناء على طلب: ${request.requesterName})`,
        createdAt: new Date().toLocaleDateString('ar-EG')
      };
      onUpdateFields([...customFields, newField]);
    }

    // 2. Mark request as approved
    const updatedRequests = changeRequests.map(r => {
      if (r.id === request.id) {
        return {
          ...r,
          status: 'approved' as const,
          reviewedBy: 'مدير النظام العام',
          reviewedAt: new Date().toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          adminNotes: request.parsedFields && request.parsedFields.length > 0 
            ? `تم اعتماد واستيراد ${request.parsedFields.length} حقول من ملف ${request.attachedFileName || 'المرفق'} بنجاح.`
            : 'تم اعتماد وإدراج الحقل بنجاح في استمارة الإدارة.'
        };
      }
      return r;
    });
    onUpdateChangeRequests(updatedRequests);
  };

  // Reject Change Request
  const handleRejectRequest = (requestId: string) => {
    const reason = window.prompt('سبب عدم الاعتماد أو الرفض للطلب:', 'غير مطابق للاشتراطات القياسية الموحدة');
    if (reason === null) return;

    const updatedRequests = changeRequests.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'rejected' as const,
          reviewedBy: 'مدير النظام العام',
          reviewedAt: new Date().toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          adminNotes: reason
        };
      }
      return r;
    });
    onUpdateChangeRequests(updatedRequests);
  };

  const departmentsList: DepartmentRole[] = [
    'operations',
    'marketing',
    'projects',
    'hse',
    'technical',
    'licensing',
    'legal',
    'financial'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Centralized Control Directive */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                إدارة النظام • التحكم المركزي في استمارات وحقول الإدارات
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Super Admin Form Builder
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
              يمكنك كمدير للنظام تعديل صفحات بيانات وحقول الإدارات (إضافة، حذف، تعديل، إظهار، إخفاء). ولا يُسمح لأي إدارة بالتعديل إلا بعد مخاطبة الإدارة العامة واعتماد الطلب من هذه اللوحة.
            </p>
          </div>
        </div>

        {/* Counter of Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shrink-0 animate-pulse">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>{pendingRequests.length} طلبات تعديل معلقة من الإدارات</span>
          </div>
        )}
      </div>

      {/* Pending Change Requests Queue (If any exist) */}
      {pendingRequests.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 bg-amber-950/30 border-b border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                طلبات تعديل النماذج المقدمة من الإدارات بانتظار الاعتماد
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              {pendingRequests.length} طلب جديد
            </span>
          </div>

          <div className="p-4 divide-y divide-slate-800">
            {pendingRequests.map((req) => (
              <div key={req.id} className="py-4 first:pt-2 last:pb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-800 text-slate-200 border border-slate-700">
                      {req.departmentName}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {req.fieldLabel}
                    </span>
                    {req.attachedFileName ? (
                      <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1">
                        {req.attachedFileType === 'excel' || req.attachedFileType === 'csv' ? (
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span>ملف مرفق: {req.attachedFileName} ({req.attachedFileSize || 'ملف'})</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        نوع البيان: {req.fieldType}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300">
                    <strong className="text-amber-300">المبررات: </strong>
                    {req.justification}
                  </p>

                  {/* If parsed fields exist from Word/Excel */}
                  {req.parsedFields && req.parsedFields.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300">
                        <span className="flex items-center gap-1">
                          <Table className="w-3.5 h-3.5" />
                          <span>الجداول والحقول المستخرجة من الملف المرفق:</span>
                        </span>
                        <span className="text-slate-400 font-mono">({req.parsedFields.length} حقول)</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {req.parsedFields.map((pf, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300 flex items-center gap-1">
                            <span>{pf.label}</span>
                            <span className="text-amber-400 font-mono text-[9px]">[{pf.type}]</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>مقدم الطلب: <strong className="text-slate-200">{req.requesterName}</strong></span>
                    <span>القسم المقترح: {req.proposedSection || 'عام'}</span>
                    <span>تاريخ الإرسال: {req.submittedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleRejectRequest(req.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>رفض الطلب</span>
                  </button>

                  <button
                    onClick={() => handleApproveRequest(req)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {req.parsedFields && req.parsedFields.length > 0
                        ? `اعتماد واستيراد كافة الجداول (${req.parsedFields.length} حقول)`
                        : 'اعتماد وتضمين الحقل فوراً'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Department Schema Management Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        
        {/* Department Selector Tabs */}
        <div className="px-4 sm:px-6 pt-4 border-b border-slate-800 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {departmentsList.map((dept) => {
            const meta = DEPARTMENTS_METADATA[dept];
            const isSelected = selectedDept === dept;
            const count = customFields.filter(f => f.department === dept).length;

            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border-t border-x ${
                  isSelected
                    ? 'bg-slate-800 text-emerald-300 border-slate-700 shadow-sm'
                    : 'bg-transparent text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
                }`}
              >
                <span>{meta.title.split(' ')[1] || meta.title}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Department Overview Bar */}
        <div className="p-4 sm:p-6 bg-slate-800/40 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                حقول {deptMeta.title}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {deptMeta.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {deptMeta.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث في مسميات الحقول والأقسام..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Live Preview Button */}
            {onPreviewDepartment && (
              <button
                type="button"
                onClick={() => onPreviewDepartment(selectedDept)}
                title={`معاينة شاشة ومدير عام ${deptMeta.title} مباشرة كما ستظهر له`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>معاينة صفحة الإدارة قبل الإرسال</span>
              </button>
            )}

            {/* Add Field Button */}
            <button
              onClick={() => {
                setNewSection(selectedDept === 'operations' ? 'بيانات المعدات والآلات' : 'بيانات عامة');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حقل جديد</span>
            </button>
          </div>
        </div>

        {/* Fields List Table / Grid */}
        <div className="p-4 sm:p-6 space-y-3">
          {filteredFields.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl space-y-3">
              <Sliders className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">لا توجد حقول مطابقة للبحث حالياً</p>
              <p className="text-slate-500">يمكنك إضافة حقل جديد بالنقر على زر &quot;إضافة حقل جديد&quot; أعلاه.</p>
            </div>
          ) : (
            filteredFields.map((field) => {
              const isEditing = editingFieldId === field.id;

              return (
                <div
                  key={field.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !field.visible
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            مسمى الحقل:
                          </label>
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            القسم الداخلي:
                          </label>
                          <input
                            type="text"
                            value={editSection}
                            onChange={(e) => setEditSection(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          وصف الحقل أو تعليمات الملء:
                        </label>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => setEditingFieldId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={() => handleSaveEdit(field.id)}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>حفظ التعديل</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {field.label}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                            {field.type}
                          </span>
                          {field.required && (
                            <span className="px-1.5 py-0.2 text-[10px] rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              إلزامي
                            </span>
                          )}
                          {field.section && (
                            <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800/80 text-emerald-400 border border-emerald-500/20">
                              {field.section}
                            </span>
                          )}
                          {!field.visible && (
                            <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-500 border border-slate-700">
                              مخفي حالياً
                            </span>
                          )}
                        </div>

                        {field.description && (
                          <p className="text-xs text-slate-400">
                            {field.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                          <span>المعرف: {field.key}</span>
                          <span>أنشئ بواسطة: {field.createdBy || 'مدير النظام'}</span>
                        </div>
                      </div>

                      {/* Action Controls for Admin */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        {/* Visibility Toggle Button */}
                        <button
                          onClick={() => handleToggleVisibility(field.id)}
                          title={field.visible ? 'إخفاء الحقل من استمارة الإدارة' : 'إظهار الحقل'}
                          className={`p-2 rounded-lg border transition-colors ${
                            field.visible
                              ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-slate-700'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-500 border-slate-700'
                          }`}
                        >
                          {field.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleStartEdit(field)}
                          title="تعديل مسمى أو إعدادات الحقل"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteField(field.id)}
                          title="حذف الحقل نهائياً"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 border border-slate-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add New Field Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  إضافة حقل جديد لـ {deptMeta.title}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddField} className="p-6 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  مسمى الحقل:
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="مثال: ضغط سحب الغاز من الخط الرئيسي (Bar)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    نوع البيانات:
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="text">نص (Text)</option>
                    <option value="number">رقم / قياس (Number)</option>
                    <option value="select">قائمة خيارات (Select)</option>
                    <option value="boolean">منطقي نعم/لا (Boolean)</option>
                    <option value="textarea">فقرة تفصيلية (Textarea)</option>
                    <option value="date">تاريخ (Date)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    القسم المقترح:
                  </label>
                  <input
                    type="text"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    placeholder="مثال: بيانات المعدات والآلات"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {newType === 'select' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    خيارات القائمة (مفصولة بفاصلة):
                  </label>
                  <input
                    type="text"
                    value={newOptionsStr}
                    onChange={(e) => setNewOptionsStr(e.target.value)}
                    placeholder="خيار 1, خيار 2, خيار 3"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  شرح أو وصف إرشادي للحقل:
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="ملاحظة أو شرط تعبئة الحقل..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-new-required"
                  checked={newRequired}
                  onChange={(e) => setNewRequired(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0"
                />
                <label htmlFor="chk-new-required" className="text-xs text-slate-300 cursor-pointer">
                  حقل إلزامي يجب تعبئته في استمارة الإدارة
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>تأكيد الإضافة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
