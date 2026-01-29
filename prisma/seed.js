import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Limpando as masmorras (Resetando Banco)...');
  const deleteOrder = [
    prisma.userBadge, prisma.userModuleProgress, prisma.userProgress,
    prisma.taskSubmission, prisma.option, prisma.question,
    prisma.quiz, prisma.module, prisma.badge, prisma.skillNode, prisma.user
  ];
  for (const table of deleteOrder) await table.deleteMany();

  const hash = await bcrypt.hash('nexus123', 10);

  console.log('👥 Criando Personas...');
  const player = await prisma.user.create({
    data: { email: 'player@nexus.com', name: 'Recruta Zero', role: 'PLAYER', password: hash, department: 'Engenharia' }
  });
  await prisma.user.create({
    data: { email: 'dm@nexus.com', name: 'Mestre Ancião', role: 'DUNGEON_MASTER', password: hash }
  });

  console.log('🌲 Construindo a Árvore de Habilidades...');

  // --- NÍVEL 1: FUNDAMENTOS ---
  const htmlNode = await prisma.skillNode.create({
    data: {
      title: 'Pergaminhos do HTML',
      description: 'A fundação de toda estrutura web.',
      category: 'Frontend',
      xpReward: 200,
      modules: {
        create: {
          title: 'Semântica e Estrutura',
          content: 'Conteúdo sobre tags semânticas...',
          contentType: 'TEXT',
          order: 1,
          quizzes: {
            create: {
              title: 'O Teste do Arquiteto',
              questions: {
                create: {
                  text: 'Qual tag é usada para o conteúdo principal da página?',
                  options: {
                    create: [
                      { text: '<main>', isCorrect: true },
                      { text: '<section>', isCorrect: false },
                      { text: '<div>', isCorrect: false }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      badges: { create: { name: 'Estruturador Especialista', icon: 'layout' } }
    }
  });

  // --- NÍVEL 2: ESTILIZAÇÃO (Depende de HTML) ---
  const cssNode = await prisma.skillNode.create({
    data: {
      title: 'Magia do CSS',
      description: 'Transforme esqueletos em interfaces vívidas.',
      category: 'Frontend',
      xpReward: 300,
      parents: { connect: { id: htmlNode.id } },
      modules: {
        create: {
          title: 'Flexbox e Grid',
          content: 'Dominando o layout responsivo.',
          contentType: 'VIDEO',
          order: 1,
          quizzes: {
            create: {
              title: 'Desafio do Estilista',
              questions: {
                create: {
                  text: 'Qual propriedade ativa o Flexbox?',
                  options: {
                    create: [
                      { text: 'display: flex', isCorrect: true },
                      { text: 'position: absolute', isCorrect: false },
                      { text: 'float: left', isCorrect: false }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      badges: { create: { name: 'Mago das Cores', icon: 'palette' } }
    }
  });

  // --- NÍVEL 3: LÓGICA (Depende de CSS) ---
  const jsNode = await prisma.skillNode.create({
    data: {
      title: 'Alquimia do JavaScript',
      description: 'Manipule o tempo e o espaço com lógica pura.',
      category: 'Frontend',
      xpReward: 500,
      parents: { connect: { id: cssNode.id } },
      modules: {
        create: {
          title: 'Manipulação de DOM',
          content: 'Interagindo com o usuário.',
          contentType: 'TEXT',
          order: 1,
          quizzes: {
            create: {
              title: 'O Enigma do Código',
              questions: {
                create: [
                  {
                    text: 'Como selecionamos um elemento pelo ID?',
                    options: {
                      create: [
                        { text: 'getElementById()', isCorrect: true },
                        { text: 'querySelector()', isCorrect: false }
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  });

  // --- NÍVEL FINAL: MISSÃO PRÁTICA ---
  await prisma.skillNode.create({
    data: {
      title: 'O Grande Lançamento',
      description: 'Envie o link do seu portfólio para avaliação do Mestre.',
      category: 'Carreira',
      xpReward: 1000,
      isPractical: true,
      parents: { connect: { id: jsNode.id } },
      badges: { create: { name: 'Lendário da Web', icon: 'award' } }
    }
  });

  console.log('✅ Mundo do Nexus RPG populado!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());