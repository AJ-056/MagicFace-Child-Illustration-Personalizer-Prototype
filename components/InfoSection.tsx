
import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <section className="space-y-24 py-16 border-t border-slate-200">
      {/* How It Works Section */}
      <div id="how-it-works" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>The Process</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 leading-tight">Technical Deep-Dive</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Model Choice: Gemini 2.5 Flash Image</h3>
              <p className="text-slate-600 leading-relaxed">
                We utilize <strong>Gemini 2.5 Flash Image</strong> for this prototype. Unlike traditional pipelines (Stable Diffusion + ControlNet), Gemini offers a <strong>Native Multimodal</strong> approach.
              </p>
            </div>
            
            <ul className="space-y-4">
              {[
                { title: 'In-Context Personalization', desc: 'The model analyzes the style and face simultaneously.' },
                { title: 'Semantic Reasoning', desc: 'AI identifies gender and adapts clothing automatically.' },
                { title: 'Low Latency', desc: 'Optimized for near real-time prototype interaction.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="mt-1 bg-indigo-100 rounded-full p-1 shrink-0">
                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">{item.title}</span>
                    <span className="text-sm text-slate-500">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Architecture Section */}
        <div id="architecture" className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] -mr-40 -mt-40"></div>
          <h3 className="text-2xl font-bold mb-10 flex items-center">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            System Architecture
          </h3>
          
          <div className="space-y-10 relative z-10">
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">UI</div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">Layer 1: Frontend</span>
                <p className="text-sm text-slate-300 font-medium">React + Tailwind + TypeScript</p>
              </div>
            </div>

            <div className="ml-7 border-l-2 border-dashed border-white/10 pl-12 space-y-10 py-2">
              <div className="flex items-center space-x-5 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center transition-all group-hover:scale-110">
                   <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Request Pipeline</span>
                  <p className="text-sm text-slate-300">Base64 Encoded Multi-modal Payload</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 group">
                <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/20 transition-all group-hover:rotate-12">AI</div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">Layer 2: Brain</span>
                  <p className="text-sm text-slate-300 font-medium">Gemini 2.5 Flash Engine</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-700 flex items-center justify-center font-bold text-lg">PNG</div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Layer 3: Output</span>
                <p className="text-sm text-slate-300 font-medium">Personalized Render Result</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Footer */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[2rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-indigo-200">
        <div className="text-center md:text-left">
          <h3 className="text-3xl font-black">V2 Roadmap</h3>
          <p className="text-indigo-100 max-w-lg mt-3 text-lg opacity-90">
            For production, we plan to integrate <strong>Instant-ID</strong> and facial feature extraction to achieve 99% identity accuracy.
          </p>
        </div>
        <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0 whitespace-nowrap">
          View Full Specs
        </button>
      </div>
    </section>
  );
};

export default InfoSection;
