import { Router } from 'express';
import { submitTask, evaluateTask } from '../controllers/submissionController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/submit', authenticate, submitTask);
router.post('/evaluate', authenticate, evaluateTask);

export default router;