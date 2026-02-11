import { Request, Response } from 'express';
import prisma from '../config/database';

// Get all todos
export const getAllTodos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc', // Newest first
      },
    });

    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// Get a single todo by ID
export const getTodoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate that id is a string (not array or undefined)
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'Invalid todo ID' });
      return;
    }

    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

// Create a new todo
export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, userId } = req.body;

    // Validation
    if (!title || !userId) {
      res.status(400).json({
        error: 'Title and userId are required'
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

    const todo = await prisma.todo.create({
      data: {
        title,
        userId,
      },
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// Update a todo
export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Validate that id is a string
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'Invalid todo ID' });
      return;
    }

    // Check if todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
      },
    });

    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

// Delete a todo
export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate that id is a string
    if (!id || Array.isArray(id)) {
      res.status(400).json({ error: 'Invalid todo ID' });
      return;
    }

    // Check if todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    await prisma.todo.delete({
      where: { id },
    });

    res.status(204).send(); // 204 = No Content (successful deletion)
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
