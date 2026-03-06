import { supabase } from './supabase';
import type { Database } from '@/types/database';

export type Match = Database['public']['Tables']['matches']['Row'];

export const matchService = {
  async getUpcomingMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'upcoming')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getRecentResults() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'finished')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getMatchById(id: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        match_stats (
          *,
          players (
            name,
            number,
            position
          )
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
};
