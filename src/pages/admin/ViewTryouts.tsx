import { useQuery } from '@tanstack/react-query';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { supabase } from '@/services/supabase';
import { 
  UserPlus, 
  Search, 
  Ruler, 
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

export function ViewTryouts() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: applications, isLoading } = useQuery<any[]>({ 
    queryKey: ['adminTryouts'], 
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tryouts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredApps = applications?.filter(a => 
    `${a.first_name} ${a.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex items-center space-x-4">
          <UserPlus className="w-8 h-8 text-accent" />
          <SectionHeader 
            title="Recruitment Inbox" 
            subtitle={`Reviewing ${applications?.length || 0} prospective athletes.`} 
            className="mb-0"
          />
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-3xl">
        <div className="p-6 md:p-10 border-b border-zinc-800 flex flex-col md:flex-row justify-between gap-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
            <input
              type="text"
              placeholder="Search applicants by name or email..."
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
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Scanning Applications...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Applicant</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Physicals</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Position</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredApps?.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-800/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="space-y-1">
                        <p className="text-lg font-black italic uppercase tracking-tighter text-zinc-50 group-hover:text-accent transition-colors leading-none">{app.first_name} {app.last_name}</p>
                        <div className="flex items-center space-x-3">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 font-mono italic">{app.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-2 text-zinc-400 font-black italic text-lg leading-none">
                          <Ruler className="w-3 h-3 text-accent" />
                          <span>{app.height || '--'}</span>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 mt-1">{app.age} YEARS OLD</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span className="inline-flex px-4 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        {app.position || 'Any'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                       <span className={cn(
                        "inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        app.status === 'accepted' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                        app.status === 'rejected' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        "bg-zinc-800 text-zinc-500 border-zinc-700"
                       )}>
                        {app.status === 'pending' && <Clock className="w-3 h-3 mr-2" />}
                        {app.status === 'accepted' && <CheckCircle2 className="w-3 h-3 mr-2" />}
                        {app.status === 'rejected' && <XCircle className="w-3 h-3 mr-2" />}
                        {app.status}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-right space-x-2">
                       <button className="p-3 text-zinc-600 hover:text-accent transition-colors hover:bg-zinc-800 rounded-xl">
                        <MoreVertical className="w-5 h-5" />
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
