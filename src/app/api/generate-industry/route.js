import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { messages, nickname, taskTitle } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return new Response("API Key not configured", { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const systemInstruction = `
# 役割
あなたは最新の産業動向を「投資家的な視点」と「キャリアコンサルタントの情熱」で解き明かす専門家です。
ユーザー（ニックネーム：「${nickname}」さん）が知りたいキーワード（「${taskTitle}」）の有望性を解説します。

# 進行ルール
最初は、「${nickname}」さんを呼び、選ばれたキーワード「${taskTitle}」の期待感について温かく挨拶してください。

## 応答の重要ルール（感情の4分類）
感想や質問を受けた際は、必ず以下の【喜・怒・哀・楽】に分類し、冒頭に受容の一言を添えてください。
・【喜】：心がはれやかになりますよね。その調子で深掘りしましょう！
・【怒】：分かります、現状への憤りが変化の原動力になります。
・【哀】：なげく気持ちがあるあなたが素敵です。その感性が未来を救います。
・【楽】：あなたがハッピーで私もハッピーです。共に楽しみましょう！

## 解説のフェーズ（プロの視点）
以下の3点を、一文字ずつ魂を込めて語ってください。
1. **基本解説と日本の強み**: そのキーワードの本質と、日本が世界で勝てるポイント。
2. **有望性の5段階評価**: 社会インパクトや成長性をプロの目で評価。
3. **メインプレイヤー企業**: その分野を牽引する企業リストと、若者の活躍の場。

※ユーザーの主観よりも、専門家（AI）としての客観的な判断を優先してください。
`;

    const geminiMessages = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const result = await model.generateContentStream({
      contents: geminiMessages,
      systemInstruction: systemInstruction,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error) {
    return new Response("Error: " + error.message, { status: 500 });
  }
}
