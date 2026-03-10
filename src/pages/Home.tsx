import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlayerCard } from '@/features/players/components/PlayerCard';
import { MatchCard } from '@/features/matches/components/MatchCard';
import { NewsCard } from '@/features/news/components/NewsCard';
import { Button } from '@/components/ui/Button';
import { playerService } from '@/services/playerService';
import type { Player } from '@/services/playerService';
import { matchService } from '@/services/matchService';
import type { Match } from '@/services/matchService';
import { newsService } from '@/services/newsService';
import type { NewsArticle } from '@/services/newsService';
import { Loader2, Calendar, Users, Newspaper, Trophy, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsletterSignup } from '@/features/fans/components/NewsletterSignup';
import { motion } from 'framer-motion';

export function Home() {
  const isInvalidKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.startsWith('sb_publishable_');

  const { data: players, isLoading: playersLoading, error: playersError } = useQuery<Player[]>({
    queryKey: ['topPlayers'],
    queryFn: async () => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await playerService.getPlayers();
    },
  });

  const { data: matches, isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: ['homeMatches'],
    queryFn: async () => {
      if (isInvalidKey) return [];
      return await matchService.getUpcomingMatches();
    },
  });

  const { data: news, isLoading: newsLoading, error: newsError } = useQuery<NewsArticle[]>({
    queryKey: ['homeNews'],
    queryFn: async () => {
      if (isInvalidKey) return [];
      return await newsService.getNews(3);
    },
  });

  return (
    <main className="basketball-mesh min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg.png" 
            alt="Basketball Arena" 
            className="w-full h-full object-cover grayscale opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950" />
        </div>

        {/* Background Court Lines Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] opacity-10 pointer-events-none z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full border-[2px] border-accent rounded-full -translate-y-1/2" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[800px] border-[2px] border-accent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-3 bg-accent/10 border border-accent/20 px-6 py-2 rounded-full"
          >
            <Zap className="w-4 h-4 text-accent fill-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Season 2026 Live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="block"
            >
              Beyond
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="text-accent text-glow"
            >
              The Arc
            </motion.span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Experience the pulse of Moroccan basketball. From the streets of Casablanca to the professional courts, we are the legacy of the game.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Button size="lg" className="h-16 px-12 text-lg group" asChild>
              <Link to="/players">
                Explore Roster
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-12 text-lg" asChild>
              <Link to="/matches">View Schedule</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-40">
        {/* Next Match Ticker/Banner */}
        {matches?.[0] && (
          <motion.section 
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-accent rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 transform -skew-x-2"
          >
            <div className="transform skew-x-2 space-y-2 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 italic">Upcoming Battle</span>
              <h2 className="text-4xl md:text-5xl text-white">vs {matches[0].opponent}</h2>
            </div>
            <div className="transform skew-x-2 flex flex-col items-center md:items-end space-y-4 text-center md:text-right">
              <div className="flex items-center space-x-2 text-white font-black italic">
                <Calendar className="w-5 h-5" />
                <span className="text-2xl uppercase tracking-tighter">{new Date(matches[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
              </div>
              <Button variant="secondary" className="bg-white text-accent hover:bg-zinc-100 border-none" asChild>
                <Link to={`/matches/${matches[0].id}`}>Get Tickets</Link>
              </Button>
            </div>
          </motion.section>
        )}

        {/* Players Section */}
        <section>
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <SectionHeader title="Star Athletes" subtitle="Meet the icons of Atlas Hoops." className="mb-0" />
            </div>
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link to="/players">View All <ChevronRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>
          
          {playersLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </div>
          ) : playersError ? (
            <div className="glass-card p-12 text-center">
              <p className="text-red-500 font-bold uppercase tracking-widest italic mb-2">Error loading athletes</p>
              <p className="text-zinc-600 text-xs font-mono">{(playersError as any).message}</p>
            </div>
          ) : players?.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-zinc-500 font-bold italic uppercase tracking-widest text-sm">No active athletes found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {players?.slice(0, 3).map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Promo */}
        <section className="relative overflow-hidden rounded-[4rem]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0 transform -skew-y-2 origin-left scale-110">
            <img 
              src="/images/court-crowd.jpg" 
              alt="Fans in Arena" 
              className="w-full h-full object-cover grayscale opacity-20"
            />
            <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center p-12 md:p-24">
            <div className="space-y-8">
              <div className="inline-block skew-tag">Join the Pride</div>
              <h2 className="text-5xl md:text-7xl leading-none">
                Never Miss <br /> A <span className="text-accent">Buzzer Beater</span>
              </h2>
              <p className="text-zinc-400 text-lg font-medium max-w-lg">
                Exclusive match summaries, player interviews, and early access to Atlas Hoops merchandise.
              </p>
            </div>
            <NewsletterSignup />
          </div>
        </section>

        {/* News Section */}
        <section>
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-accent" />
              </div>
              <SectionHeader title="Latest Stories" subtitle="From the court to the community." className="mb-0" />
            </div>
            <Button variant="ghost" asChild>
              <Link to="/news">Archive <ChevronRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>
          
          {newsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </div>
          ) : newsError ? (
            <div className="glass-card p-12 text-center">
              <p className="text-red-500 font-bold uppercase tracking-widest italic mb-2">Error loading news</p>
              <p className="text-zinc-600 text-xs font-mono">{(newsError as any).message}</p>
            </div>
          ) : news?.length === 0 ? (
             <div className="glass-card p-12 text-center">
              <p className="text-zinc-500 font-bold italic uppercase tracking-widest text-sm">No recent stories published.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news?.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
