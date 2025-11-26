"use client";
import { Edit2, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const ProfileAbout = () => {
  const [aboutContent, setAboutContent] =
    useState(`𝘞𝘰𝘯𝘥𝘦𝘳𝘴 𝘪𝘯 𝘭𝘪𝘧𝘦, 𝘌𝘹𝘤𝘦𝘭𝘭𝘪𝘯𝘨 𝘭𝘪𝘨𝘩𝘵𝘴! 𝘓𝘢𝘣𝘰𝘳𝘪𝘰𝘶𝘴 𝘥𝘢𝘺𝘴 𝘚𝘰𝘣𝘣𝘪𝘯𝘨 𝘯𝘪𝘨𝘩𝘵𝘴! 𝘛𝘰 𝘮𝘢𝘬𝘦 𝘢 𝘥𝘪𝘧𝘧𝘦𝘳𝘦𝘯𝘤𝘦, 𝘓𝘦𝘵'𝘴 𝘊𝘰𝘯𝘲𝘶𝘦𝘳 𝘩𝘦𝘪𝘨𝘩𝘵𝘴!

I cordially welcome you! This is Ayesha Javed, a software engineering student at CUI, who is a Python/AI developer and Web Developer. I am off to Artificial Intelligence. I aspire to learn Machine Learning and Artificial Intelligence.

**𝐏𝐲𝐭𝐡𝐨𝐧:** Data structures, methods, OOP, File handling, functional programming, Exception handling, Database connectivity(MySql and sqlite3), API handling(Request), JSON data, git and GitHub, data manipulation(numpy, pandas), GUI(Tkinter), Advance Data structures, Web Scraping (Beautiful Soup, Selenium) and automation. I have also learned Google technologies. (GCP and Firebase)

**𝐖𝐞𝐛 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐦𝐞𝐧𝐭:** I build robust backend solutions using Python Flask, ensuring seamless server-side functionality. For the frontend, I craft responsive and interactive interfaces with HTML, CSS, and JavaScript.

**𝐏𝐫𝐨𝐠𝐫𝐚𝐦𝐬 𝐚𝐧𝐝 𝐏𝐫𝐨𝐣𝐞𝐜𝐭𝐬:** From a simple hangman game, Tik-Tak-Toe to an Event management program, banking database project, GUI grading system, snake game, and GUI sqlite3 Project of Hostel Management and Full stack Solution 𝐒𝐨𝐥𝐚𝐢𝐞𝐥 𝐄𝐧𝐞𝐫𝐠𝐲 submitted to 𝐆𝐨𝐨𝐠𝐥𝐞 𝐒𝐨𝐥𝐮𝐭𝐢𝐨𝐧 𝐂𝐡𝐚𝐥𝐥𝐞𝐧𝐠𝐞 𝟐𝟎𝟐𝟓.

**𝐥𝐞𝐚𝐫𝐧𝐢𝐧𝐠:** Machine Learning and Artificial Intelligence.

**Freelancing:** I am working on AI projects.

*𝘛𝘩𝘦 𝘩𝘢𝘳𝘥𝘦𝘳 𝘵𝘩𝘦 𝘣𝘢𝘵𝘵𝘭𝘦, 𝘵𝘩𝘦 𝘴𝘸𝘦𝘦𝘵𝘦𝘳 𝘵𝘩𝘦 𝘷𝘪𝘤𝘵𝘰𝘳𝘺!*`);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempContent, setTempContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEditClick = () => {
    setTempContent(aboutContent);
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setAboutContent(tempContent);
    setIsEditModalOpen(false);
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
              className="text-purple-500 hover:text-purple-400  font-medium text-sm flex cursor-pointer gap-1 transition-colors"
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
                  className="text-gray-400 hover:text-white p-2 hover:bg-neutral-800 rounded-full transition-all"
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
                  className="px-6 py-2 bg-neutral-800 text-gray-300 rounded-lg hover:bg-neutral-700 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
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
