import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Search, Filter, RefreshCw, Bookmark, TrendingUp, History, Star, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CATEGORIES = ['technology', 'science', 'business', 'world'];

const CAT_COLORS = {
  technology: { text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', glow: 'rgba(6,182,212,0.3)' },
  science:    { text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', glow: 'rgba(139,92,246,0.3)' },
  business:   { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', glow: 'rgba(251,191,36,0.3)' },
  world:      { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10', glow: 'rgba(251,113,133,0.3)' },
};

export default function NewsBoard({ news, loading, category, setCategory, refreshNews }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [bookmarked, setBookmarked] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('nexus_bookmarks') || '[]')); }
    catch { return new Set(); }
  });
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexus_recent') || '[]'); }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem('nexus_bookmarks', JSON.stringify([...bookmarked])); }, [bookmarked]);
  useEffect(() => { localStorage.setItem('nexus_recent', JSON.stringify(recentlyViewed)); }, [recentlyViewed]);

  const toggleBookmark = (url) => setBookmarked(prev => {
    const n = new Set(prev);
    n.has(url) ? n.delete(url) : n.add(url);
    return n;
  });

  const handleArticleClick = (article) => {
    setRecentlyViewed(prev => [article, ...prev.filter(a => a.url !== article.url)].slice(0, 5));
  };

  const filteredNews = useMemo(() => {
    let f = news.filter(a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(search.toLowerCase()))
    );
    if (sortBy === 'date') f.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    else if (sortBy === 'source') f.sort((a, b) => a.source.name.localeCompare(b.source.name));
    return f;
  }, [news, search, sortBy]);

  const cat = CAT_COLORS[category] || CAT_COLORS.technology;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* ── Main Feed ── */}
      <div className="xl:col-span-8 glass-panel p-6 flex flex-col min-h-[600px]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="live-dot" />
              <h2 className={`text-xs font-bold uppercase tracking-[0.25em] ${cat.text}`}>Global Intelligence Feed</h2>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest pl-4">Real-Time Categorized Reports</p>
          </div>
          {/* Category + Refresh */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(c => {
              const cc = CAT_COLORS[c];
              return (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    category === c
                      ? `${cc.text} ${cc.border} ${cc.bg} shadow-lg`
                      : 'text-slate-500 border-slate-700/50 hover:border-slate-600'
                  }`}
                  style={category === c ? { boxShadow: `0 0 15px ${cc.glow}` } : {}}>
                  {c}
                </button>
              );
            })}
            <button onClick={refreshNews}
              className="p-2 rounded-xl border border-slate-700/50 hover:border-cyan-500/40 hover:text-cyan-400 text-slate-500 transition-all"
              title="Refresh Feed">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input type="text" placeholder="Search intelligence feed..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'rgba(6,10,40,0.6)', border: '1px solid rgba(6,182,212,0.15)', color: '#e2e8f0' }}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider appearance-none cursor-pointer w-full sm:w-auto"
              style={{ background: 'rgba(6,10,40,0.6)', border: '1px solid rgba(6,182,212,0.15)', color: '#94a3b8' }}>
              <option value="date">Latest First</option>
              <option value="source">By Source</option>
            </select>
          </div>
        </div>

        {/* Articles */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-5 p-5 rounded-3xl border border-cyan-500/10 animate-pulse"
                style={{ background: 'rgba(6,10,40,0.4)' }}>
                <div className="w-44 h-32 rounded-2xl bg-cyan-500/5 flex-shrink-0" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-3 bg-cyan-500/10 rounded w-1/4" />
                  <div className="h-6 bg-slate-700/40 rounded w-3/4" />
                  <div className="h-3 bg-slate-700/30 rounded w-full" />
                  <div className="h-3 bg-slate-700/30 rounded w-5/6" />
                </div>
              </div>
            ))
          ) : filteredNews.length > 0 ? filteredNews.map((article, idx) => {
            const isBreaking = (Date.now() - new Date(article.publishedAt).getTime()) < 1000 * 60 * 60 * 4;
            return (
              <motion.div key={article.url + idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                className="flex flex-col md:flex-row gap-5 p-5 rounded-3xl border border-transparent hover:border-cyan-500/15 transition-all group relative overflow-hidden"
                style={{ background: 'rgba(6, 10, 40, 0.5)' }}
                whileHover={{ background: 'rgba(6, 12, 50, 0.7)' }}
              >
                {isBreaking && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-rose-400 border border-rose-500/30 flex items-center gap-1.5"
                    style={{ background: 'rgba(251,113,133,0.1)', boxShadow: '0 0 10px rgba(251,113,133,0.2)' }}>
                    <TrendingUp className="h-2.5 w-2.5" />
                    Breaking
                  </div>
                )}
                {article.image && (
                  <div className="w-full md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-700/50 group-hover:border-cyan-500/20 transition-colors">
                    <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  </div>
                )}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${cat.text} ${cat.border} ${cat.bg}`}>
                        {article.source.name}
                      </span>
                      <span className="text-[9px] text-slate-600 font-medium uppercase flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatDistanceToNow(new Date(article.publishedAt))} ago
                      </span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleBookmark(article.url); }}
                      className="p-1.5 hover:bg-amber-500/10 rounded-lg transition-colors group/bm">
                      <Bookmark className={`h-3.5 w-3.5 ${bookmarked.has(article.url) ? 'fill-amber-400 text-amber-400' : 'text-slate-600 group-hover/bm:text-amber-400'} transition-colors`} />
                    </button>
                  </div>
                  <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2 leading-tight text-slate-200 group-hover:text-white transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer"
                    onClick={() => handleArticleClick(article)}
                    className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${cat.text} hover:gap-2.5 transition-all w-fit`}>
                    Access Report <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            );
          }) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-4 py-16">
              <Search className="h-12 w-12 opacity-20" />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">No intelligence reports found</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
                  Satellite relay may be offline or API limit reached.
                </p>
              </div>
              <button onClick={refreshNews}
                className="mt-4 px-6 py-2 rounded-xl border border-cyan-500/30 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 hover:bg-cyan-500/10 transition-all">
                Retry Connection
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* Access Log */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-2 mb-5">
            <History className="h-4 w-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">Access Log</h3>
          </div>
          <div className="space-y-3">
            {recentlyViewed.length > 0 ? recentlyViewed.map((article, i) => (
              <a key={i} href={article.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 group/r p-2 rounded-xl hover:bg-cyan-500/5 transition-all border border-transparent hover:border-cyan-500/10">
                <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700/50">
                  <img src={article.image} alt="" className="w-full h-full object-cover opacity-60 group-hover/r:opacity-100 transition-opacity" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold line-clamp-1 text-slate-400 group-hover/r:text-cyan-300 transition-colors">{article.title}</p>
                  <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">{article.source.name}</p>
                </div>
              </a>
            )) : (
              <p className="text-[10px] text-slate-600 uppercase tracking-widest text-center py-6">No access log recorded</p>
            )}
          </div>
        </div>

        {/* Stats Panel */}
        <div className="glass-panel p-5"
          style={{ background: 'rgba(6,10,40,0.5)', borderColor: 'rgba(139,92,246,0.15)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Star className="h-4 w-4 text-amber-400" style={{ filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.8))' }} />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Mission Stats</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Bookmarked', value: bookmarked.size, color: 'text-amber-400' },
              { label: 'Active Reports', value: news.length, color: 'text-cyan-400' },
              { label: 'Feed Category', value: category.toUpperCase(), color: 'text-purple-400' },
            ].map((s, i) => (
              <div key={i} className="flex justify-between items-end pb-4 border-b border-slate-800/60 last:border-0 last:pb-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{s.label}</span>
                <span className={`text-xl font-black font-mono tracking-tight ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
