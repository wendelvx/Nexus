import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Star, Trophy } from 'lucide-react';
import api from '../services/api';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadPlayerData() {
      try {
        const { data } = await api.get('/users/me');
        setUser(data);
      } catch (err) {
        console.error("Erro ao carregar dados do player", err);
      }
    }
    loadPlayerData();
  }, []);

  if (!user) return <div className="h-20 bg-nexus-dark" />;

  const currentLevel = Math.floor(user.xp / 1000) + 1;
  const xpInCurrentLevel = user.xp % 1000;
  const progressPercentage = (xpInCurrentLevel / 1000) * 100;

  return (
    <header className="bg-nexus-card/50 backdrop-blur-md border-b border-nexus-border sticky top-0 z-50 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-nexus-purple flex items-center justify-center border-2 border-nexus-gold shadow-glow-gold">
              <span className="text-xl font-black">{user.name.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-nexus-gold text-black text-[10px] font-bold px-1.5 rounded-full border border-nexus-dark">
              LVL {currentLevel}
            </div>
          </div>
          
          <div>
            <h2 className="text-white font-bold leading-none">{user.name}</h2>
            <p className="text-nexus-gold text-xs font-medium mt-1 uppercase tracking-tighter">
              {user.role.replace('_', ' ')} • {user.department || 'Sem Guilda'}
            </p>
          </div>
        </div>

        <div className="hidden md:block flex-1 max-w-md mx-8">
          <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">
            <span>Experiência (XP)</span>
            <span className="text-nexus-gold">{user.xp} / {(currentLevel) * 1000}</span>
          </div>
          <div className="h-3 w-full bg-nexus-dark rounded-full overflow-hidden border border-nexus-border">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-nexus-purple to-nexus-gold relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <Trophy className="w-5 h-5 text-nexus-gold mb-0.5" />
            <span className="text-[10px] font-bold text-slate-400">{user.badges.length} Insígnias</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="w-5 h-5 text-nexus-purple mb-0.5" />
            <span className="text-[10px] font-bold text-slate-400">{user.stats.tecnico} Tec</span>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
          >
            <Shield className="w-5 h-5 text-slate-500 group-hover:text-red-400" />
          </button>
        </div>
      </div>
    </header>
  );
}