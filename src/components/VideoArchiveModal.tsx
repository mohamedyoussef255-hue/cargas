import React, { useState } from 'react';
import { 
  Film, 
  Play, 
  Pause, 
  X, 
  Clock, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Search, 
  Filter, 
  Maximize2, 
  Volume2, 
  FileText,
  Calendar,
  Layers,
  Wrench
} from 'lucide-react';
import { DepartmentRole, RecordedVideoSession } from '../types';
import { loadVideoArchive } from '../data/authCredentials';
import { DEPARTMENTS_METADATA } from '../data/departmentCustomFields';

interface VideoArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDepartmentFilter?: DepartmentRole | 'all';
  isEmbedded?: boolean;
}

export const VideoArchiveModal: React.FC<VideoArchiveModalProps> = ({
  isOpen,
  onClose,
  defaultDepartmentFilter = 'all',
  isEmbedded = false,
}) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentRole | 'all'>(defaultDepartmentFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlayingVideo, setActivePlayingVideo] = useState<RecordedVideoSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackProgress, setPlaybackProgress] = useState(25); // percentage for simulation

  if (!isOpen) return null;

  const allVideos = loadVideoArchive();

  const filteredVideos = allVideos.filter(v => {
    const matchDept = selectedDept === 'all' || v.department === selectedDept;
    const matchSearch = searchQuery.trim() === '' || 
      v.sessionTitle.includes(searchQuery) || 
      v.locationName.includes(searchQuery) ||
      v.governorate.includes(searchQuery) ||
      (v.findingsSummary && v.findingsSummary.includes(searchQuery));
    return matchDept && matchSearch;
  });

  const departmentList: { role: DepartmentRole | 'all'; label: string }[] = [
    { role: 'all', label: 'كافة تسجيلات الإدارات' },
    { role: 'operations', label: 'التشغيل والصيانة (الآلات)' },
    { role: 'projects', label: 'المشروعات (الإنشاءات والأرض)' },
    { role: 'marketing', label: 'التسويق والدراسات الميدانية' },
    { role: 'hse', label: 'السلامة والأمان (HSE)' },
    { role: 'technical', label: 'الإدارة الفنية وضغوط الشبكات' },
  ];

  const modalInner = (
    <div className={`relative w-full ${isEmbedded ? '' : 'max-w-6xl max-h-[96vh]'} flex flex-col bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl`}>
      
      {/* Top Header */}
      <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2">
              <span>مخزن تسجيلات وفيديوهات الرصد الميداني</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {filteredVideos.length} تسجيل موثق
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              أرشيف الجلسات المصورة الموثقة للمحطات والمعدات والإنشاءات والجدوى الميدانية
            </p>
          </div>
        </div>

        {!isEmbedded && (
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Video Player Modal/Overlay if a video is selected */}
        {activePlayingVideo && (
          <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex flex-col lg:flex-row gap-6 animate-fadeIn">
            {/* Screen Box */}
            <div className="lg:w-7/12 flex flex-col gap-3">
              <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-slate-800 shadow-xl group">
                <img
                  src={activePlayingVideo.thumbnailUrl}
                  alt={activePlayingVideo.sessionTitle}
                  className="w-full h-full object-cover"
                />
                
                {/* HUD Live Stamp */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-emerald-400 font-mono text-xs border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>توقيت التسجيل: {activePlayingVideo.timestampDisplay}</span>
                </div>

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white font-mono text-xs border border-white/10">
                  {DEPARTMENTS_METADATA[activePlayingVideo.department]?.title || activePlayingVideo.departmentName}
                </div>

                {/* Bottom Controls Bar */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2">
                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <span className="font-mono text-[11px] text-slate-300">
                        {Math.floor((activePlayingVideo.durationSeconds * (playbackProgress / 100)) / 60)}:
                        {Math.floor((activePlayingVideo.durationSeconds * (playbackProgress / 100)) % 60).toString().padStart(2, '0')} / {Math.floor(activePlayingVideo.durationSeconds / 60)}:{Math.floor(activePlayingVideo.durationSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-300 bg-white/10 px-2 py-0.5 rounded">1080p HD</span>
                      <button 
                        onClick={() => setActivePlayingVideo(null)}
                        className="text-slate-400 hover:text-white text-xs underline cursor-pointer mr-2"
                      >
                        تصغير المشغل
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Meta & Inspected Details */}
            <div className="lg:w-5/12 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {activePlayingVideo.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {activePlayingVideo.governorate}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {activePlayingVideo.sessionTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>الموقع: {activePlayingVideo.locationName}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  الموثق: <strong className="text-slate-200">{activePlayingVideo.recordedBy}</strong>
                </p>

                {/* Inspected Equipments list */}
                {activePlayingVideo.equipmentInspected && activePlayingVideo.equipmentInspected.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      <span>المعدات والعناصر التي تم رفعها في الجلسة:</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activePlayingVideo.equipmentInspected.map((item, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-200 border border-slate-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Findings summary */}
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 leading-relaxed">
                  <strong className="block text-emerald-300 font-bold mb-0.5">تقرير نتائج المعاينة:</strong>
                  {activePlayingVideo.findingsSummary || activePlayingVideo.notes}
                </div>
              </div>

              <div className="pt-2 text-left">
                <button
                  onClick={() => setActivePlayingVideo(null)}
                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  إغلاق نافذة العرض
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar & Search */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Department Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {departmentList.map(item => (
              <button
                key={item.role}
                onClick={() => setSelectedDept(item.role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === item.role
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في التسجيلات والمواقع..."
              className="w-full px-3 py-1.5 pr-8 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

        {/* Videos Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Film className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-slate-400">لا توجد تسجيلات مسجلة مطابقة لبحثك</p>
              <p className="text-xs text-slate-500">يمكنك بدء جلسة رصد وتوثيق جديدة عبر كاميرا أي إدارة لحفظها هنا تلقائياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredVideos.map((video) => {
                const isCurrent = activePlayingVideo?.id === video.id;
                const deptMeta = DEPARTMENTS_METADATA[video.department];

                return (
                  <div
                    key={video.id}
                    onClick={() => {
                      setActivePlayingVideo(video);
                      setIsPlaying(true);
                      setPlaybackProgress(30);
                    }}
                    className={`group relative rounded-2xl bg-slate-950 border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                        : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
                    }`}
                  >
                    {/* Thumbnail with Play Overlay */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.sessionTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 font-mono text-[11px] text-white">
                        {Math.floor(video.durationSeconds / 60)}:{Math.floor(video.durationSeconds % 60).toString().padStart(2, '0')}
                      </div>

                      {/* Department badge */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                        {deptMeta?.badge || video.departmentName}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="flex items-center gap-1 font-mono text-emerald-400">
                            <Clock className="w-3 h-3" />
                            <span>{video.timestampDisplay}</span>
                          </span>
                          <span>{video.governorate}</span>
                        </div>
                        <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {video.sessionTitle}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {video.findingsSummary || video.notes}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span>الموثق: {video.recordedBy}</span>
                        <span className="text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
                          <span>تشغيل</span>
                          <Play className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
  );

  return isEmbedded ? (
    modalInner
  ) : (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      {modalInner}
    </div>
  );
};
