import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { playerService } from '@/services/playerService';
import type { Player } from '@/services/playerService';
import { Loader2, User, Ruler, Activity, Award, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

import { SEO } from '@/components/layout/SEO';

export function PlayerProfile() {
  const { id } = useParams<{ id: string }>();

  const { data: player, isLoading, error } = useQuery<Player | null>({
    queryKey: ['player', id],
    queryFn: () => playerService.getPlayerById(id!),
    enabled: !!id,
  });

  const { data: stats } = useQuery<any[]>({
    queryKey: ['playerStats', id],
    queryFn: () => playerService.getPlayerStats(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Fetching Athlete Data...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <main className="pt-40 pb-20 px-4 max-w-7xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-20 text-center space-y-6">
          <p className="text-red-500 font-black uppercase text-3xl italic tracking-tighter">Athlete Not Found</p>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <SEO 
        title={`${player.name} | Athlete Profile`}
        description={`Meet ${player.name} (#${player.number}), ${player.position} for Atlas Hoops. Height: ${player.height}, PPG: ${player.points_per_game}.`}
        type="profile"
      />
      {/* Profile Header */}
      <section className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 md:p-16 shadow-3xl">
        <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none">
          <span className="text-[20rem] font-black italic uppercase leading-none select-none">
            #{player.number}
          </span>
        </div>

        <div className="relative flex flex-col md:flex-row gap-12 items-center md:items-start">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[400px] aspect-[3/4] bg-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-700"
          >
            {player.photo ? (
              <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-32 h-32 text-zinc-700" />
              </div>
            )}
          </motion.div>

          <div className="flex-1 space-y-8 w-full text-center md:text-left">
            <div>
              <div className="inline-flex bg-accent text-zinc-50 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 shadow-lg shadow-accent/20">
                {player.position} • #{player.number}
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none group-hover:text-accent transition-colors">
                {player.name}
              </h1>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <StatItem icon={<Ruler className="w-5 h-5" />} label="Height" value={player.height || 'N/A'} />
              <StatItem icon={<Calendar className="w-5 h-5" />} label="Age" value={player.age?.toString() || 'N/A'} />
              <StatItem icon={<Activity className="w-5 h-5" />} label="Points (PPG)" value={player.points_per_game.toString()} highlight />
              <StatItem icon={<Award className="w-5 h-5" />} label="Assists (APG)" value={player.assists_per_game.toString()} />
            </div>

            <div className="pt-8 border-t border-zinc-800 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 italic">Athlete Bio</h3>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                {player.bio || `${player.name} is a professional ${player.position} playing for Atlas Hoops in the Moroccan League. Known for exceptional athleticism and team leadership.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Stats / Recent Games */}
      <section className="space-y-12">
        <SectionHeader title="Game Logs" subtitle="Recent performance and match highlights." />
        
        {stats && stats.length > 0 ? (
          <div className="overflow-x-auto rounded-[2rem] border border-zinc-800 bg-zinc-900/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Date / Opponent</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">PTS</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">REB</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">AST</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">MIN</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {stats.map((stat) => (
                  <tr key={stat.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                          {new Date(stat.matches?.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-black italic uppercase tracking-tight group-hover:text-accent transition-colors">
                          vs {stat.matches?.opponent}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center text-lg font-black italic text-zinc-50">{stat.points}</td>
                    <td className="px-8 py-6 text-center text-lg font-black italic text-zinc-400">{stat.rebounds}</td>
                    <td className="px-8 py-6 text-center text-lg font-black italic text-zinc-400">{stat.assists}</td>
                    <td className="px-8 py-6 text-center text-lg font-black italic text-zinc-400">{stat.minutes_played}m</td>
                    <td className="px-8 py-6 text-right">
                      <Button variant="ghost" size="sm" className="rounded-xl group/btn">
                        Details <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-zinc-800 mx-auto" />
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm italic">No career logs available yet.</p>
          </div>
        )}
      </section>
    </main>
  );
}

function StatItem({ icon, label, value, highlight = false }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  highlight?: boolean 
}) {
  return (
    <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-2xl p-6 flex items-center space-x-4 shadow-sm hover:border-zinc-700 transition-colors">
      <div className={`p-3 rounded-xl ${highlight ? 'bg-accent/20 text-accent' : 'bg-zinc-800 text-zinc-500'}`}>
        {icon}
      </div>
      <div>
        <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">{label}</span>
        <span className={`text-2xl font-black italic uppercase tracking-tighter ${highlight ? 'text-accent' : 'text-zinc-50'}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
