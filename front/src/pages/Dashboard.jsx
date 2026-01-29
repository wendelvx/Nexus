import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillTree from '../features/skill-tree/SkillTree';
import QuestModal from '../components/QuestModal';

export default function Dashboard() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const navigate = useNavigate();

  const handleStartMission = (skill) => {
    if (skill.isPractical) {
      alert(`⚔️ Missão Prática: "${skill.title}" requer envio de evidência para o Mestre.`);
      setSelectedSkill(null);
      return;
    }

    
    const quiz = skill.modules?.find(m => m.quizzes?.length > 0)?.quizzes[0];

    if (quiz?.id) {
      navigate(`/quiz/${quiz.id}`);
    } else {
      alert("📜 O conhecimento para esta missão ainda não foi totalmente transcrito (Sem Quiz).");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <header>
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">
            Mapa de Habilidades
          </h3>
          <p className="text-slate-500 text-sm">Desbloqueie novos caminhos vencendo os desafios anteriores.</p>
        </header>
        
        <div className="bg-nexus-card/30 rounded-3xl border border-white/5 p-4">
          <SkillTree onSelectSkill={(skill) => setSelectedSkill(skill)} />
        </div>
      </div>

      <aside className="space-y-6">
        <div className="bg-nexus-card p-6 rounded-2xl border border-nexus-border shadow-2xl">
          <h3 className="text-xl font-bold mb-4 text-nexus-gold uppercase tracking-tighter">Conquistas</h3>
          <div className="flex gap-3 flex-wrap">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-12 h-12 bg-nexus-dark rounded-xl border border-nexus-border flex items-center justify-center grayscale opacity-20">
                🔒
              </div>
            ))}
          </div>
          <p className="mt-6 text-[10px] text-slate-500 uppercase font-bold tracking-widest text-center">
            Complete missões para ganhar medalhas
          </p>
        </div>
      </aside>

      {selectedSkill && (
        <QuestModal 
          skill={selectedSkill} 
          onClose={() => setSelectedSkill(null)}
          onStartQuiz={handleStartMission} // Agora chama a função genérica de missão
        />
      )}
    </div>
  );
}