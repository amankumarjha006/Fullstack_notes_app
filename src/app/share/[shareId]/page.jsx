import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { FileText, Clock, User, Tag, Sparkles } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { shareId } = await params;
  const note = await prisma.note.findUnique({
    where: { shareId },
    select: { title: true, content: true, visibility: true },
  });

  if (!note || note.visibility !== "public") {
    return { title: "Note Not Found" };
  }

  return {
    title: `${note.title || "Untitled"} — AI Notes`,
    description: note.content?.substring(0, 160) || "A shared note from AI Notes Workspace",
  };
}

export default async function SharedNotePage({ params }) {
  const { shareId } = await params;

  const note = await prisma.note.findUnique({
    where: { shareId },
    include: {
      user: { select: { name: true, image: true } },
      noteTags: { include: { tag: true } },
    },
  });

  if (!note || note.visibility !== "public") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-[10px] font-bold">
              N
            </div>
            AI Notes
          </Link>
          <span className="text-[11px] text-muted-foreground/40">Shared Note</span>
        </div>
      </header>

      {/* Note content */}
      <main className="max-w-2xl mx-auto px-6 py-10 md:py-16">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
          {note.title || "Untitled"}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground/70 mb-8 pb-8 border-b border-border/30">
          {note.user?.name && (
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{note.user.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Updated {new Date(note.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        {/* Tags */}
        {note.noteTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {note.noteTags.map((nt) => (
              <span
                key={nt.tag.id}
                className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
              >
              <Tag className="h-3 w-3" />
              {nt.tag.name}
            </span>
            ))}
          </div>
        )}

        {/* Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-[16px] leading-[1.85] text-foreground/85">
            {note.content || "This note is empty."}
          </div>
        </article>

        {/* AI Summary */}
        {note.summary && (
          <div className="mt-12 rounded-xl bg-muted/30 border border-border/30 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-[13px] font-semibold text-primary">AI Summary</h3>
            </div>
            <p className="text-[14px] leading-relaxed text-foreground/75">
              {note.summary}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-16">
        <div className="max-w-2xl mx-auto px-6 py-6 text-center text-[11px] text-muted-foreground/40">
          Shared via{" "}
          <Link href="/" className="font-medium text-muted-foreground/60 hover:text-foreground transition-colors">
            AI Notes Workspace
          </Link>
        </div>
      </footer>
    </div>
  );
}
