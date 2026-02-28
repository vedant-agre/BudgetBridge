"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MapPin, Calendar, IndianRupee, Sparkles, Loader2, Info, Users } from "lucide-react";
import { TripData } from "@/types/trip";
import { HotelCard } from "./HotelCard";
import { DayTimeline } from "./DayTimeline";
import { CultureCard } from "./CultureCard";

export default function TripForm() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("3");
  const [budget, setBudget] = useState("");
  const [people, setPeople] = useState("2");
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<TripData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setItinerary(null);

    try {
      const response = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, days, budget, people }),
      });

      const data = await response.json();
      
      if (data.error) {
        alert(data.error);
      } else {
        setItinerary(data as TripData);
      }
    } catch (error) {
      console.error("Failed to fetch itinerary:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-12 flex flex-col gap-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full p-1 rounded-3xl bg-gradient-to-b from-white/20 to-white/5 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10"
      >
        <div className="bg-white/80 dark:bg-black/40 rounded-[22px] p-6 sm:p-10 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Destination */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" /> Where to?
                </label>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Pune, Mumbai" 
                  required
                  className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-400 dark:text-white"
                />
              </div>

              {/* Days */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" /> How long?
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1"
                    max="30"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="3" 
                    required
                    className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                    days
                  </span>
                </div>
              </div>

              {/* People */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-pink-500" /> Travelers
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1"
                    max="20"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    placeholder="2" 
                    required
                    className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">
                    people
                  </span>
                </div>
              </div>

              {/* Budget */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-violet-500" /> Total Budget
                </label>
                <input 
                  type="number" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g., 50000" 
                  required
                  className="w-full bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-zinc-400 dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                We'll split this budget across all {people || 1} travelers to build realistic transit & hotel rules.
              </p>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-full font-medium text-lg flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-black/10 dark:shadow-white/10 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 text-yellow-500 dark:text-yellow-600" />
                )}
                {isLoading ? "Generating..." : "Generate Itinerary"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      <AnimatePresence>
        {itinerary && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
            className="w-full text-left bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[32px] p-8 sm:p-12 shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            {/* Budget Reality Check */}
            <motion.div 
              variants={itemVariants} 
              className="mb-14 relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-10 shadow-xl shadow-blue-900/20"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <IndianRupee className="w-48 h-48 rotate-12 -translate-y-12 translate-x-8" />
              </div>
              <div className="relative z-10">
                <h3 className="flex items-center gap-2 font-bold text-white text-2xl mb-4">
                  <Info className="w-6 h-6 text-blue-200" /> Budget Check for {people} Travelers
                </h3>
                <p className="text-blue-50 text-lg leading-relaxed max-w-3xl">
                  {itinerary.budgetAnalysis}
                </p>
              </div>
            </motion.div>

            {/* Hotels */}
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-zinc-900 dark:text-white flex items-center gap-3">
              Where to Stay
            </motion.h2>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
              {itinerary.hotels.map((hotel, idx) => (
                <motion.div variants={itemVariants} key={idx} className="h-full">
                  <HotelCard hotel={hotel} />
                </motion.div>
              ))}
            </motion.div>

            {/* Daily Itinerary */}
            <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">Your Itinerary</motion.h2>
            <div className="flex flex-col gap-12 mb-16">
              {itinerary.itinerary.map((day) => (
                <DayTimeline key={day.day} dayData={day} />
              ))}
            </div>

            {/* Local Culture (Moved to bottom) */}
            <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <CultureCard culture={itinerary.localCulture} />
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
