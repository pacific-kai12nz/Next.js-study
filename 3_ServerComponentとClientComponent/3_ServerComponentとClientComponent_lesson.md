# Server ComponentとClient Component

Next.js 13以降では、Reactのコンポーネントを「Server Component」と「Client Component」の2種類に分けて考えることができます。この区別は、コンポーネントがどこでレンダリングされるか、そして何ができるかに大きな影響を与えます。

## Server Componentの概念と利点

Server Component（サーバーコンポーネント）は、サーバー上でレンダリングされ、その結果のHTMLがクライアント（ブラウザ）に送信されるコンポーネントです。

### Server Componentの特徴

1. **デフォルトの挙動**: Next.js 13のApp Routerでは、特に指定がない限り、すべてのコンポーネントはServer Componentとして扱われます

2. **データベースやファイルシステムへの直接アクセスが可能**:
   - サーバー上で実行されるため、データベースクエリを直接実行できる
   - サーバーのファイルシステムに直接アクセスできる
   - 秘密のAPIキーやトークンを安全に使用できる

3. **Javascriptバンドルサイズの削減**:
   - Server Componentのコードはクライアントに送信されないため、Javascriptのバンドルサイズが小さくなる

4. **初期ページロードの高速化**:
   - サーバーでHTMLを生成するため、初期表示が高速になる
   - クライアント側でのJavascriptの実行が少なくなる

### Server Componentの制限

1. **ブラウザのAPIにアクセスできない**:
   - `window`、`document`などのブラウザオブジェクトを使用できない

2. **Reactのステート関連のフックが使用できない**:
   - `useState`、`useReducer`などのステート管理フックは使用できない

3. **イベントハンドラを追加できない**:
   - `onClick`、`onChange`などのイベントハンドラを設定できない

### Server Componentの例

```tsx
// これはServer Component（デフォルト）
export default async function UserProfile({ userId }) {
  // データベースから直接ユーザー情報を取得（サーバー上で実行）
  const user = await db.user.findUnique({ where: { id: userId } });
  
  return (
    <div>
      <h1>{user.name}のプロフィール</h1>
      <p>メール: {user.email}</p>
      {/* ユーザー情報の表示（インタラクティブではない部分） */}
    </div>
  );
}
```

## Client Componentの概念と利点

Client Component（クライアントコンポーネント）は、ブラウザ上でJavascriptとして実行され、インタラクティブな機能を提供するコンポーネントです。

### Client Componentの特徴

1. **'use client'ディレクティブで指定**: ファイルの先頭に`'use client'`と記述することで、そのファイル内のコンポーネントがClient Componentとして扱われます

2. **ステート管理とイベントハンドリング**:
   - `useState`や`useReducer`などのReactフックを使用可能
   - ユーザーイベント（クリックなど）をハンドリングできる

3. **ブラウザAPIへのアクセス**:
   - `window`、`document`、`localStorage`などのブラウザAPIを使用可能

4. **クライアントサイドのライブラリの使用**:
   - ブラウザ環境に依存するライブラリを使用可能

### Client Componentの制限

1. **大きなJavascriptバンドル**:
   - コードがクライアントに送信されるため、バンドルサイズが大きくなる可能性がある

2. **サーバー専用のAPIやデータへの直接アクセスができない**:
   - データベースに直接アクセスすることはできない
   - 秘密のAPIキーを安全に使用することができない

### Client Componentの例

```tsx
'use client'

import { useState } from 'react';

export default function Counter() {
  // クライアント側のステート管理
  const [count, setCount] = useState(0);
  
  // ユーザーイベント（クリック）のハンドリング
  const handleIncrement = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={handleIncrement}>増加</button>
    </div>
  );
}
```

## 使い分けの基準

Server ComponentとClient Componentをどのように使い分けるべきか、基本的な指針を説明します。

### Server Componentを使用すべき場合

1. **データフェッチングが必要**:
   - データベースやAPIからデータを取得する場合
   - APIキーなどの秘密情報を使用する場合

2. **SEOが重要**:
   - 検索エンジンに正しくインデックスされる必要があるコンテンツ

3. **静的な表示要素**:
   - ユーザーインタラクションがないUI要素
   - ヘッダー、フッター、静的なテキストコンテンツなど

4. **大きなサードパーティライブラリの使用**:
   - クライアントバンドルサイズを小さく保ちたい場合

### Client Componentを使用すべき場合

1. **インタラクティブなUI**:
   - フォーム、ボタン、タブなどのインタラクティブな要素
   - ユーザーイベントへの応答が必要な場合

2. **クライアントステートの使用**:
   - `useState`、`useReducer`などを使用したステート管理
   - `useEffect`を使用したサイドエフェクトの管理

3. **ブラウザ専用のAPIが必要**:
   - `window`、`document`へのアクセスが必要な場合
   - `localStorage`などのブラウザストレージの使用

4. **クライアントサイドのライブラリ統合**:
   - アニメーションライブラリ（Framer Motionなど）
   - UI状態管理ライブラリ

## コンポーネントの組み合わせ

Server ComponentとClient Componentは互いに組み合わせて使用できます。

### クライアントコンポーネント内でのサーバーコンポーネントの使用

Client Componentの中にServer Componentを含めることができます。これにより、アプリケーションの一部分だけをインタラクティブにしつつ、残りはサーバーでレンダリングするという効率的な構成が可能になります。

```tsx
// ServerComponent.tsx
export default function ServerComponent() {
  return <div>これはサーバーコンポーネントです</div>;
}

// ClientComponent.tsx
'use client'
import { useState } from 'react';
import ServerComponent from './ServerComponent';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>クライアントコンポーネント</h1>
      <button onClick={() => setCount(count + 1)}>
        クリック数: {count}
      </button>
      
      {/* サーバーコンポーネントをクライアントコンポーネント内で使用 */}
      <ServerComponent />
    </div>
  );
}
```

### 重要な注意点

1. **Client Componentからの直接インポート**:
   - Server ComponentをClient Componentからインポートして使用することはできますが、それらのコンポーネントはサーバーでレンダリングされ、静的なHTMLとしてクライアントコンポーネントに渡されます。

2. **Server ComponentからのClient Componentのインポート**:
   - Server ComponentからClient Componentをインポートして使用することもできますが、その場合はClient Componentとしてクライアント側でハイドレーションされます。

3. **「use client」ディレクティブの継承**:
   - あるファイルに「use client」ディレクティブを記述すると、そのファイル内のすべてのコンポーネントがClient Componentになります。
   - また、そのファイルからインポートされたコンポーネントも自動的にClient Componentとして扱われます。

## ベストプラクティス

1. **「Client Components Islands」パターンの使用**:
   - アプリケーションの大部分をServer Componentとして実装
   - インタラクティブな部分だけをClient Componentとして実装
   - これにより、パフォーマンスの最適化とインタラクティブ性のバランスを取ることができます

2. **コンポーネント構造の最適化**:
   - インタラクティブな部分を小さなClient Componentに分割
   - 静的な部分はServer Componentに保持

3. **データフェッチングの場所**:
   - 可能な限りServer Componentでデータフェッチングを行う
   - クライアント側でのデータフェッチングは、動的なデータやユーザーアクション後のみに制限

4. **Props経由でのデータパッシング**:
   - Server Componentで取得したデータをClient Componentにprops経由で渡す
   - これにより、Client Componentは必要なデータを受け取りつつ、データフェッチングのロジックはサーバー側に保持できます
