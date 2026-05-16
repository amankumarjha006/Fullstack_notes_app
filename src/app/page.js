import Link from "next/link";
import { FileText, Sparkles, Share2, BarChart3, Tag, Shield, ArrowRight } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Notes",
    description: "Create, edit, and organize your notes with auto-save and rich tagging.",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Generate summaries, action items, and title suggestions powered by Groq AI.",
  },
  {
    icon: Share2,
    title: "Public Sharing",
    description: "Share notes with a public link. Toggle visibility anytime.",
  },
  {
    icon: BarChart3,
    title: "Productivity Insights",
    description: "Track your writing habits with weekly activity charts and analytics.",
  },
  {
    icon: Tag,
    title: "Tags & Filtering",
    description: "Organize with tags. Search and filter to find notes instantly.",
  },
  {
    icon: Shield,
    title: "Secure Auth",
    description: "Google OAuth and email/password authentication with JWT sessions.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Subtle background decoration */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.18_270_/_4%)_0%,transparent_50%)]" />

      {/* Nav */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
              N
            </div>
            <span className="text-[15px]">AI Notes</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm shadow-primary/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 relative z-10">
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-32 md:pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-4 py-1.5 text-[11px] font-medium text-muted-foreground mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by Groq AI
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6 bg-gradient-to-br from-foreground via-foreground/80 to-primary/60 bg-clip-text text-transparent">
            Your AI-Powered
            <br />
            Notes Workspace
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Organize your thoughts, generate AI summaries, share with the world,
            and track your productivity — all in one beautiful workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              Start Writing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-border/50 px-6 py-3 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              Sign In
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto px-6 pb-20 md:pb-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Everything you need
            </h2>
            <p className="text-[15px] text-muted-foreground">
              A complete workspace built for productive note-taking.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl bg-card ring-1 ring-border/50 p-6 hover:ring-border hover:shadow-lg hover:shadow-black/5 transition-all duration-200"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-[15px] mb-2">{feature.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground/70">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-[8px] font-bold">
              N
            </div>
            AI Notes Workspace
          </div>
          <p className="text-[11px] text-muted-foreground/40">
            Built with Next.js, Prisma, and Groq AI
          </p>
        </div>
      </footer>
    </div>
  );
}
