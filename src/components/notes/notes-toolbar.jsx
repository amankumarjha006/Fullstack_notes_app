"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "updated_desc", label: "Recently Updated" },
  { value: "created_desc", label: "Recently Created" },
  { value: "alphabetical", label: "Alphabetical" },
];

export function NotesToolbar({ tags = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || "all";
  const currentSort = searchParams.get("sort") || "updated_desc";

  const [searchValue, setSearchValue] = useState(currentSearch);
  const [tagOpen, setTagOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Debounce search URL update
  const { debouncedFn: updateSearchParam } = useDebounce((value) => {
    updateFilters({ search: value });
  }, 300);

  // When URL changes, sync local search state (handles back button)
  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchValue(value);
    updateSearchParam(value);
  }

  function clearSearch() {
    setSearchValue("");
    updateFilters({ search: "" });
  }

  function updateFilters({ search, tag, sort }) {
    const params = new URLSearchParams(searchParams);
    
    if (search !== undefined) {
      if (search) params.set("search", search);
      else params.delete("search");
    }
    
    if (tag !== undefined) {
      if (tag && tag !== "all") params.set("tag", tag);
      else params.delete("tag");
    }
    
    if (sort !== undefined) {
      if (sort && sort !== "updated_desc") params.set("sort", sort);
      else params.delete("sort");
    }

    const query = params.toString();
    router.push(query ? `/notes?${query}` : "/notes");
  }

  const currentTagLabel = currentTag === "all"
    ? "All Tags"
    : tags.find(t => t.id === currentTag)?.name || "All Tags";

  const currentSortLabel = sortOptions.find(o => o.value === currentSort)?.label || "Recently Updated";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full mb-6">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-9 pr-9 h-9 bg-muted/30 border-border/40 rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/30"
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={clearSearch}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Tag Filter Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 px-3 gap-2 rounded-lg text-[13px] font-medium min-w-[120px] justify-between",
              currentTag !== "all" && "border-primary/30 bg-primary/5 text-primary"
            )}
            onClick={() => { setTagOpen(!tagOpen); setSortOpen(false); }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{currentTagLabel}</span>
            </div>
            {currentTag !== "all" && (
              <div
                className="hover:bg-primary/20 rounded-sm p-0.5 ml-1 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  updateFilters({ tag: "all" });
                  setTagOpen(false);
                }}
              >
                <X className="h-3.5 w-3.5" />
              </div>
            )}
          </Button>
          {tagOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setTagOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[180px] rounded-lg border border-border/60 bg-popover p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-100">
                <button
                  className={cn(
                    "w-full text-left rounded-md px-3 py-2 text-[13px] transition-colors",
                    currentTag === "all"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-popover-foreground hover:bg-muted/60"
                  )}
                  onClick={() => { updateFilters({ tag: "all" }); setTagOpen(false); }}
                >
                  All Tags
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    className={cn(
                      "w-full text-left rounded-md px-3 py-2 text-[13px] transition-colors",
                      currentTag === tag.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-popover-foreground hover:bg-muted/60"
                    )}
                    onClick={() => { updateFilters({ tag: tag.id }); setTagOpen(false); }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-9 px-3 gap-2 rounded-lg text-[13px] font-medium min-w-[150px] justify-between",
              currentSort !== "updated_desc" && "border-primary/30 bg-primary/5 text-primary"
            )}
            onClick={() => { setSortOpen(!sortOpen); setTagOpen(false); }}
          >
            <ArrowUpDown className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{currentSortLabel}</span>
          </Button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 z-50 min-w-[180px] rounded-lg border border-border/60 bg-popover p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-100">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={cn(
                      "w-full text-left rounded-md px-3 py-2 text-[13px] transition-colors",
                      currentSort === option.value
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-popover-foreground hover:bg-muted/60"
                    )}
                    onClick={() => { updateFilters({ sort: option.value }); setSortOpen(false); }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
