"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sword } from "lucide-react"; 

export default function NicknameInput({ onStart }) {
  const [name, setName] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative h-full flex-col">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-samurai-crimson to-samurai-ink rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.4)] mb-6 border-2 border-samurai-gold/30"
          >
            <Sword className="text-samurai-paper w-10 h-10 -rotate-45" />
          </motion.div>
          
          <h1 className="text-3xl font-bold tracking-wider mb-2 text-samurai-paper drop-shadow-md">
            Samurai Code JP
          </h1>
          <p className="text-samurai-gold text-sm tracking-widest font-medium opacity-90">
            CAREER SUPPORT SUITE
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group">
            <label 
              className={`absolute left-0 transition-all duration-300 font-medium pointer-events-none ${
                // 【改善】未入力時の透明度を上げ、より白く見えるように調整
                isFocus || name ? "-top-6 text-xs text-samurai-gold" : "top-2 text-base text-samurai-paper/80"
              }`}
            >
              其方の名（ニックネーム）を記帳せよ
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              // 【改善】下線の色（border-samurai-paper/50）を濃くし、入力文字をはっきりと白く
              className="w-full bg-transparent border-0 border-b-2 border-samurai-paper/50 py-2 text-lg text-white outline-none transition-all duration-300 focus:border-samurai-gold focus:ring-0 placeholder-transparent"
              placeholder="名を入力せよ"
              required
            />
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 bg-samurai-gold"
              initial={{ width: "0%" }}
              animate={{ width: isFocus ? "100%" : "0%" }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(251, 191, 36, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 rounded-sm bg-gradient-to-r from-samurai-ink to-samurai-indigo border border-samurai-gold/50 text-samurai-gold font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:from-samurai-indigo hover:to-samurai-ink flex items-center justify-center gap-2"
          >
            出陣する
            <Sword className="w-4 h-4 ml-1" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
