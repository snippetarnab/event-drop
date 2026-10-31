'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Users,
  Coins,
  MapPin,
  Building2,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  PartyPopper,
  Heart,
  Globe,
  Sliders,
} from 'lucide-react';
import { TOP_INDIAN_CITIES, TopCity, VENUE_HALLS_DATABASE, VenueHall } from '@/data/halls';
import { formatCurrency, formatNumber } from '@/lib/formatters';

interface EventPlannerFormProps {
  onSubmit: (formData: EventFormData) => void;
  isLoading: boolean;
  onCancel?: () => void;
}

export interface EventFormData {
  eventType: 'Wedding' | 'Birthday' | 'Community Event';
  date: string;
  seasonOrTimeframe: string;
  guestCount: number;
  city: TopCity;
  customCityName?: string;
  selectedHall: VenueHall | null;
  customVenueName?: string;
  budget: number;
  currency: string;
  specialNotes: string;
}

const EVENT_TYPE_OPTIONS = [
  {
    type: 'Wedding' as const,
    label: 'Wedding & Reception',
    icon: Heart,
    defaultBudget: 800000,
    defaultGuests: 150,
    tagline: 'Ceremonies, banquet feast, photography, rituals',
  },
  {
    type: 'Birthday' as const,
    label: 'Birthday & Milestone',
    icon: PartyPopper,
    defaultBudget: 150000,
    defaultGuests: 40,
    tagline: 'Barbecue, DJ, cake styling, ambient decor',
  },
  {
    type: 'Community Event' as const,
    label: 'Community & Cultural',
    icon: Globe,
    defaultBudget: 350000,
    defaultGuests: 250,
    tagline: 'Auditorium, festival gala, society celebrations',
  },
];

