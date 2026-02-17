import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';

const router = express.Router();

// Project routes
router.get('/', getAllProjects);        // GET /api/projects?userId=xxx
router.get('/:id', getProjectById);     // GET /api/projects/:id
router.post('/', createProject);        // POST /api/projects
router.put('/:id', updateProject);      // PUT /api/projects/:id
router.delete('/:id', deleteProject);   // DELETE /api/projects/:id

export default router;
