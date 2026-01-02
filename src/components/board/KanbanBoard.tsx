import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { DraggableTaskCard } from './DraggableTaskCard';
import { TaskCard } from '@/components/tasks';

// ==========================================
// KANBAN BOARD PROPS
// ==========================================

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onTaskReorder: (tasks: Task[]) => void;
}

// ==========================================
// KANBAN BOARD COMPONENT
// ==========================================

export function KanbanBoard({
  tasks,
  onTaskClick,
  onTaskDelete,
  onTaskMove,
  onTaskReorder,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    })
  );

  // Group tasks by status
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'inProgress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  // Get the active task being dragged
  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag over (moving between columns)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if we're over a column (status)
    const validStatuses: TaskStatus[] = ['todo', 'inProgress', 'done'];
    if (validStatuses.includes(overId as TaskStatus)) {
      const newStatus = overId as TaskStatus;
      if (activeTask.status !== newStatus) {
        onTaskMove(activeId, newStatus);
      }
    }
  };

  // Handle drag end (reordering within column)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find both tasks
    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) {
      setActiveId(null);
      return;
    }

    // If dropped on another task in the same column, reorder
    if (overTask && activeTask.status === overTask.status) {
      const oldIndex = tasks.findIndex((t) => t.id === activeId);
      const newIndex = tasks.findIndex((t) => t.id === overId);

      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
      onTaskReorder(reorderedTasks);
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {/* To Do Column */}
        <KanbanColumn status="todo" tasks={todoTasks}>
          {todoTasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
              onDelete={() => onTaskDelete(task.id)}
            />
          ))}
        </KanbanColumn>

        {/* In Progress Column */}
        <KanbanColumn status="inProgress" tasks={inProgressTasks}>
          {inProgressTasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
              onDelete={() => onTaskDelete(task.id)}
            />
          ))}
        </KanbanColumn>

        {/* Done Column */}
        <KanbanColumn status="done" tasks={doneTasks}>
          {doneTasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
              onDelete={() => onTaskDelete(task.id)}
            />
          ))}
        </KanbanColumn>
      </div>

      {/* Drag Overlay - Shows the card being dragged */}
      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 cursor-grabbing">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}