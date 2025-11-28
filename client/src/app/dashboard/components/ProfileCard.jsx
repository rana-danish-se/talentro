import React from 'react';
import { CheckCircle, Bookmark, Users, Mail, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ProfileCard = ({ user }) => {
  const menuItems = [
    { icon: Bookmark, label: 'Saved items', path: '/saved' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: Mail, label: 'Newsletters', path: '/newsletters' },
    { icon: Calendar, label: 'Events', path: '/events' }
  ];

  return (
    <div className="w-full sticky top-30  max-w-sm space-y-4">
      {/* Main Profile Card */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-16 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 relative">
          <Image
            src="https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=100&fit=crop"
            alt="Banner"
            className="w-full h-full object-cover"
            width={400}
            height={100}
          />
          {/* Profile Picture */}
          <div className="absolute -bottom-10 left-4">
            <div className="w-20 h-20 rounded-full border-4 border-white dark:border-neutral-950 overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500">
              <Image
                src={user?.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={user?.fullName}
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-12 px-4 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {user?.fullName || 'Rana Danish'}
            </h2>
            <CheckCircle className="w-5 h-5 text-blue-500" fill="currentColor" />
          </div>
          
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
            {user?.headline || 'Freelance MERN Stack Developer | Java + DSA + Python | Open to...'}
          </p>
          
          <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-3">
            {user?.location || 'Lahore, Punjab'}
          </p>

          {/* Company */}
          {user?.currentCompany && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white dark:text-neutral-900 text-xs font-bold">IT</span>
              </div>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 line-clamp-2">
                {user?.currentCompany || 'Inventix Technologies (pvt.) Limited'}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="space-y-3 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900 -mx-4 px-4 py-2 cursor-pointer transition-colors rounded">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Profile viewers</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {user?.profileViewers || '42'}
              </span>
            </div>
            <div className="flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900 -mx-4 px-4 py-2 cursor-pointer transition-colors rounded">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Post impressions</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {user?.postImpressions || '27'}
              </span>
            </div>
          </div>

          {/* Premium CTA */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 cursor-pointer"
          >
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
              Achieve your career goals
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">★</span>
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                Don't miss: Premium for PKR0
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Menu Card */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={index}
                href={item.path}
                whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                className="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
};



export default ProfileCard;