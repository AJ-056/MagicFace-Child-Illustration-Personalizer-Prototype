
import React, { useState, useRef, useEffect } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
  defaultPreview?: string;
  label: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, defaultPreview, label }) => {
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (defaultPreview) setPreview(defaultPreview);
  }, [defaultPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (basic check for 10MB)
      if (file.size > 10 * 1024 * 1024) {
          alert("File is too large. Please upload an image under 10MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageUpload(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(defaultPreview || null);
    onImageUpload(defaultPreview || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl transition-all h-52 flex items-center justify-center overflow-hidden cursor-pointer ${
        preview && preview !== defaultPreview ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      
      {preview ? (
        <div className="w-full h-full relative group">
          <img src={preview} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4 text-center">
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span className="text-sm font-bold">Change {label}</span>
          </div>
          {preview !== defaultPreview && (
            <button 
              onClick={clearUpload}
              className="absolute top-3 right-3 p-1.5 bg-white shadow-xl rounded-full text-slate-400 hover:text-red-500 transition-all z-20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-700">Add {label}</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">JPG, PNG or WEBP</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
