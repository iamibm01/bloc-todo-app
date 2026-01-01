// Main Project Interface
export interface Project {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Project name
  description?: string;          // Optional project description
  color: string;                 // Hex color code (pastel)
  createdAt: Date;               // When project was created
  updatedAt: Date;               // Last modification time
  isArchived: boolean;           // Soft delete flag
}

// Input type for creating a new project
export interface CreateProjectInput {
  name: string;
  description?: string;
  color?: string;                // Defaults to random pastel if not provided
}

// Input type for updating an existing project
export interface UpdateProjectInput {
  name?: string;
  description?: string;
  color?: string;
}