import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Building2, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  X, 
  Shield, 
  Briefcase
} from 'lucide-react';
import { DepartmentRole, GeneralManagerItem, DepartmentEmployeeItem } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';

const INITIAL_GENERAL_MANAGERS: GeneralManagerItem[] = [
  {
    id: 'gm-1',
    department: 'projects',
    name: 'م. طارق عبد الرازق',
    phone: '+201001234567',
    email: 'tarek.razek@cargas.com.eg',
    assignedDate: '2022-01-15',
    status: 'active',
    notes: 'الإشراف على المقايسات والأعمال الإنشائية والمدنية'
  },
  {
    id: 'gm-2',
    department: 'operations',
    name: 'م. خالد الصاوي',
    phone: '+201009876543',
    email: 'khaled.sawy@cargas.com.eg',
    assignedDate: '2021-06-10',
    status: 'active',
    notes: 'إدارة أسطول الضواغط، طلمبات التموين، ومراكز التحويل'
  },
  {
    id: 'gm-3',
    department: 'hse',
    name: 'م. حسام البحيري',
    phone: '+201011223344',
    email: 'hossam.boheiry@cargas.com.eg',
    assignedDate: '2023-03-01',
    status: 'active',
    notes: 'الامتثال لكود NFPA والدفاع المدني وتصاريح العمل الساخنة'
  },
  {
    id: 'gm-4',
    department: 'technical',
    name: 'م. محمود الشريف',
    phone: '+201022334455',
    email: 'mahmoud.sherif@cargas.com.eg',
    assignedDate: '2020-09-12',
    status: 'active',
    notes: 'شبكات الغاز الطبيعي، محطات PRMS، وتنسيق خطوط الضغط'
  },
  {
    id: 'gm-5',
    department: 'licensing',
    name: 'أ. أشرف القاضي',
    phone: '+201033445566',
    email: 'ashraf.kadi@cargas.com.eg',
    assignedDate: '2022-08-20',
    status: 'active',
    notes: 'موافقات المحليات، جهاز شؤون البيئة، وتراخيص التشغيل'
  },
  {
    id: 'gm-6',
    department: 'legal',
    name: 'المستشار شريف رمزي',
    phone: '+201044556677',
    email: 'sherif.ramzy@cargas.com.eg',
    assignedDate: '2019-11-05',
    status: 'active',
    notes: 'صياغة العقود وتدقيق سندات الملكية والتوكيلات'
  },
  {
    id: 'gm-7',
    department: 'financial',
    name: 'أ. وائل فهمي',
    phone: '+201055667788',
    email: 'wael.fahmy@cargas.com.eg',
    assignedDate: '2021-04-18',
    status: 'active',
    notes: 'دراسات الجدوى الاقتصادية، حسابات الوفر، والموازنات'
  },
  {
    id: 'gm-8',
    department: 'marketing',
    name: 'م. أحمد الشناوي',
    phone: '+201066778899',
    email: 'ahmed.shennawy@cargas.com.eg',
    assignedDate: '2023-01-10',
    status: 'active',
    notes: 'المسح الميداني، رصد السيارات، وحملات تحويل المركبات'
  }
];

const INITIAL_EMPLOYEES: DepartmentEmployeeItem[] = [
  {
    id: 'emp-101',
    code: 'EMP-0412',
    name: 'م. إبراهيم كمال',
    department: 'projects',
    title: 'مهندس موقع ومسؤول خرسانات',
    phone: '+201112233441',
    roleLevel: 'field_engineer',
    joinDate: '2023-05-15',
    status: 'active'
  },
  {
    id: 'emp-102',
    code: 'EMP-0523',
    name: 'م. رامي زهران',
    department: 'operations',
    title: 'مهندس صيانة ضواغط وميكانيكا',
    phone: '+201112233442',
    roleLevel: 'supervisor',
    joinDate: '2022-09-01',
    status: 'active'
  },
  {
    id: 'emp-103',
    code: 'EMP-0634',
    name: 'كيميائي / سارة المنشاوي',
    department: 'hse',
    title: 'أخصائي سلامة وصحة مهنية',
    phone: '+201112233443',
    roleLevel: 'field_engineer',
    joinDate: '2024-02-10',
    status: 'active'
  },
  {
    id: 'emp-104',
    code: 'EMP-0745',
    name: 'م. ياسر عفيفي',
    department: 'technical',
    title: 'مهندس ضغوط وربط شبكات غاز',
    phone: '+201112233444',
    roleLevel: 'field_engineer',
    joinDate: '2021-11-20',
    status: 'active'
  },
  {
    id: 'emp-105',
    code: 'EMP-0856',
    name: 'أ. وليد الجوهري',
    department: 'licensing',
    title: 'أخصائي متابعة تراخيص وأجهزة مدن',
    phone: '+201112233445',
    roleLevel: 'staff',
    joinDate: '2023-07-08',
    status: 'active'
  },
  {
    id: 'emp-106',
    code: 'EMP-0967',
    name: 'أ. حازم السعدني',
    department: 'financial',
    title: 'محاسب تكاليف وموازنات محطات',
    phone: '+201112233446',
    roleLevel: 'staff',
    joinDate: '2022-04-12',
    status: 'active'
  },
  {
    id: 'emp-107',
    code: 'EMP-1078',
    name: 'م. عمر الألفي',
    department: 'marketing',
    title: 'باحث ميداني ورصد كثافات مرورية',
    phone: '+201112233447',
    roleLevel: 'field_engineer',
    joinDate: '2024-01-05',
    status: 'active'
  }
];

