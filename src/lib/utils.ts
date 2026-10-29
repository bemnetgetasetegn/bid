import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for conditional class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts minor units (cents) to formatted currency string.
 * 100 = "1.00 ETB"
 */
export function formatCurrency(amount: number, currency: string = 'ETB'): string {
  const majorUnits = amount / 100;
  const formatted = new Intl.NumberFormat('en-ET', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(majorUnits);
  return `${formatted} ${currency}`;
}

/**
 * Normalizes an Ethiopian phone number to +251XXXXXXXXX format.
 */
export function formatPhone(phone: string): string {
  // Remove all whitespace, dashes, and parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // If starts with 0, replace with +251
  if (cleaned.startsWith('0')) {
    cleaned = '+251' + cleaned.slice(1);
  }

  // If starts with 251 (no +), add +
  if (cleaned.startsWith('251') && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  // If starts with 9 (just the subscriber number), add +251
  if (cleaned.startsWith('9') && cleaned.length === 9) {
    cleaned = '+251' + cleaned;
  }

  return cleaned;
}

/**
 * Formats a date for display.
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Returns a human-readable relative time string like "2 hours ago".
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 5) return 'just now';
  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return '1 week ago';
  if (diffWeeks < 5) return `${diffWeeks} weeks ago`;
  if (diffMonths === 1) return '1 month ago';
  if (diffMonths < 12) return `${diffMonths} months ago`;
  if (diffYears === 1) return '1 year ago';
  return `${diffYears} years ago`;
}

/**
 * Converts text to a URL-safe slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')   // Remove non-word chars (except hyphens)
    .replace(/\-\-+/g, '-')     // Replace multiple hyphens with single
    .replace(/^-+/, '')         // Trim hyphens from start
    .replace(/-+$/, '');        // Trim hyphens from end
}

/**
 * Calculates time remaining until a given end date.
 */
export function getTimeRemaining(endDate: string | Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  totalSeconds: number;
} {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true, totalSeconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, expired: false, totalSeconds };
}
