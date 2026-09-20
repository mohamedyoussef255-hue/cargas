import React from 'react';

interface CargasNgvLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
  subtitle?: string;
  lightBackground?: boolean;
}

/**
 * CargasNgvLogo Component
 * The graphic logo has been removed per user instruction.
 * If showText is enabled, it renders clean typographic brand text without any logo image.
 */
export const CargasNgvLogo: React.FC<CargasNgvLogoProps> = ({
  className = '',
  showText = false,
  layout = 'horizontal',
  subtitle,
  lightBackground = false
}) => {
  if (!showText) {
    return null;
  }

  const isVertical = layout === 'vertical';

  return (
    <div className={`inline-flex ${isVertical ? 'flex-col items-center text-center' : 'items-center text-right'} gap-2 ${className}`}>
      <div className={`flex flex-col ${isVertical ? 'items-center' : 'items-start'}`}>
        <div className="flex items-center gap-1.5 leading-tight font-black text-sm sm:text-base">
          <span className={lightBackground ? 'text-slate-900' : 'text-white'}>كارجاس</span>
          <span className="text-amber-400 font-mono font-bold text-xs bg-amber-400/10 px-1 py-0.5 rounded border border-amber-400/20">NGV</span>
        </div>
        {subtitle && (
          <span className={`text-[11px] font-medium ${lightBackground ? 'text-slate-600' : 'text-slate-400'}`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
