import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
      },
    });
    
    console.log('テストユーザーを作成しました:', user);
  } catch (error) {
    console.error('ユーザー作成中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
