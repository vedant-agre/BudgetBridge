import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { destination, days, budget, people } = await req.json();

    if (!destination || !days || !budget || !people) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `
    You are an expert, highly realistic AI travel planner. Your job is to create an accurate, day-by-day itinerary. 
    You MUST prioritize the user's budget and ensure places, prices, and events are factual and realistic as of today.

    USER REQUEST:
    - Destination: ${destination}
    - Duration: ${days} days
    - Number of People: ${people}
    - Budget: $${budget} (Total budget for all ${people} people combined. Excludes initial flights, but INCLUDING local hotels, food, and local transit. Divide appropriately to see if realistic!)

    INSTRUCTIONS FOR ITINERARY:
    1. Introduction (budgetAnalysis): Explain if $${budget} across ${people} people for ${days} days is highly realistic, tight, or luxurious for this destination.
    2. Accommodation (hotels): Recommend 2 specific hotels or neighborhoods fitting the budget. Include price per night and real rating. If budget is tight for ${people} people, suggest an Airbnb/Apartment instead.
    3. Day-by-day Breakdown (itinerary):
       - Group locations logically to minimize travel time. Include activity/meal costs for all ${people} people.
       - IMPORTANT 'transportToNext' Logic: Provide the EXACT mode of travel from the PREVIOUS place.
         - If distance < 1km: Suggest "Walk (X mins)". Cost = 0.
         - If distance > 1km: Suggest "Metro/Bus (X mins)". Give the cost.
         - ONLY if there's no metro, or splitting an Uber/Taxi is cheaper for ${people} people than individual tickets, suggest "Uber/Taxi (X mins)".
    4. Local Culture (localCulture):
       - foodToTry: List 3 authentic, famous local dishes (e.g., if Pune: "Misal Pav", "Vada Pav").
       - eventsOrFestivals: List 1-2 local events/festivals happening during this season, or historic places directly tied to local culture.

    IMPORTANT FORMATTING OVERRIDE:
    You MUST return your response as a valid JSON object ONLY. Do not wrap it in markdown block quotes. Use the EXACT following schema structure:
    {
      "budgetAnalysis": "Brief statement...",
      "hotels": [
        { "name": "...", "pricePerNight": 100, "rating": 4.5, "description": "..." }
      ],
      "itinerary": [
        {
          "day": 1,
          "theme": "...",
          "places": [
            {
              "placeName": "...",
              "description": "...",
              "estimatedCost": 20,
              "rating": 4.8,
              "transportToNext": "Walk (10 mins, 1km)",
              "transportCost": 0
            }
          ]
        }
      ],
      "localCulture": {
        "foodToTry": ["Dish 1", "Dish 2"],
        "eventsOrFestivals": ["Event 1"]
      }
    }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Lower temperature needed for strict JSON adherence
      },
    });

    let rawText = response.text || "{}";
    
    // Sometimes Gemini wraps JSON in markdown block quotes even if told not to
    if (rawText.startsWith("\`\`\`json")) {
      rawText = rawText.replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
    } else if (rawText.startsWith("\`\`\`")) {
      rawText = rawText.replace(/^\`\`\`\n/, "").replace(/\n\`\`\`$/, "");
    }

    const structuredData = JSON.parse(rawText);
    return NextResponse.json(structuredData);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary. Please try again later." },
      { status: 500 }
    );
  }
}
