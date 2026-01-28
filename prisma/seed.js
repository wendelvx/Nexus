import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando Seed');

  

  const gm = await prisma.user.upsert({
    where: { email: 'mestre@nexus.com' },
    update: {},
    create: {
      email: 'mestre@nexus.com',
      name: 'Grande Mestre das Guildas',
      role: 'GAME_MASTER',
      password:'123456'
    },
  });

  const nodeHtml = await prisma.skillNode.create({
    data: {
      title: 'Pergaminhos do HTML',
      description: 'A base de toda a arquitetura web.',
      xpReward: 100,
      modules: {
        create: [
          { 
            title: 'Estrutura Semântica', 
            content: 'https://video.link/html1', 
            order: 1,
            contentType: 'VIDEO'
          },
        ]
      },
      badges: {
        create: [
          { name: 'Arquiteto de Estruturas', icon: 'castle-icon' }
        ]
      }
    }
  });

  const nodeJs = await prisma.skillNode.create({
    data: {
      title: 'Alquimia do JavaScript',
      description: 'Transforme páginas estáticas em ouro interativo.',
      xpReward: 250,
      parents: { connect: { id: nodeHtml.id } },
      modules: {
        create: [
          { 
            title: 'Variáveis e Constantes', 
            content: 'https://video.link/js1', 
            order: 1,
            quizzes: {
              create: [
                {
                  title: 'Desafio do Alquimista',
                  questions: {
                    create: [
                      {
                        text: 'Qual palavra-chave cria uma variável imutável?',
                        options: {
                          create: [
                            { text: 'let', isCorrect: false },
                            { text: 'var', isCorrect: false },
                            { text: 'const', isCorrect: true },
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
        ]
      }
    }
  });

  console.log('Nexus populado com Sucesso!');
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });