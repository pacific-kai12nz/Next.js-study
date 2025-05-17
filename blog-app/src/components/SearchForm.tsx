'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  // 検索キーワードの状態
  const [searchQuery, setSearchQuery] = useState('');
  
  // Next.jsのルーターフックを初期化
  const router = useRouter();
  
  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 検索キーワードが空でない場合のみナビゲーションを実行
    if (searchQuery.trim()) {
      // 検索結果ページに遷移
      router.push(`/blog/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="記事を検索..."
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="検索キーワード"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          検索
        </button>
      </div>
    </form>
  );
}
