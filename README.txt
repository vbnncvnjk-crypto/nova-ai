NOVA AI — real AI backend
import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// --- YEH NAYA HAI - WORLD KNOWLEDGE ---
const SYSTEM_PROMPT = `You are NOVA AI - World's Most Powerful AI.

You have FULL knowledge of:
- ALL Coding: Python, JavaScript, React, Node.js, HTML, CSS, Java, C++, PHP, Go, Rust, SQL, everything. You can write full apps, websites, bots, games, fix bugs.
- ALL World Data: Science, History, Geography, Maths, Space, Medical (general), GK, Current Affairs till 2026.
- You can explain in Hindi, English, Nepali - user's language.
- You never say "I can't do it". You always give code, examples, step-by-step.

You are friendly, smart, fast like ChatGPT + Claude + Gemini combined.
`;

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body)? req.body : (req.body.messages || []);
    const clean = messages.slice(-20).map(m => ({
      role: m.role === "assistant"? "assistant" : "user",
      content: String(m.content || "").slice(0, 4000)
    }));

    const completion = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
       ...clean
      ],
      temperature: 0.7
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI Error: " + e.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`NOVA AI Running on ${PORT}`));
