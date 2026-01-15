import { PRIORITY_ORDER } from '@/constants';
import type { Task } from '@/types';

// ==========================================
// SORT BY PRIORITY
// ==========================================

/**
 * Sort tasks by priority (high → medium → low)
 */
export const sortByPriority = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });
};

// ==========================================
// SORT BY DUE DATE
// ==========================================

/**
 * Sort tasks by due date (earliest first)
 * Tasks without due dates come last
 */
export const sortByDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // Tasks without due dates go to the end
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    return a.dueDate.getTime() - b.dueDate.getTime();
  });
};

// ==========================================
// SORT BY CREATED DATE
// ==========================================

/**
 * Sort tasks by creation date (newest first)
 */
export const sortByCreatedDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
};

/**
 * Sort tasks by creation date (oldest first)
 */
export const sortByCreatedDateAsc = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
};

// ==========================================
// SORT BY UPDATED DATE
// ==========================================

/**
 * Sort tasks by last update (most recent first)
 */
export const sortByUpdatedDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
};

// ==========================================
// SORT BY ORDER (MANUAL)
// ==========================================

/**
 * Sort tasks by their manual order property
 */
export const sortByOrder = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => a.order - b.order);
};

// ==========================================
// SORT BY TITLE (ALPHABETICAL)
// ==========================================

/**
 * Sort tasks alphabetically by title
 */
export const sortByTitle = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
};

// ==========================================
// COMBINED SORT: PRIORITY THEN DUE DATE
// ==========================================

/**
 * Sort by priority first, then by due date within each priority
 */
export const sortByPriorityAndDueDate = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    // First sort by priority
    const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by due date
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    return a.dueDate.getTime() - b.dueDate.getTime();
  });
};

// ==========================================
// COMBINED SORT: STATUS THEN PRIORITY
// ==========================================

/**
 * Sort by status (brainstorm, todo, inProgress, done), then by priority within each status
 */
export const sortByStatusAndPriority = (tasks: Task[]): Task[] => {
  const statusOrder = { brainstorm: 0, todo: 1, inProgress: 2, done: 3 };
  
  return [...tasks].sort((a, b) => {
    // First sort by status
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;

    // Then by priority
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });
};