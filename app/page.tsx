import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold font-sans">VoiceAI</span>
          </div>
          <Link href="/login" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-medium transition-all backdrop-blur-sm">
            Login
          </Link>
        </nav>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col justify-center items-center text-center pb-20 mt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Now Monitoring Live Agents
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
            <span className="block text-white">Intelligent Voice AI</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400">For Modern Business</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 animate-slide-up animation-delay-200">
            Deploy autonomous AI receptionists that integrate seamlessly with your CRM and Calendar.
            A modular platform designed for scalability.
          </p>

          <div className="flex gap-4 animate-slide-up animation-delay-400">
            <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-lg font-semibold rounded-2xl shadow-xl shadow-indigo-600/20 transition-all hover:scale-105">
              Launch Dashboard
            </Link>
            <a href="#features" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-lg font-semibold rounded-2xl transition-all hover:scale-105 backdrop-blur-sm">
              View Modules
            </a>
          </div>

          {/* Feature preview */}
          <div className="mt-20 w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden animate-slide-up animation-delay-500">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="p-8">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Voice Agent</h3>
                <p className="text-slate-400 text-sm">Autonomous call handling with realistic voice synthesis.</p>
              </div>
              <div className="p-8">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Lead CRM</h3>
                <p className="text-slate-400 text-sm">Track and manage every interaction automatically.</p>
              </div>
              <div className="p-8">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Smart Calendar</h3>
                <p className="text-slate-400 text-sm">AI-driven appointment scheduling and management.</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-6 border-t border-white/5 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} VoiceAI Platform. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
