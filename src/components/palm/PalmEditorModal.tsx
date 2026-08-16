import React, { useState, useEffect } from 'react';
import { PalmTree, PalmVariety, PalmStatus } from '../../types/farm';
import { Modal } from '../common/Modal';
import { useFarm } from '../../context/FarmContext';
import { TreePalm, Save, Plus, Edit3, User, Calendar, Layers } from 'lucide-react';

interface PalmEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  palmToEdit?: PalmTree | null;
  defaultSectorId?: string;
  defaultRow?: number;
}

const varieties: PalmVariety[] = ['سكري', 'خلاص', 'مجدول', 'عجوة', 'صقعي', 'برحي', 'روثانة', 'دجلة نور'];

export const PalmEditorModal: React.FC<PalmEditorModalProps> = ({
  isOpen,
  onClose,
  palmToEdit,
  defaultSectorId = 'A',
  defaultRow = 1,
}) => {
  const { sectors, workers, palms, addPalm, updatePalm, navigateTo } = useFarm();

  const [id, setId] = useState('');
  const [sectorId, setSectorId] = useState(defaultSectorId);
  const [row, setRow] = useState(defaultRow);
  const [positionInRow, setPositionInRow] = useState(1);
  const [variety, setVariety] = useState<PalmVariety>('سكري');
  const [plantingYear, setPlantingYear] = useState(2020);
  const [status, setStatus] = useState<PalmStatus>('healthy');
  const [assignedWorkerId, setAssignedWorkerId] = useState(workers[0]?.id || 'W-01');
  const [notes, setNotes] = useState('');

  // Auto calculate next suggested palm ID when creating
  useEffect(() => {
    if (palmToEdit) {
      setId(palmToEdit.id);
      setSectorId(palmToEdit.sectorId);
      setRow(palmToEdit.row);
      setPositionInRow(palmToEdit.positionInRow);
      setVariety(palmToEdit.variety);
      setPlantingYear(palmToEdit.plantingYear);
      setStatus(palmToEdit.status);
      setAssignedWorkerId(palmToEdit.assignedWorkerId || workers[0]?.id || 'W-01');
      setNotes(palmToEdit.notes || '');
    } else {
      const currentSector = sectorId || defaultSectorId;
      const sectorPalms = palms.filter(p => p.sectorId === currentSector);
      const nextNum = sectorPalms.length + 1;
      const suggestedId = `${currentSector}-${String(nextNum).padStart(3, '0')}`;

      setId(suggestedId);
      setSectorId(currentSector);
      setRow(defaultRow);
      setPositionInRow(nextNum);
      const secObj = sectors.find(s => s.id === currentSector);
      setVariety(secObj?.mainVariety || 'سكري');
      setPlantingYear(2020);
      setStatus('healthy');
      setAssignedWorkerId(workers[0]?.id || 'W-01');
      setNotes('');
    }
  }, [palmToEdit, isOpen, sectorId, defaultSectorId, defaultRow, palms, sectors, workers]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedWorker = workers.find(w => w.id === assignedWorkerId);

    const palmData = {
      id: id.trim().toUpperCase(),
      sectorId,
      row: Number(row),
      positionInRow: Number(positionInRow),
      variety,
      plantingYear: Number(plantingYear),
      status,
      assignedWorkerId,
      assignedWorkerName: assignedWorker?.name || 'محمد الهادي',
      notes,
    };

    if (palmToEdit) {
      updatePalm({
        ...palmToEdit,
        ...palmData,
      });
    } else {
      addPalm({
        ...palmData,
        lastIrrigation: 'اليوم ' + new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        lastMaintenance: new Date().toISOString().split('T')[0],
        lastInspection: new Date().toISOString().split('T')[0],
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={palmToEdit ? `تعديل بيانات النخلة ${palmToEdit.id}` : 'إضافة نخلة جديدة للمزرعة'}
      subtitle={palmToEdit ? 'تحديث الصنف، الموقع، الحالة، والعامل المسؤول' : 'إنشاء هوية رقمية وتوليد رمز QR فوري للنخلة'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Palm ID and Sector */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              رقم / معرف النخلة الفريد (ID)
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={!!palmToEdit}
              required
              placeholder="A-049"
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface font-mono uppercase font-bold focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              القطاع
            </label>
            <select
              value={sectorId}
              onChange={(e) => setSectorId(e.target.value)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none cursor-pointer"
            >
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.mainVariety})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row & Position */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              رقم الصف
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={row}
              onChange={(e) => setRow(parseInt(e.target.value) || 1)}
              required
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              الموقع في الصف (Position)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={positionInRow}
              onChange={(e) => setPositionInRow(parseInt(e.target.value) || 1)}
              required
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
            />
          </div>
        </div>

        {/* Variety and Planting Year */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              صنف النخلة
            </label>
            <select
              value={variety}
              onChange={(e) => setVariety(e.target.value as PalmVariety)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none cursor-pointer"
            >
              {varieties.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              سنة الغرس
            </label>
            <input
              type="number"
              min={1980}
              max={2030}
              value={plantingYear}
              onChange={(e) => setPlantingYear(parseInt(e.target.value) || 2020)}
              required
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
            />
          </div>
        </div>

        {/* Health Status & Assigned Worker */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              الحالة الصحية الحالية
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PalmStatus)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none cursor-pointer"
            >
              <option value="healthy">سليمة (Healthy)</option>
              <option value="needs_followup">تحتاج متابعة (Needs Follow-up)</option>
              <option value="needs_intervention">تحتاج تدخل (Needs Intervention)</option>
              <option value="maintenance">صيانة (Maintenance)</option>
              <option value="irrigation_issue">مشكلة ري (Irrigation Issue)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              العامل المسؤول
            </label>
            <select
              value={assignedWorkerId}
              onChange={(e) => setAssignedWorkerId(e.target.value)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none cursor-pointer"
            >
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.roleTitleArabic.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            ملاحظات حقلية
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="اكتب أي تفاصيل إضافية عن صحة النخلة، مصدر الفسيلة، أو نوع التسميد..."
            className="w-full text-sm bg-surface-low border border-outline rounded-xl p-3 text-on-surface outline-none"
          />
        </div>

        {/* Action Buttons */}
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
            <span>{palmToEdit ? 'حفظ التعديلات' : 'إنشاء النخلة وتوليد QR'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
