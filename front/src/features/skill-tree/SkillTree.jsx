import { useEffect, useState } from 'react';
import api from '../../services/api';
import SkillNode from '../../components/SkillNode';

export default function SkillTree() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const { data } = await api.get('/skills');
        setSkills(data);
      } catch (err) {
        console.error("Erro ao carregar mapa de skills", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
  }, []);

  if (loading) return <div className="text-nexus-purple animate-pulse font-mono">Carregando Mapa do Mundo...</div>;

  return (
    <div className="relative p-10 bg-nexus-dark/30 rounded-3xl border border-white/5 overflow-hidden">
      {/* Background Decorativo (Grid de RPG) */}
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="relative flex flex-wrap justify-center gap-16">
        {skills.map((skill) => (
          <SkillNode 
            key={skill.id} 
            skill={skill} 
            onSelect={(s) => alert(`Iniciando missão: ${s.title}`)} 
          />
        ))}
      </div>
    </div>
  );
}