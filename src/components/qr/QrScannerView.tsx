import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Search, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft, 
  RotateCcw,
  Zap,
  Volume2
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

export const QrScannerView: React.FC = () => {
  const { palms, navigateTo, logActivity, activeWorker } = useFarm();

  const [manualId, setManualId] = useState('');
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attempt real camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        }
      } catch (err) {
        console.log('Camera not accessible or permission denied:', err);
        setCameraError('لم يتم تفعيل الكاميرا تلقائياً، يمكنك استخدام المسح التجريبي أو البحث المباشر');
        setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScanSuccess = (palmId: string) => {
    const matchedPalm = palms.find(p => p.id.toLowerCase() === palmId.trim().toLowerCase());
    if (matchedPalm) {
      setScannedResult(matchedPalm.id);
      setIsScanning(false);

      // Log scan activity
      logActivity({
        eventType: 'qr_scan',
        title: `مسح رمز النخلة ${matchedPalm.id}`,
        description: `تم التعرف على النخلة (${matchedPalm.variety} - قطاع ${matchedPalm.sectorId})`,
        userId: activeWorker?.id || 'W-01',
        userName: activeWorker?.name || 'العامل الميداني',
        role: 'worker',
        targetEntity: matchedPalm.id,
        badgeType: 'primary',
      });

      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      // Auto redirect after 1.2s
      setTimeout(() => {
        navigateTo('palm_detail', matchedPalm.id);
      }, 1200);
    } else {
      alert(`لم يتم العثور على نخلة بالمعرف ${palmId}`);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      handleScanSuccess(manualId.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-28">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-primary-container text-2xl">qr_code_scanner</span>
          <span>الماسح الضوئي الذكي لرموز النخيل</span>
        </h1>
        <p className="text-xs text-on-surface-variant">
          وجّه الكاميرا نحو ملصق QR المثبت على جذع النخلة للفتح المباشر لسجلها
        </p>
      </div>

      {/* Main Viewfinder Frame */}
      <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-surface-container aspect-square max-w-sm mx-auto flex items-center justify-center">
        {/* Real Video or Simulated Background */}
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950 via-slate-900 to-black flex flex-col items-center justify-center p-6 text-center text-white/80">
            <Camera className="w-12 h-12 text-white/40 mb-3 animate-pulse" />
            <p className="text-xs font-semibold text-white/90">الكاميرا جاهزة للمسح الميداني</p>
            <p className="text-[11px] text-white/60 mt-1 max-w-xs">
              استخدم الأزرار أدناه لمحاكاة مسح رمز أي نخلة فوراً
            </p>
          </div>
        )}

        {/* Viewfinder Target Reticle */}
        <div className="absolute w-56 h-56 border-2 border-dashed border-white/60 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
          {/* Laser Scanner Sweep Line */}
          {isScanning && (
            <div className="absolute left-2 right-2 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-laser" />
          )}

          <div className="flex justify-between">
            <div className="w-6 h-6 border-t-4 border-r-4 border-primary-fixed rounded-tr-lg" />
            <div className="w-6 h-6 border-t-4 border-l-4 border-primary-fixed rounded-tl-lg" />
          </div>
          <div className="flex justify-between">
            <div className="w-6 h-6 border-b-4 border-r-4 border-primary-fixed rounded-br-lg" />
            <div className="w-6 h-6 border-b-4 border-l-4 border-primary-fixed rounded-bl-lg" />
          </div>
        </div>

        {/* Success Banner Overlay */}
        {scannedResult && (
          <div className="absolute inset-0 bg-primary/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white z-20 animate-fadeIn">
            <CheckCircle2 className="w-16 h-16 text-primary-fixed mb-2 animate-bounce" />
            <h3 className="text-lg font-bold">تم التعرف على النخلة بنجاح!</h3>
            <span className="text-3xl font-extrabold font-mono text-primary-fixed mt-1">
              {scannedResult}
            </span>
            <p className="text-xs text-white/80 mt-2">جاري فتح سجل النخلة والإجراءات المتاحة...</p>
          </div>
        )}
      </div>

      {/* Field Simulated Scan Presets */}
      <div className="bg-surface-lowest p-5 rounded-2xl border border-outline shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>محاكاة مسح رمز QR سريع (نخيل الحقل)</span>
          </span>
          <span className="text-[11px] text-on-surface-variant">انقر للاختبار</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {['A-024', 'A-004', 'B-015', 'C-006'].map((id) => {
            const p = palms.find(x => x.id === id);
            return (
              <button
                key={id}
                onClick={() => handleScanSuccess(id)}
                className="p-2.5 rounded-xl bg-surface-low hover:bg-primary hover:text-white border border-outline/70 text-right transition-all group active:scale-95"
              >
                <div className="font-mono font-bold text-xs group-hover:text-white text-primary">
                  {id}
                </div>
                <div className="text-[10px] text-on-surface-variant group-hover:text-white/80 truncate">
                  {p?.variety || 'نخلة'} • قطاع {p?.sectorId}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Palm ID input */}
      <div className="bg-surface-lowest p-5 rounded-2xl border border-outline shadow-soft">
        <span className="text-xs font-bold text-on-surface block mb-2">
          أو إدخال رقم النخلة يدوياً:
        </span>
        <form onSubmit={handleManualSearch} className="flex gap-2">
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            placeholder="مثال: A-024 أو B-008"
            className="flex-1 text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2.5 text-on-surface font-mono uppercase focus:border-primary outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft transition-all"
          >
            بحث وفتح
          </button>
        </form>
      </div>
    </div>
  );
};
