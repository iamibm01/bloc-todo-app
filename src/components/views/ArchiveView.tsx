import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '@/types';
import { Tag, Button, Select } from '@/components/common';
import { SelectOption } from '@/components/common';
import { formatDateShort, formatRelativeTime } from '@/utils/dateHelpers';
import { PASTEL_COLORS_LIGHT, PASTEL_COLORS_DARK, PRIORITY_LABELS } from '@/constants';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';

// ==========================================
// ARCHIVE VIEW COMPONENT
// ==========================================

export function ArchiveView() {
  const { theme } = useTheme();
  const { tasks, projects, unarchiveTask, deleteTask } = useApp();
  const colors = theme === 'light' ? PASTEL_COLORS_LIGHT : PASTEL_COLORS_DARK;

  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'archived' | 'completed'>('archived');

  // Get archived tasks
  const archivedTasks = tasks.filter((t) => t.isArchived);

  // Filter by selected project
  const filteredTasks =
    selectedProject === 'all'
      ? archivedTasks
      : archivedTasks.filter((t) => t.projectId === selectedProject);

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'archived') {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    } else {
      const aTime = a.completedAt?.getTime() || 0;
      const bTime = b.completedAt?.getTime() || 0;
      return bTime - aTime;
    }
  });

  // Project options for filter
  const projectOptions: SelectOption[] = [
    { value: 'all', label: 'All Projects' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  // Handle restore
  const handleRestore = (taskId: string) => {
    unarchiveTask(taskId);
  };

  // Handle permanent delete
  const handlePermanentDelete = (taskId: string) => {
    if (
      confirm(
        'Are you sure you want to permanently delete this task? This cannot be undone!'
      )
    ) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">📦</span>
          <div>
            <h1 className="text-4xl font-display font-bold text-light-text-primary dark:text-dark-text-primary">
              Archive
            </h1>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Review and restore archived tasks
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Project Filter */}
            <div className="w-64">
              <Select
                options={projectOptions}
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
              />
            </div>

            {/* Sort Toggle */}
            <div className="flex border-2 border-light-text-primary dark:border-dark-text-primary">
              <button
                onClick={() => setSortBy('archived')}
                className={`
                  px-3 py-2 font-display font-semibold text-sm transition-colors
                  ${
                    sortBy === 'archived'
                      ? 'bg-pastel-blue dark:bg-muted-blue text-light-text-primary dark:text-dark-text-primary'
                      : 'bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary'
                  }
                `}
              >
                Recently Archived
              </button>
              <button
                onClick={() => setSortBy('completed')}
                className={`
                  px-3 py-2 font-display font-semibold text-sm transition-colors border-l-2 border-light-text-primary dark:border-dark-text-primary
                  ${
                    sortBy === 'completed'
                      ? 'bg-pastel-blue dark:bg-muted-blue text-light-text-primary dark:text-dark-text-primary'
                      : 'bg-light-surface dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary'
                  }
                `}
              >
                Recently Completed
              </button>
            </div>
          </div>

          {/* Task Count */}
          <div className="text-right">
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Archived Tasks
            </p>
            <p className="text-2xl font-display font-bold text-light-text-primary dark:text-dark-text-primary">
              {sortedTasks.length}
            </p>
          </div>
        </div>
      </div>

      {/* Archived Tasks List */}
      {sortedTasks.length === 0 ? (
        <div className="p-12 bg-light-surface dark:bg-dark-surface border-2 border-dashed border-light-border dark:border-dark-border text-center">
          <span className="text-6xl mb-4 block">🗃️</span>
          <p className="text-light-text-secondary dark:text-dark-text-secondary font-display text-xl mb-2">
            No archived tasks
          </p>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            {selectedProject === 'all'
              ? 'Archived tasks will appear here'
              : 'No archived tasks in this project'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => (
            <ArchivedTaskCard
              key={task.id}
              task={task}
              colors={colors}
              onRestore={() => handleRestore(task.id)}
              onDelete={() => handlePermanentDelete(task.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// ARCHIVED TASK CARD COMPONENT
// ==========================================

interface ArchivedTaskCardProps {
  task: Task;
  colors: typeof PASTEL_COLORS_LIGHT | typeof PASTEL_COLORS_DARK;
  onRestore: () => void;
  onDelete: () => void;
}

function ArchivedTaskCard({ task, colors, onRestore, onDelete }: ArchivedTaskCardProps) {
  const { projects } = useApp();
  const project = projects.find((p) => p.id === task.projectId);

  return (
    <motion.div
      className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border opacity-75 hover:opacity-100 transition-opacity"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 0.75, y: 0 }}
      whileHover={{ opacity: 1 }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            {/* Project Badge */}
            {project && (
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 border border-light-text-primary dark:border-dark-text-primary"
                  style={{ backgroundColor: project.color }}
                />
                <span className="text-xs font-mono text-light-text-secondary dark:text-dark-text-secondary">
                  {project.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="font-display font-semibold text-light-text-primary dark:text-dark-text-primary mb-1">
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                {task.description}
              </p>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {task.tags.map((tag, index) => (
                  <Tag key={index} color={colors.accent}>
                    {tag}
                  </Tag>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">
              {/* Priority */}
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 border border-light-text-primary dark:border-dark-text-primary"
                  style={{ backgroundColor: colors[task.priority] }}
                />
                <span>{PRIORITY_LABELS[task.priority]}</span>
              </div>

              {/* Completed Date */}
              {task.completedAt && (
                <div>
                  ✓ Completed {formatRelativeTime(task.completedAt)}
                </div>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <div>
                  📅 Due: {formatDateShort(task.dueDate)}
                </div>
              )}

              {/* Archived Date */}
              <div>
                📦 Archived {formatRelativeTime(task.updatedAt)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Button onClick={onRestore} variant="secondary" size="sm">
              ↩️ Restore
            </Button>
            <Button onClick={onDelete} variant="danger" size="sm">
              🗑️ Delete Forever
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}