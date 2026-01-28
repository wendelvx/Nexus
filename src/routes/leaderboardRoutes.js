import { Router } from 'express';
import { getTopPlayers } from '../services/leaderboardService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const topPlayers = await getTopPlayers(10);
    res.json(topPlayers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar o Hall da Fama" });
  }
});

export default router;