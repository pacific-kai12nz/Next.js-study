# ブログアプリの完成

## ブログアプリ完成に向けて

これまでの学習で、Next.jsの基本概念（App Router、Server/Client Components、レイアウト、ルーティング、Linkコンポーネント）と、バックエンド連携（Route Handler、Prisma ORM、データベース操作）について学んできました。このセクションでは、それらの知識を総合的に活用して、ブログアプリケーションを完成させていきます。

## 投稿一覧表示機能

### Server ComponentでのDBデータ取得

投稿一覧を表示するためには、Server Componentからデータベースのデータを取得します。これにより、SEO対応やパフォーマンスの向上が図れます。

```typescript
// src/app/(content)/blog/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      published: true,
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">ブログ記事一覧</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg overflow-hidden shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                投稿者: {post.author.name} | {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {post.content}
              </p>
              <Link 
                href={`/blog/${post.id}`}
                className="text-blue-500 hover:underline font-medium"
              >
                続きを読む
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <p className="text-center text-gray-500 my-12">
          まだ投稿がありません。
        </p>
      )}
    </div>
  );
}
```

### ページネーションの実装

多くの投稿がある場合、ページネーションを実装して一度に表示する投稿数を制限します：

```typescript
// src/app/(content)/blog/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import PaginationControls from '@/components/PaginationControls';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 6;
  const skip = (currentPage - 1) * pageSize;
  
  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        published: true,
      },
      take: pageSize,
      skip,
    }),
    prisma.post.count({
      where: {
        published: true,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">ブログ記事一覧</h1>
      
      {/* 投稿一覧 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* ... 投稿カードの表示（前の例と同様） ... */}
      </div>
      
      {/* ページネーションコントロール */}
      {totalPages > 1 && (
        <PaginationControls 
          currentPage={currentPage} 
          totalPages={totalPages} 
          basePath="/blog" 
        />
      )}
    </div>
  );
}
```

```typescript
// src/components/PaginationControls.tsx
'use client';

import Link from 'next/link';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  basePath,
}: PaginationControlsProps) {
  return (
    <div className="flex justify-center space-x-2 my-6">
      <Link
        href={`${basePath}?page=${currentPage - 1}`}
        className={`px-4 py-2 border rounded ${
          currentPage <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
        }`}
        aria-disabled={currentPage <= 1}
        tabIndex={currentPage <= 1 ? -1 : undefined}
        onClick={(e) => {
          if (currentPage <= 1) e.preventDefault();
        }}
      >
        前へ
      </Link>
      
      <span className="px-4 py-2">
        {currentPage} / {totalPages}
      </span>
      
      <Link
        href={`${basePath}?page=${currentPage + 1}`}
        className={`px-4 py-2 border rounded ${
          currentPage >= totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'
        }`}
        aria-disabled={currentPage >= totalPages}
        tabIndex={currentPage >= totalPages ? -1 : undefined}
        onClick={(e) => {
          if (currentPage >= totalPages) e.preventDefault();
        }}
      >
        次へ
      </Link>
    </div>
  );
}
```

## 投稿詳細表示機能

### 動的ルートを使った詳細ページ

投稿の詳細ページは、動的ルートを使って実装します：

```typescript
// src/app/(content)/blog/[id]/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({
  params,
}: {
  params: { id: string }
}) {
  const id = Number(params.id);
  
  // IDが数値でない場合の処理
  if (isNaN(id)) {
    notFound();
  }
  
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });
  
  // 投稿が見つからない場合の処理
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link
        href="/blog"
        className="text-blue-500 hover:underline mb-6 inline-block"
      >
        ← 記事一覧に戻る
      </Link>
      
      <article className="prose lg:prose-xl max-w-none">
        <h1>{post.title}</h1>
        
        <div className="flex items-center text-gray-500 mb-6">
          <span>投稿者: {post.author.name}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.createdAt.toISOString()}>
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
        </div>
        
        {/* 本文をマークダウンや適切なフォーマットで表示 */}
        <div className="mt-6 whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </div>
  );
}
```

### コメント表示と投稿機能

投稿詳細ページにコメント表示と投稿機能を追加します：

```typescript
// src/components/CommentSection.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    name: string;
  };
}

interface CommentSectionProps {
  postId: number;
  initialComments: Comment[];
}

export default function CommentSection({
  postId,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('コメントを入力してください');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('コメントの投稿に失敗しました');
      }
      
      const newComment = await response.json();
      
      setComments([newComment, ...comments]);
      setContent('');
      router.refresh(); // ページを再検証
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">コメント</h2>
      
      {/* コメント投稿フォーム */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            コメントを追加
          </label>
          <textarea
            id="comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="コメントを入力..."
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? '送信中...' : 'コメントを投稿'}
        </button>
      </form>
      
      {/* コメント一覧 */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{comment.author.name}</span>
                <time className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className="whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">まだコメントはありません。最初のコメントを投稿しましょう！</p>
        )}
      </div>
    </section>
  );
}
```

そして、投稿詳細ページにこのコンポーネントを組み込みます：

```typescript
// src/app/(content)/blog/[id]/page.tsx
// ... 前述のコードに追加 ...

// コメントを取得する処理を追加
const comments = await prisma.comment.findMany({
  where: {
    postId: id,
  },
  include: {
    author: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
});

// return部分のarticleの後に追加
<CommentSection postId={id} initialComments={comments} />
```

