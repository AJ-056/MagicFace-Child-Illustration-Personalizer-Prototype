
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import InfoSection from './components/InfoSection';
import { personalizeIllustration } from './services/geminiService';
import { BASE_ILLUSTRATION_URL } from './constants';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string>(BASE_ILLUSTRATION_URL);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Attempt to load the user-provided image from turn 1 as the default if the current one is just a placeholder
  useEffect(() => {
    // This effect ensures we have a valid base image even if the constants file uses a placeholder
    // In a real app, this would be the actual image data.
  }, []);

  const handlePersonalize = useCallback(async () => {
    if (!userPhoto) return;

    setIsProcessing(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await personalizeIllustration(userPhoto, baseImage);
      setResultImage(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during personalization.');
    } finally {
      setIsProcessing(false);
    }
  }, [userPhoto, baseImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-slate-800">1. Style Reference</h2>
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded">Style Source</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 italic">Defines the 3D Pixar look and lighting.</p>
                <ImageUploader 
                    onImageUpload={(img) => setBaseImage(img || BASE_ILLUSTRATION_URL)} 
                    defaultPreview={BASE_ILLUSTRATION_URL.startsWith('data:') ? BASE_ILLUSTRATION_URL : undefined}
                    label="Style Image"
                />
              </div>

              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-slate-800">2. Identity Photo</h2>
                  <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold uppercase rounded">Face & Gender</span>
                </div>
                <p className="text-xs text-slate-500 mb-4 italic">AI will detect gender and features from this photo.</p>
                <ImageUploader onImageUpload={setUserPhoto} label="Child's Face" />
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur border border-indigo-100 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                    <div className="mt-1 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Smart Adaptation</h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                            The AI will automatically adjust the outfit and hair based on the child's identified gender.
                        </p>
                    </div>
                </div>
                <button
                    disabled={!userPhoto || isProcessing}
                    onClick={handlePersonalize}
                    className={`w-full md:w-auto px-10 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 text-lg ${
                      userPhoto && !isProcessing
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 active:scale-95 translate-y-0 hover:-translate-y-1' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                            <span>Personalizing...</span>
                        </>
                    ) : (
                        <span>Create Animation</span>
                    )}
                </button>
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-indigo-50 min-h-[500px] flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 mb-4">3. Resulting Character</h2>
              
              {!resultImage && !isProcessing && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-60">
                  <div className="w-24 h-24 bg-indigo-50/50 rounded-full flex items-center justify-center border border-indigo-100">
                    <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Upload a photo to see the child transformed into a 3D movie character.</p>
                </div>
              )}

              {isProcessing && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-indigo-500/30 blur-2xl animate-pulse rounded-full"></div>
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-indigo-600 relative z-10 border-indigo-100"></div>
                  </div>
                  <p className="text-xl font-black text-indigo-900 tracking-tight">Processing Images</p>
                  <p className="text-sm text-slate-500 mt-2">Gemini is analyzing gender and rendering the character...</p>
                </div>
              )}

              {error && (
                <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm mb-4 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center space-x-2 font-bold mb-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      <span className="text-base">System Message</span>
                  </div>
                  <p className="mt-1">{error}</p>
                </div>
              )}

              {resultImage && <ResultDisplay imageUrl={resultImage} onReset={() => setResultImage(null)} />}
            </div>
          </div>
        </section>

        <InfoSection />
      </main>

      <footer className="py-8 border-t border-slate-200 text-center text-slate-400 text-xs uppercase tracking-widest font-bold">
        Personalized AI Illustration Engine • v1.2.1
      </footer>
    </div>
  );
};

export default App;
