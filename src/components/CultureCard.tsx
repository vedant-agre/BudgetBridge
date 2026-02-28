import { LocalCulture } from "@/types/trip";
import { UtensilsCrossed, PartyPopper, CalendarDays, MapPin } from "lucide-react";

export function CultureCard({ culture }: { culture: LocalCulture }) {
  if (!culture) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-100 dark:bg-orange-950/50 rounded-2xl">
          <PartyPopper className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Local Culture & Flavor</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Immerse yourself in authentic local experiences</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Food to Try (Premium Card) */}
        {culture.foodToTry && culture.foodToTry.length > 0 && (
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/20 dark:to-orange-950/20 border border-rose-100 dark:border-rose-900/30 rounded-[28px] p-8 shadow-sm relative overflow-hidden group">
            <UtensilsCrossed className="absolute -right-6 -bottom-6 w-40 h-40 text-rose-600/5 dark:text-rose-400/5 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 pointer-events-none" />
            
            <h3 className="text-xl font-bold text-rose-900 dark:text-rose-400 flex items-center gap-2 mb-6 relative z-10">
              <UtensilsCrossed className="w-5 h-5" /> Must-Try Local Foods
            </h3>
            
            <ul className="space-y-4 relative z-10">
              {culture.foodToTry.map((food, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-rose-200 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex-shrink-0 text-sm font-bold">
                    {idx + 1}
                  </div>
                  <span className="text-rose-950 dark:text-rose-100/90 leading-tight font-medium text-lg pt-0.5">
                    {food}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Events or Festivals (Premium Card) */}
        {culture.eventsOrFestivals && culture.eventsOrFestivals.length > 0 && (
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/20 dark:to-fuchsia-950/20 border border-violet-100 dark:border-violet-900/30 rounded-[28px] p-8 shadow-sm relative overflow-hidden group">
            <CalendarDays className="absolute -right-6 -bottom-6 w-40 h-40 text-violet-600/5 dark:text-violet-400/5 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 pointer-events-none" />
            
            <h3 className="text-xl font-bold text-violet-900 dark:text-violet-400 flex items-center gap-2 mb-6 relative z-10">
              <PartyPopper className="w-5 h-5" /> Events & Festivals
            </h3>
            
            <ul className="space-y-4 relative z-10">
              {culture.eventsOrFestivals.map((event, idx) => (
                <li key={idx} className="flex items-start gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-violet-200/50 dark:border-violet-800/50">
                  <div className="mt-0.5">
                    <CalendarDays className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                  </div>
                  <span className="text-violet-950 dark:text-violet-100/90 leading-snug font-medium">
                    {event}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
      </div>
    </div>
  );
}
