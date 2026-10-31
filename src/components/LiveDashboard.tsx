'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Coins,
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  Check,
  CheckSquare,
  Square,
  UtensilsCrossed,
  Palette,
  Compass,
  Info,
  ChevronRight,
  Filter,
  Search,
  Grid,
  Plus,
  User,
  X,
  Building2,
  Star,
} from 'lucide-react';
import { EventPlan, VendorChecklistItem } from '@/types/event';
import { formatCurrency, formatNumber } from '@/lib/formatters';

interface LiveDashboardProps {
  plan: EventPlan | null;
  onUpdatePlan?: (updatedPlan: EventPlan) => void;
  onSelectPrompt?: (prompt: string) => void;
  onClose?: () => void;
}

export function LiveDashboard({ plan, onUpdatePlan, onSelectPrompt, onClose }: LiveDashboardProps) {
  const [activeTab, setActiveTab] = useState<'board' | 'budget' | 'schedule' | 'curation'>('board');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#EDECE7]">
        <div className="h-16 w-16 rounded-3xl bg-white border border-[#E8E6E1] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center justify-center mb-4 text-[#18181B]">
          <Calendar className="h-7 w-7 text-[#71717A]" />
        </div>
        <h3 className="text-base font-bold text-[#18181B] mb-1">
          Event Workspace
        </h3>
        <p className="text-xs text-[#71717A] max-w-sm mb-6 leading-relaxed">
          Start a consultation in the panel on the left. Budgets, vendor tasks, schedules, and decor selections will appear here automatically.
        </p>
        {onSelectPrompt && (
          <button
            onClick={() =>
              onSelectPrompt('Plan a 150-guest wedding in Kolkata, ₹8L budget, Dec')
            }
            className="flex items-center gap-2 rounded-full bg-[#18181B] hover:bg-[#27272A] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all"
          >
            <span>Load Sample Kolkata Wedding</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }

  const { eventDetails, budgetBreakdown = [], timeline = [], vendorChecklist = [], creativeIdeas } = plan;
  const currency = eventDetails?.currency || 'INR';
  const totalBudget = eventDetails?.budget || 0;
  const guests = eventDetails?.guests || 1;
  const perGuestCost = guests > 0 ? Math.round(totalBudget / guests) : 0;
  const totalAllocated = budgetBreakdown.reduce((sum, item) => sum + (item.allocatedAmount || 0), 0);
  const budgetDiff = totalBudget - totalAllocated;

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  const handleVendorStatusChange = (index: number, newStatus: string) => {
    if (!onUpdatePlan) return;
    const updatedVendors = [...vendorChecklist];
    updatedVendors[index] = {
      ...updatedVendors[index],
      status: newStatus,
    };
    onUpdatePlan({
      ...plan,
      vendorChecklist: updatedVendors,
    });
  };

  const filteredVendors = vendorChecklist.filter((v) => {
    if (vendorFilter === 'all') return true;
    return v.status.toLowerCase() === vendorFilter.toLowerCase();
  });

  const urgentOrPendingVendors = filteredVendors.filter(
    (v) => v.status.toLowerCase() === 'pending' || v.status.toLowerCase() === 'urgent'
  );
  const completedOrBookedVendors = filteredVendors.filter(
    (v) => v.status.toLowerCase() === 'booked' || v.status.toLowerCase() === 'completed'
  );
  const inProgressVendors = filteredVendors.filter(
    (v) => v.status.toLowerCase() === 'in progress'
  );

  return (
    <div className="relative flex flex-col h-full overflow-y-auto bg-[#EDECE7] p-4 sm:p-7 space-y-6 pb-24">
      {/* Top Bar with Clean Activity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8E6E1]/80">
        <div>
          <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
            {eventDetails.dateOrSeason || 'Scheduled Plan'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">
            {eventDetails.type || 'Event Overview'}
          </h2>
        </div>

        {/* View Switcher Pills & Close */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#E2E0D8] p-1 rounded-full text-xs font-semibold">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'board'
                  ? 'bg-white text-[#18181B] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'budget'
                  ? 'bg-white text-[#18181B] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Budget
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'schedule'
                  ? 'bg-white text-[#18181B] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('curation')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'curation'
                  ? 'bg-white text-[#18181B] shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              Concepts
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-full border border-[#E8E6E1] bg-white hover:bg-[#F4F3EF] px-3.5 py-1.5 text-xs font-semibold text-[#18181B] shadow-sm transition-all"
              title="Close and return to conversation"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Close</span>
            </button>
          )}
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS (Style matching white rounded cards in image) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Budget */}
        <div className="p-4 rounded-3xl bg-white border border-[#E8E6E1] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2">
            Budget
          </span>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#18181B]">
              {formatCurrency(totalBudget, currency)}
            </div>
            <div className="text-[11px] text-[#71717A] mt-0.5 font-medium">
              ~{formatCurrency(perGuestCost, currency)} / person
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="p-4 rounded-3xl bg-white border border-[#E8E6E1] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2">
            Guests
          </span>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#18181B]">
              {formatNumber(guests)}
            </div>
            <div className="text-[11px] text-[#71717A] mt-0.5 font-medium">
              Guaranteed capacity
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="p-4 rounded-3xl bg-white border border-[#E8E6E1] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2">
            Destination
          </span>
          <div>
            <div className="text-sm sm:text-base font-extrabold text-[#18181B] truncate">
              {eventDetails.location || 'Not set'}
            </div>
            <div className="text-[11px] text-[#71717A] mt-0.5 font-medium">
              Primary Venue City
            </div>
          </div>
        </div>

        {/* Culture / Theme */}
        <div className="p-4 rounded-3xl bg-white border border-[#E8E6E1] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2">
            Styling Theme
          </span>
          <div>
            <div className="text-sm sm:text-base font-extrabold text-[#18181B] truncate">
              {eventDetails.cultureOrTheme || 'Custom Curation'}
            </div>
            <div className="text-[11px] text-[#71717A] mt-0.5 font-medium">
              Visual Direction
            </div>
          </div>
        </div>
      </div>

      {/* 1. BOARD VIEW: MATCHING THE EXACT CARDS FROM THE USER'S IMAGE */}
      {(activeTab === 'board' || activeTab === 'schedule') && (
        <div className="space-y-6">
          {/* Section 1: ⭐ Priority & New Tasks */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-500">★</span>
              <h3 className="text-sm font-bold text-[#18181B] tracking-tight">
                New & Priority Actions
              </h3>
              <span className="text-xs font-semibold text-[#8E8E93] ml-1">
                ({urgentOrPendingVendors.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {urgentOrPendingVendors.map((vendor, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-[#E8E6E1] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3.5 hover:border-[#D4D2CB] transition-all"
                >
                  {/* Card Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-base font-bold text-[#18181B]">
                        {vendor.category}
                      </div>
                      <div className="text-xs text-[#71717A] font-medium mt-0.5">
                        {eventDetails.location || 'Local Assignment'} • {eventDetails.dateOrSeason || 'Pending'}
                      </div>
                    </div>

                    <span className="rounded-full border border-red-200 bg-red-50 text-red-600 px-3 py-0.5 text-xs font-semibold">
                      Action Required
                    </span>
                  </div>

                  {/* Body description matching the faucet card */}
                  <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
                    {vendor.actionItem}
                  </p>

                  {/* Thumbnail Row & Assignee Pill */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-full bg-[#F4F3EF] px-3 py-1.5 text-xs font-medium text-[#18181B]">
                        <span>Assign to:</span>
                        <div className="flex -space-x-1.5">
                          <div className="h-5 w-5 rounded-full bg-[#D1D5DB] border-2 border-white flex items-center justify-center text-[9px] font-bold text-[#374151]">
                            JD
                          </div>
                          <div className="h-5 w-5 rounded-full bg-[#E5E7EB] border-2 border-white flex items-center justify-center text-[9px] font-bold text-[#374151]">
                            ST
                          </div>
                        </div>
                      </div>
                    </div>

                    <select
                      value={vendor.status}
                      onChange={(e) => handleVendorStatusChange(idx, e.target.value)}
                      className="rounded-full border border-[#E8E6E1] bg-[#F4F3EF] px-3 py-1 text-xs font-semibold text-[#18181B] focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: In Progress Tasks */}
          {inProgressVendors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <h3 className="text-sm font-bold text-[#18181B] tracking-tight">
                  In Progress
                </h3>
                <span className="text-xs font-semibold text-[#8E8E93] ml-1">
                  ({inProgressVendors.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inProgressVendors.map((vendor, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl border border-[#E8E6E1] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-base font-bold text-[#18181B]">
                          {vendor.category}
                        </div>
                        <div className="text-xs text-[#71717A] mt-0.5">
                          Active coordination with supplier
                        </div>
                      </div>
                      <span className="rounded-full border border-amber-200 bg-amber-50 text-amber-700 px-3 py-0.5 text-xs font-semibold">
                        In Progress
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#3F3F46] leading-relaxed">
                      {vendor.actionItem}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-[#71717A]">
                        Assigned to Coordinator
                      </span>
                      <button
                        onClick={() => handleVendorStatusChange(idx, 'Completed')}
                        className="rounded-full bg-[#18181B] text-white hover:bg-[#27272A] px-3.5 py-1 text-xs font-semibold transition-all"
                      >
                        Mark Done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: ✓ Completed Section matching image */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#16A34A] text-white text-[10px] font-bold">
                ✓
              </span>
              <h3 className="text-sm font-bold text-[#18181B] tracking-tight">
                Completed
              </h3>
              <span className="text-xs font-semibold text-[#8E8E93] ml-1">
                ({completedOrBookedVendors.length})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedOrBookedVendors.map((vendor, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-[#E8E6E1] bg-white p-4 sm:p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between hover:border-[#D4D2CB] transition-all"
                >
                  <div className="space-y-1">
                    <div className="text-base font-bold text-[#18181B]">
                      {vendor.category}
                    </div>
                    <p className="text-xs text-[#71717A] line-clamp-1 max-w-sm">
                      {vendor.actionItem}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#52525B] pt-0.5">
                      <div className="h-4 w-4 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[9px] font-bold">
                        M
                      </div>
                      <span className="text-[11px]">Confirmed by Lead Coordinator</span>
                    </div>
                  </div>

                  <div className="h-7 w-7 rounded-xl border border-[#16A34A]/40 bg-[#DCFCE7]/60 text-[#16A34A] flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. BUDGET BREAKDOWN VIEW */}
      {(activeTab === 'board' || activeTab === 'budget') && (
        <div className="rounded-3xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6E1] pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
                Budget Allocation Summary
              </h3>
              <p className="text-xs text-[#71717A]">
                Structured breakdown mapped to target ceiling of {formatCurrency(totalBudget, currency)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#71717A]">Allocated:</span>
              <span className="text-sm font-extrabold text-[#18181B]">
                {formatCurrency(totalAllocated, currency)}
              </span>
              {budgetDiff === 0 ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  Balanced
                </span>
              ) : budgetDiff > 0 ? (
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                  {formatCurrency(budgetDiff, currency)} Reserve
                </span>
              ) : (
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
                  Over by {formatCurrency(Math.abs(budgetDiff), currency)}
                </span>
              )}
            </div>
          </div>

          {/* Clean minimal distribution bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#EAE8E3]">
            {budgetBreakdown.map((item, idx) => {
              const colors = ['bg-[#18181B]', 'bg-[#52525B]', 'bg-[#71717A]', 'bg-[#A1A1AA]', 'bg-[#D4D4D8]', 'bg-[#E4E4E7]'];
              const barColor = colors[idx % colors.length];
              const pct = item.percentage || (totalBudget > 0 ? Math.round((item.allocatedAmount / totalBudget) * 100) : 0);
              return (
                <div
                  key={idx}
                  title={`${item.category}: ${pct}% (${formatCurrency(item.allocatedAmount, currency)})`}
                  style={{ width: `${Math.max(pct, 2)}%` }}
                  className={`${barColor} hover:opacity-80 transition-all cursor-pointer`}
                />
              );
            })}
          </div>

          {/* Allocation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {budgetBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#E8E6E1] bg-[#FBFBFA] p-4 hover:border-[#D4D2CB] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#18181B]">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#18181B]">
                      {formatCurrency(item.allocatedAmount, currency)}
                    </span>
                    <span className="rounded-full bg-white border border-[#E8E6E1] px-2 py-0.5 text-[10px] font-semibold text-[#52525B]">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-[#EAE8E3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#18181B] rounded-full"
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>

                {item.notes && (
                  <p className="text-[11px] text-[#71717A] leading-relaxed">
                    {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TIMELINE & MILESTONES */}
      {(activeTab === 'board' || activeTab === 'schedule') && (
        <div className="rounded-3xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-3">
            <div>
              <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
                Event Schedule & Milestones
              </h3>
              <p className="text-xs text-[#71717A]">
                Key dates, preparations, and execution windows
              </p>
            </div>
            <span className="text-xs font-semibold text-[#71717A]">
              Interactive Checklist
            </span>
          </div>

          <div className="space-y-4">
            {timeline.map((stage, sIdx) => (
              <div
                key={sIdx}
                className="rounded-2xl border border-[#E8E6E1] bg-[#FBFBFA] p-4.5 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#E8E6E1]/60 pb-2">
                  <h4 className="text-sm font-bold text-[#18181B]">
                    {stage.milestone}
                  </h4>
                  <span className="text-[11px] font-semibold text-[#52525B] bg-white border border-[#E8E6E1] px-2.5 py-0.5 rounded-full w-fit">
                    {stage.timeframe}
                  </span>
                </div>

                <ul className="space-y-2 pt-1">
                  {stage.tasks?.map((task, tIdx) => {
                    const taskKey = `s${sIdx}_t${tIdx}_${task.slice(0, 15)}`;
                    const isDone = Boolean(completedTasks[taskKey]);
                    return (
                      <li
                        key={tIdx}
                        onClick={() => toggleTask(taskKey)}
                        className="flex items-start gap-2.5 text-xs text-[#3F3F46] hover:text-[#18181B] cursor-pointer group select-none"
                      >
                        <button
                          type="button"
                          className="mt-0.5 flex-shrink-0 text-[#8E8E93] group-hover:text-[#18181B] transition-colors"
                        >
                          {isDone ? (
                            <div className="h-4 w-4 rounded-md bg-[#16A34A] text-white flex items-center justify-center">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="h-4 w-4 rounded-md border border-[#D4D2CB] bg-white" />
                          )}
                        </button>
                        <span className={`leading-relaxed ${isDone ? 'line-through text-[#8E8E93]' : ''}`}>
                          {task}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CREATIVE CONCEPTS & CURATION */}
      {(activeTab === 'board' || activeTab === 'curation') && creativeIdeas && (
        <div className="rounded-3xl border border-[#E8E6E1] bg-white p-5 sm:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-5">
          <div className="border-b border-[#E8E6E1] pb-3">
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Design, Dining & Decor Notes
            </h3>
            <p className="text-xs text-[#71717A]">
              Styling references, seasonal dining, and layout concepts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Themes */}
            <div className="rounded-2xl border border-[#E8E6E1] bg-[#FBFBFA] p-4 space-y-2.5">
              <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider block">
                Themes & Palette
              </span>
              <ul className="space-y-2">
                {creativeIdeas.themeSuggestions?.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-[#3F3F46] bg-white p-2.5 rounded-xl border border-[#E8E6E1] leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Menu */}
            <div className="rounded-2xl border border-[#E8E6E1] bg-[#FBFBFA] p-4 space-y-2.5">
              <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider block">
                Dining Highlights
              </span>
              <ul className="space-y-2">
                {creativeIdeas.menuHighlights?.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-[#3F3F46] bg-white p-2.5 rounded-xl border border-[#E8E6E1] leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Decor */}
            <div className="rounded-2xl border border-[#E8E6E1] bg-[#FBFBFA] p-4 space-y-2.5">
              <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider block">
                Decor Architecture
              </span>
              <ul className="space-y-2">
                {creativeIdeas.decorConcepts?.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-[#3F3F46] bg-white p-2.5 rounded-xl border border-[#E8E6E1] leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING DARK ISLAND DOCK (Matching the exact floating pill in the image) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-7 bg-[#1E2022] text-white px-6 py-3 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.25)] border border-[#333538]">
        <button
          onClick={() => setActiveTab('board')}
          className={`flex items-center justify-center transition-all ${
            activeTab === 'board' ? 'text-white scale-110' : 'text-[#8E8E93] hover:text-white'
          }`}
          title="Overview Grid"
        >
          <Grid className="h-4 w-4" />
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex items-center justify-center transition-all ${
            activeTab === 'budget' ? 'text-white scale-110' : 'text-[#8E8E93] hover:text-white'
          }`}
          title="Budget"
        >
          <Coins className="h-4 w-4" />
        </button>

        <button
          onClick={() => {
            if (onSelectPrompt) onSelectPrompt('Add another priority vendor and adjust timeline');
          }}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#18181B] hover:scale-105 transition-all shadow-sm"
          title="Add Action"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center justify-center transition-all ${
            activeTab === 'schedule' ? 'text-white scale-110' : 'text-[#8E8E93] hover:text-white'
          }`}
          title="Schedule"
        >
          <Calendar className="h-4 w-4" />
        </button>

        <button
          onClick={() => setActiveTab('curation')}
          className={`flex items-center justify-center transition-all ${
            activeTab === 'curation' ? 'text-white scale-110' : 'text-[#8E8E93] hover:text-white'
          }`}
          title="Creative Concepts"
        >
          <Palette className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
