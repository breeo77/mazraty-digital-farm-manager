import React, { useState } from 'react';
import { PalmTree } from '../../types/farm';
import { Modal } from '../common/Modal';
import { Droplets, Wrench, ShieldCheck, FileText, Save } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

interface PalmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  palm: PalmTree;
  actionType: 'irrigation' | 'maintenance' | 'inspection' | 'note';
}

export const PalmActionModal: React.FC<PalmActionModalProps> = ({
  isOpen,
  onClose,
  palm,
  actionType,
}) => {
  const { addPalmAction, activeWorker, currentRole } = useFarm();

  const [notes, setNotes] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [technicianName, setTechnicianName] = useState(activeWorker?.name || 'محمد الهادي');

  if (!isOpen) return null;

  const getTitle = () => {
    switch (actionType) {
      case 'irrigation': return `تسجيل ري للنخلة ${palm.id}`;
      case 'maintenance': return `تسجيل صيانة للنخلة ${palm.id}`;
      case 'inspection': return `تسجيل فحص وقائي للنخلة ${palm.id}`;
      case 'note': return `إضافة ملاحظة للنخلة ${palm.id}`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let title = '';
    if (actionType === 'irrigation') {
      title = `ري النخلة (${durationMinutes} دقيقة)`;
    } else if (actionType === 'maintenance') {
      title = 'صيانة وتنظيف الحوض';
    } else if (actionType === 'inspection') {
      title = 'فحص دوري وقائي';
    } else {
      title = 'ملاحظة حقلية';
    }

    addPalmAction(palm.id, {
      type: actionType === 'note' ? 'task' : actionType,
      title,
      workerName: technicianName,
      notes: notes || (actionType === 'irrigation' ? `تم الري بمعدل تدفق سليم لمدة ${durationMinutes} دقيقة` : 'تم إتمام الإجراء بنجاح'),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      subtitle={`قطاع ${palm.sectorId} • صف ${palm.row} • صنف: ${palm.variety}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Worker */}
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            القائم بالإجراء / العامل المسؤول
          </label>
          <input
            type="text"
            value={technicianName}
            onChange={(e) => setTechnicianName(e.target.value)}
            required
            className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
          />
        </div>

        {/* If Irrigation */}
        {actionType === 'irrigation' && (
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              مدة الري (بالدقائق)
            </label>
            <input
              type="number"
              min={5}
              max={240}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            تفاصيل وملاحظات الإجراء
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            required={actionType === 'note'}
            placeholder="اكتب ما تم تنفيذه بدقة أو أي ملاحظات حول صحة النخلة..."
            className="w-full text-sm bg-surface-low border border-outline rounded-xl p-3 text-on-surface outline-none"
          />
        </div>

        {/* Actions */}
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
            <span>حفظ السجل</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
