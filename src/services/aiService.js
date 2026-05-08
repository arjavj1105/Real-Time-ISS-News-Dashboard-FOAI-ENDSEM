import axios from 'axios';

const IS_PROD = import.meta.env.PROD;

export const askAI = async (dashboardData, userQuestion) => {
  if (IS_PROD) {
    try {
      const { data } = await axios.post('/api/chat', { dashboardData, userQuestion }, { timeout: 25000 });
      return data.response;
    } catch (error) {
      console.error("AI Proxy Error:", error);
      return "The AI Core is temporarily offline. Please try again in a few moments.";
    }
  }

  // Development fallback
  try {
    const HF_TOKEN = import.meta.env.VITE_AI_TOKEN;
    if (!HF_TOKEN) return "AI Dev Mode: VITE_AI_TOKEN missing from .env";
    
    const prompt = `Use this data: ${dashboardData}. Question: ${userQuestion}`;
    const response = await axios.post("https://router.huggingface.co/novita/v3/openai/chat/completions", {
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.2
    }, {
      headers: { "Authorization": `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" }
    });
    return response.data.choices[0].message.content;
  } catch (err) {
    return "AI Core initializing...";
  }
};
