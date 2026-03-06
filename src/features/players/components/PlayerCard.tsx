import { Link } from 'react-router-dom';
import type { Player } from '@/services/playerService';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -12 }}
      className="group relative"
    >
      <Link to={`/players/${player.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-zinc-800 transition-all duration-500 group-hover:border-accent/50 group-hover:shadow-[0_0_50px_rgba(249,115,22,0.1)]">
          {/* Background Decorative Number */}
          <span className="absolute -bottom-4 -left-4 text-9xl font-black italic text-zinc-800/20 group-hover:text-accent/10 transition-colors pointer-events-none">
            #{player.number}
          </span>
          
          {/* Player Photo */}
          <img
            src={player.photo || 'https://images.unsplash.com/photo-1544606111-017d5c9f460e?q=80&w=1000&auto=format&fit=crop'}
            alt={player.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Player Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center space-x-2 mb-2">
              <span className="skew-tag bg-accent text-white py-0.5 px-3">
                {player.position}
              </span>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{player.height}</span>
            </div>
            
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white group-hover:text-accent transition-colors leading-none mb-4">
              {player.name}
            </h3>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Season PPG</span>
                <span className="text-xl font-black text-white italic">{player.points_per_game}</span>
              </div>
              <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
