// Vercel Serverless Function — AI Chat Proxy
// Uses Hugging Face via server-side fetch to avoid token exposure and CORS issues

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { dashboardData, userQuestion } = req.body;
  
  // Use VITE_ prefix if set, or raw TOKEN (will be set in Vercel Dashboard)
  const hfToken = process.env.VITE_AI_TOKEN || process.env.AI_TOKEN;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (!hfToken) {
    return res.status(500).json({ error: 'AI_TOKEN is not configured on the server.' });
  }

  try {
    const prompt = `You are Nexus Intelligence AI. Answer using ONLY this data: ${dashboardData}. User Question: ${userQuestion}`;

    const response = await fetch("https://router.huggingface.co/novita/v3/openai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${hfToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.2
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || "AI API Error" });

    return res.status(200).json({ response: data.choices[0].message.content });
  } catch (_err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
