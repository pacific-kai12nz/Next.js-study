import LikeButton from "../components/LikeButton"

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">My Blog App</h1>
        <p className="text-xl text-gray-600">
          ようこそ！Next.jsで構築された最新のブログプラットフォームへ
        </p>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">最新の投稿</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 将来的な記事カードのプレースホルダー */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-medium mb-2">ブログ記事 {item}</h3>
                <p className="text-gray-600 mb-4">
                  これは将来的なブログ記事の説明文です。データベースからコンテンツを取得して表示します。
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-blue-500 font-medium hover:underline cursor-pointer">
                    続きを読む
                  </div>
                  <LikeButton />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">このブログについて</h2>
          <p className="text-gray-700">
            このブログアプリはNext.js、TypeScript、Tailwind CSS、Prisma ORM、PostgreSQLを使用して構築されています。
            記事の閲覧や投稿など、ブログの基本機能を提供します。
          </p>
        </section>
      </main>

      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500">
        <p> 2025 My Blog App - Next.js</p>
      </footer>
    </div>
  );
}
