import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types';
import { PASTEL_COLORS_LIGHT, PASTEL_COLORS_DARK, STATUS_LABELS } from '@/constants';
import { useTheme } from '@/context/ThemeContext';

// ==========================================
// KANBAN COLUMN PROPS
// ==========================================

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  children: React.ReactNode;
}

// ==========================================
// KANBAN COLUMN COMPONENT
// ==========================================

export function KanbanColumn({ status, tasks, children }: KanbanColumnProps) {
  const { theme } = useTheme();
  const colors = theme === 'light' ? PASTEL_COLORS_LIGHT : PASTEL_COLORS_DARK;
  
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  // Get column color based on status
  const columnColor = colors[status];

  return (
    <div className="flex-1 min-w-[300px]">
      {/* Column Header */}
      <div
        className="p-4 border-2 border-light-text-primary dark:border-dark-text-primary mb-4 sticky"
        style={{ backgroundColor: columnColor }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-light-text-primary dark:text-dark-text-primary">
            {STATUS_LABELS[status]}
          </h2>
          <span className="px-2 py-1 bg-light-surface dark:bg-dark-surface border border-light-text-primary dark:border-dark-text-primary font-mono text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Column Content - Droppable Area */}
      <motion.div
        ref={setNodeRef}
        className={`
          min-h-[500px] p-4 border-2 border-dashed transition-colors
          ${
            isOver
              ? 'border-light-text-primary dark:border-dark-text-primary bg-light-surface dark:bg-dark-surface'
              : 'border-light-border dark:border-dark-border'
          }
        `}
        animate={{
          backgroundColor: isOver
            ? theme === 'light'
              ? '#FFFFFF'
              : '#1A1A1A'
            : 'transparent',
        }}
        transition={{ duration: 0.2 }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {children}
            {tasks.length === 0 && (
              <div className="text-center py-12 text-light-text-secondary dark:text-dark-text-secondary">
                <p className="font-display">Drop tasks here</p>
              </div>
            )}
          </div>
        </SortableContext>
      </motion.div>
    </div>
  );
}