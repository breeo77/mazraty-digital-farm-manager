import { 
  FarmInfo, 
  Sector, 
  PalmTree, 
  Task, 
  Worker, 
  IrrigationRecord, 
  FarmAsset, 
  ProblemReport, 
  ActivityLogItem 
} from '../types/farm';

export const initialFarmInfo: FarmInfo = {
  id: 'farm-01',
  name: 'مزرعة الوادي',
  ownerName: 'أبو محمد',
  location: 'القصيم - بريدة (طريق الطرفية)',
  areaHectares: 14.5,
  corners: {
    NE: {
      key: 'NE',
      cornerName: 'الزاوية الشمالية الشرقية',
      landmarkName: 'المسجد',
      landmarkType: 'mosque',
      notes: 'مسجد المزرعة والمصلى الخارجي، نقطة تجمع العمال الصباحية',
      coordinates: { lat: 26.3582, lng: 43.9871 },
      compassHeading: 45,
    },
    NW: {
      key: 'NW',
      cornerName: 'الزاوية الشمالية الغربية',
      landmarkName: 'البيت',
      landmarkType: 'house',
      notes: 'المبنى الرئيسي، سكن المشرف ومكتب إدارة العمليات',
      coordinates: { lat: 26.3595, lng: 43.9820 },
      compassHeading: 315,
    },
    SE: {
      key: 'SE',
      cornerName: 'الزاوية الجنوبية الشرقية',
      landmarkName: 'البئر',
      landmarkType: 'well',
      notes: 'البئر الارتوازي رقم 1 ومحطة الضخ الرئيسية لشبكة التنقيط',
      coordinates: { lat: 26.3530, lng: 43.9865 },
      compassHeading: 135,
    },
    SW: {
      key: 'SW',
      cornerName: 'الزاوية الجنوبية الغربية',
      landmarkName: 'المستودع',
      landmarkType: 'warehouse',
      notes: 'مستودع الأسمدة، حظيرة المعدات الزراعية ومولد الكهرباء الاحتياطي',
      coordinates: { lat: 26.3535, lng: 43.9815 },
      compassHeading: 225,
    },
  },
};

export const initialSectors: Sector[] = [
  {
    id: 'A',
    name: 'قطاع A',
    mainVariety: 'سكري',
    rowsCount: 6,
    palmsPerRow: 8,
    totalPalms: 48,
    color: '#1b5e20',
    notes: 'أفضل قطاع إنتاجي، أشجار سكري فاخر مزروعة عام 2018',
    irrigationScheduleDays: ['الأحد', 'الثلاثاء', 'الخميس'],
  },
  {
    id: 'B',
    name: 'قطاع B',
    mainVariety: 'خلاص',
    rowsCount: 5,
    palmsPerRow: 8,
    totalPalms: 40,
    color: '#3e6a00',
    notes: 'أشجار خلاص الأحساء الممتاز، متصلة بالخط الفرعي للمضخة P-01',
    irrigationScheduleDays: ['السبت', 'الإثنين', 'الأربعاء'],
  },
  {
    id: 'C',
    name: 'قطاع C',
    mainVariety: 'مجدول',
    rowsCount: 4,
    palmsPerRow: 8,
    totalPalms: 32,
    color: '#7f5600',
    notes: 'أشجار مجدول تصديري عالي الجودة، تخضع لبرنامج ري وتسميد دقيق',
    irrigationScheduleDays: ['الأحد', 'الأربعاء'],
  },
  {
    id: 'D',
    name: 'قطاع D',
    mainVariety: 'عجوة',
    rowsCount: 4,
    palmsPerRow: 6,
    totalPalms: 24,
    color: '#4a2124',
    notes: 'غراس عجوة المدينة وصقعي، تم توسعتها حديثاً',
    irrigationScheduleDays: ['الإثنين', 'الخميس'],
  },
];

