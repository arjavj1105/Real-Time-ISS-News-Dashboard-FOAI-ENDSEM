// Vercel Serverless Function — News Proxy
// Fetches news server-side to avoid CORS issues and protect API keys

export default async function handler(req, res) {
  const { category = 'technology' } = req.query;
  
  // Use VITE_ prefix if set, otherwise try raw key
  const apiKey = process.env.VITE_NEWS_API_KEY || "1f3a365393fc489743e31dbab232b672";

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  try {
    const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=10&apikey=${apiKey}`;
    console.log(`Fetching News: ${category}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GNews API Error Response:", data);
      return res.status(response.status).json({ 
        error: "GNews API Error", 
        details: data.errors || data.message || "Unknown error"
      });
    }

    if (!data.articles) {
      console.error("No articles field in response:", data);
      return res.status(200).json([]);
    }

    return res.status(200).json(data.articles);
  } catch (err) {
    console.error("Serverless News Proxy Fatal Error:", err);
    return res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
}
