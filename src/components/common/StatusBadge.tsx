import React from 'react';
import { PalmStatus, TaskStatus, TaskPriority, AssetStatus } from '../../types/farm';

interface StatusBadgeProps {
  type: 'palm' | 'task' | 'priority' | 'asset' | 'custom';
  status: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  status,
  label,
  size = 'md',
  className = '',
}) => {
  let text = label || status;
  let bgClass = 'bg-surface-container text-on-surface-variant border-outline';
  let dotColor = 'bg-outline-dark';

  if (type === 'palm') {
    switch (status as PalmStatus) {
      case 'healthy':
        text = label || 'سليمة';
        bgClass = 'bg-primary/10 text-primary-container border-primary/20';
        dotColor = 'bg-primary-container';
        break;
      case 'needs_followup':
        text = label || 'تحتاج متابعة';
        bgClass = 'bg-amber-50 text-amber-800 border-amber-300';
        dotColor = 'bg-amber-500';
        break;
      case 'needs_intervention':
        text = label || 'تحتاج تدخل';
        bgClass = 'bg-red-50 text-red-800 border-red-300';
        dotColor = 'bg-red-600';
        break;
      case 'maintenance':
        text = label || 'صيانة';
        bgClass = 'bg-blue-50 text-blue-800 border-blue-300';
        dotColor = 'bg-blue-600';
        break;
      case 'irrigation_issue':
        text = label || 'مشكلة ري';
        bgClass = 'bg-cyan-50 text-cyan-800 border-cyan-300';
        dotColor = 'bg-cyan-600';
        break;
    }
  } else if (type === 'task') {
    switch (status as TaskStatus) {
      case 'new':
        text = label || 'جديدة';
        bgClass = 'bg-gray-100 text-gray-800 border-gray-300';
        dotColor = 'bg-gray-500';
        break;
      case 'in_progress':
        text = label || 'قيد التنفيذ';
        bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        dotColor = 'bg-emerald-600';
        break;
      case 'completed':
        text = label || 'مكتملة';
        bgClass = 'bg-green-100 text-green-900 border-green-400';
        dotColor = 'bg-green-700';
        break;
      case 'delayed':
        text = label || 'متأخرة';
        bgClass = 'bg-red-50 text-red-800 border-red-300';
        dotColor = 'bg-red-600';
        break;
      case 'paused':
        text = label || 'متوقفة';
        bgClass = 'bg-amber-50 text-amber-800 border-amber-300';
        dotColor = 'bg-amber-600';
        break;
    }
  } else if (type === 'priority') {
    switch (status as TaskPriority) {
      case 'urgent':
        text = label || 'عاجلة جداً';
        bgClass = 'bg-red-100 text-red-900 border-red-400 font-semibold';
        dotColor = 'bg-red-600';
        break;
      case 'high':
        text = label || 'أولوية مرتفعة';
        bgClass = 'bg-amber-100 text-amber-900 border-amber-300';
        dotColor = 'bg-amber-600';
        break;
      case 'normal':
        text = label || 'عادية';
        bgClass = 'bg-slate-100 text-slate-700 border-slate-300';
        dotColor = 'bg-slate-500';
        break;
    }
  } else if (type === 'asset') {
    switch (status as AssetStatus) {
      case 'optimal':
        text = label || 'تعمل بكفاءة';
        bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
        dotColor = 'bg-emerald-600';
        break;
      case 'needs_maintenance':
        text = label || 'تحتاج صيانة';
        bgClass = 'bg-amber-50 text-amber-800 border-amber-300';
        dotColor = 'bg-amber-600';
        break;
      case 'offline':
        text = label || 'متوقفة / عطل';
        bgClass = 'bg-red-50 text-red-800 border-red-300';
        dotColor = 'bg-red-600';
        break;
    }
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm md:text-base px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClasses} ${bgClass} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0`} />
      <span>{text}</span>
    </span>
  );
};
