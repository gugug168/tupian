import React from "react";
import { Loader2, ScanLine } from "lucide-react";

export const ProcessingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-indigo-50">
           <ScanLine className="w-12 h-12 text-indigo-600 animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Image</h2>
      <p className="text-slate-500 animate-pulse">Detecting objects and cropping...</p>
      
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
};
