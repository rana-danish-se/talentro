"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ThumbsUp,
  Heart,
  Award,
  HandHeart,
  Lightbulb,
  Laugh,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  Users,
  Lock,
  Bookmark,
  Flag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { usePost } from "@/context/PostContext";
import Image from "next/image";
import Link from "next/link";
import Comments from "./Comments";

// PostCard Component
const PostCard = ({ post, user }) => {
  const { likePost, toggleSavePost, checkIfSaved } = usePost();

  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState(post.userReaction || null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [localReactions, setLocalReactions] = useState(post.reactionsCount);
  const [showMenu, setShowMenu] = useState(false);

  const reactionTimeoutRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (post._id) {
        const result = await checkIfSaved(post._id);
        setIsSaved(result.isSaved);
      }
    };
    checkSavedStatus();
  }, [post._id, checkIfSaved]);

  useEffect(() => {
    setLocalReactions(post.reactionsCount);
  }, [post.reactionsCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleSave = async () => {
    try {
      const response = await toggleSavePost(post._id);
      if (response.success) {
        setIsSaved(response.isSaved);
        setShowMenu(false);
      }
    } catch (error) {
      console.error("Failed to toggle save post", error);
    }
  };

  const reactions = [
    { type: "like", icon: ThumbsUp, label: "Like", color: "text-blue-500" },
    { type: "love", icon: Heart, label: "Love", color: "text-red-500" },
    {
      type: "celebrate",
      icon: Award,
      label: "Celebrate",
      color: "text-green-500",
    },
    {
      type: "support",
      icon: HandHeart,
      label: "Support",
      color: "text-purple-500",
    },
    {
      type: "insightful",
      icon: Lightbulb,
      label: "Insightful",
      color: "text-yellow-500",
    },
    { type: "funny", icon: Laugh, label: "Funny", color: "text-orange-500" },
  ];

  const handleReaction = async (reactionType) => {
    const previousReaction = userReaction;
    const previousCounts = { ...localReactions };

    if (userReaction === reactionType) {
      setUserReaction(null);
      setLocalReactions((prev) => ({
        ...prev,
        [reactionType]: Math.max(0, prev[reactionType] - 1),
      }));
    } else {
      if (userReaction) {
        setLocalReactions((prev) => ({
          ...prev,
          [userReaction]: Math.max(0, prev[userReaction] - 1),
          [reactionType]: prev[reactionType] + 1,
        }));
      } else {
        setLocalReactions((prev) => ({
          ...prev,
          [reactionType]: prev[reactionType] + 1,
        }));
      }
      setUserReaction(reactionType);
    }
    setShowReactions(false);

    // API Call
    try {
      await likePost(post._id, reactionType);
    } catch (error) {
      // Revert on error
      setUserReaction(previousReaction);
      setLocalReactions(previousCounts);
    }
  };

  const handleLikeClick = () => {
    handleReaction("like");
  };

  const handleMouseEnter = () => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
    }
    setShowReactions(true);
  };

  const handleMouseLeave = () => {
    reactionTimeoutRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 500);
  };

  const getTimeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}w`;
  };

  const totalReactions = Object.values(localReactions).reduce(
    (a, b) => a + b,
    0
  );
  const currentReaction = reactions.find((r) => r.type === userReaction);

  const getVisibilityIcon = () => {
    if (post.visibility === "public") return <Globe className="w-3 h-3" />;
    if (post.visibility === "connections") return <Users className="w-3 h-3" />;
    return <Lock className="w-3 h-3" />;
  };

  return (
    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm mb-4">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <Link
            href={`/dashboard/profile/${post.author.slug}`}
            className="flex gap-3"
          >
            <Image
              width={48}
              height={48}
              src={post.author.profilePicture || "/assets/default-avatar.jpg"}
              alt={post.author.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                {post.author.fullName}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1">
                {post.author.headline}
              </p>
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                <span>{getTimeSince(post.createdAt)}</span>
                <span>•</span>
                {getVisibilityIcon()}
              </div>
            </div>
          </Link>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
            >
              <MoreHorizontal className="w-5 h-5 text-neutral-500" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-20"
                >
                  <button
                    onClick={handleToggleSave}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                    />
                    {isSaved ? "Unsave Post" : "Save Post"}
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Flag className="w-4 h-4" />
                    Report Post
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Post Content */}
        <div className="mt-4">
          <p className="text-neutral-900 dark:text-white whitespace-pre-wrap">
            {post.content.text}
          </p>
        </div>
      </div>

      {/* Post Media */}
      {post.content.media && post.content.media.length > 0 && (
        <div className="w-full">
          {post.content.media[0].type === "image" ? (
            <div
              className={`grid gap-1 ${
                post.content.media.length === 1
                  ? "grid-cols-1"
                  : post.content.media.length === 2
                  ? "grid-cols-2"
                  : post.content.media.length === 3
                  ? "grid-cols-3"
                  : "grid-cols-2"
              }`}
            >
              {post.content.media.map((media, index) => (
                <div key={index} className="w-full relative aspect-square bg-neutral-100 dark:bg-neutral-900 animate-pulse-light">
                  <img
                    src={media.url}
                    alt={`Post media ${index + 1}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <video
              src={post.content.media[0].url}
              controls
              className="w-full max-h-[500px] bg-black"
            />
          )}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-3 flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          {totalReactions > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                {reactions.slice(0, 3).map((reaction) => {
                  const Icon = reaction.icon;
                  return localReactions[reaction.type] > 0 ? (
                    <div
                      key={reaction.type}
                      className={`w-5 h-5 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center border border-neutral-200 dark:border-neutral-700`}
                    >
                      <Icon className={`w-3 h-3 ${reaction.color}`} />
                    </div>
                  ) : null;
                })}
              </div>
              <span>{totalReactions}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {post.commentsCount > 0 && <span>{post.commentsCount} comments</span>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 grid grid-cols-3 gap-2">
        <div className="relative">
          <motion.button
            onHoverStart={handleMouseEnter}
            onHoverEnd={handleMouseLeave}
            onClick={handleLikeClick}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all ${
              userReaction
                ? currentReaction.color
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            {currentReaction ? (
              <>
                <currentReaction.icon className="w-5 h-5" />
                <span className="font-medium">{currentReaction.label}</span>
              </>
            ) : (
              <>
                <ThumbsUp className="w-5 h-5" />
                <span className="font-medium">Like</span>
              </>
            )}
          </motion.button>

          {/* Reactions Popup */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-neutral-800 rounded-full shadow-xl border border-neutral-200 dark:border-neutral-700 px-3 py-2 flex gap-2 z-10"
              >
                {reactions.map((reaction) => {
                  const Icon = reaction.icon;
                  return (
                    <motion.button
                      key={reaction.type}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReaction(reaction.type);
                      }}
                      className={`p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 ${reaction.color}`}
                      title={reaction.label}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setShowCommentInput(!showCommentInput)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-neutral-600 dark:text-neutral-400"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">Comment</span>
        </button>

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-neutral-600 dark:text-neutral-400">
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      <Comments
        post={post}
        user={user}
        showInput={showCommentInput}
        onInputToggle={setShowCommentInput}
      />
    </div>
  );
};
export default PostCard;
