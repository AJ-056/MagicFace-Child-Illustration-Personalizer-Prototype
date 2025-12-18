
import React, { useState } from 'react';

interface ResultDisplayProps {
  imageUrl: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, onReset }) => {
  const [shareStatus, setShareStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `magicface-character-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Convert base64 to a File object for sharing if possible
        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], 'my-magicface-character.png', { type: 'image/png' });

        await navigator.share({
          title: 'My MagicFace Character',
          text: 'Check out this 3D character created from my photo using MagicFace AI!',
          files: [file],
        });
        setShareStatus('success');
      } catch (err) {
        console.error('Error sharing:', err);
        setShareStatus('error');
      }
    } else {
      // Fallback: Copy to clipboard or alert
      try {
        await navigator.clipboard.writeText('Check out MagicFace AI!');
        alert('Sharing not supported on this browser. Link copied to clipboard!');
        setShareStatus('success');
      } catch (err) {
        setShareStatus('error');
      }
    }

    setTimeout(() => setShareStatus('idle'), 3000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-50 relative group">
        <img 
          src={imageUrl} 
          alt="Personalized Illustration" 
          className="w-full h-full object-cover animate-in fade-in zoom-in duration-700"
        />
        
        {/* Floating Shortcut Action */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={handleDownload}
            className="p-3 bg-white/90 backdrop-blur rounded-xl shadow-lg hover:bg-white transition-all text-indigo-600 active:scale-90"
            title="Quick Download"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>

        {/* Success Overlay for Share */}
        {shareStatus === 'success' && (
          <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
             <div className="bg-white px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-2">
                <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold text-slate-800">Shared Successfully!</span>
             </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-4">
        <button
          onClick={onReset}
          className="py-4 px-4 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95 text-sm"
        >
          Try Another
        </button>

        <button
          onClick={handleDownload}
          className="py-4 px-4 rounded-2xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-100 transition-all active:scale-95 flex items-center justify-center space-x-2 text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download</span>
        </button>

        <button
          onClick={handleShare}
          className="col-span-2 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 text-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Share Character</span>
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400 font-medium italic">
        Tip: You can also right-click and "Save Image As"
      </p>
    </div>
  );
};

export default ResultDisplay;
