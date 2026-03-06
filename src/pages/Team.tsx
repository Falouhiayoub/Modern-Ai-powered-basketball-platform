import { SectionHeader } from '@/components/ui/SectionHeader';

export function Team() {
  return (
    <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader title="The Team" subtitle="The heart and soul of Atlas Hoops." />
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center">
        <p className="text-zinc-400">Team history and organization details coming soon.</p>
      </div>
    </main>
  );
}
