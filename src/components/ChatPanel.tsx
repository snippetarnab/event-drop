'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  ArrowRight,
  ChevronRight,
  Sparkles,
  CheckSquare,
} from 'lucide-react';
import { ChatMessage, EventPlan } from '@/types/event';
import { formatCurrency } from '@/lib/formatters';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  currentPlan: EventPlan | null;
  isPlanOpen: boolean;
  onOpenPlan: () => void;
  onSendMessage: (messageText: string) => void;
  onSelectPrompt: (promptText: string) => void;
}

const STARTER_PROMPTS = [
  {
    tag: 'Wedding',
    title: 'Kolkata Traditional Wedding',
    prompt: 'Plan a 150-guest wedding in Kolkata, ₹8L budget, Dec with authentic Bengali rituals, banquet dinner, and photography.',
  },
  {
    tag: 'Private Party',
    title: 'Goa 30th Birthday Beach Bash',
    prompt: 'Plan a 40-guest 30th Birthday Party in Goa, ₹1.5L budget, sunset beach vibes, acoustic DJ, and barbecue.',
  },
  {
    tag: 'Conference',
    title: 'Bangalore Tech Hackathon',
    prompt: 'Plan a 2-day Tech Hackathon in Bangalore, 250 attendees, ₹5L budget, catering, venue space, and operations.',
  },
  {
    tag: 'Reception',
    title: 'Mumbai Rooftop Mixer',
    prompt: 'Plan an 80-guest corporate networking cocktail party in Bandra Mumbai, ₹3L budget, acoustic music & tapas.',
  },
];

const FOLLOW_UP_SUGGESTIONS = [
  'Cut overall budget by 20%',
  'Increase guest count to 200',
  'Add a live Sitar & Shehnai ensemble',
  'Suggest royal emerald and gold decor',
  'Curate a live regional street-food counter',
];

