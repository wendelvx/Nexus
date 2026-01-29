import { motion, AnimatePresence } from 'framer-motion';
import { X, PlayCircle, BookOpen, Trophy, Sword } from 'lucide-react';

export default function QuestModal({ skill, onClose, onStartQuiz }) {
  if (!skill) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-nexus-dark/80 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-nexus-card border border-nexus-border rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-br from-nexus-purple/40 to-nexus-gold/20 flex items-end p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-nexus-gold bg-black/30 px-2 py-1 rounded">
                Missão Ativa
              </span>
              <h2 className="text-3xl font-black text-white tracking-tighter mt-1">{skill.title}</h2>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Resumo do Conhecimento
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {skill.description}
                </p>
                
                <div className="flex items-center gap-4 pt-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Recompensa</span>
                      <span className="text-nexus-gold font-black flex items-center gap-1">
                        <Trophy className="w-4 h-4" /> {skill.xpReward} XP
                      </span>
                   </div>
                </div>
              </div>

              <div className="bg-nexus-dark/50 rounded-2xl p-4 border border-white/5">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Módulos Disponíveis</h4>
                <div className="space-y-3">
                  {skill.modules?.map((mod) => (
                    <div key={mod.id} className="flex items-center justify-between bg-nexus-card p-3 rounded-lg border border-nexus-border">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-5 h-5 text-nexus-purple" />
                        <span className="text-xs font-medium text-slate-200">{mod.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{mod.contentType}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => onStartQuiz(skill)}
                  className="w-full mt-6 bg-nexus-purple hover:bg-purple-600 text-white font-black py-4 rounded-xl shadow-glow-purple flex items-center justify-center gap-2 group transition-all"
                >
                  <Sword className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  INICIAR DESAFIO
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}