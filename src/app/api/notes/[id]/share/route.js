import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Helper: fetch note and verify ownership
async function getOwnedNote(noteId, userId) {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.userId !== userId) return null;
  return note;
}

// POST /api/notes/[id]/share — Generate share link and make note public
export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const note = await getOwnedNote(id, session.user.id);
  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Generate shareId if it doesn't exist, reuse if it does
  const shareId = note.shareId || crypto.randomUUID();

  const updatedNote = await prisma.note.update({
    where: { id: note.id },
    data: {
      shareId,
      visibility: "public",
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/share/${updatedNote.shareId}`;

  return NextResponse.json({
    shareId: updatedNote.shareId,
    shareUrl,
    visibility: updatedNote.visibility,
  });
}

// DELETE /api/notes/[id]/share — Revoke sharing (make private)
export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const note = await getOwnedNote(id, session.user.id);
  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.note.update({
    where: { id: note.id },
    data: {
      visibility: "private",
    },
  });

  return NextResponse.json({ success: true, visibility: "private" });
}