export function ChatPanel({
  messages,
  isLoading,
  currentPlan,
  isPlanOpen,
  onOpenPlan,
  onSendMessage,
  onSelectPrompt,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 130)}px`;
  };

  const renderMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-[#18181B]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-[#3F3F46] my-0.5 leading-relaxed">
            {renderedLine}
          </li>
        );
      }

      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={idx} className="ml-4 list-decimal text-[#3F3F46] my-0.5 leading-relaxed">
            {renderedLine}
          </li>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="text-[#3F3F46] my-1 leading-relaxed">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F6F2] border-r border-[#E8E6E1]">
      {/* Panel Top Sub-header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#E8E6E1] bg-white/70">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#16A34A]" />
          <span className="text-xs font-bold text-[#18181B] tracking-tight">
            Planning Consultation
          </span>
        </div>

        {/* Button to view checklist right from header */}
        {currentPlan && (
          <button
            onClick={onOpenPlan}
            className="flex items-center gap-1.5 rounded-full border border-[#E8E6E1] bg-white hover:bg-[#F4F3EF] px-3 py-1 text-xs font-semibold text-[#18181B] shadow-sm transition-all"
          >
            <CheckSquare className="h-3.5 w-3.5 text-[#16A34A]" />
            <span>{isPlanOpen ? 'Checklist Open' : 'Open Checklist'}</span>
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-6 px-2">
            <div className="h-12 w-12 rounded-2xl bg-white border border-[#E8E6E1] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center mb-3 text-[#18181B]">
              <Sparkles className="h-5 w-5 text-[#D97706]" />
            </div>
            <h3 className="text-base font-bold text-[#18181B] mb-1">
              Start Your Event Plan
            </h3>
            <p className="text-xs text-[#71717A] max-w-xs mb-6 leading-relaxed">
              Describe your occasion, location, guest count, and budget. Your plan and checklist will be compiled and ready to view whenever you click.
            </p>

            {/* Starter Prompt Cards */}
            <div className="grid grid-cols-1 gap-2.5 w-full max-w-sm text-left">
              {STARTER_PROMPTS.map((starter, index) => (
                <button
                  key={index}
                  onClick={() => onSelectPrompt(starter.prompt)}
                  className="flex items-start justify-between p-3.5 rounded-2xl border border-[#E8E6E1] bg-white hover:border-[#D4D2CB] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all text-left group"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-full bg-[#F4F3EF] px-2 py-0.5 text-[10px] font-semibold text-[#52525B]">
                        {starter.tag}
                      </span>
                      <span className="text-xs font-bold text-[#18181B] truncate">
                        {starter.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71717A] line-clamp-2 leading-relaxed">
                      {starter.prompt}
                    </p>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-[#F4F3EF] group-hover:bg-[#18181B] group-hover:text-white flex items-center justify-center text-[#71717A] transition-all flex-shrink-0 mt-0.5">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isAssistant = message.role === 'assistant';
              const hasPlanSnapshot = Boolean(message.planSnapshot);
              const snapshot = message.planSnapshot;

              return (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm ${
                      isAssistant
                        ? 'bg-white border border-[#E8E6E1] text-[#18181B] shadow-[0_2px_6px_rgba(0,0,0,0.03)]'
                        : 'bg-[#18181B] text-white shadow-sm'
                    }`}
                  >
                    {isAssistant ? (
                      <div className="space-y-1">
                        {renderMessageContent(message.content)}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed font-normal">
                        {message.content}
                      </p>
                    )}

                    {/* Dedicated Non-Intrusive Plan & Checklist Button within message */}
                    {isAssistant && hasPlanSnapshot && snapshot && (
                      <div className="mt-3 pt-3 border-t border-[#E8E6E1] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                            <CheckSquare className="h-3.5 w-3.5 text-[#16A34A]" />
                            <span className="truncate">
                              {snapshot.eventDetails?.type || 'Event Plan Ready'}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#71717A] mt-0.5 truncate">
                            {formatCurrency(snapshot.eventDetails?.budget, snapshot.eventDetails?.currency)} •{' '}
                            {snapshot.eventDetails?.guests} guests •{' '}
                            {snapshot.vendorChecklist?.length || 0} vendor actions
                          </div>
                        </div>

                        <button
                          onClick={onOpenPlan}
                          className="flex items-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all flex-shrink-0 w-fit"
                        >
                          <span>See Plan Checklist</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`text-[10px] mt-2 flex items-center justify-between ${
                        isAssistant ? 'text-[#8E8E93]' : 'text-neutral-400'
                      }`}
                    >
                      <span>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isAssistant && (
                        <span className="text-[10px] text-[#71717A]">
                          Event Lead
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="rounded-2xl bg-white border border-[#E8E6E1] px-4 py-3 text-xs text-[#71717A] flex items-center gap-2 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#18181B] animate-pulse" />
                  <span>Updating schedule, allocations, and checklist...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Suggested Follow-ups */}
      {currentPlan && (
        <div className="border-t border-[#E8E6E1] bg-white/70 px-3 py-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider mr-1">
              Adjust:
            </span>
            {FOLLOW_UP_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => onSelectPrompt(suggestion)}
                className="flex items-center gap-1 text-[11px] rounded-full border border-[#E8E6E1] bg-white hover:bg-[#F4F3EF] hover:border-[#D4D2CB] text-[#3F3F46] px-2.5 py-1 transition-all disabled:opacity-40"
              >
                <span>{suggestion}</span>
                <ChevronRight className="h-2.5 w-2.5 text-[#8E8E93]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 border-t border-[#E8E6E1] bg-white">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder={
              currentPlan
                ? 'Type an update (e.g., "Cut budget by 20%", "Add photography")...'
                : 'Describe your event (type, location, guest count, budget)...'
            }
            className="w-full resize-none rounded-2xl border border-[#E8E6E1] bg-[#F7F6F2] py-2.5 pl-3.5 pr-11 text-xs sm:text-sm text-[#18181B] placeholder-[#8E8E93] focus:border-[#18181B] focus:bg-white focus:outline-none transition-all max-h-32"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-[#18181B] text-white hover:bg-[#27272A] disabled:opacity-30 transition-all"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
        <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-[#8E8E93]">
          <span>Enter to send • Shift+Enter for new line</span>
          {currentPlan && (
            <button
              onClick={onOpenPlan}
              className="text-[#18181B] font-semibold hover:underline"
            >
              See Plan Checklist →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
