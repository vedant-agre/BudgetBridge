import TripForm from "@/components/TripForm";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-black overflow-hidden selection:bg-emerald-500/30">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-500/20 via-emerald-500/10 to-transparent dark:from-blue-600/20 dark:via-emerald-500/10 blur-3xl opacity-50 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/20 blur-3xl opacity-30 rounded-full pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-md mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">AI-Powered Routing & Pricing</span>
        </div>

        {/* Hero Typography */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white max-w-4xl mb-6">
          Plan Your Dream Trip in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">
            Seconds
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12">
          Stop wildly guessing your travel budget. Enter your constraints and let our engine pull real-time hotel prices and attraction costs to build a zero-hallucination itinerary.
        </p>

        {/* The Form */}
        <TripForm />

      </main>
    </div>
  );
}
