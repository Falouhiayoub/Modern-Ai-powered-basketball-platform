import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { useAuthStore } from '@/store/useAuthStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/features/chatbot/components/ChatWidget';
import { Loader2 } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Lazy Loaded Pages
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })));
const Team = lazy(() => import('@/pages/Team').then(m => ({ default: m.Team })));
const Players = lazy(() => import('@/pages/Players').then(m => ({ default: m.Players })));
const PlayerProfile = lazy(() => import('@/pages/PlayerProfile').then(m => ({ default: m.PlayerProfile })));
const Matches = lazy(() => import('@/pages/Matches').then(m => ({ default: m.Matches })));
const MatchDetails = lazy(() => import('@/pages/MatchDetails').then(m => ({ default: m.MatchDetails })));
const News = lazy(() => import('@/pages/News').then(m => ({ default: m.News })));
const ArticlePage = lazy(() => import('@/pages/ArticlePage').then(m => ({ default: m.ArticlePage })));
const Fans = lazy(() => import('@/pages/Fans').then(m => ({ default: m.Fans })));
const JoinTeam = lazy(() => import('@/pages/JoinTeam').then(m => ({ default: m.JoinTeam })));
const Contact = lazy(() => import('@/pages/Contact').then(m => ({ default: m.Contact })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLogin = lazy(() => import('@/pages/AdminLogin').then(m => ({ default: m.AdminLogin })));

// Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-12 h-12 text-accent animate-spin" />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, initialized } = useAuthStore();
  
  if (!initialized || loading) return <PageLoader />;
  if (!session) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

function App() {
  const { initialize } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-[#050505] text-zinc-50 font-sans selection:bg-accent selection:text-white relative">
            {/* Global Mesh Overlay */}
            <div className="fixed inset-0 basketball-mesh pointer-events-none opacity-20 z-0" />
            
            <div className="relative z-10">
              <SEO />
              <Navbar />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/players" element={<Players />} />
                  <Route path="/players/:id" element={<PlayerProfile />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/matches/:id" element={<MatchDetails />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:id" element={<ArticlePage />} />
                  <Route path="/fans" element={<Fans />} />
                  <Route path="/join" element={<JoinTeam />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<AdminLogin />} />
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Suspense>
              <Footer />
              <ChatWidget />
            </div>
          </div>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
