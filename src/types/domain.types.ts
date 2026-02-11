// ==========================================
// DOMAIN INTERFACE
// ==========================================

/**
 * Domain represents a life area for categorizing tasks.
 *
 * Design Decision: Domains are GLOBAL across all projects.
 * This allows filtering by domain independently of project selection.
 * Example: "Health" domain can contain tasks from multiple projects.
 */
export interface Domain {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Display name (e.g., "Work", "Personal")
  color: string;                 // Hex color code (pastel)
  createdAt: Date;               // When domain was created
  updatedAt: Date;               // Last modification time
}

// Input type for creating a new domain
export interface CreateDomainInput {
  name: string;
  color?: string;                // Defaults to next available pastel if not provided
}

// Input type for updating an existing domain
export interface UpdateDomainInput {
  name?: string;
  color?: string;
}
