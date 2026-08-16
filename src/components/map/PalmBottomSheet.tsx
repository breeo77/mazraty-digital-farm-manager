import React from 'react';
import { X, Droplets, User, PlusCircle, AlertTriangle, ArrowLeft, QrCode } from 'lucide-react';
import { PalmTree } from '../../types/farm';
import { StatusBadge } from '../common/StatusBadge';
import { useFarm } from '../../context/FarmContext';

interface PalmBottomSheetProps {
  palm: PalmTree | null;
  onClose: () => void;
  onOpenActionModal?: (actionType: 'task' | 'irrigation' | 'problem') => void;
}

export const PalmBottomSheet: React.FC<PalmBottomSheetProps> = ({
  palm,
  onClose,
  onOpenActionModal,
}) => {
  const { navigateTo } = useFarm();

  if (!palm) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-30 animate-slideUp">
      <div className="bg-surface-lowest rounded-2xl shadow-lift border border-outline p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-on-surface font-mono">
                نخلة {palm.id}
              </h3>
              <StatusBadge type="palm" status={palm.status} size="sm" />
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              قطاع {palm.sectorId} • الصف {palm.row} • الموقع {palm.positionInRow} • صنف: {palm.variety}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Details Bento */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-surface-low p-2.5 rounded-xl flex items-center gap-2.5 border border-outline/50">
            <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center flex-shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-on-surface-variant block">آخر ري</span>
              <span className="font-semibold text-on-surface truncate block">{palm.lastIrrigation || 'غير مسجل'}</span>
            </div>
          </div>

          <div className="bg-surface-low p-2.5 rounded-xl flex items-center gap-2.5 border border-outline/50">
            <div className="w-7 h-7 rounded-lg bg-surface-container text-on-surface flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-on-surface-variant block">المسؤول</span>
              <span className="font-semibold text-on-surface truncate block">{palm.assignedWorkerName || 'غير مسند'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => navigateTo('palm_detail', palm.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-white hover:bg-primary-container text-xs font-bold shadow-soft transition-all active:scale-95"
          >
            <span>عرض السجل الكامل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          {onOpenActionModal && (
            <button
              onClick={() => onOpenActionModal('task')}
              className="flex items-center justify-center p-2.5 rounded-xl bg-surface-low border border-outline text-on-surface hover:bg-surface-container transition-colors"
              title="إسناد مهمة لهذه النخلة"
            >
              <PlusCircle className="w-4 h-4 text-primary-container" />
            </button>
          )}

          {onOpenActionModal && (
            <button
              onClick={() => onOpenActionModal('problem')}
              className="flex items-center justify-center p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors"
              title="الإبلاغ عن مشكلة"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
