import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  Check, 
  X,
  Play,
  Pause,
  Save,
  ShieldCheck,
  Settings2,
  Plus,
  Minus,
  Car,
  Sparkles,
  Undo2,
  HelpCircle
} from 'lucide-react';
import { DepartmentRole, MonitoringSession, RecordedVideoSession } from '../types';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';
import { addVideoToArchive, logDepartmentActivity } from '../data/authCredentials';
import { 
  loadDepartmentCameraTasks, 
  CameraInspectionTask, 
  EVENT_CAMERA_TASKS_UPDATED 
} from '../utils/cameraTasksConfig';
import { AdminCameraTasksManager } from './AdminCameraTasksManager';

interface DepartmentDedicatedCameraModalProps {
  isOpen: boolean;
  department: DepartmentRole;
  onClose: () => void;
  onSaveSession?: (session: MonitoringSession) => void;
  defaultLocationName?: string;
  activeSession?: MonitoringSession | null;
  isAdmin?: boolean;
}

export const DepartmentDedicatedCameraModal: React.FC<DepartmentDedicatedCameraModalProps> = ({
  isOpen,
  department,
  onClose,
  onSaveSession,
  defaultLocationName = 'محطة كارجاس - الموقع الميداني',
  activeSession,
  isAdmin = false,
}) => {
  const meta = DEPARTMENTS_METADATA[department] || DEPARTMENTS_METADATA.operations;

  // Session parameters
  const [siteName, setSiteName] = useState(defaultLocationName);
  const [governorate, setGovernorate] = useState('القاهرة');
  const [sessionStartTime] = useState<Date>(new Date());
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const [inspectedItems, setInspectedItems] = useState<string[]>([]);
  const [findingsNotes, setFindingsNotes] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showAdminTasksManager, setShowAdminTasksManager] = useState(false);
  const [marketingActiveView, setMarketingActiveView] = useState<'vehicles' | 'checklist'>(department === 'marketing' ? 'vehicles' : 'checklist');

  // Marketing Quick Vehicle Tally State (Initialized from activeSession if available)
  const [vehicleCounts, setVehicleCounts] = useState<Record<string, number>>(() => ({
    private: activeSession?.counts?.private || 0,
    taxi: activeSession?.counts?.taxi || 0,
    microbus: activeSession?.counts?.microbus || 0,
    van: activeSession?.counts?.van || 0,
    minibus: activeSession?.counts?.minibus || 0,
    pickup: activeSession?.counts?.pickup || 0,
    bus: activeSession?.counts?.bus || 0,
    motorcycle: activeSession?.counts?.motorcycle || 0,
    suzuki_van: activeSession?.counts?.suzuki_van || 0,
    peugeot_station: activeSession?.counts?.peugeot_station || 0,
  }));

  // Undo history stack for mistake correction
  const [tallyHistory, setTallyHistory] = useState<string[]>([]);

  const handleIncVehicle = (type: string) => {
    setVehicleCounts(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + 1
    }));
    setTallyHistory(prev => [type, ...prev.slice(0, 30)]);
  };

  const handleDecVehicle = (type: string) => {
    setVehicleCounts(prev => ({
      ...prev,
      [type]: Math.max(0, (prev[type] || 0) - 1)
    }));
  };

  const handleUndoLastTally = () => {
    if (tallyHistory.length === 0) return;
    const lastType = tallyHistory[0];
    handleDecVehicle(lastType);
    setTallyHistory(prev => prev.slice(1));
  };

  const totalMarketingVehicles = Object.values(vehicleCounts).reduce((a, b) => a + b, 0);

  // Dynamic Camera inspection tasks loaded from config
  const [availableTasks, setAvailableTasks] = useState<CameraInspectionTask[]>(() =>
    loadDepartmentCameraTasks(department, false)
  );

  useEffect(() => {
    const handleTasksUpdate = () => {
      setAvailableTasks(loadDepartmentCameraTasks(department, false));
    };
    window.addEventListener(EVENT_CAMERA_TASKS_UPDATED, handleTasksUpdate);
    return () => {
      window.removeEventListener(EVENT_CAMERA_TASKS_UPDATED, handleTasksUpdate);
    };
  }, [department]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [cameraStreamActive, setCameraStreamActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  // Stop camera tracks immediately and completely release hardware sensor
  const stopCamera = useCallback(() => {
    // 1. Stop all tracks in mediaStreamRef
    if (mediaStreamRef.current) {
      try {
        const tracks = mediaStreamRef.current.getTracks();
        tracks.forEach(track => {
          try {
            track.stop();
          } catch (e) {}
        });
      } catch (err) {
        console.warn('Error stopping camera track in ref:', err);
      }
      mediaStreamRef.current = null;
    }

    // 2. Stop all tracks in state mediaStream if different
    if (mediaStream) {
      try {
        const tracks = mediaStream.getTracks();
        tracks.forEach(track => {
          try {
            track.stop();
          } catch (e) {}
        });
      } catch (e) {}
    }

    // 3. Clear and pause video element completely
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        if (videoRef.current.srcObject) {
          const s = videoRef.current.srcObject as MediaStream;
          s.getTracks?.().forEach(t => {
            try { t.stop(); } catch (e) {}
          });
          videoRef.current.srcObject = null;
        }
        videoRef.current.load();
      } catch (e) {}
    }

    setMediaStream(null);
    setCameraStreamActive(false);
  }, [mediaStream]);

  // Format time for session naming
  const formatTimeName = (date: Date) => {
    const d = date.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const t = date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return `${d} - ${t}`;
  };

  const autoGeneratedTitle = `جلسة رصد وتوثيق (${formatTimeName(sessionStartTime)}) - ${meta.title}`;

  // Timer effect
  useEffect(() => {
    if (!isOpen) return;
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setDurationSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isRecording]);

  // Request camera stream with multi-level robust fallback
  const startCamera = async (facing: 'environment' | 'user') => {
    setCameraError(null);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('المتصفح أو البيئة الحالية لا تدعم استدعاء الكاميرا.');
      setCameraStreamActive(false);
      return;
    }

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
    } catch (e1) {
      console.warn('First camera attempt failed, trying basic facingMode:', e1);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing },
          audio: false
        });
      } catch (e2) {
        console.warn('Second attempt failed, trying fallback video: true:', e2);
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        } catch (e3: any) {
          console.error('All camera attempts failed:', e3);
          setCameraError(e3.message || 'تعذر الوصول إلى الكاميرا. يرجى التأكد من منح الإذن للمتصفح.');
          setCameraStreamActive(false);
          return;
        }
      }
    }

    if (stream) {
      mediaStreamRef.current = stream;
      setMediaStream(stream);
      setCameraStreamActive(true);
      setCameraError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.warn('Video play error:', err));
      }
    }
  };

  // Switch between front and back camera
  const toggleFacing = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Toggle Recording and physical camera pause/resume (stops camera sensor to turn off hardware indicator)
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      stopCamera();
    } else {
      setIsRecording(true);
      startCamera(facingMode);
    }
  };

  // Trigger camera on modal open, shut down completely when closed or unmounted
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Window unload / visibility listeners to turn off camera immediately
  useEffect(() => {
    const handleUnload = () => {
      stopCamera();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
      } else if (isOpen && isRecording) {
        startCamera(facingMode);
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopCamera, isOpen, isRecording, facingMode]);

  // Keep videoRef in sync with mediaStream
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(() => {});
    }
  }, [mediaStream]);

  // Take Snapshot from video frame
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPhotos(prev => [dataUrl, ...prev]);
    }
  };

  if (!isOpen) return null;

  const toggleInspectedItem = (label: string) => {
    if (inspectedItems.includes(label)) {
      setInspectedItems(inspectedItems.filter(i => i !== label));
    } else {
      setInspectedItems([...inspectedItems, label]);
    }
  };

  // Action: Finish and Save Session
  const handleFinishAndSave = () => {
    setIsRecording(false);
    stopCamera();

    const sessionId = 'doc-' + Date.now().toString(36);
    const timeDisplay = formatTimeName(sessionStartTime);

    // Create session record
    const newSession: MonitoringSession = {
      id: sessionId,
      code: 'CARGAS-DOC-' + Math.floor(1000 + Math.random() * 9000),
      title: autoGeneratedTitle,
      locationName: siteName,
      governorate: governorate,
      city: 'المنطقة الميدانية',
      coordinates: activeSession?.coordinates || { lat: 30.0444, lng: 31.2357 },
      nearestStation: siteName,
      trafficDirection: 'توثيق هندسي وميداني للإدارة',
      surveyorName: meta.title,
      status: 'completed',
      startTime: sessionStartTime.toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: durationSeconds || 60,
      counts: {
        private: vehicleCounts.private || 0,
        taxi: vehicleCounts.taxi || 0,
        microbus: vehicleCounts.microbus || 0,
        van: vehicleCounts.van || 0,
        minibus: vehicleCounts.minibus || 0,
        pickup: vehicleCounts.pickup || 0,
        bus: vehicleCounts.bus || 0,
        motorcycle: vehicleCounts.motorcycle || 0,
        suzuki_van: vehicleCounts.suzuki_van || 0,
        peugeot_station: vehicleCounts.peugeot_station || 0
      },
      detections: [],
      notes: findingsNotes || `تم توثيق ${inspectedItems.length} عنصر من عناصر ${meta.title} بنجاح.`
    };

    // Store in video archive
    const videoArchiveItem: RecordedVideoSession = {
      id: 'vid-' + Date.now().toString(36),
      sessionId: newSession.id,
      sessionTitle: newSession.title,
      department: department,
      departmentName: meta.title,
      locationName: siteName,
      governorate: governorate,
      recordedBy: `${meta.badge} - مسؤول الرصد والتوثيق`,
      recordedAt: sessionStartTime.toISOString(),
      timestampDisplay: timeDisplay,
      durationSeconds: durationSeconds || 60,
      category: newSession.documentationCategory || 'equipment_machinery',
      categoryLabel: `رصد وتوثيق: ${meta.title}`,
      thumbnailUrl: capturedPhotos.length > 0 
        ? capturedPhotos[0] 
        : (department === 'operations' 
            ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
            : department === 'projects'
            ? 'https://images.unsplash.com/photo-1541888946425-d0fbb1861563?w=800&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80'),
      equipmentInspected: inspectedItems.length > 0 ? inspectedItems : ['معاينة وتوثيق الموقع كاملاً'],
      findingsSummary: findingsNotes || 'تم استكمال التوثيق الميداني وحفظ الفيديو بجودة فائقة في مخزن الإدارة ومدير النظام.',
      fileSizeBytes: (durationSeconds || 60) * 180000
    };

    addVideoToArchive(videoArchiveItem);

    // Log this activity
    logDepartmentActivity({
      department: department,
      departmentName: meta.title,
      actorName: `${meta.badge} (المدير العام)`,
      actorRole: 'general_manager',
      actionType: 'camera_session_saved',
      title: `حفظ وتوثيق جلسة رصد: ${newSession.title}`,
      details: `تم إنهاء وحفظ جلسة الرصد الميداني في ${siteName} بمدة ${Math.floor(durationSeconds / 60)} دقيقة و ${durationSeconds % 60} ثانية وتخزين الفيديو في الأرشيف المركزي.`,
      relatedSessionId: sessionId
    });

    if (onSaveSession) {
      onSaveSession(newSession);
    }
    onClose();
  };

  // Action: Cancel Saving
  const handleCancelSaving = () => {
    stopCamera();
    setShowCancelConfirm(false);
    onClose();
  };

  const handleCloseDirectly = () => {
    stopCamera();
    onClose();
  };

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[96vh] flex flex-col bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Top Bar with Title and Exact Time */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  كاميرا الرصد والتوثيق الميداني المباشر
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {meta.title}
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>تسمية الجلسة المعتمدة: {autoGeneratedTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Live REC badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
              isRecording 
                ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-amber-500'}`} />
              <span>{isRecording ? `تسجيل حي: ${timeFormatted}` : 'الكاميرا متوقفة مؤقتاً'}</span>
            </div>

            <button
              onClick={() => {
                if (durationSeconds > 5) {
                  setShowCancelConfirm(true);
                } else {
                  handleCloseDirectly();
                }
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="إغلاق الكاميرا وإنهائها"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Camera Viewport (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Hidden canvas for taking photos */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Video Viewport Container */}
            <div className="relative w-full aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-inner flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraStreamActive ? 'block' : 'hidden'}`}
              />

              {/* Offline / Placeholder state */}
              {!cameraStreamActive && (
                <div className="p-6 text-center space-y-3 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
                    <Camera className="w-8 h-8 animate-pulse text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">
                      {cameraError ? 'تعذر فتح الكاميرا المباشرة' : (isRecording ? 'جاري فتح عدسة الكاميرا...' : 'الكاميرا متوقفة مؤقتاً لحفظ الطاقة')}
                    </h4>
                    <p className="text-slate-400 text-xs max-w-sm mt-1">
                      {cameraError || (isRecording ? 'يرجى السماح بصلاحية الكاميرا لتوثيق الموقع بالفيديو والصور.' : 'اضغط على زر استئناف لتشغيل الكاميرا وإعادة التقاط الصور.')}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecording(true);
                        startCamera(facingMode);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{isRecording ? 'إعادة محاولة تشغيل الكاميرا' : 'استئناف تشغيل الكاميرا'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleFacing}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
                    >
                      تبديل العدسة ({facingMode === 'environment' ? 'الخلفية' : 'الأمامية'})
                    </button>
                  </div>
                </div>
              )}

              {/* Camera Grid Lines Overlay */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none border border-white/10">
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div />
              </div>

              {/* HUD Overlays */}
              <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white font-mono text-[11px] border border-white/10">
                  1080P HD • 30 FPS • CARGAS NGV
                </div>
                <div className={`px-2.5 py-1 rounded-lg backdrop-blur-sm font-mono text-[11px] border flex items-center gap-1.5 ${
                  isRecording 
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/30' 
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-amber-500'}`}></span>
                  <span>{isRecording ? 'تسجيل مباشر' : 'الكاميرا متوقفة'}</span>
                </div>
              </div>

              <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
                  {timeFormatted}
                </div>
                <button
                  type="button"
                  onClick={toggleFacing}
                  title="تبديل العدسة (الأمامية / الخلفية)"
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white border border-white/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs border border-white/10 max-w-[80%] truncate z-20">
                {siteName} • {governorate}
              </div>

              {/* Floating Action Controls on Video */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 z-20">
                <button
                  type="button"
                  onClick={toggleRecording}
                  title={isRecording ? "إيقاف الكاميرا مؤقتاً" : "استئناف الكاميرا"}
                  className={`p-2 rounded-xl backdrop-blur-md border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isRecording
                      ? 'bg-black/60 hover:bg-black/80 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50 shadow-lg'
                  }`}
                >
                  {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isRecording ? 'إيقاف الكاميرا' : 'استئناف الكاميرا'}</span>
                </button>

                {/* Instant Photo Snapshot button */}
                <button
                  type="button"
                  onClick={capturePhoto}
                  disabled={!cameraStreamActive}
                  title="التقاط لقطة فورية من الكاميرا"
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">التقاط صورة ({capturedPhotos.length})</span>
                </button>
              </div>
            </div>

            {/* Direct Quick Tally Bar under Camera Viewport (Always visible right under camera feed for marketing) */}
            {department === 'marketing' && (
              <div className="p-3 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-2xl shadow-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black text-white">
                      لوحة الرصد السريع المباشر (أهداف التحويل الاقتصادية للغاز)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleUndoLastTally}
                      disabled={tallyHistory.length === 0}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-[11px] font-bold transition-colors cursor-pointer"
                      title="تراجع عن آخر رصد"
                    >
                      <Undo2 className="w-3 h-3 text-amber-400" />
                      <span>تراجع</span>
                    </button>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      الإجمالي: {totalMarketingVehicles} مركبة
                    </span>
                  </div>
                </div>

                {/* 4 Primary Conversion Targets (ملاكي / أجرة / ميكروباص / فان) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'private', label: 'ملاكي', desc: 'سيارات خاصة', badge: 'bg-emerald-500/20 text-emerald-300' },
                    { key: 'taxi', label: 'أجرة', desc: 'تاكسي وأجرة', badge: 'bg-amber-500/20 text-amber-300' },
                    { key: 'microbus', label: 'ميكروباص', desc: 'سرفيس ونقل ركاب', badge: 'bg-blue-500/20 text-blue-300' },
                    { key: 'van', label: 'فان', desc: 'سوزوكي وبضائع', badge: 'bg-purple-500/20 text-purple-300' },
                  ].map((target) => {
                    const count = vehicleCounts[target.key] || 0;
                    return (
                      <div
                        key={target.key}
                        className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{target.label}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${target.badge}`}>
                            هدف تحويل
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-slate-900/80 p-1 rounded-lg border border-slate-800">
                          {/* Decrement Button (-) */}
                          <button
                            type="button"
                            onClick={() => handleDecVehicle(target.key)}
                            disabled={count <= 0}
                            className="w-7 h-7 rounded-md bg-slate-800 hover:bg-rose-900/60 disabled:opacity-20 text-rose-300 border border-slate-700 flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
                            title={`تخفيض عدد ${target.label} بمقدار 1 (-)`}
                          >
                            <Minus className="w-3.5 h-3.5 font-bold" />
                          </button>

                          {/* Count */}
                          <span className="font-mono font-black text-sm text-white px-1">
                            {count}
                          </span>

                          {/* Increment Button (+) */}
                          <button
                            type="button"
                            onClick={() => handleIncVehicle(target.key)}
                            className="w-7 h-7 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95"
                            title={`زيادة عدد ${target.label} بمقدار 1 (+)`}
                          >
                            <Plus className="w-4 h-4 font-bold" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Captured Photos Preview Strip */}
            {capturedPhotos.length > 0 && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>الصور الملتقطة بالكاميرا الميدانية ({capturedPhotos.length}):</span>
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {capturedPhotos.map((photoUrl, pIdx) => (
                    <div key={pIdx} className="relative w-20 h-14 rounded-lg overflow-hidden border border-emerald-500/40 shrink-0 group">
                      <img src={photoUrl} alt={`Captured ${pIdx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setCapturedPhotos(prev => prev.filter((_, i) => i !== pIdx))}
                        className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="حذف"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Station inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <label className="block text-xs text-slate-400 mb-1">اسم الموقع / المحطة محل التوثيق</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">المحافظة</label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="القليوبية">القليوبية</option>
                  <option value="الشرقية">الشرقية</option>
                  <option value="الدقهلية">الدقهلية</option>
                  <option value="السويس">السويس</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Panel: Department Checklist & Session Controls (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-5">
            
            <div className="space-y-4">
              {/* Marketing View Selector Toggle */}
              {department === 'marketing' && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMarketingActiveView('vehicles')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      marketingActiveView === 'vehicles'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                    <span>لوحة الرصد السريع للمركبات ({totalMarketingVehicles})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMarketingActiveView('checklist')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      marketingActiveView === 'checklist'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>بنود المعاينة الميدانية ({inspectedItems.length})</span>
                  </button>
                </div>
              )}

              {/* View 1: Marketing High-Speed Vehicle Counting Panel */}
              {department === 'marketing' && marketingActiveView === 'vehicles' ? (
                <div className="space-y-3">
                  {/* Technical Clarification & Focus Guidance */}
                  <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>🎯 أهداف التحويل الاقتصادية للغاز (ملاكي • أجرة • ميكروباص • فان):</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleUndoLastTally}
                        disabled={tallyHistory.length === 0}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 text-[10px] font-bold transition-colors cursor-pointer"
                        title="تراجع عن آخر رصد تم بالخطأ"
                      >
                        <Undo2 className="w-3 h-3 text-amber-400" />
                        <span>تراجع</span>
                      </button>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>هل يؤثر الرصد السريع على نتائج رصد الكاميرا؟</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        <strong className="text-slate-200">الرصد السريع لا يشوش على الكاميرا بل يعززها:</strong> تعمل الكاميرا بالرؤية الحاسوبية الآلية، وتتيح لك هذه اللوحة التدخل البشري الفوري لزيادة المركبات <strong className="text-emerald-400 font-bold">(+)</strong> أو تخفيضها <strong className="text-rose-400 font-bold">(-)</strong> عند تسجيل مركبة بالخطأ أو في النقاط المحجوبة، وتُحفظ البيانات كاملة بالتقرير.
                      </p>
                    </div>
                  </div>

                  {/* 4 Primary Conversion Targets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[11px] font-bold text-white">الفئات الأربعة ذات الجدوى الاقتصادية العالية:</span>
                      <span className="text-[10px] text-emerald-400 font-mono">تكلفة تحويل منخفضة وعائد فوري</span>
                    </div>

                    {[
                      { key: 'private', label: 'ملاكي (Private)', desc: 'سيارات الملاكي الخاصة والأسرية' },
                      { key: 'taxi', label: 'أجرة / تاكسي (Taxi)', desc: 'سيارات الأجرة والتاكسي والليموزين' },
                      { key: 'microbus', label: 'ميكروباص (Microbus)', desc: 'الميكروباص وسيارات نقل الركاب والسرفيس' },
                      { key: 'van', label: 'فان / سوزوكي فان (Van)', desc: 'سيارات الفان والبضائع الخفيفة والتوزيع' },
                    ].map((target) => {
                      const count = vehicleCounts[target.key] || 0;
                      return (
                        <div
                          key={target.key}
                          className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between gap-2"
                        >
                          <div 
                            onClick={() => handleIncVehicle(target.key)}
                            className="flex-1 cursor-pointer"
                            title="انقر للزيادة السريعة"
                          >
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-bold text-xs text-white">{target.label}</h5>
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                أولوية قصوى
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{target.desc}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Decrement Button (-) */}
                            <button
                              type="button"
                              onClick={() => handleDecVehicle(target.key)}
                              disabled={count <= 0}
                              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-900/70 disabled:opacity-20 text-rose-300 border border-slate-700 hover:border-rose-500/50 flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
                              title={`تخفيض عدد ${target.label} بمقدار 1 في حالة الخطأ (-)`}
                            >
                              <Minus className="w-4 h-4 font-bold" />
                            </button>

                            {/* Counter Display */}
                            <div className="w-10 text-center">
                              <span className="font-mono font-black text-sm text-white block">
                                {count}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                {totalMarketingVehicles > 0 ? `${Math.round((count / totalMarketingVehicles) * 100)}%` : '0%'}
                              </span>
                            </div>

                            {/* Increment Button (+) */}
                            <button
                              type="button"
                              onClick={() => handleIncVehicle(target.key)}
                              className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-md shadow-emerald-600/30 active:scale-95"
                              title={`زيادة عدد ${target.label} بمقدار 1 (+)`}
                            >
                              <Plus className="w-4 h-4 font-bold" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Secondary Heavy Categories (Collapsible / Compact) */}
                  <div className="p-2.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 block">
                      فئات إضافية (تكلفة تحويلها مرتفعة):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'bus', label: 'حافلات وأتوبيس' },
                        { key: 'pickup', label: 'بيك أب ونقل' },
                        { key: 'minibus', label: 'ميني باص' },
                        { key: 'motorcycle', label: 'دراجات نارية' },
                      ].map((item) => {
                        const count = vehicleCounts[item.key] || 0;
                        return (
                          <div key={item.key} className="flex items-center justify-between p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
                            <span className="truncate text-slate-300">{item.label}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDecVehicle(item.key)}
                                disabled={count <= 0}
                                className="w-5 h-5 rounded bg-slate-800 text-rose-300 disabled:opacity-20 flex items-center justify-center"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="font-mono font-bold text-white w-5 text-center text-xs">{count}</span>
                              <button
                                type="button"
                                onClick={() => handleIncVehicle(item.key)}
                                className="w-5 h-5 rounded bg-slate-700 text-white flex items-center justify-center"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* View 2: Standard Checklist View */
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-emerald-400" />
                      <span>عناصر ومعدات الفحص المعتمدة ({meta.badge})</span>
                    </h4>

                    {/* System Admin Tasks Control Button */}
                    <button
                      type="button"
                      onClick={() => setShowAdminTasksManager(!showAdminTasksManager)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition-all cursor-pointer"
                      title="التحكم في البنود: إضافة وتعديل وإخفاء وإظهار وإزالة"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>تحكم مدير النظام</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">
                    حدد العناصر والآلات التي تم توثيقها ورفع حالتها بالكاميرا:
                  </p>

                  {/* Inline Admin Tasks Management Drawer */}
                  {showAdminTasksManager && (
                    <div className="mb-4 p-4 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-xl space-y-3 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" />
                          <span>تحكم مدير النظام في مهام كاميرا {meta.title}</span>
                        </span>
                        <button
                          onClick={() => setShowAdminTasksManager(false)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <AdminCameraTasksManager 
                        initialDepartment={department}
                        isEmbedded={true}
                        onClose={() => setShowAdminTasksManager(false)}
                      />
                    </div>
                  )}

                  {/* Tasks checklist buttons */}
                  <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-1">
                    {availableTasks.map((eq) => {
                      const isChecked = inspectedItems.includes(eq.label);
                      return (
                        <button
                          key={eq.id}
                          type="button"
                          onClick={() => toggleInspectedItem(eq.label)}
                          className={`p-2.5 rounded-xl border text-xs text-right font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="truncate">{eq.label}</span>
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ملاحظات ونتائج التوثيق الفني للموقع:
                </label>
                <textarea
                  value={findingsNotes}
                  onChange={(e) => setFindingsNotes(e.target.value)}
                  placeholder="أدخل أي ملاحظات فنية، عيوب رصد، أو توصيات هندسية..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                type="button"
                id="btn-save-camera-session"
                onClick={handleFinishAndSave}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التوثيق وإغلاق الكاميرا نهائياً</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/30 text-xs font-medium transition-all cursor-pointer text-center"
                >
                  إلغاء وإغلاق الكاميرا
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-3xl p-5 shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">إلغاء جلسة التوثيق وإغلاق الكاميرا؟</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              سيتم إيقاف مستشعر الكاميرا وإغلاق الجلسة فوراً دون حفظ أي صور أو ملاحظات جديدة.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancelSaving}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all cursor-pointer"
              >
                نعم، إغلاق وإلغاء
              </button>
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all cursor-pointer"
              >
                استمرار في التصوير
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
