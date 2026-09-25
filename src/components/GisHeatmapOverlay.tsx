import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { Flame, Layers, Eye, Sliders, Activity, TrendingUp, ShieldAlert, Sparkles, Zap } from 'lucide-react';
import { MonitoringSession, CNGStation } from '../types';

export type HeatmapMetric = 'traffic' | 'sales' | 'competitive';

interface GisHeatmapOverlayProps {
  map: L.Map | null;
  sessions: MonitoringSession[];
  stations: CNGStation[];
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
}

export const GisHeatmapOverlay: React.FC<GisHeatmapOverlayProps> = ({
  map,
  sessions,
  stations,
  enabled,
  onToggleEnabled,
}) => {
  const [metric, setMetric] = useState<HeatmapMetric>('traffic');
  const [radius, setRadius] = useState<number>(35); // in pixels
  const [blur, setBlur] = useState<number>(25);
  const [maxIntensity, setMaxIntensity] = useState<number>(1.0);
  const [showControls, setShowControls] = useState<boolean>(true);

  const canvasLayerRef = useRef<L.Layer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute normalized heat points [lat, lng, weight (0..1)]
  const heatPoints = useMemo(() => {
    const points: { lat: number; lng: number; weight: number; label: string; details: string }[] = [];

    if (metric === 'traffic') {
      // Points from survey sessions (Traffic Density & Count)
      let maxCount = 1;
      sessions.forEach(s => {
        const total = Object.values(s.counts).reduce((a, b) => a + b, 0);
        if (total > maxCount) maxCount = total;
      });

      sessions.forEach(s => {
        const total = Object.values(s.counts).reduce((a, b) => a + b, 0);
        const weight = Math.min(1.0, Math.max(0.2, total / maxCount));
        points.push({
          lat: s.coordinates.lat,
          lng: s.coordinates.lng,
          weight,
          label: s.locationName || 'موقع رصد ميداني',
          details: `حصر مروري: ${total} مركبة`,
        });
      });

      // Also give some weight to active stations
      stations.forEach(st => {
        const isCargas = st.company.includes('كارجاس') || st.brand === 'cargas';
        points.push({
          lat: st.lat,
          lng: st.lng,
          weight: isCargas ? 0.75 : 0.45,
          label: st.name,
          details: `محطة: ${st.company}`,
        });
      });
    } else if (metric === 'sales') {
      // Points from CNG stations capacity and monthly sales volume
      stations.forEach(st => {
        const isCargas = st.company.includes('كارجاس') || st.brand === 'cargas';
        // Sales metric weighting
        const salesEstimate = isCargas ? (st.monthlyGasSalesM3 || 280000) : 180000;
        const normalized = Math.min(1.0, Math.max(0.3, salesEstimate / 400000));
        points.push({
          lat: st.lat,
          lng: st.lng,
          weight: normalized,
          label: st.name,
          details: `مبيعات تقديرية: ${salesEstimate.toLocaleString('ar-EG')} م³/شهر`,
        });
      });

      sessions.forEach(s => {
        points.push({
          lat: s.coordinates.lat,
          lng: s.coordinates.lng,
          weight: 0.5,
          label: s.locationName || 'موقع مقترح',
          details: 'طلب متوقع للغاز الطبيعي',
        });
      });
    } else {
      // Competitive clustering density
      stations.forEach(st => {
        const isCargas = st.company.includes('كارجاس') || st.brand === 'cargas';
        points.push({
          lat: st.lat,
          lng: st.lng,
          weight: isCargas ? 0.9 : 0.65,
          label: st.name,
          details: isCargas ? 'محطة تابعة لكارجاس' : `محطة منافسة (${st.company})`,
        });
      });
    }

    return points;
  }, [sessions, stations, metric]);

  // Leaflet Custom Canvas Heat Layer Renderer
  useEffect(() => {
    if (!map) return;

    if (!enabled) {
      if (canvasLayerRef.current) {
        map.removeLayer(canvasLayerRef.current);
        canvasLayerRef.current = null;
      }
      return;
    }

    // Custom Leaflet Layer using HTML5 Canvas for ultra-smooth heat bloom gradients
    const HeatCanvasLayer = L.Layer.extend({
      onAdd: function (targetMap: L.Map) {
        const pane = targetMap.getPane('overlayPane') || targetMap.getPanes().overlayPane;
        const canvas = L.DomUtil.create('canvas', 'leaflet-heatmap-canvas') as HTMLCanvasElement;
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '350';
        pane.appendChild(canvas);
        canvasRef.current = canvas;

        const redraw = () => {
          if (!canvas || !targetMap) return;
          const size = targetMap.getSize();
          const bounds = targetMap.getBounds();
          const topLeft = targetMap.latLngToLayerPoint(bounds.getNorthWest());

          L.DomUtil.setPosition(canvas, topLeft);
          canvas.width = size.x;
          canvas.height = size.y;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw radial gradient blooms for each point
          heatPoints.forEach(pt => {
            const latLng = L.latLng(pt.lat, pt.lng);
            if (!bounds.contains(latLng)) return;

            const point = targetMap.latLngToContainerPoint(latLng);
            const r = radius * (targetMap.getZoom() / 12);
            const actualRadius = Math.max(20, Math.min(120, r));

            const grad = ctx.createRadialGradient(
              point.x, point.y, 0,
              point.x, point.y, actualRadius
            );

            const w = pt.weight * maxIntensity;

            // Palette: Smooth glowing Heatmap (Blue -> Green -> Yellow -> Orange -> Crimson Red)
            if (metric === 'traffic') {
              grad.addColorStop(0.0, `rgba(239, 68, 68, ${0.85 * w})`);    // Crimson red center
              grad.addColorStop(0.3, `rgba(249, 115, 22, ${0.65 * w})`);   // Orange
              grad.addColorStop(0.6, `rgba(234, 179, 8, ${0.45 * w})`);    // Yellow
              grad.addColorStop(0.85, `rgba(34, 197, 94, ${0.25 * w})`);   // Green
              grad.addColorStop(1.0, 'rgba(59, 130, 246, 0.0)');          // Transparent blue edge
            } else if (metric === 'sales') {
              grad.addColorStop(0.0, `rgba(16, 185, 129, ${0.9 * w})`);   // Emerald green center
              grad.addColorStop(0.35, `rgba(6, 182, 212, ${0.65 * w})`);  // Cyan
              grad.addColorStop(0.7, `rgba(59, 130, 246, ${0.4 * w})`);   // Blue
              grad.addColorStop(1.0, 'rgba(99, 102, 241, 0.0)');          // Edge
            } else {
              grad.addColorStop(0.0, `rgba(168, 85, 247, ${0.85 * w})`);  // Purple
              grad.addColorStop(0.4, `rgba(236, 72, 153, ${0.65 * w})`);  // Magenta
              grad.addColorStop(0.75, `rgba(244, 63, 94, ${0.35 * w})`);  // Rose
              grad.addColorStop(1.0, 'rgba(234, 179, 8, 0.0)');
            }

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(point.x, point.y, actualRadius, 0, Math.PI * 2);
            ctx.fill();
          });
        };

        (this as any)._redraw = redraw;
        targetMap.on('move', redraw);
        targetMap.on('zoom', redraw);
        targetMap.on('resize', redraw);
        redraw();
      },

      onRemove: function (targetMap: L.Map) {
        if (canvasRef.current && canvasRef.current.parentNode) {
          canvasRef.current.parentNode.removeChild(canvasRef.current);
        }
        if ((this as any)._redraw) {
          targetMap.off('move', (this as any)._redraw);
          targetMap.off('zoom', (this as any)._redraw);
          targetMap.off('resize', (this as any)._redraw);
        }
        canvasRef.current = null;
      },
    });

    const layer = new (HeatCanvasLayer as any)();
    layer.addTo(map);
    canvasLayerRef.current = layer;

    return () => {
      if (canvasLayerRef.current && map) {
        map.removeLayer(canvasLayerRef.current);
        canvasLayerRef.current = null;
      }
    };
  }, [map, enabled, heatPoints, radius, blur, maxIntensity, metric]);

  return (
    <>
      {/* Floating Heatmap Toggle & Controls in Map UI */}
      <div className="absolute top-20 right-4 z-[400] flex flex-col items-end gap-2 text-right">
        
        {/* Main Heatmap vs Standard Toggle Button */}
        <button
          id="btn-toggle-gis-heatmap"
          onClick={() => onToggleEnabled(!enabled)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xl cursor-pointer ${
            enabled
              ? 'bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-600 text-white shadow-rose-600/30 ring-2 ring-rose-400'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 shadow-slate-950/50'
          }`}
          title="التبديل بين الخريطة القياسية وعرض الخريطة الحرارية (Heatmap)"
        >
          <Flame className={`w-4 h-4 ${enabled ? 'animate-bounce text-amber-200' : 'text-slate-400'}`} />
          <span>{enabled ? 'الخريطة الحرارية (مفعّلة)' : 'عرض الخريطة الحرارية (Heatmap)'}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
            enabled ? 'bg-black/40 text-amber-300' : 'bg-slate-800 text-slate-400'
          }`}>
            {heatPoints.length} بؤرة
          </span>
        </button>

        {/* Heatmap Control Panel (visible when enabled) */}
        {enabled && (
          <div className="bg-slate-950/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl w-72 text-right text-xs text-white space-y-3 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <button
                onClick={() => setShowControls(!showControls)}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showControls ? 'إخفاء المعايير' : 'ضبط المعايير'}</span>
              </button>
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Flame className="w-3.5 h-3.5" />
                <span>معايير الخريطة الحرارية</span>
              </div>
            </div>

            {/* Metric Selector Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setMetric('traffic')}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                  metric === 'traffic'
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                كثافة المرور
              </button>
              <button
                onClick={() => setMetric('sales')}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                  metric === 'sales'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                مبيعات الغاز
              </button>
              <button
                onClick={() => setMetric('competitive')}
                className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer ${
                  metric === 'competitive'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                التنافسية
              </button>
            </div>

            {/* Metric Description */}
            <p className="text-[11px] text-slate-300 leading-tight">
              {metric === 'traffic' && '🔥 توزيع كثافة حركة المركبات وتدفق أسطول التموين المستهدف المرصود بالكاميرا.'}
              {metric === 'sales' && '🟢 توزيع بؤر الاستهلاك وسعات مبيعات محطات الغاز الطبيعي (م³/شهر).'}
              {metric === 'competitive' && '🟣 تركيز وتوزيع محطات كارجاس مقارنة بالمنافسين (غازتك، ماستر جاس، والوقود السائل).'}
            </p>

            {showControls && (
              <div className="space-y-2 pt-1 border-t border-slate-800/80">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>{radius} px</span>
                    <span>نصف قطر التوهج (Radius):</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="70"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>{Math.round(maxIntensity * 100)}%</span>
                    <span>شدة التوهج (Intensity):</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="1.5"
                    step="0.1"
                    value={maxIntensity}
                    onChange={(e) => setMaxIntensity(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Heat Gradient Legend */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-300 mb-1 text-center">
                مقياس الكثافة والطلب (Density Scale)
              </div>
              <div className="h-2.5 rounded-full w-full bg-gradient-to-r from-blue-500 via-emerald-400 via-amber-400 via-orange-500 to-rose-600 shadow-inner" />
              <div className="flex justify-between text-[9px] text-slate-400 mt-1 font-mono">
                <span>منخفض</span>
                <span>متوسط</span>
                <span>مرتفع</span>
                <span className="text-rose-400 font-bold">بؤرة قصوى</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </>
  );
};
