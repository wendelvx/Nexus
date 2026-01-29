import { motion } from 'framer-motion';
import { Lock, Check, Play } from 'lucide-react';

export default function SkillNode({ skill, onSelect }) {
  const isLocked = skill.locked;
  const isCompleted = skill.userProgress?.some(p => p.isCompleted);
  const isAvailable = !isLocked && !isCompleted;

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        whileHover={!isLocked ? { scale: 1.1, rotate: 5 } : {}}
        whileTap={!isLocked ? { scale: 0.9 } : {}}
        onClick={() => !isLocked && onSelect(skill)}
        className={`
          relative w-20 h-20 rounded-2xl border-2 flex items-center justify-center transition-all duration-500
          ${isLocked ? 'bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed' : ''}
          ${isAvailable ? 'bg-nexus-card border-nexus-purple text-nexus-purple shadow-glow-purple animate-pulse' : ''}
          ${isCompleted ? 'bg-nexus-emerald border-nexus-emerald text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : ''}
        `}
      >
        {isLocked && <Lock className="w-8 h-8" />}
        {isCompleted && <Check className="w-10 h-10 stroke-[3px]" />}
        {isAvailable && <Play className="w-8 h-8 fill-current ml-1" />}

        {!isLocked && !isCompleted && (
          <div className="absolute -top-2 -right-2 bg-nexus-gold text-black text-[10px] font-black px-1.5 py-0.5 rounded-md">
            +{skill.xpReward}
          </div>
        )}
      </motion.button>

      <div className="text-center">
        <p className={`text-sm font-bold uppercase tracking-tighter ${isLocked ? 'text-slate-600' : 'text-white'}`}>
          {skill.title}
        </p>
        <span className="text-[10px] text-slate-500 uppercase font-medium">{skill.category}</span>
      </div>
    </div>
  );
}