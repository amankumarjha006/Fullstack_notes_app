import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser, getInsightsData } from "@/lib/dal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatCard } from "@/components/insights/stat-card";
import { ActivityChart } from "@/components/insights/activity-chart";
import { CreateNoteButton } from "@/components/notes/create-note-button";
import { FileText, Sparkles, Globe, CalendarPlus, Clock, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const data = await getInsightsData();

  const {
    totalNotes,
    publicNotes,
    aiGenerations,
    notesThisWeek,
    topTags,
    weeklyActivity,
    recentNotes,
  } = data;

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <Navbar title="Dashboard" />
      <ScrollArea className="flex-1">
        <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto w-full space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {greeting}, {user?.name?.split(" ")[0] || "there"}
            </h1>
            <p className="text-[13px] text-muted-foreground/70 mt-1">
              Here&apos;s your workspace overview.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={FileText}
              label="Total Notes"
              value={totalNotes}
              color="primary"
            />
            <StatCard
              icon={CalendarPlus}
              label="This Week"
              value={notesThisWeek}
              color="emerald"
            />
            <StatCard
              icon={Sparkles}
              label="AI Generations"
              value={aiGenerations}
              color="violet"
            />
            <StatCard
              icon={Globe}
              label="Public Notes"
              value={publicNotes}
              color="blue"
            />
          </div>

          {/* Main Content — Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Recent Notes (wider) */}
            <div className="lg:col-span-3 bg-card rounded-xl ring-1 ring-border/50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/30">
                <h2 className="text-[13px] font-semibold">Recent Notes</h2>
                <Link
                  href="/notes"
                  className="text-[12px] text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {recentNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                  <p className="text-[13px] text-muted-foreground/60 mb-4">No notes yet</p>
                  <CreateNoteButton />
                </div>
              ) : (
                <div className="divide-y divide-border/20">
                  {recentNotes.map((note) => (
                    <Link
                      key={note.id}
                      href={`/notes/${note.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors group"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground/30 shrink-0 group-hover:text-primary/60 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate group-hover:text-primary transition-colors">
                          {note.title || "Untitled"}
                        </p>
                      </div>
                      {note.visibility === "public" && (
                        <span className="text-[10px] text-emerald-500/70 bg-emerald-500/10 rounded px-1.5 py-0.5 shrink-0">
                          Public
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground/40 shrink-0">
                        <Clock className="h-3 w-3" />
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Activity + Tags (narrower) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Activity */}
              <ActivityChart data={weeklyActivity} />

              {/* Top Tags */}
              <div className="bg-card rounded-xl ring-1 ring-border/50 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border/30">
                  <h2 className="text-[13px] font-semibold">Top Tags</h2>
                </div>
                <div className="p-5">
                  {topTags.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <Tag className="h-6 w-6 text-muted-foreground/25 mb-2" />
                      <p className="text-[12px] text-muted-foreground/50">No tags yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topTags.slice(0, 5).map((tag) => {
                        const maxCount = Math.max(...topTags.map((t) => t.count), 1);
                        const widthPercent = (tag.count / maxCount) * 100;
                        return (
                          <div key={tag.name} className="space-y-1.5">
                            <div className="flex items-center justify-between text-[12px]">
                              <span className="font-medium text-foreground/80 truncate">{tag.name}</span>
                              <span className="text-muted-foreground/50 tabular-nums ml-2">
                                {tag.count}
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary/40 rounded-full transition-all duration-500"
                                style={{ width: `${widthPercent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 pt-2">
            <CreateNoteButton className="shadow-sm shadow-primary/10" />
            <Link
              href="/insights"
              className="text-[13px] text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 transition-colors"
            >
              View Insights
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
