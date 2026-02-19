import { Request, Response } from 'express';
import prisma from '../config/database';

// Get all projects for authenticated user
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get userId from authenticated request (set by middleware)
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const projects = await prisma.project.findMany({
      where: { userId },  // Only get projects for this user
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'Invalid project ID' });
      return;
    }

    // Find project that belongs to this user
    const project = await prisma.project.findFirst({
      where: {
        id,
        userId,  // Ensure project belongs to this user
      },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Create a new project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      color = '#FFD5E5',
    } = req.body;

    // Get userId from authenticated request
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!name) {
      res.status(400).json({
        error: 'Name is required'
      });
      return;
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        color,
        userId,  // Use authenticated user's ID
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Update a project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'Invalid project ID' });
      return;
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId,  // Ensure project belongs to this user
      },
    });

    if (!existingProject) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'Invalid project ID' });
      return;
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId,  // Ensure project belongs to this user
      },
    });

    if (!existingProject) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // Cascade delete will handle tasks automatically
    await prisma.project.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
