import { useState, useMemo, useRef } from 'react';
import { MainLayout } from './components/layout';
import { KanbanBoard, ListView } from './components/board';
import { TaskModal, TaskForm } from './components/tasks';
import { Button, ActiveFilters, KeyboardShortcutsModal } from './components/common';
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
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'inProgress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'done');

  // Keyboard shortcuts
  useKeyboardShortcuts(
    [
      {
        key: 'n',
        callback: () => setIsModalOpen(true),
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
          }
        },
        description: 'Close modal / Clear search',
      },
      {
        key: 'k',
        callback: () => setViewMode('kanban'),
        description: 'Switch to Kanban view',
      },
      {
        key: 'l',
        callback: () => setViewMode('list'),
        description: 'Switch to List view',
      },
      {
        key: '?',
        callback: () => setShowShortcuts(true),
        description: 'Show keyboard shortcuts',
      },
      {
        key: '1',
        callback: () => setFilters({ ...filters, priority: 'high' }),
        description: 'Filter by High priority',
      },
      {
        key: '2',
        callback: () => setFilters({ ...filters, priority: 'medium' }),
        description: 'Filter by Medium priority',
      },
      {
        key: '3',
        callback: () => setFilters({ ...filters, priority: 'low' }),
        description: 'Filter by Low priority',
      },
      {
        key: '0',
        callback: () => setFilters({ ...filters, priority: undefined }),
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

  return (
    <MainLayout searchInputRef={searchInputRef}>
      <div className="max-w-7xl mx-auto">
        {/* Project Header */}
        {activeProject && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-8 h-8 border-2 border-light-text-primary dark:border-dark-text-primary"
                  style={{ backgroundColor: activeProject.color }}
                />
                <div>
                  <h1 className="text-4xl font-display font-bold text-light-text-primary dark:text-dark-text-primary">
                    {activeProject.name}
                  </h1>
                  {activeProject.description && (
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                      {activeProject.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Create Task Button */}
                <Button onClick={() => setIsModalOpen(true)} variant="primary" size="lg">
                  + New Task
                </Button>

                {/* Keyboard Shortcuts Button */}
                <Button
                  onClick={() => setShowShortcuts(true)}
                  variant="ghost"
                  size="lg"
                  title="Keyboard shortcuts (Press ?)"
                >
                  ⌨️
                </Button>
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

        {/* Task Stats */}
        <div className="mb-6 p-4 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                {searchQuery || filters.priority || filters.tags?.length || filters.dateRange
                  ? 'Filtered Tasks'
                  : 'Total Tasks'}
              </p>
              <p className="text-3xl font-display font-bold text-light-text-primary dark:text-dark-text-primary">
                {filteredTasks.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                To Do
              </p>
              <p className="text-2xl font-display font-bold text-pastel-blue dark:text-muted-blue">
                {todoTasks.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                In Progress
              </p>
              <p className="text-2xl font-display font-bold text-pastel-orange dark:text-muted-orange">
                {inProgressTasks.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
                Done
              </p>
              <p className="text-2xl font-display font-bold text-pastel-purple dark:text-muted-purple">
                {doneTasks.length}
              </p>
            </div>
          </div>
        </div>

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
      </div>
    </MainLayout>
  );
}

export default App;