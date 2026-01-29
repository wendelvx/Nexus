import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { xpQueue } from '../lib/queue.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const userId = req.user.userId;

  try {
    // 1. Buscamos as skills com inclusão aninhada (Nested Include)
    const allSkills = await prisma.skillNode.findMany({
      include: {
        parents: true,
        // Mergulhamos: Skill -> Módulo -> Quiz -> Questões -> Opções
        modules: {
          include: {
            quizzes: {
              include: {
                questions: {
                  include: {
                    options: true
                  }
                }
              }
            }
          }
        },
        // Já trazemos o progresso do usuário logado para esta skill
        userProgress: {
          where: { userId: userId }
        }
      }
    });

    // 2. Mapeamos os IDs das skills que o usuário já completou para checar dependências
    const completedIds = new Set(
      allSkills
        .filter(s => s.userProgress.some(p => p.isCompleted))
        .map(s => s.id)
    );

    // 3. Processamos a árvore para definir o estado de 'locked'
    const skillTree = allSkills.map(skill => {
      // Se não tem pais, está liberada. Se tem, todos os pais devem estar no set de completados.
      const isLocked = skill.parents.length > 0 && 
                       !skill.parents.every(parent => completedIds.has(parent.id));

      return {
        ...skill,
        locked: isLocked,
        // Adicionamos um facilitador para o front saber se já foi concluída
        isCompleted: skill.userProgress.some(p => p.isCompleted)
      };
    });

    res.json(skillTree);
  } catch (error) {
    console.error("Erro na Skill Tree:", error);
    res.status(500).json({ error: 'Erro ao processar a Skill Tree' });
  }
});

// Rota para completar módulo (ajustada para usar a fila de XP corretamente)
router.post('/complete-module/:moduleId', authenticate, async (req, res) => {
  const { moduleId } = req.params;
  const userId = req.user.userId;

  try {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { skillNode: true }
    });

    if (!module) return res.status(404).json({ error: "Módulo não encontrado" });

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