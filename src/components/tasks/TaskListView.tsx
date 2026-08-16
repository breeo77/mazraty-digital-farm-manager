import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  Layers, 
  TreePalm, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  Pause,
  ArrowUpDown
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { Task, TaskStatus } from '../../types/farm';
import { StatusBadge } from '../common/StatusBadge';
import { TaskCreateModal } from './TaskCreateModal';

export const TaskListView: React.FC = () => {
  const { tasks, workers, sectors, updateTaskStatus, navigateTo } = useFarm();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [workerFilter, setWorkerFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (workerFilter !== 'all' && task.assignedWorkerId !== workerFilter) return false;
      if (sectorFilter !== 'all' && task.sectorId !== sectorFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (!task.title.toLowerCase().includes(q) && !task.assignedWorkerName.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [tasks, statusFilter, workerFilter, sectorFilter, searchQuery]);

  const handleStatusToggle = (task: Task, newStatus: TaskStatus) => {
    updateTaskStatus(task.id, newStatus, newStatus === 'completed' ? 100 : task.progress);
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header with Title & Action */}
      <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-on-surface">إدارة المهام والعمليات الزراعية</h1>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary-container font-semibold text-xs">
              {filteredTasks.length} مهمة
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            جدولة وتوزيع مهام الري والتسميد والتقليم ومتابعة تقدم الإنجاز الميداني
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft transition-all active:scale-95 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء مهمة جديدة</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-lowest p-4 rounded-2xl border border-outline shadow-soft space-y-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full hide-scrollbar text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              statusFilter === 'all' ? 'bg-primary text-white shadow-xs' : 'bg-surface-low border border-outline text-on-surface hover:bg-surface-container'
            }`}
          >
            جميع المهام ({tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              statusFilter === 'in_progress' ? 'bg-primary text-white shadow-xs' : 'bg-surface-low border border-outline text-on-surface hover:bg-surface-container'
            }`}
          >
            قيد التنفيذ ({tasks.filter(t => t.status === 'in_progress').length})
          </button>
          <button
            onClick={() => setStatusFilter('new')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              statusFilter === 'new' ? 'bg-primary text-white shadow-xs' : 'bg-surface-low border border-outline text-on-surface hover:bg-surface-container'
            }`}
          >
            جديدة ({tasks.filter(t => t.status === 'new').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              statusFilter === 'completed' ? 'bg-primary text-white shadow-xs' : 'bg-surface-low border border-outline text-on-surface hover:bg-surface-container'
            }`}
          >
            مكتملة ({tasks.filter(t => t.status === 'completed').length})
          </button>
          <button
            onClick={() => setStatusFilter('delayed')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              statusFilter === 'delayed' ? 'bg-red-600 text-white shadow-xs' : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
            }`}
          >
            متأخرة ({tasks.filter(t => t.status === 'delayed').length})
          </button>
        </div>

        {/* Search & Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-outline/50 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في عنوان المهمة..."
              className="w-full text-xs bg-surface-low border border-outline rounded-xl pr-9 pl-3 py-2 text-on-surface outline-none"
            />
          </div>

          <select
            value={workerFilter}
            onChange={(e) => setWorkerFilter(e.target.value)}
            className="text-xs bg-surface-low border border-outline rounded-xl px-3 py-2 text-on-surface outline-none cursor-pointer"
          >
            <option value="all">كافة العمال والمشرفين</option>
            {workers.map(w => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="text-xs bg-surface-low border border-outline rounded-xl px-3 py-2 text-on-surface outline-none cursor-pointer"
          >
            <option value="all">كافة القطاعات</option>
            {sectors.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 bg-surface-lowest rounded-2xl border border-outline text-center text-on-surface-variant">
            <CheckSquare className="w-10 h-10 mx-auto text-outline mb-2 opacity-40" />
            <p className="text-sm">لا توجد مهام تطابق معايير البحث والتصفية المحددة.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-surface-lowest rounded-2xl p-4 sm:p-5 border border-outline hover:border-primary/40 shadow-soft transition-all space-y-3"
            >
              {/* Task Title Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary-container flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-on-surface">{task.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <Layers className="w-3.5 h-3.5" />
                        <span>قطاع {task.sectorId}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        <span>المسؤول: {task.assignedWorkerName}</span>
                      </span>
                      {task.palmIds && task.palmIds.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">
                            نخيل: {task.palmIds.join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <StatusBadge type="priority" status={task.priority} size="sm" />
                  <StatusBadge type="task" status={task.status} size="sm" />
                </div>
              </div>

              {/* Instructions */}
              {task.instructions && (
                <p className="text-xs text-on-surface-variant bg-surface-low p-2.5 rounded-xl border border-outline/40">
                  {task.instructions}
                </p>
              )}

              {/* Progress & Quick Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-outline/40 text-xs">
                {/* Progress bar */}
                <div className="flex-1 max-w-xs flex items-center gap-2">
                  <span className="text-on-surface-variant font-medium">الإنجاز:</span>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="font-bold text-primary font-mono">{task.progress}%</span>
                </div>

                {/* State Control buttons */}
                <div className="flex items-center gap-2">
                  {task.status !== 'completed' ? (
                    <button
                      onClick={() => handleStatusToggle(task, 'completed')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تحديد كمكتملة</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusToggle(task, 'in_progress')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-low border border-outline text-on-surface hover:bg-surface-container font-semibold transition-colors"
                    >
                      <span>إعادة فتح</span>
                    </button>
                  )}

                  {task.palmIds?.[0] && (
                    <button
                      onClick={() => navigateTo('palm_detail', task.palmIds![0])}
                      className="text-primary font-bold hover:underline"
                    >
                      عرض النخلة ←
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <TaskCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};
