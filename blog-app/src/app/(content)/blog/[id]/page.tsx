import Link from 'next/link';

// 記事の型定義
type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

// ページコンポーネントのpropsの型
type PageProps = {
  params: { id: string };
};

// 特定の記事を取得する関数
async function getPost(id: string): Promise<Post> {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  
  if (!response.ok) {
    throw new Error('記事の取得に失敗しました');
  }
  
  return response.json();
}

// 記事詳細ページコンポーネント
export default async function BlogPostPage({ params }: PageProps) {
  // params.idを使用して記事データを取得
  const post = await getPost(params.id);
  
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
        <div className="mb-6">
          <p className="text-gray-700">{post.body}</p>
        </div>
        
        {/* 一覧ページに戻るリンク */}
        <Link 
          href="/blog" 
          className="text-blue-500 hover:underline"
        >
          ← 記事一覧に戻る
        </Link>
      </div>
    </div>
  );
}
