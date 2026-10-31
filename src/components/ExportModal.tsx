'use client';

import React, { useState } from 'react';
import { X, Download, Copy, Printer, Check, FileJson, FileText } from 'lucide-react';
import { EventPlan } from '@/types/event';
import { formatCurrency } from '@/lib/formatters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: EventPlan | null;
}

export function ExportModal({ isOpen, onClose, plan }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !plan) return null;

  const generateMarkdownSummary = (p: EventPlan): string => {
    const { eventDetails, budgetBreakdown, timeline, vendorChecklist, creativeIdeas } = p;
    let md = `# Event Plan: ${eventDetails.type}\n\n`;
    md += `**Location:** ${eventDetails.location}\n`;
    md += `**Date / Season:** ${eventDetails.dateOrSeason}\n`;
    md += `**Guests:** ${eventDetails.guests}\n`;
    md += `**Total Budget:** ${formatCurrency(eventDetails.budget, eventDetails.currency)}\n`;
    md += `**Culture / Theme:** ${eventDetails.cultureOrTheme}\n\n`;

    md += `## 💰 Budget Breakdown\n\n`;
    md += `| Category | Allocated Amount | % | Notes |\n`;
    md += `|---|---|---|---|\n`;
    budgetBreakdown.forEach((b) => {
      md += `| ${b.category} | ${formatCurrency(b.allocatedAmount, eventDetails.currency)} | ${b.percentage}% | ${b.notes || ''} |\n`;
    });

    md += `\n## 📅 Timeline & Milestones\n\n`;
    timeline.forEach((t) => {
      md += `### ${t.milestone} (${t.timeframe})\n`;
      t.tasks.forEach((tsk) => {
        md += `- [ ] ${tsk}\n`;
      });
      md += `\n`;
    });

    md += `## 📋 Vendor Checklist\n\n`;
    vendorChecklist.forEach((v) => {
      md += `- **[${v.status}]** ${v.category}: ${v.actionItem}\n`;
    });

    if (creativeIdeas) {
      md += `\n## 🎨 Styling & Notes\n\n`;
      if (creativeIdeas.themeSuggestions?.length) {
        md += `### Themes\n`;
        creativeIdeas.themeSuggestions.forEach((thm) => (md += `- ${thm}\n`));
      }
      if (creativeIdeas.menuHighlights?.length) {
        md += `\n### Dining Highlights\n`;
        creativeIdeas.menuHighlights.forEach((m) => (md += `- ${m}\n`));
      }
      if (creativeIdeas.decorConcepts?.length) {
        md += `\n### Decor Concepts\n`;
        creativeIdeas.decorConcepts.forEach((d) => (md += `- ${d}\n`));
      }
    }

    md += `\n---\n*Curated with Event-drop*`;
    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownSummary(plan);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `event_plan_${(plan.eventDetails.type || 'plan').toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl border border-[#E8E6E1] bg-white p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8E8E93] hover:text-[#18181B] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="text-lg font-bold text-[#18181B] tracking-tight mb-1">
          Export Event Schedule
        </h3>
        <p className="text-xs text-[#71717A] mb-6">
          Download structured data, copy markdown for your team, or print as PDF.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* Download JSON */}
          <button
            onClick={handleDownloadJson}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[#E8E6E1] bg-[#FBFBFA] hover:bg-white hover:border-[#18181B] transition-all text-center group"
          >
            <div className="h-10 w-10 rounded-full bg-white border border-[#E8E6E1] text-[#18181B] flex items-center justify-center mb-2 shadow-sm">
              <FileJson className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-[#18181B]">
              JSON Data
            </span>
            <span className="text-[10px] text-[#71717A] mt-0.5">
              Structured export
            </span>
          </button>

          {/* Copy Markdown */}
          <button
            onClick={handleCopyMarkdown}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[#E8E6E1] bg-[#FBFBFA] hover:bg-white hover:border-[#18181B] transition-all text-center group"
          >
            <div className="h-10 w-10 rounded-full bg-white border border-[#E8E6E1] text-[#18181B] flex items-center justify-center mb-2 shadow-sm">
              {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
            </div>
            <span className="text-xs font-bold text-[#18181B]">
              {copied ? 'Copied!' : 'Copy Summary'}
            </span>
            <span className="text-[10px] text-[#71717A] mt-0.5">
              Markdown / Docs
            </span>
          </button>

          {/* Print / PDF */}
          <button
            onClick={handlePrint}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[#E8E6E1] bg-[#FBFBFA] hover:bg-white hover:border-[#18181B] transition-all text-center group"
          >
            <div className="h-10 w-10 rounded-full bg-white border border-[#E8E6E1] text-[#18181B] flex items-center justify-center mb-2 shadow-sm">
              <Printer className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-[#18181B]">
              Print / PDF
            </span>
            <span className="text-[10px] text-[#71717A] mt-0.5">
              Clean printable sheet
            </span>
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold text-[#18181B] bg-[#F4F3EF] hover:bg-[#EAE8E3] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
