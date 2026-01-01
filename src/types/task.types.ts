// Task Status: Where the task is in the workflow
export type TaskStatus = 'todo' | 'inProgress' | 'done';

// Task Priority: How urgent/important
export type TaskPriority = 'high' | 'medium' | 'low';

// Main Task Interface
export interface Task {
  id: string;                    // Unique identifier (UUID)
  title: string;                 // Task name
  description?: string;          // Optional detailed description
  projectId: string;             // Which project this belongs to
  status: TaskStatus;            // Current status (todo/inProgress/done)
  priority: TaskPriority;        // Priority level
  tags: string[];                // Array of tag names
  dueDate?: Date;                // Optional deadline
  createdAt: Date;               // When task was created
  updatedAt: Date;               // Last modification time
  completedAt?: Date;            // When marked as done
  order: number;                 // For manual sorting within column
  isArchived: boolean;           // Soft delete flag
}

// Input type for creating a new task
export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId: string;
  priority?: TaskPriority;       // Defaults to 'medium' if not provided
  tags?: string[];
  dueDate?: Date;
}

// Input type for updating an existing task
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  tags?: string[];
  dueDate?: Date;
}