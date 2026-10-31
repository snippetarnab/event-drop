'use client';

import React, { useEffect, useState } from 'react';
import { X, Calendar, ArrowRight, RefreshCw, User, Bookmark } from 'lucide-react';
import { EventSession } from '@/types/event';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (session: EventSession) => void;
  currentSessionId: string;
  userId?: string | null;
}

export function SavedPlansModal({
  isOpen,
  onClose,
  onLoadSession,
  currentSessionId,
  userId,
}: SavedPlansModalProps) {
  const [sessions, setSessions] = useState<Array<Pick<EventSession, 'id' | 'title' | 'updatedAt' | 'createdAt' | 'userId'>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const url = userId ? `/api/sessions?userId=${encodeURIComponent(userId)}` : '/api/sessions';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen, userId]);

  const handleSelectSession = async (sessionId: string) => {
    setLoadingSessionId(sessionId);
    try {
      const res = await fetch(`/api/sessions?id=${encodeURIComponent(sessionId)}`);
      const data = await res.json();
      if (data.success && data.session) {
        onLoadSession(data.session);
        onClose();
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setLoadingSessionId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#E8E6E1] bg-white p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8E8E93] hover:text-[#18181B] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-[#18181B]" />
            <h3 className="text-lg font-bold text-[#18181B] tracking-tight">
              Saved Event Plans
            </h3>
          </div>
          <p className="text-xs text-[#71717A] mt-0.5">
            {userId
              ? 'Stored securely in Firestore and linked to your account'
              : 'Recent sessions (Sign in with Clerk to keep them across all devices)'}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-[#71717A] border-b border-[#E8E6E1] pb-2 mb-4">
          <span>{sessions.length} Saved Plans</span>
          <button
            onClick={fetchSessions}
            disabled={isLoading}
            className="flex items-center gap-1 text-[#18181B] font-semibold hover:underline"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {isLoading && sessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8E8E93]">
              Loading plans...
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#8E8E93] space-y-1">
              <p>No saved event plans found yet.</p>
              <p className="text-[11px] text-[#A1A1AA]">
                Fill out the event form or start a chat to save your first event.
              </p>
            </div>
          ) : (
            sessions.map((item) => {
              const isCurrent = item.id === currentSessionId;
              const isItemLoading = loadingSessionId === item.id;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-[#18181B] bg-[#F4F3EF]'
                      : 'border-[#E8E6E1] bg-[#FBFBFA] hover:bg-white hover:border-[#D4D2CB]'
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#18181B] truncate">
                        {item.title}
                      </h4>
                      {isCurrent && (
                        <span className="rounded-full bg-[#18181B] px-2 py-0.2 text-[9px] font-bold text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8E8E93]">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(item.updatedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectSession(item.id)}
                    disabled={isItemLoading}
                    className="flex-shrink-0 flex items-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] px-3.5 py-1.5 text-xs font-semibold text-white transition-all disabled:opacity-40"
                  >
                    {isItemLoading ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <span>Open</span>
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-4 border-t border-[#E8E6E1] mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold text-[#18181B] bg-[#F4F3EF] hover:bg-[#EAE8E3]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
