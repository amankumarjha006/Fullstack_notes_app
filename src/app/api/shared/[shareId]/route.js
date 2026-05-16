import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/shared/[shareId] — Public route, no auth required
export async function GET(request, { params }) {
  const { shareId } = await params;

  const note = await prisma.note.findUnique({
    where: { shareId },
    include: {
      user: {
        select: { name: true, image: true },
      },
      noteTags: {
        include: { tag: true },
      },
    },
  });

  if (!note || note.visibility !== "public") {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json({
    title: note.title,
    content: note.content,
    summary: note.summary,
    tags: note.noteTags.map((nt) => nt.tag.name),
    author: note.user,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });
}
