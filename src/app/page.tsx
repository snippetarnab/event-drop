'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Header } from '@/components/Header';
import { ChatPanel } from '@/components/ChatPanel';
import { LiveDashboard } from '@/components/LiveDashboard';
import { EventPlannerForm, EventFormData } from '@/components/EventPlannerForm';
import { SavedPlansModal } from '@/components/SavedPlansModal';
import { ExportModal } from '@/components/ExportModal';
import { ChatMessage, EventPlan, EventSession } from '@/types/event';
import { formatCurrency } from '@/lib/formatters';

export default function EventDropApp() {
  const { isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPlan, setCurrentPlan] = useState<EventPlan | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  
  // Navigation view: 'form' | 'chat' | 'checklist'
  const [activeView, setActiveView] = useState<'form' | 'chat' | 'checklist'>('form');

  // Modals state
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existingKey = localStorage.getItem('gemini_api_key') || '';
    setCustomApiKey(existingKey);

    const newSessionId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setSessionId(newSessionId);
  }, []);

  const handleNewPlan = () => {
    const newSessionId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setSessionId(newSessionId);
    setMessages([]);
    setCurrentPlan(null);
    setActiveView('form');
  };

  const handleLoadSession = (session: EventSession) => {
    setSessionId(session.id);
    setCurrentPlan(session.plan);
    setMessages(session.messages || []);
    setActiveView('chat');
  };

  const executeChatRequest = async (userText: string, currentPlanState: EventPlan | null) => {
    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    const newMessagesList = [...messages, userMessage];
    setMessages(newMessagesList);
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (customApiKey) {
        headers['x-gemini-api-key'] = customApiKey;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: newMessagesList,
          currentPlan: currentPlanState,
          sessionId,
          userId: user?.id || null,
          userEmail: user?.primaryEmailAddress?.emailAddress || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      const assistantMessage: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Event plan updated.',
        timestamp: Date.now(),
        planSnapshot: data.plan,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.plan) {
        setCurrentPlan(data.plan);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'An error occurred';
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `Notice: ${errMsg}. Please check your connection or settings.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler when user submits the Main Event Setup Form
  const handleFormSubmit = async (formData: EventFormData) => {
    const effectiveCity = formData.city === 'Other City' && formData.customCityName
      ? formData.customCityName
      : formData.city;

    const venueLabel = formData.customVenueName
      ? `${formData.customVenueName} in ${effectiveCity}`
      : formData.selectedHall
      ? `${formData.selectedHall.name} (${formData.selectedHall.locality}, ${effectiveCity}) with capacity for ${formData.selectedHall.capacity.min}-${formData.selectedHall.capacity.max} guests`
      : `Any premier banquet hall in ${effectiveCity}`;

    const promptText = `Plan a ${formData.eventType} in ${effectiveCity} on ${formData.date} (${formData.seasonOrTimeframe}).
- Guest Count: ${formData.guestCount} attendees
- Total Target Budget: ${formatCurrency(formData.budget, formData.currency)}
- Selected Venue / Hall: ${venueLabel}
- Special Notes & Theme Preferences: ${formData.specialNotes || 'Traditional cultural elegance, authentic regional catering, and structured logistics.'}

Please generate the complete budget breakdown (venue, catering, decor, photography, attire, buffer), milestone execution timeline, vendor action items, and curated theme concepts.`;

    setActiveView('chat');
    await executeChatRequest(promptText, currentPlan);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#EDECE7] text-[#18181B]" />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#EDECE7] text-[#18181B]">
      {/* Top Application Header with Navigation Pills & Clerk Auth */}
      <Header
        currentPlan={currentPlan}
        activeView={activeView}
        onChangeView={(view) => setActiveView(view)}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onNewPlan={handleNewPlan}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 overflow-hidden relative">
        {/* VIEW 1: Main Event Setup Form */}
        {activeView === 'form' && (
          <div className="h-full overflow-y-auto p-4 sm:p-8 flex items-start justify-center animate-in fade-in duration-200">
            <EventPlannerForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              onCancel={currentPlan ? () => setActiveView('chat') : undefined}
            />
          </div>
        )}

        {/* VIEW 2: Chatbot Consultation View */}
        {activeView === 'chat' && (
          <div className="h-full flex overflow-hidden">
            {/* Centered Chat Panel */}
            <section className="w-full max-w-4xl mx-auto h-full flex flex-col border-x border-[#E8E6E1] bg-[#F7F6F2] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <ChatPanel
                messages={messages}
                isLoading={isLoading}
                currentPlan={currentPlan}
                isPlanOpen={false}
                onOpenPlan={() => setActiveView('checklist')}
                onSendMessage={(text) => executeChatRequest(text, currentPlan)}
                onSelectPrompt={(prompt) => executeChatRequest(prompt, currentPlan)}
              />
            </section>
          </div>
        )}

        {/* VIEW 3: Full Plan & Checklist Board */}
        {activeView === 'checklist' && (
          <div className="h-full overflow-hidden flex flex-col animate-in fade-in duration-200">
            <LiveDashboard
              plan={currentPlan}
              onClose={() => setActiveView('chat')}
              onUpdatePlan={(updated) => setCurrentPlan(updated)}
              onSelectPrompt={(prompt) => {
                setActiveView('chat');
                executeChatRequest(prompt, currentPlan);
              }}
            />
          </div>
        )}
      </main>

      {/* Application Modals */}
      <SavedPlansModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onLoadSession={handleLoadSession}
        currentSessionId={sessionId}
        userId={user?.id || null}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        plan={currentPlan}
      />
    </div>
  );
}
