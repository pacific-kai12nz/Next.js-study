# 練習問題: Route HandlerによるAPI作成

## 問題1: 概念の理解

以下の質問に自分の言葉で回答してください：

1. Next.jsのRoute Handlerの主な目的と利点について説明してください。
フロントエンドとバックエンドのコードを同じプロジェクト内に統合できる
サードパーティAPIへの呼び出しを安全に行える（APIキーの露出なし）
データベースに直接接続できる
認証やデータ検証などのミドルウェア機能を追加できる

2. クライアントコンポーネントから直接データベースにアクセスせず、Route Handlerを介してアクセスする理由は何ですか？
クライアントコンポーネントから直接データベースにアクセスしない理由は、セキュリティとアーキテクチャの適切な分離のためです。
代わりに、Route Handler（APIルート）を介して間接的にデータベースにアクセスします。

3. GET、POST、PUT、DELETEなど、異なるHTTPメソッドがそれぞれどのような操作に適しているか説明してください。
GET	ユーザー情報を取得したいときなど
POST ユーザー情報を送る	フォーム送信、登録処理など
PUT	新しい情報を送って上書き	プロフィール更新など
PATCH	部分的な情報を送る	メールアドレスだけ更新など
DELETE	データの削除

## 問題2: 基本的なAPIエンドポイントの作成

ブログアプリケーション用の基本的なAPIエンドポイントを作成しましょう。

1. 記事一覧を取得するAPIエンドポイントの作成
   - `src/app/api/posts/route.ts`を作成
   - GETメソッドを実装し、モックデータとして記事の配列を返す
   - 各記事には少なくとも`id`、`title`、`content`、`author`フィールドを含める

2. 単一の記事を取得するAPIエンドポイントの作成
   - `src/app/api/posts/[id]/route.ts`を作成
   - 指定されたIDの記事を返すGETメソッドを実装
   - 存在しないIDの場合は適切なエラーレスポンスを返す

## 問題3: POSTリクエストの処理

新しい記事を投稿するためのAPIエンドポイントを作成しましょう。

1. 記事投稿APIの実装
   - 既存の`src/app/api/posts/route.ts`にPOSTメソッドを追加
   - リクエストボディから記事データを取得
   - バリデーション（タイトルと内容が空でないことを確認）
   - 成功時は新しく作成された記事オブジェクトと201ステータスを返す
   - バリデーションエラー時は適切なエラーメッセージと400ステータスを返す

## 問題4: クライアントからのAPI呼び出し

クライアントコンポーネントからAPIを呼び出す実装を作成しましょう。

1. 記事一覧を表示するコンポーネントの拡張
   - 既存の記事一覧ページをAPIからデータを取得するように修正
   - `src/app/(content)/blog/page.tsx`など、適切なファイルを更新
   - Server ComponentからfetchAPIを使用してデータを取得する実装

2. 新規投稿フォームの作成
   - `src/components/NewPostForm.tsx`としてクライアントコンポーネントを作成
   - タイトル、内容、著者を入力するフォーム
   - フォーム送信時にPOSTエンドポイントを呼び出す実装
   - 送信成功時と失敗時の適切なフィードバック表示

## ヒント

- Route Handlerではリクエストデータを取得するために次のメソッドが使えます：
  - JSONデータの場合: `const data = await request.json()`
  - FormDataの場合: `const formData = await request.formData()`
  - クエリパラメータの場合: `const searchParams = request.nextUrl.searchParams`

- クライアントコンポーネントでは、フォーム送信時に次のようなコードでAPIを呼び出せます：
```typescript
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ title, content, author }),
});

if (response.ok) {
  // 成功時の処理
} else {
  // エラー処理
}
```

- Server Componentでは非同期関数を使用してデータを取得できます：
```typescript
export default async function BlogPage() {
  const response = await fetch('http://localhost:3000/api/posts');
  const posts = await response.json();
  
  // 残りのコンポーネントコード
}
```
