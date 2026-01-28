import prisma from '../lib/prisma.js';

export const getProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        earnedBadges: {
          include: { badge: true }
        },
        progress: {
          where: { isCompleted: true },
          include: { skillNode: true }
        }
      }
    });

    if (!user) return res.status(404).json({ error: "Player não encontrado" });

    const stats = {
      tecnico: 0,
      lideranca: 0,
      softskills: 0
    };

    user.progress.forEach(p => {
      const category = p.skillNode.category.toLowerCase();
      if (category.includes('téc')) stats.tecnico += 10;
      if (category.includes('lid')) stats.lideranca += 10;
      if (category.includes('soft')) stats.softskills += 10;
    });

    res.json({
      name: user.name,
      level: user.level,
      xp: user.xp,
      role: user.role,
      department: user.department,
      stats,
      badges: user.earnedBadges.map(eb => ({
        name: eb.badge.name,
        icon: eb.badge.icon,
        earnedAt: eb.earnedAt
      })),
      completedSkillsCount: user.progress.length
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao carregar ficha de personagem" });
  }
};