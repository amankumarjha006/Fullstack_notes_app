import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateNoteInsights } from "@/lib/ai/groq";
import { revalidatePath } from "next/cache";

// Helper: fetch note and verify ownership
async function getOwnedNote(noteId, userId) {
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note || note.userId !== userId) return null;
  return note;
}

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

  if (!note.content || note.content.trim().length < 10) {
    return NextResponse.json(
      { error: "Note is too short to generate a summary." },
      { status: 400 }
    );
  }

  try {
    // Generate insights using Groq AI
    const insights = await generateNoteInsights(note.content);

    // Save insights to the database
    const updatedNote = await prisma.note.update({
      where: { id: note.id },
      data: {
        summary: insights.summary,
        aiActionItems: insights.action_items,
        aiSuggestedTitle: insights.suggested_title,
        aiGeneratedAt: new Date(),
      },
    });

    revalidatePath("/notes");
    revalidatePath("/dashboard");

    return NextResponse.json({
      success: true,
      data: {
        summary: updatedNote.summary,
        actionItems: updatedNote.aiActionItems,
        suggestedTitle: updatedNote.aiSuggestedTitle,
        generatedAt: updatedNote.aiGeneratedAt,
      },
    });
  } catch (error) {
    console.error("Generate summary error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate AI insights." },
      { status: 500 }
    );
  }
}
