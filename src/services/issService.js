import axios from "axios";

// Use Vercel serverless proxy in production, direct APIs in development
const IS_PROD = import.meta.env.PROD;
const PROXY_URL = "/api/iss";
const PRIMARY_URL = "https://api.wheretheiss.at/v1/satellites/25544";
const FALLBACK_URL = "http://api.open-notify.org/iss-now.json";

export const fetchISSData = async () => {
  // Strategy 1: Use our own serverless proxy (works everywhere, no CORS/mixed-content issues)
  if (IS_PROD) {
    try {
      const response = await axios.get(PROXY_URL, { timeout: 6000 });
      if (response.data && response.data.latitude != null) {
        return response.data;
      }
    } catch (err) {
      console.warn("Proxy ISS fetch failed, trying direct APIs...");
    }
  }

  // Strategy 2: Direct primary API (wheretheiss.at)
  try {
    const response = await axios.get(PRIMARY_URL, { timeout: 4000 });
    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      velocity: response.data.velocity,
      altitude: response.data.altitude,
      visibility: response.data.visibility,
      timestamp: response.data.timestamp,
    };
  } catch (error) {
    console.warn("Primary ISS API failed, trying fallback...");
  }

  // Strategy 3: Fallback API (open-notify.org)
  try {
    const response = await axios.get(FALLBACK_URL, { timeout: 4000 });
    return {
      latitude: parseFloat(response.data.iss_position.latitude),
      longitude: parseFloat(response.data.iss_position.longitude),
      velocity: 27600,
      altitude: 415,
      visibility: "N/A",
      timestamp: response.data.timestamp,
    };
  } catch (fallbackError) {
    console.error("All ISS APIs failed:", fallbackError);
    return null;
  }
};
