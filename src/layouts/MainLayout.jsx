import Navbar from '../components/ui/Navbar';
import { Toaster } from 'react-hot-toast';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      
      {/* ── Deep Space Background ── */}
      <div className="space-bg">
        {/* Animated star field layers */}
        <div className="star-field" />
        <div className="star-field-2" />

        {/* Shooting stars */}
        <div className="shooting-star" />
        <div className="shooting-star-2" />
        <div className="shooting-star-3" />

        {/* Nebula blobs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '600px', height: '600px',
            top: '-10%', left: '-10%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            animation: 'nebula-drift 25s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '500px', height: '500px',
            bottom: '5%', right: '-5%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
            animation: 'nebula-drift 20s ease-in-out 3s infinite alternate-reverse',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '400px', height: '400px',
            top: '40%', left: '55%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
            animation: 'nebula-drift 30s ease-in-out 6s infinite alternate',
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main Content ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 relative">
        {children}
      </main>

      {/* ── Toaster ── */}
      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: 'rgba(6, 10, 40, 0.9)',
            color: '#e2e8f0',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            backdropFilter: 'blur(20px)',
            fontFamily: "'Space Grotesk', sans-serif",
            borderRadius: '16px',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.1)',
          },
          iconTheme: {
            primary: '#06b6d4',
            secondary: '#000d1a',
          }
        }}
      />
    </div>
  );
}
