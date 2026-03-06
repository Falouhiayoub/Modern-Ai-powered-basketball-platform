import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Trophy, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-40 pb-20 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-3xl mb-4">
            <Trophy className="w-10 h-10 text-accent" />
          </div>
          <SectionHeader 
            title="Admin Login" 
            subtitle="Secure access for Atlas Hoops club management." 
            align="center"
            className="mb-0"
          />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-3xl space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center space-x-3 text-red-500 text-sm font-bold animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-800 text-zinc-50"
                  placeholder="admin@atlashoops.ma"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-800 text-zinc-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Arena'}
            </Button>
          </form>
        </div>

        <p className="text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">
          Restricted to authorized club personnel only.
        </p>
      </div>
    </main>
  );
}
