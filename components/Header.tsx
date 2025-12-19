
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">M</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            MagicFace
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-bold text-slate-500">
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-indigo-600 py-2">How it works</button>
          <button 
            onClick={handleOpenKeySelector}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
              hasKey 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                : 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span>{hasKey ? 'Personal Key Active' : 'Select API Key'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
