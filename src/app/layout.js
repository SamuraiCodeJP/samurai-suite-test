import "./globals.css";

export const metadata = {
  title: "Samurai Code JP - Career Support Suite",
  description: "3つのキャリア支援AIツール（自己PR作成、仕事ビジョン形成、次世代産業解説）を統合したWebアプリケーション",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen bg-samurai-ink text-samurai-paper selection:bg-samurai-crimson selection:text-white">
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-samurai-crimson/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-samurai-gold/10 rounded-full blur-[120px]"></div>
        </div>
        
        <main className="relative z-10 w-full max-w-lg mx-auto min-h-screen flex flex-col shadow-2xl bg-samurai-indigo/30 backdrop-blur-sm border-x border-samurai-paper/10 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
