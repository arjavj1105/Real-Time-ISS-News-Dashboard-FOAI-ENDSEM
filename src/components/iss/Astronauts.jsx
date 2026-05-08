import { motion } from 'framer-motion';
import { Rocket, Users, User } from 'lucide-react';

export default function Astronauts({ astronauts, loading }) {
  if (loading) {
    return (
      <div className="glass-panel p-6 h-[450px] flex flex-col space-y-3">
        <div className="h-5 w-2/5 bg-cyan-500/10 rounded-lg animate-pulse" />
        <div className="space-y-2 flex-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-2xl animate-pulse border border-cyan-500/10"
              style={{ background: 'rgba(6,182,212,0.04)' }} />
          ))}
        </div>
      </div>
    );
  }

  const issCrew = astronauts.filter(p => p.iss === true);

  return (
    <div className="glass-panel p-6 h-[450px] flex flex-col relative overflow-hidden group glow-border">
      
      {/* Background watermark */}
      <div className="absolute bottom-4 right-4 opacity-[0.03] pointer-events-none">
        <Rocket className="h-40 w-40 rotate-45 text-cyan-400" />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Rocket className="h-4 w-4 text-purple-400" style={{ filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.8))' }} />
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-purple-400">Station Crew</h2>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest pl-6">Personnel Intelligence</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-500/25"
          style={{ background: 'rgba(139,92,246,0.08)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ boxShadow: '0 0 6px rgba(167,139,250,0.8)' }} />
          <span className="text-[10px] font-bold text-purple-400">{issCrew.length} Onboard</span>
        </div>
      </div>

      {/* Crew list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 relative z-10 custom-scrollbar">
        {issCrew.length > 0 ? issCrew.map((person, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 180 }}
            className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-purple-500/25 transition-all group/card cursor-default"
            style={{ background: 'rgba(6, 10, 40, 0.5)' }}
            whileHover={{ background: 'rgba(139,92,246,0.06)' }}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center border border-purple-500/20 group-hover/card:border-purple-400/50 transition-colors"
                style={{ background: 'rgba(139,92,246,0.1)' }}>
                <User className="h-4 w-4 text-purple-400" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#00010f]"
                style={{ boxShadow: '0 0 6px rgba(52,211,153,0.8)' }} />
            </div>
            {/* Info */}
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-200 truncate group-hover/card:text-white transition-colors">
                {person.name}
              </div>
              <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider truncate">
                {person.spacecraft || 'ISS'}
              </div>
            </div>
            {/* Agency badge */}
            {person.agency && (
              <div className="ml-auto flex-shrink-0">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-purple-500/20 text-purple-400"
                  style={{ background: 'rgba(139,92,246,0.1)' }}>
                  {person.agency}
                </span>
              </div>
            )}
          </motion.div>
        )) : (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <Users className="h-12 w-12 text-slate-700" />
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] text-center">
              Awaiting crew telemetry...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
