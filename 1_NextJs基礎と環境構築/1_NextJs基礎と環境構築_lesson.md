# Next.jsの基礎と環境構築

## Next.jsとは

Next.jsは、Reactをベースにしたフルスタックのウェブアプリケーションフレームワークです。Reactの機能を拡張し、サーバーサイドレンダリング（SSR）、静的サイト生成（SSG）、APIルートなどの機能を提供しています。

### Next.jsの主な特徴

1. **サーバーコンポーネントとクライアントコンポーネント**
   - サーバーコンポーネント：サーバー上でレンダリングされ、HTMLとして送信されます
   - クライアントコンポーネント：ブラウザ上でインタラクティブな機能を提供します

2. **ファイルベースのルーティング**
   - `app`ディレクトリ内のフォルダ構造がそのままURLのパスになります
   - 特殊なファイル（page.tsx, layout.tsx など）が特定の役割を持ちます

3. **ビルトインの最適化**
   - 自動的な画像最適化
   - コード分割
   - プリフェッチング

4. **APIルート**
   - 同じNext.jsプロジェクト内でAPIエンドポイントを作成できます

## 環境構築

今回は、シンプルなSNSアプリを作りながらNext.jsの基礎を学んでいきます。

### プロジェクトのセットアップ

Next.jsプロジェクトは以下のコマンドで作成できます：

```bash
npx create-next-app@latest sns-app --typescript
```

これにより、TypeScriptをサポートしたNext.jsプロジェクトが作成されます。

### プロジェクトの基本構造

プロジェクトを作成すると、以下のような構造が生成されます：

```
sns-app/
├── app/             // アプリケーションのルーティングとページを定義
│   ├── page.tsx     // ルートURL(/)のページコンポーネント
│   ├── layout.tsx   // アプリ全体のレイアウト
│   └── ...
├── public/          // 静的ファイル（画像、フォントなど）
├── components/      // 再利用可能なコンポーネント
├── lib/             // ユーティリティ関数、カスタムフック
├── styles/          // CSSファイル
├── next.config.js   // Next.jsの設定ファイル
├── package.json     // 依存関係とスクリプト
└── tsconfig.json    // TypeScriptの設定
```

### データベース環境（PostgreSQL）のセットアップ

SNSアプリを作成するために、PostgreSQLをDockerで設定します。以下の`docker-compose.yml`ファイルを作成します：

```yaml
version: '3'

services:
  postgres:
    image: postgres:16
    container_name: sns-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: sns_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Next.jsアプリケーションの起動方法

プロジェクトディレクトリに移動して、以下のコマンドを実行します：

```bash
cd sns-app
npm run dev
```

これにより、開発サーバーが起動し、通常は`http://localhost:3000`でアプリケーションにアクセスできます。

## Next.jsの基本概念

### Appルーター

Next.js 13以降では、`app`ディレクトリを使用する新しいルーティングシステムが導入されました。このシステムはファイルベースのルーティングを採用しています。

例えば：
- `app/page.tsx` → `/` (ルートURL)
- `app/profile/page.tsx` → `/profile`
- `app/posts/[id]/page.tsx` → `/posts/1`, `/posts/2` など（動的ルート）

### 特殊なファイル

Next.jsでは、特定のファイル名に特別な意味があります：

- `page.tsx`: URLに対応するページを定義します
- `layout.tsx`: 複数のページで共有されるレイアウトを定義します
- `loading.tsx`: ページ読み込み中の表示内容を定義します
- `error.tsx`: エラー発生時の表示内容を定義します
- `route.ts`: APIエンドポイントを定義します

### サーバーコンポーネントとクライアントコンポーネント

Next.js 13以降では、デフォルトですべてのコンポーネントがサーバーコンポーネントになります。クライアントコンポーネントにするには、ファイルの先頭に`'use client'`ディレクティブを追加します。

```tsx
// これはサーバーコンポーネント（デフォルト）
export default function ServerComponent() {
  return <div>サーバーでレンダリングされました</div>;
}
```

```tsx
'use client'

// これはクライアントコンポーネント
import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>増加</button>
    </div>
  );
}
```

サーバーコンポーネントとクライアントコンポーネントは互いに組み合わせて使用できますが、サーバーコンポーネントはクライアントコンポーネントをインポートできても、クライアントコンポーネントはサーバーコンポーネントを動的にインポートすることはできません（子コンポーネントとして使用することは可能です）。

この基本を理解したら、次のステップでは実際にSNSアプリを作りながら、ルーティングやコンポーネントの実装方法を学んでいきましょう。
