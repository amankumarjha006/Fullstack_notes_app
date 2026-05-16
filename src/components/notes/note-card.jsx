import { Globe, Clock } from "lucide-react";
import Link from "next/link";

export function NoteCard({ note }) {
  const isPublic = note.visibility === "public";
  
  return (
    <Link href={`/notes/${note.id}`} className="block h-full group">
      <div className="h-full flex flex-col bg-card rounded-xl ring-1 ring-border/50 p-5 transition-all duration-200 ease-out group-hover:ring-border group-hover:shadow-lg group-hover:shadow-black/8 group-hover:scale-[1.01]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="text-[15px] font-semibold leading-snug tracking-tight line-clamp-2 text-card-foreground">
            {note.title || "Untitled"}
          </h3>
          {isPublic && (
            <span className="inline-flex items-center gap-1 shrink-0 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              <Globe className="h-2.5 w-2.5" />
              Public
            </span>
          )}
        </div>

        {/* Content Preview */}
        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">
          {note.content ? note.content.substring(0, 150) : "Empty note..."}
        </p>

        {/* Footer */}
        <div className="pt-3 mt-auto border-t border-border/30 space-y-2.5">
          {note.noteTags && note.noteTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.noteTags.map((nt) => (
                <span
                  key={nt.tag.id}
                  className="inline-flex items-center rounded-md bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {nt.tag.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center text-[11px] text-muted-foreground/50">
            <Clock className="mr-1.5 h-3 w-3" />
            <span>Updated {new Date(note.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
