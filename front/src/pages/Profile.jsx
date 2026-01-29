import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import { Shield, Award, Zap, Target, Book } from 'lucide-react';
import api from '../services/api';
import BadgeItem from '../components/BadgeItem';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await api.get('/users/me');
        setProfile(data);
      } catch (err) {
        console.error("Erro ao carregar ficha:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) return <div className="text-nexus-gold p-20 text-center animate-pulse">Consultando o Oráculo...</div>;

  // Formatação dos dados para o Gráfico de Radar
  const radarData = [
    { subject: 'Técnico', A: profile.stats.tecnico, fullMark: 100 },
    { subject: 'Liderança', A: profile.stats.lideranca, fullMark: 100 },
    { subject: 'Soft Skills', A: profile.stats.softskills, fullMark: 100 },
    // Adicione mais se o seu back-end prover
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header da Ficha */}
      <header className="relative bg-nexus-card border border-nexus-border rounded-3xl p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-purple/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-nexus-dark border-4 border-nexus-gold flex items-center justify-center text-5xl font-black text-white shadow-glow-gold">
              {profile.name.charAt(0)}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-nexus-gold text-black px-4 py-1 rounded-full font-bold text-sm border-2 border-nexus-dark">
              NÍVEL {profile.level}
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{profile.name}</h1>
            <p className="text-nexus-purple font-bold tracking-[0.3em] uppercase text-sm mt-1">
              {profile.role.replace('_', ' ')} • {profile.department}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
               <StatBadge icon={<Zap className="w-4 h-4" />} label="XP Total" value={profile.xp} color="text-nexus-gold" />
               <StatBadge icon={<Target className="w-4 h-4" />} label="Skills" value={profile.completedSkillsCount} color="text-nexus-emerald" />
               <StatBadge icon={<Award className="w-4 h-4" />} label="Raridade" value="Épico" color="text-nexus-purple" />
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Atributos (Radar) */}
        <section className="bg-nexus-card border border-nexus-border rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <Shield className="text-nexus-gold" /> Atributos de Classe
          </h3>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                <Radar
                  name="Player"
                  dataKey="A"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-center text-xs text-slate-500 mt-4 italic">
            "Sua build atual foca em {profile.stats.tecnico >= profile.stats.lideranca ? 'Domínio Técnico' : 'Comando de Guilda'}"
          </p>
        </section>

        {/* Inventário de Insígnias */}
        <section className="bg-nexus-card border border-nexus-border rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <Award className="text-nexus-purple" /> Sala de Troféus
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {profile.badges.map((badge, i) => (
              <BadgeItem key={i} {...badge} />
            ))}
            {profile.badges.length === 0 && (
              <div className="col-span-full py-10 text-center border-2 border-dashed border-white/5 rounded-2xl text-slate-600 text-sm">
                Nenhuma relíquia encontrada nas suas jornadas.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// Componente Interno Auxiliar para as Stats do Header
function StatBadge({ icon, label, value, color }) {
  return (
    <div className="bg-nexus-dark/50 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
      <div className={color}>{icon}</div>
      <div>
        <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest leading-none">{label}</p>
        <p className="text-sm font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}