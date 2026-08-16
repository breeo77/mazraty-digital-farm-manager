import React, { useState } from 'react';
import { 
  Search, 
  QrCode, 
  User, 
  RotateCcw, 
  ShieldCheck, 
  Wrench, 
  HardHat, 
  Menu,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { UserRole } from '../../types/farm';

export const Header: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const { 
    farmInfo, 
    currentRole, 
    setRole, 
    workers, 
    activeWorkerId, 
    setActiveWorkerId, 
    activeWorker, 
    setGlobalSearchOpen, 
    navigateTo,
    resetDemoData
  } = useFarm();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface-lowest border-b border-outline shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Right Section: Logo and Farm Selector */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              aria-label="القائمة"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={() => navigateTo(currentRole === 'worker' ? 'worker_mode' : 'dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-soft">
              <span className="material-symbols-outlined text-2xl font-bold">agriculture</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold text-primary tracking-tight">مزرعتي</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary-container font-semibold">تشغيلي</span>
              </div>
              <p className="text-xs text-on-surface-variant hidden sm:block">{farmInfo.name} • {farmInfo.location}</p>
            </div>
          </div>
        </div>

        {/* Center Section: Quick Role Switcher Bar */}
        <div className="hidden md:flex items-center p-1 bg-surface-container rounded-xl border border-outline/60 text-xs font-semibold">
          <button
            onClick={() => setRole('owner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentRole === 'owner' 
                ? 'bg-surface-lowest text-primary shadow-sm border border-outline' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>المالك</span>
          </button>

          <button
            onClick={() => setRole('supervisor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentRole === 'supervisor' 
                ? 'bg-surface-lowest text-secondary-accent shadow-sm border border-outline' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Wrench className="w-4 h-4 text-secondary-accent" />
            <span>المشرف</span>
          </button>

          <button
            onClick={() => setRole('worker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentRole === 'worker' 
                ? 'bg-surface-lowest text-emerald-800 shadow-sm border border-outline' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <HardHat className="w-4 h-4 text-emerald-700" />
            <span>العامل</span>
          </button>
        </div>

        {/* Left Section: Actions (Search, QR Scan, Worker Selector, Reset) */}
        <div className="flex items-center gap-2">
          {/* Global Search Button */}
          <button
            onClick={() => setGlobalSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-low border border-outline text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all text-xs"
            title="بحث شامل (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-primary-container" />
            <span className="hidden xl:inline">بحث سريع...</span>
            <kbd className="hidden xl:inline px-1.5 py-0.5 text-[10px] bg-surface-container border border-outline rounded text-on-surface-variant">⌘K</kbd>
          </button>

          {/* Quick QR Scanner Button */}
          <button
            onClick={() => navigateTo('qr_scanner')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary-container active:scale-95 transition-all text-xs font-semibold shadow-soft"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">مسح QR</span>
          </button>

          {/* If worker role, show active worker switcher */}
          {currentRole === 'worker' && (
            <div className="relative">
              <select
                value={activeWorkerId}
                onChange={(e) => setActiveWorkerId(e.target.value)}
                className="text-xs bg-surface-container border border-outline rounded-xl px-2.5 py-2 font-medium text-on-surface cursor-pointer pr-7 focus:ring-1 focus:ring-primary"
              >
                {workers.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.roleTitleArabic.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('هل تريد إعادة تعيين البيانات التجريبية للمزرعة؟')) {
                resetDemoData();
              }
            }}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors"
            title="إعادة ضبط البيانات الأولية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Role switcher for mobile */}
          <div className="md:hidden relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline text-xs font-medium"
            >
              <span>{currentRole === 'owner' ? 'المالك' : currentRole === 'supervisor' ? 'المشرف' : 'العامل'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {roleMenuOpen && (
              <div className="absolute left-0 mt-2 w-36 bg-surface-lowest border border-outline rounded-xl shadow-xl py-1 z-50">
                <button
                  onClick={() => { setRole('owner'); setRoleMenuOpen(false); }}
                  className="w-full text-right px-3 py-2 text-xs hover:bg-surface-container flex items-center justify-between"
                >
                  <span>المالك</span>
                  {currentRole === 'owner' && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
                <button
                  onClick={() => { setRole('supervisor'); setRoleMenuOpen(false); }}
                  className="w-full text-right px-3 py-2 text-xs hover:bg-surface-container flex items-center justify-between"
                >
                  <span>المشرف</span>
                  {currentRole === 'supervisor' && <span className="w-1.5 h-1.5 rounded-full bg-secondary-accent" />}
                </button>
                <button
                  onClick={() => { setRole('worker'); setRoleMenuOpen(false); }}
                  className="w-full text-right px-3 py-2 text-xs hover:bg-surface-container flex items-center justify-between"
                >
                  <span>العامل</span>
                  {currentRole === 'worker' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
