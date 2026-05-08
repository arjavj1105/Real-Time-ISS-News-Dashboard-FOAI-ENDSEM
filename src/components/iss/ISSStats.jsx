import { motion } from 'framer-motion';
import { RefreshCw, MapPin, Gauge, Mountain, Eye, ShieldCheck } from 'lucide-react';

export default function ISSStats({ data, locationDetails, loading, onRefresh, autoCenter, setAutoCenter }) {
  if (loading || !data) {
    return (
      <div className="glass-panel p-6 h-full min-h-[450px] flex flex-col space-y-4">
        <div className="h-5 w-1/3 bg-cyan-500/10 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 gap-3 flex-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-cyan-500/5 rounded-2xl animate-pulse border border-cyan-500/10" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Latitude',   value: data.latitude.toFixed(4) + '°',                      icon: MapPin,      color: 'text-cyan-400',   glow: 'rgba(6,182,212,0.3)' },
    { label: 'Longitude',  value: data.longitude.toFixed(4) + '°',                     icon: MapPin,      color: 'text-blue-400',   glow: 'rgba(59,130,246,0.3)' },
    { label: 'Velocity',   value: Math.round(data.velocity).toLocaleString() + ' km/h', icon: Gauge,       color: 'text-emerald-400', glow: 'rgba(52,211,153,0.3)' },
    { label: 'Altitude',   value: Math.round(data.altitude).toLocaleString() + ' km',   icon: Mountain,    color: 'text-amber-400',  glow: 'rgba(251,191,36,0.3)' },
    { label: 'Visibility', value: data.visibility.toUpperCase(),                        icon: Eye,         color: 'text-rose-400',   glow: 'rgba(251,113,133,0.3)' },
    { label: 'Status',     value: 'NOMINAL',                                            icon: ShieldCheck, color: 'text-purple-400', glow: 'rgba(167,139,250,0.3)' },
  ];

  return (
    <div className="glass-panel p-6 flex flex-col h-full min-h-[450px] relative overflow-hidden group glow-border">

      {/* Decorative corner glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="live-dot" />
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">Live Telemetry</h2>
          </div>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest pl-4">Real-Time Satellite Feed</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Auto-center toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none group/toggle">
            <div className="relative">
              <input type="checkbox" checked={autoCenter} onChange={(e) => setAutoCenter(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 rounded-full border border-cyan-500/30 bg-slate-900/80 peer-checked:border-cyan-400/60 transition-all peer-checked:bg-cyan-500/10" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-slate-600 peer-checked:bg-cyan-400 peer-checked:translate-x-4 transition-all shadow-sm" style={{ filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.6))' }} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 peer-checked:text-cyan-400">Ctr</span>
          </label>
          <button onClick={onRefresh}
            className="p-2 rounded-xl border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all active:scale-90"
            title="Force Refresh">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 relative z-10">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.06, type: 'spring', stiffness: 200 }}
            className="flex flex-col p-4 rounded-2xl border transition-all group/stat cursor-default"
            style={{
              background: 'rgba(6, 10, 40, 0.5)',
              borderColor: 'rgba(6,182,212,0.1)',
            }}
            whileHover={{
              borderColor: stat.glow,
              boxShadow: `0 0 20px ${stat.glow}, inset 0 0 10px ${stat.glow}20`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <div className={`p-1 rounded-md ${stat.color}`}
                style={{ background: `${stat.glow}20` }}>
                <stat.icon className="h-3 w-3" />
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500">{stat.label}</span>
            </div>
            <div className={`text-base font-bold font-mono tracking-tight ${stat.color}`}
              style={{ textShadow: `0 0 10px ${stat.glow}` }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ground Track Footer */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-5 p-4 rounded-2xl relative overflow-hidden border border-cyan-500/15"
        style={{ background: 'rgba(6,182,212,0.05)' }}
      >
        <div className="absolute inset-0 opacity-30"
          style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, transparent 60%)' }} />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-cyan-500/30"
            style={{ background: 'rgba(6,182,212,0.1)' }}>
            <MapPin className="h-4 w-4 text-cyan-400" style={{ filter: 'drop-shadow(0 0 4px rgba(6,182,212,1))' }} />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-500/60 mb-0.5">Ground Track</div>
            <div className="text-xs font-semibold text-slate-300 truncate">
              {locationDetails?.display_name ?? 'Transiting over ocean or uncharted region...'}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
