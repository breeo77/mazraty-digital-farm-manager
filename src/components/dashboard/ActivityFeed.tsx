import React from 'react';
import { 
  CheckSquare, 
  Droplets, 
  Wrench, 
  AlertTriangle, 
  MapPin, 
  QrCode,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { ActivityLogItem } from '../../types/farm';

export const ActivityFeed: React.FC = () => {
  const { activityLogs, navigateTo } = useFarm();

  const getEventIcon = (type: ActivityLogItem['eventType']) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="w-4 h-4 text-emerald-700" />;
      case 'irrigation':
        return <Droplets className="w-4 h-4 text-cyan-700" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-amber-700" />;
      case 'problem':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'farm_edit':
        return <MapPin className="w-4 h-4 text-primary" />;
      case 'qr_scan':
        return <QrCode className="w-4 h-4 text-purple-700" />;
      default:
        return <Clock className="w-4 h-4 text-on-surface-variant" />;
    }
  };

  const getEventBg = (type: ActivityLogItem['eventType']) => {
    switch (type) {
      case 'task':
        return 'bg-emerald-50 border-emerald-200';
      case 'irrigation':
        return 'bg-cyan-50 border-cyan-200';
      case 'maintenance':
        return 'bg-amber-50 border-amber-200';
      case 'problem':
        return 'bg-red-50 border-red-200';
      case 'farm_edit':
        return 'bg-primary/10 border-primary/20';
      case 'qr_scan':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-surface-container border-outline';
    }
  };

  const handleItemClick = (item: ActivityLogItem) => {
    if (item.targetEntity?.startsWith('A-') || item.targetEntity?.startsWith('B-') || item.targetEntity?.startsWith('C-') || item.targetEntity?.startsWith('D-')) {
      navigateTo('palm_detail', item.targetEntity);
    } else if (item.eventType === 'task') {
      navigateTo('tasks');
    } else if (item.eventType === 'irrigation') {
      navigateTo('irrigation');
    } else if (item.eventType === 'maintenance') {
      navigateTo('assets');
    } else if (item.eventType === 'farm_edit') {
      navigateTo('map');
    }
  };

  return (
    <div className="bg-surface-lowest rounded-2xl p-5 sm:p-6 shadow-soft border border-outline">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-on-surface">نشاط المزرعة والعمليات الحية</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">سجل زمني لجميع المهام والبلاغات وإجراءات الري</p>
        </div>

        <button
          onClick={() => navigateTo('audit_log')}
          className="text-xs font-semibold text-primary hover:text-primary-container flex items-center gap-1"
        >
          <span>عرض السجل الكامل</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {activityLogs.slice(0, 6).map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item)}
            className="flex items-start gap-3 p-3 rounded-xl bg-surface-low/80 hover:bg-surface-container border border-outline/50 transition-all cursor-pointer group"
          >
            {/* Event Icon Badge */}
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${getEventBg(item.eventType)}`}>
              {getEventIcon(item.eventType)}
            </div>

            {/* Event Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                  {item.title}
                </h4>
                <span className="text-[11px] text-on-surface-variant/80 flex-shrink-0">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                <span className="text-on-surface-variant font-medium">بواسطة:</span>
                <span className="font-semibold text-primary-container">{item.userName}</span>
                {item.targetEntity && (
                  <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface font-mono text-[10px]">
                    {item.targetEntity}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