export const initialWorkers: Worker[] = [
  {
    id: 'W-01',
    name: 'محمد الهادي',
    phone: '0551234567',
    role: 'supervisor',
    roleTitleArabic: 'مشرف العمليات الميدانية',
    active: true,
    tasksCompletedToday: 2,
    tasksCompletedWeek: 14,
    delayedTasksCount: 0,
    currentTaskId: 'T-101',
    reportedProblemsCount: 3,
  },
  {
    id: 'W-02',
    name: 'أحمد عثمان',
    phone: '0559876543',
    role: 'irrigation_tech',
    roleTitleArabic: 'فني شبكات الري',
    active: true,
    tasksCompletedToday: 1,
    tasksCompletedWeek: 9,
    delayedTasksCount: 1,
    currentTaskId: 'T-102',
    reportedProblemsCount: 5,
  },
  {
    id: 'W-03',
    name: 'سالم الدوسري',
    phone: '0503344556',
    role: 'palm_worker',
    roleTitleArabic: 'عامل خبير نخيل (تقليم وتلقيح)',
    active: true,
    tasksCompletedToday: 3,
    tasksCompletedWeek: 18,
    delayedTasksCount: 0,
    currentTaskId: 'T-103',
    reportedProblemsCount: 2,
  },
  {
    id: 'W-04',
    name: 'عمر اليافعي',
    phone: '0567788990',
    role: 'pest_control',
    roleTitleArabic: 'فني وقاية ومكافحة آفات',
    active: true,
    tasksCompletedToday: 1,
    tasksCompletedWeek: 8,
    delayedTasksCount: 0,
    currentTaskId: 'T-104',
    reportedProblemsCount: 4,
  },
];

