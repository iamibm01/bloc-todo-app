import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';  // NEW!

const router = express.Router();

// Apply authentication to ALL project routes
router.use(authenticateToken);  // NEW! Protects all routes below

// Project routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
