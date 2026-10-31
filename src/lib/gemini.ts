import { GoogleGenAI } from '@google/genai';
import { EventPlan } from '@/types/event';

export const SYSTEM_INSTRUCTION = `You are an expert event planning lead and project coordinator for "Event-drop". You help clients structure, plan, and refine weddings, conferences, parties, and celebrations with thoughtful operational expertise.

Tone and style:
- Speak naturally and professionally like an experienced human event producer.
- Never sound robotic, preachy, or like an AI chatbot. Avoid phrases like "As an AI", "I have generated this for you", "According to my calculations".
- Speak directly, concisely, and encouragingly (e.g., "Here is a balanced plan for the Kolkata wedding. I've weighted the budget toward high-impact catering and venue spaces while keeping a 5% contingency buffer.").

Whenever a plan is created or modified, output your response in TWO distinct sections:
1. Conversational Feedback: A concise message addressing the user's brief, offering creative ideas (themes, menus, decor), and summarizing adjustments.
2. Structured JSON Payload: A strict JSON block wrapped in \`\`\`json ... \`\`\` matching this exact schema:

{
  "eventDetails": {
    "type": "string",
    "guests": 0,
    "budget": 0,
    "currency": "INR",
    "dateOrSeason": "string",
    "location": "string",
    "cultureOrTheme": "string"
  },
  "budgetBreakdown": [
    {
      "category": "string",
      "allocatedAmount": 0,
      "percentage": 0,
      "notes": "string"
    }
  ],
  "timeline": [
    {
      "milestone": "string",
      "timeframe": "string",
      "tasks": ["string"]
    }
  ],
  "vendorChecklist": [
    {
      "category": "string",
      "status": "Pending",
      "actionItem": "string"
    }
  ],
  "creativeIdeas": {
    "themeSuggestions": ["string"],
    "menuHighlights": ["string"],
    "decorConcepts": ["string"]
  }
}

Guidelines:
- When modifying an existing plan (e.g., "Cut the budget by 20%", "Change to Goa", "Include live music"), review the Current Plan State provided and adjust amounts, percentages, and tasks proportionally.
- Ensure budget allocations sum up accurately to the total budget.
- Provide culturally authentic, realistic vendor and culinary recommendations.`;

export interface ParseResult {
  conversationalReply: string;
  plan: EventPlan | null;
  rawText: string;
}

export function parseDualResponse(responseText: string, currentPlan: EventPlan | null): ParseResult {
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = responseText.match(jsonBlockRegex);

  let plan: EventPlan | null = null;
  let conversationalReply = responseText;

  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (parsed && typeof parsed === 'object') {
        plan = {
          eventDetails: parsed.eventDetails || currentPlan?.eventDetails || {
            type: 'Event',
            guests: 100,
            budget: 0,
            currency: 'INR',
            dateOrSeason: '',
            location: '',
            cultureOrTheme: '',
          },
          budgetBreakdown: Array.isArray(parsed.budgetBreakdown) ? parsed.budgetBreakdown : (currentPlan?.budgetBreakdown || []),
          timeline: Array.isArray(parsed.timeline) ? parsed.timeline : (currentPlan?.timeline || []),
          vendorChecklist: Array.isArray(parsed.vendorChecklist) ? parsed.vendorChecklist : (currentPlan?.vendorChecklist || []),
          creativeIdeas: parsed.creativeIdeas || currentPlan?.creativeIdeas || {
            themeSuggestions: [],
            menuHighlights: [],
            decorConcepts: [],
          },
        };
      }
      conversationalReply = responseText.replace(match[0], '').trim();
    } catch (err) {
      console.warn('[Parser] JSON parsing note:', err);
    }
  }

  if (!plan && currentPlan) {
    plan = currentPlan;
  }

  if (!conversationalReply.trim()) {
    conversationalReply = "I have updated the schedule and allocation details for your event. You can review the cards on the board.";
  }

  return {
    conversationalReply,
    plan,
    rawText: responseText,
  };
}

