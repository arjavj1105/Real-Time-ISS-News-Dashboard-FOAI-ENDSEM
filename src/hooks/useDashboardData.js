import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLocationDetails, fetchAstronauts, fetchNews } from '../services/api';
import { fetchISSData } from '../services/issService';
import toast from 'react-hot-toast';

export const useDashboardData = () => {
  const [issData, setIssData] = useState(null);
  const [issHistory, setIssHistory] = useState([]);
  const [locationDetails, setLocationDetails] = useState(null);
  const [astronauts, setAstronauts] = useState([]);
  const [news, setNews] = useState([]);
  const [newsCategory, setNewsCategory] = useState('technology');
  const [loading, setLoading] = useState({
    iss: true,
    astronauts: true,
    news: true,
  });

  const isMounted = useRef(true);

  const updateISSData = useCallback(async () => {
    try {
      const data = await fetchISSData();
      
      let finalData = data;
      // EMERGENCY FALLBACK: If all APIs fail, provide a safe simulated coordinate
      // so the user isn't stuck on a loading screen.
      if (!data) {
        console.warn("ISS Telemetry lost. Engaging local simulated relay.");
        finalData = {
          latitude: 23.5907,
          longitude: 100.8580,
          velocity: 27600,
          altitude: 415,
          visibility: 'N/A',
          timestamp: Math.floor(Date.now() / 1000),
          isSimulated: true
        };
      }

      if (!isMounted.current) return;

      setIssData(finalData);
      setIssHistory(prev => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newHistory = [...prev, { 
          lat: finalData.latitude, 
          lng: finalData.longitude, 
          speed: finalData.velocity, 
          altitude: finalData.altitude,
          time: timestamp 
        }];
        return newHistory.slice(-30);
      });
      
      try {
        const locDetails = await fetchLocationDetails(finalData.latitude, finalData.longitude);
        if (isMounted.current) setLocationDetails(locDetails);
      } catch (err) {
        if (isMounted.current) setLocationDetails(null);
      }
    } catch (error) {
      console.error('ISS Update Hook Error:', error);
    } finally {
      if (isMounted.current) setLoading(prev => ({ ...prev, iss: false }));
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    updateISSData();
    const interval = setInterval(updateISSData, 15000);
    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [updateISSData]);

  useEffect(() => {
    const loadAstronauts = async () => {
      try {
        const data = await fetchAstronauts();
        if (isMounted.current) setAstronauts(data.people || []);
      } catch (error) {
        console.error('Astronaut Fetch Error:', error);
      } finally {
        if (isMounted.current) setLoading(prev => ({ ...prev, astronauts: false }));
      }
    };
    loadAstronauts();
  }, []);

  const loadNews = useCallback(async (category) => {
    if (!isMounted.current) return;
    setLoading(prev => ({ ...prev, news: true }));
    try {
      const articles = await fetchNews(category);
      if (isMounted.current) setNews(articles);
    } catch (error) {
      console.error('News Fetch Error:', error);
      if (isMounted.current) setNews([]);
    } finally {
      if (isMounted.current) setLoading(prev => ({ ...prev, news: false }));
    }
  }, []);

  useEffect(() => {
    loadNews(newsCategory);
  }, [newsCategory, loadNews]);

  return {
    issData,
    issHistory,
    locationDetails,
    astronauts,
    news,
    newsCategory,
    setNewsCategory,
    loading,
    refreshISS: updateISSData,
    refreshNews: () => loadNews(newsCategory)
  };
};
