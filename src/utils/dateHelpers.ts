// ==========================================
// DATE FORMATTING
// ==========================================

/**
 * Format date as "Jan 15, 2024"
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format date as "January 15, 2024"
 */
export const formatDateLong = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format date as "Mon, Jan 15"
 */
export const formatDateShort = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date as relative time (e.g., "2 days ago", "in 3 hours")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  // Past
  if (diffMs < 0) {
    const absDiffSec = Math.abs(diffSec);
    const absDiffMin = Math.abs(diffMin);
    const absDiffHour = Math.abs(diffHour);
    const absDiffDay = Math.abs(diffDay);

    if (absDiffSec < 60) return 'just now';
    if (absDiffMin < 60) return `${absDiffMin} min ago`;
    if (absDiffHour < 24) return `${absDiffHour} hour${absDiffHour > 1 ? 's' : ''} ago`;
    if (absDiffDay < 7) return `${absDiffDay} day${absDiffDay > 1 ? 's' : ''} ago`;
    return formatDate(date);
  }

  // Future
  if (diffSec < 60) return 'in a moment';
  if (diffMin < 60) return `in ${diffMin} min`;
  if (diffHour < 24) return `in ${diffHour} hour${diffHour > 1 ? 's' : ''}`;
  if (diffDay < 7) return `in ${diffDay} day${diffDay > 1 ? 's' : ''}`;
  return formatDate(date);
};

// ==========================================
// DATE CHECKING
// ==========================================

/**
 * Check if date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if date is tomorrow
 */
export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * Check if date is in the past
 */
export const isPast = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Check if date is overdue (in the past and not today)
 */
export const isOverdue = (date: Date): boolean => {
  return isPast(date) && !isToday(date);
};

/**
 * Check if date is this week
 */
export const isThisWeek = (date: Date): boolean => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  return date >= weekStart && date < weekEnd;
};

// ==========================================
// DATE CALCULATIONS
// ==========================================

/**
 * Get number of days between two dates
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get number of days until a date
 */
export const daysUntil = (date: Date): number => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get start of day (00:00:00)
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day (23:59:59)
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};