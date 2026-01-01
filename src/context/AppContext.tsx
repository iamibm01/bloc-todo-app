import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  Task,
  Project,
  CreateTaskInput,
  UpdateTaskInput,
  CreateProjectInput,
  UpdateProjectInput,
  ViewMode,
  Filters,
} from '@/types';
import {
  getTasks,
  saveTasks,
  getProjects,
  saveProjects,
  getSettings,
  saveSettings,
  initializeStorage,
} from '@/utils/storage';
import { DEFAULT_PROJECT, PROJECT_COLORS } from '@/constants';

// ==========================================
// APP CONTEXT TYPE
// ==========================================

interface AppContextType {
  // State
  tasks: Task[];
  projects: Project[];
  activeProjectId: string | null;
  viewMode: ViewMode;
  searchQuery: string;
  filters: Filters;

  // Task Actions
  createTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  archiveTask: (id: string) => void;
  unarchiveTask: (id: string) => void;
  reorderTasks: (tasks: Task[]) => void;

  // Project Actions
  createProject: (input: CreateProjectInput) => Project;
  updateProject: (id: string, input: UpdateProjectInput) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;

  // View Actions
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Filters) => void;
  clearFilters: () => void;

  // Computed
  activeTasks: Task[];
  activeProjects: Project[];
}

// ==========================================
// CREATE CONTEXT
// ==========================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// ==========================================
// APP PROVIDER COMPONENT
// ==========================================

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // Initialize storage
  useEffect(() => {
    initializeStorage();
  }, []);

  // Load initial state
  const [tasks, setTasks] = useState<Task[]>(() => getTasks());
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = getProjects();

    // If no projects exist, create default inbox
    if (savedProjects.length === 0) {
      const defaultProject: Project = {
        ...DEFAULT_PROJECT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      saveProjects([defaultProject]);
      return [defaultProject];
    }

    return savedProjects;
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    const settings = getSettings();
    return settings.activeProjectId || projects[0]?.id || null;
  });

  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const settings = getSettings();
    return settings.viewMode;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});

  // ==========================================
  // PERSIST TO LOCALSTORAGE
  // ==========================================

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    const settings = getSettings();
    saveSettings({ ...settings, activeProjectId, viewMode });
  }, [activeProjectId, viewMode]);

  // ==========================================
  // TASK ACTIONS
  // ==========================================

  const createTask = useCallback(
    (input: CreateTaskInput): Task => {
      const now = new Date();
      const newTask: Task = {
        id: uuidv4(),
        title: input.title,
        description: input.description,
        projectId: input.projectId,
        status: 'todo',
        priority: input.priority || 'medium',
        tags: input.tags || [],
        dueDate: input.dueDate,
        createdAt: now,
        updatedAt: now,
        order: tasks.length, // Add to end
        isArchived: false,
      };

      setTasks((prev) => [...prev, newTask]);
      return newTask;
    },
    [tasks.length]
  );

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const updated: Task = {
          ...task,
          ...input,
          updatedAt: new Date(),
        };

        // Set completedAt when marking as done
        if (input.status === 'done' && task.status !== 'done') {
          updated.completedAt = new Date();
        }

        // Clear completedAt when unmarking done
        if (input.status !== 'done' && task.status === 'done') {
          updated.completedAt = undefined;
        }

        return updated;
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const archiveTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, isArchived: true, updatedAt: new Date() }
          : task
      )
    );
  }, []);

  const unarchiveTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, isArchived: false, updatedAt: new Date() }
          : task
      )
    );
  }, []);

  const reorderTasks = useCallback((reorderedTasks: Task[]) => {
    // Update order property for each task
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      order: index,
      updatedAt: new Date(),
    }));
    setTasks(updatedTasks);
  }, []);

  // ==========================================
  // PROJECT ACTIONS
  // ==========================================

  const createProject = useCallback((input: CreateProjectInput): Project => {
    const now = new Date();

    // Get color from input or random from palette
    const projectColor =
      input.color ??
      PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)] ??
      '#FFD5E5';

    const newProject: Project = {
      id: uuidv4(),
      name: input.name,
      description: input.description,
      color: projectColor,
      createdAt: now,
      updatedAt: now,
      isArchived: false,
    };

    setProjects((prev) => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, input: UpdateProjectInput) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, ...input, updatedAt: new Date() }
          : project
      )
    );
  }, []);

  const deleteProject = useCallback(
    (id: string) => {
      // Don't allow deleting the default inbox
      if (id === DEFAULT_PROJECT.id) return;

      // Move all tasks from this project to inbox
      setTasks((prev) =>
        prev.map((task) =>
          task.projectId === id
            ? { ...task, projectId: DEFAULT_PROJECT.id, updatedAt: new Date() }
            : task
        )
      );

      // Delete the project
      setProjects((prev) => prev.filter((project) => project.id !== id));

      // If this was the active project, switch to inbox
      if (activeProjectId === id) {
        setActiveProjectId(DEFAULT_PROJECT.id);
      }
    },
    [activeProjectId]
  );

  const setActiveProject = useCallback((id: string | null) => {
    setActiveProjectId(id);
  }, []);

  // ==========================================
  // VIEW ACTIONS
  // ==========================================

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  // ==========================================
  // COMPUTED VALUES
  // ==========================================

  const activeTasks = tasks.filter((task) => !task.isArchived);
  const activeProjects = projects.filter((project) => !project.isArchived);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value: AppContextType = {
    // State
    tasks,
    projects,
    activeProjectId,
    viewMode,
    searchQuery,
    filters,

    // Task Actions
    createTask,
    updateTask,
    deleteTask,
    archiveTask,
    unarchiveTask,
    reorderTasks,

    // Project Actions
    createProject,
    updateProject,
    deleteProject,
    setActiveProject,

    // View Actions
    setViewMode,
    setSearchQuery,
    setFilters,
    clearFilters,

    // Computed
    activeTasks,
    activeProjects,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ==========================================
// CUSTOM HOOK
// ==========================================

/**
 * Hook to access app context
 * Must be used within AppProvider
 */
export function useApp() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }

  return context;
}
