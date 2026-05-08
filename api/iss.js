// Vercel Serverless Function — ISS Position Proxy
// Fetches ISS position server-side to avoid CORS/mixed-content issues

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');

  const apis = [
    {
      url: 'https://api.wheretheiss.at/v1/satellites/25544',
      transform: (data) => ({
        latitude: data.latitude,
        longitude: data.longitude,
        velocity: data.velocity,
        altitude: data.altitude,
        visibility: data.visibility || 'N/A',
        timestamp: data.timestamp,
      }),
    },
    {
      url: 'http://api.open-notify.org/iss-now.json',
      transform: (data) => ({
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
        velocity: 27600,
        altitude: 415,
        visibility: 'N/A',
        timestamp: data.timestamp,
      }),
    },
  ];

  for (const api of apis) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(api.url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) continue;
      const data = await response.json();
      return res.status(200).json(api.transform(data));
    } catch (err) {
      // Try next API
      continue;
    }
  }

  return res.status(503).json({ error: 'All ISS APIs unreachable' });
}
