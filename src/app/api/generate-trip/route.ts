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
    - Budget: ₹${budget} INR (Total budget for all ${people} people combined. Excludes initial flights, but INCLUDING local hotels, food, and local transit. Divide appropriately to see if realistic!)

    INSTRUCTIONS FOR ITINERARY:
    1. Introduction (budgetAnalysis): Explain if ₹${budget} across ${people} people for ${days} days is highly realistic, tight, or luxurious for this destination.
    2. Accommodation (hotels): Recommend 3 specific hotels or residential neighborhoods fitting the budget.
       - They MUST be centrally located and near a major public transit/metro line, not on the remote outskirts.
       - Include price per night (in ₹), real rating, and a short address/area name.
    3. Day-by-day Breakdown (itinerary):
       - IMPORTANT: Start Day 1 routing from the HIGHEST RATED hotel among the options you just recommended.
       - Group locations logically to minimize travel time. Include activity/meal costs (in ₹) for all ${people} people.
       - IMPORTANT 'transportToNext' Logic: Provide the EXACT mode of travel from the PREVIOUS place (or from the highest-rated hotel for the first place).
         - If distance < 1km: Suggest "Walk (X mins)". Cost = ₹0.
         - If distance > 1km: Suggest "Metro/Local Bus (X mins)". Give the cost in ₹.
         - ONLY if there's no reliable local transport, or splitting an Uber/Auto/Taxi is cheaper for ${people} people, suggest "Uber/Auto/Taxi (X mins)". Give the cost in ₹.
    4. Local Culture (localCulture):
       - foodToTry: List 3 authentic, famous local dishes including a SPECIFIC BRAND or RESTAURANT NAME (e.g., "Jogeshwari Misal in Pune", or "Shauryawada for non-veg").
       - eventsOrFestivals: List 1-2 local events/festivals happening in the next 1-2 months. You MUST include the exact Dates or Month for planning (e.g., "Ganesh Chaturthi, Sept 7-17").

    IMPORTANT FORMATTING OVERRIDE:
    You MUST return your response as a valid JSON object ONLY. All estimated costs and prices MUST be integers (numbers, not strings with currency symbols). Do not wrap it in markdown block quotes. Use the EXACT following schema structure:
    {
      "budgetAnalysis": "Brief statement...",
      "hotels": [
        { "name": "...", "pricePerNight": 4000, "rating": 4.5, "description": "...", "shortAddress": "Near Metro Station, Area Name" }
      ],
      "itinerary": [
        {
          "day": 1,
          "theme": "...",
          "places": [
            {
              "placeName": "...",
              "description": "...",
              "estimatedCost": 1500,
              "rating": 4.8,
              "transportToNext": "Uber/Auto (15 mins, 3km)",
              "transportCost": 150
            }
          ]
        }
      ],
      "localCulture": {
        "foodToTry": ["Dish at Brand Name", "Dish at Brand Name"],
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
