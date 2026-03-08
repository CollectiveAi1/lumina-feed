# ✨ Lumina

**Lumina** is a social learning platform that competes with social media dopamine loops by redirecting that energy toward knowledge retention and intellectual growth. It replaces mindless scrolling with **Sparks**—visually rich, bite-sized micro-discoveries from verified thinkers and creators.

---

## 🚀 Features

- **Spark Feed** — Infinite-scroll feed of curated micro-knowledge cards with categories, authors, and engagement metrics
- **Today's Sparks** — Daily hand-picked selections worth your attention
- **Stacks** — Organize Sparks into themed collections for deeper study
- **Explore** — Browse topics via an interactive knowledge graph showing connections between disciplines
- **Global Search** — Site-wide search with filters by type (Sparks, Topics, Authors, Stacks, Notes) and category, accessible via `Cmd/Ctrl + K`
- **Brain It** — Save Sparks to your personal knowledge library for later review
- **Notes** — Attach personal reflections and annotations to any Spark
- **Streak Dashboard** — Track daily learning habits with streaks, weekly stats, and motivational milestones
- **Focus Mode** — Distraction-free reading sessions with progress tracking
- **Reflection Prompts** — Thought-provoking questions to deepen comprehension
- **Profile** — View your learning history, saved Sparks, and personal stats
- **Create Sparks** — Author and publish your own micro-discoveries

---

## 🛠 Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | React 18 + TypeScript                  |
| Build        | Vite 5                                 |
| Styling      | Tailwind CSS 3 + CSS custom properties |
| UI Library   | shadcn/ui (Radix primitives)           |
| Animation    | Framer Motion                          |
| Routing      | React Router v6                        |
| State        | React Query (TanStack)                 |
| Backend      | Lovable Cloud (Supabase)               |
| Icons        | Lucide React                           |
| Charts       | Recharts                               |

---

## 📁 Folder Structure

```
src/
├── assets/            # Static images (Spark covers, etc.)
├── components/
│   ├── ui/            # shadcn/ui primitives (Button, Dialog, Card…)
│   ├── icons/         # Custom SVG icon components
│   ├── Navbar.tsx     # Top navigation bar
│   ├── SparkCard.tsx  # Individual Spark display card
│   ├── SparkFeed.tsx  # Infinite-scroll Spark feed
│   ├── StackCard.tsx  # Stack collection card
│   ├── GlobalSearch.tsx       # Site-wide search overlay
│   ├── HeroSection.tsx        # Landing page hero
│   ├── HowItWorks.tsx         # Onboarding explainer
│   ├── StreakDashboard.tsx     # Streak tracking panel
│   ├── FocusMode.tsx          # Distraction-free reader
│   ├── ReflectionPrompt.tsx   # Post-read reflection
│   ├── CreateSparkModal.tsx   # Spark authoring modal
│   ├── CreateStackModal.tsx   # Stack creation modal
│   └── EditProfileModal.tsx   # Profile editor
├── data/              # Mock data (Sparks, Topics, Users)
├── hooks/             # Custom React hooks
├── integrations/      # Lovable Cloud client & types (auto-generated)
├── lib/               # Utility functions
├── pages/
│   ├── Index.tsx      # Home / Landing page
│   ├── Explore.tsx    # Topic exploration
│   ├── Stacks.tsx     # Stack collections
│   ├── Profile.tsx    # User profile
│   ├── Notes.tsx      # Personal notes
│   ├── BrainedSparks.tsx  # Saved Sparks library
│   └── NotFound.tsx   # 404 page
├── test/              # Test setup & specs
├── App.tsx            # Root component with routing
├── index.css          # Design tokens & global styles
└── main.tsx           # Entry point
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm** (install via [nvm](https://github.com/nvm-sh/nvm))

### Local Development

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to the project
cd lumina

# 3. Install dependencies
npm install

# 4. Start the dev server (runs on http://localhost:8080)
npm run dev
```

### Available Scripts

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start development server with HMR  |
| `npm run build`  | Production build                   |
| `npm run preview`| Preview production build locally   |
| `npm run test`   | Run tests once                     |
| `npm run test:watch` | Run tests in watch mode        |
| `npm run lint`   | Lint with ESLint                   |

---

## 🎨 Design System

Lumina uses a token-based design system defined in `src/index.css` with HSL CSS custom properties. All colors are accessed via semantic Tailwind classes (`bg-background`, `text-foreground`, `bg-accent`, etc.) ensuring consistent theming across light and dark modes.

**Typography**: Newsreader (serif) for headings, Geist (sans-serif) for body text.

---

## 📄 License

This project is private.
