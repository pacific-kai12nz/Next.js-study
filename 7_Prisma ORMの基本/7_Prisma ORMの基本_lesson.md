# Prisma ORMの基本

## Prisma ORMとは

Prisma は、Node.js および TypeScript 用の次世代 ORM（Object-Relational Mapping）ツールです。従来のORMとは異なり、Prismaは型安全性に優れ、開発者体験を重視した設計になっています。

Prismaの主な特徴：
- 型安全性：TypeScriptと完全に統合された型システム
- 直感的なデータモデリング：Prisma Schemaによる宣言的なデータモデル定義
- 自動生成されるクライアント：データモデルに基づいて型安全なクライアントを生成
- マイグレーション管理：データベーススキーマの変更を簡単に追跡・適用
- 複数のデータベースサポート：PostgreSQL、MySQL、SQLite、SQL Server、MongoDB など

## Prismaのインストールと初期設定

### 1. インストール

Prismaをプロジェクトにインストールします：

```bash
npm install prisma --save-dev
npm install @prisma/client
```

### 2. Prismaの初期化

Prisma CLIを使って初期化します：

```bash
npx prisma init
```

この操作により以下のファイルが生成されます：
- `prisma/schema.prisma`：データモデルとデータベース接続を定義
- `.env`：データベース接続URLなどの環境変数を設定

### 3. データベース接続の設定

`.env`ファイルにデータベース接続URLを設定します：

```
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
```

また、`schema.prisma`ファイル内のデータソースブロックも確認します：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

## スキーマの定義

Prisma Schemaを使ってデータモデルを定義します。これはデータベースのテーブル構造を表現するものです。

### 基本的なモデル定義

```prisma
// prisma/schema.prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}
```

### フィールドの型

Prismaは様々なデータ型をサポートしています：

- `String`：文字列
- `Int`：整数
- `Float`：浮動小数点数
- `Boolean`：真偽値
- `DateTime`：日時
- `Json`：JSONデータ
- など

### 属性と修飾子

フィールドには様々な属性を適用できます：

- `@id`：主キーを示す
- `@default(value)`：デフォルト値を設定
- `@unique`：一意性制約
- `@relation`：リレーションシップを定義
- `?`：オプショナル（NULL許容）フィールドを示す
- `[]`：一対多のリレーションシップを示す

### リレーションシップ

モデル間のリレーションシップも簡単に定義できます：

```prisma
// 一対多の関係（ユーザーは複数の投稿を持つ）
model User {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[] // 一対多のリレーション
}

model Post {
  id       Int   @id @default(autoincrement())
  title    String
  author   User  @relation(fields: [authorId], references: [id])
  authorId Int   // 外部キー
}

// 多対多の関係（投稿は複数のカテゴリに属し、カテゴリは複数の投稿を持つ）
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[] @relation("PostToCategory")
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[] @relation("PostToCategory")
}
```

## マイグレーション

マイグレーションは、Prismaスキーマの変更をデータベースに適用するプロセスです。

### マイグレーションの作成と適用

スキーマを変更した後、以下のコマンドでマイグレーションを生成します：

```bash
npx prisma migrate dev --name init
```

このコマンドは以下の操作を行います：
1. 現在のPrismaスキーマに基づいてマイグレーションファイルを生成
2. そのマイグレーションをデータベースに適用
3. Prisma Clientを再生成

### マイグレーションの適用（本番環境）

本番環境ではこのコマンドを使用します：

```bash
npx prisma migrate deploy
```

### データベースのリセット（開発時のみ）

開発中にデータベースをリセットする場合：

```bash
npx prisma migrate reset
```

これは全てのデータを削除し、マイグレーションを最初から適用し直します。

## Prisma Clientの生成と使用

### Prisma Clientの生成

スキーマを変更した後は、Prisma Clientを再生成します：

```bash
npx prisma generate
```

これにより、スキーマに基づいたTypeScriptの型や関数が生成されます。

### PrismaClientの初期化とインスタンス共有

Next.jsでPrisma Clientを使用する場合、一般的にシングルトンパターンを使用します：

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

これにより、Next.jsの開発環境でホットリロード時にPrismaClientのインスタンスが複数生成されるのを防ぎます。

## Next.jsでのPrismaの使用

Prisma ClientをNext.jsアプリケーションで使用する例：

### Server Componentでの使用

```typescript
// app/posts/page.tsx
import { prisma } from '../../lib/prisma';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });
  
  return (
    <div>
      <h1>投稿一覧</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>投稿者: {post.author.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Route HandlerでのPrismaの使用

```typescript
// app/api/posts/route.ts
import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      author: { connect: { id: data.authorId } }
    }
  });
  
  return NextResponse.json(post, { status: 201 });
}
```

## まとめ

Prisma ORMは、Next.jsアプリケーションでのデータベース操作を簡素化し、型安全性を提供する強力なツールです。主な利点は：

1. **型安全性**: TypeScriptと完全に統合されており、コンパイル時にエラーを検出
2. **直感的なAPI**: 読みやすく、使いやすいクエリAPI
3. **スキーマ駆動開発**: データモデルを中心とした開発アプローチ
4. **マイグレーション管理**: データベースのスキーマ変更を追跡・管理
5. **リレーションシップの簡単な定義と取得**: 複雑なJOINクエリを簡潔に記述可能

次のセクションでは、Prismaを使った実際のデータベース操作（CRUDオペレーション）について詳しく学んでいきます。
