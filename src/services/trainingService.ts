import { supabase } from './supabase';
import type { Database } from '@/types/database';

export type TrainingSession = Database['public']['Tables']['training_sessions']['Row'];

export const trainingService = {
  async getSessions() {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .eq('is_public', true)
      .order('day_of_week', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getAllSessionsAdmin() {
    const { data, error } = await supabase
      .from('training_sessions')
      .select('*')
      .order('day_of_week', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createSession(session: any) {
    const { data, error } = await supabase
      .from('training_sessions')
      .insert([session])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateSession(id: string, updates: any) {
    const { data, error } = await supabase
      .from('training_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSession(id: string) {
    const { error } = await supabase
      .from('training_sessions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
