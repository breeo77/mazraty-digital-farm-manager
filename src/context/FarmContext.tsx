import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  FarmInfo, 
  Sector, 
  PalmTree, 
  Task, 
  Worker, 
  IrrigationRecord, 
  FarmAsset, 
  ProblemReport, 
  ActivityLogItem, 
  UserRole,
  FarmCornerKey,
  FarmCorner,
  PalmActionLog,
  TaskStatus
} from '../types/farm';
import { storageService } from '../services/storageService';

export type AppView = 
  | 'dashboard'
  | 'map'
  | 'palm_detail'
  | 'tasks'
  | 'workers'
  | 'qr_scanner'
  | 'qr_print'
  | 'worker_mode'
  | 'irrigation'
  | 'assets'
  | 'audit_log';

interface FarmContextType {
  farmInfo: FarmInfo;
  sectors: Sector[];
  palms: PalmTree[];
  tasks: Task[];
  workers: Worker[];
  irrigationRecords: IrrigationRecord[];
  assets: FarmAsset[];
  problemReports: ProblemReport[];
  activityLogs: ActivityLogItem[];
  
  // Navigation & Role
  currentView: AppView;
  selectedPalmId: string | null;
  currentRole: UserRole;
  activeWorkerId: string;
  activeWorker: Worker | undefined;
  globalSearchOpen: boolean;

  // Actions
  navigateTo: (view: AppView, palmId?: string | null) => void;
  setRole: (role: UserRole) => void;
  setActiveWorkerId: (workerId: string) => void;
  setGlobalSearchOpen: (open: boolean) => void;

  // Mutations
  updateFarmCorner: (cornerKey: FarmCornerKey, updatedCorner: Partial<FarmCorner>) => void;
  saveSector: (sector: Sector) => void;
  addPalm: (palm: Parameters<typeof storageService.addPalm>[0]) => PalmTree;
  updatePalm: (palm: PalmTree) => void;
  addPalmAction: (palmId: string, action: Omit<PalmActionLog, 'id' | 'date'> & { date?: string }) => void;
  createTask: (taskData: Omit<Task, 'id' | 'status' | 'progress'>) => Task;
  updateTaskStatus: (taskId: string, status: TaskStatus, progress?: number, note?: string) => void;
  createIrrigationRecord: (record: Omit<IrrigationRecord, 'id' | 'timestamp'>) => void;
  addAssetMaintenance: (assetId: string, description: string, technician: string, cost?: number) => void;
  createProblemReport: (report: Omit<ProblemReport, 'id' | 'timestamp' | 'status'>) => ProblemReport;
  logActivity: (item: Omit<ActivityLogItem, 'id' | 'timestamp'>) => void;
  resetDemoData: () => void;

