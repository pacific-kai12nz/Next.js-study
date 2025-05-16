// コンテンツセクション用のレイアウト
export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="content-container max-w-7xl mx-auto">
      {/* ここにコンテンツページ共通の要素を追加できます */}
      <div className="content-main py-6">
        {children}
      </div>
      
      {/* オプション: コンテンツページ共通のサイドバーやナビゲーションなど */}
    </div>
  );
}
