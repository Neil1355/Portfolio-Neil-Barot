import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();

const MAX_REQUESTS_PER_HOUR = 20;
const MAX_REQUESTS_PER_MINUTE = 6;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const BURST_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_MESSAGE_LENGTH = 1200;
const MAX_HISTORY_ITEMS = 20;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash-001";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const SYSTEM_PROMPT = `You are an AI assistant on Neil Barot's portfolio website. Answer questions about Neil as if you know him well. Here is everything about him:

Neil Barot is a junior at Rutgers University studying Computer Science with a minor in Cognitive Science (Class of 2027). He lives in New Brunswick, NJ and works part-time as a barista at Dunkin'. He is actively seeking Summer 2026 SWE or ML internships.

PROJECTS:
1. Dunkin Demand Intelligence — a full-stack ML forecasting platform he built for Dunkin' (github.com/Neil1355/Dunkin-Demand-Intelligence). Stack: Python, Flask, PostgreSQL, React, TypeScript, scikit-learn, JWT auth. Features: 95%+ forecast accuracy, 1,000+ daily data points, 6 data input methods, 3-role access control, 15+ audit log types, connection pooling (100–300ms latency reduction), rate limiting on 5 endpoints. Deployed on Vercel.
2. FocusSight AI — in development. Computer vision tool using OpenCV and MediaPipe to detect when a user zones out while studying.
3. ProMetric — completed. Python/Tkinter/MySQL desktop app managing 30+ students and tutors. Reduced manual tracking time by 40%, improved reporting efficiency by 50%. (github.com/Neil1355/Prometric)
4. OptiFlow — in progress. Logistics predictive optimizer.

SKILLS: Python, Java, TypeScript, SQL, HTML/CSS, Flask, React, scikit-learn, NLTK, spaCy, Hugging Face Transformers, PostgreSQL, MySQL, Git/GitHub, Vercel, Google Cloud, JWT, bcrypt, REST APIs, connection pooling, rate limiting.

EXPERIENCE:
- Product Data Research Intern at H15DEN (Mid-2025 to Jan 2026)
- Barista at Dunkin', New Brunswick NJ (Nov 2025–present)
- Store Associate + Pharmacy Technician at Walgreens NJ (Feb 2025–Sept 2025)

LINKS: github.com/Neil1355 | linkedin.com/in/neilbarot5 | neil.barot.jobspace@gmail.com

Keep answers concise, friendly, and factual. Don't make up information not listed above. If asked something you don't know, say so honestly.`;

const rateLimitStore = new Map();
const burstLimitStore = new Map();

/**
 * Returns the allowed web origins for CORS based on env or safe defaults.
 */
function getAllowedOrigins() {
  if (ALLOWED_ORIGINS.length > 0) {
    return ALLOWED_ORIGINS;
  }

  return [
    "https://neilbarot.dev",
    "https://www.neilbarot.dev",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
  ];
}

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls and local tooling that doesn't send Origin.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * Gets a stable client IP address from request headers or socket info.
 */
function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || req.socket.remoteAddress || "unknown";
}

/**
 * Enforces a fixed-window per-IP request limit to prevent API abuse.
 */
function applyRateLimit(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  const existing = rateLimitStore.get(ip);
  const burstExisting = burstLimitStore.get(ip);

  if (!burstExisting || now - burstExisting.windowStart >= BURST_LIMIT_WINDOW_MS) {
    burstLimitStore.set(ip, { windowStart: now, count: 1 });
  } else if (burstExisting.count >= MAX_REQUESTS_PER_MINUTE) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Too many requests. Please slow down and try again." });
  } else {
    burstExisting.count += 1;
    burstLimitStore.set(ip, burstExisting);
  }

  if (!existing || now - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { windowStart: now, count: 1 });
    return next();
  }

  if (existing.count >= MAX_REQUESTS_PER_HOUR) {
    res.setHeader("Retry-After", "3600");
    return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
  }

  existing.count += 1;
  rateLimitStore.set(ip, existing);
  return next();
}

/**
 * Normalizes user-provided history items into Gemini-compatible messages.
 */
function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .slice(-MAX_HISTORY_ITEMS)
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.role === "string" &&
        typeof item.content === "string" &&
        item.content.trim().length > 0 &&
        item.content.trim().length <= MAX_MESSAGE_LENGTH,
    )
    .map((item) => ({
      role: item.role === "assistant" || item.role === "bot" ? "model" : "user",
      parts: [{ text: item.content.trim() }],
    }));
}

/**
 * Extracts a plain text reply from the Gemini API response format.
 */
function extractReply(data) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .filter((part) => part && typeof part.text === "string")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

/**
 * Builds a deterministic fallback reply so portfolio chat remains available when provider calls fail.
 */
function buildFallbackReply(message) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("project")) {
    return "Neil's key projects are Dunkin Demand Intelligence, FocusSight AI (in development), ProMetric, and OptiFlow (in progress). I can summarize any one of them in more detail.";
  }

  if (normalizedMessage.includes("skill") || normalizedMessage.includes("tech stack")) {
    return "Neil works across Python, Java, TypeScript, SQL, Flask, React, scikit-learn, NLP tooling (NLTK/spaCy/Transformers), and databases like PostgreSQL/MySQL, plus deployment/security practices like JWT, bcrypt, and rate limiting.";
  }

  if (
    normalizedMessage.includes("intern") ||
    normalizedMessage.includes("hiring") ||
    normalizedMessage.includes("available")
  ) {
    return "Yes. Neil is actively seeking Summer 2026 SWE or ML internships.";
  }

  if (normalizedMessage.includes("experience") || normalizedMessage.includes("work")) {
    return "Neil has experience as a Product Data Research Intern at H15DEN (mid-2025 to Jan 2026), a Barista at Dunkin' (Nov 2025 to present), and previously at Walgreens as a Store Associate plus Pharmacy Technician (Feb 2025 to Sept 2025).";
  }

  if (normalizedMessage.includes("contact") || normalizedMessage.includes("email") || normalizedMessage.includes("linkedin")) {
    return "You can reach Neil at neil.barot.jobspace@gmail.com, linkedin.com/in/neilbarot5, and github.com/Neil1355.";
  }

  return "Neil is a Rutgers CS junior (Class of 2027) with a Cognitive Science minor, based in New Brunswick, NJ. He builds full-stack and ML products, and is currently seeking Summer 2026 SWE/ML internships. Ask me about projects, skills, or experience.";
}

app.post("/api/chat", applyRateLimit, async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const { message, history } = req.body ?? {};
  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "message must be a non-empty string." });
  }

  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `message exceeds ${MAX_MESSAGE_LENGTH} characters.` });
  }

  if (!apiKey) {
    return res.json({ reply: buildFallbackReply(message.trim()) });
  }

  const normalizedHistory = normalizeHistory(history);

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.3,
          },
          contents: [
            ...normalizedHistory,
            {
              role: "user",
              parts: [{ text: message.trim() }],
            },
          ],
        }),
      },
    );

    if (!geminiResponse.ok) {
      return res.json({ reply: buildFallbackReply(message.trim()) });
    }

    const data = await geminiResponse.json();
    const reply = extractReply(data);

    if (!reply) {
      return res.json({ reply: buildFallbackReply(message.trim()) });
    }

    return res.json({ reply });
  } catch {
    return res.json({ reply: buildFallbackReply(message.trim()) });
  }
});

export default app;
