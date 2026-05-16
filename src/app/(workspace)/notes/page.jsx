import { Navbar } from "@/components/layout/navbar";
import { NoteList } from "@/components/notes/note-list";
import { NotesToolbar } from "@/components/notes/notes-toolbar";
import { getUserNotes, getUserTags } from "@/lib/dal";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function NotesPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const tagId = resolvedParams.tag;
  const search = resolvedParams.search;
  const sort = resolvedParams.sort;
  
  const notes = await getUserNotes({ archived: false, tagId, search, sort });
  const tags = await getUserTags();
  
  let currentTag = null;
  if (tagId) {
    currentTag = tags.find(t => t.id === tagId);
  }

  return (
    <>
      <Navbar title="All Notes" />
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto w-full">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
              <span className="text-[13px] text-muted-foreground/60 tabular-nums">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
              </span>
            </div>
            {currentTag && (
              <p className="text-muted-foreground text-[13px] mt-1">
                Filtered by tag: <span className="font-medium text-foreground">{currentTag.name}</span>
              </p>
            )}
          </div>
          
          <NotesToolbar tags={tags} />
          
          <NoteList notes={notes} />
        </div>
      </ScrollArea>
    </>
  );
}
