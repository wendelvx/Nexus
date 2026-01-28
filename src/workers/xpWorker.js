import { Worker } from 'bullmq';
import redis from '../lib/redis.js';
import { addExperience } from '../services/gamificationService.js';
import prisma from '../lib/prisma.js';

const worker = new Worker('xp-processing', async (job) => {
  const { userId, amount, skillNodeId } = job.data;

  console.log(`[Worker] Processando ${amount} XP para o usuário ${userId}...`);

  const updatedUser = await addExperience(userId, amount);

 
  const skillNode = await prisma.skillNode.findUnique({
    where: { id: skillNodeId },
    include: { badges: true }
  });

  if (skillNode?.badges.length > 0) {
    for (const badge of skillNode.badges) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId, badgeId: badge.id } },
        update: {},
        create: { userId, badgeId: badge.id }
      });
      console.log(`✨ Badge [${badge.name}] concedida a ${updatedUser.name}!`);
    }
  }

}, { connection: redis });

worker.on('completed', (job) => console.log(`Job ${job.id} concluído!`));
worker.on('failed', (job, err) => console.error(`Job ${job.id} falhou:`, err));

export default worker;