import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(1).max(50).transform((val) => val.trim()),
});

// Helper: fetch note and verify ownership
async function getOwnedNote(noteId, userId) {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.userId !== userId) return null;
  return note;
}

// POST /api/notes/[id]/tags — Add a tag to a note
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

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = tagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tag name" }, { status: 400 });
  }

  const tagName = parsed.data.name;

  // Find or create the tag for this user
  let tag = await prisma.tag.findUnique({
    where: {
      name_userId: {
        name: tagName,
        userId: session.user.id,
      },
    },
  });

  if (!tag) {
    tag = await prisma.tag.create({
      data: {
        name: tagName,
        userId: session.user.id,
      },
    });
  }

  // Check if NoteTag already exists
  const existingNoteTag = await prisma.noteTag.findUnique({
    where: {
      noteId_tagId: {
        noteId: id,
        tagId: tag.id,
      },
    },
  });

  if (!existingNoteTag) {
    await prisma.noteTag.create({
      data: {
        noteId: id,
        tagId: tag.id,
      },
    });
  }

  return NextResponse.json(tag, { status: 201 });
}

// DELETE /api/notes/[id]/tags/[tagId] - Actually we'll use query param DELETE /api/notes/[id]/tags?tagId=123
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

  const { searchParams } = new URL(request.url);
  const tagId = searchParams.get("tagId");

  if (!tagId) {
    return NextResponse.json({ error: "Missing tagId" }, { status: 400 });
  }

  try {
    await prisma.noteTag.delete({
      where: {
        noteId_tagId: {
          noteId: id,
          tagId: tagId,
        },
      },
    });
  } catch (error) {
    // Might not exist, ignore
  }

  return NextResponse.json({ success: true });
}
