import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Crown } from 'lucide-react';
import api from '../services/api';

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard')
      .then(res => setPlayers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center text-nexus-gold animate-pulse italic">Consultando os arquivos da guilda...</div>;

  const topThree = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="text-center">
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Hall da Fama</h1>
        <p className="text-slate-500 uppercase tracking-[0.3em] text-xs mt-2 font-bold text-nexus-gold">Os Maiores Heróis do Nexus</p>
      </header>

      {/* --- O PÓDIO --- */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 px-4">
        {/* Segundo Lugar */}
        {topThree[1] && <PodiumItem player={topThree[1]} rank={2} color="text-slate-300" height="h-40" />}
        
        {/* Primeiro Lugar */}
        {topThree[0] && (
          <div className="relative z-10">
            <Crown className="w-10 h-10 text-nexus-gold absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-glow" />
            <PodiumItem player={topThree[0]} rank={1} color="text-nexus-gold" height="h-56" isMain />
          </div>
        )}

        {/* Terceiro Lugar */}
        {topThree[2] && <PodiumItem player={topThree[2]} rank={3} color="text-orange-400" height="h-32" />}
      </div>

      {/* --- LISTA DOS DEMAIS --- */}
      <div className="bg-nexus-card border border-nexus-border rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
            <tr>
              <th className="p-6">Posição</th>
              <th>Player</th>
              <th>Departamento</th>
              <th className="text-right p-6">Experiência</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rest.map((player, index) => (
              <tr key={player.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6 font-mono text-slate-500 font-bold">#{index + 4}</td>
                <td className="font-bold text-white group-hover:text-nexus-purple transition-colors">{player.name}</td>
                <td className="text-xs text-slate-500 uppercase font-bold">{player.department}</td>
                <td className="p-6 text-right font-black text-nexus-gold">{player.xp} XP</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PodiumItem({ player, rank, color, height, isMain }) {
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }}
      className={`flex flex-col items-center w-full md:w-48`}
    >
      <div className={`w-16 h-16 rounded-full bg-nexus-dark border-2 mb-4 flex items-center justify-center text-xl font-black ${isMain ? 'border-nexus-gold shadow-glow-gold' : 'border-white/20'}`}>
        {player.name.charAt(0)}
      </div>
      <div className={`w-full ${height} ${isMain ? 'bg-nexus-purple' : 'bg-nexus-card'} rounded-t-2xl border-t border-x border-white/10 flex flex-col items-center justify-center p-4 text-center shadow-2xl`}>
        <span className={`text-2xl font-black ${color}`}>#{rank}</span>
        <h4 className="text-white font-bold text-sm truncate w-full mt-2">{player.name}</h4>
        <p className="text-[10px] text-white/50 font-black uppercase tracking-tighter mt-1">{player.xp} XP</p>
      </div>
    </motion.div>
  );
}