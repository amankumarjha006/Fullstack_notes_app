import { Skeleton } from "@/components/ui/skeleton";

export default function NotesLoading() {
  return (
    <div className="flex flex-col h-full">
      {/* Navbar skeleton */}
      <div className="flex h-14 items-center gap-4 border-b border-border/50 px-4 md:px-6 shrink-0">
        <Skeleton className="h-4 w-24" />
        <div className="flex-1" />
        <Skeleton className="h-9 w-72 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <div className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto w-full">
        {/* Title */}
        <Skeleton className="h-7 w-32 mb-6" />
        {/* Toolbar */}
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl ring-1 ring-border/50 p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="pt-3 border-t border-border/20 space-y-2">
                <div className="flex gap-1.5">
                  <Skeleton className="h-5 w-12 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
