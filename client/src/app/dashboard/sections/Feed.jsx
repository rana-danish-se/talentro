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
const Feed = () => {
  const [sortBy, setSortBy] = useState("recent");

  // Sample user data
  const currentUser = {
    _id: "1",
    fullName: "John Doe",
    headline: "Full Stack Developer | MERN Stack",
    profilePicture:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
  };

  // Sample posts data
  const [posts, setPosts] = useState([
    {
      _id: "1",
      author: {
        _id: "2",
        fullName: "Haseeb Shah",
        headline:
          "Founder of Social Doodle | Building Brands with Design & Digital Strategy",
        profilePicture:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      },
      content: {
        text: 'Most freelancers think proposal writing is about "impressing" the client. Honestly... it\'s not.',
        media: [
          {
            type: "image",
            url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
          },
        ],
      },
      visibility: "public",
      postType: "regular",
      likesCount: 197,
      commentsCount: 151,
      reactionsCount: {
        like: 120,
        love: 45,
        celebrate: 20,
        support: 8,
        insightful: 4,
        funny: 0,
      },
      comments: [
        {
          id: 1,
          authorId: "3",
          author: {
            fullName: "Muhammad Abdullah",
            headline: "Senior Software Engineer at Microsoft",
            profilePicture:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
          },
          content: "This is so true! Great insight on proposal writing.",
          likesCount: 12,
          repliesCount: 2,
          createdAt: new Date(Date.now() - 3600000),
        },
      ],
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      _id: "2",
      author: {
        _id: "4",
        fullName: "Sarah Johnson",
        headline: "Product Designer | UI/UX Specialist",
        profilePicture:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      },
      content: {
        text: "Just launched our new design system! 🎉 It took 6 months of collaboration with amazing teams. Grateful for everyone who contributed.",
        media: [],
      },
      visibility: "public",
      postType: "achievement",
      likesCount: 342,
      commentsCount: 87,
      reactionsCount: {
        like: 200,
        love: 50,
        celebrate: 80,
        support: 10,
        insightful: 2,
        funny: 0,
      },
      comments: [],
      createdAt: new Date(Date.now() - 10800000),
    },
  ]);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "top") {
      const engagementA = a.likesCount + a.commentsCount;
      const engagementB = b.likesCount + b.commentsCount;
      return engagementB - engagementA;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

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
      {sortedPosts.map((post) => (
        <PostCard key={post._id} post={post} user={currentUser} />
      ))}
    </div>
  );
};

export default Feed;
