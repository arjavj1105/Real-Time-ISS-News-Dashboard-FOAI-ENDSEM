import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardData } from '../hooks/useDashboardData';
import ISSStats from '../components/iss/ISSStats';
import Astronauts from '../components/iss/Astronauts';
import NewsBoard from '../components/news/NewsBoard';
import NewsTicker from '../components/news/NewsTicker';
import { ISSSpeedChart, NewsDistributionChart } from '../components/dashboard/Charts';
import AIChatbot from '../components/chat/AIChatbot';
import { LayoutGrid, Map as MapIcon, Database, Activity } from 'lucide-react';

// Lazy load Map to optimize bundle
const ISSMap = lazy(() => import('../components/iss/ISSMap'));

export default function Dashboard() {
  const [autoCenterMap, setAutoCenterMap] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const dashboardData = useDashboardData();
  const { 
    issData, 
    issHistory, 
    locationDetails, 
    astronauts, 
    news, 
    newsCategory, 
    setNewsCategory, 
    loading, 
    refreshISS, 
    refreshNews 
  } = dashboardData;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Ticker at the very top of content */}
      <div className="mb-6">
        <NewsTicker news={news} />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8 pb-24"
      >
        {/* Analytics Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Database className="h-6 w-6 text-white" />
              </div>
              Nexus Dashboard
            </h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em] mt-1 ml-1">Satellite Intelligence Network v4.0</p>
          </div>
          
          <div className="flex items-center gap-2 bg-card border border-border p-1.5 rounded-xl">
             <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-3 w-3 animate-pulse" />
                Stream Active
             </div>
             <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Relay: SAT-92
             </div>
          </div>
        </div>

        {/* Top Row: Map & Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 group">
            <Suspense fallback={<div className="h-[450px] w-full glass-panel animate-pulse flex items-center justify-center text-muted-foreground font-black uppercase tracking-widest text-xs">Initializing Mapping Core...</div>}>
              <ISSMap 
                issData={issData} 
                history={issHistory} 
                autoCenter={autoCenterMap} 
              />
            </Suspense>
          </div>
          <div className="lg:col-span-4">
            <ISSStats 
              data={issData} 
              locationDetails={locationDetails}
              loading={loading.iss} 
              onRefresh={refreshISS}
              autoCenter={autoCenterMap}
              setAutoCenter={setAutoCenterMap}
            />
          </div>
        </div>

        {/* Middle Row: Crew & Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Astronauts astronauts={astronauts} loading={loading.astronauts} />
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ISSSpeedChart history={issHistory} />
            <NewsDistributionChart news={news} />
          </div>
        </div>

        {/* Bottom Section: Intel Feed */}
        <div className="relative">
          <div className="absolute -left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 to-transparent hidden xl:block"></div>
          <NewsBoard 
            news={news} 
            loading={loading.news} 
            category={newsCategory}
            setCategory={setNewsCategory}
            refreshNews={refreshNews}
          />
        </div>

        {/* Chat Interface */}
        <AIChatbot contextData={dashboardData} />
      </motion.div>
    </div>
  );
}
