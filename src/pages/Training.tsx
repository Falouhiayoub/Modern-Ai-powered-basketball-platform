import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { trainingService } from '@/services/trainingService';
import type { TrainingSession } from '@/services/trainingService';
import { Loader2, Clock, MapPin, Dumbbell, Zap, ChevronRight, Trophy, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export function Training() {
  const { data: sessions, isLoading, error } = useQuery<TrainingSession[]>({
    queryKey: ['trainingSessions'],
    queryFn: () => trainingService.getSessions(),
  });

  const categories = [
    { name: 'Team Practice', icon: Dumbbell, color: 'text-accent', bg: 'bg-accent/10' },
    { name: 'Individual Skills', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { name: 'Youth Academy', icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <main className="relative min-h-screen bg-zinc-950 overflow-hidden">
      {/* Page Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/images/tarining.jpg" 
          alt="Training Background" 
          className="w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950" />
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full"
          >
            <Dumbbell className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">Elite Performance Center</span>
          </motion.div>
          
          <SectionHeader 
            title="Training Ground" 
            subtitle="Where champions are forged. View our professional schedule." 
            align="center"
          />
        </section>

        {/* Schedule Grid */}
        <section>
          {isLoading ? (
            <div className="flex justify-center py-40">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </div>
          ) : error ? (
            <div className="glass-card p-20 text-center border-red-500/20 bg-red-500/5">
              <p className="text-red-500 font-black italic uppercase tracking-widest">Error loading schedule</p>
              <p className="text-zinc-600 text-xs mt-2">Please ensure the training_sessions table is created.</p>
            </div>
          ) : sessions?.length === 0 ? (
            <div className="glass-card p-20 text-center">
              <p className="text-zinc-500 font-black italic uppercase tracking-widest">No sessions scheduled this week.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sessions?.map((session, index) => {
                const category = categories.find(c => c.name === session.category) || categories[0];
                const Icon = category.icon;
                
                return (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group glass-card p-8 hover:border-accent/50 transition-all duration-500 relative overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className={`p-4 rounded-2xl ${category.bg} border border-white/5`}>
                          <Icon className={`w-6 h-6 ${category.color}`} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-accent transition-colors">
                          {session.day_of_week}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-50 leading-tight group-hover:text-accent transition-colors">
                          {session.title}
                        </h3>
                        <p className="text-zinc-500 text-sm font-medium line-clamp-2 leading-relaxed">
                          {session.description || "High-intensity drills focused on tactical execution and physical conditioning."}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-zinc-800 space-y-4">
                        <div className="flex items-center space-x-3 text-zinc-400">
                          <Clock className="w-4 h-4 text-accent" />
                          <span className="text-xs font-bold uppercase tracking-widest font-mono">
                            {session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-zinc-400">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span className="text-xs font-bold uppercase tracking-widest font-mono truncate">
                            {session.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Training CTA */}
        <section className="relative overflow-hidden rounded-[3rem] bg-zinc-900 border border-zinc-800 p-12 md:p-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 skew-x-12 translate-x-20" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                Ready to Join <br /> the <span className="text-accent text-glow">Arc Academy?</span>
              </h2>
              <p className="text-zinc-400 text-lg font-medium max-w-lg leading-relaxed">
                Our youth program is now accepting applications for the 2026 season. Train with professional coaches and elite athletes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-16 px-10 group" asChild>
                  <Link to="/join">
                    Apply Now
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-16 px-10" asChild>
                  <Link to="/contact">Contact Head Coach</Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { label: 'Drills', value: '150+' },
                { label: 'Coaches', value: '12' },
                { label: 'Courts', value: '4' },
                { label: 'Sessions', value: 'Weekly' },
              ].map((stat) => (
                <div key={stat.label} className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 text-center group hover:border-accent transition-colors">
                  <div className="text-3xl font-black italic text-zinc-50 group-hover:text-accent transition-colors tracking-tighter uppercase">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
