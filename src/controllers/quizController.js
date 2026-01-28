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

    if (passed) {
      await xpQueue.add('process-xp', {
        userId,
        amount: quiz.module.skillNode.xpReward,
        skillNodeId: quiz.module.skillNode.id
      });
      
      await prisma.userModuleProgress.upsert({
        where: { userId_moduleId: { userId, moduleId: quiz.moduleId } },
        update: { isCompleted: true, completedAt: new Date() },
        create: { userId, moduleId: quiz.moduleId, isCompleted: true, completedAt: new Date() }
      });
    }

    res.json({
      passed,
      score: score * 100,
      correctAnswers,
      totalQuestions,
      message: passed 
        ? "Excelente! Você dominou este conhecimento." 
        : "Nota insuficiente. Estude o material e tente novamente!"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar o Quiz" });
  }
};