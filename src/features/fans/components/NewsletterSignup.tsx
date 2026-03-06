import { useState } from 'react';
import { Mail, Loader2, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fanService } from '@/services/fanService';
import { motion } from 'framer-motion';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fanService.subscribeToNewsletter(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Newsletter error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-accent/10 border border-accent/20 rounded-3xl p-8 text-center space-y-4"
      >
        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto shadow-lg shadow-accent/20">
          <CheckCircle2 className="w-6 h-6 text-zinc-50" />
        </div>
        <h4 className="text-lg font-black italic uppercase tracking-tighter text-zinc-50">Welcome to the Club!</h4>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Check your inbox for the latest team updates.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-3xl relative overflow-hidden group hover:border-accent transition-colors duration-500">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Zap className="w-32 h-32 text-accent" />
      </div>
      
      <div className="relative z-10 space-y-8">
        <div className="space-y-4">
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-50">Join the <span className="text-accent">Fanbase</span></h3>
          <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-sm">
            Get exclusive match updates, player interviews, and early access to tickets.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 pl-14 pr-40 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-800 text-zinc-50"
            placeholder="fan@atlashoops.ma"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button 
              type="submit" 
              size="sm" 
              className="h-12 rounded-xl px-8"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
            </Button>
          </div>
        </form>
        
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 text-center italic">
          No spam. Only high-performance basketball content.
        </p>
      </div>
    </div>
  );
}
