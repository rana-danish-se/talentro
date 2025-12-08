'use client';

import { ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'PRICING', href: '/pricing' },
    { name: 'PEOPLE', href: '/people' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="px-6 md:px-10 py-4 border-b-2 border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/assets/logo.png"
            width={180}
            height={180}
            alt="Talentro Logo"
            className="w-36 md:w-48 h-auto"
          />
        </Link>

        <div className="hidden lg:flex items-center justify-center gap-10">
          <ul className="flex gap-8 text-sm font-medium items-center justify-center">
            {navItems.map((item) => (
              <li key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="cursor-pointer transition-colors duration-300 hover:text-primary"
                >
                  {item.name}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                </Link>
              </li>
            ))}
          </ul>
          
          <Link href="/feedback">
            <motion.button
              className="px-5 py-3 rounded-md flex items-center cursor-pointer justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-all"
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(168, 85, 247, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              Feedback 
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Menu className="w-6 h-6 text-foreground" />
          )}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden mt-4 pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col gap-4 text-sm font-medium">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative overflow-hidden"
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 px-4 rounded-md hover:bg-muted transition-colors relative group"
                  >
                    {item.name}
                    <motion.span
                      className="absolute bottom-0 left-4 h-0.5 bg-primary"
                      initial={{ width: 0 }}
                      whileHover={{ width: 'calc(100% - 2rem)' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <Link href="/feedback" onClick={() => setIsOpen(false)}>
                <motion.button
                  className="w-full px-5 py-3 rounded-md flex items-center cursor-pointer justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground"
                  whileTap={{ scale: 0.95 }}
                >
                  Feedback
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;