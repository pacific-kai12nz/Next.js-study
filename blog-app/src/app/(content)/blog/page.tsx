// Server Componentを使ったデータ取得の例
// Server Componentはデフォルトで非同期関数として扱える

import SearchForm from '@/components/SearchForm';
import Link from 'next/link'
// ブログ記事の型定義
type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

// JSONPlaceholderからブログ記事を取得する関数
async function fetchPosts(): Promise<Post[]> {
  // Next.jsのfetch APIは自動でキャッシュする
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  
  // レスポンスが正常でない場合はエラーをスロー
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return response.json()
}

// ページコンポーネント（Server Component）
export default async function BlogPage() {
  // データ取得を待機（サーバーサイドで実行される）
  const posts = await fetchPosts()
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">ブログ記事一覧</h1>
      
      {/* 検索フォームを追加 */}
      <SearchForm />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 9).map((post: Post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-medium mb-2 text-blue-600">{post.title}</h2>
            <p className="text-gray-600 mb-4">
              {post.body.substring(0, 100)}...
            </p>
            <Link 
              href={`/blog/${post.id}`}
              className="text-blue-500 font-medium hover:underline cursor-pointer"
            >
              続きを読む
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
