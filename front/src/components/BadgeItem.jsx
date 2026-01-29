import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function BadgeItem({ name, icon, earnedAt }) {
  const IconComponent = Icons[icon] || Icons.Medal;

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="group relative flex flex-col items-center p-4 bg-nexus-dark/50 border border-white/5 rounded-2xl hover:border-nexus-gold/50 transition-all"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-nexus-gold/20 to-transparent rounded-full flex items-center justify-center mb-3 shadow-glow-gold/10 group-hover:shadow-glow-gold/30 transition-all">
        <IconComponent className="w-8 h-8 text-nexus-gold drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
      </div>
      
      <span className="text-[10px] font-black text-white uppercase tracking-tighter text-center leading-tight">
        {name}
      </span>
      
      <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 group-hover:bottom-[-30px] transition-all pointer-events-none">
        <span className="text-[9px] bg-nexus-gold text-black px-2 py-1 rounded font-bold whitespace-nowrap uppercase">
          Conquistado em: {new Date(earnedAt).toLocaleDateString()}
        </span>
      </div>
    </motion.div>
  );
}