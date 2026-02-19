import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';  // NEW!

const router = express.Router();

// Apply authentication to ALL task routes
router.use(authenticateToken);  // NEW! Protects all routes below

// IMPORTANT: Specific routes MUST come before parameterized routes!
router.put('/reorder', reorderTasks);

// General CRUD routes
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
