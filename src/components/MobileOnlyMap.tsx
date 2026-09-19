import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Printer, 
  Plus, 
  Search, 
  Navigation, 
  Building2, 
  Info, 
  CheckCircle2, 
  ShieldAlert, 
  Flame, 
  Car, 
  Filter, 
  Eye, 
  EyeOff, 
  Crosshair,
  Maximize2
} from 'lucide-react';
import L from 'leaflet';
import { MonitoringSession, CNGStation, VehicleType, VEHICLE_TYPES } from '../types';
import { CargasNgvLogo } from './CargasNgvLogo';
import { BRANDS_INFO, BrandType, getCompanyMarkerHtml, CompanyBrandBadge } from './CompanyBrandBadges';
import { MapPrintReportModal } from './MapPrintReportModal';
import { AddStationMapModal } from './AddStationMapModal';

export interface MobileOnlyMapProps {
  sessions: MonitoringSession[];
  stations: CNGStation[];
  onUpdateStations?: (stations: CNGStation[]) => void;
  isMobilePreview?: boolean;
  setIsMobilePreview?: (val: boolean | ((prev: boolean) => boolean)) => void;
  onSelectSession?: (session: MonitoringSession) => void;
}

// Calculate Haversine distance in km between two GPS points
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const MobileOnlyMap: React.FC<MobileOnlyMapProps> = ({
  sessions,
  stations,
  onUpdateStations,
  onSelectSession,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circlesLayerRef = useRef<L.LayerGroup | null>(null);

  // Map Display Mode: Google Earth (Satellite) vs Google Maps (Streets) vs Dark GIS
  const [mapMode, setMapMode] = useState<'satellite' | 'streets' | 'dark'>('satellite');

  // Layer Visibility Toggles
  const [showCargasStations, setShowCargasStations] = useState<boolean>(true);
  const [showCompetitors, setShowCompetitors] = useState<boolean>(true);
  const [showSurveySites, setShowSurveySites] = useState<boolean>(true);
  const [showCoverageCircles, setShowCoverageCircles] = useState<boolean>(true);

  // Placement Tool: is user currently placing a station by clicking on the map?
  const [isPlacingStation, setIsPlacingStation] = useState<boolean>(false);
  const [clickCoords, setClickCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Currently Selected Target Station or Survey Session
  const [selectedStation, setSelectedStation] = useState<CNGStation | null>(() => {
    return stations.find(s => s.company.includes('كارجاس') || s.brand === 'cargas') || stations[0] || null;
  });
  const [selectedSession, setSelectedSession] = useState<MonitoringSession | null>(() => {
    return sessions[0] || null;
  });

  // Local stations list (merged with incoming props and newly created stations)
  const [localStations, setLocalStations] = useState<CNGStation[]>(stations);

  useEffect(() => {
    setLocalStations(stations);
  }, [stations]);

  // Egyptian Geographic Quick Jump Regions
  const QUICK_REGIONS = [
    { name: 'القاهرة الكبرى', lat: 30.0444, lng: 31.2357, zoom: 12 },
    { name: 'الجيزة والهرم', lat: 29.9880, lng: 31.1350, zoom: 13 },
    { name: 'الإسكندرية', lat: 31.2001, lng: 29.9187, zoom: 12 },
    { name: 'الدلتا (بنها وطريق إسكندرية)', lat: 30.4650, lng: 31.1840, zoom: 13 },
    { name: 'شرق القاهرة والتجمع', lat: 30.0152, lng: 31.3910, zoom: 13 },
    { name: 'الصعيد (أسيوط والمنيا)', lat: 27.1809, lng: 31.1837, zoom: 11 },
  ];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const defaultCenter: [number, number] = selectedStation 
      ? [selectedStation.lat, selectedStation.lng] 
      : [29.9880, 31.1350];

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(defaultCenter, 13);

    mapInstanceRef.current = map;

    // Add Top-Left Zoom Control
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Create marker and circle layer groups
    markersLayerRef.current = L.layerGroup().addTo(map);
    circlesLayerRef.current = L.layerGroup().addTo(map);

    // Map Click Listener for Station Placement
    map.on('click', (e: L.LeafletMouseEvent) => {
      setClickCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      setIsAddModalOpen(true);
      setIsPlacingStation(false);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer according to selected map mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }
    if (labelLayerRef.current) {
      map.removeLayer(labelLayerRef.current);
      labelLayerRef.current = null;
    }

    if (mapMode === 'satellite') {
      // Esri World Imagery (Google Earth / Satellite high-res view)
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, subdomains: ['server', 'services'] }
      ).addTo(map);

      // Add Carto transparent roads and labels overlay on top of satellite
      labelLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
    } else if (mapMode === 'streets') {
      // Carto Voyager Streets (Google Road style with Egyptian roads in Arabic)
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
    } else {
      // Dark GIS Matter
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
        { maxZoom: 19, subdomains: 'abcd' }
      ).addTo(map);
    }
  }, [mapMode]);

  // Update Map Markers and Concentric Influence Circles
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const circlesGroup = circlesLayerRef.current;

    if (!map || !markersGroup || !circlesGroup) return;

    markersGroup.clearLayers();
    circlesGroup.clearLayers();

    // 1. Draw Concentric Influence Circles around selected station or session
    const targetCoords = selectedStation 
      ? { lat: selectedStation.lat, lng: selectedStation.lng }
      : selectedSession
      ? { lat: selectedSession.coordinates.lat, lng: selectedSession.coordinates.lng }
      : null;

    if (targetCoords && showCoverageCircles) {
      const center: [number, number] = [targetCoords.lat, targetCoords.lng];

      // 1 km Circle (Direct Fleet Density)
      L.circle(center, {
        radius: 1000,
        color: '#22c55e',
        fillColor: '#22c55e',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(circlesGroup);

      // 3 km Circle (Primary CNG Commercial Attraction Radius)
      L.circle(center, {
        radius: 3000,
        color: '#eab308',
        fillColor: '#eab308',
        fillOpacity: 0.06,
        weight: 1.5,
        dashArray: '6, 6'
      }).addTo(circlesGroup);

      // 5 km Circle (Regional Corridor Radius)
      L.circle(center, {
        radius: 5000,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.03,
        weight: 1.5,
        dashArray: '8, 8'
      }).addTo(circlesGroup);
    }

    // 2. Render CNG Stations with Genuine Company Logos
    localStations.forEach((st) => {
      const isCargas = st.company.includes('كارجاس') || st.brand === 'cargas';
      if (isCargas && !showCargasStations) return;
      if (!isCargas && !showCompetitors) return;

      const brandKey = (st.brand || (isCargas ? 'cargas' : 'other')) as BrandType;
      const isProposed = st.status === 'proposed';

      const icon = L.divIcon({
        className: 'custom-company-brand-marker',
        html: getCompanyMarkerHtml(brandKey, st.name, isProposed),
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -44],
      });

      const marker = L.marker([st.lat, st.lng], { icon }).addTo(markersGroup);

      marker.on('click', () => {
        setSelectedStation(st);
      });
    });

    // 3. Render Field Survey Sessions (Monitoring Sites)
    if (showSurveySites) {
      sessions.forEach((sess) => {
        const totalCount = Object.values(sess.counts).reduce((a, b) => a + b, 0);

        const surveyIcon = L.divIcon({
          className: 'custom-survey-marker',
          html: `
            <div style="
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              transform: translate(-50%, -100%);
              cursor: pointer;
            ">
              <div style="
                background: #0284c7;
                border: 2.5px solid #38bdf8;
                box-shadow: 0 4px 12px rgba(56, 189, 248, 0.6);
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ffffff;
                font-size: 16px;
              ">
                📹
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 7px solid #38bdf8;
              "></div>
              <div style="
                background: rgba(15, 23, 42, 0.94);
                border: 1px solid #38bdf8;
                color: #38bdf8;
                padding: 2px 6px;
                border-radius: 5px;
                font-size: 10px;
                font-weight: 700;
                white-space: nowrap;
                margin-top: 1px;
                font-family: 'Cairo', sans-serif;
              ">
                رصد: ${totalCount} مركبة
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        const sessMarker = L.marker([sess.coordinates.lat, sess.coordinates.lng], { icon: surveyIcon }).addTo(markersGroup);

        sessMarker.on('click', () => {
          setSelectedSession(sess);
          if (onSelectSession) {
            onSelectSession(sess);
          }
        });
      });
    }
  }, [
    localStations, 
    sessions, 
    selectedStation, 
    selectedSession, 
    showCargasStations, 
    showCompetitors, 
    showSurveySites, 
    showCoverageCircles
  ]);

  // Calculate nearby competitor stations matrix with live distances from active selection
  const nearbyCompetitors = useMemo(() => {
    const targetCoords = selectedStation 
      ? { lat: selectedStation.lat, lng: selectedStation.lng }
      : selectedSession
      ? { lat: selectedSession.coordinates.lat, lng: selectedSession.coordinates.lng }
      : null;

    if (!targetCoords) return [];

    return localStations
      .filter(st => !st.company.includes('كارجاس') && st.brand !== 'cargas')
      .map(st => ({
        station: st,
        distanceKm: calculateDistanceKm(targetCoords.lat, targetCoords.lng, st.lat, st.lng)
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [selectedStation, selectedSession, localStations]);

  // Handle saving newly created station
  const handleSaveStation = (newStation: CNGStation) => {
    const updated = [newStation, ...localStations];
    setLocalStations(updated);
    setSelectedStation(newStation);
    if (onUpdateStations) {
      onUpdateStations(updated);
    }
    // Fly to new station on map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([newStation.lat, newStation.lng], 15, { duration: 1.2 });
    }
  };

  // Fly to region
  const handleFlyTo = (lat: number, lng: number, zoom = 14) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1 });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-3 space-y-3">
      
      {/* Top Header & GIS Toolbar */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Title & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 flex items-center justify-center shrink-0">
              <img src="/cargas_ngv_logo.svg" alt="كارجاس" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  خريطة محطات الغاز الطبيعي والمواقع الميدانية
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  GIS كارجاس NGV
                </span>
              </div>
              <p className="text-xs text-slate-400">
                عرض صور الأقمار الصناعية (Google Earth / Esri) وشبكة الطرق، وتحديد شعارات ومواقع المحطات المنافسة بدقة
              </p>
            </div>
          </div>

          {/* Quick Actions Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Map Mode Switcher (Google Earth vs Streets) */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                id="btn-map-mode-satellite"
                onClick={() => setMapMode('satellite')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  mapMode === 'satellite'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🛰️ قمر صناعي (Google Earth)</span>
              </button>
              <button
                id="btn-map-mode-streets"
                onClick={() => setMapMode('streets')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  mapMode === 'streets'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🗺️ شبكة الطرق (Google Maps)</span>
              </button>
              <button
                id="btn-map-mode-dark"
                onClick={() => setMapMode('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  mapMode === 'dark'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🌙 ليلي (GIS)</span>
              </button>
            </div>

            {/* Place Station Tool Button */}
            <button
              id="btn-place-station-on-map"
              onClick={() => {
                setIsPlacingStation(prev => !prev);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isPlacingStation
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 animate-pulse'
                  : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/50'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              <span>{isPlacingStation ? 'انقر على الخريطة لتثبيت الموقع' : 'وضع لوجو واسم محطة جديدة'}</span>
            </button>

            {/* Print Map Report Button */}
            <button
              id="btn-open-print-report"
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>طباعة الخريطة والتقرير</span>
            </button>

          </div>
        </div>

        {/* Filter and Quick Zoom Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Layers Visibility Checkboxes */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              طبقات العرض:
            </span>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-200 select-none">
              <input
                type="checkbox"
                checked={showCargasStations}
                onChange={(e) => setShowCargasStations(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-700"
              />
              <span className="text-emerald-400 font-bold">محطات كارجاس NGV</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-200 select-none">
              <input
                type="checkbox"
                checked={showCompetitors}
                onChange={(e) => setShowCompetitors(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
              />
              <span>شعار محطات المنافسين (غازتك، ماستر جاس، تشيل أوت، وطنية)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-200 select-none">
              <input
                type="checkbox"
                checked={showSurveySites}
                onChange={(e) => setShowSurveySites(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-sky-500 focus:ring-sky-500 bg-slate-800 border-slate-700"
              />
              <span>مواقع الرصد الميداني للكاميرا</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-200 select-none">
              <input
                type="checkbox"
                checked={showCoverageCircles}
                onChange={(e) => setShowCoverageCircles(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-700"
              />
              <span>دوائر نطاق التأثير (1، 3، 5 كم)</span>
            </label>
          </div>

          {/* Quick Geographic Zoom Links */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-slate-400 whitespace-nowrap">انتقال سريع:</span>
            {QUICK_REGIONS.map((r, i) => (
              <button
                key={i}
                onClick={() => handleFlyTo(r.lat, r.lng, r.zoom)}
                className="px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 font-medium whitespace-nowrap border border-slate-700/60 transition-colors cursor-pointer"
              >
                {r.name}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Main Map & GIS Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Map Container (takes 8 cols on desktop) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          
          {/* Cursor Placement Alert if Placing Station */}
          {isPlacingStation && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-full shadow-2xl border-2 border-amber-300 text-xs flex items-center gap-2 animate-bounce">
              <Crosshair className="w-4 h-4 animate-spin" />
              <span>انقر في أي مكان على خريطة القمر الصناعي لتثبيت الموقع الجديد واللوجو</span>
            </div>
          )}

          {/* Leaflet Map DOM Element */}
          <div
            ref={mapContainerRef}
            id="cargas-gis-map-canvas"
            className={`w-full h-[520px] sm:h-[620px] lg:h-[700px] z-10 ${
              isPlacingStation ? 'cursor-crosshair' : 'cursor-grab'
            }`}
          />

          {/* Bottom Map Status Floating Legend */}
          <div className="absolute bottom-3 left-3 z-20 bg-slate-950/90 backdrop-blur-md border border-slate-800 text-white px-3 py-2 rounded-xl text-[11px] shadow-xl flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>كارجاس NGV</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
              <span>غازتك (GASTEC)</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span>ماستر جاس / طاقة</span>
            </div>
            <div className="flex items-center gap-1.5 text-green-400">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
              <span>تشيل أوت (ChillOut)</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span>الوطنية</span>
            </div>
          </div>

        </div>

        {/* Sidebar: Station Detail & Competitor Proximity Radar (takes 4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Active Selection Details Card */}
          {selectedStation ? (
            <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <CompanyBrandBadge brand={selectedStation.brand || (selectedStation.company.includes('كارجاس') ? 'cargas' : 'other')} />
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedStation.status === 'proposed'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : selectedStation.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                }`}>
                  {selectedStation.status === 'proposed' ? 'موقع مقترح كارجاس ⭐' : 'محطة قائمة وتعمل ✅'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base leading-snug">{selectedStation.name}</h3>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{selectedStation.address} ({selectedStation.city} - {selectedStation.governorate})</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">نقاط التموين (Dispensers):</span>
                  <strong className="text-white font-mono text-sm">{selectedStation.dispenserCount} مسدس</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">مركز تحويل سيارات:</span>
                  <strong className={selectedStation.hasConversionCenter ? 'text-emerald-400' : 'text-slate-500'}>
                    {selectedStation.hasConversionCenter ? 'مجهز بالكامل' : 'غير متوفر'}
                  </strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>GPS: {selectedStation.lat.toFixed(5)}, {selectedStation.lng.toFixed(5)}</span>
                  <button
                    onClick={() => handleFlyTo(selectedStation.lat, selectedStation.lng, 16)}
                    className="text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    تقريب الخريطة 🔍
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة تقرير هذا الموقع الجغرافي</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
              <MapPin className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
              <p>حدد محطة أو موقعاً على الخريطة لعرض التفاصيل وحساب مسافات المنافسين</p>
            </div>
          )}

          {/* Competitor Proximity Radar Matrix */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>رادار المحطات المنافسة القريبة</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {nearbyCompetitors.length} محطة مسجلة
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              المسافات المحسوبة من موقع المحطة المختارة إلى أقرب محطات غازتك، ماستر جاس، تشيل أوت، وطنية:
            </p>

            <div className="space-y-2 max-h-[340px] overflow-y-auto no-scrollbar">
              {nearbyCompetitors.map(({ station: comp, distanceKm }, idx) => {
                const compBrand = (comp.brand || 'other') as BrandType;
                const bMeta = BRANDS_INFO[compBrand] || BRANDS_INFO.other;
                const isVeryClose = distanceKm < 2.0;

                return (
                  <div
                    key={comp.id || idx}
                    onClick={() => handleFlyTo(comp.lat, comp.lng, 15)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isVeryClose
                        ? 'bg-rose-950/30 border-rose-500/40 hover:bg-rose-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full inline-block shrink-0" 
                          style={{ backgroundColor: bMeta.primaryColor }}
                        />
                        <strong className="text-white font-bold">{comp.company}</strong>
                      </div>
                      <span className="font-mono font-bold text-amber-400 text-xs">
                        {distanceKm.toFixed(2)} كم
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 truncate">{comp.name}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800/80">
                      <span>{comp.dispenserCount} نقاط شحن</span>
                      <span className={isVeryClose ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        {isVeryClose ? 'منافسة مباشرة لصيقة' : 'نطاق جغرافي متباعد'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Add / Place Station Modal */}
      <AddStationMapModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveStation={handleSaveStation}
        initialCoords={clickCoords}
      />

      {/* Map Print Report Modal */}
      <MapPrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        selectedStation={selectedStation}
        selectedSession={selectedSession}
        nearbyCompetitors={nearbyCompetitors}
        mapTileMode={mapMode === 'satellite' ? 'satellite' : 'streets'}
      />

    </div>
  );
};

// Re-export as InteractiveGisMap for modern semantic naming
export const InteractiveGisMap = MobileOnlyMap;
