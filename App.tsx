
import React, { useState, useCallback } from 'react';
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
  const [modelType, setModelType] = useState<'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview'>('gemini-2.5-flash-image');
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);

  const handlePersonalize = useCallback(async () => {
    if (!userPhoto) return;

    setIsProcessing(true);
    setError(null);
    setResultImage(null);

    try {
      const result = await personalizeIllustration(userPhoto, baseImage, modelType);
      setResultImage(result);
    } catch (err: any) {
      console.error("Personalization Error:", err);
      
      if (err.message === "QUOTA_LIMIT_ZERO") {
        setError({
          message: "Google has set a '0 limit' for image generation on your current API key. This usually happens on 'Free of Charge' projects in certain regions.",
          code: 'QUOTA_LIMIT_ZERO'
        });
      } else if (err.message?.includes('Requested entity was not found.')) {
        setError({
          message: "The selected model is not available for this API key. Try switching to the 'Standard' model or use a different API key.",
          code: 'KEY_ERROR'
        });
      } else {
        setError({ message: err.message || 'An unexpected error occurred during generation.' });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [userPhoto, baseImage, modelType]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">Model Quality</h3>
                <p className="text-xs text-slate-500">Choose the AI engine for generation</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setModelType('gemini-2.5-flash-image')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${modelType === 'gemini-2.5-flash-image' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Standard (Flash)
                </button>
                <button 
                  onClick={() => setModelType('gemini-3-pro-image-preview')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${modelType === 'gemini-3-pro-image-preview' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Premium (Pro)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-2">1. Style Reference</h2>
                <ImageUploader 
                    onImageUpload={(img) => setBaseImage(img || BASE_ILLUSTRATION_URL)} 
                    defaultPreview={BASE_ILLUSTRATION_URL}
                    label="Style Image"
                />
              </div>

              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-2">2. Identity Photo</h2>
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
                        <h3 className="font-bold text-slate-800">Ready to Personalize?</h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                            Click to combine the child's identity with the selected art style.
                        </p>
                    </div>
                </div>
                <button
                    disabled={!userPhoto || isProcessing}
                    onClick={handlePersonalize}
                    className={`w-full md:w-auto px-10 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 text-lg ${
                      userPhoto && !isProcessing
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {isProcessing ? 'Generating...' : 'Create Character'}
                </button>
            </div>
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-indigo-50 min-h-[500px] flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 mb-4">3. Result</h2>
              
              {error && (
                <div className="flex-1 flex flex-col p-6 bg-amber-50 border border-amber-100 rounded-2xl text-amber-900">
                  <div className="flex items-center space-x-2 font-bold mb-4 text-amber-700">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      <span className="text-lg">Action Required</span>
                  </div>
                  
                  <p className="text-sm leading-relaxed mb-6 font-medium">
                    {error.message}
                  </p>

                  <div className="bg-white/60 p-4 rounded-xl space-y-3 mb-6">
                    <h4 className="text-xs font-black uppercase text-amber-800">How to fix this:</h4>
                    <ol className="text-xs space-y-2 text-amber-900 list-decimal list-inside">
                      <li>Go to <strong>Google AI Studio</strong></li>
                      <li>Switch your project to <strong>Pay-as-you-go</strong> (this enables image quota)</li>
                      <li>Generate a <strong>new API Key</strong> for that project</li>
                      <li>Click <strong>Select Personal API Key</strong> below</li>
                    </ol>
                  </div>

                  <button 
                    onClick={handleOpenKeySelector}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                  >
                    Select Personal API Key
                  </button>
                  
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 text-center text-xs text-indigo-600 underline font-bold"
                  >
                    View Billing Documentation
                  </a>
                </div>
              )}

              {!resultImage && !isProcessing && !error && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-40">
                   <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                   </div>
                   <p className="text-slate-500 font-medium">Upload photos and click 'Create Character' to see the result here.</p>
                </div>
              )}

              {isProcessing && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-xl font-black text-indigo-900 mb-2">Personalizing...</p>
                  <p className="text-slate-500 text-sm animate-pulse">This usually takes 5-15 seconds.</p>
                </div>
              )}

              {resultImage && <ResultDisplay imageUrl={resultImage} onReset={() => setResultImage(null)} />}
            </div>
          </div>
        </section>

        <InfoSection />
      </main>

      <footer className="py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">MagicFace Personalizer • Multimodal Prototype</p>
      </footer>
    </div>
  );
};

export default App;
