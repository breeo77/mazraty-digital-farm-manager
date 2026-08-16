import React, { useState } from 'react';
import { 
  X, 
  Droplets, 
  Bug, 
  Activity, 
  Wrench, 
  HelpCircle, 
  Camera, 
  Send,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { ProblemType } from '../../types/farm';

interface ProblemReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPalmId?: string;
}

const problemTypes: { type: ProblemType; label: string; icon: React.ReactNode; color: string }[] = [
  { type: 'irrigation', label: 'مشكلة في الري', icon: <Droplets className="w-5 h-5" />, color: 'bg-cyan-100 text-cyan-800' },
  { type: 'sick_palm', label: 'نخلة مريضة', icon: <Activity className="w-5 h-5" />, color: 'bg-amber-100 text-amber-800' },
  { type: 'pest', label: 'آفة / سوسة النخيل', icon: <Bug className="w-5 h-5" />, color: 'bg-red-100 text-red-800' },
  { type: 'damage', label: 'تلف / كسر أنابيب', icon: <Wrench className="w-5 h-5" />, color: 'bg-orange-100 text-orange-800' },
  { type: 'other', label: 'مشكلة أخرى', icon: <HelpCircle className="w-5 h-5" />, color: 'bg-slate-100 text-slate-800' },
];

export const ProblemReportDrawer: React.FC<ProblemReportDrawerProps> = ({
  isOpen,
  onClose,
  defaultPalmId,
}) => {
  const { createProblemReport, activeWorker, sectors, palms } = useFarm();

  const [selectedType, setSelectedType] = useState<ProblemType>('irrigation');
  const [palmId, setPalmId] = useState(defaultPalmId || 'A-024');
  const [sectorId, setSectorId] = useState('A');
  const [description, setDescription] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createProblemReport({
      type: selectedType,
      palmId: palmId ? palmId.toUpperCase().trim() : undefined,
      sectorId: sectorId || 'A',
      workerId: activeWorker?.id || 'W-01',
      workerName: activeWorker?.name || 'العامل الميداني',
      description: description || `بلاغ فوري عن ${problemTypes.find(p => p.type === selectedType)?.label}`,
      photo: photoAttached ? 'attached' : undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-lg bg-surface-lowest rounded-t-3xl shadow-2xl border-t border-outline p-6 z-10 max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">الإبلاغ عن مشكلة ميدانية</h3>
              <p className="text-xs text-on-surface-variant">إرسال تنبيه فوري للمشرف والمالك</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-on-surface">تم تسجيل البلاغ وإشعار المالك بنجاح</h4>
            <p className="text-xs text-on-surface-variant">تم تحديث حالة النخلة في الخريطة وسجل العمليات</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Problem Type selection grid */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">
                حدد نوع المشكلة التي تواجهها:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {problemTypes.map((pt) => (
                  <button
                    key={pt.type}
                    type="button"
                    onClick={() => setSelectedType(pt.type)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      selectedType === pt.type
                        ? 'border-red-600 bg-red-50 ring-2 ring-red-600/30'
                        : 'border-outline bg-surface-low hover:bg-surface-container'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mb-1.5 ${pt.color}`}>
                      {pt.icon}
                    </div>
                    <span className="text-xs font-bold text-on-surface">{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Palm / Sector */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  رقم النخلة (إن وجد)
                </label>
                <input
                  type="text"
                  value={palmId}
                  onChange={(e) => setPalmId(e.target.value)}
                  placeholder="مثال: A-024"
                  className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface font-mono uppercase outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  القطاع
                </label>
                <select
                  value={sectorId}
                  onChange={(e) => setSectorId(e.target.value)}
                  className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none cursor-pointer"
                >
                  {sectors.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Problem Details */}
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                وصف المشكلة والملاحظات
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                placeholder="اكتب تفاصيل ما لاحظته (مثال: انكسار لي الري، اصفرار السعف، ظهور حشرات...)"
                className="w-full text-sm bg-surface-low border border-outline rounded-xl p-3 text-on-surface focus:border-red-600 outline-none"
              />
            </div>

            {/* Attach photo simulated button */}
            <div>
              <button
                type="button"
                onClick={() => setPhotoAttached(!photoAttached)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all ${
                  photoAttached
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-surface-low border-outline text-on-surface hover:bg-surface-container'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>{photoAttached ? '✓ تم إرفاق صورة حقلية من الكاميرا' : 'التقاط / إرفاق صورة للمشكلة'}</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-14 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-2xl font-bold text-base shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-5 h-5" />
                <span>إرسال البلاغ الآن</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
