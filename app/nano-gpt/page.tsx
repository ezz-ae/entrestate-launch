
import React from 'react';
import Header from '@/components/nano-gpt/header';
import MainContent from '@/components/nano-gpt/main-content';
import Footer from '@/components/nano-gpt/footer';

const NanoGptPage = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-0">
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col flex-grow">
        <Header />
        <div className="flex-grow">
          <MainContent />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default NanoGptPage;
