import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export const statusColors: Record<string, string> = {
  RUNNING: 'text-green-400',
  IDLE: 'text-blue-400',
  STOPPED: 'text-gray-400',
  ERROR: 'text-red-400',
  STOPPING: 'text-yellow-400',
  PENDING: 'text-amber-400',
  COMPLETED: 'text-green-400',
  FAILED: 'text-red-400',
  CANCELLED: 'text-gray-400',
  RETRYING: 'text-yellow-400',
};

export const statusDotColors: Record<string, string> = {
  RUNNING: 'bg-green-400 status-running',
  IDLE: 'bg-blue-400',
  STOPPED: 'bg-gray-500',
  ERROR: 'bg-red-400 status-error',
  STOPPING: 'bg-yellow-400',
  PENDING: 'bg-amber-400',
  COMPLETED: 'bg-green-400',
  FAILED: 'bg-red-400',
  CANCELLED: 'bg-gray-500',
  RETRYING: 'bg-yellow-400',
};
