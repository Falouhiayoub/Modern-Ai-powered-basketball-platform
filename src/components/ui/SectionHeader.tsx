import { cn } from '@/utils/cn';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export function SectionHeader({ 
  title, 
  subtitle, 
  className,
  align = 'left' 
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'mb-16 relative',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}>
      <div className={cn(
        "absolute -top-12 opacity-5 pointer-events-none -z-10",
        align === 'center' ? "left-1/2 -translate-x-1/2" : align === 'right' ? "right-0" : "left-0"
      )}>
        <h2 className="text-[8rem] font-black italic uppercase tracking-tighter whitespace-nowrap text-zinc-50 select-none">
          {title}
        </h2>
      </div>

      <div className="flex flex-col space-y-4">
        <div className={cn(
          "inline-flex items-center space-x-4",
          align === 'center' && "justify-center",
          align === 'right' && "justify-end"
        )}>
          <div className="w-12 h-1.5 bg-accent transform -skew-x-12" />
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white text-glow">
            {title}
          </h2>
          <div className="w-12 h-1.5 bg-accent transform -skew-x-12" />
        </div>
        
        {subtitle && (
          <p className="text-zinc-500 text-lg font-black uppercase tracking-widest italic max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
