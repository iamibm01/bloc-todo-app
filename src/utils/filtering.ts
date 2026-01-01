import type { Task, Filters, TaskPriority, TaskStatus } from '@/types';

// ==========================================
// FILTER BY PROJECT
// ==========================================

/**
 * Filter tasks by project ID
 */
export const filterByProject = (tasks: Task[], projectId: string): Task[] => {
  return tasks.filter((task) => task.projectId === projectId);
};

// ==========================================
// FILTER BY STATUS
// ==========================================

/**
 * Filter tasks by status
 */
export const filterByStatus = (tasks: Task[], status: TaskStatus): Task[] => {
  return tasks.filter((task) => task.status === status);
};

// ==========================================
// FILTER BY PRIORITY
// ==========================================

/**
 * Filter tasks by priority
 */
export const filterByPriority = (tasks: Task[], priority: TaskPriority): Task[] => {
  return tasks.filter((task) => task.priority === priority);
};

// ==========================================
// FILTER BY TAGS
// ==========================================

/**
 * Filter tasks that have ANY of the specified tags
 */
export const filterByTags = (tasks: Task[], tags: string[]): Task[] => {
  if (tags.length === 0) return tasks;
  
  return tasks.filter((task) => {
    return tags.some((tag) => task.tags.includes(tag));
  });
};

/**
 * Filter tasks that have ALL of the specified tags
 */
export const filterByAllTags = (tasks: Task[], tags: string[]): Task[] => {
  if (tags.length === 0) return tasks;
  
  return tasks.filter((task) => {
    return tags.every((tag) => task.tags.includes(tag));
  });
};

// ==========================================
// FILTER BY SEARCH QUERY
// ==========================================

/**
 * Filter tasks by search query (searches title, description, and tags)
 */
export const filterBySearch = (tasks: Task[], query: string): Task[] => {
  if (!query.trim()) return tasks;
  
  const lowerQuery = query.toLowerCase();
  
  return tasks.filter((task) => {
    const titleMatch = task.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = task.description?.toLowerCase().includes(lowerQuery);
    const tagMatch = task.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
    
    return titleMatch || descriptionMatch || tagMatch;
  });
};

// ==========================================
// FILTER BY DATE RANGE
// ==========================================

/**
 * Filter tasks by due date range
 */
export const filterByDateRange = (
  tasks: Task[],
  startDate: Date,
  endDate: Date
): Task[] => {
  return tasks.filter((task) => {
    if (!task.dueDate) return false;
    
    return task.dueDate >= startDate && task.dueDate <= endDate;
  });
};

// ==========================================
// FILTER OVERDUE TASKS
// ==========================================

/**
 * Filter tasks that are overdue
 */
export const filterOverdue = (tasks: Task[]): Task[] => {
  const now = new Date();
  
  return tasks.filter((task) => {
    if (!task.dueDate || task.status === 'done') return false;
    return task.dueDate < now;
  });
};

// ==========================================
// FILTER DUE TODAY
// ==========================================

/**
 * Filter tasks due today
 */
export const filterDueToday = (tasks: Task[]): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return tasks.filter((task) => {
    if (!task.dueDate) return false;
    return task.dueDate >= today && task.dueDate < tomorrow;
  });
};

// ==========================================
// FILTER ARCHIVED/ACTIVE
// ==========================================

/**
 * Filter archived tasks
 */
export const filterArchived = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => task.isArchived);
};

/**
 * Filter active (non-archived) tasks
 */
export const filterActive = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => !task.isArchived);
};

// ==========================================
// APPLY ALL FILTERS
// ==========================================

/**
 * Apply multiple filters to tasks
 */
export const applyFilters = (
  tasks: Task[],
  filters: Filters,
  searchQuery?: string
): Task[] => {
  let filtered = tasks;

  // Apply priority filter
  if (filters.priority) {
    filtered = filterByPriority(filtered, filters.priority);
  }

  // Apply tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filterByTags(filtered, filters.tags);
  }

  // Apply date range filter
  if (filters.dateRange) {
    filtered = filterByDateRange(
      filtered,
      filters.dateRange.start,
      filters.dateRange.end
    );
  }

  // Apply search query
  if (searchQuery) {
    filtered = filterBySearch(filtered, searchQuery);
  }

  return filtered;
};