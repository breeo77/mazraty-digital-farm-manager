import React, { useState } from 'react';
import { TaskType, TaskPriority } from '../../types/farm';
import { Modal } from '../common/Modal';
import { useFarm } from '../../context/FarmContext';
import { CheckSquare, Plus, Calendar, User, Layers, Save } from 'lucide-react';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPalmId?: string;
  defaultSectorId?: string;
}

const taskTypesList: { type: TaskType; label: string }[] = [
  { type: 'irrigation', label: 'ري وسقاية' },
  { type: 'fertilization', label: 'تسميد عضوي وكيميائي' },
  { type: 'pruning', label: 'تقليم وتكريب' },
  { type: 'pollination', label: 'تلقيح وتنبيت' },
  { type: 'harvest', label: 'خراف وحصاد التمور' },
  { type: 'pest_treatment', label: 'مكافحة آفات ورش وقائي' },
  { type: 'inspection', label: 'فحص دوري ومعاينة' },
  { type: 'cleaning', label: 'تنظيف الأحواض' },
  { type: 'repair', label: 'صيانة وإصلاح معدات' },
];

export const TaskCreateModal: React.FC<TaskCreateModalProps> = ({
  isOpen,
  onClose,
  defaultPalmId,
  defaultSectorId,
}) => {
  const { sectors, workers, createTask } = useFarm();

  const [title, setTitle] = useState(defaultPalmId ? `مهمة صيانة ومعاينة للنخلة ${defaultPalmId}` : '');
  const [type, setType] = useState<TaskType>('irrigation');
  const [sectorId, setSectorId] = useState(defaultSectorId || 'A');
  const [specificPalms, setSpecificPalms] = useState(defaultPalmId || '');
  const [assignedWorkerId, setAssignedWorkerId] = useState(workers[0]?.id || 'W-01');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 16);
  });
  const [instructions, setInstructions] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = workers.find(w => w.id === assignedWorkerId);

    createTask({
      title: title || `${taskTypesList.find(t => t.type === type)?.label} - قطاع ${sectorId}`,
      type,
      sectorId,
      palmIds: specificPalms ? specificPalms.split(',').map(s => s.trim().toUpperCase()) : undefined,
      assignedWorkerId,
      assignedWorkerName: worker?.name || 'العامل المسؤول',
      priority,
      startDate: new Date().toISOString(),
      dueDate,
      instructions: instructions || 'تنفيذ العمل وفق المعايير المعتمدة وإبلاغ المشرف عند الانتهاء.',
      notes: [],
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="إسناد مهمة زراعية جديدة"
      subtitle="تحديد نوع العمل، القطاع المستهدف والعامل المسؤول"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            عنوان المهمة
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="مثال: ري القطاع A، رش وقائي، تقليم النخيل..."
            className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none"
          />
        </div>

        {/* Task Type and Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              نوع المهمة
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none cursor-pointer"
            >
              {taskTypesList.map(t => (
                <option key={t.type} value={t.type}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              درجة الأولوية
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none cursor-pointer"
            >
              <option value="normal">عادية</option>
              <option value="high">مرتفعة</option>
              <option value="urgent">عاجلة جداً</option>
            </select>
          </div>
        </div>

        {/* Sector and Specific Palms */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              القطاع المستهدف
            </label>
            <select
              value={sectorId}
              onChange={(e) => setSectorId(e.target.value)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none cursor-pointer"
            >
              {sectors.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.mainVariety})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              أرقام نخيل محددة (اختياري)
            </label>
            <input
              type="text"
              value={specificPalms}
              onChange={(e) => setSpecificPalms(e.target.value)}
              placeholder="مثال: A-024, A-004"
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface font-mono outline-none uppercase"
            />
          </div>
        </div>

        {/* Assigned Worker and Due Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              إسناد إلى العامل
            </label>
            <select
              value={assignedWorkerId}
              onChange={(e) => setAssignedWorkerId(e.target.value)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface focus:border-primary outline-none cursor-pointer"
            >
              {workers.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.roleTitleArabic.split(' ')[0]})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              موعد الاستحقاق (Due Date)
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
            />
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            التعليمات وخطوات التنفيذ
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            placeholder="اكتب التوجيهات التفصيلية للعامل (مثال: فحص النقاطات والتأكد من ضخ المياه لمدة 45 دقيقة)..."
            className="w-full text-sm bg-surface-low border border-outline rounded-xl p-3 text-on-surface focus:border-primary outline-none"
          />
        </div>

        {/* Action Buttons */}
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
            <span>حفظ وإسناد المهمة</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
