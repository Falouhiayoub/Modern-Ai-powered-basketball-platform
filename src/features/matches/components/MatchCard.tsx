import { Link } from 'react-router-dom';
import type { Match } from '@/services/matchService';
import { Calendar, MapPin, Trophy, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface MatchCardProps {
  match: Match;
  featured?: boolean;
}

export function MatchCard({ match, featured = false }: MatchCardProps) {
  const isFinished = match.status === 'finished';
  const isWin = isFinished && match.score_team > match.score_opponent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative glass-card p-10 overflow-hidden",
        featured && "border-accent/40 bg-zinc-950/80 ring-1 ring-accent/20"
      )}
    >
      {/* Background Court Line Segment */}
      <div className="absolute -top-10 -right-10 w-40 h-40 border-4 border-accent/5 rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic mb-1">Match Event</span>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm font-black text-white italic">
                {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
          <div className={cn(
            "skew-tag px-4 py-1.5",
            isFinished ? (isWin ? "bg-emerald-500/20 text-emerald-500" : "bg-zinc-800 text-zinc-400") : "bg-accent text-white"
          )}>
            {match.status === 'upcoming' ? 'Upcoming' : isWin ? 'Victory' : 'Defeat'}
          </div>
        </div>

        <div className="flex items-center justify-between flex-1 py-12 border-y border-zinc-800/50">
          <div className="flex flex-col items-center flex-1 space-y-4 text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-[1.5rem] border border-zinc-800 flex items-center justify-center shadow-xl group-hover:border-accent/30 transition-colors">
              <Trophy className="w-10 h-10 text-zinc-700" />
            </div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-white">Atlas Hoops</span>
          </div>

          <div className="px-8 flex flex-col items-center space-y-2">
            {isFinished ? (
              <div className="flex items-center space-x-4">
                <span className={cn("text-6xl font-black italic text-white drop-shadow-lg", isWin ? "text-accent" : "text-zinc-400")}>{match.score_team}</span>
                <span className="text-2xl font-black text-zinc-700">:</span>
                <span className={cn("text-6xl font-black italic text-white drop-shadow-lg", !isWin ? "text-accent" : "text-zinc-400")}>{match.score_opponent}</span>
              </div>
            ) : (
              <div className="bg-zinc-900 px-6 py-2 rounded-full border border-zinc-800 flex items-center space-x-2 animate-pulse">
                <Zap className="w-4 h-4 text-accent fill-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Battle Ready</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center flex-1 space-y-4 text-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-[1.5rem] border border-zinc-800 flex items-center justify-center shadow-xl group-hover:border-accent/30 transition-colors">
              <Trophy className="w-10 h-10 text-zinc-700" />
            </div>
            <span className="text-xl font-black italic uppercase tracking-tighter text-zinc-400">{match.opponent}</span>
          </div>
        </div>

        <div className="mt-8 pt-8 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-zinc-500">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">{match.location}</span>
          </div>
          <Link
            to={`/matches/${match.id}`}
            className="flex items-center space-x-2 text-accent hover:text-white font-black italic uppercase tracking-widest text-[10px] group/btn transition-colors"
          >
            <span>Match Report</span>
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 group-hover/btn:bg-accent group-hover/btn:border-accent transition-all">
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
