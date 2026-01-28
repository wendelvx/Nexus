import prisma from '../lib/prisma.js';

export const checkExpiredSkills = async () => {
  const now = new Date();

  console.log(`[Recycling] Iniciando verificação de skills expiradas em: ${now.toISOString()}`);

  // 1. Busca progressos completados que já passaram da data de expiração
  const expiredProgress = await prisma.userProgress.findMany({
    where: {
      isCompleted: true,
      expiresAt: { lt: now } // lt = less than (menor que agora)
    },
    include: { user: true, skillNode: true }
  });

  if (expiredProgress.length === 0) return console.log("[Recycling] Nenhuma skill expirada hoje.");

  for (const progress of expiredProgress) {
    await prisma.userProgress.update({
      where: { id: progress.id },
      data: {
        isCompleted: false,
        status: 0, 
        completedAt: null
      }
    });

    console.log(`⚠️ Skill [${progress.skillNode.title}] do player ${progress.user.name} expirou e precisa de reciclagem!`);
  }
};