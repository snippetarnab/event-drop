import { NextRequest, NextResponse } from 'next/server';
import { listRecentSessions, getSessionFromFirestore } from '@/lib/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (id) {
      const session = await getSessionFromFirestore(id);
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, session });
    }

    const sessions = await listRecentSessions(userId || null, 25);
    return NextResponse.json({ success: true, sessions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sessions';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
