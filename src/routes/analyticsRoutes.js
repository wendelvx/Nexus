import { Router } from 'express';
import { getGlobalStats, getDepartmentStats, getSkillGapAnalysis } from '../controllers/analyticsController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(authenticate, authorize(['DUNGEON_MASTER', 'GAME_MASTER']));

router.get('/global', getGlobalStats);
router.get('/departments', getDepartmentStats);
router.get('/skill-gap', getSkillGapAnalysis);

export default router;