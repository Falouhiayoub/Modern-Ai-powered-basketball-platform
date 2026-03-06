import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { matchService } from '@/services/matchService';
import type { Match } from '@/services/matchService';
import { Loader2, Calendar, MapPin, Trophy, ArrowLeft, Users, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

export function MatchDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: match, isLoading, error } = useQuery<Match | null>({
    queryKey: ['match', id],
    queryFn: () => matchService.getMatchById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs italic">Fetching Box Score...</p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <main className="pt-40 pb-20 px-4 max-w-7xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-20 text-center space-y-6">
          <p className="text-red-500 font-black uppercase text-3xl italic tracking-tighter leading-none">Match Data Not Found</p>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </main>
    );
  }

  const isFinished = match.status === 'finished';
  const isWinner = isFinished && (match.score_team || 0) > (match.score_opponent || 0);

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="flex justify-between items-center mb-12">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="group hover:bg-zinc-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Schedule
        </Button>
        <div className={cn(
          "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest",
          match.status === 'live' ? "bg-red-500 animate-pulse text-white shadow-xl shadow-red-500/20" : "bg-zinc-800 text-zinc-400"
        )}>
          {match.status}
        </div>
      </div>

      {/* Score Header */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 md:p-20 shadow-3xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-12 relative z-10">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-accent/20 rounded-3xl flex items-center justify-center p-6 mb-4">
              <Trophy className="w-full h-full text-accent" />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">Atlas Hoops</h2>
            <span className="text-zinc-600 font-bold uppercase tracking-widest text-xs italic">Home Team</span>
          </div>

          <div className="flex flex-col items-center space-y-8">
            {isFinished ? (
              <div className="flex items-center space-x-12">
                <span className={cn(
                  "text-8xl md:text-9xl font-black italic tracking-tighter tabular-nums",
                  isWinner ? "text-accent" : "text-zinc-700"
                )}>
                  {match.score_team}
                </span>
                <span className="text-zinc-800 text-5xl font-black italic">:</span>
                <span className={cn(
                  "text-8xl md:text-9xl font-black italic tracking-tighter tabular-nums",
                  !isWinner ? "text-zinc-50" : "text-zinc-700"
                )}>
                  {match.score_opponent}
                </span>
              </div>
            ) : (
              <div className="text-7xl font-black italic text-zinc-800 tracking-widest">VS</div>
            )}
            
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2 text-zinc-400 font-bold uppercase tracking-widest text-xs italic">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{new Date(match.date).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-400 font-bold uppercase tracking-widest text-xs italic">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{match.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-zinc-800 rounded-3xl flex items-center justify-center p-6 mb-4">
              <Trophy className="w-full h-full text-zinc-600" />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-400">{match.opponent}</h2>
            <span className="text-zinc-600 font-bold uppercase tracking-widest text-xs italic">Opponent</span>
          </div>
        </div>
      </section>

      {/* Match Statistics */}
      {isFinished && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <SectionHeader title="Top Performers" subtitle="Individual standouts driving the team victory." />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(match as any).match_stats?.slice(0, 4).map((stat: any, index: number) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex items-center space-x-6 hover:border-accent transition-colors group shadow-xl"
                >
                  <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-700 group-hover:border-accent transition-colors relative">
                    <Users className="w-10 h-10 text-zinc-700 group-hover:text-accent transition-colors" />
                    <span className="absolute -top-3 -right-3 bg-accent text-zinc-50 font-black italic text-xl px-2 py-1 rounded-lg shadow-lg">
                      #{stat.players?.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black italic uppercase tracking-tight mb-2 group-hover:text-accent transition-colors leading-none">
                      {stat.players?.name}
                    </h3>
                    <div className="flex items-center space-x-6 text-zinc-500 font-bold uppercase tracking-widest text-[10px] italic">
                      <span className="flex items-center space-x-1"><Zap className="w-3 h-3 text-accent" /> <span>{stat.points} PTS</span></span>
                      <span className="flex items-center space-x-1"><TrendingUp className="w-3 h-3 text-accent" /> <span>{stat.rebounds} REB</span></span>
                      <span>{stat.assists} AST</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <SectionHeader title="Team Impact" subtitle="Game dynamics summary." />
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 space-y-8 shadow-2xl">
              <div className="space-y-6">
                <h4 className="text-xs font-black italic uppercase tracking-widest text-zinc-600 mb-6">Game Flow</h4>
                <div className="space-y-4">
                  <StatBar label="Team Chemistry" value={88} color="bg-accent" />
                  <StatBar label="Fast Break Points" value={14} color="bg-blue-500" />
                  <StatBar label="Points in Paint" value={32} color="bg-zinc-700" />
                  <StatBar label="Three Point Accuracy" value={34} color="bg-zinc-50" />
                </div>
              </div>

              <div className="pt-8 border-t border-zinc-800 space-y-6">
                <h4 className="text-xs font-black italic uppercase tracking-widest text-zinc-600 mb-4 italic leading-none">Victory Recap</h4>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                  Atlas Hoops secured a decisive victory through disciplined defense and clinical finishing. 
                  The team controlled the paint from the second quarter onwards, limiting second-chance opportunities for the opponent.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black italic uppercase tracking-widest text-zinc-500 leading-none">{label}</span>
        <span className="text-sm font-black italic tracking-tighter leading-none">{value}%</span>
      </div>
      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          className={cn("h-full rounded-full shadow-lg", color)} 
        />
      </div>
    </div>
  );
}
