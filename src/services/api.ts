import type {
  Task,
  Project,
  CreateTaskInput,
  UpdateTaskInput,
  CreateProjectInput,
  UpdateProjectInput,
} from '@/types';

// ==========================================
// API CONFIGURATION
// ==========================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Temporary: We'll replace this with real auth later
const TEMP_USER_ID = localStorage.getItem('temp_user_id') || '';

// ==========================================
// API ERROR HANDLING
// ==========================================

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(
      error.error || 'Request failed',
      response.status,
      error
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// ==========================================
// TASK API
// ==========================================

export const taskApi = {
  /**
   * Get all tasks for the current user
   */
  async getAll(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/api/tasks?userId=${TEMP_USER_ID}`);
    return handleResponse<Task[]>(response);
  },

  /**
   * Get a single task by ID
   */
  async getById(id: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`);
    return handleResponse<Task>(response);
  },

  /**
   * Create a new task
   */
  async create(input: CreateTaskInput): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, userId: TEMP_USER_ID }),
    });
    return handleResponse<Task>(response);
  },

  /**
   * Update an existing task
   */
  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Task>(response);
  },

  /**
   * Delete a task
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  /**
   * Reorder tasks (batch update)
   */
  async reorder(tasks: Array<{ id: string; order: number }>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/tasks/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks }),
    });
    return handleResponse<void>(response);
  },
};

// ==========================================
// PROJECT API
// ==========================================

export const projectApi = {
  /**
   * Get all projects for the current user
   */
  async getAll(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/api/projects?userId=${TEMP_USER_ID}`);
    return handleResponse<Project[]>(response);
  },

  /**
   * Get a single project by ID
   */
  async getById(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
    return handleResponse<Project>(response);
  },

  /**
   * Create a new project
   */
  async create(input: CreateProjectInput): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, userId: TEMP_USER_ID }),
    });
    return handleResponse<Project>(response);
  },

  /**
   * Update an existing project
   */
  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return handleResponse<Project>(response);
  },

  /**
   * Delete a project
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

// ==========================================
// HELPER: Initialize User
// ==========================================

/**
 * For now, we'll create a temp user or use existing one
 * Later we'll replace this with proper authentication
 */
export async function initializeTempUser(): Promise<string> {
  const existingUserId = localStorage.getItem('temp_user_id');
  if (existingUserId) return existingUserId;

  // Create a temporary user
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `temp-${Date.now()}@example.com`,
      password: 'temp_password',
      name: 'Temp User',
    }),
  });

  const user = await handleResponse<{ id: string }>(response);
  localStorage.setItem('temp_user_id', user.id);
  return user.id;
}
