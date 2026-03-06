import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { playerService } from '@/services/playerService';
import type { Player } from '@/services/playerService';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Loader2,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { cn } from '@/utils/cn';

export function ManagePlayers() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: players, isLoading } = useQuery<Player[]>({ 
    queryKey: ['adminPlayers'], 
    queryFn: () => playerService.getPlayers() 
  });

  const filteredPlayers = players?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center space-x-4">
          <Users className="w-8 h-8 text-accent" />
          <SectionHeader 
            title="Manage Roster" 
            subtitle={`Currently tracking ${players?.length || 0} elite athletes.`} 
            className="mb-0"
          />
        </div>
        <Button size="lg" className="shadow-xl shadow-accent/20">
          <Plus className="w-5 h-5 mr-2" />
          Draft New Player
        </Button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-3xl">
        {/* Table Controls */}
        <div className="p-6 md:p-10 border-b border-zinc-800 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-800 text-zinc-50"
            />
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" size="sm" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2 text-zinc-600" />
              Filter
            </Button>
          </div>
        </div>

        {/* Players Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Syncing Roster...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Player</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Position</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Stats (PPG)</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredPlayers?.map((player) => (
                  <tr key={player.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 group-hover:border-accent transition-colors flex items-center justify-center relative shadow-sm">
                           {player.photo ? (
                            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                           ) : (
                            <User className="w-6 h-6 text-zinc-700" />
                           )}
                           <span className="absolute -top-2 -right-2 bg-accent text-zinc-50 font-black italic text-sm px-2 py-1 rounded-lg shadow-xl">
                            #{player.number}
                           </span>
                        </div>
                        <div>
                          <p className="text-lg font-black italic uppercase tracking-tighter text-zinc-50 group-hover:text-accent transition-colors leading-none mb-1">{player.name}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono italic leading-none">{player.nationality || 'Moroccan'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="inline-flex px-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        {player.position}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center font-black italic text-2xl text-accent tabular-nums">
                      {player.points_per_game}
                    </td>
                    <td className="px-10 py-6 text-center">
                       <span className={cn(
                        "inline-flex w-3 h-3 rounded-full animate-pulse",
                        player.is_active ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                       )} />
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
    </div>
  );
}
