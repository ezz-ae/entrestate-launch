
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="p-4 flex justify-between items-center">
      <Link href="/nano-gpt">
        <Image
          src="https://ik.imagekit.io/nanogpt/logo.png?tr=w-64,h-64"
          alt="NanoGPT Logo"
          width={40}
          height={40}
        />
      </Link>
      <nav className="flex gap-4">
        <Link href="#" className="text-white hover:text-cyan-400">
          Models
        </Link>
        <Link href="#" className="text-white hover:text-cyan-400">
          Pricing
        </Link>
        <Link href="#" className="text-white hover:text-cyan-400">
          Docs
        </Link>
        <Link href="#" className="text-white hover:text-cyan-400">
          Blog
        </Link>
      </nav>
    </header>
  );
};

export default Header;