// Helper to generate palms with variety and status
export const generateInitialPalms = (): PalmTree[] => {
  const palms: PalmTree[] = [];
  
  // Sector A: 48 palms (Rows 1..6, Cols 1..8)
  for (let r = 1; r <= 6; r++) {
    for (let c = 1; c <= 8; c++) {
      const palmNum = (r - 1) * 8 + c;
      const palmId = `A-${String(palmNum).padStart(3, '0')}`;
      
      let status: PalmTree['status'] = 'healthy';
      if (palmId === 'A-024') {
        status = 'needs_followup';
      } else if (palmId === 'A-004') {
        status = 'needs_intervention';
      } else if (palmId === 'A-007') {
        status = 'maintenance';
      } else if (palmId === 'A-035') {
        status = 'irrigation_issue';
      } else if (palmId === 'A-012') {
        status = 'needs_followup';
      }

      palms.push({
        id: palmId,
        sectorId: 'A',
        row: r,
        positionInRow: c,
        variety: 'سكري',
        plantingYear: 2018,
        plantingDate: '2018-03-15',
        status,
        lastIrrigation: palmId === 'A-024' ? 'منذ يومين' : 'اليوم 06:30 ص',
        lastMaintenance: '2024-11-10',
        lastInspection: '2024-11-14',
        assignedWorkerId: 'W-01',
        assignedWorkerName: 'محمد الهادي',
        notes: palmId === 'A-024' ? 'ملاحظة اصفرار خفيف في السعف السفلي، بحاجة فحص نسبة الأملاح' : 'نخلة ممتازة ونمو مثالي',
        qrCodeValue: `mazraty://palm/${palmId}`,
        history: [
          {
            id: `act-${palmId}-1`,
            date: '2024-11-14 07:30',
            type: 'irrigation',
            title: 'ري دوري للقطاع A',
            workerName: 'محمد الهادي',
            notes: 'تم الري لمدة 45 دقيقة عبر شبكة التنقيط',
          },
          {
            id: `act-${palmId}-2`,
            date: '2024-11-10 10:00',
            type: 'inspection',
            title: 'فحص دوري وقائي',
            workerName: 'عمر اليافعي',
            notes: 'تم فحص الساق والقلب والتأكد من خلوها من سوسة النخيل',
          },
          ...(palmId === 'A-024' ? [
            {
              id: `act-${palmId}-3`,
              date: '2024-11-12 14:15',
              type: 'problem' as const,
              title: 'الإبلاغ عن اصفرار بالسعف',
              workerName: 'محمد الهادي',
              notes: 'تم تسجيل بلاغ متابعة لفحص الري والتسميد البوتاسي',
            }
          ] : []),
        ],
      });
    }
  }

  // Sector B: 40 palms (Rows 1..5, Cols 1..8)
  for (let r = 1; r <= 5; r++) {
    for (let c = 1; c <= 8; c++) {
      const palmNum = (r - 1) * 8 + c;
      const palmId = `B-${String(palmNum).padStart(3, '0')}`;
      let status: PalmTree['status'] = 'healthy';
      if (palmId === 'B-015') status = 'needs_followup';
      if (palmId === 'B-028') status = 'irrigation_issue';

      palms.push({
        id: palmId,
        sectorId: 'B',
        row: r,
        positionInRow: c,
        variety: 'خلاص',
        plantingYear: 2019,
        status,
        lastIrrigation: 'أمس 05:00 م',
        lastMaintenance: '2024-10-25',
        lastInspection: '2024-11-08',
        assignedWorkerId: 'W-02',
        assignedWorkerName: 'أحمد عثمان',
        notes: 'صنف خلاص الأحساء',
        qrCodeValue: `mazraty://palm/${palmId}`,
        history: [
          {
            id: `act-${palmId}-1`,
            date: '2024-11-13 17:00',
            type: 'irrigation',
            title: 'ري منتظم للقطاع B',
            workerName: 'أحمد عثمان',
          }
        ],
      });
    }
  }

  // Sector C: 32 palms (Rows 1..4, Cols 1..8)
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 8; c++) {
      const palmNum = (r - 1) * 8 + c;
      const palmId = `C-${String(palmNum).padStart(3, '0')}`;
      let status: PalmTree['status'] = 'healthy';
      if (palmId === 'C-006') status = 'needs_intervention';

      palms.push({
        id: palmId,
        sectorId: 'C',
        row: r,
        positionInRow: c,
        variety: 'مجدول',
        plantingYear: 2020,
        status,
        lastIrrigation: 'اليوم 07:00 ص',
        assignedWorkerId: 'W-03',
        assignedWorkerName: 'سالم الدوسري',
        notes: 'صنف مجدول ملكي',
        qrCodeValue: `mazraty://palm/${palmId}`,
        history: [],
      });
    }
  }

  // Sector D: 24 palms (Rows 1..4, Cols 1..6)
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 6; c++) {
      const palmNum = (r - 1) * 8 + c;
      const palmId = `D-${String(palmNum).padStart(3, '0')}`;
      palms.push({
        id: palmId,
        sectorId: 'D',
        row: r,
        positionInRow: c,
        variety: c % 2 === 0 ? 'عجوة' : 'صقعي',
        plantingYear: 2021,
        status: 'healthy',
        lastIrrigation: 'منذ 3 أيام',
        assignedWorkerId: 'W-04',
        assignedWorkerName: 'عمر اليافعي',
        notes: 'غراس حديثة - نمو جيد',
        qrCodeValue: `mazraty://palm/${palmId}`,
        history: [],
      });
    }
  }

  return palms;
};

