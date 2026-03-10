import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Trophy, LogIn, LayoutDashboard } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Roster', path: '/team' },
  { name: 'Matches', path: '/matches' },
  { name: 'Training', path: '/training' },
  { name: 'News', path: '/news' },
  { name: 'Fans', path: '/fans' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { session } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-6',
        scrolled ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50 py-4' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform bg-black">
              <img src="/images/logo.jpg" alt="Beyond the Arc Logo" className="w-full h-full object-cover scale-125" />
            </div>
            <div className="flex flex-col">
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-black italic uppercase tracking-tighter leading-none text-white"
              >
                Beyond
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-accent leading-none"
              >
                The Arc
              </motion.span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-full',
                  location.pathname === link.path
                    ? 'text-accent bg-accent/10'
                    : 'text-zinc-400 hover:text-zinc-50'
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="ml-6 pl-6 border-l border-zinc-800">
              {session ? (
                <Link
                  to="/admin"
                  className="bg-accent text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-dark shadow-lg shadow-accent/20 transition-all active:scale-95 flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-zinc-900 text-white border border-zinc-800 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-all active:scale-95 flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-50 focus:outline-none bg-zinc-900 rounded-xl border border-zinc-800 cursor-pointer active:scale-95 transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 bg-zinc-950 border-b border-zinc-800 p-6 space-y-4 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-4 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl',
                  location.pathname === link.path ? 'text-accent bg-accent/10' : 'text-zinc-400 bg-zinc-900/50'
                )}
              >
                {link.name}
              </Link>
            ))}
            {session ? (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 px-4 py-4 bg-accent text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-center"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 px-4 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-center"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
