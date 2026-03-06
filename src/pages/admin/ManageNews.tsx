import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { newsService } from '@/services/newsService';
import type { NewsArticle } from '@/services/newsService';
import { 
  Newspaper, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  Calendar,
  User,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function ManageNews() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: articles, isLoading } = useQuery<NewsArticle[]>({ 
    queryKey: ['adminNews'], 
    queryFn: () => newsService.getNews(50) 
  });

  const filteredArticles = articles?.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center space-x-4">
          <Newspaper className="w-8 h-8 text-accent" />
          <SectionHeader 
            title="Manage Stories" 
            subtitle={`Editing ${articles?.length || 0} published articles.`} 
            className="mb-0"
          />
        </div>
        <Button size="lg" className="shadow-xl shadow-accent/20">
          <Plus className="w-5 h-5 mr-2" />
          Write New Story
        </Button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-3xl">
        <div className="p-6 md:p-10 border-b border-zinc-800 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-800 text-zinc-50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Syncing Newsroom...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Article</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Category</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Published</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredArticles?.map((article) => (
                  <tr key={article.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-6 max-w-md">
                        <div className="w-20 h-14 bg-zinc-800 rounded-xl overflow-hidden shrink-0 border border-zinc-700 group-hover:border-accent transition-colors">
                           {article.image && <img src={article.image} alt={article.title} className="w-full h-full object-cover" />}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-black italic uppercase tracking-tight text-zinc-50 group-hover:text-accent transition-colors truncate">{article.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <User className="w-3 h-3 text-zinc-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 font-mono italic">{(article as any).author || 'Staff'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="inline-flex px-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black italic uppercase tracking-tighter text-zinc-50 leading-none">{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                        <div className="flex items-center text-[8px] font-bold uppercase tracking-widest text-zinc-600 mt-1">
                          <Calendar className="w-2 h-2 mr-1" />
                          LIVE
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right space-x-2">
                       <button className="p-3 text-zinc-600 hover:text-accent transition-colors hover:bg-zinc-800 rounded-xl">
                        <Eye className="w-5 h-5" />
                       </button>
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
