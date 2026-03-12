
import React from 'react';

const MainContent = () => {
  return (
    <main className="flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="relative z-10">
        <h1 className="text-5xl lg:text-7xl font-bold mb-4 text-white">
          NanoGPT
        </h1>
        <p className="text-lg lg:text-xl text-gray-400 mb-8">
          The Pay-Per-Prompt AI Service
        </p>
      </div>
      <div className="w-full max-w-2xl relative z-10">
        <div className="relative">
          <textarea
            className="w-full h-40 p-4 bg-black/40 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300"
            placeholder="Enter your prompt here..."
          />
        </div>
        <button className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:scale-105">
          Generate
        </button>
      </div>
      <div className="mt-12 relative z-10">
        <p className="text-gray-400">Examples:</p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
            "A painting of a cat in the style of Monet"
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
            "Write a python function to reverse a string"
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
            "Translate 'hello world' to Spanish"
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
