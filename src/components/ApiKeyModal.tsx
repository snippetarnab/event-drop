'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, ExternalLink, Sliders } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
  currentKey: string;
}

export function ApiKeyModal({ isOpen, onClose, onSaveKey, currentKey }: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState(currentKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setKeyInput(currentKey);
  }, [currentKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  const handleClear = () => {
    setKeyInput('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-[#E8E6E1] bg-white p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8E8E93] hover:text-[#18181B] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#18181B] tracking-tight">
            Settings & Integration
          </h3>
          <p className="text-xs text-[#71717A] mt-0.5">
            Configure your Gemini connection for live event generation.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <label className="block text-xs font-semibold text-[#18181B]">
            Gemini API Key
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full rounded-2xl border border-[#E8E6E1] bg-[#F7F6F2] px-4 py-2.5 text-xs sm:text-sm font-mono text-[#18181B] placeholder-[#8E8E93] focus:border-[#18181B] focus:bg-white focus:outline-none transition-all"
          />
          <div className="flex items-center justify-between text-[11px] text-[#71717A] pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#18181B] font-medium hover:underline"
            >
              <span>Get key from Google AI Studio</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            {keyInput && (
              <button
                onClick={handleClear}
                className="text-[#8E8E93] hover:text-red-600 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#71717A] hover:text-[#18181B] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-xs font-semibold text-white shadow-sm transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-300" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
