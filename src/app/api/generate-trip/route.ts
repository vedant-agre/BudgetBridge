import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { destination, days, budget } = await req.json();

    if (!destination || !days || !budget) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = `
    You are an expert, realistic AI travel planner. Your job is to create a highly accurate, day-by-day travel itinerary. 
    You MUST prioritize the user's budget and ensure the places and prices you recommend are factual, open, and realistic as of today.

    USER REQUEST:
    - Destination: ${destination}
    - Duration: ${days} days
    - Budget: $${budget} (Total for all days, excluding flights from their origin, but INCLUDING local hotels, food, and local activities/transit)

    INSTRUCTIONS FOR ITINERARY:
    1. Introduction (budgetAnalysis): Briefly explain if the budget is highly realistic, tight, or luxurious for this destination.
    2. Accommodation (hotels): Recommend 2 specific, real hotels or neighborhoods that fit the budget. Give the estimated price per night and their real rating.
    3. Day-by-day Breakdown (itinerary):
       - Give logically grouped locations to minimize travel time on a single day.
       - Include estimated costs for activities and average meals for that day.
       - For 'transportToNext', provide the mode of travel, estimated time, and distance from the PREVIOUS place (or from the hotel for the first place of the day).
       - DO NOT include massive travel expenses from the user's home country (e.g., flight to Paris). Only include local transit.

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
      ]
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
