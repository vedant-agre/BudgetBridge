import { LocalCulture } from "@/types/trip";
import { UtensilsCrossed, PartyPopper } from "lucide-react";

export function CultureCard({ culture }: { culture: LocalCulture }) {
  if (!culture) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-6 sm:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-500 mb-6 flex items-center gap-3">
        <PartyPopper className="w-6 h-6" /> Local Culture & Flavor
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Food to Try */}
        {culture.foodToTry && culture.foodToTry.length > 0 && (
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-4">
              <UtensilsCrossed className="w-4 h-4" /> Must-Try Local Foods
            </h3>
            <ul className="space-y-3">
              {culture.foodToTry.map((food, idx) => (
                <li key={idx} className="flex items-start gap-3 text-amber-950 dark:text-amber-100/80 leading-snug">
                  <span className="text-amber-500 text-lg leading-none mt-0.5">•</span>
                  {food}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Events or Festivals */}
        {culture.eventsOrFestivals && culture.eventsOrFestivals.length > 0 && (
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-4">
              <PartyPopper className="w-4 h-4" /> Events & Festivals
            </h3>
            <ul className="space-y-3">
              {culture.eventsOrFestivals.map((event, idx) => (
                <li key={idx} className="flex items-start gap-3 text-amber-950 dark:text-amber-100/80 leading-snug">
                  <span className="text-amber-500 text-lg leading-none mt-0.5">•</span>
                  {event}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
