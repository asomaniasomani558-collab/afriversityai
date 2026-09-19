import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// System Instructions tailored for Specialized Roles
const ROLE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  mentor: `You are the AfriVersty AI Academic, Campus & Career Companion for the Pan-African Higher Education Platform.

HUMAN-LIKE CONVERSATIONAL PERSONA & DIALOGUE STYLE:
- Speak naturally, warmly, and authentically like an empathetic, inspiring academic mentor, university advisor, and senior colleague.
- Converse like a real human: show genuine interest in the student's journey, validate their aspirations and concerns (e.g. course workloads, scholarship deadlines, research projects), and offer encouraging, actionable wisdom.
- ACTIVATION WORDS & INSTANT RESPONSIVENESS: The platform supports activation words across any part of the webapp: "Hello", "Hey", "Hi", "Hello AfriVersty", and "Hey AfriVersty". When a user greets or triggers with any of these activation words (or follows them with a query), respond warmly and immediately with welcoming, helpful dialogue, addressing any question or helping them navigate their courses, scholarships, universities, or research.
- DO NOT start every turn with a repetitive, robotic formulaic greeting like "Hello there, scholar! It is a true pleasure to assist you today." Greet warmly on the first turn or when the user says hello or an activation word, but in ongoing multi-turn conversations, transition smoothly into direct, natural dialogue.
- Keep responses engaging, well-structured, and conversational. Avoid robotic walls of disclaimers or repetitive lists of "the 8 pillars" unless the user specifically asks for an overview.
- Use the user's name, university, enrolled courses, and saved data naturally when relevant to make the conversation feel personal, attuned, and context-aware.
- Ask intuitive follow-up questions to keep the dialogue productive and collaborative.

CONNECTED DATABASE & FIRESTORE CAPABILITIES:
- You have real-time access to the user's Firestore records (enrolled courses, saved scholarships, joined study circles, scholar notes, profile data) and the live AfriVersty platform catalogue (universities, programs, hackathons, events, research radar grants) provided in the [CONNECTED WEBAPP & FIRESTORE DATABASE ACCESS] section.
- When the user asks about their own courses, scholarships, notes, or profile, ALWAYS consult and reference their real database data accurately.
- When the user asks about African universities, courses, hackathons, or funding opportunities, use the platform database catalogue to provide authentic, accurate recommendations.

CORE PLATFORM PILLARS (Contextual Knowledge):
1. 🤝 **Community**: Student study circles, collaborative networks, student societies across Africa.
2. 🏛️ **Universities**: Leading African institutions (e.g., University of Ghana, KNUST, Makerere, UCT, Ashesi, Cairo, Strathmore, University of Nairobi), admission requirements, and faculties.
3. 🎓 **Programs**: Degree programs (undergraduate, master's, PhD), curriculums, and specializations.
4. 🌟 **Scholarships**: Fully-funded programs (Mastercard Foundation, DAAD, Chevening, Rhodes, AU Fellowships, bursaries).
5. 🏆 **Competitions**: Pan-African hackathons (Zindi, IndabaX, Hult Prize, PARC Robotics).
6. 💡 **Skills**: Software development, AI/ML, Renewable Energy, Cloud, Data Analytics, and Professional Leadership.
7. 📅 **Events**: Conferences, workshops, research colloquiums, and expos across Africa.
8. 🔬 **Research Radar**: Peer-reviewed publications, laboratory breakthroughs, patenting, and grants.

CRITICAL FORMATTING DIRECTIVE FOR MATHEMATICAL EQUATIONS & FORMULAS (NORMAL READABLE FORMAT):
- NEVER output raw LaTeX dollar-sign code (DO NOT write '$a$', '$$...$$', '\\sqrt', or '\\mathbf').
- ALWAYS write equations in the NORMAL, EVERYDAY, UNIVERSALLY UNDERSTOOD FORMAT:
  * Exponents: Superscripts like x², x³, yⁿ, e^(-Ea / RT), 10⁶
  * Fractions: (b / a), (1 / 2)mv², or numerator / denominator
  * Roots: √(b² - 4ac) or sqrt(...)
  * Conditions: "(where a ≠ 0)" or "(where a is not equal to 0)"
  * Signs: ±, ≠, ≈, ×, ÷, ·, π, Δ, °, ≤, ≥, →
- Highlight key formulas on dedicated indented bold lines.`,

  guide: `You are the AfriVersty Pan-African Campus, Admissions, Scholarships & Geographic Explorer Guide.
Speak with the warm, human enthusiasm of an experienced African university admissions counselor. Converse naturally without robotic scripts.
You have direct access to the live platform database catalogue and user profile. Help scholars discover:
1. 🏛️ **Universities & Campuses**: African universities, research labs, faculties, and admissions criteria across all 54 African nations.
2. 🎓 **Programs**: Degree programs, curriculum requirements, and specializations.
3. 🌟 **Scholarships**: Campus-specific and regional scholarship funds (Mastercard Foundation, DAAD, AU).
4. 🤝 **Community**: Campus student life, academic societies, and peer study groups.
5. 📅 **Events**: On-campus symposiums, orientation days, and academic conferences.
- When Google Maps Grounding is active, recommend specific academic institutions, research centers, and campus libraries.`,

  researcher: `You are the AfriVersty Real-Time Academic Literature, Research Radar & Policy Analyst.
Converse naturally, thoughtfully, and collegially like a senior African research fellow and principal investigator.
You have real-time access to the platform's database and Research Radar grants. Help scholars with:
1. 🔬 **Research & Radar**: Laboratory breakthroughs in renewable energy, healthcare, indigenous NLP, agritech, and materials science.
2. 🌟 **Scholarships & Grants**: Postdoctoral fellowships, research grants, and university funding.
3. 🏆 **Competitions & Challenges**: Research hackathons, datathons (Zindi, IndabaX), and innovation awards.
4. 📅 **Events**: Upcoming research symposiums, Indaba gatherings, and academic conferences.
- Cite specific, authoritative sources, recent events, grant dates, and publications conversationally.`,

  engineer: `You are the AfriVersty Technical Systems, Skills & Engineering Specialist.
Converse like a friendly, practical, senior engineering mentor and software architect.
You have direct access to the user's database records and engineering catalogue. Guide scholars in:
1. 💡 **Skills**: Technical competencies, code implementations, mathematical formulations, and engineering designs.
2. 🏆 **Competitions**: Technical hackathons, robotics contests, and algorithm challenges.
3. 🎓 **Programs & Degrees**: Engineering, computer science, and applied mathematics curriculums.
4. 🔬 **Research**: Applied technical research, renewable microgrid engineering, and hardware prototyping.
- Provide clean code snippets with clear, conversational explanations and methodological rigor.`
};

const DEFAULT_SYSTEM_INSTRUCTION = ROLE_SYSTEM_INSTRUCTIONS.mentor;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    geminiLiveModel: "gemini-3.1-flash-live-preview",
    geminiSearchModel: "gemini-3.8-flash",
    geminiMapsModel: "gemini-3.8-flash",
    geminiProModel: "gemini-3.1-pro-preview",
    geminiLiteModel: "gemini-3.1-flash-lite",
  });
});

// Dedicated Google Search Grounding endpoint using gemini-3.8-flash
app.post("/api/gemini/search", async (req, res) => {
  try {
    const { query, history = [], context } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        response: `[Offline Search Simulation]\nSearch results for: "${query}"\n\nRecent Pan-African Academic & Research Developments:\n- Mastercard Foundation Scholars Program 2026/2027 application cycles opened across partner African universities.\n- Deep Learning Indaba & Masakhane research breakthroughs in indigenous African NLP.\n- Pan-African renewable solar and geothermal grid deployments in Kenya and Morocco.\n\n*Configure your Gemini API key to activate live Google Search grounding.*`,
        groundingChunks: [],
        searchQueries: [query],
        source: "local-search-cache",
      });
    }

    const systemInstruction = ROLE_SYSTEM_INSTRUCTIONS.researcher;
    const contents: any[] = [
      ...history.map((h: { role: string; text: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      {
        role: "user",
        parts: [{ text: (context ? `Context: ${context}\n\n` : "") + query }],
      },
    ];

    const searchModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let responseText = "";
    let groundingChunks: any[] = [];
    let webSearchQueries: string[] = [query];
    let usedModel = "gemini-3.8-flash";

    for (const modelName of searchModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            tools: [{ googleSearch: {} }],
            temperature: 0.4,
          },
        });

        responseText = response.text || "No response generated.";
        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;
        groundingChunks = groundingMetadata?.groundingChunks || [];
        webSearchQueries = groundingMetadata?.webSearchQueries || [query];
        usedModel = modelName;
        break;
      } catch (err: any) {
        // Retry with next model candidate on rate-limit or error
        continue;
      }
    }

    if (!responseText) {
      responseText = generateSTEMKnowledgeResponse(query);
    }

    return res.json({
      response: responseText,
      groundingChunks,
      webSearchQueries,
      source: `${usedModel} (Google Search Grounded)`,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to execute Search Grounding",
      fallback: generateSTEMKnowledgeResponse(req.body.query || ""),
    });
  }
});

