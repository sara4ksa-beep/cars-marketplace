import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// معلومات الاتصال بقاعدة البيانات (للرجوع إليها)
export const DATABASE_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'Dataone',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '2222',
  url: process.env.DATABASE_URL || 'postgresql://postgres:2222@localhost:5432/Dataone'
} 