import { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { fanService } from '@/services/fanService';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fanService.sendMessage(
        formData.name,
        formData.email,
        formData.message,
        formData.subject
      );
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
      <SectionHeader 
        title="Get in Touch" 
        subtitle="Have a question for the club? We're here to help our community." 
        align="center"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <ContactCard 
            icon={<Mail className="w-6 h-6 text-accent" />} 
            title="Email Us" 
            desc="General Inquiries" 
            value="contact@atlashoops.ma" 
          />
          <ContactCard 
            icon={<Phone className="w-6 h-6 text-accent" />} 
            title="Call Us" 
            desc="Office Hours: 9AM - 6PM" 
            value="+212 5XX XX XX XX" 
          />
          <ContactCard 
            icon={<MapPin className="w-6 h-6 text-accent" />} 
            title="Visit Us" 
            desc="Atlas Arena Training Center" 
            value="Casablanca, Morocco" 
          />
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12 shadow-3xl">
            {submitted ? (
              <div className="py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-50">Message Received!</h3>
                <p className="text-zinc-400 font-medium max-w-sm mx-auto">
                  Thank you for reaching out. A member of our staff will get back to you shortly.
                </p>
                <Button variant="outline" size="lg" onClick={() => setSubmitted(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput 
                    label="Full Name" 
                    placeholder="Yassine El-Morabit" 
                    required 
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <FormInput 
                    label="Email Address" 
                    type="email" 
                    placeholder="yassine@example.com" 
                    required 
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                
                <FormInput 
                  label="Subject" 
                  placeholder="Ticket Inquiry / Partnership / Fan Question" 
                  value={formData.subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, subject: e.target.value })}
                />

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic flex items-center">
                    <MessageSquare className="w-3 h-3 mr-2 text-accent" />
                    Your Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl py-6 px-8 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-800 text-zinc-50 resize-none"
                    placeholder="How can we help you today?"
                  />
                </div>

                {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">{error}</p>}

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-16 rounded-2xl shadow-xl shadow-accent/20"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <span className="flex items-center">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactCard({ icon, title, desc, value }: { icon: React.ReactNode, title: string, desc: string, value: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 flex items-start space-x-6 hover:border-accent/50 transition-colors group shadow-xl">
      <div className="p-4 rounded-2xl bg-zinc-800 border border-zinc-700 group-hover:bg-accent/10 group-hover:border-accent transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-black italic uppercase tracking-widest text-zinc-50 leading-none mb-2">{title}</h4>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-4">{desc}</p>
        <p className="text-lg font-black italic text-zinc-400 group-hover:text-accent transition-colors tracking-tighter leading-none">{value}</p>
      </div>
    </div>
  );
}

function FormInput({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4 italic">{label}</label>
      <input
        {...props}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-8 text-sm font-medium focus:border-accent focus:outline-none transition-colors placeholder:text-zinc-800 text-zinc-50"
      />
    </div>
  );
}
