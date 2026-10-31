import { NextRequest, NextResponse } from 'next/server';
import { generateEventChatResponse } from '@/lib/gemini';
import { saveSessionToFirestore } from '@/lib/firestore';
import { ChatMessage, EventPlan } from '@/types/event';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages = [],
      currentPlan = null,
      sessionId = `session_${Date.now()}`,
      userId = null,
      userEmail = null,
    } = body;

    // Check for custom API key passed in header or query
    const customApiKey = req.headers.get('x-gemini-api-key') || null;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Call Gemini with multi-model failover via @google/genai SDK
    const { conversationalReply, plan } = await generateEventChatResponse({
      messages,
      currentPlan,
      customApiKey,
    });

    // Prepare updated messages list to save
    const updatedMessages: ChatMessage[] = [
      ...messages.map((m: { role: string; content: string; id?: string; timestamp?: number }, i: number) => ({
        id: m.id || `msg_${i}_${Date.now()}`,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        timestamp: m.timestamp || Date.now(),
      })),
      {
        id: `msg_asst_${Date.now()}`,
        role: 'assistant',
        content: conversationalReply,
        timestamp: Date.now(),
        planSnapshot: plan,
      },
    ];

    // Persist to Firestore (associated with authenticated userId if logged in)
    let persistenceStatus = 'unknown';
    if (plan) {
      const saveResult = await saveSessionToFirestore(sessionId, plan, updatedMessages, {
        userId,
        userEmail,
      });
      persistenceStatus = saveResult.mode;
    }

    return NextResponse.json({
      success: true,
      sessionId,
      reply: conversationalReply,
      plan,
      persistence: persistenceStatus,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('[API Chat Error]:', error);
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
