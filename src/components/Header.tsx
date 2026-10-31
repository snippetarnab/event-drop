'use client';

import React from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  Share2,
  Plus,
  CheckSquare,
  MessageSquare,
  FileEdit,
  Bookmark,
  LogIn,
  User,
} from 'lucide-react';
import {
  Show,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import { EventPlan } from '@/types/event';

interface HeaderProps {
  currentPlan: EventPlan | null;
  activeView: 'form' | 'chat' | 'checklist';
  onChangeView: (view: 'form' | 'chat' | 'checklist') => void;
  onOpenSettings: () => void;
  onOpenSavedModal: () => void;
  onOpenExportModal: () => void;
  onNewPlan: () => void;
}

export function Header({
  currentPlan,
  activeView,
  onChangeView,
  onOpenSettings,
  onOpenSavedModal,
  onOpenExportModal,
  onNewPlan,
}: HeaderProps) {
  const { isSignedIn, user } = useUser();

  const totalTasks =
    (currentPlan?.vendorChecklist?.length || 0) +
    (currentPlan?.timeline?.reduce((acc, t) => acc + (t.tasks?.length || 0), 0) || 0);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E8E6E1] bg-[#F7F6F2]/90 px-4 sm:px-6 py-2.5 backdrop-blur-md">
      {/* Brand & Page Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181B]">
            Event-drop
          </h1>
          <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-[#18181B]/30 mx-1" />
          <span className="hidden sm:inline-block text-xs font-medium text-[#71717A]">
            Weddings • Birthdays • Community
          </span>
        </div>
      </div>

      {/* Center Navigation Switcher */}
      <div className="flex items-center gap-1 bg-[#E2E0D8] p-1 rounded-full text-xs font-semibold">
        <button
          onClick={() => onChangeView('form')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
            activeView === 'form'
              ? 'bg-white text-[#18181B] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <FileEdit className="h-3.5 w-3.5" />
          <span>Event Form</span>
        </button>

        <button
          onClick={() => onChangeView('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
            activeView === 'chat'
              ? 'bg-white text-[#18181B] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
              : 'text-[#71717A] hover:text-[#18181B]'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Chatbot</span>
        </button>

        {currentPlan && (
          <button
            onClick={() => onChangeView('checklist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeView === 'checklist'
                ? 'bg-white text-[#18181B] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5 text-[#16A34A]" />
            <span>Checklist</span>
            {totalTasks > 0 && (
              <span className="rounded-full bg-[#18181B] text-white px-1.5 py-0.2 text-[10px]">
                {totalTasks}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Saved Plans Button */}
        <button
          onClick={onOpenSavedModal}
          className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-[#E8E6E1] bg-white text-[#52525B] hover:text-[#18181B] hover:border-[#D4D2CB] text-xs font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
          title="Browse Saved Event Plans"
        >
          <Bookmark className="h-3.5 w-3.5 text-[#71717A]" />
          <span className="hidden md:inline">Saved Plans</span>
        </button>

        {/* Export / Share button */}
        {currentPlan && (
          <button
            onClick={onOpenExportModal}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E6E1] bg-white text-[#52525B] hover:text-[#18181B] hover:border-[#D4D2CB] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
            title="Export summary"
          >
            <Share2 className="h-4 w-4" />
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E6E1] bg-white text-[#52525B] hover:text-[#18181B] hover:border-[#D4D2CB] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
          title="Preferences & Key"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

        {/* Authentication State: Signed In / Signed Out */}
        <Show when="signed-in">
          <div className="flex items-center pl-1">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-8 w-8 rounded-full border border-[#E8E6E1]',
                },
              }}
            />
          </div>
        </Show>

        <Show when="signed-out">
          <div className="flex items-center gap-1.5">
            <Link
              href="/sign-in"
              className="flex items-center gap-1.5 rounded-full border border-[#E8E6E1] bg-white hover:bg-[#F4F3EF] px-3.5 py-1.5 text-xs font-semibold text-[#18181B] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all"
            >
              <LogIn className="h-3.5 w-3.5 text-[#71717A]" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/sign-up"
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all"
            >
              <span>Sign Up</span>
            </Link>
          </div>
        </Show>

        {/* New Plan button */}
        <button
          onClick={onNewPlan}
          className="hidden lg:flex items-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] px-4 py-2 text-xs font-semibold text-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Plan</span>
        </button>
      </div>
    </header>
  );
}
