import { Router } from 'express';
import { getProfile } from '../controllers/profileController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/me', authenticate, getProfile);

router.get('/leaderboard', authenticate, async (req, res) => {
  try {
    const topPlayers = await prisma.user.findMany({
      where: { role: 'PLAYER' },
      orderBy: { xp: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        xp: true,
        department: true,
        badges: { select: { id: true } }
      }
    });
    res.json(topPlayers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar ranking" });
  }
});

export default router;