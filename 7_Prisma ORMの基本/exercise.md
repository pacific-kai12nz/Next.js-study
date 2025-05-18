# 練習問題: Prisma ORMの基本

## 問題1: 概念の理解

以下の質問に自分の言葉で回答してください：

1. Prisma ORMを使用する主なメリットは何ですか？従来のORMと比較してどのような点が優れていますか？
従来のORMとは異なり、Prismaは型安全性に優れ、開発者体験を重視した設計になっている
Prismaは開発体験が良く、バグの発生を減らせる点で優れています。

2. Prisma Schemaファイルの役割とその重要性について説明してください。
型安全なクライアントコードやマイグレーションが生成されます。つまり、アプリとDBの中間にある「信頼できる設計図」。

3. Prismaのマイグレーション機能とは何か、またそれがデータベース開発においてなぜ重要なのか説明してください。
Prismaのマイグレーション機能は、データベーススキーマの進化を安全・効率的に管理する仕組みです。開発者が複数人いるプロジェクトや本番運用を前提とした開発では、特に重要な機能となります。

## 問題2: Prismaのセットアップと初期設定

ブログアプリケーション用のPrismaの初期設定を行いましょう。

1. Prismaの初期化
   - Prismaをプロジェクトにインストール
   - 初期化コマンドを実行
   - 生成されたファイルの役割を確認

2. データベース接続の設定
   - PostgreSQLデータベースへの接続URLを`.env`ファイルに設定
   - `schema.prisma`ファイルのデータソース設定を確認

## 問題3: データモデルの設計

ブログアプリケーション用のデータモデルを設計しましょう。

1. 基本的なデータモデルの作成
   - `schema.prisma`ファイルに以下のモデルを定義：
     - `User`: ユーザー情報（id, name, email, postsなど）
     - `Post`: 記事情報（id, title, content, published, authorなど）
     - `Comment`: コメント情報（id, content, post, authorなど）
   - 適切なフィールド型とリレーションシップを設定

2. マイグレーションの実行
   - マイグレーションコマンドを実行
   - 生成されたマイグレーションファイルを確認
   - データベースに変更が適用されたことを確認

## 問題4: Prisma Clientの設定

Next.jsアプリケーションでPrisma Clientを使用するための設定を行いましょう。

1. Prismaクライアントの単一インスタンス管理
   - `lib/prisma.ts`ファイルを作成
   - グローバルシングルトンパターンを実装
   - 開発環境と本番環境の違いを考慮した実装

## ヒント

- Prismaのインストールコマンド:
  ```bash
  npm install prisma --save-dev
  npm install @prisma/client
  ```

- Prismaの初期化コマンド:
  ```bash
  npx prisma init
  ```

- データベース接続URL例:
  ```
  DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
  ```

- マイグレーションコマンド:
  ```bash
  npx prisma migrate dev --name init
  ```

- Prismaクライアントの再生成コマンド:
  ```bash
  npx prisma generate
  ```

- Prisma Studioの起動コマンド（データの確認に便利）:
  ```bash
  npx prisma studio
  ```

- シングルトンパターンの実装には、グローバルオブジェクトとTypeScriptの型キャストを使用します。
