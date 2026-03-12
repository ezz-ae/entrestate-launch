
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full mt-24 py-8 border-t border-gray-800 text-center">
      <div className="flex justify-center gap-8 mb-4">
        <Link href="#" className="text-gray-400 hover:text-white">
          Twitter
        </Link>
        <Link href="#" className="text-gray-400 hover:text-white">
          Discord
        </Link>
        <Link href="#" className="text-gray-400 hover:text-white">
          GitHub
        </Link>
      </div>
      <p className="text-gray-500">&copy; {new Date().getFullYear()} NanoGPT. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
