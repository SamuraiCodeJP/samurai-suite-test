"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Send, Loader2 } from "lucide-react";

export default function SelfPRTool({ nickname }) {
  const [taskTitle, setTaskTitle] = useState("");
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

  // handleStart 関数内を以下のように差し替え
const handleStart = () => {
  if (!taskTitle.trim()) return;
  setIsStarted(true);
  setMessages([
    {
      role: "model",
      content: `${nickname}殿、よくぞ参られた！\n課題「${taskTitle}」、しかと承ったでござる。\n\nさあ、${nickname}殿が学生時代に心血を注いだ「武勇伝（エピソード）」を、ぜひ拙者に語ってくだされ！\n\n例えば、力を注いだ活動は？\n力を注ごうと思った「理由」や、どんな「目標」をもったかを教えてくだされ。\n\n考えがまとまっていないならば、箇条書きや断片的な表現でも構いませぬ。まずは思うがままに投げてくだされ。拙者がそれを拾い上げ、共に最高の「ガクチカ」を練り上げようではござらんか！`,
    },
  ]);
};

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "model", content: "" }]);

    try {
      const response = await fetch("/api/generate-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, nickname, taskTitle }),
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
    自己PR作成の陣
  </div>
  {/* 魔法の言葉（注釈） */}
  <span className="text-[10px] md:text-xs font-normal text-slate-400 mt-1 tracking-normal">
    ※もしも侍が回答途中でフリーズしたら、数分待ってから、魔法の言葉「続けて」と入力してみてくだされ
  </span>
</h2>
          <p className="text-samurai-paper/60 text-sm">
            {nickname} 殿、いざ出陣！<br />
            まずは立ち向かうべき課題を教えられよ。
          </p>
        </div>

        <div className="bg-samurai-ink/40 border border-samurai-paper/10 rounded-lg p-6 flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-samurai-gold text-sm tracking-wider font-medium">
              課題タイトル（企業からの設問）
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="例: 学生時代に最も力を入れたこと"
              className="w-full bg-samurai-indigo/30 border border-samurai-paper/30 rounded p-3 text-white outline-none focus:border-samurai-gold transition-colors placeholder-white/20"
            />
          </div>

          <button
            onClick={handleStart}
            disabled={!taskTitle.trim()}
            className="w-full py-3 rounded bg-samurai-crimson text-white font-bold tracking-widest disabled:opacity-50 hover:bg-rose-600 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.3)]"
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
          <User className="text-samurai-crimson w-5 h-5" />
          自己PR作成の陣
        </h2>
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
                  // ユーザー側は今まで通りの侍カラー
                  ? "bg-samurai-indigo text-samurai-paper rounded-br-none border border-samurai-paper/10"
                  // 【改善】AI側は白背景に黒文字、境界線も標準的な色にしてコピペ時の色残りを防止
                  : "bg-white text-slate-900 rounded-bl-none border border-slate-200"
              }`}
            >
              {msg.content}
              {isLoading && index === messages.length - 1 && msg.role === "model" && (
                <span className="inline-block w-1 h-4 bg-samurai-gold ml-1 animate-pulse" />
              )}
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
