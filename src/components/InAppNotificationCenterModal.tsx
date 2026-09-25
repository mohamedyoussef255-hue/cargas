import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Inbox, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Clock, 
  Trash2, 
  Building2, 
  MapPin, 
  Radio, 
  Sliders, 
  CheckCheck, 
  ExternalLink, 
  Sparkles, 
  Mail, 
  ShieldAlert, 
  Smartphone, 
  Laptop,
  Play
} from 'lucide-react';
import { DepartmentRole, MonitoringSession, CNGStation } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import { 
  InAppNotificationItem, 
  getInAppNotificationsForRole, 
  sendInAppNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteInAppNotification 
} from '../utils/inAppMessagingService';
import { 
  playNotificationSound, 
  isSoundNotificationEnabled, 
  setSoundNotificationEnabled, 
  getNotificationVolume, 
  setNotificationVolume, 
  isBrowserNotificationSupported, 
  getBrowserNotificationPermission, 
  requestBrowserNotificationPermission, 
  triggerSystemNotification,
  SoundType 
} from '../utils/audioNotificationService';

interface InAppNotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: DepartmentRole | 'admin' | string | null;
  currentDepartment?: DepartmentRole | 'admin' | string | null;
  sessions?: MonitoringSession[];
  stations?: CNGStation[];
  onSelectSession?: (session: MonitoringSession) => void;
}

