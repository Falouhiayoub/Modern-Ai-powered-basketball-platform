import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Newspaper, 
  UserPlus, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Trophy
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

// Admin Sub-pages
import { DashboardHome } from './admin/DashboardHome';
import { ManagePlayers } from './admin/ManagePlayers';
import { ManageMatches } from './admin/ManageMatches';
import { ManageNews } from './admin/ManageNews';
import { ViewTryouts } from './admin/ViewTryouts';

const adminLinks = [
  { name: 'Overview', path: '/admin', icon: LayoutDashboard },
  { name: 'Players', path: '/admin/players', icon: Users },
  { name: 'Matches', path: '/admin/matches', icon: Calendar },
  { name: 'News', path: '/admin/news', icon: Newspaper },
  { name: 'Tryouts', path: '/admin/tryouts', icon: UserPlus },
];

export function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: clear state and force navigate
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row pt-20">
      {/* Mobile Header */}
      <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center sticky top-20 z-40">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-accent" />
          <span className="font-black italic uppercase tracking-tighter text-sm">Atlas Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-zinc-400">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-0 top-36 md:top-0 z-40 w-full md:w-80 bg-zinc-900/50 border-r border-zinc-800 transition-transform duration-300 md:translate-x-0 overflow-y-auto",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 space-y-12">
          <div className="hidden md:flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 shrink-0 bg-black border border-zinc-800">
              <img src="/images/logo.jpg" alt="Beyond the Arc Logo" className="w-full h-full object-cover scale-125" />
            </div>
            <div>
              <h2 className="text-sm font-black italic uppercase tracking-widest text-zinc-50 leading-none">Beyond the Arc</h2>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Club Management</span>
            </div>
          </div>

          <nav className="space-y-4">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group",
                    isActive 
                      ? "bg-accent text-zinc-50 shadow-lg shadow-accent/20" 
                      : "text-zinc-500 hover:text-zinc-50 hover:bg-zinc-800"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <Icon className={cn("w-5 h-5", isActive ? "text-zinc-50" : "text-zinc-600 group-hover:text-accent transition-colors")} />
                    <span>{link.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-12 border-t border-zinc-800 space-y-6">
            <div className="flex items-center space-x-4 px-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-black text-zinc-50 border border-zinc-700">
                {profile?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black uppercase tracking-widest text-zinc-50 truncate">{profile?.full_name || 'Admin User'}</p>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest truncate leading-none mt-1">{profile?.role || 'Staff'}</p>
              </div>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-4 p-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="players" element={<ManagePlayers />} />
          <Route path="matches" element={<ManageMatches />} />
          <Route path="news" element={<ManageNews />} />
          <Route path="tryouts" element={<ViewTryouts />} />
        </Routes>
      </div>
    </div>
  );
}
