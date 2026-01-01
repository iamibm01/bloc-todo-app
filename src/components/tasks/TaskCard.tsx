import { motion } from 'framer-motion';
import { Task } from '@/types';
import { Tag } from '@/components/common';
import { formatDateShort, isOverdue, isToday } from '@/utils/dateHelpers';
import { PASTEL_COLORS_LIGHT, PASTEL_COLORS_DARK } from '@/constants';
import { useTheme } from '@/context/ThemeContext';

// ==========================================
// TASK CARD PROPS
// ==========================================

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
}

// ==========================================
// TASK CARD COMPONENT
// ==========================================

export function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
  const { theme } = useTheme();
  const colors = theme === 'light' ? PASTEL_COLORS_LIGHT : PASTEL_COLORS_DARK;

  // Determine if task is overdue
  const overdue = task.dueDate && !task.completedAt && isOverdue(task.dueDate);
  const dueToday = task.dueDate && isToday(task.dueDate);

  return (
    <motion.div
      className="bg-light-surface dark:bg-dark-surface border-2 border-light-border dark:border-dark-border p-4 cursor-pointer group"
      onClick={onClick}
      whileHover={{ y: -2, boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
    >
      {/* Header: Title + Priority */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-display font-semibold text-light-text-primary dark:text-dark-text-primary flex-1 break-words">
          {task.title}
        </h3>
        <div
          className="w-3 h-3 border border-light-text-primary dark:border-dark-text-primary flex-shrink-0 mt-1"
          style={{ backgroundColor: colors[task.priority] }}
          title={`${task.priority} priority`}
        />
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <Tag key={index} color={colors.accent}>
              {tag}
            </Tag>
          ))}
        </div>
      )}

      {/* Footer: Due Date + Status */}
      <div className="flex items-center justify-between gap-2">
        {/* Due Date */}
        {task.dueDate && (
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
              className={`text-xs font-mono ${
                overdue
                  ? 'text-pastel-red dark:text-muted-red font-semibold'
                  : dueToday
                  ? 'text-pastel-orange dark:text-muted-orange font-semibold'
                  : 'text-light-text-secondary dark:text-dark-text-secondary'
              }`}
            >
              {formatDateShort(task.dueDate)}
              {overdue && ' (Overdue)'}
              {dueToday && ' (Today)'}
            </span>
          </div>
        )}

        {/* Status Tag */}
        <Tag variant="status" status={task.status}>
          {task.status === 'todo' && 'To Do'}
          {task.status === 'inProgress' && 'In Progress'}
          {task.status === 'done' && 'Done'}
        </Tag>
      </div>

      {/* Delete Button (appears on hover) */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 p-1 bg-pastel-red dark:bg-muted-red border border-light-text-primary dark:border-dark-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-light-text-primary dark:text-dark-text-primary"
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
      )}
    </motion.div>
  );
}