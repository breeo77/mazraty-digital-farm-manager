import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  CheckSquare, 
  Droplets, 
  Wrench, 
  AlertTriangle, 
  MapPin, 
  QrCode,
  User
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { ActivityLogItem } from '../../types/farm';

export const AuditLogView: React.FC = () => {
  const { activityLogs, navigateTo } = useFarm();

  const [searchQuery, setSearchQuery] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return activityLogs.filter(log => {
      if (eventTypeFilter !== 'all' && log.eventType !== eventTypeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (!log.title.toLowerCase().includes(q) && !log.description.toLowerCase().includes(q) && !log.userName.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [activityLogs, eventTypeFilter, searchQuery]);

  const getEventIcon = (type: ActivityLogItem['eventType']) => {
    switch (type) {
      case 'task': return <CheckSquare className="w-4 h-4 text-emerald-700" />;
      case 'irrigation': return <Droplets className="w-4 h-4 text-cyan-700" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-amber-700" />;
      case 'problem': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'farm_edit': return <MapPin className="w-4 h-4 text-primary" />;
      case 'qr_scan': return <QrCode className="w-4 h-4 text-purple-700" />;
    }
  };

  const getRoleLabel = (role: ActivityLogItem['role']) => {
    switch (role) {
      case 'owner': return 'المالك';
      case 'supervisor': return 'مشرف';
      case 'worker': return 'عامل حقل';
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-soft">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-on-surface">سجل العمليات والرقابة التشغيلية (Audit Log)</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary-container font-semibold text-xs">
            {filteredLogs.length} سجل
          </span>
        </div>
        <p className="text-xs text-on-surface-variant mt-1">
          سجل تاريخي دقيق لكافة الأحداث والمهام والبلاغات المنفذة في المزرعة مع توثيق التوقيت والمسؤول
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-lowest p-4 rounded-2xl border border-outline shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full hide-scrollbar">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'task', label: 'المهام' },
            { id: 'irrigation', label: 'الري' },
            { id: 'problem', label: 'البلاغات والمشاكل' },
            { id: 'maintenance', label: 'الصيانة' },
            { id: 'farm_edit', label: 'تعديلات المزرعة' },
            { id: 'qr_scan', label: 'مسح QR' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setEventTypeFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                eventTypeFilter === item.id ? 'bg-primary text-white shadow-xs' : 'bg-surface-low border border-outline text-on-surface hover:bg-surface-container'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في السجل..."
            className="w-full text-xs bg-surface-low border border-outline rounded-xl pr-9 pl-3 py-2 text-on-surface outline-none"
          />
        </div>
      </div>

      {/* Audit List */}
      <div className="bg-surface-lowest rounded-3xl p-5 sm:p-6 border border-outline shadow-soft space-y-3">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-2xl bg-surface-low border border-outline/50 hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-lowest border border-outline flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                {getEventIcon(log.eventType)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-on-surface">{log.title}</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">{log.description}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-on-surface-variant">
                  <span>المستخدم: <strong className="text-on-surface">{log.userName}</strong> ({getRoleLabel(log.role)})</span>
                  {log.targetEntity && (
                    <span className="font-mono text-[11px] bg-surface-container px-1.5 py-0.5 rounded text-primary">
                      {log.targetEntity}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-left flex-shrink-0 self-end sm:self-center">
              <span className="font-mono text-xs text-on-surface-variant bg-surface-lowest border border-outline px-2.5 py-1 rounded-lg">
                {log.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
