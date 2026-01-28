import { Router } from 'express';
import prisma from '../lib/prisma.js';
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

    // 2. Cria um Set com os IDs das skills que o player já completou
    const completedIds = new Set(userProgress.map(p => p.skillNodeId));

    // 3. Mapeia as skills adicionando o status de "bloqueio"
    const skillTree = allSkills.map(skill => {
      // Se não tem pais, está desbloqueado por padrão
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