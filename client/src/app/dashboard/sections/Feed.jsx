// Feed Component
import React, { useState } from "react";
import {
  ThumbsUp,
  Heart,
  Award,
  HandHeart,
  Lightbulb,
  Laugh,
  MessageCircle,
  Share2,
  Repeat2,
  MoreHorizontal,
  Send,
  Globe,
  Users,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../components/PostCard";
import { usePost } from "@/context/PostContext";
import { useProfile } from "@/context/ProfileContext";

const Feed = () => {
  const [sortBy, setSortBy] = useState("recent");
  const { feedPosts, loading } = usePost();
  const { profile } = useProfile();

  const currentUser = profile
    ? {
        _id: profile.userId,
        fullName: `${profile.firstName} ${profile.lastName}`,
        headline: profile.headline,
        profilePicture: profile.profileImage,
      }
    : null;

  const sortedPosts = [...feedPosts].sort((a, b) => {
    if (sortBy === "top") {
      const engagementA = (a.likesCount || 0) + (a.commentsCount || 0);
      const engagementB = (b.likesCount || 0) + (b.commentsCount || 0);
      return engagementB - engagementA;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Sort Options */}
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Sort by:
          </span>
          <button
            onClick={() => setSortBy("recent")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === "recent"
                ? "bg-purple-600 text-white"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setSortBy("top")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === "top"
                ? "bg-purple-600 text-white"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            Top
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <PostCard key={post._id} post={post} user={currentUser} />
        ))
      ) : (
        <div className="text-center py-10 text-neutral-500">
          No posts found. Connect with people to see their updates!
        </div>
      )}
    </div>
  );
};

export default Feed;