export const initialTasks: Task[] = [
  {
    id: 'T-101',
    title: 'ري القطاع A (48 نخلة سكري)',
    type: 'irrigation',
    sectorId: 'A',
    palmIds: ['A-001', 'A-024'],
    assignedWorkerId: 'W-01',
    assignedWorkerName: 'محمد الهادي',
    priority: 'high',
    startDate: '2024-11-16T06:00',
    dueDate: '2024-11-16T11:00',
    instructions: 'تشغيل محبس القطاع A والتأكد من وصول المياه لجميع النقاطات بمعدل 45 لتر لكل نخلة.',
    status: 'in_progress',
    progress: 80,
    notes: ['تم بدء الري الساعة 06:15 ص', 'تفقدنا أول 3 صفوف وجريان الماء سليم'],
  },
  {
    id: 'T-102',
    title: 'فحص ضغط شبكة الري للمضخة P-01',
    type: 'repair',
    sectorId: 'A',
    assignedWorkerId: 'W-02',
    assignedWorkerName: 'أحمد عثمان',
    priority: 'urgent',
    startDate: '2024-11-16T08:00',
    dueDate: '2024-11-16T12:00',
    instructions: 'تنظيف فلتر الرمل وفحص عداد الضغط بار 3.5 عند مخرج البئر الجنوبي الشرقي.',
    status: 'new',
    progress: 0,
    notes: [],
  },
  {
    id: 'T-103',
    title: 'تقليم وتكريب النخيل في قطاع B',
    type: 'pruning',
    sectorId: 'B',
    assignedWorkerId: 'W-03',
    assignedWorkerName: 'سالم الدوسري',
    priority: 'normal',
    startDate: '2024-11-15T07:00',
    dueDate: '2024-11-16T15:00',
    instructions: 'إزالة السعف الجاف والكرب الزائد وجمع المخلفات خارج المزرعة تمهيداً لفرمها.',
    status: 'in_progress',
    progress: 60,
    notes: ['تم إنجاز الصفين 1 و 2 بالكامل'],
  },
  {
    id: 'T-104',
    title: 'معاينة وقائية للنخلة A-024 و A-004',
    type: 'inspection',
    sectorId: 'A',
    palmIds: ['A-024', 'A-004'],
    assignedWorkerId: 'W-04',
    assignedWorkerName: 'عمر اليافعي',
    priority: 'high',
    startDate: '2024-11-16T09:00',
    dueDate: '2024-11-16T13:00',
    instructions: 'فحص علامات الاصفرار وسحب عينة من التربة حول الحوض.',
    status: 'new',
    progress: 0,
    notes: [],
  },
  {
    id: 'T-105',
    title: 'تسميد عضوي معالج للقطاع C (مجدول)',
    type: 'fertilization',
    sectorId: 'C',
    assignedWorkerId: 'W-03',
    assignedWorkerName: 'سالم الدوسري',
    priority: 'normal',
    startDate: '2024-11-14T07:00',
    dueDate: '2024-11-14T16:00',
    instructions: 'توزيع السماد العضوي المخمر بمعدل 15 كجم لكل نخلة وخلطه مع التربة السطحية.',
    status: 'completed',
    progress: 100,
    completedAt: '2024-11-14T15:30',
    notes: ['تم اكتمال التسميد لجميع النخيل الـ 32 بنجاح'],
  },
  {
    id: 'T-106',
    title: 'صيانة وتزييت المولد الاحتياطي GEN-01',
    type: 'repair',
    sectorId: 'SW',
    assignedWorkerId: 'W-02',
    assignedWorkerName: 'أحمد عثمان',
    priority: 'high',
    startDate: '2024-11-13T08:00',
    dueDate: '2024-11-13T12:00',
    instructions: 'تبديل زيت المحرك والفلتر وفحص البطارية وتشغيل المولد تجريبياً لمدة 15 دقيقة.',
    status: 'delayed',
    progress: 30,
    notes: ['تأخر وصول فلتر الزيت من المورد'],
  },
];

