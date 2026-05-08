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
- ✅ **Redundant Telemetry**: 3-tier ISS tracking (Serverless Proxy → Direct → CORS Proxy).
- ✅ **Deployment Ready**: Fully configured for Vercel with serverless API integration.

## 📥 Deployment & Synchronization
- **Live Dashboard**: [https://orbital-nexus-iss-dashboard.vercel.app](https://orbital-nexus-iss-dashboard.vercel.app)
- **ISS API Proxy**: [https://orbital-nexus-iss-dashboard.vercel.app/api/iss](https://orbital-nexus-iss-dashboard.vercel.app/api/iss)

### Local Development
1. **Initialize**: `npm install`
2. **Configure Environment**: Create `.env` based on `.env.example`
3. **Launch**: `npm run dev`

---
*Developed by the Orbital Nexus Engineering Team. 🛰️*
