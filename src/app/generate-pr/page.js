"use client";
import { useState, useEffect } from 'react';

// 【修正】引数として nickname を受け取るように変更
export default function GeneratePR({ nickname = "名無しの侍" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // ページを開いた瞬間に侍を呼び出す術
  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/generate-pr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            messages: [{ role: "user", content: "こんにちは！作成をお願いします。" }],
            nickname: nickname, // 【修正】変数を使用
            taskTitle: "自己PR作成" 
          }),
        });
        const data = await response.text();
        setMessages([{ role: "model", content: data }]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, [nickname]); // nicknameが変わった時も再実行

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/generate-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: newMessages,
          nickname: nickname, // 【修正】変数を使用
          taskTitle: "自己PR作成" 
        }),
      });
      const data = await response.text();
      setMessages([...newMessages, { role: "model", content: data }]);
    } catch (error) {
      alert("不具合が生じました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen shadow-xl">
      <h1 className="text-3xl font-bold mb-8 text-amber-600 border-b-4 border-amber-200 pb-2">⚔️ 自己PR作成の間</h1>
      
      {/* ニックネームの表示（確認用） */}
      <div className="mb-4 text-sm text-slate-500 italic">
        参陣中：{nickname} 殿
      </div>

      <div className="space-y-6 mb-24">
        {messages.map((m, i) => (
          <div key={i} className={`p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-slate-100 ml-12' : 'bg-amber-50 mr-12 border-l-8 border-amber-400'}`}>
            <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
          </div>
        ))}
        {loading && <p className="text-amber-500 animate-pulse font-bold">侍が深考中...</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-50 border-t flex gap-3 max-w-2xl mx-auto shadow-2xl rounded-t-3xl">
        <textarea 
          className="flex-grow border-2 border-slate-200 rounded-2xl p-3 focus:border-amber-500 outline-none" 
          rows="2" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="侍に想いを伝える..." 
        />
        <button 
          onClick={sendMessage} 
          disabled={loading} 
          className="bg-amber-600 text-white px-8 py-2 rounded-2xl font-bold hover:bg-amber-500 disabled:opacity-50"
        >
          送信
        </button>
      </div>
    </div>
  );
}
