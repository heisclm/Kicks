export default function Loading() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
      {/* Premium KICKS Loading Animation */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full animate-pulse" />
        <div className="relative h-12 w-12 bg-brand-primary rounded-xl flex items-center justify-center shadow-elevated overflow-hidden">
          <div className="absolute inset-0 bg-white/20 animate-[wave_2s_ease-in-out_infinite] translate-y-full" style={{
            animation: 'slideUp 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
          }} />
          <span className="text-white text-xl font-black relative z-10">K</span>
        </div>
      </div>
      <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase mt-6">
        Loading Data
      </p>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          0% { transform: translateY(100%); }
          50% { transform: translateY(-10%); }
          100% { transform: translateY(-100%); opacity: 0; }
        }
      `}} />
    </div>
  );
}
