import type { TaskPriority, TaskStatus } from '@/types';

// LocalStorage Keys
export const STORAGE_KEYS = {
  PROJECTS: 'bloc_projects',
  TASKS: 'bloc_tasks',
  SETTINGS: 'bloc_settings',
} as const;

// Pastel Colors for Light Mode
export const PASTEL_COLORS_LIGHT = {
  high: '#FFB3BA',      // pastel red
  medium: '#FFFFBA',    // pastel yellow
  low: '#BAFFC9',       // pastel green
  brainstorm: '#E0BBE4', // pastel lavender
  todo: '#BAE1FF',      // pastel blue
  inProgress: '#FFDFBA', // pastel orange
  done: '#BAFFC9',      // pastel green (changed from purple)
  accent: '#FFD5E5',    // pastel pink
} as const;

// Muted Pastel Colors for Dark Mode
export const PASTEL_COLORS_DARK = {
  high: '#B8868A',      // muted pastel red
  medium: '#C4C48A',    // muted pastel yellow
  low: '#8AB893',       // muted pastel green
  brainstorm: '#A88AAC', // muted pastel lavender
  todo: '#8AA7B8',      // muted pastel blue
  inProgress: '#B8A58A', // muted pastel orange
  done: '#8AB893',      // muted pastel green
  accent: '#B88A9A',    // muted pastel pink
} as const;

// Project Color Presets (Pastel)
export const PROJECT_COLORS = [
  '#FFB3BA', // pastel red
  '#FFDFBA', // pastel orange
  '#FFFFBA', // pastel yellow
  '#BAFFC9', // pastel green
  '#BAE1FF', // pastel blue
  '#E0BBE4', // pastel purple
  '#FFD5E5', // pastel pink
  '#C9C9FF', // pastel lavender
  '#FFDAC1', // pastel peach
  '#B5EAD7', // pastel mint
] as const;

// Animation Timing Constants
export const ANIMATION_TIMINGS = {
  ultraFast: 150,   // toggles, checks
  fast: 250,        // hovers, color changes
  medium: 350,      // layout shifts, cards
  slow: 550,        // page transitions, modals
} as const;

// Framer Motion Spring Config
export const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

// Task Priority Labels
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

// Task Status Labels
export const STATUS_LABELS: Record<TaskStatus, string> = {
  brainstorm: '💡 Ideas',
  todo: 'To Do',
  inProgress: 'In Progress',
  done: 'Done',
};

// Default Project
export const DEFAULT_PROJECT = {
  id: 'inbox',
  name: 'Inbox',
  description: 'Default project for uncategorized tasks',
  color: PASTEL_COLORS_LIGHT.accent,
  isArchived: false,
} as const;

// Task Priority Order (for sorting)
export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

// Max Lengths (for validation)
export const MAX_LENGTHS = {
  TASK_TITLE: 100,
  TASK_DESCRIPTION_WORDS: 200,
  PROJECT_NAME: 50,
  PROJECT_DESCRIPTION: 200,
  TAG_NAME: 20,
} as const;