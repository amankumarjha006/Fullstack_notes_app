"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, Circle, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AiSummaryPanel({ note, onTitleApply }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState(note.summary || "");
  const [actionItems, setActionItems] = useState(note.aiActionItems || []);
  const [suggestedTitle, setSuggestedTitle] = useState(note.aiSuggestedTitle || "");
  const [generatedAt, setGeneratedAt] = useState(note.aiGeneratedAt ? new Date(note.aiGeneratedAt) : null);

  const hasData = summary || actionItems.length > 0 || suggestedTitle;

  async function generateInsights() {
    if (!note.content || note.content.trim().length < 10) {
      toast.warning("Note is too short to summarize.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch(`/api/notes/${note.id}/generate-summary`, {
        method: "POST",
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");

      setSummary(json.data.summary);
      setActionItems(json.data.actionItems || []);
      setSuggestedTitle(json.data.suggestedTitle);
      setGeneratedAt(new Date(json.data.generatedAt));
      
      toast.success("AI Insights generated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleApplyTitle() {
    if (onTitleApply && suggestedTitle) {
      onTitleApply(suggestedTitle);
      toast.success("Title applied!");
    }
  }

  function toggleActionItem(index) {
    // In a full implementation, you might save this state to the DB.
    // For now, we'll just toggle it locally in memory.
    const newItems = [...actionItems];
    if (typeof newItems[index] === "string") {
      newItems[index] = { text: newItems[index], done: true };
    } else {
      newItems[index].done = !newItems[index].done;
    }
    setActionItems(newItems);
  }

  if (!hasData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center border-l border-border/30 bg-card/20">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-base font-semibold mb-1.5">AI Insights</h3>
        <p className="text-[13px] text-muted-foreground/70 mb-6 max-w-[220px] leading-relaxed">
          Generate a summary, action items, and title suggestions powered by AI.
        </p>
        <Button onClick={generateInsights} disabled={isGenerating} className="h-9">
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isGenerating ? "Analyzing..." : "Generate Insights"}
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-l border-border/30 bg-card/20">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 shrink-0">
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          AI Insights
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={generateInsights} 
          disabled={isGenerating}
          className="h-7 text-[11px] text-muted-foreground hover:text-foreground px-2"
        >
          {isGenerating ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <RefreshCcw className="mr-1 h-3 w-3" />
          )}
          Regenerate
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Suggested Title */}
        {suggestedTitle && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Suggested Title</h4>
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 border border-border/30">
              <span className="text-[13px] font-medium line-clamp-2">{suggestedTitle}</span>
              <Button variant="outline" size="sm" onClick={handleApplyTitle} className="ml-2 shrink-0 h-7 text-[11px]">
                Apply
              </Button>
            </div>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Summary</h4>
            <div className="text-[13px] leading-relaxed text-foreground/85 bg-muted/30 rounded-lg p-4 border border-border/30">
              {summary}
            </div>
          </div>
        )}

        {/* Action Items */}
        {actionItems && actionItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">Action Items</h4>
            <div className="space-y-0.5">
              {actionItems.map((item, i) => {
                const text = typeof item === "string" ? item : item.text;
                const isDone = typeof item === "string" ? false : item.done;
                
                return (
                  <div 
                    key={i} 
                    className={`flex items-start gap-2.5 p-2 rounded-md hover:bg-muted/30 cursor-pointer transition-colors duration-150 ${isDone ? 'opacity-40' : ''}`}
                    onClick={() => toggleActionItem(i)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>
                    <span className={`text-[13px] leading-relaxed ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                      {text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {generatedAt && (
        <div className="px-4 py-2.5 text-[11px] text-center text-muted-foreground/40 border-t border-border/30 shrink-0">
          Generated {generatedAt.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
