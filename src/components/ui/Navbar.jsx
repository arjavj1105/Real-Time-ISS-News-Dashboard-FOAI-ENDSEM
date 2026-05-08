import { Moon, Sun, Orbit, Satellite, Radio } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="text-primary"
              >
                <Orbit className="h-8 w-8" style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.8))' }} />
              </motion.div>
              {/* Orbiting dot */}
              <motion.div
                className="absolute w-2 h-2 rounded-full bg-purple-400"
                style={{ top: '50%', left: '50%', transformOrigin: '0 0' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                style={{ textShadow: 'none' }}>
                Orbital Nexus
              </span>
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-500/60 hidden sm:block">
                Real-Time ISS Intelligence
              </div>
            </div>
          </div>

          {/* Right side indicators */}
          <div className="flex items-center space-x-4">

            {/* Live feed indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              <div className="live-dot" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Live Feed</span>
            </div>

            {/* Satellite signal bars */}
            <div className="hidden md:flex items-end gap-0.5 h-4">
              {[2, 3, 4, 5, 6].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-sm bg-cyan-400"
                  style={{ height: `${h * 3}px`, opacity: i < 4 ? 1 : 0.3 }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-border hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-400" style={{ filter: 'drop-shadow(0 0 4px rgba(250,204,21,0.8))' }} />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
