import React from "react";
import { Download, ArrowLeft, Grid, Layout } from "lucide-react";
import { CroppedItem } from "../types";

interface GalleryViewProps {
  items: CroppedItem[];
  originalImageSrc: string;
  onReset: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ items, originalImageSrc, onReset }) => {
  const handleDownload = (item: CroppedItem) => {
    const link = document.createElement("a");
    link.href = item.imageUrl;
    link.download = `${item.label.replace(/\s+/g, "_")}_${item.id.slice(0, 5)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    items.forEach((item, index) => {
      setTimeout(() => {
        handleDownload(item);
      }, index * 200); // Stagger downloads
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md py-4 border-b border-slate-200 mb-6 flex items-center justify-between">
        <button 
          onClick={onReset}
          className="p-2 -ml-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div className="flex flex-col items-center">
            <h2 className="font-bold text-lg text-slate-800">Split Results</h2>
            <span className="text-xs text-slate-500 font-medium">{items.length} items detected</span>
        </div>
        <button 
          onClick={handleDownloadAll}
          className="text-indigo-600 font-semibold text-sm hover:underline disabled:opacity-50"
          disabled={items.length === 0}
        >
          Save All
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Original Image Reference (Sticky on Desktop) */}
        <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200 lg:sticky lg:top-24">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <Layout className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Original Source</h3>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    <img 
                        src={originalImageSrc} 
                        alt="Original" 
                        className="w-full h-auto object-contain max-h-[40vh] lg:max-h-[60vh]"
                    />
                </div>
             </div>
        </div>

        {/* Split Results Grid */}
        <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4 px-1">
                <Grid className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Extracted Items</h3>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-400">No items detected. Try a clearer image.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                    {items.map((item) => (
                    <div 
                        key={item.id} 
                        className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
                    >
                        {/* Image Container - Square Aspect Ratio */}
                        <div className="aspect-square bg-slate-50 p-4 flex items-center justify-center relative overflow-hidden">
                            <img 
                                src={item.imageUrl} 
                                alt={item.label} 
                                className="max-w-full max-h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105" 
                            />
                            
                            {/* Overlay Action */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-end p-2 opacity-0 group-hover:opacity-100">
                                <button
                                    onClick={() => handleDownload(item)}
                                    className="bg-white p-2 rounded-full shadow-md hover:bg-indigo-50 text-indigo-600 transition-transform hover:scale-110 active:scale-95"
                                    title="Download Image"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Label */}
                        <div className="p-3 border-t border-slate-100">
                            <p className="text-xs font-medium text-slate-500 truncate" title={item.label}>
                                {item.label}
                            </p>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
