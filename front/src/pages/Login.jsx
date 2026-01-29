import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sword, Mail, Lock, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', formData);
      
      localStorage.setItem('@nexus:token', data.token);
      localStorage.setItem('@nexus:user', JSON.stringify(data.user));

      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Falha na conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-nexus-dark px-4">
      <div className="absolute w-96 h-96 bg-nexus-purple/10 rounded-full blur-[120px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-nexus-card border border-nexus-border p-8 rounded-2xl shadow-2xl relative overflow-hidden"
      >
        {/* Detalhe estético no topo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-nexus-gold to-transparent" />

        <div className="flex flex-col items-center mb-8">
          <div className="bg-nexus-gold/10 p-4 rounded-full mb-4 shadow-glow-gold">
            <Sword className="w-8 h-8 text-nexus-gold" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white">NEXUS RPG</h1>
          <p className="text-slate-400 text-sm">Inicie sua jornada corporativa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">E-mail do Jogador</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input 
                type="email"
                required
                className="w-full bg-nexus-dark/50 border border-nexus-border rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-nexus-gold transition-colors text-slate-200"
                placeholder="mestre@nexus.com"
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-slate-500 mb-2 font-bold">Chave de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <input 
                type="password"
                required
                className="w-full bg-nexus-dark/50 border border-nexus-border rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-nexus-gold transition-colors text-slate-200"
                placeholder="••••••••"
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }}
              className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center"
            >
              ⚠️ {error}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-nexus-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ENTRAR NA GUILDA"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          Ainda não possui conta? <a href="#" className="text-nexus-gold hover:underline">Recrute-se aqui</a>
        </p>
      </motion.div>
    </div>
  );
}