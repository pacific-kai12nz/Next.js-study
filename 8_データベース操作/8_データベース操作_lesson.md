# データベース操作

## Prisma Clientを使ったデータベース操作の基本

前のレッスンでPrisma ORMの基本を学びました。このレッスンでは、Prisma Clientを使った実際のデータベース操作（CRUD操作）について学習します。CRUD操作とは、Create（作成）、Read（読み取り）、Update（更新）、Delete（削除）の頭文字を取ったもので、データベース操作の基本となる4つの操作を指します。

## Prisma Clientの初期化（復習）

まず、Prisma Clientの初期化方法を復習しましょう。Next.jsでは一般的に次のようにシングルトンパターンを使用します：

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

これで、アプリケーション内のどこからでも次のようにPrisma Clientにアクセスできます：

```typescript
import { prisma } from '../lib/prisma';
```

## データの取得（Read）

### 全てのレコードを取得

特定のモデルの全てのレコードを取得するには、`findMany()`メソッドを使用します：

```typescript
// 全ての投稿を取得
const allPosts = await prisma.post.findMany();

// 全てのユーザーを取得
const allUsers = await prisma.user.findMany();
```

### 特定のレコードを取得

主キーを使って特定のレコードを取得するには、`findUnique()`メソッドを使用します：

```typescript
// IDが1の投稿を取得
const post = await prisma.post.findUnique({
  where: {
    id: 1
  }
});

// Emailが特定の値のユーザーを取得
const user = await prisma.user.findUnique({
  where: {
    email: 'user@example.com'
  }
});
```

### 条件付きでレコードを取得

特定の条件を満たすレコードを取得するには、`findMany()`メソッドに`where`オプションを指定します：

```typescript
// 公開済みの投稿のみを取得
const publishedPosts = await prisma.post.findMany({
  where: {
    published: true
  }
});

// タイトルに「Next.js」を含む投稿を取得
const nextjsPosts = await prisma.post.findMany({
  where: {
    title: {
      contains: 'Next.js'
    }
  }
});
```

### 並べ替え

結果を並べ替えるには、`orderBy`オプションを使用します：

```typescript
// 作成日の新しい順に投稿を取得
const postsByDate = await prisma.post.findMany({
  orderBy: {
    createdAt: 'desc'
  }
});

// タイトルのアルファベット順に投稿を取得
const postsByTitle = await prisma.post.findMany({
  orderBy: {
    title: 'asc'
  }
});
```

### ページネーション

大量のデータを扱う場合は、ページネーションを使用します：

```typescript
// 10件ずつ取得（1ページ目）
const firstPage = await prisma.post.findMany({
  take: 10,
  skip: 0
});

// 10件ずつ取得（2ページ目）
const secondPage = await prisma.post.findMany({
  take: 10,
  skip: 10
});
```

### リレーションを含めたデータの取得

関連するモデルのデータも一緒に取得するには、`include`オプションを使用します：

```typescript
// 投稿と投稿者の情報を一緒に取得
const postsWithAuthors = await prisma.post.findMany({
  include: {
    author: true
  }
});

// 投稿と投稿者とコメントを全て取得
const postsWithAuthorsAndComments = await prisma.post.findMany({
  include: {
    author: true,
    comments: true
  }
});
```

### 特定のフィールドのみを選択

必要なフィールドのみを選択するには、`select`オプションを使用します：

```typescript
// 投稿のタイトルと内容のみを取得
const postTitlesAndContent = await prisma.post.findMany({
  select: {
    title: true,
    content: true
  }
});
```

`select`と`include`を組み合わせることもできます：

```typescript
// 投稿のタイトルと著者名のみを取得
const postTitlesWithAuthorNames = await prisma.post.findMany({
  select: {
    title: true,
    author: {
      select: {
        name: true
      }
    }
  }
});
```

## データの作成（Create）

### 単一のレコードを作成

新しいレコードを作成するには、`create()`メソッドを使用します：

```typescript
// 新しいユーザーを作成
const newUser = await prisma.user.create({
  data: {
    name: '山田太郎',
    email: 'taro@example.com'
  }
});

// 新しい投稿を作成（既存のユーザーに関連付け）
const newPost = await prisma.post.create({
  data: {
    title: 'Next.jsの始め方',
    content: 'Next.jsは素晴らしいフレームワークです...',
    published: true,
    author: {
      connect: {
        id: 1 // 既存のユーザーIDを指定
      }
    }
  }
});
```

### リレーションを含むデータの作成

リレーションを持つデータを作成する際には、いくつかの方法があります：

#### 既存のレコードに関連付ける（connect）

```typescript
// 既存のユーザーに関連付けた投稿を作成
const post = await prisma.post.create({
  data: {
    title: '投稿のタイトル',
    content: '投稿の内容',
    author: {
      connect: {
        id: 1 // 既存のユーザーID
      }
    }
  }
});
```

#### 新しいレコードを同時に作成（create）

```typescript
// 新しい投稿と新しいコメントを同時に作成
const postWithComment = await prisma.post.create({
  data: {
    title: '新しい投稿',
    content: '投稿内容...',
    author: {
      connect: {
        id: 1
      }
    },
    comments: {
      create: {
        content: '素晴らしい記事です！',
        author: {
          connect: {
            id: 2 // コメント投稿者のID
          }
        }
      }
    }
  },
  include: {
    comments: true
  }
});
```

