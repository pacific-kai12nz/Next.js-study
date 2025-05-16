export default function AboutPage() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-semibold mb-6">About US</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">ブログの目的</h2>
                <p className="text-gray-700">
                    このブログは、Next.jsを学習するためのプロジェクトとして開発されています。最新のテクノロジーやプログラミングのトレンドについて共有します。
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">作成者情報</h2>
                <div className="bg-white p-4 rounded shadow">
                    このブログはNext.js学習者によって作成されました。
                </div>
            </section>
        </div>
    );
}
