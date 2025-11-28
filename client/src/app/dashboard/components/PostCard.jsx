import React, { useState } from 'react';
import { ThumbsUp, Heart, Award, HandHeart, Lightbulb, Laugh, MessageCircle, Share2, Repeat2, MoreHorizontal, Send, Globe, Users, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// PostCard Component
const PostCard = ({ post, user }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [visibleComments, setVisibleComments] = useState(1);
  const [localReactions, setLocalReactions] = useState(post.reactionsCount);

  const reactions = [
    { type: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-500' },
    { type: 'love', icon: Heart, label: 'Love', color: 'text-red-500' },
    { type: 'celebrate', icon: Award, label: 'Celebrate', color: 'text-green-500' },
    { type: 'support', icon: HandHeart, label: 'Support', color: 'text-purple-500' },
    { type: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-yellow-500' },
    { type: 'funny', icon: Laugh, label: 'Funny', color: 'text-orange-500' }
  ];

  const handleReaction = (reactionType) => {
    if (userReaction === reactionType) {
      setUserReaction(null);
      setLocalReactions(prev => ({
        ...prev,
        [reactionType]: Math.max(0, prev[reactionType] - 1)
      }));
    } else {
      // Add new reaction (or switch reaction)
      if (userReaction) {
        setLocalReactions(prev => ({
          ...prev,
          [userReaction]: Math.max(0, prev[userReaction] - 1),
          [reactionType]: prev[reactionType] + 1
        }));
      } else {
        setLocalReactions(prev => ({
          ...prev,
          [reactionType]: prev[reactionType] + 1
        }));
      }
      setUserReaction(reactionType);
    }
    setShowReactions(false);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        authorId: user._id,
        author: user,
        content: commentText,
        likesCount: 0,
        repliesCount: 0,
        createdAt: new Date()
      };
      setComments([newComment, ...comments]);
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  const loadMoreComments = () => {
    setVisibleComments(prev => Math.min(prev + 10, comments.length));
  };

  const getTimeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}w`;
  };

  const totalReactions = Object.values(localReactions).reduce((a, b) => a + b, 0);
  const currentReaction = reactions.find(r => r.type === userReaction);

  const getVisibilityIcon = () => {
    if (post.visibility === 'public') return <Globe className="w-3 h-3" />;
    if (post.visibility === 'connections') return <Users className="w-3 h-3" />;
    return <Lock className="w-3 h-3" />;
  };

  return (
    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm mb-4">
      {/* Post Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <img
              src={post.author.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
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
          </div>
          <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-neutral-500" />
          </button>
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
          {post.content.media[0].type === 'image' ? (
            <div className={`grid gap-1 ${
              post.content.media.length === 1 ? 'grid-cols-1' :
              post.content.media.length === 2 ? 'grid-cols-2' :
              post.content.media.length === 3 ? 'grid-cols-3' :
              'grid-cols-2'
            }`}>
              {post.content.media.map((media, index) => (
                <img
                  key={index}
                  src={media.url}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-auto max-h-96 object-cover"
                />
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
                    <div key={reaction.type} className={`w-5 h-5 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center border border-neutral-200 dark:border-neutral-700`}>
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
      <div className="px-4 py-2 grid grid-cols-4 gap-2">
        <div className="relative">
          <motion.button
            onHoverStart={() => setShowReactions(true)}
            onHoverEnd={() => setTimeout(() => setShowReactions(false), 300)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all ${
              userReaction ? currentReaction.color : 'text-neutral-600 dark:text-neutral-400'
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
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-neutral-800 rounded-full shadow-xl border border-neutral-200 dark:border-neutral-700 px-3 py-2 flex gap-2 z-10"
              >
                {reactions.map((reaction) => {
                  const Icon = reaction.icon;
                  return (
                    <motion.button
                      key={reaction.type}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReaction(reaction.type)}
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
          <Repeat2 className="w-5 h-5" />
          <span className="font-medium">Repost</span>
        </button>

        <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-neutral-600 dark:text-neutral-400">
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comment Input */}
      {showCommentInput && (
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex gap-3">
            <img
              src={user.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      {comments.length > 0 && (
        <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 space-y-4">
          {comments.slice(0, visibleComments).map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment.author.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={comment.author.fullName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">
                      {comment.author.fullName}
                    </h4>
                    <span className="text-xs text-neutral-500">
                      {getTimeSince(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1">
                    {comment.author.headline}
                  </p>
                  <p className="text-sm text-neutral-900 dark:text-white mt-2">
                    {comment.content}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-1 ml-4">
                  <button className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-purple-600">
                    Like
                  </button>
                  <button className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-purple-600">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}

          {comments.length > visibleComments && (
            <button
              onClick={loadMoreComments}
              className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
            >
              Load more comments ({comments.length - visibleComments} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default PostCard;