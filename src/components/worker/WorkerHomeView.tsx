import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  FileText, 
  QrCode, 
  Droplets, 
  TreePalm, 
  User,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { Task } from '../../types/farm';
import { ProblemReportDrawer } from './ProblemReportDrawer';

export const WorkerHomeView: React.FC = () => {
  const { 
    tasks, 
    activeWorker, 
    workers, 
    activeWorkerId, 
    setActiveWorkerId, 
    updateTaskStatus, 
    navigateTo, 
    farmInfo 
  } = useFarm();

  const [problemDrawerOpen, setProblemDrawerOpen] = useState(false);
  const [photoNoteModalOpen, setPhotoNoteModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Worker's assigned tasks
  const workerTasks = tasks.filter(t => t.assignedWorkerId === activeWorkerId);
  const activeTask = workerTasks.find(t => t.status === 'in_progress') || workerTasks.find(t => t.status === 'new') || workerTasks[0];

  const handleStartTask = (task: Task) => {
    updateTaskStatus(task.id, 'in_progress', Math.max(task.progress, 15), 'بدأ العامل تنفيذ المهمة بالحقل');
  };

  const handlePauseTask = (task: Task) => {
    updateTaskStatus(task.id, 'paused', task.progress, 'تم إيقاف المهمة مؤقتاً');
  };

  const handleCompleteTask = (task: Task) => {
    updateTaskStatus(task.id, 'completed', 100, 'تم إنجاز المهمة بالكامل بواسطة العامل');
  };

  const handleAddQuickNote = () => {
    if (noteText.trim() && activeTask) {
      updateTaskStatus(activeTask.id, activeTask.status, activeTask.progress, noteText.trim());
      setNoteText('');
      setPhotoNoteModalOpen(false);
      alert('تمت إضافة الملاحظة للمهمة بنجاح');
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-5 pb-28">
      {/* Header with worker profile */}
      <div className="bg-surface-lowest p-5 rounded-3xl border border-outline shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-soft">
            <span className="material-symbols-outlined text-2xl">person</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-on-surface">
                {activeWorker?.name || 'العامل الميداني'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                نشط بالحقل
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              {activeWorker?.roleTitleArabic || 'فني ري وتشغيل'} • {farmInfo.name}
            </p>
          </div>
        </div>

        {/* Worker Switcher */}
        <select
          value={activeWorkerId}
          onChange={(e) => setActiveWorkerId(e.target.value)}
          className="text-xs bg-surface-low border border-outline rounded-xl px-2.5 py-1.5 font-semibold text-on-surface outline-none cursor-pointer"
        >
          {workers.map(w => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>

      {/* Main Active Task Card */}
      {activeTask ? (
        <div className="bg-surface-lowest rounded-3xl p-6 shadow-soft border-2 border-primary/30 relative overflow-hidden space-y-5">
          {/* Top Hairline accent */}
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-primary-container" />

          {/* Title & Status badge */}
          <div className="flex items-start justify-between gap-3 pt-1">
            <div>
              <span className="text-xs font-bold text-primary-container block mb-1">
                المهمة النشطة حالياً
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
                {activeTask.title}
              </h1>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
                <TreePalm className="w-3.5 h-3.5 text-primary" />
                <span>قطاع {activeTask.sectorId} • الأولوية: {activeTask.priority === 'urgent' ? 'عاجلة' : 'عادية'}</span>
              </p>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeTask.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : activeTask.status === 'in_progress'
                ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                : 'bg-surface-container text-on-surface'
            }`}>
              {activeTask.status === 'completed' ? 'مكتملة' : activeTask.status === 'in_progress' ? 'قيد التنفيذ' : 'جديدة'}
            </span>
          </div>

          {/* Instructions Box */}
          {activeTask.instructions && (
            <div className="p-3.5 bg-surface-low rounded-2xl border border-outline/60 text-xs text-on-surface leading-relaxed">
              <strong className="block text-primary font-bold mb-1">تعليمات المشرف:</strong>
              {activeTask.instructions}
            </div>
          )}

          {/* Progress Bar & Percentage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-on-surface-variant">نسبة الإنجاز</span>
              <span className="text-primary text-base font-extrabold">{activeTask.progress}%</span>
            </div>
            <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${activeTask.progress}%` }}
              />
            </div>
          </div>

          {/* Primary Task Action Controls (Large touch targets) */}
          <div className="pt-2">
            {activeTask.status === 'new' && (
              <button
                onClick={() => handleStartTask(activeTask)}
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>بدء المهمة الآن</span>
              </button>
            )}

            {activeTask.status === 'in_progress' && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleCompleteTask(activeTask)}
                  className="h-14 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>إكمال المهمة ✓</span>
                </button>

                <button
                  onClick={() => handlePauseTask(activeTask)}
                  className="h-14 bg-surface-low border-2 border-outline hover:bg-surface-container text-on-surface rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Pause className="w-5 h-5" />
                  <span>إيقاف مؤقت</span>
                </button>
              </div>
            )}

            {activeTask.status === 'completed' && (
              <div className="p-4 bg-green-50 border border-green-300 rounded-2xl text-center text-green-900 font-bold text-sm">
                ✓ تم إكمال هذه المهمة بنجاح، أحسنت!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-8 bg-surface-lowest rounded-3xl border border-outline text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-primary-container mx-auto" />
          <h3 className="text-base font-bold text-on-surface">لا توجد مهام مسندة إليك حالياً</h3>
          <p className="text-xs text-on-surface-variant">يمكنك تفقد الخريطة أو الإبلاغ عن أي ملاحظة بالحقل</p>
        </div>
      )}

      {/* Secondary Actions (Large Field Buttons) */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => navigateTo('qr_scanner')}
          className="bg-surface-lowest border-2 border-outline hover:border-primary rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1.5 h-24 active:scale-95 transition-all shadow-xs"
        >
          <QrCode className="w-6 h-6 text-primary-container" />
          <span className="text-xs font-bold text-on-surface">مسح QR</span>
        </button>

        <button
          onClick={() => {
            alert('تم فتح كاميرا الحقل - تم حفظ الصورة بنجاح');
          }}
          className="bg-surface-lowest border-2 border-outline hover:border-primary rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1.5 h-24 active:scale-95 transition-all shadow-xs"
        >
          <Camera className="w-6 h-6 text-primary-container" />
          <span className="text-xs font-bold text-on-surface">إضافة صورة</span>
        </button>

        <button
          onClick={() => setPhotoNoteModalOpen(true)}
          className="bg-surface-lowest border-2 border-outline hover:border-primary rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1.5 h-24 active:scale-95 transition-all shadow-xs"
        >
          <FileText className="w-6 h-6 text-primary-container" />
          <span className="text-xs font-bold text-on-surface">إضافة ملاحظة</span>
        </button>
      </div>

      {/* Prominent Red Emergency / Problem Reporting Button */}
      <button
        onClick={() => setProblemDrawerOpen(true)}
        className="w-full h-16 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-2xl font-extrabold text-lg shadow-lg shadow-red-600/25 flex items-center justify-center gap-3 transition-all"
      >
        <AlertTriangle className="w-6 h-6" />
        <span>وجدت مشكلة في الحقل</span>
      </button>

      {/* List of remaining today's tasks for worker */}
      {workerTasks.length > 1 && (
        <div className="bg-surface-lowest rounded-3xl p-5 border border-outline shadow-soft space-y-3">
          <h3 className="text-sm font-bold text-on-surface">بقية مهامك اليوم ({workerTasks.length - 1})</h3>
          <div className="space-y-2">
            {workerTasks.filter(t => t.id !== activeTask?.id).map(task => (
              <div
                key={task.id}
                onClick={() => handleStartTask(task)}
                className="p-3 bg-surface-low rounded-xl border border-outline/50 flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-on-surface">{task.title}</h4>
                  <span className="text-[10px] text-on-surface-variant">قطاع {task.sectorId} • {task.priority === 'urgent' ? 'عاجلة' : 'عادية'}</span>
                </div>
                <span className="text-xs font-semibold text-primary">بدء المهمة ←</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Problem Report Drawer */}
      <ProblemReportDrawer
        isOpen={problemDrawerOpen}
        onClose={() => setProblemDrawerOpen(false)}
        defaultPalmId={activeTask?.palmIds?.[0] || 'A-024'}
      />

      {/* Quick Note Modal */}
      {photoNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface-lowest rounded-2xl p-5 max-w-sm w-full border border-outline shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-on-surface">إضافة ملاحظة ميدانية للمهمة</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              placeholder="اكتب ملاحظاتك حول حالة العمل..."
              className="w-full text-sm bg-surface-low border border-outline rounded-xl p-3 text-on-surface outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPhotoNoteModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-xl"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddQuickNote}
                className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-xl shadow-soft"
              >
                حفظ الملاحظة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
