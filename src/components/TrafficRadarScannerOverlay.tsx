import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Radar, 
  Car, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Zap, 
  Target, 
  Activity, 
  CheckCircle2,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { VehicleType, VEHICLE_TYPES } from '../types';

interface DetectedTarget {
  id: string;
  type: VehicleType;
  label: string;
  confidence: number;
  speedKmH: number;
  x: number; // percentage 0..100
  y: number; // percentage 0..100
  width: number;
  height: number;
  isCngTarget: boolean; // taxi or microbus
  createdAt: number;
}

interface TrafficRadarScannerOverlayProps {
  isSimulated: boolean;
  onToggleSimulated: (sim: boolean) => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isScanning: boolean;
  onVehicleDetected: (type: VehicleType, confidence: number, description: string) => void;
  hourlyFlowRate?: number;
  totalVehicles?: number;
}

export const TrafficRadarScannerOverlay: React.FC<TrafficRadarScannerOverlayProps> = ({
  isSimulated,
  onToggleSimulated,
  isSoundEnabled,
  onToggleSound,
  isScanning,
  onVehicleDetected,
  hourlyFlowRate = 420,
  totalVehicles = 0,
}) => {
  const [activeTargets, setActiveTargets] = useState<DetectedTarget[]>([]);
  const [radarAngle, setRadarAngle] = useState<number>(0);
  const simCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Play synthesized radar beep
  const playRadarPing = useCallback((isCng: boolean) => {
    if (!isSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isCng ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isCng ? 980 : 640, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isCng ? 1960 : 1280, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      // Audio autoplay restriction safe ignore
    }
  }, [isSoundEnabled]);

  // Animated sweeping radar line
  useEffect(() => {
    let currentAngle = 0;
    const interval = setInterval(() => {
      currentAngle = (currentAngle + 4) % 360;
      setRadarAngle(currentAngle);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Traffic Simulation Loop (when isSimulated is true)
  useEffect(() => {
    if (!isSimulated) return;

    // Simulated moving vehicles across the road
    interface SimCar {
      id: string;
      type: VehicleType;
      x: number; // 0 to canvas.width
      y: number;
      speed: number;
      color: string;
      lane: number;
      detected: boolean;
    }

    const canvas = simCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 640;
    canvas.height = 360;

    const vehiclePool: VehicleType[] = [
      'taxi', 'microbus', 'private', 'taxi', 'microbus', 'pickup', 'private', 'van', 'bus'
    ];

    const cars: SimCar[] = [
      { id: '1', type: 'taxi', x: 50, y: 190, speed: 2.8, color: '#f59e0b', lane: 1, detected: false },
      { id: '2', type: 'microbus', x: 280, y: 240, speed: 2.2, color: '#10b981', lane: 2, detected: false },
      { id: '3', type: 'private', x: 490, y: 140, speed: 3.4, color: '#38bdf8', lane: 0, detected: false },
    ];

    let lastSpawnTime = Date.now();

    const renderSim = () => {
      if (!ctx || !canvas) return;

      // Draw asphalt road with lanes
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Road boundaries and perspective lines
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 90);
      ctx.lineTo(canvas.width, 90);
      ctx.moveTo(0, 310);
      ctx.lineTo(canvas.width, 310);
      ctx.stroke();

      // Dashed lane dividers
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([16, 16]);
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.lineTo(canvas.width, 160);
      ctx.moveTo(0, 235);
      ctx.lineTo(canvas.width, 235);
      ctx.stroke();
      ctx.setLineDash([]);

      // Detection radar tripwire beam (vertical scanning band)
      const scanX = canvas.width * 0.52;
      const grad = ctx.createLinearGradient(scanX - 25, 0, scanX + 25, 0);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.45)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(scanX - 25, 90, 50, 220);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scanX, 90);
      ctx.lineTo(scanX, 310);
      ctx.stroke();

      // Move and draw cars
      cars.forEach(car => {
        car.x += car.speed;

        // Draw car body
        ctx.fillStyle = car.color;
        ctx.beginPath();
        ctx.roundRect(car.x, car.y, 48, 22, 5);
        ctx.fill();

        // Car windshield & wheels
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(car.x + 12, car.y + 3, 14, 16);
        ctx.fillStyle = '#000000';
        ctx.fillRect(car.x + 6, car.y - 2, 8, 3);
        ctx.fillRect(car.x + 34, car.y - 2, 8, 3);
        ctx.fillRect(car.x + 6, car.y + 21, 8, 3);
        ctx.fillRect(car.x + 34, car.y + 21, 8, 3);

        // Check if car crosses detection line
        if (!car.detected && car.x > scanX - 10 && car.x < scanX + 30) {
          car.detected = true;
          const conf = Math.floor(92 + Math.random() * 7);
          const speedKm = Math.floor(45 + Math.random() * 25);
          const isCng = car.type === 'taxi' || car.type === 'microbus';

          playRadarPing(isCng);
          onVehicleDetected(car.type, conf, VEHICLE_TYPES[car.type].label);

          // Add active target box
          const targetBox: DetectedTarget = {
            id: 't-' + Date.now(),
            type: car.type,
            label: VEHICLE_TYPES[car.type].label,
            confidence: conf,
            speedKmH: speedKm,
            x: (car.x / canvas.width) * 100,
            y: (car.y / canvas.height) * 100,
            width: 14,
            height: 12,
            isCngTarget: isCng,
            createdAt: Date.now(),
          };

          setActiveTargets(prev => [targetBox, ...prev.slice(0, 3)]);
        }
      });

      // Remove cars that passed offscreen
      for (let i = cars.length - 1; i >= 0; i--) {
        if (cars[i].x > canvas.width + 60) {
          cars.splice(i, 1);
        }
      }

      // Spawn new car periodically
      if (Date.now() - lastSpawnTime > 1400) {
        lastSpawnTime = Date.now();
        const randType = vehiclePool[Math.floor(Math.random() * vehiclePool.length)];
        const lane = Math.floor(Math.random() * 3);
        const laneY = 110 + lane * 75;
        const color = randType === 'taxi' ? '#f59e0b' : randType === 'microbus' ? '#10b981' : '#38bdf8';
        cars.push({
          id: String(Date.now()),
          type: randType,
          x: -60,
          y: laneY,
          speed: 2.2 + Math.random() * 1.6,
          color,
          lane,
          detected: false,
        });
      }

      animFrameRef.current = requestAnimationFrame(renderSim);
    };

    animFrameRef.current = requestAnimationFrame(renderSim);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isSimulated, onVehicleDetected, playRadarPing]);

  // Clean expired bounding targets after 1.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setActiveTargets(prev => prev.filter(t => now - t.createdAt < 1800));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden font-sans">
      
      {/* If Simulated Traffic Mode is Active: Canvas Canvas Stream */}
      {isSimulated && (
        <canvas
          ref={simCanvasRef}
          className="w-full h-full object-cover"
        />
      )}

      {/* RADAR HUD GRAPHICS OVERLAY */}

      {/* 1. Radar Reticle Corners */}
      <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-emerald-400/80 rounded-tr-lg" />
      <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-emerald-400/80 rounded-tl-lg" />
      <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-emerald-400/80 rounded-br-lg" />
      <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-emerald-400/80 rounded-bl-lg" />

      {/* 2. Top Radar HUD Status Bar */}
      <div className="absolute top-3 inset-x-12 flex items-center justify-between pointer-events-auto">
        
        {/* Left Status: Mode Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-black text-emerald-400">
              {isSimulated ? 'رادار المحاكاة المرورية الذكي' : 'رادار الكاميرا الحية (Live Radar)'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              FOV 82° • AI Lock
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow"
            title={isSoundEnabled ? 'كتم صوت الرادار' : 'تشغيل صوت رنين الرادار'}
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>

        {/* Right Status: Simulation Switcher Button */}
        <button
          onClick={() => onToggleSimulated(!isSimulated)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all shadow-lg cursor-pointer ${
            isSimulated
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30'
              : 'bg-slate-950/90 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
          title="التبديل بين كاميرا الموبايل الحقيقية ومحاكاة رادار المرور الذكي"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{isSimulated ? 'إيقاف المحاكاة (العودة للكاميرا)' : 'تشغيل محاكاة رادار المرور'}</span>
        </button>

      </div>

      {/* 3. Center Rotating Radar Circle in upper corner */}
      <div className="absolute top-14 left-4 w-20 h-20 rounded-full border border-emerald-500/30 bg-slate-950/60 backdrop-blur-sm pointer-events-none flex items-center justify-center shadow-lg">
        {/* Radar Rings */}
        <div className="w-14 h-14 rounded-full border border-emerald-500/20" />
        <div className="w-8 h-8 rounded-full border border-emerald-500/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

        {/* Sweeping Line */}
        <div
          className="absolute inset-0 origin-center"
          style={{ transform: `rotate(${radarAngle}deg)` }}
        >
          <div className="w-1/2 h-[1.5px] bg-gradient-to-r from-transparent to-emerald-400 absolute top-1/2 left-1/2 -translate-y-1/2 origin-left" />
        </div>
        <span className="absolute bottom-1 text-[8px] font-mono text-emerald-400 font-bold">
          {radarAngle}°
        </span>
      </div>

      {/* 4. Center Crosshairs & Speed Gauge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-32 border border-dashed border-emerald-500/40 rounded-2xl flex items-center justify-center relative">
          <div className="w-2.5 h-2.5 border-t border-l border-emerald-400 absolute -top-1 -left-1" />
          <div className="w-2.5 h-2.5 border-t border-r border-emerald-400 absolute -top-1 -right-1" />
          <div className="w-2.5 h-2.5 border-b border-l border-emerald-400 absolute -bottom-1 -left-1" />
          <div className="w-2.5 h-2.5 border-b border-r border-emerald-400 absolute -bottom-1 -right-1" />

          {/* Subtext */}
          <span className="text-[10px] text-emerald-400/80 font-mono tracking-widest uppercase">
            TARGET DETECTION ZONE
          </span>
        </div>
      </div>

      {/* 5. Target Lock Bounding Boxes (Active Detections) */}
      {activeTargets.map(target => (
        <div
          key={target.id}
          className="absolute transition-all duration-300 pointer-events-none"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            width: `${target.width}%`,
            height: `${target.height}%`,
          }}
        >
          <div className={`w-full h-full border-2 rounded-lg relative animate-pulse ${
            target.isCngTarget
              ? 'border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-500/30'
              : 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/20'
          }`}>
            {/* Target Label Tag */}
            <div className={`absolute -top-7 right-0 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1 whitespace-nowrap ${
              target.isCngTarget ? 'bg-emerald-600 text-white' : 'bg-cyan-600 text-white'
            }`}>
              <span>{target.label}</span>
              <span className="font-mono text-[9px] opacity-90">{target.confidence}%</span>
              {target.isCngTarget && <span className="text-amber-300 font-black">★ غاز</span>}
            </div>

            {/* Speed Gauge */}
            <div className="absolute -bottom-5 right-0 bg-black/80 text-amber-300 text-[9px] font-mono px-1.5 py-0.2 rounded border border-amber-500/40">
              {target.speedKmH} كم/س
            </div>
          </div>
        </div>
      ))}

      {/* 6. Bottom Radar Telemetry Bar */}
      <div className="absolute bottom-3 inset-x-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-2xl px-4 py-2 flex items-center justify-between text-xs text-white shadow-2xl">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-400 text-[10px] block">تدفق المرور بالساعة:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{hourlyFlowRate} مركبة/س</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 text-[10px] block">إجمالي المركبات المسجلة:</span>
            <span className="font-mono font-bold text-cyan-400 text-sm">{totalVehicles} مركبة</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
            رادار الذكاء الاصطناعي نشط
          </span>
        </div>
      </div>

    </div>
  );
};
