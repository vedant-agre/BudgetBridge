export interface Hotel {
  name: string;
  pricePerNight: number;
  rating: number;
  description: string;
  shortAddress: string;
}

export interface Place {
  placeName: string;
  description: string;
  estimatedCost: number;
  rating: number;
  transportToNext: string;
  transportCost: number;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  places: Place[];
}

export interface LocalCulture {
  foodToTry: string[];
  eventsOrFestivals: string[];
}

export interface TripData {
  budgetAnalysis: string;
  hotels: Hotel[];
  itinerary: ItineraryDay[];
  localCulture: LocalCulture;
}
