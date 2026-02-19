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

// ==========================================
// TOKEN MANAGEMENT
// ==========================================

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  get: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};

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
// REQUEST HELPER (Automatically adds auth token)
// ==========================================

async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStorage.get();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  return handleResponse<T>(response);
}

// ==========================================
// AUTH API
// ==========================================

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
  };
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
}

export const authApi = {
  /**
   * Register a new user
   */
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    // Save token to localStorage
    tokenStorage.set(response.token);

    return response;
  },

  /**
   * Login existing user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Save token to localStorage
    tokenStorage.set(response.token);

    return response;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<{ user: User }> {
    return apiRequest<{ user: User }>('/api/auth/me');
  },

  /**
   * Logout (clear token)
   */
  logout(): void {
    tokenStorage.remove();
  },
};

// ==========================================
// TASK API (Updated to use apiRequest)
// ==========================================

export const taskApi = {
  async getAll(): Promise<Task[]> {
    return apiRequest<Task[]>('/api/tasks');
  },

  async getById(id: string): Promise<Task> {
    return apiRequest<Task>(`/api/tasks/${id}`);
  },

  async create(input: CreateTaskInput): Promise<Task> {
    return apiRequest<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    return apiRequest<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  async reorder(tasks: Array<{ id: string; order: number }>): Promise<void> {
    return apiRequest<void>('/api/tasks/reorder', {
      method: 'PUT',
      body: JSON.stringify({ tasks }),
    });
  },
};

// ==========================================
// PROJECT API (Updated to use apiRequest)
// ==========================================

export const projectApi = {
  async getAll(): Promise<Project[]> {
    return apiRequest<Project[]>('/api/projects');
  },

  async getById(id: string): Promise<Project> {
    return apiRequest<Project>(`/api/projects/${id}`);
  },

  async create(input: CreateProjectInput): Promise<Project> {
    return apiRequest<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    return apiRequest<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },
};
