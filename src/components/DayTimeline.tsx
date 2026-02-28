import { ItineraryDay } from "@/types/trip";
import { Navigation, Clock, CreditCard, Star } from "lucide-react";

export function DayTimeline({ dayData }: { dayData: ItineraryDay }) {
  return (
    <div className="relative pl-8 md:pl-0">
      
      {/* Day Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white text-base">
            {dayData.day}
          </span>
          Day {dayData.day}
        </h2>
        <span className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">
          — {dayData.theme}
        </span>
      </div>

      {/* Places Timeline */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-300 dark:before:via-zinc-700 before:to-transparent">
        {dayData.places.map((place, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Timeline Dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-black bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {idx + 1}
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
              
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-zinc-800 dark:text-zinc-100">
                  {place.placeName}
                </h4>
                {place.rating > 0 && (
                  <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    {place.rating}
                  </div>
                )}
              </div>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                {place.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-violet-500" />
                  Est. ${place.estimatedCost}
                </div>
                
                {/* Transport Info from Previous Location */}
                {place.transportToNext && (
                  <div className="flex items-center gap-1.5 border-l border-zinc-300 dark:border-zinc-700 pl-4 w-full sm:w-auto mt-2 sm:mt-0">
                    <Navigation className="w-4 h-4 text-blue-500" />
                    <span className="truncate max-w-[200px]" title={place.transportToNext}>
                      {place.transportToNext}
                    </span>
                    {place.transportCost > 0 && (
                      <span className="text-red-500 dark:text-red-400 ml-1">
                        (+${place.transportCost})
                      </span>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
