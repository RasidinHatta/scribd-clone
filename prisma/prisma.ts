import { PrismaClient } from "@/lib/generated/prisma";

// Create a function that returns a new PrismaClient instance
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Declare global object for Prisma client in non-production environments
declare const globalThis: {
  prismaGlobal: PrismaClient | undefined;
} & typeof global;

let db: PrismaClient;

// In development mode, use a single Prisma client instance
if (process.env.NODE_ENV !== "production") {
  // Use globalThis to persist the Prisma client in development for hot reloading
  if (!globalThis.prismaGlobal) {
    globalThis.prismaGlobal = prismaClientSingleton();
  }
  db = globalThis.prismaGlobal;
} else {
  // In production, always instantiate a new Prisma client
  db = prismaClientSingleton();
}

export default db;