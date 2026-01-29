import prisma from '../lib/prisma.js';
import { xpQueue } from '../lib/queue.js';

export const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body; 
  const userId = req.user.userId;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { 
        questions: { include: { options: true } },
        module: { include: { skillNode: true } } 
      }
    });

    if (!quiz) return res.status(404).json({ error: "Quiz não encontrado" });

    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      const correctOption = question.options.find(o => o.isCorrect);
      
      if (userAnswer && userAnswer.optionId === correctOption.id) {
        correctAnswers++;
      }
    });

    const score = correctAnswers / totalQuestions;
    const minRequired = quiz.module.skillNode.minScoreRequired || 0.7;
    const passed = score >= minRequired;
    const xpEarned = quiz.module.skillNode.xpReward;

    if (passed) {
      let expiresAt = null;
      if (quiz.module.skillNode.validityMonths) {
        const date = new Date();
        date.setMonth(date.getMonth() + quiz.module.skillNode.validityMonths);
        expiresAt = date;
      }

      await prisma.userModuleProgress.upsert({
        where: { userId_moduleId: { userId, moduleId: quiz.moduleId } },
        update: { isCompleted: true, completedAt: new Date() },
        create: { userId, moduleId: quiz.moduleId, isCompleted: true, completedAt: new Date() }
      });

      await prisma.userProgress.upsert({
        where: { 
          userId_skillNodeId: { 
            userId, 
            skillNodeId: quiz.module.skillNodeId 
          } 
        },
        update: { 
          isCompleted: true, 
          completedAt: new Date(),
          status: 1.0,
          expiresAt
        },
        create: { 
          userId, 
          skillNodeId: quiz.module.skillNodeId, 
          isCompleted: true, 
          completedAt: new Date(),
          status: 1.0,
          expiresAt
        }
      });

      await xpQueue.add('process-xp', {
        userId,
        amount: xpEarned,
        skillNodeId: quiz.module.skillNodeId
      });
    }

    res.json({
      passed,
      score: score * 100,
      correctAnswers,
      totalQuestions,
      xpEarned: passed ? xpEarned : 0, 
      message: passed 
        ? "Excelente! Você dominou este conhecimento e subiu um degrau na sua jornada." 
        : "Nota insuficiente para este desafio. Estude o material e tente novamente, recruta!"
    });

  } catch (error) {
    console.error("Erro no QuizController:", error);
    res.status(500).json({ error: "Erro ao processar o Quiz" });
  }
};