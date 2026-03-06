import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { matchService } from '@/services/matchService';
import type { Match } from '@/services/matchService';
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2,
  Trophy,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

export function ManageMatches() {
  const { data: upcoming, isLoading: loadingUpcoming } = useQuery<Match[]>({ queryKey: ['adminUpcoming'], queryFn: () => matchService.getUpcomingMatches() });
  const { data: past, isLoading: loadingPast } = useQuery<Match[]>({ queryKey: ['adminPast'], queryFn: () => matchService.getRecentResults() });

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center space-x-4">
          <Calendar className="w-8 h-8 text-accent" />
          <SectionHeader 
            title="Manage Schedule" 
            subtitle="Coordinate upcoming battles and archive past scores." 
            className="mb-0"
          />
        </div>
        <Button size="lg" className="shadow-xl shadow-accent/20">
          <Plus className="w-5 h-5 mr-2" />
          Schedule New Game
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Upcoming Table */}
        <section className="space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 italic flex items-center">
            <Clock className="w-4 h-4 mr-2 text-accent" />
            Upcoming Battles
          </h3>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-3xl">
            <div className="overflow-x-auto">
              {loadingUpcoming ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-12 h-12 text-accent animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Syncing Schedule...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900 border-b border-zinc-800">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Date & Venue</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Opponent</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {upcoming?.map((match) => (
                      <tr key={match.id} className="hover:bg-zinc-800/30 transition-all group">
                        <td className="px-10 py-6">
                          <div className="space-y-1">
                            <p className="text-sm font-black italic uppercase tracking-tight text-zinc-50">{new Date(match.date).toLocaleDateString()}</p>
                            <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic">
                              <MapPin className="w-3 h-3 mr-1 text-accent" />
                              {match.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <div className="flex items-center justify-center space-x-4">
                            <span className="text-xl font-black italic uppercase tracking-tighter text-zinc-50 group-hover:text-accent transition-colors leading-none">Atlas Hoops</span>
                            <span className="text-xs font-black text-zinc-800 italic uppercase">VS</span>
                            <span className="text-xl font-black italic uppercase tracking-tighter text-zinc-400 leading-none">{match.opponent}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <span className="inline-flex px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black uppercase tracking-widest text-accent">
                            {match.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right space-x-2">
                           <button className="p-3 text-zinc-600 hover:text-accent transition-colors hover:bg-zinc-800 rounded-xl">
                            <Edit2 className="w-5 h-5" />
                           </button>
                           <button className="p-3 text-zinc-600 hover:text-red-500 transition-colors hover:bg-zinc-800 rounded-xl">
                            <Trash2 className="w-5 h-5" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        {/* Past Table */}
        <section className="space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 italic flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-accent" />
            Past Scores
          </h3>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-3xl opacity-80 hover:opacity-100 transition-opacity">
            <div className="overflow-x-auto">
              {loadingPast ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-12 h-12 text-accent animate-spin" />
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900 border-b border-zinc-800">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Match</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Final Score</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Result</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {past?.map((match) => {
                      const isWinner = match.score_team > match.score_opponent;
                      return (
                        <tr key={match.id} className="hover:bg-zinc-800/30 transition-all group">
                          <td className="px-10 py-6">
                            <p className="text-sm font-black italic uppercase tracking-tighter text-zinc-50 leading-none">vs {match.opponent}</p>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 font-mono italic mt-1 block">{new Date(match.date).toLocaleDateString()}</span>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <span className={cn(
                              "text-3xl font-black italic tracking-tighter tabular-nums",
                              isWinner ? "text-accent" : "text-zinc-500"
                            )}>
                              {match.score_team} : {match.score_opponent}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <span className={cn(
                              "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                              isWinner ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                            )}>
                              {isWinner ? 'Victory' : 'Defeat'}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <button className="p-3 text-zinc-600 hover:text-accent transition-colors hover:bg-zinc-800 rounded-xl">
                              <ExternalLink className="w-5 h-5" />
                             </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
