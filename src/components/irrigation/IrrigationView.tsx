import React, { useState } from 'react';
import { 
  Droplets, 
  Plus, 
  Clock, 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  TreePalm,
  Save,
  Wrench
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { IrrigationScope } from '../../types/farm';
import { Modal } from '../common/Modal';

export const IrrigationView: React.FC = () => {
  const { 
    irrigationRecords, 
    sectors, 
    workers, 
    createIrrigationRecord, 
    palms,
    farmInfo,
    navigateTo 
  } = useFarm();

  const [modalOpen, setModalOpen] = useState(false);
  const [scope, setScope] = useState<IrrigationScope>('sector');
  const [targetSector, setTargetSector] = useState('A');
  const [targetPalm, setTargetPalm] = useState('A-024');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [volumeLiters, setVolumeLiters] = useState(2000);
  const [workerId, setWorkerId] = useState(workers[0]?.id || 'W-01');
  const [notes, setNotes] = useState('');
  const [problemDetected, setProblemDetected] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = workers.find(w => w.id === workerId);

    let targetId = 'all';
    let targetLabel = 'المزرعة كاملة';

    if (scope === 'sector') {
      targetId = targetSector;
      targetLabel = `قطاع ${targetSector} بالكامل`;
    } else if (scope === 'palm') {
      targetId = targetPalm;
      targetLabel = `نخلة ${targetPalm}`;
    } else if (scope === 'row') {
      targetId = `row-${targetSector}-1`;
      targetLabel = `صف في قطاع ${targetSector}`;
    }

    createIrrigationRecord({
      scope,
      targetId,
      targetLabel,
      durationMinutes,
      volumeLiters,
      workerId,
      workerName: worker?.name || 'محمد الهادي',
      notes: notes || 'ري منتظم لشبكة التنقيط',
      problemDetected,
    });

    setModalOpen(false);
  };

  const irrigationAlertPalms = palms.filter(p => p.status === 'irrigation_issue');

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-on-surface">إدارة الري والشبكات الميدانية</h1>
            <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold text-xs">
              {irrigationRecords.length} عملية مسجلة
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            جدولة ضخ المياه، توثيق كميات الري لكل قطاع ونخلة، ومتابعة كفاءة خطوط التنقيط
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft transition-all active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل عملية ري</span>
        </button>
      </div>

      {/* Overview Schedule & Alerts Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Next Irrigation Card */}
        <div className="bg-surface-lowest p-5 rounded-2xl border border-outline shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-on-surface-variant">الري القادم المجدول</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-on-surface mb-1">غداً 06:00 ص</div>
          <p className="text-xs text-on-surface-variant">
            قطاع C (مجدول) و قطاع A (سكري) عبر الخط الرئيسي
          </p>
        </div>

        {/* Total Estimated Water Consumption */}
        <div className="bg-surface-lowest p-5 rounded-2xl border border-outline shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-on-surface-variant">معدل الاستهلاك اليومي</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary-container flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-on-surface mb-1">4,200 لتر / يوم</div>
          <p className="text-xs text-on-surface-variant">
            من البئر الارتوازي رقم 1 عبر نظام التنقيط المضغوط
          </p>
        </div>

        {/* Irrigation alerts Card */}
        <div className="bg-surface-lowest p-5 rounded-2xl border border-outline shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-on-surface-variant">تنبيهات ومشاكل الري</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-amber-900 mb-1">
            {irrigationAlertPalms.length} تنبيهات
          </div>
          <p className="text-xs text-on-surface-variant">
            نخيل بحاجة لفحص ضغط المياه أو استبدال نقاطات
          </p>
        </div>
      </div>

      {/* Sector Schedules */}
      <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-soft">
        <h3 className="text-base font-bold text-on-surface mb-4">جدول الري الأسبوعي للقطاعات</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sectors.map((sec) => (
            <div key={sec.id} className="p-4 bg-surface-low rounded-2xl border border-outline/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-primary">{sec.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary-container font-semibold">
                  {sec.mainVariety}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">{sec.totalPalms} نخلة • {sec.rowsCount} صفوف</p>
              <div className="pt-2 border-t border-outline/40 flex flex-wrap gap-1 text-[11px]">
                <span className="text-on-surface-variant font-medium">الأيام:</span>
                {(sec.irrigationScheduleDays || ['الأحد', 'الثلاثاء', 'الخميس']).map(d => (
                  <span key={d} className="px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-900 border border-cyan-200">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Irrigation History Records Log */}
      <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-soft">
        <h3 className="text-base font-bold text-on-surface mb-4">سجل عمليات الري المنفذة مؤخراً</h3>
        <div className="space-y-3">
          {irrigationRecords.map((record) => (
            <div
              key={record.id}
              className="p-4 rounded-2xl bg-surface-low border border-outline/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">{record.targetLabel}</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">{record.notes}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-on-surface-variant">
                    <span>المدة: <strong className="text-on-surface">{record.durationMinutes} دقيقة</strong></span>
                    {record.volumeLiters && <span>الكمية: <strong className="text-cyan-800">{record.volumeLiters} لتر</strong></span>}
                    <span>المسؤول: <strong className="text-primary">{record.workerName}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {record.problemDetected && (
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>تم رصد مشكلة</span>
                  </span>
                )}
                <span className="font-mono text-xs bg-surface-container px-2.5 py-1 rounded-lg text-on-surface-variant">
                  {record.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Irrigation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="تسجيل عملية ري جديدة"
        subtitle="توثيق مدة وضخ المياه في المزرعة"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              نطاق الري
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sector', label: 'قطاع محدد' },
                { id: 'palm', label: 'نخلة فردية' },
                { id: 'farm', label: 'كامل المزرعة' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScope(item.id as IrrigationScope)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    scope === item.id ? 'bg-primary text-white border-primary' : 'bg-surface-low border-outline text-on-surface'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {scope === 'sector' && (
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                اختر القطاع
              </label>
              <select
                value={targetSector}
                onChange={(e) => setTargetSector(e.target.value)}
                className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface outline-none cursor-pointer"
              >
                {sectors.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.mainVariety})</option>
                ))}
              </select>
            </div>
          )}

          {scope === 'palm' && (
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                رقم النخلة
              </label>
              <input
                type="text"
                value={targetPalm}
                onChange={(e) => setTargetPalm(e.target.value)}
                className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface font-mono uppercase outline-none"
                placeholder="A-024"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                مدة الري (دقيقة)
              </label>
              <input
                type="number"
                min={5}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 45)}
                className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                الكمية التقديرية (لتر)
              </label>
              <input
                type="number"
                step={100}
                value={volumeLiters}
                onChange={(e) => setVolumeLiters(parseInt(e.target.value) || 2000)}
                className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              العامل المسؤول
            </label>
            <select
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface outline-none cursor-pointer"
            >
              {workers.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              ملاحظات
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="اكتب أي ملاحظة حول تدفق المياه..."
              className="w-full text-sm bg-surface-low border border-outline rounded-xl p-3 text-on-surface outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="problemCheck"
              checked={problemDetected}
              onChange={(e) => setProblemDetected(e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <label htmlFor="problemCheck" className="text-xs font-bold text-red-800 cursor-pointer">
              تم رصد عطل أو تسريب أثناء عملية الري
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft"
            >
              <Save className="w-4 h-4" />
              <span>حفظ سجل الري</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
