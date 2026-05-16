"use client";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { CreateNoteButton } from "@/components/notes/create-note-button";
import { Search } from "lucide-react";

export function Navbar({ title }) {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border/50 bg-background/80 px-4 md:px-6 backdrop-blur-xl z-30 shrink-0">
      {/* Title / Breadcrumbs (Desktop) */}
      <div className="hidden md:flex flex-1 items-center">
        <h1 className="text-[15px] font-semibold text-foreground/90">{title}</h1>
      </div>
      
      {/* Search */}
      <div className="flex-1 md:flex-initial md:w-72 ml-10 md:ml-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
          <input
            type="search"
            placeholder="Search notes..."
            className="flex h-9 w-full rounded-lg border border-border/40 bg-muted/30 px-3 py-1 text-sm transition-all placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <CreateNoteButton className="hidden sm:flex shadow-sm shadow-primary/10" />
        <CreateNoteButton className="sm:hidden" iconOnly />
        <ThemeToggle />
      </div>
    </header>
  );
}
