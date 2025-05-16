# 3. Server ComponentとClient Component

## コンポーネントの種類と違い

Next.js 13以降のApp Routerでは、Reactコンポーネントは「Server Component」と「Client Component」の2種類に分けられます。これらは異なる環境でレンダリングされ、異なる特性を持っています。

### Server Component

Server Componentは、サーバー側でレンダリングされるコンポーネントです。App Router環境では、**すべてのコンポーネントはデフォルトでServer Componentとして扱われます**。

#### Server Componentの特徴

1. **サーバー環境のみで実行**
   - ブラウザには完全にレンダリングされたHTMLが送信される
   - JavaScriptバンドルサイズを減らし、ページロードを高速化

2. **データ取得が容易**
   - サーバー上でデータベースやAPIに直接アクセス可能
   - クライアントへのデータ転送を最適化

3. **サーバーリソースへのアクセス**
   - ファイルシステム、データベースに直接アクセス可能
   - 環境変数にアクセス可能（クライアントに公開しない設定も含む）

4. **次の機能が使えない**
   - インタラクティブな機能（useState, useReducer, useEffectなど）
   - ブラウザAPI（window, documetなど）
   - イベントリスナー（onClick, onChangeなど）

### Client Component

Client Componentは、ブラウザ（クライアント）側でレンダリング、もしくはハイドレーション（サーバーでレンダリングされた後にブラウザでインタラクティブになる）されるコンポーネントです。

#### Client Componentの宣言方法

ファイルの先頭に `'use client'` ディレクティブを追加することで、そのファイル内のコンポーネントがClient Componentとして扱われます。

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

#### Client Componentの特徴

1. **ブラウザ環境で実行可能**
   - ユーザーインタラクションを処理できる
   - ブラウザAPIにアクセスできる

2. **Reactのフック全般が使える**
   - useState, useReducer, useEffectなど
   - ライフサイクルメソッド

3. **イベントリスナーが使える**
   - onClick, onChange, onSubmitなど

4. **クライアントサイドの状態管理**
   - フォーム入力
   - アニメーション
   - インタラクティブなUI

## 使い分け方

Server ComponentとClient Componentを効果的に使い分けることが、Next.jsアプリの最適化の鍵となります。

### Server Componentを使うべき場合

- データ取得が必要な場合
- サーバー側のリソース（データベース、ファイルシステムなど）にアクセスする必要がある場合
- 機密情報（APIキーなど）を扱う場合
- 大きな依存関係や重いロジックを含む場合（クライアントに送るJavaScriptを減らせる）
- SEOが重要な静的コンテンツ

### Client Componentを使うべき場合

- インタラクティブなUI（フォーム、ボタンなど）が必要な場合
- useStateやuseEffectなどのReactフックが必要な場合
- ブラウザ専用のAPIが必要な場合（localStorage、windowオブジェクトなど）
- イベントリスナーが必要な場合

### コンポーネント内でのネスト

Server ComponentとClient Componentを組み合わせて利用する際、以下の点に注意してください：

1. **Server ComponentはClient Componentをインポートできる**
   - Server Componentがレンダリングされるとき、ネストされたClient Componentはクライアント側でハイドレーションされる

2. **Client ComponentはServer Componentをインポートして子要素として利用できない**
   - ただし、Server Componentを「子要素」としてpropsで渡すことは可能

```tsx
// これは動作しない例（Client ComponentがServer Componentをインポートしようとしている）
'use client'
import ServerComponent from './ServerComponent'

export default function ClientComponent() {
  return (
    <div>
      <ServerComponent /> {/* ❌ エラーが発生する */}
    </div>
  )
}
```

```tsx
// これは動作する例（Server Componentを子要素としてpropsで渡している）
// page.tsx (Server Component)
import ClientComponent from './ClientComponent'
import ServerComponent from './ServerComponent'

export default function Page() {
  return (
    <ClientComponent>
      <ServerComponent /> {/* ✅ これは動作する */}
    </ClientComponent>
  )
}

// ClientComponent.tsx
'use client'

export default function ClientComponent({ children }) {
  return <div>{children}</div>
}
```

## データフェッチの方法

Next.jsのApp Routerでは、Server Componentでデータフェッチするのがベストプラクティスです。

### Server Componentでのデータフェッチ

Server Componentを使うと、サーバー側でデータを取得できるため、クライアントへのJavaScriptの転送を減らし、パフォーマンスを向上させることができます。

```tsx
// app/blog/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts()
  
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Client Componentでのデータフェッチ

Client Componentでもデータフェッチは可能ですが、通常はuseEffectフックを使用します。

```tsx
'use client'

import { useEffect, useState } from 'react'

export default function BlogPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('https://api.example.com/posts')
        if (!res.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data = await res.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [])
  
  if (loading) return <p>Loading posts...</p>
  
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### どちらを選ぶべきか

一般的には、可能な限りServer Componentでデータを取得することをおすすめします。理由は以下の通りです：

1. **パフォーマンス向上**：クライアントへのJavaScript送信が減る
2. **SEO対策**：サーバー側でレンダリングされたHTMLはSEOに有利
3. **環境変数の保護**：APIキーなどの機密情報をクライアントに公開しない
4. **ウォーターフォールの回避**：並列データ取得が容易

ただし、ユーザーのインタラクションに応じてデータを取得する場合（検索機能など）や、コンポーネントがマウント後にのみデータを取得する必要がある場合は、Client Componentでのデータフェッチが適しています。
