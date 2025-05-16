# 2. App Routerとファイルベースルーティング

## App Routerの基本概念

App RouterはNext.js 13以降で導入された新しいルーティングシステムで、Reactの最新機能を活用しています。従来のPages Routerと比較して、より直感的かつ強力なルーティングの仕組みを提供しています。

### App Routerの主な特徴

1. **Reactサーバーコンポーネント**
   - デフォルトですべてのコンポーネントがサーバーコンポーネントとして扱われる
   - パフォーマンスとSEOの向上

2. **ネストされたルート**
   - ディレクトリ構造に基づいた直感的なルーティング
   - 共通のレイアウトを簡単に共有

3. **部分レンダリング**
   - ページ全体ではなく、変更された部分だけを再レンダリング
   - ナビゲーション時のパフォーマンス向上

4. **ストリーミング**
   - UIをチャンクで徐々にレンダリング
   - ユーザー体験の向上

### App Routerの動作原理

App Routerは、`app` ディレクトリ内のファイル構造に基づいてルーティングを自動的に設定します。特定の命名規則に従ったファイルを作成することで、ルートやレイアウト、エラーハンドリングなどを定義できます。

## ページの作成と構造

App Routerでは、フォルダとファイルを使用して直感的にWebアプリケーションの構造を定義します。

### 基本的なファイル規則

| ファイル名      | 役割                                               |
|-----------------|---------------------------------------------------|
| `page.tsx`      | ルートに対応するUIを定義                           |
| `layout.tsx`    | 共通のレイアウトを定義                            |
| `loading.tsx`   | ローディング状態のUIを定義                        |
| `error.tsx`     | エラー状態のUIを定義                              |
| `not-found.tsx` | 404エラーのUIを定義                               |
| `route.ts`      | サーバーサイドAPIエンドポイントを定義             |

### 基本的なページの作成

Next.jsでは、`app` ディレクトリ内に `page.tsx` ファイルを作成するだけで、新しいページを作成できます。例えば：

```typescript
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page of our blog.</p>
    </div>
  );
}
```

このファイルを作成すると、`/about` というURLでアクセスできるページが自動的に生成されます。

### レイアウトの共有

複数のページで共通のレイアウトを共有するには、`layout.tsx` ファイルを使用します：

```typescript
// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header>
          <h1>My Blog</h1>
          <nav>{/* ナビゲーションリンク */}</nav>
        </header>
        <main>{children}</main>
        <footer>© 2025 My Blog</footer>
      </body>
    </html>
  );
}
```

## ルーティングパターン

App Routerでは、さまざまなルーティングパターンをサポートしています。

### 静的ルーティング

最も基本的なルーティングは、ディレクトリ名に基づく静的ルーティングです：

```
src/app/              -> /
src/app/about/        -> /about
src/app/blog/         -> /blog
```

### 動的ルーティング

動的なパラメータを持つルートは、角括弧 `[]` を使用して定義します：

```
src/app/blog/[slug]/  -> /blog/:slug
```

例えば、`src/app/blog/[slug]/page.tsx` ファイルを作成すると、`/blog/my-first-post` や `/blog/hello-world` などのURLで、同じページテンプレートを使用できます。

```typescript
// src/app/blog/[slug]/page.tsx
export default function BlogPost({
  params
}: {
  params: { slug: string }
}) {
  return (
    <div>
      <h1>Blog Post: {params.slug}</h1>
      {/* 記事の内容 */}
    </div>
  );
}
```

### ネストされたルーティング

App Routerでは、ディレクトリをネストすることで、ネストされたルートを簡単に作成できます：

```
src/app/settings/                -> /settings
src/app/settings/profile/        -> /settings/profile
src/app/settings/notifications/  -> /settings/notifications
```

### ルートグループ

ディレクトリ名を括弧 `()` で囲むことで、URL構造に影響を与えずに、コードをグループ化できます：

```
src/app/(auth)/login/            -> /login
src/app/(auth)/register/         -> /register
src/app/(dashboard)/profile/     -> /profile
```

この機能は、特定のグループのページで共通のレイアウトを共有したい場合に便利です。例えば、認証関連のページと管理画面のページで異なるレイアウトを使用する場合などに活用できます。

### キャッチオールルート

特定のパターンに一致するすべてのルートをキャプチャするには、三重の角括弧 `[...slug]` を使用します：

```
src/app/blog/[...slug]/  -> /blog/2023/01/01 など
```

このようなルートでは、複数のパスセグメントをキャプチャできます。

```typescript
// src/app/blog/[...slug]/page.tsx
export default function BlogPost({
  params
}: {
  params: { slug: string[] }
}) {
  // params.slug -> ['2023', '01', '01']
  return (
    <div>
      <h1>Blog Post: {params.slug.join('/')}</h1>
      {/* 記事の内容 */}
    </div>
  );
}
```

### オプショナルキャッチオールルート

特定のパターンに一致するルートをキャプチャし、さらにルート自体も含める場合は、二重の角括弧と三重の角括弧 `[[...slug]]` を使用します：

```
src/app/blog/[[...slug]]/  -> /blog および /blog/2023/01/01 など
```

これにより、`/blog` と `/blog/2023/01/01` の両方のルートが同じページコンポーネントにマッチします。
