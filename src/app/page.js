"use client";

import { useState } from "react";
import NicknameInput from "@/components/NicknameInput";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  // 1. ニックネームを保持する「変数」を用意
  const [nickname, setNickname] = useState("");

  // 2. まだ名が決まっていない場合は、入力画面（NicknameInput）を表示
  if (!nickname) {
    return (
      <main className="min-h-screen bg-samurai-ink flex items-center justify-center">
        <NicknameInput onStart={(name) => setNickname(name)} />
      </main>
    );
  }

  // 3. 名が決まったら、全機能が詰まった Dashboard を表示
  // ここで渡した nickname が、各ツールの「〇〇殿」という呼びかけに変わる
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Dashboard 
        nickname={nickname} 
        onLogout={() => setNickname("")} 
      />
    </div>
  );
}
