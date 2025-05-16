// 左側にサイドバーがあり、右側にコンテンツを表示するレイアウト
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* サイドバー */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold mb-6">ダッシュボード</h1>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard" 
                className="block py-2 px-4 hover:bg-gray-700 rounded transition-colors"
              >
                ダッシュボード
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/posts" 
                className="block py-2 px-4 hover:bg-gray-700 rounded transition-colors"
              >
                投稿管理
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* メインコンテンツ */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
