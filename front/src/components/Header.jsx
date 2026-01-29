import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom'; 
import { Shield, Zap, Trophy, Map as MapIcon, LogOut, User } from 'lucide-react';
import api from '../services/api';

export default function Header() {
  const [user, setUser] = useState(null);
  const location = useLocation(); // Hook para identificar a rota ativa

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
        
        {/* LADO ESQUERDO: Identidade (Atalho para Perfil) */}
        <Link to="/profile" className="flex items-center gap-4 group transition-all">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-nexus-purple flex items-center justify-center border-2 border-nexus-gold shadow-glow-gold group-hover:scale-105 transition-transform">
              <span className="text-xl font-black text-white">{user.name.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-nexus-gold text-black text-[10px] font-bold px-1.5 rounded-full border border-nexus-dark">
              LVL {currentLevel}
            </div>
          </div>
          
          <div className="hidden sm:block">
            <h2 className="text-white font-bold leading-none group-hover:text-nexus-gold transition-colors">
              {user.name}
            </h2>
            <p className="text-slate-500 text-[10px] font-medium mt-1 uppercase tracking-[0.2em]">
              Ver Ficha de Herói
            </p>
          </div>
        </Link>

        {/* CENTRO: Menu de Navegação (HUD) */}
        <nav className="flex items-center gap-2 bg-nexus-dark/50 p-1 rounded-xl border border-white/5">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${
              location.pathname === '/dashboard' 
                ? 'bg-nexus-purple text-white shadow-glow-purple' 
                : 'text-slate-500 hover:text-white'
            }`}
          >
            <MapIcon className="w-4 h-4" /> MAPA
          </Link>
          <Link 
            to="/profile" 
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${
              location.pathname === '/profile' 
                ? 'bg-nexus-purple text-white shadow-glow-purple' 
                : 'text-slate-500 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> FICHA
          </Link>
        </nav>

        {/* LADO DIREITO: Stats e Logout */}
        <div className="flex items-center gap-6">
          {/* Barra de XP Compacta (Desktop) */}
          <div className="hidden lg:block w-40">
            <div className="flex justify-between text-[9px] uppercase font-black text-slate-500 mb-1 tracking-tighter">
              <span>XP do Nível</span>
              <span className="text-nexus-gold">{xpInCurrentLevel}/1000</span>
            </div>
            <div className="h-2 w-full bg-nexus-dark rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                className="h-full bg-gradient-to-r from-nexus-purple to-nexus-gold"
              />
            </div>
          </div>

          {/* Stats Rápidas */}
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="flex flex-col items-center" title="Insígnias Coletadas">
              <Trophy className="w-4 h-4 text-nexus-gold mb-0.5" />
              <span className="text-[10px] font-bold text-white">{user.badges?.length || 0}</span>
            </div>
            
            <button 
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              className="p-2.5 hover:bg-red-500/10 rounded-xl transition-colors group"
              title="Encerrar Sessão"
            >
              <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}