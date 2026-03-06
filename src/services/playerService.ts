import { supabase } from './supabase';
import type { Database } from '@/types/database';

export type Player = Database['public']['Tables']['players']['Row'];

export const playerService = {
  async getPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('is_active', true)
      .order('number', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getPlayerById(id: string) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPlayerStats(playerId: string) {
    const { data, error } = await supabase
      .from('match_stats')
      .select(`
        *,
        matches (
          date,
          opponent
        )
      `)
      .eq('player_id', playerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};
