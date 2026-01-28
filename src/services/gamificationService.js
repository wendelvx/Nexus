import prisma from '../lib/prisma.js';

export const calculateLevel = (xp) => {
 
  return Math.floor(xp / 1000) + 1;
};

export const addExperience = async (userId, amount) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  const newXp = user.xp + amount;
  const newLevel = calculateLevel(newXp);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXp,
      level: newLevel
    }
  });

  if (newLevel > user.level) {
    console.log(`🎊 Player ${user.name} subiu para o nível ${newLevel}!`);
  }

  return updatedUser;
};