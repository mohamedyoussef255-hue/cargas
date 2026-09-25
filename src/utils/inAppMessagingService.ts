// In-App Direct Messaging and Notifications Service
// Manages internal dispatching, mailboxes, and synchronization across departments without leaving the app

import { DepartmentRole } from '../types';
import { triggerSystemNotification, SoundType } from './audioNotificationService';

export interface InAppNotificationItem {
  id: string;
  senderRole: DepartmentRole | 'admin' | 'general_manager' | 'landowner';
  senderName: string;
  recipientRole: DepartmentRole | 'all' | 'admin' | 'marketing';
  recipientName: string;
  title: string;
  body: string;
  category: 'assignment' | 'correspondence' | 'urgent_alert' | 'survey_invite' | 'report_share' | 'team_invite' | 'general';
  priority: 'normal' | 'urgent' | 'critical';
  stationId?: string;
  stationTitle?: string;
  actionUrl?: string;
  actionLabel?: string;
  timestamp: string;
  dateStr: string;
  isRead: boolean;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'cng_inapp_notifications_v1';

// Seed initial notifications so the mailbox isn't empty on first open
const INITIAL_NOTIFICATIONS: InAppNotificationItem[] = [
  {
    id: 'notif-init-1',
    senderRole: 'admin',
    senderName: 'المشرف العام على المنظومة',
    recipientRole: 'all',
    recipientName: 'كافة الإدارات التخصصية',
    title: 'تفعيل منظومة الإرسال الداخلي والإشعارات الرنانة المباشرة',
    body: 'تم بنجاح تفعيل نظام الإرسال المباشر داخل المنظومة دون الحاجة للخروج لتطبيقات خارجية، مع دعم الرنين الصوتي والتنبيهات الميدانية حتى خارج المتصفح.',
    category: 'general',
    priority: 'urgent',
    timestamp: new Date().toISOString(),
    dateStr: new Date().toLocaleDateString('ar-EG'),
    isRead: false,
    actionLabel: 'استعراض الإعدادات'
  },
  {
    id: 'notif-init-2',
    senderRole: 'marketing',
    senderName: 'إدارة التسويق وتطوير الأعمال',
    recipientRole: 'operations',
    recipientName: 'إدارة التشغيل والصيانة',
    title: 'طلب مراجعة مواصفات ضاغط الغاز - محطة الرماية التخصصية',
    body: 'يرجى مراجعة وتأكيد قدرة الضاغط الموصى به (1,500 Nm³/h) ومطابقة ضغط الشبكة تمهيداً لاعتماد الدراسة التسويقية.',
    category: 'correspondence',
    priority: 'urgent',
    stationId: 'sess-1',
    stationTitle: 'محطة الرماية التخصصية',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    dateStr: new Date(Date.now() - 3600000).toLocaleDateString('ar-EG'),
    isRead: false,
    actionLabel: 'فتح الاستمارة الفنية'
  }
];

export function getAllInAppNotifications(): InAppNotificationItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
    // Seed initial
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function getInAppNotificationsForRole(role?: string | null): InAppNotificationItem[] {
  const all = getAllInAppNotifications();
  if (!role || role === 'admin') return all;

  return all.filter(item => 
    item.recipientRole === 'all' || 
    item.recipientRole === role || 
    item.senderRole === role
  );
}

export function getUnreadNotificationsCount(role?: string | null): number {
  const relevant = getInAppNotificationsForRole(role);
  return relevant.filter(n => !n.isRead).length;
}

export function sendInAppNotification(
  data: Omit<InAppNotificationItem, 'id' | 'timestamp' | 'dateStr' | 'isRead'>
): InAppNotificationItem {
  const all = getAllInAppNotifications();
  const now = new Date();

  const newItem: InAppNotificationItem = {
    ...data,
    id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: now.toISOString(),
    dateStr: now.toLocaleDateString('ar-EG') + ' ' + now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    isRead: false,
  };

  const updated = [newItem, ...all];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  // Determine sound type based on priority
  let soundType: SoundType = 'ringtone';
  if (data.priority === 'critical') soundType = 'urgent';
  else if (data.priority === 'normal') soundType = 'chime';

  // Trigger sound, vibration, and background system notification
  triggerSystemNotification({
    title: `[كارجاس] ${data.title}`,
    body: `${data.senderName}: ${data.body.substring(0, 100)}${data.body.length > 100 ? '...' : ''}`,
    soundType,
    tag: newItem.id,
    url: '/',
    data: { notifId: newItem.id, stationId: data.stationId }
  });

  // Notify active window event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cng_new_inapp_message', { detail: newItem }));
  }

  return newItem;
}

export function markNotificationAsRead(id: string): void {
  const all = getAllInAppNotifications();
  const updated = all.map(n => n.id === id ? { ...n, isRead: true } : n);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('cng_notifications_updated'));
  } catch {}
}

export function markAllNotificationsAsRead(role?: string | null): void {
  const all = getAllInAppNotifications();
  const updated = all.map(n => {
    if (!role || role === 'admin' || n.recipientRole === 'all' || n.recipientRole === role) {
      return { ...n, isRead: true };
    }
    return n;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('cng_notifications_updated'));
  } catch {}
}

export function deleteInAppNotification(id: string): void {
  const all = getAllInAppNotifications();
  const updated = all.filter(n => n.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('cng_notifications_updated'));
  } catch {}
}
