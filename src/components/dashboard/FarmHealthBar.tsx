import React from 'react';
import { useFarm } from '../../context/FarmContext';

export const FarmHealthBar: React.FC = () => {
  const { stats, navigateTo } = useFarm();

  const total = stats.totalPalms || 1;
  const healthyPercent = Math.round((stats.healthyPalms / total) * 100);
  const followupPercent = Math.round((stats.needsFollowupPalms / total) * 100);
  const criticalPercent = Math.round((stats.criticalPalms / total) * 100);

  return (
    <div className="bg-surface-lowest rounded-2xl p-5 sm:p-6 shadow-soft border border-outline">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-on-surface">الحالة العامة للنخيل</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            توزيع مؤشرات الصحة والمتابعة على مستوى {stats.totalPalms} نخلة مسجلة
          </p>
        </div>

        <button
          onClick={() => navigateTo('map')}
          className="text-xs font-semibold text-primary hover:text-primary-container flex items-center gap-1 self-start sm:self-auto"
        >
          <span>عرض تفاصيل الخريطة</span>
          <span className="material-symbols-outlined text-sm">arrow_left</span>
        </button>
      </div>

      {/* Proportional Progress Bar */}
      <div className="h-3.5 sm:h-4 w-full bg-surface-container rounded-full overflow-hidden flex gap-0.5 p-0.5">
        <div
          className="h-full bg-primary-container rounded-r-full transition-all duration-700"
          style={{ width: `${healthyPercent}%` }}
          title={`سليمة: ${stats.healthyPalms} (${healthyPercent}%)`}
        />
        {followupPercent > 0 && (
          <div
            className="h-full bg-amber-500 transition-all duration-700"
            style={{ width: `${followupPercent}%` }}
            title={`تحتاج متابعة: ${stats.needsFollowupPalms} (${followupPercent}%)`}
          />
        )}
        {criticalPercent > 0 && (
          <div
            className="h-full bg-red-600 rounded-l-full transition-all duration-700"
            style={{ width: `${criticalPercent}%` }}
            title={`تحتاج تدخل: ${stats.criticalPalms} (${criticalPercent}%)`}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 pt-4 border-t border-outline/40 text-xs sm:text-sm">
        <div 
          onClick={() => navigateTo('map')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80"
        >
          <span className="w-3 h-3 rounded-full bg-primary-container" />
          <span className="font-semibold text-on-surface">{stats.healthyPalms}</span>
          <span className="text-on-surface-variant">سليمة ({healthyPercent}%)</span>
        </div>

        <div 
          onClick={() => navigateTo('map')}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80"
        >
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="font-semibold text-amber-800">{stats.needsFollowupPalms}</span>
          <span className="text-on-surface-variant">تحتاج متابعة ({followupPercent}%)</span>
        </div>

        {stats.criticalPalms > 0 && (
          <div 
            onClick={() => navigateTo('map')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80"
          >
            <span className="w-3 h-3 rounded-full bg-red-600" />
            <span className="font-semibold text-red-800">{stats.criticalPalms}</span>
            <span className="text-on-surface-variant">تحتاج تدخل / ري ({criticalPercent}%)</span>
          </div>
        )}
      </div>
    </div>
  );
};
