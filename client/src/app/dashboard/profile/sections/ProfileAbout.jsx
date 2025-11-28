"use client";
import { Edit2, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { useProfile } from "@/context/ProfileContext";

const ProfileAbout = () => {
  const { profile, updateAbout } = useProfile();
  const [aboutContent, setAboutContent] = useState("");

  useEffect(() => {
    if (profile?.about) {
      setAboutContent(profile.about);
    } else if (profile) {
      setAboutContent("No about info added yet.");
    }
  }, [profile]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempContent, setTempContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEditClick = () => {
    setTempContent(aboutContent);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    const result = await updateAbout({ about: tempContent });
    if (result.success) {
      setIsEditModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <section className="max-w-4xl bg-neutral-950 shadow-2xl my-10 border-neutral-700 border p-10 mx-auto rounded-xl overflow-hidden mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-semibold text-purple-500">
            About
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEditClick}
            className="text-purple-500 cursor-pointer p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full transition-all"
          >
            <Edit2 className="w-5 h-5" />
          </motion.button>
        </div>

        <article className="mt-10 relative">
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : "100px" }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden prose prose-invert prose-purple max-w-none"
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <p className="mb-4 text-gray-300">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="text-purple-400 font-semibold">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="text-purple-300">{children}</em>
                ),
              }}
            >
              {aboutContent}
            </ReactMarkdown>
          </motion.div>

          <div
            className={`mt-2 flex justify-start ${
              !isExpanded
                ? "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950 to-transparent pt-10"
                : ""
            }`}
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-500 hover:text-purple-400  cursor-pointer font-medium text-sm flex cursor-pointer gap-1 transition-colors"
            >
              {isExpanded ? "See Less" : "See More"}
            </button>
          </div>
        </article>
      </section>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-700">
                <h3 className="text-2xl font-semibold text-purple-500">
                  Edit About
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 cursor-pointer hover:text-white p-2 hover:bg-neutral-800 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <textarea
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  className="w-full h-96 bg-neutral-950 border border-neutral-700 rounded-lg p-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                  placeholder="Write your about section here... (Markdown supported)"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Tip: You can use Markdown formatting (e.g., **bold**,
                  *italic*)
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-700">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="px-6 py-2 cursor-pointer bg-neutral-800 text-gray-300 rounded-lg hover:bg-neutral-700 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-6 py-2 cursor-pointer bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProfileAbout;
