import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlayerCard } from '@/features/players/components/PlayerCard';
import { playerService } from '@/services/playerService';
import type { Player } from '@/services/playerService';
import { Loader2, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function Players() {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');

  const { data: players, isLoading, error } = useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: () => playerService.getPlayers(),
  });

  const filteredPlayers = players?.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'All' || player.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  const positions = ['All', 'Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Active Roster" 
          subtitle="The elite athletes of Atlas Hoops." 
          align="center"
        />

        {/* Filters & Search */}
        <div className="glass-card p-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-accent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {positions.map((pos) => (
              <button
                key={pos}
                onClick={() => setPositionFilter(pos)}
                className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  positionFilter === pos 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
          </div>
        ) : error ? (
          <div className="glass-card p-12 text-center">
            <p className="text-zinc-400 font-bold uppercase tracking-widest italic">Unable to load roster.</p>
          </div>
        ) : filteredPlayers?.length === 0 ? (
          <div className="glass-card p-12 text-center">
             <p className="text-zinc-400 font-bold uppercase tracking-widest italic text-sm">No players found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredPlayers?.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
