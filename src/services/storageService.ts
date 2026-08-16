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
  FarmCornerKey,
  FarmCorner,
  PalmActionLog,
  TaskStatus,
  UserRole
} from '../types/farm';
import { 
  initialFarmInfo, 
  initialSectors, 
  generateInitialPalms, 
  initialTasks, 
  initialWorkers, 
  initialIrrigationRecords, 
  initialAssets, 
  initialProblemReports, 
  initialActivityLog 
} from '../data/seedData';

const KEYS = {
  FARM_INFO: 'mazraty_farm_info',
  SECTORS: 'mazraty_sectors',
  PALMS: 'mazraty_palms',
  TASKS: 'mazraty_tasks',
  WORKERS: 'mazraty_workers',
  IRRIGATION: 'mazraty_irrigation',
  ASSETS: 'mazraty_assets',
  PROBLEMS: 'mazraty_problems',
  ACTIVITY: 'mazraty_activity',
  CURRENT_ROLE: 'mazraty_current_role',
  ACTIVE_WORKER_ID: 'mazraty_active_worker_id',
};

class StorageService {
  // Helper to load or initialize
  private getItem<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultVal;
    }
  }

  private setItem<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  // Farm Info & Corners
  getFarmInfo(): FarmInfo {
    return this.getItem<FarmInfo>(KEYS.FARM_INFO, initialFarmInfo);
  }

  updateFarmCorner(cornerKey: FarmCornerKey, updatedCorner: Partial<FarmCorner>): FarmInfo {
    const info = this.getFarmInfo();
    info.corners[cornerKey] = {
      ...info.corners[cornerKey],
      ...updatedCorner,
    };
    this.setItem(KEYS.FARM_INFO, info);
    this.logActivity({
      eventType: 'farm_edit',
      title: `تحديث ${info.corners[cornerKey].cornerName}`,
      description: `تم تعيين المعلم: ${info.corners[cornerKey].landmarkName}`,
      userId: 'U-01',
      userName: 'أبو محمد (المالك)',
      role: 'owner',
      targetEntity: cornerKey,
      badgeType: 'primary',
    });
    return info;
  }

  // Sectors
  getSectors(): Sector[] {
    return this.getItem<Sector[]>(KEYS.SECTORS, initialSectors);
  }

  saveSector(sector: Sector): Sector[] {
    const sectors = this.getSectors();
    const idx = sectors.findIndex(s => s.id === sector.id);
    if (idx >= 0) {
      sectors[idx] = sector;
    } else {
      sectors.push(sector);
    }
    this.setItem(KEYS.SECTORS, sectors);
    return sectors;
  }

  // Palms
  getPalms(): PalmTree[] {
    return this.getItem<PalmTree[]>(KEYS.PALMS, generateInitialPalms());
  }

  getPalmById(id: string): PalmTree | undefined {
    const palms = this.getPalms();
    return palms.find(p => p.id.toLowerCase() === id.trim().toLowerCase());
  }

  addPalm(palmData: Omit<PalmTree, 'history' | 'qrCodeValue'> & { qrCodeValue?: string; history?: PalmActionLog[] }): PalmTree {
    const palms = this.getPalms();
    const palmId = palmData.id.trim().toUpperCase();
    const newPalm: PalmTree = {
      ...palmData,
      id: palmId,
      qrCodeValue: palmData.qrCodeValue || `mazraty://palm/${palmId}`,
      history: palmData.history || [
        {
          id: `act-${Date.now()}`,
          date: new Date().toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }),
          type: 'task',
          title: 'تسجيل النخلة بالمنظومة الرقمية',
          workerName: palmData.assignedWorkerName || 'أبو محمد (المالك)',
          notes: `تم إنشاء الهوية الرقمية لنخلة ${palmData.variety} في قطاع ${palmData.sectorId} (صف ${palmData.row}، موقع ${palmData.positionInRow})`,
        }
      ],
    };

    const idx = palms.findIndex(p => p.id.toUpperCase() === palmId);
    if (idx >= 0) {
      palms[idx] = newPalm;
    } else {
      palms.push(newPalm);
    }

    this.setItem(KEYS.PALMS, palms);

    this.logActivity({
      eventType: 'farm_edit',
      title: `إضافة نخلة جديدة: ${newPalm.id}`,
      description: `تم إضافة نخلة ${newPalm.variety} في قطاع ${newPalm.sectorId} (صف ${newPalm.row}، موقع ${newPalm.positionInRow})`,
      userId: 'U-01',
      userName: 'أبو محمد (المالك)',
      role: 'owner',
      targetEntity: newPalm.id,
      badgeType: 'primary',
    });

    return newPalm;
  }

  updatePalm(palm: PalmTree): PalmTree[] {
    const palms = this.getPalms();
    const idx = palms.findIndex(p => p.id === palm.id);
    if (idx >= 0) {
      palms[idx] = palm;
      this.setItem(KEYS.PALMS, palms);

      this.logActivity({
        eventType: 'farm_edit',
        title: `تعديل بيانات النخلة ${palm.id}`,
        description: `تم تحديث بيانات الصنف (${palm.variety}) أو الموقع والحالة (${palm.status})`,
        userId: 'U-01',
        userName: 'أبو محمد (المالك)',
        role: 'owner',
        targetEntity: palm.id,
        badgeType: 'primary',
      });
    }
    return palms;
  }

  addPalmAction(palmId: string, action: Omit<PalmActionLog, 'id' | 'date'> & { date?: string }): PalmTree | undefined {
    const palms = this.getPalms();
    const palm = palms.find(p => p.id === palmId);
    if (!palm) return undefined;

    const newAction: PalmActionLog = {
      id: `act-${Date.now()}`,
      date: action.date || new Date().toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }),
      ...action,
    };

    palm.history = [newAction, ...(palm.history || [])];

    if (action.type === 'irrigation') {
      palm.lastIrrigation = 'اليوم ' + new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    } else if (action.type === 'maintenance') {
      palm.lastMaintenance = new Date().toISOString().split('T')[0];
    } else if (action.type === 'inspection') {
      palm.lastInspection = new Date().toISOString().split('T')[0];
    }

    this.setItem(KEYS.PALMS, palms);

    // Log to global activity
    this.logActivity({
      eventType: action.type === 'problem' ? 'problem' : action.type === 'irrigation' ? 'irrigation' : 'task',
      title: `${action.title} - نخلة ${palmId}`,
      description: action.notes || `إجراء على النخلة ${palmId} بواسطة ${action.workerName}`,
      userId: palm.assignedWorkerId || 'W-01',
      userName: action.workerName,
      role: 'worker',
      targetEntity: palmId,
      badgeType: action.type === 'problem' ? 'warning' : 'primary',
    });

    return palm;
  }

  // Tasks
  getTasks(): Task[] {
    return this.getItem<Task[]>(KEYS.TASKS, initialTasks);
  }

  createTask(taskData: Omit<Task, 'id' | 'status' | 'progress'>): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...taskData,
      id: `T-${Date.now().toString().slice(-4)}`,
      status: 'new',
      progress: 0,
      notes: [],
    };
    tasks.unshift(newTask);
    this.setItem(KEYS.TASKS, tasks);

    this.logActivity({
      eventType: 'task',
      title: `إسناد مهمة جديدة: ${newTask.title}`,
      description: `تم إسناد المهمة إلى ${newTask.assignedWorkerName} في ${newTask.sectorId ? 'قطاع ' + newTask.sectorId : 'المزرعة'}`,
      userId: 'U-01',
      userName: 'أبو محمد (المالك)',
      role: 'owner',
      targetEntity: newTask.id,
      badgeType: 'info',
    });

    return newTask;
  }

  updateTaskStatus(taskId: string, status: TaskStatus, progress?: number, note?: string): Task[] {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      if (progress !== undefined) task.progress = progress;
      if (status === 'completed') {
        task.progress = 100;
        task.completedAt = new Date().toISOString();
      }
      if (status === 'in_progress' && !task.startedAt) {
        task.startedAt = new Date().toISOString();
      }
      if (note) {
        task.notes = [...(task.notes || []), note];
      }
      this.setItem(KEYS.TASKS, tasks);

      this.logActivity({
        eventType: 'task',
        title: status === 'completed' ? `اكتمال المهمة: ${task.title}` : `تحديث حالة المهمة: ${task.title}`,
        description: note || `الحالة الجديدة: ${status === 'completed' ? 'مكتملة' : status === 'in_progress' ? 'قيد التنفيذ' : status}`,
        userId: task.assignedWorkerId,
        userName: task.assignedWorkerName,
        role: 'worker',
        targetEntity: task.id,
        badgeType: status === 'completed' ? 'success' : 'primary',
      });
    }
    return tasks;
  }

  // Workers
  getWorkers(): Worker[] {
    return this.getItem<Worker[]>(KEYS.WORKERS, initialWorkers);
  }

  // Irrigation Records
  getIrrigationRecords(): IrrigationRecord[] {
    return this.getItem<IrrigationRecord[]>(KEYS.IRRIGATION, initialIrrigationRecords);
  }

  createIrrigationRecord(record: Omit<IrrigationRecord, 'id' | 'timestamp'>): IrrigationRecord {
    const records = this.getIrrigationRecords();
    const newRecord: IrrigationRecord = {
      ...record,
      id: `IR-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }),
    };
    records.unshift(newRecord);
    this.setItem(KEYS.IRRIGATION, records);

    // Update affected palms
    const palms = this.getPalms();
    let updatedCount = 0;
    palms.forEach(p => {
      let isTarget = false;
      if (newRecord.scope === 'farm') isTarget = true;
      else if (newRecord.scope === 'sector' && p.sectorId === newRecord.targetId) isTarget = true;
      else if (newRecord.scope === 'palm' && p.id.toUpperCase() === newRecord.targetId.toUpperCase()) isTarget = true;

      if (isTarget) {
        p.lastIrrigation = 'اليوم ' + new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
        if (p.status === 'irrigation_issue' && !newRecord.problemDetected) {
          p.status = 'healthy';
        }
        p.history = [{
          id: `act-${Date.now()}-${updatedCount}`,
          date: newRecord.timestamp,
          type: 'irrigation',
          title: `ري: ${newRecord.targetLabel}`,
          workerName: newRecord.workerName,
          notes: newRecord.notes,
        }, ...(p.history || [])];
        updatedCount++;
      }
    });

    if (updatedCount > 0) {
      this.setItem(KEYS.PALMS, palms);
    }

    this.logActivity({
      eventType: 'irrigation',
      title: `تسجيل ري: ${newRecord.targetLabel}`,
      description: `المدة: ${newRecord.durationMinutes} دقيقة بواسطة ${newRecord.workerName}`,
      userId: newRecord.workerId,
      userName: newRecord.workerName,
      role: 'worker',
      targetEntity: newRecord.targetId,
      badgeType: 'info',
    });

    return newRecord;
  }

  // Assets
  getAssets(): FarmAsset[] {
    return this.getItem<FarmAsset[]>(KEYS.ASSETS, initialAssets);
  }

  addAssetMaintenance(assetId: string, description: string, technician: string, cost?: number): FarmAsset[] {
    const assets = this.getAssets();
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      const today = new Date().toISOString().split('T')[0];
      asset.lastMaintenanceDate = today;
      asset.status = 'optimal';
      asset.maintenanceHistory.unshift({
        id: `M-${Date.now()}`,
        date: today,
        description,
        technician,
        cost,
      });
      this.setItem(KEYS.ASSETS, assets);

      this.logActivity({
        eventType: 'maintenance',
        title: `صيانة الأصل: ${asset.name}`,
        description,
        userId: 'W-02',
        userName: technician,
        role: 'worker',
        targetEntity: asset.id,
        badgeType: 'primary',
      });
    }
    return assets;
  }

  // Problem Reports
  getProblemReports(): ProblemReport[] {
    return this.getItem<ProblemReport[]>(KEYS.PROBLEMS, initialProblemReports);
  }

  createProblemReport(report: Omit<ProblemReport, 'id' | 'timestamp' | 'status'>): ProblemReport {
    const problems = this.getProblemReports();
    const newReport: ProblemReport = {
      ...report,
      id: `PR-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'open',
    };
    problems.unshift(newReport);
    this.setItem(KEYS.PROBLEMS, problems);

    // If attached to palm, update palm status
    if (report.palmId) {
      const palms = this.getPalms();
      const palm = palms.find(p => p.id === report.palmId);
      if (palm) {
        palm.status = report.type === 'irrigation' ? 'irrigation_issue' : report.type === 'damage' ? 'needs_intervention' : 'needs_followup';
        palm.history = [{
          id: `act-${Date.now()}`,
          date: newReport.timestamp,
          type: 'problem',
          title: `بلاغ مشكلة: ${report.type === 'irrigation' ? 'ري' : report.type === 'sick_palm' ? 'مرض نخلة' : report.type === 'pest' ? 'آفة/سوسة' : 'عطل/تلف'}`,
          workerName: report.workerName,
          notes: report.description,
        }, ...(palm.history || [])];
        this.setItem(KEYS.PALMS, palms);
      }
    }

    this.logActivity({
      eventType: 'problem',
      title: `بلاغ مشكلة جديد: ${report.palmId ? 'النخلة ' + report.palmId : 'قطاع ' + report.sectorId}`,
      description: report.description,
      userId: report.workerId,
      userName: report.workerName,
      role: 'worker',
      targetEntity: report.palmId || report.sectorId,
      badgeType: 'error',
    });

    return newReport;
  }

  // Activity Log
  getActivityLog(): ActivityLogItem[] {
    return this.getItem<ActivityLogItem[]>(KEYS.ACTIVITY, initialActivityLog);
  }

  logActivity(item: Omit<ActivityLogItem, 'id' | 'timestamp'>): void {
    const list = this.getActivityLog();
    const newLog: ActivityLogItem = {
      ...item,
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: 'الآن',
    };
    list.unshift(newLog);
    this.setItem(KEYS.ACTIVITY, list.slice(0, 50)); // Keep recent 50
  }

  // Current Role & Active Worker
  getCurrentRole(): UserRole {
    return this.getItem<UserRole>(KEYS.CURRENT_ROLE, 'owner');
  }

  setCurrentRole(role: UserRole): void {
    this.setItem(KEYS.CURRENT_ROLE, role);
  }

  getActiveWorkerId(): string {
    return this.getItem<string>(KEYS.ACTIVE_WORKER_ID, 'W-01');
  }

  setActiveWorkerId(workerId: string): void {
    this.setItem(KEYS.ACTIVE_WORKER_ID, workerId);
  }

  // Reset demo data
  resetAllData(): void {
    localStorage.clear();
    this.setItem(KEYS.FARM_INFO, initialFarmInfo);
    this.setItem(KEYS.SECTORS, initialSectors);
    this.setItem(KEYS.PALMS, generateInitialPalms());
    this.setItem(KEYS.TASKS, initialTasks);
    this.setItem(KEYS.WORKERS, initialWorkers);
    this.setItem(KEYS.IRRIGATION, initialIrrigationRecords);
    this.setItem(KEYS.ASSETS, initialAssets);
    this.setItem(KEYS.PROBLEMS, initialProblemReports);
    this.setItem(KEYS.ACTIVITY, initialActivityLog);
    this.setItem(KEYS.CURRENT_ROLE, 'owner');
    this.setItem(KEYS.ACTIVE_WORKER_ID, 'W-01');
  }
}

export const storageService = new StorageService();
