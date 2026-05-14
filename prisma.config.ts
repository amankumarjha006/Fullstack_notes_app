// Prisma v7 config — CLI commands (migrate, db push) use this URL
// The runtime PrismaClient uses DATABASE_URL via driver adapter in lib/prisma.js
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL (port 5432) for CLI commands to bypass pgbouncer
    url: process.env["DIRECT_URL"],
  },
});
