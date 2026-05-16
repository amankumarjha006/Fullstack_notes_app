const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const notes = await prisma.note.findMany({
    orderBy: { updatedAt: "desc" },
    take: 2
  });
  console.log(JSON.stringify(notes, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
