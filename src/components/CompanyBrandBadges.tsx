import React from 'react';
import { FacilityType } from '../types';

export type BrandType = 
  | 'cargas' 
  | 'gastec' 
  | 'mastergas' 
  | 'taqa' 
  | 'chillout' 
  | 'wataniya' 
  | 'totalenergies' 
  | 'shell' 
  | 'mobil' 
  | 'misr_petroleum'
  | 'coop'
  | 'gogas'
  | 'other';

export interface BrandInfo {
  id: BrandType;
  nameAr: string;
  nameEn: string;
  primaryColor: string;
  accentColor: string;
  badgeBg: string;
  textColor: string;
  isCompetitor: boolean;
}

export const BRANDS_INFO: Record<BrandType, BrandInfo> = {
  cargas: {
    id: 'cargas',
    nameAr: 'كارجاس',
    nameEn: 'CARGAS NGV',
    primaryColor: '#009639',
    accentColor: '#FFCC00',
    badgeBg: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
    isCompetitor: false,
  },
  gastec: {
    id: 'gastec',
    nameAr: 'غازتك',
    nameEn: 'GASTEC',
    primaryColor: '#0284c7',
    accentColor: '#f97316',
    badgeBg: 'bg-sky-500/20',
    textColor: 'text-sky-400',
    isCompetitor: true,
  },
  mastergas: {
    id: 'mastergas',
    nameAr: 'ماستر جاس',
    nameEn: 'Master Gas',
    primaryColor: '#dc2626',
    accentColor: '#fbbf24',
    badgeBg: 'bg-red-500/20',
    textColor: 'text-red-400',
    isCompetitor: true,
  },
  taqa: {
    id: 'taqa',
    nameAr: 'طاقة غاز',
    nameEn: 'TAQA Gas',
    primaryColor: '#b91c1c',
    accentColor: '#f59e0b',
    badgeBg: 'bg-rose-500/20',
    textColor: 'text-rose-400',
    isCompetitor: true,
  },
  chillout: {
    id: 'chillout',
    nameAr: 'تشيل أوت',
    nameEn: 'ChillOut',
    primaryColor: '#15803d',
    accentColor: '#eab308',
    badgeBg: 'bg-green-500/20',
    textColor: 'text-green-400',
    isCompetitor: true,
  },
  wataniya: {
    id: 'wataniya',
    nameAr: 'الوطنية',
    nameEn: 'Wataniya',
    primaryColor: '#991b1b',
    accentColor: '#ffffff',
    badgeBg: 'bg-red-600/20',
    textColor: 'text-red-400',
    isCompetitor: true,
  },
  totalenergies: {
    id: 'totalenergies',
    nameAr: 'توتال إنرجيز',
    nameEn: 'TotalEnergies',
    primaryColor: '#e11d48',
    accentColor: '#38bdf8',
    badgeBg: 'bg-rose-600/20',
    textColor: 'text-rose-400',
    isCompetitor: true,
  },
  shell: {
    id: 'shell',
    nameAr: 'شل',
    nameEn: 'Shell',
    primaryColor: '#ca8a04',
    accentColor: '#dc2626',
    badgeBg: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    isCompetitor: true,
  },
  mobil: {
    id: 'mobil',
    nameAr: 'موبيل',
    nameEn: 'Mobil',
    primaryColor: '#1d4ed8',
    accentColor: '#ef4444',
    badgeBg: 'bg-blue-600/20',
    textColor: 'text-blue-400',
    isCompetitor: true,
  },
  misr_petroleum: {
    id: 'misr_petroleum',
    nameAr: 'مصر للبترول',
    nameEn: 'Misr Petroleum',
    primaryColor: '#0369a1',
    accentColor: '#dc2626',
    badgeBg: 'bg-cyan-600/20',
    textColor: 'text-cyan-400',
    isCompetitor: true,
  },
  coop: {
    id: 'coop',
    nameAr: 'التعاون للبترول',
    nameEn: 'Coop Petroleum',
    primaryColor: '#eab308',
    accentColor: '#1e3a8a',
    badgeBg: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    isCompetitor: true,
  },
  gogas: {
    id: 'gogas',
    nameAr: 'جو جاس',
    nameEn: 'Go Gas',
    primaryColor: '#10b981',
    accentColor: '#0284c7',
    badgeBg: 'bg-emerald-600/20',
    textColor: 'text-emerald-400',
    isCompetitor: true,
  },
  other: {
    id: 'other',
    nameAr: 'محطة أخرى',
    nameEn: 'Other Station',
    primaryColor: '#64748b',
    accentColor: '#94a3b8',
    badgeBg: 'bg-slate-500/20',
    textColor: 'text-slate-400',
    isCompetitor: true,
  },
};

/**
 * Returns an HTML string for Leaflet DivIcon containing the authentic company logo and facility badge
 */
