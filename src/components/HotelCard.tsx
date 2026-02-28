import { Hotel } from "@/types/trip";
import { Star, Bed, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Bed className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="line-clamp-1">{hotel.name}</span>
        </h3>
        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 px-2 py-1 rounded-full text-xs font-bold shrink-0">
          <Star className="w-3 h-3 fill-current" />
          {hotel.rating}
        </div>
      </div>
      
      {hotel.shortAddress && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{hotel.shortAddress}</span>
        </div>
      )}

      <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
        {hotel.description}
      </p>
      <div className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 inline-block px-3 py-1.5 rounded-lg text-sm">
        Est. ₹{hotel.pricePerNight} / night
      </div>
    </motion.div>
  );
}
