import { SectionHeader } from '@/components/ui/SectionHeader';
import { 
  Users, 
  Calendar, 
  Newspaper, 
  UserPlus, 
  ArrowUpRight,
  TrendingUp,
  Trophy,
  Activity
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { playerService } from '@/services/playerService';
import { matchService } from '@/services/matchService';
import { newsService } from '@/services/newsService';
import { supabase } from '@/services/supabase';
import { cn } from '@/utils/cn';

export function DashboardHome() {
  const { data: players } = useQuery({ queryKey: ['adminPlayers'], queryFn: () => playerService.getPlayers() });
  const { data: matches } = useQuery({ queryKey: ['adminMatches'], queryFn: () => matchService.getUpcomingMatches() });
  const { data: news } = useQuery({ queryKey: ['adminNews'], queryFn: () => newsService.getNews() });
  const { data: tryouts } = useQuery({ queryKey: ['adminTryouts'], queryFn: async () => {
    const { data } = await supabase.from('tryouts').select('id');
    return data;
  }});

  const stats = [
    { label: 'Active Roster', value: players?.length || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Upcoming Games', value: matches?.length || 0, icon: Calendar, color: 'text-accent' },
    { label: 'News Stories', value: news?.length || 0, icon: Newspaper, color: 'text-green-500' },
    { label: 'Tryout Applications', value: tryouts?.length || 0, icon: UserPlus, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-16">
      <div>
        <SectionHeader 
          title="Club Overview" 
          subtitle="Real-time pulse of Atlas Hoops operations." 
          className="mb-12"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-all group shadow-2xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl bg-zinc-800 group-hover:bg-zinc-700 transition-colors`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-zinc-700 group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <h3 className="text-4xl font-black italic tracking-tighter text-zinc-50 mb-1">{stat.value}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-none">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Latest Activity */}
        <div className="lg:col-span-2 space-y-8">
          <SectionHeader 
            title="Recent Activity" 
            subtitle="Recent updates from the management team." 
            className="mb-0"
          />
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-3xl">
             <ActivityItem 
              icon={<TrendingUp className="w-5 h-5 text-accent" />}
              title="New Tryout Application"
              desc="Karim Benani submitted an application for the Point Guard position."
              time="2 hours ago"
             />
             <ActivityItem 
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              title="Match Scheduled"
              desc="Upcoming game vs Rabat Lions scheduled for March 15th."
              time="5 hours ago"
             />
             <ActivityItem 
              icon={<Trophy className="w-5 h-5 text-green-500" />}
              title="Score Updated"
              desc="Victory over Casablanca Kings (88-82) recorded."
              time="Yesterday"
             />
          </div>
        </div>

        {/* Quick Links / Actions */}
        <div className="space-y-8">
          <SectionHeader 
            title="Quick Actions" 
            subtitle="Common management tasks." 
            className="mb-0"
          />
          <div className="space-y-4">
            <QuickAction icon={<Users className="w-4 h-4" />} label="Add New Player" color="bg-blue-500/10 text-blue-500" />
            <QuickAction icon={<Calendar className="w-4 h-4" />} label="Schedule Game" color="bg-accent/10 text-accent" />
            <QuickAction icon={<Newspaper className="w-4 h-4" />} label="Publish News" color="bg-green-500/10 text-green-500" />
            <QuickAction icon={<Activity className="w-4 h-4" />} label="Export Match Stats" color="bg-purple-500/10 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, desc, time }: { icon: React.ReactNode, title: string, desc: string, time: string }) {
  return (
    <div className="flex space-x-6 group">
      <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-700 group-hover:border-accent transition-colors">
        {icon}
      </div>
      <div className="flex-1 pb-8 border-b border-zinc-800/50 group-last:border-0 group-last:pb-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-sm font-black italic uppercase tracking-tighter text-zinc-50 group-hover:text-accent transition-colors leading-none">{title}</h4>
          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 font-mono italic">{time}</span>
        </div>
        <p className="text-xs text-zinc-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
  return (
    <button className="w-full flex items-center justify-between p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group shadow-xl">
      <div className="flex items-center space-x-4">
        <div className={cn("p-3 rounded-xl", color)}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-50 transition-colors leading-none">{label}</span>
      </div>
      <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-accent transition-transform" />
    </button>
  );
}
