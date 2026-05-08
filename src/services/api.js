import axios from 'axios';

// 2. Reverse Geocoding
export const fetchLocationDetails = async (lat, lon) => {
  try {
    const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
      timeout: 5000,
      headers: { 'Accept-Language': 'en' }
    });
    return data;
  } catch (err) {
    return null;
  }
};

// 3. People In Space
export const fetchAstronauts = async () => {
  try {
    const { data } = await axios.get('https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json', { timeout: 8000 });
    return data;
  } catch (err) {
    return { people: [] };
  }
};

// 4. News API (GNews)
export const fetchNews = async (category = 'technology') => {
  const cacheKey = `news_cache_${category}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    const isExpired = (Date.now() - timestamp) > 15 * 60 * 1000;
    if (!isExpired) return data;
  }

  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  if (!apiKey) {
    console.error("VITE_NEWS_API_KEY is missing from environment.");
    return cached ? JSON.parse(cached).data : [];
  }

  try {
    const { data } = await axios.get(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=10&apikey=${apiKey}`, { timeout: 10000 });
    const articles = data.articles || [];
    if (articles.length > 0) {
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: articles }));
    }
    return articles;
  } catch (error) {
    console.error('News API Error:', error);
    return cached ? JSON.parse(cached).data : [];
  }
};
