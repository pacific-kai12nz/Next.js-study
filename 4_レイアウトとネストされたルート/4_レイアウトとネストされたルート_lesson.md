# 4. レイアウトとネストされたルート

## layout.tsxの使い方

Next.jsのApp Routerでは、`layout.tsx`ファイルを使用してUIの共通部分を定義します。レイアウトは複数のページで共有される共通のUIコンポーネントを含みます。

### レイアウトの基本的な役割

1. **共通UIの定義**
   - ヘッダー、フッター、サイドバーなどの共通要素
   - ナビゲーションコンポーネント
   - グローバルスタイル

2. **ネストされたレイアウト**
   - 階層ごとに異なるレイアウトを定義可能
   - セクションごとに特有のUIを提供

### Root Layoutの仕組み

アプリケーションのルートレイアウト（`app/layout.tsx`）は必須で、アプリケーション全体の共通レイアウトを定義します。

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header>
          <nav>{/* グローバルナビゲーション */}</nav>
        </header>
        <main>{children}</main>
        <footer>{/* フッター内容 */}</footer>
      </body>
    </html>
  );
}
```

ここで重要なのは：
- `html`および`body`タグはルートレイアウトでのみ定義
- `children`プロパティは、現在のルートに対応するページコンテンツまたは子レイアウトを表示

### セクション別レイアウト

特定のルートやセクションに対して、独自のレイアウトを追加定義できます。

```tsx
// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="blog-sidebar">
        {/* ブログ専用サイドバー */}
      </div>
      <div className="blog-content">
        {children}
      </div>
    </section>
  );
}
```

### テンプレートとの違い

Next.jsでは`template.tsx`ファイルも提供されており、一見レイアウトと似ていますが、重要な違いがあります：

- **レイアウト(`layout.tsx`)**：
  - 親コンポーネントとして機能し、ルート間でステートを保持する
  - ナビゲーション時に再レンダリングされない

- **テンプレート(`template.tsx`)**：
  - ナビゲーションのたびに新しいインスタンスが作成される
  - ルート間で移動するたびに、DOMが再作成される

## ネストされたルートの構造

Next.jsのApp Routerは、フォルダがURLパスのセグメントに対応する階層的なファイルシステムベースのルーティングを使用します。

### フォルダ構造とルーティング

```
app/
├── page.tsx        # / (ホームページ)
├── about/
│   └── page.tsx    # /about
├── blog/
│   ├── layout.tsx  # ブログ全体のレイアウト
│   ├── page.tsx    # /blog (ブログ一覧)
│   └── [id]/       # 動的ルート
│       └── page.tsx # /blog/[id] (個別記事ページ)
└── admin/
    ├── layout.tsx  # 管理画面用レイアウト
    ├── page.tsx    # /admin (管理画面トップ)
    └── settings/
        └── page.tsx # /admin/settings (設定ページ)
```

ここでの重要なポイント：
1. 各フォルダは1つのルートセグメントに対応
2. `page.tsx`ファイルはそのルートでアクセス可能なページを定義
3. `layout.tsx`ファイルはそのルートとその子ルート全体に適用されるレイアウトを定義

### レイアウトのネスト

レイアウトはネストすることができ、親から子へと階層的に適用されます：

1. `app/layout.tsx` (ルートレイアウト)
2. `app/blog/layout.tsx` (ブログセクションのレイアウト)
3. `app/blog/[id]/layout.tsx` (個別ブログ記事のレイアウト)

これにより、異なるセクションごとに共通UIを効率的に管理できます。

## ルートグループ

ルートグループは、App Routerのパワフルな機能の一つで、URLパスに影響を与えずにルートを論理的にグループ化できます。

### ルートグループの作成方法

ルートグループは、フォルダ名を括弧で囲むことで作成します：`(groupName)`

```
app/
├── (marketing)/       # グループ化（URLには含まれない）
│   ├── about/
│   │   └── page.tsx   # /about
│   └── contact/
│       └── page.tsx   # /contact
├── (shop)/
│   ├── layout.tsx     # ショップ全体に共通のレイアウト
│   ├── products/
│   │   └── page.tsx   # /products
│   └── cart/
│       └── page.tsx   # /cart
└── page.tsx           # /
```

### ルートグループのメリット

1. **レイアウトの整理**
   - 特定のセクション専用のレイアウトを作成可能
   - URL構造に影響を与えずにUIを整理できる

2. **コードの整理**
   - 関連するルートをロジカルにグループ化
   - 大規模アプリケーションでの管理が容易になる

3. **分離されたレイアウト**
   - 異なるセクション間でレイアウトを分離可能
   - 例：管理画面とユーザー向けページで異なるレイアウトを使用

```tsx
// app/(shop)/layout.tsx
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shop-container">
      <nav className="shop-nav">
        {/* ショップ専用ナビゲーション */}
      </nav>
      <div className="shop-content">
        {children}
      </div>
    </div>
  );
}
```

### 注意点

- ルートグループのフォルダ名はURLに含まれない
- 同じレベルの異なるルートグループは、異なるレイアウトを持つことができる

## 実践例

ブログアプリケーションにおけるレイアウトとネステッドルートの実装例を見てみましょう：

### 基本構造

```
app/
├── layout.tsx        # 全体共通レイアウト（ヘッダー・フッター）
├── page.tsx          # ホームページ
├── (content)/
│   ├── layout.tsx    # コンテンツページ共通レイアウト
│   ├── blog/
│   │   ├── layout.tsx # ブログ専用レイアウト（サイドバー付き）
│   │   ├── page.tsx   # /blog (ブログ一覧)
│   │   └── [slug]/    # 動的ルート
│   │       └── page.tsx # /blog/[slug] (記事詳細)
│   └── about/
│       └── page.tsx   # /about
└── (dashboard)/      # 管理ダッシュボード
    ├── layout.tsx    # ダッシュボード用レイアウト
    ├── page.tsx      # /dashboard
    └── posts/
        └── page.tsx  # /dashboard/posts
```

### 実装例

**ルートレイアウト**

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header className="global-header">
          <nav>{/* グローバルナビゲーション */}</nav>
        </header>
        <main>{children}</main>
        <footer className="global-footer">
          <p>© 2025 My Blog</p>
        </footer>
      </body>
    </html>
  );
}
```

**コンテンツレイアウト**

```tsx
// app/(content)/layout.tsx
export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="content-container">
      <div className="content-main">
        {children}
      </div>
    </div>
  );
}
```

**ブログレイアウト**

```tsx
// app/(content)/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-container">
      <aside className="blog-sidebar">
        <h3>カテゴリー</h3>
        <ul>
          <li>技術</li>
          <li>デザイン</li>
          <li>ビジネス</li>
        </ul>
      </aside>
      <div className="blog-content">
        {children}
      </div>
    </div>
  );
}
```

**ダッシュボードレイアウト**

```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <nav>
          <ul>
            <li>ダッシュボード</li>
            <li>投稿管理</li>
            <li>設定</li>
          </ul>
        </nav>
      </aside>
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  );
}
```

以上のようにレイアウトとネストされたルートを駆使することで、効率的でメンテナンス性の高いUIを構築することができます。ユーザー向けページと管理画面で異なるレイアウトを適用したり、特定のセクションだけに追加のナビゲーションを表示したりすることが容易になります。
