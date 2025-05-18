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

// POST メソッド - 新しい投稿を作成する
export async function POST(request: Request) {
  try {
    // 1. リクエストからデータを取得
    const body = await request.json();
    
    // 2. バリデーション
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'タイトルと内容は必須です' },
        { status: 400 }
      );
    }

    // 著者IDが指定されているか確認
    if (!body.authorId) {
      return NextResponse.json(
        { error: '著者IDは必須です' },
        { status: 400 }
      );
    }

    // 3. データベースに保存
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        published: body.published || false, // 未指定の場合はfalse
        author: {
          connect: { id: body.authorId } // 著者との関連付け
        }
      },
    });
    
    // 4. レスポンスを返す
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('投稿の作成中にエラーが発生しました:', error);
    
    // Prismaのエラーをハンドリングするためのもっと詳細なチェック
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: '指定された著者が見つかりません' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: '投稿の作成中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
