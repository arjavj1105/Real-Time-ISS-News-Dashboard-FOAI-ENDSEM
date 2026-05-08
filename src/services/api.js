import axios from 'axios';

const IS_PROD = import.meta.env.PROD;

// 2. Reverse Geocoding
export const fetchLocationDetails = async (lat, lon) => {
  try {
    const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
      timeout: 5000,
      headers: { 'Accept-Language': 'en' }
    });
    return data;
  } catch (_err) {
    return null;
  }
};

// 3. People In Space
export const fetchAstronauts = async () => {
  try {
    const { data } = await axios.get('https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json', { timeout: 8000 });
    return data;
  } catch (_err) {
    return { people: [] };
  }
};

// 4. News API (GNews via Serverless Proxy)
export const fetchNews = async (category = 'technology') => {
  const cacheKey = `news_cache_${category}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    const isExpired = (Date.now() - timestamp) > 15 * 60 * 1000;
    if (!isExpired) return data;
  }

  // Use Vercel proxy in production to avoid CORS/Key issues
  // Use direct API in dev for faster iteration
  const url = IS_PROD 
    ? `/api/news?category=${category}` 
    : `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=10&apikey=${import.meta.env.VITE_NEWS_API_KEY || "1f3a365393fc489743e31dbab232b672"}`;

  try {
    const { data } = await axios.get(url, { timeout: 12000 });
    
    // In proxy mode, data is the array itself. In direct mode, it's an object with .articles
    const articles = IS_PROD ? data : (data.articles || []);
    
    if (Array.isArray(articles) && articles.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: articles }));
      return articles;
    }
    
    return cached ? JSON.parse(cached).data : [];
  } catch (error) {
    console.error('News Fetch Error:', error);
    return cached ? JSON.parse(cached).data : [];
  }
};
