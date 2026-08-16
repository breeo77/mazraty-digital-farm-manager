import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Home, 
  Droplet, 
  Warehouse, 
  DoorClosed, 
  Route, 
  Container, 
  Zap, 
  MapPin, 
  Edit3, 
  Plus, 
  Search, 
  Filter, 
  Maximize2, 
  Compass,
  Info,
  ChevronDown
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { PalmTree, PalmStatus, FarmCornerKey, FarmCorner, LandmarkType } from '../../types/farm';
import { PalmMarker } from './PalmMarker';
import { PalmBottomSheet } from './PalmBottomSheet';
import { CornerEditorModal } from './CornerEditorModal';
import { SectorEditorModal } from './SectorEditorModal';
import { TaskCreateModal } from '../tasks/TaskCreateModal';
import { ProblemReportDrawer } from '../worker/ProblemReportDrawer';

export const FarmMap: React.FC = () => {
  const { 
    farmInfo, 
    sectors, 
    palms, 
    updateFarmCorner, 
    saveSector, 
    selectedPalmId, 
    navigateTo 
  } = useFarm();

  const [activeSectorFilter, setActiveSectorFilter] = useState<string>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePalm, setActivePalm] = useState<PalmTree | null>(() => {
    return palms.find(p => p.id === (selectedPalmId || 'A-024')) || palms[0] || null;
  });

  // Modals state
  const [cornerEditorOpen, setCornerEditorOpen] = useState(false);
  const [editingCornerKey, setEditingCornerKey] = useState<FarmCornerKey | null>(null);

  const [sectorEditorOpen, setSectorEditorOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [problemDrawerOpen, setProblemDrawerOpen] = useState(false);

  // Helper for corner icons
  const getLandmarkIcon = (type: LandmarkType) => {
    switch (type) {
      case 'mosque': return <Building2 className="w-4 h-4 text-emerald-800" />;
      case 'house': return <Home className="w-4 h-4 text-amber-800" />;
      case 'well': return <Droplet className="w-4 h-4 text-cyan-800" />;
      case 'warehouse': return <Warehouse className="w-4 h-4 text-slate-800" />;
      case 'gate': return <DoorClosed className="w-4 h-4 text-primary" />;
      case 'road': return <Route className="w-4 h-4 text-slate-700" />;
      case 'tank': return <Container className="w-4 h-4 text-blue-700" />;
      case 'electricity': return <Zap className="w-4 h-4 text-yellow-600" />;
      default: return <MapPin className="w-4 h-4 text-primary" />;
    }
  };

  // Filter palms
  const filteredPalms = useMemo(() => {
    return palms.filter(p => {
      if (activeSectorFilter !== 'all' && p.sectorId !== activeSectorFilter) return false;
      if (activeStatusFilter !== 'all' && p.status !== activeStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (!p.id.toLowerCase().includes(q) && !p.variety.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [palms, activeSectorFilter, activeStatusFilter, searchQuery]);

  // Displayed sectors based on filter
  const displayedSectors = useMemo(() => {
    if (activeSectorFilter === 'all') return sectors;
    return sectors.filter(s => s.id === activeSectorFilter);
  }, [sectors, activeSectorFilter]);

  const handleCornerClick = (key: FarmCornerKey) => {
    setEditingCornerKey(key);
    setCornerEditorOpen(true);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Controls & Filter Header */}
      <div className="bg-surface-lowest p-4 rounded-2xl border border-outline shadow-soft flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">map</span>
              <span>خريطة المزرعة التفاعلية والتوزيع الميداني</span>
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              مخطط قطاعات النخيل مع معالم الزوايا الأربع لتوجيه العمليات
            </p>
          </div>

          {/* Search by Palm ID */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم النخلة (مثل A-024)..."
                className="w-full text-xs bg-surface-low border border-outline rounded-xl pr-9 pl-3 py-2 text-on-surface focus:border-primary outline-none"
              />
            </div>

            <button
              onClick={() => setSectorEditorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-semibold shadow-soft whitespace-nowrap active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة قطاع</span>
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline/50 text-xs">
          {/* Sector Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full hide-scrollbar">
            <span className="text-on-surface-variant font-medium ml-1">القطاع:</span>
            <button
              onClick={() => setActiveSectorFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeSectorFilter === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-low border border-outline text-on-surface hover:bg-surface-container'
              }`}
            >
              كافة القطاعات ({palms.length})
            </button>
            {sectors.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSectorFilter(s.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeSectorFilter === s.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-low border border-outline text-on-surface hover:bg-surface-container'
                }`}
              >
                {s.name} ({s.mainVariety})
              </button>
            ))}
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full hide-scrollbar">
            <span className="text-on-surface-variant font-medium ml-1">الحالة:</span>
            <button
              onClick={() => setActiveStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                activeStatusFilter === 'all' ? 'bg-on-surface text-surface' : 'bg-surface-low text-on-surface border border-outline'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveStatusFilter('healthy')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 ${
                activeStatusFilter === 'healthy' ? 'bg-primary-container text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              سليمة
            </button>
            <button
              onClick={() => setActiveStatusFilter('needs_followup')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 ${
                activeStatusFilter === 'needs_followup' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 border border-amber-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              تحتاج متابعة
            </button>
            <button
              onClick={() => setActiveStatusFilter('needs_intervention')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 ${
                activeStatusFilter === 'needs_intervention' ? 'bg-red-700 text-white' : 'bg-red-50 text-red-800 border border-red-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              تحتاج تدخل
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Container Canvas */}
      <div className="relative bg-surface-lowest rounded-3xl border border-outline shadow-soft overflow-hidden">
        {/* Top Orientation Bar / Compass header */}
        <div className="px-6 py-2.5 bg-surface-low/80 border-b border-outline flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary-container" />
            <span className="font-semibold text-on-surface">التوجيه الميداني للمزرعة (انقر على أي زاوية لتعديل معلمها)</span>
          </div>
          <span className="text-[11px] bg-surface-container px-2 py-0.5 rounded-md border border-outline">
            شمال المزرعة ↑
          </span>
        </div>

        {/* Farm Corners Banner Layout */}
        <div className="p-4 sm:p-6 map-grid-pattern relative min-h-[550px]">
          {/* Top Landmarks (North) */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* Top Right: North-East (الزاوية الشمالية الشرقية - المسجد) */}
            <div
              onClick={() => handleCornerClick('NE')}
              className="bg-surface-lowest/95 backdrop-blur-sm p-3 rounded-2xl border border-emerald-300 shadow-sm hover:shadow-lift hover:border-primary cursor-pointer transition-all max-w-[240px] group"
              title="انقر لتعديل بيانات الزاوية الشمالية الشرقية"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    {getLandmarkIcon(farmInfo.corners.NE.landmarkType)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-emerald-800 font-bold block">شمال شرق (NE)</span>
                    <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                      {farmInfo.corners.NE.landmarkName}
                    </h4>
                  </div>
                </div>
                <Edit3 className="w-3.5 h-3.5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-1">
                {farmInfo.corners.NE.notes || 'معلم رئيسي للجهة الشمالية الشرقية'}
              </p>
            </div>

            {/* Compass North Center Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-surface-lowest/90 backdrop-blur-sm border border-outline rounded-full text-xs font-semibold text-primary">
              <span>الشمال الجغرافي ↑</span>
            </div>

            {/* Top Left: North-West (الزاوية الشمالية الغربية - البيت) */}
            <div
              onClick={() => handleCornerClick('NW')}
              className="bg-surface-lowest/95 backdrop-blur-sm p-3 rounded-2xl border border-amber-300 shadow-sm hover:shadow-lift hover:border-primary cursor-pointer transition-all max-w-[240px] group text-left"
              title="انقر لتعديل بيانات الزاوية الشمالية الغربية"
            >
              <div className="flex items-center justify-between gap-2">
                <Edit3 className="w-3.5 h-3.5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-2 text-right">
                  <div className="min-w-0">
                    <span className="text-[10px] text-amber-800 font-bold block">شمال غرب (NW)</span>
                    <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                      {farmInfo.corners.NW.landmarkName}
                    </h4>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    {getLandmarkIcon(farmInfo.corners.NW.landmarkType)}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-1 text-right">
                {farmInfo.corners.NW.notes || 'معلم رئيسي للجهة الشمالية الغربية'}
              </p>
            </div>
          </div>

          {/* Sectors & Palms Grid Canvas */}
          <div className="space-y-6 my-4">
            {displayedSectors.map((sector) => {
              const sectorPalms = filteredPalms.filter(p => p.sectorId === sector.id);

              return (
                <div
                  key={sector.id}
                  className="bg-surface-lowest/90 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border-2 border-primary/20 shadow-sm relative"
                >
                  {/* Sector Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-outline/50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary-container" />
                      <h3 className="text-sm sm:text-base font-bold text-primary">
                        {sector.name} — صنف: {sector.mainVariety}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary-container font-semibold">
                        {sectorPalms.length} نخلة
                      </span>
                    </div>

                    <div className="text-xs text-on-surface-variant flex items-center gap-3">
                      <span>{sector.rowsCount} صفوف × {sector.palmsPerRow} أعمدة</span>
                      <button
                        onClick={() => {
                          // Filter only this sector
                          setActiveSectorFilter(sector.id);
                        }}
                        className="text-primary hover:underline font-medium"
                      >
                        تركيز
                      </button>
                    </div>
                  </div>

                  {/* Rows Grid */}
                  <div className="space-y-3 overflow-x-auto pb-2">
                    {Array.from({ length: sector.rowsCount }, (_, rIdx) => {
                      const rowNumber = rIdx + 1;
                      const rowPalms = sectorPalms.filter(p => p.row === rowNumber);

                      return (
                        <div key={rowNumber} className="flex items-center gap-2 min-w-max">
                          {/* Row label */}
                          <div className="w-12 text-center text-xs font-bold text-on-surface-variant/80 bg-surface-container py-1.5 rounded-lg flex-shrink-0">
                            صف {rowNumber}
                          </div>

                          {/* Palms in this row */}
                          <div className="flex items-center gap-2">
                            {rowPalms.map((palm) => (
                              <PalmMarker
                                key={palm.id}
                                palm={palm}
                                isSelected={activePalm?.id === palm.id}
                                onClick={(p) => setActivePalm(p)}
                              />
                            ))}

                            {rowPalms.length === 0 && (
                              <span className="text-xs text-on-surface-variant/50 italic px-2">
                                لا توجد نخيل مطابقة للتصفية في هذا الصف
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Landmarks (South) */}
          <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-outline/30">
            {/* Bottom Right: South-East (الزاوية الجنوبية الشرقية - البئر) */}
            <div
              onClick={() => handleCornerClick('SE')}
              className="bg-surface-lowest/95 backdrop-blur-sm p-3 rounded-2xl border border-cyan-300 shadow-sm hover:shadow-lift hover:border-primary cursor-pointer transition-all max-w-[240px] group"
              title="انقر لتعديل بيانات الزاوية الجنوبية الشرقية"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                    {getLandmarkIcon(farmInfo.corners.SE.landmarkType)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-cyan-800 font-bold block">جنوب شرق (SE)</span>
                    <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                      {farmInfo.corners.SE.landmarkName}
                    </h4>
                  </div>
                </div>
                <Edit3 className="w-3.5 h-3.5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-1">
                {farmInfo.corners.SE.notes || 'معلم رئيسي للجهة الجنوبية الشرقية'}
              </p>
            </div>

            {/* Compass South Center Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-surface-lowest/90 backdrop-blur-sm border border-outline rounded-full text-xs font-semibold text-primary">
              <span>الجنوب الجغرافي ↓</span>
            </div>

            {/* Bottom Left: South-West (الزاوية الجنوبية الغربية - المستودع) */}
            <div
              onClick={() => handleCornerClick('SW')}
              className="bg-surface-lowest/95 backdrop-blur-sm p-3 rounded-2xl border border-slate-300 shadow-sm hover:shadow-lift hover:border-primary cursor-pointer transition-all max-w-[240px] group text-left"
              title="انقر لتعديل بيانات الزاوية الجنوبية الغربية"
            >
              <div className="flex items-center justify-between gap-2">
                <Edit3 className="w-3.5 h-3.5 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-2 text-right">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-800 font-bold block">جنوب غرب (SW)</span>
                    <h4 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                      {farmInfo.corners.SW.landmarkName}
                    </h4>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0">
                    {getLandmarkIcon(farmInfo.corners.SW.landmarkType)}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-1 line-clamp-1 text-right">
                {farmInfo.corners.SW.notes || 'معلم رئيسي للجهة الجنوبية الغربية'}
              </p>
            </div>
          </div>
        </div>

        {/* Selected Palm Bottom Sheet on Map */}
        <PalmBottomSheet
          palm={activePalm}
          onClose={() => setActivePalm(null)}
          onOpenActionModal={(action) => {
            if (action === 'task') setTaskModalOpen(true);
            if (action === 'problem') setProblemDrawerOpen(true);
          }}
        />
      </div>

      {/* Modals */}
      <CornerEditorModal
        isOpen={cornerEditorOpen}
        onClose={() => setCornerEditorOpen(false)}
        cornerKey={editingCornerKey}
        cornerData={editingCornerKey ? farmInfo.corners[editingCornerKey] : null}
        onSave={(key, data) => updateFarmCorner(key, data)}
      />

      <SectorEditorModal
        isOpen={sectorEditorOpen}
        onClose={() => setSectorEditorOpen(false)}
        onSave={(sector) => saveSector(sector)}
      />

      {taskModalOpen && (
        <TaskCreateModal
          isOpen={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          defaultPalmId={activePalm?.id}
          defaultSectorId={activePalm?.sectorId}
        />
      )}

      {problemDrawerOpen && (
        <ProblemReportDrawer
          isOpen={problemDrawerOpen}
          onClose={() => setProblemDrawerOpen(false)}
          defaultPalmId={activePalm?.id}
        />
      )}
    </div>
  );
};
