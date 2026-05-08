import axios from "axios";

const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;

// HF migrated to router.huggingface.co with provider-based routing.
// 'novita' provider supports llama-3.1-8b-instruct via OpenAI-compatible chat completions.
const API_URL = "https://router.huggingface.co/novita/v3/openai/chat/completions";
const MODEL = "meta-llama/llama-3.1-8b-instruct";

export const askAI = async (dashboardData, userQuestion) => {
  if (!HF_TOKEN) {
    return "AI token not configured.";
  }

  try {
    const systemPrompt = `You are Nexus Intelligence AI, a strict dashboard assistant.
You ONLY answer using the real-time dashboard data provided below.
You MUST NOT use any external knowledge or make up information.
If the answer is not in the provided data, respond EXACTLY with: "I only answer using dashboard data."
Keep all responses concise (2-3 sentences max).

LIVE DASHBOARD DATA:
${dashboardData}`;

    const response = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuestion }
        ],
        max_tokens: 120,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content?.trim();
    return text || "I only answer using dashboard data.";

  } catch (error) {
    console.error("AI Error:", error?.response?.data || error.message);
    if (error.response?.status === 401) return "AI authentication failed. Check your token.";
    if (error.response?.status === 429) return "AI rate limit reached. Please wait a moment.";
    if (error.code === "ECONNABORTED") return "AI request timed out. Please try again.";
    return "Unable to process request right now.";
  }
};
