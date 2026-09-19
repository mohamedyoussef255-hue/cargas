import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  RefreshCw, 
  Zap, 
  ZapOff, 
  Play, 
  Pause, 
  CheckCircle2, 
  Undo2, 
  Sparkles, 
  Clock, 
  MapPin, 
  Flame, 
  Car, 
  Bus, 
  Eye, 
  AlertCircle,
  Volume2,
  VolumeX,
  Plus,
  Navigation,
  Satellite,
  Radio,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { MonitoringSession, VehicleType, VEHICLE_TYPES, DetectionRecord } from '../types';
import { playVehicleBeep } from '../utils/audio';
import { CargasNgvLogo } from './CargasNgvLogo';

interface CameraMonitoringSessionProps {
  session: MonitoringSession | null;
  onUpdateSession: (updatedSession: MonitoringSession) => void;
  onCompleteSession: (completedSession: MonitoringSession) => void;
  onStartNewSession: () => void;
  onCancelSession?: () => void;
}

export const CameraMonitoringSession: React.FC<CameraMonitoringSessionProps> = ({
  session,
  onUpdateSession,
  onCompleteSession,
  onStartNewSession,
  onCancelSession,
}) => {
  // Video and Stream States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);

  // AI Automatic Recognition States
  const [isAiScanning, setIsAiScanning] = useState<boolean>(true);
  const [isAnalyzingFrame, setIsAnalyzingFrame] = useState<boolean>(false);
  const [lastAiDetection, setLastAiDetection] = useState<{
    type: VehicleType;
    confidence: number;
    arabicName: string;
    description?: string;
  } | null>(null);

  // Timer and counter animation states
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(session ? session.durationSeconds : 0);
  const [lastAddedType, setLastAddedType] = useState<VehicleType | null>(null);

  // Live GPS tracking and auto coordinates capture
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(() => 
    session ? session.coordinates : { lat: 29.9880, lng: 31.1350 }
  );
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(() => session?.gpsAccuracyMeters ?? null);
  const [isSyncingGps, setIsSyncingGps] = useState<boolean>(false);
  const [gpsSyncedNotice, setGpsSyncedNotice] = useState<string | null>(null);

  // Auto-acquire / update GPS coordinates and query reverse geocoding from satellite & internet
  const syncLiveGps = useCallback((silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) setGpsSyncedNotice("نظام تحديد المواقع (GPS) غير مدعوم في هذا المتصفح.");
      return;
    }
    if (!silent) setIsSyncingGps(true);
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newCoords = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        };
        const accuracy = Math.round(pos.coords.accuracy || 6);
        const alt = pos.coords.altitude ? Math.round(pos.coords.altitude) : undefined;
        setCurrentCoords(newCoords);
        setGpsAccuracy(accuracy);

        let resolvedAddress = session?.resolvedAddress || '';
        let district = session?.district || '';
        let governorate = session?.governorate || 'القاهرة';
        let roadType = session?.roadType || 'طريق رئيسي';
        let locationName = session?.locationName || 'موقع الرصد الميداني';
        let onlinePoiData = session?.onlinePoiData || '';

        try {
          // Query backend reverse geocoding with Egyptian geography fallback
          const geoRes = await fetch('/api/reverse-geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: newCoords.lat, lng: newCoords.lng }),
          });

          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.success) {
              governorate = geoData.governorate || governorate;
              district = geoData.district || district;
              roadType = geoData.roadType || roadType;
              locationName = geoData.road || geoData.district || locationName;
              resolvedAddress = geoData.fullAddress || resolvedAddress;
              onlinePoiData = geoData.onlinePoiData || '';
            }
          }
        } catch (geoErr) {
          console.warn("Reverse geocode fetch failed:", geoErr);
        }

        setIsSyncingGps(false);
        setGpsSyncedNotice(`📍 تم تحديد الموقع تلقائياً: ${resolvedAddress || locationName} (${governorate} - ${district})`);
        setTimeout(() => setGpsSyncedNotice(null), 6000);

        if (session) {
          onUpdateSession({
            ...session,
            coordinates: newCoords,
            locationName,
            governorate,
            district,
            roadType,
            resolvedAddress,
            onlinePoiData,
            autoLocationResolved: true,
            gpsAccuracyMeters: accuracy,
            elevationMeters: alt ?? session.elevationMeters,
            autoGpsCaptured: true,
            gpsCaptureTimestamp: new Date().toISOString(),
          });
        }
      },
      (err) => {
        console.warn("GPS sync error in session:", err);
        setIsSyncingGps(false);
        if (!silent) {
          setGpsSyncedNotice("تعذر جلب إحداثيات GPS تلقائياً. تأكد من إعطاء إذن الموقع للمتصفح.");
          setTimeout(() => setGpsSyncedNotice(null), 4000);
        }
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, [session, onUpdateSession]);

  // Trigger auto-GPS immediately on mount or start of active session
  useEffect(() => {
    if (session && session.status === 'active' && !session.autoGpsCaptured) {
      syncLiveGps(true);
    }
  }, [session?.id, session?.status]);

  // Start Camera
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check for torch capability
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = videoTrack.getCapabilities?.() as { torch?: boolean } | undefined;
        setHasTorch(!!capabilities?.torch);
      }
    } catch (err: unknown) {
      console.warn("Camera access failed:", err);
      const errMsg = err instanceof Error ? err.message : "تعذر تشغيل الكاميرا";
      setCameraError(errMsg);
    }
  }, [stream]);

  // Handle switching camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Handle Torch / Flashlight
  const toggleTorch = async () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack && hasTorch) {
      try {
        const nextTorch = !isTorchOn;
        await (videoTrack as any).applyConstraints({
          advanced: [{ torch: nextTorch }],
        });
        setIsTorchOn(nextTorch);
      } catch (err) {
        console.error("Torch error:", err);
      }
    }
  };

  // Mount camera on session active
  useEffect(() => {
    if (session && session.status === 'active') {
      startCamera(facingMode);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [session?.id, session?.status]);

  // Session timer tick
  useEffect(() => {
    if (!session || session.status !== 'active') return;

    const timer = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        if (next % 10 === 0) {
          onUpdateSession({
            ...session,
            durationSeconds: next,
          });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session, onUpdateSession]);

  // Manual Vehicle Count Addition
  const handleAddVehicle = useCallback((type: VehicleType, method: 'manual_tap' | 'camera_ai' = 'manual_tap', confidence = 0.95, desc?: string) => {
    if (!session) return;

    if (isSoundEnabled) {
      playVehicleBeep(type);
    }

    setLastAddedType(type);
    setTimeout(() => setLastAddedType(null), 800);

    const now = new Date();
    const timeDisplay = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newDetection: DetectionRecord = {
      id: 'det-' + Date.now(),
      sessionId: session.id,
      timestamp: now.toISOString(),
      timeDisplay,
      vehicleType: type,
      confidence,
      method,
      description: desc || VEHICLE_TYPES[type].label,
    };

    const updatedCounts = {
      ...session.counts,
      [type]: (session.counts[type] || 0) + 1,
    };

    const updatedSession: MonitoringSession = {
      ...session,
      counts: updatedCounts,
      durationSeconds: elapsedSeconds,
      detections: [newDetection, ...session.detections.slice(0, 49)], // keep last 50
    };

    onUpdateSession(updatedSession);
  }, [session, elapsedSeconds, isSoundEnabled, onUpdateSession]);

  // Undo Last Count
  const handleUndoLast = () => {
    if (!session || session.detections.length === 0) return;
    const last = session.detections[0];
    const updatedCounts = {
      ...session.counts,
      [last.vehicleType]: Math.max(0, (session.counts[last.vehicleType] || 0) - 1),
    };

    const updatedSession: MonitoringSession = {
      ...session,
      counts: updatedCounts,
      detections: session.detections.slice(1),
    };

    onUpdateSession(updatedSession);
  };

  // Automated AI Classification Frame Capture
  const captureAndClassifyFrame = useCallback(async () => {
    if (!session || session.status !== 'active' || isAnalyzingFrame || !isAiScanning) return;
    if (!videoRef.current || videoRef.current.readyState < 2) return;

    try {
      setIsAnalyzingFrame(true);
      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 270;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.65);

      const response = await fetch('/api/classify-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.detected && data.vehicleType && VEHICLE_TYPES[data.vehicleType as VehicleType]) {
          const detectedType = data.vehicleType as VehicleType;
          setLastAiDetection({
            type: detectedType,
            confidence: Math.round((data.confidence || 0.9) * 100),
            arabicName: data.arabicName || VEHICLE_TYPES[detectedType].label,
            description: data.description,
          });

          if (isSoundEnabled) {
            playVehicleBeep('ai_detected');
          }

          handleAddVehicle(
            detectedType, 
            'camera_ai', 
            data.confidence || 0.9, 
            data.description || `رصد ذكي بالكاميرا: ${VEHICLE_TYPES[detectedType].label}`
          );

          setTimeout(() => setLastAiDetection(null), 3000);
        }
      }
    } catch (err) {
      console.warn("Frame analysis error:", err);
    } finally {
      setIsAnalyzingFrame(false);
    }
  }, [session, isAnalyzingFrame, isAiScanning, isSoundEnabled, handleAddVehicle]);

  // AI Scanning Interval (Fast 1800ms for continuous traffic monitoring)
  useEffect(() => {
    if (!session || session.status !== 'active' || !isAiScanning) return;
    const interval = setInterval(() => {
      captureAndClassifyFrame();
    }, 1800);

    return () => clearInterval(interval);
  }, [session, isAiScanning, captureAndClassifyFrame]);

  // Keyboard Shortcuts (1-5 for quick counting)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!session || session.status !== 'active') return;
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.key === '1') handleAddVehicle('private');
      if (e.key === '2') handleAddVehicle('taxi');
      if (e.key === '3') handleAddVehicle('microbus');
      if (e.key === '4') handleAddVehicle('van');
      if (e.key === '5') handleAddVehicle('minibus');
      if (e.key === '6') handleAddVehicle('pickup');
      if (e.key === '7') handleAddVehicle('bus');
      if (e.key === '8') handleAddVehicle('motorcycle');
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndoLast();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session, handleAddVehicle]);

  // Format Elapsed Time
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate totals and statistics
  const totalVehicles = session 
    ? Object.values(session.counts).reduce((acc, val) => acc + val, 0) 
    : 0;

  // Commercial fleet targets for CNG conversion (Microbus + Taxi + Suzuki Van + Peugeot Station)
  const cngCommercialTargets = session
    ? (session.counts.microbus + session.counts.taxi + session.counts.suzuki_van + session.counts.peugeot_station)
    : 0;

  const cngTargetPercentage = totalVehicles > 0 
    ? Math.round((cngCommercialTargets / totalVehicles) * 100) 
    : 0;

  const flowPerHour = elapsedSeconds > 60 
    ? Math.round((totalVehicles / elapsedSeconds) * 3600) 
    : totalVehicles;

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-3xl bg-slate-800/90 border border-slate-700/80 shadow-2xl inline-block">
            <CargasNgvLogo size="xl" layout="vertical" subtitle="منظومة الرصد الميداني لكاميرات الطرق • كارجاس NGV" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          لا توجد جلسة رصد ميداني نشطة حالياً
        </h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
          قم ببدء جلسة رصد جديدة لتشغيل كاميرا الموبايل وتصنيف السيارات المارة (ملاكي، ميكروباص، تاكسي، فان، بيجو ستيشن) وحفظ بيانات الموقع والزمن.
        </p>
        <button
          id="btn-start-first-session"
          onClick={onStartNewSession}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>بدء جلسة رصد جديدة الآن</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Hidden canvas for snapshotting */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Session Context Bar */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <CargasNgvLogo size="sm" showText={false} />
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Camera className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                {session.code}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white truncate max-w-[280px] sm:max-w-md">
                {session.title}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                {session.locationName} ({session.governorate})
              </span>
              {/* Live Auto-GPS Coordinates Pill */}
              <button
                type="button"
                onClick={() => syncLiveGps(false)}
                disabled={isSyncingGps}
                title="تحديث ورفع إحداثيات الموقع والزمن الحقيقي تلقائياً"
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] hover:bg-emerald-900/50 transition-all cursor-pointer font-mono"
              >
                <Satellite className={`w-3 h-3 text-emerald-400 ${isSyncingGps ? 'animate-spin' : ''}`} />
                <span>GPS: {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}</span>
                {gpsAccuracy && (
                  <span className="text-[10px] text-emerald-400/80">±{gpsAccuracy}م</span>
                )}
                <span className="text-[10px] text-emerald-400 underline decoration-dotted">رفع الإحداثيات</span>
              </button>
              <span className="hidden md:flex items-center gap-1">
                <Flame className="w-3 h-3 text-emerald-400" />
                أقرب محطة: {session.nearestStation}
              </span>
            </div>
            {gpsSyncedNotice && (
              <div className="text-[11px] text-emerald-400 font-medium animate-fade-in mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{gpsSyncedNotice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Counters and Control buttons */}
        <div className="flex items-center gap-2 sm:gap-3 mr-auto">
          {/* Duration Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-sm font-bold tracking-wider">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          {/* Sound Mute/Unmute */}
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            title={isSoundEnabled ? "كتم الصوت" : "تشغيل الصوت"}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Pause / Resume */}
          <button
            id="btn-pause-resume"
            onClick={() => {
              onUpdateSession({
                ...session,
                status: session.status === 'active' ? 'paused' : 'active',
                durationSeconds: elapsedSeconds,
              });
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              session.status === 'active'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {session.status === 'active' ? (
              <>
                <Pause className="w-4 h-4" />
                <span>إيقاف مؤقت</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>استئناف</span>
              </>
            )}
          </button>

          {/* Complete Session */}
          <button
            id="btn-complete-session"
            onClick={() => {
              onCompleteSession({
                ...session,
                status: 'completed',
                endTime: new Date().toISOString(),
                durationSeconds: elapsedSeconds,
              });
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>إنهاء وحفظ الجلسة</span>
          </button>

          {/* Cancel Session */}
          <button
            id="btn-cancel-session"
            onClick={() => setShowCancelConfirm(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer"
          >
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>إلغاء الجلسة</span>
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">إلغاء جلسة الرصد الميداني؟</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              هل أنت متأكد من إلغاء جلسة الرصد الحالية؟ سيتم الخروج دون حفظ أي تغييرات أو بيانات رصد جديدة.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                id="btn-confirm-cancel-session"
                onClick={() => {
                  if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                  }
                  setShowCancelConfirm(false);
                  if (onCancelSession) {
                    onCancelSession();
                  }
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                نعم، إلغاء الجلسة
              </button>
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
              >
                تراجع واستمرار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automated Geocoding & Internet POI Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-lg">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-white text-sm">
                {session.resolvedAddress || session.locationName || 'الموقع الجغرافي المحدد'}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium text-[11px] border border-emerald-500/30">
                {session.governorate} • {session.district || 'المنطقة المحيطة'}
              </span>
              {session.roadType && (
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700">
                  {session.roadType}
                </span>
              )}
              {session.autoLocationResolved && (
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 text-[10px] border border-sky-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  موقع مؤكد أوتوماتيكياً
                </span>
              )}
            </div>
            {session.onlinePoiData ? (
              <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>بيانات الموقع عبر شبكات الإنترنت:</strong> {session.onlinePoiData}</span>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                الإحداثيات الحالية: {currentCoords.lat}° N, {currentCoords.lng}° E (دقة ±{gpsAccuracy || 6}م)
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() => syncLiveGps(false)}
            disabled={isSyncingGps}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGps ? 'animate-spin' : ''}`} />
            <span>{isSyncingGps ? 'جاري التحديث...' : 'تحديث الموقع التلقائي من الإنترنت'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Camera Stream & Quick Tally Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left/Main Column: Camera Viewport (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-2xl bg-black overflow-hidden border border-slate-700/80 shadow-2xl flex items-center justify-center">
            
            {/* Live Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* If camera error or inactive */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
                <CameraOff className="w-12 h-12 text-rose-400 mb-3" />
                <h3 className="text-white font-bold text-base mb-1">
                  تعذر الوصول إلى كاميرا الموبايل
                </h3>
                <p className="text-slate-400 text-xs max-w-sm mb-4">
                  {cameraError}. يرجى التأكد من منح الإذن للكاميرا أو استخدام أزرار الرصد اليدوية السريعة بالأسفل.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => startCamera(facingMode)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                  >
                    إعادة محاولة الاتصال بالكاميرا
                  </button>
                  <button
                    onClick={() => setCameraError(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    استمرار بوضع المحاكاة الميدانية
                  </button>
                </div>
              </div>
            )}

            {/* Interactive Detection Zone Overlay / Grid */}
            <div className="absolute inset-0 pointer-events-none z-10">
              
              {/* Corner targeting brackets */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400/80"></div>
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400/80"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400/80"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400/80"></div>

              {/* Scanning line for AI scanner */}
              {isAiScanning && (
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-scanline"></div>
              )}

              {/* Center Virtual Tripwire Line */}
              <div className="absolute top-1/2 inset-x-0 -translate-y-1/2 flex items-center justify-between px-6 border-b border-dashed border-emerald-500/40">
                <span className="text-[10px] text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded font-mono">
                  خط بوابة الرصد الميداني
                </span>
                <span className="text-[10px] text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded font-mono">
                  DETECTION LINE
                </span>
              </div>

              {/* AI Detection Banner Overlay */}
              {lastAiDetection && (
                <div className="absolute top-4 inset-x-4 flex justify-center animate-bounce">
                  <div className="bg-emerald-950/90 border border-emerald-400 text-emerald-200 px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-300 animate-spin" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          تم رصد: {lastAiDetection.arabicName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-mono">
                          دقة {lastAiDetection.confidence}%
                        </span>
                      </div>
                      {lastAiDetection.description && (
                        <p className="text-[11px] text-emerald-300/80 truncate max-w-xs">
                          {lastAiDetection.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Status Badge in camera */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-slate-700 text-[11px] text-slate-300 flex items-center gap-1.5 font-mono">
                  <span className={`w-2 h-2 rounded-full ${session.status === 'active' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                  {session.status === 'active' ? 'LIVE STREAM' : 'PAUSED'}
                </span>
                {isAnalyzingFrame && (
                  <span className="px-2 py-1 rounded-lg bg-emerald-900/80 text-emerald-200 text-[10px] flex items-center gap-1 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    تحليل إطار...
                  </span>
                )}
              </div>
            </div>

            {/* Camera Floating Controls */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              {/* Switch Front/Back camera */}
              <button
                id="btn-switch-camera"
                onClick={toggleFacingMode}
                title="تبديل الكاميرا (الأمامية / الخلفية)"
                className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Flashlight toggle */}
              {hasTorch && (
                <button
                  id="btn-toggle-torch"
                  onClick={toggleTorch}
                  title="تشغيل / إطفاء الفلاش"
                  className={`p-2.5 rounded-xl backdrop-blur-md border transition-colors ${
                    isTorchOn 
                      ? 'bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/30' 
                      : 'bg-black/60 hover:bg-black/80 text-white border-white/10'
                  }`}
                >
                  {isTorchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                </button>
              )}

              {/* AI Auto-scan toggle */}
              <button
                id="btn-toggle-ai-scanner"
                onClick={() => setIsAiScanning(!isAiScanning)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all ${
                  isAiScanning 
                    ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 shadow-sm' 
                    : 'bg-black/60 text-slate-400 border-white/10'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiScanning ? 'text-emerald-300 animate-spin' : ''}`} />
                <span>الرصد الذكي: {isAiScanning ? 'نشط تلقائياً' : 'متوقف'}</span>
              </button>

              {/* Instant Vehicle Passing Test Trigger */}
              <button
                type="button"
                id="btn-simulate-ai-detection"
                onClick={() => {
                  const types: VehicleType[] = ['private', 'taxi', 'microbus', 'van', 'minibus', 'pickup', 'bus', 'motorcycle'];
                  const randomType = types[Math.floor(Math.random() * types.length)];
                  const cfg = VEHICLE_TYPES[randomType];
                  setLastAiDetection({
                    type: randomType,
                    confidence: 97,
                    arabicName: cfg.label,
                    description: `رصد ذكي بالكاميرا: ${cfg.label} - تتبع الحركة في المسار`,
                  });
                  if (isSoundEnabled) playVehicleBeep('ai_detected');
                  handleAddVehicle(randomType, 'camera_ai', 0.97, `رصد ذكي بالكاميرا: ${cfg.label}`);
                  setTimeout(() => setLastAiDetection(null), 3000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md bg-amber-500/20 text-amber-300 border border-amber-400/50 hover:bg-amber-500/30 transition-all cursor-pointer"
                title="تجربة فورية لخوارزمية الرصد التلقائي وزيادة العداد أمام الكاميرا"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>تجربة رصد سيارة فوري</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Ribbon under Camera */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-3 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">إجمالي السيارات</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {totalVehicles}
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-3 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">معدل التدفق (ساعة)</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                {flowPerHour}
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/70 rounded-xl p-3 text-center">
              <span className="text-[11px] text-slate-400 block mb-0.5">هدف تحويل الغاز (أجرة/نقل)</span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                  {cngTargetPercentage}%
                </span>
                <span className="text-[10px] text-slate-400">
                  ({cngCommercialTargets})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Speed Rapid Tally Buttons (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl flex-1 flex flex-col">
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm sm:text-base">
                  لوحة الرصد السريع المباشر
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {/* Undo Button */}
                <button
                  id="btn-undo-vehicle"
                  onClick={handleUndoLast}
                  disabled={session.detections.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  title="تراجع عن آخر رصد (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>تراجع</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              اضغط على أي نوع لتسجيل عبور المركبة فوراً أمام الكاميرا (تدعم النقر السريع باللمس واختصارات لوحة المفاتيح 1 إلى 8):
            </p>

            {/* The 8 Required Vehicle Classification Categories */}
            <div className="grid grid-cols-1 gap-2 flex-1 max-h-[620px] overflow-y-auto pr-1 no-scrollbar">
              {(['private', 'taxi', 'microbus', 'van', 'minibus', 'pickup', 'bus', 'motorcycle'] as VehicleType[]).map((typeKey) => {
                const config = VEHICLE_TYPES[typeKey];
                const count = session.counts[typeKey] || 0;
                const isJustAdded = lastAddedType === typeKey;

                return (
                  <button
                    key={typeKey}
                    id={`btn-tally-${typeKey}`}
                    onClick={() => handleAddVehicle(typeKey, 'manual_tap')}
                    className={`relative w-full p-2.5 sm:p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 select-none active:scale-[0.98] cursor-pointer ${
                      isJustAdded
                        ? 'bg-emerald-500/30 border-emerald-400 scale-[1.02] shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-900/80 hover:bg-slate-700/50 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {/* Vehicle Info */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${config.badgeBg} ${config.badgeText} border ${config.borderColor}`}>
                        {config.shortcutKey}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm sm:text-base">
                            {config.label}
                          </h4>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${config.badgeBg} ${config.badgeText}`}>
                            {config.cngSuitability === 'مرتفعة جداً' ? 'أولوية غاز قصوى' : config.subLabel}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    {/* Count Display & Tap Bubble */}
                    <div className="flex items-center gap-2 pl-2">
                      <div className="text-left">
                        <span className="text-xl sm:text-2xl font-black text-white font-mono block leading-none">
                          {count}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {totalVehicles > 0 ? `${Math.round((count / totalVehicles) * 100)}%` : '0%'}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Recent Live Detection Stream */}
            <div className="mt-4 pt-3 border-t border-slate-700/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-slate-300">سجل الرصد اللحظي (آخر السيارات)</span>
                <span className="font-mono">{session.detections.length} عملية</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                {session.detections.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-500">
                    لم يتم رصد أي سيارة حتى الآن. ابدأ بتوجيه الكاميرا نحو الطريق أو اضغط على الفئات أعلاه.
                  </div>
                ) : (
                  session.detections.slice(0, 8).map((det) => {
                    const cfg = VEHICLE_TYPES[det.vehicleType];
                    return (
                      <div
                        key={det.id}
                        className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${det.method === 'camera_ai' ? 'bg-emerald-400' : 'bg-blue-400'}`}></span>
                          <span className="font-bold text-white">{cfg.label}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({det.timeDisplay})</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${cfg.badgeBg} ${cfg.badgeText}`}>
                          {det.method === 'camera_ai' ? 'رصد ذكي بالكاميرا' : 'رصد يدوي'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
