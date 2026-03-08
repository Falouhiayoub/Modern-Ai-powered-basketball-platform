import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { matchService } from '@/services/matchService';
import { storageService } from '@/services/storageService';
import type { Match } from '@/services/matchService';
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2,
  Trophy,
  Clock,
  MapPin,
  ExternalLink,
  X,
  Check,
  Zap,
  Upload,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ManageMatches() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const isInvalidKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.startsWith('sb_publishable_');

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    opponent: '',
    location: 'Atlas Arena, Casablanca',
    status: 'upcoming',
    score_team: 0,
    score_opponent: 0,
    stream_url: ''
  });

  const { data: upcoming, isLoading: loadingUpcoming } = useQuery<Match[]>({ queryKey: ['adminUpcoming'], queryFn: () => matchService.getUpcomingMatches() });
  const { data: past, isLoading: loadingPast } = useQuery<Match[]>({ queryKey: ['adminPast'], queryFn: () => matchService.getRecentResults() });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const publicUrl = await storageService.uploadImage('matches', file);
      setFormData(prev => ({ ...prev, stream_url: publicUrl }));
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (match: any) => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await matchService.createMatch(match);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUpcoming'] });
      queryClient.invalidateQueries({ queryKey: ['adminPast'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Create match error:', error);
      setMutationError(error.message || 'Failed to create match. Check database permissions.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Match> }) => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await matchService.updateMatch(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUpcoming'] });
      queryClient.invalidateQueries({ queryKey: ['adminPast'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Update match error:', error);
      setMutationError(error.message || 'Failed to update match.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await matchService.deleteMatch(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUpcoming'] });
      queryClient.invalidateQueries({ queryKey: ['adminPast'] });
      setIsDeleting(null);
    },
    onError: (err: any) => {
      setMutationError(err.message || 'Failed to delete match.');
    }
  });

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      opponent: '',
      location: 'Atlas Arena, Casablanca',
      status: 'upcoming',
      score_team: 0,
      score_opponent: 0
    });
    setEditingMatch(null);
  };

  const handleEdit = (match: Match) => {
    setMutationError(null);
    setEditingMatch(match);
    setFormData({
      date: new Date(match.date).toISOString().split('T')[0],
      opponent: match.opponent,
      location: match.location,
      status: match.status || 'upcoming',
      score_team: match.score_team || 0,
      score_opponent: match.score_opponent || 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Submitting match data:', formData);
      const payload = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };
      
      if (editingMatch) {
        updateMutation.mutate({ id: editingMatch.id, updates: payload });
      } else {
        createMutation.mutate(payload as any);
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      alert('Error preparing data: ' + err.message);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center space-x-4">
          <Calendar className="w-8 h-8 text-accent" />
          <SectionHeader 
            title="Manage Schedule" 
            subtitle="Coordinate upcoming battles and archive past scores." 
            className="mb-0"
          />
        </div>
        <Button size="lg" className="shadow-xl shadow-accent/20" onClick={() => { setMutationError(null); setIsModalOpen(true); }}>
          <Plus className="w-5 h-5 mr-2" />
          Schedule New Game
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Upcoming Table */}
        <section className="space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 italic flex items-center">
            <Clock className="w-4 h-4 mr-2 text-accent" />
            Upcoming Battles
          </h3>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-3xl">
            <div className="overflow-x-auto">
              {loadingUpcoming ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-12 h-12 text-accent animate-spin" />
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900 border-b border-zinc-800">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Date & Venue</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Opponent</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {upcoming?.map((match) => (
                      <tr key={match.id} className="hover:bg-zinc-800/30 transition-all group">
                        <td className="px-10 py-6">
                          <div className="space-y-1">
                            <p className="text-sm font-black italic uppercase tracking-tight text-zinc-50">{new Date(match.date).toLocaleDateString()}</p>
                            <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500 italic">
                              <MapPin className="w-3 h-3 mr-1 text-accent" />
                              {match.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <div className="flex items-center justify-center space-x-4">
                            <span className="text-xl font-black italic uppercase tracking-tighter text-zinc-50 group-hover:text-accent transition-colors leading-none">Atlas Hoops</span>
                            <span className="text-xs font-black text-zinc-800 italic uppercase">VS</span>
                            <span className="text-xl font-black italic uppercase tracking-tighter text-zinc-400 leading-none">{match.opponent}</span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-center">
                          <span className="inline-flex px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-[10px] font-black uppercase tracking-widest text-accent">
                            {match.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right space-x-2">
                           <button 
                            onClick={() => handleEdit(match)}
                            className="p-3 text-zinc-600 hover:text-accent transition-colors hover:bg-zinc-800 rounded-xl"
                           >
                            <Edit2 className="w-5 h-5" />
                           </button>
                           <button 
                            onClick={() => setIsDeleting(match.id)}
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
        </section>

        {/* Past Table */}
        <section className="space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 italic flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-accent" />
            Past Scores
          </h3>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-3xl opacity-80 hover:opacity-100 transition-opacity">
            <div className="overflow-x-auto">
              {loadingPast ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-12 h-12 text-accent animate-spin" />
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-900 border-b border-zinc-800">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Match</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Final Score</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Result</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {past?.map((match) => {
                      const isWinner = match.score_team > match.score_opponent;
                      return (
                        <tr key={match.id} className="hover:bg-zinc-800/30 transition-all group">
                          <td className="px-10 py-6">
                            <p className="text-sm font-black italic uppercase tracking-tighter text-zinc-50 leading-none">vs {match.opponent}</p>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 font-mono italic mt-1 block">{new Date(match.date).toLocaleDateString()}</span>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <span className={cn(
                              "text-3xl font-black italic tracking-tighter tabular-nums",
                              isWinner ? "text-accent" : "text-zinc-500"
                            )}>
                              {match.score_team} : {match.score_opponent}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-center">
                            <span className={cn(
                              "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                              isWinner ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                            )}>
                              {isWinner ? 'Victory' : 'Defeat'}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-right space-x-2">
                             <button 
                              onClick={() => handleEdit(match)}
                              className="p-3 text-zinc-600 hover:text-accent transition-colors hover:bg-zinc-800 rounded-xl"
                             >
                              <Edit2 className="w-5 h-5" />
                             </button>
                             <button 
                              onClick={() => setIsDeleting(match.id)}
                              className="p-3 text-zinc-600 hover:text-red-500 transition-colors hover:bg-zinc-800 rounded-xl"
                             >
                              <Trash2 className="w-5 h-5" />
                             </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[2rem] md:rounded-[3rem] shadow-3xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-8 md:mb-12">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <Zap className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
                      {editingMatch ? 'Update Match Details' : 'Schedule New Game'}
                    </h2>
                  </div>
                  <button onClick={() => { setIsModalOpen(false); setMutationError(null); }} className="p-2 md:p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl md:rounded-2xl transition-colors shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {mutationError && (
                  <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start space-x-4">
                    <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="text-sm font-black italic uppercase tracking-tight text-red-500">Operation Failed</p>
                      <p className="text-xs text-red-400/80 font-medium leading-relaxed">{mutationError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Match Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Opponent Name</label>
                    <input
                      required
                      value={formData.opponent}
                      onChange={e => setFormData({ ...formData, opponent: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors"
                      placeholder="e.g. Casablanca Kings"
                    />
                  </div>

                  <div className="space-y-2 md:space-y-4 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Venue / Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-zinc-600" />
                      <input
                        required
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-5 md:pr-6 text-sm focus:border-accent outline-none transition-colors"
                        placeholder="Atlas Arena, Casablanca"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Match Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors appearance-none"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="finished">Finished</option>
                      <option value="live">Live</option>
                    </select>
                  </div>

                  {formData.status === 'finished' && (
                    <div className="sm:col-span-2 grid grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-2 md:space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 text-accent">Atlas Hoops Score</label>
                        <input
                          type="number"
                          value={isNaN(formData.score_team) ? '' : formData.score_team}
                          onChange={e => setFormData({ ...formData, score_team: parseInt(e.target.value) || 0 })}
                          className="w-full bg-zinc-950 border-2 border-accent/20 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2 md:space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Opponent Score</label>
                        <input
                          type="number"
                          value={isNaN(formData.score_opponent) ? '' : formData.score_opponent}
                          onChange={e => setFormData({ ...formData, score_opponent: parseInt(e.target.value) || 0 })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 md:space-y-4 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 text-accent">Match Image / Cover</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Photo Preview */}
                      <div className="relative aspect-video rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden group">
                        {formData.stream_url ? (
                          <>
                            <img src={formData.stream_url} alt="Match Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, stream_url: '' }))}
                              className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-zinc-700">
                            <Camera className="w-8 h-8" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-sm">No Arena Image</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      <div className="space-y-4">
                        <div className="relative group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            disabled={uploading}
                          />
                          <div className={cn(
                            "w-full h-full min-h-[100px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all",
                            uploading ? "border-accent bg-accent/5 animate-pulse" : "border-zinc-800 bg-zinc-950 hover:border-accent hover:bg-accent/5"
                          )}>
                            {uploading ? (
                              <>
                                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-6 h-6 text-zinc-600 group-hover:text-accent transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-accent transition-colors">Select Poster</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="relative">
                          <input
                            value={formData.stream_url}
                            onChange={e => setFormData({ ...formData, stream_url: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-[10px] focus:border-accent outline-none transition-colors"
                            placeholder="...or paste Poster URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 pt-4 md:pt-6">
                    <Button 
                      type="submit" 
                      className="w-full py-6 md:py-8 text-base md:text-lg"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                      ) : (
                        <><Check className="w-4 md:w-5 h-4 md:h-5 mr-2" /> {editingMatch ? 'Update Battle Info' : 'Schedule Game'}</>
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
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Cancel Game?</h3>
                <p className="text-zinc-500 text-sm font-medium">This match will be permanently removed from the schedule.</p>
              </div>
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  className="bg-red-500 border-none hover:bg-red-600 text-white"
                  onClick={() => deleteMutation.mutate(isDeleting)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Cancellation'}
                </Button>
                <Button variant="ghost" onClick={() => setIsDeleting(null)}>Go Back</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
