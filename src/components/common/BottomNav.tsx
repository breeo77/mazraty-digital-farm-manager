import React from 'react';
import { LayoutDashboard, Map, HardHat, CheckSquare, QrCode } from 'lucide-react';
import { useFarm, AppView } from '../../context/FarmContext';

export const BottomNav: React.FC = () => {
  const { currentView, navigateTo, currentRole } = useFarm();

  const isWorker = currentRole === 'worker';

  const items: { view: AppView; label: string; icon: React.ReactNode }[] = isWorker
    ? [
        { view: 'worker_mode', label: 'مهامي', icon: <HardHat className="w-5 h-5" /> },
        { view: 'map', label: 'الخريطة', icon: <Map className="w-5 h-5" /> },
        { view: 'qr_scanner', label: 'مسح QR', icon: <QrCode className="w-5 h-5" /> },
        { view: 'palm_detail', label: 'سجل نخلة', icon: <span className="material-symbols-outlined text-xl">park</span> },
      ]
    : [
        { view: 'dashboard', label: 'الرئيسية', icon: <LayoutDashboard className="w-5 h-5" /> },
        { view: 'map', label: 'الخريطة', icon: <Map className="w-5 h-5" /> },
        { view: 'qr_scanner', label: 'مسح QR', icon: <QrCode className="w-5 h-5" /> },
        { view: 'tasks', label: 'المهام', icon: <CheckSquare className="w-5 h-5" /> },
        { view: 'worker_mode', label: 'العامل', icon: <HardHat className="w-5 h-5" /> },
      ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-lowest/95 backdrop-blur-md border-t border-outline shadow-lg pb-safe no-print">
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => navigateTo(item.view)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-primary font-bold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary-container' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
