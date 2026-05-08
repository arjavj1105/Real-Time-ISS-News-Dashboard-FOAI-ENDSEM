# 🛰️ Orbital Nexus: Global Satellite Intelligence & AI Hub

Orbital Nexus is a premier, production-grade intelligence platform designed for real-time monitoring of the International Space Station (ISS) coupled with global news synthesis and context-aware AI diagnostics. Built with a futuristic SaaS aesthetic, it represents the pinnacle of modern web engineering.

## 🚀 Vision
To provide a unified, glassmorphic interface for orbital telemetry and global intelligence, enabling researchers and enthusiasts to track human presence in space while staying informed on terrestrial breakthroughs.

## 🛠️ Technology Stack
- **Framework**: React + Vite (Optimized for performance)
- **Styling**: Tailwind CSS (Custom glassmorphism system)
- **Animations**: Framer Motion (State-aware micro-animations)
- **Mapping**: Leaflet.js + React Leaflet (FlyTo-enabled orbital tracking)
- **Analytics**: Chart.js (Real-time telemetry streaming)
- **Intelligence**: Hugging Face Inference API (`flan-t5-large`)
- **State Management**: React Context & Custom Hooks
- **Notifications**: React Hot Toast

## ✨ Key Features
- **Orbital Command Center**: Real-time ISS tracking with a 15-second synchronization interval and trajectory visualization.
- **Reverse Geocoding Alpha**: Precise overhead localization mapping orbital coordinates to terrestrial cities and regions.
- **Nexus AI Assistant**: A context-aware LLM restricted to internal dashboard data, providing verified diagnostics without hallucinations.
- **Global Intel Feed**: Categorized news stream with 15-minute localStorage caching and multi-criteria filtering.
- **Access Log & Bookmarks**: Persistent tracking of user-read intelligence and saved briefing reports.
- **SaaS Aesthetic**: Full dark/light mode synchronization, animated star fields, and high-contrast glassmorphic panels.

## ⚙️ Engineering Audit
- ✅ **Zero Runtime Errors**: Robust error boundaries and mounting checks.
- ✅ **Optimized Performance**: Lazy loading of heavyweight components (Maps).
- ✅ **Memory Safety**: Precise interval cleanup and side-effect management.
- ✅ **Responsive Design**: Mobile-first architecture tested across all breakpoints.
- ✅ **Deployment Ready**: Fully configured for immediate Vercel deployment.

## 📥 Local Synchronization
1. **Initialize**:
   ```bash
   npm install
   ```
2. **Configure Environment**:
   Create a `.env` file based on `.env.example`:
   ```env
   VITE_NEWS_API_KEY=your_gnews_api_key_here
   VITE_AI_TOKEN=your_huggingface_token_here
   ```
3. **Launch**:
   ```bash
   npm run dev
   ```

---
*Developed by the Orbital Nexus Engineering Team.*
