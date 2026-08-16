import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ArrowRight, 
  Droplets, 
  Wrench, 
  ShieldCheck, 
  AlertTriangle, 
  PlusCircle, 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  User, 
  Layers, 
  MapPin,
  CheckCircle2,
  Clock,
  Camera
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { PalmStatus } from '../../types/farm';
import { StatusBadge } from '../common/StatusBadge';
import { PalmActionModal } from './PalmActionModals';
import { TaskCreateModal } from '../tasks/TaskCreateModal';
import { ProblemReportDrawer } from '../worker/ProblemReportDrawer';

export const PalmDetailView: React.FC = () => {
  const { 
    palms, 
    selectedPalmId, 
    navigateTo, 
    updatePalm, 
    farmInfo 
  } = useFarm();

  const palm = palms.find(p => p.id === (selectedPalmId || 'A-024')) || palms[0];

  const [activeTab, setActiveTab] = useState<'history' | 'problems' | 'maintenance' | 'notes'>('history');
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'irrigation' | 'maintenance' | 'inspection' | 'note'>('irrigation');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [problemDrawerOpen, setProblemDrawerOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  if (!palm) {
    return (
      <div className="p-8 text-center bg-surface-lowest rounded-2xl border border-outline">
        <p className="text-on-surface-variant">لم يتم العثور على النخلة المحددة.</p>
        <button
          onClick={() => navigateTo('map')}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold"
        >
          العودة للخريطة
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: PalmStatus) => {
    updatePalm({
      ...palm,
      status: newStatus,
    });
    setStatusMenuOpen(false);
  };

  const openAction = (type: 'irrigation' | 'maintenance' | 'inspection' | 'note') => {
    setActionType(type);
    setActionModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-28 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('map')}
          className="flex items-center gap-2 text-xs font-bold text-on-surface hover:text-primary transition-colors bg-surface-lowest px-3 py-2 rounded-xl border border-outline shadow-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى خريطة المزرعة</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick status switcher button */}
          <div className="relative">
            <button
              onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-surface-lowest border border-outline hover:bg-surface-container"
            >
              <span>تغيير الحالة:</span>
              <StatusBadge type="palm" status={palm.status} size="sm" />
            </button>

            {statusMenuOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-surface-lowest border border-outline rounded-xl shadow-xl py-1 z-50">
                {(['healthy', 'needs_followup', 'needs_intervention', 'maintenance', 'irrigation_issue'] as PalmStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className="w-full text-right px-3 py-2 text-xs hover:bg-surface-container flex items-center justify-between"
                  >
                    <StatusBadge type="palm" status={st} size="sm" />
                    {palm.status === st && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigateTo('qr_print')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-lowest border border-outline text-on-surface hover:bg-surface-container text-xs font-semibold"
            title="طباعة بطاقة QR"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">طباعة الملصق</span>
          </button>
        </div>
      </div>

      {/* Hero Card: Digital Identity + Photo + QR Code */}
      <div className="bg-surface-lowest rounded-3xl border border-outline shadow-soft overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left / Info & QR Section (7 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-on-surface font-mono">
                  نخلة {palm.id}
                </span>
                <StatusBadge type="palm" status={palm.status} size="md" />
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary-container font-bold text-xs">
                  صنف: {palm.variety}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                الهوية الرقمية الدائمة للنخلة في {farmInfo.name} — قطاع {palm.sectorId} (الصف {palm.row}، الموقع {palm.positionInRow})
              </p>
            </div>

            {/* Bento Grid Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface-low p-3 rounded-2xl border border-outline/50">
                <span className="text-[11px] text-on-surface-variant block">القطاع</span>
                <span className="text-base font-bold text-primary block mt-0.5">قطاع {palm.sectorId}</span>
              </div>

              <div className="bg-surface-low p-3 rounded-2xl border border-outline/50">
                <span className="text-[11px] text-on-surface-variant block">الصف / الموقع</span>
                <span className="text-base font-bold text-on-surface block mt-0.5">صف {palm.row} • #{palm.positionInRow}</span>
              </div>

              <div className="bg-surface-low p-3 rounded-2xl border border-outline/50">
                <span className="text-[11px] text-on-surface-variant block">سنة الغرس</span>
                <span className="text-base font-bold text-on-surface block mt-0.5">{palm.plantingYear}</span>
              </div>

              <div className="bg-surface-low p-3 rounded-2xl border border-outline/50">
                <span className="text-[11px] text-on-surface-variant block">العامل المسؤول</span>
                <span className="text-base font-bold text-primary-container block mt-0.5 truncate">
                  {palm.assignedWorkerName || 'محمد'}
                </span>
              </div>
            </div>

            {/* Operational Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant bg-surface-low/60 p-3 rounded-2xl border border-outline/40">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-700" />
                <span>آخر ري: <strong className="text-on-surface">{palm.lastIrrigation || 'غير مسجل'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-700" />
                <span>آخر صيانة: <strong className="text-on-surface">{palm.lastMaintenance || '2024-11-10'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>آخر فحص: <strong className="text-on-surface">{palm.lastInspection || '2024-11-14'}</strong></span>
              </div>
            </div>
          </div>

          {/* Right / QR Code Card (4 cols) */}
          <div className="md:col-span-4 bg-surface-low rounded-2xl p-5 border border-outline flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-outline">
              <QRCodeSVG
                value={palm.qrCodeValue}
                size={140}
                level="H"
                includeMargin={true}
              />
            </div>
            <span className="font-mono text-xs font-bold text-on-surface mt-2">{palm.id}</span>
            <span className="text-[10px] text-on-surface-variant">رمز QR الدائم الميداني</span>
            
            <button
              onClick={() => window.print()}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-surface-lowest border border-outline text-on-surface hover:bg-surface-container text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة بطاقة المعاينة</span>
            </button>
          </div>
        </div>

        {/* Operational Actions Toolbar */}
        <div className="px-6 py-4 bg-surface-low/80 border-t border-outline flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-on-surface ml-2">الإجراءات الميدانية:</span>

          <button
            onClick={() => setTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة مهمة</span>
          </button>

          <button
            onClick={() => openAction('irrigation')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-lowest border border-outline text-cyan-900 hover:bg-cyan-50 text-xs font-semibold transition-colors"
          >
            <Droplets className="w-4 h-4 text-cyan-700" />
            <span>تسجيل ري</span>
          </button>

          <button
            onClick={() => openAction('maintenance')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-lowest border border-outline text-amber-900 hover:bg-amber-50 text-xs font-semibold transition-colors"
          >
            <Wrench className="w-4 h-4 text-amber-700" />
            <span>تسجيل صيانة</span>
          </button>

          <button
            onClick={() => openAction('inspection')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-lowest border border-outline text-emerald-900 hover:bg-emerald-50 text-xs font-semibold transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>تسجيل فحص</span>
          </button>

          <button
            onClick={() => setProblemDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-800 hover:bg-red-100 text-xs font-bold transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>الإبلاغ عن مشكلة</span>
          </button>

          <button
            onClick={() => openAction('note')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-lowest border border-outline text-on-surface hover:bg-surface-container text-xs font-semibold transition-colors"
          >
            <FileText className="w-4 h-4 text-on-surface-variant" />
            <span>إضافة ملاحظة</span>
          </button>
        </div>
      </div>

      {/* History & Logs Tabs Section */}
      <div className="bg-surface-lowest rounded-3xl border border-outline shadow-soft p-6">
        {/* Tabs navigation */}
        <div className="flex items-center gap-2 border-b border-outline pb-3 mb-6 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            سجل العمليات والري ({palm.history?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'problems'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            سجل المشاكل والبلاغات
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            الصيانة والفحص الوقائي
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            الملاحظات الحقلية
          </button>
        </div>

        {/* Tab 1: Operations History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {(!palm.history || palm.history.length === 0) ? (
              <p className="text-xs text-on-surface-variant py-4 text-center">لا توجد عمليات مسجلة لهذه النخلة بعد.</p>
            ) : (
              palm.history.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-surface-low border border-outline/60 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary-container flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.type === 'irrigation' ? <Droplets className="w-4 h-4" /> : item.type === 'problem' ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <ShieldCheck className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-on-surface">{item.title}</h4>
                      {item.notes && <p className="text-xs text-on-surface-variant mt-0.5">{item.notes}</p>}
                      <span className="text-[11px] text-on-surface-variant/80 mt-1 block">
                        بواسطة: <strong className="text-primary">{item.workerName}</strong>
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-mono bg-surface-container px-2 py-1 rounded-md flex-shrink-0">
                    {item.date}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Problems */}
        {activeTab === 'problems' && (
          <div className="space-y-3">
            {palm.notes ? (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>بلاغ متابعة نشط</span>
                </div>
                <p className="text-xs text-amber-950">{palm.notes}</p>
                <div className="flex items-center justify-between text-[11px] text-amber-800 mt-3 pt-2 border-t border-amber-200">
                  <span>المسؤول: {palm.assignedWorkerName}</span>
                  <button
                    onClick={() => handleStatusChange('healthy')}
                    className="px-2.5 py-1 bg-amber-200/60 rounded-lg font-bold hover:bg-amber-200 transition-colors"
                  >
                    تحديد كـ "تمت المعالجة"
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant py-4 text-center">لا توجد بلاغات مشاكل أو أمراض مسجلة للنخلة.</p>
            )}
          </div>
        )}

        {/* Tab 3: Maintenance */}
        {activeTab === 'maintenance' && (
          <div className="space-y-3 text-xs text-on-surface-variant">
            <div className="p-3.5 bg-surface-low rounded-xl border border-outline flex justify-between items-center">
              <div>
                <strong className="text-on-surface block text-sm">برنامج الري والتسميد الدوري</strong>
                <span>يتم ري النخلة 3 مرات أسبوعياً بمعدل 45 لتر</span>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold">منتظم</span>
            </div>
          </div>
        )}

        {/* Tab 4: Field Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-surface-low rounded-xl border border-outline text-xs">
              <p className="text-on-surface">{palm.notes || 'لا توجد ملاحظات مسجلة.'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PalmActionModal
        isOpen={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        palm={palm}
        actionType={actionType}
      />

      {taskModalOpen && (
        <TaskCreateModal
          isOpen={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          defaultPalmId={palm.id}
          defaultSectorId={palm.sectorId}
        />
      )}

      {problemDrawerOpen && (
        <ProblemReportDrawer
          isOpen={problemDrawerOpen}
          onClose={() => setProblemDrawerOpen(false)}
          defaultPalmId={palm.id}
        />
      )}
    </div>
  );
};
