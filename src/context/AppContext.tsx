import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
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
  getSettings,
  saveSettings,
} from '@/utils/storage';
import { taskApi, projectApi } from '@/services/api';
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
  isLoading: boolean;
  error: string | null;

  // Task Actions
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  archiveTask: (id: string) => Promise<void>;
  unarchiveTask: (id: string) => Promise<void>;
  reorderTasks: (tasks: Task[]) => Promise<void>;

  // Project Actions
  createProject: (input: CreateProjectInput) => Promise<Project>;
  updateProject: (id: string, input: UpdateProjectInput) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
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
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    const settings = getSettings();
    return settings.activeProjectId || null;
  });

  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const settings = getSettings();
    return settings.viewMode;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});

  // ==========================================
  // INITIALIZE DATA FROM API
  // ==========================================

  useEffect(() => {
    async function initializeData() {
      try {
        setIsLoading(true);
        setError(null);

        // Ensure we have a temp user
    

        // Fetch projects and tasks in parallel
        const [fetchedProjects, fetchedTasks] = await Promise.all([
          projectApi.getAll(),
          taskApi.getAll(),
        ]);

        // If no projects exist, create default inbox
        if (fetchedProjects.length === 0) {
          const defaultProject: Project = {
            ...DEFAULT_PROJECT,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          const createdProject = await projectApi.create({
            name: defaultProject.name,
            description: defaultProject.description,
            color: defaultProject.color,
          });
          setProjects([createdProject]);
          setActiveProjectId(createdProject.id);
        } else {
          setProjects(fetchedProjects);
          // Only set activeProjectId if it's null
          setActiveProjectId(prev => prev || fetchedProjects[0]?.id || null);
        }

        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Failed to initialize data:', err);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    }

    initializeData();
  }, []); // Empty dependency array - only run once

  // ==========================================
  // PERSIST SETTINGS TO LOCALSTORAGE
  // ==========================================

  useEffect(() => {
    const settings = getSettings();
    saveSettings({ ...settings, activeProjectId, viewMode });
  }, [activeProjectId, viewMode]);

  // ==========================================
  // TASK ACTIONS
  // ==========================================

  const createTask = useCallback(
    async (input: CreateTaskInput): Promise<Task> => {
      try {
        // Make API call first
        const createdTask = await taskApi.create(input);

        // Update state with server response
        setTasks((prev) => [...prev, createdTask]);

        return createdTask;
      } catch (err) {
        console.error('Failed to create task:', err);
        setError('Failed to create task');
        throw err;
      }
    },
    []
  );

  const updateTask = useCallback(
    async (id: string, input: UpdateTaskInput): Promise<void> => {
      try {
        // Optimistic update
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

        // Make API call
        const updatedTask = await taskApi.update(id, input);

        // Update with server response
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      } catch (err) {
        console.error('Failed to update task:', err);
        setError('Failed to update task');
        throw err;
      }
    },
    []
  );

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    try {
      // Optimistic update
      setTasks((prev) => prev.filter((task) => task.id !== id));

      // Make API call
      await taskApi.delete(id);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task');
      throw err;
    }
  }, []);

  const archiveTask = useCallback(
    async (id: string): Promise<void> => {
      await updateTask(id, { isArchived: true });
    },
    [updateTask]
  );

  const unarchiveTask = useCallback(
    async (id: string): Promise<void> => {
      await updateTask(id, { isArchived: false });
    },
    [updateTask]
  );

  const reorderTasks = useCallback(async (reorderedTasks: Task[]): Promise<void> => {
    try {
      // Optimistic update
      const updatedTasks = reorderedTasks.map((task, index) => ({
        ...task,
        order: index,
        updatedAt: new Date(),
      }));
      setTasks(updatedTasks);

      // Make API call
      await taskApi.reorder(
        updatedTasks.map((task) => ({ id: task.id, order: task.order }))
      );
    } catch (err) {
      console.error('Failed to reorder tasks:', err);
      setError('Failed to reorder tasks');
      throw err;
    }
  }, []);

  // ==========================================
  // PROJECT ACTIONS
  // ==========================================

  const createProject = useCallback(
    async (input: CreateProjectInput): Promise<Project> => {
      try {
        const projectColor =
          input.color ??
          PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)] ??
          '#FFD5E5';

        // Make API call
        const createdProject = await projectApi.create({
          ...input,
          color: projectColor,
        });

        // Update state
        setProjects((prev) => [...prev, createdProject]);

        return createdProject;
      } catch (err) {
        console.error('Failed to create project:', err);
        setError('Failed to create project');
        throw err;
      }
    },
    []
  );

  const updateProject = useCallback(
    async (id: string, input: UpdateProjectInput): Promise<void> => {
      try {
        // Optimistic update
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id
              ? { ...project, ...input, updatedAt: new Date() }
              : project
          )
        );

        // Make API call
        const updatedProject = await projectApi.update(id, input);

        // Update with server response
        setProjects((prev) =>
          prev.map((project) =>
            project.id === id ? updatedProject : project
          )
        );
      } catch (err) {
        console.error('Failed to update project:', err);
        setError('Failed to update project');
        throw err;
      }
    },
    []
  );

  const deleteProject = useCallback(
    async (id: string): Promise<void> => {
      // Don't allow deleting the default inbox
      if (id === DEFAULT_PROJECT.id) return;

      try {
        // Move all tasks from this project to inbox (optimistic)
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
        setActiveProjectId((prev) => prev === id ? DEFAULT_PROJECT.id : prev);

        // Make API call
        await projectApi.delete(id);

        // Note: Server will cascade delete or we handle tasks separately
        // For now, we've already moved tasks to inbox optimistically
      } catch (err) {
        console.error('Failed to delete project:', err);
        setError('Failed to delete project');
        throw err;
      }
    },
    []
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
    isLoading,
    error,

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

export function useApp() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }

  return context;
}
