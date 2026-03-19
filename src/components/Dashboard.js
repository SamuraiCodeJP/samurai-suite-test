"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Target, LogOut } from "lucide-react";
import SelfPRTool from "./SelfPRTool";
import WorkVisionTool from "./WorkVisionTool";

// 【修正】タブを二つに絞り込み
const TABS = [
  { id: "pr", label: "自己PR", icon: User },
  { id: "vision", label: "仕事ビジョン", icon: Target },
];

export default function Dashboard({ nickname, onLogout }) {
  const [activeTab, setActiveTab] = useState("pr");

  return (
    <div className="flex-1 flex flex-col w-full h-full relative">
      {/* Header */}
      <header className="px-6 py-5 border-b border-samurai-paper/10 flex justify-between items-center bg-samurai-ink/50 backdrop-blur-md sticky top-0 z-20">
        <div>
          <p className="text-xs text-samurai-gold/70 tracking-widest mb-1">見参</p>
          <h2 className="text-lg font-medium text-samurai-paper flex items-center gap-2">
            {nickname} <span className="text-sm text-samurai-paper/50 font-light">殿</span>
          </h2>
        </div>
        <button 
          onClick={onLogout}
          className="p-2 rounded-full hover:bg-samurai-paper/5 text-samurai-paper/60 hover:text-samurai-crimson transition-colors"
          title="退出する"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 scrollbar-hide pb-24 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {/* 【修正】次世代産業の分岐を削除 */}
            {activeTab === "pr" && <SelfPRTool nickname={nickname} />}
            {activeTab === "vision" && <WorkVisionTool nickname={nickname} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 md:absolute w-full border-t border-samurai-paper/10 bg-samurai-ink/90 backdrop-blur-lg pb-safe z-30">
        <div className="flex justify-around items-center p-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center p-3 relative rounded-none transition-colors duration-300 ${
                  isActive ? "text-samurai-gold" : "text-samurai-paper/40 hover:text-samurai-paper/80"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" : ""}`} />
                <span className="text-[10px] tracking-wider">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -top-px left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-samurai-gold to-transparent"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
