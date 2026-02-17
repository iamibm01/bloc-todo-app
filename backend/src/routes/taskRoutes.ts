import express from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from '../controllers/taskController';

const router = express.Router();

// IMPORTANT: Specific routes MUST come before parameterized routes!
router.put('/reorder', reorderTasks);   // ✅ Must be BEFORE /:id

// General CRUD routes
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
