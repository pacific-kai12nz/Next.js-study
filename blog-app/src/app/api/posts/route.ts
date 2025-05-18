import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 投稿を新しい順に並べ替え、著者情報も取得
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc', // 新しい順に並べ替え
      },
      include: {
        author: true, // 著者情報を含める
      },
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    // エラーハンドリング
    console.error('投稿の取得中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '投稿の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
