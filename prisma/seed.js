import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando Seed---');

  const gm = await prisma.user.upsert({
    where: { email: 'mestre@nexus.com' },
    update: {},
    create: {
      email: 'mestre@nexus.com',
      name: 'Grande Mestre das Guildas',
      role: 'GAME_MASTER',
    },
  });

  const nodeHtml = await prisma.skillNode.create({
    data: {
      title: 'Peraminhos do HTML',
      description: 'A base de toda a arquitetura web.',
      xpReward: 100,
      modules: {
        create: [
          { title: 'Estrutura Semântica', content: 'https://video.link/html1', order: 1 },
        ]
      }
    }
  });

  const nodeJs = await prisma.skillNode.create({
    data: {
      title: 'Alquimia do JavaScript',
      description: 'Transforme páginas estáticas em ouro interativo.',
      xpReward: 250,
      parents: { connect: { id: nodeHtml.id } }, // Dependência
      modules: {
        create: [
          { title: 'Variáveis e Constantes', content: 'https://video.link/js1', order: 1 },
        ]
      }
    }
  });

  console.log('Nexus populado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });