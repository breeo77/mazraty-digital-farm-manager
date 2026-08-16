export type UserRole = 'owner' | 'supervisor' | 'worker';

export type PalmStatus = 
  | 'healthy'               // سليمة
  | 'needs_followup'        // تحتاج متابعة
  | 'needs_intervention'    // تحتاج تدخل
  | 'maintenance'           // صيانة
  | 'irrigation_issue';     // مشكلة ري

export type PalmVariety = 
  | 'سكري'
  | 'خلاص'
  | 'مجدول'
  | 'عجوة'
  | 'صقعي'
  | 'برحي'
  | 'روثانة'
  | 'دجلة نور'
  | string;

export type LandmarkType = 
  | 'mosque'        // مسجد
  | 'house'         // بيت / سكن
  | 'well'          // بئر
  | 'warehouse'     // مستودع
  | 'gate'          // بوابة رئيسية
  | 'road'          // طريق زراعي
  | 'tank'          // خزان مياه
  | 'electricity'   // محطة كهرباء
  | 'custom';       // معلم مخصص

export type FarmCornerKey = 'NE' | 'NW' | 'SE' | 'SW';

export interface FarmCorner {
  key: FarmCornerKey;
  cornerName: string;          // مثل: الزاوية الشمالية الشرقية
  landmarkName: string;        // مثل: المسجد الكبير
  landmarkType: LandmarkType;
  notes?: string;
  photo?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  compassHeading?: number;     // زاوية البوصلة التقديرية
}

export interface FarmInfo {
  id: string;
  name: string;                // مزرعة الوادي
  ownerName: string;           // أبو محمد
  location: string;            // القصيم - بريدة
  areaHectares: number;        // 14.5 هكتار
  corners: Record<FarmCornerKey, FarmCorner>;
}

export interface Sector {
  id: string;                  // A, B, C, D
  name: string;                // قطاع A
  mainVariety: PalmVariety;
  rowsCount: number;
  palmsPerRow: number;
  totalPalms: number;
  color?: string;
  notes?: string;
  irrigationScheduleDays?: string[];
}

export interface PalmActionLog {
  id: string;
  date: string;
  type: 'irrigation' | 'maintenance' | 'inspection' | 'problem' | 'task';
  title: string;
  workerName: string;
  notes?: string;
}

export interface PalmTree {
  id: string;                  // e.g. "A-001", "A-024"
  sectorId: string;            // "A"
  row: number;                 // 1..N
  positionInRow: number;       // 1..N
  variety: PalmVariety;
  plantingYear: number;
  plantingDate?: string;
  status: PalmStatus;
  lastIrrigation?: string;     // ISO or readable
  lastMaintenance?: string;
  lastInspection?: string;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  notes?: string;
  photo?: string;
  qrCodeValue: string;         // mazraty://palm/A-024
  history: PalmActionLog[];
}

export type TaskType = 
  | 'irrigation'      // ري
  | 'fertilization'   // تسميد
  | 'pruning'         // تقليم وتكريب
  | 'pollination'     // تلقيح / تنبيت
  | 'harvest'         // حصاد / خراف
  | 'pest_treatment'  // مكافحة آفات وسوسة
  | 'inspection'      // فحص دوري
  | 'cleaning'        // تنظيف الأحواض
  | 'repair';         // صيانة وإصلاح

export type TaskPriority = 'urgent' | 'high' | 'normal';

export type TaskStatus = 
  | 'new'            // جديدة
  | 'in_progress'    // قيد التنفيذ
  | 'completed'      // مكتملة
  | 'delayed'        // متأخرة
  | 'paused';        // متوقفة

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  sectorId: string;
  palmIds?: string[];
  assignedWorkerId: string;
  assignedWorkerName: string;
  priority: TaskPriority;
  startDate: string;
  dueDate: string;
  instructions: string;
  status: TaskStatus;
  progress: number;            // 0 - 100
  attachments?: string[];
  notes?: string[];
  completedAt?: string;
  startedAt?: string;
}

export type WorkerRole = 
  | 'supervisor'           // مشرف ميداني
  | 'irrigation_tech'      // فني ري
  | 'palm_worker'          // عامل نخيل
  | 'pest_control'         // فني وقاية وآفات
  | 'equipment_operator';  // سائق ومسؤول معدات

export interface Worker {
  id: string;
  name: string;
  phone: string;
  role: WorkerRole;
  roleTitleArabic: string;
  avatarUrl?: string;
  active: boolean;
  tasksCompletedToday: number;
  tasksCompletedWeek: number;
  delayedTasksCount: number;
  currentTaskId?: string;
  reportedProblemsCount: number;
}

export type IrrigationScope = 'farm' | 'sector' | 'row' | 'palm';

export interface IrrigationRecord {
  id: string;
  timestamp: string;
  scope: IrrigationScope;
  targetId: string;            // 'all' | 'A' | 'row-3' | 'A-024'
  targetLabel: string;
  durationMinutes: number;
  volumeLiters?: number;
  workerId: string;
  workerName: string;
  notes?: string;
  problemDetected: boolean;
  photo?: string;
}

export type AssetType = 
  | 'pump'                 // مضخات المياه
  | 'irrigation_network'   // شبكات الري
  | 'tank'                 // خزانات المياه
  | 'well'                 // الآبار الارتوازية
  | 'generator'            // المولدات
  | 'vehicle'              // جرارات وسيارات
  | 'tool'                 // أدوات ومعدات
  | 'electrical';          // لوحات كهربائية

export type AssetStatus = 'optimal' | 'needs_maintenance' | 'offline';

export interface MaintenanceLog {
  id: string;
  date: string;
  description: string;
  technician: string;
  cost?: number;
  nextDueDate?: string;
}

export interface FarmAsset {
  id: string;                  // P-01, WELL-02
  name: string;                // مضخة الري الرئيسية
  type: AssetType;
  locationSector: string;      // قطاع A - بالقرب من البئر
  status: AssetStatus;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceHistory: MaintenanceLog[];
  notes?: string;
  photo?: string;
}

export type ProblemType = 
  | 'irrigation'    // مشكلة في الري
  | 'sick_palm'     // نخلة مريضة
  | 'pest'          // سوسة / آفة
  | 'damage'        // تلف / كسر أنابيب
  | 'other';        // مشكلة أخرى

export interface ProblemReport {
  id: string;
  timestamp: string;
  type: ProblemType;
  palmId?: string;
  assetId?: string;
  sectorId: string;
  workerId: string;
  workerName: string;
  description: string;
  photo?: string;
  status: 'open' | 'under_review' | 'resolved';
  resolutionNotes?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  eventType: 'task' | 'irrigation' | 'maintenance' | 'problem' | 'farm_edit' | 'qr_scan';
  title: string;
  description: string;
  userId: string;
  userName: string;
  role: UserRole;
  targetEntity?: string;
  badgeType?: 'primary' | 'warning' | 'error' | 'info' | 'success';
}
