import { supabase } from './supabase';
import type { Database } from '@/types/database';

export type NewsArticle = Database['public']['Tables']['news']['Row'];

export const newsService = {
  async getNews(limit = 10) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  },

  async getArticleBySlug(slug: string) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getArticlesByCategory(category: string) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', category)
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
};
