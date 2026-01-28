import prisma from '../lib/prisma.js';
import { xpQueue } from '../lib/queue.js';

export const submitTask = async (req, res) => {
  const { skillNodeId, evidenceUrl } = req.body;
  const userId = req.user.userId;

  try {
    const submission = await prisma.taskSubmission.create({
      data: {
        userId,
        skillNodeId,
        evidenceUrl,
        status: 'PENDING'
      }
    });

    res.status(201).json({ message: "Missão enviada para análise do Dungeon Master!", submissionId: submission.id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao enviar submissão" });
  }
};

export const evaluateTask = async (req, res) => {
  const { submissionId, status, feedback } = req.body; // status: 'APPROVED' ou 'REJECTED'
  const managerId = req.user.userId;

  if (req.user.role !== 'DUNGEON_MASTER' && req.user.role !== 'GAME_MASTER') {
    return res.status(403).json({ error: "Apenas Mestres podem avaliar missões." });
  }

  try {
    const submission = await prisma.taskSubmission.update({
      where: { id: submissionId },
      data: { 
        status, 
        feedback,
        reviewedById: managerId
      },
      include: { skillNode: true }
    });

    // 🔥 Se aprovado, mandamos o XP para a fila!
    if (status === 'APPROVED') {
      await xpQueue.add('process-xp', {
        userId: submission.userId,
        amount: submission.skillNode.xpReward,
        skillNodeId: submission.skillNodeId
      });
    }

    res.json({ message: `Missão ${status === 'APPROVED' ? 'aprovada' : 'rejeitada'} com sucesso!` });
  } catch (error) {
    res.status(500).json({ error: "Erro ao avaliar missão" });
  }
};