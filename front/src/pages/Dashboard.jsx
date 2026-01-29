import SkillTree from '../features/skill-tree/SkillTree';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">
            Mapa de Habilidades
          </h3>
          <span className="text-xs text-slate-500 font-mono">Setor: Todos</span>
        </div>
        
        <SkillTree />
      </div>

      <div className="space-y-6">
        {/* Sidebar de Conquistas (Mantemos como está por enquanto) */}
        <div className="bg-nexus-card p-6 rounded-2xl border border-nexus-border">
          <h3 className="text-xl font-bold mb-4 text-nexus-gold">Conquistas Recentes</h3>
          {/* ... badges ... */}
        </div>
      </div>
    </div>
  );
}