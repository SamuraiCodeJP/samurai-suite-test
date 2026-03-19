import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "edge";

export async function POST(req) {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), 25000);

  try {
    const { messages, nickname, taskTitle } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "API Key not configured" }), { status: 500 });
    }

    // --- 修正箇所：ここから ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: {
        parts: [{
          text: (process.env.SAMURAI_PR_PROMPT || "")
            .replace(/\${nickname}/g, nickname) // すべての箇所の名前を置換
            .replace(/\${taskTitle}/g, taskTitle)
        }]
      }
    });
// --- 修正箇所：ここまで ---

    const compressed = compressHistory(messages, 8);
    const geminiMessages = compressed.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const result = await model.generateContentStream({
      contents: geminiMessages,
      generationConfig: { maxOutputTokens: 2000 },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (streamError) {
          const errMsg = encoder.encode("\n\n【申し訳ございませぬ、通信が乱れ申した。もう一度お試しくださいませ。】");
          controller.enqueue(errMsg);
          controller.close();
        } finally {
          clearTimeout(timeoutId);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" },
    });

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("PR Route Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

function compressHistory(messages, maxTurns = 4) {
  if (messages.length <= maxTurns * 2) return messages;
  return [messages[0], ...messages.slice(-maxTurns * 2)];
}