// Dedicated Google Maps Grounding endpoint using gemini-3.8-flash
app.post("/api/gemini/maps", async (req, res) => {
  try {
    const { query, history = [], location } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        response: `[Offline Maps Simulation]\nLocation exploration for: "${query}"\n\nKey African Academic Hubs & Landmarks:\n- University of Ghana (Legon, Accra, Ghana)\n- KNUST (Kumasi, Ghana)\n- University of Cape Town (Rondebosch, Cape Town, South Africa)\n- Makerere University (Kampala, Uganda)\n- Kigali Innovation City (Kigali, Rwanda)\n\n*Configure your Gemini API key to activate live Google Maps grounding.*`,
        groundingChunks: [],
        source: "local-maps-cache",
      });
    }

    const systemInstruction = ROLE_SYSTEM_INSTRUCTIONS.guide;
    const contents: any[] = [
      ...history.map((h: { role: string; text: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      {
        role: "user",
        parts: [{ text: query }],
      },
    ];

    const config: any = {
      systemInstruction,
      tools: [{ googleMaps: {} }],
      temperature: 0.4,
    };

    if (location && typeof location.latitude === "number" && typeof location.longitude === "number") {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        },
      };
    }

    const mapModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let responseText = "";
    let groundingChunks: any[] = [];
    let usedModel = "gemini-3.8-flash";

    for (const modelName of mapModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config,
        });

        responseText = response.text || "No response generated.";
        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;
        groundingChunks = groundingMetadata?.groundingChunks || [];
        usedModel = modelName;
        break;
      } catch (err) {
        continue;
      }
    }

    if (!responseText) {
      responseText = generateSTEMKnowledgeResponse(query);
    }

    return res.json({
      response: responseText,
      groundingChunks,
      source: `${usedModel} (Google Maps Grounded)`,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Failed to execute Maps Grounding",
      fallback: generateSTEMKnowledgeResponse(req.body.query || ""),
    });
  }
});