export function getCompanyMarkerHtml(
  brand: BrandType, 
  stationName: string, 
  isProposed = false,
  facilityType: FacilityType = 'fueling_station'
): string {
  // Mini Type Badge: Center, Station, Integrated
  let facilityTagHtml = '';
  if (facilityType === 'conversion_center') {
    facilityTagHtml = `
      <div style="position: absolute; top: -6px; right: -6px; background: #eab308; color: #000; font-size: 9px; font-weight: 900; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.5); border: 1.5px solid #fff;" title="مركز تحويل">
        🔧
      </div>
    `;
  } else if (facilityType === 'integrated') {
    facilityTagHtml = `
      <div style="position: absolute; top: -6px; right: -6px; background: #10b981; color: #fff; font-size: 8px; font-weight: 900; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.5); border: 1.5px solid #fff;" title="تموين + تحويل">
        ⭐
      </div>
    `;
  }

  if (brand === 'cargas') {
    const label = isProposed 
      ? '⭐ موقع كارجاس مقترح' 
      : facilityType === 'conversion_center' 
        ? 'مركز تحويل كارجاس' 
        : facilityType === 'integrated' 
          ? 'تموين وتحويل كارجاس' 
          : 'كارجاس NGV';

    return `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
        cursor: pointer;
      ">
        ${facilityTagHtml}
        <div style="
          background: ${isProposed ? '#1e293b' : '#052e16'};
          border: 2.5px solid ${isProposed ? '#38bdf8' : '#22c55e'};
          box-shadow: 0 4px 14px rgba(34, 197, 94, 0.45);
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3px;
          background-clip: padding-box;
        ">
          <img src="/cargas_ngv_logo.svg" alt="CARGAS" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 8px solid ${isProposed ? '#38bdf8' : '#22c55e'};
          margin-top: -1px;
        "></div>
        <div style="
          background: rgba(15, 23, 42, 0.92);
          border: 1px solid rgba(34, 197, 94, 0.5);
          color: #ffffff;
          padding: 2px 7px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          margin-top: 2px;
          font-family: 'Cairo', sans-serif;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        ">
          ${label}
        </div>
      </div>
    `;
  }

  // Competitor Brand Markers
  const info = BRANDS_INFO[brand] || BRANDS_INFO.other;
  let logoGlyph = '';

  switch (brand) {
    case 'gastec':
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none">
            <path d="M12 2C8 6 6 10 6 14C6 17.5 8.5 20 12 20C15.5 20 18 17.5 18 14C18 10 16 6 12 2Z" fill="#0284c7"/>
            <path d="M12 6C9.5 9 8.5 11.5 8.5 14C8.5 16 10 18 12 18C14 18 15.5 16 15.5 14C15.5 11.5 14.5 9 12 6Z" fill="#f97316"/>
          </svg>
          <span style="font-size: 7.5px; font-weight: 900; color: #0284c7; letter-spacing: 0.5px; font-family: sans-serif;">GASTEC</span>
        </div>
      `;
      break;

    case 'mastergas':
    case 'taqa':
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none">
            <path d="M12 3C9 7 7 11 7 15C7 18 9 20 12 20C15 20 17 18 17 15C17 11 15 7 12 3Z" fill="#dc2626"/>
            <path d="M12 8C10.5 11 9.5 13 9.5 15C9.5 16.5 10.5 18 12 18C13.5 18 14.5 16.5 14.5 15C14.5 13 13.5 11 12 8Z" fill="#fbbf24"/>
          </svg>
          <span style="font-size: 7.5px; font-weight: 900; color: #dc2626; font-family: sans-serif;">${brand === 'taqa' ? 'TAQA' : 'MASTER'}</span>
        </div>
      `;
      break;

    case 'chillout':
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <div style="background: #15803d; border-radius: 6px; padding: 2px 4px; display: flex; align-items: center; gap: 1px;">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="#fbbf24">
              <polygon points="12 2 15 8 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 8 12 2"/>
            </svg>
          </div>
          <span style="font-size: 7.5px; font-weight: 900; color: #16a34a; font-family: sans-serif;">ChillOut</span>
        </div>
      `;
      break;

    case 'wataniya':
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <div style="width: 18px; height: 18px; border-radius: 4px; background: #991b1b; display: flex; align-items: center; justify-content: center; border: 1px solid #fbbf24;">
            <span style="color: #ffffff; font-size: 10px; font-weight: 900;">وط</span>
          </div>
          <span style="font-size: 7.5px; font-weight: 900; color: #ef4444; font-family: 'Cairo', sans-serif;">الوطنية</span>
        </div>
      `;
      break;

    case 'totalenergies':
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#e11d48" stroke-width="2.5" stroke-dasharray="8 3"/>
            <circle cx="12" cy="12" r="4" fill="#38bdf8"/>
          </svg>
          <span style="font-size: 7px; font-weight: 900; color: #e11d48; font-family: sans-serif;">TOTAL</span>
        </div>
      `;
      break;

    case 'misr_petroleum':
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <div style="width: 18px; height: 18px; border-radius: 50%; background: #0369a1; display: flex; align-items: center; justify-content: center; border: 1.5px solid #dc2626;">
            <span style="color: #ffffff; font-size: 8px; font-weight: 900;">مصر</span>
          </div>
          <span style="font-size: 7px; font-weight: 900; color: #0284c7; font-family: 'Cairo', sans-serif;">مصر للبترول</span>
        </div>
      `;
      break;

    case 'coop':
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <div style="width: 18px; height: 18px; border-radius: 4px; background: #eab308; display: flex; align-items: center; justify-content: center; border: 1px solid #1e3a8a;">
            <span style="color: #1e3a8a; font-size: 9px; font-weight: 900;">COOP</span>
          </div>
          <span style="font-size: 7px; font-weight: 900; color: #eab308; font-family: 'Cairo', sans-serif;">التعاون</span>
        </div>
      `;
      break;

    case 'shell':
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path d="M12 2C8 3 4 7 4 13C4 17 7 19 10 20L9 22H15L14 20C17 19 20 17 20 13C20 7 16 3 12 2Z" fill="#facc15" stroke="#dc2626" stroke-width="1.5"/>
            <path d="M12 5V19M8 9C9 13 10 17 10 19M16 9C15 13 14 17 14 19" stroke="#dc2626" stroke-width="1"/>
          </svg>
          <span style="font-size: 7px; font-weight: 900; color: #facc15; font-family: sans-serif;">SHELL</span>
        </div>
      `;
      break;

    case 'mobil':
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <div style="display: flex; align-items: center; font-size: 9px; font-weight: 900; font-family: sans-serif; letter-spacing: -0.5px;">
            <span style="color: #1d4ed8;">M</span>
            <span style="color: #ef4444;">o</span>
            <span style="color: #1d4ed8;">bil</span>
          </div>
          <span style="font-size: 6.5px; font-weight: 800; color: #93c5fd; font-family: 'Cairo', sans-serif;">موبيل</span>
        </div>
      `;
      break;

    case 'gogas':
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <span style="font-size: 11px;">⚡</span>
          <span style="font-size: 7.5px; font-weight: 900; color: #10b981; font-family: sans-serif;">GoGas</span>
        </div>
      `;
      break;

    default:
      logoGlyph = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="${info.primaryColor}" stroke-width="2">
            <path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6"/>
          </svg>
          <span style="font-size: 7.5px; font-weight: 800; color: #cbd5e1; font-family: sans-serif;">${info.nameAr}</span>
        </div>
      `;
      break;
  }

  return `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translate(-50%, -100%);
      cursor: pointer;
    ">
      ${facilityTagHtml}
      <div style="
        background: #0f172a;
        border: 2px solid ${info.primaryColor};
        box-shadow: 0 4px 10px rgba(0,0,0,0.45);
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
      ">
        ${logoGlyph}
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 7px solid ${info.primaryColor};
        margin-top: -1px;
      "></div>
      <div style="
        background: rgba(15, 23, 42, 0.92);
        border: 1px solid ${info.primaryColor};
        color: #f1f5f9;
        padding: 1.5px 6px;
        border-radius: 5px;
        font-size: 10px;
        font-weight: 600;
        white-space: nowrap;
        margin-top: 1px;
        font-family: 'Cairo', sans-serif;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      ">
        ${info.nameAr}
      </div>
    </div>
  `;
}

/**
 * React Component to render any brand's logo badge in UI / Modals / Report
 */
export const CompanyBrandBadge: React.FC<{
  brand?: string;
  facilityType?: FacilityType;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}> = ({ brand = 'cargas', facilityType = 'fueling_station', size = 'md', showSubtitle = true }) => {
  const normBrand = (brand?.toLowerCase() || 'other') as BrandType;
  const brandKey = Object.keys(BRANDS_INFO).includes(normBrand) ? normBrand : 'other';
  const info = BRANDS_INFO[brandKey];

  const facilityLabel = facilityType === 'conversion_center' 
    ? 'مركز تحويل وصيانة' 
    : facilityType === 'integrated' 
      ? 'محطة متكاملة (تموين + تحويل)' 
      : 'محطة تموين غاز';

  if (brandKey === 'cargas') {
    return (
      <div className="flex items-center gap-2">
        <div className="relative w-9 h-9 p-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-sm">
          <img src="/cargas_ngv_logo.svg" alt="CARGAS" className="w-full h-full object-contain" />
          {facilityType === 'conversion_center' && (
            <span className="absolute -top-1 -right-1 text-[10px]" title="مركز تحويل">🔧</span>
          )}
        </div>
        <div>
          <div className="flex items-center gap-1 font-black text-sm text-white leading-tight">
            <span>كارجاس</span>
            <span className="text-amber-400 font-mono text-xs">NGV</span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] text-emerald-400 font-medium">{facilityLabel}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div 
        className="relative w-9 h-9 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0"
        style={{ backgroundColor: `${info.primaryColor}20`, borderColor: `${info.primaryColor}60`, color: info.primaryColor }}
      >
        {info.nameEn.slice(0, 3).toUpperCase()}
        {facilityType === 'conversion_center' && (
          <span className="absolute -top-1 -right-1 text-[10px]" title="مركز تحويل">🔧</span>
        )}
      </div>
      <div>
        <div className="font-bold text-sm text-white leading-tight">
          {info.nameAr}
        </div>
        {showSubtitle && (
          <span className="text-[10px] text-slate-400 font-medium">منافس: {facilityLabel}</span>
        )}
      </div>
    </div>
  );
};
