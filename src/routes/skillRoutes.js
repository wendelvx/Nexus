import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { addExperience } from '../services/gamificationService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const skills = await prisma.skillNode.findMany({
      include: {
        parents: true,
        children: true,
        modules: true
      }
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar a Skill Tree' });
  }
});

router.post('/complete-module/:moduleId', authenticate, async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user.userId;

  try {
    await prisma.userModuleProgress.upsert({
      where: { userId_moduleId: { userId, moduleId } },
      update: { isCompleted: true, completedAt: new Date() },
      create: { userId, moduleId, isCompleted: true, completedAt: new Date() }
    });

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { skillNode: true }
    });

    const updatedPlayer = await addExperience(userId, module.skillNode.xpReward);

    res.json({
      message: "Missão concluída!",
      xpGained: module.skillNode.xpReward,
      currentLevel: updatedPlayer.level,
      currentXp: updatedPlayer.xp
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar progresso" });
  }
});

export default router;