// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// --- Type Definitions (Optional but good practice) ---
type RequestBody = {
  prompt: string;
};

type ResponseData = {
  response?: string; // Successful response text
  error?: string;    // Error message
  details?: any;     // Optional additional error details
}

// --- Get API Key ---
const apiKey = process.env.GEMINI_API_KEY;

// --- Initialize Gemini Client (Cached Instance) ---

let genAI: GoogleGenerativeAI | null = null;
let model: any = null; // Consider using a more specific type if available from SDK

function initializeGeminiClient() {
    if (!apiKey) {
        console.error("🔴 GEMINI_API_KEY is not defined.");
        return false;
    }
    if (!genAI) {
        console.log("✨ Initializing GoogleGenerativeAI client...");
        try {
             genAI = new GoogleGenerativeAI(apiKey);
             model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
             console.log("✅ Gemini client initialized successfully.");
        } catch (error) {
             console.error("🔴 Error initializing Gemini client:", error);
             genAI = null; // Reset on failure
             model = null;
             return false;
        }
    }
    return true;
}

// Ensure client is initialized when the module loads or on first request
initializeGeminiClient();



const generationConfig = {
   // temperature: 0.7,
   // maxOutputTokens: 2048,
};


// --- POST Handler for the API route ---
export async function POST(req: Request): Promise<NextResponse<ResponseData>> {

  // Re-check initialization in case of serverless cold starts or errors
  if (!genAI || !model) {
       if (!initializeGeminiClient() || !model) { // Attempt re-initialization
           return NextResponse.json(
               { error: 'Server configuration error: Gemini client could not be initialized.' },
               { status: 500 }
           );
       }
  }

  let requestBody: RequestBody;
  try {
      // 1. Parse Request Body (App Router uses standard Request object)
      requestBody = await req.json();
  } catch (error) {
      console.error("🔴 Error parsing request body:", error);
      return NextResponse.json({ error: 'Invalid request body: Must be valid JSON.' }, { status: 400 });
  }

  // 2. Validate Prompt
  const { prompt } = requestBody;
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return NextResponse.json({ error: 'Invalid request: "prompt" must be a non-empty string.' }, { status: 400 });
  }
   if (prompt.length > 5000) { // Example length limit
     return NextResponse.json({ error: 'Prompt is too long (max 5000 characters).' }, { status: 400 });
   }

  console.log(`🤖 API Route: Processing prompt - "${prompt.substring(0, 60)}..."`);

  try {
    // 3. Call Gemini API
    const result = await model.generateContent(
        prompt,
        // Uncomment to use config: { safetySettings, generationConfig }
    );

    const response = result.response;
    const text = response?.text(); // Safely get text

    // 4. Handle Potential Blocks or Errors from API
    if (!text) {
        console.warn("⚠️ API Route: Gemini response blocked or empty.", JSON.stringify(response, null, 2));
        const finishReason = response?.candidates?.[0]?.finishReason;
        const safetyRatings = response?.candidates?.[0]?.safetyRatings;

        let errorMessage = "Gemini API did not return a valid response.";
        if (finishReason === 'SAFETY') {
             errorMessage = `Content blocked by Gemini's safety filters. Your prompt may need adjustment.`;
        } else if (finishReason) {
             errorMessage = `Content generation stopped. Reason: ${finishReason}.`;
        }
        const details = finishReason ? { finishReason, safetyRatings } : undefined;
        return NextResponse.json({ error: errorMessage, details }, { status: 500 });
    }

    // 5. Success: Send Response Text
    console.log(`✅ API Route: Successfully generated response.`);
    return NextResponse.json({ response: text }, { status: 200 });

  } catch (error: unknown) {
    // 6. Handle Unexpected Errors during API call
    console.error("🔴 API Route: Error calling Gemini API:", error);
    let message = 'An unexpected error occurred while contacting the AI model.';
    // Log more details server-side if needed
    // if (error instanceof Error) { console.error(error.stack); }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}