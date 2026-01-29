import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sword, Trophy, AlertCircle, Loader2, Timer } from 'lucide-react';
import api from '../services/api';

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  
  // --- Lógica do Timer ---
  const [timeLeft, setTimeLeft] = useState(60); // 60 segundos por padrão

  useEffect(() => {
    async function loadQuiz() {
      try {
        const { data } = await api.get(`/skills`); 
        // Procuramos o quiz e guardamos a referência da skill para pegar o XP reward
        let foundQuiz = null;
        let skillData = null;

        data.forEach(skill => {
          skill.modules.forEach(mod => {
            const q = mod.quizzes.find(q => q.id === quizId);
            if (q) {
              foundQuiz = q;
              skillData = skill;
            }
          });
        });

        if (foundQuiz) {
          // Injetamos o xpReward dentro do objeto quiz para facilitar o acesso no resultado
          setQuiz({ ...foundQuiz, xpReward: skillData.xpReward });
        }
      } catch (err) {
        console.error("Erro ao carregar quiz:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [quizId]);

  // Efeito do Cronômetro
  useEffect(() => {
    if (timeLeft > 0 && !result && !loading && quiz) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !result) {
      handleSubmit(); // Submete automaticamente se o tempo acabar
    }
  }, [timeLeft, result, loading, quiz]);

  const handleSelectOption = (questionId, optionId) => {
    const newAnswers = [...answers.filter(a => a.questionId !== questionId), { questionId, optionId }];
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await api.post('/quizzes/submit', { quizId, answers });
      setResult(data);
    } catch (err) {
      alert("O tempo esgotou ou houve um erro na conexão!");
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !result) return (
    <div className="min-h-screen bg-nexus-dark flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-nexus-gold animate-spin" />
    </div>
  );
  
  if (!quiz && !result) return <div className="text-white text-center mt-20">Masmorra não encontrada.</div>;

  // --- TELA DE RESULTADO ---
  if (result) {
    return (
      <div className="min-h-screen bg-nexus-dark flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-nexus-card border border-nexus-border p-8 rounded-3xl text-center shadow-2xl relative">
          <div className={`absolute top-0 left-0 w-full h-2 rounded-t-3xl ${result.passed ? 'bg-nexus-gold' : 'bg-red-500'}`} />
          
          {result.passed ? (
            <>
              <div className="w-20 h-20 bg-nexus-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-gold">
                <Trophy className="w-10 h-10 text-nexus-gold" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">VITÓRIA!</h2>
              <p className="text-slate-400 mb-6 text-sm">{result.message}</p>
              
              <div className="bg-nexus-dark/50 p-4 rounded-xl border border-white/5 mb-8">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Recompensa de XP</span>
                <p className="text-3xl font-black text-nexus-gold mt-1">
                  + {result.xpEarned || quiz.xpReward || 0} XP
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">DERROTA...</h2>
              <p className="text-slate-400 mb-8">{result.message}</p>
            </>
          )}

          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-nexus-gold hover:text-black transition-all transform active:scale-95"
          >
            RETORNAR AO MAPA
          </button>
        </motion.div>
      </div>
    );
  }

  // --- TELA DE QUESTÕES ---
  const currentQuestion = quiz.questions[currentStep];
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-nexus-dark text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-nexus-purple text-xs font-black uppercase tracking-[0.2em]">Quest: {quiz.title}</span>
            <h1 className="text-3xl font-black italic tracking-tighter">Pergunta {currentStep + 1} de {quiz.questions.length}</h1>
          </div>
          <div className="text-right">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Timer className="w-3 h-3" /> Tempo Restante
            </span>
            <p className={`text-xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-nexus-gold'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            className="bg-nexus-card border border-nexus-border p-8 rounded-3xl shadow-xl relative overflow-hidden"
          >
            {/* Barra de progresso interna do Quiz */}
            <div className="absolute top-0 left-0 h-1 bg-nexus-purple transition-all duration-500" style={{ width: `${((currentStep + 1) / quiz.questions.length) * 100}%` }} />

            <h2 className="text-xl font-bold leading-relaxed mb-8 text-slate-100">
              {currentQuestion.text}
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = answers.find(a => a.optionId === option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group
                      ${isSelected 
                        ? 'border-nexus-gold bg-nexus-gold/5 text-nexus-gold shadow-[0_0_15px_rgba(251,191,36,0.1)]' 
                        : 'border-white/5 bg-nexus-dark/50 text-slate-400 hover:border-white/20'}
                    `}
                  >
                    <span className="font-bold pr-4">{option.text}</span>
                    <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-nexus-gold' : 'border-slate-700'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-nexus-gold rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-between items-center">
              <button 
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(s => s - 1)}
                className="text-slate-500 font-bold hover:text-white disabled:opacity-0 transition-all text-sm uppercase tracking-widest"
              >
                Anterior
              </button>
              
              {currentStep < quiz.questions.length - 1 ? (
                <button 
                  disabled={!answers.find(a => a.questionId === currentQuestion.id)}
                  onClick={() => setCurrentStep(s => s + 1)}
                  className="bg-nexus-purple text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-purple-600 disabled:opacity-30 transition-all shadow-glow-purple"
                >
                  PRÓXIMA <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={loading || answers.length < quiz.questions.length}
                  className="bg-nexus-gold text-black px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:shadow-glow-gold transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Sword className="w-5 h-5" /> FINALIZAR COMBATE</>}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}