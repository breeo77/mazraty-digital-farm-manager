import React from 'react';
import { PalmTree, PalmStatus } from '../../types/farm';

interface PalmMarkerProps {
  palm: PalmTree;
  isSelected?: boolean;
  onClick: (palm: PalmTree) => void;
}

export const PalmMarker: React.FC<PalmMarkerProps> = ({
  palm,
  isSelected = false,
  onClick,
}) => {
  const getStatusStyle = (status: PalmStatus) => {
    switch (status) {
      case 'healthy':
        return {
          dotBg: 'bg-primary-container',
          border: 'border-primary-container/30 hover:border-primary',
          bg: 'bg-primary/5 hover:bg-primary/10',
          iconColor: 'text-primary-container',
        };
      case 'needs_followup':
        return {
          dotBg: 'bg-amber-500',
          border: 'border-amber-400 hover:border-amber-600',
          bg: 'bg-amber-50/80 hover:bg-amber-100/80',
          iconColor: 'text-amber-700',
        };
      case 'needs_intervention':
        return {
          dotBg: 'bg-red-600',
          border: 'border-red-400 hover:border-red-600',
          bg: 'bg-red-50/80 hover:bg-red-100/80',
          iconColor: 'text-red-700',
        };
      case 'maintenance':
        return {
          dotBg: 'bg-blue-600',
          border: 'border-blue-400 hover:border-blue-600',
          bg: 'bg-blue-50/80 hover:bg-blue-100/80',
          iconColor: 'text-blue-700',
        };
      case 'irrigation_issue':
        return {
          dotBg: 'bg-cyan-600',
          border: 'border-cyan-400 hover:border-cyan-600',
          bg: 'bg-cyan-50/80 hover:bg-cyan-100/80',
          iconColor: 'text-cyan-700',
        };
      default:
        return {
          dotBg: 'bg-gray-400',
          border: 'border-gray-300',
          bg: 'bg-gray-50',
          iconColor: 'text-gray-600',
        };
    }
  };

  const style = getStatusStyle(palm.status);

  return (
    <button
      onClick={() => onClick(palm)}
      className={`relative group flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all duration-150 select-none ${style.bg} ${style.border} ${
        isSelected 
          ? 'ring-2 ring-primary ring-offset-2 scale-105 shadow-md z-20 bg-surface-lowest border-primary' 
          : 'hover:scale-105 hover:shadow-sm z-0'
      }`}
      title={`نخلة ${palm.id} - ${palm.variety} (صف ${palm.row}، موقع ${palm.positionInRow})`}
    >
      {/* Top micro status dot */}
      <span 
        className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${style.dotBg} border-2 border-white shadow-xs`} 
      />

      {/* Palm Icon */}
      <span className={`material-symbols-outlined text-[18px] sm:text-[22px] leading-none ${style.iconColor}`}>
        park
      </span>

      {/* Palm ID Label */}
      <span className="text-[10px] sm:text-[11px] font-bold text-on-surface font-mono tracking-tighter mt-0.5">
        {palm.id}
      </span>
    </button>
  );
};
