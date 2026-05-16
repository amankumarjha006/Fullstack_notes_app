"use client";

import { useState } from "react";
import { Share2, Copy, Check, Globe, Lock, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function ShareDialog({ note }) {
  const [isPublic, setIsPublic] = useState(note.visibility === "public");
  const [shareUrl, setShareUrl] = useState(
    note.shareId ? `${window.location.origin}/share/${note.shareId}` : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notes/${note.id}/share`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate share link");

      const data = await res.json();
      setShareUrl(data.shareUrl);
      setIsPublic(true);
      toast.success("Share link generated!");
    } catch (error) {
      toast.error("Failed to generate share link");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRevoke() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notes/${note.id}/share`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to revoke access");

      setIsPublic(false);
      toast.success("Note is now private");
    } catch (error) {
      toast.error("Failed to make note private");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-8"
        >
          <Share2 className="mr-1.5 h-3.5 w-3.5" />
          <span className="hidden sm:inline text-[13px]">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            {isPublic
              ? "This note is publicly accessible via the link below."
              : "Generate a public link to share this note with anyone."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Visibility status */}
          <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
            <div className="flex items-center gap-3">
              {isPublic ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 shrink-0">
                  <Globe className="h-4 w-4 text-emerald-500" />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted shrink-0">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[13px] font-medium">
                  {isPublic ? "Public" : "Private"}
                </p>
                <p className="text-[11px] text-muted-foreground/70">
                  {isPublic
                    ? "Anyone with the link can view"
                    : "Only you can access this note"}
                </p>
              </div>
            </div>
            <Button
              variant={isPublic ? "outline" : "default"}
              size="sm"
              onClick={isPublic ? handleRevoke : handleShare}
              disabled={isLoading}
              className="shrink-0 ml-3"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPublic ? (
                "Make Private"
              ) : (
                "Make Public"
              )}
            </Button>
          </div>

          {/* Share URL */}
          {isPublic && shareUrl && (
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-muted-foreground/60">
                Share Link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
                  <p className="text-[13px] break-all text-foreground/70">
                    {shareUrl}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  asChild
                >
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
