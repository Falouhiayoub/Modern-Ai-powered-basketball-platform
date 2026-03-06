import { Link } from 'react-router-dom';
import type { NewsArticle } from '@/services/newsService';
import { Calendar, User, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full glass-card p-6 border-zinc-800/30 hover:border-accent/40 shadow-xl transition-all duration-500 overflow-hidden"
    >
      <Link to={`/news/${article.id}`} className="block relative overflow-hidden rounded-[2rem] aspect-[16/9] mb-8 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.1)]">
        <img
          src={article.image || 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1000&auto=format&fit=crop'}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="skew-tag bg-accent text-white py-1 px-4 text-[9px] font-black italic shadow-lg">
            {article.category}
          </span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col space-y-6">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
          <div className="flex items-center space-x-2">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-3.5 h-3.5 text-accent" />
            <span>Staff Writer</span>
          </div>
        </div>

        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-accent transition-colors leading-tight mb-4 line-clamp-2">
          {article.title}
        </h3>

        <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-3 mb-8">
          {article.content.substring(0, 150)}...
        </p>

        <div className="mt-auto pt-8 border-t border-zinc-800/50 flex items-center justify-between">
          <Link
            to={`/news/${article.id}`}
            className="flex items-center space-x-3 text-white font-black italic uppercase tracking-widest text-[10px] group/btn transition-all"
          >
            <span className="group-hover/btn:translate-x-1 transition-transform">Read Story</span>
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 group-hover/btn:bg-accent group-hover/btn:border-accent transition-all">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </Link>
          
          <button className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 hover:border-accent hover:text-accent transition-all text-zinc-600 shadow-xl group/share">
            <Share2 className="w-4 h-4 group-hover/share:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
