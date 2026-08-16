import React, { useState, useEffect } from 'react';
import { LandmarkType, FarmCorner, FarmCornerKey } from '../../types/farm';
import { Modal } from '../common/Modal';
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
  Save,
  Compass
} from 'lucide-react';

interface CornerEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  cornerKey: FarmCornerKey | null;
  cornerData: FarmCorner | null;
  onSave: (cornerKey: FarmCornerKey, updated: Partial<FarmCorner>) => void;
}

export const landmarkTypesList: { type: LandmarkType; label: string; icon: React.ReactNode }[] = [
  { type: 'mosque', label: 'مسجد / مصلى', icon: <Building2 className="w-4 h-4" /> },
  { type: 'house', label: 'البيت / سكن المزرعة', icon: <Home className="w-4 h-4" /> },
  { type: 'well', label: 'بئر ارتوازي / مضخة', icon: <Droplet className="w-4 h-4" /> },
  { type: 'warehouse', label: 'مستودع / حظيرة معدات', icon: <Warehouse className="w-4 h-4" /> },
  { type: 'gate', label: 'بوابة رئيسية', icon: <DoorClosed className="w-4 h-4" /> },
  { type: 'road', label: 'طريق زراعي', icon: <Route className="w-4 h-4" /> },
  { type: 'tank', label: 'خزان مياه تجميعي', icon: <Container className="w-4 h-4" /> },
  { type: 'electricity', label: 'محطة / قاطع كهرباء', icon: <Zap className="w-4 h-4" /> },
  { type: 'custom', label: 'معلم مخصص', icon: <MapPin className="w-4 h-4" /> },
];

export const CornerEditorModal: React.FC<CornerEditorModalProps> = ({
  isOpen,
  onClose,
  cornerKey,
  cornerData,
  onSave,
}) => {
  const [cornerName, setCornerName] = useState('');
  const [landmarkName, setLandmarkName] = useState('');
  const [landmarkType, setLandmarkType] = useState<LandmarkType>('mosque');
  const [notes, setNotes] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  useEffect(() => {
    if (cornerData) {
      setCornerName(cornerData.cornerName || '');
      setLandmarkName(cornerData.landmarkName || '');
      setLandmarkType(cornerData.landmarkType || 'mosque');
      setNotes(cornerData.notes || '');
      setLat(cornerData.coordinates?.lat ? String(cornerData.coordinates.lat) : '');
      setLng(cornerData.coordinates?.lng ? String(cornerData.coordinates.lng) : '');
    }
  }, [cornerData]);

  if (!cornerKey || !cornerData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(cornerKey, {
      cornerName,
      landmarkName,
      landmarkType,
      notes,
      coordinates: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تعديل زاوية ومعلم المزرعة"
      subtitle={`تحديد المعلم الواقعي والاتجاه لـ ${cornerData.cornerName}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Corner Name */}
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            اسم الزاوية / الموقع الجغرافي
          </label>
          <input
            type="text"
            value={cornerName}
            onChange={(e) => setCornerName(e.target.value)}
            required
            className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            placeholder="مثال: الزاوية الشمالية الشرقية"
          />
        </div>

        {/* Landmark Type Selector */}
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1.5">
            نوع المعلم الأرضي (لتوجيه العمال وأصحاب المزرعة)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {landmarkTypesList.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setLandmarkType(item.type)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-right ${
                  landmarkType === item.type
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-surface-low border-outline text-on-surface hover:bg-surface-container'
                }`}
              >
                <span>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Landmark Name */}
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            اسم المعلم البارز (الاسم المتداول بالمزرعة)
          </label>
          <input
            type="text"
            value={landmarkName}
            onChange={(e) => setLandmarkName(e.target.value)}
            required
            className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            placeholder="مثال: المسجد / جامع التقوى، بئر 1، سكن العمال..."
          />
        </div>

        {/* GPS Coordinates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              خط العرض (Latitude)
            </label>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none font-mono"
              placeholder="26.3582"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              خط الطول (Longitude)
            </label>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none font-mono"
              placeholder="43.9871"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            ملاحظات توجيهية وتعليمات الوصول
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full text-sm bg-surface-low border border-outline rounded-xl p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            placeholder="اكتب أي ملاحظات للتعرف على هذه الزاوية والصفوف المجاورة لها..."
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft transition-all"
          >
            <Save className="w-4 h-4" />
            <span>حفظ تعديلات المعلم</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
