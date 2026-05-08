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
      
      // Null safety check as requested
      if (!data || !isMounted.current) return;

      setIssData(data);
      setIssHistory(prev => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newHistory = [...prev, { 
          lat: data.latitude, 
          lng: data.longitude, 
          speed: data.velocity, 
          altitude: data.altitude,
          time: timestamp 
        }];
        return newHistory.slice(-30);
      });
      
      try {
        const locDetails = await fetchLocationDetails(data.latitude, data.longitude);
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
    // 15 second polling as per master requirement
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
