import prisma from '../lib/prisma.js';
import { updatePlayerRank } from './leaderboardService.js';

export const calculateLevel = (xp) => Math.floor(xp / 1000) + 1;

export const addExperience = async (userId, amount) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  
  const newXp = user.xp + amount;
  const newLevel = calculateLevel(newXp);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { xp: newXp, level: newLevel }
  });

  await updatePlayerRank(updatedUser.name, updatedUser.xp);

  return updatedUser;
};