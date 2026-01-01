// Re-export everything from other type files
export * from './task.types';
export * from './project.types';

// Import types to use them
import type { Project } from './project.types';
import type { Task } from './task.types';

// App-wide types
export type ViewMode = 'kanban' | 'list';
export type Theme = 'light' | 'dark';

// Filter configuration
export interface Filters {
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Global Application State
export interface AppState {
  projects: Project[];           // All projects
  tasks: Task[];                 // All tasks
  activeProjectId: string | null; // Currently selected project
  viewMode: ViewMode;            // Kanban or List view
  theme: Theme;                  // Light or Dark mode
  searchQuery: string;           // Current search text
  filters: Filters;              // Active filters
}

// Settings stored in localStorage
export interface AppSettings {
  activeProjectId: string | null;
  viewMode: ViewMode;
  theme: Theme;
}