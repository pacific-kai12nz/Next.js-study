export default function DashboardHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 統計カード - 自分でカスタマイズしてみてください */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2">総投稿数</h2>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
        
        {/* 別の統計カードを追加してみましょう */}
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">最近の活動</h2>
        {/* 活動リストを追加してみましょう */}
      </div>
    </div>
  );
}
