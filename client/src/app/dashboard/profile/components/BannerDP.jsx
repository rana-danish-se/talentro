"use client"
import React, { useState, useRef } from 'react';
import { Pencil, Upload, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BannerDP = () => {
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop');
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const bannerInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setIsModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProfile = () => {
    setProfileImage('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop');
    setIsModalOpen(false);
  };

  const handleUploadNewProfile = () => {
    profileInputRef.current?.click();
  };

  return (
    <>
      <div className="w-full  rounded-lg shadow-md overflow-hidden">
        {/* Banner Section */}
        <div className="relative w-full h-[200px] bg-gradient-to-r from-purple-500 to-blue-500">
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          
          {/* Edit Banner Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBannerClick}
            className="absolute top-4 right-4 bg-white/10 cursor-pointer p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all"
            title="Edit banner"
          >
            <Pencil className="w-5 h-5 text-white" />
          </motion.button>

          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            className="hidden"
          />
        </div>

        {/* Profile Picture Section */}
        <div className="relative px-6 pb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative -mt-20 w-[160px] h-[160px] rounded-full border-4 border-white dark:border-gray-800 shadow-xl cursor-pointer group"
            onClick={handleProfileClick}
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Pencil className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        </div>
      </div>


      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Photo</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Current Profile Image */}
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg">
                  <img
                    src={profileImage}
                    alt="Current Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUploadNewProfile}
                  className="w-fit  flex items-center justify-center gap-3 px-4 py-2 cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <Upload className="w-5 h-5" />
                  Upload New Photo
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteProfile}
                  className="w-fit flex items-center justify-center gap-3 px-4 py-2 mb-2 cursor-pointer bg-white/10 text-white rounded-lg font-medium shadow-lg hover:bg-red-600 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>

              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileChange}
                className="hidden"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BannerDP;