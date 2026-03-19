"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Send, Loader2, User } from "lucide-react";

export default function WorkVisionTool({ nickname }) {
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStart = () => {
    setIsStarted(true);
    setMessages([
      {
        role: "model",
        content: `${nickname}殿、よくぞ参られた！\n拙者と共に、10年後も色褪せぬ「仕事ビジョン」を鍛え上げようではないか。まずは、気になっている業界名や「都市鉱山」「食糧問題」などのキーワードを教えてくだされ。`,
      },
    ]);
  };

  const clearChat = () => {
    setIsStarted(false);
    setMessages([]);
    setInput("");
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInputText = input.trim();
    if (userInputText === "戻る") { clearChat(); return; }

    const userMessage = { role: "user", content: userInputText };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "model", content: "" }]);

    try {
      const response = await fetch("/api/generate-vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, nickname }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = { ...last, content: last.content + chunk };
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "model",
          content: "申し訳ございませぬ…通信に乱れが生じ申した。もう一度お試しくださいませ。",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto justify-center">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-samurai-gold tracking-wider mb-2 flex flex-col items-center justify-center">
  {/* アイコンとタイトルの一行 */}
  <div className="flex items-center gap-2">
    <User className="text-samurai-crimson" />
    仕事ビジョン形成の陣
  </div>
  {/* 魔法の言葉（注釈） */}
  <span className="text-[10px] md:text-xs font-normal text-slate-400 mt-1 tracking-normal">
    ※もしも侍が回答途中でフリーズしたら、数分待ってから、魔法の言葉「続けて」と入力してみてくだされ
  </span>
</h2>
          <p className="text-samurai-paper/60 text-sm">
            {nickname} 殿の歩むべき道を描く羅針盤でござる。
          </p>
        </div>

        <div className="bg-samurai-ink/40 border border-samurai-paper/10 rounded-lg p-6">
          <button
            onClick={handleStart}
            className="w-full py-3 rounded bg-samurai-gold text-samurai-indigo font-bold tracking-widest hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            問答を開始する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 pb-4 border-b border-samurai-paper/10 flex justify-between items-center">
        <h2 className="text-lg font-bold text-samurai-gold flex items-center gap-2">
          <Target className="text-samurai-indigo bg-samurai-gold p-1 rounded-sm w-6 h-6" />
          仕事ビジョン形成の陣
        </h2>
        <button
          onClick={clearChat}
          className="text-xs text-samurai-paper/50 hover:text-samurai-crimson transition-colors"
        >
          初めからやり直す
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide flex flex-col">
        {messages.map((msg, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 whitespace-pre-wrap text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-samurai-indigo text-samurai-paper rounded-br-none border border-samurai-paper/10"
                  // 【改善】こちらもAI側は白背景に統一
                  : "bg-white text-slate-900 rounded-bl-none border border-slate-200"
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

     {/* ここから差し替え */}
      <div className="mt-4 pt-4 border-t border-samurai-paper/10 flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            // 入力に合わせて高さを自動で変えるおまじない
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          // 【改善】onKeyDownを削除（またはShift+Enter送信の設定を解除）することで、Enterで自由に改行可能に
          placeholder="侍に想いを伝える..."
          className="flex-1 bg-samurai-ink/50 border border-samurai-paper/20 rounded-xl p-3 text-sm text-white outline-none focus:border-samurai-gold transition-colors resize-none min-h-[56px] max-h-40 leading-relaxed scrollbar-hide"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          // 【改善】矢印を入力欄の右横（end）に固定
          className="mb-2 p-2 text-samurai-gold disabled:text-samurai-paper/30 hover:text-samurai-crimson transition-colors flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </div>
      {/* 差し替えここまで */}
    </div>
  );
}
