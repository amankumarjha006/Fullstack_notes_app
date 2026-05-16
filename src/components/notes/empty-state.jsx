"use client";

import { FileText, Archive, Sparkles, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateNoteButton } from "@/components/notes/create-note-button";

const iconMap = {
  "file-text": FileText,
  archive: Archive,
  sparkles: Sparkles,
  chart: BarChart3,
};

export function EmptyState({ 
  icon = "file-text",
  title = "No items found", 
  description = "You don't have any items here yet.", 
  actionLabel, 
  onAction,
  showCreateNote = false,
}) {
  const Icon = typeof icon === "string" ? (iconMap[icon] || FileText) : icon;

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/40 mb-5">
        <Icon className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-medium tracking-tight mb-1.5">{title}</h3>
      <p className="text-[13px] text-muted-foreground/70 max-w-xs mb-6 leading-relaxed">
        {description}
      </p>
      {showCreateNote && <CreateNoteButton />}
      {actionLabel && !showCreateNote && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
