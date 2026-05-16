"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { SaveStatus } from "@/components/notes/save-status";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Archive, Clock, Trash2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { TagInput } from "@/components/tags/tag-input";
import { AiSummaryPanel } from "@/components/ai/ai-summary-panel";
import { ShareDialog } from "@/components/notes/share-dialog";

export function NoteEditor({ note }) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title || "");
  const [content, setContent] = useState(note.content || "");
  const titleRef = useRef(title);
  const contentRef = useRef(content);
  
  const [saveStatus, setSaveStatus] = useState("idle");
  const [lastSaved, setLastSaved] = useState(new Date(note.updatedAt));
  const savedTimerRef = useRef(null);

  // Auto-save function
  const saveNote = useCallback(
    async () => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/notes/${note.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: titleRef.current,
            content: contentRef.current,
          }),
        });

        if (!res.ok) throw new Error("Save failed");

        setSaveStatus("saved");
        setLastSaved(new Date());

        // Invalidate router cache so sidebar navigation gets fresh data
        router.refresh();

        // Fade back to idle after 2 seconds
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    },
    [note.id, router]
  );

  const { debouncedFn: debouncedSave, cancel: cancelSave } = useDebounce(
    saveNote,
    1500
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelSave();
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, [cancelSave]);

  function handleTitleChange(e) {
    const newTitle = e.target.value;
    setTitle(newTitle);
    titleRef.current = newTitle;
    setSaveStatus("idle");
    debouncedSave();
  }

  function handleContentChange(e) {
    const newContent = e.target.value;
    setContent(newContent);
    contentRef.current = newContent;
    setSaveStatus("idle");
    debouncedSave();
  }

  function handleApplyTitle(newTitle) {
    setTitle(newTitle);
    titleRef.current = newTitle;
    setSaveStatus("idle");
    debouncedSave();
  }

  async function handleArchive() {
    cancelSave();
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: !note.archived }),
      });
      if (!res.ok) throw new Error("Archive failed");
      toast.success(note.archived ? "Note unarchived" : "Note archived");
      router.push("/notes");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update archive status");
      console.error("Archive failed:", error);
    }
  }

  async function handleDelete() {
    cancelSave();
    try {
      const res = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Note deleted");
      router.push("/notes");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Delete failed:", error);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 md:px-6 py-2.5 border-b border-border/40 bg-card/30 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/notes")}
            className="text-muted-foreground hover:text-foreground h-8 px-2"
          >
            <ChevronLeft className="h-4 w-4 mr-0.5" />
            <span className="hidden sm:inline text-[13px]">Back</span>
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <SaveStatus status={saveStatus} />
          <Separator orientation="vertical" className="h-4 hidden sm:block" />
          <div className="hidden sm:flex items-center text-[11px] text-muted-foreground/50">
            <Clock className="mr-1 h-3 w-3" />
            <span>
              {lastSaved.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <ShareDialog note={note} />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-8"
            onClick={handleArchive}
          >
            <Archive className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline text-[13px]">
              {note.archived ? "Unarchive" : "Archive"}
            </span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground hover:text-destructive h-8"
              )}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden sm:inline text-[13px]">Delete</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  note and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Editor area & AI Panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 lg:overflow-y-auto min-h-0">
          <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
            {/* Title input */}
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Untitled Note"
              className="w-full text-3xl md:text-4xl font-bold tracking-tight bg-transparent border-none outline-none placeholder:text-muted-foreground/25 mb-6"
              autoFocus
            />

            <div className="mb-8">
              <TagInput 
                noteId={note.id} 
                initialTags={note.noteTags?.map(nt => nt.tag) || []} 
              />
            </div>

            {/* Content textarea */}
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your note..."
              className="w-full min-h-[60vh] text-[15px] leading-[1.8] bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/25 font-sans text-foreground/90"
            />
          </div>
        </div>

        {/* AI Insights Panel (Right Sidebar on Desktop, Stacked on Mobile) */}
        <div className="w-full lg:w-80 shrink-0 h-[500px] lg:h-full border-t lg:border-t-0 border-border/30">
          <AiSummaryPanel note={note} onTitleApply={handleApplyTitle} />
        </div>
      </div>
    </div>
  );
}
