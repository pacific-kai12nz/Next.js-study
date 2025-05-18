import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    // IDが数値でない場合のエラーハンドリング
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '無効なIDです' },
        { status: 400 }
      );
    }
    
    // 特定の投稿と、その著者情報を取得
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true, // 著者情報を含める
        // コメントモデルがある場合は以下のようにコメントも取得できます
        // comments: true,
      },
    });
    
    // 投稿が見つからない場合
    if (!post) {
      return NextResponse.json(
        { error: '投稿が見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('投稿の取得中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '投稿の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
