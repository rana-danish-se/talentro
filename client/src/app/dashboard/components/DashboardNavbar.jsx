'use client';

import { Home, Users, Bell, Briefcase, MessageSquare, Sparkles, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const DashboardNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'My Network', href: '/dashboard/network', icon: Users },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Messaging', href: '/dashboard/messaging', icon: MessageSquare },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (href) => pathname === href;

  return (
    <nav className="px-6 md:px-10 py-3 border-b border-purple-500/20 sticky top-0 backdrop-blur-xl z-50 shadow-lg shadow-purple-500/5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/assets/logo.png"
            width={180}
            height={180}
            alt="Talentro Logo"
            className="w-32 md:w-40 h-auto"
          />
        </Link>

        <div className="hidden lg:flex items-center justify-center gap-2">
          <ul className="flex gap-1 items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 group relative ${
                      active 
                        ? 'bg-purple-100 dark:bg-purple-900/30' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon 
                      className={`w-6 h-6 mb-1 transition-colors duration-300 ${
                        active 
                          ? 'text-purple-600 dark:text-purple-400' 
                          : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                      }`} 
                    />
                    <span className={`text-xs font-medium transition-colors duration-300 ${
                      active 
                        ? 'text-purple-600 dark:text-purple-400 font-semibold' 
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                    }`}>
                      {item.name}
                    </span>
                    {/* {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )} */}
                  </Link>
                </li>
              );
            })}

            {/* Me Profile Section */}
            <li>
              <Link
                href="/dashboard/profile"
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 group relative ${
                  isActive('/dashboard/profile')
                    ? 'bg-purple-100 dark:bg-purple-900/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-full mb-1 overflow-hidden border-2 transition-colors duration-300 ${
                  isActive('/dashboard/profile')
                    ? 'border-purple-600 dark:border-purple-400'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-purple-600 dark:group-hover:border-purple-400'
                }`}>
                  <Image
                    src="/assets/default-avatar.jpg"
                    width={28}
                    height={28}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  isActive('/dashboard/profile')
                    ? 'text-purple-600 dark:text-purple-400 font-semibold' 
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                }`}>
                  Me
                </span>
              </Link>
            </li>
          </ul>

          {/* Separator */}
          <div className="h-12 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

          {/* Premium CTA */}
          <Link href="/premium">
            <motion.button
              className="px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4" />
              Try Premium
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
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
            <ul className="flex flex-col gap-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${
                        active 
                          ? 'bg-purple-100 dark:bg-purple-900/30' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${
                        active 
                          ? 'text-purple-600 dark:text-purple-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        active 
                          ? 'text-purple-600 dark:text-purple-400 font-semibold' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {item.name}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}

              {/* Me Profile - Mobile */}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${
                    isActive('/dashboard/profile')
                      ? 'bg-purple-100 dark:bg-purple-900/30' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-purple-600">
                    <Image
                      src="/assets/default-avatar.jpg"
                      width={24}
                      height={24}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`font-medium ${
                    isActive('/dashboard/profile')
                      ? 'text-purple-600 dark:text-purple-400 font-semibold' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Me
                  </span>
                </Link>
              </motion.li>
            </ul>

            {/* Premium CTA - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4"
            >
              <Link href="/premium" onClick={() => setIsOpen(false)}>
                <motion.button
                  className="w-full px-5 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-5 h-5" />
                  Try Premium
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default DashboardNavbar;