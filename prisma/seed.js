import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando banco de dados...');
  await prisma.userBadge.deleteMany();
  await prisma.userModuleProgress.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.taskSubmission.deleteMany();
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.module.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.skillNode.deleteMany();
  await prisma.user.deleteMany();

  console.log('🔐 Criando usuários (Personas)...');
  const passwordHash = await bcrypt.hash('nexus123', 10);

  // Criando o Game Master (Admin)
  await prisma.user.create({
    data: {
      email: 'gm@nexus.com',
      name: 'Mestre Supremo',
      role: 'GAME_MASTER',
      password: passwordHash,
      department: 'Board'
    }
  });

  // Criando um Dungeon Master (Gestor/Instrutor)
  const dm = await prisma.user.create({
    data: {
      email: 'dm@nexus.com',
      name: 'Instrutor Kaio',
      role: 'DUNGEON_MASTER',
      password: passwordHash,
      department: 'Tecnologia'
    }
  });

  // Criando um Player de teste
  await prisma.user.create({
    data: {
      email: 'player@nexus.com',
      name: 'Recruta Dev',
      role: 'PLAYER',
      password: passwordHash,
      department: 'Desenvolvimento'
    }
  });

  console.log('🌲 Plantando a Skill Tree...');

  // 1. Nível Base (HTML)
  const nodeHtml = await prisma.skillNode.create({
    data: {
      title: 'Pergaminhos do HTML',
      description: 'Domine a estrutura fundamental da web.',
      category: 'Frontend',
      xpReward: 150,
      modules: {
        create: [
          {
            title: 'Introdução à Semântica',
            content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            contentType: 'VIDEO',
            order: 1
          }
        ]
      },
      badges: {
        create: { name: 'Estruturador de Mundos', icon: 'layout' }
      }
    }
  });

  // 2. Nível Dependente (JavaScript - Quiz)
  const nodeJs = await prisma.skillNode.create({
    data: {
      title: 'Alquimia do JS',
      description: 'Dê vida aos seus elementos com lógica.',
      category: 'Frontend',
      xpReward: 300,
      minScoreRequired: 0.8,
      parents: { connect: { id: nodeHtml.id } },
      modules: {
        create: [
          {
            title: 'Lógica de Programação',
            content: 'Variáveis, Loops e Funções no JS.',
            contentType: 'TEXT',
            order: 1,
            quizzes: {
              create: {
                title: 'O Desafio do Oráculo',
                questions: {
                  create: {
                    text: 'Qual método é usado para adicionar um item ao final de um array?',
                    options: {
                      create: [
                        { text: 'push()', isCorrect: true },
                        { text: 'pop()', isCorrect: false },
                        { text: 'shift()', isCorrect: false }
                      ]
                    }
                  }
                }
              }
            }
          }
        ]
      },
      badges: {
        create: { name: 'Mago das Variáveis', icon: 'zap' }
      }
    }
  });

  // 3. Missão Prática (Side Quest) - Exige aprovação do DM
  await prisma.skillNode.create({
    data: {
      title: 'O Grande Deploy',
      description: 'Suba um projeto real para o servidor e envie o link.',
      category: 'DevOps',
      xpReward: 500,
      isPractical: true,
      validityMonths: 6, // Expira em 6 meses (testar reciclagem)
      parents: { connect: { id: nodeJs.id } },
      badges: {
        create: { name: 'Lendário do Deploy', icon: 'ship' }
      }
    }
  });

  console.log(`
🚀 Seed concluído com sucesso!
---
Contas de Acesso (Senha: nexus123):
- Admin: gm@nexus.com
- Gestor: dm@nexus.com
- Player: player@nexus.com
---
A árvore possui 3 níveis (HTML -> JS -> Deploy Prático).
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });