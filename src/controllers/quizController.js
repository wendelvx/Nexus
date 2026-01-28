import prisma from '../lib/prisma.js';
import { addExperience } from '../services/gamificationService.js';

export const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body; // answers: [{ questionId: '...', optionId: '...' }]
  const userId = req.user.userId;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { options: true } }, module: { include: { skillNode: true } } }
    });

    let correctCount = 0;
    
    quiz.questions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question.id);
      const correctOption = question.options.find(o => o.isCorrect);
      
      if (userAnswer && userAnswer.optionId === correctOption.id) {
        correctCount++;
      }
    });

    const score = correctCount / quiz.questions.length;
    const minRequired = quiz.module.skillNode.minScoreRequired; // Os 0.7 (70%) do seu Schema

    if (score >= minRequired) {
      await addExperience(userId, quiz.module.skillNode.xpReward);
      
      return res.json({
        status: 'SUCCESS',
        score: score * 100,
        message: "Parabéns, Alquimista! Você dominou este conhecimento."
      });
    } else {
      return res.status(400).json({
        status: 'FAILED',
        score: score * 100,
        message: "Seu conhecimento ainda é insuficiente para este nível. Estude mais!"
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar o Quiz" });
  }
};