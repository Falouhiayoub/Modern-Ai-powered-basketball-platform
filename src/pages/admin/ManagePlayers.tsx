import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { playerService } from '@/services/playerService';
import { storageService } from '@/services/storageService';
import type { Player } from '@/services/playerService';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Loader2,
  User,
  X,
  Camera,
  Check,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export function ManagePlayers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const isInvalidKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.startsWith('sb_publishable_');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    number: 0,
    position: 'Point Guard',
    height: '',
    age: 20,
    photo: '',
    points_per_game: 0,
    is_active: true
  });

  const { data: players, isLoading } = useQuery<Player[]>({ 
    queryKey: ['adminPlayers'], 
    queryFn: async () => {
      if (isInvalidKey) return [];
      return await playerService.getPlayers();
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const publicUrl = await storageService.uploadImage('players', file);
      setFormData(prev => ({ ...prev, photo: publicUrl }));
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (player: any) => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await playerService.createPlayer(player);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlayers'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setMutationError(err.message || 'Failed to draft player. Check database permissions.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Player> }) => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await playerService.updatePlayer(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlayers'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      setMutationError(err.message || 'Failed to update player.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isInvalidKey) {
        throw new Error('Invalid Supabase Key: You are using a Stripe key instead of a Supabase Anon key.');
      }
      return await playerService.deletePlayer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPlayers'] });
      setIsDeleting(null);
    },
    onError: (err: any) => {
      setMutationError(err.message || 'Failed to release player.');
    }
  });

  const filteredPlayers = players?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      number: 0,
      position: 'Point Guard',
      height: '',
      age: 20,
      photo: '',
      points_per_game: 0,
      is_active: true
    });
    setEditingPlayer(null);
  };

  const handleEdit = (player: Player) => {
    setMutationError(null);
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      number: player.number,
      position: player.position,
      height: player.height || '',
      age: player.age || 20,
      photo: player.photo || '',
      points_per_game: Number(player.points_per_game),
      is_active: player.is_active || true
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      updateMutation.mutate({ id: editingPlayer.id, updates: formData });
    } else {
      createMutation.mutate(formData as any);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center space-x-4">
          <Users className="w-8 h-8 text-accent" />
          <SectionHeader 
            title="Manage Roster" 
            subtitle={`Currently tracking ${players?.length || 0} elite athletes.`} 
            className="mb-0"
          />
        </div>
        <Button size="lg" className="shadow-xl shadow-accent/20" onClick={() => { setMutationError(null); setIsModalOpen(true); }}>
          <Plus className="w-5 h-5 mr-2" />
          Draft New Player
        </Button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-3xl">
        {/* Table Controls */}
        <div className="p-6 md:p-10 border-b border-zinc-800 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-800 text-zinc-50"
            />
          </div>
        </div>

        {/* Players Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Syncing Roster...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Player</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Position</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Stats (PPG)</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredPlayers?.map((player) => (
                  <tr key={player.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 group-hover:border-accent transition-colors flex items-center justify-center relative shadow-sm">
                           {player.photo ? (
                            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                           ) : (
                            <User className="w-6 h-6 text-zinc-700" />
                           )}
                           <span className="absolute -top-2 -right-2 bg-accent text-zinc-50 font-black italic text-sm px-2 py-1 rounded-lg shadow-xl">
                            #{player.number}
                           </span>
                        </div>
                        <div>
                          <p className="text-lg font-black italic uppercase tracking-tighter text-zinc-50 group-hover:text-accent transition-colors leading-none mb-1">{player.name}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono italic leading-none">{player.age} Years Old • {player.height}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="inline-flex px-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        {player.position}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center font-black italic text-2xl text-accent tabular-nums">
                      {player.points_per_game}
                    </td>
                    <td className="px-10 py-6 text-center">
                       <span className={cn(
                        "inline-flex w-3 h-3 rounded-full animate-pulse",
                        player.is_active ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                       )} />
                    </td>
                    <td className="px-10 py-6 text-right space-x-2">
                       <button 
                        onClick={() => handleEdit(player)}
                        className="p-3 text-zinc-600 hover:text-accent transition-colors hover:bg-zinc-800 rounded-xl"
                       >
                        <Edit2 className="w-5 h-5" />
                       </button>
                       <button 
                        onClick={() => setIsDeleting(player.id)}
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

      {/* Draft/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[2rem] md:rounded-[3rem] shadow-3xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-12 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-8 md:mb-12">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-accent/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <Plus className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
                      {editingPlayer ? 'Modify Athlete' : 'Draft New Athlete'}
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
                  <div className="space-y-2 md:space-y-4 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Full Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors"
                      placeholder="e.g. Hakim Ziyech"
                    />
                  </div>

                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Jersey Number</label>
                    <input
                      type="number"
                      required
                      value={isNaN(formData.number) ? '' : formData.number}
                      onChange={e => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Position</label>
                    <select
                      value={formData.position}
                      onChange={e => setFormData({ ...formData, position: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors appearance-none"
                    >
                      <option>Point Guard</option>
                      <option>Shooting Guard</option>
                      <option>Small Forward</option>
                      <option>Power Forward</option>
                      <option>Center</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Height (cm)</label>
                    <input
                      value={formData.height}
                      onChange={e => setFormData({ ...formData, height: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors"
                      placeholder="e.g. 198cm"
                    />
                  </div>

                  <div className="space-y-2 md:space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Season PPG</label>
                    <input
                      type="number"
                      step="0.1"
                      value={isNaN(formData.points_per_game) ? '' : formData.points_per_game}
                      onChange={e => setFormData({ ...formData, points_per_game: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl py-3 md:py-4 px-5 md:px-6 text-sm focus:border-accent outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2 md:space-y-4 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Photo</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Photo Preview */}
                      <div className="relative aspect-video rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden group">
                        {formData.photo ? (
                          <>
                            <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                              className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 text-zinc-700">
                            <Camera className="w-8 h-8" />
                            <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
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
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-accent transition-colors">Upload Image</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="relative">
                          <input
                            value={formData.photo}
                            onChange={e => setFormData({ ...formData, photo: e.target.value })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 px-4 text-[10px] focus:border-accent outline-none transition-colors"
                            placeholder="...or paste Image URL"
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
                        <><Check className="w-4 md:w-5 h-4 md:h-5 mr-2" /> {editingPlayer ? 'Update Roster' : 'Confirm Draft'}</>
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
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Release Player?</h3>
                <p className="text-zinc-500 text-sm font-medium">This athlete will be removed from the active roster permanently.</p>
              </div>
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  className="bg-red-500 border-none hover:bg-red-600 text-white"
                  onClick={() => deleteMutation.mutate(isDeleting)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Release'}
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
