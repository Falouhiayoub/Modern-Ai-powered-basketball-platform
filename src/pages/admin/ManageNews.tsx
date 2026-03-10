import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { newsService } from '@/services/newsService';
import { aiService } from '@/services/aiService';
import { matchService } from '@/services/matchService';
import type { NewsArticle } from '@/services/newsService';
import type { Match } from '@/services/matchService';
import { 
  Newspaper, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  Calendar,
  User,
  Eye,
  X,
  Check,
  Camera,
  Layout,
  Languages,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

export function ManageNews() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const isInvalidKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.startsWith('sb_publishable_');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    category: 'Team News',
    author_id: user?.id || ''
  });

  const { data: articles, isLoading, error: newsError } = useQuery<NewsArticle[]>({ 
    queryKey: ['adminNews'], 
    queryFn: async () => {
      console.log('Fetching admin news...', { isInvalidKey });
      if (isInvalidKey) return [];
      try {
        const data = await newsService.getNews(50);
        console.log('Admin news fetched:', data);
        return data;
      } catch (err: any) {
        console.error('Detailed Error fetching admin news:', err);
        throw err;
      }
    }
  });

  const createMutation = useMutation({
    mutationFn: async (article: any) => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await newsService.createArticle(article);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNews'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setMutationError(err.message || 'Failed to publish story. Check database permissions.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<NewsArticle> }) => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await newsService.updateArticle(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNews'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setMutationError(err.message || 'Failed to update story.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await newsService.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminNews'] });
      setIsDeleting(null);
    },
    onError: (err: any) => {
      setMutationError(err.message || 'Failed to delete story.');
    }
  });

  const filteredArticles = articles?.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTranslate = async (article: NewsArticle, lang: 'Arabic' | 'French' | 'English') => {
    setTranslatingId(`${article.id}-${lang}`);
    try {
      const translatedContent = await aiService.translateContent(article.content, lang);
      const translatedTitle = await aiService.translateContent(article.title, lang);
      
      await updateMutation.mutateAsync({ 
        id: article.id, 
        updates: { 
          title: translatedTitle.replace(/^#\s*/, '').trim(), // Clean up potential markdown title
          content: translatedContent 
        } 
      });
      alert(`Article translated to ${lang} successfully!`);
    } catch (err: any) {
      alert(`Translation failed: ${err.message}`);
    } finally {
      setTranslatingId(null);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      // Fetch latest finished match to summarize
      const pastMatches = await matchService.getRecentResults();
      if (!pastMatches?.[0]) {
        alert("No finished matches found to summarize.");
        return;
      }
      
      const summary = await aiService.generateMatchSummary(pastMatches[0]);
      
      // Update form with AI content
      setFormData({
        ...formData,
        title: `MATCH REPORT: Beyond the Arc vs ${pastMatches[0].opponent}`,
        content: summary,
        category: 'Match Report'
      });
      
    } catch (err: any) {
      alert(`Failed to generate report: ${err.message}`);
    } finally {
      setGeneratingReport(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: '',
      category: 'Team News',
      author_id: user?.id || ''
    });
    setEditingArticle(null);
  };

  const handleEdit = (article: NewsArticle) => {
    setMutationError(null);
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      image: article.image || '',
      category: article.category || 'Team News',
      author_id: article.author_id || user?.id || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMutationError(null);
    
    try {
      if (editingArticle) {
        await updateMutation.mutateAsync({ id: editingArticle.id, updates: formData });
      } else {
        await createMutation.mutateAsync(formData as any);
      }
    } catch (err: any) {
      setMutationError(err.message || 'Failed to publish story.');
    }
  };

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
        <Button size="lg" className="shadow-xl shadow-accent/20" onClick={() => { setMutationError(null); resetForm(); setIsModalOpen(true); }}>
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
          ) : newsError ? (
            <div className="p-12 text-center">
              <p className="text-red-500 font-black italic uppercase tracking-widest text-sm mb-2">Error loading newsroom</p>
              <p className="text-zinc-600 text-xs font-mono">{(newsError as any).message}</p>
            </div>
          ) : filteredArticles?.length === 0 ? (
            <div className="p-20 text-center text-zinc-500 font-bold italic uppercase tracking-widest text-xs">
              No news articles found.
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
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 font-mono italic">Admin Staff</span>
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
                       <div className="inline-flex bg-zinc-950 p-1 rounded-xl mr-2">
                         {['Arabic', 'French', 'English'].map((lang) => (
                           <button
                            key={lang}
                            disabled={!!translatingId}
                            onClick={() => handleTranslate(article, lang as any)}
                            className={cn(
                              "p-2 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-all",
                              translatingId === `${article.id}-${lang}` ? "text-accent" : "text-zinc-600"
                            )}
                            title={`Translate to ${lang}`}
                           >
                            {translatingId === `${article.id}-${lang}` ? <Loader2 className="w-3 h-3 animate-spin" /> : lang.substring(0, 2)}
                           </button>
                         ))}
                       </div>
                       <button className="p-3 text-zinc-600 hover:text-accent transition-colors hover:bg-zinc-800 rounded-xl">
                        <Eye className="w-5 h-5" />
                       </button>
                       <button 
                        onClick={() => handleEdit(article)}
                        className="p-3 text-zinc-600 hover:text-accent transition-colors hover:bg-zinc-800 rounded-xl"
                       >
                        <Edit2 className="w-5 h-5" />
                       </button>
                       <button 
                        onClick={() => setIsDeleting(article.id)}
                        className="p-3 text-zinc-600 hover:text-red-500 transition-colors hover:bg-zinc-800 rounded-xl"
                       >
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

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-[2rem] md:rounded-[3rem] shadow-3xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-center mb-8 md:mb-12">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                        <Layout className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
                        {editingArticle ? 'Edit Article' : 'Write New Story'}
                      </h2>
                    </div>
                    
                    {!editingArticle && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={generatingReport}
                        onClick={handleGenerateReport}
                        className="bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-white transition-all group shrink-0"
                      >
                        {generatingReport ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest italic">AI Match Report</span>
                      </Button>
                    )}
                    
                    <button onClick={() => { setIsModalOpen(false); setMutationError(null); }} className="p-2 md:p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl md:rounded-2xl transition-colors shrink-0">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                {mutationError && (
                  <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-4">
                    <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black italic uppercase tracking-tight text-red-500">Publication Failed</p>
                      <p className="text-xs text-red-400/80 font-medium leading-relaxed">{mutationError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                    <div className="space-y-2 md:space-y-4 sm:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Article Title</label>
                      <input
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-base md:text-lg font-black italic uppercase tracking-tight focus:border-accent outline-none transition-colors"
                        placeholder="e.g. Atlas Hoops Clinches Dramatic Overtime Victory"
                      />
                    </div>

                    <div className="space-y-2 md:space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors appearance-none"
                      >
                        <option>Team News</option>
                        <option>Match Report</option>
                        <option>Player Spotlight</option>
                        <option>Club Updates</option>
                        <option>Fans Corner</option>
                      </select>
                    </div>

                    <div className="space-y-2 md:space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Featured Image URL</label>
                      <div className="relative">
                        <Camera className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-zinc-600" />
                        <input
                          value={formData.image}
                          onChange={e => setFormData({ ...formData, image: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-5 md:pr-6 text-sm focus:border-accent outline-none transition-colors"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:space-y-4 sm:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Content (Markdown Supported)</label>
                      <textarea
                        required
                        rows={10}
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-[2rem] py-4 md:py-6 px-6 md:px-8 text-sm leading-relaxed focus:border-accent outline-none transition-colors resize-none"
                        placeholder="Write the story here..."
                      />
                    </div>
                  </div>

                  <div className="pt-4 md:pt-6">
                    <Button 
                      type="submit" 
                      className="w-full py-6 md:py-8 text-base md:text-lg"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                      ) : (
                        <><Check className="w-4 md:w-5 h-4 md:h-5 mr-2" /> {editingArticle ? 'Publish Updates' : 'Publish Story'}</>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-zinc-900 border border-zinc-800 p-12 rounded-[2.5rem] max-w-sm w-full text-center space-y-8"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Delete Article?</h3>
                <p className="text-zinc-500 text-sm font-medium">This story will be removed from the newsfeed permanently.</p>
              </div>
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  className="bg-red-500 border-none hover:bg-red-600 text-white"
                  onClick={() => deleteMutation.mutate(isDeleting)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Deletion'}
                </Button>
                <Button variant="ghost" onClick={() => setIsDeleting(null)}>Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
