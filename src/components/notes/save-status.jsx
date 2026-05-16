"use client";

import { cn } from "@/lib/utils";
import { Check, AlertCircle, Loader2 } from "lucide-react";

/**
 * Save status indicator for the note editor.
 * @param {"idle" | "saving" | "saved" | "error"} status
 */
export function SaveStatus({ status }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-[11px] transition-all duration-500",
        status === "idle" && "opacity-0",
        status !== "idle" && "opacity-100"
      )}
    >
      {status === "saving" && (
        <>
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check className="h-3 w-3 text-emerald-400" />
          <span className="text-emerald-400">Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="h-3 w-3 text-destructive" />
          <span className="text-destructive">Save failed</span>
        </>
      )}
    </div>
  );
}
