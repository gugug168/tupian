import React, { useRef } from "react";
import { Camera, Upload, ImageIcon } from "lucide-react";

interface HeroUploadProps {
  onFileSelect: (file: File) => void;
}

export const HeroUpload: React.FC<HeroUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fade-in">
      <div className="mb-8 p-4 bg-white rounded-2xl shadow-xl rotate-3 transform transition hover:rotate-0 duration-500">
        <ImageIcon className="w-16 h-16 text-indigo-600" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
        Collection Splitter
      </h1>
      <p className="text-lg text-slate-500 max-w-md mb-8">
        Upload a photo of your collection (stamps, cards, coins) and AI will automatically split them into individual images.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 active:scale-95"
        >
          <Upload className="w-5 h-5" />
          Upload Photo
        </button>
        
        {/* Helper input hidden */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button
          onClick={() => {
            if(fileInputRef.current) {
                fileInputRef.current.click(); 
                // Note: Actual camera access often just re-uses file input with capture prop on mobile, 
                // but strictly for this demo we reuse the input logic.
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-700 py-3 px-6 rounded-xl font-semibold transition-all active:scale-95"
        >
          <Camera className="w-5 h-5" />
          Take Photo
        </button>
      </div>
    </div>
  );
};