  // Quick stats
  stats: {
    totalPalms: number;
    healthyPalms: number;
    needsFollowupPalms: number;
    criticalPalms: number;
    tasksToday: number;
    completedTasksToday: number;
    delayedTasks: number;
    activeWorkersCount: number;
    openProblemsCount: number;
    irrigationAlertsCount: number;
    assetMaintenanceAlertsCount: number;
  };
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmInfo, setFarmInfo] = useState<FarmInfo>(() => storageService.getFarmInfo());
  const [sectors, setSectors] = useState<Sector[]>(() => storageService.getSectors());
  const [palms, setPalms] = useState<PalmTree[]>(() => storageService.getPalms());
  const [tasks, setTasks] = useState<Task[]>(() => storageService.getTasks());
  const [workers, setWorkers] = useState<Worker[]>(() => storageService.getWorkers());
  const [irrigationRecords, setIrrigationRecords] = useState<IrrigationRecord[]>(() => storageService.getIrrigationRecords());
  const [assets, setAssets] = useState<FarmAsset[]>(() => storageService.getAssets());
  const [problemReports, setProblemReports] = useState<ProblemReport[]>(() => storageService.getProblemReports());
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => storageService.getActivityLog());

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedPalmId, setSelectedPalmId] = useState<string | null>('A-024');
  const [currentRole, setCurrentRole] = useState<UserRole>(() => storageService.getCurrentRole());
  const [activeWorkerId, setActiveWorkerIdState] = useState<string>(() => storageService.getActiveWorkerId());
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);

  // Auto-switch view if switching to worker role
  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    storageService.setCurrentRole(role);
    if (role === 'worker') {
      setCurrentView('worker_mode');
    } else if (currentView === 'worker_mode') {
      setCurrentView('dashboard');
    }
  };

  const setActiveWorkerId = (id: string) => {
    setActiveWorkerIdState(id);
    storageService.setActiveWorkerId(id);
  };

  const activeWorker = useMemo(() => {
    return workers.find(w => w.id === activeWorkerId) || workers[0];
  }, [workers, activeWorkerId]);

  const navigateTo = (view: AppView, palmId?: string | null) => {
    if (palmId !== undefined) {
      setSelectedPalmId(palmId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mutations
  const updateFarmCorner = (cornerKey: FarmCornerKey, updatedCorner: Partial<FarmCorner>) => {
    const updated = storageService.updateFarmCorner(cornerKey, updatedCorner);
    setFarmInfo({ ...updated });
    setActivityLogs(storageService.getActivityLog());
  };

  const saveSector = (sector: Sector) => {
    const updated = storageService.saveSector(sector);
    setSectors([...updated]);
  };

  const addPalm = (palm: Parameters<typeof storageService.addPalm>[0]) => {
    const created = storageService.addPalm(palm);
    setPalms([...storageService.getPalms()]);
    return created;
  };

  const updatePalm = (palm: PalmTree) => {
    const updated = storageService.updatePalm(palm);
    setPalms([...updated]);
  };

  const addPalmAction = (palmId: string, action: Omit<PalmActionLog, 'id' | 'date'> & { date?: string }) => {
    storageService.addPalmAction(palmId, action);
    setPalms([...storageService.getPalms()]);
    setActivityLogs([...storageService.getActivityLog()]);
  };

  const createTask = (taskData: Omit<Task, 'id' | 'status' | 'progress'>) => {
    const newTask = storageService.createTask(taskData);
    setTasks([...storageService.getTasks()]);
    setActivityLogs([...storageService.getActivityLog()]);
    return newTask;
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus, progress?: number, note?: string) => {
    storageService.updateTaskStatus(taskId, status, progress, note);
    setTasks([...storageService.getTasks()]);
    setActivityLogs([...storageService.getActivityLog()]);
  };

  const createIrrigationRecord = (record: Omit<IrrigationRecord, 'id' | 'timestamp'>) => {
    storageService.createIrrigationRecord(record);
    setIrrigationRecords([...storageService.getIrrigationRecords()]);
    setActivityLogs([...storageService.getActivityLog()]);
  };

  const addAssetMaintenance = (assetId: string, description: string, technician: string, cost?: number) => {
    storageService.addAssetMaintenance(assetId, description, technician, cost);
    setAssets([...storageService.getAssets()]);
    setActivityLogs([...storageService.getActivityLog()]);
  };

  const createProblemReport = (report: Omit<ProblemReport, 'id' | 'timestamp' | 'status'>) => {
    const newReport = storageService.createProblemReport(report);
    setProblemReports([...storageService.getProblemReports()]);
    setPalms([...storageService.getPalms()]);
    setActivityLogs([...storageService.getActivityLog()]);
    return newReport;
  };

  const logActivity = (item: Omit<ActivityLogItem, 'id' | 'timestamp'>) => {
    storageService.logActivity(item);
    setActivityLogs([...storageService.getActivityLog()]);
  };

  const resetDemoData = () => {
    storageService.resetAllData();
    setFarmInfo(storageService.getFarmInfo());
    setSectors(storageService.getSectors());
    setPalms(storageService.getPalms());
    setTasks(storageService.getTasks());
    setWorkers(storageService.getWorkers());
    setIrrigationRecords(storageService.getIrrigationRecords());
    setAssets(storageService.getAssets());
    setProblemReports(storageService.getProblemReports());
    setActivityLogs(storageService.getActivityLog());
    setCurrentRole('owner');
    setCurrentView('dashboard');
    setSelectedPalmId('A-024');
  };

  // Dynamic statistics
  const stats = useMemo(() => {
    const totalPalms = palms.length;
    const healthyPalms = palms.filter(p => p.status === 'healthy').length;
    const needsFollowupPalms = palms.filter(p => p.status === 'needs_followup').length;
    const criticalPalms = palms.filter(p => p.status === 'needs_intervention' || p.status === 'irrigation_issue').length;
    
    const tasksToday = tasks.length;
    const completedTasksToday = tasks.filter(t => t.status === 'completed').length;
    const delayedTasks = tasks.filter(t => t.status === 'delayed').length;
    const activeWorkersCount = workers.filter(w => w.active).length;
    const openProblemsCount = problemReports.filter(p => p.status !== 'resolved').length;
    const irrigationAlertsCount = palms.filter(p => p.status === 'irrigation_issue').length;
    const assetMaintenanceAlertsCount = assets.filter(a => a.status === 'needs_maintenance' || a.status === 'offline').length;

    return {
      totalPalms,
      healthyPalms,
      needsFollowupPalms,
      criticalPalms,
      tasksToday,
      completedTasksToday,
      delayedTasks,
      activeWorkersCount,
      openProblemsCount,
      irrigationAlertsCount,
      assetMaintenanceAlertsCount,
    };
  }, [palms, tasks, workers, problemReports, assets]);

  return (
    <FarmContext.Provider
      value={{
        farmInfo,
        sectors,
        palms,
        tasks,
        workers,
        irrigationRecords,
        assets,
        problemReports,
        activityLogs,
        currentView,
        selectedPalmId,
        currentRole,
        activeWorkerId,
        activeWorker,
        globalSearchOpen,
        navigateTo,
        setRole,
        setActiveWorkerId,
        setGlobalSearchOpen,
        updateFarmCorner,
        saveSector,
      addPalm,
      updatePalm,
        addPalmAction,
        createTask,
        updateTaskStatus,
        createIrrigationRecord,
        addAssetMaintenance,
        createProblemReport,
        logActivity,
        resetDemoData,
        stats,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};


