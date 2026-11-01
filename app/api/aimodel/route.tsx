import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';
import { currentUser, auth } from "@clerk/nextjs/server";
import { aj } from "@/lib/arcjet";

const PROMPT=`You are an AI Trip Planner Agent with 4 distinct modes. Based on what the user asks, follow the corresponding instruction:

1. "Create New Trip" (or planning a specific trip):
   Help the user plan a trip by asking ONE relevant trip-related question at a time in this order: Starting location, Destination, Group size, Budget, Trip duration, Travel interests, Special requirements. Do not ask multiple questions at once. Wait for the user's answer before asking the next.

2. "Inspire me where to go":
   Do NOT ask questions. Recommend 3-4 of the most highly attractive, world-renowned best places to visit. For each place, return its Name and Description.

3. "Discover Hidden gems":
   Do NOT ask questions. Recommend 3-4 incredible, lesser-known secret destinations. Return Name and Description.

4. "Adventure Destination":
   Do NOT ask questions. Recommend 3-4 thrilling adventure destinations. Return Name and Description.

5. "Generate Full Trip JSON":
   When Provided with trip details and a detailed schema, ignore all previous instructions and output ONLY the valid JSON object matching the requested schema. Do NOT include any conversational text or fields like "resp" or "ui" unless strictly requested in that schema.

CRITICAL INSTRUCTION: You MUST ALWAYS return your response as a valid JSON object ONLY. Never return plain text.
Every single response from you MUST strictly use the JSON schema requested in the user prompt if it contains one, otherwise default to this:
{
  "resp": "Your conversational text response (IF mode 1) OR an Array of Objects if listing places in modes 2/3/4 based on this structure: [{ \"name\": \"Place\", \"description\": \"...\" }]",
  "ui": "budget/groupSize/tripDuration/final" // (Choose ONE based on what component should render next, or "final" if showing places)
}`;

export async function POST(req: NextRequest) {
    try {
        const {messages} = await req.json();
        const user = await currentUser();
        const {has} = await auth();
        const hasPremiumAccess = has({ plan: 'monthly' });

        // Fast limit check logic:
        const isNewInteraction = messages.length <= 1;
        const requestedTokens = isNewInteraction ? 5 : 0;

        if (!hasPremiumAccess) {
          try {
            const decision = await aj.protect(req, { 
              userId: user?.primaryEmailAddress?.emailAddress ?? "anonymous", 
              requested: requestedTokens 
            });
            
            console.log("Arcjet Decision:", decision);

            if (decision.isDenied()) {
              if (decision.reason.isRateLimit()) {
                return NextResponse.json({
                  resp: "You have exceeded your daily limit. Please try again tomorrow.",
                  ui: "limit"
                });
              }
              return NextResponse.json(
                { error: "Access Denied", reason: decision.reason },
                { status: 403 },
              );
            }
          } catch (arcjetErr) {
            console.warn("Arcjet check warning (continuing request):", arcjetErr);
          }
        }

        const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const openRouterApiKey = process.env.OPENROUTER_API_KEY;

        let openai: OpenAI;
        let modelName: string;

        if (geminiApiKey) {
          openai = new OpenAI({
            baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
            apiKey: geminiApiKey,
          });
          modelName = "gemini-3.6-flash";
        } else {
          openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: openRouterApiKey || "",
          });
          modelName = "openai/gpt-4o-mini";
        }

        const completion = await openai.chat.completions.create({
            model: modelName,
            response_format: {
                type: 'json_object'
            },
            messages: [
                {
                    role: 'system',
                    content: PROMPT
                },
                ...messages
            ],
        });
      
        console.log(completion.choices[0].message);
        const message = completion.choices[0].message;
        let parsedContent;
        try {
            parsedContent = JSON.parse(message.content ?? '{}');
        } catch (parseError) {
            console.error("JSON parsing error:", message.content);
            parsedContent = { resp: message.content, ui: 'Final' };
        }
        return NextResponse.json(parsedContent);  
    }
    catch(e: any)
    {
        console.error("POST /api/aimodel Error: ", e);
        return NextResponse.json({error: e.message || String(e), stack: e.stack}, { status: 500 });
    }
}