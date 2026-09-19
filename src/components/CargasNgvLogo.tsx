import React from 'react';

interface CargasNgvLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
  subtitle?: string;
  lightBackground?: boolean;
}

export const CargasNgvLogo: React.FC<CargasNgvLogoProps> = ({
  className = '',
  showText = false,
  size = 'md',
  layout = 'horizontal',
  subtitle,
  lightBackground = false
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28'
  };

  const textSizes = {
    xs: { title: 'text-xs', ngv: 'text-xs', sub: 'text-[9px]' },
    sm: { title: 'text-sm', ngv: 'text-xs', sub: 'text-[10px]' },
    md: { title: 'text-base', ngv: 'text-sm', sub: 'text-[10px]' },
    lg: { title: 'text-lg', ngv: 'text-base', sub: 'text-xs' },
    xl: { title: 'text-2xl', ngv: 'text-xl', sub: 'text-sm' }
  };

  const isVertical = layout === 'vertical';

  return (
    <div className={`inline-flex ${isVertical ? 'flex-col items-center text-center' : 'items-center text-right'} gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} shrink-0 relative flex items-center justify-center`}>
        <img
          src="/cargas_ngv_logo.svg"
          alt="كارجاس NGV"
          className="w-full h-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-150"
        />
      </div>
      {showText && (
        <div className={`flex flex-col ${isVertical ? 'items-center' : 'items-start'}`}>
          <div className="flex items-center gap-1 leading-tight font-black">
            <span className={lightBackground ? 'text-slate-900' : 'text-white'}>كارجاس</span>
            <span className="text-amber-400 font-mono">NGV</span>
          </div>
          {subtitle && (
            <span className={`text-[11px] ${lightBackground ? 'text-slate-600' : 'text-slate-400'}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
