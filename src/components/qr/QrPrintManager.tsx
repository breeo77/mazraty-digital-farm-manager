import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Printer, 
  Search, 
  Filter, 
  Download, 
  Layers, 
  CheckSquare, 
  RefreshCw,
  Sparkles,
  TreePalm
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

export const QrPrintManager: React.FC = () => {
  const { farmInfo, sectors, palms, navigateTo } = useFarm();

  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [labelSize, setLabelSize] = useState<'standard' | 'compact'>('standard');

  const filteredPalms = useMemo(() => {
    return palms.filter(p => {
      if (selectedSector !== 'all' && p.sectorId !== selectedSector) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (!p.id.toLowerCase().includes(q) && !p.variety.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [palms, selectedSector, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header & Controls (Hidden on Print) */}
      <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-soft no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-on-surface">إدارة وطباعة ملصقات رموز النخيل (QR)</h1>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary-container font-semibold text-xs">
                {filteredPalms.length} ملصق
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              توليد وطباعة بطاقات الهوية الرقمية الحقلية لتثبيتها على جذوع النخيل في {farmInfo.name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة ورقة الملصقات (A4)</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-outline/50 text-xs">
          {/* Sector selection tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full hide-scrollbar">
            <span className="text-on-surface-variant font-medium ml-1">تصفية القطاع:</span>
            <button
              onClick={() => setSelectedSector('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedSector === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-low border border-outline text-on-surface hover:bg-surface-container'
              }`}
            >
              الكل ({palms.length})
            </button>
            {sectors.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSector(sec.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedSector === sec.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-low border border-outline text-on-surface hover:bg-surface-container'
                }`}
              >
                {sec.name} ({sec.mainVariety})
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث برقم النخلة..."
              className="w-full text-xs bg-surface-low border border-outline rounded-xl pr-9 pl-3 py-2 text-on-surface outline-none"
            />
          </div>
        </div>
      </div>

      {/* Printable Stickers Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 qr-print-grid">
        {filteredPalms.map((palm) => (
          <div
            key={palm.id}
            onClick={() => navigateTo('palm_detail', palm.id)}
            className="qr-label-card bg-surface-lowest rounded-2xl p-4 border-2 border-outline hover:border-primary shadow-xs hover:shadow-lift transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Top Farm Brand Header */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-dashed border-outline">
              <div>
                <span className="text-[10px] font-bold text-primary block">{farmInfo.name}</span>
                <span className="text-[9px] text-on-surface-variant font-medium">سجل النخيل الرقمي</span>
              </div>
              <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                <TreePalm className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Middle QR Code */}
            <div className="flex flex-col items-center justify-center my-2 p-2 bg-white rounded-xl border border-outline/50 shadow-xs">
              <QRCodeSVG
                value={palm.qrCodeValue}
                size={120}
                level="H"
                includeMargin={true}
              />
              <span className="font-mono text-sm font-extrabold text-on-surface mt-1.5 tracking-wider">
                {palm.id}
              </span>
            </div>

            {/* Bottom Label Details */}
            <div className="pt-2 border-t border-dashed border-outline text-[10px] text-on-surface-variant space-y-0.5">
              <div className="flex items-center justify-between">
                <span>الصنف: <strong className="text-on-surface">{palm.variety}</strong></span>
                <span>قطاع: <strong className="text-primary">{palm.sectorId}</strong></span>
              </div>
              <div className="flex items-center justify-between">
                <span>الصف {palm.row} • موقع {palm.positionInRow}</span>
                <span className="font-mono text-[9px]">غرس {palm.plantingYear}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
