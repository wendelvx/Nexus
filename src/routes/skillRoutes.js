import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { xpQueue } from '../lib/queue.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { addExperience } from '../services/gamificationService.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const userId = req.user.userId;

  try {
    // 1. Busca todas as skills e o progresso do usuário logado
    const [allSkills, userProgress] = await Promise.all([
      prisma.skillNode.findMany({
        include: { parents: true, modules: true }
      }),
      prisma.userProgress.findMany({
        where: { userId, isCompleted: true },
        select: { skillNodeId: true }
      })
    ]);

    const completedIds = new Set(userProgress.map(p => p.skillNodeId));

    const skillTree = allSkills.map(skill => {
      if (skill.parents.length === 0) {
        return { ...skill, locked: false };
      }

      const allParentsCompleted = skill.parents.every(parent => 
        completedIds.has(parent.id)
      );

      return {
        ...skill,
        locked: !allParentsCompleted
      };
    });

    res.json(skillTree);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a Skill Tree' });
  }
});

router.post('/complete-module/:moduleId', authenticate, async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user.userId;

  try {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { skillNode: true }
    });

    await xpQueue.add('process-xp', {
      userId,
      amount: module.skillNode.xpReward,
      skillNodeId: module.skillNode.id
    });

    res.json({ 
      message: "Missão enviada para processamento! Verifique seu perfil em instantes." 
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao enviar missão" });
  }
});
export default router;