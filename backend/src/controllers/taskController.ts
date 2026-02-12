import { Request, Response } from 'express';
import prisma from '../config/database';

// Get all tasks for a user
export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId || Array.isArray(userId)) {
      res.status(400).json({ error: 'Valid userId is required' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get a single task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      projectId,
      userId,
      status = 'brainstorm',
      priority = 'medium',
      tags = [],
      dueDate,
      order = 0,
    } = req.body;

    // Validation
    if (!title || !userId || !projectId) {
      res.status(400).json({
        error: 'Title, userId, and projectId are required'
      });
      return;
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        userId,
        status,
        priority,
        tags,
        dueDate: dueDate ? new Date(dueDate) : null,
        order,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Handle dueDate conversion
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    // Handle completedAt when status changes to done
    if (updateData.status === 'done' && existingTask.status !== 'done') {
      updateData.completedAt = new Date();
    } else if (updateData.status && updateData.status !== 'done') {
      updateData.completedAt = null;
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'Invalid task ID' });
      return;
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Reorder tasks (batch update)
export const reorderTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      res.status(400).json({ error: 'Tasks must be an array' });
      return;
    }

    // Update each task's order in a transaction
    await prisma.$transaction(
      tasks.map(({ id, order }) =>
        prisma.task.update({
          where: { id },
          data: { order },
        })
      )
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error reordering tasks:', error);
    res.status(500).json({ error: 'Failed to reorder tasks' });
  }
};
