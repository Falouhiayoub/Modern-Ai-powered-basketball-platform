import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { 
  Ruler, 
  Calendar, 
  Activity, 
  Trophy, 
  CheckCircle2, 
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fanService } from '@/services/fanService';

export function JoinTeam() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: 18,
    height: '',
    position: '',
    experience: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fanService.applyForTryouts(formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Tryout application error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      {/* Recruitment Header */}
      <section className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 md:p-24 shadow-3xl text-center">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Trophy className="w-64 h-64 text-accent" />
        </div>
        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent/20 rounded-3xl mb-4 border border-accent/20">
            <Activity className="w-10 h-10 text-accent animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Draft <span className="text-accent">Center</span>
          </h1>
          <p className="text-xl text-zinc-400 font-medium leading-relaxed">
            Think you have what it takes to represent Casablanca on the court? Atlas Hoops is always looking for elite talent. Submit your stats and start your journey.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Requirements */}
        <div className="space-y-12">
          <SectionHeader 
            title="Eligibility" 
            subtitle="What we're looking for in our next prospects." 
          />
          
          <div className="space-y-6">
            <RequirementItem title="Age Group" desc="Open to athletes aged 16-25 for our development and pro teams." />
            <RequirementItem title="Local & International" desc="We welcome applications from across Morocco and international prospects." />
            <RequirementItem title="Professional Conduct" desc="Discipline, teamwork, and commitment are core values at Atlas Hoops." />
            <RequirementItem title="Trial Process" desc="Selected applicants will be invited for a 2-day trial in Casablanca." />
          </div>

          <div className="p-8 bg-accent/5 border border-accent/10 rounded-3xl space-y-4">
            <h4 className="text-sm font-black italic uppercase tracking-widest text-accent flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Next Tryout Dates
            </h4>
            <p className="text-zinc-400 text-sm font-medium">Summer 2026 Season Trials begin April 15th.</p>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-3xl">
          {submitted ? (
            <div className="py-20 text-center space-y-8">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/10">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-50 leading-none">Draft Application Sent!</h3>
                <p className="text-zinc-400 font-medium">Our scouting team will review your profile. If your stats match our needs, we'll reach out for a formal interview.</p>
              </div>
              <Button variant="outline" size="lg" className="rounded-2xl" onClick={() => setSubmitted(false)}>Submit Another Profile</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormInput 
                  label="First Name" 
                  placeholder="Yassine" 
                  required 
                  value={formData.firstName}
                  onChange={(e: any) => setFormData({ ...formData, firstName: e.target.value })}
                />
                <FormInput 
                  label="Last Name" 
                  placeholder="El-Morabit" 
                  required 
                  value={formData.lastName}
                  onChange={(e: any) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>

              <FormInput 
                label="Email Address" 
                type="email" 
                placeholder="athlete@example.com" 
                required 
                value={formData.email}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic flex items-center">
                    <Calendar className="w-3 h-3 mr-2 text-accent" />
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    min={15}
                    max={40}
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-8 text-sm font-medium focus:border-accent focus:outline-none transition-colors text-zinc-50"
                  />
                </div>
                <FormInput 
                  label="Height (e.g. 195cm)" 
                  placeholder="195cm" 
                  icon={<Ruler className="w-3 h-3 mr-2 text-accent" />}
                  value={formData.height}
                  onChange={(e: any) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>

              <FormInput 
                label="Primary Position" 
                placeholder="Point Guard / Center / Power Forward" 
                value={formData.position}
                onChange={(e: any) => setFormData({ ...formData, position: e.target.value })}
              />

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic flex items-center">
                  <ChevronRight className="w-3 h-3 mr-2 text-accent" />
                  Playing Experience
                </label>
                <textarea
                  rows={4}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-6 px-8 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-800 text-zinc-50 resize-none"
                  placeholder="Previous clubs, career highlights, and major achievements..."
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-16 rounded-2xl shadow-xl shadow-accent/20"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Register for Draft'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function RequirementItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex items-start space-x-6 group">
      <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0 group-hover:border-accent transition-colors">
        <div className="w-2 h-2 bg-accent rounded-full" />
      </div>
      <div>
        <h4 className="text-sm font-black italic uppercase tracking-widest text-zinc-50 group-hover:text-accent transition-colors leading-none mb-2">{title}</h4>
        <p className="text-xs text-zinc-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FormInput({ label, icon, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic flex items-center">
        {icon}
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-8 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-800 text-zinc-50"
      />
    </div>
  );
}
