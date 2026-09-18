NOVA AI — real AI backend

1. Install Node.js 20+.
2. Run: npm install
3. Copy .env.example to .env.
4. Put your own OpenAI API key in .env. NEVER put it in public/index.html.
5. Run: npm start
6. Open http://localhost:3000

The browser calls /api/chat; the server calls the OpenAI Responses API.
You can change OPENAI_MODEL in .env if your API account has access to another model.

The current default model is GPT-5.6 Luna, selected for cost-sensitive workloads.
