import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'GuideNer AI Life OS', time: new Date().toISOString() });
  });

  // Gemini AI Chat Proxy Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(200).json({
          status: 'offline_fallback',
          message: 'Gemini API key is not configured. Falling back to local offline AI companion engine.',
        });
      }

      const { prompt, persona = 'friendly', history = [], systemInstruction } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      const personaPrompts: Record<string, string> = {
        friendly: 'You are GuideNer AI, a warm, encouraging, empathetic, and supportive life companion.',
        professional: 'You are GuideNer AI, a structured, concise, objective, and efficient professional assistant.',
        strict: 'You are GuideNer AI, a high-accountability, zero-excuse disciplinarian and goal coach.',
        minimal: 'You are GuideNer AI, a minimalist assistant providing bulleted facts only.',
      };

      const baseInstruction = systemInstruction ||
        `${personaPrompts[persona] || personaPrompts.friendly} You assist the user with life planning, study concepts, daily routines, wellness, and goals. Always give practical, structured, and helpful advice.`;

      // Use gemini-2.5-flash for general fast interaction
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...history.map((h: { role: string; text: string }) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
          })),
          { role: 'user', parts: [{ text: prompt }] },
        ],
        config: {
          systemInstruction: baseInstruction,
          temperature: persona === 'strict' ? 0.3 : 0.7,
        },
      });

      const replyText = response.text || 'I analyzed your request and updated your Life OS goals.';

      return res.json({
        status: 'success',
        reply: replyText,
      });
    } catch (error: any) {
      console.error('Gemini API Error:', error?.message || error);
      return res.status(200).json({
        status: 'offline_fallback',
        error: error?.message || 'Server AI processing error',
      });
    }
  });

  // AI Guided Mode Dynamic Explanation Endpoint
  app.post('/api/ai/guidance', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { screenId, featureKey, mode = 'beginner', baseExplanation } = req.body;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.json({ status: 'offline', explanation: baseExplanation });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are GuideNer AI Guided Assistant. Generate a structured JSON guidance for feature "${featureKey}" on screen "${screenId}" at "${mode}" level.
Return strictly a JSON object with keys "title", "whatItDoes", "whyUseful", "whatHappensNext". No extra text.
Base context: ${JSON.stringify(baseExplanation || {})}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ status: 'success', explanation: parsed });
      }

      return res.json({ status: 'fallback', explanation: baseExplanation });
    } catch (e) {
      return res.json({ status: 'fallback', explanation: req.body.baseExplanation });
    }
  });

  // Vite Middleware for Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GuideNer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
