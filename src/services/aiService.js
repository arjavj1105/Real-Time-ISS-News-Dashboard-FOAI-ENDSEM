import { HfInference } from "@huggingface/inference";

const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;

const client = HF_TOKEN ? new HfInference(HF_TOKEN) : null;

export const askAI = async (dashboardData, userQuestion) => {
  if (!client) {
    return "AI Core offline: API Token missing. Please check your environment configuration.";
  }

  // Check if we actually have data to answer from
  const hasNews = dashboardData.includes("Latest News Headlines:") && dashboardData.split("Latest News Headlines:")[1].trim().length > 5;
  const hasISS = !dashboardData.includes("Lat undefined") && !dashboardData.includes("Lat null");

  if (!hasNews && !hasISS) {
    return "The Nexus Intelligence system is currently synchronizing with orbital satellites and global news feeds. Please standby for telemetry and intelligence reports before querying the core.";
  }

  try {
    const prompt = `
You are Nexus Intelligence AI. 
Analyze the dashboard telemetry below and answer the user query.

DASHBOARD DATA:
${dashboardData}

RULES:
1. ONLY use the provided data.
2. If the answer isn't in the data, say "I am awaiting more telemetry to answer that specifically."
3. Keep it concise and professional.

USER QUESTION: ${userQuestion}

RESPONSE:`;

    const response = await client.chatCompletion({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.2,
      provider: "novita"
    });

    return response.choices[0].message.content || "No intelligence received from core.";
  } catch (error) {
    console.error("AI Error:", error);
    return "The AI Core is temporarily offline or initializing. Please try again in 30 seconds.";
  }
};