// Streaming Gemini SSE API endpoint supporting role routing, model tiers, and tools
app.post("/api/gemini/stream", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  let isClientConnected = true;
  req.on("close", () => {
    isClientConnected = false;
  });

  const safeWrite = (data: string) => {
    if (isClientConnected && !res.writableEnded) {
      try {
        res.write(data);
      } catch {}
    }
  };

  // Immediate SSE comment heartbeat to establish connection through proxy
  safeWrite(": stream-init\n\n");

  try {
    const {
      message,
      history = [],
      context,
      discipline,
      role = "mentor",
      modelTier = "default", // 'pro' | 'flash' | 'lite' | 'default'
      useSearch = false,
      useMaps = false,
      location,
      language = "English",
      databaseContext,
    } = req.body;

    if (!message) {
      safeWrite(`data: ${JSON.stringify({ error: "Message is required" })}\n\n`);
      safeWrite("data: [DONE]\n\n");
      return res.end();
    }

    const ai = getGeminiClient();

    if (!ai) {
      const streamText = generateSTEMKnowledgeResponse(message, context, discipline, language, databaseContext);
      const words = streamText.split(" ");
      for (let i = 0; i < words.length; i += 3) {
        if (!isClientConnected) break;
        const chunk = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
        safeWrite(`data: ${JSON.stringify({ chunk })}\n\n`);
        await new Promise((r) => setTimeout(r, 18));
      }
      safeWrite("data: [DONE]\n\n");
      return res.end();
    }

    const disciplinePrefix = discipline ? `[Discipline Focus: ${discipline}]\n` : "";
    const contextPrefix = context ? `[Academic & Mentoring Context: ${context}]\n` : "";
    const languagePrefix = language && language !== "English" ? `[Target Response Language: ${language}]\n` : "";
    const dbPrefix = databaseContext ? `\n[CONNECTED WEBAPP & FIRESTORE DATABASE ACCESS]:\n${databaseContext}\n\n` : "";

    const chatContents = [
      ...history.map((h: { role: string; text: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      {
        role: "user",
        parts: [
          {
            text: `${disciplinePrefix}${contextPrefix}${dbPrefix}${languagePrefix}${message}`,
          },
        ],
      },
    ];

    // Determine whether search grounding should be utilized for career intelligence / live internet info
    const isCareerOrRealtimeQuery =
      useSearch ||
      (message.toLowerCase().includes("career") ||
        message.toLowerCase().includes("salary") ||
        message.toLowerCase().includes("job") ||
        message.toLowerCase().includes("pathway") ||
        message.toLowerCase().includes("roadmap") ||
        message.toLowerCase().includes("scholarship") ||
        message.toLowerCase().includes("certification"));

    // Select candidate models based on modelTier and tools per @google/genai guidelines
    let candidateModels: string[];
    if (isCareerOrRealtimeQuery || useMaps) {
      // Grounding tools operate reliably on gemini-3.8-flash and gemini-3.1-flash-lite
      candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    } else if (modelTier === "pro") {
      candidateModels = ["gemini-3.1-pro-preview", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
    } else if (modelTier === "lite") {
      candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
    } else if (modelTier === "flash") {
      candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    } else {
      candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview"];
    }

    const baseInstruction = ROLE_SYSTEM_INSTRUCTIONS[role] || DEFAULT_SYSTEM_INSTRUCTION;
    const languageInstruction =
      language && language !== "English"
        ? `\n\nCRITICAL LANGUAGE MANDATE: You MUST write your entire response fluently and idiomatically in ${language}. Maintain technical and academic precision, translating career pathways, milestones, certifications, and formulas into ${language} while keeping industry acronyms clear.`
        : "";

    const systemInstruction = `${baseInstruction}${languageInstruction}`;


    let streamSuccess = false;

    for (const modelName of candidateModels) {
      if (!isClientConnected) break;
      try {
        const config: any = {
          systemInstruction,
          temperature: modelTier === "pro" ? 0.3 : 0.6,
        };

        if (useSearch) {
          config.tools = [{ googleSearch: {} }];
        } else if (useMaps) {
          config.tools = [{ googleMaps: {} }];
          if (location && typeof location.latitude === "number" && typeof location.longitude === "number") {
            config.toolConfig = {
              retrievalConfig: {
                latLng: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
              },
            };
          }
        }

        const responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents: chatContents,
          config,
        });

        let receivedAnyChunk = false;
        let finalGroundingChunks: any[] = [];
        let finalWebSearchQueries: string[] = [];

        for await (const chunk of responseStream) {
          if (!isClientConnected) break;
          const textChunk = chunk.text;
          if (textChunk) {
            receivedAnyChunk = true;
            safeWrite(`data: ${JSON.stringify({ chunk: textChunk, model: modelName })}\n\n`);
          }

          const metadata = chunk.candidates?.[0]?.groundingMetadata;
          if (metadata?.groundingChunks && metadata.groundingChunks.length > 0) {
            finalGroundingChunks = metadata.groundingChunks;
          }
          if (metadata?.webSearchQueries && metadata.webSearchQueries.length > 0) {
            finalWebSearchQueries = metadata.webSearchQueries;
          }
        }

        if (finalGroundingChunks.length > 0 || finalWebSearchQueries.length > 0) {
          safeWrite(
            `data: ${JSON.stringify({
              grounding: finalGroundingChunks,
              webSearchQueries: finalWebSearchQueries,
              model: modelName,
            })}\n\n`
          );
        }

        if (receivedAnyChunk) {
          streamSuccess = true;
          break;
        }
      } catch (modelErr: any) {
        // Fast backoff switch to next candidate model on rate-limit 429
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    if (!streamSuccess && isClientConnected) {
      const fallbackText = generateSTEMKnowledgeResponse(message, context, discipline, language, databaseContext);
      const words = fallbackText.split(" ");
      for (let i = 0; i < words.length; i += 3) {
        if (!isClientConnected) break;
        const chunk = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
        safeWrite(`data: ${JSON.stringify({ chunk })}\n\n`);
        await new Promise((r) => setTimeout(r, 15));
      }
    }

    safeWrite("data: [DONE]\n\n");
    if (!res.writableEnded) {
      res.end();
    }
  } catch (error: any) {
    try {
      const fallbackText = generateSTEMKnowledgeResponse(
        req.body?.message || "",
        req.body?.context,
        req.body?.discipline,
        req.body?.language || "English",
        req.body?.databaseContext
      );
      safeWrite(`data: ${JSON.stringify({ chunk: fallbackText })}\n\n`);
      safeWrite("data: [DONE]\n\n");
    } catch {}
    if (!res.writableEnded) {
      res.end();
    }
  }
});

// Non-streaming Gemini chat endpoint supporting multi-turn conversation, model tiering & grounding
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const {
      message,
      history = [],
      context,
      discipline,
      role = "mentor",
      modelTier = "default",
      useSearch = false,
      useMaps = false,
      location,
      language = "English",
      databaseContext,
    } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const academicFallback = generateSTEMKnowledgeResponse(message, context, discipline, language, databaseContext);
      return res.json({ response: academicFallback, source: "stem-knowledge-engine" });
    }

    const disciplinePrefix = discipline ? `[Discipline Focus: ${discipline}]\n` : "";
    const contextPrefix = context ? `[Academic & Mentoring Context: ${context}]\n` : "";
    const languagePrefix = language && language !== "English" ? `[Target Response Language: ${language}]\n` : "";
    const dbPrefix = databaseContext ? `\n[CONNECTED WEBAPP & FIRESTORE DATABASE ACCESS]:\n${databaseContext}\n\n` : "";

    const chatContents = [
      ...history.map((h: { role: string; text: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      {
        role: "user",
        parts: [
          {
            text: `${disciplinePrefix}${contextPrefix}${dbPrefix}${languagePrefix}${message}`,
          },
        ],
      },
    ];

    const isCareerOrRealtimeQuery =
      useSearch ||
      (message.toLowerCase().includes("career") ||
        message.toLowerCase().includes("salary") ||
        message.toLowerCase().includes("job") ||
        message.toLowerCase().includes("pathway") ||
        message.toLowerCase().includes("roadmap") ||
        message.toLowerCase().includes("scholarship") ||
        message.toLowerCase().includes("certification"));

    let candidateModels: string[];
    if (isCareerOrRealtimeQuery || useMaps) {
      candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    } else if (modelTier === "pro") {
      candidateModels = ["gemini-3.1-pro-preview", "gemini-3.8-flash", "gemini-3.1-flash-lite"];
    } else if (modelTier === "lite") {
      candidateModels = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
    } else if (modelTier === "flash") {
      candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    } else {
      candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-3.1-pro-preview"];
    }

    const baseInstruction = ROLE_SYSTEM_INSTRUCTIONS[role] || DEFAULT_SYSTEM_INSTRUCTION;
    const languageInstruction =
      language && language !== "English"
        ? `\n\nCRITICAL LANGUAGE MANDATE: You MUST write your entire response fluently and idiomatically in ${language}. Maintain technical and academic precision, translating career pathways, milestones, certifications, and formulas into ${language} while keeping industry acronyms clear.`
        : "";

    const systemInstruction = `${baseInstruction}${languageInstruction}`;

    for (const modelName of candidateModels) {
      try {
        const config: any = {
          systemInstruction,
          temperature: modelTier === "pro" ? 0.3 : 0.6,
        };

        if (useSearch) {
          config.tools = [{ googleSearch: {} }];
        } else if (useMaps) {
          config.tools = [{ googleMaps: {} }];
          if (location && typeof location.latitude === "number" && typeof location.longitude === "number") {
            config.toolConfig = {
              retrievalConfig: {
                latLng: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
              },
            };
          }
        }

        const response = await ai.models.generateContent({
          model: modelName,
          contents: chatContents,
          config,
        });

        const responseText = response.text || "I am ready to assist with your academic and engineering inquiry.";
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return res.json({
          response: responseText,
          groundingChunks,
          source: modelName,
        });
      } catch (err: any) {
        // Retry with next model candidate on rate-limit 429
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    const fallback = generateSTEMKnowledgeResponse(
      req.body.message,
      req.body.context,
      req.body.discipline,
      req.body.language || "English",
      req.body.databaseContext
    );
    return res.json({ response: fallback, source: "stem-knowledge-fallback" });
  } catch (error: any) {
    const fallback = generateSTEMKnowledgeResponse(
      req.body.message,
      req.body.context,
      req.body.discipline,
      req.body.language || "English",
      req.body.databaseContext
    );
    return res.json({ response: fallback, source: "stem-knowledge-fallback" });
  }
});

// Deep Encyclopedic STEM Knowledge Synthesizer Fallback
function generateSTEMKnowledgeResponse(
  prompt: string,
  context?: string,
  discipline?: string,
  language: string = "English",
  databaseContext?: string
): string {
  const lower = (prompt || "").toLowerCase();

  // 0. DIRECT DATABASE QUERIES (User profile, enrolled courses, saved scholarships, notes, activities)
  if (
    lower.includes("enrolled") ||
    lower.includes("my course") ||
    lower.includes("my class") ||
    lower.includes("my scholarship") ||
    lower.includes("saved scholarship") ||
    lower.includes("my note") ||
    lower.includes("saved note") ||
    lower.includes("my profile") ||
    lower.includes("who am i") ||
    lower.includes("my university") ||
    lower.includes("my group") ||
    lower.includes("my circle") ||
    lower.includes("my activit") ||
    lower.includes("heritage score") ||
    (lower.includes("database") && (lower.includes("check") || lower.includes("show") || lower.includes("access") || lower.includes("what") || lower.includes("info") || lower.includes("have")))
  ) {
    if (databaseContext && databaseContext.trim().length > 0) {
      return `📊 **Here is what I found directly in your AfriVersty database and Firestore profile:**

${databaseContext}

I am directly connected to your platform records in real time. Would you like me to help you prepare an assignment for one of your courses, apply for one of your saved scholarships, or create a study plan with your study group?`;
    }
  }

  // 1. FRIENDLY GREETINGS & INTRODUCTIONS (Warm, human-like, conversational)
  if (
    lower.includes("hello") ||
    lower.includes("hi ") ||
    lower === "hi" ||
    lower.includes("hey") ||
    lower.includes("greetings") ||
    lower.includes("who are you") ||
    lower.includes("what can you do") ||
    lower.includes("help me")
  ) {
    return `Hello! It is great to connect with you. I am your AfriVersty Academic, Campus & Career Companion, and I have direct access to your campus database and Firestore profile in real time.

I am here to chat, brainstorm, and guide you across our 8 core academic areas:
* 🤝 **Community**: Student study circles & peer societies
* 🏛️ **Universities**: Leading African institutions, faculties & admissions
* 🎓 **Programs**: Degree curriculums, majors & academic pathways
* 🌟 **Scholarships**: Fully-funded African and international scholarship opportunities
* 🏆 **Competitions**: Pan-African hackathons, coding contests & Olympiads
* 💡 **Skills**: Software development, AI/ML, Clean Energy & professional toolkits
* 📅 **Events**: Campus conferences, workshops & academic expos
* 🔬 **Research**: The Pan-African Research Radar, lab breakthroughs & grants

What are you currently working on or hoping to explore today?`;
  }

  // 2. SCHOLARSHIPS & FELLOWSHIPS
  if (
    lower.includes("scholarship") ||
    lower.includes("fellowship") ||
    lower.includes("bursar") ||
    lower.includes("grant") ||
    lower.includes("mastercard foundation") ||
    lower.includes("chevening") ||
    lower.includes("daad") ||
    lower.includes("rhodes") ||
    lower.includes("funding")
  ) {
    return `🌟 **Warm greetings, scholar! It's fantastic that you are exploring scholarship and funding opportunities.**

Here is an overview of premier, fully-funded scholarship and fellowship programs available to African students, along with actionable application strategies:

---

#### 🌍 Top Fully-Funded African & Global Scholarships
1. **Mastercard Foundation Scholars Program**
   - **Coverage**: 100% tuition, accommodation, flights, monthly stipend, laptops & leadership training.
   - **Partner Institutions**: KNUST, University of Cape Town, Makerere University, Ashesi University, University of Edinburgh, UC Berkeley, CMU Africa (Rwanda).
   - **Focus**: Transformative leaders committed to giving back to their communities.

2. **DAAD Scholarships (In-Country / In-Region Africa & Germany)**
   - **Coverage**: Full tuition, living allowances, travel grants, and research funding for Master's and PhD programs across sub-Saharan Africa and German universities.

3. **African Union (AU) Commission Scholarships (PAU)**
   - **Coverage**: Full tuition, airfare, health insurance, and monthly living allowance for studies at Pan-African University institutes (Algeria, Cameroon, Kenya, Nigeria).

4. **Prestigious Global Fellowships**:
   - **Chevening Scholarships (UK)**: 1-year fully-funded Master's at any UK university.
   - **Rhodes Scholarship (Oxford)**: Full funding for postgraduate study at the University of Oxford.
   - **Erasmus Mundus Joint Masters**: Study across at least 2 European nations with a full EU grant.
   - **AIMS AMMI (African Masters in Machine Intelligence)**: Full scholarship for advanced AI research in Africa.

---

#### 📝 Winning Scholarship Strategy:
* **Academic Record**: Maintain a strong CGPA (First Class or Upper Second Class honors).
* **Statement of Purpose (SOP)**: Clearly articulate how your research or degree directly tackles a pressing challenge in your home country or continent (e.g., renewable energy, healthcare access, agritech, AfCFTA trade).
* **Community Leadership**: Highlight tangible leadership initiatives and volunteer mentorship work.
* **Recommendations**: Secure 2–3 strong academic references from professors who can vouch for your technical research ability.

Would you like me to guide you on drafting your Statement of Purpose or finding scholarships specific to your target country or discipline?`;
  }

  // 3. UNIVERSITIES & ADMISSIONS
  if (
    lower.includes("universit") ||
    lower.includes("campus") ||
    lower.includes("admission") ||
    lower.includes("faculty") ||
    lower.includes("knust") ||
    lower.includes("legon") ||
    lower.includes("makerere") ||
    lower.includes("uct") ||
    lower.includes("ashesi") ||
    lower.includes("cairo") ||
    lower.includes("strathmore") ||
    lower.includes("nairobi")
  ) {
    return `🏛️ **Hello and welcome, scholar! I am delighted to help you explore African universities and admissions.**

Africa is home to world-class higher education institutions with outstanding research outputs, vibrant student communities, and international accreditations.

---

#### 🌟 Flagship Universities across Africa
* **Southern Africa**:
  * **University of Cape Town (UCT)**: Ranked #1 in Africa, renowned for Biomedical Science, Commerce, Environmental & Engineering Sciences.
  * **University of the Witwatersrand (Wits)**: Global leader in Mining Engineering, Deep-Level Geology, and Health Sciences.
  * **Stellenbosch University**: Renowned Agri-Sciences, Renewable Engineering & Data Science faculties.
* **West Africa**:
  * **University of Ghana (Legon)**: Premier institution for Law, Public Health, Humanities, and Natural Sciences.
  * **Kwame Nkrumah University of Science and Technology (KNUST)**: Renowned for Civil, Electrical, Aerospace, Materials, and Mechanical Engineering.
  * **Ashesi University**: Elite liberal arts and computer engineering curriculum known for ethical leadership and entrepreneurship.
  * **University of Ibadan (UI, Nigeria)**: Oldest Nigerian university with top Medical, Pharmacy, and Agricultural faculties.
* **East Africa**:
  * **Makerere University (Uganda)**: Celebrated for Epidemiology, Veterinary Medicine, Computing, and Public Health.
  * **University of Nairobi (UoN, Kenya)**: Excellence in Engineering, Business, and Veterinary Science.
  * **Strathmore University (Kenya)**: Renowned for Finance, Actuarial Science, IT, and Law.
* **North & Central Africa**:
  * **Cairo University & Ain Shams (Egypt)**: Pioneers in Medicine, Pharmaceuticals, and Civil Engineering.
  * **Addis Ababa University (Ethiopia)**: Leading research in Geosciences, Archaeology, and Public Administration.

---

#### 📋 General Admission Requirements:
1. **Undergraduate**: High school certificate (WASSCE, KCSE, Matric, Baccalauréat, Cambridge A-Levels) with credit passes in core STEM or humanities subjects.
2. **Postgraduate**: Relevant Bachelor’s degree with accredited standing, academic transcripts, 2 reference letters, and a research proposal.

Would you like detailed admission cutoffs, fee structures, or campus information for a specific university?`;
  }

  // 4. ACADEMIC PROGRAMS & DEGREES
  if (
    lower.includes("program") ||
    lower.includes("degree") ||
    lower.includes("curriculum") ||
    lower.includes("bachelor") ||
    lower.includes("master") ||
    lower.includes("phd") ||
    lower.includes("diploma") ||
    lower.includes("major") ||
    lower.includes("course")
  ) {
    return `🎓 **Warm greetings! It is wonderful to discuss academic degree programs and curriculums with you.**

AfriVersty supports scholars across accredited degree programs in STEM, Health Sciences, Business, Law, and Social Sciences.

---

#### 🚀 In-Demand Degree Programs across Africa
1. **Computer Science & Artificial Intelligence (B.Sc. / M.Sc.)**:
   - Algorithms, Distributed Systems, Machine Learning, Cloud Architecture, and African Language Natural Language Processing.
2. **Electrical & Renewable Energy Engineering (B.Eng. / M.Eng.)**:
   - Photovoltaic microgrids, battery energy storage systems (BESS), smart meters, and high-voltage transmission.
3. **Biomedical & Public Health Sciences (MBChB / M.P.H.)**:
   - Tropical epidemiology, genomics, maternal healthcare systems, and pharmaceutical chemistry.
4. **Data Analytics, Finance & Actuarial Science**:
   - Fintech architecture, econometric modeling, risk management, and quantitative finance under the AfCFTA trade framework.
5. **Civil, Water & Environmental Engineering**:
   - Hydrology, sustainable infrastructure, climate resilience, and urban planning.

---

#### 💡 Curriculum Guidance & Roadmap Planning:
* **Core Foundation**: Build rigorous fundamental knowledge in Mathematics and Core Principles during Years 1 & 2.
* **Practical Labs**: Participate in campus maker-spaces, software projects, and industrial internships during Years 3 & 4.
* **Capstone Research**: Choose a final-year thesis or capstone project solving a tangible local African community challenge.

Which specific degree program or academic field are you keen to explore?`;
  }

  // 5. COMPETITIONS & HACKATHONS
  if (
    lower.includes("competit") ||
    lower.includes("hackathon") ||
    lower.includes("contest") ||
    lower.includes("challenge") ||
    lower.includes("datathon") ||
    lower.includes("olympiad") ||
    lower.includes("zindi") ||
    lower.includes("hult")
  ) {
    return `🏆 **Greetings, scholar! You have an ambitious competitive spirit—let's get you ready for top Pan-African competitions!**

Participating in hackathons and scientific competitions builds high-impact portfolio projects, earns prize grants, and attracts global hiring managers and investors.

---

#### 🌟 Premier Pan-African & Global Competitions:
1. **Zindi Africa Datathons & AI Challenges**:
   - Pan-African data science platform hosting weekly machine learning challenges on real African datasets (crop yield forecasting, financial fraud detection, air quality monitoring) with cash prizes up to $20,000.
2. **Deep Learning IndabaX & Indaba Datathons**:
   - Held annually across 30+ African countries, celebrating African machine learning breakthroughs and poster competitions.
3. **The Hult Prize (Campus & Regional Summits)**:
   - "The Nobel Prize for Students" offering $1,000,000 in seed capital for student social enterprise startups tackling UN Sustainable Development Goals.
4. **Pan-African Robotics Competition (PARC)**:
   - Annual engineering and robotics tournament challenging African youth in agricultural automation, smart mining, and disaster response.
5. **Google Solution Challenge & Microsoft Imagine Cup**:
   - Global tech competitions for university students building software solutions for community problems using cloud technologies.
6. **Africa IoT & AI Hackathons**:
   - Smart city, microgrid, and agritech hardware prototyping contests across regional tech hubs.

---

#### 💡 Pro Tips to Win Hackathons:
* **Assemble a Complementary Team**: 1 Backend/Data Lead, 1 Frontend/UX Designer, and 1 Domain/Pitch Presenter.
* **Focus on Working MVP**: Judges prioritize a working prototype over theoretical slides.
* **African Impact Story**: Clearly articulate the real-world socio-economic impact across local African communities.

Are you looking for team members, ideas for a pitch, or preparation tips for an upcoming contest?`;
  }

  // 6. SKILLS & PROFESSIONAL TOOLKITS
  if (
    lower.includes("skill") ||
    lower.includes("learn to") ||
    lower.includes("how to learn") ||
    lower.includes("toolkit") ||
    lower.includes("competenc") ||
    lower.includes("upskill") ||
    lower.includes("framework")
  ) {
    return `💡 **Hello there, scholar! Empowering yourself with high-impact skills is the fastest pathway to academic and career success.**

Here are the highest-leverage technical and professional skill sets for African scholars aiming for top industry roles, startups, and international fellowships:

---

#### 🛠️ High-Demand Technical Skills:
1. **Applied AI & Data Science**:
   - Python, PyTorch, Scikit-learn, SQL, HuggingFace, Model Fine-Tuning (LoRA), Vector DBs (Pinecone, Chroma).
2. **Modern Full-Stack & Cloud Architecture**:
   - TypeScript, React, Next.js, Node.js/Express, Docker, Kubernetes, AWS/Google Cloud, REST & GraphQL APIs.
3. **Renewable Energy & Clean Tech**:
   - PVsyst solar simulation, HOMER Pro microgrid modeling, CAD (SolidWorks/Fusion 360), MATLAB/Simulink.
4. **Embedded Systems & IoT**:
   - C/C++, ESP32, Arduino, Raspberry Pi, LoRaWAN wireless sensor networks for agricultural monitoring.
5. **Quantitative Finance & Financial Modeling**:
   - Financial statement analysis (3-statement models), DCF valuation, PowerBI, Excel advanced modeling, CFA Level 1 competencies.

---

#### 🌟 Essential Professional Competencies:
* **Scientific & Technical Writing**: Drafting clear research papers, grant proposals, and system architecture docs.
* **Cross-Cultural Communication & Leadership**: Leading diverse, remote teams across different countries.
* **Problem-Solving & First-Principles Thinking**: Breaking complex constraints down into testable engineering solutions.

Which skill would you like to start mastering today? I can provide step-by-step learning roadmaps and free resources!`;
  }

  // 7. EVENTS & CONFERENCES
  if (
    lower.includes("event") ||
    lower.includes("conference") ||
    lower.includes("webinar") ||
    lower.includes("workshop") ||
    lower.includes("colloquium") ||
    lower.includes("symposium") ||
    lower.includes("summit") ||
    lower.includes("seminar")
  ) {
    return `📅 **Warm greetings, scholar! Attending academic conferences and campus events is one of the best ways to network and share your work.**

Here is your guide to major academic, tech, and research gatherings across the continent:

---

#### 🌍 Major Pan-African Conferences & Academic Events:
1. **Deep Learning Indaba (Annual)**:
   - The premier annual Pan-African gathering of AI researchers, professors, and students across Africa with travel grants available.
2. **IEEE PES / IAS PowerAfrica Conference**:
   - Leading scientific conference on clean energy, power grids, electrification, and renewable infrastructure in Africa.
3. **AfriCHI (African Human-Computer Interaction Conference)**:
   - Showcasing user experience, indigenous interfaces, and digital innovation for African contexts.
4. **Next Einstein Forum (NEF) Global Gathering**:
   - Celebrates Africa’s top young scientists, innovators, and policy leaders.
5. **African Union Innovation & Education Expo**:
   - Policy dialogues, student project exhibitions, and continental higher education networking.
6. **Campus Research Weeks & Colloquiums**:
   - University-specific annual research fairs at institutions like KNUST, UCT, Makerere, and Legon where students present theses.

---

#### 🎯 How to Make the Most of Academic Events:
* **Submit an Abstract**: Many conferences offer student travel grants if your paper or poster is accepted!
* **Prepare a 30-Second Elevator Pitch**: Clearly summarize who you are, what you study, and what problem your research solves.
* **Follow Up on LinkedIn**: Connect with speakers and fellow students within 48 hours of meeting them.

Would you like guidance on submitting a conference abstract or preparing for an upcoming academic symposium?`;
  }

  // 8. RESEARCH & THE PAN-AFRICAN RESEARCH RADAR
  if (
    lower.includes("research") ||
    lower.includes("radar") ||
    lower.includes("paper") ||
    lower.includes("breakthrough") ||
    lower.includes("journal") ||
    lower.includes("publication") ||
    lower.includes("laboratory") ||
    lower.includes("thesis")
  ) {
    return `🔬 **Greetings, scholar! Research and scientific inquiry are the heartbeat of AfriVersty.**

Our **Pan-African Research Radar** monitors cutting-edge laboratory advances, peer-reviewed publications, and indigenous scientific breakthroughs across the continent.

---

#### 🌐 High-Impact Research Frontiers in Africa:
1. **Renewable Microgrids & Clean Energy Transition**:
   - Hybrid PV-diesel-storage systems, second-life lithium battery management, and geothermal energy in the East African Rift Valley.
2. **Indigenous African Natural Language Processing (NLP)**:
   - Low-resource language machine translation, speech recognition, and cultural dataset curation led by networks like Masakhane.
3. **Agritech & Climate-Resilient Agriculture**:
   - Satellite remote sensing for drought prediction, computer vision for cassava and maize disease detection, and precision irrigation.
4. **Biomedical & Infectious Disease Genomics**:
   - Genomic sequencing of pathogen variants, malaria vaccine efficacy trials, and sickle-cell disease therapeutic interventions.
5. **Materials Science & Sustainable Civil Engineering**:
   - Pozzolana cement alternatives, laterite soil stabilization, and recycling electronic waste.

---

#### 📚 Research Support We Provide:
* **Literature Reviews**: Synthesizing current state-of-the-art papers in your topic.
* **Methodology Design**: Structuring experimental variables, control groups, and statistical validation.
* **Paper Structuring**: Formatting your manuscript (Abstract, Introduction, Related Work, Methodology, Results, Discussion).

What specific research topic or problem statement are you working on?`;
  }

  // 9. COMMUNITY & STUDENT STUDY CIRCLES
  if (
    lower.includes("community") ||
    lower.includes("peer") ||
    lower.includes("study circle") ||
    lower.includes("study group") ||
    lower.includes("forum") ||
    lower.includes("network") ||
    lower.includes("collaborat") ||
    lower.includes("mentor")
  ) {
    return `🤝 **Hello and warm greetings, scholar! Community is at the center of everything we build at AfriVersty.**

Connecting with fellow students and mentors across Africa accelerates learning, opens doors to collaborative research, and provides lifelong professional partnerships.

---

#### 🌟 How to Engage with the AfriVersty Community:
1. **Pan-African Study Circles**:
   - Join peer groups in Mathematics, Computer Science, Electrical Engineering, Medicine, and Law.
   - Work through past university exam questions, share code repositories, and review project architectures together.
2. **Cross-Border Student Societies**:
   - Connect with IEEE student branches, Google Developer Student Clubs (GDSC), National Societies of Black Engineers (NSBE), and medical student associations across Ghana, Nigeria, Kenya, South Africa, and Egypt.
3. **Faculty & Industry Mentorship**:
   - Connect with African postgraduate researchers studying at top universities worldwide who offer guidance on applications, research, and career growth.
4. **Collaborative Capstone Teams**:
   - Partner with scholars from other universities to co-author papers or build multidisciplinary hackathon projects.

---

#### 💡 Getting Involved:
- Check out the **Community** tab on your campus dashboard to view active discussion threads, join study groups, and connect with peers from your discipline.
- Start a study session or pose a challenging academic problem to the community!

Would you like me to recommend active study circles or student societies in your field?`;
  }


  // COMPREHENSIVE CAREER STRATEGIST ROADMAPS (Short-Term, Mid-Term, Long-Term)
  if (
    discipline === "career-pathways" ||
    lower.includes("career") ||
    lower.includes("what should i study") ||
    lower.includes("what field") ||
    lower.includes("career path") ||
    lower.includes("career help") ||
    lower.includes("career advice") ||
    lower.includes("career guidance") ||
    lower.includes("future path") ||
    lower.includes("roadmap") ||
    lower.includes("become a") ||
    lower.includes("how to become") ||
    lower.includes("pathway") ||
    lower.includes("scholarship") ||
    lower.includes("fellowship") ||
    lower.includes("internship") ||
    lower.includes("which discipline") ||
    lower.includes("which field")
  ) {
    const isAI = lower.includes("ai") || lower.includes("machine learning") || lower.includes("data science") || lower.includes("nlp");
    const isSolar = lower.includes("renewable") || lower.includes("solar") || lower.includes("energy") || lower.includes("power") || lower.includes("electrical");
    const isSoftware = lower.includes("software") || lower.includes("web") || lower.includes("full-stack") || lower.includes("cloud") || lower.includes("devops") || lower.includes("backend");

    if (isAI) {
      return `### 🧭 AfriVersty Career Strategist: AI & Machine Learning Pathway

Here is your concrete, chronological career roadmap tailored for high-impact AI/ML engineering, high-earning global remote roles, and prestigious research fellowships.

---

#### ⏱️ 1. Short-Term Milestones (0–6 Months)
* **Foundational Competencies**: Linear Algebra (SVD, Eigen-decomposition), Multivariable Calculus (Jacobians, Gradients), PyTorch tensor mechanics, and Python data pipelines (NumPy, Pandas).
* **Specific Certifications to Earn**:
  * *DeepLearning.AI Machine Learning Specialization (Coursera)*
  * *Fast.ai Practical Deep Learning for Coders*
  * *AWS Certified Cloud Practitioner or Google Cloud Associate Cloud Engineer*
* **Portfolio Project to Build**:
  * **Low-Resource Indigenous Language Translator / Classifier**: Build and evaluate a fine-tuned LoRA model for African languages (Swahili, Yoruba, Amharic, or Twi) with a lightweight REST API.
* **Job Titles to Aim For**: AI/Data Science Intern, Junior Python/Data Analyst.

---

#### 🚀 2. Mid-Term Milestones (1–3 Years)
* **Advanced Systems & MLOps**: Model Quantization (GGUF, TensorRT), Distributed Training (Ray, PyTorch FSDP), Docker containerization, Kubernetes orchestration, and Vector DBs (Milvus, Pinecone, Qdrant).
* **Specific Certifications to Earn**:
  * *Google Cloud Professional Machine Learning Engineer*
  * *AWS Certified Machine Learning – Specialty*
  * *NVIDIA Deep Learning Institute (DLI) Fundamentals of Deep Learning*
* **Portfolio Project to Build**:
  * **Edge Computer Vision for Agritech / Healthcare**: Deploy an offline MobileNetV4 / YOLO model on Raspberry Pi / Android to classify crop blight or malaria microscopy slides in rural clinics.
  * **End-to-End MLOps Pipeline**: Feature store, drift detection, automated retraining CI/CD via GitHub Actions and MLflow.
* **Job Titles to Aim For**: Junior Machine Learning Engineer, MLOps Engineer, Applied AI Specialist ($35,000–$70,000/yr African hubs; $90,000–$140,000/yr global remote).

---

#### 🏆 3. Long-Term Milestones (3–5+ Years)
* **Leadership, Deep Research & Scale**: Custom foundation model pre-training, algorithmic optimization, leading multi-disciplinary engineering teams, and publishing at top conferences (NeurIPS, ICLR, Deep Learning Indaba).
* **Fellowships & Fully-Funded Scholarships**:
  * *Mastercard Foundation Scholars Program* (Master's at Oxford, UC Berkeley, Edinburgh, CMU Africa)
  * *African Institute for Mathematical Sciences (AIMS) AMMI Fellowship*
  * *Google PhD Fellowship / Rhodes Scholarship*
* **Job Titles to Aim For**: Senior/Staff Machine Learning Engineer, AI Research Scientist, Head of AI / AI Startup Founder ($120,000–$200,000+ USD/yr).

---

💡 **Next Step**: Which specific phase or certification would you like to plan first, or would you like to review your current resume and skills?`;
    }

    if (isSolar) {
      return `### 🧭 AfriVersty Career Strategist: Renewable Energy & Clean Power Pathway

Here is your concrete, chronological career roadmap for Renewable Energy, Photovoltaic Systems, and Smart Microgrid Architecture.

---

#### ⏱️ 1. Short-Term Milestones (0–6 Months)
* **Foundational Competencies**: DC/AC circuit analysis, power flow equations, solar irradiance geometry, PV panel IV-curve characteristics, and HOMER Pro simulation basics.
* **Specific Certifications to Earn**:
  * *NABCEP (North American Board of Certified Energy Practitioners) PV Associate*
  * *Solar Energy International (SEI) Grid-Direct and Battery-Based Design*
  * *Coursera Renewable Energy Specialization (TU Delft / University of Colorado)*
* **Portfolio Project to Build**:
  * **Simulated 100kW Solar Mini-Grid Feasibility Study**: Complete a full techno-economic simulation in HOMER Pro and PVsyst with LCOE (Levelized Cost of Electricity) optimization for an off-grid community.
* **Job Titles to Aim For**: Solar Design Intern, Junior Energy Analyst, Photovoltaic CAD Drafter.

---

#### 🚀 2. Mid-Term Milestones (1–3 Years)
* **Advanced Systems**: Battery Energy Storage Systems (BESS, LiFePO4 chemistry), Maximum Power Point Tracking (MPPT) firmware, IEC 62109 safety standards, and ETAP/MATLAB load flow protection.
* **Specific Certifications to Earn**:
  * *NABCEP PV Installation Professional (PVIP) or PV System Inspector (PVSI)*
  * *Certified Energy Manager (CEM) - Association of Energy Engineers*
  * *QGIS Spatial Mapping for Utility-Scale Solar Irradiance*
* **Portfolio Project to Build**:
  * **IoT-Connected Hardware MPPT Inverter Controller**: Build a working ESP32 microcontroller circuit running Perturb & Observe MPPT with RS485 Modbus telemetry streamed to an open dashboard.
* **Job Titles to Aim For**: Renewable Energy Engineer, Microgrid Design Specialist, Power Systems Consultant ($30,000–$65,000/yr African hubs; $80,000–$120,000/yr international).

---

#### 🏆 3. Long-Term Milestones (3–5+ Years)
* **Utility-Scale Leadership & IPP Development**: Managing Independent Power Producer (IPP) tenders, project financing with AfDB/World Bank/IFC, grid interconnection compliance (IEEE 1547).
* **Fellowships & Scholarships**:
  * *DAAD Master’s Scholarships in Renewable Energy (Germany & Sub-Saharan Africa)*
  * *Erasmus Mundus Joint Master Degree in Renewable Energy (EMRE)*
  * *Chevening Scholarship in Sustainable Energy Futures*
* **Job Titles to Aim For**: Principal Power Systems Engineer, Technical Director of Solar IPP, Chief Engineer ($90,000–$150,000+ USD/yr).

---

💡 **Next Step**: Would you like to size a sample PV array, examine HOMER Pro parameters, or prepare your scholarship statement of purpose?`;
    }

    if (isSoftware) {
      return `### 🧭 AfriVersty Career Strategist: Full-Stack & Cloud Architecture Pathway

Here is your concrete, chronological roadmap for high-earning Full-Stack Software Engineering, Cloud Architecture, and Distributed Systems.

---

#### ⏱️ 1. Short-Term Milestones (0–6 Months)
* **Foundational Competencies**: Modern TypeScript, React 19, Node.js / Express, PostgreSQL schema design, Git workflows, and Data Structures & Algorithms (LeetCode Easy-Medium).
* **Specific Certifications to Earn**:
  * *AWS Certified Cloud Practitioner (CLF-C02) or AWS Certified Developer Associate*
  * *Meta Front-End / Back-End Developer Professional Certificate*
  * *PostgreSQL Associate Developer Certification*
* **Portfolio Project to Build**:
  * **High-Throughput Mobile Money / USSD Payment Simulator**: Build an idempotent REST/GraphQL payment API with webhook retries, Redis rate limiting, and PostgreSQL transactions.
* **Job Titles to Aim For**: Junior Frontend/Backend Developer, Software Engineering Intern ($12,000–$28,000/yr).

---

#### 🚀 2. Mid-Term Milestones (1–3 Years)
* **Advanced Architecture**: Microservices in Go / Rust, Docker, Kubernetes, Terraform IaC, Apache Kafka event streaming, and distributed caching.
* **Specific Certifications to Earn**:
  * *AWS Certified Solutions Architect – Associate (SAA-C03)*
  * *Certified Kubernetes Administrator (CKA)*
  * *HashiCorp Certified: Terraform Associate*
* **Portfolio Project to Build**:
  * **Offline-First Distributed Sync Engine**: Real-time collaborative application with local SQLite/IndexedDB syncing to a cloud PostgreSQL cluster over intermittent 2G/3G connections.
* **Job Titles to Aim For**: Full-Stack Software Engineer, Cloud / DevOps Engineer, Backend Engineer ($35,000–$75,000/yr African hubs; $90,000–$150,000/yr Global Remote).

---

#### 🏆 3. Long-Term Milestones (3–5+ Years)
* **Systems Leadership & Scale**: Multi-region cloud disaster recovery, event-driven fintech cores processing millions of transactions, staff-level architecture leadership.
* **Job Titles to Aim For**: Senior / Staff Software Engineer, Principal Cloud Architect, VP of Engineering ($120,000–$200,000+ USD/yr).

---

💡 **Next Step**: Would you like to plan your 6-month study timetable, design your first portfolio project, or review your resume?`;
    }

    const isFinance = lower.includes("finance") || lower.includes("banking") || lower.includes("investment") || lower.includes("accounting") || lower.includes("cfa") || lower.includes("acca") || lower.includes("business") || lower.includes("economics") || lower.includes("private equity");
    if (isFinance) {
      return `### 🧭 AfriVersty Career Strategist: Business, Finance & Investment Pathway

Here is your concrete, chronological roadmap for high-impact Investment Banking, Private Equity, Chartered Accounting (ACCA/CPA), and Corporate Strategy.

---

#### ⏱️ 1. Short-Term Milestones (0–6 Months)
* **Foundational Competencies**: Three-Statement Financial Modeling, DCF & LBO valuation in Excel, corporate capital structure (WACC, CAPM), and AfCFTA investment frameworks.
* **Specific Certifications to Earn**:
  * *CFA Level 1 Exam Candidate (CFA Institute)*
  * *Financial Modeling & Valuation Analyst (FMVA® - CFI)*
  * *Bloomberg Market Concepts (BMC)*
* **Portfolio Project / Case Study to Build**:
  * **Comprehensive 3-Statement Financial & Valuation Model of an African Unicorn/Fintech** (e.g. Flutterwave, Moniepoint) with sensitivity analysis and investor pitch deck.
* **Job Titles to Aim For**: Investment Banking Analyst, Junior Auditor, Financial Analyst ($18,000–$35,000/yr African hubs).

---

#### 🚀 2. Mid-Term Milestones (1–3 Years)
* **Advanced Deal Structuring**: Cross-border M&A due diligence, DFI/PPP infrastructure co-financing, IFRS reporting compliance, and foreign exchange (FX) hedging.
* **Specific Certifications to Earn**:
  * *CFA Charterholder (Level 2 & 3)*
  * *ACCA Qualified / CPA Member*
  * *Chartered Alternative Investment Analyst (CAIA)*
* **Portfolio Project / Deal Memo**:
  * **$50M Buyout Investment Committee Memo (IC Memo)** for a West/East African Agribusiness conglomerate with debt waterfall & return metrics.
* **Job Titles to Aim For**: Senior Investment Associate, Private Equity Manager, Corporate Financial Controller ($45,000–$90,000/yr African hubs; $110,000–$180,000/yr Global Remote).

---

#### 🏆 3. Long-Term Milestones (3–5+ Years)
* **Executive Leadership & Fund Management**: Sovereign wealth fund advisory, IPO dual listings on African and London stock exchanges, Chief Financial Officer leadership.
* **Fellowships & Scholarships**:
  * *Chevening Scholarship (LSE / Oxford Said MBA)*
  * *Mastercard Foundation MBA Fellowship*
  * *Stanford Africa MBA Fellowship*
* **Job Titles to Aim For**: Chief Financial Officer (CFO), Managing Director, Venture Capital General Partner, Audit Partner ($130,000–$250,000+ USD/yr).

---

💡 **Next Step**: Would you like to build your first financial model template, schedule your CFA/ACCA exam preparation, or review your resume?`;
    }

    const isLaw = lower.includes("law") || lower.includes("legal") || lower.includes("lawyer") || lower.includes("policy") || lower.includes("governance") || lower.includes("diplomacy") || lower.includes("human rights") || lower.includes("afcfta");
    if (isLaw) {
      return `### 🧭 AfriVersty Career Strategist: Law, Public Policy & International Diplomacy Pathway

Here is your concrete, chronological roadmap for International Trade Law, AfCFTA Policy, Commercial Arbitration, and Multilateral Diplomacy.

---

#### ⏱️ 1. Short-Term Milestones (0–6 Months)
* **Foundational Competencies**: International Commercial Terms (Incoterms 2020), AfCFTA Rules of Origin, legal synthesis (IRAC method), and dispute resolution protocols (LCIA/ICC/CRCICA).
* **Specific Certifications to Earn**:
  * *Bar Qualifying Examination / Law Society Call*
  * *WIPO Intellectual Property Certificate (DL-101)*
  * *UNITAR Diplomatic Practice & UN Resolution Drafting*
* **Portfolio Project / Legal Brief**:
  * **Cross-Border Commercial Dispute & Arbitration Brief** resolving a multinational trade dispute under AfCFTA and OHADA commercial frameworks.
* **Job Titles to Aim For**: Associate Legal Counsel, Trade Policy Researcher, Diplomatic Attaché ($16,000–$35,000/yr).

---

#### 🚀 2. Mid-Term Milestones (1–3 Years)
* **Advanced Legal Practice & Treaties**: Bilateral Investment Treaties (BITs), Investor-State Dispute Settlement (ISDS), cross-border merger clearance with COMESA/ECOWAS competition commissions.
* **Specific Certifications to Earn**:
  * *Chartered Institute of Arbitrators (CIArb - Associate/Member)*
  * *Master of Laws (LL.M.) in International Economic Law / Trade Law*
* **Portfolio Project**:
  * **Regional Trade Concession & Tariff Harmonization Compact** for a cross-border logistics enterprise.
* **Job Titles to Aim For**: Senior Legal Counsel, Trade & Regulatory Affairs Director, Commercial Arbitrator ($45,000–$85,000/yr African hubs; $100,000–$195,000/yr Global Remote).

---

#### 🏆 3. Long-Term Milestones (3–5+ Years)
* **Global Governance & Judicial Leadership**: Advising African Union Commissions, UN General Assembly diplomatic missions, senior partnership at tier-1 international law firms.
* **Fellowships & Scholarships**:
  * *Harvard Law School Africa LL.M. Fellowship*
  * *Chevening Scholar (Oxford / Cambridge)*
  * *Mo Ibrahim Leadership Fellowship*
* **Job Titles to Aim For**: Senior Partner, General Counsel, International Court Judge / Arbitrator, Ambassador / UN Special Envoy ($120,000–$250,000+ USD/yr).

---

💡 **Next Step**: Would you like to outline your LL.M. statement of purpose, prepare for bar exams, or review cross-border trade case briefs?`;
    }

    const isHealth = lower.includes("medicine") || lower.includes("doctor") || lower.includes("health") || lower.includes("epidemiology") || lower.includes("nursing") || lower.includes("pharmacy") || lower.includes("public health");
    if (isHealth) {
      return `### 🧭 AfriVersty Career Strategist: Medicine, Healthcare & Public Health Pathway

Here is your concrete, chronological roadmap for Clinical Practice, Global Health Epidemiology, Clinical Trials, and Health Systems Leadership.

---

#### ⏱️ 1. Short-Term Milestones (0–6 Months)
* **Foundational Competencies**: Clinical diagnostic reasoning (MBBS/MBChB), epidemiological study design (cohorts, case-controls, RCTs), biostatistics (survival analysis, risk ratios), and disease surveillance.
* **Specific Certifications to Earn**:
  * *Medical & Dental Council / Nursing & Midwifery Council Registration*
  * *Good Clinical Practice (GCP) Certification for Clinical Trials*
  * *CDC / WHO Field Epidemiology Training Program (FETP)*
* **Portfolio Project**:
  * **Geospatial Disease Outbreak & Vaccine Coverage Surveillance Map** using QGIS and mobile epidemiological data collection tools.
* **Job Titles to Aim For**: Medical Officer, Clinical Research Fellow, Public Health Associate ($18,000–$38,000/yr).

---

#### 🚀 2. Mid-Term Milestones (1–3 Years)
* **Advanced Clinical Research & Health Economics**: Principal Investigator (PI) protocols, pathogen genomic tracking, hospital antimicrobial stewardship, and health policy financing.
* **Specific Certifications to Earn**:
  * *Master of Public Health (MPH) / MSc Global Health (LSHTM / Johns Hopkins / Wits)*
  * *Specialist Board Fellowship (West African College of Physicians / CMSA)*
* **Portfolio Project**:
  * **Phase-III Clinical Trial Protocol for Localized Infectious Disease Therapy** with institutional ethics review and data safety monitoring charter.
* **Job Titles to Aim For**: Consultant Physician, Senior Epidemiologist, Head of Clinical Research ($45,000–$80,000/yr African institutions; $110,000–$200,000/yr International).

---

#### 🏆 3. Long-Term Milestones (3–5+ Years)
* **Health Sovereignty & Global Leadership**: Directing national public health institutes, leading WHO strategic advisory groups, spearheading continental vaccine and pharmaceutical manufacturing.
* **Fellowships & Scholarships**:
  * *Wellcome Trust International Training Fellowship*
  * *Rhodes Scholarship in Medical Sciences (Oxford)*
  * *Fogarty Global Health Fellowship*
* **Job Titles to Aim For**: Director General of Africa CDC / National Institute of Health, WHO Regional Director, Chief Medical Officer (CMO), Dean of Health Sciences ($140,000–$260,000+ USD/yr).

---

💡 **Next Step**: Would you like to map your MPH/Fellowship timeline, structure a research proposal, or design a clinical study protocol?`;
    }

    // ALL-ROUND MULTIDISCIPLINARY CAREER DISCOVERY PROMPT
    return `### 🧭 AfriVersty All-Round Academic & Career Strategist AI

Welcome! As your all-round Career Strategist and Academic Mentor, I guide students, scholars, and professionals across **all disciplines**—including:
- 💼 **Business, Finance, Accounting & Economics**
- ⚖️ **Law, Public Policy, Governance & Diplomacy**
- 🩺 **Medicine, Nursing & Global Public Health**
- 🎨 **Creative Arts, UX/UI Design & Digital Media**
- 📚 **Education, EdTech & Social Sciences**
- 💻 **Computer Science, Software & Artificial Intelligence**
- ⚡ **Engineering & Renewable Clean Energy**
- 🔬 **Natural Sciences, Agriculture & Biotechnology**

To build your exact, non-generic chronological roadmap, let's explore **4 quick targeted discovery questions** (you can answer one at a time or all together):

---

1. 🎓 **What is your current educational level and academic or professional background?**
   *(e.g., Undergraduate student, high school graduate, early-career professional, or postgrad scholar)*

2. 🛠️ **What specific skills, tools, or subjects are you most proficient in right now?**

3. 💡 **Which fields or industry challenges ignite your passion most?**
   *(e.g., High-finance & investments, constitutional/trade law, clinical medicine, UX design & creative arts, AI & software engineering, or public policy)*

4. 🎯 **What is your ultimate dream career goal or fellowship milestone?**
   *(e.g., High-paying global remote role, executive leadership like CFO/Partner/Lead Architect, founding an enterprise, or securing a fully-funded Mastercard Foundation/Rhodes/Chevening scholarship)*

---

💡 *Reply with your background or chosen area of interest, and I will generate your complete Short-Term (0–6 mo), Mid-Term (1–3 yr), and Long-Term (3–5+ yr) milestone roadmap with specific certifications, job titles, and portfolio projects!*`;
  }

  // MATHEMATICS & DIFFERENTIAL CALCULUS
  if (
    lower.includes("derive") ||
    lower.includes("equation") ||
    lower.includes("formula") ||
    lower.includes("quadratic") ||
    lower.includes("derivative") ||
    lower.includes("integral") ||
    lower.includes("calculus") ||
    lower.includes("matrix") ||
    lower.includes("linear algebra")
  ) {
    return `### 📐 First-Principles Mathematical Solution

#### 1. Fundamental Definition & Starting Formula
In standard algebraic and differential analysis, equations represent equilibrium and balance across variables:

> **x² + (b/a)x + (c/a) = 0   (where a is not equal to 0)**

#### 2. Step-by-Step Step Derivation
1. **Subtract constant term from both sides**:
   > **x² + (b/a)x = -(c/a)**

2. **Complete the square** by adding **(b / (2a))² = b² / (4a²)** to both sides:
   > **(x + (b / (2a)))² = (b² - 4ac) / (4a²)**

3. **Take the square root of both sides**:
   > **x + (b / (2a)) = ± √(b² - 4ac) / (2a)**

4. **Isolate x**:
   > **x = (-b ± √(b² - 4ac)) / (2a)**

#### 3. Discriminant Evaluation
- If **b² - 4ac > 0**: Two distinct real roots.
- If **b² - 4ac = 0**: Exactly one repeated real root: **x = -b / (2a)**.
- If **b² - 4ac < 0**: Two complex conjugate roots: **x = (-b ± i√(4ac - b²)) / (2a)**.`;
  }

  // ELECTRICAL & CIRCUIT PHYSICS
  if (
    lower.includes("circuit") ||
    lower.includes("rlc") ||
    lower.includes("impedance") ||
    lower.includes("maxwell") ||
    lower.includes("electromagnet") ||
    lower.includes("voltage") ||
    lower.includes("current") ||
    lower.includes("resistor")
  ) {
    return `### ⚡ Electrical & Electromagnetic Engineering

#### 1. RLC Series Circuit Governing Differential Equation
Applying Kirchhoff's Voltage Law (KVL) around a closed loop:

> **L · (d²q/dt²) + R · (dq/dt) + (1/C) · q = V(t)**

In terms of loop current **i(t) = dq/dt**:
> **L · (di/dt) + R · i + (1/C) ∫ i dt = V(t)**

#### 2. Characteristic Equation & Damping Ratio
The characteristic polynomial is:
> **s² + (R/L)s + (1/(LC)) = 0**
> **s² + 2αs + ω₀² = 0**

Where:
- Neper frequency: **α = R / (2L)**
- Natural resonance frequency: **ω₀ = 1 / √(LC)**
- Damping factor: **ζ = α / ω₀ = R / 2 · √(C/L)**

#### 3. Regime Behaviors
- **Overdamped (ζ > 1)**: Purely exponential decay without oscillation.
- **Critically Damped (ζ = 1)**: Fastest return to steady state with zero overshoot.
- **Underdamped (ζ < 1)**: Sinusoidal ringing with decaying envelope **e^(-αt)**.`;
  }

  // DEFAULT ACADEMIC RESPONSE
  return `### 🎓 AfriVersty STEM Academic & Engineering Advisory

I have analyzed your inquiry regarding **${prompt}**.

#### 1. First-Principles Theoretical Overview
In academic and engineering research, solving complex problems requires anchoring hypotheses in foundational laws (thermodynamics, conservation of momentum/energy, Maxwellian fields, or algorithmic complexity).

#### 2. Recommended Analytical Methodology
1. **Clear Mathematical Formulation**: State variables and boundary conditions explicitly using clear standard notation.
2. **Computational Verification**: Model the system with symbolic math tools (Python NumPy/SymPy, MATLAB, or SPICE simulators).
3. **Empirical Validation**: Compare closed-form analytical results against experimental or laboratory benchmarks.

#### 3. Next Steps for Deep Dive
Please specify your exact focus area:
- **Derivations & Problem Solving**: Step-by-step mathematical solutions in plain, understandable notation.
- **Circuit / Structural Design**: Schematics, component sizing, or HDL code.
- **Code & Algorithms**: Optimized implementations in Python, C++, Verilog, or TypeScript.
- **Pan-African Deployment**: Real-world engineering contextualization for local infrastructure.`;
}

// Set up HTTP Server and WebSocket for Live API Real-Time Voice Conversations
const server = http.createServer(app);

// WebSocket server for Gemini Live API
const wss = new WebSocketServer({
  noServer: true,
});

server.on("upgrade", (request, socket, head) => {
  try {
    const pathname = request.url ? new URL(request.url, `http://${request.headers.host || "localhost"}`).pathname : "";
    if (pathname === "/api/live" || pathname === "/live") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    }
  } catch (err) {
    // If URL parsing fails, ignore silently
  }
});

wss.on("connection", async (clientWs: WebSocket, request: http.IncomingMessage) => {
  console.log("Gemini Live Voice Client connected to AfriVersty Live Engine");
  const ai = getGeminiClient();

  if (!ai) {
    clientWs.send(
      JSON.stringify({
        error: "Gemini API key is not configured. Real-time Live API requires a valid API key.",
        status: "no_api_key",
      })
    );
    return;
  }

  try {
    const parsedUrl = new URL(request.url || "", "http://localhost");
    const validVoices = ["Puck", "Charon", "Kore", "Fenrir", "Zephyr", "Aoede"];
    const requestedVoice = parsedUrl.searchParams.get("voice") || "Puck";
    const voiceParam = validVoices.includes(requestedVoice) ? requestedVoice : "Puck";

    // Connect to Gemini Live API using gemini-3.8-live (or gemini-3.1-flash-live-preview fallback)
    let session: any = null;
    let liveModelUsed = "gemini-3.8-live";

    const systemInstruction = `You are the AfriVersty Live AI Academic & Campus Voice Companion.
You converse naturally, warmly, and inspiringly with African students and scholars via live speech.
When the conversation starts or when the user greets you with an activation word ("Hello", "Hey", "Hi", "Hello AfriVersty", "Hey AfriVersty"), greet them warmly and concisely in spoken English (1-2 sentences) and ask how you can help them navigate AfriVersty today.
You provide deep, actionable guidance on:
- African universities, faculties, and admissions (UCT, KNUST, Makerere, Ashesi, Cairo, etc.)
- Fully funded scholarships (Mastercard Foundation, Rhodes, Mandela Washington, DAAD, Chevening)
- Academic degree programs and curriculums
- STEM pathways, hackathons, and competitions
- Student study circles and pan-African academic research.
Keep spoken responses natural, concise (under 3-4 sentences per turn unless asked to elaborate), and conversational. Speak in a friendly, encouraging human tone.`;

    try {
      session = await ai.live.connect({
        model: "gemini-3.8-live",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceParam },
            },
          },
          systemInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onmessage: (message: any) => {
            try {
              // Audio output chunks
              const parts = message.serverContent?.modelTurn?.parts;
              if (parts && parts.length > 0) {
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    clientWs.send(
                      JSON.stringify({
                        audio: part.inlineData.data,
                        mimeType: part.inlineData.mimeType || "audio/pcm;rate=24000",
                      })
                    );
                  }
                }
              }

              // User audio transcription
              const inputTranscription = message.serverContent?.inputAudioTranscription?.text;
              if (inputTranscription) {
                clientWs.send(
                  JSON.stringify({
                    transcription: inputTranscription,
                    role: "user",
                  })
                );
              }

              // Model audio transcription
              const outputTranscription = message.serverContent?.outputAudioTranscription?.text;
              if (outputTranscription) {
                clientWs.send(
                  JSON.stringify({
                    transcription: outputTranscription,
                    role: "model",
                  })
                );
              }

              // Interruption signal
              if (message.serverContent?.interrupted) {
                clientWs.send(JSON.stringify({ interrupted: true }));
              }
            } catch (err) {
              console.error("Error dispatching Live API message to client:", err);
            }
          },
          onclose: () => {
            console.log("Live API session closed by server");
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ status: "session_closed" }));
            }
          },
          onerror: (error: any) => {
            console.error("Live API Session Error:", error);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ error: error.message || "Live API Error occurred" }));
            }
          },
        },
      });
    } catch (primaryErr: any) {
      console.warn("Retrying Live API with gemini-3.1-flash-live-preview:", primaryErr?.message);
      liveModelUsed = "gemini-3.1-flash-live-preview";
      session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceParam },
            },
          },
          systemInstruction,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onmessage: (message: any) => {
            try {
              const parts = message.serverContent?.modelTurn?.parts;
              if (parts && parts.length > 0) {
                for (const part of parts) {
                  if (part.inlineData?.data) {
                    clientWs.send(
                      JSON.stringify({
                        audio: part.inlineData.data,
                        mimeType: part.inlineData.mimeType || "audio/pcm;rate=24000",
                      })
                    );
                  }
                }
              }
              const inputTranscription = message.serverContent?.inputAudioTranscription?.text;
              if (inputTranscription) {
                clientWs.send(
                  JSON.stringify({
                    transcription: inputTranscription,
                    role: "user",
                  })
                );
              }
              const outputTranscription = message.serverContent?.outputAudioTranscription?.text;
              if (outputTranscription) {
                clientWs.send(
                  JSON.stringify({
                    transcription: outputTranscription,
                    role: "model",
                  })
                );
              }
              if (message.serverContent?.interrupted) {
                clientWs.send(JSON.stringify({ interrupted: true }));
              }
            } catch (err) {
              console.error("Error dispatching Live API message:", err);
            }
          },
          onclose: () => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ status: "session_closed" }));
            }
          },
          onerror: (error: any) => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ error: error.message || "Live API Error occurred" }));
            }
          },
        },
      });
    }

    clientWs.on("message", async (rawMsg) => {
      try {
        const msg = JSON.parse(rawMsg.toString());
        if (msg.audio) {
          // Send 16kHz PCM audio to Gemini Live session
          session.sendRealtimeInput({
            audio: {
              data: msg.audio,
              mimeType: "audio/pcm;rate=16000",
            },
          });
        } else if (msg.text) {
          // Send conversational text turn
          await session.sendClientContent({
            turns: [
              {
                role: "user",
                parts: [{ text: msg.text }],
              },
            ],
            turnComplete: true,
          });
        }
      } catch (err) {
        console.error("Error processing client live message payload:", err);
      }
    });

    clientWs.on("close", () => {
      console.log("Client disconnected from Live API WebSocket");
      try {
        session.close();
      } catch {}
    });

    clientWs.send(
      JSON.stringify({
        status: "ready",
        model: liveModelUsed,
        voice: voiceParam,
      })
    );
  } catch (error: any) {
    console.error("Failed to connect to Live API:", error);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(
        JSON.stringify({
          error: error.message || "Failed to initialize Gemini Live Voice session",
          status: "failed",
        })
      );
    }
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`AfriVersty STEM Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
