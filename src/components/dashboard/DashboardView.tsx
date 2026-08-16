import React from 'react';
import { 
  TreePalm, 
  CheckSquare, 
  AlertTriangle, 
  Users, 
  Droplets, 
  QrCode, 
  Printer, 
  PlusCircle, 
  Wrench,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { StatCard } from './StatCard';
import { FarmHealthBar } from './FarmHealthBar';
import { ActivityFeed } from './ActivityFeed';

export const DashboardView: React.FC = () => {
  const { farmInfo, stats, navigateTo, tasks, sectors } = useFarm();

  const activeTasks = tasks.filter(t => t.status === 'in_progress' || t.status === 'new').slice(0, 3);

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
              مرحباً، {farmInfo.ownerName} 👋
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary-container font-semibold text-xs">
              لوحة التحكم المركزية
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            هذه حالة مزرعتك التشغيلية اليوم في {farmInfo.name} ({farmInfo.areaHectares} هكتار)
          </p>
        </div>

        {/* Quick Actions Ribbon */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigateTo('map')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">map</span>
            <span>الخريطة الرقمية</span>
          </button>

          <button
            onClick={() => navigateTo('tasks')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-low border border-outline text-on-surface hover:bg-surface-container text-xs font-semibold transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-primary-container" />
            <span>إسناد مهمة</span>
          </button>

          <button
            onClick={() => navigateTo('qr_print')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-low border border-outline text-on-surface hover:bg-surface-container text-xs font-semibold transition-all active:scale-95"
          >
            <Printer className="w-4 h-4 text-on-surface-variant" />
            <span>طباعة الرموز</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="إجمالي النخيل"
          value={stats.totalPalms}
          subtitle={`${sectors.length} قطاعات إنتاجية`}
          icon={<TreePalm className="w-5 h-5" />}
          topColorClass="bg-primary-container"
          iconBgClass="bg-primary/10"
          iconColorClass="text-primary-container"
          badge={{ text: `${stats.healthyPalms} سليمة`, type: 'success' }}
          onClick={() => navigateTo('map')}
        />

        <StatCard
          title="مهام اليوم"
          value={stats.tasksToday}
          subtitle={`${stats.completedTasksToday} مكتملة`}
          icon={<CheckSquare className="w-5 h-5" />}
          topColorClass="bg-secondary"
          iconBgClass="bg-secondary/15"
          iconColorClass="text-secondary"
          badge={stats.delayedTasks > 0 ? { text: `${stats.delayedTasks} متأخرة`, type: 'error' } : { text: 'منضبط', type: 'success' }}
          onClick={() => navigateTo('tasks')}
        />

        <StatCard
          title="تحتاج متابعة وتدخل"
          value={stats.needsFollowupPalms + stats.criticalPalms}
          subtitle={`${stats.criticalPalms} تتطلب تدخلاً عاجلاً`}
          icon={<AlertTriangle className="w-5 h-5" />}
          topColorClass="bg-red-600"
          iconBgClass="bg-red-50"
          iconColorClass="text-red-600"
          badge={{ text: stats.openProblemsCount > 0 ? `${stats.openProblemsCount} بلاغات نشطة` : 'لا بلاغات', type: 'warning' }}
          onClick={() => navigateTo('map')}
        />

        <StatCard
          title="فريق العمل الميداني"
          value={stats.activeWorkersCount}
          subtitle="متواجدون بالحقل حالياً"
          icon={<Users className="w-5 h-5" />}
          topColorClass="bg-blue-600"
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-600"
          badge={{ text: 'جميع الفرق تعمل', type: 'neutral' }}
          onClick={() => navigateTo('workers')}
        />
      </div>

      {/* Farm Health Bar */}
      <FarmHealthBar />

      {/* Two Column Layout: Active Tasks + Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Desktop 7 cols): Live Activity */}
        <div className="lg:col-span-7">
          <ActivityFeed />
        </div>

        {/* Right Column (Desktop 5 cols): Today's Active Tasks & Sectors Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Tasks Widget */}
          <div className="bg-surface-lowest rounded-2xl p-5 shadow-soft border border-outline">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-on-surface">أبرز المهام الجارية</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">متابعة سير العمل الميداني اليوم</p>
              </div>
              <button
                onClick={() => navigateTo('tasks')}
                className="text-xs font-semibold text-primary hover:text-primary-container flex items-center gap-1"
              >
                <span>الكل ({tasks.length})</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigateTo('tasks')}
                  className="p-3.5 rounded-xl bg-surface-low border border-outline/60 hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-on-surface line-clamp-1">{task.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {task.priority === 'urgent' ? 'عاجلة' : 'عادية'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-on-surface-variant mt-2 mb-1.5">
                    <span>المسؤول: <strong className="text-on-surface">{task.assignedWorkerName}</strong></span>
                    <span className="font-bold text-primary">{task.progress}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Sectors Overview Widget */}
          <div className="bg-surface-lowest rounded-2xl p-5 shadow-soft border border-outline">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-on-surface">نظرة سريعة على القطاعات</h3>
              <button
                onClick={() => navigateTo('map')}
                className="text-xs font-semibold text-primary hover:text-primary-container"
              >
                الخريطة
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {sectors.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => navigateTo('map')}
                  className="p-3 rounded-xl bg-surface-low border border-outline/50 hover:bg-primary/5 hover:border-primary/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-primary">{sec.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary-container font-semibold">
                      {sec.mainVariety}
                    </span>
                  </div>
                  <div className="text-xs text-on-surface-variant mt-2">
                    {sec.totalPalms} نخلة • {sec.rowsCount} صفوف
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
