# AI Notes Workspace

A full-stack, AI-powered collaborative notes workspace built with **Next.js 16**, **Prisma**, **Supabase PostgreSQL**, and **Groq AI**. Features intelligent note analysis, public sharing, productivity analytics, and a polished SaaS-quality interface.

---

## Features

- **Smart Notes** — Create, edit, and organize with real-time auto-save
- **AI Insights** — Generate summaries, action items, and title suggestions (Groq AI / Llama 3.3)
- **Tagging System** — Organize notes with tags, filter by tag
- **Search & Filtering** — Full-text search with sort options
- **Public Sharing** — Generate shareable public links, toggle visibility
- **Productivity Dashboard** — Weekly activity charts, top tags, usage analytics
- **Archive System** — Archive/unarchive notes without deleting
- **Authentication** — Google OAuth + email/password via Auth.js v5
- **Dark Mode** — Full dark/light/system theme support
- **Responsive** — Mobile-first design with collapsible sidebar

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | JavaScript |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Database** | Supabase PostgreSQL |
| **ORM** | Prisma v7 (with pg driver adapter) |
| **Auth** | Auth.js / NextAuth v5 (JWT) |
| **AI** | Groq API (Llama 3.3 70B) |
| **Deployment** | Vercel |

---

## Architecture

```
src/
├── app/
│   ├── (auth)/          # Login & signup pages
│   ├── (workspace)/     # Protected workspace pages
│   │   ├── dashboard/   # Dashboard with recent notes
│   │   ├── notes/       # Notes list + editor
│   │   ├── archive/     # Archived notes
│   │   └── insights/    # Productivity analytics
│   ├── share/           # Public shared note pages
│   └── api/             # API routes
│       ├── notes/       # CRUD, tags, share, AI
│       ├── shared/      # Public note fetch
│       └── insights/    # Analytics data
├── components/
│   ├── ai/              # AI summary panel
│   ├── auth/            # Login/signup forms
│   ├── insights/        # Dashboard charts & cards
│   ├── layout/          # Sidebar, navbar, shell
│   ├── notes/           # Note cards, editor, toolbar
│   ├── tags/            # Tag input component
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── ai/              # Groq API client
│   ├── dal.js           # Data Access Layer
│   ├── prisma.js        # Prisma client singleton
│   └── validations/     # Zod schemas
├── auth.js              # Auth.js config (full)
├── auth.config.js       # Auth.js config (lightweight, for proxy)
└── proxy.js             # Route protection (Next.js 16)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- A Google OAuth app (optional, for Google sign-in)
- A Groq API key (free at https://console.groq.com)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/fullstack-notes-app.git
cd fullstack-notes-app
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `NEXTAUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `http://localhost:3000` (local) or your Vercel URL |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `DATABASE_URL` | Supabase connection pooler URL (port 6543) |
| `DIRECT_URL` | Supabase direct connection URL (port 5432) |
| `GROQ_API_KEY` | From https://console.groq.com/keys |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` or your production URL |

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "production ready"
git push origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)

### 3. Set Environment Variables

Add all variables from `.env.example` in Vercel's project settings:

- Set `NEXTAUTH_URL` to your Vercel production URL (e.g., `https://your-app.vercel.app`)
- Set `NEXT_PUBLIC_APP_URL` to the same URL
- Prisma auto-generates on `postinstall`

### 4. Update Google OAuth

Add your Vercel URL to Google OAuth authorized redirect URIs:
```
https://your-app.vercel.app/api/auth/callback/google
```

### 5. Deploy

Click "Deploy" — Vercel handles the rest.

---

## Demo Flow

1. **Landing Page** → View features, click "Get Started"
2. **Sign Up** → Create account or use Google
3. **Dashboard** → See workspace overview
4. **Create Note** → Click "+ New Note"
5. **Auto-Save** → Type content, observe save indicator
6. **Tags** → Add tags in the editor
7. **AI Insights** → Click "Generate Insights" in the right panel
8. **Search & Filter** → Use toolbar filters on notes page
9. **Share** → Click "Share" → toggle public → copy link
10. **Public Page** → Open share link in incognito
11. **Archive** → Archive a note, view in Archive page
12. **Insights** → View productivity dashboard

---

## License

MIT