### 複数のレコードを一度に作成

複数のレコードを一度に作成するには、`createMany()`メソッドを使用します：

```typescript
// 複数のユーザーを一度に作成
const createdUsers = await prisma.user.createMany({
  data: [
    { name: '佐藤一郎', email: 'ichiro@example.com' },
    { name: '鈴木花子', email: 'hanako@example.com' },
    { name: '田中次郎', email: 'jiro@example.com' }
  ],
  skipDuplicates: true // 重複するレコードをスキップ
});
```

## データの更新（Update）

### 単一のレコードを更新

既存のレコードを更新するには、`update()`メソッドを使用します：

```typescript
// IDが1の投稿のタイトルを更新
const updatedPost = await prisma.post.update({
  where: {
    id: 1
  },
  data: {
    title: '更新されたタイトル'
  }
});

// ユーザーのメールアドレスを更新
const updatedUser = await prisma.user.update({
  where: {
    email: 'old-email@example.com'
  },
  data: {
    email: 'new-email@example.com'
  }
});
```

### 複数のレコードを更新

複数のレコードを一度に更新するには、`updateMany()`メソッドを使用します：

```typescript
// 全ての下書き状態の投稿を公開状態に更新
const updatedPosts = await prisma.post.updateMany({
  where: {
    published: false
  },
  data: {
    published: true
  }
});
```

### リレーションを含むデータの更新

リレーションを持つデータを更新する際にも様々な操作が可能です：

```typescript
// 投稿にコメントを追加
const postWithNewComment = await prisma.post.update({
  where: {
    id: 1
  },
  data: {
    comments: {
      create: {
        content: '新しいコメント',
        author: {
          connect: {
            id: 2
          }
        }
      }
    }
  }
});

// 投稿から特定のコメントを削除
const postWithoutComment = await prisma.post.update({
  where: {
    id: 1
  },
  data: {
    comments: {
      delete: {
        id: 3 // 削除するコメントのID
      }
    }
  }
});
```

## データの削除（Delete）

### 単一のレコードを削除

レコードを削除するには、`delete()`メソッドを使用します：

```typescript
// IDが1の投稿を削除
const deletedPost = await prisma.post.delete({
  where: {
    id: 1
  }
});
```

### 複数のレコードを削除

複数のレコードを一度に削除するには、`deleteMany()`メソッドを使用します：

```typescript
// 公開されていない全ての投稿を削除
const deletedDrafts = await prisma.post.deleteMany({
  where: {
    published: false
  }
});

// 特定のユーザーの全ての投稿を削除
const deletedUserPosts = await prisma.post.deleteMany({
  where: {
    authorId: 1
  }
});
```

## トランザクション

複数のデータベース操作をまとめて実行し、全ての操作が成功するか、全て失敗するかを保証するには、トランザクションを使用します：

```typescript
// ユーザーとその最初の投稿を作成するトランザクション
const result = await prisma.$transaction(async (prisma) => {
  const user = await prisma.user.create({
    data: {
      name: '新規ユーザー',
      email: 'new-user@example.com'
    }
  });
  
  const post = await prisma.post.create({
    data: {
      title: '新規ユーザーの最初の投稿',
      content: '内容...',
      author: {
        connect: {
          id: user.id
        }
      }
    }
  });
  
  return { user, post };
});
```

## Next.jsでのPrismaの使用例

### Server Componentでのデータ取得

```typescript
// app/posts/page.tsx
import { prisma } from '../../lib/prisma';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
    where: { published: true }
  });
  
  return (
    <div>
      <h1>投稿一覧</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>投稿者: {post.author.name}</p>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Route HandlerでのCRUD操作

```typescript
// app/api/posts/route.ts
import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// 投稿一覧を取得
export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: true }
  });
  return NextResponse.json(posts);
}

// 新しい投稿を作成
export async function POST(request: NextRequest) {
  const data = await request.json();
  
  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        author: { connect: { id: data.authorId } }
      }
    });
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: '投稿の作成に失敗しました' },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/posts/[id]/route.ts
import { prisma } from '../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// 特定の投稿を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true, comments: true }
  });
  
  if (!post) {
    return NextResponse.json(
      { error: '投稿が見つかりません' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(post);
}

// 投稿を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const data = await request.json();
  
  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        published: data.published
      }
    });
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: '投稿の更新に失敗しました' },
      { status: 500 }
    );
  }
}

// 投稿を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  try {
    await prisma.post.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { success: true, message: '投稿が削除されました' }
    );
  } catch (error) {
    return NextResponse.json(
      { error: '投稿の削除に失敗しました' },
      { status: 500 }
    );
  }
}
```

## まとめ

このレッスンでは、Prisma Clientを使ったデータベース操作の基本を学びました：

- データの取得（findMany, findUnique）
- データの作成（create, createMany）
- データの更新（update, updateMany）
- データの削除（delete, deleteMany）
- リレーションを含むデータの操作
- トランザクションの使用方法
- Next.jsのServer ComponentとRoute HandlerでのPrismaの使用例

Prisma Clientを使うことで、型安全かつ直感的にデータベース操作を行うことができます。これにより、データベース関連のバグを減らし、開発効率を向上させることができます。
