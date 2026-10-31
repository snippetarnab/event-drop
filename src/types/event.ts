export interface EventDetails {
  type: string;
  guests: number;
  budget: number;
  currency: string;
  dateOrSeason: string;
  location: string;
  cultureOrTheme: string;
}

export interface BudgetItem {
  category: string;
  allocatedAmount: number;
  percentage: number;
  notes: string;
}

export interface TimelineMilestone {
  milestone: string;
  timeframe: string;
  tasks: string[];
}

export interface VendorChecklistItem {
  category: string;
  status: 'Pending' | 'In Progress' | 'Booked' | 'Completed' | string;
  actionItem: string;
  id?: string;
}

export interface CreativeIdeas {
  themeSuggestions: string[];
  menuHighlights: string[];
  decorConcepts: string[];
}

export interface EventPlan {
  eventDetails: EventDetails;
  budgetBreakdown: BudgetItem[];
  timeline: TimelineMilestone[];
  vendorChecklist: VendorChecklistItem[];
  creativeIdeas: CreativeIdeas;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  planSnapshot?: EventPlan | null;
}

export interface EventSession {
  id: string;
  title: string;
  userId?: string | null;
  userEmail?: string | null;
  updatedAt: number;
  createdAt: number;
  plan: EventPlan;
  messages: ChatMessage[];
}
