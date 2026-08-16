import React, { useState, useEffect } from 'react';
import { Sector, PalmVariety } from '../../types/farm';
import { Modal } from '../common/Modal';
import { Layers, Save, Plus } from 'lucide-react';

interface SectorEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectorToEdit?: Sector | null;
  onSave: (sector: Sector) => void;
}

const varieties: PalmVariety[] = ['سكري', 'خلاص', 'مجدول', 'عجوة', 'صقعي', 'برحي', 'روثانة', 'دجلة نور'];

export const SectorEditorModal: React.FC<SectorEditorModalProps> = ({
  isOpen,
  onClose,
  sectorToEdit,
  onSave,
}) => {
  const [id, setId] = useState('E');
  const [name, setName] = useState('');
  const [mainVariety, setMainVariety] = useState<PalmVariety>('سكري');
  const [rowsCount, setRowsCount] = useState(4);
  const [palmsPerRow, setPalmsPerRow] = useState(8);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (sectorToEdit) {
      setId(sectorToEdit.id);
      setName(sectorToEdit.name);
      setMainVariety(sectorToEdit.mainVariety);
      setRowsCount(sectorToEdit.rowsCount);
      setPalmsPerRow(sectorToEdit.palmsPerRow);
      setNotes(sectorToEdit.notes || '');
    } else {
      setId('E');
      setName('قطاع E');
      setMainVariety('سكري');
      setRowsCount(4);
      setPalmsPerRow(8);
      setNotes('');
    }
  }, [sectorToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPalms = rowsCount * palmsPerRow;
    onSave({
      id: id.toUpperCase().trim(),
      name: name || `قطاع ${id.toUpperCase().trim()}`,
      mainVariety,
      rowsCount,
      palmsPerRow,
      totalPalms,
      notes,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sectorToEdit ? 'تعديل بيانات القطاع' : 'إضافة قطاع جديد للمزرعة'}
      subtitle="تحديد عدد الصفوف، سعة النخيل والصنف الغالب"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              رمز القطاع (حرف واحد)
            </label>
            <input
              type="text"
              maxLength={2}
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={!!sectorToEdit}
              required
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface uppercase font-bold focus:border-primary outline-none"
              placeholder="E"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              اسم القطاع
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none"
              placeholder="مثال: قطاع E"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            صنف النخيل الرئيسي
          </label>
          <select
            value={mainVariety}
            onChange={(e) => setMainVariety(e.target.value as PalmVariety)}
            className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none cursor-pointer"
          >
            {varieties.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              عدد الصفوف
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={rowsCount}
              onChange={(e) => setRowsCount(parseInt(e.target.value) || 1)}
              required
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              عدد النخيل بكل صف
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={palmsPerRow}
              onChange={(e) => setPalmsPerRow(parseInt(e.target.value) || 1)}
              required
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
            />
          </div>
        </div>

        <div className="p-3 bg-surface-container rounded-xl text-xs text-on-surface-variant flex items-center justify-between">
          <span>إجمالي سعة النخيل المتوقعة:</span>
          <strong className="text-primary text-sm">{rowsCount * palmsPerRow} نخلة</strong>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            ملاحظات أو جدول الري المقترح
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full text-sm bg-surface-low border border-outline rounded-xl p-3 text-on-surface outline-none"
            placeholder="اكتب تفاصيل إضافية..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft"
          >
            <Save className="w-4 h-4" />
            <span>{sectorToEdit ? 'حفظ التعديلات' : 'إنشاء القطاع'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
