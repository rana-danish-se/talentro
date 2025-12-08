import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CTA = () => {
  return (
    <section className="w-full m-10 max-w-3xl mx-auto rounded-xl min-h-[300px] relative overflow-hidden flex items-center justify-center p-10">
      {/* Purple Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-purple-900/40"></div>
      
      {/* Purple Glow Effects */}
      <div className="absolute top-0 left-0 w-76 h-76 bg-purple-500/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 w-76 h-76 bg-purple-600/20 rounded-full blur-[100px]"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl  font-bold text-white leading-tight mb-6">
          Start Learning & Teaching <br className="hidden md:block" />
          Skills Today
        </h2>
        
        <p className="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
          Join our community and exchange skills with people around the world
        </p>
        
        <Link href='/signup' className="group w-fit px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto cursor-pointer hover:scale-105">
          Get Started for Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </section>
  );
};

export default CTA;