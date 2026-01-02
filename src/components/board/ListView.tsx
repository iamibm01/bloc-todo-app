import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task, TaskStatus } from '@/types';
import { Tag } from '@/components/common';
import { formatDateShort, isOverdue, isToday } from '@/utils/dateHelpers';
import { PASTEL_COLORS_LIGHT, PASTEL_COLORS_DARK, STATUS_LABELS} from '@/constants';
import { useTheme } from '@/context/ThemeContext';
import {
  sortByPriority,
  sortByDueDate,
  sortByCreatedDate,
  sortByTitle,
} from '@/utils/sorting';

// ==========================================
// LIST VIEW PROPS
// ==========================================

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

type SortOption = 'priority' | 'dueDate' | 'created' | 'title';

// ==========================================
// LIST VIEW COMPONENT
// ==========================================

export function ListView({ tasks, onTaskClick, onTaskDelete, onStatusChange }: ListViewProps) {
  const { theme } = useTheme();
  const colors = theme === 'light' ? PASTEL_COLORS_LIGHT : PASTEL_COLORS_DARK;
  const [sortBy, setSortBy] = useState<SortOption>('priority');

  // Sort tasks based on selected option
  const sortedTasks = (() => {
    switch (sortBy) {
      case 'priority':
        return sortByPriority(tasks);
      case 'dueDate':
        return sortByDueDate(tasks);
      case 'created':
        return sortByCreatedDate(tasks);
      case 'title':
        return sortByTitle(tasks);
      default:
        return tasks;
    }
  })();

  return (
    <div>
      {/* Sort Controls */}
      <div className="mb-4 flex items-center gap-2 p-3 bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border">
        <span className="text-sm font-display font-semibold text-light-text-secondary dark:text-dark-text-secondary">
          Sort by:
        </span>
        <div className="flex gap-2">
          {(['priority', 'dueDate', 'created', 'title'] as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`
                px-3 py-1 text-sm font-display font-semibold border-2 transition-all
                ${
                  sortBy === option
                    ? 'border-light-text-primary dark:border-dark-text-primary bg-pastel-blue dark:bg-muted-blue'
                    : 'border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary'
                }
              `}
            >
              {option === 'dueDate' ? 'Due Date' : option === 'created' ? 'Created' : option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="p-12 bg-light-surface dark:bg-dark-surface border-2 border-dashed border-light-border dark:border-dark-border text-center">
            <p className="text-light-text-secondary dark:text-dark-text-secondary font-display">
              No tasks found
            </p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              colors={colors}
              onClick={() => onTaskClick(task.id)}
              onDelete={() => onTaskDelete(task.id)}
              onStatusChange={(status) => onStatusChange(task.id, status)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// TASK LIST ITEM COMPONENT
// ==========================================

interface TaskListItemProps {
  task: Task;
  colors: typeof PASTEL_COLORS_LIGHT | typeof PASTEL_COLORS_DARK;
  onClick: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

function TaskListItem({ task, colors, onClick, onDelete, onStatusChange }: TaskListItemProps) {
  const overdue = task.dueDate && !task.completedAt && isOverdue(task.dueDate);
  const dueToday = task.dueDate && isToday(task.dueDate);

  return (
    <motion.div
      className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary transition-all group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ x: 4 }}
    >
      <div className="p-4 flex items-center gap-4">
        {/* Priority Indicator */}
        <div
          className="w-1 h-16 flex-shrink-0"
          style={{ backgroundColor: colors[task.priority] }}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
          {/* Title */}
          <h3 className="font-display font-semibold text-light-text-primary dark:text-dark-text-primary mb-1 truncate">
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2 line-clamp-1">
              {task.description}
            </p>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag, index) => (
                <Tag key={index} color={colors.accent}>
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>

        {/* Metadata Column */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Due Date */}
          {task.dueDate && (
            <div className="text-right">
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1">
                Due Date
              </p>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    overdue
                      ? 'text-pastel-red dark:text-muted-red'
                      : dueToday
                      ? 'text-pastel-orange dark:text-muted-orange'
                      : 'text-light-text-secondary dark:text-dark-text-secondary'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span
                  className={`text-sm font-mono ${
                    overdue
                      ? 'text-pastel-red dark:text-muted-red font-semibold'
                      : dueToday
                      ? 'text-pastel-orange dark:text-muted-orange font-semibold'
                      : 'text-light-text-secondary dark:text-dark-text-secondary'
                  }`}
                >
                  {formatDateShort(task.dueDate)}
                </span>
              </div>
            </div>
          )}

          {/* Priority Badge */}
          <div className="text-center min-w-[80px]">
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1">
              Priority
            </p>
            <Tag variant="priority" priority={task.priority}>
              {task.priority.toUpperCase()}
            </Tag>
          </div>

          {/* Status Dropdown */}
          <div className="min-w-[120px]">
            <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mb-1">
              Status
            </p>
            <select
              value={task.status}
              onChange={(e) => {
                e.stopPropagation();
                onStatusChange(e.target.value as TaskStatus);
              }}
              className="w-full px-2 py-1 text-sm font-display font-semibold bg-light-surface dark:bg-dark-surface text-light-text-primary dark:text-dark-text-primary border-2 border-light-border dark:border-dark-border focus:border-light-text-primary dark:focus:border-dark-text-primary focus:outline-none cursor-pointer"
              style={{ backgroundColor: colors[task.status] }}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="todo">{STATUS_LABELS.todo}</option>
              <option value="inProgress">{STATUS_LABELS.inProgress}</option>
              <option value="done">{STATUS_LABELS.done}</option>
            </select>
          </div>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 border-2 border-transparent hover:border-pastel-red hover:dark:border-muted-red hover:bg-pastel-red hover:dark:bg-muted-red transition-all opacity-0 group-hover:opacity-100"
            aria-label="Delete task"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-light-text-primary dark:text-dark-text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}