export const initialIrrigationRecords: IrrigationRecord[] = [
  {
    id: 'IR-201',
    timestamp: '2024-11-16 06:30',
    scope: 'sector',
    targetId: 'A',
    targetLabel: 'قطاع A بالكامل (48 نخلة)',
    durationMinutes: 60,
    volumeLiters: 2400,
    workerId: 'W-01',
    workerName: 'محمد الهادي',
    notes: 'ري الصباح الدوري - التدفق ممتاز',
    problemDetected: false,
  },
  {
    id: 'IR-202',
    timestamp: '2024-11-15 17:00',
    scope: 'sector',
    targetId: 'B',
    targetLabel: 'قطاع B (40 نخلة)',
    durationMinutes: 50,
    volumeLiters: 1800,
    workerId: 'W-02',
    workerName: 'أحمد عثمان',
    notes: 'تم الري المسائي وفق جدول التناوب',
    problemDetected: false,
  },
  {
    id: 'IR-203',
    timestamp: '2024-11-14 07:00',
    scope: 'palm',
    targetId: 'A-024',
    targetLabel: 'نخلة A-024 (سكري)',
    durationMinutes: 20,
    volumeLiters: 60,
    workerId: 'W-01',
    workerName: 'محمد الهادي',
    notes: 'ري إضافي مخصص مع عناصر صغرى',
    problemDetected: true,
  },
];

export const initialAssets: FarmAsset[] = [
  {
    id: 'P-01',
    name: 'مضخة الري الرئيسية (الغاطس)',
    type: 'pump',
    locationSector: 'الزاوية الجنوبية الشرقية - البئر',
    status: 'optimal',
    lastMaintenanceDate: '2024-10-01',
    nextMaintenanceDate: '2025-01-01',
    notes: 'قدرة 30 حصان، تعمل بنظام التحكم الذكي بالتردد VFD',
    maintenanceHistory: [
      {
        id: 'M-1',
        date: '2024-10-01',
        description: 'صيانة دورية وتغيير قواطع الكهرباء وفحص العوازل',
        technician: 'شركة نماء للمعدات الزراعية',
        cost: 450,
      }
    ],
  },
  {
    id: 'WELL-01',
    name: 'البئر الارتوازي رقم 1',
    type: 'well',
    locationSector: 'الزاوية الجنوبية الشرقية',
    status: 'optimal',
    lastMaintenanceDate: '2024-09-15',
    nextMaintenanceDate: '2025-03-15',
    notes: 'عمق 180 متر، ملوحة الماء 650 PPM (ممتاز للتمور)',
    maintenanceHistory: [],
  },
  {
    id: 'NET-01',
    name: 'شبكة التنقيط - الخط الناقل الرئيسي',
    type: 'irrigation_network',
    locationSector: 'يمتد عبر كافة القطاعات A, B, C, D',
    status: 'needs_maintenance',
    lastMaintenanceDate: '2024-08-20',
    nextMaintenanceDate: '2024-11-20',
    notes: 'يوجد انخفاض طفيف بالضغط عند نهاية القطاع D، بحاجة لتنظيف الغسيل العكسي',
    maintenanceHistory: [],
  },
  {
    id: 'GEN-01',
    name: 'مولد كهرباء كاتم للصوت (60 KVA)',
    type: 'generator',
    locationSector: 'الزاوية الجنوبية الغربية - المستودع',
    status: 'needs_maintenance',
    lastMaintenanceDate: '2024-07-10',
    nextMaintenanceDate: '2024-11-10',
    notes: 'بحاجة إلى تبديل زيت وفلتر (مهمة مسندة إلى أحمد عثمان)',
    maintenanceHistory: [],
  },
  {
    id: 'TANK-01',
    name: 'خزان المياه التجميعي (100 م³)',
    type: 'tank',
    locationSector: 'الزاوية الشمالية الغربية',
    status: 'optimal',
    lastMaintenanceDate: '2024-09-01',
    nextMaintenanceDate: '2025-02-01',
    notes: 'خزان فيبرجلاس معزول حرارياً لتخزين مياه الري وموازنة الضغط',
    maintenanceHistory: [],
  },
  {
    id: 'TRAC-01',
    name: 'جرار زراعي فيات 80 حصان',
    type: 'vehicle',
    locationSector: 'مستودع المعدات (SW)',
    status: 'optimal',
    lastMaintenanceDate: '2024-10-15',
    nextMaintenanceDate: '2025-01-15',
    notes: 'مزود بمقطورة نقل السماد وفرامة مخلفات النخيل',
    maintenanceHistory: [],
  },
];

