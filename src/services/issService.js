import axios from "axios";

// 3-Tier ISS Strategy: 
// 1. Vercel Proxy (Server-side fetch to avoid browser blocks)
// 2. Direct HTTPS APIs (WhereTheISS)
// 3. Public CORS Proxy Fallback
export const fetchISSData = async () => {
  const IS_PROD = import.meta.env.PROD;
  const PROXY_URL = "/api/iss";
  const PRIMARY_URL = "https://api.wheretheiss.at/v1/satellites/25544";
  
  // Public CORS Proxy (Last resort)
  const CORS_PROXY = "https://api.allorigins.win/raw?url=";

  // Strategy 1: Serverless Proxy (Best for HTTPS Prod)
  if (IS_PROD) {
    try {
      const response = await axios.get(PROXY_URL, { timeout: 6000 });
      if (response.data && response.data.latitude != null) {
        return response.data;
      }
    } catch (err) {
      console.warn("Vercel Proxy failed, falling back...");
    }
  }

  // Strategy 2: Direct WhereTheISS (Primary Browser-Direct)
  try {
    const response = await axios.get(PRIMARY_URL, { timeout: 5000 });
    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      velocity: response.data.velocity,
      altitude: response.data.altitude,
      visibility: response.data.visibility,
      timestamp: response.data.timestamp,
    };
  } catch (error) {
    console.warn("Direct Primary API failed, trying CORS Proxy...");
  }

  // Strategy 3: CORS Proxy (Last ditch effort)
  try {
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(PRIMARY_URL)}`, { timeout: 8000 });
    const data = response.data;
    if (data && data.latitude != null) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        velocity: data.velocity,
        altitude: data.altitude,
        visibility: data.visibility,
        timestamp: data.timestamp,
      };
    }
  } catch (corsError) {
    console.error("All ISS Fetch strategies failed.");
  }

  return null;
};
