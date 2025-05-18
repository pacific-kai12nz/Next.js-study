import { PrismaClient } from '@prisma/client';

// グローバルオブジェクトの型を拡張
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// シングルトンパターンでPrismaClientのインスタンスを作成
export const prisma = globalForPrisma.prisma || new PrismaClient();

// 開発環境の場合のみ、グローバルにPrismaClientを保存
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
