import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  TreePalm, 
  CheckSquare, 
  HardHat, 
  QrCode, 
  Printer, 
  Droplets, 
  Wrench, 
  Users, 
  History,
  AlertCircle
} from 'lucide-react';
import { useFarm, AppView } from '../../context/FarmContext';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ 
  isOpen = false, 
  onClose 
}) => {
  const { currentView, navigateTo, currentRole, stats } = useFarm();

  const navItems: {
    view: AppView;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
    roles?: ('owner' | 'supervisor' | 'worker')[];
  }[] = [
    {
      view: 'dashboard',
      label: 'لوحة التحكم',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['owner', 'supervisor'],
    },
    {
      view: 'map',
      label: 'خريطة المزرعة الرقمية',
      icon: <Map className="w-5 h-5" />,
      roles: ['owner', 'supervisor', 'worker'],
    },
    {
      view: 'palm_detail',
      label: 'سجل النخلة',
      icon: <TreePalm className="w-5 h-5" />,
      roles: ['owner', 'supervisor', 'worker'],
    },
    {
      view: 'tasks',
      label: 'إدارة المهام',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: stats.tasksToday,
      badgeColor: 'bg-primary/10 text-primary-container',
      roles: ['owner', 'supervisor'],
    },
    {
      view: 'worker_mode',
      label: 'واجهة العامل الميدانية',
      icon: <HardHat className="w-5 h-5" />,
      roles: ['owner', 'supervisor', 'worker'],
    },
    {
      view: 'qr_scanner',
      label: 'الماسح الضوئي (QR)',
      icon: <QrCode className="w-5 h-5" />,
      roles: ['owner', 'supervisor', 'worker'],
    },
    {
      view: 'qr_print',
      label: 'طباعة رموز النخيل',
      icon: <Printer className="w-5 h-5" />,
      roles: ['owner', 'supervisor'],
    },
    {
      view: 'irrigation',
      label: 'إدارة الري والشبكات',
      icon: <Droplets className="w-5 h-5" />,
      badge: stats.irrigationAlertsCount > 0 ? stats.irrigationAlertsCount : undefined,
      badgeColor: 'bg-cyan-100 text-cyan-800',
      roles: ['owner', 'supervisor'],
    },
    {
      view: 'assets',
      label: 'الأصول والمعدات',
      icon: <Wrench className="w-5 h-5" />,
      badge: stats.assetMaintenanceAlertsCount > 0 ? stats.assetMaintenanceAlertsCount : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
      roles: ['owner', 'supervisor'],
    },
    {
      view: 'workers',
      label: 'العمال والأداء',
      icon: <Users className="w-5 h-5" />,
      roles: ['owner', 'supervisor'],
    },
    {
      view: 'audit_log',
      label: 'سجل العمليات والرقابة',
      icon: <History className="w-5 h-5" />,
      roles: ['owner', 'supervisor'],
    },
  ];

  const visibleItems = navItems.filter(item => 
    !item.roles || item.roles.includes(currentRole)
  );

  const sidebarContent = (
    <aside className="w-64 bg-surface-lowest border-l border-outline flex flex-col h-[calc(100vh-4rem)] sticky top-16 no-print">
      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-bold text-on-surface-variant/70 px-3 pb-2 uppercase tracking-wider">
          التشغيل وإدارة الحقل
        </div>

        {visibleItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => {
                navigateTo(item.view);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-soft font-semibold'
                  : 'text-on-surface hover:bg-surface-container hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-white' : 'text-primary-container'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-surface-container text-on-surface'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Critical Alerts Widget at bottom */}
      {(stats.criticalPalms > 0 || stats.openProblemsCount > 0) && (
        <div className="p-3 border-t border-outline bg-red-50/50">
          <div className="flex items-start gap-2 text-xs text-red-900">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">تنبيهات حرجة ({stats.criticalPalms + stats.openProblemsCount})</p>
              <p className="text-red-700 text-[11px] mt-0.5">تتطلب معاينة وتدخل فوري في الحقل</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop view */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose} 
          />
          <div className="relative w-72 max-w-[80vw] bg-surface-lowest h-full shadow-2xl z-10 flex flex-col">
            <div className="p-4 border-b border-outline flex items-center justify-between">
              <span className="font-bold text-primary text-base">القائمة الرئيسية</span>
              <button 
                onClick={onClose}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
