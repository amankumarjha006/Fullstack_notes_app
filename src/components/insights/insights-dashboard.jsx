import { FileText, Archive, Globe, Sparkles, CalendarPlus, Clock, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "./stat-card";
import { ActivityChart } from "./activity-chart";
import Link from "next/link";

export function InsightsDashboard({ data }) {
  const {
    totalNotes,
    archivedNotes,
    publicNotes,
    aiGenerations,
    notesThisWeek,
    topTags,
    weeklyActivity,
    recentNotes,
  } = data;

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={FileText}
          label="Total Notes"
          value={totalNotes}
          color="primary"
        />
        <StatCard
          icon={Archive}
          label="Archived"
          value={archivedNotes}
          color="amber"
        />
        <StatCard
          icon={Globe}
          label="Public Notes"
          value={publicNotes}
          color="emerald"
        />
        <StatCard
          icon={Sparkles}
          label="AI Generations"
          value={aiGenerations}
          color="violet"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <ActivityChart data={weeklyActivity} />

        {/* Top Tags */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[13px] font-semibold">Top Tags</CardTitle>
            <p className="text-[11px] text-muted-foreground/60">Most used tags across your notes</p>
          </CardHeader>
          <CardContent className="pt-2">
            {topTags.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Tag className="h-6 w-6 text-muted-foreground/25 mb-2" />
                <p className="text-[12px] text-muted-foreground/50">No tags yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topTags.map((tag) => {
                  const maxCount = Math.max(...topTags.map((t) => t.count), 1);
                  const widthPercent = (tag.count / maxCount) * 100;
                  return (
                    <div key={tag.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-medium text-foreground/80 truncate">{tag.name}</span>
                        <span className="text-muted-foreground/50 tabular-nums ml-2">
                          {tag.count} {tag.count === 1 ? "note" : "notes"}
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
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* This Week Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[13px] font-semibold">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-3.5 rounded-lg bg-primary/5 border border-border/30">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <CalendarPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold tabular-nums">{notesThisWeek}</p>
                <p className="text-[11px] text-muted-foreground/60">
                  {notesThisWeek === 1 ? "note" : "notes"} created this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[13px] font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <p className="text-[12px] text-muted-foreground/50 text-center py-4">
                No recent activity
              </p>
            ) : (
              <div className="space-y-0.5">
                {recentNotes.map((note) => (
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/30 transition-colors group"
                  >
                    <FileText className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate group-hover:text-primary transition-colors">
                        {note.title || "Untitled"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground/40 shrink-0">
                      <Clock className="h-3 w-3" />
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
