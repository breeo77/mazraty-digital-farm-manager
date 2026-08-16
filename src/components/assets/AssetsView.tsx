import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Activity, 
  Save,
  Zap,
  Droplets,
  Truck,
  Layers
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { FarmAsset, AssetType, AssetStatus } from '../../types/farm';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

export const AssetsView: React.FC = () => {
  const { assets, addAssetMaintenance, workers } = useFarm();

  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FarmAsset | null>(null);
  const [description, setDescription] = useState('');
  const [technician, setTechnician] = useState('أحمد عثمان (فني صيانة)');
  const [cost, setCost] = useState<number | undefined>(undefined);

  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'pump': return <Droplets className="w-5 h-5 text-cyan-700" />;
      case 'well': return <Droplets className="w-5 h-5 text-blue-700" />;
      case 'irrigation_network': return <Layers className="w-5 h-5 text-emerald-700" />;
      case 'generator': return <Zap className="w-5 h-5 text-amber-700" />;
      case 'vehicle': return <Truck className="w-5 h-5 text-slate-700" />;
      case 'tank': return <Droplets className="w-5 h-5 text-cyan-800" />;
      default: return <Wrench className="w-5 h-5 text-primary" />;
    }
  };

  const handleOpenMaintenance = (asset: FarmAsset) => {
    setSelectedAsset(asset);
    setDescription(`صيانة وتفقد دوري لـ ${asset.name}`);
    setMaintenanceModalOpen(true);
  };

  const handleSubmitMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAsset) {
      addAssetMaintenance(selectedAsset.id, description, technician, cost);
      setMaintenanceModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="bg-surface-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-on-surface">إدارة الأصول والمعدات الزراعية</h1>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary-container font-semibold text-xs">
              {assets.length} أصل مسجل
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            سجل المضخات والآبار الارتوازية والمولدات وشبكات الري مع تنبيهات الصيانة الوقائية
          </p>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="bg-surface-lowest rounded-3xl p-5 border border-outline shadow-soft hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Asset Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-low border border-outline/60 flex items-center justify-center flex-shrink-0">
                    {getAssetIcon(asset.type)}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-on-surface line-clamp-1">
                      {asset.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-primary block">
                      {asset.id}
                    </span>
                  </div>
                </div>

                <StatusBadge type="asset" status={asset.status} size="sm" />
              </div>

              {/* Location & Notes */}
              <div className="text-xs text-on-surface-variant space-y-1 my-3 bg-surface-low p-3 rounded-2xl border border-outline/40">
                <p className="flex items-center gap-1.5 font-medium text-on-surface">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>الموقع: {asset.locationSector}</span>
                </p>
                {asset.notes && <p className="text-[11px] text-on-surface-variant mt-1">{asset.notes}</p>}
              </div>

              {/* Maintenance dates */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant pt-2 border-t border-outline/40">
                <div>
                  <span>آخر صيانة:</span>
                  <strong className="block text-on-surface font-mono mt-0.5">{asset.lastMaintenanceDate}</strong>
                </div>
                <div>
                  <span>الصيانة القادمة:</span>
                  <strong className="block text-amber-800 font-mono mt-0.5">{asset.nextMaintenanceDate}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-outline/50 flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant">
                {asset.maintenanceHistory.length} سجلات سابقة
              </span>
              <button
                onClick={() => handleOpenMaintenance(asset)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft transition-all active:scale-95"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>تسجيل صيانة</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Record Maintenance Modal */}
      <Modal
        isOpen={maintenanceModalOpen}
        onClose={() => setMaintenanceModalOpen(false)}
        title={`تسجيل صيانة: ${selectedAsset?.name}`}
        subtitle={`المعرف: ${selectedAsset?.id} • الموقع: ${selectedAsset?.locationSector}`}
        maxWidth="md"
      >
        <form onSubmit={handleSubmitMaintenance} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              اسم الفني / جهة الصيانة
            </label>
            <input
              type="text"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              required
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              تفاصيل أعمال الصيانة وقطع الغيار
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
              className="w-full text-sm bg-surface-low border border-outline rounded-xl p-3 text-on-surface outline-none"
              placeholder="اكتب ما تم صيانته بدقة..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              التكلفة التقديرية (ريال سعودي - اختياري)
            </label>
            <input
              type="number"
              value={cost || ''}
              onChange={(e) => setCost(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="مثال: 350"
              className="w-full text-sm bg-surface-low border border-outline rounded-xl px-3.5 py-2 text-on-surface outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline">
            <button
              type="button"
              onClick={() => setMaintenanceModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft"
            >
              <Save className="w-4 h-4" />
              <span>حفظ سجل الصيانة</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
