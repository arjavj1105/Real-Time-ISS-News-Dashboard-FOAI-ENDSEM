import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function NewsTicker({ news }) {
  if (!news || news.length === 0) return null;

  const tickerText = news.slice(0, 6).map(n => n.title).join('  ⬥  ');

  return (
    <div className="w-full h-10 flex items-center overflow-hidden relative border-y"
      style={{
        background: 'rgba(6, 10, 40, 0.8)',
        borderColor: 'rgba(6, 182, 212, 0.2)',
        backdropFilter: 'blur(12px)',
      }}>

      {/* Label badge */}
      <div className="absolute left-0 top-0 h-full flex items-center gap-2 px-4 z-10 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.9) 0%, rgba(59,130,246,0.8) 100%)',
          boxShadow: '8px 0 30px rgba(6,182,212,0.4)',
        }}>
        <Zap className="h-3 w-3 text-white fill-white" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">
          Breaking Intel
        </span>
      </div>

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden ml-[140px] relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10"
          style={{ background: 'linear-gradient(90deg, rgba(6,10,40,0.9), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10"
          style={{ background: 'linear-gradient(270deg, rgba(6,10,40,0.9), transparent)' }} />

        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
          className="whitespace-nowrap flex items-center gap-2"
        >
          <span className="text-xs font-semibold text-cyan-300/80">{tickerText}</span>
          <span className="text-cyan-500/40 mx-4">●</span>
          <span className="text-xs font-semibold text-cyan-300/80">{tickerText}</span>
        </motion.div>
      </div>
    </div>
  );
}
