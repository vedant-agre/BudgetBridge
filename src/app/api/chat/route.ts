import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini SDK with a completely separate API key (if provided),
// otherwise fall back to the main one. This prevents rate limiting!
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_CHAT_API_KEY || process.env.GEMINI_API_KEY 
});

export async function POST(req: NextRequest) {
  try {
    const { message, history, context } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const systemInstruction = `You are a helpful, enthusiastic, and expert travel assistant bot embedded in a Trip Planner application.
The user has just generated an itinerary for their trip, and you need to answer their follow-up questions.
If they ask about packing, visas, local customs, or alternative suggestions, answer specifically tailored to their destination.
Keep your answers brief, engaging, and in Markdown format so they are easy to read.

Here is the exact trip itinerary the user is looking at:
====================
${context}
====================
`;

    const chatResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemInstruction }] },
        { role: "model", parts: [{ text: "Understood! I'll act as the helpful travel assistant for this trip." }] },
        ...history,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        temperature: 0.7,
        tools: [{ googleSearch: {} }] // Enable Google Search Grounding for up-to-date facts if needed
      }
    });

    return NextResponse.json({
      text: chatResponse.text,
    });

  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    
    if (error?.status === 429 || error?.message?.includes("429")) {
      return NextResponse.json(
        { error: "Gemini Free Tier speed limit reached (15 requests/min). Please wait about 30 seconds and try again!" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate AI response. Please try again." },
      { status: 500 }
    );
  }
}
