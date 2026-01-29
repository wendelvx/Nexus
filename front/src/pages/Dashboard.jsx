import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillTree from '../features/skill-tree/SkillTree';
import QuestModal from '../components/QuestModal';
import BadgeItem from '../components/BadgeItem'; // Vamos assumir que criou este componente
import api from '../services/api';

export default function Dashboard() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Busca os dados do herói ao carregar a página
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data } = await api.get('/users/me');
        setUserData(data);
      } catch (err) {
        console.error("Erro ao carregar dados do Dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

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
      {/* --- COLUNA DO MAPA (2/3) --- */}
      <div className="md:col-span-2 space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">
              Mapa de Habilidades
            </h3>
            <p className="text-slate-500 text-sm">Vença os desafios para desbloquear novos caminhos.</p>
          </div>
          {/* Badge de XP rápido se quiser mostrar aqui também */}
          <div className="text-right">
            <span className="text-[10px] text-nexus-gold font-black uppercase">Total acumulado</span>
            <p className="text-xl font-mono text-white leading-none">{userData?.xp || 0} XP</p>
          </div>
        </header>
        
        <div className="bg-nexus-card/30 rounded-3xl border border-white/5 p-4 min-h-[500px] flex items-center justify-center">
          <SkillTree onSelectSkill={(skill) => setSelectedSkill(skill)} />
        </div>
      </div>

      {/* --- SIDEBAR DE STATUS E CONQUISTAS (1/3) --- */}
      <aside className="space-y-6">
        {/* Painel de Insígnias Reais */}
        <div className="bg-nexus-card p-6 rounded-2xl border border-nexus-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-nexus-gold/5 rounded-full -mr-10 -mt-10 blur-2xl" />
          
          <h3 className="text-lg font-bold mb-6 text-nexus-gold uppercase tracking-tighter flex items-center gap-2">
            🏆 Suas Insígnias
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              // Esqueleto de carregamento
              [1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-nexus-dark/50 animate-pulse rounded-xl" />)
            ) : userData?.badges?.length > 0 ? (
              // Renderiza as medalhas reais do player
              userData.badges.map((b, index) => (
                <BadgeItem 
                  key={index}
                  name={b.name}
                  icon={b.icon}
                  earnedAt={b.earnedAt}
                />
              ))
            ) : (
              // Caso o player seja novo e não tenha nada
              <div className="col-span-2 py-8 text-center border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-xs text-slate-500 italic px-4">
                  Seu inventário de relíquias está vazio. Conclua o primeiro nó do mapa!
                </p>
              </div>
            )}
          </div>

          {userData?.badges?.length > 0 && (
            <button className="w-full mt-6 py-3 text-[10px] font-black text-nexus-purple bg-nexus-purple/5 border border-nexus-purple/20 rounded-xl hover:bg-nexus-purple/10 transition-all uppercase tracking-widest">
              Ver Coleção Completa
            </button>
          )}
        </div>

        {/* Widget de Atributos Rápidos */}
        <div className="bg-nexus-card p-6 rounded-2xl border border-nexus-border">
          <h3 className="text-sm font-bold mb-4 text-white uppercase tracking-widest">Status da Guilda</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Skills Concluídas</span>
              <span className="text-xs font-bold text-white">{userData?.completedSkillsCount || 0}</span>
            </div>
            <div className="h-1.5 w-full bg-nexus-dark rounded-full overflow-hidden">
              <div 
                className="h-full bg-nexus-emerald transition-all duration-1000" 
                style={{ width: `${(userData?.completedSkillsCount / 10) * 100}%` }} 
              />
            </div>
          </div>
        </div>
      </aside>

      {/* --- MODAL DE MISSÃO --- */}
      {selectedSkill && (
        <QuestModal 
          skill={selectedSkill} 
          onClose={() => setSelectedSkill(null)}
          onStartQuiz={handleStartMission}
        />
      )}
    </div>
  );
}