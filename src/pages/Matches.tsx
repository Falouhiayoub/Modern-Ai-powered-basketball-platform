import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { MatchCard } from '@/features/matches/components/MatchCard';
import { matchService } from '@/services/matchService';
import type { Match } from '@/services/matchService';
import { Loader2, Calendar, Trophy, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Matches() {
  const isInvalidKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.startsWith('sb_publishable_');

  const { data: upcomingMatches, isLoading: upcomingLoading, error: upcomingError } = useQuery<Match[]>({
    queryKey: ['upcomingMatches'],
    queryFn: async () => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await matchService.getUpcomingMatches();
    },
  });

  const { data: pastMatches, isLoading: pastLoading, error: pastError } = useQuery<Match[]>({
    queryKey: ['pastMatches'],
    queryFn: async () => {
      console.log('Fetching past matches...');
      const data = await matchService.getRecentResults();
      console.log('Past matches received:', data);
      return data;
    },
  });

  return (
    <main className="relative min-h-screen bg-zinc-950 overflow-hidden">
      {/* Page Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/images/match.png" 
          alt="Basketball Arena" 
          className="w-full h-full object-cover opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-40">
        
        {/* Upcoming Section */}
        <section>
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <SectionHeader 
              title="Next Battles" 
              subtitle="Secure your spot in the arena." 
              className="mb-0"
            />
            <div className="flex items-center space-x-4 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
               <Zap className="w-8 h-8 text-accent fill-accent" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Buzzer Beater alert</span>
                  <span className="text-xl font-black italic text-white uppercase tracking-tighter">Tickets on sale now</span>
               </div>
            </div>
          </div>

          {upcomingLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </div>
          ) : upcomingError ? (
            <div className="glass-card p-12 text-center">
              <p className="text-red-500 font-bold uppercase tracking-widest italic mb-2">Error loading schedule</p>
              <p className="text-zinc-600 text-xs font-mono">{(upcomingError as any).message}</p>
            </div>
          ) : upcomingMatches?.length === 0 ? (
            <div className="glass-card p-24 text-center">
               <Calendar className="w-16 h-16 text-zinc-800 mx-auto mb-8 opacity-20" />
               <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No upcoming games scheduled.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {upcomingMatches?.map((match, index) => (
                <MatchCard key={match.id} match={match} featured={index === 0} />
              ))}
            </div>
          )}
        </section>

        {/* Past Matches Section */}
        <section>
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <SectionHeader 
              title="Season Results" 
              subtitle="Review the journey of Atlas Hoops." 
              className="mb-0"
            />
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
                <Trophy className="w-6 h-6 text-zinc-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Win Rate</span>
                <span className="text-2xl font-black italic text-white leading-none">85%</span>
              </div>
            </div>
          </div>

          {pastLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </div>
          ) : pastError ? (
            <div className="glass-card p-12 text-center">
              <p className="text-red-500 font-bold uppercase tracking-widest italic mb-2">Error loading results</p>
              <p className="text-zinc-600 text-xs font-mono">{(pastError as any).message}</p>
            </div>
          ) : pastMatches?.length === 0 ? (
            <div className="glass-card p-24 text-center">
               <Trophy className="w-16 h-16 text-zinc-800 mx-auto mb-8 opacity-20" />
               <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No match history available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {pastMatches?.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