export function EventPlannerForm({ onSubmit, isLoading, onCancel }: EventPlannerFormProps) {
  const [eventType, setEventType] = useState<'Wedding' | 'Birthday' | 'Community Event'>('Wedding');
  const [city, setCity] = useState<TopCity>('Kolkata');
  const [customCityName, setCustomCityName] = useState<string>('');
  const [customVenueName, setCustomVenueName] = useState<string>('');
  const [date, setDate] = useState<string>('2026-12-18');
  const [guestCount, setGuestCount] = useState<number>(150);
  const [budget, setBudget] = useState<number>(800000);
  const [selectedHallId, setSelectedHallId] = useState<string>('kol-1');
  const [specialNotes, setSpecialNotes] = useState<string>('Traditional royal heritage theme, live regional food counters, and warm lighting.');

  // Filter halls based on chosen city and event type
  const availableHalls = useMemo(() => {
    return VENUE_HALLS_DATABASE.filter(
      (h) => h.city.toLowerCase() === city.toLowerCase()
    );
  }, [city]);

  const selectedHall = useMemo(() => {
    return availableHalls.find((h) => h.id === selectedHallId) || availableHalls[0] || null;
  }, [availableHalls, selectedHallId]);

  const handleCityChange = (newCity: TopCity) => {
    setCity(newCity);
    const hallsInCity = VENUE_HALLS_DATABASE.filter((h) => h.city.toLowerCase() === newCity.toLowerCase());
    if (hallsInCity.length > 0) {
      setSelectedHallId(hallsInCity[0].id);
    }
  };

  const handleEventTypeSelect = (type: 'Wedding' | 'Birthday' | 'Community Event') => {
    setEventType(type);
    const preset = EVENT_TYPE_OPTIONS.find((o) => o.type === type);
    if (preset) {
      setBudget(preset.defaultBudget);
      setGuestCount(preset.defaultGuests);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      eventType,
      date,
      seasonOrTimeframe: 'December (Winter Peak)',
      guestCount,
      city,
      customCityName: city === 'Other City' ? customCityName.trim() : undefined,
      selectedHall,
      customVenueName: city === 'Other City' && customVenueName.trim() ? customVenueName.trim() : undefined,
      budget,
      currency: 'INR',
      specialNotes,
    });
  };

  const perPersonCost = guestCount > 0 ? Math.round(budget / guestCount) : 0;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6 text-[#18181B]">
      {/* Form Top Title */}
      <div className="border-b border-[#E8E6E1] pb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
            Event Initializer
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight">
            Plan Your Event & Available Halls
          </h2>
          <p className="text-xs text-[#71717A] mt-0.5">
            Fill in your key criteria. We map real banquet halls across top Indian cities and build your structured budget and timeline.
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-[#71717A] hover:text-[#18181B] px-3 py-1.5 rounded-full border border-[#E8E6E1] bg-white"
          >
            Cancel
          </button>
        )}
      </div>

      {/* 1. EVENT TYPE SELECTION */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-[#18181B] uppercase tracking-wider">
          1. Select Event Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {EVENT_TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = eventType === opt.type;
            return (
              <button
                type="button"
                key={opt.type}
                onClick={() => handleEventTypeSelect(opt.type)}
                className={`p-4 rounded-3xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-[#18181B] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-[#18181B]'
                    : 'border-[#E8E6E1] bg-[#FBFBFA] hover:bg-white hover:border-[#D4D2CB]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`h-9 w-9 rounded-2xl flex items-center justify-center ${
                      isSelected ? 'bg-[#18181B] text-white' : 'bg-white border border-[#E8E6E1] text-[#71717A]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {isSelected && (
                    <span className="h-5 w-5 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[10px]">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="text-sm font-extrabold text-[#18181B]">{opt.label}</div>
                <p className="text-[11px] text-[#71717A] mt-1 leading-relaxed">{opt.tagline}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DATE, GUESTS & BUDGET ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Date */}
        <div className="rounded-3xl border border-[#E8E6E1] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center gap-1.5 text-[#71717A] text-xs font-bold uppercase tracking-wider">
            <Calendar className="h-3.5 w-3.5" />
            <span>Target Date</span>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-[#E8E6E1] bg-[#F7F6F2] px-3.5 py-2 text-xs font-semibold text-[#18181B] focus:border-[#18181B] focus:bg-white focus:outline-none"
          />
          <span className="text-[10px] text-[#8E8E93] block">
            Peak Winter / Spring weekend slots
          </span>
        </div>

        {/* Guest Count */}
        <div className="rounded-3xl border border-[#E8E6E1] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between text-[#71717A] text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>Attendees</span>
            </div>
            <span className="text-[#18181B] font-extrabold text-sm">{formatNumber(guestCount)}</span>
          </div>
          <input
            type="number"
            min={10}
            max={5000}
            step={10}
            value={guestCount}
            onChange={(e) => setGuestCount(Math.max(10, parseInt(e.target.value) || 10))}
            className="w-full rounded-2xl border border-[#E8E6E1] bg-[#F7F6F2] px-3.5 py-2 text-xs font-semibold text-[#18181B] focus:border-[#18181B] focus:bg-white focus:outline-none"
          />
          {/* Quick presets */}
          <div className="flex items-center gap-1.5 pt-1">
            {[40, 100, 150, 250, 500].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setGuestCount(num)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                  guestCount === num
                    ? 'border-[#18181B] bg-[#18181B] text-white'
                    : 'border-[#E8E6E1] bg-[#FBFBFA] text-[#52525B]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Target Budget */}
        <div className="rounded-3xl border border-[#E8E6E1] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2">
          <div className="flex items-center justify-between text-[#71717A] text-xs font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5" />
              <span>Target Budget</span>
            </div>
            <span className="text-[#18181B] font-extrabold text-xs">
              ~{formatCurrency(perPersonCost)}/guest
            </span>
          </div>
          <input
            type="number"
            min={50000}
            max={20000000}
            step={25000}
            value={budget}
            onChange={(e) => setBudget(Math.max(20000, parseInt(e.target.value) || 0))}
            className="w-full rounded-2xl border border-[#E8E6E1] bg-[#F7F6F2] px-3.5 py-2 text-xs font-bold text-[#18181B] focus:border-[#18181B] focus:bg-white focus:outline-none"
          />
          <div className="flex items-center gap-1.5 pt-1">
            {[150000, 500000, 800000, 1500000].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setBudget(val)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                  budget === val
                    ? 'border-[#18181B] bg-[#18181B] text-white'
                    : 'border-[#E8E6E1] bg-[#FBFBFA] text-[#52525B]'
                }`}
              >
                ₹{(val / 100000).toFixed(val % 100000 === 0 ? 0 : 1)}L
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CITY SELECTION & AVAILABLE HALLS IN TOP INDIAN CITIES */}
      <div className="rounded-3xl border border-[#E8E6E1] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E6E1] pb-3">
          <div>
            <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">
              City & Real Banquet Venues
            </span>
            <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Select City & Available Banquet Hall
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#16A34A] bg-[#DCFCE7]/70 px-3 py-1 rounded-full border border-[#16A34A]/30">
            {availableHalls.length} Premier Halls in {city}
          </span>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {TOP_INDIAN_CITIES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => handleCityChange(c)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                city === c
                  ? 'bg-[#18181B] text-white shadow-sm'
                  : 'border border-[#E8E6E1] bg-[#FBFBFA] text-[#52525B] hover:border-[#18181B]'
              }`}
            >
              {c === 'Other City' ? '+ Other City' : c}
            </button>
          ))}
        </div>

        {/* Other City Custom Inputs */}
        {city === 'Other City' && (
          <div className="p-4 rounded-2xl border border-dashed border-[#18181B]/40 bg-[#F7F6F2] space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-xs font-bold text-[#18181B]">
              <MapPin className="h-4 w-4 text-[#16A34A]" />
              <span>Specify Your Custom City & Preferred Venue</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#52525B] mb-1">
                  City / Town Name *
                </label>
                <input
                  type="text"
                  required
                  value={customCityName}
                  onChange={(e) => setCustomCityName(e.target.value)}
                  placeholder="E.g., Patna, Surat, Indore, Agra, Bhopal, Ranchi, Varanasi..."
                  className="w-full rounded-xl border border-[#E8E6E1] bg-white px-3.5 py-2 text-xs font-semibold text-[#18181B] focus:border-[#18181B] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#52525B] mb-1">
                  Specific Venue / Hall Name (Optional)
                </label>
                <input
                  type="text"
                  value={customVenueName}
                  onChange={(e) => setCustomVenueName(e.target.value)}
                  placeholder="E.g., Hotel Maurya Grand Hall, Maharaja Agrasen Bhavan, Local Farmhouse..."
                  className="w-full rounded-xl border border-[#E8E6E1] bg-white px-3.5 py-2 text-xs font-semibold text-[#18181B] focus:border-[#18181B] focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[11px] text-[#71717A]">
              Or choose one of the real venue archetypes below to estimate budget and capacity allocations.
            </p>
          </div>
        )}

        {/* Halls Available in Selected City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {availableHalls.map((hall) => {
            const isSelected = selectedHallId === hall.id;
            const rental = hall.approxCost.rentalPerDay
              ? `Rental: ₹${(hall.approxCost.rentalPerDay / 1000).toFixed(0)}k/day`
              : null;
            const plate = hall.approxCost.nonVegPerPlate
              ? `₹${hall.approxCost.nonVegPerPlate}/plate`
              : null;

            return (
              <div
                key={hall.id}
                onClick={() => setSelectedHallId(hall.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#18181B] bg-[#FBFBFA] shadow-[0_2px_10px_rgba(0,0,0,0.06)] ring-1 ring-[#18181B]'
                    : 'border-[#E8E6E1] bg-white hover:border-[#D4D2CB]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#18181B]">
                      {hall.name}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>{hall.rating}</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-[#71717A] flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{hall.locality}, {hall.city}</span>
                    <span>•</span>
                    <span className="font-semibold">{hall.type}</span>
                  </div>

                  {/* Highlights tag pills */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {hall.highlights.slice(0, 2).map((hl, hIdx) => (
                      <span
                        key={hIdx}
                        className="rounded-full bg-[#F4F3EF] px-2 py-0.5 text-[10px] text-[#52525B]"
                      >
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E8E6E1]/80 text-[11px]">
                  <span className="text-[#71717A]">
                    Cap: {hall.capacity.min}–{hall.capacity.max} guests
                  </span>
                  <span className="font-bold text-[#18181B]">
                    {plate || rental || 'Price on request'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. SPECIAL THEME & PERSONAL NOTES */}
      <div className="rounded-3xl border border-[#E8E6E1] bg-white p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2">
        <label className="block text-xs font-bold text-[#18181B] uppercase tracking-wider">
          4. Styling, Cuisine & Custom Preferences
        </label>
        <textarea
          rows={2}
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="E.g., Authentic Bengali cuisine with Fish Fry and Mutton Kosha, shehnai morning rituals, marigold decor..."
          className="w-full rounded-2xl border border-[#E8E6E1] bg-[#F7F6F2] p-3 text-xs sm:text-sm text-[#18181B] placeholder-[#8E8E93] focus:border-[#18181B] focus:bg-white focus:outline-none transition-all"
        />
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-2 flex items-center justify-between">
        <div className="text-xs text-[#71717A]">
          Selected venue:{' '}
          <strong className="text-[#18181B]">
            {customVenueName || selectedHall?.name || 'Any hall'}
          </strong>{' '}
          in {city === 'Other City' && customCityName ? customCityName : city}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-full bg-[#18181B] hover:bg-[#27272A] px-7 py-3 text-sm font-bold text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <span>Structuring Plan & Allocations...</span>
          ) : (
            <>
              <span>Create Event Plan & Checklist</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
