import { Navbar } from "@/components/layout/navbar";
import { NoteEditor } from "@/components/notes/note-editor";
import { getNoteById } from "@/lib/dal";
import { notFound } from "next/navigation";

export default async function NoteDetailPage({ params }) {
  const { id } = await params;
  const note = await getNoteById(id);

  if (!note) {
    notFound();
  }

  // Serialize dates for client component
  const serializedNote = {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
    noteTags: note.noteTags?.map((nt) => ({
      ...nt,
      tag: { ...nt.tag, createdAt: nt.tag.createdAt.toISOString() },
    })),
  };

  return (
    <>
      <Navbar title={note.title || "Untitled Note"} />
      <NoteEditor note={serializedNote} />
    </>
  );
}
