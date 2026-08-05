var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "10mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "GuideNer AI Life OS", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(200).json({
          status: "offline_fallback",
          message: "Gemini API key is not configured. Falling back to local offline AI companion engine."
        });
      }
      const { prompt, persona = "friendly", history = [], systemInstruction } = req.body;
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const personaPrompts = {
        friendly: "You are GuideNer AI, a warm, encouraging, empathetic, and supportive life companion.",
        professional: "You are GuideNer AI, a structured, concise, objective, and efficient professional assistant.",
        strict: "You are GuideNer AI, a high-accountability, zero-excuse disciplinarian and goal coach.",
        minimal: "You are GuideNer AI, a minimalist assistant providing bulleted facts only."
      };
      const baseInstruction = systemInstruction || `${personaPrompts[persona] || personaPrompts.friendly} You assist the user with life planning, study concepts, daily routines, wellness, and goals. Always give practical, structured, and helpful advice.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          ...history.map((h) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          })),
          { role: "user", parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: baseInstruction,
          temperature: persona === "strict" ? 0.3 : 0.7
        }
      });
      const replyText = response.text || "I analyzed your request and updated your Life OS goals.";
      return res.json({
        status: "success",
        reply: replyText
      });
    } catch (error) {
      console.error("Gemini API Error:", error?.message || error);
      return res.status(200).json({
        status: "offline_fallback",
        error: error?.message || "Server AI processing error"
      });
    }
  });
  app.post("/api/ai/guidance", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { screenId, featureKey, mode = "beginner", baseExplanation } = req.body;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({ status: "offline", explanation: baseExplanation });
      }
      const ai = new import_genai.GoogleGenAI({ apiKey });
      const prompt = `You are GuideNer AI Guided Assistant. Generate a structured JSON guidance for feature "${featureKey}" on screen "${screenId}" at "${mode}" level.
Return strictly a JSON object with keys "title", "whatItDoes", "whyUseful", "whatHappensNext". No extra text.
Base context: ${JSON.stringify(baseExplanation || {})}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });
      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ status: "success", explanation: parsed });
      }
      return res.json({ status: "fallback", explanation: baseExplanation });
    } catch (e) {
      return res.json({ status: "fallback", explanation: req.body.baseExplanation });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GuideNer server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