## 投稿作成機能

### 新規投稿フォームの実装

新しい投稿を作成するためのフォームをClient Componentとして実装します：

```typescript
// src/components/NewPostForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 簡易バリデーション
    if (!title.trim() || !content.trim()) {
      setError('タイトルと内容は必須です');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          published: true,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '投稿の作成に失敗しました');
      }
      
      const newPost = await response.json();
      
      // 投稿が成功したら詳細ページに遷移
      router.push(`/blog/${newPost.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">新しい記事を投稿</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            タイトル
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="記事のタイトルを入力..."
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="記事の内容を入力..."
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            キャンセル
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

そして、新規投稿ページを作成します：

```typescript
// src/app/(content)/blog/new/page.tsx
import NewPostForm from '@/components/NewPostForm';

export default function NewPostPage() {
  return <NewPostForm />;
}
```

### 認証機能の実装（オプション）

実際のブログアプリでは、認証機能が必要です。Next.jsでの認証機能の実装方法は様々ありますが、一例として簡易的な認証機能を作ってみましょう：

```typescript
// src/components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ログインに失敗しました');
      }
      
      // ログイン成功
      router.push('/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isLoading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}
```

そして、ログインエンドポイントを作成します：

```typescript
// src/app/api/login/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
// 実際の実装ではbcryptなどのライブラリを使用してパスワードをハッシュ化します
// import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  
  if (!email || !password) {
    return NextResponse.json(
      { error: 'メールアドレスとパスワードは必須です' },
      { status: 400 }
    );
  }
  
  try {
    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }
    
    // 実際の実装ではパスワードの検証をします
    // const passwordMatch = await bcrypt.compare(password, user.password);
    const passwordMatch = password === 'password123'; // デモ用の簡易実装
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }
    
    // セッションクッキーを設定
    cookies().set('userId', String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1週間
      path: '/',
    });
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('ログインエラー:', error);
    return NextResponse.json(
      { error: 'ログイン処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
```

### ユーザーアクセス制御（オプション）

ログインが必要なページへのアクセスを制御するためのミドルウェアを作成します：

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // ログインが必要なパス
  const protectedPaths = ['/blog/new', '/profile'];
  const path = request.nextUrl.pathname;
  
  // 保護されたパスへのアクセスかチェック
  if (protectedPaths.some(prefix => path.startsWith(prefix))) {
    const userId = request.cookies.get('userId');
    
    // ユーザーIDがなければログインページにリダイレクト
    if (!userId) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', path);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/blog/new',
    '/profile',
    '/api/posts/:path*', // API保護も可能
  ],
};
```

## 最終的なアプリケーション構造

ここまでの実装で、ブログアプリケーションの基本的な機能が完成しました。最終的なディレクトリ構造は以下のようになります：

```
src/
├── app/
│   ├── (auth)/                # 認証関連ページ
│   │   ├── login/
│   │   │   └── page.tsx       # ログインページ
│   │   └── register/
│   │       └── page.tsx       # 登録ページ
│   ├── (content)/             # コンテンツページ
│   │   ├── blog/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx   # 投稿詳細ページ
│   │   │   ├── new/
│   │   │   │   └── page.tsx   # 新規投稿ページ
│   │   │   └── page.tsx       # 投稿一覧ページ
│   │   └── layout.tsx         # コンテンツレイアウト
│   ├── api/                   # APIエンドポイント
│   │   ├── login/
│   │   │   └── route.ts       # ログインAPI
│   │   └── posts/
│   │       ├── [id]/
│   │       │   ├── comments/
│   │       │   │   └── route.ts # コメントAPI
│   │       │   └── route.ts   # 投稿詳細API
│   │       └── route.ts       # 投稿一覧API
│   ├── layout.tsx             # ルートレイアウト
│   └── page.tsx               # ホームページ
├── components/                # 共通コンポーネント
│   ├── CommentSection.tsx     # コメントセクション
│   ├── LoginForm.tsx          # ログインフォーム
│   ├── Navbar.tsx             # ナビゲーションバー
│   ├── NewPostForm.tsx        # 投稿フォーム
│   └── PaginationControls.tsx # ページネーション
├── lib/
│   └── prisma.ts              # Prismaクライアント設定
└── middleware.ts              # アクセス制御ミドルウェア
```

## まとめ

このレッスンでは、これまで学んできたNext.jsの様々な機能を組み合わせて、フルスタックなブログアプリケーションを構築しました：

1. **投稿一覧表示**：Server ComponentでPrismaを使ってデータを取得し、ページネーション機能も実装
2. **投稿詳細表示**：動的ルートを使って個別の投稿ページを表示し、コメント機能も追加
3. **投稿作成機能**：Client Componentでフォームを実装し、APIを呼び出して新しい投稿を作成
4. **認証機能**：簡易的なログイン機能とアクセス制御の実装

Next.jsを使えば、フロントエンドからバックエンドまで一貫した開発体験でフルスタックアプリケーションを構築できます。このブログアプリケーションをベースに、さらに機能を追加したり、UI/UXを改善したりして、より実践的なアプリケーションに発展させることができます。
