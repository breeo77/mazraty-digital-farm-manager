import React, { useState, useEffect, useRef } from 'react';
import { Search, X, QrCode, User, CheckSquare, Layers, Wrench, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { StatusBadge } from './StatusBadge';

export const GlobalSearchModal: React.FC = () => {
  const { 
    globalSearchOpen, 
    setGlobalSearchOpen, 
    palms, 
    workers, 
    tasks, 
    sectors, 
    assets, 
    problemReports, 
    navigateTo 
  } = useFarm();
  
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (globalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [globalSearchOpen]);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!globalSearchOpen);
      } else if (e.key === 'Escape' && globalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [globalSearchOpen, setGlobalSearchOpen]);

  if (!globalSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredPalms = q ? palms.filter(p => 
    p.id.toLowerCase().includes(q) || 
    p.variety.toLowerCase().includes(q) || 
    p.sectorId.toLowerCase().includes(q) ||
    (p.assignedWorkerName && p.assignedWorkerName.toLowerCase().includes(q))
  ).slice(0, 5) : [];

  const filteredWorkers = q ? workers.filter(w => 
    w.name.toLowerCase().includes(q) || 
    w.phone.includes(q) || 
    w.roleTitleArabic.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const filteredTasks = q ? tasks.filter(t => 
    t.title.toLowerCase().includes(q) || 
    t.assignedWorkerName.toLowerCase().includes(q) || 
    t.sectorId.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const filteredAssets = q ? assets.filter(a => 
    a.name.toLowerCase().includes(q) || 
    a.id.toLowerCase().includes(q) || 
    a.locationSector.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const filteredProblems = q ? problemReports.filter(pr => 
    pr.description.toLowerCase().includes(q) || 
    (pr.palmId && pr.palmId.toLowerCase().includes(q)) ||
    pr.workerName.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const hasResults = filteredPalms.length > 0 || filteredWorkers.length > 0 || filteredTasks.length > 0 || filteredAssets.length > 0 || filteredProblems.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="fixed inset-0" 
        onClick={() => setGlobalSearchOpen(false)} 
        aria-hidden="true" 
      />
      
      <div className="relative w-full max-w-2xl bg-surface-lowest rounded-2xl shadow-2xl border border-outline overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-outline bg-surface-lowest">
          <Search className="w-5 h-5 text-primary-container ml-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث برقم النخلة (مثل A-024)، اسم العامل، القطاع، المهمة، أو المعدة..."
            className="w-full bg-transparent border-none outline-none text-on-surface text-base placeholder:text-on-surface-variant/60"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setGlobalSearchOpen(false)}
            className="px-2.5 py-1 text-xs text-on-surface-variant bg-surface-container rounded-md border border-outline hover:bg-surface-container-high transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="overflow-y-auto p-4 space-y-4">
          {!q && (
            <div className="py-8 text-center text-on-surface-variant">
              <Search className="w-10 h-10 mx-auto mb-2 text-outline-dark opacity-40" />
              <p className="text-sm font-medium">ابدأ بالكتابة للبحث الفوري في كافة سجلات المزرعة</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                <span className="text-on-surface-variant/70">اقتراحات سريعة:</span>
                <button onClick={() => setQuery('A-024')} className="px-2.5 py-1 bg-surface-container rounded-full hover:bg-primary/10 hover:text-primary transition-colors">نخلة A-024</button>
                <button onClick={() => setQuery('محمد')} className="px-2.5 py-1 bg-surface-container rounded-full hover:bg-primary/10 hover:text-primary transition-colors">محمد الهادي</button>
                <button onClick={() => setQuery('مضخة')} className="px-2.5 py-1 bg-surface-container rounded-full hover:bg-primary/10 hover:text-primary transition-colors">مضخات الري</button>
                <button onClick={() => setQuery('قطاع A')} className="px-2.5 py-1 bg-surface-container rounded-full hover:bg-primary/10 hover:text-primary transition-colors">قطاع A</button>
              </div>
            </div>
          )}

          {q && !hasResults && (
            <div className="py-8 text-center text-on-surface-variant">
              <p className="text-sm">لم يتم العثور على نتائج مطابقة لـ "{query}"</p>
            </div>
          )}

          {/* Palms Section */}
          {filteredPalms.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-2 px-1">
                <QrCode className="w-4 h-4" />
                <span>سجلات النخيل ({filteredPalms.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredPalms.map((palm) => (
                  <div
                    key={palm.id}
                    onClick={() => {
                      navigateTo('palm_detail', palm.id);
                      setGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-low hover:bg-primary/5 hover:border-primary/30 border border-transparent cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                        {palm.id}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-on-surface flex items-center gap-2">
                          نخلة {palm.id}
                          <span className="text-xs text-on-surface-variant">({palm.variety})</span>
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          قطاع {palm.sectorId} • صف {palm.row} • موقع {palm.positionInRow}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge type="palm" status={palm.status} size="sm" />
                      <ArrowLeft className="w-4 h-4 text-on-surface-variant" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-2 px-1">
                <CheckSquare className="w-4 h-4" />
                <span>المهام الزراعية ({filteredTasks.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      navigateTo('tasks');
                      setGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-low hover:bg-primary/5 hover:border-primary/30 border border-transparent cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-sm font-semibold text-on-surface">{task.title}</div>
                      <div className="text-xs text-on-surface-variant">
                        المسؤول: {task.assignedWorkerName} • إنجاز {task.progress}%
                      </div>
                    </div>
                    <StatusBadge type="task" status={task.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workers Section */}
          {filteredWorkers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-2 px-1">
                <User className="w-4 h-4" />
                <span>فريق العمل ({filteredWorkers.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    onClick={() => {
                      navigateTo('workers');
                      setGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-low hover:bg-primary/5 hover:border-primary/30 border border-transparent cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-sm font-semibold text-on-surface">{worker.name}</div>
                      <div className="text-xs text-on-surface-variant">{worker.roleTitleArabic} • {worker.phone}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {worker.tasksCompletedToday} مهام اليوم
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assets Section */}
          {filteredAssets.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-2 px-1">
                <Wrench className="w-4 h-4" />
                <span>الأصول والمعدات ({filteredAssets.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => {
                      navigateTo('assets');
                      setGlobalSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-surface-low hover:bg-primary/5 hover:border-primary/30 border border-transparent cursor-pointer transition-all"
                  >
                    <div>
                      <div className="text-sm font-semibold text-on-surface">{asset.name}</div>
                      <div className="text-xs text-on-surface-variant">{asset.locationSector}</div>
                    </div>
                    <StatusBadge type="asset" status={asset.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
