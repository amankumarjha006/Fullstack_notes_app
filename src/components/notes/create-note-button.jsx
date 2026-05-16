"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CreateNoteButton({ className, iconOnly = false }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate() {
    if (isCreating) return;
    setIsCreating(true);

    try {
      const res = await fetch("/api/notes", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create note");
      const { id } = await res.json();
      toast.success("Note created");
      router.push(`/notes/${id}`);
    } catch (error) {
      toast.error("Failed to create note", {
        description: "Something went wrong. Please try again.",
      });
      setIsCreating(false);
    }
  }

  if (iconOnly) {
    return (
      <Button
        size="icon"
        className={cn("h-9 w-9", className)}
        onClick={handleCreate}
        disabled={isCreating}
      >
        {isCreating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      className={cn("h-9 text-[13px]", className)}
      onClick={handleCreate}
      disabled={isCreating}
    >
      {isCreating ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <Plus className="mr-1.5 h-3.5 w-3.5" />
      )}
      New Note
    </Button>
  );
}
