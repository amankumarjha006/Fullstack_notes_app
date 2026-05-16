"use client";

import { useState } from "react";
import { X, Plus, Tag as TagIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TagInput({ noteId, initialTags = [] }) {
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  async function handleAddTag(e) {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      
      const newTagName = inputValue.trim();
      if (!newTagName) return;
      
      // Check for duplicates locally
      if (tags.some(t => t.name.toLowerCase() === newTagName.toLowerCase())) {
        toast.warning("Tag already exists on this note");
        setInputValue("");
        return;
      }

      setIsAdding(true);
      try {
        const res = await fetch(`/api/notes/${noteId}/tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newTagName })
        });
        
        if (!res.ok) throw new Error("Failed to add tag");
        
        const newTag = await res.json();
        setTags([...tags, newTag]);
        setInputValue("");
        router.refresh();
      } catch (error) {
        toast.error("Failed to add tag");
      } finally {
        setIsAdding(false);
      }
    }
  }

  async function handleRemoveTag(tagId) {
    // Optimistic update
    const previousTags = [...tags];
    setTags(tags.filter(t => t.id !== tagId));

    try {
      const res = await fetch(`/api/notes/${noteId}/tags?tagId=${tagId}`, {
        method: "DELETE"
      });
      
      if (!res.ok) throw new Error("Failed to remove tag");
      router.refresh();
    } catch (error) {
      toast.error("Failed to remove tag");
      setTags(previousTags); // revert
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span 
            key={tag.id} 
            className="inline-flex items-center gap-1.5 rounded-md bg-muted/70 px-2.5 py-1 text-[12px] font-medium text-muted-foreground group"
          >
            <TagIcon className="h-3 w-3 opacity-40" />
            {tag.name}
            <button 
              onClick={() => handleRemoveTag(tag.id)}
              className="ml-0.5 opacity-40 hover:opacity-100 rounded-sm hover:bg-muted-foreground/20 p-0.5 transition-all duration-150"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
      </div>
      
      <div className="relative flex items-center max-w-sm">
        <Input
          placeholder="Add a tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddTag}
          className="pr-10 h-8 bg-muted/30 border-border/40 text-[13px] rounded-lg"
          disabled={isAdding}
        />
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="absolute right-1 h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={handleAddTag}
          disabled={!inputValue.trim() || isAdding}
        >
          {isAdding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </div>
  );
}
