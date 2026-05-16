# AI-Powered Notes Workspace

A premium, full-stack notes application featuring AI-powered summaries, intelligent tagging, public sharing, and a responsive workspace dashboard.

Built with **Next.js 16 (App Router)**, **Prisma**, **PostgreSQL**, **Auth.js (NextAuth)**, and **Tailwind CSS**.

---

## Architecture

```text
src/
├── app/
│   ├── (auth)/          # Login & signup pages
│   ├── (workspace)/     # Protected workspace pages
│   │   ├── dashboard/   # Dashboard with recent notes & stats
│   │   ├── notes/       # Notes list + editor
│   │   └── archive/     # Archived notes
│   ├── share/           # Public shared note pages
│   └── api/             # API routes
│       ├── notes/       # CRUD, tags, share, AI
│       └── shared/      # Public note fetch
├── components/
│   ├── ai/              # AI summary panel
│   ├── auth/            # Login/signup forms
│   ├── insights/        # Dashboard charts & stat cards
│   ├── layout/          # Sidebar, navbar, shell
│   ├── notes/           # Note cards, editor, toolbar
│   ├── tags/            # Tag input component
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── dal.js           # Data Access Layer
│   ├── prisma.js        # Prisma client singleton
│   └── validations/     # Zod schemas
├── auth.js              # Auth.js config (full)
├── auth.config.js       # Auth.js config (lightweight, for proxy)
└── proxy.js             # Route protection (Next.js 16 middleware)
```

---

## 2. Setup Instructions

Follow these steps to get the application running on your local machine.

### How to configure environment variables

Before running the application, you need to set up your environment variables. 
1. Create a file named `.env` in the root directory of the project.
2. Add the following keys and fill them with your own values:

```env
# Database (PostgreSQL via Supabase or similar)
DATABASE_URL="postgresql://user:password@host:port/db"
DIRECT_URL="postgresql://user:password@host:port/db"

# Authentication (Auth.js)
# Generate a secret using: npx auth secret (or openssl rand -base64 32)
AUTH_SECRET="your_generated_random_secret_string"

# Google OAuth (For Google Login)
GOOGLE_CLIENT_ID="your_google_oauth_client_id"
GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"

# Application URL (Required for public sharing links)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Integration (Groq API)
GROQ_API_KEY="your_groq_api_key_here"
```

### How to install dependencies

Ensure you have Node.js installed (v18 or higher recommended). Then, run the following command in the root directory:

```bash
npm install
```

After dependencies are installed, you must push the database schema to your PostgreSQL database and generate the Prisma Client:

```bash
npx prisma db push
npx prisma generate
```

### How to run the frontend and backend

Because this project is built with Next.js using the App Router, the frontend UI and the backend APIs (in `/api/*`) run simultaneously in the same process.

To start the local development server:

```bash
npm run dev
```

Once started, open [http://localhost:3000](http://localhost:3000) in your browser. The server handles both the user interface and backend database operations.

### How to test the application

**1. Code Quality & Linting:**
To check for syntax errors, unused imports, and code quality issues, run the built-in Next.js linter:
```bash
npm run lint
```

**2. Manual Verification Checklist:**
Since this project does not currently use an automated testing suite like Jest or Cypress, please perform the following manual tests to ensure core systems are working:
* **Authentication**: Try logging in with Google and via Email/Password. Verify that protected routes (like `/dashboard`) redirect you to login if you are logged out.
* **Database & CRUD**: Create a new note, add tags to it, update the title/content, and then archive and delete the note.
* **AI Generation**: Open a note with sufficient text and click "Generate Insights" in the right-hand panel (or at the bottom on mobile) to test the Groq API connection.
* **Public Sharing**: Click "Share" on a note, make it public, copy the link, and open it in an Incognito window to verify the public route (`/share/[id]`) is accessible to unauthenticated users.

---
