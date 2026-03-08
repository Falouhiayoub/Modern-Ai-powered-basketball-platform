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

  async createMatch(match: Database['public']['Tables']['matches']['Insert']) {
    const { data, error } = await supabase
      .from('matches')
      .insert([match])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateMatch(id: string, updates: Database['public']['Tables']['matches']['Update']) {
    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteMatch(id: string) {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};
