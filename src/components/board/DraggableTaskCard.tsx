import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { TaskCard } from '@/components/tasks';

// ==========================================
// DRAGGABLE TASK CARD PROPS
// ==========================================

interface DraggableTaskCardProps {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
}

// ==========================================
// DRAGGABLE TASK CARD COMPONENT
// ==========================================

export function DraggableTaskCard({ task, onClick, onDelete }: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      {/* Drag Handle Indicator */}
      <div className="absolute left-2 top-2 opacity-50 hover:opacity-100 transition-opacity">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-light-text-secondary dark:text-dark-text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      <TaskCard task={task} onClick={onClick} onDelete={onDelete} />
    </div>
  );
}