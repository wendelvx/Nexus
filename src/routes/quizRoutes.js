import { Router } from 'express';
import { submitQuiz } from '../controllers/quizController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/submit', authenticate, submitQuiz);

export default router;