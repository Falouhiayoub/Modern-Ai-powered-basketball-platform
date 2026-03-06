import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { newsService } from '@/services/newsService';
import type { NewsArticle } from '@/services/newsService';
import { Loader2, Calendar, User, Share2, Facebook, Twitter, Instagram, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

import { SEO } from '@/components/layout/SEO';

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  // In this implementation, we use ID because slug would require a separate route logic
  // But our newsService supports bySlug. For simplicity in this demo, let's use ID or SLUG
  const { data: article, isLoading, error } = useQuery<NewsArticle | null>({
    queryKey: ['article', id],
    queryFn: () => newsService.getArticleBySlug(id!), // Fallback to id if not a slug
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs italic">Loading Article Content...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <main className="pt-40 pb-20 px-4 max-w-7xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-20 text-center space-y-6">
          <p className="text-red-500 font-black uppercase text-3xl italic tracking-tighter leading-none">Article Not Found</p>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
      <SEO 
        title={article.title}
        description={article.content.substring(0, 160)}
        image={article.image || undefined}
        type="article"
      />
      <Button 
        variant="ghost" 
        onClick={() => window.history.back()}
        className="group hover:bg-zinc-800"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to News
      </Button>

      {/* Hero Section */}
      <section className="space-y-10">
        <div className="space-y-6 text-center md:text-left">
          <div className="bg-accent text-zinc-50 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest inline-block shadow-lg shadow-accent/20">
            {article.category || 'Match News'}
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 py-6 border-y border-zinc-800">
            <div className="flex items-center space-x-2 text-zinc-500">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">
                {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-500">
              <User className="w-4 h-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono">
                Written by {(article as any).author || 'Club Editor'}
              </span>
            </div>
          </div>
        </div>

        {article.image ? (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-video w-full rounded-[3rem] overflow-hidden shadow-3xl border border-zinc-800"
          >
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </motion.div>
        ) : (
          <div className="aspect-video w-full bg-zinc-900 border border-zinc-800 rounded-[3rem] flex items-center justify-center p-20">
             <div className="w-full h-full border-2 border-dashed border-zinc-800 rounded-3xl flex items-center justify-center">
              <span className="text-zinc-800 font-black italic uppercase tracking-tighter text-8xl opacity-10 select-none">
                Atlas Hoops News
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Article Content */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-16 relative">
        <div className="lg:col-span-3 space-y-12">
          <div className="prose prose-invert prose-zinc max-w-none">
            {article.content.split('\n').map((paragraph, i) => (
              <p key={i} className="text-zinc-400 text-xl leading-relaxed font-medium mb-8">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-12 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] gap-8">
            <div className="space-y-2 text-center sm:text-left">
              <h4 className="text-xl font-black italic uppercase tracking-tight">Share this story</h4>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Help us grow the fanbase</p>
            </div>
            <div className="flex space-x-4">
              <SocialShareBtn icon={<Facebook className="w-5 h-5" />} color="bg-[#1877F2]" />
              <SocialShareBtn icon={<Twitter className="w-5 h-5" />} color="bg-[#1DA1F2]" />
              <SocialShareBtn icon={<Instagram className="w-5 h-5" />} color="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]" />
              <SocialShareBtn icon={<Share2 className="w-5 h-5" />} color="bg-accent" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-12 hidden lg:block sticky top-32 h-fit">
          <div className="space-y-6 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8">
            <h4 className="text-[10px] font-black italic uppercase tracking-widest text-zinc-500">Related Articles</h4>
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent mb-1 block">Recap</span>
                  <p className="text-sm font-black italic uppercase tracking-tight leading-none group-hover:text-accent transition-colors">
                    The road to the championship continues...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function SocialShareBtn({ icon, color }: { icon: React.ReactNode; color: string }) {
  return (
    <button className={`${color} p-4 rounded-2xl text-zinc-50 shadow-lg hover:scale-110 active:scale-95 transition-all`}>
      {icon}
    </button>
  );
}
