import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
// This prevents creating multiple connections in development
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'], // Log SQL queries in development
  });
};

// Global variable to store the Prisma instance
declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Use existing instance or create new one
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// In development, save to global to prevent hot reload issues
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
