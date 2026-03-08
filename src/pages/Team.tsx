import { SectionHeader } from '@/components/ui/SectionHeader';
import { motion } from 'framer-motion';

export function Team() {
  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Hero Section with Background */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/postseason games.jpg" 
            alt="Team History" 
            className="w-full h-full object-cover grayscale opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/50 to-zinc-950" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader 
              title="The Team" 
              subtitle="The heart and soul of Atlas Hoops. A legacy built on sweat and passion." 
              className="mb-0"
            />
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Our Journey</h3>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl mx-auto">
            From our humble beginnings to the championship courts, Atlas Hoops has always been about more than just basketball. 
            We are a family, a community, and a symbol of Morrocan excellence in sports. 
            Stay tuned as we document our full history and organizational structure.
          </p>
          
          <div className="pt-8 border-t border-zinc-800">
            <p className="text-zinc-500 font-bold italic uppercase tracking-widest text-sm">Legacy in the making...</p>
          </div>
        </div>
      </section>
    </main>
  );
}
