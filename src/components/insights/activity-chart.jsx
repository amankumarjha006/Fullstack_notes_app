"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityChart({ data = [] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const today = new Date().getDay();
  // Convert to Mon=0 format
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[13px] font-semibold">Weekly Activity</CardTitle>
        <p className="text-[11px] text-muted-foreground/60">Notes edited per day this week</p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-end justify-between gap-2 h-32">
          {data.map((item, index) => {
            const heightPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            const isToday = index === todayIndex;

            return (
              <div key={item.day} className="flex flex-1 flex-col items-center gap-1.5">
                {/* Count label */}
                <span className="text-[10px] font-medium text-muted-foreground/50 tabular-nums">
                  {item.count}
                </span>
                {/* Bar */}
                <div className="relative w-full flex justify-center" style={{ height: "72px" }}>
                  <div
                    className={`w-full max-w-[1.75rem] rounded-md transition-all duration-500 ease-out ${
                      isToday
                        ? "bg-primary shadow-sm shadow-primary/20"
                        : item.count > 0
                        ? "bg-primary/25"
                        : "bg-muted/40"
                    }`}
                    style={{
                      height: `${Math.max(heightPercent, 6)}%`,
                      position: "absolute",
                      bottom: 0,
                    }}
                  />
                </div>
                {/* Day label */}
                <span
                  className={`text-[10px] font-medium ${
                    isToday ? "text-primary" : "text-muted-foreground/40"
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
