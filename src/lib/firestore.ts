import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Firestore,
} from 'firebase/firestore';
import { EventPlan, ChatMessage, EventSession } from '@/types/event';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let db: Firestore | null = null;
const isConfigured = Boolean(firebaseConfig.projectId && (firebaseConfig.apiKey || process.env.FIREBASE_CLIENT_EMAIL));

// In-memory fallback for local development or when credentials are not yet configured
const inMemorySessions = new Map<string, EventSession>();

function getDbInstance(): Firestore | null {
  if (db) return db;
  if (!firebaseConfig.projectId) return null;

  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    return db;
  } catch (err) {
    console.warn('[Firestore] Initialization warning:', err);
    return null;
  }
}

export function isFirestoreActive(): boolean {
  return isConfigured && getDbInstance() !== null;
}

export async function saveSessionToFirestore(
  sessionId: string,
  plan: EventPlan,
  messages: ChatMessage[],
  userInfo?: { userId?: string | null; userEmail?: string | null }
): Promise<{ success: boolean; mode: 'firestore' | 'memory' }> {
  const title = plan.eventDetails?.type
    ? `${plan.eventDetails.type} in ${plan.eventDetails.location || 'Unknown'}`
    : 'Untitled Event Plan';

  const existing = inMemorySessions.get(sessionId);

  const sessionData: EventSession = {
    id: sessionId,
    title,
    userId: userInfo?.userId ?? existing?.userId ?? null,
    userEmail: userInfo?.userEmail ?? existing?.userEmail ?? null,
    updatedAt: Date.now(),
    createdAt: existing?.createdAt || Date.now(),
    plan,
    messages,
  };

  // Always keep in-memory copy
  inMemorySessions.set(sessionId, sessionData);

  const database = getDbInstance();
  if (!database) {
    return { success: true, mode: 'memory' };
  }

  try {
    const docRef = doc(database, 'event_plans', sessionId);
    await setDoc(docRef, sessionData, { merge: true });
    return { success: true, mode: 'firestore' };
  } catch (error) {
    console.error('[Firestore] Error saving event plan:', error);
    return { success: true, mode: 'memory' };
  }
}

export async function deleteSessionFromFirestore(sessionId: string): Promise<boolean> {
  inMemorySessions.delete(sessionId);
  const database = getDbInstance();
  if (!database) {
    return true;
  }

  try {
    const docRef = doc(database, 'event_plans', sessionId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('[Firestore] Error deleting event plan:', error);
    return false;
  }
}

export async function getSessionFromFirestore(sessionId: string): Promise<EventSession | null> {
  const database = getDbInstance();
  if (!database) {
    return inMemorySessions.get(sessionId) || null;
  }

  try {
    const docRef = doc(database, 'event_plans', sessionId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as EventSession;
    }
  } catch (error) {
    console.error('[Firestore] Error fetching event plan:', error);
  }

  return inMemorySessions.get(sessionId) || null;
}

export async function listRecentSessions(
  userId?: string | null,
  max = 20
): Promise<Array<Pick<EventSession, 'id' | 'title' | 'updatedAt' | 'createdAt' | 'userId'>>> {
  const database = getDbInstance();

  if (!database) {
    let list = Array.from(inMemorySessions.values());
    if (userId) {
      list = list.filter((s) => s.userId === userId || !s.userId);
    }
    return list
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, max)
      .map(({ id, title, updatedAt, createdAt, userId }) => ({ id, title, updatedAt, createdAt, userId }));
  }

  try {
    let q;
    if (userId) {
      q = query(
        collection(database, 'event_plans'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc'),
        limit(max)
      );
    } else {
      q = query(
        collection(database, 'event_plans'),
        orderBy('updatedAt', 'desc'),
        limit(max)
      );
    }

    const querySnapshot = await getDocs(q);
    const results: Array<Pick<EventSession, 'id' | 'title' | 'updatedAt' | 'createdAt' | 'userId'>> = [];
    querySnapshot.forEach((d) => {
      const data = d.data() as EventSession;
      results.push({
        id: data.id,
        title: data.title || 'Untitled Event',
        updatedAt: data.updatedAt || Date.now(),
        createdAt: data.createdAt || Date.now(),
        userId: data.userId || null,
      });
    });
    return results;
  } catch (error) {
    console.warn('[Firestore] Query warning (falling back to simple fetch):', error);
    // In case Firestore index for where + orderBy is still building, fetch without compound where
    try {
      const fallbackQuery = query(collection(database, 'event_plans'), orderBy('updatedAt', 'desc'), limit(max));
      const snap = await getDocs(fallbackQuery);
      const results: Array<Pick<EventSession, 'id' | 'title' | 'updatedAt' | 'createdAt' | 'userId'>> = [];
      snap.forEach((d) => {
        const data = d.data() as EventSession;
        if (!userId || data.userId === userId || !data.userId) {
          results.push({
            id: data.id,
            title: data.title || 'Untitled Event',
            updatedAt: data.updatedAt || Date.now(),
            createdAt: data.createdAt || Date.now(),
            userId: data.userId || null,
          });
        }
      });
      return results;
    } catch (fallbackErr) {
      console.error('[Firestore] Fallback query error:', fallbackErr);
      return Array.from(inMemorySessions.values())
        .slice(0, max)
        .map(({ id, title, updatedAt, createdAt, userId }) => ({ id, title, updatedAt, createdAt, userId }));
    }
  }
}
