import { NoteCard } from "./note-card";
import { EmptyState } from "./empty-state";

export function NoteList({ notes, isArchive = false }) {
  if (!notes || notes.length === 0) {
    return (
      <EmptyState 
        icon={isArchive ? "archive" : "file-text"}
        title={isArchive ? "No archived notes" : "No notes found"}
        description={isArchive ? "Notes you archive will appear here." : "Create your first note to get started."}
        showCreateNote={!isArchive}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr animate-in fade-in-0 duration-300">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
