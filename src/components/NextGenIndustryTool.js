"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Send, Loader2 } from "lucide-react";

// Helper function to safely render markdown tables in the chat UI
const renderMessageContent = (content) => {
  // Check if content contains markdown table pattern
  if (content.includes('|') && content.includes('-|-')) {
    const lines = content.split('\n');
    let inTable = false;
    let tableRows = [];
    let parsedContent = [];

    lines.forEach((line, index) => {
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        tableRows.push(line);
      } else {
        if (inTable) {
          // Process collected table
          parsedContent.push(
            <div key={`table-${index}`} className="my-4 overflow-x-auto">
              <table className="w-full text-left border-collapse border border-samurai-paper/20">
                <tbody className="divide-y divide-samurai-paper/20 bg-samurai-ink/50">
                  {tableRows.map((row, rIndex) => {
                    const cells = row.split('|').filter(c => c.trim() !== '');
                    if (row.includes('---')) return null; // Skip markdown separator row
                    return (
                      <tr key={`tr-${rIndex}`}>
                        {cells.map((cell, cIndex) => (
                          <td 
                            key={`td-${cIndex}`} 
                            className={`p-2 border border-samurai-paper/20 ${rIndex === 0 ? 'font-bold bg-samurai-indigo/50 text-samurai-gold' : 'text-sm'}`}
                          >
                            {cell.trim()}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
          inTable = false;
          tableRows = [];
        }
        parsedContent.push(<span key={`text-${index}`}>{line}<br/></span>);
      }
    });

    if (inTable) {
      // Handle table at the very end of the message
       parsedContent.push(
            <div key="table-end" className="my-4 overflow-x-auto">
              <table className="w-full text-left border-collapse border border-samurai-paper/20">
                <tbody className="divide-y divide-samurai-paper/20 bg-samurai-ink/50">
                  {tableRows.map((row, rIndex) => {
                    const cells = row.split('|').filter(c => c.trim() !== '');
                    if (row.includes('---')) return null;
                    return (
                      <tr key={`tr-end-${rIndex}`}>
                        {cells.map((cell, cIndex) => (
                          <td 
                            key={`td-end-${cIndex}`} 
                            className={`p-2 border border-samurai-paper/20 ${rIndex === 0 ? 'font-bold bg-samurai-indigo/50 text-samurai-gold' : 'text-sm'}`}
                          >
                            {cell.trim()}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
    }
    return parsedContent;
  }
  return content;
};

export default function NextGenIndustryTool({ nickname }) {
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
        content: `こんにちは！次世代産業の有望性の解説や関連企業を紹介します。\n\n${nickname}さん、気になる『ビジネスに関連するキーワード』（例：半導体、AI、宇宙産業、全固体電池など）を下のチャット欄に入力してくださいね。`
      }
    ]);
  };

  const clearChat = () => {
    setIsStarted(false);
    setMessages([]);
    setInput("");
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInputText = input.trim();
    
    if (userInputText === "戻る") {
      clearChat();
      return;
    }

    const userMessage = { role: "user", content: userInputText };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-industry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          nickname
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from API");
      }

      const data = await response.json();
      
      setMessages([...newMessages, { role: "model", content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...newMessages, 
        { role: "model", content: "申し訳ござらん。通信に失敗したようだ。もう一度試してくれ。" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto justify-center">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-samurai-crimson tracking-wider mb-2 flex items-center justify-center gap-2 drop-shadow-[0_0_8px_rgba(225,29,72,0.4)]">
            <Zap className="text-samurai-crimson" />
            次世代産業解説の陣
          </h2>
          <p className="text-samurai-paper/60 text-sm">
            {nickname} 殿、投資家視点で産業の旨味を紐解く準備ができたら、出陣ボタンを押されよ。
          </p>
        </div>

        <div className="bg-samurai-ink/40 border border-samurai-crimson/20 rounded-lg p-6 flex flex-col gap-6">
          <button
            onClick={handleStart}
            className="w-full py-3 rounded bg-samurai-crimson text-white font-bold tracking-widest hover:bg-rose-600 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.3)]"
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
        <h2 className="text-lg font-bold text-samurai-crimson flex items-center gap-2 drop-shadow-[0_0_4px_rgba(225,29,72,0.4)]">
          <Zap className="text-samurai-crimson w-5 h-5" />
          次世代産業解説の陣
        </h2>
        <button 
          onClick={clearChat}
          className="text-xs text-samurai-paper/50 hover:text-samurai-crimson transition-colors"
        >
          別のキーワードで探す
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide flex flex-col">
        {messages.map((msg, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[90%] rounded-2xl p-4 whitespace-pre-wrap text-sm leading-relaxed shadow-sm ${
                msg.role === "user" 
                  ? "bg-samurai-indigo text-samurai-paper rounded-br-none border border-samurai-paper/10" 
                  : "bg-samurai-ink text-samurai-paper/90 rounded-bl-none border border-samurai-crimson/20"
              }`}
            >
               {renderMessageContent(msg.content)}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-samurai-ink rounded-2xl p-4 rounded-bl-none border border-samurai-crimson/20 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-samurai-crimson animate-spin" />
              <span className="text-xs tracking-wider text-samurai-crimson/70">AI侍が情報を収集中...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-4 pt-4 border-t border-samurai-paper/10 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="キーワード、または「次」「はい」と入力して送信"
          className="w-full bg-samurai-ink/50 border border-samurai-paper/20 rounded-xl py-3 pl-4 pr-12 text-sm text-samurai-paper outline-none focus:border-samurai-crimson transition-colors resize-none h-14"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 bottom-6 text-samurai-crimson disabled:text-samurai-paper/30 hover:text-samurai-gold transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
