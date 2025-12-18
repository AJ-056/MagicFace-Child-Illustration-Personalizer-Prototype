
import React from 'react';

const Header: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Manual offset calculation to account for sticky header + extra breathing room
      const headerOffset = 80; // 64px header + 16px padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer group" 
          onClick={scrollToTop}
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center transition-all group-hover:rotate-6 group-hover:scale-110 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xl">M</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            MagicFace
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-500">
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="hover:text-indigo-600 transition-colors cursor-pointer py-2"
          >
            How it works
          </button>
          <button 
            onClick={() => scrollToSection('architecture')}
            className="hover:text-indigo-600 transition-colors cursor-pointer py-2"
          >
            Architecture
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
