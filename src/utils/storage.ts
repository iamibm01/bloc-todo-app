import { STORAGE_KEYS } from '@/constants';
import type { Project, Task, AppSettings } from '@/types';

// ==========================================
// GENERIC STORAGE FUNCTIONS
// ==========================================

/**
 * Generic function to get data from localStorage
 * Handles JSON parsing and date revival
 */
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    
    return JSON.parse(item, dateReviver) as T;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Generic function to save data to localStorage
 */
export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

/**
 * Remove item from localStorage
 */
export const removeFromStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

/**
 * Clear all localStorage
 */
export const clearStorage = (): void => {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// ==========================================
// DATE REVIVER FOR JSON PARSING
// ==========================================

/**
 * Converts ISO date strings back to Date objects when parsing JSON
 */
function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === 'string') {
    // Check if string matches ISO date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    if (dateRegex.test(value)) {
      return new Date(value);
    }
  }
  return value;
}

// ==========================================
// SPECIFIC STORAGE FUNCTIONS
// ==========================================

/**
 * Get all projects from localStorage
 */
export const getProjects = (): Project[] => {
  return getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
};

/**
 * Save projects to localStorage
 */
export const saveProjects = (projects: Project[]): void => {
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
};

/**
 * Get all tasks from localStorage
 */
export const getTasks = (): Task[] => {
  return getFromStorage<Task[]>(STORAGE_KEYS.TASKS, []);
};

/**
 * Save tasks to localStorage
 */
export const saveTasks = (tasks: Task[]): void => {
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
};

/**
 * Get app settings from localStorage
 */
export const getSettings = (): AppSettings => {
  return getFromStorage<AppSettings>(STORAGE_KEYS.SETTINGS, {
    activeProjectId: null,
    viewMode: 'kanban',
    theme: 'light',
  });
};

/**
 * Save app settings to localStorage
 */
export const saveSettings = (settings: AppSettings): void => {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
};

/**
 * Initialize storage with default data if empty
 */
export const initializeStorage = (): void => {
  const projects = getProjects();
  const tasks = getTasks();
  const settings = getSettings();

  // If no projects exist, we'll let the app create the default inbox
  // This is just to ensure the structure exists
  if (projects.length === 0) {
    saveProjects([]);
  }

  if (tasks.length === 0) {
    saveTasks([]);
  }

  // Ensure settings exist
  saveSettings(settings);
};