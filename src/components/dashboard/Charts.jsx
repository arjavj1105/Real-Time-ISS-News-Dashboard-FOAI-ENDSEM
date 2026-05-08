import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export function ISSSpeedChart({ history }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(226, 232, 240, 0.4)';

  const chartData = useMemo(() => ({
    labels: history.map(h => h.time),
    datasets: [
      {
        label: 'Velocity (km/h)',
        data: history.map(h => h.speed),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      }
    ]
  }), [history]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#f8fafc' : '#0f172a',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        ticks: { color: textColor, maxTicksLimit: 6, font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: textColor, font: { size: 10 } },
        grid: { color: gridColor, drawTicks: false },
      }
    }
  };

  return (
    <div className="glass-panel p-6 h-[320px] flex flex-col group transition-all hover:border-primary/30">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground">Velocity Intelligence</h3>
        <div className="text-xs font-mono text-primary animate-pulse">LIVE FEED</div>
      </div>
      <div className="flex-1">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export function NewsDistributionChart({ news }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const sourceData = useMemo(() => {
    const counts = news.reduce((acc, article) => {
      const source = article.source.name || 'Unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    
    // Take top 5 and group rest as 'Others'
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top5 = sorted.slice(0, 5);
    const others = sorted.slice(5).reduce((sum, curr) => sum + curr[1], 0);
    
    if (others > 0) top5.push(['Others', others]);
    
    return {
      labels: top5.map(i => i[0]),
      values: top5.map(i => i[1])
    };
  }, [news]);

  const data = {
    labels: sourceData.labels,
    datasets: [
      {
        data: sourceData.values,
        backgroundColor: [
          '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'
        ],
        hoverOffset: 10,
        borderWidth: 0,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'bottom',
        labels: { 
            color: textColor, 
            boxWidth: 8, 
            usePointStyle: true, 
            padding: 15,
            font: { size: 10 }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#f8fafc' : '#0f172a',
        borderColor: isDark ? '#334155' : '#e2e8f0',
        borderWidth: 1,
      }
    },
    cutout: '75%',
  };

  return (
    <div className="glass-panel p-6 h-[320px] flex flex-col transition-all hover:border-primary/30">
      <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Source Analytics</h3>
      <div className="flex-1 relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[-15px]">
          <span className="text-3xl font-black text-primary">{news.length}</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reports</span>
        </div>
      </div>
    </div>
  );
}
