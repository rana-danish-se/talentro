import React, { useState, useRef, useEffect } from "react";
import {
  Smile,
  Image as ImageIcon,
  Video,
  X,
  Sparkles,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/context/ProfileContext";
import { usePost } from "@/context/PostContext";
import Image from "next/image";

const PostCreation = () => {
  const { profile } = useProfile();
  const { createPost, loading } = usePost();
  const [profileImage, setProfileImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Separate refs for different input types
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const emojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "🎉",
    "🔥",
    "💯",
    "🚀",
    "💪",
    "🙌",
    "👏",
    "✨",
    "🎯",
    "💡",
    "🌟",
    "⚡",
  ];

  useEffect(() => {
    if (profile) {
      setProfileImage(profile?.profileImage);
    }
  }, [profile]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPostContent("");
    setMediaType(null);
    setMediaFiles([]);
  };

  const handleMediaClick = (type) => {
    // If switching media type, clear previous files
    if (mediaType && mediaType !== type) {
      setMediaFiles([]);
    }
    setMediaType(type);

    // Ensure modal is open
    if (!isModalOpen) {
      setIsModalOpen(true);
    }

    // Trigger specific input click
    if (type === "image") {
      imageInputRef.current?.click();
    } else if (type === "video") {
      videoInputRef.current?.click();
    }
  };

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (type === "image") {
      // Max 4 images
      const currentCount = mediaFiles.length;
      const remainingSlots = 4 - currentCount;
      const newFiles = files.slice(0, remainingSlots).map((file) => ({
        file,
        url: URL.createObjectURL(file),
        type: "image",
      }));
      setMediaFiles([...mediaFiles, ...newFiles]);
    } else if (type === "video") {
      // Only 1 video
      const videoFile = files[0];
      if (videoFile) {
        setMediaFiles([
          {
            file: videoFile,
            url: URL.createObjectURL(videoFile),
            type: "video",
          },
        ]);
      }
    }

    // Reset input value to allow selecting same file again if needed
    e.target.value = "";
  };

  const handleRemoveMedia = (index) => {
    const newMediaFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(newMediaFiles);
    if (newMediaFiles.length === 0) {
      setMediaType(null);
    }
  };

  const handleEmojiClick = (emoji) => {
    setPostContent(postContent + emoji);
    setShowEmojiPicker(false);
  };

  const handleRewriteWithAI = () => {
    alert(
      "AI Rewrite feature - This would integrate with an AI service to rewrite the content"
    );
  };

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("text", postContent);
      formData.append("visibility", "public");

      mediaFiles.forEach((fileObj) => {
        formData.append("media", fileObj.file);
      });

      await createPost(formData);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <>
      {/* Hidden File Inputs - Always mounted */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e, "image")}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => handleFileSelect(e, "video")}
        className="hidden"
      />

      <section className="max-w-2xl mx-auto bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500 flex-shrink-0">
            <Image
              width={50}
              height={50}
              src={`${
                profileImage
                  ? profileImage
                  : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
              }`}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleOpenModal}
            className="flex-1 px-5 py-3.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full text-left text-neutral-600 dark:text-neutral-400 transition-all cursor-pointer"
          >
            Start a post
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleMediaClick("video")}
            className="flex items-center bg-white/10 cursor-pointer  justify-center gap-2 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
              <Video className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="font-medium text-neutral-700 dark:text-neutral-300 text-sm">
              Video
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleMediaClick("image")}
            className="flex items-center bg-white/10 cursor-pointer justify-center gap-2 px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-medium text-neutral-700 dark:text-neutral-300 text-sm">
              Photo
            </span>
          </motion.button>
        </div>
      </section>

      {/* Post Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="border-b border-neutral-200 dark:border-neutral-700 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Create a post
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-500">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      John Doe
                    </p>
                    <select className="text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1 mt-1">
                      <option value="public">Public</option>
                      <option value="connections">Connections only</option>
                      <option value="group">Group only</option>
                    </select>
                  </div>
                </div>

                {/* Text Area */}
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What do you want to talk about?"
                  maxLength={3000}
                  className="w-full min-h-[150px] p-4 text-neutral-900 dark:text-white bg-transparent border-none outline-none resize-none text-lg"
                />

                {/* Character Count */}
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-right mb-4">
                  {postContent.length}/3000
                </p>

                {/* Media Preview */}
                {mediaFiles.length > 0 && (
                  <div className="mb-4">
                    {mediaType === "image" ? (
                      <div
                        className={`grid gap-2 ${
                          mediaFiles.length === 1
                            ? "grid-cols-1"
                            : mediaFiles.length === 2
                            ? "grid-cols-2"
                            : "grid-cols-2"
                        }`}
                      >
                        {mediaFiles.map((media, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={media.url}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => handleRemoveMedia(index)}
                              className="absolute top-2 right-2 p-1.5 bg-neutral-900/80 hover:bg-neutral-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="relative group">
                        <video
                          src={mediaFiles[0].url}
                          controls
                          className="w-full max-h-96 rounded-lg bg-black"
                        />
                        <button
                          onClick={() => handleRemoveMedia(0)}
                          className="absolute top-2 right-2 p-1.5 bg-neutral-900/80 hover:bg-neutral-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="mb-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <div className="grid grid-cols-8 gap-2">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          onClick={() => handleEmojiClick(emoji)}
                          className="text-2xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 px-6 py-4">
                {/* Action Icons */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMediaClick("image")}
                      disabled={mediaType === "video"}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Add photos (max 4)"
                    >
                      <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button
                      onClick={() => handleMediaClick("video")}
                      disabled={mediaType === "image"}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Add video (max 1)"
                    >
                      <Video className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </button>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                      title="Add emoji"
                    >
                      <Smile className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </button>
                  </div>

                  <button
                    onClick={handleRewriteWithAI}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 rounded-lg transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Rewrite with AI
                    </span>
                  </button>
                </div>

                {/* Post Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePost}
                  disabled={
                    (!postContent.trim() && mediaFiles.length === 0) || loading
                  }
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {loading ? "Posting..." : "Post"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostCreation;
