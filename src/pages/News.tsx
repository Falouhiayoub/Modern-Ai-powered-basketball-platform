import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { NewsCard } from '@/features/news/components/NewsCard';
import { newsService } from '@/services/newsService';
import type { NewsArticle } from '@/services/newsService';
import { Loader2, Newspaper } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

const CATEGORIES = ['All', 'Match Recap', 'Club News', 'Community', 'Recruitment'];

export function News() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: news, isLoading, error } = useQuery<NewsArticle[]>({
    queryKey: ['news', selectedCategory],
    queryFn: () => 
      selectedCategory === 'All' 
        ? newsService.getNews(20) 
        : newsService.getArticlesByCategory(selectedCategory),
  });

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center space-x-4">
          <Newspaper className="w-8 h-8 text-accent" />
          <SectionHeader 
            title="Team News" 
            subtitle="The latest stories, match reports, and announcements from Atlas Hoops." 
            className="mb-0"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                selectedCategory === cat 
                  ? "bg-accent text-zinc-50 shadow-lg shadow-accent/20" 
                  : "bg-zinc-900 text-zinc-500 hover:text-zinc-50 hover:bg-zinc-800"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs italic">Fetching Latest Stories...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-16 text-center">
          <p className="text-red-500 font-black uppercase italic tracking-tighter text-xl">Failed to load news</p>
          <p className="text-zinc-500 text-sm mt-2">Our reporters are on a break. Please check back later.</p>
        </div>
      ) : news?.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-16 text-center">
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm italic">No articles found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news?.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
