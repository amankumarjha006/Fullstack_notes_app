import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ icon: Icon, label, value, description, color = "primary" }) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };

  return (
    <Card className="hover:ring-border transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3.5">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color] || colorMap.primary}`}>
            <Icon className="h-[18px] w-[18px]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5 font-medium">{label}</p>
          </div>
        </div>
        {description && (
          <p className="text-[11px] text-muted-foreground/50 mt-3">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
