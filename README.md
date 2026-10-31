# Event-drop: Conversational AI Event Planner

**Event-drop** is a full-stack Next.js (App Router) web application featuring **Antigravity**, an AI-powered conversational event planner. Users describe events in plain language, and the application extracts details, generates structured budgets, timelines, checklists, and creative concepts via the **Gemini 2.5 Flash API**, persisting state in **Firebase Firestore**.

---

## 🌟 Key Features

### 1. Split-Screen Interactive Architecture
- **Left Panel (Conversational Feed):**
  - Natural dialogue with Antigravity AI (`gemini-2.5-flash`).
  - Iterative refinements: *"Cut the budget by 20%"*, *"Add a live Sitar and Shehnai artist"*, *"Adjust catering for 200 guests"*.
  - Starter prompt chips for instant planning (e.g. Kolkata Traditional Wedding, Goa Beach Birthday, Bangalore Tech Hackathon).
  - Clean Markdown formatting and timestamped message sync badges.
- **Right Panel (Live Interactive Dashboard):**
  - **Event Details Grid:** Event Type, Guests, Budget (formatted in INR e.g. ₹8,00,000), Per-Guest calculation, Date/Season, Location, and Culture/Theme.
  - **Budget Allocation Breakdown:** Multi-colored proportional spend bar, category progress bars, amounts, percentages, balance/buffer indicator, and detailed notes.
  - **Timeline Milestones:** Chronological milestones with interactive checkable task items and progress tracking.
  - **Vendor Checklist:** Status filtering (All, Pending, In Progress, Booked, Completed) with interactive in-place status changers and action items.
  - **Creative Concepts:** AI-generated theme ideas, curated regional/fusion menu highlights, and decor styling concepts.

### 2. Dual Response Parser (`/api/chat`)
- Directs Gemini to produce a dual output:
  1. **Conversational Feedback** (human-friendly, encouraging advice, creative ideas)
  2. **Structured JSON Payload** wrapped in ` ```json ... ``` ` matching the strict schema.
- The backend parses the stream, strips out raw JSON so the chat interface remains conversational, and sends the structured data to update the live dashboard cards.

### 3. Persistence with Firebase Firestore
- Automatically syncs event plans and conversation history to Firebase Firestore collections (`event_plans`).
- Includes a smooth built-in fallback to fast in-memory session persistence when cloud credentials are not yet configured.
- Saved Plans modal to browse, search, and reload previous event sessions.

### 4. Export & Sharing
- One-click export to machine-readable **JSON**.
- Copy formatted **Markdown summary** ready for Notion, Google Docs, or email.
- Print-ready stylesheet for **Print / PDF export**.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, TypeScript, Tailwind CSS v4)
- **AI Integration:** `@google/genai` SDK using `gemini-2.5-flash`
- **Database:** Firebase Firestore (GCP Free Tier)
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd event-drop
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your API keys:
```env
# Required for live Gemini 2.5 Flash responses
# Get a free key at https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key

# Optional: Firebase Firestore (GCP Free Tier)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_gcp_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Tip:** You can also enter or update your Gemini API key directly in the web UI using the **API Key** button in the top navigation bar!

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📋 Exact JSON Schema

Gemini outputs structured event plans strictly formatted as:

```json
{
  "eventDetails": {
    "type": "string",
    "guests": 0,
    "budget": 0,
    "currency": "INR",
    "dateOrSeason": "string",
    "location": "string",
    "cultureOrTheme": "string"
  },
  "budgetBreakdown": [
    {
      "category": "string",
      "allocatedAmount": 0,
      "percentage": 0,
      "notes": "string"
    }
  ],
  "timeline": [
    {
      "milestone": "string",
      "timeframe": "string",
      "tasks": ["string"]
    }
  ],
  "vendorChecklist": [
    {
      "category": "string",
      "status": "Pending",
      "actionItem": "string"
    }
  ],
  "creativeIdeas": {
    "themeSuggestions": ["string"],
    "menuHighlights": ["string"],
    "decorConcepts": ["string"]
  }
}
```
