import { Router } from 'express';
import { getProfile } from '../controllers/profileController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/me', authenticate, getProfile);

export default router;