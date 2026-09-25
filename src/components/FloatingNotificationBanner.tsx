import React, { useEffect, useState, useRef } from 'react';
import { Bell, Volume2, X, ArrowLeft, AlertTriangle, Radio } from 'lucide-react';
import { InAppNotificationItem } from '../utils/inAppMessagingService';

interface FloatingNotificationBannerProps {
  onOpenNotificationCenter: () => void;
}

export const FloatingNotificationBanner: React.FC<FloatingNotificationBannerProps> = ({
  onOpenNotificationCenter
}) => {
  const [activeNotification, setActiveNotification] = useState<InAppNotificationItem | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const originalTitleRef = useRef<string>(typeof document !== 'undefined' ? document.title : '');
  const titleIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      originalTitleRef.current = document.title;
    }
  }, []);

  useEffect(() => {
    const handleNewMessage = (e: any) => {
      if (e.detail) {
        const notif: InAppNotificationItem = e.detail;
        setActiveNotification(notif);
        
        // Trigger shaking animation on arrival
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 1200);

        // Physical device vibration (if supported)
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            if (notif.priority === 'urgent' || notif.priority === 'critical') {
              navigator.vibrate([300, 150, 300, 150, 450]);
            } else {
              navigator.vibrate([200, 100, 250]);
            }
          } catch {}
        }

        // Flashing document tab title to catch user's eye if the app is in background/another tab
        if (typeof document !== 'undefined') {
          if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
          let toggle = false;
          const alertPrefix = notif.priority === 'urgent' || notif.priority === 'critical' ? '🚨 [تنبيه عاجل]' : '🔔 [إشعار جديد]';
          titleIntervalRef.current = setInterval(() => {
            document.title = toggle ? `${alertPrefix} ${notif.title}` : originalTitleRef.current;
            toggle = !toggle;
          }, 1000);
        }
      }
    };

    window.addEventListener('cng_new_inapp_message', handleNewMessage);
    return () => {
      window.removeEventListener('cng_new_inapp_message', handleNewMessage);
      if (titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current);
        if (typeof document !== 'undefined') {
          document.title = originalTitleRef.current;
        }
      }
    };
  }, []);

  // Clear title flash on user focus or click
  const clearTitleAlert = () => {
    if (titleIntervalRef.current) {
      clearInterval(titleIntervalRef.current);
      titleIntervalRef.current = null;
    }
    if (typeof document !== 'undefined' && originalTitleRef.current) {
      document.title = originalTitleRef.current;
    }
  };

  useEffect(() => {
    const handleWindowFocus = () => {
      clearTitleAlert();
    };
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, []);

  // Auto-dismiss after 10 seconds
  useEffect(() => {
    if (!activeNotification) return;
    const timer = setTimeout(() => {
      setActiveNotification(null);
      clearTitleAlert();
    }, 10000);
    return () => clearTimeout(timer);
  }, [activeNotification]);

  if (!activeNotification) return null;

  const isUrgent = activeNotification.priority === 'urgent' || activeNotification.priority === 'critical';

  return (
    <>
      {/* Inline styles for keyframe shake & pulsating background */}
      <style>{`
        @keyframes notifShake {
          0%, 100% { transform: translate3d(0, 0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate3d(-6px, 0, 0) rotate(-1deg); }
          20%, 40%, 60%, 80% { transform: translate3d(6px, 0, 0) rotate(1deg); }
        }
        @keyframes pulseGlowUrgent {
          0%, 100% {
            background-color: rgba(69, 10, 10, 0.95);
            box-shadow: 0 0 35px rgba(225, 29, 72, 0.7), 0 0 15px rgba(239, 68, 68, 0.5);
            border-color: rgba(244, 63, 94, 1);
          }
          50% {
            background-color: rgba(15, 23, 42, 0.95);
            box-shadow: 0 0 15px rgba(225, 29, 72, 0.3), 0 0 5px rgba(239, 68, 68, 0.2);
            border-color: rgba(225, 29, 72, 0.5);
          }
        }
        @keyframes pulseGlowNormal {
          0%, 100% {
            background-color: rgba(6, 78, 59, 0.95);
            box-shadow: 0 0 30px rgba(16, 185, 129, 0.6), 0 0 10px rgba(20, 184, 166, 0.4);
            border-color: rgba(52, 211, 153, 1);
          }
          50% {
            background-color: rgba(15, 23, 42, 0.95);
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.2), 0 0 5px rgba(20, 184, 166, 0.2);
            border-color: rgba(16, 185, 129, 0.5);
          }
        }
        .animate-notif-shake {
          animation: notifShake 0.9s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animate-pulse-glow-urgent {
          animation: pulseGlowUrgent 1.8s infinite ease-in-out;
        }
        .animate-pulse-glow-normal {
          animation: pulseGlowNormal 2.2s infinite ease-in-out;
        }
      `}</style>

      <div 
        id="floating-notification-banner-container"
        className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-6 z-[9999] max-w-md w-full transition-all duration-300 ${
          isShaking ? 'animate-notif-shake' : ''
        }`}
      >
        {/* Pulsing Outer Radar Aura to draw immediate peripheral vision */}
        <div className={`absolute -inset-1.5 rounded-3xl opacity-75 blur-md animate-pulse pointer-events-none ${
          isUrgent ? 'bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600' : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500'
        }`} />

        <div className={`relative p-4 rounded-2xl shadow-2xl border-2 backdrop-blur-md transition-all ${
          isUrgent ? 'animate-pulse-glow-urgent' : 'animate-pulse-glow-normal'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {/* Shaking & Pulsing Bell Icon with Live Wave */}
              <div className={`relative w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                isUrgent 
                  ? 'bg-rose-500/30 text-rose-300 border-rose-400/60 shadow-lg shadow-rose-600/40' 
                  : 'bg-emerald-500/30 text-emerald-200 border-emerald-400/60 shadow-lg shadow-emerald-600/30'
              }`}>
                {isUrgent ? (
                  <AlertTriangle className="w-6 h-6 animate-bounce text-rose-300" />
                ) : (
                  <Bell className="w-6 h-6 animate-bounce text-emerald-200" />
                )}
                {/* Active radar ping dot */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isUrgent ? 'bg-rose-400' : 'bg-emerald-400'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                    isUrgent ? 'bg-rose-500' : 'bg-emerald-500'
                  }`} />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1.5 ${
                    isUrgent 
                      ? 'bg-rose-500/30 text-rose-200 border-rose-400/50' 
                      : 'bg-emerald-500/30 text-emerald-100 border-emerald-400/50'
                  }`}>
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>{isUrgent ? 'تنبيه عاجل ورنين مستمر 🔔' : 'إشعار ورسالة داخلية جديدة ✉️'}</span>
                  </span>
                  <span className="text-[11px] text-slate-300">
                    من: <strong className="text-white">{activeNotification.senderName}</strong>
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-black text-white line-clamp-1 drop-shadow-sm">
                  {activeNotification.title}
                </h4>

                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                  {activeNotification.body}
                </p>

                {activeNotification.stationTitle && (
                  <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                    <span>الموقع / المحطة:</span>
                    <span className="underline">{activeNotification.stationTitle}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setActiveNotification(null);
                clearTitleAlert();
              }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Button & Audio status */}
          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
              <Volume2 className="w-4 h-4 animate-pulse text-amber-300" />
              <span>جاري تشغيل الرنين والاهتزاز</span>
            </div>

            <button
              onClick={() => {
                setActiveNotification(null);
                clearTitleAlert();
                onOpenNotificationCenter();
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black text-white shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                isUrgent 
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/60' 
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/50'
              }`}
            >
              <span>فتح صندوق الرسائل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