export async function generateEventChatResponse({
  messages,
  currentPlan,
  customApiKey,
}: {
  messages: Array<{ role: string; content: string }>;
  currentPlan: EventPlan | null;
  customApiKey?: string | null;
}): Promise<ParseResult> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return generateNaturalFallback(messages, currentPlan);
  }

  const ai = new GoogleGenAI({ apiKey });

  const planContext = currentPlan
    ? `\n\n[CURRENT PLAN STATE JSON]:\n${JSON.stringify(currentPlan, null, 2)}\n[END CURRENT PLAN]`
    : `\n\n[CURRENT PLAN STATE]: None yet (starting fresh).`;

  const formattedContents = messages.map((m, index) => {
    const isLast = index === messages.length - 1;
    let contentText = m.content;
    if (isLast && m.role === 'user') {
      contentText += planContext;
    }
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: contentText }],
    };
  });

  const CANDIDATE_MODELS = [
    process.env.GEMINI_MODEL,
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-2.5-flash',
  ].filter(Boolean) as string[];

  let lastError: unknown = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.65,
        },
      });

      const outputText = response.text || '';
      if (outputText) {
        return parseDualResponse(outputText, currentPlan);
      }
    } catch (err: unknown) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Gemini Failover] Model ${model} encountered an issue (${msg}). Retrying with next available model...`);
    }
  }

  // If all models encounter 503 or quota limits, provide clean graceful fallback
  console.warn('[Gemini Failover] All models exhausted, serving resilient fallback.');
  return generateNaturalFallback(messages, currentPlan);
}

// Natural human fallback when running in local demonstration mode
function generateNaturalFallback(
  messages: Array<{ role: string; content: string }>,
  currentPlan: EventPlan | null
): ParseResult {
  const lastUserMsg = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';
  const lower = lastUserMsg.toLowerCase();

  if (currentPlan && (lower.includes('cut') || lower.includes('reduce') || lower.includes('%'))) {
    const factor = lower.includes('20%') ? 0.8 : 0.85;
    const newTotal = Math.round(currentPlan.eventDetails.budget * factor);
    const updatedPlan: EventPlan = {
      ...currentPlan,
      eventDetails: {
        ...currentPlan.eventDetails,
        budget: newTotal,
      },
      budgetBreakdown: currentPlan.budgetBreakdown.map((item) => ({
        ...item,
        allocatedAmount: Math.round(item.allocatedAmount * factor),
      })),
    };

    return {
      conversationalReply: `I've adjusted the budget downward by ${Math.round((1 - factor) * 100)}% to ₹${newTotal.toLocaleString('en-IN')}. The reductions have been balanced evenly across venue, decor, and catering to preserve quality for essential services.`,
      plan: updatedPlan,
      rawText: '',
    };
  }

  const isKolkata = lower.includes('kolkata') || lower.includes('bengali') || lower.includes('wedding');
  const budget = lower.includes('8') ? 800000 : 500000;
  const guests = lower.includes('150') ? 150 : 100;

  const samplePlan: EventPlan = {
    eventDetails: {
      type: isKolkata ? 'Bengali Wedding & Reception' : 'Celebration Banquet',
      guests,
      budget,
      currency: 'INR',
      dateOrSeason: 'December (Winter Peak)',
      location: isKolkata ? 'Kolkata, West Bengal' : 'City Center Banquet',
      cultureOrTheme: isKolkata ? 'Traditional Heritage & Shehnai' : 'Modern Minimalist',
    },
    budgetBreakdown: [
      {
        category: 'Venue & Banquets',
        allocatedAmount: Math.round(budget * 0.35),
        percentage: 35,
        notes: 'Heritage Rajbari or riverside banquet hall with lawn access',
      },
      {
        category: 'Catering & Dining',
        allocatedAmount: Math.round(budget * 0.3),
        percentage: 30,
        notes: 'Traditional sit-down and live counters with authentic regional specialties',
      },
      {
        category: 'Decor & Florals',
        allocatedAmount: Math.round(budget * 0.15),
        percentage: 15,
        notes: 'Marigold cascades, brass lamps, fragrant tuberose strings, warm ambient lighting',
      },
      {
        category: 'Photography & Film',
        allocatedAmount: Math.round(budget * 0.1),
        percentage: 10,
        notes: 'Full ceremony coverage, candid portraiture, and short cinematic reel',
      },
      {
        category: 'Attire & Styling',
        allocatedAmount: Math.round(budget * 0.05),
        percentage: 5,
        notes: 'Traditional silk, styling essentials, and ceremony accessories',
      },
      {
        category: 'Contingency Reserve',
        allocatedAmount: Math.round(budget * 0.05),
        percentage: 5,
        notes: 'Reserved buffer for logistics, transport, and last-minute requests',
      },
    ],
    timeline: [
      {
        milestone: '6–8 Months Prior',
        timeframe: 'Foundation & Venue Booking',
        tasks: [
          'Lock venue agreement and ceremony timing',
          'Coordinate with family elders and head priest',
          'Book lead photographer and cinematography team',
        ],
      },
      {
        milestone: '3–4 Months Prior',
        timeframe: 'Catering & Design Sign-off',
        tasks: [
          'Conduct menu tasting session with caterer',
          'Approve floral decor palette and stage renders',
          'Send formal invitations and track outstation travel',
        ],
      },
      {
        milestone: '1 Month Prior',
        timeframe: 'Logistics & Rehearsals',
        tasks: [
          'Finalize guest count guarantee with catering lead',
          'Curate soundscape and traditional music cues',
          'Assemble ceremony kits and welcome gifts',
        ],
      },
      {
        milestone: 'Event Day',
        timeframe: 'Full Execution',
        tasks: [
          'Morning rituals and decor setup handover',
          'Guest arrival, welcoming ceremony & refreshments',
          'Grand evening banquet and formal celebrations',
        ],
      },
    ],
    vendorChecklist: [
      {
        category: 'Venue Management',
        status: 'In Progress',
        actionItem: 'Finalize morning access schedule and evening setup buffer',
      },
      {
        category: 'Catering Team',
        status: 'Pending',
        actionItem: 'Review live counter layout and evening sweet course timing',
      },
      {
        category: 'Decor & Florist',
        status: 'Pending',
        actionItem: 'Confirm mandap flower delivery and entrance arch installation',
      },
      {
        category: 'Photography / Film',
        status: 'Completed',
        actionItem: 'Sign vendor contract and share essential family shot list',
      },
      {
        category: 'Music & Ambience',
        status: 'Pending',
        actionItem: 'Confirm sound system permits and instrumental musicians',
      },
    ],
    creativeIdeas: {
      themeSuggestions: [
        'Heritage Courtyard with terracotta urns and warm brass accents',
        'Minimalist Jasmine & Sandalwood aesthetic with gentle candlelight',
        'Warm gold and crimson artisanal textile draping',
      ],
      menuHighlights: [
        'Welcome coolers: Fresh Gondhoraj lime and roasted green mango punch',
        'Appetizers: Hand-crusted fish fillets with grain mustard & crisp seasonal cutlets',
        'Main spread: Fragrant saffron pulao, king prawn curry, slow-cooked mutton, and paneer kofta',
        'Desserts: Warm date-palm jaggery delicacies and baked cottage cheese sweets',
      ],
      decorConcepts: [
        'Entrance walk flanked with hanging clay pots, jasmine garlands, and low floating diyas',
        'Stage adorned with hand-painted lotus motifs and soft diffused amber wash lights',
        'Photo seating area set with vintage wood furniture and draped linen backdrops',
      ],
    },
  };

  return {
    conversationalReply: `I have prepared the complete plan for your ${samplePlan.eventDetails.type}. The budget is balanced across the venue, catering, decor, and photography with a 5% contingency. You can review the cards on the board and let me know if you would like to adjust any numbers or timelines.`,
    plan: samplePlan,
    rawText: '',
  };
}
