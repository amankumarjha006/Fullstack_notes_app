"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileText, Archive, Sparkles, LogOut, Tag } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "All Notes", href: "/notes", icon: FileText },
  { name: "Archived", href: "/archive", icon: Archive },
];

export function Sidebar({ user, tags = [] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTagId = searchParams.get("tag");

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-[60px] items-center px-6 font-semibold tracking-tight shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground mr-3 text-xs font-bold">
          N
        </div>
        <span className="text-[15px]">AI Notes</span>
      </div>

      <ScrollArea className="flex-1 py-2">
        {/* Navigation */}
        <div className="px-3 mb-2">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            Navigation
          </p>
          <nav className="grid gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-150",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tags Section */}
        {tags.length > 0 && (
          <div className="mt-4 px-3">
            <div className="flex items-center gap-2 px-3 mb-2.5">
              <Tag className="h-3 w-3 text-muted-foreground/50" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Tags
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 px-2">
              {tags.map((tag) => {
                const isActive = activeTagId === tag.id;
                return (
                  <Link key={tag.id} href={isActive ? "/notes" : `/notes?tag=${tag.id}`}>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium cursor-pointer transition-all duration-150",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {tag.name}
                      {(tag._count?.noteTags ?? 0) > 0 && (
                        <span
                          className={cn(
                            "inline-flex items-center justify-center rounded min-w-[1rem] h-4 px-1 text-[10px] font-semibold leading-none",
                            isActive
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-muted-foreground/10 text-muted-foreground"
                          )}
                        >
                          {tag._count?.noteTags}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t border-border/50 p-3">
        <div className="flex items-center gap-3 mb-3 px-2">
          <Avatar className="h-8 w-8 ring-1 ring-border/60">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden min-w-0">
            <span className="truncate text-[13px] font-medium">{user?.name || "User"}</span>
            <span className="truncate text-[11px] text-muted-foreground/70">{user?.email}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground/70 hover:text-destructive h-8 text-[13px]"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Log out
        </Button>
      </div>
    </div>
  );
}
