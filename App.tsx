import React, { useState } from 'react';
import { HeroUpload } from './components/HeroUpload';
import { ProcessingView } from './components/ProcessingView';
import { GalleryView } from './components/GalleryView';
import { detectObjectsInImage } from './services/geminiService';
import { cropItemsFromImage, resizeImageFile } from './utils/imageUtils';
import { CroppedItem } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'gallery'>('upload');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [croppedItems, setCroppedItems] = useState<CroppedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setSelectedImageFile(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setSelectedImageSrc(objectUrl);
    
    // Start processing immediately, passing the URL directly to avoid stale state issues
    processImage(file, objectUrl);
  };

  const processImage = async (file: File, imageUrl: string) => {
    setCurrentStep('processing');
    
    try {
      // 1. Optimize Image for AI (Resize to max 1024px)
      // This reduces payload size significantly to prevent 500 XHR errors
      const optimizedBase64 = await resizeImageFile(file, 1024);
      const mimeType = "image/jpeg"; // resizeImageFile converts to JPEG

      // 2. Call Gemini API to get Bounding Boxes
      const detectedItems = await detectObjectsInImage(optimizedBase64, mimeType);

      if (!detectedItems || detectedItems.length === 0) {
         throw new Error("No distinct items were detected. Try an image with better separation between items.");
      }

      // 3. Crop images on Client Side using Canvas
      // Use the ORIGINAL high-res imageUrl for cropping to maintain quality
      if (!imageUrl) throw new Error("Image source lost.");
      
      const cropped = await cropItemsFromImage(imageUrl, detectedItems);
      setCroppedItems(cropped);
      
      setCurrentStep('gallery');

    } catch (err: any) {
      console.error(err);
      // Improve error message for users
      let message = err.message || "An unexpected error occurred.";
      if (message.includes("500") || message.includes("xhr")) {
        message = "Connection to AI failed. Please try a smaller image or check your connection.";
      }
      setError(message);
      setCurrentStep('upload');
    }
  };

  const handleReset = () => {
    // Cleanup object URL to prevent memory leaks
    if (selectedImageSrc) {
        URL.revokeObjectURL(selectedImageSrc);
    }
    setSelectedImageFile(null);
    setSelectedImageSrc(null);
    setCroppedItems([]);
    setError(null);
    setCurrentStep('upload');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                AI
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">StampSplitter</span>
         </div>
      </header>

      <main className="w-full">
        {error && (
            <div className="max-w-md mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
            </div>
        )}

        {currentStep === 'upload' && (
          <HeroUpload onFileSelect={handleFileSelect} />
        )}

        {currentStep === 'processing' && (
          <ProcessingView />
        )}

        {currentStep === 'gallery' && selectedImageSrc && (
          <GalleryView 
            items={croppedItems} 
            originalImageSrc={selectedImageSrc}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default App;