import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { trainingService } from '@/services/trainingService';
import type { TrainingSession } from '@/services/trainingService';
import { 
  Dumbbell, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Loader2,
  Clock,
  MapPin,
  X,
  Check,
  Layout,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export function ManageTraining() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day_of_week: 'Monday',
    start_time: '18:00',
    end_time: '20:00',
    location: 'Atlas Arena, Casablanca',
    category: 'Team Practice',
    is_public: true
  });

  const { data: sessions, isLoading, error: fetchError } = useQuery<TrainingSession[]>({ 
    queryKey: ['adminTraining'], 
    queryFn: () => trainingService.getAllSessionsAdmin() 
  });

  const createMutation = useMutation({
    mutationFn: trainingService.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTraining'] });
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => setMutationError(err.message)
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => trainingService.updateSession(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTraining'] });
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err: any) => setMutationError(err.message)
  });

  const deleteMutation = useMutation({
    mutationFn: trainingService.deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTraining'] });
      queryClient.invalidateQueries({ queryKey: ['trainingSessions'] });
      setIsDeleting(null);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      day_of_week: 'Monday',
      start_time: '18:00',
      end_time: '20:00',
      location: 'Atlas Arena, Casablanca',
      category: 'Team Practice',
      is_public: true
    });
    setEditingSession(null);
    setMutationError(null);
  };

  const handleEdit = (session: TrainingSession) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description || '',
      day_of_week: session.day_of_week,
      start_time: session.start_time.substring(0, 5),
      end_time: session.end_time.substring(0, 5),
      location: session.location,
      category: session.category,
      is_public: session.is_public
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMutationError(null);
    if (editingSession) {
      updateMutation.mutate({ id: editingSession.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredSessions = sessions?.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.day_of_week.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center space-x-4">
          <Dumbbell className="w-8 h-8 text-accent" />
          <SectionHeader 
            title="Training Schedule" 
            subtitle={`Managing ${sessions?.length || 0} active drills.`} 
            className="mb-0"
          />
        </div>
        <Button size="lg" onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="w-5 h-5 mr-2" />
          Add Session
        </Button>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-3xl">
        <div className="p-6 md:p-10 border-b border-zinc-800">
          <div className="relative max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input
              type="text"
              placeholder="Search sessions..."
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
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Syncing Playbook...</p>
            </div>
          ) : fetchError ? (
            <div className="p-20 text-center">
              <p className="text-red-500 font-black italic uppercase tracking-widest text-sm">Error loading schedule</p>
              <p className="text-zinc-600 text-xs mt-2">{(fetchError as any).message}</p>
            </div>
          ) : filteredSessions?.length === 0 ? (
            <div className="p-20 text-center text-zinc-500 font-bold italic uppercase tracking-widest text-xs">
              No training sessions found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Session</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Day & Time</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Visibility</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredSessions?.map((session) => (
                  <tr key={session.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700 group-hover:border-accent transition-colors">
                          <Dumbbell className="w-5 h-5 text-zinc-600 group-hover:text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-black italic uppercase tracking-tight text-zinc-50 group-hover:text-accent transition-colors">{session.title}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 italic">{session.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black italic uppercase tracking-tighter text-zinc-50 leading-none">{session.day_of_week}</span>
                        <div className="flex items-center text-[8px] font-bold uppercase tracking-widest text-zinc-600 mt-1">
                          <Clock className="w-2 h-2 mr-1" />
                          {session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                        session.is_public ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"
                      )}>
                        {session.is_public ? <Eye className="w-2 h-2 mr-1" /> : <EyeOff className="w-2 h-2 mr-1" />}
                        {session.is_public ? 'Public' : 'Private'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right space-x-2">
                       <button 
                        onClick={() => handleEdit(session)}
                        className="p-3 text-zinc-600 hover:text-accent transition-colors hover:bg-zinc-800 rounded-xl"
                       >
                        <Edit2 className="w-5 h-5" />
                       </button>
                       <button 
                        onClick={() => setIsDeleting(session.id)}
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
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[3rem] shadow-3xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-12 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                      <Layout className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                      {editingSession ? 'Edit Session' : 'Add Session'}
                    </h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {mutationError && (
                  <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest">
                    {mutationError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic">Session Title</label>
                      <input
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-8 text-sm focus:border-accent outline-none transition-colors"
                        placeholder="e.g. Tactical Breakdown"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic">Day of Week</label>
                      <select
                        value={formData.day_of_week}
                        onChange={e => setFormData({ ...formData, day_of_week: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-8 text-sm focus:border-accent outline-none transition-colors appearance-none"
                      >
                        {days.map(day => <option key={day} value={day}>{day}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic">Category</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-8 text-sm focus:border-accent outline-none transition-colors appearance-none"
                      >
                        <option>Team Practice</option>
                        <option>Youth Academy</option>
                        <option>Individual Skills</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic">Start Time</label>
                      <input
                        type="time"
                        required
                        value={formData.start_time}
                        onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-8 text-sm focus:border-accent outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic">End Time</label>
                      <input
                        type="time"
                        required
                        value={formData.end_time}
                        onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-8 text-sm focus:border-accent outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic">Location</label>
                      <input
                        required
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-8 text-sm focus:border-accent outline-none transition-colors"
                        placeholder="Atlas Arena, Casablanca"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <div 
                          onClick={() => setFormData({ ...formData, is_public: !formData.is_public })}
                          className={cn(
                            "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                            formData.is_public ? "bg-accent border-accent" : "border-zinc-800"
                          )}
                        >
                          {formData.is_public && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">Public visibility on website</span>
                      </label>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-16 mt-8"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      editingSession ? 'Update Session' : 'Add to Schedule'
                    )}
                  </Button>
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
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Cancel Session?</h3>
                <p className="text-zinc-500 text-sm font-medium">This drill will be removed from the playbook.</p>
              </div>
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="danger" 
                  onClick={() => deleteMutation.mutate(isDeleting)}
                  disabled={deleteMutation.isPending}
                >
                  Confirm Cancellation
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