export const AdminStaffManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gms' | 'employees'>('gms');

  // State
  const [generalManagers, setGeneralManagers] = useState<GeneralManagerItem[]>(() => {
    try {
      const stored = localStorage.getItem('cng_general_managers_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_GENERAL_MANAGERS;
  });

  const [employees, setEmployees] = useState<DepartmentEmployeeItem[]>(() => {
    try {
      const stored = localStorage.getItem('cng_department_employees_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EMPLOYEES;
  });

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');

  // Modals for add/edit
  const [showGmModal, setShowGmModal] = useState(false);
  const [editingGm, setEditingGm] = useState<GeneralManagerItem | null>(null);

  const [showEmpModal, setShowEmpModal] = useState(false);
  const [editingEmp, setEditingEmp] = useState<DepartmentEmployeeItem | null>(null);

  // Forms
  const [gmDept, setGmDept] = useState<DepartmentRole>('projects');
  const [gmName, setGmName] = useState('');
  const [gmPhone, setGmPhone] = useState('');
  const [gmEmail, setGmEmail] = useState('');
  const [gmNotes, setGmNotes] = useState('');

  const [empCode, setEmpCode] = useState('');
  const [empName, setEmpName] = useState('');
  const [empDept, setEmpDept] = useState<DepartmentRole>('projects');
  const [empTitle, setEmpTitle] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empRoleLevel, setEmpRoleLevel] = useState<'supervisor' | 'field_engineer' | 'staff'>('field_engineer');

  // Save changes
  const saveGms = (data: GeneralManagerItem[]) => {
    setGeneralManagers(data);
    localStorage.setItem('cng_general_managers_v1', JSON.stringify(data));
  };

  const saveEmps = (data: DepartmentEmployeeItem[]) => {
    setEmployees(data);
    localStorage.setItem('cng_department_employees_v1', JSON.stringify(data));
  };

  const openAddGm = () => {
    setEditingGm(null);
    setGmDept('projects');
    setGmName('');
    setGmPhone('');
    setGmEmail('');
    setGmNotes('');
    setShowGmModal(true);
  };

  const openEditGm = (gm: GeneralManagerItem) => {
    setEditingGm(gm);
    setGmDept(gm.department);
    setGmName(gm.name);
    setGmPhone(gm.phone);
    setGmEmail(gm.email || '');
    setGmNotes(gm.notes || '');
    setShowGmModal(true);
  };

  const handleSaveGm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gmName.trim()) return;

    if (editingGm) {
      const updated = generalManagers.map(g => g.id === editingGm.id ? {
        ...g,
        department: gmDept,
        name: gmName.trim(),
        phone: gmPhone.trim(),
        email: gmEmail.trim(),
        notes: gmNotes.trim()
      } : g);
      saveGms(updated);
    } else {
      const newGm: GeneralManagerItem = {
        id: 'gm-' + Date.now(),
        department: gmDept,
        name: gmName.trim(),
        phone: gmPhone.trim(),
        email: gmEmail.trim(),
        assignedDate: new Date().toISOString().split('T')[0],
        status: 'active',
        notes: gmNotes.trim()
      };
      saveGms([...generalManagers, newGm]);
    }
    setShowGmModal(false);
  };

  const handleDeleteGm = (id: string) => {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا المدير العام من السجل؟')) {
      const updated = generalManagers.filter(g => g.id !== id);
      saveGms(updated);
    }
  };

  const openAddEmp = () => {
    setEditingEmp(null);
    setEmpCode(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
    setEmpName('');
    setEmpDept('projects');
    setEmpTitle('');
    setEmpPhone('');
    setEmpRoleLevel('field_engineer');
    setShowEmpModal(true);
  };

  const openEditEmp = (emp: DepartmentEmployeeItem) => {
    setEditingEmp(emp);
    setEmpCode(emp.code);
    setEmpName(emp.name);
    setEmpDept(emp.department);
    setEmpTitle(emp.title || emp.jobTitle || '');
    setEmpPhone(emp.phone);
    setEmpRoleLevel((emp.roleLevel as 'field_engineer' | 'staff' | 'supervisor') || 'staff');
    setShowEmpModal(true);
  };

  const handleSaveEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empTitle.trim()) return;

    if (editingEmp) {
      const updated = employees.map(emp => emp.id === editingEmp.id ? {
        ...emp,
        code: empCode,
        name: empName.trim(),
        department: empDept,
        title: empTitle.trim(),
        phone: empPhone.trim(),
        roleLevel: empRoleLevel
      } : emp);
      saveEmps(updated);
    } else {
      const newEmp: DepartmentEmployeeItem = {
        id: 'emp-' + Date.now(),
        code: empCode,
        name: empName.trim(),
        department: empDept,
        title: empTitle.trim(),
        phone: empPhone.trim(),
        roleLevel: empRoleLevel,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      saveEmps([...employees, newEmp]);
    }
    setShowEmpModal(false);
  };

  const handleDeleteEmp = (id: string) => {
    if (confirm('هل أنت متأكد من حذف الموظف من قائمة الإدارة؟')) {
      const updated = employees.filter(e => e.id !== id);
      saveEmps(updated);
    }
  };

  const filteredGms = generalManagers.filter(g => {
    const matchSearch = g.name.includes(search) || g.phone.includes(search);
    const matchDept = filterDept === 'all' || g.department === filterDept;
    return matchSearch && matchDept;
  });

  const filteredEmps = employees.filter(e => {
    const matchSearch = e.name.includes(search) || e.code.includes(search) || (e.title || e.jobTitle || '').includes(search);
    const matchDept = filterDept === 'all' || e.department === filterDept;
    return matchSearch && matchDept;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              إدارة الكوادر البشرية: جدول المديرين العموم وجدول الموظفين
            </h3>
            <p className="text-xs text-slate-400">
              تسجيل وتعديل بيانات المديرين العموم والمهندسين والفنيين بكافة إدارات شركة كارجاس
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('gms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'gms'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>جدول المديرين العموم ({generalManagers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'employees'
                ? 'bg-blue-600 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>جدول الموظفين والمهندسين ({employees.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الهاتف أو الكود..."
              className="w-full pr-8 pl-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="all">كافة الإدارات</option>
            <option value="projects">المشروعات</option>
            <option value="operations">التشغيل والصيانة</option>
            <option value="hse">السلامة والصحة المهنية</option>
            <option value="technical">الشؤون الفنية</option>
            <option value="licensing">التراخيص</option>
            <option value="legal">الشؤون القانونية</option>
            <option value="financial">الشؤون المالية</option>
            <option value="marketing">التسويق</option>
          </select>
        </div>

        <div>
          {activeTab === 'gms' ? (
            <button
              onClick={openAddGm}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إضافة مدير عام جديد</span>
            </button>
          ) : (
            <button
              onClick={openAddEmp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إضافة موظف / مهندس جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Tables Content */}
      {activeTab === 'gms' ? (
        /* Table of General Managers */
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">الإدارة التابعة</th>
                <th className="py-3 px-4">اسم المدير العام</th>
                <th className="py-3 px-4">رقم الهاتف / الواتساب</th>
                <th className="py-3 px-4">البريد الإلكتروني</th>
                <th className="py-3 px-4">تاريخ التكليف</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredGms.map((gm) => (
                <tr key={gm.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-amber-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{DEPARTMENTS_METADATA[gm.department]?.title || gm.department}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{gm.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{gm.phone}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{gm.email}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{gm.assignedDate}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      على رأس العمل
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditGm(gm)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                        title="تعديل"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGm(gm.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Table of Employees */
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">كود الموظف</th>
                <th className="py-3 px-4">الاسم</th>
                <th className="py-3 px-4">الإدارة</th>
                <th className="py-3 px-4">المسمى الوظيفي</th>
                <th className="py-3 px-4">رقم الهاتف</th>
                <th className="py-3 px-4">المستوى التنفيذي</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredEmps.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{emp.code}</td>
                  <td className="py-3 px-4 font-bold text-white">{emp.name}</td>
                  <td className="py-3 px-4 text-slate-300">{DEPARTMENTS_METADATA[emp.department]?.title || emp.department}</td>
                  <td className="py-3 px-4 font-medium text-emerald-400">{emp.title}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{emp.phone}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {emp.roleLevel === 'supervisor' ? 'مشرف فني' : emp.roleLevel === 'field_engineer' ? 'مهندس ميداني' : 'كادر إداري'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditEmp(emp)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                        title="تعديل"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmp(emp.id)}
                        className="p-1 rounded bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: General Manager Add/Edit */}
      {showGmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveGm} className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white">
                {editingGm ? 'تعديل بيانات المدير العام' : 'إضافة مدير عام إدارة جديد'}
              </h4>
              <button type="button" onClick={() => setShowGmModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">الإدارة المعين لها:</label>
                <select
                  value={gmDept}
                  onChange={(e) => setGmDept(e.target.value as DepartmentRole)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold"
                >
                  <option value="projects">إدارة المشروعات والأعمال المدنية</option>
                  <option value="operations">إدارة التشغيل والصيانة</option>
                  <option value="hse">إدارة السلامة والأمن الصناعي</option>
                  <option value="technical">الشؤون الفنية وضغوط الشبكات</option>
                  <option value="licensing">التراخيص والموافقات الحكومية</option>
                  <option value="legal">الشؤون القانونية والعقود</option>
                  <option value="financial">الشؤون المالية ودراسات الجدوى</option>
                  <option value="marketing">التسويق والدراسات الميدانية</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">اسم المدير العام:</label>
                <input
                  type="text"
                  required
                  value={gmName}
                  onChange={(e) => setGmName(e.target.value)}
                  placeholder="م. / أ. ..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">الهاتف والواتساب:</label>
                  <input
                    type="text"
                    required
                    value={gmPhone}
                    onChange={(e) => setGmPhone(e.target.value)}
                    placeholder="+2010..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">البريد الرسمي:</label>
                  <input
                    type="email"
                    value={gmEmail}
                    onChange={(e) => setGmEmail(e.target.value)}
                    placeholder="name@cargas.com.eg"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">ملاحظات واختصاصات رئيسية:</label>
                <input
                  type="text"
                  value={gmNotes}
                  onChange={(e) => setGmNotes(e.target.value)}
                  placeholder="ملاحظات مهام التكليف..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowGmModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                حفظ المدير العام
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Employee Add/Edit */}
      {showEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form onSubmit={handleSaveEmp} className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-white">
                {editingEmp ? 'تعديل بيانات الموظف' : 'إضافة موظف / مهندس جديد'}
              </h4>
              <button type="button" onClick={() => setShowEmpModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">كود الموظف:</label>
                  <input
                    type="text"
                    required
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">الإدارة:</label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value as DepartmentRole)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-semibold"
                  >
                    <option value="projects">إدارة المشروعات</option>
                    <option value="operations">إدارة التشغيل والصيانة</option>
                    <option value="hse">إدارة السلامة والصحة المهنية</option>
                    <option value="technical">الشؤون الفنية</option>
                    <option value="licensing">التراخيص</option>
                    <option value="legal">الشؤون القانونية</option>
                    <option value="financial">الشؤون المالية</option>
                    <option value="marketing">التسويق</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">الاسم الرباعي:</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="اسم المهندس / الفني..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">المسمى الوظيفي:</label>
                  <input
                    type="text"
                    required
                    value={empTitle}
                    onChange={(e) => setEmpTitle(e.target.value)}
                    placeholder="مهندس موقع، فني..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">رقم الهاتف:</label>
                  <input
                    type="text"
                    required
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    placeholder="+201..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">المستوى التنفيذي:</label>
                <select
                  value={empRoleLevel}
                  onChange={(e) => setEmpRoleLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                >
                  <option value="supervisor">مشرف فني / مسؤول موقع</option>
                  <option value="field_engineer">مهندس ميداني / استشاري</option>
                  <option value="staff">كادر إداري / أخصائي</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowEmpModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                حفظ الموظف
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
