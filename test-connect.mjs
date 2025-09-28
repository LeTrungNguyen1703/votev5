import { PrismaClient } from '@prisma/client';

const url = process.env.DATABASE_URL ?? 'postgresql://user:pass@127.0.0.1:63455/votev5';
const prisma = new PrismaClient({ datasources: { db: { url } } });

try {
  await prisma.$connect();
  console.log('OK: connected to', url);
  await prisma.$disconnect();
  process.exit(0);
} catch (err) {
  console.error('Connection failed:', err);
  process.exit(1);
}

