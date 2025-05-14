# Appルーターによるルーティング

## App Routerとは

App Routerは、Next.js 13で導入された新しいルーティングシステムです。従来のPages Routerと比較して、より柔軟で効率的なルーティングの実装が可能になりました。App Routerは`app`ディレクトリを使用し、ファイルシステムベースのルーティングを採用しています。

## ファイルベースルーティングの基本

Next.jsのApp Routerでは、ファイルシステムを使用してルーティングを定義します。具体的には、`app`ディレクトリ内のフォルダ構造がそのままURLのパスになります。

### 基本的なルーティング

基本的なルールは以下の通りです：

1. `app`ディレクトリがルーティングの起点
2. フォルダ名がURLのパスセグメントになる
3. 特殊なファイル名（`page.js/tsx`など）が特定の役割を持つ

例えば：

| フォルダ/ファイル構造 | URL |
|-------------------|-----|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/blog/page.tsx` | `/blog` |
| `app/blog/first-post/page.tsx` | `/blog/first-post` |

### 特殊ファイル規則

App Routerでは、特定のファイル名に特別な意味が割り当てられています：

- `page.js/tsx`: ルートのUIを定義し、そのパスを公開アクセス可能にする
- `layout.js/tsx`: 複数のページで共有されるUIを定義
- `loading.js/tsx`: ページ読み込み中の表示内容（ローディングUI）
- `error.js/tsx`: エラー発生時の表示内容
- `not-found.js/tsx`: 404エラー（ページが見つからない）時の表示内容

重要なポイント：**フォルダを作成しただけではルートは公開されません。必ず`page.js/tsx`ファイルが必要です。**

## ダイナミックルーティング

実際のアプリケーションでは、URLの一部が動的に変化するルートが必要になることがよくあります。例えば、ブログ記事のIDや商品IDなどです。

### 動的セグメントの定義

動的セグメントは、フォルダ名を`[パラメータ名]`のように角括弧で囲むことで定義します：

```
app/
  blog/
    [id]/
      page.tsx  // /blog/1, /blog/2 などにマッチ
```

### 動的パラメータの取得

動的セグメントのパラメータは、Pageコンポーネントや他のサーバーコンポーネントでは`params`プロパティとして受け取ることができます：

```tsx
// app/blog/[id]/page.tsx
export default function BlogPost({ params }: { params: { id: string } }) {
  return <div>ブログ記事 ID: {params.id}</div>;
}
```

### 複数のダイナミックセグメント

複数のダイナミックセグメントを含むルートも定義できます：

```
app/
  shop/
    [category]/
      [product]/
        page.tsx  // /shop/clothing/tshirt など
```

```tsx
// app/shop/[category]/[product]/page.tsx
export default function Product({ params }: { 
  params: { category: string; product: string } 
}) {
  return (
    <div>
      <h1>商品ページ</h1>
      <p>カテゴリー: {params.category}</p>
      <p>商品: {params.product}</p>
    </div>
  );
}
```

### キャッチオールルート

任意の数のセグメントをキャプチャするには、`[...slug]`という形式（三点ドット付き）を使用します：

```
app/
  docs/
    [...slug]/
      page.tsx  // /docs/a, /docs/a/b, /docs/a/b/c など
```

```tsx
// app/docs/[...slug]/page.tsx
export default function Docs({ params }: { params: { slug: string[] } }) {
  // slugは配列になる
  return <div>スラグ: {params.slug.join('/')}</div>;
}
```

## ネストされたルート

Next.jsのApp Routerでは、UIをネストし、各レベルが独自のレイアウトを持つことができます。

### レイアウトの共有

`layout.tsx`ファイルを使用すると、複数のページ間でレイアウトを共有できます：

```tsx
// app/layout.tsx (ルートレイアウト)
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header>ヘッダー</header>
        <main>{children}</main>
        <footer>フッター</footer>
      </body>
    </html>
  );
}
```

```tsx
// app/blog/layout.tsx (ブログセクション用のレイアウト)
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>ブログナビゲーション</nav>
      <section>{children}</section>
      <aside>ブログの関連情報</aside>
    </div>
  );
}
```

この場合、`/blog`以下のすべてのページは両方のレイアウトを継承します。

## ルートグループ

ルートグループを使用すると、アプリを論理的なセクションに分割できます。

### ルートグループの定義

ルートグループは、フォルダ名を`(グループ名)`のように括弧で囲むことで定義します：

```
app/
  (marketing)/
    about/
      page.tsx  // /about
    contact/
      page.tsx  // /contact
  (shop)/
    products/
      page.tsx  // /products
    cart/
      page.tsx  // /cart
```

重要なポイント：

1. グループ名はURLパスには影響しない
2. 各グループは独自のレイアウトを持つことができる
3. グループはURLの構造を整理するためのもので、実際のパスには現れない

### ルートグループの利点

- 特定のセクション用に別々のルートレイアウトを作成できる
- アプリを論理的なセクション（管理者用、ユーザー用など）に分割できる
- 関連するルートを一緒にグループ化して整理できる

例えば、管理者セクションと顧客向けセクションで別々のレイアウトを持たせることが可能です：

```
app/
  (admin)/
    layout.tsx  // 管理者向けレイアウト
    dashboard/
      page.tsx  // /dashboard
  (shop)/
    layout.tsx  // 顧客向けレイアウト
    products/
      page.tsx  // /products
```

## ルーティングのベストプラクティス

1. **意味のあるURL構造を設計する**：URLは、アプリの構造を反映し、わかりやすいものにする

2. **適切なレイアウトの共有**：共通のUIコンポーネントは適切なレベルの`layout.tsx`に配置する

3. **動的ルートの適切な使用**：過度に複雑な動的ルートは避け、必要な場合のみ使用する

4. **ルートグループを活用する**：アプリの論理的な構造に従ってルートをグループ化する

5. **適切なローディングと404ページを提供する**：ユーザー体験の向上のため、適切なローディングUIと404ページを設定する