export const InAppNotificationCenterModal: React.FC<InAppNotificationCenterModalProps> = ({
  isOpen,
  onClose,
  currentUserRole = 'admin',
  currentDepartment,
  sessions = [],
  stations = [],
  onSelectSession
}) => {
  const effectiveUserRole = currentDepartment || currentUserRole || 'admin';
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose' | 'settings'>('inbox');
  const [notifications, setNotifications] = useState<InAppNotificationItem[]>([]);
  const [filterPriority, setFilterPriority] = useState<'all' | 'unread' | 'urgent'>('all');
  
  // Compose form state
  const [recipientDept, setRecipientDept] = useState<string>('all');
  const [msgTitle, setMsgTitle] = useState<string>('');
  const [msgBody, setMsgBody] = useState<string>('');
  const [msgPriority, setMsgPriority] = useState<'normal' | 'urgent' | 'critical'>('urgent');
  const [msgCategory, setMsgCategory] = useState<'correspondence' | 'assignment' | 'urgent_alert' | 'survey_invite' | 'report_share' | 'general'>('correspondence');
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [sendSuccessNotice, setSendSuccessNotice] = useState<string | null>(null);

  // Settings state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(isSoundNotificationEnabled());
  const [volume, setVolume] = useState<number>(getNotificationVolume());
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(getBrowserNotificationPermission());
  const [testNotice, setTestNotice] = useState<string | null>(null);

  // Load and refresh notifications
  const reloadNotifications = () => {
    const list = getInAppNotificationsForRole(effectiveUserRole);
    setNotifications(list);
  };

  useEffect(() => {
    if (isOpen) {
      reloadNotifications();
    }
  }, [isOpen, effectiveUserRole]);

  useEffect(() => {
    const handleUpdate = () => reloadNotifications();
    window.addEventListener('cng_notifications_updated', handleUpdate);
    window.addEventListener('cng_new_inapp_message', handleUpdate);
    return () => {
      window.removeEventListener('cng_notifications_updated', handleUpdate);
      window.removeEventListener('cng_new_inapp_message', handleUpdate);
    };
  }, [effectiveUserRole]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filterPriority === 'unread') return !n.isRead;
    if (filterPriority === 'urgent') return n.priority === 'urgent' || n.priority === 'critical';
    return true;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgTitle.trim() || !msgBody.trim()) {
      alert('يرجى كتابة عنوان الرسالة ونصها بالكامل.');
      return;
    }

    const currentSenderMeta = effectiveUserRole && effectiveUserRole !== 'admin' 
      ? DEPARTMENTS_METADATA[effectiveUserRole as DepartmentRole] 
      : { title: 'إدارة النظام والتحكم المركزي' };

    const selectedStation = sessions.find(s => s.id === selectedStationId) || stations.find(s => s.id === selectedStationId);
    const stationName = selectedStation 
      ? ('stationName' in selectedStation ? (selectedStation as any).stationName : (selectedStation as any).name)
      : undefined;

    const recipientLabel = recipientDept === 'all' 
      ? 'كافة الإدارات' 
      : (DEPARTMENTS_METADATA[recipientDept as DepartmentRole]?.title || recipientDept);

    sendInAppNotification({
      senderRole: (effectiveUserRole as any) || 'admin',
      senderName: currentSenderMeta?.title || 'إدارة النظام',
      recipientRole: recipientDept as any,
      recipientName: recipientLabel,
      title: msgTitle.trim(),
      body: msgBody.trim(),
      priority: msgPriority,
      category: msgCategory,
      stationId: selectedStation?.id,
      stationTitle: stationName,
      actionLabel: selectedStation ? 'فتح ملف المحطة' : undefined
    });

    setSendSuccessNotice(`تم بنجاح إرسال الرسالة إلى [${recipientLabel}] مع تشغيل نغمة الرنين وإرسال الإشعار الخارجي!`);
    setMsgTitle('');
    setMsgBody('');
    setSelectedStationId('');

    setTimeout(() => {
      setSendSuccessNotice(null);
      setActiveTab('inbox');
    }, 2200);
  };

  const handleRequestPermission = async () => {
    const res = await requestBrowserNotificationPermission();
    setBrowserPermission(res);
    if (res === 'granted') {
      triggerSystemNotification({
        title: 'منظومة كارجاس - تم تفعيل الإشعارات بنجاح!',
        body: 'ستصلك الآن كافة التنبيهات والرنين الصوتي حتى عند إغلاق التطبيق أو استخدام تطبيق آخر.',
        soundType: 'ringtone'
      });
      setTestNotice('تم تفعيل الإشعارات الخارجية بنجاح وإرسال إشعار تجريبي بنغمة الرنين!');
    } else {
      setTestNotice('تم رفض الإذن من المتصفح. يمكنك تفعيله يدوياً من إعدادات موقع المتصفح.');
    }
    setTimeout(() => setTestNotice(null), 4000);
  };

  const handleTestSound = (type: SoundType) => {
    playNotificationSound(type);
    setTestNotice(`تم تشغيل نغمة [${type === 'ringtone' ? 'الرنين المزدوج 🔔' : type === 'chime' ? 'التنبيه الهادئ 🎵' : 'صفارة الطوارئ 🚨'}] بنجاح.`);
    setTimeout(() => setTestNotice(null), 3000);
  };

  const handleTestOutsideNotification = () => {
    triggerSystemNotification({
      title: 'رنين تجريبي: تنبيه وارد من كارجاس NGV',
      body: 'هذا إشعار تجريبي يعمل داخل وخارج النظام مع نغمة رنين صوتية كاملة.',
      soundType: 'ringtone'
    });
    setTestNotice('تم إرسال إشعار رنان تجريبي للنظام بنجاح!');
    setTimeout(() => setTestNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white">
                  منظومة الإرسال المباشر والإشعارات الرنانة
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  إرسال داخلي دون الخروج للتطبيقات
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                إرسال واستقبال المراسلات، التكليفات، والتنبيهات الصوتية ونغمات الرنين داخل وخارج النظام.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-6 shrink-0 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-black border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'inbox'
                ? 'border-indigo-500 text-white bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>صندوق الوارد والرسائل</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">
                {unreadCount} جديد
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-black border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'compose'
                ? 'border-indigo-500 text-white bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>إرسال خطاب / تكليف داخلي فوري</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-black border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-indigo-500 text-white bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>إعدادات الرنين والتنبيهات الخارجية</span>
            {browserPermission === 'granted' ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="الإشعارات الخارجية مفعلة" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="مطلوب تفعيل الإشعارات" />
            )}
          </button>
        </div>

        {/* Global Feedback Banner */}
        {testNotice && (
          <div className="m-4 mb-0 p-3 bg-indigo-950/80 border border-indigo-500/50 rounded-xl text-xs text-indigo-300 flex items-center justify-between shadow animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{testNotice}</span>
            </div>
            <button onClick={() => setTestNotice(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: INBOX & RECEIVED NOTIFICATIONS */}
          {/* ========================================================================= */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              
              {/* Filter & Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-400 ml-1">تصفية الرسائل:</span>
                  <button
                    onClick={() => setFilterPriority('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filterPriority === 'all'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    الكل ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilterPriority('unread')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filterPriority === 'unread'
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    غير مقروء ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilterPriority('urgent')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filterPriority === 'urgent'
                        ? 'bg-amber-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    العاجلة والرنين
                  </button>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead(currentUserRole)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
                      title="تحديد كافة الرسائل كمقروءة"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تحديد الكل كمقروء</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleTestSound('ringtone')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-bold border border-indigo-500/30 cursor-pointer"
                    title="تجربة رنين التنبيهات"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>رنين 🔔</span>
                  </button>
                </div>
              </div>

              {/* Messages List */}
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center bg-slate-950/50 border border-dashed border-slate-800 rounded-3xl space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                    <Mail className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">لا توجد رسائل أو تنبيهات في هذا التصنيف</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    يمكنك إرسال خطاب أو تكليف داخلي فوري لأي إدارة من خلال تبويب "إرسال خطاب / تكليف داخلي".
                  </p>
                  <button
                    onClick={() => setActiveTab('compose')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow cursor-pointer"
                  >
                    إرسال رسالة الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notif) => {
                    const isUrgent = notif.priority === 'urgent' || notif.priority === 'critical';

                    return (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                          !notif.isRead
                            ? isUrgent
                              ? 'bg-rose-950/20 border-rose-500/50 shadow-md'
                              : 'bg-indigo-950/20 border-indigo-500/40 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                              isUrgent 
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                                : 'bg-slate-800 text-indigo-400 border-slate-700'
                            }`}>
                              {isUrgent ? <AlertTriangle className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-xs sm:text-sm font-black text-white">
                                  {notif.title}
                                </h4>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  notif.priority === 'critical'
                                    ? 'bg-rose-600 text-white border-rose-400'
                                    : notif.priority === 'urgent'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}>
                                  {notif.priority === 'critical' ? 'طارئ ورنين 🚨' : notif.priority === 'urgent' ? 'عاجل ورنين 🔔' : 'عادي ✉️'}
                                </span>
                                {!notif.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="رسالة جديدة وغير مقروءة" />
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 flex-wrap">
                                <span>من: <strong className="text-slate-200">{notif.senderName}</strong></span>
                                <span>•</span>
                                <span>إلى: <strong className="text-slate-200">{notif.recipientName}</strong></span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                                  <Clock className="w-3 h-3" />
                                  {notif.dateStr}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {!notif.isRead && (
                              <button
                                onClick={() => markNotificationAsRead(notif.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
                                title="تحديد كمقروء"
                              >
                                <CheckCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteInAppNotification(notif.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                              title="حذف الرسالة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed pr-12">
                          {notif.body}
                        </p>

                        {/* Station link if attached */}
                        {notif.stationTitle && (
                          <div className="mr-12 p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>المحطة الميدانية المرتبطة: {notif.stationTitle}</span>
                            </div>
                            {onSelectSession && notif.stationId && (
                              <button
                                onClick={() => {
                                  const target = sessions.find(s => s.id === notif.stationId);
                                  if (target) {
                                    onSelectSession(target);
                                    onClose();
                                  }
                                }}
                                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                              >
                                فتح وفحص المحطة الآن ←
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: COMPOSE NEW IN-APP DISPATCH / LETTER */}
          {/* ========================================================================= */}
          {activeTab === 'compose' && (
            <form onSubmit={handleSendMessage} className="space-y-4">
              
              {sendSuccessNotice && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 shadow animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold">{sendSuccessNotice}</span>
                </div>
              )}

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Recipient Department */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>الإدارة المستلمة للخطاب / التكليف:</span>
                    </label>
                    <select
                      value={recipientDept}
                      onChange={(e) => setRecipientDept(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="all">📢 كافة الإدارات التخصصية (تعميم عام)</option>
                      <option value="marketing">إدارة التسويق وتطوير الأعمال</option>
                      <option value="operations">إدارة التشغيل والصيانة</option>
                      <option value="projects">إدارة المشروعات والرفع المساحي</option>
                      <option value="hse">إدارة السلامة والصحة المهنية والأمن الصناعي</option>
                      <option value="technical">إدارة الشؤون الفنية وشبكات الغاز</option>
                      <option value="licensing">إدارة التراخيص والتصاريح الحكومية</option>
                      <option value="legal">إدارة الشؤون القانونية والعقود</option>
                      <option value="financial">إدارة الجدوى الاقتصادية والمالية</option>
                    </select>
                  </div>

                  {/* Priority & Ringtone Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>درجة الأهمية ونغمة الرنين الصوتية:</span>
                    </label>
                    <select
                      value={msgPriority}
                      onChange={(e) => setMsgPriority(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="urgent">🔔 عاجل - مع رنين صوتي رسمي مزدوج</option>
                      <option value="critical">🚨 طارئ جداً - مع صفارة طوارئ ورنين متكرر</option>
                      <option value="normal">✉️ عادي - مع نغمة تنبيه هادئة</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">نوع الإرسال الداخلي:</label>
                    <select
                      value={msgCategory}
                      onChange={(e) => setMsgCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="correspondence">مخاطبة ومراسلة رسمية</option>
                      <option value="assignment">تكليف معاينة ميدانية فورية</option>
                      <option value="urgent_alert">تنبيه عاجل (أكثر من 48 ساعة)</option>
                      <option value="survey_invite">دعوة معاينة / رابط رصد</option>
                      <option value="report_share">مشاركة تقرير فني</option>
                      <option value="general">إشعار عام</option>
                    </select>
                  </div>

                  {/* Station Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>ربط بمحطة أو موقع فحص (اختياري):</span>
                    </label>
                    <select
                      value={selectedStationId}
                      onChange={(e) => setSelectedStationId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="">بدون ربط بمحطة محددة</option>
                      {sessions.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.code} - {s.title} ({s.locationName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    موضوع الخطاب / عنوان التكليف:
                  </label>
                  <input
                    type="text"
                    value={msgTitle}
                    onChange={(e) => setMsgTitle(e.target.value)}
                    placeholder="مثال: استعجال اعتماد مسافات الأمان NFPA لمحطة الرماية"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    نص الخطاب / تفاصيل التكليف والتعليمات:
                  </label>
                  <textarea
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    rows={4}
                    placeholder="اكتب التوجيهات أو الملاحظات المطلوبة هنا. ستظهر للمستلم فورياً وتطلق نغمة الرنين وإشعار النظام الخارجي..."
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-xl p-3 focus:outline-none focus:border-indigo-500 leading-relaxed"
                    required
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    يتم التسليم فورياً في صندوق وارد الإدارة مع إطلاق نغمة الرنين دون الحاجة لتطبيقات وسيطة.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال داخلي مباشر في المنظومة (مع رنين وتنبيه)</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: RINGTONE & OUTSIDE SYSTEM NOTIFICATIONS SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Audio Ringtone Controls */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">
                        نغمة الرنين والتنبيهات الصوتية الداخلية
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        إصدار رنين هاتفي/مكتبي واضح عبر Web Audio API عند ورود أي مراسلة أو تنبيه عاجل
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const next = !soundEnabled;
                      setSoundEnabled(next);
                      setSoundNotificationEnabled(next);
                      if (next) playNotificationSound('ringtone');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      soundEnabled
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span>{soundEnabled ? 'الرنين الصوتي مفعل' : 'الرنين الصوتي مكتوم'}</span>
                  </button>
                </div>

                {/* Volume Slider */}
                {soundEnabled && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-300 font-bold shrink-0">مستوى صوت الرنين:</span>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setVolume(val);
                        setNotificationVolume(val);
                      }}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-emerald-400 font-bold shrink-0">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                )}

                {/* Ringtone Audition Buttons */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs text-slate-400 block font-bold">تجربة نغمات الرنين المتاحة:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => handleTestSound('ringtone')}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>رنين الهاتف الرسمي (Double Ring)</span>
                    </button>

                    <button
                      onClick={() => handleTestSound('chime')}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-indigo-400" />
                      <span>نغمة التنبيه الهادئ (4-Tone Chime)</span>
                    </button>

                    <button
                      onClick={() => handleTestSound('urgent')}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 text-xs font-bold text-slate-200 transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-rose-400" />
                      <span>صفارة الطوارئ والتنبيه العاجل (أكثر من 48 ساعة)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Outside-the-App Background Push Notifications */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-950 border border-indigo-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">
                        إشعارات النظام الخارجية (حتى عند إغلاق التطبيق)
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        استقبال إشعارات على شاشة القفل وسطح المكتب وشريط مهام الهاتف والكمبيوتر عبر Web Notifications &amp; Service Worker
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {browserPermission === 'granted' ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>مفعلة وتعمل بالخارج</span>
                      </span>
                    ) : (
                      <button
                        onClick={handleRequestPermission}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                      >
                        <Bell className="w-4 h-4" />
                        <span>طلب إذن التنبيهات الخارجية الآن</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <Laptop className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">أجهزة الكمبيوتر واللابتوب:</strong>
                      <span className="text-slate-400 leading-relaxed">
                        يظهر إشعار نظام التشغيل (Windows / macOS / Linux) في أسفل الشاشة مصحوباً بنغمة الرنين حتى لو كان المتصفح مصغراً.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">الهواتف الذكية والأجهزة اللوحية:</strong>
                      <span className="text-slate-400 leading-relaxed">
                        يصل إشعار Push Notification على شاشة القفل وستارة الإشعارات مصحوباً باهتزاز ورنين الجهاز.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleTestOutsideNotification}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-indigo-400" />
                    <span>إرسال إشعار تجريبي فوري لشاشة جهازك (Test Push)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
