import { useState, useMemo, useRef, useEffect } from 'react';
import { MainLayout } from './components/layout';
import { KanbanBoard, ListView } from './components/board';
import { ArchiveView } from './components/views';
import { TaskModal, TaskForm } from './components/tasks';
import { ActiveFilters, KeyboardShortcutsModal, DataLoader } from './components/common';
import { useApp } from './context/AppContext';
import { CreateTaskInput, UpdateTaskInput, TaskStatus } from './types';
import { applyFilters, filterBySearch } from './utils/filtering';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  const {
    projects,
    tasks,
    activeProjectId,
    viewMode,
    searchQuery,
    filters,
    setViewMode,
    setSearchQuery,
    setFilters,
    setActiveProject,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Listen for archive navigation events from sidebar
  useEffect(() => {
    const handleArchiveNav = () => setShowArchive(true);
    const handleProjectNav = () => setShowArchive(false);

    window.addEventListener('navigate-archive', handleArchiveNav);
    window.addEventListener('navigate-project', handleProjectNav);

    return () => {
      window.removeEventListener('navigate-archive', handleArchiveNav);
      window.removeEventListener('navigate-project', handleProjectNav);
    };
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let result = tasks.filter((t) => t.projectId === activeProjectId && !t.isArchived);

    if (searchQuery) {
      result = filterBySearch(result, searchQuery);
    }

    result = applyFilters(result, filters);

    return result;
  }, [tasks, activeProjectId, searchQuery, filters]);

  const brainstormTasks = filteredTasks.filter((t) => t.status === 'brainstorm');
  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'inProgress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  // Keyboard shortcuts
  useKeyboardShortcuts(
    [
      {
        key: 'n',
        callback: () => !showArchive && setIsModalOpen(true),
        description: 'Create new task',
      },
      {
        key: '/',
        callback: () => searchInputRef.current?.focus(),
        description: 'Focus search',
      },
      {
        key: 'Escape',
        callback: () => {
          if (isModalOpen || editingTask) {
            setIsModalOpen(false);
            setEditingTask(null);
          } else if (searchQuery) {
            setSearchQuery('');
          } else if (showShortcuts) {
            setShowShortcuts(false);
          } else if (showArchive) {
            setShowArchive(false);
            if (projects[0]) setActiveProject(projects[0].id);
          }
        },
        description: 'Close modal / Clear search',
      },
      {
        key: 'k',
        callback: () => !showArchive && setViewMode('kanban'),
        description: 'Switch to Kanban view',
      },
      {
        key: 'l',
        callback: () => !showArchive && setViewMode('list'),
        description: 'Switch to List view',
      },
      {
        key: 'a',
        callback: () => {
          setShowArchive(!showArchive);
          if (!showArchive) setActiveProject(null);
        },
        description: 'Toggle archive view',
      },
      {
        key: '`',
        callback: () => setShowShortcuts(true),
        description: 'Show keyboard shortcuts',
      },
      {
        key: '1',
        callback: () => !showArchive && setFilters({ ...filters, priority: 'high' }),
        description: 'Filter by High priority',
      },
      {
        key: '2',
        callback: () => !showArchive && setFilters({ ...filters, priority: 'medium' }),
        description: 'Filter by Medium priority',
      },
      {
        key: '3',
        callback: () => !showArchive && setFilters({ ...filters, priority: 'low' }),
        description: 'Filter by Low priority',
      },
      {
        key: '0',
        callback: () => !showArchive && setFilters({ ...filters, priority: undefined }),
        description: 'Clear priority filter',
      },
    ],
    !isModalOpen && !editingTask && !showShortcuts
  );

  const handleCreateTask = (data: CreateTaskInput | UpdateTaskInput) => {
    if (activeProjectId) {
      createTask(data as CreateTaskInput);
      setIsModalOpen(false);
    }
  };

  const handleUpdateTask = (data: CreateTaskInput | UpdateTaskInput) => {
    if (editingTask) {
      updateTask(editingTask, data as UpdateTaskInput);
      setEditingTask(null);
    }
  };

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleRemovePriority = () => {
    setFilters({ ...filters, priority: undefined });
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = filters.tags?.filter((t) => t !== tag);
    setFilters({ ...filters, tags: newTags?.length ? newTags : undefined });
  };

  const handleRemoveDateRange = () => {
    setFilters({ ...filters, dateRange: undefined });
  };

  const taskToEdit = editingTask ? tasks.find((t) => t.id === editingTask) : undefined;

  // Render archive view
  if (showArchive) {
    return (
      <MainLayout 
        searchInputRef={searchInputRef}
        onShowShortcuts={() => setShowShortcuts(true)}
      >
        <ArchiveView />
        <KeyboardShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />
        <DataLoader />
      </MainLayout>
    );
  }

  // Render normal project view
  return (
    <MainLayout 
      searchInputRef={searchInputRef}
      onShowShortcuts={() => setShowShortcuts(true)}
    >
      <div className="max-w-[1800px] mx-auto pt-2">
        {/* Project Header with Stats and New Task Button */}
        {activeProject && (
          <div className="mb-6">
            <div className="flex items-start gap-6">
              {/* Left: Project Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className="w-10 h-10 border-2 border-light-text-primary dark:border-dark-text-primary flex-shrink-0"
                  style={{ backgroundColor: activeProject.color }}
                />
                <div className="min-w-0">
                  <h1 className="text-3xl font-display font-bold text-light-text-primary dark:text-dark-text-primary truncate">
                    {activeProject.name}
                  </h1>
                  {activeProject.description && (
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                      {activeProject.description}
                    </p>
                  )}
                </div>
              </div>

              
            
              {/* Right: New Task Button - Same height as stats */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="h-full px-6 py-3 bg-pastel-pink dark:bg-muted-pink border-2 border-light-text-primary dark:border-dark-text-primary hover:scale-105 transition-transform font-display font-bold text-light-text-primary dark:text-dark-text-primary whitespace-nowrap"
                >
                  + New Task
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        <ActiveFilters
          filters={filters}
          onRemovePriority={handleRemovePriority}
          onRemoveTag={handleRemoveTag}
          onRemoveDateRange={handleRemoveDateRange}
        />

        {/* Kanban Board or List View */}
        {viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={filteredTasks}
            onTaskClick={setEditingTask}
            onTaskDelete={handleDeleteTask}
            onTaskMove={handleTaskMove}
            onTaskReorder={reorderTasks}
          />
        ) : (
          <ListView
            tasks={filteredTasks}
            onTaskClick={setEditingTask}
            onTaskDelete={handleDeleteTask}
            onStatusChange={handleTaskMove}
          />
        )}

        {/* Create Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Task"
        >
          <TaskForm
            projectId={activeProjectId || ''}
            onSubmit={handleCreateTask}
            onCancel={() => setIsModalOpen(false)}
          />
        </TaskModal>

        {/* Edit Task Modal */}
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          title="Edit Task"
        >
          {taskToEdit && (
            <TaskForm
              task={taskToEdit}
              projectId={taskToEdit.projectId}
              onSubmit={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
              isEditing
            />
          )}
        </TaskModal>

        {/* Keyboard Shortcuts Modal */}
        <KeyboardShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />

        {/* Data Loader */}
        <DataLoader />
      </div>
    </MainLayout>
  );
}

export default App;