import { TripData, Hotel } from "@/types/trip";
import { Star, Bed } from "lucide-react";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Bed className="w-5 h-5 text-blue-500" />
          {hotel.name}
        </h3>
        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-2 py-1 rounded-full text-xs font-bold">
          <Star className="w-3 h-3 fill-current" />
          {hotel.rating}
        </div>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
        {hotel.description}
      </p>
      <div className="font-medium text-emerald-600 dark:text-emerald-400">
        Est. ${hotel.pricePerNight} / night
      </div>
    </div>
  );
}
