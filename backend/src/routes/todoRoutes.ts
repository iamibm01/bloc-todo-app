import express from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController';

const router = express.Router();

// Define routes
router.get('/', getAllTodos);           // GET /api/todos
router.get('/:id', getTodoById);        // GET /api/todos/:id
router.post('/', createTodo);           // POST /api/todos
router.put('/:id', updateTodo);         // PUT /api/todos/:id
router.delete('/:id', deleteTodo);      // DELETE /api/todos/:id

export default router;
