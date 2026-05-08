import axios from "axios";

const API_URL = "https://api.wheretheiss.at/v1/satellites/25544";
const FALLBACK_URL = "http://api.open-notify.org/iss-now.json";

export const fetchISSData = async () => {
  try {
    // Primary: WhereTheISS (High precision + Velocity + Altitude)
    const response = await axios.get(API_URL, { timeout: 4000 });
    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      velocity: response.data.velocity,
      altitude: response.data.altitude,
      visibility: response.data.visibility,
      timestamp: response.data.timestamp,
    };
  } catch (error) {
    console.warn("Primary ISS API unreachable. Engaging Fallback Intelligence...");
    try {
      // Fallback: Open Notify (Basic coordinates)
      const response = await axios.get(FALLBACK_URL, { timeout: 4000 });
      return {
        latitude: parseFloat(response.data.iss_position.latitude),
        longitude: parseFloat(response.data.iss_position.longitude),
        velocity: 27600, // Nominal velocity
        altitude: 415,   // Nominal altitude
        visibility: "N/A",
        timestamp: response.data.timestamp,
      };
    } catch (fallbackError) {
      console.error("Critical: All Satellite Feeds Offline", fallbackError);
      return null;
    }
  }
};
