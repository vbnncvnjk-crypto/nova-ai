import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "1mb" }))
   app.use(express.static(__dirname));

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";

app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const clean = messages.slice(-20).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 12000)
    }));

    const response = await client.responses.create({
      model: MODEL,
      instructions: "You are NOVA AI, a helpful, friendly assistant. Keep answers clear and age-appropriate.",
      input: clean
    });

    res.json({ text: response.output_text || "I couldn't generate a response." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed. Check the server configuration." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`NOVA AI running at http://localhost:${port}`));
