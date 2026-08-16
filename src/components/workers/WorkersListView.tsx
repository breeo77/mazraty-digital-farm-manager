import React from 'react';
import { 
  Users, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  HardHat, 
  Sparkles,
  TreePalm,
  Activity
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

export const WorkersListView: React.FC = () => {
  const { workers, tasks, problemReports, navigateTo, setActiveWorkerId, setRole } = useFarm();

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-soft">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-on-surface">إدارة فريق العمل والمسؤوليات الميدانية</h1>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary-container font-semibold text-xs">
            {workers.length} أفراد
          </span>
        </div>
        <p className="text-xs text-on-surface-variant mt-1">
          متابعة إسناد المهام، سجلات الإنجاز الميداني، ومعدلات الأداء التشغيلي في المزرعة
        </p>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workers.map((worker) => {
          const workerTasks = tasks.filter(t => t.assignedWorkerId === worker.id);
          const completedTasks = workerTasks.filter(t => t.status === 'completed').length;
          const activeTasks = workerTasks.filter(t => t.status === 'in_progress' || t.status === 'new').length;
          const workerProblems = problemReports.filter(pr => pr.workerId === worker.id);

          const totalAssigned = workerTasks.length || 1;
          const completionRate = Math.round((completedTasks / totalAssigned) * 100);

          return (
            <div
              key={worker.id}
              className="bg-surface-lowest rounded-3xl p-5 sm:p-6 border border-outline shadow-soft hover:border-primary/40 transition-all space-y-4"
            >
              {/* Profile Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary-container flex items-center justify-center font-bold text-lg">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-on-surface">{worker.name}</h3>
                    <p className="text-xs text-primary-container font-semibold">{worker.roleTitleArabic}</p>
                    <span className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5 font-mono">
                      <Phone className="w-3 h-3" />
                      <span>{worker.phone}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveWorkerId(worker.id);
                    setRole('worker');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-surface-low hover:bg-primary/10 text-primary hover:text-primary-container border border-outline text-xs font-bold transition-all"
                  title="التبديل إلى واجهة هذا العامل"
                >
                  محاكاة واجهة العامل
                </button>
              </div>

              {/* Operational Metrics Bento */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-surface-low p-2.5 rounded-2xl border border-outline/40">
                  <span className="text-[10px] text-on-surface-variant block">مهام اليوم</span>
                  <strong className="text-base font-bold text-primary block mt-0.5">
                    {worker.tasksCompletedToday}
                  </strong>
                </div>

                <div className="bg-surface-low p-2.5 rounded-2xl border border-outline/40">
                  <span className="text-[10px] text-on-surface-variant block">مهام الأسبوع</span>
                  <strong className="text-base font-bold text-on-surface block mt-0.5">
                    {worker.tasksCompletedWeek}
                  </strong>
                </div>

                <div className="bg-surface-low p-2.5 rounded-2xl border border-outline/40">
                  <span className="text-[10px] text-on-surface-variant block">معدل الإنجاز</span>
                  <strong className="text-base font-bold text-emerald-700 block mt-0.5">
                    {completionRate}%
                  </strong>
                </div>
              </div>

              {/* Current Active Tasks preview */}
              <div className="pt-2 border-t border-outline/40 text-xs">
                <div className="flex items-center justify-between text-on-surface-variant mb-2">
                  <span className="font-semibold">المهام الجارية ({activeTasks}):</span>
                  <button
                    onClick={() => navigateTo('tasks')}
                    className="text-primary hover:underline font-medium"
                  >
                    عرض المهام
                  </button>
                </div>

                {workerTasks.filter(t => t.status !== 'completed').slice(0, 2).map((t) => (
                  <div
                    key={t.id}
                    className="p-2 bg-surface-low rounded-xl border border-outline/30 mb-1.5 flex items-center justify-between"
                  >
                    <span className="font-medium text-on-surface truncate max-w-[200px]">{t.title}</span>
                    <span className="font-bold text-primary">{t.progress}%</span>
                  </div>
                ))}

                {workerProblems.length > 0 && (
                  <p className="text-[11px] text-amber-800 mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>قام برفع {workerProblems.length} بلاغات ميدانية عن النخيل والري</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
