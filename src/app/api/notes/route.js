import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createNoteSchema } from "@/lib/validations/notes";

// GET /api/notes — fetch authenticated user's notes
export async function GET(request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const archived = searchParams.get("archived") === "true";
  const tagId = searchParams.get("tag");

  const where = {
    userId: session.user.id,
    archived,
  };

  if (tagId) {
    where.noteTags = { some: { tagId } };
  }

  const notes = await prisma.note.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      noteTags: {
        include: { tag: true },
      },
    },
  });

  return NextResponse.json(notes);
}

// POST /api/notes — create a new note
export async function POST(request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body = {};
  try {
    const text = await request.text();
    if (text) body = JSON.parse(text);
  } catch {
    // empty body is fine, defaults apply
  }

  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const note = await prisma.note.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title || "Untitled Note",
      content: parsed.data.content || "",
    },
  });

  return NextResponse.json({ id: note.id }, { status: 201 });
}
