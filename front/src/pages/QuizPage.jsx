import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sword, Trophy, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null); // Para mostrar se passou ou falhou

  useEffect(() => {
    async function loadQuiz() {
      try {
        // Nota: Certifique-se de ter um endpoint GET /quizzes/:id no back
        // ou adapte para buscar dentro da Skill selecionada
        const { data } = await api.get(`/skills`); 
        // Mock rápido: buscando o quiz dentro das skills para teste
        const foundQuiz = data.flatMap(s => s.modules).flatMap(m => m.quizzes).find(q => q.id === quizId);
        setQuiz(foundQuiz);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [quizId]);

  const handleSelectOption = (questionId, optionId) => {
    const newAnswers = [...answers.filter(a => a.questionId !== questionId), { questionId, optionId }];
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/quizzes/submit', { quizId, answers });
      setResult(data);
    } catch (err) {
      alert("Erro ao enviar desafio!");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !result) return <div className="min-h-screen flex items-center justify-center text-nexus-gold">Carregando Desafio...</div>;
  if (!quiz && !result) return <div className="text-white">Desafio não encontrado.</div>;

  // Tela de Resultado (Pós-Combate)
  if (result) {
    return (
      <div className="min-h-screen bg-nexus-dark flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-nexus-card border border-nexus-border p-8 rounded-3xl text-center shadow-2xl">
          {result.passed ? (
            <>
              <div className="w-20 h-20 bg-nexus-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-gold">
                <Trophy className="w-10 h-10 text-nexus-gold" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">VITÓRIA!</h2>
              <p className="text-slate-400 mb-6">{result.message}</p>
              <div className="bg-nexus-dark/50 p-4 rounded-xl border border-white/5 mb-6">
                <span className="text-xs text-slate-500 uppercase font-bold">Experiência Ganha</span>
                <p className="text-2xl font-black text-nexus-gold">+ {quiz?.module?.skillNode?.xpReward || '---'} XP</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">DERROTA...</h2>
              <p className="text-slate-400 mb-6">{result.message}</p>
            </>
          )}
          <button onClick={() => navigate('/dashboard')} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-slate-200 transition-all">
            VOLTAR AO MAPA
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentStep];

  return (
    <div className="min-h-screen bg-nexus-dark text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header de Progresso do Quiz */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-nexus-purple text-xs font-black uppercase tracking-widest">Quest: {quiz.title}</span>
            <h1 className="text-2xl font-black italic">Pergunta {currentStep + 1} de {quiz.questions.length}</h1>
          </div>
          <div className="text-right">
            <span className="text-slate-500 text-xs font-bold uppercase">Tempo Restante</span>
            <p className="text-nexus-gold font-mono">∞:00</p>
          </div>
        </div>

        {/* Card da Pergunta */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="bg-nexus-card border border-nexus-border p-8 rounded-3xl shadow-xl"
          >
            <h2 className="text-xl font-medium leading-relaxed mb-8">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = answers.find(a => a.optionId === option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group
                      ${isSelected ? 'border-nexus-gold bg-nexus-gold/5 text-nexus-gold shadow-glow-gold' : 'border-nexus-border bg-nexus-dark/50 text-slate-400 hover:border-slate-600'}
                    `}
                  >
                    <span className="font-bold">{option.text}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-nexus-gold' : 'border-slate-700'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-nexus-gold rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-between">
              <button 
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(s => s - 1)}
                className="text-slate-500 font-bold hover:text-white disabled:opacity-0 transition-all"
              >
                Voltar
              </button>
              
              {currentStep < quiz.questions.length - 1 ? (
                <button 
                  disabled={!answers.find(a => a.questionId === currentQuestion.id)}
                  onClick={() => setCurrentStep(s => s + 1)}
                  className="bg-nexus-purple px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-purple-600 disabled:opacity-50 transition-all"
                >
                  PRÓXIMA <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={loading || answers.length < quiz.questions.length}
                  className="bg-nexus-gold text-black px-10 py-3 rounded-xl font-black flex items-center gap-2 hover:shadow-glow-gold transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Sword className="w-5 h-5" /> FINALIZAR</>}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}