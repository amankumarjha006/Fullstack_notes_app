import { Navbar } from "@/components/layout/navbar";
import { NoteList } from "@/components/notes/note-list";
import { getUserNotes } from "@/lib/dal";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function ArchivePage() {
  const archivedNotes = await getUserNotes({ archived: true });

  return (
    <>
      <Navbar title="Archived Notes" />
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto w-full space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Archive</h1>
            <p className="text-[13px] text-muted-foreground/70 mt-1">
              Notes you&apos;ve archived. They won&apos;t appear in your main notes list.
            </p>
          </div>
          
          <NoteList notes={archivedNotes} isArchive={true} />
        </div>
      </ScrollArea>
    </>
  );
}
