export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-nexus-card p-6 rounded-2xl border border-nexus-border h-96">
        <h3 className="text-xl font-bold mb-4">Sua Jornada Atual</h3>
        <p className="text-slate-400 italic">
          Conectando com o Oráculo... O mapa de habilidades aparecerá em breve.
        </p>
      </div>

      <div className="bg-nexus-card p-6 rounded-2xl border border-nexus-border">
        <h3 className="text-xl font-bold mb-4 text-nexus-gold">Conquistas Recentes</h3>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="w-12 h-12 bg-nexus-dark rounded-lg border border-nexus-border flex items-center justify-center opacity-20 grayscale"
            >
              🔒
            </div>
          ))}
        </div>
        <button className="w-full mt-6 py-2 text-xs font-bold text-nexus-purple border border-nexus-purple/30 rounded-lg hover:bg-nexus-purple/10 transition-colors">
          VER TODAS AS INSÍGNIAS
        </button>
      </div>
    </div>
  );
}