import prisma from '../lib/prisma.js';

export const getGlobalStats = async (req, res) => {
  try {
    const [totalUsers, totalBadges, completedNodes] = await Promise.all([
      prisma.user.count(),
      prisma.userBadge.count(),
      prisma.userProgress.count({ where: { isCompleted: true } })
    ]);

    const avgCompletion = totalUsers > 0 ? (completedNodes / totalUsers).toFixed(2) : 0;

    res.json({
      totalUsers,
      totalBadges,
      avgCompletionPerUser: parseFloat(avgCompletion),
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar analytics globais" });
  }
};

export const getDepartmentStats = async (req, res) => {
  try {
    const stats = await prisma.user.groupBy({
      by: ['department'],
      _sum: { xp: true },
      _avg: { level: true },
      _count: { id: true }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar analytics por departamento" });
  }
};

export const getSkillGapAnalysis = async (req, res) => {
  try {
    const skills = await prisma.skillNode.findMany({
      include: {
        _count: {
          select: { userProgress: { where: { isCompleted: true } } }
        }
      },
      orderBy: {
        userProgress: { _count: 'asc' }
      },
      take: 5
    });

    res.json(skills.map(s => ({
      skill: s.title,
      completions: s._count.userProgress
    })));
  } catch (error) {
    res.status(500).json({ error: "Erro na análise de Skill Gap" });
  }
};