export const initialProblemReports: ProblemReport[] = [
  {
    id: 'PR-301',
    timestamp: '2024-11-16 07:15',
    type: 'sick_palm',
    palmId: 'A-024',
    sectorId: 'A',
    workerId: 'W-01',
    workerName: 'محمد الهادي',
    description: 'ملاحظة اصفرار في السعف القاعدي للنخلة A-024 وضعف في خروج الشماريخ الجديدة.',
    status: 'under_review',
  },
  {
    id: 'PR-302',
    timestamp: '2024-11-15 11:30',
    type: 'damage',
    palmId: 'A-004',
    sectorId: 'A',
    workerId: 'W-02',
    workerName: 'أحمد عثمان',
    description: 'كسر في لي التنقيط الفرعي عند حوض النخلة وتسرب كمية مياه.',
    status: 'open',
  },
  {
    id: 'PR-303',
    timestamp: '2024-11-14 16:20',
    type: 'irrigation',
    sectorId: 'D',
    workerId: 'W-03',
    workerName: 'سالم الدوسري',
    description: 'انسداد في نقاطات الصف 3 بسبب تراكم الرواسب الكلسية.',
    status: 'resolved',
    resolutionNotes: 'تم تسليك النقاطات وضخ محلول تنظيف الشبكة وعادت للعمل بكفاءة.',
  },
];

export const initialActivityLog: ActivityLogItem[] = [
  {
    id: 'ACT-501',
    timestamp: 'منذ 10 دقائق',
    eventType: 'task',
    title: 'تحديث تقدم مهمة ري القطاع A',
    description: 'قام محمد الهادي بتحديث نسبة إنجاز المهمة إلى 80%',
    userId: 'W-01',
    userName: 'محمد الهادي',
    role: 'worker',
    targetEntity: 'T-101',
    badgeType: 'primary',
  },
  {
    id: 'ACT-502',
    timestamp: 'منذ 45 دقيقة',
    eventType: 'problem',
    title: 'إبلاغ عن مشكلة في النخلة A-024',
    description: 'أبلغ محمد الهادي عن اصفرار في السعف القاعدي',
    userId: 'W-01',
    userName: 'محمد الهادي',
    role: 'worker',
    targetEntity: 'A-024',
    badgeType: 'warning',
  },
  {
    id: 'ACT-503',
    timestamp: 'منذ ساعتين',
    eventType: 'irrigation',
    title: 'تسجيل ري للقطاع A',
    description: 'تم تشغيل شبكة الري لمدة 60 دقيقة وتدفق 2,400 لتر',
    userId: 'W-01',
    userName: 'محمد الهادي',
    role: 'worker',
    targetEntity: 'قطاع A',
    badgeType: 'info',
  },
  {
    id: 'ACT-504',
    timestamp: 'أمس 15:30',
    eventType: 'task',
    title: 'اكتمال مهمة التسميد العضوي',
    description: 'أكمل سالم الدوسري تسميد 32 نخلة مجدول في القطاع C',
    userId: 'W-03',
    userName: 'سالم الدوسري',
    role: 'worker',
    targetEntity: 'T-105',
    badgeType: 'success',
  },
  {
    id: 'ACT-505',
    timestamp: 'منذ يومين',
    eventType: 'farm_edit',
    title: 'تحديث معلم الزاوية الشمالية الشرقية',
    description: 'قام المالك بتوثيق معلم "المسجد" وإضافة إحداثيات GPS',
    userId: 'U-01',
    userName: 'أبو محمد (المالك)',
    role: 'owner',
    targetEntity: 'NE Corner',
    badgeType: 'primary',
  },
];
