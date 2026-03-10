import { Link } from 'react-router-dom';
import { Trophy, Facebook, Twitter, Instagram, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  team: [
    { name: 'Athletes', path: '/team' },
    { name: 'Schedule', path: '/matches' },
    { name: 'Training', path: '/training' },
  ],
  support: [
    { name: 'Contact Us', path: '/contact' },
    { name: 'Draft Center', path: '/join' },
    { name: 'Fan Zone', path: '/fans' },
  ],
  legal: [
    { name: 'Terms', path: '/terms' },
    { name: 'Privacy', path: '/privacy' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Basketball Shadow */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Info */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 overflow-hidden rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-accent transition-colors shadow-2xl bg-black">
                <img src="/images/logo.jpg" alt="Beyond the Arc Logo" className="w-full h-full object-cover scale-125" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black italic uppercase tracking-tighter leading-none text-white">Beyond</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent leading-none">The Arc</span>
              </div>
            </Link>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-xs">
              The heartbeat of Casablanca. Pushing the boundaries of Moroccan basketball from the grassroots to the professional stage.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Facebook className="w-4 h-4" />} />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} />
              <SocialIcon icon={<Instagram className="w-4 h-4" />} />
            </div>
          </div>

          {/* Links Sections */}
          <FooterSection title="Team" links={footerLinks.team} />
          <FooterSection title="Club" links={footerLinks.support} />

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Headquarters</h3>
            <ul className="space-y-6">
              <ContactItem icon={<Mail className="w-4 h-4" />} text="contact@atlashoops.ma" />
              <ContactItem icon={<Phone className="w-4 h-4" />} text="+212 522 XX XX XX" />
              <ContactItem icon={<MapPin className="w-4 h-4" />} text="Atlas Arena, Casablanca" />
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">© 2026 Atlas Hoops Basketball Club.</p>
            <div className="flex space-x-8">
              {footerLinks.legal.map((link) => (
                <Link key={link.name} to={link.path} className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-accent transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-zinc-700">
            <span className="text-[8px] font-black uppercase tracking-widest">Designed for the Legacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, links }: { title: string, links: { name: string, path: string }[] }) {
  return (
    <div className="space-y-8">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">{title}</h3>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.name}>
            <Link to={link.path} className="text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-accent transition-all flex items-center group">
              {link.name}
              <ArrowUpRight className="w-3 h-3 ml-2 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <li className="flex items-center space-x-4 text-zinc-500 group cursor-pointer">
      <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:border-accent/50 group-hover:text-accent transition-all">
        {icon}
      </div>
      <span className="text-xs font-black uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{text}</span>
    </li>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800 hover:border-accent hover:text-accent transition-all hover:scale-110 active:scale-95 shadow-xl text-zinc-600">
      {icon}
    </button>
  );
}
