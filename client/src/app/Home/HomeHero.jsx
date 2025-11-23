'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Sparkles, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const HomeHero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://my.spline.design/chips-fXxyJFnMGeXHdCAaigkw5lyT/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="pointer-events-none"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center py-8 px-6 md:px-10">
        <div className="max-w-5xl mx-auto text-center ">          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white">Join 50,000+ Skill Learners Worldwide</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-[5vw] mt-5 font-bold text-foreground leading-tight"
          >
            Learn Skills,
            <span className="gradient-text ">Teach Others,</span>
            <br />
            Grow Together.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground mt-5 max-w-3xl mx-auto leading-relaxed"
          >
            Connect with people worldwide to exchange skills, knowledge, and expertise. 
            Pay with money, trade skills, or use a hybrid approach.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col mt-5 sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup">
              <motion.button
                className="w-full cursor-pointer uppercase sm:w-auto px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-md font-semibold bg-primary text-primary-foreground hover:bg-primary-hover transition-all shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started 
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>

            <Link href="/explore">
              <motion.button
                className="w-full cursor-pointer uppercase sm:w-auto px-6 py-3 rounded-lg flex items-center justify-center gap-2 text-md font-semibold bg-card/50 text-foreground border border-border hover:bg-card transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Skills
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Brain className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;