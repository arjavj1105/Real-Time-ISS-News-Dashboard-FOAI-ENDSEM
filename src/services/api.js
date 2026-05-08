import axios from 'axios';

// 2. Reverse Geocoding
export const fetchLocationDetails = async (lat, lon) => {
  // Nominatim requires a User-Agent or some identifier usually, but public ones work sometimes.
  // Added a timeout to prevent hanging.
  const { data } = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
    timeout: 5000,
    headers: { 'Accept-Language': 'en' }
  });
  return data;
};

// 3. People In Space
export const fetchAstronauts = async () => {
  const { data } = await axios.get('https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json');
  return data;
};

// 4. News API (GNews)
export const fetchNews = async (category = 'technology') => {
  const cacheKey = `news_cache_${category}`;
  const cached = localStorage.getItem(cacheKey);
  
  if (cached) {
    const { timestamp, data } = JSON.parse(cached);
    // Cache for 15 minutes
    const isExpired = (Date.now() - timestamp) > 15 * 60 * 1000;
    if (!isExpired) return data;
  }

  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  if (!apiKey) throw new Error('News API key missing');

  // Categories requested: technology, science, business, world
  const { data } = await axios.get(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=10&apikey=${apiKey}`);
  
  const articles = data.articles || [];
  localStorage.setItem(cacheKey, JSON.stringify({
    timestamp: Date.now(),
    data: articles
  }));

  return articles;
};
