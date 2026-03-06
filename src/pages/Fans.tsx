import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { motion } from 'framer-motion';
import { Trophy, Star, MessageSquare, Zap, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

const testimonials = [
  { id: 1, name: 'Amine', message: 'Atlas Hoops is more than just a team, it\'s a family. The energy at the arena is unmatched!', role: 'Season Ticket Holder' },
  { id: 2, name: 'Layla', message: 'I love how the club promotes young local talent. Proud to be a fan!', role: 'Fan Club Member' },
  { id: 3, name: 'Youssef', message: 'The AI bot actually helped me find tickets for the last game. Great tech!', role: 'Digital Fan' },
];

export function Fans() {
  const [prediction, setPrediction] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 md:p-24 shadow-3xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Users className="w-64 h-64 text-accent" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-2xl mb-4">
            <Star className="w-8 h-8 text-accent animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Fan <span className="text-accent">Zone</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium">
            Your home for exclusive content, games, and community interaction. We win because of you.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Prediction Game */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center space-x-4">
            <Target className="w-8 h-8 text-accent" />
            <SectionHeader title="Match Predictor" subtitle="Guess the score of our next game and win exclusive rewards!" className="mb-0" />
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="w-20 h-20 text-accent" />
            </div>
            
            <div className="space-y-12 relative z-10">
              <div className="flex justify-between items-center px-4 md:px-12">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center mx-auto border border-accent/20 shadow-lg shadow-accent/10">
                    <Trophy className="w-10 h-10 text-accent" />
                  </div>
                  <p className="font-black italic uppercase text-lg tracking-tighter text-zinc-50">Atlas Hoops</p>
                </div>
                <div className="text-center space-y-2">
                  <span className="text-4xl font-black italic text-zinc-800 uppercase">VS</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">March 15, 2026</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto border border-zinc-700">
                    <Trophy className="w-10 h-10 text-zinc-600" />
                  </div>
                  <p className="font-black italic uppercase text-lg tracking-tighter text-zinc-400">Rabat Lions</p>
                </div>
              </div>

              {!hasVoted ? (
                <div className="space-y-8">
                  <p className="text-center text-zinc-400 font-bold uppercase tracking-widest text-sm">Select your predicted point margin:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[5, 10, 15, 20].map((margin) => (
                      <button
                        key={margin}
                        onClick={() => setPrediction(margin)}
                        className={cn(
                          "py-6 rounded-2xl border-2 transition-all font-black italic text-2xl tracking-tighter",
                          prediction === margin 
                            ? "bg-accent border-accent text-zinc-50 shadow-xl shadow-accent/30" 
                            : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                        )}
                      >
                        +{margin}
                      </button>
                    ))}
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full h-16 rounded-2xl shadow-xl shadow-accent/20"
                    disabled={!prediction}
                    onClick={() => setHasVoted(true)}
                  >
                    Lock Prediction
                  </Button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                    <Target className="w-8 h-8 text-zinc-50" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-50">Prediction Locked!</h3>
                  <p className="text-zinc-400 font-medium max-w-sm mx-auto">
                    You've predicted a <span className="text-accent">+{prediction} point margin</span> victory for Atlas Hoops. Good luck!
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* Testimonials / Social Proof */}
        <section className="space-y-8">
          <div className="flex items-center space-x-4">
            <MessageSquare className="w-8 h-8 text-accent" />
            <SectionHeader title="Fan Stories" subtitle="What the community is saying." className="mb-0" />
          </div>
          
          <div className="space-y-6">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-4 hover:border-accent/50 transition-colors group shadow-xl"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-black text-accent border border-zinc-700">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black italic uppercase tracking-tighter text-zinc-50 group-hover:text-accent transition-colors leading-none">{t.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mt-1">{t.role}</p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium italic">
                  "{t.message}"
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
