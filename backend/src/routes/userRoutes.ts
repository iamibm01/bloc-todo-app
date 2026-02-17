import express from 'express';
import { createUser, getUserById } from '../controllers/userController';

const router = express.Router();

// User routes
router.post('/', createUser);           // POST /api/users
router.get('/:id', getUserById);        // GET /api/users/:id

export default router;
