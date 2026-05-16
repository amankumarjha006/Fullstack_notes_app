import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

export async function getUserNotes({ archived = false, tagId = null, search = "", sort = "updated_desc" } = {}) {
  const user = await getCurrentUser();
  
  const where = {
    userId: user.id,
    archived,
  };
  
  if (tagId) {
    where.noteTags = {
      some: {
        tagId,
      },
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy = { updatedAt: "desc" };
  if (sort === "created_desc") orderBy = { createdAt: "desc" };
  else if (sort === "alphabetical") orderBy = { title: "asc" };

  return prisma.note.findMany({
    where,
    orderBy,
    include: {
      noteTags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

export async function getNoteById(id) {
  const user = await getCurrentUser();
  
  const note = await prisma.note.findUnique({
    where: { id },
    include: {
      noteTags: {
        include: {
          tag: true,
        },
      },
    },
  });
  
  if (!note) return null;
  
  // Verify ownership or check if public/shared
  if (note.userId !== user.id && note.visibility !== "public") {
    // If not owned by user and not public, return null to signify "Not Found" securely
    return null; 
  }
  
  return note;
}

export async function getUserTags() {
  const user = await getCurrentUser();
  
  return prisma.tag.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { noteTags: true },
      },
    },
  });
}

export async function getInsightsData() {
  const user = await getCurrentUser();
  const userId = user.id;

  // Start of current week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - mondayOffset);
  weekStart.setHours(0, 0, 0, 0);

  // Run all queries in parallel for performance
  const [
    totalNotes,
    archivedNotes,
    publicNotes,
    aiGenerations,
    notesThisWeek,
    topTagsRaw,
    recentNotes,
    allNotesForActivity,
  ] = await Promise.all([
    // Total notes
    prisma.note.count({ where: { userId } }),
    // Archived
    prisma.note.count({ where: { userId, archived: true } }),
    // Public
    prisma.note.count({ where: { userId, visibility: "public" } }),
    // AI generations (notes that have aiGeneratedAt set)
    prisma.note.count({ where: { userId, aiGeneratedAt: { not: null } } }),
    // Notes created this week
    prisma.note.count({
      where: { userId, createdAt: { gte: weekStart } },
    }),
    // Top tags by usage
    prisma.tag.findMany({
      where: { userId },
      orderBy: { noteTags: { _count: "desc" } },
      take: 8,
      include: { _count: { select: { noteTags: true } } },
    }),
    // Recent notes (last 5 edited)
    prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        updatedAt: true,
        archived: true,
        visibility: true,
      },
    }),
    // Notes for weekly activity calculation (last 7 days)
    prisma.note.findMany({
      where: {
        userId,
        updatedAt: { gte: weekStart },
      },
      select: { updatedAt: true },
    }),
  ]);

  // Calculate weekly activity (notes edited per day, Mon–Sun)
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyActivity = dayNames.map((day, index) => {
    const dayStart = new Date(weekStart);
    dayStart.setDate(weekStart.getDate() + index);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const count = allNotesForActivity.filter((n) => {
      const d = new Date(n.updatedAt);
      return d >= dayStart && d < dayEnd;
    }).length;

    return { day, count };
  });

  // Format top tags
  const topTags = topTagsRaw
    .filter((t) => t._count.noteTags > 0)
    .map((t) => ({
      name: t.name,
      count: t._count.noteTags,
    }));

  return {
    totalNotes,
    archivedNotes,
    publicNotes,
    aiGenerations,
    notesThisWeek,
    topTags,
    weeklyActivity,
    recentNotes: recentNotes.map((n) => ({
      ...n,
      updatedAt: n.updatedAt.toISOString(),
    })),
  };
}

