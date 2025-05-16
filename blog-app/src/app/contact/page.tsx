export default function ContactPage() {
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-semibold mb-6">お問い合わせ</h1>

            <form className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                        お名前
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="山田 太郎" 
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        メールアドレス
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        placeholder="example@example.com" 
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="message">
                        メッセージ
                    </label>
                    <textarea
                        id="message"
                        className="w-full px-3 py-2 border border-gray-300 rounded h-32"
                        placeholder="お問い合わせ内容をご記入ください" 
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                    送信
                </button>
            </form>
        </div>
    );
}