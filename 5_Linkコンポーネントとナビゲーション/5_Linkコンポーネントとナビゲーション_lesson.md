# 5. Linkコンポーネントとナビゲーション

## クライアントサイドのページ遷移

Next.jsでは、`next/link`からインポートした`Link`コンポーネントを使用して、クライアントサイドのページ遷移を実現します。これにより、従来のWebサイトのような完全なページのリロードを回避し、シングルページアプリケーション（SPA）のようなスムーズな遷移体験を提供できます。

### Linkコンポーネントの基本

`Link`コンポーネントは、HTMLの`<a>`タグをラップしたコンポーネントで、Next.jsのクライアントサイドナビゲーション機能を提供します。

```tsx
import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <Link href="/">ホーム</Link>
      <Link href="/about">About</Link>
      <Link href="/blog">ブログ</Link>
    </nav>
  );
}
```

### Linkコンポーネントのメリット

1. **パフォーマンスの最適化**
   - ブラウザのページ全体のリロードを回避
   - 必要なコンポーネントだけを更新
   - 画面遷移が高速

2. **状態の保持**
   - ページ間の遷移時にReactの状態を維持可能
   - フォームの入力状態などをページ遷移後も保持できる

3. **自動的なコード分割**
   - 各ページのコードが別々のJavaScriptバンドルに分割される
   - 必要なページのコードだけを読み込みパフォーマンスが向上

### Linkコンポーネントの高度な使い方

#### 1. 動的なルートへのリンク

動的なルートセグメントを持つパスへのリンクも簡単に作成できます。

```tsx
// 動的なブログ記事IDに基づいたリンク
function BlogPostLink({ postId, title }) {
  return (
    <Link href={`/blog/${postId}`}>
      {title}
    </Link>
  );
}
```

#### 2. クエリパラメータの追加

`href`プロパティにオブジェクトを渡すことで、より複雑なURLやクエリパラメータを指定できます。

```tsx
<Link
  href={{
    pathname: '/blog',
    query: { category: 'technology', sort: 'newest' },
  }}
>
  技術記事（最新順）
</Link>
```

このリンクは `/blog?category=technology&sort=newest` に遷移します。

#### 3. スタイルの適用

`Link`コンポーネントはHTMLの`<a>`タグをレンダリングするため、通常のスタイル適用方法が使用できます。

```tsx
<Link
  href="/contact"
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>
  お問い合わせ
</Link>
```

#### 4. アクティブなリンクのスタイリング

