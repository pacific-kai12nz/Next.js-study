# Route HandlerによるAPI作成

## APIルートとは何か

Next.jsのRoute Handlerは、サーバーサイドでAPI機能を構築するための仕組みです。これにより、RESTful APIやその他のHTTPエンドポイントを簡単に作成できます。

Route Handlerを使用すると：
- フロントエンドとバックエンドのコードを同じプロジェクト内に統合できる
- サードパーティAPIへの呼び出しを安全に行える（APIキーの露出なし）
- データベースに直接接続できる
- 認証やデータ検証などのミドルウェア機能を追加できる

## App RouterでのRoute Handlerの作成方法

App Routerでは、`route.ts`（または`route.js`）ファイルを作成することでAPIエンドポイントを定義します。

### 基本構造

```typescript
// src/app/api/hello/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello, World!' });
}
```

このファイルは `/api/hello` へのGETリクエストを処理し、JSONレスポンスを返します。

## HTTPメソッドの処理

Route Handlerは以下のHTTPメソッドをサポートしています：

- GET（データの取得）
- POST（データの作成）
- PUT（データの更新）
- PATCH（データの部分更新）
- DELETE（データの削除）
- HEAD（HTTPヘッダーのみ返す）
- OPTIONS（許可されたメソッドを返す）

### HTTPメソッドの実装例

```typescript
// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GETメソッド - 投稿一覧を取得
export async function GET() {
  // 実際のアプリではデータベースから取得します
  const posts = [
    { id: 1, title: '最初の投稿', content: 'Hello World' },
    { id: 2, title: '2つ目の投稿', content: 'Next.jsについて' }
  ];
  
  return NextResponse.json(posts);
}

// POSTメソッド - 新しい投稿を作成
export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // バリデーション
  if (!data.title || !data.content) {
    return NextResponse.json(
      { error: 'タイトルと内容は必須です' },
      { status: 400 }
    );
  }
  
  // 実際のアプリではデータベースに保存します
  const newPost = {
    id: 3, // 通常はデータベースが生成します
    title: data.title,
    content: data.content
  };
  
  return NextResponse.json(newPost, { status: 201 });
}
```

## リクエストとレスポンスの処理

### リクエストの処理

リクエストオブジェクト（`NextRequest`）から情報を取得する方法：

```typescript
export async function POST(request: NextRequest) {
  // リクエストボディをJSONとして解析
  const body = await request.json();
  
  // クエリパラメータの取得
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  // ヘッダーの取得
  const authHeader = request.headers.get('authorization');
  
  // ...処理ロジック...
  
  return NextResponse.json({ result: 'success' });
}
```

### レスポンスの生成

`NextResponse`を使ってさまざまな形式のレスポンスを生成できます：

```typescript
// JSONレスポンス
return NextResponse.json({ name: 'John' });

// ステータスコードの設定
return NextResponse.json({ error: 'Not found' }, { status: 404 });

// ヘッダーの設定
return NextResponse.json(
  { success: true },
  { 
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json'
    }
  }
);

// リダイレクト
return NextResponse.redirect(new URL('/login', request.url));
```

## 動的なAPIルート

動的なセグメントをAPIルートに組み込むこともできます：

```typescript
// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  // 実際のアプリではデータベースから指定IDの投稿を取得します
  const post = { id: parseInt(id), title: `投稿 ${id}`, content: '内容...' };
  
  return NextResponse.json(post);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  // 実際のアプリではデータベースから削除します
  
  return NextResponse.json({ deleted: true, id }, { status: 200 });
}
```

## エラーハンドリング

エラーを適切に処理するためのパターン：

```typescript
export async function GET(request: NextRequest) {
  try {
    // 何らかの処理
    const data = await fetchSomeData();
    
    // 成功した場合
    return NextResponse.json(data);
  } catch (error) {
    console.error('エラー発生:', error);
    
    // エラーメッセージとステータスコードを返す
    return NextResponse.json(
      { error: 'データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
```

## ミドルウェアとの連携

`middleware.ts`ファイルを使用して、API Route Handlerに対する認証や他の共通処理を追加できます：

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 例: APIルートに対する認証チェック
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const token = request.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    
    // トークンの検証ロジックはここに...
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

## まとめ

Next.jsのRoute Handlerを使用すると、フルスタックアプリケーションを効率的に構築できます：

- `route.ts`ファイルでAPIエンドポイントを定義
- 各HTTPメソッド（GET, POST, PUT, DELETE等）に対応する関数をエクスポート
- `NextRequest`でリクエストを、`NextResponse`でレスポンスを処理
- 動的ルーティングを使用して柔軟なAPIパターンを実現
- エラーハンドリングとミドルウェアを活用して堅牢なAPIを構築

Next.jsのRoute Handlerは、バックエンド機能を簡単に統合できる強力な機能です。これにより、APIを作成し、フロントエンドとバックエンドの両方を単一のNext.jsプロジェクト内で管理できます。
