"use client";

import { useState } from "react";
import { LogOut, Sword, Shield, ScrollText } from "lucide-react";
import WorkVisionTool from "./WorkVisionTool";
import SelfPRTool from "./SelfPRTool";

export default function Dashboard({ nickname, onLogout }) {
  const [activeTool, setActiveTool] = useState(null);

  // 門（ツール）の定義：ここから「次世代産業」を除外しました
  const tools = [
    {
      id: "vision",
      title: "仕事ビジョンの陣",
      description: "其方の歩むべき道を、侍と共に照らし出さん。",
      icon: <Sword className="w-8 h-8 text-samurai-crimson" />,
      component: <WorkVisionTool nickname={nickname} />,
    },
    {
      id: "selfpr",
      title: "自己PR作成の陣",
      description: "其方の武功を、見事な文（ふみ）に仕立て上げよう。",
      icon: <ScrollText className="w-8 h-8 text-samurai-gold" />,
      component: <SelfPRTool nickname={nickname} />,
    },
  ];

  if (activeTool) {
    const tool = tools.find((t) => t.id === activeTool);
    return (
      <div className="flex flex-col h-screen bg-samurai-indigo text-samurai-paper">
        <header className="p-4 border-b border-samurai-paper/10 flex justify-between items-center bg-samurai-ink/50">
          <button 
            onClick={() => setActiveTool(null)}
            className="text-samurai-gold hover:text-samurai-paper transition-colors flex items-center gap-2"
          >
            ← 陣に戻る
          </button>
          <h1 className="text-lg font-bold tracking-widest text-samurai-gold">{tool.title}</h1>
          <div className="w-20"></div>
        </header>
        <main className="flex-1 overflow-hidden p-4 md:p-8 max-w-4xl mx-auto w-full">
          {tool.component}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-samurai-ink text-samurai-paper flex flex-col p-6 md:p-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-samurai-gold tracking-tighter mb-2">SAMURAI CAREER SUITE</h1>
          <p className="text-samurai-paper/60 tracking-widest">{nickname} 殿、御免！</p>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 rounded-full hover:bg-samurai-paper/10 text-samurai-paper/40 hover:text-samurai-crimson transition-all"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className="group relative bg-samurai-indigo/30 border border-samurai-paper/10 rounded-2xl p-8 text-left hover:border-samurai-gold/50 transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
          >
            <div className="mb-6 bg-samurai-ink p-4 rounded-xl inline-block group-hover:scale-110 transition-transform">
              {tool.icon}
            </div>
            <h2 className="text-xl font-bold text-samurai-gold mb-3 tracking-widest">{tool.title}</h2>
            <p className="text-sm text-samurai-paper/60 leading-relaxed">{tool.description}</p>
            <div className="mt-8 flex items-center text-xs font-bold text-samurai-gold tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
              いざ、参る <span className="ml-2">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