現在のパスに基づいてリンクをスタイリングするには、`usePathname`フックを使用します。

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav>
      <Link 
        href="/" 
        className={pathname === '/' ? 'font-bold text-blue-600' : ''}
      >
        ホーム
      </Link>
      <Link 
        href="/about" 
        className={pathname === '/about' ? 'font-bold text-blue-600' : ''}
      >
        About
      </Link>
    </nav>
  );
}
```

注意: `usePathname`はクライアントコンポーネントでのみ動作するため、ファイルの先頭に `'use client'` ディレクティブが必要です。

## プログラムによるナビゲーション

リンククリック以外の方法でもナビゲーションを制御したい場合があります。例えば：

- フォーム送信後の自動リダイレクト
- ボタンクリック時のページ遷移
- 条件付きのナビゲーション

このような場合、`useRouter`フックを使用してプログラムによるナビゲーションを実現できます。

### useRouterフックの使用

`useRouter`フックは`next/navigation`からインポートでき、プログラムによるナビゲーション機能を提供します。

```tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ログイン処理...
    const success = await performLogin(/* ... */);
    
    // ログイン成功時にダッシュボードへリダイレクト
    if (success) {
      router.push('/dashboard');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* フォームフィールド */}
      <button type="submit">ログイン</button>
    </form>
  );
}
```

### useRouterの主要なメソッド

1. **router.push(href)**
   - 指定したパスに遷移し、ブラウザの履歴に新しいエントリを追加
   - `Link`コンポーネントのクリックと同様の動作

   ```tsx
   router.push('/dashboard');
   ```

2. **router.replace(href)**
   - 現在のURLを指定したパスで置換（履歴に新しいエントリを追加しない）
   - ブラウザの「戻る」ボタンでこのナビゲーションに戻れない

   ```tsx
   router.replace('/login');
   ```

3. **router.back()**
   - ブラウザの履歴で1つ前のページに戻る

   ```tsx
   router.back();
   ```

4. **router.forward()**
   - ブラウザの履歴で1つ先のページに進む

   ```tsx
   router.forward();
   ```

5. **router.refresh()**
   - 現在のルートを再取得して最新の状態を反映

   ```tsx
   router.refresh();
   ```

### ナビゲーションイベントの処理

アプリケーションでページの遷移を検出したい場合は、`usePathname`や`useSearchParams`フックを使用できます。これらの値が変更されるとコンポーネントが再レンダリングされるため、遷移を検出できます。

```tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // ページ遷移を検出した時の処理
    console.log('ページ遷移が発生しました');
    console.log('現在のパス:', pathname);
    console.log('クエリパラメータ:', searchParams.toString());
    
    // アナリティクスイベントの送信など
  }, [pathname, searchParams]);
  
  return null;
}
```

## ベストプラクティス

### 1. 可能な限りLinkコンポーネントを使用する

プログラムによるナビゲーションよりも、可能な限り`Link`コンポーネントを使用することを推奨します。これにより：

- プリフェッチが自動的に行われる
- アクセシビリティが向上する
- コードがよりシンプルになる

### 2. 動的なリンクの適切な生成

動的なコンテンツに基づいてリンクを生成する際は、URLエンコーディングに注意しましょう。

```tsx
// 安全なURL生成
const safeSlug = encodeURIComponent(post.title.toLowerCase().replace(/\s+/g, '-'));
<Link href={`/blog/${safeSlug}`}>{post.title}</Link>
```

### 3. サーバーコンポーネントでの注意点

`useRouter`、`usePathname`、`useSearchParams`はクライアントコンポーネントでのみ使用できます。サーバーコンポーネントでは、これらを直接使用できません。代わりに：

- `Link`コンポーネントはサーバーコンポーネントでも使用可能
- プログラムによるナビゲーションが必要な部分だけをクライアントコンポーネントとして切り出す

### 4. アクセシビリティへの配慮

ナビゲーションの実装時は、アクセシビリティにも配慮しましょう。

```tsx
<Link 
  href="/blog"
  aria-label="ブログ記事一覧を見る"
  title="ブログ記事一覧"
>
  ブログ
</Link>
```

## 実践例: 記事詳細ページへのナビゲーション

ブログアプリケーションで、記事一覧から詳細ページへのナビゲーションを実装する例を見てみましょう。

### ブログ記事一覧ページ

```tsx
// app/blog/page.tsx
import Link from 'next/link';

type Post = {
  id: number;
  title: string;
  body: string;
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts();
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">ブログ記事一覧</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 9).map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-medium mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">
              {post.body.substring(0, 100)}...
            </p>
            <Link
              href={`/blog/${post.id}`}
              className="text-blue-500 font-medium hover:underline"
            >
              続きを読む
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### ブログ記事詳細ページ

```tsx
// app/blog/[id]/page.tsx
type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

type PageProps = {
  params: { id: string };
};

async function getPost(id: string): Promise<Post> {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPost(params.id);
  
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
        <div className="prose lg:prose-xl">
          <p>{post.body}</p>
        </div>
        <div className="mt-8">
          <Link
            href="/blog"
            className="text-blue-500 hover:underline flex items-center"
          >
            <span>← 記事一覧に戻る</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

このように、`Link`コンポーネントを使用することで、スムーズなクライアントサイドナビゲーションを実現できます。ユーザーはページのリロードなしで記事一覧と詳細ページを行き来することができ、SPAのような快適な体験を得られます。
